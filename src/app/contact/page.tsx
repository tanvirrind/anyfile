import type { Metadata } from 'next';
import { ContactRouteClient } from '@/components/routes/LegacyRouteClients';
export const metadata: Metadata = { title: 'Contact the AnyFileX Engineering Team', description: 'Contact AnyFileX about file formats, signatures, and technical issues.', alternates: { canonical: 'https://www.anyfilex.com/contact' } };
export default function ContactPage() { return <ContactRouteClient />; }
