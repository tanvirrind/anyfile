import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { CategoryDetailClient } from '@/components/routes/RouteClients';
import { CATEGORIES_LIST } from '@/data/categoriesData';
import { isValidCategoryId, BASE_URL } from '@/lib/routes/routeManifest';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES_LIST.map((cat) => ({
    id: cat.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';

  if (!isValidCategoryId(cleanId)) {
    return {
      title: 'Category Not Found | AnyFileX',
      robots: { index: false, follow: false },
    };
  }

  const cat = CATEGORIES_LIST.find((c) => c.id.toLowerCase() === cleanId);
  const title = `${cat?.name || cleanId} File Extensions & Formats Catalog – AnyFileX`;
  const description = `Explore all ${cat?.name || cleanId} file extensions, container structures, specifications, and compatible software.`;
  const canonicalUrl = `${BASE_URL}/category/${cleanId}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'website' },
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cleanId = id?.toLowerCase() || '';

  if (!isValidCategoryId(cleanId)) {
    notFound();
  }

  return <CategoryDetailClient id={cleanId} />;
}
