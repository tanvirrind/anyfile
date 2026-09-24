import type { Metadata } from 'next';
import { EditorialStandardsRouteClient } from '@/components/routes/LegacyRouteClients';
export const metadata: Metadata = { title: 'Editorial Standards & Technical Verification Process – AnyFileX', description: 'How AnyFileX verifies file format facts, signatures, and technical guidance.', alternates: { canonical: 'https://anyfilex.com/editorial-standards' } };
export default function EditorialStandardsPage() { return <EditorialStandardsRouteClient />; }
