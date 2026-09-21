import { describe, it, expect } from 'vitest';
import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf-8');
const script = html.match(/Theme bootstrap[\s\S]*?<script>([\s\S]*?)<\/script>/)?.[1] ?? '';

/** Executes the real inline bootstrap script against stubs and reports the resolved theme. */
function bootstrap(stored: string | null, osDark: boolean): boolean {
  const cls = new Set<string>();
  const localStorage = { getItem: (k: string) => (k === 'theme' ? stored : null) };
  const window = { matchMedia: () => ({ matches: osDark }) };
  const document = { documentElement: { classList: { add: (c: string) => cls.add(c) } } };
  new Function('localStorage', 'window', 'document', script)(localStorage, window, document);
  return cls.has('dark');
}

/** App.tsx darkMode useState initializer, verbatim logic. */
const appInit = (stored: string | null, osDark: boolean) => (stored ? stored === 'dark' : osDark);

describe('Fix #13 — theme bootstrap parity with the client', () => {
  it('ships the inline bootstrap ahead of first paint (before the gtag tag)', () => {
    expect(html).toMatch(/Theme bootstrap/);
    expect(html.indexOf('prefers-color-scheme: dark')).toBeGreaterThan(-1);
    expect(html.indexOf('prefers-color-scheme: dark')).toBeLessThan(
      html.indexOf('googletagmanager.com/gtag')
    );
  });

  it.each([
    ['dark', false],
    ['light', true],
    [null, true],
    [null, false],
    ['dark', true],
    ['light', false],
  ])('resolves the same theme as App.tsx for stored=%s osDark=%s', (stored, osDark) => {
    expect(bootstrap(stored as string | null, osDark as boolean)).toBe(
      appInit(stored as string | null, osDark as boolean)
    );
  });
});
