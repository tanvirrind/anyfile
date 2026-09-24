import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MimeDetailRouteClient } from '@/components/routes/LegacyRouteClients';
import { EXPANDED_MIME_DATABASE } from '@/data/expandedMimeDatabase';
import { getStaticParamsForRouteType, getMimeRouteSlug } from '@/lib/routes/routeManifest';
export function generateStaticParams() { return getStaticParamsForRouteType('mime-detail'); }
function findMime(slug: string) { const clean = slug.toLowerCase(); return EXPANDED_MIME_DATABASE.find((item) => getMimeRouteSlug(item.mimeType) === clean || item.mimeType.replace('/', '-').toLowerCase() === clean || item.extension.toLowerCase() === clean); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const item = findMime(slug); return item ? { title: `${item.mimeType} MIME Type – AnyFileX`, description: item.description, alternates: { canonical: `https://anyfilex.com/mime-type/${slug.toLowerCase()}` } } : { title: 'MIME Type Not Found', robots: { index: false, follow: false } }; }
export default async function MimeDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; if (!findMime(slug)) notFound(); return <MimeDetailRouteClient slug={slug.toLowerCase()} />; }
