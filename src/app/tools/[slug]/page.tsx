import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { ToolDetailClient } from '@/components/routes/RouteClients';
import { TOOLS_REGISTRY } from '@/lib/tools/toolsRegistry';
import { isValidToolSlug, BASE_URL } from '@/lib/routes/routeManifest';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const TOOL_ALIASES: Record<string, string> = {
  metadata: 'metadata-viewer',
};

const TOOL_REDIRECTS: Record<string, string> = {
  'zip-creator': '/converters/zip-creator',
  'zip-extractor': '/converters/zip-extractor',
  'rar-extractor': '/converters/rar-extractor',
  '3mf-to-stl': '/converters/3mf-to-stl',
};

export async function generateStaticParams() {
  return [...Object.keys(TOOLS_REGISTRY), ...Object.keys(TOOL_ALIASES), ...Object.keys(TOOL_REDIRECTS)].map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug?.toLowerCase() || '';
  const redirectTarget = TOOL_REDIRECTS[cleanSlug];
  const canonicalSlug = TOOL_ALIASES[cleanSlug] || cleanSlug;

  if (redirectTarget) {
    return {
      title: 'File Utility | AnyFileX',
      alternates: { canonical: `${BASE_URL}${redirectTarget}` },
      robots: { index: false, follow: true },
    };
  }

  if (!isValidToolSlug(canonicalSlug)) {
    return {
      title: 'Tool Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const tool = TOOLS_REGISTRY[canonicalSlug];
  const title = `${tool.name} – Free Browser Utility | AnyFileX`;
  const description = tool.description;
  const canonicalUrl = `${BASE_URL}/tools/${canonicalSlug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'website', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }] },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cleanSlug = slug?.toLowerCase() || '';
  const redirectTarget = TOOL_REDIRECTS[cleanSlug];
  const canonicalSlug = TOOL_ALIASES[cleanSlug];

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  if (canonicalSlug) {
    redirect(`/tools/${canonicalSlug}`);
  }

  if (!isValidToolSlug(cleanSlug)) {
    notFound();
  }

  return <ToolDetailClient slug={cleanSlug} />;
}
