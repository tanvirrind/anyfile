import type { Metadata } from 'next';
import { AdminRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'Admin – AnyFileX', robots: { index: false, follow: false, noarchive: true } };
export default function AdminPage() { return <AdminRouteClient />; }
