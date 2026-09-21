import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { normalizeLastmod, getSegmentedSitemapXml, SITEMAP_SEGMENTS } from '../../src/lib/seo/sitemapGenerator';
import { renderSsrPageHtml } from '../../src/lib/ssr/ssrRenderer';

const contentSegments = SITEMAP_SEGMENTS.filter((s) => s.id !== 'index');
const locsOf = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const datesOf = (xml: string) => [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);

describe('Fix #12 — sitemap lastmod normalisation', () => {
  it('converts human-readable month/year to W3C datetime', () => {
    expect(normalizeLastmod('August 2024')).toBe('2024-08-01');
    expect(normalizeLastmod('June 2024')).toBe('2024-06-01');
    expect(normalizeLastmod('December 2023')).toBe('2023-12-01');
  });

  it('passes through valid ISO values and reduces them to the date', () => {
    expect(normalizeLastmod('2026-09-18')).toBe('2026-09-18');
    expect(normalizeLastmod('2026-09-18T10:00:00Z')).toBe('2026-09-18');
  });

  it('falls back to the platform date for unparseable input', () => {
    expect(normalizeLastmod('nonsense')).toBe('2026-09-18');
    expect(normalizeLastmod(undefined)).toBe('2026-09-18');
  });

  it('emits only valid W3C lastmod values in every content segment', () => {
    for (const seg of contentSegments) {
      const dates = datesOf(getSegmentedSitemapXml(seg.id));
      expect(dates.length).toBeGreaterThan(0);
      for (const d of dates) expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe('Fix #12 — sitemap deduplication', () => {
  it('emits no duplicate <loc> within any content segment', () => {
    for (const seg of contentSegments) {
      const locs = locsOf(getSegmentedSitemapXml(seg.id));
      expect(new Set(locs).size).toBe(locs.length);
    }
  });

  it('index references every content segment exactly once', () => {
    const locs = locsOf(getSegmentedSitemapXml('index'));
    expect(locs).toHaveLength(contentSegments.length);
    expect(new Set(locs).size).toBe(locs.length);
  });
});

describe('Fix #1 / #11 — SSR injected state escaping', () => {
  it('escapes a </script> payload so it cannot break out of the script tag', () => {
    const template = fs.readFileSync('index.html', 'utf-8');
    const payload = '</script><script>alert(1)</script>';
    const { html } = renderSsrPageHtml('/file-extensions', template, '?q=' + encodeURIComponent(payload));
    const match = html.match(/window\.__INITIAL_ROUTE__ = ([\s\S]*?);<\/script>/);
    expect(match).toBeTruthy();
    const json = match![1];
    expect(json).not.toContain('</script>');
    expect(json).toContain('\\u003c');
    expect(JSON.parse(json).query).toBe(payload);
  });
});
