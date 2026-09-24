'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, GraduationCap, BookOpen, CheckCircle2, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { EDITORIAL_TEAM, AuthorQualification } from '../lib/content/editorialTeam';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import { AuthorModal } from '../components/AuthorModal';

interface AuthorsPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedAuthorId?: string;
}

export const AuthorsPage: React.FC<AuthorsPageProps> = ({ onNavigate, selectedAuthorId }) => {
  const initialAuthor = selectedAuthorId ? EDITORIAL_TEAM.find(a => a.id === selectedAuthorId) || null : null;
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorQualification | null>(initialAuthor);

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="Technical Review Board & Author Qualifications – AnyFileX"
        description="Meet the systems architects, digital media codec engineers, and certified security researchers authoring and peer-reviewing AnyFileX technical format guides."
        canonicalPath="/authors"
      />
      <Breadcrumb
        items={[
          { label: 'About', route: { view: 'about' } },
          { label: 'Technical Authors & Review Board' }
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">Editorial Governance & Technical Authority</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
          AnyFileX Technical Review Board
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Every file format breakdown, binary header diagram, and diagnostic tutorial on AnyFileX is created and peer-reviewed by credentialed engineers with verified academic and industry certifications.
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
            Dual Peer-Reviewed • No Ghostwriters • No Sponsored Placements
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We do not rely on anonymous internet summaries or generic marketing text. Our authors conduct original hex dumps, read official ISO/IETF specifications, and test file associations on active physical operating systems.
          </p>
        </div>
        <button
          onClick={() => onNavigate({ view: 'editorial-standards' } as any)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shrink-0 shadow-sm flex items-center gap-2"
        >
          <span>Read Editorial Standards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
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
          <Link
            href="/authors/tanveer-hussain"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            <span>View author profile</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Author Directory Grid */}
      <div className="space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Contributing Systems Engineers & Specialists
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse full qualifications, degrees, professional certifications, and format areas of expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EDITORIAL_TEAM.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
            >
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
                        {member.credentials}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {member.role}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{member.editorialRole}</span>
                    </div>
                  </div>
                </div>

                {/* Biography */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {member.bio}
                </p>

                {/* Education */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                    <span>Education:</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {member.education}
                  </div>
                </div>

                {/* Certifications & Bodies */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-500" />
                    <span>Key Certifications & Standards:</span>
                  </div>
                  <ul className="space-y-1">
                    {member.certifications.slice(0, 2).map((cert, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specializations Tags */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Core Technical Domains:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.areasOfExpertise.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedAuthor(member)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>View Full Profile & Independence Disclosure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
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
