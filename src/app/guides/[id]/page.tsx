import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { GuidesClient } from '@/components/routes/RouteClients';
import { GUIDES_LIST } from '@/data/guidesData';
import { BASE_URL } from '@/lib/routes/routeManifest';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return GUIDES_LIST.map((guide) => ({
    id: guide.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';
  const guide = GUIDES_LIST.find((g) => g.id.toLowerCase() === cleanId);

  if (!guide) {
    return {
      title: 'Guide Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const title = `${guide.title} – AnyFileX Technical Guide`;
  const description = guide.summary;
  const canonicalUrl = `${BASE_URL}/guides/${cleanId}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article' },
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';
  const guide = GUIDES_LIST.find((g) => g.id.toLowerCase() === cleanId);

  if (!guide) {
    notFound();
  }

  return <GuidesClient guideId={cleanId} />;
}
