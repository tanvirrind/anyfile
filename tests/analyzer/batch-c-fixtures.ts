/**
 * Realistic FileAnalysis fixtures for Batch C report-UI tests.
 * Each fixture exercises one report scenario end to end.
 */
import type {
  FileAnalysis,
  SecurityIndicatorItem,
  AvailableToolAction,
} from '../../src/lib/analyzer/types';

function base(overrides: Partial<FileAnalysis> = {}): FileAnalysis {
  return {
    id: 'fixture-id',
    fileName: 'file.bin',
    fileSize: 1024,
    formattedSize: '1 KB',
    reportedMimeType: 'application/octet-stream',
    fileNameExtension: 'bin',
    detectedExtension: 'unknown',
    detectedFormat: 'Unknown format',
    detectedMimeType: 'application/octet-stream',
    databaseMimeType: 'application/octet-stream',
    confidence: 'Unknown',
    confidenceScore: 40,
    detectionMethod: 'unknown',
    category: 'Documents',
    mimeComparison: {
      status: 'unknown',
      browserReportedMime: '',
      detectedMime: '',
      standardDatabaseMime: '',
      message: '',
      explanation: '',
    },
    extensionComparison: {
      status: 'unknown',
      filenameExtension: '',
      detectedExtension: '',
      message: '',
      explanation: '',
      isSpoofed: false,
    },
    signature: {
      hexSignature: '',
      asciiSignature: '',
      matchedPattern: null,
      offset: 0,
      meaning: '',
      sampleBytes: [],
      hexOffsetRows: [],
    },
    metadata: { general: {}, rawPropertyList: [] },
    security: {
      status: 'safe',
      badgeText: 'Safe',
      neutralStatement: 'Nothing suspicious was found in this file.',
      indicators: [],
      isExecutable: false,
      isMacroEnabled: false,
      isEncrypted: false,
      isSpoofed: false,
    },
    knowledgeNode: null,
    availableTools: [],
    diagnostics: {
      readTimeMs: 2,
      analysisTimeMs: 30,
      bytesRead: 1024,
      totalFileSize: 1024,
      isPartialRead: false,
      clientSideOnly: true,
      sha256Hash: 'ab12cd34',
      analyzedAt: new Date('2026-10-17T00:00:00Z').toISOString(),
    },
    ...overrides,
  };
}

function indicator(
  id: string,
  type: SecurityIndicatorItem['type'],
  title: string,
  description: string
): SecurityIndicatorItem {
  return { id, type, title, description };
}

/** DOCM: zip structure + macro warning + honest truncation. */
export function docmFixture(): FileAnalysis {
  return base({
    id: 'fixture-docm',
    fileName: 'report.docm',
    fileSize: 48210,
    formattedSize: '48.21 KB',
    fileNameExtension: 'docm',
    detectedExtension: 'docm',
    detectedFormat: 'Word Macro-Enabled Document',
    detectedMimeType: 'application/vnd.ms-word.document.macroEnabled.12',
    confidence: 'High',
    confidenceScore: 97,
    detectionMethod: 'magic_bytes',
    category: 'Documents',
    extensionComparison: {
      status: 'match',
      filenameExtension: 'docm',
      detectedExtension: 'docm',
      message: 'Extension matches the detected format.',
      explanation: '',
      isSpoofed: false,
    },
    signature: {
      hexSignature: '50 4B 03 04',
      asciiSignature: 'PK..',
      matchedPattern: null,
      offset: 0,
      meaning: 'Standard ZIP archive header (OOXML container)',
      sampleBytes: [80, 75, 3, 4],
      hexOffsetRows: [
        { offsetHex: '0x00000000', hexBytes: ['50', '4B', '03', '04'], asciiChars: 'PK..' },
      ],
    },
    security: {
      status: 'warning',
      badgeText: 'Warning — macros detected',
      neutralStatement: 'This document contains executable macro code.',
      indicators: [
        indicator(
          'macro_vba',
          'warning',
          'VBA macros detected',
          'This document contains a VBA macro project (vbaProject.bin). Macros can run code automatically when the document opens.'
        ),
      ],
      isExecutable: false,
      isMacroEnabled: true,
      isEncrypted: false,
      isSpoofed: false,
    },
    structure: {
      family: 'zip',
      available: true,
      notes: ['Entries were read from the central directory; none were decompressed.'],
      zip: {
        entries: [
          { name: '[Content_Types].xml', compressedSize: 400, uncompressedSize: 900, isDirectory: false },
          { name: 'word/document.xml', compressedSize: 1200, uncompressedSize: 8000, isDirectory: false },
          { name: 'word/vbaProject.bin', compressedSize: 3000, uncompressedSize: 12000, isDirectory: false },
        ],
        totalEntries: 3,
        truncated: false,
        containerKind: 'docm',
        hasMacros: true,
        executableEntries: [],
        riskyEntryCount: 0,
      },
    },
    availableTools: [
      {
        id: 'how_to_open_docm',
        title: 'How to Open .DOCM Files',
        description: 'Step-by-step instructions.',
        actionType: 'open_guide',
        route: { view: 'how-to-open', ext: 'docm' },
        badge: 'Guide',
        iconName: 'HelpCircle',
        isPrimary: true,
      } as AvailableToolAction,
    ],
    diagnostics: {
      readTimeMs: 2,
      analysisTimeMs: 40,
      bytesRead: 48210,
      totalFileSize: 48210,
      isPartialRead: false,
      clientSideOnly: true,
      sha256Hash: 'de ad'.replace(' ', ''),
      md5Hash: 'md5abc',
      entropy: 7.82,
      analyzedAt: new Date('2026-10-17T00:00:00Z').toISOString(),
    },
  });
}

/** JPEG with real GPS + camera EXIF findings. */
export function jpegGpsFixture(): FileAnalysis {
  return base({
    id: 'fixture-jpeg',
    fileName: 'photo.jpg',
    fileSize: 2451000,
    formattedSize: '2.45 MB',
    fileNameExtension: 'jpg',
    detectedExtension: 'jpg',
    detectedFormat: 'JPEG Image',
    detectedMimeType: 'image/jpeg',
    confidence: 'High',
    confidenceScore: 99,
    detectionMethod: 'magic_bytes',
    category: 'Images',
    extensionComparison: {
      status: 'match',
      filenameExtension: 'jpg',
      detectedExtension: 'jpg',
      message: 'Extension matches the detected format.',
      explanation: '',
      isSpoofed: false,
    },
    metadata: {
      general: {},
      image: {
        width: 4032,
        height: 3024,
        megapixels: '12.2 MP',
        cameraMake: 'Apple',
        cameraModel: 'iPhone 15 Pro',
        dateTaken: '2024:05:01 12:00:00',
        gpsLatitude: 37.7749,
        gpsLongitude: -122.4194,
      },
      rawPropertyList: [],
    },
    security: {
      status: 'caution',
      badgeText: 'Caution — location data',
      neutralStatement: 'This photo carries GPS coordinates and device information.',
      indicators: [
        indicator(
          'privacy_gps',
          'caution',
          'Embedded GPS Coordinates',
          'Precise location data (37.7749, -122.4194) is embedded in this file’s metadata.'
        ),
      ],
      isExecutable: false,
      isMacroEnabled: false,
      isEncrypted: false,
      isSpoofed: false,
    },
    structure: {
      family: 'unsupported',
      available: false,
      reason: 'Images are analyzed for metadata rather than container structure.',
      notes: [],
    },
  });
}

/** PNG bytes named .jpg — mismatch, not spoofed. */
export function mismatchFixture(): FileAnalysis {
  return base({
    id: 'fixture-mismatch',
    fileName: 'report.jpg',
    fileSize: 2048,
    formattedSize: '2 KB',
    fileNameExtension: 'jpg',
    detectedExtension: 'png',
    detectedFormat: 'PNG Image',
    detectedMimeType: 'image/png',
    confidence: 'High',
    confidenceScore: 98,
    detectionMethod: 'magic_bytes',
    category: 'Images',
    extensionComparison: {
      status: 'mismatch',
      filenameExtension: 'jpg',
      detectedExtension: 'png',
      message: 'The .jpg extension does not match the detected PNG format.',
      explanation: 'The file header is a standard PNG signature.',
      isSpoofed: false,
    },
    mimeComparison: {
      status: 'mismatch',
      browserReportedMime: 'image/jpeg',
      detectedMime: 'image/png',
      standardDatabaseMime: 'image/png',
      message: 'Browser-reported type differs from detected type.',
      explanation: '',
    },
    security: {
      status: 'safe',
      badgeText: 'Safe',
      neutralStatement: 'The mismatch is a harmless mislabel — PNG is a safe image format.',
      indicators: [],
      isExecutable: false,
      isMacroEnabled: false,
      isEncrypted: false,
      isSpoofed: false,
    },
  });
}

/** EXE disguised as .pdf — spoofed, danger. */
export function spoofedExeFixture(): FileAnalysis {
  return base({
    id: 'fixture-spoofed',
    fileName: 'invoice.pdf',
    fileSize: 81920,
    formattedSize: '81.92 KB',
    fileNameExtension: 'pdf',
    detectedExtension: 'exe',
    detectedFormat: 'Windows Executable',
    detectedMimeType: 'application/x-msdownload',
    confidence: 'High',
    confidenceScore: 96,
    detectionMethod: 'magic_bytes',
    category: 'System & Executables',
    extensionComparison: {
      status: 'mismatch',
      filenameExtension: 'pdf',
      detectedExtension: 'exe',
      message: 'This file claims to be a PDF but is actually a Windows executable.',
      explanation: 'The MZ header is characteristic of executables, not documents.',
      isSpoofed: true,
    },
    security: {
      status: 'warning',
      badgeText: 'Warning — disguised executable',
      neutralStatement: 'This file is an executable disguised with a document extension.',
      indicators: [
        indicator(
          'spoofed_executable',
          'danger',
          'Executable disguised as a document',
          'The file is a Windows executable (.exe) wearing a .pdf name. Never open it by double-clicking.'
        ),
      ],
      isExecutable: true,
      isMacroEnabled: false,
      isEncrypted: false,
      isSpoofed: true,
    },
    availableTools: [
      {
        id: 'general_magic_bytes',
        title: 'Magic Byte Signature Search',
        description: 'Search our database.',
        actionType: 'open_guide',
        route: { view: 'magic-byte-detector' },
        badge: 'Database',
        iconName: 'Cpu',
        isPrimary: true,
      } as AvailableToolAction,
    ],
  });
}

/** Plain safe TXT — no structure, no privacy, no indicators. */
export function txtFixture(): FileAnalysis {
  return base({
    id: 'fixture-txt',
    fileName: 'notes.txt',
    fileSize: 512,
    formattedSize: '512 Bytes',
    fileNameExtension: 'txt',
    detectedExtension: 'txt',
    detectedFormat: 'Plain Text File',
    detectedMimeType: 'text/plain',
    confidence: 'Medium',
    confidenceScore: 70,
    detectionMethod: 'text_heuristic',
    extensionComparison: {
      status: 'match',
      filenameExtension: 'txt',
      detectedExtension: 'txt',
      message: 'Extension matches the detected format.',
      explanation: '',
      isSpoofed: false,
    },
    metadata: {
      general: {},
      document: { lineCount: 12, characterCount: 400 },
      rawPropertyList: [],
    },
    structure: {
      family: 'unsupported',
      available: false,
      reason: 'Plain text files have no container structure to inspect.',
      notes: [],
    },
    diagnostics: {
      readTimeMs: 1,
      analysisTimeMs: 8,
      bytesRead: 512,
      totalFileSize: 512,
      isPartialRead: false,
      clientSideOnly: true,
      sha256Hash: 'txtsha',
      entropy: 4.31,
      analyzedAt: new Date('2026-10-17T00:00:00Z').toISOString(),
    },
  });
}
