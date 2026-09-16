import { ContentEntity, DuplicateContentWarning } from './types';
import { getAllContentEntities } from './contentRegistry';

/**
 * PHASE 12: DUPLICATE & INTENT CANNIBALIZATION DETECTION ENGINE
 * 
 * Compares titles, outlines, summaries, and search intent across content entities
 * to prevent keyword cannibalization and duplicate page proliferation.
 */

function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['the', 'and', 'for', 'with', 'what', 'how', 'file'].includes(w));
  return new Set(words);
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach((elem) => {
    if (setB.has(elem)) intersection++;
  });
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function detectDuplicateContent(
  candidate?: Partial<ContentEntity>
): DuplicateContentWarning[] {
  const allEntities = getAllContentEntities();
  const warnings: DuplicateContentWarning[] = [];

  const listToCompare = candidate && candidate.title
    ? [{ ...candidate, id: candidate.id || 'candidate-new' } as ContentEntity, ...allEntities]
    : allEntities;

  for (let i = 0; i < listToCompare.length; i++) {
    for (let j = i + 1; j < listToCompare.length; j++) {
      const eA = listToCompare[i];
      const eB = listToCompare[j];

      // Skip comparing against itself
      if (eA.id === eB.id) continue;

      const titleTokensA = tokenize(eA.title || '');
      const titleTokensB = tokenize(eB.title || '');
      const titleSim = calculateJaccardSimilarity(titleTokensA, titleTokensB);

      const summaryTokensA = tokenize(eA.summary || '');
      const summaryTokensB = tokenize(eB.summary || '');
      const summarySim = calculateJaccardSimilarity(summaryTokensA, summaryTokensB);

      const topicSim = eA.primaryTopic && eB.primaryTopic && eA.primaryTopic.toLowerCase() === eB.primaryTopic.toLowerCase();
      const extOverlap = eA.relatedExtensions?.some((ext) => eB.relatedExtensions?.includes(ext));

      const sameContentType = eA.contentType === eB.contentType;

      const duplicateDimensions: DuplicateContentWarning['duplicateDimensions'] = [];
      let totalWeightedScore = 0;

      if (titleSim > 0.5) {
        duplicateDimensions.push('title');
        totalWeightedScore += titleSim * 40;
      }
      if (summarySim > 0.4) {
        duplicateDimensions.push('summary');
        totalWeightedScore += summarySim * 30;
      }
      if (topicSim && sameContentType) {
        duplicateDimensions.push('search_intent');
        totalWeightedScore += 25;
      }
      if (extOverlap && sameContentType) {
        duplicateDimensions.push('target_keywords');
        totalWeightedScore += 15;
      }

      const similarityScore = Math.min(100, Math.round(totalWeightedScore));

      if (similarityScore >= 45) {
        let severity: DuplicateContentWarning['severity'] = 'low';
        let recommendation = '';

        if (similarityScore >= 75) {
          severity = 'high';
          recommendation = `CRITICAL CANNIBALIZATION: High overlap between "${eA.title}" and "${eB.title}". Consolidate into a single authoritative master guide or redirect one slug.`;
        } else if (similarityScore >= 55) {
          severity = 'medium';
          recommendation = `POTENTIAL OVERLAP: Titles or summaries share significant semantic density. Differentiate the H1, search intent, or target audience.`;
        } else {
          severity = 'low';
          recommendation = `Minor topical overlap. Ensure distinct canonical URLs and clear internal cross-links.`;
        }

        warnings.push({
          entityA: { id: eA.id, title: eA.title, slug: eA.slug, contentType: eA.contentType },
          entityB: { id: eB.id, title: eB.title, slug: eB.slug, contentType: eB.contentType },
          similarityScore,
          duplicateDimensions,
          severity,
          recommendation
        });
      }
    }
  }

  return warnings.sort((a, b) => b.similarityScore - a.similarityScore);
}

export function checkCandidateUniqueness(candidate: {
  title: string;
  summary: string;
  contentType: string;
  targetExtension?: string;
}): { isUnique: boolean; conflictWarning?: DuplicateContentWarning } {
  const warnings = detectDuplicateContent(candidate as any);
  const directConflict = warnings.find((w) => w.entityA.id === 'candidate-new' || w.entityB.id === 'candidate-new');

  if (directConflict && directConflict.severity === 'high') {
    return { isUnique: false, conflictWarning: directConflict };
  }
  return { isUnique: true, conflictWarning: directConflict };
}
