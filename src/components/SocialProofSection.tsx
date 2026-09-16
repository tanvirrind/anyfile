import React from 'react';

export const SocialProofSection: React.FC = () => {
  const stats = [
    { value: '10,000+', label: 'File Types' },
    { value: '500+', label: 'Guides' },
    { value: '100+', label: 'Tools' },
    { value: 'Instant', label: 'Search' },
  ];

  return (
    <section className="bg-white dark:bg-slate-950 py-5 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center items-center gap-8 sm:gap-16">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white italic tracking-tight">
              {stat.value}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
