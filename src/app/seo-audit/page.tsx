import type { Metadata } from 'next';
import { SitemapRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'SEO Audit – AnyFileX', robots: { index: false, follow: false, noarchive: true } };
export default function SeoAuditPage() { return <SitemapRouteClient />; }
