import { FileTypeInfo } from '../../types';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { ExpansionGatingResult, TopicalPillarKey } from './types';

/**
 * PHASE 12: CONTROLLED EXPANSION & PROGRAMMATIC SEO GATING ENGINE
 * 
 * Enforces strict data-completeness prerequisites before allowing content generation.
 * Prevents thin boilerplate and protects against generic AI content farm patterns.
 */

export function evaluateFormatExpansionReadiness(format: FileTypeInfo): ExpansionGatingResult {
  const missingRequiredFields: string[] = [];

  // Minimum Core Criteria
  const hasExtension = Boolean(format.extension && format.extension.trim().length >= 2);
  const hasName = Boolean(format.name && format.name.trim().length >= 3);
  const hasDescription = Boolean(format.description && format.description.trim().length >= 20);
  const hasMimeType = Boolean(format.mimeType && format.mimeType.includes('/'));
  const hasPopularApps = Boolean(format.popularApps && format.popularApps.length >= 1);
  const hasAtLeastOneRelationship = Boolean(
    (format.conversions && format.conversions.length > 0) ||
    (format.relationships?.relatedExtensions && format.relationships.relatedExtensions.length > 0) ||
    (format.relationships?.parentFormat)
  );

  if (!hasExtension) missingRequiredFields.push('Extension code');
  if (!hasName) missingRequiredFields.push('Official format name');
  if (!hasDescription) missingRequiredFields.push('Standard description (min 20 chars)');
  if (!hasMimeType) missingRequiredFields.push('Valid IANA MIME type');
  if (!hasPopularApps) missingRequiredFields.push('At least 1 compatible software application');
  if (!hasAtLeastOneRelationship) missingRequiredFields.push('At least 1 mapped relationship (conversion or sibling format)');

  // Deep Data Criteria
  const hasMagicBytes = Boolean(format.magicBytesHex && format.magicBytesHex.trim().length >= 4);
  const hasRepairTips = Boolean(format.repairTips && format.repairTips.length >= 1);
  const hasOpeningSteps = Boolean(format.openingSteps && format.openingSteps.length >= 1);
  const hasDetailedOverview = Boolean(format.detailedOverview && format.detailedOverview.length >= 80);
  const hasSpecifications = Boolean(format.specifications?.developer || format.developer);

  // Calculate Readiness Score (0-100)
  let coreScore = 0;
  if (hasExtension) coreScore += 10;
  if (hasName) coreScore += 10;
  if (hasDescription) coreScore += 10;
  if (hasMimeType) coreScore += 10;
  if (hasPopularApps) coreScore += 10;
  if (hasAtLeastOneRelationship) coreScore += 10;

  let deepScore = 0;
  if (hasMagicBytes) deepScore += 10;
  if (hasRepairTips) deepScore += 8;
  if (hasOpeningSteps) deepScore += 8;
  if (hasDetailedOverview) deepScore += 7;
  if (hasSpecifications) deepScore += 7;

  const readinessScore = coreScore + deepScore;

  // Determine Gate Status & Tier
  const isExpansionReady = missingRequiredFields.length === 0;
  let tier: ExpansionGatingResult['tier'] = 'Incomplete Schema';
  if (readinessScore >= 80 && isExpansionReady) {
    tier = 'Ready for Production';
  } else if (isExpansionReady) {
    tier = 'Needs Core Data';
  }

  // Determine Safe vs Blocked Pillars
  const safeToGeneratePillars: TopicalPillarKey[] = [];
  const blockedPillars: TopicalPillarKey[] = [];

  if (isExpansionReady && hasDetailedOverview) {
    safeToGeneratePillars.push('format_guide');
  } else {
    blockedPillars.push('format_guide');
  }

  if (hasPopularApps && hasOpeningSteps) {
    safeToGeneratePillars.push('how_to_open');
    safeToGeneratePillars.push('software');
  } else {
    blockedPillars.push('how_to_open');
    blockedPillars.push('software');
  }

  if (format.conversions && format.conversions.length > 0) {
    safeToGeneratePillars.push('conversion');
  } else {
    blockedPillars.push('conversion');
  }

  if (hasAtLeastOneRelationship) {
    safeToGeneratePillars.push('comparison');
  } else {
    blockedPillars.push('comparison');
  }

  if (hasRepairTips) {
    safeToGeneratePillars.push('troubleshooting');
  } else {
    blockedPillars.push('troubleshooting');
  }

  if (hasMagicBytes && hasMimeType) {
    safeToGeneratePillars.push('security');
  } else {
    blockedPillars.push('security');
  }

  safeToGeneratePillars.push('tool');

  return {
    extension: format.extension.toUpperCase(),
    formatName: format.name,
    category: format.category,
    isExpansionReady,
    readinessScore,
    tier,
    minimumCriteria: {
      hasExtension,
      hasName,
      hasDescription,
      hasMimeType,
      hasPopularApps,
      hasAtLeastOneRelationship
    },
    deepDataCriteria: {
      hasMagicBytes,
      hasRepairTips,
      hasOpeningSteps,
      hasDetailedOverview,
      hasSpecifications
    },
    missingRequiredFields,
    safeToGeneratePillars,
    blockedPillars
  };
}

export function evaluateAllFormatsReadiness(): ExpansionGatingResult[] {
  return POPULAR_FILE_TYPES.map(evaluateFormatExpansionReadiness).sort(
    (a, b) => b.readinessScore - a.readinessScore
  );
}
