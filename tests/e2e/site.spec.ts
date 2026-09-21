import { test, expect } from '@playwright/test';

test.describe('Fix #14 — compression', () => {
  test('serves gzip when the client accepts it', async ({ request }) => {
    const res = await request.get('/', { headers: { 'Accept-Encoding': 'gzip' } });
    expect(res.status()).toBe(200);
    expect(res.headers()['content-encoding']).toBe('gzip');
    expect(res.headers()['vary']).toContain('Accept-Encoding');
  });
});

test.describe('Fix #4 — security headers', () => {
  test('sets the hardened response headers', async ({ request }) => {
    const res = await request.get('/');
    const h = res.headers();
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['x-frame-options']).toBe('DENY');
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(h['x-powered-by']).toBeUndefined();
  });

  test('marks non-200 responses noindex', async ({ request }) => {
    const res = await request.get('/404');
    expect(res.headers()['x-robots-tag']).toContain('noindex');
  });
});

test.describe('Fix #12 — sitemaps', () => {
  test('index lists all 18 sub-sitemaps with no duplicates', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toHaveLength(18);
    expect(new Set(locs).size).toBe(18);
  });

  test('emits only W3C-format lastmod values', async ({ request }) => {
    const res = await request.get('/sitemap-security.xml');
    const body = await res.text();
    const dates = [...body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    expect(dates.length).toBeGreaterThan(0);
    for (const d of dates) expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

test.describe('page rendering', () => {
  test('home page renders SSR content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AnyFileX/);
    await expect(page.locator('#root')).not.toBeEmpty();
  });
});

test.describe('Fix #11 — SearchAction ?q= target', () => {
  test('a ?q= URL pre-fills the extensions search and filters results', async ({ page }) => {
    await page.goto('/file-extensions?q=pdf');
    await expect(page.locator('#extensions-search-input')).toHaveValue('pdf');
    // The filtered list must actually render at least one matching entry.
    await expect(page.locator('#root')).toContainText(/PDF/i);
  });
});

test.describe('Fix #17 — converter workspaces render client-side', () => {
  for (const slug of ['zip-creator', 'zip-extractor', 'rar-extractor']) {
    test(`${slug} mounts with no client-side errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`/converters/${slug}`);
      await expect(page.locator('#root')).not.toBeEmpty();
      expect(errors).toEqual([]);
    });
  }
});

test.describe('Schema viewer panel removed from the front end', () => {
  for (const path of ['/tools/mime-checker', '/tools/hash-generator', '/file-extensions/heic']) {
    test(`${path} no longer renders the JSON-LD preview panel`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByText('SEO Schema.org Structured Data (JSON-LD)')).toHaveCount(0);
      await expect(page.getByText('Copy Schema')).toHaveCount(0);
      await expect(page.getByText('Google Rich Results & Indexing Ready')).toHaveCount(0);
    });
  }

  test('the real schema markup is still emitted in the document head', async ({ page }) => {
    await page.goto('/file-extensions/heic');
    const ldJson = await page.locator('script[type="application/ld+json"]').count();
    expect(ldJson).toBeGreaterThan(0);
    const content = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(content).toContain('schema.org');
  });
});

test.describe('Fix #13 — theme bootstrap (no flash)', () => {
  test('applies the dark class for a dark colour-scheme preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('stays light for a light preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('a persisted dark choice survives reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
