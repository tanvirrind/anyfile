import { FileAnalysis } from '../analyzer/types';
import { getFormatKnowledgeNode } from '../database/knowledgeGraph';
import { TOOLS_REGISTRY } from '../tools/toolsRegistry';
import { computeFileHealth, generateHumanReadableDiagnostics } from './diagnosticsEngine';
import {
  ConversionTargetInfo,
  SmartActionItem,
  SmartActionsResult,
  WorkflowStepConfig
} from './types';

// Machine-readable verified conversion matrix with factual rationales
const CONVERSION_RATIONALE_MAP: Record<string, ConversionTargetInfo[]> = {
  heic: [
    {
      format: 'jpg',
      name: 'Standard JPEG Image',
      mime: 'image/jpeg',
      rationale: 'JPG offers universal compatibility across all web browsers, Windows PC viewers, Android devices, and legacy applications.',
      popularUseCases: ['Sharing photos via email or messaging', 'Uploading to websites with strict JPEG requirements', 'Viewing on Windows and Linux PCs'],
      isRecommended: true
    },
    {
      format: 'png',
      name: 'Lossless PNG Image',
      mime: 'image/png',
      rationale: 'PNG preserves pixel fidelity without compression artifacts, ideal for editing in graphics software.',
      popularUseCases: ['Importing into photo editors', 'Archiving source visual assets'],
      isRecommended: false
    },
    {
      format: 'webp',
      name: 'Modern WebP Graphic',
      mime: 'image/webp',
      rationale: 'WebP provides modern compression that retains sharpness at small file sizes.',
      popularUseCases: ['Modern web publishing', 'Optimizing mobile app assets'],
      isRecommended: false
    },
    {
      format: 'pdf',
      name: 'PDF Document Page',
      mime: 'application/pdf',
      rationale: 'Bundles image into a standard printable document format.',
      popularUseCases: ['Document scanning workflows', 'Formal report attachments'],
      isRecommended: false
    }
  ],
  png: [
    {
      format: 'webp',
      name: 'Modern WebP Graphic',
      mime: 'image/webp',
      rationale: 'WebP reduces PNG file sizes by 30% to 50% while preserving alpha channel transparency and sharp lines.',
      popularUseCases: ['Faster website page loads', 'Mobile UI assets with transparency'],
      isRecommended: true
    },
    {
      format: 'jpg',
      name: 'Standard JPEG Image',
      mime: 'image/jpeg',
      rationale: 'Converts lossless PNG into lightweight JPEG for general photography use.',
      popularUseCases: ['Social media uploads', 'Reducing massive screenshot dimensions'],
      isRecommended: false
    },
    {
      format: 'pdf',
      name: 'PDF Document',
      mime: 'application/pdf',
      rationale: 'Encapsulates raster graphic into portable document structure.',
      popularUseCases: ['Invoices and receipt archiving', 'Submitting design proofs'],
      isRecommended: false
    }
  ],
  jpg: [
    {
      format: 'webp',
      name: 'Modern WebP Graphic',
      mime: 'image/webp',
      rationale: 'Next-generation web format reducing JPEG payload sizes with comparable visual clarity.',
      popularUseCases: ['SEO page speed optimization', 'Web graphics'],
      isRecommended: true
    },
    {
      format: 'png',
      name: 'Lossless PNG Image',
      mime: 'image/png',
      rationale: 'Exports JPEG into PNG container without further lossy generation degradation.',
      popularUseCases: ['Compositing in layered design tools', 'Technical documentation'],
      isRecommended: false
    },
    {
      format: 'pdf',
      name: 'PDF Document',
      mime: 'application/pdf',
      rationale: 'Embeds photographic scan into standardized PDF file.',
      popularUseCases: ['Official document submissions', 'Printing'],
      isRecommended: false
    }
  ],
  jpeg: [
    {
      format: 'webp',
      name: 'Modern WebP Graphic',
      mime: 'image/webp',
      rationale: 'Next-generation web format reducing JPEG payload sizes with comparable visual clarity.',
      popularUseCases: ['SEO page speed optimization', 'Web graphics'],
      isRecommended: true
    },
    {
      format: 'png',
      name: 'Lossless PNG Image',
      mime: 'image/png',
      rationale: 'Exports JPEG into PNG container without further lossy generation degradation.',
      popularUseCases: ['Compositing in layered design tools', 'Technical documentation'],
      isRecommended: false
    }
  ],
  webp: [
    {
      format: 'jpg',
      name: 'Standard JPEG Image',
      mime: 'image/jpeg',
      rationale: 'Ensures backwards compatibility on older desktop software and legacy platforms that cannot render WebP.',
      popularUseCases: ['Legacy image editors', 'Email newsletters', 'Printing services'],
      isRecommended: true
    },
    {
      format: 'png',
      name: 'Lossless PNG Image',
      mime: 'image/png',
      rationale: 'Preserves alpha transparency in universally supported format.',
      popularUseCases: ['Desktop icon design', 'Illustrations'],
      isRecommended: false
    }
  ],
  pdf: [
    {
      format: 'jpg',
      name: 'JPEG Page Images',
      mime: 'image/jpeg',
      rationale: 'Extracts and renders PDF document pages into high-resolution JPEG images.',
      popularUseCases: ['Social previews of documents', 'Presentations and slide decks'],
      isRecommended: true
    },
    {
      format: 'png',
      name: 'Lossless PNG Page Renders',
      mime: 'image/png',
      rationale: 'Extracts PDF pages with crisp vector text rendering.',
      popularUseCases: ['High-DPI print graphics', 'Text document screenshots'],
      isRecommended: false
    }
  ],
  eml: [
    {
      format: 'pdf',
      name: 'Archival PDF Document',
      mime: 'application/pdf',
      rationale: 'Renders RFC 822 email headers, formatted HTML body, and attachment manifest into universal printable PDF.',
      popularUseCases: ['Legal discovery and litigation', 'Accounting audit archives', 'Universal printing and sharing'],
      isRecommended: true
    }
  ],
  msg: [
    {
      format: 'eml',
      name: 'Standard RFC 822 EML',
      mime: 'message/rfc822',
      rationale: 'Translates proprietary Outlook CFBF format into universal open internet standard compatible with Apple Mail and Thunderbird.',
      popularUseCases: ['Opening Outlook emails on Mac and Linux', 'Importing into standard email archives', 'Cross-platform archiving'],
      isRecommended: true
    },
    {
      format: 'pdf',
      name: 'Archival PDF Document',
      mime: 'application/pdf',
      rationale: 'Renders Outlook message and attachments manifest into universal printable PDF document.',
      popularUseCases: ['Legal archives', 'Business audits', 'Universal sharing'],
      isRecommended: false
    }
  ],
  '3mf': [
    {
      format: 'stl',
      name: 'Binary STL 3D Mesh',
      mime: 'model/stl',
      rationale: 'Extracts mesh geometry from 3MF containers and exports universal binary STL for 3D slicing software.',
      popularUseCases: ['3D printing in Cura or PrusaSlicer', 'Legacy CAD software import', 'CNC fabrication'],
      isRecommended: true
    }
  ]
};

/**
 * Smart Action Engine: Takes analyzed file context and dynamically generates
 * recommended operations, multi-step workflows, and diagnostic actions.
 */
export function generateSmartActions(analysis: FileAnalysis): SmartActionsResult {
  const ext = (analysis.detectedExtension || '').toLowerCase();
  const rawExt = (analysis.fileNameExtension || '').toLowerCase();
  const category = analysis.category;

  const fileHealth = computeFileHealth(analysis);
  const diagnostics = generateHumanReadableDiagnostics(analysis);
  const knowledgeNode = analysis.knowledgeNode || getFormatKnowledgeNode(ext);

  // 1. Conversion Targets
  const conversionTargets = CONVERSION_RATIONALE_MAP[ext] || CONVERSION_RATIONALE_MAP[rawExt] || [];

  // 2. Action Groups
  const convertActions: SmartActionItem[] = [];
  const optimizeActions: SmartActionItem[] = [];
  const understandActions: SmartActionItem[] = [];
  const openActions: SmartActionItem[] = [];
  const analyzeActions: SmartActionItem[] = [];

  // Convert Actions
  conversionTargets.forEach((target) => {
    convertActions.push({
      id: `convert_${ext}_to_${target.format}`,
      category: 'convert',
      title: `Convert to .${target.format.toUpperCase()}`,
      description: target.rationale,
      badge: target.isRecommended ? 'Recommended' : 'Transcode',
      iconName: 'RefreshCw',
      isPrimary: target.isRecommended,
      onClickAction: `convert_to_${target.format}`,
      payload: { targetFormat: target.format }
    });
  });

  // Optimize Actions (Category dependent)
  if (category === 'Images' || ['heic', 'heif', 'jpg', 'jpeg', 'png', 'webp', 'bmp', 'svg'].includes(ext)) {
    optimizeActions.push({
      id: 'compress_image',
      category: 'optimize',
      title: 'Compress Image File',
      description: 'Reduce byte footprint in browser memory with visual quality slider.',
      badge: 'Client-Side',
      iconName: 'Sliders',
      isPrimary: true,
      onClickAction: 'compress_now'
    });

    optimizeActions.push({
      id: 'resize_image',
      category: 'optimize',
      title: 'Resize Dimensions',
      description: 'Scale pixel dimensions with aspect ratio lock and percentage presets.',
      badge: 'Precision',
      iconName: 'Maximize',
      onClickAction: 'resize_now'
    });

    optimizeActions.push({
      id: 'strip_metadata',
      category: 'optimize',
      title: 'Strip EXIF & Location',
      description: 'Remove sensitive camera metadata, GPS tags, and timestamps for privacy.',
      badge: 'Privacy',
      iconName: 'ShieldCheck',
      onClickAction: 'strip_meta_now'
    });
  }

  if (category === 'Archives' || ext === 'zip') {
    optimizeActions.push({
      id: 'inspect_zip',
      category: 'optimize',
      title: 'Inspect & Extract ZIP',
      description: 'Inspect archive tree and extract individual entries with path traversal defense.',
      badge: 'Extractor',
      iconName: 'FolderArchive',
      isPrimary: true,
      onClickAction: 'extract_zip_now'
    });
  }

  if (category === 'Documents' || ext === 'pdf') {
    optimizeActions.push({
      id: 'pdf_page_extract',
      category: 'optimize',
      title: 'Extract PDF Pages to Images',
      description: 'Render pages into standalone JPG or PNG files locally in browser.',
      badge: 'Document',
      iconName: 'FileText',
      isPrimary: true,
      onClickAction: 'extract_pdf_pages'
    });
  }

  // Email & Communication Smart Actions
  if (category === 'Email & Comm' || ext === 'eml' || ext === 'msg' || ext === 'mbox' || ext === 'tnef') {
    openActions.push({
      id: 'open_in_email_viewer',
      category: 'open',
      title: 'In-Browser Email Inspector',
      description: 'View formatted email, audit SPF/DKIM security, and extract attachments in browser RAM.',
      badge: 'Email Forensics',
      iconName: 'Mail',
      isPrimary: true,
      route: { view: 'tool-detail', slug: 'email-viewer' }
    });

    if (ext === 'tnef' || ext === 'dat') {
      optimizeActions.push({
        id: 'winmail_extract',
        category: 'optimize',
        title: 'Extract winmail.dat Trapped Files',
        description: 'Decode Outlook TNEF package and recover original attachments and documents.',
        badge: 'TNEF Extractor',
        iconName: 'FolderArchive',
        isPrimary: true,
        route: { view: 'tool-detail', slug: 'winmail-extractor' }
      });
    }

    if (ext === 'msg') {
      convertActions.push({
        id: 'convert_msg_to_eml',
        category: 'convert',
        title: 'Convert Outlook MSG to EML',
        description: 'Translate proprietary Outlook .msg compound file into standard open RFC 822 .eml.',
        badge: 'Open Standard',
        iconName: 'Mail',
        isPrimary: true,
        route: { view: 'tool-detail', slug: 'msg-to-eml' }
      });
    }

    convertActions.push({
      id: 'convert_email_to_pdf',
      category: 'convert',
      title: 'Archive Email to PDF Record',
      description: 'Generate publication-ready PDF document with metadata cards and attachment manifest.',
      badge: 'Legal Archive',
      iconName: 'Printer',
      route: { view: 'tool-detail', slug: 'eml-to-pdf' }
    });
  }

  // 3D & CAD Smart Actions
  if (category === 'CAD & 3D' || ext === 'stl' || ext === '3mf') {
    openActions.push({
      id: ext === '3mf' ? 'open_3mf_viewer' : 'open_stl_viewer',
      category: 'open',
      title: ext === '3mf' ? '3MF Package & Model Inspector' : 'Interactive 3D STL Viewer',
      description: 'Render interactive 3D WebGL mesh, inspect volume, bounding dimensions, and facets.',
      badge: 'WebGL 3D',
      iconName: 'Box',
      isPrimary: true,
      route: { view: 'tool-detail', slug: ext === '3mf' ? '3mf-viewer' : 'stl-viewer' }
    });
  }

  // Understand Actions (Knowledge Graph links)
  understandActions.push({
    id: `how_to_open_${ext}`,
    category: 'understand',
    title: `How to Open .${ext.toUpperCase()} Files`,
    description: `Step-by-step viewer guides for Windows, Mac, Linux, iOS & Android.`,
    badge: 'Guide',
    iconName: 'HelpCircle',
    isPrimary: true,
    route: { view: 'how-to-open', ext }
  });

  understandActions.push({
    id: `specs_${ext}`,
    category: 'understand',
    title: `.${ext.toUpperCase()} Format Encyclopedia`,
    description: `Technical specifications, RFC standards, binary structure, and history.`,
    badge: 'Specs',
    iconName: 'FileText',
    route: { view: 'extension-detail', ext }
  });

  if (knowledgeNode && knowledgeNode.comparisons.length > 0) {
    knowledgeNode.comparisons.slice(0, 2).forEach((comp) => {
      understandActions.push({
        id: `comp_${comp.slug}`,
        category: 'understand',
        title: comp.title,
        description: comp.highlight || `Compare ${comp.ext1} vs ${comp.ext2} compression & compatibility.`,
        badge: 'Comparison',
        iconName: 'Scale',
        route: { view: 'comparison-detail', slug: comp.slug }
      });
    });
  }

  // Open Actions (Compatible Software)
  if (knowledgeNode && knowledgeNode.compatibleSoftware.length > 0) {
    knowledgeNode.compatibleSoftware.slice(0, 4).forEach(({ software, platformBadges }) => {
      openActions.push({
        id: `soft_${software.id}`,
        category: 'open',
        title: software.name,
        description: `${software.description} (${platformBadges.join(', ')})`,
        badge: software.priceType,
        iconName: 'Monitor',
        route: { view: 'software-detail', id: software.id }
      });
    });
  }

  // Analyze Actions
  analyzeActions.push({
    id: 'hex_inspector',
    category: 'analyze',
    title: 'Inspect Binary Hex Dump',
    description: 'Inspect 16-byte offset rows and byte patterns in raw hex viewer.',
    badge: 'Hex View',
    iconName: 'Binary',
    onClickAction: 'view_hex'
  });

  analyzeActions.push({
    id: 'hash_inspector',
    category: 'analyze',
    title: 'Cryptographic SHA-256 Fingerprint',
    description: 'View SHA-256 hash checksum for cryptographic identity verification.',
    badge: 'Hash',
    iconName: 'Fingerprint',
    onClickAction: 'view_hash'
  });

  // 3. Recommended Multi-Step Workflows
  const recommendedWorkflows: Array<{
    id: string;
    title: string;
    description: string;
    stepNames: string[];
    steps: WorkflowStepConfig[];
  }> = [];

  if (ext === 'heic' || ext === 'heif') {
    recommendedWorkflows.push({
      id: 'heic_to_web_jpg',
      title: 'HEIC → Universal Web JPG Workflow',
      description: 'Transcode iPhone photo to standard JPG, resize to Full HD 1920px, and compress to 80% for sharing.',
      stepNames: ['Convert to JPG', 'Resize to 1920px Width', 'Compress (80% Quality)', 'Verify Output'],
      steps: [
        { type: 'convert', targetFormat: 'jpg' },
        { type: 'resize', targetWidth: 1920, lockRatio: true, mode: 'contain' },
        { type: 'compress', quality: 80 },
        { type: 'verify' }
      ]
    });
  }

  if (ext === 'png') {
    recommendedWorkflows.push({
      id: 'png_to_webp_optimize',
      title: 'PNG → Lightweight WebP Workflow',
      description: 'Convert PNG to WebP format, strip unnecessary metadata, and compress by 40% with zero visual loss.',
      stepNames: ['Convert to WebP', 'Strip EXIF Metadata', 'Compress (85% Quality)', 'Verify Output'],
      steps: [
        { type: 'convert', targetFormat: 'webp' },
        { type: 'strip_metadata' },
        { type: 'compress', quality: 85 },
        { type: 'verify' }
      ]
    });
  }

  if (category === 'Images' || ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    recommendedWorkflows.push({
      id: 'standard_image_optimizer',
      title: 'Lossless Image Optimization Workflow',
      description: 'Optimize dimensions, balance raster compression ratio, and verify final container integrity.',
      stepNames: ['Resize to 1920px Width', 'Compress (80% Quality)', 'Verify Output'],
      steps: [
        { type: 'resize', targetWidth: 1920, lockRatio: true, mode: 'contain' },
        { type: 'compress', quality: 80 },
        { type: 'verify' }
      ]
    });
  }

  recommendedWorkflows.push({
    id: 'bundle_to_zip',
    title: 'Archive Packaging Workflow',
    description: 'Compress file into a clean .zip package with verified integrity and zero server transit.',
    stepNames: ['Package into ZIP', 'Verify Archive'],
    steps: [
      { type: 'zip_package', archiveName: `${analysis.fileName.split('.')[0] || 'bundle'}.zip` },
      { type: 'verify' }
    ]
  });

  return {
    fileHealth,
    diagnostics,
    conversionTargets,
    recommendedWorkflows,
    actionGroups: {
      convert: convertActions,
      optimize: optimizeActions,
      understand: understandActions,
      open: openActions,
      analyze: analyzeActions
    }
  };
}
