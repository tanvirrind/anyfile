import type { Metadata } from 'next';
import React from 'react';
import { HowToOpenHubClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'How to Open Any File Format – Step-by-Step Guides',
  description: 'Practical guides and instructions for opening unknown or unsupported files across Windows, macOS, Linux, iOS, and Android.',
  alternates: {
    canonical: 'https://www.anyfilex.com/how-to-open',
  },
  openGraph: {
    title: 'How to Open Any File Format – Step-by-Step Guides',
    description: 'Practical guides and instructions for opening unknown or unsupported files across Windows, macOS, Linux, iOS, and Android.',
    url: 'https://www.anyfilex.com/how-to-open',
    type: 'website',
  },
};

export default function HowToOpenHubPage() {
  return <HowToOpenHubClient />;
}
