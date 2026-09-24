import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { GuidesClient } from '@/components/routes/RouteClients';
import { GUIDES_LIST } from '@/data/guidesData';
import { INITIAL_CONTENT_ENTITIES } from '@/lib/content/contentRegistry';
import { BASE_URL } from '@/lib/routes/routeManifest';
import { generateFAQSchema } from '@/lib/seo/faqGenerator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = new Set([
    ...GUIDES_LIST.map((guide) => guide.id),
    ...INITIAL_CONTENT_ENTITIES
      .filter((entity) => entity.status === 'published')
      .map((entity) => entity.slug),
  ]);

  return [...ids].map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';
  const guide = GUIDES_LIST.find((g) => g.id.toLowerCase() === cleanId);
  const contentEntity = INITIAL_CONTENT_ENTITIES.find(
    (entity) => entity.slug.toLowerCase() === cleanId || entity.id.toLowerCase() === cleanId
  );

  if (!guide && (!contentEntity || contentEntity.status !== 'published')) {
    return {
      title: 'Guide Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const title = guide
    ? `${guide.title} – AnyFileX Technical Guide`
    : contentEntity!.seoMeta.title.replace(/\s*\|\s*AnyFileX\s*$/i, '');
  const description = guide ? guide.summary : contentEntity!.seoMeta.description;
  const canonicalUrl = `${BASE_URL}/guides/${cleanId}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';
  const guide = GUIDES_LIST.find((g) => g.id.toLowerCase() === cleanId);
  const contentEntity = INITIAL_CONTENT_ENTITIES.find(
    (entity) => entity.slug.toLowerCase() === cleanId || entity.id.toLowerCase() === cleanId
  );

  if (!guide && (!contentEntity || contentEntity.status !== 'published')) {
    notFound();
  }

  const structuredData = contentEntity
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: 'AnyFileX',
            url: `${BASE_URL}/`,
          },
          {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            name: 'AnyFileX',
            url: `${BASE_URL}/`,
            publisher: { '@id': `${BASE_URL}/#organization` },
          },
          {
            '@type': 'Article',
            '@id': `${BASE_URL}/guides/${contentEntity.slug}#article`,
            headline: contentEntity.h1 || contentEntity.title,
            description: contentEntity.summary,
            datePublished: contentEntity.publishedDate || contentEntity.createdAt,
            dateModified: contentEntity.updatedDate,
            mainEntityOfPage: `${BASE_URL}/guides/${contentEntity.slug}`,
            publisher: { '@id': `${BASE_URL}/#organization` },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${BASE_URL}/guides/${contentEntity.slug}#breadcrumb`,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE_URL}/guides` },
              { '@type': 'ListItem', position: 3, name: contentEntity.title, item: `${BASE_URL}/guides/${contentEntity.slug}` },
            ],
          },
          generateFAQSchema(contentEntity.faq),
        ],
      }
    : null;

  return (
    <>
      {structuredData && (
        <script
          id={`json-ld-guide-${cleanId}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <GuidesClient guideId={cleanId} />
    </>
  );
}
