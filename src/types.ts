export interface SoftwareApp {
  name: string;
  os: ('windows' | 'mac' | 'linux' | 'android' | 'ios')[];
  isFree: boolean;
  developer: string;
  link?: string;
  slug?: string;
}

export interface ConversionPath {
  targetExtension: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  onlinePossible: boolean;
  converterSlug?: string;
}

export type CategoryType =
  | 'Images'
  | 'CAD & 3D'
  | 'Documents'
  | 'Archives'
  | 'Audio & Video'
  | 'Code & Data'
  | 'System & Executables'
  | 'Email & Comm'
  | 'Databases'
  | 'Medical & Science';

export interface FileTypeInfo {
  extension: string; // e.g. "HEIC"
  name: string; // e.g. "High Efficiency Image Container"
  category: CategoryType;
  description: string;
  detailedOverview: string;
  mimeType: string;
  magicBytesHex: string;
  typicalSize: string;
  dangerRating: 'Low Risk' | 'Medium Risk' | 'High Risk';
  dangerExplanation: string;
  popularApps: SoftwareApp[];
  openingSteps: { title: string; desc: string }[];
  conversions: ConversionPath[];
  repairTips: string[];
  exampleUse: string;
  featured?: boolean;
  popularityScore?: number; // 1-100
  developer?: string;
  firstReleased?: string;
  faqs?: { question: string; answer: string }[];
  osSupport?: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
    android: boolean;
    ios: boolean;
  };
  // Phase 6 Rich Database Fields
  relationships?: {
    parentFormat?: string;
    relatedExtensions: string[];
    containerFormat?: string;
    derivedFormats?: string[];
  };
  specifications?: {
    developer?: string;
    initialRelease?: string;
    licensing?: 'Open Standard' | 'Proprietary' | 'Royalty-Free' | 'ISO/IEC Standardized';
    specificationUrl?: string;
    structureType?: string;
  };
  approvalStatus?: 'approved' | 'pending' | 'draft' | 'rejected';
  versionHistory?: { version: number; updatedAt: string; updatedBy: string; notes: string }[];
  moderationFlags?: { flagged: boolean; reason?: string; reportedAt?: string }[];
}

export interface SoftwareTutorial {
  title: string;
  description: string;
  readTime?: string;
  url?: string;
}

export interface SoftwareInfo {
  id: string; // slug e.g. 'adobe-photoshop'
  name: string;
  developer: string;
  category: string;
  description: string;
  longDescription: string;
  supportedOS: ('windows' | 'mac' | 'linux' | 'android' | 'ios')[];
  priceType: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  priceText?: string;
  websiteUrl: string;
  downloadUrl?: string;
  supportedExtensions: string[];
  rating: number; // e.g. 4.8
  reviewCount: number;
  features: string[];
  alternatives: { name: string; slug?: string; description: string }[];
  logoIcon?: string;
  tutorials?: SoftwareTutorial[];
  frequentlyOpenedTypes?: { extension: string; name: string; description: string }[];
}

export interface ConverterInfo {
  id: string; // e.g. 'heic-to-jpg'
  fromExt: string;
  toExt: string;
  name: string; // e.g. 'HEIC to JPG Converter'
  category: string;
  description: string;
  steps: { title: string; desc: string }[];
  recommendedApps: string[];
  commonIssues: string[];
  faqs: { question: string; answer: string }[];
  isInteractiveToolAvailable: boolean;
  onlineConversionSupported: boolean;
  speedRating: 'Instant' | 'Fast (< 30s)' | 'Medium (< 2m)';
  qualityRating: 'Lossless' | 'Near Lossless' | 'Lossy Compression';
}

export interface RepairGuide {
  id: string; // e.g. 'corrupted-zip'
  title: string;
  extension: string;
  category: 'Archive' | 'Image' | 'Document' | 'Video' | 'CAD' | 'Email' | 'Database';
  symptoms: string[];
  causes: string[];
  repairMethods: { title: string; desc: string; toolName?: string; difficulty: 'Easy' | 'Intermediate' | 'Advanced' }[];
  recoveryTools: { name: string; type: 'Free' | 'Paid' | 'Command Line'; link?: string }[];
  preventiveTips: string[];
  faqs: { question: string; answer: string }[];
}

export interface GuideInfo {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  readTime: string;
  date: string;
  lastAuditedDate?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  author: {
    name: string;
    role: string;
    avatar: string;
    credentials?: string;
    bio?: string;
    qualifications?: string[];
  };
  reviewedBy?: {
    name: string;
    role: string;
    credentials?: string;
  };
  verifiedPlatforms?: string[];
  citations?: Array<{
    standard: string;
    title: string;
    issuingBody?: string;
    url?: string;
  }>;
  relatedExtensions: string[];
  contentSections: {
    heading: string;
    body?: string;
    bullets?: string[];
    callout?: string;
  }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: 'News' | 'Tips' | 'Tutorials' | 'Comparisons' | 'Announcements';
  date: string;
  lastAuditedDate?: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    credentials?: string;
    bio?: string;
  };
  reviewedBy?: {
    name: string;
    role: string;
    credentials?: string;
  };
  citations?: Array<{
    standard: string;
    title: string;
    url?: string;
  }>;
  content: string;
  tags: string[];
  relatedExtensions: string[];
}

export interface CategoryInfo {
  id: string; // e.g. 'images'
  name: string;
  iconName: string;
  description: string;
  popularExtensions: string[];
  latestGuideIds: string[];
  popularTools: string[];
  topSoftware: string[];
  faqs: { question: string; answer: string }[];
}

export type ToolTab =
  | 'identifier'
  | 'metadata'
  | 'mime'
  | 'magic-bytes'
  | 'hash'
  | 'converter'
  | 'size-calc'
  | 'hex-viewer'
  | 'binary-viewer';

export interface FileAnalysisResult {
  fileName: string;
  fileSize: number;
  fileTypeDetected: string;
  extensionMatch: FileTypeInfo | null;
  mimeType: string;
  magicBytesHex: string;
  md5Hash?: string;
  sha256Hash?: string;
  exifData?: Record<string, string | number>;
  safetyCheck: {
    status: 'safe' | 'warning' | 'danger';
    message: string;
  };
}

export interface FileSignatureRecord {
  id: string;
  extension: string;
  name: string;
  mime_type: string;
  signature: string;
  offset: number;
  category: CategoryType | string;
  description: string;
  common_software: string[];
  supported_os: ('windows' | 'mac' | 'linux' | 'android' | 'ios')[];
  security_notes: string;
  example_header_hex?: string;
  magicBytesAscii?: string;
}

export type AppRoute =
  | { view: 'home' }
  | { view: 'extensions'; categoryFilter?: string; letterFilter?: string; query?: string }
  | { view: 'extension-detail'; ext: string }
  | { view: 'how-to-open'; ext?: string; categoryFilter?: string }
  | { view: 'compare-hub'; categoryFilter?: string }
  | { view: 'comparison-detail'; slug: string }
  | { view: 'software' }
  | { view: 'software-detail'; id: string }
  | { view: 'converters' }
  | { view: 'converter-detail'; id: string }
  | { view: 'repair' }
  | { view: 'repair-detail'; id: string }
  | { view: 'troubleshoot-hub'; categoryFilter?: string }
  | { view: 'troubleshoot-guide'; slug: string }
  | { view: 'security-hub'; categoryFilter?: string }
  | { view: 'technical-guide'; slug: string }
  | { view: 'tools'; categoryFilter?: string; toolId?: ToolTab }
  | { view: 'tool-detail'; slug: string }
  | { view: 'file-analyzer'; id?: string }
  | { view: 'file-identifier' }
  | { view: 'file-identifier-result'; id: string }
  | { view: 'metadata-viewer' }
  | { view: 'metadata-result'; id: string }
  | { view: 'remove-metadata' }
  | { view: 'hash-generator' }
  | { view: 'checksum-verifier' }
  | { view: 'mime-checker'; query?: string }
  | { view: 'magic-byte-detector' }
  | { view: 'mime-detail'; mimeSlug: string }
  | { view: 'guides' }
  | { view: 'guide-detail'; id: string }
  | { view: 'resources' }
  | { view: 'blog' }
  | { view: 'blog-detail'; id: string }
  | { view: 'blog-post'; id: string }
  | { view: 'category-detail'; id: string }
  | { view: 'admin' }
  | { view: 'assistant' }
  | { view: 'seo-audit' }
  | { view: 'sitemaps' }
  | { view: 'about' }
  | { view: 'editorial-standards' }
  | { view: 'authors'; authorId?: string }
  | { view: 'contact' }
  | { view: 'workflows'; workflowId?: string }
  | { view: 'format-guide'; format: string }
  | { view: 'content-hub'; topic: string }
  | { view: 'content-dashboard' }
  | { view: 'not-found'; requestedPath?: string };
