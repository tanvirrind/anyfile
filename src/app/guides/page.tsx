import type { Metadata } from 'next';
import React from 'react';
import { GuidesClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'File Format Knowledge & Technical Guides – AnyFileX',
  description: 'In-depth engineering articles on container architectures, codec specifications, and binary data structures.',
  alternates: {
    canonical: 'https://www.anyfilex.com/guides',
  },
  openGraph: {
    title: 'File Format Knowledge & Technical Guides – AnyFileX',
    description: 'In-depth engineering articles on container architectures, codec specifications, and binary data structures.',
    url: 'https://www.anyfilex.com/guides',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AnyFileX - Universal File Format Platform' }],
  },
};

export default function GuidesHubPage() {
  return <GuidesClient />;
}
