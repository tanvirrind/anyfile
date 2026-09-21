import { describe, it, expect } from 'vitest';
import { resolveRouteMetadata } from '../../src/lib/ssr/routeMetadataResolver';
import { getAllFileTypeInfos } from '../../src/lib/database/extensionEngine';
import { CURATED_COMPARISONS } from '../../src/lib/database/knowledgeGraph';
import { EXPANDED_MIME_DATABASE } from '../../src/data/expandedMimeDatabase';

const linksIn = (path: string, prefix: string) => {
  const { prerenderedHtml } = resolveRouteMetadata(path);
  return new Set(
    [...prerenderedHtml.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).filter((h) => h.startsWith(prefix))
  );
};

/**
 * The site audit flagged 960 orphan pages (no incoming internal links) and 99
 * low-word-count pages, because hub templates exposed only a handful of children.
 * These assertions protect the crawlable directories that fixed it.
 */
describe('SSR hub directories (orphan + thin-content fix)', () => {
  it('the extensions hub links every extension in the database', () => {
    const all = getAllFileTypeInfos();
    expect(all.length).toBeGreaterThan(200);
    expect(linksIn('/file-extensions', '/file-extensions/').size).toBe(all.length);
  });

  it('the how-to-open hub links a guide for every extension', () => {
    expect(linksIn('/how-to-open', '/how-to-open/').size).toBe(getAllFileTypeInfos().length);
  });

  it('a category page links its own extensions', () => {
    const links = linksIn('/category/images', '/file-extensions/');
    expect(links.size).toBeGreaterThan(10);
  });

  it('the comparison hub links every curated comparison', () => {
    expect(linksIn('/compare', '/compare/').size).toBeGreaterThanOrEqual(CURATED_COMPARISONS.length);
  });

  it('the MIME checker exposes the full MIME directory', () => {
    expect(linksIn('/tools/mime-checker', '/mime-type/').size).toBeGreaterThan(40);
  });

  it('hub pages actually contain substantive text (not a thin shell)', () => {
    for (const path of ['/file-extensions', '/how-to-open', '/compare', '/converters']) {
      const { prerenderedHtml } = resolveRouteMetadata(path);
      const words = prerenderedHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      expect(words, `${path} word count`).toBeGreaterThan(250);
    }
  });

  it('every MIME record is reachable from the directory', () => {
    const slugs = new Set(EXPANDED_MIME_DATABASE.map((m) => `mime-type/${m.mimeType.replace('/', '-').toLowerCase()}`));
    const linked = new Set([...linksIn('/tools/mime-checker', '/mime-type/')].map((h) => decodeURIComponent(h.slice(1))));
    for (const s of slugs) expect(linked.has(s), s).toBe(true);
  });
});
