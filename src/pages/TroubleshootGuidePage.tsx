import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Terminal,
  Monitor,
  Apple,
  Cpu,
  FileText,
  Zap,
  RotateCw,
  Copy,
  Check,
  ExternalLink,
  Lock
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { DiagnosticDropzone } from '../components/DiagnosticDropzone';
import {
  getTroubleshootingGuide,
  TROUBLESHOOTING_GUIDES,
  TroubleshootingGuideItem
} from '../lib/database/troubleshootingData';
import { AppRoute } from '../types';

interface TroubleshootGuidePageProps {
  slug: string;
  onNavigate: (route: AppRoute) => void;
}

export const TroubleshootGuidePage: React.FC<TroubleshootGuidePageProps> = ({
  slug,
  onNavigate
}) => {
  const guide: TroubleshootingGuideItem = getTroubleshootingGuide(slug);
  const [activeOsTab, setActiveOsTab] = useState<string>(
    guide.osWorkflows.length > 0 ? guide.osWorkflows[0].os : 'windows'
  );
  const [copiedError, setCopiedError] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedError(text);
    setTimeout(() => setCopiedError(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${guide.title} – AnyFileX Diagnostic Guide`}
        description={guide.subtitle}
        canonicalPath={`/troubleshoot/${guide.id}`}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: guide.title,
          description: guide.subtitle,
          url: `https://www.anyfilex.com/troubleshoot/${guide.id}`,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.anyfilex.com/troubleshoot/${guide.id}`
          },
          author: {
            '@type': 'Organization',
            name: 'AnyFileX Technical Diagnostic Team'
          }
        }}
      />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={() => onNavigate({ view: 'home' })}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button
            onClick={() => onNavigate({ view: 'repair' })}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Troubleshooting Hub
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-medium truncate max-w-[200px] sm:max-w-none">
            {guide.title}
          </span>
        </nav>

        {/* Guide Hero Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200 dark:border-blue-800/60">
              {guide.category} Diagnostic
            </span>
            <span className="text-xs text-slate-400">
              Verified for Windows 11/10, macOS Sonoma, Linux & Mobile
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
            {guide.subtitle}
          </p>
        </div>

        {/* Live File Diagnostic Dropzone */}
        <section>
          <DiagnosticDropzone
            onNavigate={onNavigate}
            highlightedProblem={guide.title}
          />
        </section>

        {/* Problem Overview & Common Error Codes */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Problem Overview
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {guide.problemSummary}
            </p>
          </div>

          {/* Common Error Messages */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Recognized Error Messages & Dialogs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {guide.commonErrorMessages.map((msg, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 group"
                >
                  <span className="truncate pr-2">"{msg}"</span>
                  <button
                    onClick={() => handleCopy(msg)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 p-1"
                    title="Copy error message"
                  >
                    {copiedError === msg ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4-Stage Diagnostic Model */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              AnyFileX Intelligence Framework
            </div>
            <h2 className="text-xl font-bold text-white">
              The 4-Stage Diagnostic Resolution Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs">1</span>
                Problem
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {guide.diagnosticFlow.problemStatement}
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs">2</span>
                Analyze File
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {guide.diagnosticFlow.analysisTechnique}
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs">3</span>
                Identify Cause
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {guide.diagnosticFlow.identifiedRootCause}
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">4</span>
                Recommended Action
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {guide.diagnosticFlow.recommendedResolution}
              </p>
            </div>
          </div>
        </section>

        {/* Human-Readable Technical Breakdown: Why It Happens */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Why This Happens (Root Cause Analysis)
          </h2>

          <div className="space-y-4">
            {guide.whyItHappens.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {item.cause}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-4">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Confirm It */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            How to Confirm the Diagnosis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guide.howToConfirm.map((confirm, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {confirm.method}
                  </h3>
                  <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
                    {confirm.steps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  <strong>Look for:</strong> {confirm.whatToLookFor}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OS-Specific Resolution Workflows */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Step-by-Step Resolution Workflows
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your operating system to view tailored fix instructions.
              </p>
            </div>

            {/* OS Selection Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {guide.osWorkflows.map((flow) => (
                <button
                  key={flow.os}
                  onClick={() => setActiveOsTab(flow.os)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize flex items-center gap-1.5 ${
                    activeOsTab === flow.os
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {flow.os === 'windows' && <Monitor className="w-3.5 h-3.5" />}
                  {flow.os === 'mac' && <Apple className="w-3.5 h-3.5" />}
                  {flow.os === 'linux' && <Terminal className="w-3.5 h-3.5" />}
                  {flow.os === 'all' && <Cpu className="w-3.5 h-3.5" />}
                  {flow.os === 'all' ? 'Universal' : flow.os}
                </button>
              ))}
            </div>
          </div>

          {/* Active OS Workflow Card */}
          {guide.osWorkflows
            .filter((flow) => flow.os === activeOsTab || (guide.osWorkflows.length === 1 && flow.os === 'all'))
            .map((flow, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {flow.title}
                </h3>

                <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {flow.instructions.map((inst, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {iIdx + 1}
                      </span>
                      <span className="leading-relaxed">{inst}</span>
                    </li>
                  ))}
                </ol>

                {flow.tips && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-lg text-xs text-amber-900 dark:text-amber-200">
                    <strong>Pro Tip:</strong> {flow.tips}
                  </div>
                )}
              </div>
            ))}
        </section>

        {/* Measurable Security & Verification Standard (Crucial Prompt Mandate) */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            AnyFileX Measurable Diagnostic Statement
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white">
            Objective Integrity Assertions
          </h2>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {guide.measurableSecurityNotes.verifiedAspects.map((aspect, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{aspect}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 italic leading-relaxed">
            <strong className="text-slate-300 not-italic font-semibold">Security Distinction: </strong>
            {guide.measurableSecurityNotes.antivirusDistinction}
          </div>
        </section>

        {/* Connected AnyFileX Tools */}
        <section className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Connected AnyFileX Tools & Utilities
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {guide.connectedTools.map((tool, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate(tool.route as any)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  tool.primary
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-900 dark:text-slate-100'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{tool.name}</span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      tool.primary ? 'text-white' : 'text-blue-500'
                    }`} />
                  </div>
                  <p className={`text-xs leading-relaxed ${
                    tool.primary ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {tool.description}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t text-[11px] font-semibold flex items-center gap-1 ${
                  tool.primary ? 'border-blue-500/50 text-white' : 'border-slate-100 dark:border-slate-800 text-blue-600 dark:text-blue-400'
                }`}>
                  Launch Tool Now <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Formats & Troubleshooting Guides */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          {/* Related Formats */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Related File Format Specifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {guide.relatedExtensions.map((ext) => (
                <button
                  key={ext}
                  onClick={() => onNavigate({ view: 'extension-detail', ext })}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  .{ext} Specs
                </button>
              ))}
            </div>
          </div>

          {/* Related Guides */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Related Troubleshooting Guides
            </h3>
            <div className="space-y-2">
              {guide.relatedGuideIds.map((relId) => {
                const relGuide = getTroubleshootingGuide(relId);
                return (
                  <div
                    key={relId}
                    onClick={() => onNavigate({ view: 'repair-detail', id: relId })}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between cursor-pointer group"
                  >
                    <span className="line-clamp-1">{relGuide.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQs */}
        {guide.faqs && guide.faqs.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Frequently Asked Diagnostic Questions
            </h2>
            <div className="space-y-4">
              {guide.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
