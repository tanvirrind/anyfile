import type { Metadata } from 'next';
import { ContactRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'Contact the AnyFileX Engineering Team', description: 'Contact AnyFileX about file formats, signatures, and technical issues.', alternates: { canonical: 'https://anyfilex.com/contact' } };
export default function ContactPage() { return <ContactRouteClient />; }
