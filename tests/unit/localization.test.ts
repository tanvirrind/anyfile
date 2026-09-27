import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import nl from '../../messages/nl.json';
import es from '../../messages/es.json';
import { hasLocalizedContent, localizedPath, normalizePath } from '../../src/i18n/paths';
import { isValidConverterId, SPANISH_CONVERSION_SLUGS } from '../../src/lib/routes/routeManifest';
import { localizedMetadata } from '../../src/lib/i18n/seo';

function flattenMessages(value: Record<string, unknown>, prefix = ''): Record<string, string> {
  return Object.entries(value).reduce<Record<string, string>>((result, [key, child]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (typeof child === 'string') result[nextKey] = child;
    else if (child && typeof child === 'object') Object.assign(result, flattenMessages(child as Record<string, unknown>, nextKey));
    return result;
  }, {});
}

describe('localization safeguards', () => {
  it('keeps locale message trees complete and non-empty', () => {
    const english = flattenMessages(en);
    for (const [locale, messages] of [['nl', nl], ['es', es]] as const) {
      const localized = flattenMessages(messages);
      expect(Object.keys(localized).sort(), `${locale} message keys`).toEqual(Object.keys(english).sort());
      for (const key of Object.keys(english)) expect(localized[key], `${locale}.${key}`).toMatch(/\S/);
    }
  });

  it('flags untranslated navigation values in supported locales', () => {
    const english = flattenMessages(en);
    const allowedSharedValues = new Set(['Software', 'English', 'Nederlands', 'Español']);
    for (const [locale, messages] of [['nl', nl], ['es', es]] as const) {
      const localized = flattenMessages(messages);
      for (const [key, value] of Object.entries(localized)) {
        if (key.startsWith('Navigation.') && value === english[key]) {
          expect(allowedSharedValues.has(value), `${locale}.${key} should be localized`).toBe(true);
        }
      }
    }
  });

  it('normalizes locale prefixes and preserves query strings and hashes', () => {
    expect(normalizePath('/es/file-extensions/heic/?q=photo#details')).toBe('/file-extensions/heic');
    expect(localizedPath('/file-extensions/heic?q=photo#details', 'nl')).toBe('/nl/file-extensions/heic?q=photo#details');
    expect(localizedPath('/es/convertir/heic-a-jpg?source=home', 'en')).toBe('/convertir/heic-a-jpg?source=home');
  });

  it('only localizes routes that have translated content', () => {
    expect(hasLocalizedContent('/file-extensions/heic', 'nl')).toBe(true);
    expect(hasLocalizedContent('/es/file-extensions/heic', 'es')).toBe(true);
    expect(hasLocalizedContent('/convertir/heic-a-jpg', 'es')).toBe(true);
    expect(hasLocalizedContent('/convertir/heic-a-jpg', 'nl')).toBe(false);
    expect(hasLocalizedContent('/unknown-page', 'es')).toBe(false);
  });

  it('keeps Spanish conversion landing pages backed by real converter IDs', () => {
    const converterIds = new Map([
      ['heic-a-jpg', 'heic-to-jpg'], ['webp-a-jpg', 'webp-to-jpg'], ['pdf-a-jpg', 'pdf-to-jpg'],
      ['pdf-a-png', 'pdf-to-png'], ['jpg-a-pdf', 'jpg-to-pdf'], ['png-a-pdf', 'png-to-pdf'],
      ['heic-a-png', 'heic-to-png'], ['heic-a-pdf', 'heic-to-pdf'],
    ]);
    for (const slug of SPANISH_CONVERSION_SLUGS) expect(isValidConverterId(converterIds.get(slug)!)).toBe(true);
  });

  it('builds canonical-only alternates for Spanish-only landing pages', () => {
    const metadata = localizedMetadata({
      pathname: '/convertir/heic-a-jpg',
      locale: 'es',
      includeDutch: false,
      includeEnglish: false,
      title: 'Convertir HEIC a JPG online gratis',
      description: 'Convierte fotos HEIC a JPG en tu navegador.',
    });
    expect(metadata.alternates?.canonical).toBe('https://anyfilex.com/es/convertir/heic-a-jpg');
    expect(metadata.alternates?.languages).not.toHaveProperty('en');
    expect(metadata.title).toBe('Convertir HEIC a JPG online gratis');
  });

});
