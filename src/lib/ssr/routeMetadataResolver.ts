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

/**
 * High-performance route metadata resolver.
 * Parses incoming URL path/parameters and derives dynamic SEO titles, descriptions,
 * schema graphs, and prerendered HTML content dynamically.
 */
export function resolveRouteMetadata(pathname: string, search: string = ''): RouteMetadata {
  const route = parsePathToRoute(pathname, search);
  const cleanPath = routeToPath(route);
  const canonicalUrl = `${BASE_URL}${cleanPath === '/' ? '' : cleanPath}`;

  // Base Organization & WebSite Schemas
  const baseOrgSchema = {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'AnyFileX',
    url: BASE_URL,
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
    url: BASE_URL,
    name: 'AnyFileX',
    description: 'Open Any File in Seconds with AnyFileX.com. Convert, repair, inspect, and identify digital file formats.',
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
    '@id': `${canonicalUrl}/#breadcrumb`,
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.path.startsWith('http') ? crumb.path : `${BASE_URL}${crumb.path === '/' ? '' : crumb.path}`,
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
  const schemaGraph = [baseOrgSchema, baseWebSiteSchema, breadcrumbSchema, ...(dynamicMeta.specificSchemas || [])];

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
