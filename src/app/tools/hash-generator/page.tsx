import type { Metadata } from 'next';
import { HashGeneratorRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'Hash Generator – SHA and MD5 Checksums | AnyFileX', description: 'Generate file hashes locally in your browser.', robots: { index: false, follow: false } };
export default function HashGeneratorPage() { return <HashGeneratorRouteClient />; }
