import type { Metadata } from 'next';
import { BlogRouteClient } from '@/components/routes/LegacyRouteClients';
export const metadata: Metadata = { title: 'AnyFileX Technical Blog', description: 'Technical articles about file formats, compatibility, and browser tools.', alternates: { canonical: 'https://anyfilex.com/blog' } };
export default function BlogPage() { return <BlogRouteClient />; }
