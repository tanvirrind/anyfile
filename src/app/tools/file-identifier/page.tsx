import type { Metadata } from 'next';
import { FileIdentifierRouteClient } from '@/components/routes/RouteClients';
import { DutchFileIdentifierPage } from '@/components/i18n/DutchPages';
import { localizedMetadata } from '@/lib/i18n/seo';
import type { AppLocale } from '@/i18n/routing';
import { getRequestLocale } from '@/lib/i18n/requestLocale';
import { SpanishFileIdentifierPage } from '@/components/i18n/SpanishPages';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getRequestLocale()) as AppLocale;
  if (locale === 'nl') return { ...localizedMetadata({ pathname: '/tools/file-identifier', locale, title: 'Onbekend bestand identificeren | AnyFileX', description: 'Identificeer onbekende bestanden met lokale binary- en MIME-analyse in je browser.' }), robots: { index: true, follow: true } };
  if (locale === 'es') return { ...localizedMetadata({ pathname: '/tools/file-identifier', locale, title: 'Identificar un archivo desconocido | AnyFileX', description: 'Identifica archivos desconocidos con análisis binary y MIME local en tu navegador.' }), robots: { index: true, follow: true } };
  return { ...localizedMetadata({ pathname: '/tools/file-identifier', locale, title: 'File Identifier – Inspect Unknown Files | AnyFileX', description: 'Identify files with client-side binary and MIME analysis.' }), robots: { index: false, follow: false } };
}

export default async function FileIdentifierPage() { const locale = await getRequestLocale(); return locale === 'nl' ? <DutchFileIdentifierPage /> : locale === 'es' ? <SpanishFileIdentifierPage /> : <FileIdentifierRouteClient />; }
