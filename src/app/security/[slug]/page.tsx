import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { TechnicalDetailClient } from '@/components/routes/RouteClients';
import { TECHNICAL_AUTHORITY_GUIDES } from '@/lib/database/technicalAuthorityData';
import { BASE_URL } from '@/lib/routes/routeManifest';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TECHNICAL_AUTHORITY_GUIDES.map((tech) => ({
    slug: tech.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug?.toLowerCase() || '';
  const guide = TECHNICAL_AUTHORITY_GUIDES.find((g) => g.slug.toLowerCase() === cleanSlug);

  if (!guide) {
    return {
      title: 'Security Guide Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const title = `${guide.title} – Security & Forensics Authority | AnyFileX`;
  const description = guide.executiveSummary;
  const canonicalUrl = `${BASE_URL}/security/${cleanSlug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }] },
  };
}

export default async function SecurityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cleanSlug = slug?.toLowerCase() || '';
  const guide = TECHNICAL_AUTHORITY_GUIDES.find((g) => g.slug.toLowerCase() === cleanSlug);

  if (!guide) {
    notFound();
  }

  return <TechnicalDetailClient slug={cleanSlug} />;
}
