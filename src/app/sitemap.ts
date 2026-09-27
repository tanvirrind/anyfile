import type { MetadataRoute } from 'next';
import { buildRouteManifest, isExcludedFromSitemap, PLATFORM_RELEASE_DATE, SPANISH_CONVERSION_SLUGS } from '@/lib/routes/routeManifest';

export default function sitemap(): MetadataRoute.Sitemap {
  const manifest = buildRouteManifest();

  const englishEntries = manifest
    .filter((entry) => entry.isIndexable && !isExcludedFromSitemap(entry.path))
    .map((entry) => ({
      url: entry.canonicalUrl,
      lastModified: new Date(PLATFORM_RELEASE_DATE),
      changeFrequency: entry.changefreq,
      priority: entry.priority,
    }));

  const dutchPaths = ['/', '/file-extensions/heic', '/tools/file-identifier', '/how-to-open/heic'];
  const dutchEntries = dutchPaths.map((path) => ({
    url: `https://anyfilex.com/nl${path === '/' ? '/' : path}`,
    lastModified: new Date(PLATFORM_RELEASE_DATE),
    changeFrequency: path === '/' ? ('daily' as const) : ('weekly' as const),
    priority: path === '/' ? 1 : 0.8,
  }));
  // Every indexable English route has a Spanish URL. The Spanish-only
  // conversion landing pages are appended below because they are not part of
  // the English route manifest.
  const spanishPaths = [
    ...manifest
      .filter((entry) => entry.isIndexable && !isExcludedFromSitemap(entry.path))
      .map((entry) => entry.path),
    ...SPANISH_CONVERSION_SLUGS.map((slug) => `/convertir/${slug}`),
  ];
  const spanishEntries = spanishPaths.map((path) => ({
    url: `https://anyfilex.com/es${path === '/' ? '/' : path}`,
    lastModified: new Date(PLATFORM_RELEASE_DATE),
    changeFrequency: path === '/' ? ('daily' as const) : ('weekly' as const),
    priority: path === '/' ? 1 : 0.8,
  }));

  return [...englishEntries, ...dutchEntries, ...spanishEntries];
}
