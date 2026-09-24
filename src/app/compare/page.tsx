import type { Metadata } from 'next';
import React from 'react';
import { CompareHubClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'File Format Comparisons – Technical Differences Explained',
  description: 'Side-by-side technical comparisons between competing file formats: compression, quality, metadata, and compatibility.',
  alternates: {
    canonical: 'https://anyfilex.com/compare',
  },
  openGraph: {
    title: 'File Format Comparisons – Technical Differences Explained',
    description: 'Side-by-side technical comparisons between competing file formats: compression, quality, metadata, and compatibility.',
    url: 'https://anyfilex.com/compare',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AnyFileX - Universal File Format Platform' }],
  },
};

export default function CompareHubPage() {
  return <CompareHubClient />;
}
