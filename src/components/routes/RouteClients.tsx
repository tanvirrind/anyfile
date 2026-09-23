'use client';

import React from 'react';
import { HowToOpenHubPage } from '../../views/HowToOpenHubPage';
import { HowToOpenPage } from '../../views/HowToOpenPage';
import { ConvertersPage } from '../../views/ConvertersPage';
import { CompareHubPage } from '../../views/CompareHubPage';
import { ComparisonPage } from '../../views/ComparisonPage';
import { CategoryPage } from '../../views/CategoryPage';
import { GuidesPage } from '../../views/GuidesPage';
import { TroubleshootHubPage } from '../../views/TroubleshootHubPage';
import { TroubleshootGuidePage } from '../../views/TroubleshootGuidePage';
import { TechnicalHubPage } from '../../views/TechnicalHubPage';
import { TechnicalGuidePage } from '../../views/TechnicalGuidePage';
import { ToolsPage } from '../../views/ToolsPage';
import { ToolDetailPage } from '../../views/ToolDetailPage';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';

function useAppNavigate() {
  return (route: AppRoute) => {
    const path = routeToPath(route);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    }
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
