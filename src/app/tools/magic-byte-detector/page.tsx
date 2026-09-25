import type { Metadata } from 'next';
import { MagicByteDetectorRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'Magic Byte Detector – Inspect File Signatures | AnyFileX', description: 'Inspect binary file signatures privately in your browser.', robots: { index: false, follow: false } };
export default function MagicByteDetectorPage() { return <MagicByteDetectorRouteClient />; }
