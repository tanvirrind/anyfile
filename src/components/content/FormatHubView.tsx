import React, { useState } from 'react';
import { AppRoute } from '../../types';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { getAllContentEntities } from '../../lib/content/contentRegistry';
import { computeInternalLinksForEntity } from '../../lib/content/internalLinkingEngine';
import { Breadcrumb } from '../Breadcrumb';
import { Badge } from '../Badge';
import { SEOHead } from '../SEOHead';
import {
  FileText,
  FolderOpen,
  RefreshCw,
  GitCompare,
  AlertTriangle,
  Cpu,
  Layers,
  ShieldCheck,
  ArrowRight,
  Zap,
  Sliders,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface FormatHubViewProps {
  topic: string; // e.g. 'heic', 'webp', 'png', 'jpg', 'pdf'
  onNavigate: (route: AppRoute) => void;
}

export const FormatHubView: React.FC<FormatHubViewProps> = ({ topic, onNavigate }) => {
  const extUpper = topic.toUpperCase().replace(/^\./, '');
  const extLower = extUpper.toLowerCase();

  // Find format info from knowledge base
  const formatInfo = POPULAR_FILE_TYPES.find(f => f.extension.toUpperCase() === extUpper) || {
    extension: extUpper,
    name: `${extUpper} Digital Container`,
    category: 'Images' as any,
    description: `Standard ${extUpper} format specifications and architectural ecosystem.`,
    detailedOverview: `${extUpper} is a standardized container format utilized for cross-platform data interchange.`,
    mimeType: `application/${extLower}`,
    magicBytesHex: '00 00 00 18 ...',
    typicalSize: '1 MB – 10 MB',
    dangerRating: 'Low Risk' as any,
    dangerExplanation: 'Standard media format with zero executable privilege.',
    popularApps: [
      { name: 'Apple Photos', os: ['mac', 'ios'] as any, isFree: true, developer: 'Apple Inc.' },
      { name: 'Adobe Photoshop', os: ['windows', 'mac'] as any, isFree: false, developer: 'Adobe Inc.' },
      { name: 'GIMP', os: ['windows', 'mac', 'linux'] as any, isFree: true, developer: 'GIMP Team' }
    ],
    openingSteps: [
      { title: 'Windows Setup', desc: 'View in native Photos or use AnyFileX in-browser viewer.' },
      { title: 'macOS / iOS', desc: 'Double click in Finder or Apple Preview.' }
    ],
    conversions: [
      { targetExtension: 'JPG', description: `Convert ${extUpper} to universal JPEG`, difficulty: 'Easy' as any, onlinePossible: true },
      { targetExtension: 'PNG', description: `Convert ${extUpper} to lossless PNG`, difficulty: 'Easy' as any, onlinePossible: true }
    ],
    repairTips: [
      'Check magic byte header signature for container integrity.',
      'Inspect stream termination markers in File Analyzer.'
    ]
  };

  // Find all related authoritative articles from content registry
  const allEntities = getAllContentEntities();
  const relatedArticles = allEntities.filter(e =>
    e.relatedExtensions.some(ext => ext.toUpperCase() === extUpper) ||
    e.slug.toLowerCase().includes(extLower) ||
    e.primaryTopic.toLowerCase().includes(extLower)
  );

  // Group by Cluster
  const formatGuide = relatedArticles.find(a => a.contentType === 'format-guide');
  const howToGuide = relatedArticles.find(a => a.contentType === 'how-to');
  const conversionGuide = relatedArticles.find(a => a.contentType === 'conversion-guide');
  const comparisonGuide = relatedArticles.find(a => a.contentType === 'comparison');
  const troubleshootingGuide = relatedArticles.find(a => a.contentType === 'troubleshooting');
  const technicalGuide = relatedArticles.find(a => a.contentType === 'technical-guide');
  const securityGuide = relatedArticles.find(a => a.contentType === 'security-guide');
  const softwareGuide = relatedArticles.find(a => a.contentType === 'software-compatibility');

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      <SEOHead
        title={`${extUpper} Format Authority Hub: Specs, Tools, Opening & Conversions`}
        description={`Complete topical authority hub for ${extUpper} (${formatInfo.name}). Guides on opening, converting to JPG/PNG, magic byte specs, troubleshooting, and software compatibility.`}
        canonicalPath={`/hub/${extLower}`}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: `${extUpper} File Format Master Knowledge Hub`,
          description: formatInfo.description,
          mainEntityOfPage: `https://www.anyfilex.com/hub/${extLower}`
        }}
      />

      <Breadcrumb
        items={[
          { label: 'Guides Hub', route: { view: 'guides' } },
          { label: `${extUpper} Topic Hub` }
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
              Topic Authority Hub
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              {formatInfo.category}
            </span>
            <span className="text-xs text-slate-400">Knowledge Graph v5.2</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {extUpper} <span className="text-blue-400">({formatInfo.name})</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {formatInfo.detailedOverview || formatInfo.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block font-medium">MIME Type</span>
              <span className="font-mono font-bold text-white truncate block mt-0.5">{formatInfo.mimeType}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block font-medium">Magic Bytes</span>
              <span className="font-mono font-bold text-blue-300 truncate block mt-0.5">{formatInfo.magicBytesHex}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block font-medium">Danger Profile</span>
              <span className="font-bold text-emerald-400 block mt-0.5">{formatInfo.dangerRating}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block font-medium">Browser Processing</span>
              <span className="font-bold text-white block mt-0.5">100% In-Memory RAM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive AnyFileX Tools for this Format */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Interactive {extUpper} Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Process, convert, optimize, and inspect {extUpper} files directly in your browser with zero server uploads.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate({ view: 'file-analyzer' })}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Binary File Analyzer
                </h3>
                <span className="text-[11px] text-slate-500">Header & Magic Byte Inspector</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Inspect {extUpper} hexadecimal signatures, container geometry, and detect extension spoofs.
            </p>
          </div>

          <div
            onClick={() => onNavigate({ view: 'workflows' })}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  Workflow Pipeline Builder
                </h3>
                <span className="text-[11px] text-slate-500">Multi-Step Automation</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Chain multi-step actions: Convert {extUpper} → Resize → Compress → Strip EXIF → Package ZIP.
            </p>
          </div>

          <div
            onClick={() => onNavigate({ view: 'tool-detail', slug: 'image-compressor' } as any)}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  Image Compressor
                </h3>
                <span className="text-[11px] text-slate-500">Live RAM Quantization</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Reduce payload size with real-time visual side-by-side comparison and instant download.
            </p>
          </div>
        </div>
      </div>

      {/* Structured Topical Hub Network */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {extUpper} Structured Knowledge Ecosystem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. What is format guide */}
          <div
            onClick={() => {
              if (formatGuide) onNavigate({ view: 'guide-detail', id: formatGuide.slug });
              else onNavigate({ view: 'extension-detail', ext: extLower });
            }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                  <FileText className="w-5 h-5" />
                </span>
                <Badge variant="blue">Format Guide</Badge>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {formatGuide?.title || `What Is a ${extUpper} File? Format Specifications`}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {formatGuide?.summary || `Comprehensive architectural breakdown of ${extUpper}, container encoding, and color profiles.`}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Read Format Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. How to open */}
          <div
            onClick={() => {
              if (howToGuide) onNavigate({ view: 'guide-detail', id: howToGuide.slug });
              else onNavigate({ view: 'how-to-open', ext: extLower } as any);
            }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                  <FolderOpen className="w-5 h-5" />
                </span>
                <Badge variant="emerald">How to Open</Badge>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {howToGuide?.title || `How to Open ${extUpper} on Windows, Mac, Android & Linux`}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {howToGuide?.summary || `Operating system specific step-by-step instructions for viewing ${extUpper} files with verified software.`}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>View OS Instructions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Conversion Guide */}
          <div
            onClick={() => {
              if (conversionGuide) onNavigate({ view: 'guide-detail', id: conversionGuide.slug });
              else onNavigate({ view: 'converter-detail', id: `${extLower}-to-jpg` });
            }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                  <RefreshCw className="w-5 h-5" />
                </span>
                <Badge variant="violet">Conversion</Badge>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                {conversionGuide?.title || `How to Convert ${extUpper} to JPG / PNG`}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {conversionGuide?.summary || `Transform ${extUpper} to universal image formats in your browser without cloud uploads.`}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600">
              <span>Read Conversion Steps</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Format Comparisons */}
          <div
            onClick={() => {
              if (comparisonGuide) onNavigate({ view: 'guide-detail', id: comparisonGuide.slug });
              else onNavigate({ view: 'compare-detail' as any, id: `${extLower}-vs-jpg` });
            }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                  <GitCompare className="w-5 h-5" />
                </span>
                <Badge variant="blue">Comparison</Badge>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                {comparisonGuide?.title || `${extUpper} vs JPG: Compression & Specs Compared`}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {comparisonGuide?.summary || `Benchmark compression ratios, color bit-depth, transparency, and compatibility side-by-side.`}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>View Benchmark Matrix</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Troubleshooting & Repair */}
          <div
            onClick={() => {
              if (troubleshootingGuide) onNavigate({ view: 'guide-detail', id: troubleshootingGuide.slug });
              else onNavigate({ view: 'repair-detail', id: `${extLower}-repair` });
            }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <Badge variant="amber">Troubleshooting</Badge>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                {troubleshootingGuide?.title || `Why Won't My ${extUpper} File Open? Fix Errors`}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {troubleshootingGuide?.summary || `Diagnose truncated streams, black screen errors, and missing codec problems.`}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>Troubleshoot Errors</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Software Compatibility */}
          <div
            onClick={() => {
              if (softwareGuide) onNavigate({ view: 'guide-detail', id: softwareGuide.slug });
              else onNavigate({ view: 'software' });
            }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                  <Layers className="w-5 h-5" />
                </span>
                <Badge variant="emerald">Software Ecosystem</Badge>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                {softwareGuide?.title || `What Programs Open ${extUpper} Files?`}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {softwareGuide?.summary || `Verified list of free and commercial desktop software capable of reading and editing ${extUpper}.`}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-600">
              <span>View Compatible Apps</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      {formatGuide?.faq && formatGuide.faq.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" /> Frequently Asked Questions About {extUpper}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formatGuide.faq.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.question}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
