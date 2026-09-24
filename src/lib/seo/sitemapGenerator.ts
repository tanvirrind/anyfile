import { getAllFileTypeInfos } from '../database/extensionEngine';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { GUIDES_LIST, BLOG_POSTS } from '../../data/guidesData';
import { CATEGORIES_LIST } from '../../data/categoriesData';
import { CURATED_COMPARISONS } from '../database/knowledgeGraph';
import { TROUBLESHOOTING_GUIDES } from '../database/troubleshootingData';
import { REPAIR_GUIDES } from '../../data/repairData';
import { TECHNICAL_AUTHORITY_GUIDES } from '../database/technicalAuthorityData';
import { EXPANDED_MIME_DATABASE } from '../../data/expandedMimeDatabase';
import { TOOLS_REGISTRY } from '../tools/toolsRegistry';
import { getPrioritizedFormatList } from '../guides/formatGuideEngine';
import { getAllSupportedConversionSlugs } from '../guides/conversionGuideEngine';
import { isExcludedFromSitemap } from '../routes/routeManifest';

const BASE_URL = 'https://anyfilex.com';

// Stable, deterministic platform content release date (avoids build-to-build lastmod churn).
const PLATFORM_RELEASE_DATE = '2026-09-18';

const MONTH_NUMBERS: Record<string, string> = {
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
};

/**
 * Normalises a lastmod value to W3C Datetime (YYYY-MM-DD), which the sitemap protocol
 * requires. Curated content stores human-readable dates ("August 2024") for display,
 * so they are converted here; anything unparseable safely falls back to the platform
 * release date instead of emitting invalid XML.
 */
export function normalizeLastmod(value: string | undefined): string {
  if (!value) return PLATFORM_RELEASE_DATE;
  const v = value.trim();
  const iso = v.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const monthYear = v.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const m = MONTH_NUMBERS[monthYear[1].toLowerCase()];
    if (m) return `${monthYear[2]}-${m}-01`;
  }
  const yearOnly = v.match(/^(\d{4})$/);
  if (yearOnly) return `${yearOnly[1]}-01-01`;
  return PLATFORM_RELEASE_DATE;
}

export interface SitemapItem {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export interface SitemapSegmentInfo {
  id: string;
  name: string;
  filename: string;
  desc: string;
}

export const SITEMAP_SEGMENTS: SitemapSegmentInfo[] = [
  { id: 'index', name: 'Master Sitemap Index', filename: 'sitemap.xml', desc: 'Master XML index pointing to all 18 domain sub-sitemaps' },
  { id: 'main', name: 'Core Hubs & Utilities', filename: 'sitemap-main.xml', desc: 'Main landing, category hubs, tools directory, AI assistant, and legal pages' },
  { id: 'images', name: 'Images & Photos', filename: 'sitemap-images.xml', desc: 'JPG, PNG, WEBP, HEIC, TIFF, AVIF, GIF, SVG, RAW, CR2, NEF, ARW, DNG' },
  { id: 'documents', name: 'Documents & Layout', filename: 'sitemap-documents.xml', desc: 'PDF, DOCX, XLSX, PPTX, EPUB, RTF, ODT, ODS, TXT, CSV, MD' },
  { id: 'archives', name: 'Archives & Executables', filename: 'sitemap-archives.xml', desc: 'ZIP, RAR, 7Z, TAR, GZ, ISO, CAB, BZ2, DMG, EXE, APK, MSI, DEB' },
  { id: 'cad', name: 'CAD, 3D & BIM', filename: 'sitemap-cad.xml', desc: 'DWG, DXF, STL, OBJ, STEP, IGES, FBX, IFC, GLTF, GLB, 3DS, BLEND' },
  { id: 'programming', name: 'Code & Data Structures', filename: 'sitemap-programming.xml', desc: 'JSON, XML, YAML, SQL, TS, JS, PY, HTML, CSS, SH, RS, GO, CPP' },
  { id: 'medical', name: 'Medical & Science', filename: 'sitemap-medical.xml', desc: 'DICOM, DCM, NII, FASTA, BAM, SAM, PDB, MAT, HDF5, LAS, GEOJSON' },
  { id: 'video', name: 'Video Containers', filename: 'sitemap-video.xml', desc: 'MP4, MKV, AVI, MOV, WEBM, FLV, WMV, M4V, TS, 3GP, OGV' },
  { id: 'audio', name: 'Audio Formats', filename: 'sitemap-audio.xml', desc: 'MP3, WAV, FLAC, AAC, OGG, M4A, MIDI, AIFF, WMA, ALAC, OPUS' },
  { id: 'how-to-open', name: 'How-to-Open Guides', filename: 'sitemap-how-to-open.xml', desc: 'Format-specific desktop and mobile opening instructions' },
  { id: 'comparisons', name: 'Format Comparisons', filename: 'sitemap-comparisons.xml', desc: 'Curated head-to-head file format technical comparisons' },
  { id: 'converters', name: 'Converters & Tools', filename: 'sitemap-converters.xml', desc: 'All active 1-to-1 conversion routes and online converter tools' },
  { id: 'troubleshoot', name: 'Troubleshoot & Repair', filename: 'sitemap-troubleshoot.xml', desc: 'Corrupt file diagnosis, CRC repair, header fixes, and recovery guides' },
  { id: 'security', name: 'Security & RFC Specs', filename: 'sitemap-security.xml', desc: 'Technical authority articles, magic byte forensics, entropy, and RFC specs' },
  { id: 'tools', name: 'Forensic & Browser Tools', filename: 'sitemap-tools.xml', desc: 'Client-side analyzers, metadata wipers, hash verifiers, and compressors' },
  { id: 'mime-types', name: 'MIME Type Directory', filename: 'sitemap-mime-types.xml', desc: 'Comprehensive MIME type specifications and magic byte signatures' },
  { id: 'software', name: 'Software Directory', filename: 'sitemap-software.xml', desc: 'Desktop, mobile, and open-source software application profiles' },
  { id: 'guides', name: 'Knowledge Base & Blog', filename: 'sitemap-guides.xml', desc: 'Format specifications, developer tutorials, and engineering blog articles' }
];

export function generateSitemapXml(items: SitemapItem[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  // A given <loc> may appear at most once per sitemap document, so dedupe before serializing.
  const seenUrls = new Set<string>();
  const uniqueItems = items.filter((item) => {
    try {
      const pathname = new URL(item.url).pathname;
      if (isExcludedFromSitemap(pathname)) return false;
    } catch {
      if (isExcludedFromSitemap(item.url)) return false;
    }
    if (seenUrls.has(item.url)) return false;
    seenUrls.add(item.url);
    return true;
  });
  const urlsetContent = uniqueItems
    .map(
      (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${normalizeLastmod(item.lastmod)}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');
  const urlsetClose = '\n</urlset>';

  return `${xmlHeader}${urlsetOpen}${urlsetContent}${urlsetClose}`;
}

export function generateSitemapIndexXml(sitemaps: { loc: string; lastmod: string }[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const indexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const indexContent = sitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${normalizeLastmod(s.lastmod)}</lastmod>
  </sitemap>`
    )
    .join('\n');
  const indexClose = '\n</sitemapindex>';

  return `${xmlHeader}${indexOpen}${indexContent}${indexClose}`;
}

// Sitemap XML derives purely from static content, so generate each segment once and
// reuse it for the life of the process (segment ids are a fixed, bounded set).
const sitemapXmlCache = new Map<string, string>();

export function getSegmentedSitemapXml(segment: string): string {
  const cached = sitemapXmlCache.get(segment);
  if (cached !== undefined) return cached;
  const xml = buildSegmentedSitemapXml(segment);
  sitemapXmlCache.set(segment, xml);
  return xml;
}

function buildSegmentedSitemapXml(segment: string): string {
  const allExts = getAllFileTypeInfos();

  if (segment === 'index') {
    const sitemaps = SITEMAP_SEGMENTS.filter((s) => s.id !== 'index').map((s) => ({
      loc: `${BASE_URL}/${s.filename}`,
      lastmod: PLATFORM_RELEASE_DATE,
    }));
    return generateSitemapIndexXml(sitemaps);
  }

  let items: SitemapItem[] = [];

  switch (segment) {
    case 'main':
    case 'core':
      items = [
        { url: `${BASE_URL}/`, lastmod: PLATFORM_RELEASE_DATE, changefreq: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/file-extensions`, lastmod: PLATFORM_RELEASE_DATE, changefreq: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/workflows`, lastmod: PLATFORM_RELEASE_DATE, changefreq: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/assistant`, lastmod: PLATFORM_RELEASE_DATE, changefreq: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/sitemaps`, lastmod: PLATFORM_RELEASE_DATE, changefreq: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/about`, lastmod: PLATFORM_RELEASE_DATE, changefreq: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/contact`, lastmod: PLATFORM_RELEASE_DATE, changefreq: 'monthly', priority: 0.5 },
        ...CATEGORIES_LIST.map((cat) => ({
          url: `${BASE_URL}/category/${cat.id}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly' as const,
          priority: 0.85,
        })),
      ];
      break;

    case 'how-to-open':
      items = [
        {
          url: `${BASE_URL}/how-to-open`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'daily',
          priority: 0.9,
        },
        ...allExts.map((e) => ({
          url: `${BASE_URL}/how-to-open/${e.extension.toLowerCase()}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly' as const,
          priority: 0.9,
        })),
      ];
      break;

    case 'comparisons':
    case 'compare':
      items = [
        {
          url: `${BASE_URL}/compare`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'daily',
          priority: 0.9,
        },
        ...CURATED_COMPARISONS.map((comp) => ({
          url: `${BASE_URL}/compare/${comp.slug.toLowerCase()}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly' as const,
          priority: 0.85,
        })),
      ];
      break;

    case 'images':
      items = allExts
        .filter((e) => e.category === 'Images')
        .map((e) => ({
          url: `${BASE_URL}/file-extensions/${e.extension.toLowerCase()}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly',
          priority: 0.9,
        }));
      break;

    case 'documents':
      items = allExts
        .filter((e) => e.category === 'Documents')
        .map((e) => ({
          url: `${BASE_URL}/file-extensions/${e.extension.toLowerCase()}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly',
          priority: 0.9,
        }));
      break;

    case 'archives':
      items = allExts
        .filter((e) => e.category === 'Archives' || e.category === 'System & Executables')
        .map((e) => ({
          url: `${BASE_URL}/file-extensions/${e.extension.toLowerCase()}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly',
          priority: 0.8,
        }));
      break;

    case 'cad':
      items = allExts
        .filter((e) => e.category === 'CAD & 3D')
        .map((e) => ({
          url: `${BASE_URL}/file-extensions/${e.extension.toLowerCase()}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly',
          priority: 0.9,
        }));
      break;

    case 'programming':
    case 'code':
      items = allExts
        .filter((e) => e.category === 'Code & Data')
        .map((e) => ({
          url: `${BASE_URL}/file-extensions/${e.extension.toLowerCase()}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly',
          priority: 0.8,
        }));
      break;

    case 'medical':
    case 'science':
      items = allExts
        .filter((e) => e.category === 'Medical & Science')
        .map((e) => ({
          url: `${BASE_URL}/file-extensions/${e.extension.toLowerCase()}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly',
          priority: 0.9,
        }));
      break;

    case 'video': {
      const videoExts = new Set(['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv', 'm4v', 'ts', '3gp', 'ogv', 'vob', 'mts', 'm2ts']);
      items = allExts
        .filter((e) => e.category === 'Audio & Video' && videoExts.has(e.extension.toLowerCase()))
        .map((e) => ({
          url: `${BASE_URL}/file-extensions/${e.extension.toLowerCase()}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly',
          priority: 0.85,
        }));
      break;
    }

    case 'audio': {
      const audioExts = new Set(['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'midi', 'mid', 'aiff', 'wma', 'alac', 'opus', 'amr']);
      items = allExts
        .filter((e) => e.category === 'Audio & Video' && audioExts.has(e.extension.toLowerCase()))
        .map((e) => ({
          url: `${BASE_URL}/file-extensions/${e.extension.toLowerCase()}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly',
          priority: 0.85,
        }));
      break;
    }

    case 'converters': {
      const supportedSlugs = getAllSupportedConversionSlugs();
      const slugSet = new Set(supportedSlugs);
      
      items = [
        {
          url: `${BASE_URL}/converters`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'daily',
          priority: 0.95,
        },
        ...supportedSlugs.map((slug) => ({
          url: `${BASE_URL}/converters/${slug}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly' as const,
          priority: 0.9,
        })),
        ...CONVERTERS_LIST.filter((c) => !slugSet.has(c.id)).map((c) => ({
          url: `${BASE_URL}/converters/${c.id}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly' as const,
          priority: 0.85,
        })),
      ];
      break;
    }

    case 'software':
      items = [
        {
          url: `${BASE_URL}/software`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'daily',
          priority: 0.8,
        },
        ...SOFTWARE_LIST.map((s) => ({
          url: `${BASE_URL}/software/${s.id}`,
          lastmod: (s as any).lastUpdated || PLATFORM_RELEASE_DATE,
          changefreq: 'weekly' as const,
          priority: 0.75,
        })),
      ];
      break;

    case 'troubleshoot':
    case 'repair': {
      const seenIds = new Set<string>();
      const guideItems: SitemapItem[] = [];

      TROUBLESHOOTING_GUIDES.forEach((tg) => {
        seenIds.add(tg.id);
        guideItems.push({
          url: `${BASE_URL}/troubleshoot/${tg.id}`,
          lastmod: (tg as any).updatedDate || PLATFORM_RELEASE_DATE,
          changefreq: 'weekly',
          priority: 0.9,
        });
      });

      REPAIR_GUIDES.forEach((rg) => {
        if (!seenIds.has(rg.id)) {
          seenIds.add(rg.id);
          guideItems.push({
            url: `${BASE_URL}/troubleshoot/${rg.id}`,
            lastmod: (rg as any).updatedDate || PLATFORM_RELEASE_DATE,
            changefreq: 'weekly',
            priority: 0.85,
          });
        }
      });

      items = [
        {
          url: `${BASE_URL}/troubleshoot`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'daily',
          priority: 0.95,
        },
        ...guideItems,
      ];
      break;
    }

    case 'security':
    case 'technical-guides':
      items = [
        {
          url: `${BASE_URL}/security`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'daily',
          priority: 0.95,
        },
        ...TECHNICAL_AUTHORITY_GUIDES.map((guide) => ({
          url: `${BASE_URL}/security/${guide.slug}`,
          lastmod: guide.lastUpdated || PLATFORM_RELEASE_DATE,
          changefreq: 'weekly' as const,
          priority: 0.9,
        })),
      ];
      break;

    case 'tools': {
      const toolSlugs = Object.keys(TOOLS_REGISTRY).filter((slug) => slug !== 'file-analyzer');
      items = [
        {
          url: `${BASE_URL}/tools`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'daily',
          priority: 0.95,
        },
        ...toolSlugs.map((slug) => ({
          url: `${BASE_URL}/tools/${slug}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly' as const,
          priority: 0.9,
        })),
      ];
      // Deduplicate by URL
      const uniqueUrlMap = new Map<string, SitemapItem>();
      items.forEach((it) => uniqueUrlMap.set(it.url, it));
      items = Array.from(uniqueUrlMap.values());
      break;
    }

    case 'mime-types':
    case 'mime': {
      const seenMimes = new Set<string>();
      const mimeItems: SitemapItem[] = [];

      EXPANDED_MIME_DATABASE.forEach((record) => {
        const slug = record.mimeType.replace('/', '-').toLowerCase();
        const encodedSlug = encodeURIComponent(slug);
        if (!seenMimes.has(slug)) {
          seenMimes.add(slug);
          mimeItems.push({
            url: `${BASE_URL}/mime-type/${encodedSlug}`,
            lastmod: PLATFORM_RELEASE_DATE,
            changefreq: 'weekly',
            priority: 0.85,
          });
        }
      });

      items = mimeItems;
      break;
    }

    case 'guides':
    case 'blog':
      items = [
        {
          url: `${BASE_URL}/guides`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'daily',
          priority: 0.9,
        },
        {
          url: `${BASE_URL}/blog`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'daily',
          priority: 0.9,
        },
        ...GUIDES_LIST.map((g) => ({
          url: `${BASE_URL}/guides/${g.id}`,
          lastmod: (g as any).updatedDate || (g as any).publishedDate || PLATFORM_RELEASE_DATE,
          changefreq: 'monthly' as const,
          priority: 0.75,
        })),
        ...BLOG_POSTS.map((b) => ({
          url: `${BASE_URL}/blog/${b.id}`,
          lastmod: (b as any).lastModified || (b as any).updatedDate || b.date || PLATFORM_RELEASE_DATE,
          changefreq: 'monthly' as const,
          priority: 0.75,
        })),
      ];
      break;

    default:
      items = [
        { url: `${BASE_URL}/`, lastmod: PLATFORM_RELEASE_DATE, changefreq: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/file-extensions`, lastmod: PLATFORM_RELEASE_DATE, changefreq: 'daily', priority: 0.9 },
        ...CATEGORIES_LIST.map((cat) => ({
          url: `${BASE_URL}/category/${cat.id}`,
          lastmod: PLATFORM_RELEASE_DATE,
          changefreq: 'weekly' as const,
          priority: 0.8,
        })),
      ];
      break;
  }

  return generateSitemapXml(items);
}

/**
 * Returns a complete master list of all valid, indexable canonical URLs
 * across the entire AnyFileX platform for SEO audits, verification, and sitemaps.
 */
export function getAllPlatformSitemapItems(): SitemapItem[] {
  const segmentKeys = SITEMAP_SEGMENTS.filter((s) => s.id !== 'index').map((s) => s.id);
  const allItems: SitemapItem[] = [];
  const seenUrls = new Set<string>();

  for (const seg of segmentKeys) {
    const xml = getSegmentedSitemapXml(seg);
    const matches = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>[\s\S]*?<changefreq>([^<]+)<\/changefreq>[\s\S]*?<priority>([^<]+)<\/priority>/g));
    for (const match of matches) {
      const url = match[1];
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        allItems.push({
          url,
          lastmod: match[2],
          changefreq: match[3] as any,
          priority: parseFloat(match[4]),
        });
      }
    }
  }

  return allItems;
}

/**
 * Generates a full single XML sitemap document containing every indexable platform URL.
 */
export function generateFullCombinedSitemapXml(): string {
  const items = getAllPlatformSitemapItems();
  return generateSitemapXml(items);
}

