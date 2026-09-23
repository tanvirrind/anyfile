import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { TroubleshootDetailClient } from '@/components/routes/RouteClients';
import { TROUBLESHOOTING_GUIDES } from '@/lib/database/troubleshootingData';
import { BASE_URL } from '@/lib/routes/routeManifest';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return TROUBLESHOOTING_GUIDES.map((guide) => ({
    id: guide.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';
  const guide = TROUBLESHOOTING_GUIDES.find((g) => g.id.toLowerCase() === cleanId);

  if (!guide) {
    return {
      title: 'Troubleshooting Guide Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const title = `${guide.title} – Troubleshooting Guide | AnyFileX`;
  const description = guide.problemSummary;
  const canonicalUrl = `${BASE_URL}/troubleshoot/${cleanId}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article' },
  };
}

export default async function TroubleshootDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';
  const guide = TROUBLESHOOTING_GUIDES.find((g) => g.id.toLowerCase() === cleanId);

  if (!guide) {
    notFound();
  }

  return <TroubleshootDetailClient id={cleanId} />;
}
