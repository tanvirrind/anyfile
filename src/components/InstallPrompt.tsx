'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

export type InstallPromptSlot = 'identifier' | 'tools-hub';

/** Name of the window event fired when a file analysis completes. */
export const ANALYSIS_COMPLETE_EVENT = 'anyfilex:analysis-complete';

const DISMISS_KEY = 'anyfilex-install-dismissed';
const SHOWN_KEY_PREFIX = 'anyfilex-install-shown-';
const ANALYSIS_FLAG = 'anyfilex-analysis-just-completed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * Module-level capture of beforeinstallprompt. Registered on import (i.e. at
 * page-chunk load, well before the component mounts), so the event is never
 * missed even if Chrome fires it early in the page lifecycle.
 */
let capturedInstallEvent: BeforeInstallPromptEvent | null = null;
const installEventListeners: Array<() => void> = [];

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    capturedInstallEvent = e as BeforeInstallPromptEvent;
    installEventListeners.forEach((fn) => fn());
  });
}

function onInstallEventAvailable(fn: () => void): () => void {
  installEventListeners.push(fn);
  if (capturedInstallEvent) fn();
  return () => {
    const i = installEventListeners.indexOf(fn);
    if (i >= 0) installEventListeners.splice(i, 1);
  };
}

/**
 * Call from the file-identifier flow when an analysis completes successfully.
 * Sets a one-shot flag (survives the navigation to the result page) and fires
 * a window event (covers same-page listeners).
 */
export function notifyAnalysisComplete(): void {
  try {
    window.sessionStorage.setItem(ANALYSIS_FLAG, '1');
  } catch {
    /* storage unavailable — the event path still works */
  }
  try {
    window.dispatchEvent(new Event(ANALYSIS_COMPLETE_EVENT));
  } catch {
    /* no-op */
  }
}

function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/**
 * Contextual PWA install nudge. Renders only where mounted, and only mounts
 * on the file-identifier result page (slot "identifier", after a successful
 * analysis) and the tools hub (slot "tools-hub"). NEVER on SEO content pages.
 */
export function InstallPrompt({ slot }: { slot: InstallPromptSlot }) {
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const shownKey = SHOWN_KEY_PREFIX + slot;

  const markShown = useCallback(() => {
    try {
      localStorage.setItem(shownKey, '1');
    } catch {
      /* no-op */
    }
  }, [shownKey]);

  const markDismissed = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* no-op */
    }
  }, []);

  const canShow = useCallback((): boolean => {
    try {
      if (localStorage.getItem(DISMISS_KEY) || localStorage.getItem(shownKey)) return false;
    } catch {
      return false;
    }
    return !isStandalone();
  }, [shownKey]);

  const tryShow = useCallback(() => {
    if (!canShow()) return;
    if (capturedInstallEvent) {
      setIsIos(false);
      setVisible(true);
      markShown();
    } else if (isIosDevice()) {
      setIsIos(true);
      setVisible(true);
      markShown();
    }
    // Otherwise (non-iOS, no install event): nothing installable to offer.
  }, [canShow, markShown]);

  useEffect(() => {
    // If beforeinstallprompt arrives late (after the trigger fired), retry.
    const off = onInstallEventAvailable(() => tryShow());

    if (slot === 'identifier') {
      // Analysis completed before this mounted (the common case: the uploader
      // navigates to the result page right after analysis).
      let consumed = false;
      try {
        consumed = window.sessionStorage.getItem(ANALYSIS_FLAG) === '1';
        if (consumed) window.sessionStorage.removeItem(ANALYSIS_FLAG);
      } catch {
        consumed = false;
      }
      if (consumed) {
        tryShow();
      } else {
        // Same-page case (analysis without navigation).
        const onAnalysis = () => tryShow();
        window.addEventListener(ANALYSIS_COMPLETE_EVENT, onAnalysis);
        return () => {
          window.removeEventListener(ANALYSIS_COMPLETE_EVENT, onAnalysis);
          off();
        };
      }
      return off;
    }

    // tools-hub: a single tasteful nudge shortly after page load.
    const timer = window.setTimeout(tryShow, 1500);
    return () => {
      window.clearTimeout(timer);
      off();
    };
  }, [slot, tryShow]);

  const handleInstall = useCallback(async () => {
    const ev = capturedInstallEvent;
    if (ev) {
      try {
        await ev.prompt();
      } catch {
        /* no-op */
      }
    }
    markShown();
    markDismissed();
    setVisible(false);
  }, [markShown, markDismissed]);

  const handleDismiss = useCallback(() => {
    markDismissed();
    setVisible(false);
  }, [markDismissed]);

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-4 sm:p-5">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
          {isIos ? <Share className="w-5 h-5" /> : <Download className="w-5 h-5" />}
        </div>
        <div className="space-y-1 pr-8">
          <p className="font-bold text-sm text-slate-900 dark:text-white">
            {isIos ? 'Add AnyFileX to your Home Screen' : 'Install AnyFileX as an app'}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {isIos
              ? 'Tap Share below, then \u201cAdd to Home Screen\u201d for one-tap file identification.'
              : 'Home-screen icon, instant loads, works offline \u2014 the full toolset, no app store.'}
          </p>
          {!isIos && (
            <button
              type="button"
              onClick={handleInstall}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Install AnyFileX
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
