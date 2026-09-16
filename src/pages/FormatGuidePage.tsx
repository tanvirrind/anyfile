import React, { useState, useEffect, useRef } from 'react';
import {
  FileCode,
  ShieldCheck,
  Zap,
  Download,
  Share2,
  RefreshCw,
  Wrench,
  Check,
  Copy,
  Printer,
  Monitor,
  Smartphone,
  ExternalLink,
  Code,
  ArrowRight,
  Sparkles,
  Laptop,
  Layers,
  HelpCircle,
  BarChart3,
  BookOpen,
  ChevronRight,
  Info,
  Eye,
  AlertTriangle,
  FileCheck,
  Cpu,
  Compass,
  FileSpreadsheet,
  FileArchive,
  Film,
  Music,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { TOCSidebar } from '../components/TOCSidebar';
import { FAQAccordion } from '../components/FAQAccordion';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import { ReadingProgressBar } from '../components/ReadingProgressBar';
import { getOrGenerateFormatGuide, FormatGuideData } from '../lib/guides/formatGuideEngine';

interface FormatGuidePageProps {
  format: string;
  onNavigate: (route: AppRoute) => void;
}

export const FormatGuidePage: React.FC<FormatGuidePageProps> = ({ format, onNavigate }) => {
  const [activeToc, setActiveToc] = useState('sec-what-is');
  const [copiedMime, setCopiedMime] = useState(false);
  const [copiedExt, setCopiedExt] = useState(false);
  const [shared, setShared] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedOsTab, setSelectedOsTab] = useState<'all' | 'windows' | 'mac' | 'linux' | 'mobile'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const guide: FormatGuideData = getOrGenerateFormatGuide(format);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyMime = () => {
    navigator.clipboard.writeText(guide.mimeType);
    setCopiedMime(true);
    showToast(`Copied MIME type: ${guide.mimeType}`);
    setTimeout(() => setCopiedMime(false), 2000);
  };

  const handleCopyExt = () => {
    navigator.clipboard.writeText(guide.fileExtensionDetails.primaryExt);
    setCopiedExt(true);
    showToast(`Copied ${guide.fileExtensionDetails.primaryExt} to clipboard`);
    setTimeout(() => setCopiedExt(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = guide.seoMeta.title;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        // Fallback
      }
    }
    navigator.clipboard.writeText(url);
    setShared(true);
    showToast('Guide link copied to clipboard!');
    setTimeout(() => setShared(false), 2000);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onNavigate({ view: 'file-analyzer' });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onNavigate({ view: 'file-analyzer' });
    }
  };

  // Table of Contents definition
  const tocItems = [
    { id: 'sec-what-is', label: `1. What Is a ${guide.format} File?` },
    { id: 'sec-extension', label: '2. Extension & Naming' },
    { id: 'sec-mime', label: '3. MIME Content Types' },
    { id: 'sec-use-cases', label: '4. Primary Use Cases' },
    { id: 'sec-characteristics', label: '5. Technical Characteristics' },
    { id: 'sec-deep-dive', label: '6. Architecture & Specs' },
    { id: 'sec-advantages', label: '7. Advantages' },
    { id: 'sec-limitations', label: '8. Limitations' },
    { id: 'sec-compatibility', label: '9. OS Compatibility Matrix' },
    { id: 'sec-software', label: '10. Compatible Software' },
    { id: 'sec-related', label: '11. Related Formats' },
    { id: 'sec-conversions', label: '12. Conversion Options' },
    { id: 'sec-identification', label: '13. Binary Identification' },
    { id: 'sec-analyzer', label: '14. Interactive Analyzer' },
    { id: 'sec-tools', label: '15. Relevant AnyFileX Tools' },
    { id: 'sec-faqs', label: '16. Frequently Asked Questions' }
  ];

  const handleTocSelect = (id: string) => {
    setActiveToc(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const secEl = document.getElementById(tocItems[i].id);
        if (secEl && scrollPosition >= secEl.offsetTop) {
          setActiveToc(tocItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [guide.format]);

  // Schema.org Structured Data
  const schemaGraph = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      '@id': `${guide.seoMeta.canonical}#article`,
      headline: guide.seoMeta.h1,
      description: guide.seoMeta.description,
      inLanguage: 'en-US',
      mainEntityOfPage: guide.seoMeta.canonical,
      author: {
        '@type': 'Organization',
        name: 'AnyFileX Technical Research Team',
        url: 'https://anyfilex.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'AnyFileX',
        url: 'https://anyfilex.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://anyfilex.com/favicon.svg'
        }
      },
      about: {
        '@type': 'ComputerLanguage',
        name: `${guide.format} File Format`,
        alternateName: guide.fullName
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${guide.seoMeta.canonical}#faq`,
      mainEntity: guide.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  ];

  const filteredSoftware = guide.softwareList.filter(s => {
    if (selectedOsTab === 'all') return true;
    if (selectedOsTab === 'windows') return s.supportedOS.includes('windows');
    if (selectedOsTab === 'mac') return s.supportedOS.includes('mac');
    if (selectedOsTab === 'linux') return s.supportedOS.includes('linux');
    if (selectedOsTab === 'mobile') return s.supportedOS.includes('android') || s.supportedOS.includes('ios');
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased pb-24">
      <SEOHead
        title={guide.seoMeta.title}
        description={guide.seoMeta.description}
        canonicalPath={`/format/${guide.slug}`}
        schemaData={schemaGraph}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Format Guides', path: '/guides' },
          { name: `${guide.format} Guide`, path: `/format/${guide.slug}` }
        ]}
      />

      <ReadingProgressBar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          {toastMessage}
        </div>
      )}

      {/* Hero Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: 'Home', route: { view: 'home' } },
              { label: 'Format Guides', route: { view: 'guides' } },
              { label: `What Is a ${guide.format} File?` }
            ]}
            onNavigate={onNavigate}
          />

          <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-950/60 text-primary-800 dark:text-primary-300 font-mono text-sm font-bold rounded-md border border-primary-300 dark:border-primary-800">
                  .{guide.slug}
                </span>
                <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                  {guide.category}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Standardized Spec
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                What Is a <span className="text-primary-600 dark:text-primary-400">{guide.format}</span> File?
              </h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                {guide.fullName} — Comprehensive technical specifications, compatibility breakdown, binary signatures, and software directory.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyMime}
                id="btn-copy-mime"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                title="Copy MIME type"
              >
                {copiedMime ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{guide.mimeType}</span>
              </button>

              <button
                onClick={handleShare}
                id="btn-share-guide"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button
                onClick={() => onNavigate({ view: 'file-analyzer' })}
                id="btn-hero-inspect"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Inspect in Analyzer</span>
              </button>
            </div>
          </div>

          {/* Quick Fact Key Value Badges */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Standard Extension</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">{guide.fileExtensionDetails.primaryExt}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Standards Body</span>
              <span className="font-medium text-slate-900 dark:text-white mt-0.5 block truncate" title={guide.developer}>{guide.developer}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Initial Release</span>
              <span className="font-medium text-slate-900 dark:text-white mt-0.5 block">{guide.initialRelease}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Typical File Size</span>
              <span className="font-medium text-slate-900 dark:text-white mt-0.5 block">{guide.typicalFileSizeRange}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Danger / Risk Level</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{guide.fileIdentification.dangerRating}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Standardization</span>
              <span className="font-medium text-slate-900 dark:text-white mt-0.5 block truncate" title={guide.standardization}>{guide.standardization}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid with Sticky TOC */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Sticky Table of Contents */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <TOCSidebar
                items={tocItems}
                activeId={activeToc}
                onSelect={handleTocSelect}
              />

              {/* In-TOC Quick Analyzer Widget */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  <span>Have a .{guide.slug} file?</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                  Drop it into the AnyFileX Analyzer to inspect true magic bytes and metadata in browser.
                </p>
                <button
                  onClick={() => onNavigate({ view: 'file-analyzer' })}
                  className="w-full py-2 px-3 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Launch Analyzer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Full Authoritative Guide Body */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* 1. What Is a [FORMAT] File? */}
            <section id="sec-what-is" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    1. What Is a {guide.format} File?
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Definition & Core Concepts</span>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-base leading-relaxed space-y-4">
                <p>{guide.whatIsOverview}</p>
                <p className="text-sm bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                  <strong>Summary:</strong> {guide.summary}
                </p>
              </div>
            </section>

            {/* 2. Extension & Naming Details */}
            <section id="sec-extension" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    2. File Extension & Naming Conventions
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Suffixes, Dot Notation & Systems</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/70 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Primary Extension</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-lg font-mono font-bold text-primary-600 dark:text-primary-400">
                      {guide.fileExtensionDetails.primaryExt}
                    </span>
                    <button
                      onClick={handleCopyExt}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedExt ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    The standard suffix recognized by OS file dispatchers and desktop environments.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/70 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Alternative Aliases</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {guide.fileExtensionDetails.alternativeExts.length > 0 ? (
                      guide.fileExtensionDetails.alternativeExts.map(alt => (
                        <span key={alt} className="px-2 py-0.5 bg-white dark:bg-slate-700 font-mono text-xs font-medium rounded border border-slate-200 dark:border-slate-600">
                          {alt}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">None (Strict single extension standard)</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    {guide.fileExtensionDetails.dosOrigin || 'Case-insensitive in Windows and macOS; preserved on Linux.'}
                  </p>
                </div>
              </div>
            </section>

            {/* 3. MIME Content Types */}
            <section id="sec-mime" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    3. Official MIME Types & HTTP Headers
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">IANA Standards & Server Configuration</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  When served across web servers, APIs, or email attachments, the format is identified via its official IANA MIME content-type:
                </p>

                <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs flex items-center justify-between border border-slate-800">
                  <span className="text-emerald-400 font-semibold">{guide.mimeTypeDetails.headerSample}</span>
                  <button
                    onClick={handleCopyMime}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                    title="Copy Header"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">Standard Specification</span>
                    <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{guide.mimeTypeDetails.rfcStandard || 'IANA Standard Content-Type'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">HTTP Compression Filter</span>
                    <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">Pass-through / Direct Stream (Pre-compressed)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Primary Use Cases */}
            <section id="sec-use-cases" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    4. What Is the {guide.format} Format Used For?
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Industry Applications & Workflows</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {guide.primaryUseCases.map((useCase, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/70 dark:border-slate-800 flex items-start gap-3">
                    <div className="p-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 rounded-full mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{useCase}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Main Characteristics (Category Adaptive) */}
            <section id="sec-characteristics" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    5. Main Characteristics of {guide.format}
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Key Architectural Properties</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {guide.characteristics.map((char, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{char.title}</span>
                        {char.badge && (
                          <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-[10px] font-bold rounded">
                            {char.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{char.value}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{char.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Technical Deep Dive */}
            <section id="sec-deep-dive" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    6. Technical Architecture & Specifications
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Binary Layout, Atoms & Packaging</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{guide.technicalDeepDive.heading}</h3>
                <p className="leading-relaxed">{guide.technicalDeepDive.description}</p>

                <div className="space-y-2 mt-4">
                  {guide.technicalDeepDive.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {guide.technicalDeepDive.architectureSnippet && (
                  <div className="mt-4 p-4 bg-slate-950 text-slate-200 rounded-lg font-mono text-xs border border-slate-800 overflow-x-auto">
                    <span className="text-slate-500 block mb-1">// Binary Header Signature Layout</span>
                    <code>{guide.technicalDeepDive.architectureSnippet}</code>
                  </div>
                )}
              </div>
            </section>

            {/* 7. Advantages */}
            <section id="sec-advantages" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    7. Advantages & Key Benefits
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Why Use This Format</span>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {guide.advantages.map((adv, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40 flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-800 dark:text-slate-200 leading-snug">{adv}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. Limitations */}
            <section id="sec-limitations" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    8. Limitations & Engineering Trade-Offs
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Known Constraints & Compatibility Gotchas</span>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {guide.limitations.map((lim, idx) => (
                  <div key={idx} className="p-4 bg-rose-50/40 dark:bg-rose-950/20 rounded-lg border border-rose-200/60 dark:border-rose-900/40 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-800 dark:text-slate-200 leading-snug">{lim}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. OS Compatibility Matrix */}
            <section id="sec-compatibility" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-lg">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    9. Operating System Compatibility Matrix
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Windows, macOS, Linux, iOS & Android</span>
                </div>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Platform</th>
                      <th className="py-3 px-4">Support Status</th>
                      <th className="py-3 px-4">Default Native Viewer</th>
                      <th className="py-3 px-4">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {guide.osCompatibility.map((os, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{os.osName}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                            os.supported
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}>
                            {os.supported ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            {os.statusText}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-700 dark:text-slate-300">{os.nativeApp}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">{os.setupInstructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 10. Software that Opens It */}
            <section id="sec-software" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      10. Verified Software That Opens {guide.format}
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Desktop & Mobile Applications</span>
                  </div>
                </div>

                {/* OS Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
                  {(['all', 'windows', 'mac', 'linux', 'mobile'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSelectedOsTab(tab)}
                      className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                        selectedOsTab === tab
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSoftware.map((soft) => (
                  <div
                    key={soft.id}
                    onClick={() => onNavigate({ view: 'software-detail', id: soft.routeId })}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-600">
                          {soft.priceType}
                        </span>
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                          ★ {soft.rating.toFixed(1)}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {soft.name}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">{soft.developer}</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500 capitalize">{soft.supportedOS.join(', ')}</span>
                      <span className="text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 11. Related Formats & Comparisons */}
            <section id="sec-related" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    11. Related Formats & Head-to-Head Comparisons
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Format Family Tree & Benchmarks</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {guide.relatedFormats.comparisons.map((comp) => (
                  <div
                    key={comp.slug}
                    onClick={() => onNavigate({ view: 'comparison-detail', slug: comp.slug })}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {comp.title}
                      </span>
                      <span className="text-xs text-primary-600 font-semibold flex items-center gap-1">
                        Compare <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {comp.highlight}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 12. Conversion Options */}
            <section id="sec-conversions" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    12. {guide.format} Conversion Options & Matrix
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Convert to Universal Standards In Browser</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {guide.conversions.map((conv) => (
                  <div
                    key={conv.converterSlug}
                    onClick={() => onNavigate({ view: 'converter-detail', id: conv.converterSlug })}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded">
                          {conv.difficulty}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {conv.quality}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {conv.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {conv.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-primary-600 dark:text-primary-400 font-semibold">
                      <span>Launch Converter</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 13. File Identification & Binary Signature */}
            <section id="sec-identification" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    13. How to Identify a True {guide.format} File
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Magic Bytes Hex Signature & Security Audit</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  To verify that a file is genuinely a .{guide.slug} file and not a renamed executable or disguised malware, security engines inspect the file header's unique magic bytes:
                </p>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span>Byte Offset: {guide.fileIdentification.byteOffset}</span>
                    <span>Format: {guide.format}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <span className="text-emerald-400 font-bold text-sm">{guide.fileIdentification.magicBytesHex}</span>
                    <span className="text-slate-400 text-xs">ASCII: {guide.fileIdentification.magicBytesAscii}</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <span className="font-bold text-amber-900 dark:text-amber-300 block">Security Verification Advice</span>
                    <p>{guide.fileIdentification.spoofingWarning}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 14. Interactive In-Browser AnyFileX Analyzer */}
            <section id="sec-analyzer" className="bg-gradient-to-br from-primary-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-white/10 text-primary-300 rounded-lg">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    14. AnyFileX In-Browser {guide.format} Analyzer
                  </h2>
                  <span className="text-xs text-primary-200 font-mono">100% Client-Side Inspection & Diagnostic Forensics</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Drag and drop your .{guide.slug} file below to inspect headers, decode EXIF/metadata, extract hashes, and check for corruption directly in your browser. Zero bytes are uploaded to remote servers.
              </p>

              {/* Interactive Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-primary-400 bg-white/5 hover:bg-white/10 p-8 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="p-3 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold block text-white">Drop your .{guide.slug} file here to inspect</span>
                  <span className="text-xs text-slate-400 mt-1 block">Or click to select from your device</span>
                </div>
              </div>
            </section>

            {/* 15. Relevant AnyFileX Tools */}
            <section id="sec-tools" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-lg">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    15. Relevant AnyFileX Tools for {guide.format}
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Specialized In-Browser Utilities</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {guide.relevantTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => onNavigate({ view: 'tool-detail', slug: tool.slug })}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-500">{tool.category}</span>
                        <span className="text-xs text-primary-600 font-semibold flex items-center gap-1">
                          Open <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 16. Frequently Asked Questions */}
            <section id="sec-faqs" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    16. Frequently Asked Questions
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Expert Answers & Troubleshooting</span>
                </div>
              </div>

              <FAQAccordion faqs={guide.faqs} />
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};
