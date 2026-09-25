import { describe, it, expect } from 'vitest';
import { metadata as rootMetadata } from '../../src/app/layout';
import { metadata as homeMetadata } from '../../src/app/page';
import { generateMetadata as generateExtensionMetadata } from '../../src/app/file-extensions/[ext]/page';
import sitemap from '../../src/app/sitemap';
import robots from '../../src/app/robots';
import { getRouteManifestEntry } from '../../src/lib/routes/routeManifest';

describe('Next.js App Router SEO', () => {
  it('defines site-wide metadata through the root layout', () => {
    expect(rootMetadata.metadataBase?.toString()).toBe('https://anyfilex.com/');
    expect(rootMetadata.title).toMatchObject({ default: expect.stringContaining('AnyFileX'), template: '%s | AnyFileX' });
    expect(rootMetadata.alternates?.canonical).toBe('/');
  });

  it('defines home metadata and canonical URL in the App Router page', () => {
    expect(homeMetadata.title).toContain('AnyFileX');
    expect(homeMetadata.description).toContain('file formats');
    expect(homeMetadata.alternates?.canonical).toBe('https://anyfilex.com');
    expect(homeMetadata.openGraph?.url).toBe('https://anyfilex.com');
  });

  it('generates metadata and canonical URL for a dynamic extension route', async () => {
    const meta = await generateExtensionMetadata({ params: Promise.resolve({ ext: 'heic' }) });
    expect(meta.title).toContain('.HEIC File Extension');
    expect(meta.description).toContain('HEIC');
    expect(meta.alternates?.canonical).toBe('https://anyfilex.com/file-extensions/heic');
    expect(meta.openGraph?.url).toBe('https://anyfilex.com/file-extensions/heic');
  });

  it('publishes unique sitemap URLs backed by the route manifest', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) expect(getRouteManifestEntry(new URL(url).pathname)).toBeDefined();
  });

  it('publishes robots rules for the current canonical sitemap', () => {
    const policy = robots();
    expect(policy.sitemap).toBe('https://anyfilex.com/sitemap.xml');
    expect(policy.rules).toEqual(expect.arrayContaining([
      expect.objectContaining({ userAgent: '*', allow: '/', disallow: expect.arrayContaining(['/admin', '/workflows']) }),
    ]));
  });
});
