import { ContentEntity, OrphanedContentReport } from './types';
import { getAllContentEntities, saveContentEntity } from './contentRegistry';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { TROUBLESHOOTING_GUIDES } from '../database/troubleshootingData';

export function detectOrphanedContent(): OrphanedContentReport[] {
  const allEntities = getAllContentEntities();
  const reports: OrphanedContentReport[] = [];

  // Build an incoming link index
  const incomingLinkCount: Record<string, number> = {};
  allEntities.forEach((e) => {
    incomingLinkCount[e.id] = 0;
    incomingLinkCount[e.slug] = 0;
  });

  allEntities.forEach((source) => {
    source.relatedGuides?.forEach((targetRef) => {
      if (incomingLinkCount[targetRef] !== undefined) {
        incomingLinkCount[targetRef]++;
      }
    });
  });

  allEntities.forEach((entity) => {
    const missing: OrphanedContentReport['missingElements'] = [];

    const outgoing = entity.relatedGuides?.length || 0;
    const incoming = (incomingLinkCount[entity.id] || 0) + (incomingLinkCount[entity.slug] || 0);

    // Check outgoing links
    if (outgoing === 0) {
      missing.push('no-outgoing-links');
    }

    // Check incoming links
    if (incoming === 0 && allEntities.length > 1) {
      missing.push('no-incoming-links');
    }

    // Check related formats
    if (!entity.relatedFormats || entity.relatedFormats.length === 0) {
      missing.push('no-format');
    }

    // Check related tools
    if (!entity.relatedTools || entity.relatedTools.length === 0) {
      missing.push('no-tools');
    }

    // Check schema
    if (!entity.schemaType) {
      missing.push('missing-schema');
    }

    // Check parent hub
    if (!entity.clusterId) {
      missing.push('no-parent-hub');
    }

    if (missing.length > 0) {
      const primaryExt = entity.relatedExtensions?.[0]?.toUpperCase() || 'GENERAL';
      const primaryExtLower = primaryExt.toLowerCase();

      // Recommend parent hub
      const suggestedHubs = [
        `/category/${entity.clusterId.replace('cluster-', '')}`,
        `/format/${primaryExtLower}`,
        `/how-to-open`
      ];

      // Recommend tools
      const matchingConverters = CONVERTERS_LIST.filter(
        (c) => c.fromExt.toUpperCase() === primaryExt || c.toExt.toUpperCase() === primaryExt
      );
      const suggestedTools = [
        'file-analyzer',
        matchingConverters[0]?.id || 'mime-checker'
      ];

      // Recommend parent & peer articles
      const suggestedParentArticles = allEntities
        .filter(
          (other) =>
            other.id !== entity.id &&
            (other.clusterId === entity.clusterId ||
              other.relatedExtensions.some((e) => entity.relatedExtensions?.includes(e)))
        )
        .slice(0, 3)
        .map((other) => other.title);

      // Recommend troubleshooting guide
      const matchingTrouble = TROUBLESHOOTING_GUIDES.find((t) =>
        t.relatedExtensions.includes(primaryExt)
      );

      reports.push({
        entityId: entity.id,
        slug: entity.slug,
        title: entity.title,
        contentType: entity.contentType,
        missingElements: missing,
        linkCount: {
          incoming,
          outgoing
        },
        recommendedFixes: {
          suggestedHubs,
          suggestedTools,
          suggestedParentArticles,
          suggestedRelatedFormats: [primaryExt, 'JPG', 'PDF'].filter((e) => e !== primaryExt),
          suggestedTroubleshootGuides: matchingTrouble ? [matchingTrouble.title] : [`Repair .${primaryExt} Header`]
        }
      });
    }
  });

  return reports;
}

export function autoFixEntityLinks(entityId: string): boolean {
  const all = getAllContentEntities();
  const target = all.find((e) => e.id === entityId);
  if (!target) return false;

  const ext = target.relatedExtensions[0] || 'JPG';

  // Attach default tools if missing
  if (!target.relatedTools || target.relatedTools.length === 0) {
    const matchingConv = CONVERTERS_LIST.find((c) => c.fromExt.toUpperCase() === ext.toUpperCase());
    target.relatedTools = ['file-analyzer', matchingConv ? matchingConv.id : 'mime-checker'];
  }

  // Attach related formats if missing
  if (!target.relatedFormats || target.relatedFormats.length === 0) {
    target.relatedFormats = [ext.toLowerCase(), 'jpg', 'png', 'pdf'].slice(0, 3);
  }

  // Attach related guides if missing
  if (!target.relatedGuides || target.relatedGuides.length === 0) {
    const peers = all.filter((o) => o.id !== target.id && o.relatedExtensions.includes(ext)).slice(0, 3);
    if (peers.length > 0) {
      target.relatedGuides = peers.map((p) => p.slug);
    } else {
      const fallbackPeers = all.filter((o) => o.id !== target.id).slice(0, 2);
      target.relatedGuides = fallbackPeers.map((p) => p.slug);
    }
  }

  // Save
  target.updatedDate = new Date().toISOString().split('T')[0];
  saveContentEntity(target);
  return true;
}
