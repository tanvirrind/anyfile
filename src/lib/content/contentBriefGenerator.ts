import { ContentBrief, ContentEntity, ContentType, SchemaType, InternalLinkItem } from './types';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { getAllTools } from '../tools/toolsRegistry';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { AUTHOR_AVATARS } from './editorialTeam';

export interface FormatEntityInput {
  extension: string;
  name?: string;
  category?: string;
  mimeType?: string;
  magicBytesHex?: string;
  popularApps?: Array<{ name: string; slug?: string; os?: string[] }>;
  conversions?: Array<{ targetExtension: string; description?: string; converterSlug?: string }>;
  contentType?: ContentType;
}

export function generateContentBriefFromEntity(input: FormatEntityInput): ContentBrief {
  const extUpper = input.extension.toUpperCase().replace(/^\./, '');
  const extLower = extUpper.toLowerCase();
  
  // Find rich data from knowledge base if available
  const existingFormat = POPULAR_FILE_TYPES.find(
    f => f.extension.toUpperCase() === extUpper
  );

  const formatName = existingFormat?.name || input.name || `${extUpper} File`;
  const category = existingFormat?.category || input.category || 'General';
  const mimeType = existingFormat?.mimeType || input.mimeType || `application/${extLower}`;
  const magicBytes = existingFormat?.magicBytesHex || input.magicBytesHex || 'Varies by container specification';

  const contentType: ContentType = input.contentType || 'format-guide';

  // Determine cluster and intent
  let clusterId = 'cluster-a-formats';
  let searchIntent: ContentBrief['searchIntent'] = 'informational';
  let suggestedTitle = `What Is a ${extUpper} File? ${formatName} Specs & Guide`;
  let suggestedH1 = `What Is a ${extUpper} File? Format Architecture & Compatibility`;
  let suggestedSlug = `what-is-a-${extLower}-file`;
  let schemaType: SchemaType = 'TechArticle';

  if (contentType === 'how-to') {
    clusterId = 'cluster-b-how-to-open';
    searchIntent = 'informational';
    suggestedTitle = `How to Open a ${extUpper} File on Windows 11, Mac, Android & Linux`;
    suggestedH1 = `How to Open a ${extUpper} File: Complete OS Compatibility Guide`;
    suggestedSlug = `how-to-open-a-${extLower}-file`;
    schemaType = 'HowTo';
  } else if (contentType === 'conversion-guide') {
    clusterId = 'cluster-c-conversions';
    searchIntent = 'transactional';
    const firstTarget = existingFormat?.conversions?.[0]?.targetExtension || 'JPG';
    suggestedTitle = `How to Convert ${extUpper} to ${firstTarget}: Fast, In-Browser & Private`;
    suggestedH1 = `How to Convert ${extUpper} to ${firstTarget} Without Software Installation`;
    suggestedSlug = `how-to-convert-${extLower}-to-${firstTarget.toLowerCase()}`;
    schemaType = 'HowTo';
  } else if (contentType === 'comparison') {
    clusterId = 'cluster-d-comparisons';
    searchIntent = 'commercial';
    const compTarget = existingFormat?.conversions?.[0]?.targetExtension || 'JPG';
    suggestedTitle = `${extUpper} vs ${compTarget}: Compression, Quality & Compatibility Compared`;
    suggestedH1 = `${extUpper} vs ${compTarget}: Architectural Benchmark & Comparison`;
    suggestedSlug = `${extLower}-vs-${compTarget.toLowerCase()}`;
    schemaType = 'TechArticle';
  } else if (contentType === 'troubleshooting') {
    clusterId = 'cluster-e-troubleshooting';
    searchIntent = 'informational';
    suggestedTitle = `Why Won’t My ${extUpper} File Open? Diagnostics & Repair Guide`;
    suggestedH1 = `Why Won’t My ${extUpper} File Open? Causes & Solutions`;
    suggestedSlug = `why-wont-my-${extLower}-file-open`;
    schemaType = 'TechArticle';
  } else if (contentType === 'software-compatibility') {
    clusterId = 'cluster-h-software';
    searchIntent = 'commercial';
    suggestedTitle = `What Programs Open ${extUpper} Files? Verified Software Directory`;
    suggestedH1 = `What Programs Open ${extUpper} Files on Windows and Mac?`;
    suggestedSlug = `what-programs-open-${extLower}-files`;
    schemaType = 'Article';
  }

  // Generate structured outline based on real facts
  const outline: ContentBrief['outline'] = [];

  if (contentType === 'format-guide') {
    outline.push(
      {
        heading: `What Is a ${extUpper} File?`,
        corePointsToCover: [
          `Define the ${extUpper} (${formatName}) format standard and its primary development history.`,
          `Explain its container category (${category}) and real-world use cases.`,
          `Highlight primary compression mechanisms and color depth / channel capabilities.`
        ]
      },
      {
        heading: `${extUpper} Technical Specifications & Binary Signature`,
        corePointsToCover: [
          `Document magic byte hex signatures: ${magicBytes}`,
          `Registered MIME Content-Type: ${mimeType}`,
          `Internal container hierarchy, block structure, and metadata chunks.`
        ],
        suggestedAnchorLinks: ['File Analyzer', 'Magic Bytes Guide']
      },
      {
        heading: `Key Advantages and Architectural Limitations of ${extUpper}`,
        corePointsToCover: [
          `Benchmark storage efficiency vs legacy alternative formats.`,
          `Examine browser rendering adoption across Chromium, WebKit, and Gecko engines.`,
          `Discuss hardware encoding and decoding support.`
        ]
      }
    );
  } else if (contentType === 'how-to') {
    outline.push(
      {
        heading: `How to Open ${extUpper} Files on Windows 11 & Windows 10`,
        corePointsToCover: [
          `Check for native codec packages or default shell integrations.`,
          `Provide verified third-party viewing applications.`,
          `Highlight instant client-side viewing on AnyFileX.`
        ]
      },
      {
        heading: `How to Open ${extUpper} Files on Apple macOS & iOS`,
        corePointsToCover: [
          `Provide Finder Quick Look and native Preview instructions.`,
          `Mobile iOS viewing instructions.`
        ]
      },
      {
        heading: `How to Open ${extUpper} Files on Android & Linux`,
        corePointsToCover: [
          `Linux package installation commands (e.g. libheif / ImageMagick).`,
          `Android native gallery support or recommended viewers.`
        ]
      }
    );
  } else {
    outline.push(
      {
        heading: `Overview of ${extUpper} Processing`,
        corePointsToCover: [
          `Explain standard requirements for interacting with .${extLower} files.`,
          `Highlight data privacy advantages of client-side browser processing.`
        ]
      },
      {
        heading: `Step-by-Step Implementation`,
        corePointsToCover: [
          `Detail exact steps using AnyFileX tools or native operating system utilities.`,
          `Provide troubleshooting checkpoints for common errors.`
        ]
      }
    );
  }

  // Questions to answer
  const questionsToAnswer = [
    `What program can open a .${extLower} file?`,
    `Is the ${extUpper} file format safe, or can it carry viruses?`,
    `What is the true MIME type and magic byte signature of a .${extLower} file?`,
    `How do I convert a .${extLower} file into a standard format without paying for software?`
  ];

  // Related entities
  const conversions = existingFormat?.conversions?.map(c => c.targetExtension) || ['JPG', 'PDF', 'PNG'];
  const software = existingFormat?.popularApps?.map(a => a.slug || a.name.toLowerCase().replace(/\s+/g, '-')) || ['adobe-photoshop', 'gimp', 'google-photos'];
  const extensions = [extUpper, ...conversions.slice(0, 3)];

  // Relevant AnyFileX Tools
  const relevantTools: ContentBrief['relevantAnyFileXTools'] = [
    {
      toolId: 'file-analyzer',
      toolName: 'Binary File Analyzer',
      featureHighlight: `Inspect magic bytes and confirm genuine .${extLower} container headers.`
    }
  ];

  if (category === 'Images') {
    relevantTools.push({
      toolId: 'image-compressor',
      toolName: 'Browser Image Compressor',
      featureHighlight: `Quantize and optimize .${extLower} imagery in browser RAM.`
    });
    if (extUpper === 'HEIC') {
      relevantTools.push({
        toolId: 'heic-to-jpg',
        toolName: 'HEIC to JPG Converter',
        featureHighlight: 'Fast batch conversion to universal JPEG.'
      });
    }
  }

  // Internal link opportunities
  const internalLinkOpportunities: InternalLinkItem[] = [
    {
      targetTitle: `Analyze .${extUpper} File Headers`,
      targetUrl: '/file-analyzer',
      targetType: 'analyzer',
      anchorText: `inspect .${extUpper} binary signatures in File Analyzer`,
      contextHint: 'Header verification section'
    },
    {
      targetTitle: `What Are Magic Bytes?`,
      targetUrl: '/guides/what-are-magic-bytes',
      targetType: 'guide',
      anchorText: 'understanding magic byte signatures',
      contextHint: 'Technical specifications section'
    }
  ];

  if (existingFormat?.conversions?.[0]) {
    const target = existingFormat.conversions[0].targetExtension;
    internalLinkOpportunities.push({
      targetTitle: `Convert ${extUpper} to ${target}`,
      targetUrl: `/converters/${extLower}-to-${target.toLowerCase()}`,
      targetType: 'tool',
      anchorText: `convert .${extUpper} to .${target} online`,
      contextHint: 'Conversion options'
    });
  }

  // FAQ Opportunities
  const faqOpportunities = [
    {
      question: `What is the difference between .${extLower} and standard files?`,
      recommendedAnswerPoints: `Explain specific compression, container layout, and modern features like transparency or high bit depth.`
    },
    {
      question: `How do I check if my .${extLower} file is corrupted?`,
      recommendedAnswerPoints: `Explain magic byte inspection, EOF marker validation, and checksum verification using AnyFileX File Analyzer.`
    }
  ];

  return {
    primaryTopic: `${extUpper} (${formatName})`,
    targetFormat: formatName,
    targetExtension: extUpper,
    contentType,
    clusterId,
    searchIntent,
    suggestedTitle,
    suggestedH1,
    suggestedSlug,
    outline,
    questionsToAnswer,
    relatedEntities: {
      formats: [formatName],
      extensions,
      software,
      tools: relevantTools.map(t => t.toolId),
      comparisons: conversions.map(c => `${extLower}-vs-${c.toLowerCase()}`)
    },
    internalLinkOpportunities,
    relevantAnyFileXTools: relevantTools,
    faqOpportunities,
    recommendedSchemaType: schemaType,
    generatedDate: new Date().toISOString().split('T')[0],
    dataSource: `AnyFileX Knowledge Graph v5.2 (${extUpper})`
  };
}

export function createDraftEntityFromBrief(brief: ContentBrief): ContentEntity {
  const sections = brief.outline.map(o => ({
    heading: o.heading,
    body: o.corePointsToCover.join(' '),
    bullets: o.corePointsToCover
  }));

  const faqs = brief.faqOpportunities.map(f => ({
    question: f.question,
    answer: f.recommendedAnswerPoints
  }));

  return {
    id: `draft-${brief.suggestedSlug}-${Date.now().toString(36)}`,
    slug: brief.suggestedSlug,
    title: brief.suggestedTitle,
    h1: brief.suggestedH1,
    contentType: brief.contentType,
    clusterId: brief.clusterId,
    primaryTopic: brief.primaryTopic,
    searchIntent: brief.searchIntent,
    summary: `Authoritative guide covering ${brief.primaryTopic}. Learn technical specifications, operating system support, conversion options, and troubleshooting diagnostics.`,
    contentSections: sections,
    relatedFormats: brief.relatedEntities.formats,
    relatedExtensions: brief.relatedEntities.extensions,
    relatedTools: brief.relevantAnyFileXTools.map(t => t.toolId),
    relatedSoftware: brief.relatedEntities.software,
    relatedGuides: ['what-are-magic-bytes'],
    relatedComparisons: brief.relatedEntities.comparisons,
    faq: faqs,
    schemaType: brief.recommendedSchemaType,
    status: 'draft', // Never auto-published
    createdAt: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
    knowledgeGraphVersion: '5.2.0',
    seoMeta: {
      title: `${brief.suggestedTitle} | AnyFileX`,
      description: `Comprehensive technical guide to ${brief.primaryTopic}. Learn binary magic bytes, OS opening steps, and verified software options.`,
      canonical: `https://www.anyfilex.com/guides/${brief.suggestedSlug}`,
      robots: 'noindex, nofollow', // Drafts start as noindex until published
      keywords: [brief.primaryTopic.toLowerCase(), `${brief.targetExtension?.toLowerCase()} file`, `how to open ${brief.targetExtension?.toLowerCase()}`]
    },
    author: {
      name: 'AnyFileX Technical Review Board',
      role: 'Peer-Reviewed Technical Architecture Team',
      credentials: 'ISO & IETF Standards Working Group',
      avatar: AUTHOR_AVATARS.editorialBoard
    },
    readingTimeMinutes: 5,
    difficulty: 'Beginner',
    targetOS: ['windows', 'mac', 'linux', 'android', 'ios']
  };
}
