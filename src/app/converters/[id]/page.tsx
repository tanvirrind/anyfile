import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { ConvertersClient } from '@/components/routes/RouteClients';
import { CONVERTERS_LIST } from '@/data/convertersData';
import { isValidConverterId, BASE_URL } from '@/lib/routes/routeManifest';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return CONVERTERS_LIST.map((conv) => ({
    id: conv.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';

  if (!isValidConverterId(cleanId)) {
    return {
      title: 'Converter Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const conv = CONVERTERS_LIST.find((c) => c.id.toLowerCase() === cleanId);
  const title = `${conv?.name || cleanId.toUpperCase()} – Free In-Browser Converter | AnyFileX`;
  const description = `${conv?.description || 'Convert file formats'} 100% private client-side conversion in your browser with zero server uploads.`;
  const canonicalUrl = `${BASE_URL}/converters/${cleanId}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article' },
  };
}

export default async function ConverterDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';

  if (!isValidConverterId(cleanId)) {
    notFound();
  }

  return <ConvertersClient converterId={cleanId} />;
}
