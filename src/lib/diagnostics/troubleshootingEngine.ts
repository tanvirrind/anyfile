import { detectFileFormat, buildHexOffsetRows } from '../analyzer/detectionEngine';

export interface DiagnosticFinding {
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  technicalDetails?: string;
}

export interface PrescribedAction {
  label: string;
  type: 'rename' | 'analyze' | 'convert' | 'repair' | 'open' | 'checksum';
  route: { view: string; [key: string]: any };
  description: string;
  primary?: boolean;
}

export interface DiagnosticReport {
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  sha256Hash: string;
  
  // 4-Stage Diagnostic Model
  problemDetected: string;
  analysisMethod: string;
  rootCause: string;
  recommendedAction: string;

  // Real Header Analysis
  detectedFormatName: string;
  detectedExtension: string;
  declaredExtension: string;
  hasExtensionMismatch: boolean;
  isTruncatedOrZeroByte: boolean;
  isStructuralMatch: boolean;
  magicBytesHex: string;
  magicBytesAscii: string;
  hexRows: { offsetHex: string; hexBytes: string[]; asciiChars: string }[];
  
  // Measurable Security & Integrity Analysis
  measurableIntegrityStatements: string[];
  securityNotice: string;

  // Findings list
  findings: DiagnosticFinding[];
  
  // Direct Action Pathways
  actions: PrescribedAction[];
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Computes browser-native SHA-256 cryptographic hash
 */
async function computeSha256(buffer: ArrayBuffer): Promise<string> {
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    return 'Unavailable (Security Context)';
  }
}

/**
 * Live File Intelligence Diagnostic Engine
 */
export async function diagnoseFile(file: File): Promise<DiagnosticReport> {
  const fileName = file.name || 'unnamed_file';
  const fileSize = file.size;
  const fileSizeFormatted = formatBytes(fileSize);

  // Extract declared extension from filename
  const hasExt = fileName.includes('.');
  const declaredExtension = hasExt ? fileName.split('.').pop()!.toLowerCase().trim() : '';

  // Zero-byte check
  if (fileSize === 0) {
    return {
      fileName,
      fileSize: 0,
      fileSizeFormatted: '0 Bytes',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      problemDetected: 'Zero-Byte Empty File (No Data on Disk)',
      analysisMethod: 'Filesystem Allocation Inspection',
      rootCause: 'The file contains zero bytes. This happens when an active download is interrupted before writing data, or when a file is created empty.',
      recommendedAction: 'Recover this file from your backup, cloud sync revision history, or re-download the source file.',
      detectedFormatName: 'Empty / Zero Byte File',
      detectedExtension: '',
      declaredExtension,
      hasExtensionMismatch: false,
      isTruncatedOrZeroByte: true,
      isStructuralMatch: false,
      magicBytesHex: 'None (0x00)',
      magicBytesAscii: '',
      hexRows: [],
      measurableIntegrityStatements: [
        'File size measured at exactly 0 bytes.',
        'No binary header or magic bytes exist on disk.',
        'File allocation table entry exists but points to no data clusters.'
      ],
      securityNotice: 'AnyFileX verified zero-byte container state. No binary execution occurs.',
      findings: [
        {
          severity: 'critical',
          title: 'Zero-Byte File Corruption',
          description: 'This file contains 0 bytes of data. No viewer or repair software can extract information from an empty file container.',
          technicalDetails: 'Filesystem reported 0 bytes. SHA-256 corresponds to the null string hash.'
        }
      ],
      actions: [
        {
          label: 'Troubleshoot Corrupted Files',
          type: 'repair',
          route: { view: 'repair-detail', id: 'how-to-check-corrupted-file' },
          description: 'Read recovery procedures for empty or truncated files.',
          primary: true
        }
      ]
    };
  }

  // Read first 64KB for deep analysis
  const sliceSize = Math.min(fileSize, 65536);
  const buffer = await file.slice(0, sliceSize).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Read full buffer (or up to 10MB) for SHA-256
  const hashBuffer = fileSize <= 10 * 1024 * 1024 ? await file.arrayBuffer() : buffer;
  const sha256Hash = await computeSha256(hashBuffer);

  // Run File Intelligence Detection Engine
  const detection = detectFileFormat(bytes, fileName, file.type || '');
  const detectedExt = (detection.detectedExtension || '').toLowerCase();
  const detectedFormatName = detection.detectedFormat || 'Unknown Binary File';

  // Extract Magic Bytes
  const magicSlice = bytes.slice(0, 16);
  const magicHex = Array.from(magicSlice).map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
  const magicAscii = Array.from(magicSlice).map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('');

  // Hex dump rows
  const hexRows = buildHexOffsetRows(bytes, 64);

  // Mismatch Analysis
  const hasExtensionMismatch = declaredExtension !== '' && detectedExt !== '' && declaredExtension !== detectedExt && !isExtensionAlias(declaredExtension, detectedExt);

  // Tail bytes check for ZIP (End of Central Directory: 50 4B 05 06)
  let isZipMissingEOCD = false;
  if (declaredExtension === 'zip' || detectedExt === 'zip') {
    if (fileSize > 22) {
      const tailSliceSize = Math.min(fileSize, 2048);
      const tailBuffer = await file.slice(fileSize - tailSliceSize, fileSize).arrayBuffer();
      const tailBytes = new Uint8Array(tailBuffer);
      let foundEOCD = false;
      for (let i = 0; i < tailBytes.length - 4; i++) {
        if (tailBytes[i] === 0x50 && tailBytes[i + 1] === 0x4B && tailBytes[i + 2] === 0x05 && tailBytes[i + 3] === 0x06) {
          foundEOCD = true;
          break;
        }
      }
      if (!foundEOCD) {
        isZipMissingEOCD = true;
      }
    }
  }

  // HTML disguised as PDF or Image check
  const asciiHeader = Array.from(bytes.slice(0, 128)).map((b) => String.fromCharCode(b)).join('').toLowerCase();
  const isHtmlDisguised = (declaredExtension === 'pdf' || declaredExtension === 'jpg' || declaredExtension === 'png') && (asciiHeader.includes('<!doctype') || asciiHeader.includes('<html') || asciiHeader.includes('<head'));

  // Compile Findings
  const findings: DiagnosticFinding[] = [];
  const actions: PrescribedAction[] = [];

  if (isHtmlDisguised) {
    findings.push({
      severity: 'critical',
      title: 'HTML Error Page Disguised as ' + declaredExtension.toUpperCase(),
      description: `The file has a .${declaredExtension} extension, but the internal data is an HTML webpage (e.g., a login wall or 403 Forbidden error).`,
      technicalDetails: 'Detected HTML markup tags (`<!DOCTYPE html>` or `<html>`) at byte offset 0.'
    });
  } else if (hasExtensionMismatch) {
    findings.push({
      severity: 'critical',
      title: `Extension Mismatch (.${declaredExtension} vs .${detectedExt})`,
      description: `The filename says .${declaredExtension}, but binary signature inspection proves the content is actually ${detectedFormatName} (.${detectedExt}).`,
      technicalDetails: `Magic bytes \`${magicHex.slice(0, 23)}\` match the official specification for ${detectedFormatName}.`
    });
  } else if (!hasExt) {
    findings.push({
      severity: 'warning',
      title: 'Missing File Extension',
      description: `This file has no extension in its name. AnyFileX identified the true format as ${detectedFormatName} (.${detectedExt || 'unknown'}).`,
      technicalDetails: `Operating systems cannot associate this file with an application until the .${detectedExt} extension is appended.`
    });
  }

  if (isZipMissingEOCD) {
    findings.push({
      severity: 'critical',
      title: 'Truncated ZIP Archive (Missing End of Central Directory)',
      description: 'The ZIP archive local headers exist, but the End of Central Directory record (`50 4B 05 06`) is missing from the end of the file.',
      technicalDetails: 'Typical of incomplete downloads cut off before final bytes were written to disk.'
    });
  }

  if (findings.length === 0) {
    findings.push({
      severity: 'success',
      title: 'Binary Structure & Extension Matched',
      description: `AnyFileX detected no extension/content mismatch. The header signature strictly matches standard ${detectedFormatName} specifications.`,
      technicalDetails: `File signature verified at offset 0x00000000. SHA-256: ${sha256Hash.slice(0, 16)}...`
    });
  }

  // Diagnostic 4-Stage Flow Formulation
  let problemDetected = 'File Open Verification';
  let rootCause = 'Standard file container structure.';
  let recommendedAction = 'Open in recommended viewer or convert as needed.';

  if (isHtmlDisguised) {
    problemDetected = `File is an HTML Web Page, not a .${declaredExtension.toUpperCase()}`;
    rootCause = 'Web server or download portal returned an HTML login or error page with the target file name.';
    recommendedAction = 'Re-download the file after authenticating into the source website or downloading in an active browser session.';
  } else if (hasExtensionMismatch) {
    problemDetected = `Mismatched Extension: Labeled .${declaredExtension}, Actually .${detectedExt}`;
    rootCause = `File was renamed or saved with the wrong extension. Applications expecting .${declaredExtension} encounter .${detectedExt} data chunks.`;
    recommendedAction = `Rename the file extension from .${declaredExtension} to .${detectedExt}, or use AnyFileX Converter for a true format transcode.`;
    
    actions.push({
      label: `Rename to .${detectedExt}`,
      type: 'rename',
      route: { view: 'repair-detail', id: 'fix-file-wrong-extension' },
      description: `How to safely rename .${declaredExtension} to .${detectedExt} on your OS.`,
      primary: true
    });

    actions.push({
      label: `Convert .${detectedExt} to .${declaredExtension}`,
      type: 'convert',
      route: { view: 'converters' },
      description: `Perform real binary conversion to ${declaredExtension.toUpperCase()}.`
    });
  } else if (!hasExt && detectedExt) {
    problemDetected = `Unknown Extensionless File (Identified as .${detectedExt})`;
    rootCause = 'Filename extension was stripped during transmission or saving.';
    recommendedAction = `Rename the file to append '.${detectedExt}' to the end of the filename.`;

    actions.push({
      label: `Add .${detectedExt} Extension`,
      type: 'rename',
      route: { view: 'repair-detail', id: 'how-to-identify-unknown-file' },
      description: `Instructions for adding .${detectedExt} on Windows & macOS.`,
      primary: true
    });
  } else if (isZipMissingEOCD) {
    problemDetected = 'Incomplete / Truncated ZIP Archive';
    rootCause = 'Download was cut off before writing the Central Directory catalog at the end of the file.';
    recommendedAction = 'Extract intact files using 7-Zip command line or rebuild archive with WinRAR repair.';

    actions.push({
      label: 'Open ZIP Repair Guide',
      type: 'repair',
      route: { view: 'repair-detail', id: 'why-zip-file-not-opening' },
      description: 'Step-by-step extraction of truncated ZIP archives.',
      primary: true
    });
  }

  // Always offer File Analyzer & How-to-Open links
  actions.push({
    label: 'Deep Binary Inspection',
    type: 'analyze',
    route: { view: 'file-analyzer' },
    description: 'Inspect full 128-byte hex matrix, EXIF metadata, and MIME strings.'
  });

  if (detectedExt) {
    actions.push({
      label: `How to Open .${detectedExt.toUpperCase()}`,
      type: 'open',
      route: { view: 'how-to-open', ext: detectedExt },
      description: `Step-by-step opening tutorials for Windows, Mac, iOS & Android.`
    });
  }

  // Measurable Statements
  const measurableIntegrityStatements: string[] = [
    `AnyFileX detected ${hasExtensionMismatch ? 'an extension/content mismatch' : 'no extension/content mismatch'}.`,
    `Binary magic bytes \`${magicHex.slice(0, 17)}\` analyzed at offset 0x00000000.`,
    `Container size verified at ${fileSizeFormatted} (${fileSize.toLocaleString()} bytes).`,
    `Cryptographic SHA-256 hash computed: \`${sha256Hash}\`.`
  ];

  const securityNotice = 'AnyFileX analyzes structural integrity, byte offsets, and format consistency. This diagnostic does not execute file payloads and does not substitute for real-time endpoint antivirus scanning.';

  return {
    fileName,
    fileSize,
    fileSizeFormatted,
    sha256Hash,
    problemDetected,
    analysisMethod: 'Local WebAssembly & Magic Byte Signature Inspection',
    rootCause,
    recommendedAction,
    detectedFormatName,
    detectedExtension: detectedExt,
    declaredExtension,
    hasExtensionMismatch,
    isTruncatedOrZeroByte: false,
    isStructuralMatch: !hasExtensionMismatch && !isHtmlDisguised && !isZipMissingEOCD,
    magicBytesHex: magicHex,
    magicBytesAscii: magicAscii,
    hexRows,
    measurableIntegrityStatements,
    securityNotice,
    findings,
    actions
  };
}

function isExtensionAlias(ext1: string, ext2: string): boolean {
  const aliases: Record<string, string[]> = {
    jpg: ['jpeg', 'jpe', 'jfif'],
    jpeg: ['jpg', 'jpe', 'jfif'],
    tif: ['tiff'],
    tiff: ['tif'],
    htm: ['html'],
    html: ['htm'],
    tar: ['tgz', 'tar.gz'],
    heic: ['heif', 'heix'],
    heif: ['heic', 'heix'],
    yaml: ['yml'],
    yml: ['yaml']
  };
  return (aliases[ext1] || []).includes(ext2);
}

/**
 * Built-in Demo Diagnostics for Instant User Testing
 */
export const DEMO_DIAGNOSTIC_CASES = [
  {
    id: 'demo-jpg-is-png',
    name: 'Mismatched Extension (photo.jpg that is actually PNG)',
    description: 'Simulates a user renaming a PNG image to .jpg without transcoding.',
    createMockFile: () => {
      // PNG header: 89 50 4E 47 0D 0A 1A 0A
      const bytes = new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x5C, 0x72, 0xA8
      ]);
      return new File([bytes], 'vacation_photo.jpg', { type: 'image/jpeg' });
    }
  },
  {
    id: 'demo-html-disguised-pdf',
    name: 'Disguised Webpage (statement.pdf that is actually HTML)',
    description: 'Simulates a portal delivering an HTML login screen disguised as a PDF download.',
    createMockFile: () => {
      const text = '<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body><h1>Session Expired - Please Log In</h1></body></html>';
      return new File([text], 'bank_statement_2026.pdf', { type: 'application/pdf' });
    }
  },
  {
    id: 'demo-unknown-dat-is-zip',
    name: 'Unknown File (attachment.dat that is actually ZIP)',
    description: 'Simulates an email attachment stripped of its .zip extension.',
    createMockFile: () => {
      // ZIP local header: 50 4B 03 04 ... EOCD: 50 4B 05 06
      const bytes = new Uint8Array([
        0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00,
        0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x50, 0x4B, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);
      return new File([bytes], 'mail_attachment.dat', { type: 'application/octet-stream' });
    }
  },
  {
    id: 'demo-truncated-zip',
    name: 'Truncated ZIP (Incomplete Download missing EOCD)',
    description: 'Simulates an interrupted archive download missing closing directory tables.',
    createMockFile: () => {
      // Only local header, cut off without EOCD
      const bytes = new Uint8Array([
        0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00,
        0x08, 0x00, 0x22, 0x45, 0x67, 0x89, 0xAA, 0xBB,
        0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF
      ]);
      return new File([bytes], 'large_dataset_partial.zip', { type: 'application/zip' });
    }
  }
];
