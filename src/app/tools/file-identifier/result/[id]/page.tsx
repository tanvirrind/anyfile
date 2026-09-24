import type { Metadata } from 'next';
import { FileIdentifierResultRouteClient } from '@/components/routes/LegacyRouteClients';
export const metadata: Metadata = { title: 'File Analysis Result – AnyFileX', robots: { index: false, follow: false, noarchive: true } };
export default async function FileIdentifierResultPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <FileIdentifierResultRouteClient id={id} />; }
