import type { Metadata } from 'next';
import { ContentDashboardRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'Content Dashboard – AnyFileX', robots: { index: false, follow: false, noarchive: true } };
export default function ContentDashboardPage() { return <ContentDashboardRouteClient />; }
