import React from 'react';
import {
  Sparkles,
  Lock,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Layers,
  HelpCircle,
  Zap,
  FolderArchive,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { AppRoute } from '../types';
import { getToolBySlug, getAllTools, ToolDefinition } from '../lib/tools/toolsRegistry';
import { resolveConverterPair } from '../lib/converter/registry';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';
import { generateFAQSchema } from '../lib/seo/faqGenerator';
import { ImageCompressorWorkspace } from '../components/tools/ImageCompressorWorkspace';
import { ImageResizerWorkspace } from '../components/tools/ImageResizerWorkspace';
import { StlViewerWorkspace } from '../components/tools/StlViewerWorkspace';
import { ThreeMfViewerWorkspace } from '../components/tools/ThreeMfViewerWorkspace';
import { StlRepairWorkspace } from '../components/tools/StlRepairWorkspace';
import { EmailViewerWorkspace } from '../components/email/EmailViewerWorkspace';
import { EmlToPdfWorkspace } from '../components/email/EmlToPdfWorkspace';
import { WinmailExtractorWorkspace } from '../components/email/WinmailExtractorWorkspace';
import { MsgToEmlWorkspace } from '../components/email/MsgToEmlWorkspace';
import { ConverterUploadBox } from '../components/converter/ConverterUploadBox';
import { ZipCreatorWorkspace } from '../components/converter/ZipCreatorWorkspace';
import { ZipExtractorWorkspace } from '../components/converter/ZipExtractorWorkspace';
import { RarExtractorWorkspace } from '../components/converter/RarExtractorWorkspace';
import { ThreeMfToStlWorkspace } from '../components/converter/ThreeMfToStlWorkspace';
import { getFormatKnowledgeNode } from '../lib/database/knowledgeGraph';

export interface ToolDetailPageProps {
  toolSlug: string;
  onNavigate: (route: AppRoute) => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ toolSlug, onNavigate }) => {
  const tool = getToolBySlug(toolSlug);
  const converterPair = resolveConverterPair(toolSlug);

  // If tool definition doesn't exist in TOOLS_REGISTRY, fallback to dynamic converter metadata
  const effectiveName = tool?.name || (converterPair ? converterPair.name : `${toolSlug.replace(/-/g, ' ').toUpperCase()} Tool`);
  const effectiveTagline = tool?.tagline || (converterPair ? converterPair.description : 'Fast, private client-side browser file utility');
  const effectiveCategory = tool?.categoryLabel || (converterPair ? `${converterPair.category} Converter` : 'File Utility');
  const effectiveDesc = tool?.description || (converterPair ? converterPair.description : `Free online browser-based ${toolSlug.replace(/-/g, ' ')} file utility with zero server uploads.`);
  const processingType = tool?.processingType || 'local';

  // Gather Knowledge Graph nodes for primary input extensions
  const primaryExt = tool?.supportedInputFormats[0] || (converterPair ? converterPair.fromExt : 'jpg');
  const knowledgeNode = primaryExt && primaryExt !== '*' ? getFormatKnowledgeNode(primaryExt) : null;

  const allTools = getAllTools();
  const relatedTools = allTools
    .filter((t) => t.slug !== toolSlug && (tool?.relatedToolSlugs?.includes(t.slug) || t.category === tool?.category))
    .slice(0, 3);

  const defaultFaqs = tool?.faqs || [
    {
      question: `How does the ${effectiveName} work?`,
      answer: `The AnyFileX ${effectiveName} executes client-side decoding and transformation entirely inside your web browser's RAM via WebAssembly and HTML5 APIs. Files are never sent or stored on any remote cloud server.`
    },
    {
      question: 'Are my private files safe?',
      answer: 'Yes! Processing happens 100% locally on your own machine. Your sensitive documents, photos, and archives remain completely private.'
    },
    {
      question: 'Is there a file size limit or cost?',
      answer: 'The tool is 100% free with unlimited conversions and supports batch files up to 100MB per file.'
    }
  ];

  const defaultSteps = tool?.steps || [
    { title: 'Upload Files', desc: 'Drag and drop or select your files to begin processing.' },
    { title: 'Configure & Process', desc: 'Adjust target settings or convert instantly in browser memory.' },
    { title: 'Download Output', desc: 'Download individual converted files or export all as a ZIP archive.' }
  ];

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title={`${effectiveName} – Free Online Browser Tool`}
        description={effectiveDesc}
        canonicalPath={`/tools/${toolSlug}`}
        schemaData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              name: effectiveName,
              url: `https://www.anyfilex.com/tools/${toolSlug}`,
              description: effectiveDesc,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Windows, macOS, Linux, iOS, Android'
            },
            generateFAQSchema(defaultFaqs),
          ],
        }}
      />

      <Breadcrumb
        items={[
          { label: 'File Tools', route: { view: 'tools' } },
          { label: effectiveName }
        ]}
        onNavigate={onNavigate}
      />

      {/* Header Section */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{effectiveCategory} • {processingType === 'local' ? '100% Local Browser Memory' : 'Hybrid Secure Processing'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {effectiveName}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
          {effectiveTagline}
        </p>

        {/* Security & Privacy Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-1">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Lock className="w-3.5 h-3.5" /> Zero File Uploads
          </span>
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <Cpu className="w-3.5 h-3.5" /> In-Browser RAM Engine
          </span>
          <span className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Complete Data Privacy
          </span>
        </div>
      </div>

      {/* Primary Workspace Area */}
      <div className="max-w-5xl mx-auto">
        {toolSlug === 'image-compressor' ? (
          <ImageCompressorWorkspace />
        ) : toolSlug === 'image-resizer' ? (
          <ImageResizerWorkspace />
        ) : toolSlug === 'stl-viewer' ? (
          <StlViewerWorkspace onNavigate={onNavigate} />
        ) : toolSlug === '3mf-viewer' ? (
          <ThreeMfViewerWorkspace onNavigate={onNavigate} />
        ) : toolSlug === 'stl-repair' ? (
          <StlRepairWorkspace onNavigate={onNavigate} />
        ) : toolSlug === 'zip-creator' ? (
          <ZipCreatorWorkspace />
        ) : toolSlug === 'zip-extractor' ? (
          <ZipExtractorWorkspace />
        ) : toolSlug === 'rar-extractor' ? (
          <RarExtractorWorkspace />
        ) : toolSlug === '3mf-to-stl' ? (
          <ThreeMfToStlWorkspace onNavigate={onNavigate} />
        ) : toolSlug === 'email-viewer' || toolSlug === 'eml-viewer' || toolSlug === 'mbox-viewer' ? (
          <EmailViewerWorkspace onNavigate={onNavigate} />
        ) : toolSlug === 'winmail-extractor' ? (
          <WinmailExtractorWorkspace onNavigate={onNavigate} />
        ) : toolSlug === 'msg-to-eml' ? (
          <MsgToEmlWorkspace onNavigate={onNavigate} />
        ) : toolSlug === 'eml-to-pdf' ? (
          <EmlToPdfWorkspace onNavigate={onNavigate} />
        ) : toolSlug === 'file-identifier' || toolSlug === 'file-analyzer' ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-5">
            <Cpu className="w-12 h-12 text-blue-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                File Analyzer & Magic Byte Identifier
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Inspect binary headers, verify MIME types, detect malware disguises, and examine entropy locally in browser RAM.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ view: 'file-identifier' })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Full File Analyzer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : toolSlug === 'metadata-viewer' ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-5">
            <FileCode className="w-12 h-12 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Metadata Viewer & EXIF Inspector
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Read camera tags, GPS coordinates, author history, and embedded color profiles without uploading files.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ view: 'metadata-viewer' })}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Open Metadata Viewer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : toolSlug === 'remove-metadata' ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-5">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Privacy Metadata Stripper
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Strip GPS coordinates, device serial numbers, and author tags from images and documents locally in browser RAM.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ view: 'remove-metadata' })}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Metadata Scrubber</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : toolSlug === 'hash-generator' ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-5">
            <Cpu className="w-12 h-12 text-indigo-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Cryptographic Hash Generator
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Generate SHA-256, SHA-512, SHA-384, SHA-1, MD5, and CRC-32 checksums locally with the Web Crypto API.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ view: 'hash-generator' })}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Hash Generator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : toolSlug === 'checksum-verifier' ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-5">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Download Checksum Verifier
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Compare ISO and software installer checksums against publisher signatures to detect file tampering and corruption.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ view: 'checksum-verifier' })}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Checksum Verifier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : toolSlug === 'magic-byte-detector' ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-5">
            <FileCode className="w-12 h-12 text-blue-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Magic Byte Binary Signature Detector
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Detect file spoofing and inspect raw binary hex headers to uncover disguised executables and scripts.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ view: 'magic-byte-detector' })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Magic Byte Detector</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : toolSlug === 'mime-checker' ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-5">
            <Layers className="w-12 h-12 text-indigo-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                MIME Type & Extension Lookup Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Query standard IANA Content-Types, HTTP headers, and MIME mappings for over 500+ file extensions.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ view: 'mime-checker' })}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch MIME Checker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : converterPair ? (
          <div className="space-y-6">
            <ConverterUploadBox pair={converterPair} />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4">
            <Cpu className="w-12 h-12 text-blue-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Interactive Workspace Active
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              This utility processes files locally inside your browser memory.
            </p>
            {primaryExt && primaryExt !== '*' && (
              <button
                onClick={() => onNavigate({ view: 'file-analyzer' })}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Launch File Intelligence Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Connected Knowledge Graph Integration Bar */}
      {tool && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block">
                AnyFileX Knowledge Graph Integration
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <span>Connected File Formats & Intelligence</span>
              </h3>
            </div>

            <button
              onClick={() => onNavigate({ view: 'file-analyzer' })}
              className="px-3.5 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs rounded-xl border border-blue-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Inspect with File Analyzer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Formats */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Supported Input Formats
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tool.supportedInputFormats.map((ext) => (
                  <button
                    key={ext}
                    onClick={() => ext !== '*' && onNavigate({ view: 'extension-detail', ext: ext.toLowerCase() })}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white/10 hover:bg-blue-600/60 text-blue-200 border border-white/10 transition-colors cursor-pointer"
                  >
                    .{ext.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Output Formats */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Target Output Formats
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tool.supportedOutputFormats.map((ext) => (
                  <button
                    key={ext}
                    onClick={() => ext !== '*' && onNavigate({ view: 'extension-detail', ext: ext.toLowerCase() })}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white/10 hover:bg-emerald-600/60 text-emerald-200 border border-white/10 transition-colors cursor-pointer"
                  >
                    .{ext.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparisons & Guides */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Related Comparisons & Guides
              </span>
              <div className="space-y-1.5">
                {tool.comparisonSlugs && tool.comparisonSlugs.length > 0 ? (
                  tool.comparisonSlugs.map((slug) => (
                    <button
                      key={slug}
                      onClick={() => onNavigate({ view: 'comparison-detail', slug })}
                      className="text-xs font-semibold text-slate-300 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer truncate"
                    >
                      <ArrowRight className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>Compare {slug.replace(/-/g, ' ').toUpperCase()}</span>
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => onNavigate({ view: 'compare-hub' })}
                    className="text-xs font-semibold text-slate-300 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-blue-400" />
                    <span>Explore Format Comparisons</span>
                  </button>
                )}

                {tool.howToOpenSlugs && tool.howToOpenSlugs.length > 0 && (
                  tool.howToOpenSlugs.map((ext) => (
                    <button
                      key={ext}
                      onClick={() => onNavigate({ view: 'how-to-open', ext })}
                      className="text-xs font-semibold text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer truncate"
                    >
                      <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>How to Open .{ext.toUpperCase()}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Step How to Use Guide */}
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
          How to Use the {effectiveName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {defaultSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3 relative"
            >
              <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-sm flex items-center justify-center border border-blue-100 dark:border-blue-900">
                {idx + 1}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Architecture & Privacy Explanation Section */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
            Technical Architecture
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Client-Side Browser Processing Engine
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>How In-Browser Transformation Works</span>
            </h4>
            <p>
              {tool?.technicalDetails ||
                'AnyFileX tools utilize modern web standards including HTML5 Canvas 2D contexts, WebAssembly (WASM), and the Web Crypto API to decompress, transcode, and package files entirely within your local device memory.'}
            </p>
            <p>
              Unlike legacy online converters that transmit entire files to third-party cloud servers, our architecture prevents network bottlenecks, provides near-instant processing, and eliminates cloud wait queues.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero-Knowledge Privacy Guarantee</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Files never upload to remote servers or cloud storage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Temporary byte arrays in RAM are discarded upon tab close</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>No account registration or personal email required</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
          Frequently Asked Questions
        </h2>
        <FAQAccordion faqs={defaultFaqs} />
      </div>

      {/* Related Tools Grid */}
      {relatedTools.length > 0 && (
        <div className="max-w-5xl mx-auto space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Related File Utilities
            </h2>
            <button
              onClick={() => onNavigate({ view: 'tools' })}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((relTool) => (
              <div
                key={relTool.slug}
                onClick={() => onNavigate({ view: 'tool-detail', slug: relTool.slug } as any)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {relTool.categoryLabel}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {relTool.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {relTool.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
