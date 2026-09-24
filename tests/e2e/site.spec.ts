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
    expect((await res.text()).toLowerCase()).toContain('noindex');
  });
});

test.describe('Next.js App Router sitemap', () => {
  test('robots.txt is served successfully and points crawlers to the sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('Sitemap: https://www.anyfilex.com/sitemap.xml');
  });

  test('native sitemap is served with unique URLs', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(100);
    expect(new Set(locs).size).toBe(locs.length);
  });

  test('sitemap URLs resolve without redirects', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml');
    const body = await sitemap.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    for (const url of locs) {
      const response = await request.get(new URL(url).pathname, { maxRedirects: 0 });
      expect(response.status(), url).toBe(200);
    }
  });

  test('unknown extensions return a real noindex 404', async ({ request }) => {
    const res = await request.get('/file-extensions/not-a-real-extension-999', { maxRedirects: 0 });
    expect(res.status()).toBe(404);
    expect((await res.text()).toLowerCase()).toContain('noindex');
  });

  test('emits XML sitemap dates when present', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    const body = await res.text();
    const dates = [...body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    expect(dates.length).toBeGreaterThanOrEqual(0);
    for (const d of dates) expect(d).toMatch(/^\d{4}-\d{2}-\d{2}(T.*)?$/);
  });
});

test.describe('page rendering', () => {
  test('home page renders SSR content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AnyFileX/);
    await expect(page.locator('main#main-content')).not.toBeEmpty();
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://www.anyfilex.com/og-image.png');
    await expect(page.getByText('Coming Soon', { exact: true })).toHaveCount(0);
  });

  test('site-wide favicon is included in the document head', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  });

  test('privacy policy renders with canonical metadata and footer link', async ({ page }) => {
    const response = await page.goto('/privacy');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle('Privacy Policy | AnyFileX');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.anyfilex.com/privacy');
    await expect(page.getByRole('heading', { name: 'Privacy Policy', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact AnyFileX', exact: true })).toHaveAttribute('href', '/contact');
  });

  test('terms page renders with canonical metadata and privacy link', async ({ page }) => {
    const response = await page.goto('/terms');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle('Terms of Service | AnyFileX');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.anyfilex.com/terms');
    await expect(page.getByRole('heading', { name: 'Terms of Service', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Terms navigation' }).getByRole('link', { name: 'Privacy Policy', exact: true })).toHaveAttribute('href', '/privacy');
  });

  test('Tanveer Hussain author profile renders with Person schema', async ({ page }) => {
    const response = await page.goto('/authors/tanveer-hussain');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle('Tanveer Hussain – AnyFileX Author | AnyFileX');
    await expect(page.getByRole('heading', { name: 'Tanveer Hussain', exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Tanveer Hussain', exact: true })).toHaveAttribute('src', /tanveer-hussain\.png/);
    expect(await page.locator('script#json-ld-tanveer-hussain').textContent()).toContain('"@type":"Person"');
    await expect(page.getByRole('link', { name: 'LinkedIn profile', exact: true })).toHaveAttribute('href', 'https://linkedin.com/in/tanvirrind/');
  });

  test('authors archive includes Tanveer Hussain', async ({ page }) => {
    await page.goto('/authors');
    await expect(page.getByRole('heading', { name: 'Tanveer Hussain', exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Tanveer Hussain', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View author profile', exact: true })).toHaveAttribute('href', '/authors/tanveer-hussain');
  });

  test('footer omits the Navigation section', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer.getByRole('heading', { name: 'Navigation', exact: true })).toHaveCount(0);
    await expect(footer.getByRole('heading', { name: 'Explore', exact: true })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Company', exact: true })).toBeVisible();
    await expect(footer.getByText('.HEIC Format Guide', { exact: true })).toHaveCount(0);
    await expect(footer.getByText('Magic Byte Identifier Engine', { exact: true })).toHaveCount(0);
    await expect(footer.getByRole('link', { name: 'Privacy Policy', exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Terms & Conditions', exact: true })).toBeVisible();
  });

  test('converter directory hydrates without React mismatch errors', async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' && /hydration|hydrated/i.test(message.text())) {
        hydrationErrors.push(message.text());
      }
    });
    await page.goto('/converters');
    await expect(page.locator('main#main-content')).not.toBeEmpty();
    expect(hydrationErrors).toEqual([]);
  });

  test('legacy metadata tool URL redirects to the canonical viewer', async ({ request }) => {
    const response = await request.get('/tools/metadata', { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe('/tools/metadata-viewer');
  });

  test('legacy RAR tool URL redirects to the canonical workspace', async ({ request }) => {
    const response = await request.get('/tools/rar-extractor', { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe('/converters/rar-extractor');
  });

  test('tools directory does not render converter cards', async ({ page }) => {
    await page.goto('/tools');
    await expect(page.locator('#tool-card-heic-to-jpg')).toHaveCount(0);
    await expect(page.locator('#tool-card-png-to-webp')).toHaveCount(0);
    await expect(page.locator('#tool-card-image-compressor')).toBeVisible();
    await expect(page.locator('#tool-card-file-identifier')).toBeVisible();
  });

  test('tool detail breadcrumbs omit the non-linked category crumb', async ({ page }) => {
    await page.goto('/tools/image-compressor');
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb.getByText('File Tools', { exact: true })).toBeVisible();
    await expect(breadcrumb.getByText('Image Tools', { exact: true })).toHaveCount(0);
    await expect(breadcrumb.getByText('Browser-Based Image Compressor', { exact: true })).toBeVisible();
  });

  test('homepage file selection carries the file into the extension viewer', async ({ page }) => {
    await page.goto('/');
    await page.locator('#hero-file-input').setInputFiles({
      name: 'sample.png',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        'base64'
      ),
    });

    await expect(page).toHaveURL(/\/file-extensions\/png$/);
    await expect(page.getByText('Online .png Viewer & Live Inspector')).toBeVisible();
    await expect(page.locator('img[alt="sample.png"]')).toBeVisible();
  });
});

test.describe('Fix #11 — SearchAction ?q= target', () => {
  test('a ?q= URL pre-fills the extensions search and filters results', async ({ page }) => {
    await page.goto('/file-extensions?q=pdf');
    await expect(page.locator('#extensions-search-input')).toHaveValue('pdf');
    // The filtered list must actually render at least one matching entry.
    await expect(page.locator('main#main-content')).toContainText(/PDF/i);
  });
});

test.describe('Fix #17 — converter workspaces render client-side', () => {
  for (const slug of ['zip-creator', 'zip-extractor', 'rar-extractor', '3mf-to-stl', 'eml-to-pdf']) {
    test(`${slug} mounts with no client-side errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`/converters/${slug}`);
      await expect(page.locator('main#main-content')).not.toBeEmpty();
      expect(errors).toEqual([]);
    });
  }

  test('3mf-to-stl exposes its real upload workspace', async ({ page }) => {
    await page.goto('/converters/3mf-to-stl');
    await expect(page.getByText('Upload .3MF file to convert to .STL')).toBeVisible();
    await expect(page.getByText('Unsupported Conversion Pair')).toHaveCount(0);
  });
});

test.describe('Converter catalog audit', () => {
  const interactive = [
    'heic-to-jpg', 'heic-to-pdf', 'heic-to-png', 'png-to-jpg', 'webp-to-png',
    'pdf-to-jpg', 'pdf-to-png', 'jpg-to-png', 'jpg-to-webp', 'svg-to-png', 'svg-to-jpg', 'png-to-webp', 'docx-to-pdf', 'pptx-to-pdf',
    'eml-to-pdf', '3mf-to-stl',
  ];
  const informational = ['dwg-to-pdf', 'dwg-to-dxf', 'psd-to-jpg', 'step-to-stl'];

  for (const slug of [...interactive, ...informational]) {
    test(`${slug} has the expected working mode`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const response = await page.goto(`/converters/${slug}`);
      expect(response?.status(), slug).toBe(200);
      await expect(page.locator('main#main-content')).not.toBeEmpty();
      await expect(page.getByText('Unsupported Conversion Pair')).toHaveCount(0);

      if (informational.includes(slug)) {
        await expect(page.getByText('Browser conversion is not available for this format')).toBeVisible();
      } else if (slug === '3mf-to-stl') {
        await expect(page.getByText('Upload .3MF file to convert to .STL')).toBeVisible();
      } else if (slug === 'eml-to-pdf') {
        await expect(page.getByText('Select .EML or .MSG File')).toBeVisible();
      } else {
        await expect(page.locator('#converter-dropzone')).toBeVisible();
      }

      expect(errors, slug).toEqual([]);
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
