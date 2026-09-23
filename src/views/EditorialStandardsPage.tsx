'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Server, Scale, Clock, AlertCircle, Mail, BookOpen, ExternalLink, Award, FileCode } from 'lucide-react';
import { EDITORIAL_PRINCIPLES, EDITORIAL_TEAM, AuthorQualification } from '../lib/content/editorialTeam';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import { AuthorModal } from '../components/AuthorModal';

interface EditorialStandardsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const EditorialStandardsPage: React.FC<EditorialStandardsPageProps> = ({ onNavigate }) => {
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorQualification | null>(null);

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="Editorial Standards & Verification Protocols – AnyFileX"
        description="Review AnyFileX editorial principles, multi-OS virtualized testbed specifications, peer-review gates, and our zero-payola software recommendation policy."
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
          How AnyFileX researches, verifies on live testbeds, peer-reviews, and maintains our universal database of 250+ digital file format guides.
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Multi-OS Laboratory Testbeds</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Every step-by-step tutorial is validated across current production versions of Windows 11, macOS Sonoma/Sequoia, Ubuntu 24.04 LTS, iOS 18, and Android 15 before publication.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Credentialed Authors & Reviewers</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Content is researched and drafted by engineers holding Ph.D., P.E., CISSP, or M.Sc. qualifications, followed by mandatory secondary peer review by our Technical Review Board.
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
            Our systematic framework ensuring E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness).
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

      {/* Laboratory Testbeds Specifications */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
              AnyFileX Virtualized & Physical Laboratory Testbeds
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Operating environments actively used to verify shell commands, registry scripts, software behavior, and codec support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Microsoft Windows</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Windows 11 Enterprise</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Builds 23H2 & 24H2. Tested on x86-64 and Qualcomm Snapdragon X Elite (ARM64) architectures.
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Apple macOS</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">macOS Sonoma & Sequoia</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              macOS 14.6 & macOS 15.0 on M1/M2/M3 Apple Silicon hardware testbeds.
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">GNU / Linux</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Ubuntu 24.04 LTS & Fedora 40</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Kernel 6.8+ testing POSIX `file`, `hexdump`, `exiftool`, and FFmpeg multimedia demuxers.
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">Mobile Ecosystems</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">iOS 18 & Android 15</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Mobile camera container capture, cloud sync behavior, and native viewer compatibility.
            </div>
          </div>
        </div>
      </div>

      {/* Review Board Directory Preview */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
              Contributing Systems Architects & Specialists
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Click on any engineer to inspect their academic credentials, certifications, and conflict of interest disclosures.
            </p>
          </div>
          <button
            onClick={() => onNavigate({ view: 'authors' } as any)}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            <span>View Full Author Directory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EDITORIAL_TEAM.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedAuthor(member)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between cursor-pointer group shadow-xs hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:scale-105 transition-transform"
                  />
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
                    {member.credentials}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {member.role}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold">
                <span>View Full Qualifications</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
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
            Guaranteed technical review and response within 48 business hours.
          </span>
        </div>
      </div>

      <AuthorModal
        author={selectedAuthor}
        isOpen={Boolean(selectedAuthor)}
        onClose={() => setSelectedAuthor(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
