/**
 * Dynamic URL & SEO Metadata Engine for AnyFileX
 * 
 * Generates dynamic, high-ranking SEO titles, meta descriptions, OpenGraph tags,
 * Breadcrumb schemas, and structured data dynamically extracted from URL structures
 * and route parameters (extensions, converters, tools, guides, software, categories, MIME types, comparisons).
 */

import { AppRoute } from '../../types';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { getExtensionInfo } from '../seo/extensionGenerator';
import { resolveConverterPair } from '../converter/registry';
import { getOrGenerateSoftwareInfo } from '../database/softwareEngine';
import { REPAIR_GUIDES } from '../../data/repairData';
import { GUIDES_LIST, BLOG_POSTS } from '../../data/guidesData';
import { CATEGORIES_LIST } from '../../data/categoriesData';
import { getOrGenerateComparison } from '../seo/comparisonGenerator';
import { getOrGenerateFormatGuide } from '../guides/formatGuideEngine';
import { getHowToOpenGuide } from '../guides/howToOpenEngine';
import { getConversionAuthorityGuide } from '../guides/conversionGuideEngine';
import { BreadcrumbItemSchema } from '../../components/SEOHead';
import { getTechnicalGuide, getAllTechnicalGuides } from '../database/technicalAuthorityData';
import { getAllFileTypeInfos } from '../database/extensionEngine';
import { CURATED_COMPARISONS } from '../database/knowledgeGraph';
import { TROUBLESHOOTING_GUIDES } from '../database/troubleshootingData';
import { TOOLS_REGISTRY } from '../tools/toolsRegistry';
import { getAllSupportedConversionSlugs } from '../guides/conversionGuideEngine';
import { EXPANDED_MIME_DATABASE } from '../../data/expandedMimeDatabase';

const BASE_URL = 'https://www.anyfilex.com';

/**
 * CATEGORIES_LIST uses presentational names ("Images & Raster Graphics") while
 * extension records carry short labels ("Images"). Map category id -> extension
 * label so a category page's SSR directory can actually enumerate its formats.
 */
const CATEGORY_EXTENSION_LABEL: Record<string, string> = {
  images: 'Images',
  'cad-3d': 'CAD & 3D',
  documents: 'Documents',
  archives: 'Archives',
  'audio-video': 'Audio & Video',
  'code-data': 'Code & Data',
  'email-comm': 'Email & Comm',
  'system-executables': 'System & Executables',
  'medical-science': 'Medical & Science',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders a crawlable, linked directory section for SSR hub pages.
 * Hub templates otherwise expose only a handful of children, which leaves most
 * deep pages unreachable by crawlers (orphans) and keeps the server-rendered
 * HTML very thin. Every entry is a plain <a href> so it is always indexable.
 */
function ssrDirectory(heading: string, items: { href: string; label: string; note?: string }[]): string {
  if (!items.length) return '';
  const links = items
    .map((i) => `<li><a href="${i.href}">${escapeHtml(i.label)}</a>${i.note ? ` <span class="opacity-60 text-xs">${escapeHtml(i.note)}</span>` : ''}</li>`)
    .join('');
  return `
        <section class="anyfilex-ssr-directory mt-12">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">${escapeHtml(heading)}</h2>
          <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1.5 text-sm text-blue-600 dark:text-blue-400">${links}</ul>
        </section>
      `;
}

export interface DynamicPageMeta {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItemSchema[];
  ogType: 'website' | 'article';
  ogImage?: string;
  ogImageAlt?: string;
  robots?: string;
  statusCode?: number;
  specificSchemas: any[];
  prerenderedHtml: string;
}

// Tool metadata dictionary mapping tool names and descriptions dynamically
const TOOL_CONFIG: Record<string, { title: string; name: string; desc: string; keywords: string }> = {
  'file-identifier': {
    name: 'Universal File Identifier',
    title: 'File Identifier – Detect Unknown File Types',
    desc: 'Identify unknown or extensionless files using header magic bytes, signature heuristics, and binary structure analysis in browser.',
    keywords: 'file identifier, identify unknown file, detect file extension, magic byte detector',
  },
  'metadata-viewer': {
    name: 'EXIF & File Metadata Viewer',
    title: 'EXIF & Metadata Viewer – Inspect File Headers',
    desc: 'Extract embedded EXIF tags, GPS geotags, camera lens data, PDF author history, and audio ID3 metadata in browser memory.',
    keywords: 'exif viewer, metadata viewer, view photo metadata, pdf metadata inspector',
  },
  'remove-metadata': {
    name: 'Metadata Cleaner & Privacy Sanitizer',
    title: 'Remove Metadata & EXIF Tags – File Sanitizer',
    desc: 'Strip GPS coordinates, camera serials, author names, and tracking tags from photos and documents with zero server uploads.',
    keywords: 'remove exif, strip metadata, clean photo gps, sanitize document metadata',
  },
  'hash-generator': {
    name: 'Cryptographic Hash Generator',
    title: 'Hash Generator – Calculate SHA-256 & MD5',
    desc: 'Calculate SHA-256, SHA-512, MD5, SHA-1, and CRC32 cryptographic hashes directly in your browser using the Web Crypto API.',
    keywords: 'hash generator, calculate sha256, md5 hash online, file checksum calculator',
  },
  'checksum-verifier': {
    name: 'File Checksum Verifier',
    title: 'Checksum Verifier – Check File Integrity',
    desc: 'Verify downloaded file authenticity against official SHA-256, MD5, or SHA-1 hashes to prevent malware and corrupted transfers.',
    keywords: 'checksum verifier, verify sha256 hash, compare md5 hash, check file integrity',
  },
  'mime-checker': {
    name: 'MIME Type Checker & Validator',
    title: 'MIME Type Checker & Content-Type Validator',
    desc: 'Lookup and validate IANA standard MIME content-types, file extensions, and server HTTP headers across 50+ MIME types.',
    keywords: 'mime type checker, content-type lookup, iana mime types, http header validator',
  },
  'magic-byte-detector': {
    name: 'Magic Byte Forensics Inspector',
    title: 'Magic Byte Detector – Inspect Hex Signatures',
    desc: 'Examine raw hexadecimal file signatures, detect spoofed file extensions, and inspect binary magic byte headers in your browser.',
    keywords: 'magic byte detector, hex signature inspector, file header analyzer, byte forensics',
  },
};

/**
 * Derives comprehensive, contextual SEO metadata from any parsed route or URL structure.
 */
export function deriveDynamicMetadata(route: AppRoute, canonicalUrl: string): DynamicPageMeta {
  switch (route.view) {
    // ----------------------------------------------------
    // 0. HOME PAGE
    // ----------------------------------------------------
    case 'home': {
      const topChips = ['heic', 'dwg', 'pdf', 'psd', 'step', 'webp', 'zip', 'docx', 'json', 'svg'];
      return {
        statusCode: 200,
        title: 'AnyFileX – Universal File Format Intelligence & Tools',
        description: 'Inspect file formats, verify magic byte signatures, convert files in-browser, and view opening guides for 250+ file extensions.',
        breadcrumbs: [{ name: 'Home', path: '/' }],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-7xl mx-auto px-4 py-12">
            <header class="text-center max-w-3xl mx-auto mb-10">
              <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                Open, Convert & Inspect <span class="text-blue-600">Any File</span>
              </h1>
              <p class="text-lg text-slate-600 dark:text-slate-300">
                Universal file format intelligence, privacy-first in-memory converters, magic byte forensics, and technical specifications for 250+ digital file extensions.
              </p>

              <!-- Popular Extension Badges -->
              <div class="flex flex-wrap items-center justify-center gap-2 mt-6">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Popular Searches:</span>
                ${topChips.map((ext) => `
                  <a href="/file-extensions/${ext}" class="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs transition-colors">
                    .${ext.toUpperCase()}
                  </a>
                `).join('')}
              </div>
            </header>

            <!-- Feature Value Pillars -->
            <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">250+ File Formats</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">250+ curated specifications, IANA MIME mappings, magic byte signatures, and compatible software.</p>
                <a href="/file-extensions" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Explore Extensions &rarr;</a>
              </div>
              <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">100% In-Memory Conversion</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">Zero file uploads to external servers. WebAssembly image, document, and audio converters.</p>
                <a href="/converters" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Browse Converters &rarr;</a>
              </div>
              <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">File Forensics & Magic Bytes</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">Inspect binary header offsets, extract EXIF metadata, and verify cryptographic checksums.</p>
                <a href="/tools" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Open Forensic Tools &rarr;</a>
              </div>
              <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">OS Compatibility Matrices</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">Step-by-step opening guides for Windows, macOS, Linux, iOS, and Android.</p>
                <a href="/how-to-open" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">How-To-Open Guides &rarr;</a>
              </div>
            </section>

            <!-- Popular File Extensions Grid -->
            <section class="mb-16">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Popular File Extensions</h2>
                  <p class="text-sm text-slate-500 mt-1">Direct technical specifications, MIME types, and compatible applications</p>
                </div>
                <a href="/file-extensions" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  View All Formats &rarr;
                </a>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                ${POPULAR_FILE_TYPES.slice(0, 12).map((item) => `
                  <a href="/file-extensions/${item.extension.toLowerCase()}" class="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-xs group">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">.${item.extension}</span>
                      <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${item.category}</span>
                    </div>
                    <h3 class="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600">${item.name}</h3>
                    <p class="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">${item.description}</p>
                    <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 font-semibold">
                      <span>View Specifications</span>
                      <span>&rarr;</span>
                    </div>
                  </a>
                `).join('')}
              </div>
            </section>

            <!-- Browser-Based Forensic & Inspection Utilities -->
            <section class="mb-16">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Universal File Forensics & Utilities</h2>
                  <p class="text-sm text-slate-500 mt-1">Client-side WebAssembly tools with zero data uploaded to external servers</p>
                </div>
                <a href="/tools" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  All Utilities &rarr;
                </a>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <a href="/tools/file-identifier" class="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-xs">
                  <h3 class="font-bold text-slate-900 dark:text-white text-base mb-1">Magic Byte File Identifier</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">Identify unknown file extensions using true binary header magic bytes.</p>
                </a>
                <a href="/tools/metadata-viewer" class="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-xs">
                  <h3 class="font-bold text-slate-900 dark:text-white text-base mb-1">EXIF & Metadata Viewer</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">Extract camera metadata, GPS tags, ICC profiles, and document revisions.</p>
                </a>
                <a href="/tools/remove-metadata" class="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-xs">
                  <h3 class="font-bold text-slate-900 dark:text-white text-base mb-1">Metadata Privacy Stripper</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">Sanitize files before publishing by stripping sensitive embedded metadata.</p>
                </a>
                <a href="/tools/hash-generator" class="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-xs">
                  <h3 class="font-bold text-slate-900 dark:text-white text-base mb-1">Cryptographic Hash Generator</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">Compute SHA-256, MD5, and SHA-1 hashes directly with Web Crypto.</p>
                </a>
                <a href="/tools/checksum-verifier" class="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-xs">
                  <h3 class="font-bold text-slate-900 dark:text-white text-base mb-1">Checksum Integrity Verifier</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">Validate software downloads against published sha256 checksums.</p>
                </a>
                <a href="/tools/mime-checker" class="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-xs">
                  <h3 class="font-bold text-slate-900 dark:text-white text-base mb-1">MIME Type Directory & Checker</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">Verify Content-Type header strings and official IANA registrations.</p>
                </a>
              </div>
            </section>

            <!-- Latest Technical Guides -->
            <section class="mb-12">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Technical Guides & Tutorials</h2>
                  <p class="text-sm text-slate-500 mt-1">Deep-dive walkthroughs on format internals and digital forensics</p>
                </div>
                <a href="/guides" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  All Guides &rarr;
                </a>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                ${GUIDES_LIST.slice(0, 3).map((g) => `
                  <a href="/guides/${g.id}" class="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-xs">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 block">${g.category}</span>
                    <h3 class="font-bold text-slate-900 dark:text-white text-base line-clamp-2 mb-2">${g.title}</h3>
                    <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">${g.summary}</p>
                    <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-blue-600">
                      Read Full Guide &rarr;
                    </div>
                  </a>
                `).join('')}
              </div>
            </section>

            ${ssrDirectory('Explore the Full Directory', [
              { href: '/file-extensions', label: 'File Extensions' },
              { href: '/how-to-open', label: 'How to Open Files' },
              { href: '/converters', label: 'File Converters' },
              { href: '/compare', label: 'Format Comparisons' },
              { href: '/software', label: 'Software Directory' },
              { href: '/tools', label: 'Inspection Tools' },
              { href: '/guides', label: 'Guides & Tutorials' },
              { href: '/blog', label: 'Engineering Blog' },
              { href: '/troubleshoot', label: 'Repair Guides' },
              { href: '/security', label: 'Security & RFC Specs' },
              { href: '/workflows', label: 'Workflows' },
              { href: '/assistant', label: 'AI Assistant' },
              { href: '/about', label: 'About AnyFileX' },
              { href: '/contact', label: 'Contact' },
              ...CATEGORIES_LIST.map((c) => ({ href: `/category/${c.id}`, label: c.name })),
            ])}
          </div>
        `,
      };
    }

    // ----------------------------------------------------
    // 1. EXTENSION DETAIL (Dynamic per extension from URL)
    // ----------------------------------------------------
    case 'extension-detail': {
      const extRaw = (route.ext || '').trim().replace(/^\./, '').toLowerCase();
      const extUpper = extRaw.toUpperCase();
      const extInfo = getExtensionInfo(extRaw);

      // Handle unverified or non-existent extension: return HTTP 404 with noindex, nofollow
      if (!extInfo || extInfo.statusCode === 404 || extInfo.isVerified === false) {
        return {
          statusCode: 404,
          title: `404 – .${extUpper || 'UNKNOWN'} File Extension Not Found | AnyFileX`,
          description: `The file extension .${extUpper || 'UNKNOWN'} was not found in the AnyFileX verified catalog of standardized formats.`,
          robots: 'noindex, nofollow',
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'Extensions', path: '/file-extensions' },
            { name: `.${extUpper || 'Unknown'} (Not Found)`, path: `/file-extensions/${extRaw}` },
          ],
          ogType: 'website',
          specificSchemas: [],
          prerenderedHtml: `
            <div class="anyfilex-ssr-container max-w-3xl mx-auto px-4 py-16 text-center">
              <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">404 – Unknown File Extension .${escapeHtml(extUpper)}</h1>
              <p class="text-slate-600 dark:text-slate-400 mb-8">
                The file extension <strong>.${escapeHtml(extUpper)}</strong> is not recognized in our verified format database. It may be mistyped, proprietary, or not a standardized format.
              </p>
              <div class="flex justify-center gap-4">
                <a href="/file-extensions" class="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold inline-block">Browse Known Formats</a>
                <a href="/file-identifier" class="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg font-semibold inline-block">Inspect Raw File</a>
              </div>
            </div>
          `,
        };
      }

      const title = `.${extUpper} File Extension – How to Open & Convert | AnyFileX`;
      const description = `What is a .${extUpper} file? Discover compatible software for Windows and Mac, MIME type ${extInfo.mimeType}, magic bytes, and free in-browser converters.`.slice(0, 155);

      const breadcrumbs: BreadcrumbItemSchema[] = [
        { name: 'Home', path: '/' },
        { name: 'Extensions', path: '/file-extensions' },
        { name: `.${extUpper}`, path: `/file-extensions/${extRaw}` },
      ];

      const specificSchemas: any[] = [
        {
          '@type': 'TechArticle',
          '@id': `${canonicalUrl}#article`,
          headline: `How to Open and Convert .${extUpper} (${extInfo.name}) Files`,
          description: extInfo.description,
          mainEntityOfPage: canonicalUrl,
          author: { '@id': `${BASE_URL}/#organization` },
          publisher: { '@id': `${BASE_URL}/#organization` },
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            name: 'AnyFileX',
            url: `${BASE_URL}/`,
          },
          inLanguage: 'en-US',
          about: {
            '@type': 'ComputerLanguage',
            name: `${extUpper} File Format`,
            alternateName: extInfo.name,
          },
        },
      ];

      if (extInfo.faqs && extInfo.faqs.length > 0) {
        specificSchemas.push({
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}/#faq`,
          mainEntity: extInfo.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        });
      }

      const prerenderedHtml = `
        <article class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
            <a href="/" class="hover:underline">Home</a> &rsaquo;
            <a href="/file-extensions" class="hover:underline">Extensions</a> &rsaquo;
            <span class="text-slate-900 dark:text-white font-semibold">.${escapeHtml(extUpper)}</span>
          </nav>
          <header class="mb-8">
            <div class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md font-mono text-xs font-bold mb-3">
              ${extInfo.category} &bull; MIME: ${extInfo.mimeType}
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              .${escapeHtml(extUpper)} File Extension
            </h1>
            <p class="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              ${extInfo.description}
            </p>
          </header>

          <!-- Technical Specification Grid -->
          <section class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8 bg-slate-100 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span class="uppercase text-slate-400 font-semibold block text-[10px]">Category</span>
              <strong class="text-slate-900 dark:text-white">${extInfo.category}</strong>
            </div>
            <div>
              <span class="uppercase text-slate-400 font-semibold block text-[10px]">MIME Type</span>
              <a href="/mime-type/${encodeURIComponent(String(extInfo.mimeType).replace('/', '-').toLowerCase())}" class="font-mono text-blue-600 dark:text-blue-400 hover:underline">${extInfo.mimeType}</a>
            </div>
            <div>
              <span class="uppercase text-slate-400 font-semibold block text-[10px]">Magic Bytes</span>
              <code class="font-mono text-amber-600 dark:text-amber-400">${extInfo.magicBytesHex}</code>
            </div>
            <div>
              <span class="uppercase text-slate-400 font-semibold block text-[10px]">Developer</span>
              <span class="text-slate-900 dark:text-white font-medium truncate block">${extInfo.developer || 'Standards Organization'}</span>
            </div>
            <div>
              <span class="uppercase text-slate-400 font-semibold block text-[10px]">Typical Size</span>
              <span class="text-slate-900 dark:text-white">${extInfo.typicalSize || 'Varies'}</span>
            </div>
            <div>
              <span class="uppercase text-slate-400 font-semibold block text-[10px]">Security Risk</span>
              <span class="text-slate-900 dark:text-white font-semibold">${extInfo.dangerRating}</span>
            </div>
          </section>

          <!-- Format Architecture & Deep Overview -->
          <section class="mb-8 prose dark:prose-invert max-w-none">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Format Architecture & Technical Specifications</h2>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              ${extInfo.detailedOverview}
            </p>
          </section>

          <!-- OS Step-by-Step Instructions -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">How to Open .${escapeHtml(extUpper)} Files</h2>
            <div class="space-y-3">
              ${(extInfo.openingSteps || []).map((step, idx) => `
                <div class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    <span class="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs">${idx + 1}</span>
                    ${step.title}
                  </h3>
                  <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${step.desc}</p>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Recommended Software -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Compatible Software Programs</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              ${(extInfo.popularApps || []).map((p) => `
                <div class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 class="font-bold text-sm text-slate-900 dark:text-white">${p.name}</h3>
                  <p class="text-xs text-slate-500 mt-0.5">${(p.os || []).join(', ')} &bull; ${p.isFree ? 'Free' : 'Commercial'}</p>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Security & File Integrity Tips -->
          <section class="mb-8 p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Security Considerations & Verification</h2>
            <p class="text-xs text-slate-600 dark:text-slate-300 mb-3">${extInfo.dangerExplanation}</p>
            <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              ${(extInfo.repairTips || []).map((tip) => `<li>${tip}</li>`).join('')}
            </ul>
          </section>

          <!-- Frequently Asked Questions -->
          ${extInfo.faqs && extInfo.faqs.length > 0 ? `
            <section class="mb-8">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
              <div class="space-y-3">
                ${extInfo.faqs.map((faq) => `
                  <div class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h3 class="font-bold text-sm text-slate-900 dark:text-white mb-1">${faq.question}</h3>
                    <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${faq.answer}</p>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </article>
      `;

      return {
        title,
        description,
        breadcrumbs,
        ogType: 'website',
        specificSchemas,
        prerenderedHtml,
      };
    }

    // ----------------------------------------------------
    // 2. CONVERTER DETAIL (Dynamic per converter pair from URL)
    // ----------------------------------------------------
    case 'converter-detail': {
      const pairSlug = route.id || 'heic-to-jpg';
      const pair = resolveConverterPair(pairSlug);
      const guide = getConversionAuthorityGuide(pairSlug);

      const fromUpper = guide?.fromUpper || pair.fromExt.toUpperCase();
      const toUpper = guide?.toUpper || pair.toExt.toUpperCase();

      const title = guide ? `Convert ${fromUpper} to ${toUpper} Online Free | AnyFileX` : `Convert ${fromUpper} to ${toUpper} Online | AnyFileX`;
      const description = (guide?.metaDescription || `Convert .${pair.fromExt.toLowerCase()} to .${pair.toExt.toLowerCase()} in your browser. Fast, 100% private WebAssembly processing with zero file uploads.`).slice(0, 155);

      const breadcrumbs: BreadcrumbItemSchema[] = [
        { name: 'Home', path: '/' },
        { name: 'Converters', path: '/converters' },
        { name: `Convert ${fromUpper} to ${toUpper}`, path: `/converters/${pair.id}` },
      ];

      const specificSchemas: any[] = [
        {
          '@type': 'WebApplication',
          '@id': `${canonicalUrl}/#app`,
          name: pair.name,
          url: canonicalUrl,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'All (Web Browser, Windows, macOS, Linux, iOS, Android)',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description: guide?.subtitle || pair.description,
          featureList: [
            '100% Browser In-Memory WebAssembly Processing',
            'Zero file uploads — Complete data privacy',
            'Adjustable quality & background fill controls',
            'Batch conversion support with ZIP export',
          ],
        },
      ];

      if (guide) {
        specificSchemas.push({
          '@type': 'HowTo',
          '@id': `${canonicalUrl}/#howto`,
          name: `How to Convert .${fromUpper} to .${toUpper}`,
          description: guide.metaDescription,
          step: guide.steps.map((s) => ({
            '@type': 'HowToStep',
            position: s.number,
            name: s.title,
            text: s.instruction,
          })),
        });

        if (guide.faqs && guide.faqs.length > 0) {
          specificSchemas.push({
            '@type': 'FAQPage',
            '@id': `${canonicalUrl}/#faq`,
            mainEntity: guide.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          });
        }
      }

      const prerenderedHtml = `
        <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8 space-y-8">
          <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
            <a href="/" class="hover:underline">Home</a> &rsaquo;
            <a href="/converters" class="hover:underline">Converters</a> &rsaquo;
            <span class="text-slate-900 dark:text-white font-semibold">Convert ${fromUpper} to ${toUpper}</span>
          </nav>
          
          <header class="text-center max-w-3xl mx-auto space-y-4">
            <div class="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full font-mono text-xs font-bold">
              .${fromUpper} &rarr; .${toUpper} Converter &bull; 100% In-Browser Memory
            </div>
            <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              How to Convert .${fromUpper} to .${toUpper} Online Free
            </h1>
            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-2">
              ${guide?.subtitle || pair.description}
            </p>
          </header>

          <!-- 4. Step-by-Step Instructions -->
          <section class="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Step-by-Step: How to Convert .${fromUpper} to .${toUpper}</h2>
            <ol class="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-300 text-sm">
              ${(guide?.steps || pair.steps || []).map((step: any) => `
                <li><strong>${step.title}:</strong> ${step.instruction || step.desc}</li>
              `).join('')}
            </ol>
          </section>

          <!-- 1 & 2. Format Profiles & Why Convert -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">What is a .${fromUpper} File?</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${guide?.sourceFormat.technicalOverview || ''}</p>
              <div class="text-xs text-slate-500 space-y-1 pt-2">
                <p><strong>Compression:</strong> ${guide?.sourceFormat.compressionType || 'Standard'}</p>
                <p><strong>MIME Type:</strong> ${guide?.sourceFormat.mimeType || ''}</p>
                <p><strong>Developer:</strong> ${guide?.sourceFormat.developer || ''}</p>
              </div>
            </section>

            <section class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Why Convert .${fromUpper} to .${toUpper}?</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${guide?.whyConvert.keyDriver || ''}</p>
              <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                ${(guide?.whyConvert.reasons || []).map((r) => `
                  <li><strong>${r.title}:</strong> ${r.desc}</li>
                `).join('')}
              </ul>
            </section>
          </div>

          <!-- 5 & 6. Quality & File Size Benchmarks -->
          ${guide ? `
            <section class="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Quality & File-Size Considerations</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">${guide.quality.quantizationDetails}</p>
              <div class="overflow-x-auto pt-2">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-100 dark:bg-slate-800 font-bold">
                      <th class="p-2.5">Sample Payload</th>
                      <th class="p-2.5">.${fromUpper} Size</th>
                      <th class="p-2.5">.${toUpper} Size</th>
                      <th class="p-2.5">Delta</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    ${guide.fileSize.benchmarks.map((b) => `
                      <tr>
                        <td class="p-2.5 font-medium">${b.sampleType}</td>
                        <td class="p-2.5 font-mono">${b.sourceSize}</td>
                        <td class="p-2.5 font-mono font-bold">${b.targetSize}</td>
                        <td class="p-2.5">${b.reductionPercent}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </section>
          ` : ''}

          <!-- 11. FAQs -->
          ${guide?.faqs && guide.faqs.length > 0 ? `
            <section class="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
              <div class="space-y-4 text-sm">
                ${guide.faqs.map((faq) => `
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white">${faq.question}</h4>
                    <p class="text-slate-600 dark:text-slate-300 mt-1">${faq.answer}</p>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      `;

      return {
        title,
        description,
        breadcrumbs,
        ogType: 'website',
        specificSchemas,
        prerenderedHtml,
      };
    }

    // ----------------------------------------------------
    // 3. SPECIFIC TOOLS (Dynamic per tool name from URL)
    // ----------------------------------------------------
    case 'file-identifier':
    case 'metadata-viewer':
    case 'remove-metadata':
    case 'hash-generator':
    case 'checksum-verifier':
    case 'mime-checker':
    case 'magic-byte-detector': {
      const toolKey = route.view;
      const config = TOOL_CONFIG[toolKey] || {
        name: 'File Inspection Tool',
        title: 'Universal File Inspection & Forensics Tool | AnyFileX',
        desc: 'Browser-based file forensics, magic byte inspector, and metadata viewer.',
        keywords: 'file tool, inspect file',
      };

      const title = `${config.title} | AnyFileX`;
      const description = config.desc;

      const breadcrumbs: BreadcrumbItemSchema[] = [
        { name: 'Home', path: '/' },
        { name: 'Tools', path: '/tools' },
        { name: config.name, path: `/tools/${toolKey}` },
      ];

      const specificSchemas: any[] = [
        {
          '@type': 'WebApplication',
          '@id': `${canonicalUrl}/#tool`,
          name: config.name,
          url: canonicalUrl,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'All (Web Browser)',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description: config.desc,
        },
      ];

      const prerenderedHtml = `
        <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
            <a href="/" class="hover:underline">Home</a> &rsaquo;
            <a href="/tools" class="hover:underline">Tools</a> &rsaquo;
            <span class="text-slate-900 dark:text-white font-semibold">${config.name}</span>
          </nav>
          <header class="mb-6">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              ${config.name}
            </h1>
            <p class="text-base text-slate-600 dark:text-slate-300 mt-2">
              ${config.desc}
            </p>
          </header>
          ${toolKey === 'mime-checker' ? ssrDirectory('MIME Type Directory', EXPANDED_MIME_DATABASE.map((m) => ({ href: `/mime-type/${encodeURIComponent(m.mimeType.replace('/', '-').toLowerCase())}`, label: m.mimeType, note: m.extension }))) : ''}
        </div>
      `;

      return {
        title,
        description,
        breadcrumbs,
        ogType: 'website',
        specificSchemas,
        prerenderedHtml,
      };
    }

    // ----------------------------------------------------
    // 4. SOFTWARE DETAIL (Dynamic per software name from URL)
    // ----------------------------------------------------
    case 'software-detail': {
      const softId = route.id || 'gimp';
      const softInfo = getOrGenerateSoftwareInfo(softId);
      const isGoogleDocs = softId === 'google-docs';

      const title = isGoogleDocs
        ? 'Google Docs File Types: What Files Can Google Docs Open?'
        : `${softInfo.name} – Formats & Review | AnyFileX`;
      const description = isGoogleDocs
        ? 'Discover what files Google Docs can open and export. Complete guide to supported formats, DOCX, ODT, PDF, EPUB, RTF, TXT, HTML compatibility and limitations.'
        : `${softInfo.name} by ${softInfo.developer}: supported file formats, platforms (${(softInfo.supportedOS || []).join(', ')}), and features.`.slice(0, 155);

      const breadcrumbs: BreadcrumbItemSchema[] = [
        { name: 'Home', path: '/' },
        { name: 'Software', path: '/software' },
        { name: isGoogleDocs ? 'Google Docs File Types' : softInfo.name, path: `/software/${softInfo.id}` },
      ];

      const specificSchemas: any[] = isGoogleDocs
        ? [
            {
              '@type': 'SoftwareApplication',
              '@id': `${canonicalUrl}/#software`,
              name: 'Google Docs',
              operatingSystem: 'Windows, macOS, Linux, Android, iOS, ChromeOS, Web',
              applicationCategory: 'WordProcessor, OfficeApplication',
              author: { '@type': 'Organization', name: 'Google LLC' },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description:
                'Google Docs is a free cloud-based word processor for creating, opening, editing, and exporting DOCX, ODT, PDF, RTF, TXT, HTML, and EPUB files.',
            },
            {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Does Google Docs have its own native file extension?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No. Google Docs does not have a traditional standalone native file extension like .docx or .pages. Documents exist in Google cloud storage; .gdoc desktop files are tiny JSON web shortcuts linking to online URLs.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What file formats can Google Docs open or import?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Google Docs can open Microsoft Word (.docx, .doc, .docm, .dot, .dotx), OpenDocument (.odt), Rich Text (.rtf), Plain Text (.txt), HTML (.html, .htm), and PDF (.pdf) via OCR.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What formats can Google Docs export or download?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Google Docs can download files as DOCX, ODT, RTF, PDF, TXT, HTML (zipped), and EPUB.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can Google Docs edit Word (.docx) files without converting them?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Google Docs includes native Office Editing Mode for .docx files, saving edits directly back to the original Word file without conversion.',
                  },
                },
              ],
            },
            {
              '@type': 'HowTo',
              name: 'How to Upload and Open a File in Google Docs',
              description: 'Step-by-step guide to uploading and opening files in Google Docs.',
              step: [
                {
                  '@type': 'HowToStep',
                  name: 'Access Google Drive or Docs',
                  text: 'Navigate to drive.google.com or docs.google.com and log in.',
                },
                {
                  '@type': 'HowToStep',
                  name: 'Upload the Document',
                  text: 'Click + New > File upload in Drive, or File > Open > Upload in Google Docs.',
                },
                {
                  '@type': 'HowToStep',
                  name: 'Open Document',
                  text: 'Choose your DOCX, ODT, PDF, RTF, TXT, or HTML file to begin editing.',
                },
              ],
            },
          ]
        : [
            {
              '@type': 'SoftwareApplication',
              '@id': `${canonicalUrl}/#software`,
              name: softInfo.name,
              operatingSystem: (softInfo.supportedOS || []).join(', '),
              applicationCategory: softInfo.category,
              author: { '@type': 'Organization', name: softInfo.developer },
              offers: {
                '@type': 'Offer',
                price: softInfo.priceType === 'Free' ? '0' : 'Varies',
                priceCurrency: 'USD',
              },
              description: softInfo.description,
            },
          ];

      const prerenderedHtml = isGoogleDocs
        ? `
        <article class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8 space-y-8">
          <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
            <a href="/" class="hover:underline">Home</a> &rsaquo;
            <a href="/software" class="hover:underline">Software</a> &rsaquo;
            <span class="text-slate-900 dark:text-white font-semibold">Google Docs File Types</span>
          </nav>
          <header class="mb-6">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Google Docs File Types: What Files Can Google Docs Open & Export?
            </h1>
            <p class="text-slate-600 dark:text-slate-300 mt-3 text-lg leading-relaxed">
              Google Docs is Google's free cloud-based collaborative word processor. It does not have a traditional standalone native file extension like .docx or .pages. Instead, documents exist natively in cloud storage, and .gdoc desktop shortcuts function as JSON web pointers. Google Docs opens, imports, edits, and exports standard document formats.
            </p>
          </header>

          <section class="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Supported Formats Matrix: Import vs. Export</h2>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-800">
                    <th class="py-2.5 px-3">Format</th>
                    <th class="py-2.5 px-3">Open / Import</th>
                    <th class="py-2.5 px-3">Export / Download</th>
                    <th class="py-2.5 px-3">Important Limitations</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td class="py-2 px-3 font-semibold"><a href="/file-extensions/docx" class="text-blue-600 hover:underline">.DOCX (Word)</a></td>
                    <td class="py-2 px-3 text-emerald-600 font-bold">Yes (Office Mode)</td>
                    <td class="py-2 px-3 text-blue-600 font-bold">Yes (.docx)</td>
                    <td class="py-2 px-3 text-xs">50MB limit. VBA macros stripped. Fonts substitute to Google Fonts.</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-semibold"><a href="/file-extensions/doc" class="text-blue-600 hover:underline">.DOC (Word 97-2003)</a></td>
                    <td class="py-2 px-3 text-emerald-600 font-bold">Yes (Auto-Convert)</td>
                    <td class="py-2 px-3 text-slate-500 font-medium">No (DOCX only)</td>
                    <td class="py-2 px-3 text-xs">Legacy binary converted to modern DOCX/Docs. Cannot re-export to .doc.</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-semibold"><a href="/file-extensions/odt" class="text-blue-600 hover:underline">.ODT (OpenDocument)</a></td>
                    <td class="py-2 px-3 text-emerald-600 font-bold">Yes (Native)</td>
                    <td class="py-2 px-3 text-blue-600 font-bold">Yes (.odt)</td>
                    <td class="py-2 px-3 text-xs">LibreOffice frames and formulas may shift or rasterize.</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-semibold"><a href="/file-extensions/pdf" class="text-blue-600 hover:underline">.PDF (Acrobat)</a></td>
                    <td class="py-2 px-3 text-amber-600 font-bold">Yes (OCR Text)</td>
                    <td class="py-2 px-3 text-blue-600 font-bold">Yes (.pdf)</td>
                    <td class="py-2 px-3 text-xs">Triggers OCR text extraction; multi-column and table layouts may break.</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-semibold"><a href="/file-extensions/epub" class="text-blue-600 hover:underline">.EPUB (Ebook)</a></td>
                    <td class="py-2 px-3 text-rose-600 font-bold">No (Cannot Open)</td>
                    <td class="py-2 px-3 text-blue-600 font-bold">Yes (.epub)</td>
                    <td class="py-2 px-3 text-xs">Google Docs cannot open EPUB. Export creates reflowable EPUB 3.0.</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-semibold"><a href="/file-extensions/rtf" class="text-blue-600 hover:underline">.RTF (Rich Text)</a></td>
                    <td class="py-2 px-3 text-emerald-600 font-bold">Yes (Native)</td>
                    <td class="py-2 px-3 text-blue-600 font-bold">Yes (.rtf)</td>
                    <td class="py-2 px-3 text-xs">Basic styles preserved; drawing canvases and OLE objects removed.</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-semibold"><a href="/file-extensions/txt" class="text-blue-600 hover:underline">.TXT (Plain Text)</a></td>
                    <td class="py-2 px-3 text-emerald-600 font-bold">Yes (Native)</td>
                    <td class="py-2 px-3 text-blue-600 font-bold">Yes (.txt)</td>
                    <td class="py-2 px-3 text-xs">All styling, colors, and font formatting are discarded.</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-semibold"><a href="/file-extensions/html" class="text-blue-600 hover:underline">.HTML (Web Page)</a></td>
                    <td class="py-2 px-3 text-emerald-600 font-bold">Yes (Native)</td>
                    <td class="py-2 px-3 text-blue-600 font-bold">Yes (.zip)</td>
                    <td class="py-2 px-3 text-xs">External CSS/JS stripped. Exported as a zip with HTML and images folder.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">How to Upload and Open Files in Google Docs</h2>
            <ol class="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300 text-sm">
              <li><strong>Google Drive:</strong> Visit drive.google.com, click "+ New" &gt; "File upload", then double-click or right-click "Open with &gt; Google Docs".</li>
              <li><strong>Inside Google Docs:</strong> In docs.google.com, click File &gt; Open &gt; Upload tab, and drag and drop your document.</li>
              <li><strong>Gmail:</strong> Hover over any document attachment in Gmail and click the "Edit with Google Docs" pencil icon.</li>
              <li><strong>Mobile:</strong> Open the Google Docs app on iOS or Android and tap the folder icon to open device storage files.</li>
            </ol>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <div class="space-y-3 text-sm">
              <div class="border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
                <h3 class="font-bold text-slate-900 dark:text-white">Does Google Docs have its own file extension?</h3>
                <p class="text-slate-600 dark:text-slate-400 mt-1">No. Google Docs documents live in Google Drive cloud storage without a standalone file container. Desktop .gdoc files are web URL pointer shortcuts.</p>
              </div>
              <div class="border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
                <h3 class="font-bold text-slate-900 dark:text-white">What file formats can Google Docs open?</h3>
                <p class="text-slate-600 dark:text-slate-400 mt-1">Google Docs opens DOCX, DOC, DOCM, DOT, ODT, RTF, TXT, HTML, and PDF (via optical character recognition).</p>
              </div>
            </div>
          </section>
        </article>
      `
        : `
        <article class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
            <a href="/" class="hover:underline">Home</a> &rsaquo;
            <a href="/software" class="hover:underline">Software</a> &rsaquo;
            <span class="text-slate-900 dark:text-white font-semibold">${softInfo.name}</span>
          </nav>
          <header class="mb-6">
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">
              ${softInfo.name}
            </h1>
            <p class="text-slate-600 dark:text-slate-300 mt-2">
              ${softInfo.description}
            </p>
          </header>
          <div class="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Supported Formats</h2>
            <div class="flex flex-wrap gap-2">
              ${softInfo.supportedExtensions.map((e) => `
                <a href="/file-extensions/${e.toLowerCase()}" class="px-2.5 py-1 bg-white dark:bg-slate-800 rounded font-mono text-xs text-blue-600">.${e.toUpperCase()}</a>
              `).join('')}
            </div>
          </div>
        </article>
      `;

      return {
        title,
        description,
        breadcrumbs,
        ogType: 'website',
        specificSchemas,
        prerenderedHtml,
      };
    }

    // ----------------------------------------------------
    // 5. REPAIR DETAIL (Dynamic per repair guide from URL)
    // ----------------------------------------------------
    case 'repair-detail':
    case 'troubleshoot-guide': {
      const guideId = (route as any).slug || (route as any).id || '';
      const guide = REPAIR_GUIDES.find((g) => g.id === guideId) || {
        id: guideId,
        title: `How to Repair Corrupted ${guideId.replace(/^(damaged|broken|fix|corrupted)-/, '').toUpperCase()} Files`,
        extension: guideId.replace(/^(damaged|broken|fix|corrupted)-/, '').replace(/-.*$/, ''),
        symptoms: ['Header damage', 'Unable to open'],
      };

      const title = `${guide.title} – Repair Guide | AnyFileX`;
      const description = `Diagnose and fix corrupted .${guide.extension.toUpperCase()} files. Hex recovery and step-by-step repair instructions.`.slice(0, 155);

      const breadcrumbs: BreadcrumbItemSchema[] = [
        { name: 'Home', path: '/' },
        { name: 'Repair Guides', path: '/troubleshoot' },
        { name: guide.title, path: `/troubleshoot/${guide.id}` },
      ];

      const specificSchemas: any[] = [
        {
          '@type': 'TechArticle',
          headline: guide.title,
          description: `Diagnostic guide for repairing corrupted .${guide.extension.toUpperCase()} files.`,
          mainEntityOfPage: canonicalUrl,
          author: { '@id': `${BASE_URL}/#organization` },
          publisher: { '@id': `${BASE_URL}/#organization` },
        },
      ];

      const prerenderedHtml = `
        <article class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
            <a href="/" class="hover:underline">Home</a> &rsaquo;
            <a href="/troubleshoot" class="hover:underline">Repair Guides</a> &rsaquo;
            <span class="text-slate-900 dark:text-white font-semibold">${guide.title}</span>
          </nav>
          <header class="mb-6">
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">${guide.title}</h1>
            <p class="text-slate-600 dark:text-slate-300 mt-2">Corrupt file troubleshooting for .${guide.extension.toUpperCase()} format.</p>
          </header>
        </article>
      `;

      return {
        title,
        description,
        breadcrumbs,
        ogType: 'article',
        specificSchemas,
        prerenderedHtml,
      };
    }

    // ----------------------------------------------------
    // 6. GUIDE / BLOG DETAIL (Dynamic per guide/article from URL)
    // ----------------------------------------------------
    case 'guide-detail':
    case 'blog-post':
    case 'blog-detail': {
      const guideId = route.id || '';
      const allGuides = [...GUIDES_LIST, ...BLOG_POSTS];
      const guide = allGuides.find((g) => g.id === guideId || ('slug' in g && g.slug === guideId));
      const guideTitle = guide ? guide.title : guideId.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const guideSummary = guide ? ('summary' in guide ? guide.summary : (guide as any).excerpt) : `Expert technical guide for ${guideTitle}.`;

      const title = `${guideTitle} – AnyFileX Knowledge Base`;
      const description = guideSummary;

      const isBlog = route.view === 'blog-post' || route.view === 'blog-detail';
      const sectionName = isBlog ? 'Blog' : 'Guides';
      const sectionPath = isBlog ? '/blog' : '/guides';

      const breadcrumbs: BreadcrumbItemSchema[] = [
        { name: 'Home', path: '/' },
        { name: sectionName, path: sectionPath },
        { name: guideTitle, path: `${sectionPath}/${guideId}` },
      ];

      const specificSchemas: any[] = [
        {
          '@type': 'TechArticle',
          headline: guideTitle,
          description: guideSummary,
          mainEntityOfPage: canonicalUrl,
          author: { '@id': `${BASE_URL}/#organization` },
          publisher: { '@id': `${BASE_URL}/#organization` },
        },
      ];

      const prerenderedHtml = `
        <article class="anyfilex-ssr-container max-w-4xl mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
            <a href="/" class="hover:underline">Home</a> &rsaquo;
            <a href="${sectionPath}" class="hover:underline">${sectionName}</a> &rsaquo;
            <span class="text-slate-900 dark:text-white font-semibold">${guideTitle}</span>
          </nav>
          <header class="mb-6">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">${guideTitle}</h1>
            <p class="text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">${guideSummary}</p>
          </header>
        </article>
      `;

      return {
        title,
        description,
        breadcrumbs,
        ogType: 'article',
        specificSchemas,
        prerenderedHtml,
      };
    }

    // ----------------------------------------------------
    // 7. CATEGORY DETAIL (Dynamic per category from URL)
    // ----------------------------------------------------
    case 'category-detail': {
      const catId = (route.id || '').toLowerCase();
      const cat = CATEGORIES_LIST.find((c) => c.id.toLowerCase() === catId || c.name.toLowerCase().includes(catId));
      const catName = cat ? cat.name : catId.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const catDesc = cat ? cat.description : `Comprehensive directory of ${catName} file extensions, MIME types, and converters.`;

      const title = `${catName} File Formats & Extensions Directory | AnyFileX`;
      const description = `Explore all ${catName} file extensions, supported software programs, converters, and format specifications. ${catDesc}`;

      const breadcrumbs: BreadcrumbItemSchema[] = [
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/file-extensions' },
        { name: catName, path: `/category/${catId}` },
      ];

      const prerenderedHtml = `
        <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
            <a href="/" class="hover:underline">Home</a> &rsaquo;
            <a href="/file-extensions" class="hover:underline">Categories</a> &rsaquo;
            <span class="text-slate-900 dark:text-white font-semibold">${catName}</span>
          </nav>
          <header class="mb-6">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">${catName} File Formats</h1>
            <p class="text-slate-600 dark:text-slate-300">${catDesc}</p>
          </header>
          ${ssrDirectory(`${catName} File Extensions`, getAllFileTypeInfos().filter((e) => e.category.toLowerCase() === (CATEGORY_EXTENSION_LABEL[catId] || catName).toLowerCase()).map((e) => ({ href: `/file-extensions/${e.extension.toLowerCase()}`, label: `.${e.extension}`, note: e.name })))}
        </div>
      `;

      return {
        title,
        description,
        breadcrumbs,
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml,
      };
    }

    // ----------------------------------------------------
    // 7b. HOW TO OPEN DIRECTORY & DETAIL PAGES
    // ----------------------------------------------------
    case 'how-to-open': {
      if (route.ext) {
        const extRaw = route.ext.trim().replace(/^\./, '').toLowerCase();
        const guide = getHowToOpenGuide(extRaw);

        const title = `How to Open .${guide.upperExt} Files | AnyFileX`;
        const description = `Step-by-step instructions on how to open and view .${guide.upperExt} (${guide.name}) files across Windows 11/10, macOS, and mobile devices.`.slice(0, 155);

        const breadcrumbs: BreadcrumbItemSchema[] = [
          { name: 'Home', path: '/' },
          { name: 'How to Open', path: '/how-to-open' },
          { name: `How to Open .${guide.upperExt}`, path: `/how-to-open/${guide.extension}` },
        ];

        const specificSchemas: any[] = Array.isArray(guide.schemaJson) ? guide.schemaJson : [guide.schemaJson];

        const prerenderedHtml = `
          <article class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
              <a href="/" class="hover:underline">Home</a> &rsaquo;
              <a href="/how-to-open" class="hover:underline">How to Open</a> &rsaquo;
              <span class="text-slate-900 dark:text-white font-semibold">How to Open .${guide.upperExt}</span>
            </nav>
            <header class="mb-8">
              <span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md font-mono text-xs font-bold mb-3">
                ${guide.category} Format &bull; ${guide.mimeType}
              </span>
              <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                How to Open a .${guide.upperExt} File
              </h1>
              <p class="text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                A .${guide.upperExt} file is a ${guide.name}. ${guide.whyItIsHardToOpen}
              </p>
            </header>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Windows 11 & 10 Instructions</h2>
              <ol class="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                ${guide.osGuides.windows.steps.map(s => `<li><strong>${s.title}:</strong> ${s.detail}</li>`).join('')}
              </ol>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">macOS Instructions</h2>
              <ol class="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                ${guide.osGuides.mac.steps.map(s => `<li><strong>${s.title}:</strong> ${s.detail}</li>`).join('')}
              </ol>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Recommended Software</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${guide.recommendedSoftware.slice(0, 4).map(sw => `
                  <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <strong class="text-slate-900 dark:text-white block">${sw.name}</strong>
                    <span class="text-xs text-slate-500">${sw.priceText} &bull; ${sw.developer}</span>
                  </div>
                `).join('')}
              </div>
            </section>
          </article>
        `;

        return {
          title,
          description,
          breadcrumbs,
          ogType: 'article',
          specificSchemas,
          prerenderedHtml,
        };
      }

      // Hub Directory
      const cat = route.categoryFilter;
      const suffix = cat ? ` for ${cat}` : '';
      return {
        title: `How to Open Any File Extension${suffix} | AnyFileX`,
        description: `Learn how to open any file extension on Windows, macOS, Linux, and mobile. Step-by-step guides, default apps, and free in-browser file viewers.`.slice(0, 155),
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'How to Open', path: '/how-to-open' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">How to Open Any File Extension</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-8">Select any file extension to view verified step-by-step instructions for Windows, Mac, Android, and iOS.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              ${POPULAR_FILE_TYPES.slice(0, 18).map((ft) => `
                <a href="/how-to-open/${ft.extension.toLowerCase()}" class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-2xs">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-mono font-bold text-blue-600 text-sm">.${ft.extension}</span>
                    <span class="text-[10px] text-slate-400 uppercase">${ft.category}</span>
                  </div>
                  <p class="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">How to Open .${ft.extension} Files</p>
                  <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">${ft.name}</p>
                </a>
              `).join('')}
            </div>
            ${ssrDirectory('All How-to-Open Guides', getAllFileTypeInfos().map((e) => ({ href: `/how-to-open/${e.extension.toLowerCase()}`, label: `How to open .${e.extension}`, note: e.category })))}
          </div>
        `,
      };
    }

    // ----------------------------------------------------
    // 7c. FORMAT COMPARISON HUB
    // ----------------------------------------------------
    case 'compare-hub': {
      const topComparisons = [
        { slug: 'heic-vs-jpg', title: 'HEIC vs JPG', desc: 'Apple High Efficiency image container compared against universal JPEG compression.' },
        { slug: 'png-vs-webp', title: 'PNG vs WEBP', desc: 'Lossless web graphics, alpha transparency channels, and file size comparison.' },
        { slug: 'dwg-vs-dxf', title: 'DWG vs DXF', desc: 'AutoCAD native proprietary binary drawings vs open exchange format.' },
        { slug: 'svg-vs-png', title: 'SVG vs PNG', desc: 'Resolution-independent vector XML vs raster pixel bitmaps.' },
        { slug: 'pdf-vs-docx', title: 'PDF vs DOCX', desc: 'Fixed layout digital document publishing vs editable Microsoft Word structure.' },
        { slug: 'zip-vs-7z', title: 'ZIP vs 7Z', desc: 'Deflate archive compatibility vs LZMA high-ratio compression.' },
        { slug: 'mp4-vs-mkv', title: 'MP4 vs MKV', desc: 'MPEG-4 universal playback container vs Matroska multi-track media.' },
        { slug: 'flac-vs-mp3', title: 'FLAC vs MP3', desc: 'Bit-perfect lossless studio audio vs perceptual MPEG psychoacoustic encoding.' },
      ];
      return {
        title: 'File Format Comparisons & Benchmarks | AnyFileX',
        description: 'Compare file formats head-to-head: compression ratios, lossless vs lossy quality, transparency support, and cross-platform compatibility.'.slice(0, 155),
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Compare Formats', path: '/compare' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">File Format Comparisons & Benchmarks</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-8">Compare file format specifications, compression efficiency, and operating system support.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${topComparisons.map((c) => `
                <a href="/compare/${c.slug}" class="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-2xs">
                  <h2 class="text-base font-bold text-slate-900 dark:text-white mb-1">${c.title}</h2>
                  <p class="text-xs text-slate-500 leading-relaxed">${c.desc}</p>
                  <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3 inline-block">Read Side-by-Side Analysis &rarr;</span>
                </a>
              `).join('')}
            </div>
            ${ssrDirectory('All Format Comparisons', CURATED_COMPARISONS.map((cp) => ({ href: `/compare/${cp.slug.toLowerCase()}`, label: cp.title, note: cp.category })))}
          </div>
        `,
      };
    }

    // ----------------------------------------------------
    // 8. COMPARISON DETAIL (Dynamic per compare slug from URL)
    // ----------------------------------------------------
    case 'comparison-detail': {
      const slug = route.slug || 'heic-vs-jpg';
      const compData = getOrGenerateComparison(slug);

      const title = `${compData.title} – Format Comparison | AnyFileX`;
      const description = (compData.metaDescription || compData.summary || `Compare format specifications, compression ratios, and compatibility.`).slice(0, 155);

      const breadcrumbs: BreadcrumbItemSchema[] = [
        { name: 'Home', path: '/' },
        { name: 'Compare Formats', path: '/compare' },
        { name: compData.title, path: `/compare/${slug}` },
      ];

      const specificSchemas: any[] = [
        {
          '@type': 'TechArticle',
          headline: compData.title,
          description: compData.summary,
          mainEntityOfPage: canonicalUrl,
          author: { '@id': `${BASE_URL}/#organization` },
          publisher: { '@id': `${BASE_URL}/#organization` },
        },
      ];

      const prerenderedHtml = `
        <div class="anyfilex-ssr-container max-w-4xl mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
            <a href="/" class="hover:underline">Home</a> &rsaquo;
            <a href="/compare" class="hover:underline">Compare</a> &rsaquo;
            <span class="text-slate-900 dark:text-white font-semibold">${compData.title}</span>
          </nav>
          <header class="mb-6">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">${compData.title}</h1>
            <p class="text-slate-600 dark:text-slate-300">${compData.summary}</p>
          </header>
        </div>
      `;

      return {
        title,
        description,
        breadcrumbs,
        ogType: 'article',
        specificSchemas,
        prerenderedHtml,
      };
    }

    // ----------------------------------------------------
    // 9. MIME DETAIL (Dynamic per MIME type slug from URL)
    // ----------------------------------------------------
    case 'mime-detail': {
      const mimeSlug = route.mimeSlug || 'image-jpeg';
      const mimeFormatted = mimeSlug.replace('-', '/');
      const title = `${mimeFormatted} MIME Type Specification | AnyFileX`;
      const description = `Technical specification for ${mimeFormatted}. HTTP headers, associated file extensions, and magic byte signatures.`.slice(0, 155);

      const breadcrumbs: BreadcrumbItemSchema[] = [
        { name: 'Home', path: '/' },
        { name: 'MIME Checker', path: '/tools/mime-checker' },
        { name: mimeFormatted, path: `/mime-type/${mimeSlug}` },
      ];

      const prerenderedHtml = `
        <div class="anyfilex-ssr-container max-w-4xl mx-auto px-4 py-8">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">${escapeHtml(mimeFormatted)} MIME Type</h1>
          <p class="text-slate-600 dark:text-slate-300">Technical specification and associated format standards for ${escapeHtml(mimeFormatted)}.</p>
        </div>
      `;

      return {
        title,
        description,
        breadcrumbs,
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml,
      };
    }

    // ----------------------------------------------------
    // 10. DIRECTORY LISTINGS & CORE PAGES
    // ----------------------------------------------------
    case 'extensions': {
      const cat = route.categoryFilter;
      const letter = route.letterFilter;
      let suffix = '';
      if (cat) suffix = ` in ${cat}`;
      if (letter) suffix = ` Starting with Letter '${letter.toUpperCase()}'`;

      return {
        title: `File Extensions Directory${suffix} | AnyFileX`,
        description: `Browse 250+ file extensions${suffix}. Filter by category, alphabetical index, MIME types, and software compatibility.`.slice(0, 155),
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Extensions', path: '/file-extensions' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-6xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Complete File Extension Database${suffix}</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-6">Search, browse, and inspect technical specifications for hundreds of file extensions.</p>

            <div class="flex flex-wrap gap-2 mb-8">
              <a href="/file-extensions" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold">All Formats</a>
              ${CATEGORIES_LIST.map((c) => `
                <a href="/file-extensions?category=${encodeURIComponent(c.name)}" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500">
                  ${c.name}
                </a>
              `).join('')}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              ${POPULAR_FILE_TYPES.map((item) => `
                <a href="/file-extensions/${item.extension.toLowerCase()}" class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-2xs">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-mono font-bold text-blue-600 text-sm">.${item.extension}</span>
                    <span class="text-[10px] text-slate-400 uppercase">${item.category}</span>
                  </div>
                  <h2 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">${item.name}</h2>
                  <p class="text-[11px] text-slate-500 line-clamp-2 mt-1">${item.description}</p>
                </a>
              `).join('')}
            </div>
            ${ssrDirectory('All File Extensions A-Z', getAllFileTypeInfos().map((e) => ({ href: `/file-extensions/${e.extension.toLowerCase()}`, label: `.${e.extension}`, note: e.category })))}
          </div>
        `,
      };
    }

    case 'converters': {
      return {
        title: 'Free Online File Converters – In-Browser Tools | AnyFileX',
        description: 'Convert between hundreds of file formats directly in your browser. Fast, secure, zero server uploads using in-memory WebAssembly.'.slice(0, 155),
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Converters', path: '/converters' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">Free Online File Converters</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-8">Convert files securely right in your browser without uploading to external servers.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              ${CONVERTERS_LIST.map((c) => `
                <a href="/converters/${c.id}" class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-2xs">
                  <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">${c.category}</span>
                  <h2 class="text-sm font-bold text-slate-900 dark:text-white mb-1">${c.name}</h2>
                  <p class="text-xs text-slate-500 line-clamp-2">${c.description}</p>
                </a>
              `).join('')}
            </div>
            ${ssrDirectory('All Conversion Routes', Array.from(new Set([...getAllSupportedConversionSlugs(), ...CONVERTERS_LIST.map((c) => c.id)])).sort().map((slug) => ({ href: `/converters/${slug}`, label: slug.replace(/-/g, ' ') })))}
          </div>
        `,
      };
    }

    case 'software': {
      return {
        title: 'Software Directory – File Compatibility | AnyFileX',
        description: 'Discover the best free and commercial software to open, edit, and convert any file extension across Windows, macOS, and Linux.'.slice(0, 155),
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Software', path: '/software' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">Software & Application Directory</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-8">Explore compatible desktop and web applications to open and convert any file extension.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              ${SOFTWARE_LIST.map((s) => `
                <a href="/software/${s.id}" class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-2xs">
                  <div class="flex items-center justify-between mb-1">
                    <h2 class="text-sm font-bold text-slate-900 dark:text-white">${s.name}</h2>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">${s.priceType}</span>
                  </div>
                  <p class="text-xs text-slate-500 line-clamp-2">${s.description}</p>
                </a>
              `).join('')}
            </div>
          </div>
        `,
      };
    }

    case 'troubleshoot-hub':
    case 'repair': {
      return {
        title: 'Corrupted File Repair & Hex Guides | AnyFileX',
        description: 'Step-by-step guides to diagnose and fix corrupt headers, truncated archives, and broken media containers.'.slice(0, 155),
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Repair Guides', path: '/troubleshoot' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">File Repair & Recovery Guides</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-8">Expert troubleshooting guides to repair damaged or unreadable file formats.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${REPAIR_GUIDES.map((r) => `
                <a href="/troubleshoot/${r.id}" class="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-2xs">
                  <span class="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">.${r.extension} Recovery</span>
                  <h2 class="text-base font-bold text-slate-900 dark:text-white mb-1">${r.title}</h2>
                  <p class="text-xs text-slate-500 leading-relaxed">${r.symptoms?.[0] || 'Troubleshoot and fix corrupted file headers and data structures.'}</p>
                </a>
              `).join('')}
            </div>
            ${ssrDirectory('All Repair & Troubleshooting Guides', [
              ...TROUBLESHOOTING_GUIDES.map((g) => ({ href: `/troubleshoot/${g.id}`, label: g.title, note: String(g.category) })),
              ...REPAIR_GUIDES.map((r) => ({ href: `/troubleshoot/${r.id}`, label: r.title, note: `.${r.extension}` })),
            ])}
          </div>
        `,
      };
    }

    case 'guides': {
      return {
        title: 'File Format Guides & Technical Tutorials | AnyFileX',
        description: 'In-depth tutorials on file format structures, MIME types, encoding standards, and digital forensics.',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">File Format Technical Guides</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-8">Read expert guides on file inspection, compatibility, and data recovery.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              ${GUIDES_LIST.map((g) => `
                <a href="/guides/${g.id}" class="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-2xs">
                  <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">${g.category}</span>
                  <h2 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">${g.title}</h2>
                  <p class="text-xs text-slate-500 line-clamp-3">${g.summary}</p>
                </a>
              `).join('')}
            </div>
          </div>
        `,
      };
    }

    case 'blog': {
      return {
        title: 'Engineering Blog & Format Deep-Dives | AnyFileX',
        description: 'Articles on file format specifications, compression algorithms, browser forensics, and cybersecurity.',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">AnyFileX Engineering Blog</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-8">Deep-dives into format specifications, file security, and browser-based forensics.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              ${BLOG_POSTS.map((b) => `
                <a href="/blog/${b.id}" class="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-2xs">
                  <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">${b.category}</span>
                  <h2 class="text-base font-bold text-slate-900 dark:text-white mb-2">${b.title}</h2>
                  <p class="text-xs text-slate-500 line-clamp-3">${b.summary}</p>
                </a>
              `).join('')}
            </div>
          </div>
        `,
      };
    }

    case 'tools': {
      const toolKeys = Object.keys(TOOL_CONFIG);
      return {
        title: 'Online File Forensics & Inspection Tools | AnyFileX',
        description: 'Free browser-based tools: Magic Byte Detector, File Identifier, EXIF Metadata Viewer, Hash Generator, and MIME Type Checker.',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">Universal File Forensics & Inspection Tools</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-8">Detect unknown file types, inspect magic byte signatures, view EXIF metadata, and verify file integrity in real-time.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              ${toolKeys.map((key) => {
                const tool = TOOL_CONFIG[key];
                return `
                  <a href="/tools/${key}" class="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 block transition-all shadow-2xs">
                    <h2 class="text-base font-bold text-slate-900 dark:text-white mb-1">${tool.name}</h2>
                    <p class="text-xs text-slate-500 leading-relaxed">${tool.desc}</p>
                    <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3 inline-block">Launch Tool &rarr;</span>
                  </a>
                `;
              }).join('')}
            </div>
            ${ssrDirectory('All Tools & Utilities', Object.values(TOOLS_REGISTRY).map((t) => ({ href: `/tools/${t.slug}`, label: t.name, note: t.categoryLabel })))}
          </div>
        `,
      };
    }

    case 'format-guide': {
      const guide = getOrGenerateFormatGuide(route.format);
      const title = guide.seoMeta.title;
      const description = guide.seoMeta.description;
      const breadcrumbs: BreadcrumbItemSchema[] = [
        { name: 'Home', path: '/' },
        { name: 'Format Guides', path: '/guides' },
        { name: `${guide.format} Guide`, path: `/format/${guide.slug}` },
      ];

      const specificSchemas: any[] = [
        {
          '@type': 'TechArticle',
          '@id': `${canonicalUrl}#article`,
          headline: guide.seoMeta.h1,
          description: guide.seoMeta.description,
          inLanguage: 'en-US',
          mainEntityOfPage: canonicalUrl,
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            name: 'AnyFileX',
            url: `${BASE_URL}/`,
          },
          author: {
            '@type': 'Organization',
            name: 'AnyFileX Technical Research Team',
            url: `${BASE_URL}/`,
          },
          publisher: {
            '@type': 'Organization',
            name: 'AnyFileX',
            url: `${BASE_URL}/`,
            logo: {
              '@type': 'ImageObject',
              url: `${BASE_URL}/favicon.svg`,
            },
          },
          about: {
            '@type': 'ComputerLanguage',
            name: `${guide.format} File Format`,
            alternateName: guide.fullName,
          },
        },
      ];

      if (guide.faqs && guide.faqs.length > 0) {
        specificSchemas.push({
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}/#faq`,
          mainEntity: guide.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        });
      }

      const prerenderedHtml = `
        <article class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
            <a href="/" class="hover:underline">Home</a> &rsaquo;
            <a href="/guides" class="hover:underline">Format Guides</a> &rsaquo;
            <span class="text-slate-900 dark:text-white font-semibold">What Is a ${guide.format} File?</span>
          </nav>
          <header class="mb-8">
            <div class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md font-mono text-xs font-bold mb-3">
              .${guide.slug} &bull; ${guide.category} &bull; MIME: ${guide.mimeType}
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              What Is a ${guide.format} File?
            </h1>
            <p class="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              ${guide.fullName} – ${guide.summary}
            </p>
          </header>
          <section class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span class="text-xs uppercase text-slate-400 font-semibold block">Standards Body</span>
              <strong class="text-slate-900 dark:text-white">${guide.developer}</strong>
            </div>
            <div>
              <span class="text-xs uppercase text-slate-400 font-semibold block">MIME Type</span>
              <code class="text-xs font-mono text-blue-600 dark:text-blue-400">${guide.mimeType}</code>
            </div>
            <div>
              <span class="text-xs uppercase text-slate-400 font-semibold block">Magic Bytes</span>
              <code class="text-xs font-mono text-amber-600 dark:text-amber-400">${guide.fileIdentification.magicBytesHex}</code>
            </div>
            <div>
              <span class="text-xs uppercase text-slate-400 font-semibold block">Initial Release</span>
              <span class="text-slate-900 dark:text-white font-medium">${guide.initialRelease}</span>
            </div>
          </section>
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. What Is a ${guide.format} File?</h2>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">${guide.whatIsOverview}</p>
          </section>
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Technical Characteristics</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${guide.characteristics.map((c) => `
                <div class="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h3 class="font-bold text-slate-900 dark:text-white">${c.title}: ${c.value}</h3>
                  <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">${c.description}</p>
                </div>
              `).join('')}
            </div>
          </section>
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. OS Compatibility Matrix</h2>
            <ul class="space-y-2">
              ${guide.osCompatibility.map((os) => `
                <li class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700 text-sm">
                  <strong>${os.osName}:</strong> ${os.statusText} (${os.nativeApp}) – ${os.setupInstructions}
                </li>
              `).join('')}
            </ul>
          </section>
        </article>
      `;

      return {
        title,
        description,
        breadcrumbs,
        ogType: 'article',
        specificSchemas,
        prerenderedHtml,
      };
    }

    case 'tool-detail': {
      const toolSlug = (route.slug || '').toLowerCase();
      const config = TOOL_CONFIG[toolSlug] || {
        name: toolSlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        title: `${toolSlug.toUpperCase()} – Free Browser Tool | AnyFileX`,
        desc: `Use the free ${toolSlug} file utility in your browser.`,
        keywords: `${toolSlug}, online file tool`,
      };

      return {
        statusCode: 200,
        title: `${config.title} | AnyFileX`,
        description: config.desc,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
          { name: config.name, path: `/tools/${toolSlug}` },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">${config.name}</h1>
            <p class="text-slate-600 dark:text-slate-300">${config.desc}</p>
          </div>
        `,
      };
    }

    case 'file-analyzer': {
      return {
        statusCode: 200,
        title: 'Universal File Analyzer & Forensics Inspector | AnyFileX',
        description: 'Inspect file binary headers, detect hidden embedded streams, extract EXIF/metadata, and compute cryptographic hashes in-memory.',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'File Analyzer', path: '/analyzer' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">Universal File Analyzer</h1>
            <p class="text-slate-600 dark:text-slate-300">Inspect binary structures, headers, and metadata in-browser.</p>
          </div>
        `,
      };
    }

    case 'resources': {
      return {
        statusCode: 200,
        title: 'File Format Documentation & Developer Resources | AnyFileX',
        description: 'Developer resources, magic byte tables, MIME type specifications, and file format engineering guides.',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">Developer Resources</h1>
            <p class="text-slate-600 dark:text-slate-300">Technical documentation, tables, and format specs.</p>
          </div>
        `,
      };
    }

    case 'content-hub': {
      const topic = route.topic || 'image';
      return {
        statusCode: 200,
        title: `${topic.toUpperCase()} Format Hub – Specifications & Converters | AnyFileX`,
        description: `Comprehensive hub for ${topic} file extensions, specifications, converters, and software.`,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: `${topic} Hub`, path: `/hub/${topic}` },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">${escapeHtml(topic)} Format Hub</h1>
          </div>
        `,
      };
    }

    case 'workflows': {
      return {
        statusCode: 200,
        title: 'Automated File Processing Workflows | AnyFileX',
        description: 'Create and run multi-step automated in-memory file transformation workflows in your browser.',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Workflows', path: '/workflows' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">File Workflows</h1>
          </div>
        `,
      };
    }

    case 'about': {
      return {
        title: 'About AnyFileX – Universal File Format Intelligence',
        description: 'Learn about AnyFileX, our mission to make every file format accessible, and our client-first privacy philosophy.',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-4xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">About AnyFileX</h1>
            <p class="text-slate-600 dark:text-slate-300">AnyFileX is the universal file format intelligence platform, empowering millions to open, convert, and inspect any digital file safely in their web browser.</p>
          </div>
        `,
      };
    }

    case 'contact': {
      return {
        title: 'Contact Support & Feedback | AnyFileX',
        description: 'Get in touch with the AnyFileX engineering and format support team for questions, format additions, or partnership inquiries.',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-3xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">Contact AnyFileX Support</h1>
            <p class="text-slate-600 dark:text-slate-300">Have a question about a file format or need technical assistance? Contact our team.</p>
          </div>
        `,
      };
    }

    case 'security-hub': {
      const allGuides = getAllTechnicalGuides();
      return {
        statusCode: 200,
        title: 'File Security & Technical Authority Center | AnyFileX',
        description: 'Comprehensive engineering references on file header mechanics, magic byte signatures, IANA media specifications, and binary security vulnerabilities.'.slice(0, 155),
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'File Security', path: '/security' },
        ],
        ogType: 'website',
        specificSchemas: [
          {
            '@type': 'CollectionPage',
            name: 'AnyFileX File Security & Technical Authority Center',
            description: 'Authoritative technical reference on file signatures, MIME types, cryptography, entropy, and file format mechanics.',
            url: `${BASE_URL}/security`,
          },
        ],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-6xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">File Security & Technical Authority Center</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-8">Authoritative technical reference on file signatures, binary magic bytes, MIME types, cryptography, and format vulnerability defenses.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${allGuides.map((g) => `
                <a href="/security/${g.slug}" class="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 block hover:border-blue-500">
                  <h2 class="font-bold text-slate-900 dark:text-white">${g.title}</h2>
                  <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">${g.subtitle}</p>
                </a>
              `).join('')}
            </div>
          </div>
        `,
      };
    }

    case 'technical-guide': {
      const guide = getTechnicalGuide((route as any).slug || '');
      const title = `${guide.title} | AnyFileX Technical Authority`;
      const description = guide.subtitle.slice(0, 155);
      return {
        statusCode: 200,
        title,
        description,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'File Security', path: '/security' },
          { name: guide.title, path: `/security/${guide.slug}` },
        ],
        ogType: 'article',
        specificSchemas: [
          {
            '@type': 'TechArticle',
            headline: guide.title,
            description: guide.subtitle,
            url: `${BASE_URL}/security/${guide.slug}`,
            mainEntityOfPage: `${BASE_URL}/security/${guide.slug}`,
            author: { '@id': `${BASE_URL}/#organization` },
            publisher: { '@id': `${BASE_URL}/#organization` },
          },
        ],
        prerenderedHtml: `
          <article class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500 flex gap-2">
              <a href="/" class="hover:underline">Home</a> &rsaquo;
              <a href="/security" class="hover:underline">File Security</a> &rsaquo;
              <span class="text-slate-900 dark:text-white font-semibold">${guide.title}</span>
            </nav>
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">${guide.title}</h1>
            <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">${guide.subtitle}</p>
          </article>
        `,
      };
    }

    case 'sitemaps': {
      return {
        statusCode: 200,
        title: 'XML Sitemaps Directory & Index | AnyFileX',
        description: 'Complete directory of segmented XML sitemaps for AnyFileX file extensions, format converters, desktop software, and technical guides.'.slice(0, 155),
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Sitemaps', path: '/sitemaps' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">AnyFileX XML Sitemaps Directory</h1>
            <p class="text-slate-600 dark:text-slate-300 mb-6">Directory of verified XML sitemaps powering search engine discovery across all format registries.</p>
            <ul class="space-y-3">
              <li><a href="/sitemap.xml" class="text-blue-600 hover:underline font-medium">/sitemap.xml (Master Sitemap Index)</a></li>
              <li><a href="/sitemap-core.xml" class="text-blue-600 hover:underline font-medium">/sitemap-core.xml (Core Platform Pages)</a></li>
              <li><a href="/sitemap-extensions.xml" class="text-blue-600 hover:underline font-medium">/sitemap-extensions.xml (File Extension Database)</a></li>
              <li><a href="/sitemap-converters.xml" class="text-blue-600 hover:underline font-medium">/sitemap-converters.xml (Format Converters)</a></li>
              <li><a href="/sitemap-troubleshoot.xml" class="text-blue-600 hover:underline font-medium">/sitemap-troubleshoot.xml (Troubleshoot & Repair Guides)</a></li>
              <li><a href="/sitemap-software.xml" class="text-blue-600 hover:underline font-medium">/sitemap-software.xml (Software Catalog)</a></li>
              <li><a href="/sitemap-guides.xml" class="text-blue-600 hover:underline font-medium">/sitemap-guides.xml (Technical & Knowledge Guides)</a></li>
              <li><a href="/sitemap-tools.xml" class="text-blue-600 hover:underline font-medium">/sitemap-tools.xml (Forensics & Inspection Tools)</a></li>
              <li><a href="/sitemap-mime.xml" class="text-blue-600 hover:underline font-medium">/sitemap-mime.xml (MIME Type Specifications)</a></li>
            </ul>
          </div>
        `,
      };
    }

    case 'seo-audit': {
      return {
        statusCode: 200,
        title: 'Technical SEO Audit & Indexation Status | AnyFileX',
        description: 'Real-time technical SEO inspection, schema graphs, meta tags validation, and indexation status for AnyFileX.'.slice(0, 155),
        robots: 'noindex, nofollow, noarchive, nosnippet',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'SEO Audit', path: '/seo-audit' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-5xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Technical SEO Audit</h1>
            <p class="text-slate-600 dark:text-slate-300">Crawlability, metadata indexability, and schema validation console.</p>
          </div>
        `,
      };
    }

    case 'assistant': {
      return {
        statusCode: 200,
        title: 'AI File Assistant & Format Advisor | AnyFileX',
        description: 'Ask questions about file formats, magic bytes, conversion strategies, and software compatibility.'.slice(0, 155),
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'AI Assistant', path: '/assistant' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-4xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">AI File Assistant</h1>
            <p class="text-slate-600 dark:text-slate-300">Format intelligence, magic byte lookup, and conversion guidance.</p>
          </div>
        `,
      };
    }

    case 'admin':
    case 'content-dashboard': {
      return {
        statusCode: 200,
        title: 'Restricted Administration Portal | AnyFileX',
        description: 'Administrative control center. Authorized personnel only.',
        robots: 'noindex, nofollow, noarchive, nosnippet',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Admin Portal', path: '/admin' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-xl mx-auto px-4 py-20 text-center">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Restricted Administration Portal</h1>
            <p class="text-slate-600 dark:text-slate-400 mb-6">Authentication credentials required to access administrative controls.</p>
          </div>
        `,
      };
    }

    case 'not-found':
    default: {
      return {
        statusCode: 404,
        title: '404 – Page Not Found | AnyFileX',
        description: 'The requested file extension specification, utility, or page could not be found on AnyFileX.',
        robots: 'noindex, nofollow',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: '404 Not Found', path: '/404' },
        ],
        ogType: 'website',
        specificSchemas: [],
        prerenderedHtml: `
          <div class="anyfilex-ssr-container max-w-3xl mx-auto px-4 py-16 text-center">
            <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">404 – Page Not Found</h1>
            <p class="text-slate-600 dark:text-slate-400 mb-8">The requested file format or page does not exist or has moved.</p>
            <a href="/" class="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold inline-block">Return to Home</a>
          </div>
        `,
      };
    }
  }
}
