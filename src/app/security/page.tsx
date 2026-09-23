import type { Metadata } from 'next';
import React from 'react';
import { TechnicalHubClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'File Security & Forensic Analysis – AnyFileX',
  description: 'Technical security research on executable disguises, macro payloads, polyglot files, and header integrity verification.',
  alternates: {
    canonical: 'https://www.anyfilex.com/security',
  },
  openGraph: {
    title: 'File Security & Forensic Analysis – AnyFileX',
    description: 'Technical security research on executable disguises, macro payloads, polyglot files, and header integrity verification.',
    url: 'https://www.anyfilex.com/security',
    type: 'website',
  },
};

export default function SecurityHubPage() {
  return <TechnicalHubClient />;
}
