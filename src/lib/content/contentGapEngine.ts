import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { TROUBLESHOOTING_GUIDES } from '../database/troubleshootingData';
import { getAllContentEntities } from './contentRegistry';
import { ContentGapItem, PriorityTier } from './types';

/**
 * PHASE 12: CONTENT GAP ENGINE
 * 
 * Scans the entire knowledge graph for high-value missing relationships:
 * 1. Format exists + Tool exists + No conversion guide
 * 2. Format exists + Software compatibility exists + No how-to-open guide
 * 3. Format exists + Comparison relationship exists + No comparison article
 * 4. Format exists + Repair/Risk profile exists + No troubleshooting guide
 */

export function detectContentGaps(): ContentGapItem[] {
  const allEntities = getAllContentEntities();
  const gaps: ContentGapItem[] = [];

  POPULAR_FILE_TYPES.forEach((format) => {
    const extUpper = format.extension.toUpperCase();
    const extLower = format.extension.toLowerCase();

    // Check existing content entities for this extension
    const existingEntities = allEntities.filter((e) =>
      e.relatedExtensions.some((ext) => ext.toUpperCase() === extUpper)
    );

    const hasFormatGuide = existingEntities.some((e) => e.contentType === 'format-guide');
    const hasHowTo = existingEntities.some((e) => e.contentType === 'how-to');
    const hasConversionGuide = existingEntities.some((e) => e.contentType === 'conversion-guide');
    const hasComparisonArticle = existingEntities.some((e) => e.contentType === 'comparison');
    const hasTroubleshooting = existingEntities.some((e) => e.contentType === 'troubleshooting');

    // 1. GAP: Format exists + Converter tool exists + No conversion guide
    const matchingConverters = CONVERTERS_LIST.filter(
      (c) => c.fromExt.toUpperCase() === extUpper || c.toExt.toUpperCase() === extUpper
    );
    if (matchingConverters.length > 0 && !hasConversionGuide) {
      const primaryConv = matchingConverters[0];
      const urgency = Math.min(95, (format.popularityScore || 70) + 15);
      let tier: PriorityTier = urgency >= 85 ? 'Critical' : 'High';

      gaps.push({
        id: `gap-conv-${extLower}`,
        extension: extUpper,
        formatName: format.name,
        category: format.category,
        gapType: 'missing-conversion-guide',
        title: `Missing Conversion Guide: How to Convert .${extUpper} Files`,
        description: `AnyFileX has active converter tools for ${extUpper} (${matchingConverters.map((c) => `${c.fromExt}→${c.toExt}`).join(', ')}), but lacks a dedicated step-by-step conversion guide entity.`,
        prerequisitesMet: {
          formatExists: true,
          toolExists: true,
          softwareExists: Boolean(format.popularApps && format.popularApps.length > 0),
          comparisonTargetExists: false
        },
        urgencyScore: urgency,
        tier,
        recommendedAction: `Generate structured conversion guide for .${extUpper} linking to the live converter tool.`,
        briefParams: {
          targetExt: extUpper,
          contentType: 'conversion-guide',
          suggestedSlug: `how-to-convert-${extLower}-to-${primaryConv.toExt.toLowerCase()}`
        }
      });
    }

    // 2. GAP: Format exists + Software compatibility exists + No how-to-open guide
    if (format.popularApps && format.popularApps.length >= 2 && !hasHowTo) {
      const urgency = Math.min(90, (format.popularityScore || 70) + 10);
      let tier: PriorityTier = urgency >= 85 ? 'Critical' : urgency >= 70 ? 'High' : 'Medium';

      gaps.push({
        id: `gap-howto-${extLower}`,
        extension: extUpper,
        formatName: format.name,
        category: format.category,
        gapType: 'missing-how-to-open',
        title: `Missing How-to-Open Guide: .${extUpper}`,
        description: `Software compatibility data exists for ${format.popularApps.length} apps across Windows, Mac, and Linux, but no dedicated How-to-Open article has been drafted.`,
        prerequisitesMet: {
          formatExists: true,
          toolExists: true,
          softwareExists: true,
          comparisonTargetExists: false
        },
        urgencyScore: urgency,
        tier,
        recommendedAction: `Generate OS-specific opening walkthrough for .${extUpper} referencing ${format.popularApps.map((a) => a.name).slice(0, 3).join(', ')}.`,
        briefParams: {
          targetExt: extUpper,
          contentType: 'how-to',
          suggestedSlug: `how-to-open-${extLower}-file`
        }
      });
    }

    // 3. GAP: Format exists + Comparison relationship exists + No comparison article
    const comparisonTargets = [
      ...(format.conversions || []).map((c) => c.targetExtension),
      ...(format.relationships?.relatedExtensions || [])
    ].filter((target, idx, arr) => target.toUpperCase() !== extUpper && arr.indexOf(target) === idx);

    if (comparisonTargets.length > 0 && !hasComparisonArticle) {
      const targetOpposite = comparisonTargets[0].toUpperCase();
      const urgency = Math.min(88, (format.popularityScore || 70) + 5);
      let tier: PriorityTier = urgency >= 80 ? 'High' : 'Medium';

      gaps.push({
        id: `gap-comp-${extLower}-${targetOpposite.toLowerCase()}`,
        extension: extUpper,
        formatName: format.name,
        category: format.category,
        gapType: 'missing-comparison',
        title: `Missing Comparison: .${extUpper} vs .${targetOpposite}`,
        description: `Direct architectural comparison relationship is mapped in knowledge graph, but no long-form comparative analysis article exists.`,
        prerequisitesMet: {
          formatExists: true,
          toolExists: true,
          softwareExists: true,
          comparisonTargetExists: true
        },
        urgencyScore: urgency,
        tier,
        recommendedAction: `Generate technical benchmark and trade-off comparison between .${extUpper} and .${targetOpposite}.`,
        briefParams: {
          targetExt: extUpper,
          contentType: 'comparison',
          suggestedSlug: `${extLower}-vs-${targetOpposite.toLowerCase()}`
        }
      });
    }

    // 4. GAP: Format has repair tips / danger profile + No troubleshooting guide
    const matchingTroubleshoot = TROUBLESHOOTING_GUIDES.find((t) =>
      t.relatedExtensions.includes(extUpper)
    );
    if (
      !hasTroubleshooting &&
      !matchingTroubleshoot &&
      format.repairTips &&
      format.repairTips.length >= 2
    ) {
      const urgency = Math.min(82, (format.popularityScore || 70));
      let tier: PriorityTier = urgency >= 75 ? 'High' : 'Medium';

      gaps.push({
        id: `gap-troubleshoot-${extLower}`,
        extension: extUpper,
        formatName: format.name,
        category: format.category,
        gapType: 'missing-troubleshooting',
        title: `Missing Diagnostic Guide: Repair & Troubleshoot .${extUpper}`,
        description: `Corrupted file symptoms and recovery steps are defined in the schema, but not yet expanded into a full troubleshooting guide.`,
        prerequisitesMet: {
          formatExists: true,
          toolExists: true,
          softwareExists: true,
          comparisonTargetExists: false
        },
        urgencyScore: urgency,
        tier,
        recommendedAction: `Draft repair guide detailing corruption causes and recovery steps for .${extUpper}.`,
        briefParams: {
          targetExt: extUpper,
          contentType: 'troubleshooting',
          suggestedSlug: `how-to-fix-corrupted-${extLower}-files`
        }
      });
    }

    // 5. GAP: High popularity format + No format guide entity
    if (!hasFormatGuide && (format.popularityScore || 0) >= 80) {
      gaps.push({
        id: `gap-format-${extLower}`,
        extension: extUpper,
        formatName: format.name,
        category: format.category,
        gapType: 'missing-format-guide',
        title: `Missing Core Format Authority Guide: .${extUpper}`,
        description: `Top-tier format (${format.popularityScore}/100 popularity) is missing its core long-form architectural breakdown article in the registry.`,
        prerequisitesMet: {
          formatExists: true,
          toolExists: true,
          softwareExists: true,
          comparisonTargetExists: false
        },
        urgencyScore: (format.popularityScore || 80),
        tier: 'Critical',
        recommendedAction: `Generate foundational architecture and binary structure guide for .${extUpper}.`,
        briefParams: {
          targetExt: extUpper,
          contentType: 'format-guide',
          suggestedSlug: `what-is-a-${extLower}-file`
        }
      });
    }
  });

  return gaps.sort((a, b) => b.urgencyScore - a.urgencyScore);
}
