'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HowToOpenHubPage } from '../../views/HowToOpenHubPage';
import { HowToOpenPage } from '../../views/HowToOpenPage';
import { ConvertersPageProps } from '../../views/ConvertersPage';
import { CompareHubPage } from '../../views/CompareHubPage';
import { ComparisonPage } from '../../views/ComparisonPage';
import { CategoryPage } from '../../views/CategoryPage';
import { GuidesPage } from '../../views/GuidesPage';
import { TroubleshootHubPage } from '../../views/TroubleshootHubPage';
import { TroubleshootGuidePage } from '../../views/TroubleshootGuidePage';
import { TechnicalHubPage } from '../../views/TechnicalHubPage';
import { TechnicalGuidePage } from '../../views/TechnicalGuidePage';
import { ToolsPage } from '../../views/ToolsPage';
import { ToolDetailPageProps } from '../../views/ToolDetailPage';
import { AboutPage } from '../../views/AboutPage';
import { ContactPage } from '../../views/ContactPage';
import { EditorialStandardsPage } from '../../views/EditorialStandardsPage';
import { AuthorsPage } from '../../views/AuthorsPage';
import { WorkflowPage } from '../../views/WorkflowPage';
import { AssistantPage } from '../../views/AssistantPage';
import { SeoAuditPage } from '../../views/SeoAuditPage';
import { BlogPage } from '../../views/BlogPage';
import { MimeCheckerPage } from '../../views/MimeCheckerPage';
import { MimeDetailPage } from '../../views/MimeDetailPage';
import { FileIdentifierPage } from '../../views/FileIdentifierPage';
import { MetadataViewerPage } from '../../views/MetadataViewerPage';
import { RemoveMetadataPage } from '../../views/RemoveMetadataPage';
import { HashGeneratorPage } from '../../views/HashGeneratorPage';
import { ChecksumVerifierPage } from '../../views/ChecksumVerifierPage';
import { MagicByteDetectorPage } from '../../views/MagicByteDetectorPage';
import { RepairPage } from '../../views/RepairPage';
import { FileIdentifierResultPage } from '../../views/FileIdentifierResultPage';
import { MetadataViewerResultPage } from '../../views/MetadataViewerResultPage';
import { AdminCMSPage } from '../../views/AdminCMSPage';
import { ContentDashboardPage } from '../../views/ContentDashboardPage';
import { AdminAuthGuard } from '../admin/AdminAuthGuard';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';
import { useRouter } from 'next/navigation';

const ConvertersPage = dynamic<ConvertersPageProps>(
  () => import('../../views/ConvertersPage').then((module) => module.ConvertersPage),
  { loading: () => <RouteLoadingState label="Loading converter workspace…" /> }
);

const ToolDetailPage = dynamic<ToolDetailPageProps>(
  () => import('../../views/ToolDetailPage').then((module) => module.ToolDetailPage),
  { loading: () => <RouteLoadingState label="Loading browser tool…" /> }
);

function RouteLoadingState({ label }: { label: string }) {
  return <div className="min-h-[40vh] flex items-center justify-center text-sm text-slate-500">{label}</div>;
}

function useAppNavigate() {
  const router = useRouter();
  return (route: AppRoute) => {
    const path = routeToPath(route);
    router.push(path);
    window.scrollTo(0, 0);
  };
}

export function HowToOpenHubClient() {
  const navigate = useAppNavigate();
  return <HowToOpenHubPage onNavigate={navigate} />;
}

export function HowToOpenDetailClient({ ext }: { ext: string }) {
  const navigate = useAppNavigate();
  return <HowToOpenPage ext={ext} onNavigate={navigate} />;
}

export function ConvertersClient({ converterId }: { converterId?: string }) {
  const navigate = useAppNavigate();
  return <ConvertersPage onNavigate={navigate} selectedConverterId={converterId} />;
}

export function CompareHubClient() {
  const navigate = useAppNavigate();
  return <CompareHubPage onNavigate={navigate} />;
}

export function ComparisonDetailClient({ slug }: { slug: string }) {
  const navigate = useAppNavigate();
  return <ComparisonPage slug={slug} onNavigate={navigate} />;
}

export function CategoryDetailClient({ id }: { id: string }) {
  const navigate = useAppNavigate();
  return <CategoryPage onNavigate={navigate} categoryId={id} />;
}

export function GuidesClient({ guideId }: { guideId?: string }) {
  const navigate = useAppNavigate();
  return <GuidesPage onNavigate={navigate} selectedGuideId={guideId} />;
}

export function TroubleshootHubClient() {
  const navigate = useAppNavigate();
  return <TroubleshootHubPage onNavigate={navigate} />;
}

export function TroubleshootDetailClient({ id }: { id: string }) {
  const navigate = useAppNavigate();
  return <TroubleshootGuidePage slug={id} onNavigate={navigate} />;
}

export function TechnicalHubClient() {
  const navigate = useAppNavigate();
  return <TechnicalHubPage onNavigate={navigate} />;
}

export function TechnicalDetailClient({ slug }: { slug: string }) {
  const navigate = useAppNavigate();
  return <TechnicalGuidePage slug={slug} onNavigate={navigate} />;
}

export function ToolsHubClient() {
  const navigate = useAppNavigate();
  return <ToolsPage onNavigate={navigate} />;
}

export function ToolDetailClient({ slug }: { slug: string }) {
  const navigate = useAppNavigate();
  return <ToolDetailPage toolSlug={slug} onNavigate={navigate} />;
}

// Next.js-only adapters for the routes that still use interactive view modules.
// Keeping these here makes the client boundary explicit and prevents App Router
// pages from depending on the legacy runtime adapter.
export function AboutRouteClient() { return <AboutPage onNavigate={useAppNavigate()} />; }
export function ContactRouteClient() { return <ContactPage onNavigate={useAppNavigate()} />; }
export function EditorialStandardsRouteClient() { return <EditorialStandardsPage onNavigate={useAppNavigate()} />; }
export function AuthorsRouteClient({ authorId }: { authorId?: string }) { return <AuthorsPage onNavigate={useAppNavigate()} selectedAuthorId={authorId} />; }
export function WorkflowRouteClient({ workflowId }: { workflowId?: string }) { return <WorkflowPage onNavigate={useAppNavigate()} initialWorkflowId={workflowId} />; }
export function AssistantRouteClient() { return <AssistantPage onNavigate={useAppNavigate()} />; }
export function SitemapRouteClient() { return <SeoAuditPage onNavigate={useAppNavigate()} />; }
export function BlogRouteClient({ postId }: { postId?: string }) { return <BlogPage onNavigate={useAppNavigate()} selectedPostId={postId} />; }
export function MimeCheckerRouteClient({ query }: { query?: string }) { return <MimeCheckerPage onNavigate={useAppNavigate()} initialQuery={query} />; }
export function MimeDetailRouteClient({ slug }: { slug: string }) { return <MimeDetailPage onNavigate={useAppNavigate()} mimeSlug={slug} />; }
export function FileIdentifierRouteClient() { return <FileIdentifierPage onNavigate={useAppNavigate()} />; }
export function MetadataViewerRouteClient() { return <MetadataViewerPage onNavigate={useAppNavigate()} />; }
export function RemoveMetadataRouteClient() { return <RemoveMetadataPage onNavigate={useAppNavigate()} />; }
export function HashGeneratorRouteClient() { return <HashGeneratorPage onNavigate={useAppNavigate()} />; }
export function ChecksumVerifierRouteClient() { return <ChecksumVerifierPage onNavigate={useAppNavigate()} />; }
export function MagicByteDetectorRouteClient() { return <MagicByteDetectorPage onNavigate={useAppNavigate()} />; }
export function RepairRouteClient({ id }: { id?: string }) { return <RepairPage onNavigate={useAppNavigate()} selectedRepairId={id} />; }
export function AdminRouteClient() { const navigate = useAppNavigate(); return <AdminAuthGuard onNavigate={navigate} currentRoute={{ view: 'admin' }}><AdminCMSPage onNavigate={navigate} /></AdminAuthGuard>; }
export function ContentDashboardRouteClient() { const navigate = useAppNavigate(); return <AdminAuthGuard onNavigate={navigate} currentRoute={{ view: 'content-dashboard' }}><ContentDashboardPage onNavigate={navigate} /></AdminAuthGuard>; }
export function FileIdentifierResultRouteClient({ id }: { id: string }) { return <FileIdentifierResultPage onNavigate={useAppNavigate()} reportId={id} />; }
export function MetadataResultRouteClient({ id }: { id: string }) { return <MetadataViewerResultPage onNavigate={useAppNavigate()} reportId={id} />; }
