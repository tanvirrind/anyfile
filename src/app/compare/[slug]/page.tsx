import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { ComparisonDetailClient } from '@/components/routes/RouteClients';
import { CURATED_COMPARISONS } from '@/lib/database/knowledgeGraph';
import { isValidComparisonSlug, BASE_URL } from '@/lib/routes/routeManifest';
import { getComparisonGuide } from '@/lib/guides/comparisonGuideEngine';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CURATED_COMPARISONS.map((comp) => ({
    slug: comp.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug?.toLowerCase() || '';

  if (!isValidComparisonSlug(cleanSlug)) {
    return {
      title: 'Comparison Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const guide = getComparisonGuide(cleanSlug);
  const title = `${guide.title} – Detailed Technical Comparison | AnyFileX`;
  const description = `Comprehensive comparison of ${guide.ext1.toUpperCase()} vs ${guide.ext2.toUpperCase()}: compression efficiency, fidelity, and application compatibility.`;
  const canonicalUrl = `${BASE_URL}/compare/${cleanSlug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article' },
  };
}

export default async function ComparisonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cleanSlug = slug?.toLowerCase() || '';

  if (!isValidComparisonSlug(cleanSlug)) {
    notFound();
  }

  return <ComparisonDetailClient slug={cleanSlug} />;
}
