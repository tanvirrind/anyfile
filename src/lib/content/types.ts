import { AppRoute } from '../../types';

export type ContentType =
  | 'format-guide'
  | 'how-to'
  | 'conversion-guide'
  | 'comparison'
  | 'troubleshooting'
  | 'technical-guide'
  | 'security-guide'
  | 'software-compatibility';

export type ContentStatus =
  | 'idea'
  | 'brief'
  | 'draft'
  | 'review'
  | 'published'
  | 'needs_update'
  | 'archived';

export type SchemaType =
  | 'Article'
  | 'TechArticle'
  | 'HowTo'
  | 'FAQPage'
  | 'BreadcrumbList';

export interface ContentSection {
  heading: string;
  body: string;
  bullets?: string[];
  callout?: string;
  codeSnippet?: string;
  stepNumber?: number;
}

export interface ContentAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface InternalLinkItem {
  targetTitle: string;
  targetUrl: string;
  targetType: 'guide' | 'format' | 'tool' | 'comparison' | 'software' | 'analyzer' | 'hub';
  anchorText: string;
  contextHint: string;
  route?: AppRoute;
}

export interface ContentEntity {
  id: string;
  slug: string;
  title: string;
  h1?: string;
  contentType: ContentType;
  clusterId: string;
  primaryTopic: string;
  searchIntent: 'informational' | 'commercial' | 'navigational' | 'transactional';
  summary: string;
  contentSections: ContentSection[];
  
  // Knowledge Graph Connections
  relatedFormats: string[]; // e.g. ['heic', 'heif']
  relatedExtensions: string[]; // e.g. ['HEIC', 'JPG', 'WEBP']
  relatedTools: string[]; // e.g. ['heic-to-jpg', 'image-compressor', 'file-analyzer']
  relatedSoftware: string[]; // e.g. ['apple-photos', 'copytrans', 'adobe-photoshop']
  relatedGuides: string[]; // slugs or IDs of connected content entities
  relatedComparisons?: string[]; // e.g. ['heic-vs-jpg']

  // Rich metadata & FAQs
  faq: Array<{ question: string; answer: string }>;
  schemaType: SchemaType;
  
  // Editorial Lifecycle
  status: ContentStatus;
  publishedDate?: string;
  updatedDate: string;
  createdAt: string;
  knowledgeGraphVersion: string;

  // SEO & OpenGraph
  seoMeta: {
    title: string;
    description: string;
    canonical: string;
    robots: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    keywords?: string[];
  };

  // Display attributes
  author: ContentAuthor;
  readingTimeMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  targetOS?: ('windows' | 'mac' | 'linux' | 'android' | 'ios')[];
  featured?: boolean;
}

export interface ContentCluster {
  id: string;
  clusterKey: 'cluster-a-formats' | 'cluster-b-how-to-open' | 'cluster-c-conversions' | 'cluster-d-comparisons' | 'cluster-e-troubleshooting' | 'cluster-f-technical' | 'cluster-g-security' | 'cluster-h-software';
  title: string;
  shortName: string;
  description: string;
  contentType: ContentType;
  iconName: string;
  badgeColor: string;
  exampleTopics: string[];
  targetAudience: string;
}

export interface ContentBrief {
  primaryTopic: string;
  targetFormat?: string;
  targetExtension?: string;
  contentType: ContentType;
  clusterId: string;
  searchIntent: 'informational' | 'commercial' | 'navigational' | 'transactional';
  suggestedTitle: string;
  suggestedH1: string;
  suggestedSlug: string;
  outline: Array<{
    heading: string;
    corePointsToCover: string[];
    suggestedAnchorLinks?: string[];
  }>;
  questionsToAnswer: string[];
  relatedEntities: {
    formats: string[];
    extensions: string[];
    software: string[];
    tools: string[];
    comparisons: string[];
  };
  internalLinkOpportunities: InternalLinkItem[];
  relevantAnyFileXTools: Array<{
    toolId: string;
    toolName: string;
    featureHighlight: string;
  }>;
  faqOpportunities: Array<{
    question: string;
    recommendedAnswerPoints: string;
  }>;
  recommendedSchemaType: SchemaType;
  generatedDate: string;
  dataSource: string;
}

export interface ContentDashboardStats {
  totalContent: number;
  publishedCount: number;
  draftCount: number;
  briefCount: number;
  reviewCount: number;
  needsUpdateCount: number;
  archivedCount: number;
  orphanedCount: number;
  missingMetadataCount: number;
  missingSchemaCount: number;
  byCluster: Record<string, number>;
  byType: Record<string, number>;
  knowledgeGraphSyncStatus: 'synced' | 'updates_available';
}

export interface OrphanedContentReport {
  entityId: string;
  slug: string;
  title: string;
  contentType: ContentType;
  missingElements: ('no-incoming-links' | 'no-outgoing-links' | 'no-format' | 'no-tools' | 'no-parent-hub' | 'missing-schema')[];
  recommendedFixes: {
    suggestedHubs: string[];
    suggestedTools: string[];
    suggestedParentArticles: string[];
    suggestedRelatedFormats?: string[];
    suggestedTroubleshootGuides?: string[];
  };
  linkCount: {
    incoming: number;
    outgoing: number;
  };
}

// ==========================================
// PHASE 12: TOPICAL AUTHORITY EXPANSION TYPES
// ==========================================

export type PriorityTier = 'Critical' | 'High' | 'Medium' | 'Low';

export interface FormatPrioritizationScore {
  extension: string;
  formatName: string;
  category: string;
  totalScore: number; // 0 - 100
  tier: PriorityTier;
  factorBreakdown: {
    formatImportance: number; // Max 20
    existingTools: number; // Max 15
    knowledgeGraphCompleteness: number; // Max 15
    userIntent: number; // Max 10
    contentGap: number; // Max 15
    internalLinkingOpportunities: number; // Max 10
    commercialRelevance: number; // Max 10
    technicalUniqueness: number; // Max 5
  };
  signals: {
    popularityScore: number;
    toolsCount: number;
    missingPillarsCount: number;
    linkedFormatsCount: number;
    commercialActionType: string;
    hasComplexStructure: boolean;
  };
  recommendedNextActions: string[];
}

export type TopicalPillarKey =
  | 'format_guide'
  | 'how_to_open'
  | 'conversion'
  | 'comparison'
  | 'troubleshooting'
  | 'security'
  | 'software'
  | 'tool';

export interface FormatTopicalCoverage {
  extension: string;
  formatName: string;
  category: string;
  coveragePercentage: number; // 0 - 100%
  completedPillarsCount: number; // 0 - 8
  pillars: {
    format_guide: { exists: boolean; slug?: string; title?: string; route?: AppRoute };
    how_to_open: { exists: boolean; slug?: string; title?: string; route?: AppRoute };
    conversion: { exists: boolean; routesCount: number; primarySlug?: string; route?: AppRoute };
    comparison: { exists: boolean; comparisonsCount: number; primarySlug?: string; route?: AppRoute };
    troubleshooting: { exists: boolean; guideId?: string; title?: string; route?: AppRoute };
    security: { exists: boolean; slug?: string; title?: string; route?: AppRoute };
    software: { exists: boolean; appsCount: number; appsList?: string[]; route?: AppRoute };
    tool: { exists: boolean; toolTypes: string[]; route?: AppRoute };
  };
  missingPillars: TopicalPillarKey[];
}

export interface ContentGapItem {
  id: string;
  extension: string;
  formatName: string;
  category: string;
  gapType:
    | 'missing-conversion-guide'
    | 'missing-how-to-open'
    | 'missing-comparison'
    | 'missing-format-guide'
    | 'missing-troubleshooting'
    | 'missing-security-spec';
  title: string;
  description: string;
  prerequisitesMet: {
    formatExists: boolean;
    toolExists: boolean;
    softwareExists: boolean;
    comparisonTargetExists: boolean;
  };
  urgencyScore: number; // 0 - 100
  tier: PriorityTier;
  recommendedAction: string;
  briefParams: {
    targetExt: string;
    contentType: ContentType;
    suggestedSlug: string;
  };
}

export interface ContentQualityAudit {
  entityId: string;
  title: string;
  slug: string;
  contentType: ContentType;
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  breakdown: {
    knowledgeGraphCoverage: { score: number; max: 20; details: string[] };
    internalLinkingHealth: { score: number; max: 15; details: string[] };
    toolIntegration: { score: number; max: 15; details: string[] };
    structuredSchema: { score: number; max: 10; details: string[] };
    metadataCompleteness: { score: number; max: 10; details: string[] };
    faqBreadth: { score: number; max: 10; details: string[] };
    technicalAccuracy: { score: number; max: 10; details: string[] };
    uniqueInformation: { score: number; max: 10; details: string[] };
  };
  improvementsChecklist: string[];
}

export interface StaleContentItem {
  entityId: string;
  title: string;
  slug: string;
  contentType: ContentType;
  lastUpdated: string;
  daysSinceUpdate: number;
  triggerReasons: (
    | 'knowledge_graph_version_mismatch'
    | 'software_support_updated'
    | 'new_tools_available'
    | 'stale_review_date'
    | 'format_danger_rating_changed'
  )[];
  description: string;
  suggestedUpdates: string[];
}

export interface DuplicateContentWarning {
  entityA: { id: string; title: string; slug: string; contentType: ContentType };
  entityB: { id: string; title: string; slug: string; contentType: ContentType };
  similarityScore: number; // 0 - 100%
  duplicateDimensions: ('title' | 'outline' | 'summary' | 'search_intent' | 'target_keywords')[];
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface ExpansionGatingResult {
  extension: string;
  formatName: string;
  category: string;
  isExpansionReady: boolean;
  readinessScore: number; // 0 - 100
  tier: 'Ready for Production' | 'Needs Core Data' | 'Incomplete Schema';
  minimumCriteria: {
    hasExtension: boolean;
    hasName: boolean;
    hasDescription: boolean;
    hasMimeType: boolean;
    hasPopularApps: boolean;
    hasAtLeastOneRelationship: boolean;
  };
  deepDataCriteria: {
    hasMagicBytes: boolean;
    hasRepairTips: boolean;
    hasOpeningSteps: boolean;
    hasDetailedOverview: boolean;
    hasSpecifications: boolean;
  };
  missingRequiredFields: string[];
  safeToGeneratePillars: TopicalPillarKey[];
  blockedPillars: TopicalPillarKey[];
}

