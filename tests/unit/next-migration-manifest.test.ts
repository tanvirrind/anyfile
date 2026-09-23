import { describe, it, expect } from 'vitest';
import {
  buildRouteManifest,
  isExcludedFromSitemap,
  isValidCatalogExtension,
  isValidSoftwareId,
  isValidCategoryId,
  isValidComparisonSlug,
  isValidConverterId,
  isValidToolSlug,
  BASE_URL,
} from '../../src/lib/routes/routeManifest';
import sitemap from '../../src/app/sitemap';
import { renderSsrPageHtml } from '../../src/lib/ssr/ssrRenderer';
import { getCanonicalRedirect } from '../../src/lib/ssr/canonicalRedirects';

describe('Next.js Migration & Content Manifest Verification', () => {
  const manifest = buildRouteManifest();

  it('generates a rich manifest with all required public routes and zero duplicates', () => {
    expect(manifest.length).toBeGreaterThan(100);

    const paths = manifest.map((m) => m.path);
    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(paths.length);
  });

  it('ensures no admin, audit, result, temporary, or 404 URLs appear in the sitemap', () => {
    const sitemapEntries = sitemap();
    expect(sitemapEntries.length).toBeGreaterThan(100);

    for (const entry of sitemapEntries) {
      const url = entry.url;
      expect(url).not.toContain('/admin');
      expect(url).not.toContain('/admin-cms');
      expect(url).not.toContain('/seo-audit');
      expect(url).not.toContain('/result/');
      expect(url).not.toContain('/404');
      expect(url).not.toContain('/not-found');
    }

    expect(isExcludedFromSitemap('/admin')).toBe(true);
    expect(isExcludedFromSitemap('/admin-cms')).toBe(true);
    expect(isExcludedFromSitemap('/seo-audit')).toBe(true);
    expect(isExcludedFromSitemap('/tools/file-identifier/result/123')).toBe(true);
    expect(isExcludedFromSitemap('/tools/metadata-viewer/result/abc')).toBe(true);
    expect(isExcludedFromSitemap('/file-extensions/heic')).toBe(false);
  });

  it('ensures canonical URLs strictly match the requested public URLs', () => {
    for (const item of manifest) {
      expect(item.canonicalUrl.startsWith(BASE_URL)).toBe(true);
      const expectedUrl = `${BASE_URL}${item.path === '/' ? '' : item.path}`;
      expect(item.canonicalUrl).toBe(expectedUrl);
    }
  });

  it('ensures comprehensive metadata (title, description) exists for every indexable page', () => {
    for (const item of manifest) {
      if (item.isIndexable) {
        expect(item.title).toBeTruthy();
        expect(item.title.length).toBeGreaterThan(10);
        expect(item.description).toBeTruthy();
        expect(item.description.length).toBeGreaterThan(20);
        expect(item.priority).toBeGreaterThan(0);
        expect(item.priority).toBeLessThanOrEqual(1.0);
        expect(item.changefreq).toBeDefined();
      }
    }
  });

  it('strictly validates extensions: known extensions pass, unknown extensions return false (triggering 404 with noindex)', () => {
    // Known extensions
    expect(isValidCatalogExtension('heic')).toBe(true);
    expect(isValidCatalogExtension('pdf')).toBe(true);
    expect(isValidCatalogExtension('docx')).toBe(true);
    expect(isValidCatalogExtension('dwg')).toBe(true);
    expect(isValidCatalogExtension('step')).toBe(true);
    expect(isValidCatalogExtension('.heic')).toBe(true);

    // Unknown or malicious extensions
    expect(isValidCatalogExtension('unknownfakeext12345')).toBe(false);
    expect(isValidCatalogExtension('notarealextension999')).toBe(false);
    expect(isValidCatalogExtension('<script>alert(1)</script>')).toBe(false);
    expect(isValidCatalogExtension('')).toBe(false);
  });

  it('validates software IDs against the catalog including Google Docs', () => {
    expect(isValidSoftwareId('google-docs')).toBe(true);
    expect(isValidSoftwareId('adobe-photoshop')).toBe(true);
    expect(isValidSoftwareId('non-existent-software-app-999')).toBe(false);

    const googleDocsRoute = manifest.find((m) => m.path === '/software/google-docs');
    expect(googleDocsRoute).toBeDefined();
    expect(googleDocsRoute?.title).toBe('Google Docs File Types: What Files Can Google Docs Open?');
  });

  it('validates categories, converters, comparisons, and tools against catalogs', () => {
    expect(isValidCategoryId('images')).toBe(true);
    expect(isValidCategoryId('fakecategory')).toBe(false);

    expect(isValidConverterId('heic-to-jpg')).toBe(true);
    expect(isValidConverterId('invalid-converter-id')).toBe(false);

    expect(isValidComparisonSlug('jpg-vs-png')).toBe(true);
    expect(isValidComparisonSlug('invalid-comparison-slug')).toBe(false);

    expect(isValidToolSlug('file-identifier')).toBe(true);
    expect(isValidToolSlug('fake-tool-name')).toBe(false);
  });

  it('verifies Next.js native sitemap contains unique URLs matching manifest indexable routes', () => {
    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map((e) => e.url);
    const urlSet = new Set(urls);

    expect(urlSet.size).toBe(urls.length);
    expect(urls).toContain(`${BASE_URL}`);
    expect(urls).toContain(`${BASE_URL}/file-extensions`);
    expect(urls).toContain(`${BASE_URL}/software`);
    expect(urls).toContain(`${BASE_URL}/software/google-docs`);
    expect(urls).toContain(`${BASE_URL}/file-extensions/heic`);
    expect(urls).toContain(`${BASE_URL}/file-extensions/pdf`);
  });

  it('guarantees that no sitemap URL redirects (all canonical sitemap URLs return zero redirects)', () => {
    const sitemapEntries = sitemap();
    for (const entry of sitemapEntries) {
      const urlObj = new URL(entry.url);
      const redirect = getCanonicalRedirect(urlObj.pathname);
      expect(redirect).toBeNull();
    }
  });

  it('verifies that prerendered / server-rendered HTML contains core semantic content and metadata', () => {
    const homeHtml = renderSsrPageHtml('/', 'AnyFileX');
    expect(homeHtml).toContain('<!doctype html>');
    expect(homeHtml).toContain('<title>');
    expect(homeHtml).toContain('AnyFileX');
    expect(homeHtml).toContain('Open Any File in Seconds');

    const heicHtml = renderSsrPageHtml('/file-extensions/heic', 'AnyFileX');
    expect(heicHtml).toContain('HEIC');
    expect(heicHtml).toContain('High Efficiency Image Container');

    const googleDocsHtml = renderSsrPageHtml('/software/google-docs', 'AnyFileX');
    expect(googleDocsHtml).toContain('Google Docs');
  });
});
