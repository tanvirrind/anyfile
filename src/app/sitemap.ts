import type { MetadataRoute } from 'next';
import { buildRouteManifest, isExcludedFromSitemap, PLATFORM_RELEASE_DATE } from '@/lib/routes/routeManifest';

export default function sitemap(): MetadataRoute.Sitemap {
  const manifest = buildRouteManifest();

  return manifest
    .filter((entry) => entry.isIndexable && !isExcludedFromSitemap(entry.path))
    .map((entry) => ({
      url: entry.canonicalUrl,
      lastModified: new Date(PLATFORM_RELEASE_DATE),
      changeFrequency: entry.changefreq,
      priority: entry.priority,
    }));
}
