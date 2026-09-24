import type { Metadata } from 'next';
import React from 'react';
import { HomeViewClient } from '@/components/home/HomeViewClient';

export const metadata: Metadata = {
  title: 'AnyFileX – Universal File Format Intelligence & Tools',
  description: 'Inspect file formats, verify magic byte signatures, convert files in-browser, and view opening guides for 250+ file extensions.',
  alternates: {
    canonical: 'https://www.anyfilex.com',
  },
  openGraph: {
    title: 'AnyFileX – Universal File Format Intelligence & Tools',
    description: 'Inspect file formats, verify magic byte signatures, convert files in-browser, and view opening guides for 250+ file extensions.',
    url: 'https://www.anyfilex.com',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AnyFileX - Universal File Format Platform' }],
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.anyfilex.com/#website',
      url: 'https://www.anyfilex.com',
      name: 'AnyFileX',
      description: 'Universal File Format Intelligence, Technical Specifications, and In-Browser Utilities',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.anyfilex.com/file-extensions?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'AnyFileX Universal Suite',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All (Web-based)',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Client-side local conversion',
        'Binary magic byte forensics',
        'EXIF metadata inspection and sanitization',
        'Cryptographic hash generation and verification',
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        key="json-ld-home"
        id="json-ld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HomeViewClient />
    </>
  );
}
