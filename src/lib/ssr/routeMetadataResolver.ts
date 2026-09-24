import { parsePathToRoute, routeToPath } from '../../utils/router';
import { AppRoute } from '../../types';
import { BreadcrumbItemSchema } from '../../components/SEOHead';
import { deriveDynamicMetadata, DynamicPageMeta } from '../seo/dynamicPageSeo';

export interface RouteMetadata {
  statusCode: number;
  title: string;
  description: string;
  canonicalPath: string;
  canonicalUrl: string;
  robots: string;
  ogType: 'website' | 'article';
  ogImage: string;
  ogImageAlt: string;
  breadcrumbs: BreadcrumbItemSchema[];
  schemaGraph: any[];
  prerenderedHtml: string;
  route: AppRoute;
}

const BASE_URL = 'https://anyfilex.com';

// Bounded LRU memo: metadata is deterministic per (pathname, search), and deriving the
// prerendered HTML + schema graph is the expensive part of every SSR request. Bounded
// because the query string (e.g. ?q=) is caller-controlled and effectively unbounded.
const METADATA_CACHE_LIMIT = 500;
const metadataCache = new Map<string, RouteMetadata>();

/**
 * High-performance route metadata resolver.
 * Parses incoming URL path/parameters and derives dynamic SEO titles, descriptions,
 * schema graphs, and prerendered HTML content dynamically.
 * Results are memoized per (pathname, search).
 */
export function resolveRouteMetadata(pathname: string, search: string = ''): RouteMetadata {
  const cacheKey = `${pathname}|${search}`;
  const cached = metadataCache.get(cacheKey);
  if (cached) {
    // Refresh recency so hot routes survive eviction.
    metadataCache.delete(cacheKey);
    metadataCache.set(cacheKey, cached);
    return cached;
  }
  const resolved = buildRouteMetadata(pathname, search);
  if (metadataCache.size >= METADATA_CACHE_LIMIT) {
    const oldest = metadataCache.keys().next().value;
    if (oldest !== undefined) metadataCache.delete(oldest);
  }
  metadataCache.set(cacheKey, resolved);
  return resolved;
}

function buildRouteMetadata(pathname: string, search: string = ''): RouteMetadata {
  const route = parsePathToRoute(pathname, search);
  const cleanPath = routeToPath(route);
  const isHome = cleanPath === '/' || route.view === 'home';
  const canonicalUrl = `${BASE_URL}${isHome ? '/' : cleanPath}`;

  // Base Organization & WebSite Schemas
  const baseOrgSchema = {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'AnyFileX',
    url: `${BASE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      url: `${BASE_URL}/favicon.svg`,
      caption: 'AnyFileX Logo',
      width: 512,
      height: 512,
    },
    image: `${BASE_URL}/favicon.svg`,
    sameAs: ['https://twitter.com/anyfilex', 'https://github.com/anyfilex'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${BASE_URL}/contact`,
    },
  };

  const baseWebSiteSchema = {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'AnyFileX',
    alternateName: ['anyfilex.com'],
    url: `${BASE_URL}/`,
    description: 'Open Any File in Seconds with AnyFileX. Convert, repair, inspect, and identify digital file formats.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'en-US',
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/file-extensions?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    ],
  };

  const buildBreadcrumbSchema = (crumbs: BreadcrumbItemSchema[]) => ({
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.path.startsWith('http') ? crumb.path : `${BASE_URL}${crumb.path === '/' ? '/' : crumb.path}`,
    })),
  });

  // Pull dynamic SEO metadata from URL & Route parameters
  const dynamicMeta: DynamicPageMeta = deriveDynamicMetadata(route, canonicalUrl);

  const statusCode = dynamicMeta.statusCode || 200;
  const title = dynamicMeta.title;
  const description = dynamicMeta.description;
  const robots = dynamicMeta.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const ogType = dynamicMeta.ogType || 'website';
  const ogImage = dynamicMeta.ogImage || `${BASE_URL}/og-image.png`;
  const ogImageAlt = dynamicMeta.ogImageAlt || 'AnyFileX - Universal File Format Platform';
  const breadcrumbs = dynamicMeta.breadcrumbs || [{ name: 'Home', path: '/' }];
  const prerenderedHtml = dynamicMeta.prerenderedHtml || '';

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
  const schemaGraph: any[] = [baseOrgSchema];
  if (isHome) {
    schemaGraph.push(baseWebSiteSchema);
  }
  schemaGraph.push(breadcrumbSchema);
  if (dynamicMeta.specificSchemas && dynamicMeta.specificSchemas.length > 0) {
    schemaGraph.push(...dynamicMeta.specificSchemas);
  }

  return {
    statusCode,
    title,
    description,
    canonicalPath: cleanPath,
    canonicalUrl,
    robots,
    ogType,
    ogImage,
    ogImageAlt,
    breadcrumbs,
    schemaGraph,
    prerenderedHtml,
    route,
  };
}
