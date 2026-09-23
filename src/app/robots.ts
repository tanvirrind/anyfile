import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin-cms',
          '/seo-audit',
          '/tools/file-identifier/result/',
          '/tools/metadata-viewer/result/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://www.anyfilex.com/sitemap.xml',
    host: 'https://www.anyfilex.com',
  };
}
