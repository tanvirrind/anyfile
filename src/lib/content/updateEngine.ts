import { ContentEntity, StaleContentItem } from './types';
import { getAllContentEntities, updateContentStatus } from './contentRegistry';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { CONVERTERS_LIST } from '../../data/convertersData';

export const LATEST_KG_SPEC_VERSION = '6.0.0';

/**
 * PHASE 12: CONTENT UPDATE ENGINE
 * 
 * Monitors synchronization between the underlying structured database and published content.
 * Flags outdated content for human review without destructive auto-overwrites.
 */

export function detectStaleContent(): StaleContentItem[] {
  const allEntities = getAllContentEntities();
  const staleItems: StaleContentItem[] = [];

  const now = new Date();

  allEntities.forEach((entity) => {
    const triggerReasons: StaleContentItem['triggerReasons'] = [];
    const suggestedUpdates: string[] = [];

    // Find linked format in DB
    const primaryExt = entity.relatedExtensions?.[0]?.toUpperCase();
    const dbFormat = primaryExt
      ? POPULAR_FILE_TYPES.find((f) => f.extension.toUpperCase() === primaryExt)
      : null;

    // 1. Knowledge Graph Version Mismatch
    if (entity.knowledgeGraphVersion !== LATEST_KG_SPEC_VERSION) {
      triggerReasons.push('knowledge_graph_version_mismatch');
      suggestedUpdates.push(
        `Update entity schema version from ${entity.knowledgeGraphVersion} to ${LATEST_KG_SPEC_VERSION} (new fields available).`
      );
    }

    // 2. Software Support Updated
    if (dbFormat && dbFormat.popularApps) {
      const dbAppSlugs = dbFormat.popularApps.map((a) => a.slug || a.name.toLowerCase());
      const entityAppSlugs = entity.relatedSoftware || [];
      const missingApps = dbAppSlugs.filter((s) => !entityAppSlugs.includes(s));
      if (missingApps.length > 0) {
        triggerReasons.push('software_support_updated');
        suggestedUpdates.push(
          `Knowledge graph has new verified software entries (${missingApps.slice(0, 2).join(', ')}) not linked in article.`
        );
      }
    }

    // 3. New Tools Available
    if (primaryExt) {
      const matchingConverters = CONVERTERS_LIST.filter(
        (c) => c.fromExt.toUpperCase() === primaryExt || c.toExt.toUpperCase() === primaryExt
      );
      const entityTools = entity.relatedTools || [];
      const missingTools = matchingConverters
        .map((c) => c.id)
        .filter((s) => !entityTools.includes(s));

      if (missingTools.length > 0) {
        triggerReasons.push('new_tools_available');
        suggestedUpdates.push(
          `New AnyFileX converters available (${missingTools.slice(0, 2).join(', ')}). Add tool launch cards to article.`
        );
      }
    }

    // 4. Stale Review Date (> 180 days)
    const updatedDate = new Date(entity.updatedDate || entity.createdAt);
    const diffDays = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays > 180) {
      triggerReasons.push('stale_review_date');
      suggestedUpdates.push(
        `Article was last verified ${diffDays} days ago. Perform annual technical accuracy check.`
      );
    }

    // 5. Danger Rating Changed
    if (dbFormat && dbFormat.dangerRating === 'High Risk' && entity.contentType === 'format-guide') {
      const mentionsRisk = entity.contentSections.some(
        (s) => s.heading.toLowerCase().includes('security') || s.heading.toLowerCase().includes('risk')
      );
      if (!mentionsRisk) {
        triggerReasons.push('format_danger_rating_changed');
        suggestedUpdates.push(
          `Format is flagged as High Risk in database, but article lacks a dedicated Security & Threat Analysis section.`
        );
      }
    }

    if (triggerReasons.length > 0) {
      staleItems.push({
        entityId: entity.id,
        title: entity.title,
        slug: entity.slug,
        contentType: entity.contentType,
        lastUpdated: entity.updatedDate || entity.createdAt,
        daysSinceUpdate: diffDays,
        triggerReasons,
        description: `Content requires editorial review due to ${triggerReasons.length} detected system/knowledge graph updates.`,
        suggestedUpdates
      });
    }
  });

  return staleItems;
}

export function flagEntityForReview(entityId: string): boolean {
  updateContentStatus(entityId, 'needs_update');
  return true;
}

export function markEntityFresh(entityId: string): boolean {
  const all = getAllContentEntities();
  const target = all.find((e) => e.id === entityId);
  if (!target) return false;

  target.knowledgeGraphVersion = LATEST_KG_SPEC_VERSION;
  target.updatedDate = new Date().toISOString().split('T')[0];
  target.status = 'published';
  return true;
}
