import { AppRoute, CategoryType, FileTypeInfo } from '../../types';
import { FormatKnowledgeNode, SoftwareCapability, ComparisonPairMeta } from '../database/knowledgeGraph';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Unknown';

export type DetectionMethod =
  | 'magic_bytes'
  | 'container_inspection'
  | 'text_heuristic'
  | 'mime_fallback'
  | 'extension_fallback'
  | 'unknown';

export interface SignaturePattern {
  id: string;
  name: string;
  extension: string;
  category: CategoryType;
  mimeType: string;
  magicBytesHex: string; // e.g. "89 50 4E 47 0D 0A 1A 0A"
  offset: number;
  confidence: ConfidenceLevel;
  description: string;
  meaning: string; // e.g. "Standard PNG 8-byte magic header"
  asciiRepresentation?: string;
  isContainer?: boolean;
  isExecutable?: boolean;
  isMacroEnabled?: boolean;
  secondaryCheck?: (bytes: Uint8Array, ascii: string, ext: string) => boolean;
}

export interface MimeComparisonResult {
  status: 'match' | 'mismatch' | 'generic' | 'unknown';
  browserReportedMime: string;
  detectedMime: string;
  standardDatabaseMime: string;
  message: string;
  explanation: string;
}

export interface ExtensionComparisonResult {
  status: 'match' | 'mismatch' | 'missing' | 'unknown';
  filenameExtension: string;
  detectedExtension: string;
  message: string;
  explanation: string;
  isSpoofed: boolean;
}

export interface HexOffsetRow {
  offsetHex: string;
  hexBytes: string[];
  asciiChars: string;
}

export interface SignatureAnalysis {
  hexSignature: string;
  asciiSignature: string;
  matchedPattern: SignaturePattern | null;
  offset: number;
  meaning: string;
  sampleBytes: number[];
  hexOffsetRows: HexOffsetRow[];
}

export interface ImageMetadataInfo {
  width?: number;
  height?: number;
  aspectRatio?: string;
  megapixels?: string;
  colorSpace?: string;
  bitDepth?: string;
  isAnimated?: boolean;
  frameCount?: number;
  orientation?: string;
  hasAlpha?: boolean;
  cameraMake?: string;
  cameraModel?: string;
  lensModel?: string;
  dateTaken?: string;
  iso?: string;
  shutterSpeed?: string;
  aperture?: string;
  focalLength?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

export interface AudioMetadataInfo {
  durationSec?: number;
  formattedDuration?: string;
  sampleRateHz?: number;
  channels?: number;
  channelLayout?: 'Mono' | 'Stereo' | 'Surround';
  codec?: string;
  bitrateKbps?: number;
  artist?: string;
  title?: string;
  album?: string;
}

export interface VideoMetadataInfo {
  durationSec?: number;
  formattedDuration?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  codec?: string;
  fps?: number;
  hasAudio?: boolean;
}

export interface DocumentMetadataInfo {
  pageCount?: number;
  documentType?: string;
  pdfVersion?: string;
  isEncrypted?: boolean;
  creatorSoftware?: string;
  producer?: string;
  author?: string;
  title?: string;
  createdDate?: string;
  modifiedDate?: string;
  lineCount?: number;
  characterCount?: number;
  encoding?: string;
}

export interface ArchiveMetadataInfo {
  archiveType?: string;
  estimatedEntries?: number;
  compressionMethod?: string;
  sampleEntries?: string[];
  isEncrypted?: boolean;
  isSolidArchive?: boolean;
}

export interface FileMetadataExtraction {
  general: Record<string, string | number | boolean>;
  image?: ImageMetadataInfo;
  audio?: AudioMetadataInfo;
  video?: VideoMetadataInfo;
  document?: DocumentMetadataInfo;
  archive?: ArchiveMetadataInfo;
  rawPropertyList: { key: string; value: string; category: string }[];
}

export interface SecurityIndicatorItem {
  id: string;
  type: 'info' | 'caution' | 'warning' | 'danger';
  title: string;
  description: string;
}

export interface SecurityAssessment {
  status: 'safe' | 'caution' | 'warning' | 'unknown';
  badgeText: string;
  neutralStatement: string;
  indicators: SecurityIndicatorItem[];
  isExecutable: boolean;
  isMacroEnabled: boolean;
  isEncrypted: boolean;
  isSpoofed: boolean;
  entropy?: number; // 0.0 - 8.0
}

export interface AvailableToolAction {
  id: string;
  title: string;
  description: string;
  actionType: 'open_guide' | 'converter' | 'compare' | 'metadata' | 'hash' | 'repair' | 'extension_info';
  route: AppRoute;
  badge?: string;
  iconName: string;
  isPrimary?: boolean;
}

export interface DiagnosticsInfo {
  readTimeMs: number;
  analysisTimeMs: number;
  bytesRead: number;
  totalFileSize: number;
  isPartialRead: boolean;
  clientSideOnly: boolean;
  sha256Hash: string;
  md5Hash?: string;
  entropy?: number;
  analyzedAt: string;
}

export interface FileAnalysis {
  id: string;
  fileName: string;
  fileSize: number;
  formattedSize: string;
  reportedMimeType: string;
  fileNameExtension: string;
  detectedExtension: string;
  detectedFormat: string;
  detectedMimeType: string;
  databaseMimeType: string;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0 - 100
  detectionMethod: DetectionMethod;
  category: CategoryType;
  mimeComparison: MimeComparisonResult;
  extensionComparison: ExtensionComparisonResult;
  signature: SignatureAnalysis;
  metadata: FileMetadataExtraction;
  security: SecurityAssessment;
  knowledgeNode: FormatKnowledgeNode | null;
  availableTools: AvailableToolAction[];
  diagnostics: DiagnosticsInfo;
  rawFile?: File;
  error?: {
    code: string;
    message: string;
    suggestion?: string;
  };
}

export interface BatchAnalysisQueueItem {
  id: string;
  file: File;
  status: 'queued' | 'analyzing' | 'completed' | 'error';
  progress: number;
  analysis?: FileAnalysis;
  errorMessage?: string;
}
