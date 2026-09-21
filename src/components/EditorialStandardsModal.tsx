import React from 'react';
import { X, ShieldCheck, CheckCircle2, Server, Scale, Clock, AlertCircle, Mail, ExternalLink } from 'lucide-react';
import { EDITORIAL_PRINCIPLES, EDITORIAL_TEAM } from '../lib/content/editorialTeam';
import { AppRoute } from '../types';

interface EditorialStandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: AppRoute) => void;
}

export const EditorialStandardsModal: React.FC<EditorialStandardsModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      id="editorial-standards-modal-backdrop"
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-900 dark:text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="editorial-standards-modal-dialog"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Editorial Integrity & Verification Protocols</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              How AnyFileX Tests, Verifies & Audits Technical Guides
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Our 5-pillar editorial methodology governing 250+ file format specifications and opening walkthroughs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close standards modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Key Statement */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 border border-blue-200 dark:border-blue-900/60 space-y-2">
            <h4 className="font-bold text-sm sm:text-base text-blue-900 dark:text-blue-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Real Engineers. Verified Testbeds. Zero Commercial Payola.
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              AnyFileX content is strictly authored and peer-reviewed by credentialed systems architects, digital media codec engineers, and certified security researchers. Every command, registry tweak, and software recommendation is verified in clean-snapshot virtual environments before publication.
            </p>
          </div>

          {/* 5 Pillars */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              The 5 Pillars of AnyFileX Editorial Standards
            </h4>
            <div className="space-y-4">
              {EDITORIAL_PRINCIPLES.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      {pillar.headline}
                    </h5>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    {pillar.description}
                  </p>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pl-8 pt-1 flex items-center gap-1.5">
                    <span className="font-bold text-blue-600 dark:text-blue-400">Verification Protocol:</span>
                    <span>{pillar.verificationMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testbed Environment Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-500" />
              Active Physical & Virtualized Laboratory Testbeds
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="font-bold text-slate-900 dark:text-white">Windows Workstations</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">Windows 11 Pro 23H2 & 24H2 Clean Installs (64-bit x86 & ARM64)</div>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="font-bold text-slate-900 dark:text-white">Apple macOS Testbeds</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">macOS Sonoma (14.6) & macOS Sequoia (15.0) Apple Silicon (M1/M2/M3)</div>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="font-bold text-slate-900 dark:text-white">Linux Forensic Nodes</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">Ubuntu 24.04 LTS (Noble Numbat) & Fedora 40 Workstation</div>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="font-bold text-slate-900 dark:text-white">Mobile Devices</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">Apple iOS 17.6 & 18.0 / Android 14 & 15 (Stock & One UI)</div>
              </div>
            </div>
          </div>

          {/* Errata & Corrections Reporting */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              Public Errata & Technical Correction Policy
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If an operating system update modifies a default file association, or if you identify a discrepancy in a magic byte offset table or terminal command, our Technical Review Board investigates all reported errata within 48 hours.
            </p>
            <div className="pt-2 text-xs font-mono text-blue-600 dark:text-blue-400">
              Submit reports to: <a href="mailto:editorial@anyfilex.com" className="underline font-bold">editorial@anyfilex.com</a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-4">
          {onNavigate ? (
            <button
              onClick={() => {
                onClose();
                onNavigate({ view: 'authors' } as any);
              }}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Meet the Technical Review Board & Authors</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          ) : (
            <span className="text-xs text-slate-500">AnyFileX Editorial Integrity Protocol</span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
