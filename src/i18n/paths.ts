import type { AppLocale } from './routing';
import { buildRouteManifest } from '../lib/routes/routeManifest';

export const DUTCH_CONTENT_PATHS = new Set([
  '/',
  '/file-extensions/heic', '/tools/file-identifier', '/how-to-open/heic',
]);
export const SPANISH_CONTENT_PATHS = new Set([
  '/', '/convertir',
  '/file-extensions/heic', '/tools/file-identifier', '/how-to-open/heic', '/converters/pdf-to-word',
]);

function splitPath(pathname: string): { path: string; suffix: string } {
  const match = pathname.match(/^([^?#]*)([?#].*)?$/);
  return { path: match?.[1] || '/', suffix: match?.[2] || '' };
}

export function normalizePath(pathname: string): string {
  const { path } = splitPath(pathname);
  const withoutLocale = path.replace(/^\/(?:nl|es)(?=\/|$)/, '') || '/';
  return withoutLocale.length > 1 ? withoutLocale.replace(/\/$/, '') : withoutLocale;
}

export function localizedPath(pathname: string, locale: AppLocale): string {
  const { suffix } = splitPath(pathname);
  const path = normalizePath(pathname);
  if (locale !== 'en') return `${path === '/' ? `/${locale}/` : `/${locale}${path}`}${suffix}`;
  return `${path}${suffix}`;
}

export function hasLocalizedContent(pathname: string, locale: AppLocale): boolean {
  if (locale === 'en') return true;
  const path = normalizePath(pathname);
  // Spanish is now a complete mirror of the indexable English route surface.
  // Keep the explicit list above as documentation for the originally hand-
  // translated pages, but do not send users back to English when navigating
  // from any generated extension, software, guide, or MIME route.
  if (locale === 'es') {
    if (SPANISH_CONTENT_PATHS.has(path) || [...SPANISH_CONTENT_PATHS].some((localizedPath) =>
      localizedPath !== '/' && path.startsWith(`${localizedPath}/`),
    )) return true;
    return buildRouteManifest().some((entry) => entry.path === path && entry.isIndexable);
  }
  const localizedPaths = locale === 'nl' ? DUTCH_CONTENT_PATHS : SPANISH_CONTENT_PATHS;
  return localizedPaths.has(path) || [...localizedPaths].some((localizedPath) =>
    localizedPath !== '/' && path.startsWith(`${localizedPath}/`),
  );
}
