import type { Metadata } from 'next';
import { ChecksumVerifierRouteClient } from '@/components/routes/LegacyRouteClients';
export const metadata: Metadata = { title: 'Checksum Verifier – Verify File Integrity | AnyFileX', description: 'Verify file checksums locally in your browser.', robots: { index: false, follow: false } };
export default function ChecksumVerifierPage() { return <ChecksumVerifierRouteClient />; }
