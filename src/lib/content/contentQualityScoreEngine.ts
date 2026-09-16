import { ContentEntity, ContentQualityAudit } from './types';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { getAllContentEntities } from './contentRegistry';

/**
 * PHASE 12: CONTENT QUALITY SCORE (CQS) ENGINE
 * 
 * Evaluates real internal structural quality and completeness (0-100 pts)
 * rather than arbitrary SEO rankings.
 * 
 * Dimensions:
 * 1. Knowledge Graph Coverage (20 pts): Rich fields, specs, MIME, magic bytes, app references.
 * 2. Internal Links Health (15 pts): Inbound/outbound links, parent hub connection, cross-entity bridges.
 * 3. Tool Integration (15 pts): Direct interactive launcher, client-side diagnostics, or converter bridge.
 * 4. Structured JSON-LD Schema (10 pts): Valid schemaType (TechArticle, HowTo, FAQPage, Article).
 * 5. Metadata Completeness (10 pts): Title length, description length, canonical URL, OG tags.
 * 6. FAQ Breadth & Depth (10 pts): 3+ domain-specific questions with structured answers.
 * 7. Technical Accuracy Review (10 pts): Hex signatures, offset tables, standards citations (RFC/ISO).
 * 8. Unique Information & Intent Coverage (10 pts): Substantive sections, non-boilerplate content.
 */

export function auditEntityQuality(entity: ContentEntity): ContentQualityAudit {
  const improvementsChecklist: string[] = [];

  // Find linked format in DB if any
  const primaryExt = entity.relatedExtensions?.[0]?.toUpperCase();
  const dbFormat = primaryExt
    ? POPULAR_FILE_TYPES.find((f) => f.extension.toUpperCase() === primaryExt)
    : null;

  // 1. Knowledge Graph Coverage (Max 20)
  let kgScore = 0;
  const kgDetails: string[] = [];
  if (entity.relatedExtensions && entity.relatedExtensions.length > 0) {
    kgScore += 5;
    kgDetails.push('Mapped to valid file extensions');
  } else {
    improvementsChecklist.push('Link at least one valid file extension in relatedExtensions');
  }

  if (entity.relatedSoftware && entity.relatedSoftware.length >= 2) {
    kgScore += 5;
    kgDetails.push(`${entity.relatedSoftware.length} compatible software apps referenced`);
  } else {
    improvementsChecklist.push('Add at least 2 verified software applications to relatedSoftware');
  }

  if (entity.relatedFormats && entity.relatedFormats.length >= 2) {
    kgScore += 5;
    kgDetails.push('Connected to related sibling formats in cluster');
  } else {
    improvementsChecklist.push('Connect at least 2 sibling formats in relatedFormats');
  }

  if (dbFormat?.magicBytesHex || dbFormat?.mimeType) {
    kgScore += 5;
    kgDetails.push('Backed by verified binary header or MIME type in schema');
  } else {
    improvementsChecklist.push('Verify underlying binary magic bytes or MIME type in database');
  }

  // 2. Internal Linking Health (Max 15)
  let linkScore = 0;
  const linkDetails: string[] = [];
  const toolsCount = entity.relatedTools?.length || 0;
  const guidesCount = entity.relatedGuides?.length || 0;
  const compsCount = entity.relatedComparisons?.length || 0;

  if (toolsCount > 0) {
    linkScore += 5;
    linkDetails.push(`${toolsCount} connected AnyFileX interactive tools linked`);
  } else {
    improvementsChecklist.push('Link at least one interactive AnyFileX tool (e.g. file-analyzer or converter)');
  }

  if (guidesCount >= 2) {
    linkScore += 5;
    linkDetails.push(`${guidesCount} cross-referenced articles linked`);
  } else {
    improvementsChecklist.push('Add cross-reference links to at least 2 relevant guides');
  }

  if (compsCount > 0 || entity.clusterId) {
    linkScore += 5;
    linkDetails.push('Anchored to cluster parent hub');
  } else {
    improvementsChecklist.push('Assign entity to a valid topical cluster ID');
  }

  // 3. Tool Integration (Max 15)
  let toolScore = 0;
  const toolDetails: string[] = [];
  if (entity.relatedTools && entity.relatedTools.length > 0) {
    toolScore += 10;
    toolDetails.push(`Direct integration with ${entity.relatedTools.join(', ')}`);
  }
  const hasDiagnosticSection = entity.contentSections.some(
    (s) =>
      s.heading.toLowerCase().includes('how') ||
      s.heading.toLowerCase().includes('convert') ||
      s.heading.toLowerCase().includes('troubleshoot') ||
      s.heading.toLowerCase().includes('step')
  );
  if (hasDiagnosticSection) {
    toolScore += 5;
    toolDetails.push('Contains actionable diagnostic or operational instructions');
  } else {
    improvementsChecklist.push('Add dedicated operational or diagnostic instruction section');
  }

  // 4. Structured Schema (Max 10)
  let schemaScore = 0;
  const schemaDetails: string[] = [];
  if (entity.schemaType) {
    schemaScore += 5;
    schemaDetails.push(`Declared valid JSON-LD Schema: ${entity.schemaType}`);
  } else {
    improvementsChecklist.push('Define schemaType (TechArticle, HowTo, FAQPage, or Article)');
  }
  if (entity.author?.name && entity.author?.role) {
    schemaScore += 5;
    schemaDetails.push(`Credited author: ${entity.author.name} (${entity.author.role})`);
  } else {
    improvementsChecklist.push('Add accredited author details for E-E-A-T compliance');
  }

  // 5. Metadata Completeness (Max 10)
  let metaScore = 0;
  const metaDetails: string[] = [];
  const titleLen = entity.seoMeta?.title?.length || 0;
  const descLen = entity.seoMeta?.description?.length || 0;

  if (titleLen >= 30 && titleLen <= 70) {
    metaScore += 5;
    metaDetails.push(`Optimal SEO title length (${titleLen} chars)`);
  } else {
    improvementsChecklist.push(`Adjust SEO title to 30-70 characters (currently ${titleLen})`);
  }

  if (descLen >= 70 && descLen <= 165) {
    metaScore += 5;
    metaDetails.push(`Optimal meta description length (${descLen} chars)`);
  } else {
    improvementsChecklist.push(`Adjust meta description to 70-165 characters (currently ${descLen})`);
  }

  // 6. FAQ Breadth & Depth (Max 10)
  let faqScore = 0;
  const faqDetails: string[] = [];
  const faqCount = entity.faq?.length || 0;
  if (faqCount >= 4) {
    faqScore = 10;
    faqDetails.push(`Robust FAQ section with ${faqCount} detailed questions`);
  } else if (faqCount >= 2) {
    faqScore = 6;
    faqDetails.push(`Basic FAQ section with ${faqCount} questions`);
    improvementsChecklist.push('Expand FAQ section to at least 4 domain-specific questions');
  } else {
    improvementsChecklist.push('Add FAQ section with at least 3-4 frequently asked technical questions');
  }

  // 7. Technical Accuracy Review (Max 10)
  let techScore = 0;
  const techDetails: string[] = [];
  const hasCodeOrHex = entity.contentSections.some((s) => Boolean(s.codeSnippet || s.body.includes('0x') || s.body.includes('MIME')));
  const hasBullets = entity.contentSections.some((s) => s.bullets && s.bullets.length > 0);

  if (hasCodeOrHex) {
    techScore += 5;
    techDetails.push('Includes exact technical parameters, code snippets, or hex bytes');
  } else {
    improvementsChecklist.push('Include verifiable binary signatures, MIME types, or offset parameters');
  }

  if (hasBullets) {
    techScore += 5;
    techDetails.push('Structured bulleted lists for scannability');
  }

  // 8. Unique Information & Anti-Boilerplate (Max 10)
  let uniqueScore = 0;
  const uniqueDetails: string[] = [];
  const totalSections = entity.contentSections?.length || 0;
  const totalWords = entity.contentSections.reduce((acc, s) => acc + s.body.split(/\s+/).length, 0);

  if (totalSections >= 3 && totalWords >= 250) {
    uniqueScore += 5;
    uniqueDetails.push(`Substantive body length (${totalWords} words across ${totalSections} sections)`);
  } else {
    improvementsChecklist.push('Expand content depth to at least 3 distinct sections (250+ words)');
  }

  if (entity.summary && entity.summary.length >= 80) {
    uniqueScore += 5;
    uniqueDetails.push('Clear executive summary defined');
  } else {
    improvementsChecklist.push('Provide a concise, informative executive summary (80+ characters)');
  }

  // Calculate Overall
  const overallScore =
    kgScore +
    linkScore +
    toolScore +
    schemaScore +
    metaScore +
    faqScore +
    techScore +
    uniqueScore;

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'D';
  if (overallScore >= 95) grade = 'A+';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 50) grade = 'C';

  return {
    entityId: entity.id,
    title: entity.title,
    slug: entity.slug,
    contentType: entity.contentType,
    overallScore,
    grade,
    breakdown: {
      knowledgeGraphCoverage: { score: kgScore, max: 20, details: kgDetails },
      internalLinkingHealth: { score: linkScore, max: 15, details: linkDetails },
      toolIntegration: { score: toolScore, max: 15, details: toolDetails },
      structuredSchema: { score: schemaScore, max: 10, details: schemaDetails },
      metadataCompleteness: { score: metaScore, max: 10, details: metaDetails },
      faqBreadth: { score: faqScore, max: 10, details: faqDetails },
      technicalAccuracy: { score: techScore, max: 10, details: techDetails },
      uniqueInformation: { score: uniqueScore, max: 10, details: uniqueDetails }
    },
    improvementsChecklist
  };
}

export function auditAllEntitiesQuality(): ContentQualityAudit[] {
  const all = getAllContentEntities();
  return all.map(auditEntityQuality).sort((a, b) => b.overallScore - a.overallScore);
}
