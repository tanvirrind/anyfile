import type { Metadata } from 'next';
import React from 'react';
import { TroubleshootHubClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'File Troubleshooting & Repair Guides – AnyFileX',
  description: 'Fix corrupted file headers, resolve missing codecs, and repair unreadable files with verified recovery techniques.',
  alternates: {
    canonical: 'https://www.anyfilex.com/troubleshoot',
  },
  openGraph: {
    title: 'File Troubleshooting & Repair Guides – AnyFileX',
    description: 'Fix corrupted file headers, resolve missing codecs, and repair unreadable files with verified recovery techniques.',
    url: 'https://www.anyfilex.com/troubleshoot',
    type: 'website',
  },
};

export default function TroubleshootHubPage() {
  return <TroubleshootHubClient />;
}
