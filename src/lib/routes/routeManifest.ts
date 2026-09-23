/**
 * Shared, Typed Content & Route Manifest for AnyFileX
 *
 * Single source of truth driving:
 * - Next.js App Router dynamic routes & generateStaticParams()
 * - SEO Metadata (titles, descriptions, canonical URLs, robots)
 * - Next.js & static XML sitemaps
 * - 404 validation for unknown extensions, missing software, or invalid parameters
 * - URL normalization & redirects
 */

import { getAllFileTypeInfos, isVerifiedExtension } from '../database/extensionEngine';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { CATEGORIES_LIST } from '../../data/categoriesData';
import { GUIDES_LIST, BLOG_POSTS } from '../../data/guidesData';
import { CURATED_COMPARISONS } from '../database/knowledgeGraph';
import { TROUBLESHOOTING_GUIDES } from '../database/troubleshootingData';
import { REPAIR_GUIDES } from '../../data/repairData';
import { TECHNICAL_AUTHORITY_GUIDES } from '../database/technicalAuthorityData';
import { TOOLS_REGISTRY } from '../tools/toolsRegistry';
import { EXPANDED_MIME_DATABASE } from '../../data/expandedMimeDatabase';
import { getPrioritizedFormatList } from '../guides/formatGuideEngine';
import { getAllSupportedConversionSlugs } from '../guides/conversionGuideEngine';

export const BASE_URL = 'https://www.anyfilex.com';
export const PLATFORM_RELEASE_DATE = '2026-09-18';

export type RouteType =
  | 'home'
  | 'extension-hub'
  | 'extension-detail'
  | 'software-hub'
  | 'software-detail'
  | 'how-to-open-hub'
  | 'how-to-open-detail'
  | 'compare-hub'
  | 'compare-detail'
  | 'converters-hub'
  | 'converter-detail'
  | 'troubleshoot-hub'
  | 'troubleshoot-detail'
  | 'security-hub'
  | 'security-detail'
  | 'tools-hub'
  | 'tool-detail'
  | 'category-detail'
  | 'guides-hub'
  | 'guide-detail'
  | 'blog-hub'
  | 'blog-detail'
  | 'about'
  | 'contact'
  | 'editorial-standards'
  | 'authors'
  | 'sitemaps'
  | 'mime-hub'
  | 'mime-detail'
  | 'workflows';

export interface RouteManifestEntry {
  path: string;
  canonicalUrl: string;
  type: RouteType;
  title: string;
  description: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  sitemapSegment: string;
  isIndexable: boolean;
  params?: Record<string, string>;
}

/**
 * Checks if a path should strictly be excluded from the sitemap and crawler indexes.
 * Admin, CMS, SEO Audit, tool file-result pages, and temporary dynamic user URLs.
 */
export function isExcludedFromSitemap(path: string): boolean {
  const clean = path.toLowerCase().replace(/\/+$/, '') || '/';
  if (
    clean.startsWith('/admin') ||
    clean.startsWith('/admin-cms') ||
    clean.startsWith('/seo-audit') ||
    clean.startsWith('/tools/file-identifier/result') ||
    clean.startsWith('/tools/metadata-viewer/result') ||
    clean.includes('/result/') ||
    clean === '/404' ||
    clean === '/not-found'
  ) {
    return true;
  }
  return false;
}

/**
 * Exact format segment mapper for categorized sitemaps
 */
export function getExtensionSitemapSegment(category: string): string {
  const c = (category || '').toLowerCase();
  if (c.includes('image') || c.includes('photo') || c.includes('raster') || c.includes('vector')) return 'images';
  if (c.includes('document') || c.includes('text') || c.includes('pdf') || c.includes('office') || c.includes('sheet') || c.includes('slide')) return 'documents';
  if (c.includes('cad') || c.includes('3d') || c.includes('bim') || c.includes('mesh')) return 'cad';
  if (c.includes('code') || c.includes('programming') || c.includes('developer') || c.includes('data')) return 'programming';
  if (c.includes('medical') || c.includes('science') || c.includes('bio') || c.includes('genomic')) return 'medical';
  if (c.includes('video') || c.includes('movie') || c.includes('film')) return 'video';
  if (c.includes('audio') || c.includes('music') || c.includes('sound')) return 'audio';
  if (c.includes('archive') || c.includes('executable') || c.includes('system') || c.includes('disk') || c.includes('package')) return 'archives';
  return 'main';
}

/**
 * Validates whether an extension is legitimate and present in the catalog.
 * Unknown or malicious extensions return false -> causes 404 response with noindex.
 */
export function isValidCatalogExtension(ext: string): boolean {
  if (!ext || typeof ext !== 'string') return false;
  const clean = ext.trim().toLowerCase().replace(/^\./, '');
  if (!clean || clean.length > 20) return false;
  return isVerifiedExtension(clean);
}

/**
 * Validates software slug against catalog
 */
export function isValidSoftwareId(id: string): boolean {
  if (!id) return false;
  const clean = id.trim().toLowerCase();
  return SOFTWARE_LIST.some((s) => s.id.toLowerCase() === clean);
}

/**
 * Validates category slug against catalog
 */
export function isValidCategoryId(id: string): boolean {
  if (!id) return false;
  const clean = id.trim().toLowerCase();
  return CATEGORIES_LIST.some((c) => c.id.toLowerCase() === clean);
}

/**
 * Validates comparison slug against catalog
 */
export function isValidComparisonSlug(slug: string): boolean {
  if (!slug) return false;
  const clean = slug.trim().toLowerCase();
  return CURATED_COMPARISONS.some((c) => c.slug.toLowerCase() === clean);
}

/**
 * Validates tool slug against catalog
 */
export function isValidToolSlug(slug: string): boolean {
  if (!slug) return false;
  const clean = slug.trim().toLowerCase();
  return Object.keys(TOOLS_REGISTRY).some((t) => t.toLowerCase() === clean);
}

/**
 * Validates converter ID against catalog
 */
export function isValidConverterId(id: string): boolean {
  if (!id) return false;
  const clean = id.trim().toLowerCase();
  return CONVERTERS_LIST.some((c) => c.id.toLowerCase() === clean);
}

/**
 * Builds the complete, validated Route Manifest for the application.
 * All entries are verified against real catalog data with no hallucinated formats.
 */
export function buildRouteManifest(): RouteManifestEntry[] {
  const entries: RouteManifestEntry[] = [];
  const seenPaths = new Set<string>();

  const add = (entry: RouteManifestEntry) => {
    const cleanPath = entry.path.replace(/\/+$/, '') || '/';
    if (seenPaths.has(cleanPath)) return;
    if (isExcludedFromSitemap(cleanPath)) return;
    seenPaths.add(cleanPath);
    entries.push({
      ...entry,
      path: cleanPath,
      canonicalUrl: `${BASE_URL}${cleanPath === '/' ? '' : cleanPath}`,
    });
  };

  // 1. Core Platform Hubs
  add({
    path: '/',
    canonicalUrl: BASE_URL,
    type: 'home',
    title: 'AnyFileX – Universal File Format Intelligence & Tools',
    description: 'Inspect file formats, verify magic byte signatures, convert files in-browser, and view opening guides for 250+ file extensions.',
    priority: 1.0,
    changefreq: 'daily',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/file-extensions',
    canonicalUrl: `${BASE_URL}/file-extensions`,
    type: 'extension-hub',
    title: 'File Extensions Directory – Technical Format Specifications',
    description: 'Search and browse comprehensive technical specifications, MIME types, and header magic bytes for 250+ file extensions.',
    priority: 0.95,
    changefreq: 'daily',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/software',
    canonicalUrl: `${BASE_URL}/software`,
    type: 'software-hub',
    title: 'Compatible Software & App Directory – AnyFileX',
    description: 'Explore compatible desktop, web, and mobile software applications for opening, converting, and editing file formats.',
    priority: 0.85,
    changefreq: 'weekly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/how-to-open',
    canonicalUrl: `${BASE_URL}/how-to-open`,
    type: 'how-to-open-hub',
    title: 'How to Open Any File Format – Step-by-Step Guides',
    description: 'Practical guides and instructions for opening unknown or unsupported files across Windows, macOS, Linux, iOS, and Android.',
    priority: 0.9,
    changefreq: 'weekly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/compare',
    canonicalUrl: `${BASE_URL}/compare`,
    type: 'compare-hub',
    title: 'File Format Comparisons – Technical Differences Explained',
    description: 'Side-by-side technical comparisons between competing file formats: compression, quality, metadata, and compatibility.',
    priority: 0.85,
    changefreq: 'weekly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/converters',
    canonicalUrl: `${BASE_URL}/converters`,
    type: 'converters-hub',
    title: 'In-Browser File Converters – Free & Private',
    description: 'Convert images, documents, audio, and archives directly in your web browser with 100% privacy and zero server uploads.',
    priority: 0.9,
    changefreq: 'weekly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/troubleshoot',
    canonicalUrl: `${BASE_URL}/troubleshoot`,
    type: 'troubleshoot-hub',
    title: 'File Troubleshooting & Repair Guides – AnyFileX',
    description: 'Fix corrupted file headers, resolve missing codecs, and repair unreadable files with verified recovery techniques.',
    priority: 0.85,
    changefreq: 'weekly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/security',
    canonicalUrl: `${BASE_URL}/security`,
    type: 'security-hub',
    title: 'File Security & Forensic Analysis – AnyFileX',
    description: 'Technical security research on executable disguises, macro payloads, polyglot files, and header integrity verification.',
    priority: 0.85,
    changefreq: 'weekly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/tools',
    canonicalUrl: `${BASE_URL}/tools`,
    type: 'tools-hub',
    title: 'Universal Client-Side File Forensics & Utilities – AnyFileX',
    description: 'Free client-side file inspection utilities: magic byte detector, hash generator, EXIF viewer, and MIME validator.',
    priority: 0.9,
    changefreq: 'weekly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/guides',
    canonicalUrl: `${BASE_URL}/guides`,
    type: 'guides-hub',
    title: 'File Format Knowledge & Technical Guides – AnyFileX',
    description: 'In-depth engineering articles on container architectures, codec specifications, and binary data structures.',
    priority: 0.85,
    changefreq: 'weekly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/about',
    canonicalUrl: `${BASE_URL}/about`,
    type: 'about',
    title: 'About AnyFileX – Universal File Intelligence Platform',
    description: 'Learn about the mission, engineering principles, and privacy-first local browser processing behind AnyFileX.',
    priority: 0.5,
    changefreq: 'monthly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/contact',
    canonicalUrl: `${BASE_URL}/contact`,
    type: 'contact',
    title: 'Contact the AnyFileX Engineering Team',
    description: 'Get in touch with format engineers, report broken signatures, or suggest new file extensions for catalog indexing.',
    priority: 0.5,
    changefreq: 'monthly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/editorial-standards',
    canonicalUrl: `${BASE_URL}/editorial-standards`,
    type: 'editorial-standards',
    title: 'Editorial Standards & Technical Verification Process – AnyFileX',
    description: 'Our methodology for byte verification, RFC standards validation, and reverse engineering file specifications.',
    priority: 0.5,
    changefreq: 'monthly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  add({
    path: '/sitemaps',
    canonicalUrl: `${BASE_URL}/sitemaps`,
    type: 'sitemaps',
    title: 'XML Sitemaps Directory – AnyFileX',
    description: 'Directory of all segmented sitemaps indexing file extensions, software applications, converters, and guides.',
    priority: 0.4,
    changefreq: 'weekly',
    sitemapSegment: 'main',
    isIndexable: true,
  });

  // 2. Verified File Extensions (Driven strictly by catalog)
  const fileTypes = getAllFileTypeInfos();
  for (const ft of fileTypes) {
    const ext = ft.extension.toLowerCase();
    if (!isValidCatalogExtension(ext)) continue;
    const segment = getExtensionSitemapSegment(ft.category);
    add({
      path: `/file-extensions/${ext}`,
      canonicalUrl: `${BASE_URL}/file-extensions/${ext}`,
      type: 'extension-detail',
      title: `.${ft.extension.toUpperCase()} File Extension: What It Is & How to Open It`,
      description: `Complete guide to .${ft.extension.toUpperCase()} (${ft.name}): MIME types, header magic bytes, compatible software, and conversion options.`,
      priority: 0.8,
      changefreq: 'weekly',
      sitemapSegment: segment,
      isIndexable: true,
      params: { ext },
    });
  }

  // 3. Verified Software Catalog
  for (const soft of SOFTWARE_LIST) {
    const isGoogleDocs = soft.id === 'google-docs';
    const title = isGoogleDocs
      ? 'Google Docs File Types: What Files Can Google Docs Open?'
      : `${soft.name} – Supported Formats & Review | AnyFileX`;
    const description = isGoogleDocs
      ? 'Discover what files Google Docs can open and export. Complete guide to supported formats, DOCX, ODT, PDF, EPUB, RTF, TXT, HTML compatibility and limitations.'
      : `${soft.name} by ${soft.developer}: supported file formats, platforms (${(soft.supportedOS || []).join(', ')}), and features.`.slice(0, 155);

    add({
      path: `/software/${soft.id}`,
      canonicalUrl: `${BASE_URL}/software/${soft.id}`,
      type: 'software-detail',
      title,
      description,
      priority: 0.75,
      changefreq: 'weekly',
      sitemapSegment: 'main',
      isIndexable: true,
      params: { id: soft.id },
    });
  }

  // 4. Categories
  for (const cat of CATEGORIES_LIST) {
    add({
      path: `/category/${cat.id}`,
      canonicalUrl: `${BASE_URL}/category/${cat.id}`,
      type: 'category-detail',
      title: `${cat.name} File Extensions & Formats Catalog – AnyFileX`,
      description: `Explore all ${cat.name} file extensions, container structures, specifications, and compatible software.`,
      priority: 0.8,
      changefreq: 'weekly',
      sitemapSegment: 'main',
      isIndexable: true,
      params: { id: cat.id },
    });
  }

  // 5. Converters
  for (const conv of CONVERTERS_LIST) {
    add({
      path: `/converters/${conv.id}`,
      canonicalUrl: `${BASE_URL}/converters/${conv.id}`,
      type: 'converter-detail',
      title: `${conv.name} – Free In-Browser Converter | AnyFileX`,
      description: `${conv.description} 100% private client-side conversion in your browser with zero server uploads.`,
      priority: 0.85,
      changefreq: 'weekly',
      sitemapSegment: 'converters',
      isIndexable: true,
      params: { id: conv.id },
    });
  }

  // 6. How to Open Guides
  const prioritizedFormats = getPrioritizedFormatList();
  for (const format of prioritizedFormats) {
    const ext = format.toLowerCase();
    if (!isValidCatalogExtension(ext)) continue;
    add({
      path: `/how-to-open/${ext}`,
      canonicalUrl: `${BASE_URL}/how-to-open/${ext}`,
      type: 'how-to-open-detail',
      title: `How to Open .${format.toUpperCase()} Files on Windows, Mac, and Mobile`,
      description: `Step-by-step instructions for opening and viewing .${format.toUpperCase()} files without paid software.`,
      priority: 0.8,
      changefreq: 'weekly',
      sitemapSegment: 'how-to-open',
      isIndexable: true,
      params: { ext },
    });
  }

  // 7. Comparisons
  for (const comp of CURATED_COMPARISONS) {
    add({
      path: `/compare/${comp.slug}`,
      canonicalUrl: `${BASE_URL}/compare/${comp.slug}`,
      type: 'compare-detail',
      title: `${comp.title} – Detailed Technical Comparison | AnyFileX`,
      description: `Comprehensive comparison of ${comp.ext1.toUpperCase()} vs ${comp.ext2.toUpperCase()}: compression efficiency, fidelity, and application compatibility.`,
      priority: 0.8,
      changefreq: 'monthly',
      sitemapSegment: 'comparisons',
      isIndexable: true,
      params: { slug: comp.slug },
    });
  }

  // 8. Troubleshooting & Repair
  for (const guide of TROUBLESHOOTING_GUIDES) {
    add({
      path: `/troubleshoot/${guide.id}`,
      canonicalUrl: `${BASE_URL}/troubleshoot/${guide.id}`,
      type: 'troubleshoot-detail',
      title: `${guide.title} – Troubleshooting Guide | AnyFileX`,
      description: guide.problemSummary,
      priority: 0.75,
      changefreq: 'monthly',
      sitemapSegment: 'troubleshoot',
      isIndexable: true,
      params: { id: guide.id },
    });
  }

  // 9. Technical & Security
  for (const tech of TECHNICAL_AUTHORITY_GUIDES) {
    add({
      path: `/security/${tech.slug}`,
      canonicalUrl: `${BASE_URL}/security/${tech.slug}`,
      type: 'security-detail',
      title: `${tech.title} – Security & Forensics Authority | AnyFileX`,
      description: tech.executiveSummary,
      priority: 0.8,
      changefreq: 'monthly',
      sitemapSegment: 'security',
      isIndexable: true,
      params: { slug: tech.slug },
    });
  }

  // 10. Tools (excluding user result pages)
  for (const [slug, tool] of Object.entries(TOOLS_REGISTRY)) {
    add({
      path: `/tools/${slug}`,
      canonicalUrl: `${BASE_URL}/tools/${slug}`,
      type: 'tool-detail',
      title: `${tool.name} – Free Browser Utility | AnyFileX`,
      description: tool.description,
      priority: 0.85,
      changefreq: 'weekly',
      sitemapSegment: 'tools',
      isIndexable: true,
      params: { slug },
    });
  }

  // 11. Guides
  for (const g of GUIDES_LIST) {
    add({
      path: `/guides/${g.id}`,
      canonicalUrl: `${BASE_URL}/guides/${g.id}`,
      type: 'guide-detail',
      title: `${g.title} – AnyFileX Technical Guide`,
      description: g.summary,
      priority: 0.75,
      changefreq: 'monthly',
      sitemapSegment: 'guides',
      isIndexable: true,
      params: { id: g.id },
    });
  }

  return entries;
}

/**
 * Returns all static params for a given route type
 */
export function getStaticParamsForRouteType(type: RouteType): Array<Record<string, string>> {
  const manifest = buildRouteManifest();
  return manifest
    .filter((e) => e.type === type && e.params)
    .map((e) => e.params!);
}

/**
 * Looks up manifest entry by exact path
 */
export function getRouteManifestEntry(path: string): RouteManifestEntry | undefined {
  const clean = path.replace(/\/+$/, '') || '/';
  const manifest = buildRouteManifest();
  return manifest.find((e) => e.path === clean);
}
