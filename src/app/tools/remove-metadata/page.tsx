import type { Metadata } from 'next';
import { RemoveMetadataRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'Remove File Metadata – Private Browser Tool | AnyFileX', description: 'Remove supported metadata locally in your browser.', robots: { index: false, follow: false } };
export default function RemoveMetadataPage() { return <RemoveMetadataRouteClient />; }
