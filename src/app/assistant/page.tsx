import type { Metadata } from 'next';
import { AssistantRouteClient } from '@/components/routes/LegacyRouteClients';
export const metadata: Metadata = { title: 'AnyFileX File Format Assistant', description: 'Ask questions about file formats and compatibility.', robots: { index: false, follow: false } };
export default function AssistantPage() { return <AssistantRouteClient />; }
