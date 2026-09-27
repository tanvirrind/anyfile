import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { HowToOpenDetailClient } from '@/components/routes/RouteClients';
import { isValidCatalogExtension, BASE_URL, getStaticParamsForRouteType } from '@/lib/routes/routeManifest';
import { getHowToOpenGuide } from '@/lib/guides/howToOpenEngine';
import { DutchHowToOpenHeicPage } from '@/components/i18n/DutchPages';
import { localizedMetadata } from '@/lib/i18n/seo';
import type { AppLocale } from '@/i18n/routing';
import { getRequestLocale } from '@/lib/i18n/requestLocale';
import { SpanishHowToOpenHeicPage } from '@/components/i18n/SpanishPages';

interface PageProps {
  params: Promise<{ ext: string }>;
}

export async function generateStaticParams() {
  return getStaticParamsForRouteType('how-to-open-detail');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ext } = await params;
  const cleanExt = ext?.toLowerCase() || '';

  if (!isValidCatalogExtension(cleanExt)) {
    return {
      title: 'Guide Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const guide = getHowToOpenGuide(cleanExt);
  const locale = (await getRequestLocale()) as AppLocale;
  if (locale === 'nl' && cleanExt === 'heic') return localizedMetadata({ pathname: '/how-to-open/heic', locale, title: 'Hoe open je een HEIC-bestand? | AnyFileX', description: 'Praktische uitleg voor het openen van HEIC-bestanden op Windows, Mac, Android en iPhone.' });
  if (locale === 'es' && cleanExt === 'heic') return localizedMetadata({ pathname: '/how-to-open/heic', locale, title: 'Cómo abrir un archivo HEIC | AnyFileX', description: 'Explicación práctica para abrir archivos HEIC en Windows, Mac, Android y iPhone.' });
  if (cleanExt === 'heic') return localizedMetadata({ pathname: '/how-to-open/heic', locale, title: `How to Open .${cleanExt.toUpperCase()} Files on Windows, Mac, and Mobile`, description: `Step-by-step instructions for opening and viewing .${cleanExt.toUpperCase()} (${guide.name}) files without paid software.` });
  const title = `How to Open .${cleanExt.toUpperCase()} Files on Windows, Mac, and Mobile`;
  const description = `Step-by-step instructions for opening and viewing .${cleanExt.toUpperCase()} (${guide.name}) files without paid software.`;
  const canonicalUrl = `${BASE_URL}/how-to-open/${cleanExt}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }] },
  };
}

export default async function HowToOpenDetailPage({ params }: PageProps) {
  const { ext } = await params;
  const cleanExt = ext?.toLowerCase() || '';

  if (!isValidCatalogExtension(cleanExt)) {
    notFound();
  }

  if ((await getRequestLocale()) === 'nl' && cleanExt === 'heic') return <DutchHowToOpenHeicPage />;
  if ((await getRequestLocale()) === 'es' && cleanExt === 'heic') return <SpanishHowToOpenHeicPage />;

  return <HowToOpenDetailClient ext={cleanExt} />;
}
