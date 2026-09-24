import type { Metadata } from 'next';
import { FileIdentifierRouteClient } from '@/components/routes/LegacyRouteClients';
export const metadata: Metadata = { title: 'File Identifier – Inspect Unknown Files | AnyFileX', description: 'Identify files with client-side binary and MIME analysis.', robots: { index: false, follow: false } };
export default function FileIdentifierPage() { return <FileIdentifierRouteClient />; }
