import type { Metadata } from 'next';
import React from 'react';
import { ExtensionsHubClient } from '@/components/extensions/ExtensionsHubClient';

export const metadata: Metadata = {
  title: 'File Extensions Directory – Technical Format Specifications',
  description: 'Search and browse comprehensive technical specifications, MIME types, and header magic bytes for 250+ file extensions.',
  alternates: {
    canonical: 'https://anyfilex.com/file-extensions',
  },
  openGraph: {
    title: 'File Extensions Directory – Technical Format Specifications',
    description: 'Search and browse comprehensive technical specifications, MIME types, and header magic bytes for 250+ file extensions.',
    url: 'https://anyfilex.com/file-extensions',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AnyFileX - Universal File Format Platform' }],
  },
};

const BREADCRUMB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://anyfilex.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'File Extensions',
      item: 'https://anyfilex.com/file-extensions',
    },
  ],
};

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; letter?: string }>;
}

export default async function FileExtensionsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  return (
    <>
      <script
        key="json-ld-extensions-breadcrumb"
        id="json-ld-extensions-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <ExtensionsHubClient
        initialSearch={resolvedParams.q}
        initialCategory={resolvedParams.category}
        initialLetter={resolvedParams.letter}
      />
    </>
  );
}
