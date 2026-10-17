import React from 'react';
import { Eye, EyeOff, MapPin, Eraser } from 'lucide-react';
import type { AppRoute } from '../../../types';
import type { PrivacyFinding } from '../../../lib/analyzer/privacyFindings';

interface PrivacySectionProps {
  findings: PrivacyFinding[];
  onNavigate: (route: AppRoute) => void;
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({ findings, onNavigate }) => (
  <section
    id="privacy"
    className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
      <Eye className="w-5 h-5 text-violet-600" />
      <span>Privacy Exposure</span>
    </h2>

    {findings.length === 0 ? (
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
        <EyeOff className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
            No location or device data found
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Nothing in this file reveals where it was taken or what device or software made it. Safe to
            share from a privacy standpoint.
          </p>
        </div>
      </div>
    ) : (
      <>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          The following personal traces were found embedded in this file's metadata:
        </p>
        <div className="space-y-3">
          {findings.map((finding) => (
            <div
              key={finding.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                finding.severity === 'caution'
                  ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <MapPin
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  finding.severity === 'caution' ? 'text-amber-600' : 'text-slate-400'
                }`}
              />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{finding.label}</p>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-300 break-all">
                  {finding.detail}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {finding.plainNote}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onNavigate({ view: 'remove-metadata' })}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-md"
        >
          <Eraser className="w-4 h-4" />
          <span>Strip This Metadata (in your browser)</span>
        </button>
      </>
    )}
  </section>
);
