/**
 * Legacy Comparison Generator (Deprecated)
 * 
 * Re-routes and delegates all comparison generation to the authoritative
 * Phase 9 comparison engine in `../guides/comparisonGuideEngine.ts`.
 */

import { getComparisonGuide, ComparisonGuideData } from '../guides/comparisonGuideEngine';
import { FAQItem } from './faqGenerator';
import { FileTypeInfo } from '../../types';

export interface ComparisonInfo {
  ext1: FileTypeInfo;
  ext2: FileTypeInfo;
  slug: string;
  title: string;
  metaDescription: string;
  summary: string;
  winnerOverall: string;
  tableMetrics: {
    feature: string;
    ext1Val: string;
    ext2Val: string;
    winner: 'ext1' | 'ext2' | 'tie';
  }[];
  detailedHeadToHead: {
    heading: string;
    content: string;
  }[];
  faqs: FAQItem[];
  schemaData: object;
}

export function getOrGenerateComparison(slug: string): ComparisonInfo {
  const guide: ComparisonGuideData = getComparisonGuide(slug);

  return {
    ext1: guide.ext1Info,
    ext2: guide.ext2Info,
    slug: guide.slug,
    title: guide.title,
    metaDescription: guide.metaDescription,
    summary: guide.overview,
    winnerOverall: guide.balancedConclusion,
    tableMetrics: guide.tableRows.map((r) => ({
      feature: r.feature,
      ext1Val: r.ext1Value,
      ext2Val: r.ext2Value,
      winner: r.advantage,
    })),
    detailedHeadToHead: [
      { heading: 'Quality & Fidelity', content: `${guide.quality.ext1Text} vs ${guide.quality.ext2Text}. Verdict: ${guide.quality.verdict}` },
      { heading: 'Compression & Storage', content: `${guide.compression.ext1Text} vs ${guide.compression.ext2Text}. Verdict: ${guide.compression.verdict}` },
      { heading: 'Platform Compatibility', content: `${guide.compatibility.ext1Text} vs ${guide.compatibility.ext2Text}. Verdict: ${guide.compatibility.verdict}` },
    ],
    faqs: guide.faqs,
    schemaData: guide.schemaData,
  };
}
