import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { TroubleshootDetailClient } from '@/components/routes/RouteClients';
import { RepairRouteClient } from '@/components/routes/RouteClients';
import { TROUBLESHOOTING_GUIDES } from '@/lib/database/troubleshootingData';
import { REPAIR_GUIDES } from '@/data/repairData';
import { BASE_URL } from '@/lib/routes/routeManifest';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return [...TROUBLESHOOTING_GUIDES, ...REPAIR_GUIDES].map((guide) => ({ id: guide.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';
  const guide = TROUBLESHOOTING_GUIDES.find((g) => g.id.toLowerCase() === cleanId);
  const repairGuide = REPAIR_GUIDES.find((g) => g.id.toLowerCase() === cleanId);

  if (!guide && !repairGuide) {
    return {
      title: 'Troubleshooting Guide Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const title = guide
    ? `${guide.title} – Troubleshooting Guide`
    : `${repairGuide!.title} – File Repair Guide`;
  // B-07: problemSummary is long-form page content (pdf-wont-open is 992
  // chars) and doubles as the meta description. Truncate ONLY the metadata
  // copy at a word boundary so SERP snippets stay within ~155 chars; the
  // full summary still renders on the page body unchanged.
  const rawDescription = guide
    ? guide.problemSummary
    : `Step-by-step guidance for repairing damaged .${repairGuide!.extension} files.`;
  const description =
    rawDescription.length > 155
      ? `${rawDescription.slice(0, 152).replace(/\s+\S*$/, '')}…`
      : rawDescription;
  const canonicalUrl = `${BASE_URL}/troubleshoot/${cleanId}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }] },
  };
}

export default async function TroubleshootDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';
  const guide = TROUBLESHOOTING_GUIDES.find((g) => g.id.toLowerCase() === cleanId);
  const repairGuide = REPAIR_GUIDES.find((g) => g.id.toLowerCase() === cleanId);

  if (!guide && !repairGuide) {
    notFound();
  }

  return repairGuide
    ? <RepairRouteClient id={cleanId} />
    : <TroubleshootDetailClient id={cleanId} />;
}
