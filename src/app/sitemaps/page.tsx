import type { Metadata } from 'next';
import { SitemapRouteClient } from '@/components/routes/LegacyRouteClients';
export const metadata: Metadata = { title: 'XML Sitemaps Directory – AnyFileX', description: 'Directory of AnyFileX XML sitemaps.', robots: { index: false, follow: false } };
export default function SitemapsPage() { return <SitemapRouteClient />; }
