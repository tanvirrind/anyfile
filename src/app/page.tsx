import type { Metadata } from 'next';
import React from 'react';
import { HomeViewClient } from '@/components/home/HomeViewClient';
import { DutchHomePage } from '@/components/i18n/DutchPages';
import { localizedMetadata } from '@/lib/i18n/seo';
import type { AppLocale } from '@/i18n/routing';
import { getRequestLocale } from '@/lib/i18n/requestLocale';
import { SpanishHomePage } from '@/components/i18n/SpanishPages';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getRequestLocale()) as AppLocale;
  return locale === 'nl'
    ? localizedMetadata({ pathname: '/', locale, title: 'AnyFileX – Bestandsinformatie en hulpmiddelen', description: 'Identificeer bestandsformaten, bekijk technische details en gebruik privacyvriendelijke hulpmiddelen in je browser.' })
    : locale === 'es'
      ? localizedMetadata({ pathname: '/', locale, title: 'AnyFileX – Información y herramientas de archivos', description: 'Identifica formatos, consulta detalles técnicos y usa herramientas privadas directamente en tu navegador.' })
    : localizedMetadata({ pathname: '/', locale, title: 'AnyFileX – Universal File Format Intelligence & Tools', description: 'Inspect file formats, verify magic byte signatures, convert files in-browser, and view opening guides for 250+ file extensions.' });
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://anyfilex.com/#website',
      url: 'https://anyfilex.com',
      name: 'AnyFileX',
      description: 'Universal File Format Intelligence, Technical Specifications, and In-Browser Utilities',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://anyfilex.com/file-extensions?q={search_term_string}',
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

export default async function HomePage() {
  const locale = await getRequestLocale();
  return (
    <>
      {locale === 'nl' ? <DutchHomePage /> : locale === 'es' ? <SpanishHomePage /> : null}
      <script
        key="json-ld-home"
        id="json-ld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {locale === 'en' ? <HomeViewClient /> : null}
    </>
  );
}
