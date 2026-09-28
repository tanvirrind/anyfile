import type { Metadata } from 'next';
import React from 'react';
import { ExtensionsHubClient } from '@/components/extensions/ExtensionsHubClient';
import { getRequestLocale } from '@/lib/i18n/requestLocale';
import { localizedMetadata } from '@/lib/i18n/seo';
import type { AppLocale } from '@/i18n/routing';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getRequestLocale()) as AppLocale;
  return locale === 'es'
    ? localizedMetadata({ pathname: '/file-extensions', locale, title: 'Directorio de extensiones de archivo – Especificaciones técnicas', description: 'Busca y consulta más de 250 extensiones de archivo, tipos MIME, firmas binarias, software compatible y guías para abrirlos.' })
    : {
      title: 'File Extensions Directory – Technical Format Specifications',
      description: 'Search and browse comprehensive technical specifications, MIME types, and header magic bytes for 250+ file extensions.',
      alternates: { canonical: 'https://anyfilex.com/file-extensions' },
    };
}

function getBreadcrumbJsonLd(locale: AppLocale) {
  const spanish = locale === 'es';
  const home = spanish ? 'Inicio' : 'Home';
  const extensions = spanish ? 'Extensiones de archivo' : 'File Extensions';
  const prefix = spanish ? 'https://anyfilex.com/es' : 'https://anyfilex.com';
  return {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: home,
      item: `${prefix}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: extensions,
      item: `${prefix}/file-extensions`,
    },
  ],
  };
}

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; letter?: string }>;
}

export default async function FileExtensionsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const locale = (await getRequestLocale()) as AppLocale;

  return (
    <>
      <script
        key="json-ld-extensions-breadcrumb"
        id="json-ld-extensions-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbJsonLd(locale)) }}
      />
      <ExtensionsHubClient
        initialSearch={resolvedParams.q}
        initialCategory={resolvedParams.category}
        initialLetter={resolvedParams.letter}
      />
    </>
  );
}
