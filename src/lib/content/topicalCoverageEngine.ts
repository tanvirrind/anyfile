import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { TROUBLESHOOTING_GUIDES } from '../database/troubleshootingData';
import { TECHNICAL_AUTHORITY_GUIDES } from '../database/technicalAuthorityData';
import { getAllContentEntities } from './contentRegistry';
import { FormatTopicalCoverage, TopicalPillarKey } from './types';

/**
 * PHASE 12: TOPICAL COVERAGE MAP ENGINE
 * 
 * Maps every known format across the 8 structural topical pillars:
 * 1. Format Guide (/format/:ext or /guide/:slug)
 * 2. How to Open (/how-to-open/:ext)
 * 3. Conversion (/convert/:from-to-:to)
 * 4. Comparison (/compare/:a-vs-:b)
 * 5. Troubleshooting (/troubleshoot/:id or /repair/:id)
 * 6. Security & Authority (/security/:slug)
 * 7. Software Compatibility (/software/:slug or apps list)
 * 8. Interactive Tool (/tools/:id or /analyzer)
 */

export function computeTopicalCoverage(): FormatTopicalCoverage[] {
  const allEntities = getAllContentEntities();

  return POPULAR_FILE_TYPES.map((format) => {
    const extUpper = format.extension.toUpperCase();
    const extLower = format.extension.toLowerCase();

    // 1. Format Guide Pillar
    const formatGuideEntity = allEntities.find(
      (e) =>
        e.contentType === 'format-guide' &&
        e.relatedExtensions.some((ext) => ext.toUpperCase() === extUpper)
    );
    const hasFormatGuide = Boolean(formatGuideEntity || format.description);

    // 2. How to Open Pillar
    const howToEntity = allEntities.find(
      (e) =>
        e.contentType === 'how-to' &&
        e.relatedExtensions.some((ext) => ext.toUpperCase() === extUpper)
    );
    const hasHowTo = Boolean(howToEntity || (format.openingSteps && format.openingSteps.length > 0));

    // 3. Conversion Pillar
    const convEntity = allEntities.find(
      (e) =>
        e.contentType === 'conversion-guide' &&
        e.relatedExtensions.some((ext) => ext.toUpperCase() === extUpper)
    );
    const matchingConverters = CONVERTERS_LIST.filter(
      (c) => c.fromExt.toUpperCase() === extUpper || c.toExt.toUpperCase() === extUpper
    );
    const hasConversion = Boolean(
      convEntity || matchingConverters.length > 0 || (format.conversions && format.conversions.length > 0)
    );

    // 4. Comparison Pillar
    const compEntity = allEntities.find(
      (e) =>
        e.contentType === 'comparison' &&
        e.relatedExtensions.some((ext) => ext.toUpperCase() === extUpper)
    );
    const hasComparison = Boolean(
      compEntity || (format.conversions && format.conversions.length > 0) || (format.relationships?.relatedExtensions && format.relationships.relatedExtensions.length > 0)
    );

    // 5. Troubleshooting Pillar
    const troubleshootEntity = allEntities.find(
      (e) =>
        e.contentType === 'troubleshooting' &&
        e.relatedExtensions.some((ext) => ext.toUpperCase() === extUpper)
    );
    const matchingTroubleshoot = TROUBLESHOOTING_GUIDES.find((t) =>
      t.relatedExtensions.includes(extUpper)
    );
    const hasTroubleshooting = Boolean(
      troubleshootEntity || matchingTroubleshoot || (format.repairTips && format.repairTips.length > 0)
    );

    // 6. Security / Technical Authority Pillar
    const techEntity = allEntities.find(
      (e) =>
        (e.contentType === 'technical-guide' || e.contentType === 'security-guide') &&
        e.relatedExtensions.some((ext) => ext.toUpperCase() === extUpper)
    );
    const matchingTechGuide = TECHNICAL_AUTHORITY_GUIDES.find((tg) =>
      tg.relatedExtensions.includes(extUpper)
    );
    const hasSecurity = Boolean(techEntity || matchingTechGuide || format.dangerExplanation);

    // 7. Software Compatibility Pillar
    const hasSoftware = Boolean(format.popularApps && format.popularApps.length > 0);

    // 8. Tool Pillar
    const hasTool = true; // Universal client-side analyzer + converters/metadata tools

    // Build Pillars Object
    const comparisonTarget = format.conversions?.[0]?.targetExtension || format.relationships?.relatedExtensions?.[0] || 'JPG';
    const compSlug = compEntity?.slug || `${extLower}-vs-${comparisonTarget.toLowerCase()}`;

    const pillars = {
      format_guide: {
        exists: hasFormatGuide,
        slug: formatGuideEntity?.slug || `what-is-a-${extLower}-file`,
        title: formatGuideEntity?.title || `What Is a .${extUpper} File?`,
        route: { view: 'format-guide', format: extLower } as const
      },
      how_to_open: {
        exists: hasHowTo,
        slug: howToEntity?.slug || `how-to-open-${extLower}-file`,
        title: howToEntity?.title || `How to Open .${extUpper} Files`,
        route: { view: 'how-to-open', ext: extLower } as const
      },
      conversion: {
        exists: hasConversion,
        routesCount: matchingConverters.length || (format.conversions?.length || 0),
        primarySlug: matchingConverters[0]?.id || (format.conversions?.[0]?.converterSlug),
        route: { view: 'converters' } as const
      },
      comparison: {
        exists: hasComparison,
        comparisonsCount: (format.conversions?.length || 0) + (format.relationships?.relatedExtensions?.length || 0),
        primarySlug: compSlug,
        route: { view: 'compare-hub' } as const
      },
      troubleshooting: {
        exists: hasTroubleshooting,
        guideId: matchingTroubleshoot?.id,
        title: matchingTroubleshoot?.title || `Fix Corrupt .${extUpper} Files`,
        route: matchingTroubleshoot
          ? ({ view: 'troubleshoot-guide', slug: matchingTroubleshoot.id } as const)
          : ({ view: 'troubleshoot-hub' } as const)
      },
      security: {
        exists: hasSecurity,
        slug: matchingTechGuide?.slug,
        title: matchingTechGuide?.title || `${extUpper} Security & Signature Analysis`,
        route: matchingTechGuide
          ? ({ view: 'technical-guide', slug: matchingTechGuide.slug } as const)
          : ({ view: 'security-hub' } as const)
      },
      software: {
        exists: hasSoftware,
        appsCount: format.popularApps?.length || 0,
        appsList: format.popularApps?.map((a) => a.name) || [],
        route: { view: 'software' } as const
      },
      tool: {
        exists: hasTool,
        toolTypes: [
          'Binary Analyzer',
          matchingConverters.length > 0 ? 'Format Converter' : '',
          format.magicBytesHex ? 'Magic Byte Detector' : '',
          'Metadata Inspector'
        ].filter(Boolean),
        route: { view: 'file-analyzer' } as const
      }
    };

    // Calculate Missing Pillars
    const missingPillars: TopicalPillarKey[] = [];
    if (!pillars.format_guide.exists) missingPillars.push('format_guide');
    if (!pillars.how_to_open.exists) missingPillars.push('how_to_open');
    if (!pillars.conversion.exists) missingPillars.push('conversion');
    if (!pillars.comparison.exists) missingPillars.push('comparison');
    if (!pillars.troubleshooting.exists) missingPillars.push('troubleshooting');
    if (!pillars.security.exists) missingPillars.push('security');
    if (!pillars.software.exists) missingPillars.push('software');
    if (!pillars.tool.exists) missingPillars.push('tool');

    const completedPillarsCount = 8 - missingPillars.length;
    const coveragePercentage = Math.round((completedPillarsCount / 8) * 100);

    return {
      extension: extUpper,
      formatName: format.name,
      category: format.category,
      coveragePercentage,
      completedPillarsCount,
      pillars,
      missingPillars
    };
  }).sort((a, b) => b.coveragePercentage - a.coveragePercentage);
}

export function computeClusterCoverageSummary() {
  const allCoverage = computeTopicalCoverage();
  const clusters: Record<
    string,
    { totalFormats: number; avgCoverage: number; fullyCoveredCount: number }
  > = {};

  allCoverage.forEach((item) => {
    if (!clusters[item.category]) {
      clusters[item.category] = {
        totalFormats: 0,
        avgCoverage: 0,
        fullyCoveredCount: 0
      };
    }
    clusters[item.category].totalFormats += 1;
    clusters[item.category].avgCoverage += item.coveragePercentage;
    if (item.coveragePercentage === 100) {
      clusters[item.category].fullyCoveredCount += 1;
    }
  });

  return Object.entries(clusters).map(([category, stats]) => ({
    category,
    totalFormats: stats.totalFormats,
    avgCoverage: Math.round(stats.avgCoverage / stats.totalFormats),
    fullyCoveredCount: stats.fullyCoveredCount
  }));
}
