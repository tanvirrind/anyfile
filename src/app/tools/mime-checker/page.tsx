import type { Metadata } from 'next';
import { MimeCheckerRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'MIME Type Checker – File Content Types | AnyFileX', description: 'Look up MIME types and file signatures from the AnyFileX catalog.', alternates: { canonical: 'https://anyfilex.com/tools/mime-checker' } };
export default function MimeCheckerPage() { return <MimeCheckerRouteClient />; }
