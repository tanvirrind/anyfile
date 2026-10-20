'use client';

import React from 'react';
import { ShieldCheck, Server, Mail, ExternalLink, Award } from 'lucide-react';
import { EDITORIAL_PRINCIPLES } from '../lib/content/editorialTeam';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import { SmartLink } from '../components/SmartLink';

interface EditorialStandardsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const EditorialStandardsPage: React.FC<EditorialStandardsPageProps> = ({ onNavigate }) => {

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="Editorial Standards & Verification Protocols – AnyFileX"
        description="Review AnyFileX editorial principles, the official sources guides are researched from, and our zero-payola software recommendation policy."
        canonicalPath="/editorial-standards"
      />
      <Breadcrumb
        items={[
          { label: 'About', route: { view: 'about' } },
          { label: 'Editorial Standards & Integrity' }
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">Editorial Standards & Integrity Policy</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
          Engineered for Absolute Technical Accuracy
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          How AnyFileX researches and maintains its database of 354 digital file format guides — and the sources every guide is checked against.
        </p>
      </div>

      {/* Core Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero Commercial Payola</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Software recommendations are never bought or paid for. We evaluate tools strictly on format fidelity, system stability, clean installer behavior, and zero malware or bundled bloatware.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Researched from Official Sources</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Format facts, magic byte signatures, and MIME types are taken from official specifications, standards documents (ISO/IEC, IETF RFC, IANA), and vendor documentation — and cited on the guide where applicable.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">One Named Author</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            AnyFileX is written and maintained by Tanveer Hussain. There is no review board and no credential theater — just sources you can check yourself, cited on the page.
          </p>
        </div>
      </div>

      {/* The 5 Editorial Pillars */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
            The 5 Pillars of AnyFileX Editorial Policy
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Our framework for keeping guides accurate, sourced, and honest.
          </p>
        </div>

        <div className="space-y-4">
          {EDITORIAL_PRINCIPLES.map((principle, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                  {principle.pillar}
                </h3>
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 pl-11">
                {principle.headline}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-11">
                {principle.description}
              </p>
              <div className="pl-11 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white">Verification Standard: </span>
                  {principle.verificationMethod}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About the Author */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Written & Maintained by Tanveer Hussain
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            AnyFileX has a single named author. Read more about who writes the guides and how the site is run.
          </p>
        </div>
        <SmartLink
          route={{ view: 'authors' } as any}
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
        >            <span>About the Author</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </SmartLink>
      </div>

      {/* Errata & Feedback Policy */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Public Errata Protocol</span>
        </div>
        <h3 className="text-2xl font-bold font-heading">
          Help Us Maintain Flawless Technical Standards
        </h3>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          File formats evolve constantly as operating systems update their native file associations, image decoders, and command-line interfaces. If you discover an outdated registry path, altered software command, or standard correction in any guide:
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="mailto:editorial@anyfilex.com"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Email Errata: editorial@anyfilex.com</span>
          </a>
          <span className="text-xs text-slate-400">
            Every report is checked against the source documentation, and confirmed errors are corrected.
          </span>
        </div>
      </div>

    </div>
  );
};
