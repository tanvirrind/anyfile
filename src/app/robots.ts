import type { MetadataRoute } from 'next';

const disallowedPaths = [
  '/admin',
  '/admin/',
  '/admin/content',
  '/admin-cms',
  '/admin-cms/',
  '/seo-audit',
  '/tools/file-identifier/result/',
  '/tools/metadata-viewer/result/',
  '/workflows',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-Web', 'Anthropic-AI', 'Google-Extended', 'GoogleOther', 'PerplexityBot', 'Cohere-ai', 'CCBot', 'Meta-ExternalAgent', 'Amazonbot', 'Applebot-Extended'],
        allow: ['/', '/llms.txt'],
        disallow: ['/admin', '/admin-cms'],
      },
    ],
    sitemap: 'https://anyfilex.com/sitemap.xml',
  };
}
