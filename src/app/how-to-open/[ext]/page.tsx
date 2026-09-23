import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { HowToOpenDetailClient } from '@/components/routes/RouteClients';
import { isValidCatalogExtension, BASE_URL } from '@/lib/routes/routeManifest';
import { getHowToOpenGuide } from '@/lib/guides/howToOpenEngine';
import { getPrioritizedFormatList } from '@/lib/guides/formatGuideEngine';

interface PageProps {
  params: Promise<{ ext: string }>;
}

export async function generateStaticParams() {
  const formats = getPrioritizedFormatList();
  return formats.map((format) => ({
    ext: format.toLowerCase(),
  }));
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
  const title = `How to Open .${cleanExt.toUpperCase()} Files on Windows, Mac, and Mobile`;
  const description = `Step-by-step instructions for opening and viewing .${cleanExt.toUpperCase()} (${guide.name}) files without paid software.`;
  const canonicalUrl = `${BASE_URL}/how-to-open/${cleanExt}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article' },
  };
}

export default async function HowToOpenDetailPage({ params }: PageProps) {
  const { ext } = await params;
  const cleanExt = ext?.toLowerCase() || '';

  if (!isValidCatalogExtension(cleanExt)) {
    notFound();
  }

  return <HowToOpenDetailClient ext={cleanExt} />;
}
