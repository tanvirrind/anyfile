import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { REPAIR_GUIDES } from '../../data/repairData';
import { TROUBLESHOOTING_GUIDES } from '../database/troubleshootingData';
import { GUIDES_DATA } from '../../data/guidesData';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { CATEGORIES_LIST } from '../../data/categoriesData';
import { CURATED_COMPARISONS } from '../database/knowledgeGraph';
import { TECHNICAL_AUTHORITY_GUIDES } from '../database/technicalAuthorityData';
import { EXPANDED_MIME_DATABASE } from '../../data/expandedMimeDatabase';
import { TOOLS_REGISTRY } from '../tools/toolsRegistry';
import { getPrioritizedFormatList } from '../guides/formatGuideEngine';
import { renderSsrPageHtml } from './ssrRenderer';

/**
 * Equivalent to Next.js generateStaticParams()
 * Generates all indexable route paths across the entire AnyFileX application
 */
export function getStaticRoutePaths(): string[] {
  const routes: string[] = [
    '/',
    '/file-extensions',
    '/how-to-open',
    '/compare',
    '/converters',
    '/troubleshoot',
    '/security',
    '/tools',
    '/software',
    '/guides',
    '/blog',
    '/mime-types',
    '/workflows',
    '/about',
    '/contact',
    '/seo-audit',
    '/sitemaps',
    '/assistant',
    '/404',
  ];

  // 1. All Top Popular and Special Extension Pages
  POPULAR_FILE_TYPES.forEach((ft) => {
    routes.push(`/file-extensions/${ft.extension.toLowerCase()}`);
  });

  // Additional curated top high-volume extensions
  const additionalExtensions = [
    'ai', 'eps', 'cdr', 'svg', 'indd', 'raw', 'cr2', 'nef', 'arw', 'dng',
    '7z', 'rar', 'tar', 'gz', 'bz2', 'iso', 'dmg',
    'mkv', 'flv', 'avi', 'mov', 'wmv', 'webm', 'wav', 'flac', 'aac', 'ogg',
    'sql', 'sqlite', 'db', 'mdb', 'accdb',
    'dcm', 'dicom', 'nii', 'pdb',
    'dwg', 'dxf', 'step', 'stp', 'iges', 'igs', 'stl', 'blend', 'fbx', 'obj',
    'epub', 'mobi', 'azw3', 'djvu',
    'ttf', 'otf', 'woff', 'woff2',
    'exe', 'dll', 'apk', 'ipa', 'msi', 'deb', 'rpm'
  ];
  additionalExtensions.forEach((ext) => {
    const route = `/file-extensions/${ext.toLowerCase()}`;
    if (!routes.includes(route)) routes.push(route);
  });

  // 2. All Converters
  CONVERTERS_LIST.forEach((c) => {
    routes.push(`/converters/${c.id}`);
  });

  // 3. All Troubleshoot & Repair Guides
  REPAIR_GUIDES.forEach((r) => {
    routes.push(`/troubleshoot/${r.id}`);
  });
  TROUBLESHOOTING_GUIDES.forEach((tg) => {
    routes.push(`/troubleshoot/${tg.id}`);
  });

  // 4. All Technical Authority & Security Guides
  TECHNICAL_AUTHORITY_GUIDES.forEach((guide) => {
    routes.push(`/security/${guide.slug}`);
  });

  // 5. All Forensic Tools & Utilities
  Object.keys(TOOLS_REGISTRY).forEach((toolSlug) => {
    routes.push(`/tools/${toolSlug}`);
  });
  routes.push(
    '/tools/file-identifier',
    '/tools/metadata-viewer',
    '/tools/remove-metadata',
    '/tools/hash-generator',
    '/tools/checksum-verifier',
    '/tools/mime-checker',
    '/tools/magic-byte-detector',
    '/tools/file-analyzer',
    '/tools/zip-creator',
    '/tools/zip-extractor'
  );

  // 6. Top MIME Types
  EXPANDED_MIME_DATABASE.slice(0, 50).forEach((record) => {
    const slug = record.mimeType.replace('/', '-').toLowerCase();
    routes.push(`/mime-type/${slug}`);
  });

  // 7. All Software Apps
  SOFTWARE_LIST.forEach((s) => {
    routes.push(`/software/${s.id}`);
  });

  // 8. All Categories
  CATEGORIES_LIST.forEach((cat) => {
    routes.push(`/category/${cat.id}`);
  });

  // 9. All Guides & Blog Posts
  GUIDES_DATA.forEach((g) => {
    routes.push(`/guides/${g.id}`);
  });

  // 10. Curated Comparisons
  CURATED_COMPARISONS.forEach((comp) => {
    routes.push(`/compare/${comp.slug}`);
  });

  // 11. Format Authority Guides & How To Open
  const formats = getPrioritizedFormatList();
  formats.forEach((fmt) => {
    routes.push(`/file-extensions/${fmt}`);
    routes.push(`/how-to-open/${fmt}`);
  });

  return Array.from(new Set(routes));
}

/**
 * Generates full static HTML string for any given route path
 */
export function generateStaticHtmlForRoute(pathname: string, templateHtml: string): { html: string; statusCode: number } {
  return renderSsrPageHtml(pathname, templateHtml);
}
