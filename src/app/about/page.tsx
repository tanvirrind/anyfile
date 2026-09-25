import type { Metadata } from 'next';
import { AboutRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'About AnyFileX – Universal File Intelligence Platform', description: 'Learn about AnyFileX and its privacy-first browser tools.', alternates: { canonical: 'https://anyfilex.com/about' } };
export default function AboutPage() { return <AboutRouteClient />; }
