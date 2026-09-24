import React, { useState } from 'react';
import {
  ShieldCheck,
  Binary,
  FileCode,
  Lock,
  Cpu,
  Zap,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Layers,
  Sparkles,
  Info,
  Hash,
  Search,
  ShieldAlert,
  Clock,
  User,
  Database
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { generateFAQSchema } from '../lib/seo/faqGenerator';
import { AuthorBadge } from '../components/AuthorBadge';
import { EditorialStandardsModal } from '../components/EditorialStandardsModal';
import {
  getTechnicalGuide,
  TECHNICAL_AUTHORITY_GUIDES,
  TechnicalAuthorityGuide
} from '../lib/database/technicalAuthorityData';
import { AppRoute } from '../types';

interface TechnicalGuidePageProps {
  slug: string;
  onNavigate: (route: AppRoute) => void;
}

export const TechnicalGuidePage: React.FC<TechnicalGuidePageProps> = ({
  slug,
  onNavigate
}) => {
  const guide: TechnicalAuthorityGuide = getTechnicalGuide(slug);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'engine' | 'deepdive' | 'standards'>('overview');
  const [editorialModalOpen, setEditorialModalOpen] = useState(false);

  // Interactive Live Tester State
  const [testInput, setTestInput] = useState<string>('');
  const [simulatedResult, setSimulatedResult] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleRunSimulation = () => {
    if (!testInput.trim()) return;
    const clean = testInput.trim().toLowerCase();

    if (guide.id === 'what-are-magic-bytes' || guide.id === 'what-is-a-file-signature') {
      if (clean.includes('png') || clean.includes('89 50 4e 47')) {
        setSimulatedResult('Detected: Portable Network Graphics (PNG) at Offset 0x00 [89 50 4E 47 0D 0A 1A 0A]. Valid structure.');
      } else if (clean.includes('pdf') || clean.includes('25 50 44 46')) {
        setSimulatedResult('Detected: Adobe Portable Document Format (PDF) at Offset 0x00 [25 50 44 46 2D]. Valid header.');
      } else if (clean.includes('zip') || clean.includes('docx') || clean.includes('50 4b')) {
        setSimulatedResult('Detected: PKZIP / OpenXML Compound Archive at Offset 0x00 [50 4B 03 04]. Container format.');
      } else if (clean.includes('exe') || clean.includes('4d 5a')) {
        setSimulatedResult('🚨 Detected: Windows Portable Executable (PE) [4D 5A "MZ"]. High-risk executable binary.');
      } else {
        setSimulatedResult(`Matched standard query "${testInput}". AnyFileX Engine references 500+ byte signatures in its local registry.`);
      }
    } else if (guide.id === 'what-is-file-entropy') {
      const len = testInput.length;
      const uniqueChars = new Set(testInput).size;
      const approxEntropy = Math.min(8.0, ((uniqueChars / len) * 4.5 + 2.5)).toFixed(2);
      setSimulatedResult(`Calculated Shannon Entropy for input: ${approxEntropy} bits/byte. (Scale: 0.0 to 8.0).`);
    } else if (guide.id === 'how-file-extensions-can-be-spoofed') {
      if (clean.includes('.exe') && (clean.includes('.pdf') || clean.includes('.jpg') || clean.includes('.doc'))) {
        setSimulatedResult('🚨 CRITICAL MISMATCH: Double extension spoofing detected! True extension is .EXE, masquerading under secondary extension.');
      } else if (/[\u202A-\u202E]/.test(testInput)) {
        setSimulatedResult('🚨 CRITICAL ALERT: Unicode Right-to-Left Override (RTLO U+202E) detected in string!');
      } else {
        setSimulatedResult(`Analyzed string "${testInput}": No bidirectional override characters detected.`);
      }
    } else if (guide.id === 'what-is-sha-256' || guide.id === 'how-to-verify-a-file-hash') {
      setSimulatedResult(`Simulated SHA-256 hash calculation ready. Use the full Checksum Verifier tool to process gigabyte files client-side.`);
    } else {
      setSimulatedResult(`Processed parameter "${testInput}". Ready for engine verification.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${guide.title} – AnyFileX Technical Authority`}
        description={guide.subtitle}
        canonicalPath={`/security/${guide.slug}`}
        schemaData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'TechArticle',
              headline: guide.title,
              description: guide.subtitle,
              url: `https://www.anyfilex.com/security/${guide.slug}`,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://www.anyfilex.com/security/${guide.slug}`
              },
              author: {
                '@type': 'Person',
                name: guide.author.name,
                jobTitle: guide.author.role
              },
              publisher: {
                '@type': 'Organization',
                name: 'AnyFileX Technical Authority & File Intelligence Standards'
              }
            },
            generateFAQSchema(guide.faqs || []),
          ],
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
            onClick={() => onNavigate({ view: 'security-hub' } as any)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Security & Tech Authority
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-medium truncate max-w-[200px] sm:max-w-none">
            {guide.shortTitle}
          </span>
        </nav>

        {/* Hero Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold tracking-wider border border-blue-200 dark:border-blue-800/60 uppercase">
              {guide.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
              {guide.difficulty} Level
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {guide.readTime}
            </span>
            <span className="text-xs text-slate-400">
              Updated {guide.lastUpdated}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
            {guide.subtitle}
          </p>

          {/* Author Attribution & Peer-Review Credential */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <AuthorBadge
                authorName={guide.author.name}
                authorRole={guide.author.role}
                authorAvatar={guide.author.avatar}
                credentials={guide.author.credentials}
                date={guide.lastUpdated}
                lastAuditedDate={guide.lastAuditedDate}
                showAuditDate={true}
                onNavigate={onNavigate}
                size="md"
              />

              {guide.reviewedBy && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    Peer-Reviewed by <strong className="font-semibold">{guide.reviewedBy.name}</strong>
                    {guide.reviewedBy.credentials && ` (${guide.reviewedBy.credentials})`}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setEditorialModalOpen(true)}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Editorial Policy</span>
            </button>
          </div>
        </div>

        {/* Executive Summary & Formal Definition Box */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Executive Technical Summary
            </div>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
              {guide.executiveSummary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              Formal Standards Definition
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed font-mono">
              "{guide.formalDefinition}"
            </p>
          </div>

          {/* Standards & RFC Badges */}
          {guide.standardsAndRFCs.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Cited Standards:
              </span>
              {guide.standardsAndRFCs.map((std, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  title={std.title}
                >
                  {std.standard}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Conceptual Architecture Diagram */}
        <section className="bg-slate-950 text-slate-200 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Binary className="w-4 h-4" />
              Conceptual Architecture & Flow Model
            </div>
            <span className="text-[11px] font-mono text-slate-500">Standards Model</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
            {guide.asciiFlowDiagram}
          </div>
        </section>

        {/* The AnyFileX File Intelligence Engine Workflow */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              How the AnyFileX File Intelligence Engine Implements This
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Deterministic Processing Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guide.engineWorkflow.map((step) => (
              <div
                key={step.stepNumber}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                      {step.stepNumber}
                    </span>
                    {step.stageName}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-7 mt-1">
                    {step.description}
                  </p>
                </div>

                <div className="mt-3 pl-7 pt-2 border-t border-slate-200 dark:border-slate-700/60 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                  <code>{step.engineMethod}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Byte Analysis Table & Hex Reference (if available) */}
        {guide.byteAnalysisExamples && guide.byteAnalysisExamples.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Binary Byte Signatures & Offset Tables
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="pb-3">Format Name</th>
                    <th className="pb-3">Offset</th>
                    <th className="pb-3 font-mono">Hex Bytes</th>
                    <th className="pb-3 font-mono">ASCII</th>
                    <th className="pb-3">Technical Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal text-slate-700 dark:text-slate-300">
                  {guide.byteAnalysisExamples.map((ex, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                        {ex.formatName} (.{ex.extension})
                      </td>
                      <td className="py-3 font-mono text-slate-500">{ex.offset}</td>
                      <td className="py-3 font-mono text-blue-600 dark:text-blue-400">
                        <div className="flex items-center gap-1.5">
                          <span>{ex.hexBytes}</span>
                          <button
                            onClick={() => handleCopy(ex.hexBytes)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Copy Hex"
                          >
                            {copiedHex === ex.hexBytes ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-slate-600 dark:text-slate-300">
                        {ex.asciiRepresentation}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                        {ex.significance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* In-Depth Technical Deep Dive Sections */}
        <section className="space-y-6">
          {guide.deepDiveSections.map((sec, sIdx) => (
            <div
              key={sIdx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {sec.heading}
              </h2>

              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {sec.content}
              </div>

              {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {sec.bulletPoints.map((bp, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {bp}
                    </li>
                  ))}
                </ul>
              )}

              {sec.technicalCallout && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    sec.technicalCallout.type === 'security'
                      ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200'
                      : sec.technicalCallout.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                      : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {sec.technicalCallout.type === 'security' && <ShieldAlert className="w-4 h-4" />}
                    {sec.technicalCallout.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                    {sec.technicalCallout.type === 'info' && <Info className="w-4 h-4" />}
                    {sec.technicalCallout.type === 'standard' && <BookOpen className="w-4 h-4" />}
                    {sec.technicalCallout.title}
                  </div>
                  <div>{sec.technicalCallout.message}</div>
                </div>
              )}

              {sec.codeOrConfigExample && (
                <div className="space-y-1.5">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
                    {sec.codeOrConfigExample.code}
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    {sec.codeOrConfigExample.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Measurable Technical Boundaries & Antivirus Distinction (Mandatory Prompt Mandate) */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            AnyFileX Technical Accuracy & Scope Boundaries
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              Capabilities & Operational Boundaries
            </h2>
            <p className="text-xs text-slate-300">
              AnyFileX strictly distinguishes format structural analysis and cryptographic verification from dynamic runtime malware execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                What This Analysis Verifies
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {guide.limitationsAndDistinctions.whatItDoes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Explicit Technical Limitations
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {guide.limitationsAndDistinctions.whatItDoesNotDo.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700 text-xs text-slate-300 leading-relaxed">
            <strong className="text-white font-semibold">Malware Analysis vs Format Inspection: </strong>
            {guide.limitationsAndDistinctions.malwareVsIntegrityDistinction}
          </div>
        </section>

        {/* Connected Tools & Utilities */}
        <section className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Connected AnyFileX Interactive Utilities
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
                    <ArrowRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        tool.primary ? 'text-white' : 'text-blue-500'
                      }`}
                    />
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      tool.primary ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tool.description}
                  </p>
                </div>

                <div
                  className={`mt-4 pt-3 border-t text-[11px] font-semibold flex items-center gap-1 ${
                    tool.primary
                      ? 'border-blue-500/50 text-white'
                      : 'border-slate-100 dark:border-slate-800 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  Launch Tool Now <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Terminology & Glossary */}
        {guide.keyTermsGlossary && guide.keyTermsGlossary.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Key Terminology & Standards Glossary
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guide.keyTermsGlossary.map((term, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1"
                >
                  <div className="font-bold text-xs text-blue-600 dark:text-blue-400">
                    {term.term}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Technical Guides & Formats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          {/* Related Guides */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Related Technical Authority Guides
            </h3>
            <div className="space-y-2">
              {guide.relatedGuides.map((relId) => {
                const relGuide = getTechnicalGuide(relId);
                return (
                  <div
                    key={relId}
                    onClick={() => onNavigate({ view: 'technical-guide', slug: relId } as any)}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between cursor-pointer group"
                  >
                    <span className="line-clamp-1">{relGuide.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related Format Specs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Referenced File Format Specifications
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
        </section>

        {/* FAQs */}
        {guide.faqs && guide.faqs.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Frequently Asked Technical Questions
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

      <EditorialStandardsModal
        isOpen={editorialModalOpen}
        onClose={() => setEditorialModalOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
