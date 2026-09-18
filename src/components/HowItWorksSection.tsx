import React from 'react';
import { Search, BookOpenCheck, Download, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      stepNumber: '1',
      title: 'Search a file extension',
      description: 'Enter any extension like .heic, .dwg, or .dat into the search box, or drop your unknown file directly onto our inspector.',
      icon: Search,
      badgeColor: 'bg-blue-600 text-white',
      accentBorder: 'border-blue-500',
    },
    {
      stepNumber: '2',
      title: 'Learn how to open it',
      description: 'Get immediate answers about the format, magic byte signatures, MIME types, danger/security rating, and repair walkthroughs.',
      icon: BookOpenCheck,
      badgeColor: 'bg-emerald-600 text-white',
      accentBorder: 'border-emerald-500',
    },
    {
      stepNumber: '3',
      title: 'Use recommended software',
      description: 'Download verified free, open-source, or native software for Windows, macOS, Linux, iOS, and Android to open or convert the file.',
      icon: Download,
      badgeColor: 'bg-violet-600 text-white',
      accentBorder: 'border-violet-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
            How AnyFileX Works
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            From unknown file prompt to full clarity in less than 5 seconds.
          </p>
        </div>

        {/* 3 Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 relative flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl transition-all"
                id={`how-it-works-step-${step.stepNumber}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-10 h-10 rounded-xl ${step.badgeColor} font-heading font-extrabold text-lg flex items-center justify-center shadow-md`}>
                      {step.stepNumber}
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {idx < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs text-slate-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
