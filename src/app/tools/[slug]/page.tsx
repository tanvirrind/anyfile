import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { ToolDetailClient } from '@/components/routes/RouteClients';
import { TOOLS_REGISTRY } from '@/lib/tools/toolsRegistry';
import { isValidToolSlug, BASE_URL } from '@/lib/routes/routeManifest';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(TOOLS_REGISTRY).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug?.toLowerCase() || '';

  if (!isValidToolSlug(cleanSlug)) {
    return {
      title: 'Tool Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const tool = TOOLS_REGISTRY[cleanSlug];
  const title = `${tool.name} – Free Browser Utility | AnyFileX`;
  const description = tool.description;
  const canonicalUrl = `${BASE_URL}/tools/${cleanSlug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'website' },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cleanSlug = slug?.toLowerCase() || '';

  if (!isValidToolSlug(cleanSlug)) {
    notFound();
  }

  return <ToolDetailClient slug={cleanSlug} />;
}
