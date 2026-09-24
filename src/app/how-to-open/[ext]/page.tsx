import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { HowToOpenDetailClient } from '@/components/routes/RouteClients';
import { isValidCatalogExtension, BASE_URL, getStaticParamsForRouteType } from '@/lib/routes/routeManifest';
import { getHowToOpenGuide } from '@/lib/guides/howToOpenEngine';

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

  return <HowToOpenDetailClient ext={cleanExt} />;
}
