import {
  FileAnalysis,
  DiagnosticsInfo,
  ConfidenceLevel,
} from './types';
import { CategoryType } from '../../types';
import { detectFileFormat } from './detectionEngine';
import { extractFileMetadata } from './metadataExtractor';
import { evaluateSecurity } from './securityEngine';
import { resolveAvailableTools } from './toolResolver';
import { getFormatKnowledgeNode } from '../database/knowledgeGraph';
import { formatBytes } from '../../utils/fileAnalyzer';
import { sha256Hex } from '../../utils/hashUtils';

// In-Memory Report Store with SessionStorage Persistence
const analysisReportsStore = new Map<string, FileAnalysis>();
const ANALYSIS_CACHE_PREFIX = 'anyfilex_analysis_';

export function getStoredAnalysis(id: string): FileAnalysis | null {
  if (analysisReportsStore.has(id)) {
    return analysisReportsStore.get(id)!;
  }

  try {
    const serialized = sessionStorage.getItem(`${ANALYSIS_CACHE_PREFIX}${id}`);
    if (serialized) {
      const parsed: FileAnalysis = JSON.parse(serialized);
      analysisReportsStore.set(id, parsed);
      return parsed;
    }
  } catch (err) {
    console.debug('Failed to read analysis from sessionStorage:', err);
  }

  return null;
}

export function saveAnalysis(analysis: FileAnalysis): void {
  analysisReportsStore.set(analysis.id, analysis);
  try {
    sessionStorage.setItem(`${ANALYSIS_CACHE_PREFIX}${analysis.id}`, JSON.stringify(analysis));
  } catch (err) {
    console.debug('Failed to write analysis to sessionStorage:', err);
  }
}

/**
 * Analyzes a single file locally in the browser with partial stream reading.
 */
export async function analyzeFile(
  file: File,
  onProgress?: (stepText: string, percent: number) => void
): Promise<FileAnalysis> {
  const startTime = performance.now();

  if (!file) {
    throw new Error('No file provided for analysis');
  }

  if (file.size === 0) {
    // Handle empty file edge case
    const emptyId = `analysis_${Date.now()}_empty`;
    const emptyAnalysis: FileAnalysis = {
      id: emptyId,
      fileName: file.name || 'empty_file',
      fileSize: 0,
      formattedSize: '0 Bytes',
      reportedMimeType: file.type || 'application/x-empty',
      fileNameExtension: file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : '',
      detectedExtension: 'EMPTY',
      detectedFormat: 'Empty 0-Byte File',
      detectedMimeType: 'application/x-empty',
      databaseMimeType: 'application/x-empty',
      confidence: 'High',
      confidenceScore: 100,
      detectionMethod: 'magic_bytes',
      category: 'Code & Data',
      mimeComparison: {
        status: 'match',
        browserReportedMime: file.type || 'application/x-empty',
        detectedMime: 'application/x-empty',
        standardDatabaseMime: 'application/x-empty',
        message: 'Empty File',
        explanation: 'The file contains 0 bytes of data.',
      },
      extensionComparison: {
        status: 'unknown',
        filenameExtension: file.name.includes('.') ? '.' + file.name.split('.').pop()! : 'None',
        detectedExtension: 'None',
        message: 'Empty file payload',
        explanation: 'File has zero bytes, so no format payload or magic header exists.',
        isSpoofed: false,
      },
      signature: {
        hexSignature: '',
        asciiSignature: '',
        matchedPattern: null,
        offset: 0,
        meaning: 'Empty 0-byte file without header signature bytes.',
        sampleBytes: [],
        hexOffsetRows: [],
      },
      metadata: {
        general: { 'File Name': file.name, 'File Size': '0 Bytes' },
        rawPropertyList: [{ key: 'File Size', value: '0 Bytes', category: 'General' }],
      },
      security: {
        status: 'safe',
        badgeText: 'Empty File',
        neutralStatement: 'No malicious code can execute from an empty 0-byte payload.',
        indicators: [
          { id: 'empty', type: 'info', title: 'Zero Bytes', description: 'The uploaded file is completely empty.' },
        ],
        isExecutable: false,
        isMacroEnabled: false,
        isEncrypted: false,
        isSpoofed: false,
      },
      knowledgeNode: null,
      availableTools: [],
      diagnostics: {
        readTimeMs: 1,
        analysisTimeMs: 2,
        bytesRead: 0,
        totalFileSize: 0,
        isPartialRead: false,
        clientSideOnly: true,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // SHA256 of empty string
        analyzedAt: new Date().toISOString(),
      },
    };
    saveAnalysis(emptyAnalysis);
    return emptyAnalysis;
  }

  // 1. Read the full file once: the SHA-256 fingerprint must cover the entire
  // file (a partial read would produce a misleading hash), and the header slice
  // for magic-byte detection is derived from the same buffer.
  if (onProgress) onProgress('Reading file stream & binary header (Offset 0x0000)...', 20);
  const readStart = performance.now();
  const fullBuffer = await file.arrayBuffer();
  const headerSliceSize = Math.min(file.size, 4096);
  const headerBytes = new Uint8Array(fullBuffer.slice(0, headerSliceSize));
  const readTimeMs = Math.round(performance.now() - readStart);

  // 2. Identify Format & Magic Bytes
  if (onProgress) onProgress('Matching magic bytes & inspecting container headers...', 45);
  const detection = detectFileFormat(new Uint8Array(fullBuffer), file.name, file.type);

  // 3. Compute Cryptographic Checksum (full-file SHA-256)
  if (onProgress) onProgress('Calculating SHA-256 cryptographic fingerprint...', 65);
  const sha256Hash = await sha256Hex(fullBuffer);

  // 4. Extract Deep Metadata
  if (onProgress) onProgress('Extracting technical metadata, dimensions & codecs...', 80);
  const metadata = await extractFileMetadata(file, headerBytes, detection.detectedExtension, detection.matchedPattern?.category || 'Unknown');

  // 5. Evaluate Security & Indicators
  if (onProgress) onProgress('Assessing structural security & extension alignment...', 90);
  const security = evaluateSecurity(
    detection.detectedExtension,
    detection.matchedPattern?.category || 'Unknown',
    detection.extensionComparison,
    detection.mimeComparison,
    headerBytes,
    file.name
  );

  // 6. Connect to Knowledge Graph & Tools
  if (onProgress) onProgress('Connecting to AnyFileX Knowledge Graph & software directory...', 98);
  const cleanExt = detection.detectedExtension.toLowerCase();
  const knowledgeNode = cleanExt && cleanExt !== 'unknown' ? getFormatKnowledgeNode(cleanExt) : null;
  const availableTools = resolveAvailableTools(detection.detectedExtension, knowledgeNode);

  const totalTimeMs = Math.round(performance.now() - startTime);

  const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const analysis: FileAnalysis = {
    id: analysisId,
    fileName: file.name,
    fileSize: file.size,
    formattedSize: formatBytes(file.size),
    reportedMimeType: file.type || 'application/octet-stream',
    fileNameExtension: file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : '',
    detectedExtension: detection.detectedExtension,
    detectedFormat: detection.detectedFormat,
    detectedMimeType: detection.detectedMimeType,
    databaseMimeType: detection.databaseMimeType,
    confidence: detection.confidence,
    confidenceScore: detection.confidenceScore,
    detectionMethod: detection.detectionMethod,
    category: (detection.matchedPattern?.category as CategoryType) || 'Code & Data',
    mimeComparison: detection.mimeComparison,
    extensionComparison: detection.extensionComparison,
    signature: detection.signatureAnalysis,
    metadata,
    security,
    knowledgeNode,
    availableTools,
    diagnostics: {
      readTimeMs,
      analysisTimeMs: totalTimeMs,
      bytesRead: file.size,
      totalFileSize: file.size,
      isPartialRead: false,
      clientSideOnly: true,
      sha256Hash,
      entropy: security.entropy,
      analyzedAt: new Date().toISOString(),
    },
    rawFile: file,
  };

  saveAnalysis(analysis);
  return analysis;
}

/**
 * Creates synthetic sample files for testing without requiring user uploads
 */
export function createSampleFile(
  type: 'heic' | 'png' | 'pdf' | 'dwg' | 'zip' | 'mismatch_photo' | 'exe'
): File {
  let filename = 'sample_photo.heic';
  let bytesHex = '000000186674797068656963000000006D69663168656963';
  let mime = 'image/heic';

  if (type === 'png') {
    filename = 'graphic_logo.png';
    bytesHex = '89504E470D0A1A0A0000000D4948445200000400000003000806000000';
    mime = 'image/png';
  } else if (type === 'pdf') {
    filename = 'quarterly_report.pdf';
    bytesHex = '255044462D312E370D0A2525486561646572202F54797065202F436174616C6F67';
    mime = 'application/pdf';
  } else if (type === 'dwg') {
    filename = 'floor_plan.dwg';
    bytesHex = '41433130333200000000000000000000';
    mime = 'image/vnd.dwg';
  } else if (type === 'zip') {
    filename = 'project_archive.zip';
    bytesHex = '504B0304140000000800000021000000';
    mime = 'application/zip';
  } else if (type === 'mismatch_photo') {
    // A file named photo.jpg that actually contains PNG bytes (to test mismatch detection!)
    filename = 'photo.jpg';
    bytesHex = '89504E470D0A1A0A0000000D4948445200000200000002000806000000';
    mime = 'image/jpeg';
  } else if (type === 'exe') {
    filename = 'installer_setup.exe';
    bytesHex = '4D5A90000300000004000000FFFF0000B8000000000000004000000000000000';
    mime = 'application/x-msdownload';
  }

  const uint8 = new Uint8Array(bytesHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  const blob = new Blob([uint8], { type: mime });
  return new File([blob], filename, { type: mime, lastModified: Date.now() });
}
