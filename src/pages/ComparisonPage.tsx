import React, { useState } from 'react';
import {
  GitCompare,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Zap,
  HardDrive,
  Globe,
  Layers,
  Tag,
  Edit3,
  TrendingUp,
  Smartphone,
  AppWindow,
  FileText,
  Search,
  Sliders,
  ShieldCheck,
  AlertCircle,
  FileCode,
  FolderArchive,
  ArrowLeftRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { AppRoute } from '../types';
import { getComparisonGuide, ComparisonGuideData } from '../lib/guides/comparisonGuideEngine';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumb } from '../components/Breadcrumb';
import { FAQAccordion } from '../components/FAQAccordion';
import { Badge } from '../components/Badge';

interface ComparisonPageProps {
  slug: string;
  onNavigate: (route: AppRoute) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({ slug, onNavigate }) => {
  const guide: ComparisonGuideData = getComparisonGuide(slug);
  const [activeTab, setActiveTab] = useState<'all' | 'quality' | 'compression' | 'compatibility' | 'workflow'>('all');

  const {
    ext1,
    ext2,
    ext1Lower,
    ext2Lower,
    ext1Info,
    ext2Info,
    title,
    metaDescription,
    category,
    isValidComparison,
    mismatchReason,
    headline,
    overview,
    keyDifferences,
    quality,
    compression,
    fileSize,
    compatibility,
    transparency,
    metadata,
    editing,
    webUsage,
    mobileUsage,
    softwareSupport,
    tableRows,
    useExt1When,
    useExt2When,
    balancedConclusion,
    hasDirectConverter,
    converterSlug,
    analyzerUrl,
    metadataViewerUrl,
    howToOpenExt1Url,
    howToOpenExt2Url,
    formatPageExt1Url,
    formatPageExt2Url,
    relatedComparisons,
    faqs,
    schemaData,
  } = guide;

  if (!isValidComparison) {
    return (
      <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
        <SEOHead
          title={`Cannot Compare .${ext1} vs .${ext2} | AnyFileX`}
          description="Format comparison domain mismatch notification."
          canonicalPath={`/compare/${slug.toLowerCase()}`}
        />
        <Breadcrumb
          items={[
            { label: 'Compare Formats', route: { view: 'compare-hub' } },
            { label: `.${ext1} vs .${ext2}` },
          ]}
          onNavigate={onNavigate}
        />

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Unrelated Format Comparison
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              {mismatchReason || `.${ext1} and .${ext2} belong to different technical categories. Meaningful head-to-head comparisons require formats serving similar functional domains.`}
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate({ view: 'compare-hub' })}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Browse Valid Comparisons
            </button>
            <button
              onClick={() => onNavigate({ view: 'extension-detail', ext: ext1Lower })}
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all cursor-pointer"
            >
              View .{ext1} Specs
            </button>
            <button
              onClick={() => onNavigate({ view: 'extension-detail', ext: ext2Lower })}
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all cursor-pointer"
            >
              View .{ext2} Specs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const technicalDimensions = [
    { ...quality, icon: Sparkles, group: 'quality' },
    { ...compression, icon: Zap, group: 'compression' },
    { ...fileSize, icon: HardDrive, group: 'compression' },
    { ...compatibility, icon: Globe, group: 'compatibility' },
    { ...transparency, icon: Layers, group: 'quality' },
    { ...metadata, icon: Tag, group: 'workflow' },
    { ...editing, icon: Edit3, group: 'workflow' },
    { ...webUsage, icon: TrendingUp, group: 'compatibility' },
    { ...mobileUsage, icon: Smartphone, group: 'compatibility' },
    { ...softwareSupport, icon: AppWindow, group: 'workflow' },
  ];

  const filteredDimensions = technicalDimensions.filter(
    (dim) => activeTab === 'all' || dim.group === activeTab
  );

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title={`${ext1} vs ${ext2}: What's the Difference & Which to Use?`}
        description={metaDescription}
        canonicalPath={`/compare/${slug.toLowerCase()}`}
        schemaData={schemaData}
      />

      <Breadcrumb
        items={[
          { label: 'Compare File Formats', route: { view: 'compare-hub' } },
          { label: `${category} Comparisons`, route: { view: 'compare-hub', categoryFilter: category } },
          { label: `.${ext1} vs .${ext2}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Format Head-to-Head Authority</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>{category}</span>
          </div>

          {/* Direct Converter Quick Launch */}
          {hasDirectConverter && (
            <button
              onClick={() => onNavigate({ view: 'converter-detail', id: converterSlug || `${ext1Lower}-to-${ext2Lower}` })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
              <span>Convert .{ext1} to .{ext2}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-4 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            <span className="text-blue-600 dark:text-blue-400">.{ext1}</span> vs <span className="text-indigo-600 dark:text-indigo-400">.{ext2}</span>: What&apos;s the Difference?
          </h1>
          <p className="text-base sm:text-xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
            {headline}
          </p>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            {overview}
          </p>
        </div>

        {/* Side-by-Side Dual Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Format 1 */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-black text-blue-600 dark:text-blue-400">
                  .{ext1}
                </span>
                <Badge variant="blue">{ext1Info.category}</Badge>
              </div>
              <button
                onClick={() => onNavigate({ view: 'extension-detail', ext: ext1Lower })}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Specs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{ext1Info.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ext1Info.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans">MIME Type</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">{ext1Info.mimeType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Magic Bytes</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">{ext1Info.magicBytesHex || 'Variable'}</span>
              </div>
            </div>
          </div>

          {/* Format 2 */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-black text-indigo-600 dark:text-indigo-400">
                  .{ext2}
                </span>
                <Badge variant="violet">{ext2Info.category}</Badge>
              </div>
              <button
                onClick={() => onNavigate({ view: 'extension-detail', ext: ext2Lower })}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Specs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{ext2Info.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ext2Info.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans">MIME Type</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">{ext2Info.mimeType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Magic Bytes</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">{ext2Info.magicBytesHex || 'Variable'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differences Executive Summary */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Key Differences at a Glance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The primary architectural distinctions between .{ext1} and .{ext2}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyDifferences.map((diff, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3.5"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {diff}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Structured Verified Specification Comparison Table */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Technical Specification Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified technical attributes and capabilities benchmarked side by side.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Verified Technical Data</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="p-4 font-bold">Feature / Attribute</th>
                <th className="p-4 font-bold text-blue-600 dark:text-blue-400">.{ext1} ({ext1Info.name})</th>
                <th className="p-4 font-bold text-indigo-600 dark:text-indigo-400">.{ext2} ({ext2Info.name})</th>
                <th className="p-4 font-bold text-center">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tableRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                    <div>{row.feature}</div>
                    {row.notes && <span className="text-[11px] text-slate-400 font-normal">{row.notes}</span>}
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-mono text-xs">{row.ext1Value}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-mono text-xs">{row.ext2Value}</td>
                  <td className="p-4 text-center">
                    {row.advantage === 'ext1' ? (
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 inline-block">
                        .{ext1}
                      </span>
                    ) : row.advantage === 'ext2' ? (
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 inline-block">
                        .{ext2}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-xs inline-block">
                        Parity / Tie
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Practical Use-Case Decision Engine: Which Should You Use? */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Decision Guidance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Which File Format Should You Use?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-3xl">
            Real-world scenarios to guide your choice without rigid or absolute rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Use Ext 1 Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                .{ext1}
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Use .{ext1} when...
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {useExt1When.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Use Ext 2 Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                .{ext2}
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Use .{ext2} when...
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {useExt2When.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Balanced Conclusion Box */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Balanced Engineering Verdict
          </span>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
            {balancedConclusion}
          </p>
        </div>
      </section>

      {/* Deep-Dive Technical Head-to-Head Sections */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              In-Depth Head-to-Head Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Detailed technical examination across 10 architectural categories.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Dimensions' },
              { id: 'quality', label: 'Quality & Alpha' },
              { id: 'compression', label: 'Compression & Size' },
              { id: 'compatibility', label: 'Compatibility & Web' },
              { id: 'workflow', label: 'Editing & Software' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredDimensions.map((dim, idx) => {
            const Icon = dim.icon;
            return (
              <div
                key={dim.id}
                className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {dim.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Dimension {idx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {/* Ext 1 text */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-xs uppercase tracking-wider block">
                      .{ext1} ({ext1Info.name})
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dim.ext1Text}
                    </p>
                  </div>

                  {/* Ext 2 text */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-wider block">
                      .{ext2} ({ext2Info.name})
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dim.ext2Text}
                    </p>
                  </div>
                </div>

                {/* Verdict */}
                <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-[11px]">
                    Analysis Verdict:
                  </span>
                  <span>{dim.verdict}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Integrations Grid (Analyzer, Converter, Metadata, Open Guides) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Connected AnyFileX Tools & Guides
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Inspect, convert, open, and analyze .{ext1} and .{ext2} files using private browser-local tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Converter Tool */}
          <div
            onClick={() => onNavigate({ view: 'converter-detail', id: converterSlug || `${ext1Lower}-to-${ext2Lower}` })}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 hover:border-blue-400 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Instant File Converter
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Convert .{ext1} &harr; .{ext2} in your browser with zero upload.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Launch Converter</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* File Analyzer */}
          <div
            onClick={() => onNavigate({ view: 'file-analyzer' })}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Magic Byte & Header Analyzer
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Inspect raw container bytes and verify real format headers.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Inspect Binary Structure</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Metadata Viewer */}
          <div
            onClick={() => onNavigate({ view: 'metadata-viewer' })}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                EXIF & Metadata Inspector
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Extract hidden metadata, color profiles, and timestamps.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>View Metadata</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* How to Open Guides */}
          <div
            onClick={() => onNavigate({ view: 'how-to-open', ext: ext1Lower })}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                How to Open Guides
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Step-by-step instructions for Windows, Mac, iOS & Android.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Read Opening Guides</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Related Comparisons Carousel / Grid */}
      {relatedComparisons.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Related {category} Comparisons
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Explore more format face-offs in this category.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ view: 'compare-hub', categoryFilter: category })}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedComparisons.map((rel) => (
              <div
                key={rel.slug}
                onClick={() => onNavigate({ view: 'comparison-detail', slug: rel.slug })}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 transition-all cursor-pointer group space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                    .{rel.ext1}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">vs</span>
                  <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                    .{rel.ext2}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                  {rel.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {rel.highlight}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions: .{ext1} vs .{ext2}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Answers to common questions regarding quality preservation, conversion, and workflow trade-offs.
          </p>
        </div>

        <FAQAccordion faqs={faqs} />
      </section>
    </div>
  );
};
