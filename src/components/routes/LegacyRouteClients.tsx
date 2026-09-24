'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppRoute } from '@/types';
import { routeToPath } from '@/utils/router';
import { AboutPage } from '@/views/AboutPage';
import { ContactPage } from '@/views/ContactPage';
import { EditorialStandardsPage } from '@/views/EditorialStandardsPage';
import { AuthorsPage } from '@/views/AuthorsPage';
import { WorkflowPage } from '@/views/WorkflowPage';
import { AssistantPage } from '@/views/AssistantPage';
import { SeoAuditPage } from '@/views/SeoAuditPage';
import { BlogPage } from '@/views/BlogPage';
import { MimeCheckerPage } from '@/views/MimeCheckerPage';
import { MimeDetailPage } from '@/views/MimeDetailPage';
import { FileIdentifierPage } from '@/views/FileIdentifierPage';
import { MetadataViewerPage } from '@/views/MetadataViewerPage';
import { RemoveMetadataPage } from '@/views/RemoveMetadataPage';
import { HashGeneratorPage } from '@/views/HashGeneratorPage';
import { ChecksumVerifierPage } from '@/views/ChecksumVerifierPage';
import { MagicByteDetectorPage } from '@/views/MagicByteDetectorPage';
import { RepairPage } from '@/views/RepairPage';
import { FormatGuidePage } from '@/views/FormatGuidePage';
import { AdminCMSPage } from '@/views/AdminCMSPage';
import { ContentDashboardPage } from '@/views/ContentDashboardPage';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { FileIdentifierResultPage } from '@/views/FileIdentifierResultPage';
import { MetadataViewerResultPage } from '@/views/MetadataViewerResultPage';

function useNavigate() {
  const router = useRouter();
  return (route: AppRoute) => {
    router.push(routeToPath(route));
    window.scrollTo(0, 0);
  };
}

export function AboutRouteClient() { return <AboutPage onNavigate={useNavigate()} />; }
export function ContactRouteClient() { return <ContactPage onNavigate={useNavigate()} />; }
export function EditorialStandardsRouteClient() { return <EditorialStandardsPage onNavigate={useNavigate()} />; }
export function AuthorsRouteClient({ authorId }: { authorId?: string }) { return <AuthorsPage onNavigate={useNavigate()} selectedAuthorId={authorId} />; }
export function WorkflowRouteClient({ workflowId }: { workflowId?: string }) { return <WorkflowPage onNavigate={useNavigate()} initialWorkflowId={workflowId} />; }
export function AssistantRouteClient() { return <AssistantPage onNavigate={useNavigate()} />; }
export function SitemapRouteClient() { return <SeoAuditPage onNavigate={useNavigate()} />; }
export function BlogRouteClient({ postId }: { postId?: string }) { return <BlogPage onNavigate={useNavigate()} selectedPostId={postId} />; }
export function MimeCheckerRouteClient({ query }: { query?: string }) { return <MimeCheckerPage onNavigate={useNavigate()} initialQuery={query} />; }
export function MimeDetailRouteClient({ slug }: { slug: string }) { return <MimeDetailPage onNavigate={useNavigate()} mimeSlug={slug} />; }
export function FileIdentifierRouteClient() { return <FileIdentifierPage onNavigate={useNavigate()} />; }
export function MetadataViewerRouteClient() { return <MetadataViewerPage onNavigate={useNavigate()} />; }
export function RemoveMetadataRouteClient() { return <RemoveMetadataPage onNavigate={useNavigate()} />; }
export function HashGeneratorRouteClient() { return <HashGeneratorPage onNavigate={useNavigate()} />; }
export function ChecksumVerifierRouteClient() { return <ChecksumVerifierPage onNavigate={useNavigate()} />; }
export function MagicByteDetectorRouteClient() { return <MagicByteDetectorPage onNavigate={useNavigate()} />; }
export function RepairRouteClient({ id }: { id?: string }) { return <RepairPage onNavigate={useNavigate()} selectedRepairId={id} />; }
export function FormatGuideRouteClient({ format }: { format: string }) { return <FormatGuidePage onNavigate={useNavigate()} format={format} />; }
export function AdminRouteClient() { const navigate = useNavigate(); return <AdminAuthGuard onNavigate={navigate} currentRoute={{ view: 'admin' }}><AdminCMSPage onNavigate={navigate} /></AdminAuthGuard>; }
export function ContentDashboardRouteClient() { const navigate = useNavigate(); return <AdminAuthGuard onNavigate={navigate} currentRoute={{ view: 'content-dashboard' }}><ContentDashboardPage onNavigate={navigate} /></AdminAuthGuard>; }
export function FileIdentifierResultRouteClient({ id }: { id: string }) { return <FileIdentifierResultPage onNavigate={useNavigate()} reportId={id} />; }
export function MetadataResultRouteClient({ id }: { id: string }) { return <MetadataViewerResultPage onNavigate={useNavigate()} reportId={id} />; }
