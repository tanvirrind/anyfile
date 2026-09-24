import type { Metadata } from 'next';
import React from 'react';
import { ToolsHubClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'Universal Client-Side File Forensics & Utilities – AnyFileX',
  description: 'Free client-side file inspection utilities: magic byte detector, hash generator, EXIF viewer, and MIME validator.',
  alternates: {
    canonical: 'https://anyfilex.com/tools',
  },
  openGraph: {
    title: 'Universal Client-Side File Forensics & Utilities – AnyFileX',
    description: 'Free client-side file inspection utilities: magic byte detector, hash generator, EXIF viewer, and MIME validator.',
    url: 'https://anyfilex.com/tools',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AnyFileX - Universal File Format Platform' }],
  },
};

export default function ToolsHubPage() {
  return <ToolsHubClient />;
}
