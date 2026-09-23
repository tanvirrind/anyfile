import React from 'react';
import { Wrench, ShieldAlert, CheckCircle, AlertOctagon, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { REPAIR_GUIDES } from '../data/repairData';
import { AppRoute, RepairGuide } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { FAQAccordion } from '../components/FAQAccordion';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';

interface RepairPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedRepairId?: string;
}

export const RepairPage: React.FC<RepairPageProps> = ({ onNavigate, selectedRepairId }) => {
  // If selectedRepairId is provided, render individual guide
  if (selectedRepairId) {
    const guide = REPAIR_GUIDES.find((r) => r.id === selectedRepairId) || REPAIR_GUIDES[0];

    return (
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
        <SEOHead
          title={`${guide.title} – Corrupt .${guide.extension} Recovery`}
          description={`Step-by-step tutorial on repairing corrupted .${guide.extension} files. Fix truncated headers, CRC errors, and broken data streams.`}
          canonicalPath={`/repair/${guide.id}`}
        />
        <Breadcrumb
          items={[
            { label: 'Repair Center', route: { view: 'repair' } },
            { label: guide.title },
          ]}
          onNavigate={onNavigate}
        />

        {/* Hero */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="amber">{guide.category} Repair</Badge>
            <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded-lg">
              .{guide.extension}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            {guide.title}
          </h1>
        </div>

        {/* Symptoms & Causes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-500" />
              <span>Common Symptoms</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {guide.symptoms.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2"></span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>Root Causes</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {guide.causes.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2"></span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Repair Methods */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Step-by-Step Repair Methods</h2>
          <div className="space-y-4">
            {guide.repairMethods.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">Method {idx + 1}: {m.title}</h4>
                  <Badge variant="amber">{m.difficulty}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preventive Tips */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Preventive Best Practices</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {guide.preventiveTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        {guide.faqs && <FAQAccordion faqs={guide.faqs} />}
      </div>
    );
  }

  // Directory View
  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <SEOHead
        title="Corrupt File Repair Guides & Diagnostic Utilities"
        description="Step-by-step diagnostic workflows, header reconstruction, and data recovery tutorials for corrupted PDFs, ZIPs, images, and video archives."
        canonicalPath="/repair"
      />
      <Breadcrumb items={[{ label: 'Repair Center' }]} onNavigate={onNavigate} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="amber" size="md">File Repair Center</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Repair Corrupted & Broken Files
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Troubleshoot CRC checksum errors, truncated headers, missing frames, and unreadable archives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REPAIR_GUIDES.map((guide) => (
          <div
            key={guide.id}
            onClick={() => onNavigate({ view: 'repair-detail', id: guide.id })}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
            id={`repair-card-${guide.id}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="amber">{guide.category}</Badge>
                <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                  .{guide.extension}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {guide.symptoms[0]}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>View Repair Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
