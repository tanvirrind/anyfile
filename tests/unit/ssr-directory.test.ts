import { describe, it, expect } from 'vitest';
import { buildRouteManifest, getStaticParamsForRouteType } from '../../src/lib/routes/routeManifest';
import { getAllFileTypeInfos } from '../../src/lib/database/extensionEngine';
import { CURATED_COMPARISONS } from '../../src/lib/database/knowledgeGraph';
import { EXPANDED_MIME_DATABASE } from '../../src/data/expandedMimeDatabase';

describe('Next.js App Router route/data coverage', () => {
  const manifest = buildRouteManifest();

  it('contains a canonical manifest entry for every extension route', () => {
    const extensions = getStaticParamsForRouteType('extension-detail');
    expect(extensions.length).toBe(getAllFileTypeInfos().length);
    for (const params of extensions) {
      expect(manifest.some((entry) => entry.path === '/file-extensions/' + params.ext)).toBe(true);
    }
  });

  it('contains every curated comparison as an App Router route', () => {
    const comparisons = getStaticParamsForRouteType('compare-detail');
    expect(comparisons.length).toBe(CURATED_COMPARISONS.length);
    for (const params of comparisons) {
      expect(manifest.some((entry) => entry.path === '/compare/' + params.slug)).toBe(true);
    }
  });

  it('contains every MIME record as a canonical route', () => {
    const mimeRoutes = new Set(getStaticParamsForRouteType('mime-detail').map((params) => '/mime-type/' + params.slug));
    const expectedRoutes = new Set(EXPANDED_MIME_DATABASE.map((item) => '/mime-type/' + item.mimeType.replace('/', '-').replace(/\+/g, '-plus-').toLowerCase()));
    expect(mimeRoutes.size).toBe(expectedRoutes.size);
    for (const item of EXPANDED_MIME_DATABASE) {
      const slug = item.mimeType.replace('/', '-').replace(/\+/g, '-plus-').toLowerCase();
      expect(mimeRoutes.has('/mime-type/' + slug)).toBe(true);
    }
  });

  it('keeps route manifest entries substantive and unique', () => {
    expect(manifest.length).toBeGreaterThan(100);
    expect(new Set(manifest.map((entry) => entry.path)).size).toBe(manifest.length);
    for (const entry of manifest.filter((item) => item.isIndexable)) {
      expect(entry.title.length).toBeGreaterThan(10);
      expect(entry.description.length).toBeGreaterThan(20);
    }
  });
});
