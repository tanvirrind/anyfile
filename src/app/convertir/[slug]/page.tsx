import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRequestLocale } from '@/lib/i18n/requestLocale';
import { localizedMetadata } from '@/lib/i18n/seo';
import type { AppLocale } from '@/i18n/routing';
import { getSpanishConversionMetadata, SpanishConversionLanding, SPANISH_CONVERSION_SLUGS } from '@/components/i18n/SpanishConversionLanding';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SPANISH_CONVERSION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getRequestLocale()) as AppLocale;
  const page = getSpanishConversionMetadata(slug);
  if (locale !== 'es' || !page) return { title: 'Conversión no encontrada', robots: { index: false, follow: false } };
  return localizedMetadata({ pathname: `/convertir/${slug}`, locale, includeDutch: false, includeEnglish: false, title: page.title, description: page.description });
}

export default async function SpanishConversionPage({ params }: PageProps) {
  const { slug } = await params;
  if ((await getRequestLocale()) !== 'es' || !getSpanishConversionMetadata(slug)) notFound();
  return <SpanishConversionLanding slug={slug} />;
}
