'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Zap,
  HelpCircle,
  Cpu,
  Layers,
  Clock,
  HardDrive,
  Lock,
  Terminal,
  Monitor,
  Smartphone,
  AlertTriangle,
  ExternalLink,
  FileText,
  Compass,
  Search,
  Scale,
  BookOpen,
  Wrench,
  Sliders,
  Check,
  ChevronRight,
  Share2,
  Copy
} from 'lucide-react';
import { AppRoute } from '../types';
import { resolveConverterPair, getAllConverterPairs } from '../lib/converter/registry';
import { getConversionAuthorityGuide, isSupportedConversion } from '../lib/guides/conversionGuideEngine';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { ConverterUploadBox } from '../components/converter/ConverterUploadBox';
import { ZipCreatorWorkspace } from '../components/converter/ZipCreatorWorkspace';
import { ZipExtractorWorkspace } from '../components/converter/ZipExtractorWorkspace';
import { RarExtractorWorkspace } from '../components/converter/RarExtractorWorkspace';
import { ThreeMfToStlWorkspace } from '../components/converter/ThreeMfToStlWorkspace';
import { EmlToPdfWorkspace } from '../components/email/EmlToPdfWorkspace';
import { ConverterSecurityNotice } from '../components/converter/ConverterSecurityNotice';
import { ConversionHistoryWidget } from '../components/converter/ConversionHistoryWidget';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';

interface ConverterDetailPageProps {
  onNavigate: (route: AppRoute) => void;
  pairSlug: string;
}

export const ConverterDetailPage: React.FC<ConverterDetailPageProps> = ({
  onNavigate,
  pairSlug,
}) => {
  const [historyKey, setHistoryKey] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeOsTab, setActiveOsTab] = useState<'windows' | 'mac' | 'linux' | 'mobile'>('windows');

  const handleConversionComplete = useCallback(() => {
    setHistoryKey((prev) => prev + 1);
  }, []);

  const pair = useMemo(() => resolveConverterPair(pairSlug), [pairSlug]);
  const guide = useMemo(() => getConversionAuthorityGuide(pairSlug), [pairSlug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  // If the conversion is not supported in AnyFileX (Quality Control Rule)
  if (!guide && pair.id !== 'zip-creator' && pair.id !== 'zip-extractor' && pair.id !== 'rar-extractor') {
    return (
      <div className="py-16 max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Unsupported Conversion Pair
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          AnyFileX only publishes guides and tools for verified, fully functional in-browser transformations.
        </p>
        <button
          onClick={() => onNavigate({ view: 'converters' })}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" /> Browse Supported Converters
        </button>
      </div>
    );
  }

  const fromUpper = guide?.fromUpper || pair.fromExt.toUpperCase();
  const toUpper = guide?.toUpper || pair.toExt.toUpperCase();

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title={guide ? `How to Convert ${fromUpper} to ${toUpper} Online Free – AnyFileX` : `Convert ${fromUpper} to ${toUpper} Online (${pair.name})`}
        description={guide ? guide.metaDescription : `Fast and secure local browser conversion from .${pair.fromExt} to .${pair.toExt}. ${pair.description} 100% private WebAssembly processing.`}
        canonicalPath={`/converters/${pair.id}`}
        schemaData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              '@id': `https://www.anyfilex.com/converters/${pair.id}#app`,
              name: pair.name,
              url: `https://www.anyfilex.com/converters/${pair.id}`,
              description: pair.description,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Windows, macOS, Linux, iOS, Android',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
            },
            ...(guide ? [
              {
                '@type': 'HowTo',
                '@id': `https://www.anyfilex.com/converters/${pair.id}#howto`,
                name: `How to Convert ${fromUpper} to ${toUpper}`,
                description: guide.metaDescription,
                step: guide.steps.map((s) => ({
                  '@type': 'HowToStep',
                  position: s.number,
                  name: s.title,
                  text: s.instruction
                }))
              },
              {
                '@type': 'FAQPage',
                '@id': `https://www.anyfilex.com/converters/${pair.id}#faq`,
                mainEntity: guide.faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: f.answer
                  }
                }))
              }
            ] : [])
          ]
        }}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Converters', route: { view: 'converters' } },
          { label: `Convert ${fromUpper} to ${toUpper}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* ========================================================================= */}
      {/* 3. PRODUCT-FIRST DESIGN: Converter Header & Interactive Workspace Box     */}
      {/* ========================================================================= */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="blue" size="md">
            {pair.badge || `${pair.category} Converter`}
          </Badge>
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">
            .{fromUpper} → .{toUpper}
          </span>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% In-Browser Memory
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          How to Convert <span className="text-blue-600 dark:text-blue-400">.{fromUpper}</span> to <span className="text-emerald-600 dark:text-emerald-400">.{toUpper}</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {guide?.subtitle || pair.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-1">
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-4 h-4" /> Zero Server Uploads
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-4 h-4" /> Instant Hardware Accelerated Wasm
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <HardDrive className="w-4 h-4 text-amber-500" /> Max 100MB File Size
          </span>
        </div>
      </div>

      {/* Security Banner */}
      <div className="max-w-4xl mx-auto">
        <ConverterSecurityNotice />
      </div>

      {/* Prominent Converter Tool Workspace (Product-First) */}
      <div id="converter-tool-box" className="max-w-4xl mx-auto">
        {pair.id === 'zip-creator' ? (
          <ZipCreatorWorkspace />
        ) : pair.id === 'zip-extractor' ? (
          <ZipExtractorWorkspace />
        ) : pair.id === 'rar-extractor' ? (
          <RarExtractorWorkspace />
        ) : pair.id === '3mf-to-stl' ? (
          <ThreeMfToStlWorkspace onNavigate={onNavigate} />
        ) : pair.id === 'eml-to-pdf' || pair.id === 'msg-to-pdf' ? (
          <EmlToPdfWorkspace onNavigate={onNavigate} />
        ) : (
          <ConverterUploadBox
            pair={pair}
            onConversionComplete={handleConversionComplete}
          />
        )}
      </div>

      {/* Conversion History Widget */}
      <div className="max-w-4xl mx-auto">
        <ConversionHistoryWidget key={historyKey} />
      </div>

      {/* ========================================================================= */}
      {/* 4. STEP-BY-STEP INSTRUCTIONS SECTION                                      */}
      {/* ========================================================================= */}
      {guide && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 max-w-4xl mx-auto">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Conversion Protocol</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Step-by-Step: How to Convert .{fromUpper} to .{toUpper}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Follow these simple steps to transform your files locally inside your browser with maximum quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {guide.steps.map((step) => (
              <div
                key={step.number}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5 relative flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      {step.number}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-11">
                    {step.instruction}
                  </p>
                </div>
                {step.proTip && (
                  <div className="mt-2 text-xs bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl p-2.5 text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Pro Tip:</strong> {step.proTip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1 & 2. WHAT SOURCE IS & WHY CONVERT                                       */}
      {/* ========================================================================= */}
      {guide && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* 1. What Source Is */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Source Format Profile
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md font-mono">
                .{fromUpper}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              What is a .{fromUpper} File?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {guide.sourceFormat.technicalOverview}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Developer</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">{guide.sourceFormat.developer}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Compression</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">{guide.sourceFormat.compressionType}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">MIME Type</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">{guide.sourceFormat.mimeType}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Bit Depth</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">{guide.sourceFormat.bitDepth}</span>
              </div>
            </div>
            <div className="pt-1">
              <button
                onClick={() => onNavigate(guide.internalLinks.sourceFormatRoute)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 inline-flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" /> Read Full .{fromUpper} Specification Guide
              </button>
            </div>
          </div>

          {/* 2. Why Convert */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Conversion Motivation
              </span>
              <span className="text-xs font-bold text-slate-500">
                Key Reasons
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Why Convert .{fromUpper} to .{toUpper}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {guide.whyConvert.keyDriver}
            </p>
            <div className="space-y-2.5 pt-1">
              {guide.whyConvert.reasons.map((r, idx) => (
                <div key={idx} className="text-xs flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white font-bold block">{r.title}</strong>
                    <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{r.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5 & 6. QUALITY CONSIDERATIONS & FILE SIZE BENCHMARKS                      */}
      {/* ========================================================================= */}
      {guide && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 max-w-4xl mx-auto">
          {/* Quality Considerations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
              <Sliders className="w-4 h-4" />
              <span>Encoding Precision</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Quality & Technical Encoding Considerations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When converting from <strong>.{fromUpper}</strong> to <strong>.{toUpper}</strong>, AnyFileX executes deep mathematical transformations in local memory:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fidelity Standard</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {guide.quality.lossyOrLossless}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {guide.quality.quantizationDetails}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color & Gamut</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-500" />
                  Color Profile Retention
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {guide.quality.colorSpacePreservation}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transparency Layers</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  Alpha Channel Handling
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {guide.quality.transparencyHandling}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metadata Retention</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  EXIF & Header Chunks
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {guide.quality.metadataHandling}
                </p>
              </div>
            </div>
          </div>

          {/* 6. File Size Considerations & Empirical Benchmarks */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-blue-600" />
                  <span>File-Size Impact & Empirical Benchmarks</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {guide.fileSize.averageDelta}
                </p>
              </div>
              <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                {guide.fileSize.trend}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Sample Payload</th>
                    <th className="p-3">Original .{fromUpper}</th>
                    <th className="p-3">Converted .{toUpper}</th>
                    <th className="p-3">Size Delta</th>
                    <th className="p-3">Wasm Speed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {guide.fileSize.benchmarks.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{row.sampleType}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{row.sourceSize}</td>
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{row.targetSize}</td>
                      <td className="p-3 font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          row.reductionPercent.startsWith('-')
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {row.reductionPercent}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-500">{row.processingTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              <strong>Web Vitals Note:</strong> {guide.fileSize.webVitalsNote}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PRIVACY & LOCAL PROCESSING ARCHITECTURE                                */}
      {/* ========================================================================= */}
      {guide && (
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider">
                Enterprise Privacy Architecture
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Zero-Knowledge Local Browser Processing
              </h3>
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">
            Unlike traditional cloud conversion websites that transfer your photos and documents across third-party remote servers, AnyFileX processes your <strong>.{fromUpper}</strong> files entirely inside your device’s local memory sandbox.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-blue-300 font-bold">Network Payload</span>
              <h4 className="text-lg font-black text-white">0 Bytes Uploaded</h4>
              <p className="text-[11px] text-slate-300">Your files never leave your computer or phone.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-emerald-300 font-bold">Processing Engine</span>
              <h4 className="text-lg font-black text-white">WebAssembly RAM</h4>
              <p className="text-[11px] text-slate-300">Hardware accelerated local byte compilation.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-purple-300 font-bold">Data Compliance</span>
              <h4 className="text-lg font-black text-white">HIPAA & GDPR Safe</h4>
              <p className="text-[11px] text-slate-300">Zero data retention policy by mathematical design.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. ALTERNATIVE METHODS (Desktop & Native OS)                              */}
      {/* ========================================================================= */}
      {guide && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 max-w-4xl mx-auto">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Monitor className="w-4 h-4" />
              <span>Native Operating System Methods</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Alternative Ways to Convert .{fromUpper} to .{toUpper}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Need to convert offline on your operating system? Choose your platform below for native instructions and CLI commands.
            </p>
          </div>

          {/* OS Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveOsTab('windows')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeOsTab === 'windows'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Windows 11 / 10
            </button>
            <button
              onClick={() => setActiveOsTab('mac')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeOsTab === 'mac'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> macOS (Apple Silicon / Intel)
            </button>
            <button
              onClick={() => setActiveOsTab('linux')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeOsTab === 'linux'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Linux (CLI)
            </button>
            <button
              onClick={() => setActiveOsTab('mobile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeOsTab === 'mobile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> iPhone & Android
            </button>
          </div>

          {/* OS Content Panes */}
          <div className="pt-2">
            {activeOsTab === 'windows' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Windows Native Tool: {guide.alternatives.windows.app}
                  </h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {guide.alternatives.windows.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
                {guide.alternatives.windows.commandLine && (
                  <div className="p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs flex items-center justify-between">
                    <code>{guide.alternatives.windows.commandLine}</code>
                  </div>
                )}
              </div>
            )}

            {activeOsTab === 'mac' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    macOS Native Tool: {guide.alternatives.mac.app}
                  </h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {guide.alternatives.mac.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
                {guide.alternatives.mac.commandLine && (
                  <div className="p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs flex items-center justify-between">
                    <code>{guide.alternatives.mac.commandLine}</code>
                  </div>
                )}
              </div>
            )}

            {activeOsTab === 'linux' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Linux Package: {guide.alternatives.linux.package}
                  </h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {guide.alternatives.linux.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
                {guide.alternatives.linux.commandLine && (
                  <div className="p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs flex items-center justify-between">
                    <code>{guide.alternatives.linux.commandLine}</code>
                  </div>
                )}
              </div>
            )}

            {activeOsTab === 'mobile' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Mobile Workflow: {guide.alternatives.mobile.os}
                </h4>
                <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {guide.alternatives.mobile.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SOURCE VS TARGET TECHNICAL COMPARISON MATRIX                           */}
      {/* ========================================================================= */}
      {guide && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                <Scale className="w-4 h-4" />
                <span>Format Face-Off</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                .{fromUpper} vs .{toUpper}: Technical Comparison
              </h2>
            </div>
            <button
              onClick={() => onNavigate(guide.internalLinks.comparisonRoute)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-xs font-bold text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition-colors"
            >
              Full Comparison <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 w-1/3">Feature / Specification</th>
                  <th className="p-3.5 w-1/3 text-blue-600 dark:text-blue-400 font-mono">.{fromUpper}</th>
                  <th className="p-3.5 w-1/3 text-emerald-600 dark:text-emerald-400 font-mono">.{toUpper}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {guide.comparison.matrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{row.attribute}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{row.sourceVal}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium">{row.targetVal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. TROUBLESHOOTING FAILURE MODES                                         */}
      {/* ========================================================================= */}
      {guide && guide.troubleshooting.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 max-w-4xl mx-auto">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Wrench className="w-4 h-4" />
              <span>Conversion Diagnostics</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Troubleshooting .{fromUpper} to .{toUpper} Conversion Errors
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Encountering color shifts, unexpected file sizes, or conversion failure? Check these verified diagnostics.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {guide.troubleshooting.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{t.scenario}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider block">Root Cause</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t.cause}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Resolution</span>
                    <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{t.solution}</p>
                  </div>
                </div>
                {t.toolAction && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      onClick={() => onNavigate(t.toolAction!.route)}
                      className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      {t.toolAction.label}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. FREQUENTLY ASKED QUESTIONS                                            */}
      {/* ========================================================================= */}
      {guide && guide.faqs.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions: .{fromUpper} to .{toUpper}
            </h2>
          </div>
          <FAQAccordion faqs={guide.faqs} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. INTERNAL CROSS-LINKING & CONVERSION CLUSTER                           */}
      {/* ========================================================================= */}
      {guide && (
        <div className="max-w-4xl mx-auto space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Format Intelligence Graph
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Related Converters, Format Specs & Diagnostic Utilities
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {/* Source Guide Link */}
            <div
              onClick={() => onNavigate(guide.internalLinks.sourceFormatRoute)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600">FORMAT SPEC</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                What is .{fromUpper}?
              </h4>
              <p className="text-xs text-slate-500">Read complete specifications, MIME & history.</p>
            </div>

            {/* How to Open Source */}
            <div
              onClick={() => onNavigate(guide.internalLinks.sourceHowToOpenRoute)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-600">HOW-TO GUIDE</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                How to Open .{fromUpper}
              </h4>
              <p className="text-xs text-slate-500">Step-by-step opening on Windows, Mac, iOS & Android.</p>
            </div>

            {/* Comparison Link */}
            <div
              onClick={() => onNavigate(guide.internalLinks.comparisonRoute)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-600">COMPARISON</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                .{fromUpper} vs .{toUpper}
              </h4>
              <p className="text-xs text-slate-500">Side-by-side benchmark & compression face-off.</p>
            </div>

            {/* Magic Byte Inspector */}
            <div
              onClick={() => onNavigate(guide.internalLinks.magicByteRoute)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-600">FORENSICS</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Magic Byte Detector
              </h4>
              <p className="text-xs text-slate-500">Inspect raw binary header & verify file integrity.</p>
            </div>

            {/* Target Format Guide */}
            <div
              onClick={() => onNavigate(guide.internalLinks.targetFormatRoute)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600">TARGET SPEC</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                What is .{toUpper}?
              </h4>
              <p className="text-xs text-slate-500">Learn about target container features.</p>
            </div>

            {/* File Analyzer */}
            <div
              onClick={() => onNavigate(guide.internalLinks.analyzerRoute)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-600">INSPECTOR</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                File Analyzer & EXIF
              </h4>
              <p className="text-xs text-slate-500">Inspect metadata, dimensions, and color profiles.</p>
            </div>
          </div>

          {/* Related Conversion Cluster Cards */}
          {guide.internalLinks.relatedConversions.length > 0 && (
            <div className="pt-4 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Related Converters in this Cluster
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {guide.internalLinks.relatedConversions.map((rel) => (
                  <div
                    key={rel.slug}
                    onClick={() => onNavigate({ view: 'converter-detail', id: rel.slug })}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 block">
                        {rel.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                        {rel.name}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
