import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import type { FileAnalysis, SecurityIndicatorItem } from '../../../lib/analyzer/types';

interface SafetySectionProps {
  analysis: FileAnalysis;
}

const INDICATOR_STYLE: Record<SecurityIndicatorItem['type'], { row: string; icon: React.ReactNode }> = {
  info: {
    row: 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
  },
  caution: {
    row: 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
  },
  warning: {
    row: 'bg-orange-50/60 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
    icon: <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />,
  },
  danger: {
    row: 'bg-red-50/60 dark:bg-red-950/40 border-red-200 dark:border-red-800',
    icon: <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />,
  },
};

export const SafetySection: React.FC<SafetySectionProps> = ({ analysis }) => {
  const [copiedMd5, setCopiedMd5] = useState(false);
  const { security, diagnostics } = analysis;

  const copyMd5 = () => {
    if (!diagnostics.md5Hash) return;
    navigator.clipboard.writeText(diagnostics.md5Hash);
    setCopiedMd5(true);
    setTimeout(() => setCopiedMd5(false), 2000);
  };

  return (
    <section
      id="security"
      className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <span>Safety & Integrity</span>
      </h2>

      {/* Indicators */}
      {security.indicators.length > 0 ? (
        <div className="space-y-3">
          {security.indicators.map((ind) => {
            const style = INDICATOR_STYLE[ind.type];
            return (
              <div key={ind.id} className={`p-4 rounded-2xl border flex items-start gap-3 ${style.row}`}>
                {style.icon}
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{ind.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No security signals were raised for this file — nothing about its binary content, entropy or
          structure looks suspicious.
        </p>
      )}

      {/* Entropy */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
        <p className="text-xs font-bold text-slate-900 dark:text-white">
          Byte entropy:{' '}
          <span className="font-mono">
            {diagnostics.entropy !== undefined ? diagnostics.entropy.toFixed(2) : 'not computed'} / 8.00
          </span>
        </p>
        <p className="text-xs text-slate-500 leading-relaxed">
          Entropy measures how random a file's bytes look. Plain text scores around 4–5; compressed,
          encrypted or packed data scores above 7.5. It is one signal among many — not a verdict on its
          own.
        </p>
      </div>

      {/* Hashes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">SHA-256</span>
          </div>
          <p className="font-bold text-emerald-400 break-all select-all">
            {diagnostics.sha256Hash ?? 'not computed'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">MD5</span>
            {diagnostics.md5Hash && (
              <button
                onClick={copyMd5}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedMd5 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMd5 ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <p className="font-bold text-slate-300 break-all select-all">
            {diagnostics.md5Hash ?? 'not computed'}
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Use these fingerprints to verify a download against a publisher's published checksum, or to
        confirm two files are byte-identical.
      </p>
    </section>
  );
};
