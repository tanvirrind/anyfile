import type { AppLocale } from './routing';

const SHARED_TRANSLATED_HUBS = [
  '/file-extensions',
  '/how-to-open',
  '/compare',
  '/troubleshoot',
  '/software',
  '/guides',
  '/converters',
  '/tools',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

export const DUTCH_CONTENT_PATHS = new Set([
  '/', ...SHARED_TRANSLATED_HUBS,
  '/file-extensions/heic', '/tools/file-identifier', '/how-to-open/heic',
]);
export const SPANISH_CONTENT_PATHS = new Set([
  '/', ...SHARED_TRANSLATED_HUBS, '/convertir',
  '/file-extensions/heic', '/tools/file-identifier', '/how-to-open/heic', '/converters/pdf-to-word',
]);

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
  if (locale === 'en') return true;
  const path = normalizePath(pathname);
  const localizedPaths = locale === 'nl' ? DUTCH_CONTENT_PATHS : SPANISH_CONTENT_PATHS;
  return localizedPaths.has(path) || [...localizedPaths].some((localizedPath) =>
    localizedPath !== '/' && path.startsWith(`${localizedPath}/`),
  );
}
