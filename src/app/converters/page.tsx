import type { Metadata } from 'next';
import React from 'react';
import { ConvertersClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'In-Browser File Converters – Free & Private',
  description: 'Convert images, documents, audio, and archives directly in your web browser with 100% privacy and zero server uploads.',
  alternates: {
    canonical: 'https://anyfilex.com/converters',
  },
  openGraph: {
    title: 'In-Browser File Converters – Free & Private',
    description: 'Convert images, documents, audio, and archives directly in your web browser with 100% privacy and zero server uploads.',
    url: 'https://anyfilex.com/converters',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AnyFileX - Universal File Format Platform' }],
  },
};

export default function ConvertersHubPage() {
  return <ConvertersClient />;
}
