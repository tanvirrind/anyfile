import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { ExtensionDetailClient } from '@/components/extensions/ExtensionDetailClient';
import { isValidCatalogExtension, BASE_URL, getStaticParamsForRouteType } from '@/lib/routes/routeManifest';
import { getOrGenerateExtensionInfo } from '@/lib/seo/extensionGenerator';
import { generateExtensionSchema } from '@/lib/seo/faqGenerator';

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
