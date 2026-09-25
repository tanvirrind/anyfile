import type { Metadata } from 'next';
import { AuthorsRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'AnyFileX Authors & Review Board', description: 'Meet the authors and technical reviewers behind AnyFileX format guidance.', alternates: { canonical: 'https://anyfilex.com/authors' } };
export default function AuthorsPage() { return <AuthorsRouteClient />; }
