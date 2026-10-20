import type { Metadata } from 'next';
import React from 'react';
import { ExtensionsHubClient } from '@/components/extensions/ExtensionsHubClient';
import { getRequestLocale } from '@/lib/i18n/requestLocale';
import { localizedMetadata } from '@/lib/i18n/seo';
import { localizedPath } from '@/i18n/paths';
import { getAllFileTypeInfos } from '@/lib/database/extensionEngine';
import { isValidCatalogExtension } from '@/lib/routes/routeManifest';
import type { AppLocale } from '@/i18n/routing';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getRequestLocale()) as AppLocale;
  return locale === 'es'
    ? localizedMetadata({ pathname: '/file-extensions', locale, title: 'Directorio de extensiones de archivo – Especificaciones técnicas', description: 'Busca y consulta 354 extensiones de archivo, tipos MIME, firmas binarias, software compatible y guías para abrirlos.' })
    : {
      title: 'File Extensions Directory – Technical Format Specifications',
      description: 'Search and browse comprehensive technical specifications, MIME types, and header magic bytes for 354 file extensions.',
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
  const spanish = locale === 'es';

  // Complete server-rendered A-Z index. The interactive hub above paginates
  // client-side (12 cards per page), so without this section the initial HTML
  // only ever contains the first page of extension links. Every catalog
  // extension gets a real anchor here, in the initial HTML.
  const directoryEntries = getAllFileTypeInfos()
    .filter((item) => isValidCatalogExtension(item.extension))
    .map((item) => ({
      slug: item.extension.toLowerCase(),
      label: `.${item.extension.toUpperCase()}`,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  const directoryGroups = new Map<string, typeof directoryEntries>();
  for (const entry of directoryEntries) {
    const first = entry.slug.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(first) ? first : '#';
    const group = directoryGroups.get(key) || [];
    group.push(entry);
    directoryGroups.set(key, group);
  }

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
      <section
        aria-label={spanish ? 'Índice completo de extensiones' : 'Complete extension index'}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-2"
      >
        <div className="border-t border-slate-200 dark:border-slate-800 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {spanish ? 'Índice completo de extensiones A–Z' : 'Complete A–Z Extension Index'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
            {spanish
              ? `Las ${directoryEntries.length} extensiones del catálogo, en orden alfabético. Selecciona una extensión para ver sus especificaciones, software compatible y guías.`
              : `All ${directoryEntries.length} catalog extensions in alphabetical order. Select an extension for its specifications, compatible software, and opening guides.`}
          </p>
          <div className="mt-8 space-y-6">
            {[...directoryGroups.entries()].map(([letter, entries]) => (
              <div key={letter} className="flex gap-4">
                <div className="w-8 shrink-0 text-lg font-extrabold text-blue-600 dark:text-blue-400" aria-hidden="true">
                  {letter}
                </div>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  {entries.map((entry) => (
                    <li key={entry.slug}>
                      <a
                        href={localizedPath(`/file-extensions/${entry.slug}`, locale)}
                        className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-2 hover:underline"
                      >
                        {entry.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
