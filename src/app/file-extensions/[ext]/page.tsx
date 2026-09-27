import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { ExtensionDetailClient } from '@/components/extensions/ExtensionDetailClient';
import { isValidCatalogExtension, BASE_URL, getStaticParamsForRouteType } from '@/lib/routes/routeManifest';
import { getOrGenerateExtensionInfo } from '@/lib/seo/extensionGenerator';
import { generateExtensionSchema } from '@/lib/seo/faqGenerator';
import { DutchHeicPage } from '@/components/i18n/DutchPages';
import { localizedMetadata } from '@/lib/i18n/seo';
import type { AppLocale } from '@/i18n/routing';
import { getRequestLocale } from '@/lib/i18n/requestLocale';
import { SpanishHeicPage } from '@/components/i18n/SpanishPages';

interface PageProps {
  params: Promise<{ ext: string }>;
}

export async function generateStaticParams() {
  return getStaticParamsForRouteType('extension-detail');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ext } = await params;
  const cleanExt = ext?.toLowerCase() || '';

  if (!isValidCatalogExtension(cleanExt)) {
    return {
      title: 'File Extension Not Found | AnyFileX',
      description: 'The requested file extension is unknown or could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const fileType = getOrGenerateExtensionInfo(cleanExt);
  const locale = (await getRequestLocale()) as AppLocale;
  if (locale === 'nl' && cleanExt === 'heic') {
    return localizedMetadata({ pathname: '/file-extensions/heic', locale, title: 'HEIC-bestand openen | AnyFileX', description: 'Leer hoe je HEIC-bestanden opent op Windows, Mac, Android en iPhone.' });
  }
  if (locale === 'es' && cleanExt === 'heic') return localizedMetadata({ pathname: '/file-extensions/heic', locale, title: 'Cómo abrir un archivo HEIC | AnyFileX', description: 'Aprende a abrir archivos HEIC en Windows, Mac, Android y iPhone.' });
  if (cleanExt === 'heic') {
    return localizedMetadata({ pathname: '/file-extensions/heic', locale, title: `.${cleanExt.toUpperCase()} File Extension: What It Is & How to Open It`, description: `Complete guide to .${cleanExt.toUpperCase()} (${fileType.name}): MIME types, header magic bytes, compatible software, and conversion options.` });
  }
  const title = `.${cleanExt.toUpperCase()} File Extension: What It Is & How to Open It`;
  const description = `Complete guide to .${cleanExt.toUpperCase()} (${fileType.name}): MIME types, header magic bytes, compatible software, and conversion options.`;
  const canonicalUrl = `${BASE_URL}/file-extensions/${cleanExt}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  };
}

export default async function ExtensionDetailPage({ params }: PageProps) {
  const { ext } = await params;
  const cleanExt = ext?.toLowerCase() || '';

  if (!isValidCatalogExtension(cleanExt)) {
    notFound();
  }

  if ((await getRequestLocale()) === 'nl' && cleanExt === 'heic') return <DutchHeicPage />;
  if ((await getRequestLocale()) === 'es' && cleanExt === 'heic') return <SpanishHeicPage />;

  const fileType = getOrGenerateExtensionInfo(cleanExt);
  const canonicalUrl = `${BASE_URL}/file-extensions/${cleanExt}`;
  const schemaGraph = generateExtensionSchema(fileType, canonicalUrl);

  return (
    <>
      <script
        key={`json-ld-ext-${cleanExt}`}
        id={`json-ld-ext-${cleanExt}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <ExtensionDetailClient ext={cleanExt} />
    </>
  );
}
