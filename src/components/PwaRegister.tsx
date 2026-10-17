'use client';

import { useEffect } from 'react';

/**
 * Registers the AnyFileX service worker once, in production only.
 * Registration failures (unsupported browser, preview builds) are non-fatal.
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // PWA support is optional enhancement — never break the page over it.
    });
  }, []);
  return null;
}
