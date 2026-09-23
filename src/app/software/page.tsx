import type { Metadata } from 'next';
import React from 'react';
import { SoftwarePageClient } from '@/components/software/SoftwarePageClient';

export const metadata: Metadata = {
  title: 'Compatible Software & App Directory – AnyFileX',
  description: 'Explore compatible desktop, web, and mobile software applications for opening, converting, and editing file formats.',
  alternates: {
    canonical: 'https://www.anyfilex.com/software',
  },
  openGraph: {
    title: 'Compatible Software & App Directory – AnyFileX',
    description: 'Explore compatible desktop, web, and mobile software applications for opening, converting, and editing file formats.',
    url: 'https://www.anyfilex.com/software',
    type: 'website',
  },
};

export default function SoftwareHubPage() {
  return <SoftwarePageClient />;
}
