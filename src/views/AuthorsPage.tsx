'use client';

import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import { SmartLink } from '../components/SmartLink';

interface AuthorsPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedAuthorId?: string;
}

export const AuthorsPage: React.FC<AuthorsPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="Author – AnyFileX"
        description="AnyFileX is written and maintained by Tanveer Hussain. Format guides are researched from official specifications, standards documents, and vendor documentation."
        canonicalPath="/authors"
      />
      <Breadcrumb
        items={[
          { label: 'About', route: { view: 'about' } },
          { label: 'Author' }
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">About the Author</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
          Written by Tanveer Hussain
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Every file format breakdown, binary header diagram, and diagnostic tutorial on AnyFileX is written and maintained by one person, researched from official format specifications, standards documents, and vendor documentation.
        </p>
      </div>

      {/* Editorial Pledge */}
      <div className="bg-gradient-to-r from-blue-900/10 via-slate-900/5 to-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>The AnyFileX Quality & Independence Pledge</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Researched from Official Sources • No Sponsored Placements
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We do not rely on anonymous internet summaries or generic marketing text. Guides are based on official ISO/IETF specifications, IANA registries, and vendor documentation, and the numbers published on this site are counted from its own registries.
          </p>
        </div>
        <SmartLink
          route={{ view: 'editorial-standards' } as any}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shrink-0 shadow-sm flex items-center gap-2"
        >          <span>Read Editorial Standards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </SmartLink>
      </div>

      {/* Featured author profile */}
      <section className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 dark:border-blue-900/60 dark:bg-blue-950/20 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/tanveer-hussain.png"
              alt="Tanveer Hussain"
              className="h-20 w-20 shrink-0 rounded-2xl object-cover border border-blue-200 shadow-sm dark:border-blue-800"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Featured author</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Tanveer Hussain</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Web systems, digital file formats, and practical technical guidance</p>
            </div>
          </div>
          <SmartLink
            route={{ view: 'authors', authorId: 'tanveer-hussain' } as any}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            <span>View author profile</span>
            <ArrowRight className="h-4 w-4" />
          </SmartLink>
        </div>
      </section>
    </div>
  );
};
