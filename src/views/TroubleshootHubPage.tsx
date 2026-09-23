import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Search,
  AlertTriangle,
  HelpCircle,
  FileQuestion,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  FileText,
  Archive,
  Image as ImageIcon,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { DiagnosticDropzone } from '../components/DiagnosticDropzone';
import {
  TROUBLESHOOTING_GUIDES,
  TroubleshootingGuideItem
} from '../lib/database/troubleshootingData';
import { AppRoute } from '../types';

interface TroubleshootHubPageProps {
  onNavigate: (route: AppRoute) => void;
  categoryFilter?: string;
}

const COMMON_ERROR_DECODER = [
  {
    error: "The file format and extension don't match",
    cause: "File was renamed manually (e.g. from .png to .jpg) without binary transcoding.",
    solutionGuideId: "fix-file-wrong-extension",
    severity: "High"
  },
  {
    error: "Unexpected end of archive / Invalid compressed folder",
    cause: "Download was interrupted; End of Central Directory record (50 4B 05 06) is missing.",
    solutionGuideId: "why-zip-file-not-opening",
    severity: "High"
  },
  {
    error: "Failed to load PDF document / File is damaged (Error 14)",
    cause: "Broken XREF byte offset table or an HTML login page was downloaded as a .pdf.",
    solutionGuideId: "why-pdf-not-opening",
    severity: "Medium"
  },
  {
    error: "The HEVC Video Extension is required to display this file (.HEIC)",
    cause: "Windows lacks native royalty-free HEVC/HEIF codecs for Apple iPhone photos.",
    solutionGuideId: "why-heic-not-opening",
    severity: "Low"
  },
  {
    error: "Windows cannot open this type of file (.DAT / .BIN)",
    cause: "File lacks an extension. True binary format is hidden in the first 16 bytes.",
    solutionGuideId: "how-to-identify-unknown-file",
    severity: "Medium"
  },
  {
    error: "Refused to execute script / Wrong MIME type application/octet-stream",
    cause: "Web server omitted Content-Type header or misclassified modern image formats.",
    solutionGuideId: "wrong-mime-type-explained",
    severity: "Medium"
  }
];

export const TroubleshootHubPage: React.FC<TroubleshootHubPageProps> = ({
  onNavigate,
  categoryFilter
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || 'All');

  const categories = ['All', 'Universal', 'Documents', 'Images', 'Archives'];

  const filteredGuides = useMemo(() => {
    return TROUBLESHOOTING_GUIDES.filter((guide) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        guide.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Universal' && guide.category === 'Universal');

      const matchesSearch =
        searchQuery === '' ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.problemSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.commonErrorMessages.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
        guide.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="File Troubleshooting & Problem-Solving Hub – Why Won't My File Open?"
        description="Diagnose unopenable, corrupted, or extension-mismatched files. Interactive binary diagnostics, error code decoders, and step-by-step repair guides."
        canonicalPath="/troubleshoot"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'AnyFileX File Troubleshooting Hub',
          description: 'Topical troubleshooting authority for diagnosing and fixing file errors, extension mismatches, and container corruption.',
          url: 'https://www.anyfilex.com/troubleshoot'
        }}
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hub Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200 dark:border-blue-800/60">
            <Wrench className="w-3.5 h-3.5" />
            File Problem & Diagnostic Authority
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Why Won't My File Open?
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Diagnose broken files, extension mismatches, unknown formats, and corrupted containers using the AnyFileX File Intelligence Engine.
          </p>
        </div>

        {/* Live File Diagnostic Dropzone */}
        <section id="interactive-diagnostic">
          <DiagnosticDropzone onNavigate={onNavigate} />
        </section>

        {/* Common Error Message Decoder */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Common Error Message Decoder
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Match your exact error message to identify the root cause and immediate fix.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">6 Instant Decoders</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMON_ERROR_DECODER.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate({ view: 'repair-detail', id: item.solutionGuideId })}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1.5 rounded-lg border border-rose-200/60 dark:border-rose-900/40 mb-2.5 line-clamp-2">
                    "{item.error}"
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">Probable Cause:</strong> {item.cause}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                  <span>View Diagnostic Resolution</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting Topic Cluster */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Troubleshooting & Diagnostic Guides
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Step-by-step diagnostic workflows categorized by problem type.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search error, extension, symptom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat === 'All' ? 'All Problems' : cat}
              </button>
            ))}
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => onNavigate({ view: 'repair-detail', id: guide.id })}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {guide.category}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline flex items-center gap-1">
                      Read Guide <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {guide.problemSummary}
                  </p>

                  {/* 4-Stage Summary Badge */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                    <div className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold shrink-0">Analysis:</span>
                      <span className="line-clamp-1">{guide.diagnosticFlow.analysisTechnique}</span>
                    </div>
                    <div className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">Action:</span>
                      <span className="line-clamp-1">{guide.diagnosticFlow.recommendedResolution}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{guide.commonErrorMessages.length} common errors</span>
                  <span>{guide.osWorkflows.length} OS workflows</span>
                </div>
              </div>
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileQuestion className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                No troubleshooting guides match your search
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Try searching for generic terms like "ZIP", "PDF", "corrupt", or "extension".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Measurable Security Assertion Banner */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                AnyFileX Measurable Diagnostic Standard
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Structural Integrity Diagnostics vs. Antivirus Scanning
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We never make unscientific claims such as <span className="italic text-rose-300 font-mono">"This file is 100% safe"</span>. Instead, AnyFileX delivers verifiable, measurable facts: magic byte verification, container offset validation, SHA-256 cryptographic hashes, and extension parity.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate({ view: 'file-analyzer' })}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm text-center"
              >
                Launch File Analyzer
              </button>
              <button
                onClick={() => onNavigate({ view: 'checksum-verifier' })}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700 text-center"
              >
                Verify Hash Checksum
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
