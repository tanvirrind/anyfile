import type { Metadata } from 'next';
import { WorkflowRouteClient } from '@/components/routes/RouteClients';
export const metadata: Metadata = { title: 'File Analysis Workflows – AnyFileX', description: 'Build browser-based file analysis workflows with AnyFileX.', robots: { index: false, follow: false } };
export default function WorkflowsPage() { return <WorkflowRouteClient />; }
