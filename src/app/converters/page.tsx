import type { Metadata } from 'next';
import React from 'react';
import { ConvertersClient } from '@/components/routes/RouteClients';

export const metadata: Metadata = {
  title: 'In-Browser File Converters – Free & Private',
  description: 'Convert images, documents, audio, and archives directly in your web browser with 100% privacy and zero server uploads.',
  alternates: {
    canonical: 'https://www.anyfilex.com/converters',
  },
  openGraph: {
    title: 'In-Browser File Converters – Free & Private',
    description: 'Convert images, documents, audio, and archives directly in your web browser with 100% privacy and zero server uploads.',
    url: 'https://www.anyfilex.com/converters',
    type: 'website',
  },
};

export default function ConvertersHubPage() {
  return <ConvertersClient />;
}
