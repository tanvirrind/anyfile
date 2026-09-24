import type { Metadata } from 'next';
import { MetadataResultRouteClient } from '@/components/routes/LegacyRouteClients';
export const metadata: Metadata = { title: 'Metadata Viewer Result – AnyFileX', robots: { index: false, follow: false, noarchive: true } };
export default async function MetadataResultPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <MetadataResultRouteClient id={id} />; }
