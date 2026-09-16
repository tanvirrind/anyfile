import React from 'react';
import { BookOpen, Clock, ArrowRight, User, Sparkles } from 'lucide-react';
import { GuideInfo } from '../types';
import { GUIDES_DATA } from '../data/guidesData';

interface LatestGuidesSectionProps {
  onSelectGuide: (guide: GuideInfo) => void;
}

export const LatestGuidesSection: React.FC<LatestGuidesSectionProps> = ({ onSelectGuide }) => {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60" id="guides-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Knowledge Base & Tutorials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              Latest Technical Guides
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Comprehensive step-by-step walkthroughs written by systems architects and software engineers.
            </p>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES_DATA.map((guide) => (
            <div
              key={guide.id}
              onClick={() => onSelectGuide(guide)}
              className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              id={`guide-card-${guide.id}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                    {guide.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{guide.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {guide.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={guide.author.avatar}
                    alt={guide.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{guide.author.name}</div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400">{guide.date}</div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
