import type { AppLocale } from './routing';

export const DUTCH_CONTENT_PATHS = new Set(['/','/file-extensions/heic','/tools/file-identifier','/how-to-open/heic']);
export const SPANISH_CONTENT_PATHS = new Set(['/','/file-extensions/heic','/tools/file-identifier','/how-to-open/heic','/converters/pdf-to-word']);

export function normalizePath(pathname: string): string {
  const withoutLocale = pathname.replace(/^\/(?:nl|es)(?=\/|$)/, '') || '/';
  return withoutLocale.length > 1 ? withoutLocale.replace(/\/$/, '') : withoutLocale;
}

export function localizedPath(pathname: string, locale: AppLocale): string {
  const path = normalizePath(pathname);
  if (locale !== 'en') return path === '/' ? `/${locale}/` : `/${locale}${path}`;
  return path;
}

export function hasLocalizedContent(pathname: string, locale: AppLocale): boolean {
  return locale === 'en' || (locale === 'nl' ? DUTCH_CONTENT_PATHS : SPANISH_CONTENT_PATHS).has(normalizePath(pathname));
}
