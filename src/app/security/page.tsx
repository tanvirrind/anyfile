import type { Metadata } from 'next';
import React from 'react';
import { TechnicalHubClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'File Security & Forensic Analysis – AnyFileX',
  description: 'Technical security research on executable disguises, macro payloads, polyglot files, and header integrity verification.',
  alternates: {
    canonical: 'https://anyfilex.com/security',
  },
  openGraph: {
    title: 'File Security & Forensic Analysis – AnyFileX',
    description: 'Technical security research on executable disguises, macro payloads, polyglot files, and header integrity verification.',
    url: 'https://anyfilex.com/security',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AnyFileX - Universal File Format Platform' }],
  },
};

export default function SecurityHubPage() {
  return <TechnicalHubClient />;
}
