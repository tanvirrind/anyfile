import type { Metadata } from 'next';
import type { AppLocale } from '@/i18n/routing';
import { localizedPath } from '@/i18n/paths';

export const SITE_URL = 'https://anyfilex.com';

export function localizedUrl(pathname: string, locale: AppLocale): string {
  const path = localizedPath(pathname, locale);
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

export function localizedAlternates(
  pathname: string,
  canonicalLocale: AppLocale = 'en',
  includeDutch = true,
  includeSpanish = true,
  includeEnglish = true,
): NonNullable<Metadata['alternates']> {
  const xDefaultLocale = includeEnglish ? 'en' : canonicalLocale;
  return {
    canonical: localizedUrl(pathname, canonicalLocale),
    languages: {
      ...(includeEnglish ? { en: localizedUrl(pathname, 'en') } : {}),
      ...(includeDutch ? { nl: localizedUrl(pathname, 'nl') } : {}),
      ...(includeSpanish ? { es: localizedUrl(pathname, 'es') } : {}),
      'x-default': localizedUrl(pathname, xDefaultLocale),
    },
  };
}

export function localizedMetadata({
  pathname,
  locale,
  title,
  description,
  includeDutch = true,
  includeSpanish = true,
  includeEnglish = true,
}: {
  pathname: string;
  locale: AppLocale;
  title: string;
  description: string;
  includeDutch?: boolean;
  includeSpanish?: boolean;
  includeEnglish?: boolean;
}): Metadata {
  const canonical = localizedUrl(pathname, locale);
  return {
    title,
    description,
    alternates: includeDutch || includeSpanish || includeEnglish
      ? localizedAlternates(pathname, locale, includeDutch, includeSpanish, includeEnglish)
      : { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: pathname === '/' ? 'website' : 'article',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  };
}
