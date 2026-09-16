import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { TROUBLESHOOTING_GUIDES } from '../database/troubleshootingData';
import { TECHNICAL_AUTHORITY_GUIDES } from '../database/technicalAuthorityData';
import { getAllContentEntities } from './contentRegistry';
import { FormatPrioritizationScore, PriorityTier } from './types';

/**
 * PHASE 12: CONTENT PRIORITIZATION ENGINE
 * 
 * Computes deterministic multi-factor priority scores for all known file formats
 * without fabricating arbitrary search volume metrics.
 * 
 * Factors (0-100 total score):
 * 1. Format Importance (0-20): Based on real OS ubiquity, popularity score, and cross-platform presence.
 * 2. Existing AnyFileX Tools (0-15): Availability of live converters, analyzers, repairs, and checkers.
 * 3. Knowledge Graph Completeness (0-15): Structured data richness (MIME, Magic bytes, Specs, Apps).
 * 4. User Intent Depth (0-10): Urgent recovery, format conversion, execution danger, or viewer needs.
 * 5. Content Gap (0-15): Unaddressed pillars across the 8 topical vectors.
 * 6. Internal Linking Opportunities (0-10): Cross-linkable related formats, comparisons, and tools.
 * 7. Commercial & Practical Relevance (0-10): High-frequency workflows (e.g. converting iPhone HEIC, repairing PSD).
 * 8. Technical Uniqueness (0-5): Unique compression, container structures, or cryptographic signatures.
 */

export function computeAllFormatPriorities(): FormatPrioritizationScore[] {
  const allEntities = getAllContentEntities();

  return POPULAR_FILE_TYPES.map((format) => {
    const extUpper = format.extension.toUpperCase();
    const extLower = format.extension.toLowerCase();

    // 1. Format Importance (Max 20 pts)
    const rawPopularity = format.popularityScore || 70;
    const osBreadth = format.osSupport
      ? Object.values(format.osSupport).filter(Boolean).length
      : 3;
    const importanceScore = Math.round(
      (rawPopularity / 100) * 14 + (osBreadth / 5) * 6
    );

    // 2. Existing AnyFileX Tools (Max 15 pts)
    const matchingConverters = CONVERTERS_LIST.filter(
      (c) => c.fromExt.toUpperCase() === extUpper || c.toExt.toUpperCase() === extUpper
    );
    const matchingTroubleshoot = TROUBLESHOOTING_GUIDES.filter((t) =>
      t.relatedExtensions.includes(extUpper)
    );
    const hasConverter = matchingConverters.length > 0;
    const hasAnalyzer = true; // AnyFileX client-side analyzer handles all binary inputs
    const hasTroubleshootOrRepair = matchingTroubleshoot.length > 0 || (format.repairTips && format.repairTips.length > 0);
    const hasMimeOrHex = Boolean(format.mimeType && format.magicBytesHex);

    let toolsScore = 0;
    if (hasConverter) toolsScore += 6;
    if (hasAnalyzer) toolsScore += 3;
    if (hasTroubleshootOrRepair) toolsScore += 3;
    if (hasMimeOrHex) toolsScore += 3;
    toolsScore = Math.min(15, toolsScore);

    // 3. Knowledge Graph Completeness (Max 15 pts)
    let kgScore = 0;
    if (format.mimeType) kgScore += 3;
    if (format.magicBytesHex && format.magicBytesHex.trim() !== '') kgScore += 3;
    if (format.popularApps && format.popularApps.length >= 3) kgScore += 3;
    if (format.openingSteps && format.openingSteps.length >= 2) kgScore += 3;
    if (format.faqs && format.faqs.length >= 3) kgScore += 3;
    kgScore = Math.min(15, kgScore);

    // 4. User Intent Depth (Max 10 pts)
    let intentScore = 4;
    if (format.dangerRating === 'High Risk' || format.dangerRating === 'Medium Risk') intentScore += 3;
    if (format.conversions && format.conversions.length >= 2) intentScore += 2;
    if (format.category === 'CAD & 3D' || format.category === 'Medical & Science' || format.category === 'Archives') intentScore += 1;
    intentScore = Math.min(10, intentScore);

    // 5. Content Gap (Max 15 pts)
    // Identify how many published articles currently exist for this extension
    const existingArticles = allEntities.filter((e) =>
      e.relatedExtensions.some((ext) => ext.toUpperCase() === extUpper)
    );
    // Ideal coverage is 4+ articles per major format
    let gapScore = 0;
    if (existingArticles.length === 0) gapScore = 15;
    else if (existingArticles.length === 1) gapScore = 11;
    else if (existingArticles.length === 2) gapScore = 7;
    else if (existingArticles.length === 3) gapScore = 4;
    else gapScore = 1;

    // 6. Internal Linking Opportunities (Max 10 pts)
    const relatedComparisons = (format.conversions || []).map((c) => c.targetExtension);
    const relatedTechGuides = TECHNICAL_AUTHORITY_GUIDES.filter((tg) =>
      tg.relatedExtensions.includes(extUpper)
    );
    let linkScore = 0;
    if (relatedComparisons.length > 0) linkScore += 4;
    if (relatedTechGuides.length > 0) linkScore += 3;
    if (format.relationships?.relatedExtensions && format.relationships.relatedExtensions.length > 0) linkScore += 3;
    linkScore = Math.min(10, linkScore);

    // 7. Commercial & Practical Relevance (Max 10 pts)
    let commercialScore = 3;
    if (['HEIC', 'PDF', 'PSD', 'DOCX', 'DWG', 'WEBP', 'ZIP', '7Z', 'SVG', 'EPUB', 'MOV'].includes(extUpper)) {
      commercialScore = 10;
    } else if (['Images', 'Documents', 'CAD & 3D', 'Archives'].includes(format.category)) {
      commercialScore = 7;
    }

    // 8. Technical Uniqueness (Max 5 pts)
    let techScore = 2;
    if (format.magicBytesHex && format.magicBytesHex.length > 10) techScore += 1;
    if (format.specifications?.licensing) techScore += 1;
    if (format.detailedOverview && format.detailedOverview.length > 150) techScore += 1;
    techScore = Math.min(5, techScore);

    // Compute Total
    const totalScore = Math.min(
      100,
      importanceScore +
        toolsScore +
        kgScore +
        intentScore +
        gapScore +
        linkScore +
        commercialScore +
        techScore
    );

    // Assign Tier
    let tier: PriorityTier = 'Low';
    if (totalScore >= 85) tier = 'Critical';
    else if (totalScore >= 70) tier = 'High';
    else if (totalScore >= 50) tier = 'Medium';

    // Generate Recommended Next Actions
    const recommendedNextActions: string[] = [];
    if (hasConverter && !existingArticles.some((e) => e.contentType === 'conversion-guide')) {
      recommendedNextActions.push(`Generate Conversion Guide for ${extUpper} (Tool exists)`);
    }
    if (!existingArticles.some((e) => e.contentType === 'how-to')) {
      recommendedNextActions.push(`Generate How-to-Open Guide for ${extUpper}`);
    }
    if (relatedComparisons.length > 0 && !existingArticles.some((e) => e.contentType === 'comparison')) {
      recommendedNextActions.push(`Publish format comparison article for ${extUpper}`);
    }
    if (existingArticles.length === 0) {
      recommendedNextActions.push(`Create foundational Format Architecture Guide for ${extUpper}`);
    }
    if (recommendedNextActions.length === 0) {
      recommendedNextActions.push(`Audit existing ${extUpper} cluster for content freshness and CQS quality`);
    }

    return {
      extension: extUpper,
      formatName: format.name,
      category: format.category,
      totalScore,
      tier,
      factorBreakdown: {
        formatImportance: importanceScore,
        existingTools: toolsScore,
        knowledgeGraphCompleteness: kgScore,
        userIntent: intentScore,
        contentGap: gapScore,
        internalLinkingOpportunities: linkScore,
        commercialRelevance: commercialScore,
        technicalUniqueness: techScore
      },
      signals: {
        popularityScore: rawPopularity,
        toolsCount: (hasConverter ? matchingConverters.length : 0) + 1,
        missingPillarsCount: Math.max(0, 5 - existingArticles.length),
        linkedFormatsCount: (format.relationships?.relatedExtensions?.length || 0) + relatedComparisons.length,
        commercialActionType: hasConverter ? 'Conversion & Viewing' : 'Inspection & Repair',
        hasComplexStructure: Boolean(format.magicBytesHex && format.magicBytesHex.length > 12)
      },
      recommendedNextActions
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
}
