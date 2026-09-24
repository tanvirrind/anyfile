import type { Metadata } from 'next';
import React from 'react';
import { HowToOpenHubClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'How to Open Any File Format – Step-by-Step Guides',
  description: 'Practical guides and instructions for opening unknown or unsupported files across Windows, macOS, Linux, iOS, and Android.',
  alternates: {
    canonical: 'https://anyfilex.com/how-to-open',
  },
  openGraph: {
    title: 'How to Open Any File Format – Step-by-Step Guides',
    description: 'Practical guides and instructions for opening unknown or unsupported files across Windows, macOS, Linux, iOS, and Android.',
    url: 'https://anyfilex.com/how-to-open',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AnyFileX - Universal File Format Platform' }],
  },
};

export default function HowToOpenHubPage() {
  return <HowToOpenHubClient />;
}
