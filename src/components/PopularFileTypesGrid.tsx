'use client';

import React, { useState } from 'react';
import { ArrowRight, Layers, ShieldCheck, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { FileTypeInfo } from '../types';
import { POPULAR_FILE_TYPES } from '../data/fileTypesData';

interface PopularFileTypesGridProps {
  onSelectExtension: (ext: string) => void;
}

export const PopularFileTypesGrid: React.FC<PopularFileTypesGridProps> = ({ onSelectExtension }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Images', 'CAD & 3D', 'Documents', 'Archives', 'Code & Data'];

  const filteredItems = activeCategory === 'All'
    ? POPULAR_FILE_TYPES
    : POPULAR_FILE_TYPES.filter((item) => item.category === activeCategory);

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60" id="popular-extensions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Format Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular File Extensions
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Click any extension card to inspect software options, step-by-step opening guides, and safety checks.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Extensions Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const topApp = item.popularApps[0]?.name || item.exampleUse;
            return (
              <div
                key={item.extension}
                onClick={() => onSelectExtension(item.extension)}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                id={`file-type-card-${item.extension.toLowerCase()}`}
              >
                <div>
                  {/* Extension Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-extrabold text-lg px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                      .{item.extension}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Section with Example App & Open CTA */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
                      Primary Software
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                      {topApp}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectExtension(item.extension);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
