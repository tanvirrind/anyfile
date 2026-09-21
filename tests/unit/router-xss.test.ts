import { describe, it, expect } from 'vitest';
import { parsePathToRoute, routeToPath } from '../../src/utils/router';

describe('Fix #1 — reflected XSS in route path params', () => {
  it.each([
    '/file-extensions/<script>alert(1)</script>',
    '/file-extensions/%3Cscript%3Ealert(1)%3C%2Fscript%3E',
    '/file-extensions/<img src=x onerror=alert(1)>',
    '/mime-type/<script>alert(1)</script>',
    '/compare/<svg onload=alert(1)>',
  ])('neutralises markup in %s', (path) => {
    const route = parsePathToRoute(path);
    expect(JSON.stringify(route)).not.toMatch(/[<>]/);
  });

  it('reduces an encoded script payload to a plain slug', () => {
    const route = parsePathToRoute('/file-extensions/%3Cscript%3Ealert(1)%3C%2Fscript%3E');
    expect(route).toMatchObject({ view: 'extension-detail', ext: 'scriptalert1script' });
  });
});

describe('Fix #11 — SearchAction ?q= target', () => {
  it('parses ?q= into the extensions route', () => {
    expect(parsePathToRoute('/file-extensions', '?q=pdf')).toMatchObject({
      view: 'extensions',
      query: 'pdf',
    });
  });

  it('decodes and trims the query', () => {
    expect(parsePathToRoute('/file-extensions', '?q=%20adobe%20photoshop%20')).toMatchObject({
      query: 'adobe photoshop',
    });
  });

  it('caps the query length at 100 characters', () => {
    const route = parsePathToRoute('/file-extensions', `?q=${'a'.repeat(150)}`);
    expect(route.view).toBe('extensions');
    if (route.view === 'extensions') expect(route.query).toHaveLength(100);
  });

  it('leaves query undefined when absent', () => {
    expect(parsePathToRoute('/file-extensions')).toMatchObject({ view: 'extensions', query: undefined });
  });

  it('round-trips through routeToPath', () => {
    expect(routeToPath(parsePathToRoute('/file-extensions', '?q=heic'))).toBe('/file-extensions?q=heic');
  });
});
