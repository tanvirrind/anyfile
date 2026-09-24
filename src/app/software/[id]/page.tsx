import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { SoftwarePageClient } from '@/components/software/SoftwarePageClient';
import { SOFTWARE_LIST } from '@/data/softwareData';
import { BASE_URL, isValidSoftwareId } from '@/lib/routes/routeManifest';
import { getOrGenerateSoftwareInfo } from '@/lib/database/softwareEngine';
import { GOOGLE_DOCS_FAQS } from '@/data/googleDocsFaqs';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return SOFTWARE_LIST.map((soft) => ({
    id: soft.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';

  if (!isValidSoftwareId(cleanId)) {
    return {
      title: 'Software Not Found | AnyFileX',
      description: 'The requested software application could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const isGoogleDocs = cleanId === 'google-docs';
  const soft = getOrGenerateSoftwareInfo(cleanId);

  const title = isGoogleDocs
    ? 'Google Docs File Types: What Files Can Google Docs Open?'
    : `${soft.name} – Supported Formats & Review | AnyFileX`;

  const description = isGoogleDocs
    ? 'Discover what files Google Docs can open and export. Complete guide to supported formats, DOCX, ODT, PDF, EPUB, RTF, TXT, HTML compatibility and limitations.'
    : `${soft.name} by ${soft.developer}: supported file formats, platforms (${(soft.supportedOS || []).join(', ')}), and features.`.slice(0, 155);

  const canonicalUrl = `${BASE_URL}/software/${cleanId}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  };
}

export default async function SoftwareDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';

  if (!isValidSoftwareId(cleanId)) {
    notFound();
  }

  const soft = getOrGenerateSoftwareInfo(cleanId);
  const canonicalUrl = `${BASE_URL}/software/${cleanId}`;
  const isGoogleDocs = cleanId === 'google-docs';

  const schemaGraph: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: soft.name,
      operatingSystem: (soft.supportedOS || []).join(', ') || 'Windows, macOS, Linux',
      applicationCategory: soft.category || 'UtilitiesApplication',
      offers: {
        '@type': 'Offer',
        price: soft.priceType === 'Free' ? '0' : '99.99',
        priceCurrency: 'USD',
      },
      url: canonicalUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.anyfilex.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Software',
          item: 'https://www.anyfilex.com/software',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: soft.name,
          item: canonicalUrl,
        },
      ],
    },
  ];

  if (isGoogleDocs) {
    schemaGraph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: GOOGLE_DOCS_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <>
      <script
        key={`json-ld-software-${cleanId}`}
        id={`json-ld-software-${cleanId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <SoftwarePageClient softwareId={cleanId} />
    </>
  );
}
