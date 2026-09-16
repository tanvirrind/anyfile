import { ContentDashboardStats, ContentEntity } from './types';
import { getAllContentEntities } from './contentRegistry';
import { detectOrphanedContent } from './orphanDetectionEngine';
import { computeAllFormatPriorities } from './contentPrioritizationEngine';
import { detectContentGaps } from './contentGapEngine';
import { computeTopicalCoverage, computeClusterCoverageSummary } from './topicalCoverageEngine';
import { auditAllEntitiesQuality } from './contentQualityScoreEngine';
import { detectStaleContent } from './updateEngine';
import { detectDuplicateContent } from './duplicateDetectionEngine';
import { evaluateAllFormatsReadiness } from './expansionGatingEngine';

export const CURRENT_KNOWLEDGE_GRAPH_VERSION = '6.0.0';

export function computeContentDashboardStats(): ContentDashboardStats {
  const all = getAllContentEntities();
  const orphans = detectOrphanedContent();

  const byCluster: Record<string, number> = {};
  const byType: Record<string, number> = {};

  let publishedCount = 0;
  let draftCount = 0;
  let briefCount = 0;
  let reviewCount = 0;
  let needsUpdateCount = 0;
  let archivedCount = 0;
  let missingMetadataCount = 0;
  let missingSchemaCount = 0;

  all.forEach((e) => {
    // Status counters
    if (e.status === 'published') publishedCount++;
    else if (e.status === 'draft') draftCount++;
    else if (e.status === 'brief') briefCount++;
    else if (e.status === 'review') reviewCount++;
    else if (e.status === 'needs_update') needsUpdateCount++;
    else if (e.status === 'archived') archivedCount++;

    // Cluster count
    byCluster[e.clusterId] = (byCluster[e.clusterId] || 0) + 1;
    // Type count
    byType[e.contentType] = (byType[e.contentType] || 0) + 1;

    // Check metadata
    if (!e.seoMeta?.title || !e.seoMeta?.description || !e.seoMeta?.canonical) {
      missingMetadataCount++;
    }

    // Check schema
    if (!e.schemaType) {
      missingSchemaCount++;
    }
  });

  const staleItems = detectStaleContent();

  return {
    totalContent: all.length,
    publishedCount,
    draftCount,
    briefCount,
    reviewCount,
    needsUpdateCount: needsUpdateCount + staleItems.length,
    archivedCount,
    orphanedCount: orphans.length,
    missingMetadataCount,
    missingSchemaCount,
    byCluster,
    byType,
    knowledgeGraphSyncStatus: staleItems.length > 0 ? 'updates_available' : 'synced'
  };
}

export function checkEntitiesNeedingFreshnessReview(): ContentEntity[] {
  const all = getAllContentEntities();
  return all.filter((e) => e.knowledgeGraphVersion !== CURRENT_KNOWLEDGE_GRAPH_VERSION || e.status === 'needs_update');
}

export {
  computeAllFormatPriorities,
  detectContentGaps,
  computeTopicalCoverage,
  computeClusterCoverageSummary,
  auditAllEntitiesQuality,
  detectStaleContent,
  detectDuplicateContent,
  evaluateAllFormatsReadiness
};

