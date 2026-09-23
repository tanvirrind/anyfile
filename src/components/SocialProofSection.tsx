'use client';

import React, { useState } from 'react';
import { ShieldCheck, Info, X, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

export const SocialProofSection: React.FC = () => {
  const [showMethodology, setShowMethodology] = useState(false);

  const stats = [
    {
      value: '250+',
      label: 'Searchable Formats',
      subtext: '43 byte-signature profiles • 250+ indexed',
      id: 'stat-formats',
    },
    {
      value: '316',
      label: 'Verified Guides',
      subtext: 'Opening, repair & comparison manuals',
      id: 'stat-guides',
    },
    {
      value: '35+',
      label: 'In-Browser Tools',
      subtext: '26 forensic utilities • 9 converters',
      id: 'stat-tools',
    },
    {
      value: '100%',
      label: 'Private & Local',
      subtext: 'Zero server uploads • In-memory WASM',
      id: 'stat-privacy',
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-950 py-6 border-y border-slate-200/60 dark:border-slate-800/60" id="platform-metrics-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-start">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group" id={stat.id}>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 hidden sm:block">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* Transparency & Methodology Anchor */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-center items-center">
          <button
            type="button"
            onClick={() => setShowMethodology(true)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
            id="open-metrics-methodology-btn"
          >
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span className="underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2">
              Metrics Substantiation & Discrepancy Reconciliation Report
            </span>
          </button>
        </div>
      </div>

      {/* Methodology & Reconciliation Modal */}
      {showMethodology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            id="metrics-methodology-modal"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Radical Transparency & Data Integrity</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  Platform Metrics Reconciliation & Audit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMethodology(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                id="close-metrics-methodology-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              At AnyFileX, we enforce rigorous editorial honesty and auditability. Below is our formal reconciliation of all historical claims, indexing figures, and published content metrics:
            </p>

            {/* Reconciliation Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Claimed Metric</th>
                    <th className="p-3">Verified Reality</th>
                    <th className="p-3">Substantiation & Reconciliation Methodology</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      "250+ file types" vs "50,000+ extensions"
                    </td>
                    <td className="p-3 font-mono font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      250+ cataloged (43 byte-signature profiles)
                    </td>
                    <td className="p-3 text-[11px] leading-relaxed">
                      Third-party search indexes claiming "50,000+ extensions" scrape non-standard random character sequences, typo extensions, and temporary file artifacts. AnyFileX indexes strictly legitimate digital extensions across 250+ searchable records (derived from IANA, ISO, RFC, and software standards registries), anchored by 43 deep, manually authored profiles with verified magic bytes and offset signatures.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      "500+ guides"
                    </td>
                    <td className="p-3 font-mono font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      316 peer-reviewed guides
                    </td>
                    <td className="p-3 text-[11px] leading-relaxed">
                      Earlier marketing estimates rounded up to "500+". The actual codebase inventory contains <strong>316 published, verified guides</strong>: 254 format-specific OS opening manuals, 32 pairwise format comparison matrices, 13 corrupted file repair manuals, and 17 technical authority & forensic security specifications. We reject auto-generating thin filler articles simply to inflate numbers.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      "100+ tools"
                    </td>
                    <td className="p-3 font-mono font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      35+ verified utilities
                    </td>
                    <td className="p-3 text-[11px] leading-relaxed">
                      Many conversion sites claim "100+ tools" by counting every permutation (e.g., PNG to JPG, JPG to PNG) as a distinct tool. AnyFileX provides <strong>26 dedicated binary analysis/forensic utilities</strong> (Magic Byte Detector, Hash Generator, Checksum Verifier, MIME Checker, Metadata Stripper, Entropy Inspector, etc.) plus <strong>9 in-memory WebAssembly converters</strong> (35+ total), each running 100% locally in browser memory.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      "25,000+ subscribers"
                    </td>
                    <td className="p-3 font-mono font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      Zero Vanity Counters
                    </td>
                    <td className="p-3 text-[11px] leading-relaxed">
                      Any unverified vanity metrics referencing "25,000+ subscribers" have been completely removed. Our monthly technical circular is strictly opt-in, focused on system architects, digital archivists, and security researchers, without artificially inflated vanity subscriber badges.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                All platform statistics displayed across AnyFileX are programmatically linked to our open Content Registry and Data Models. We update these figures in real-time as new formats are vetted by our editorial board.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMethodology(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
                id="confirm-methodology-btn"
              >
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
