import type { Metadata } from 'next';
import React from 'react';
import { ToolsHubClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'Universal Client-Side File Forensics & Utilities – AnyFileX',
  description: 'Free client-side file inspection utilities: magic byte detector, hash generator, EXIF viewer, and MIME validator.',
  alternates: {
    canonical: 'https://www.anyfilex.com/tools',
  },
  openGraph: {
    title: 'Universal Client-Side File Forensics & Utilities – AnyFileX',
    description: 'Free client-side file inspection utilities: magic byte detector, hash generator, EXIF viewer, and MIME validator.',
    url: 'https://www.anyfilex.com/tools',
    type: 'website',
  },
};

export default function ToolsHubPage() {
  return <ToolsHubClient />;
}
