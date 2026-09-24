import type { Metadata } from 'next';
import { MetadataViewerRouteClient } from '@/components/routes/LegacyRouteClients';
export const metadata: Metadata = { title: 'Metadata Viewer – Inspect File Metadata | AnyFileX', description: 'Inspect file metadata privately in your browser.', robots: { index: false, follow: false } };
export default function MetadataViewerPage() { return <MetadataViewerRouteClient />; }
