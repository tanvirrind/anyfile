import React, { useState, useEffect } from 'react';
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
  Eye
} from 'lucide-react';
import { AppRoute, FileTypeInfo } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { TOCSidebar } from '../components/TOCSidebar';
import { FAQAccordion } from '../components/FAQAccordion';
import { Badge } from '../components/Badge';
import { SchemaMarkupView } from '../components/SchemaMarkupView';
import { SEOHead } from '../components/SEOHead';
import { AutoInternalLinks } from '../components/AutoInternalLinks';
import { ReadingProgressBar } from '../components/ReadingProgressBar';
import { ExtensionQuickFactsCard } from '../components/extension/ExtensionQuickFactsCard';
import { ExtensionHowToOpenSection } from '../components/extension/ExtensionHowToOpenSection';
import { ExtensionSoftwareGrid } from '../components/extension/ExtensionSoftwareGrid';
import { ExtensionSecurityCard } from '../components/extension/ExtensionSecurityCard';
import { ExtensionLiveViewer } from '../components/extension/ExtensionLiveViewer';
import { ExtensionTopicalAuthority } from '../components/extension/ExtensionTopicalAuthority';
import { getOrGenerateExtensionInfo } from '../lib/seo/extensionGenerator';
import { generateExtensionSchema, generateExtensionFAQs } from '../lib/seo/faqGenerator';
import { POPULAR_FILE_TYPES } from '../data/fileTypesData';
import { getBestComparisonForExtension } from '../lib/database/knowledgeGraph';

interface ExtensionDetailPageProps {
  ext: string;
  onNavigate: (route: AppRoute) => void;
}

export const ExtensionDetailPage: React.FC<ExtensionDetailPageProps> = ({ ext, onNavigate }) => {
  const [activeToc, setActiveToc] = useState('quick-facts');
  const [copiedExt, setCopiedExt] = useState(false);
  const [shared, setShared] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic extension lookup supporting 50,000+ extension pages
  const item: FileTypeInfo = getOrGenerateExtensionInfo(ext);

  // Calculate popularity score (1 to 100) deterministically
  const getPopularityScore = (extName: string) => {
    const populars = ['JPG', 'JPEG', 'PNG', 'PDF', 'DOCX', 'ZIP', 'MP4', 'MP3', 'HEIC', 'SVG', 'XLSX', 'EXE'];
    if (populars.includes(extName.toUpperCase())) return 96;
    let sum = 0;
    for (let i = 0; i < extName.length; i++) sum += extName.charCodeAt(i);
    return 60 + (sum % 35);
  };

  const popularityScore = getPopularityScore(item.extension);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Copy extension button action
  const handleCopyExt = () => {
    navigator.clipboard.writeText(`.${item.extension.toLowerCase()}`);
    setCopiedExt(true);
    showToast(`Copied .${item.extension.toLowerCase()} to clipboard!`);
    setTimeout(() => setCopiedExt(false), 2000);
  };

  // Share action button
  const handleShare = async () => {
    const url = window.location.href;
    const title = `.${item.extension} File Extension Reference & Specifications`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(url);
    setShared(true);
    showToast('Page link copied to clipboard!');
    setTimeout(() => setShared(false), 2000);
  };

  // Print page button
  const handlePrint = () => {
    window.print();
  };

  const bestComparison = getBestComparisonForExtension(item.extension, item.category);

  const tocItems = [
    { id: 'quick-facts', label: '1. Quick Facts & Specs' },
    { id: 'live-viewer', label: `2. Online .${item.extension} Viewer` },
    { id: 'what-is-format', label: `3. What is .${item.extension}?` },
    { id: 'how-to-open-os-guide', label: '4. How to Open Across OS' },
    { id: 'supported-software', label: '5. Recommended Software' },
    { id: 'conversions-hub', label: '6. Conversion Options' },
    { id: 'mime-types', label: '7. MIME Types & Headers' },
    { id: 'magic-bytes', label: '8. Magic Bytes & Forensics' },
    { id: 'format-comparison', label: `9. .${item.extension} vs .${bestComparison.targetExt}` },
    { id: 'compatibility-matrix', label: '10. Compatibility Matrix' },
    { id: 'repair-methods', label: '11. Common Errors & Repair' },
    { id: 'security-notes', label: '12. Security & Safety' },
    { id: 'faq', label: '13. Frequently Asked Questions' },
    { id: 'related-extensions', label: '14. Related Extensions' },
    { id: 'related-guides', label: '15. Related Guides & Comparisons' },
    { id: 'schema-markup', label: '16. Schema JSON-LD' },
  ];

  // Smooth scroll handler
  const handleTocSelect = (id: string) => {
    setActiveToc(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scroll spy effect to highlight active section in TOC while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(tocItems[i].id);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveToc(tocItems[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Schema.org JSON-LD structured data for SEO
  const canonicalPath = `/extension/${item.extension.toLowerCase()}`;
  const canonicalUrl = `https://anyfilex.com${canonicalPath}`;
  const faqs = generateExtensionFAQs(item);

  // Complete Schema Graph combining BreadcrumbList, TechArticle, SoftwareApplication, FAQPage, WebPage
  const fullSchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: `.${item.extension} File Extension - How to Open, Convert & Repair`,
        description: item.description,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://anyfilex.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Extensions',
              item: 'https://anyfilex.com/extensions',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: `.${item.extension}`,
              item: canonicalUrl,
            },
          ],
        },
      },
      ...generateExtensionSchema(item, canonicalUrl)['@graph'],
    ],
  };

  // Find related extensions in same category
  const relatedExts = POPULAR_FILE_TYPES.filter(
    (f) => f.category === item.category && f.extension !== item.extension
  ).slice(0, 8);

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Reading Progress Bar */}
      <ReadingProgressBar />

      <SEOHead
        title={`.${item.extension} File Extension - How to Open, Convert & Repair (${item.name})`}
        description={item.description}
        canonicalPath={canonicalPath}
        schemaData={fullSchemaGraph}
      />

      {/* Inline Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs Navigation */}
      <Breadcrumb
        items={[
          { label: 'Extensions', route: { view: 'extensions' } },
          { label: item.category, route: { view: 'extensions' } },
          { label: `.${item.extension}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Section - Stripe & Notion Documentation Inspired Design */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative overflow-hidden">
        {/* Subtle decorative background gradient accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              {/* Monospace Large Extension Tag */}
              <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 px-4 py-2 rounded-2xl">
                <span className="text-2xl sm:text-3xl font-mono font-black text-blue-600 dark:text-blue-400">
                  .{item.extension.toLowerCase()}
                </span>
                <button
                  onClick={handleCopyExt}
                  className="p-1 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                  title="Copy extension"
                  id="hero-copy-ext-btn"
                >
                  {copiedExt ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="blue">{item.category}</Badge>
                <Badge variant={item.dangerRating === 'Low Risk' ? 'emerald' : 'amber'}>
                  {item.dangerRating}
                </Badge>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                  <span>{popularityScore}/100 Popularity</span>
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              .{item.extension} File Extension Reference
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.detailedOverview || item.description}
            </p>
          </div>

          {/* Secondary Action Toolbar */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Share Page"
              id="hero-share-btn"
            >
              {shared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-slate-500" />}
              <span className="hidden sm:inline">{shared ? 'Shared' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Print Documentation"
              id="hero-print-btn"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* Primary Action Button Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => handleTocSelect('live-viewer')}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2"
            id="primary-action-view-btn"
          >
            <Eye className="w-4 h-4" />
            <span>Open .{item.extension} in Viewer</span>
          </button>

          <button
            onClick={() => handleTocSelect('how-to-open-os-guide')}
            className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            id="primary-action-open-btn"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>How to Open (OS Guide)</span>
          </button>

          <button
            onClick={() => onNavigate({ view: 'format-guide', format: item.extension.toLowerCase() })}
            className="px-5 py-3 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            id="primary-action-format-guide-btn"
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>What Is .{item.extension}? Guide</span>
          </button>

          <button
            onClick={() => handleTocSelect('conversions-hub')}
            className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            id="primary-action-convert-btn"
          >
            <RefreshCw className="w-4 h-4 text-blue-500" />
            <span>Convert .{item.extension}</span>
          </button>

          <button
            onClick={() => handleTocSelect('magic-bytes')}
            className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            id="primary-action-inspect-header-btn"
          >
            <FileCode className="w-4 h-4 text-indigo-500" />
            <span>Magic Bytes & Hex</span>
          </button>

          <button
            onClick={() => handleTocSelect('format-comparison')}
            className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            id="primary-action-compare-btn"
          >
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>.{item.extension} vs .{bestComparison.targetExt}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout with Sticky TOC Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky Sidebar Table of Contents */}
        <div className="lg:col-span-1">
          <TOCSidebar
            items={tocItems}
            activeId={activeToc}
            onSelect={handleTocSelect}
            title="On This Page"
          />
        </div>

        {/* Content Column */}
        <div className="lg:col-span-3 space-y-10">
          {/* Section 1: Quick Facts Card */}
          <section id="quick-facts" className="scroll-mt-24">
            <ExtensionQuickFactsCard item={item} />
          </section>

          {/* Section 2: Online In-Browser Live Viewer */}
          <section id="live-viewer" className="scroll-mt-24">
            <ExtensionLiveViewer item={item} onNavigate={onNavigate} />
          </section>

          {/* Section 3-10: Deep Topical Authority (What is, How to Open, Conversions, MIME, Magic Bytes, Comparison, Compatibility) */}
          <ExtensionTopicalAuthority item={item} onNavigate={onNavigate} />

          {/* Section 5: Recommended Software */}
          <section id="supported-software" className="scroll-mt-24">
            <ExtensionSoftwareGrid
              apps={item.popularApps}
              extensionName={item.extension}
              onNavigate={onNavigate}
            />
          </section>

          {/* Section 11: Common Errors & Repair Methods */}
          <section
            id="repair-methods"
            className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Common Errors & Troubleshooting .{item.extension} Files
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                Troubleshooting
              </span>
            </div>

            {item.repairTips && item.repairTips.length > 0 ? (
              <div className="space-y-3">
                {item.repairTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-500">
                If your .{item.extension} file displays an "Unrecognized Format" or "Corrupt File Header" error, inspect its magic byte header or run file repair.
              </p>
            )}
          </section>

          {/* Section 12: Security Information */}
          <section id="security-notes" className="scroll-mt-24">
            <ExtensionSecurityCard item={item} />
          </section>

          {/* Section 13: Frequently Asked Questions */}
          <section id="faq" className="scroll-mt-24">
            <FAQAccordion faqs={faqs} />
          </section>

          {/* Section 9: Related Extensions */}
          <section id="related-extensions" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Related {item.category} Extensions
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Category Formats</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedExts.map((rel) => (
                <button
                  key={rel.extension}
                  onClick={() => onNavigate({ view: 'extension-detail', ext: rel.extension.toLowerCase() })}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30 text-left transition-all cursor-pointer group space-y-1"
                >
                  <div className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center justify-between">
                    <span>.{rel.extension}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{rel.name}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Section 10: Related Guides & Comparisons */}
          <section id="related-guides" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Related Guides & Format Comparisons
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Knowledge Base</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => onNavigate({ view: 'comparison-detail', slug: bestComparison.slug })}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/30 transition-all cursor-pointer group space-y-2"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  .{item.extension} vs .{bestComparison.targetExt} Comparison
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {bestComparison.highlight}
                </p>
              </div>

              <div
                onClick={() => onNavigate({ view: 'blog-detail', id: 'how-to-open-unknown-files' })}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/30 transition-all cursor-pointer group space-y-2"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  How to Open Unknown File Extensions Safely
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Step-by-step security guide on magic byte analysis, sandboxed file viewing, and resolving unknown extension errors.
                </p>
              </div>
            </div>
          </section>

          {/* Section 11: Schema.org JSON-LD Metadata Inspector */}
          <section id="schema-markup" className="scroll-mt-24">
            <SchemaMarkupView schemaData={fullSchemaGraph} />
          </section>
        </div>
      </div>

      {/* Internal SEO Interlinking Knowledge Graph */}
      <AutoInternalLinks currentExt={item} onNavigate={onNavigate} />
    </div>
  );
};
