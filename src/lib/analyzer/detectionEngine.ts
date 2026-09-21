import {
  ConfidenceLevel,
  DetectionMethod,
  ExtensionComparisonResult,
  HexOffsetRow,
  MimeComparisonResult,
  SignatureAnalysis,
  SignaturePattern,
} from './types';
import { COMPREHENSIVE_SIGNATURES } from './signatures';
import { getOrGenerateExtensionInfo } from '../seo/extensionGenerator';

export interface RawDetectionResult {
  detectedExtension: string;
  detectedFormat: string;
  detectedMimeType: string;
  databaseMimeType: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  detectionMethod: DetectionMethod;
  matchedPattern: SignaturePattern | null;
  signatureAnalysis: SignatureAnalysis;
  mimeComparison: MimeComparisonResult;
  extensionComparison: ExtensionComparisonResult;
}

/**
 * Builds 16-byte hex dump rows for raw binary inspection
 */
export function buildHexOffsetRows(bytes: Uint8Array, maxBytes = 128): HexOffsetRow[] {
  const rows: HexOffsetRow[] = [];
  const limit = Math.min(bytes.length, maxBytes);

  for (let i = 0; i < limit; i += 16) {
    const slice = bytes.slice(i, i + 16);
    const hexBytes: string[] = [];
    let asciiChars = '';

    for (let j = 0; j < slice.length; j++) {
      const b = slice[j];
      hexBytes.push(b.toString(16).padStart(2, '0').toUpperCase());
      asciiChars += b >= 32 && b <= 126 ? String.fromCharCode(b) : '.';
    }

    const offsetHex = '0x' + i.toString(16).padStart(8, '0').toUpperCase();
    rows.push({ offsetHex, hexBytes, asciiChars });
  }

  return rows;
}

/**
 * Helper to match byte array against hex signature string at specified offset
 */
function matchHexPattern(bytes: Uint8Array, hexPattern: string, offset: number): boolean {
  const hexParts = hexPattern.split(' ').filter(Boolean);
  if (bytes.length < offset + hexParts.length) {
    return false;
  }

  for (let i = 0; i < hexParts.length; i++) {
    const expected = parseInt(hexParts[i], 16);
    if (bytes[offset + i] !== expected) {
      return false;
    }
  }

  return true;
}

/**
 * Case-sensitive ASCII substring search over a byte range.
 */
function containsAscii(bytes: Uint8Array, needle: string, start: number, end: number): boolean {
  const n = needle.length;
  const upper = Math.min(end, bytes.length);
  if (upper - start < n) return false;
  outer: for (let i = start; i <= upper - n; i++) {
    for (let j = 0; j < n; j++) {
      if (bytes[i + j] !== needle.charCodeAt(j)) continue outer;
    }
    return true;
  }
  return false;
}

/**
 * Determines the concrete format of a PKZIP container from its contents:
 * - EPUB stores an uncompressed "mimetype" entry near the start of the file.
 * - DOCX/XLSX/PPTX/APK store their entry names in the central directory at the end.
 */
function detectZipSubtype(bytes: Uint8Array): string | null {
  const headEnd = Math.min(bytes.length, 1024);
  if (containsAscii(bytes, 'application/epub+zip', 0, headEnd)) {
    return 'epub';
  }

  const tailStart = Math.max(0, bytes.length - 256 * 1024);
  const markers: Array<[string, string]> = [
    ['apk', 'AndroidManifest.xml'],
    ['docx', 'word/document.xml'],
    ['xlsx', 'xl/workbook.xml'],
    ['pptx', 'ppt/presentation.xml'],
  ];
  for (const [id, marker] of markers) {
    if (containsAscii(bytes, marker, tailStart, bytes.length)) {
      return id;
    }
  }
  return null;
}

/**
 * Primary 4-Stage File Identification Pipeline
 *
 * Priority:
 * 1. File Contents / Magic Bytes
 * 2. Container / Sub-Format Detection (Zip, ftyp, RIFF, EBML, OLE)
 * 3. MIME Detection
 * 4. Filename Extension
 */
export function detectFileFormat(
  bytes: Uint8Array,
  fileName: string,
  browserReportedMime: string
): RawDetectionResult {
  const cleanFilename = fileName || 'unknown_file';
  const hasExt = cleanFilename.includes('.');
  const filenameExt = hasExt ? cleanFilename.split('.').pop()!.trim().toLowerCase() : '';
  const upperFilenameExt = filenameExt.toUpperCase();

  // Convert first 512 bytes to ascii string for container inspection
  let asciiStream = '';
  const hexArray: string[] = [];
  const inspectLimit = Math.min(bytes.length, 512);

  for (let i = 0; i < inspectLimit; i++) {
    const b = bytes[i];
    hexArray.push(b.toString(16).padStart(2, '0').toUpperCase());
    asciiStream += b >= 32 && b <= 126 ? String.fromCharCode(b) : '.';
  }

  const hexOffsetRows = buildHexOffsetRows(bytes, 128);
  const hexSignature = hexArray.slice(0, 16).join(' ');
  const asciiSignature = asciiStream.slice(0, 32);

  // Stage 1 & 2: Inspect Magic Bytes & Containers
  let matchedPattern: SignaturePattern | null = null;
  let detectionMethod: DetectionMethod = 'unknown';
  let confidence: ConfidenceLevel = 'Unknown';
  let confidenceScore = 20;

  // Container Specific Check 1: PKZIP Family (DOCX, XLSX, PPTX, APK, EPUB, plain ZIP).
  // Sub-type is determined from the archive's actual contents (central-directory entry
  // names / EPUB mimetype), not the filename extension, so renamed archives are detected
  // correctly and mismatched extensions surface as spoofs in the comparison step below.
  if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
    detectionMethod = 'container_inspection';
    confidence = 'High';

    const contentSubtype = detectZipSubtype(bytes);
    if (contentSubtype) {
      matchedPattern = COMPREHENSIVE_SIGNATURES.find((s) => s.id === contentSubtype) || null;
      confidenceScore = 98;
    } else if (['docx', 'xlsx', 'pptx', 'apk', 'epub'].includes(filenameExt)) {
      // No content marker found — fall back to the extension as a weaker signal.
      // (The extension-comparison step below flags the mismatch if content disagrees.)
      matchedPattern = COMPREHENSIVE_SIGNATURES.find((s) => s.id === filenameExt) || null;
      confidenceScore = 88;
    } else {
      matchedPattern = COMPREHENSIVE_SIGNATURES.find((s) => s.id === 'zip') || null;
      confidenceScore = 99;
    }
  }

  // Container Specific Check 2: ISOBMFF "ftyp" Box at offset 4 (HEIC, AVIF, MP4, MOV, M4A)
  else if (bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    detectionMethod = 'container_inspection';
    confidence = 'High';
    const brandSlice = asciiStream.slice(8, 24).toLowerCase();

    if (brandSlice.includes('heic') || brandSlice.includes('mif1') || brandSlice.includes('hevc') || filenameExt === 'heic') {
      matchedPattern = COMPREHENSIVE_SIGNATURES.find((s) => s.id === 'heic') || null;
      confidenceScore = 99;
    } else if (brandSlice.includes('avif') || brandSlice.includes('avis') || filenameExt === 'avif') {
      matchedPattern = COMPREHENSIVE_SIGNATURES.find((s) => s.id === 'avif') || null;
      confidenceScore = 99;
    } else if (brandSlice.includes('qt') || filenameExt === 'mov') {
      matchedPattern = COMPREHENSIVE_SIGNATURES.find((s) => s.id === 'mov') || null;
      confidenceScore = 99;
    } else {
      matchedPattern = COMPREHENSIVE_SIGNATURES.find((s) => s.id === 'mp4') || null;
      confidenceScore = 99;
    }
  }

  // Container Specific Check 3: RIFF (WEBP, WAV, AVI)
  else if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    detectionMethod = 'container_inspection';
    confidence = 'High';
    const formType = asciiStream.slice(8, 12);

    if (formType === 'WEBP' || filenameExt === 'webp') {
      matchedPattern = COMPREHENSIVE_SIGNATURES.find((s) => s.id === 'webp') || null;
      confidenceScore = 99;
    } else if (formType === 'WAVE' || filenameExt === 'wav') {
      matchedPattern = COMPREHENSIVE_SIGNATURES.find((s) => s.id === 'wav') || null;
      confidenceScore = 99;
    }
  }

  // Scan all other explicit magic byte signatures
  if (!matchedPattern) {
    for (const sig of COMPREHENSIVE_SIGNATURES) {
      if (matchHexPattern(bytes, sig.magicBytesHex, sig.offset)) {
        if (sig.secondaryCheck) {
          if (sig.secondaryCheck(bytes, asciiStream, filenameExt)) {
            matchedPattern = sig;
            detectionMethod = 'magic_bytes';
            confidence = sig.confidence;
            confidenceScore = 96;
            break;
          }
        } else {
          matchedPattern = sig;
          detectionMethod = 'magic_bytes';
          confidence = sig.confidence;
          confidenceScore = 96;
          break;
        }
      }
    }
  }

  // Stage 3 & 4: Text Heuristics / MIME / Extension Fallback
  if (!matchedPattern) {
    // Check if plain text / json / xml / csv / html
    const isPrintableAscii = bytes.length > 0 && Array.from(bytes.slice(0, Math.min(bytes.length, 64))).every(
      (b) => (b >= 32 && b <= 126) || b === 9 || b === 10 || b === 13
    );

    if (isPrintableAscii) {
      const textSample = asciiStream.trim();
      if (textSample.startsWith('{') || textSample.startsWith('[')) {
        detectionMethod = 'text_heuristic';
        confidence = 'Medium';
        confidenceScore = 80;
        matchedPattern = {
          id: 'json',
          name: 'JavaScript Object Notation Data',
          extension: 'JSON',
          category: 'Code & Data',
          mimeType: 'application/json',
          magicBytesHex: '7B / 5B',
          offset: 0,
          confidence: 'Medium',
          description: 'Lightweight human-readable structured data interchange standard formatted as key-value pairs or arrays.',
          meaning: 'Open brace "{" or open bracket "[" beginning a JSON object or array structure.',
          asciiRepresentation: '{ / [',
        };
      } else if (textSample.toLowerCase().startsWith('<!doctype html') || textSample.toLowerCase().startsWith('<html')) {
        detectionMethod = 'text_heuristic';
        confidence = 'High';
        confidenceScore = 95;
        matchedPattern = {
          id: 'html',
          name: 'HyperText Markup Language',
          extension: 'HTML',
          category: 'Code & Data',
          mimeType: 'text/html',
          magicBytesHex: '3C 21 44 4F 43 54 59 50 45',
          offset: 0,
          confidence: 'High',
          description: 'Standard document markup language for web pages formatted with HTML tags and elements.',
          meaning: 'HTML DOCTYPE or root HTML tag declaration.',
          asciiRepresentation: '<!DOCTYPE',
        };
      } else if (textSample.startsWith('<?xml')) {
        detectionMethod = 'text_heuristic';
        confidence = 'Medium';
        confidenceScore = 85;
        matchedPattern = {
          id: 'xml',
          name: 'Extensible Markup Language',
          extension: 'XML',
          category: 'Code & Data',
          mimeType: 'application/xml',
          magicBytesHex: '3C 3F 78 6D 6C',
          offset: 0,
          confidence: 'Medium',
          description: 'Generic hierarchical structured document format defined by W3C markup specifications.',
          meaning: 'XML declaration prolog "<?xml version=".',
          asciiRepresentation: '<?xml',
        };
      } else if (upperFilenameExt === 'CSV' || (textSample.includes(',') && textSample.includes('\n'))) {
        detectionMethod = 'text_heuristic';
        confidence = 'Medium';
        confidenceScore = 75;
        matchedPattern = {
          id: 'csv',
          name: 'Comma-Separated Values Data',
          extension: 'CSV',
          category: 'Code & Data',
          mimeType: 'text/csv',
          magicBytesHex: 'Text ASCII',
          offset: 0,
          confidence: 'Medium',
          description: 'Plain text tabular dataset with rows separated by line breaks and columns delimited by commas.',
          meaning: 'ASCII delimited text stream containing rows of comma-separated tabular records.',
          asciiRepresentation: 'ASCII,CSV',
        };
      } else if (filenameExt) {
        detectionMethod = 'extension_fallback';
        confidence = 'Low';
        confidenceScore = 50;
      }
    } else if (filenameExt) {
      detectionMethod = 'extension_fallback';
      confidence = 'Low';
      confidenceScore = 40;
    }
  }

  // Derive Detected and Standard Database values
  let detectedExt = '';
  let detectedFormat = '';
  let detectedMime = '';
  let standardDbMime = '';

  if (matchedPattern) {
    detectedExt = matchedPattern.extension.toUpperCase();
    detectedFormat = matchedPattern.name;
    detectedMime = matchedPattern.mimeType;
  } else if (filenameExt) {
    const extInfo = getOrGenerateExtensionInfo(filenameExt);
    detectedExt = extInfo.extension.toUpperCase();
    detectedFormat = extInfo.name;
    detectedMime = extInfo.mimeType || browserReportedMime || 'application/octet-stream';
  } else {
    detectedExt = 'UNKNOWN';
    detectedFormat = 'Unrecognized Binary Stream';
    detectedMime = browserReportedMime || 'application/octet-stream';
  }

  // Get standard IANA/RFC database MIME type from knowledge base
  const knowledgeInfo = detectedExt !== 'UNKNOWN' ? getOrGenerateExtensionInfo(detectedExt.toLowerCase()) : null;
  standardDbMime = knowledgeInfo?.mimeType || detectedMime || 'application/octet-stream';

  // Evaluate Extension Comparison (Filename Extension vs Detected Format)
  const isExtensionMatch =
    !hasExt ||
    !detectedExt ||
    detectedExt === 'UNKNOWN' ||
    upperFilenameExt === detectedExt ||
    (upperFilenameExt === 'JPEG' && detectedExt === 'JPG') ||
    (upperFilenameExt === 'JPG' && detectedExt === 'JPEG') ||
    (upperFilenameExt === 'TIF' && detectedExt === 'TIFF') ||
    (upperFilenameExt === 'HTM' && detectedExt === 'HTML');

  let extensionComparison: ExtensionComparisonResult;

  if (!hasExt) {
    extensionComparison = {
      status: 'missing',
      filenameExtension: 'None',
      detectedExtension: '.' + detectedExt.toLowerCase(),
      message: 'Filename has no extension',
      explanation: `The file name does not include an extension. Based on internal binary magic byte inspection, this file is a .${detectedExt.toLowerCase()} (${detectedFormat}).`,
      isSpoofed: false,
    };
  } else if (isExtensionMatch) {
    extensionComparison = {
      status: 'match',
      filenameExtension: '.' + filenameExt,
      detectedExtension: '.' + detectedExt.toLowerCase(),
      message: 'Extension matches file contents',
      explanation: `The file extension .${filenameExt} matches the verified binary header signature for ${detectedFormat}.`,
      isSpoofed: false,
    };
  } else {
    // Mismatch detected! (e.g. photo.jpg containing PNG bytes or file.pdf containing EXE)
    const isDangerousDisguise = detectedExt === 'EXE' || detectedExt === 'ELF' || detectedExt === 'APK';
    extensionComparison = {
      status: 'mismatch',
      filenameExtension: '.' + filenameExt,
      detectedExtension: '.' + detectedExt.toLowerCase(),
      message: 'Extension does not match file contents',
      explanation: `The file is named with extension .${filenameExt}, but the binary magic signature identifies it as a .${detectedExt.toLowerCase()} (${detectedFormat}). Renaming or opening in the wrong application may fail.`,
      isSpoofed: isDangerousDisguise,
    };
  }

  // Evaluate MIME Comparison (Browser Reported vs Detected vs Database)
  const normBrowser = (browserReportedMime || '').trim().toLowerCase();
  const normDetected = (detectedMime || '').trim().toLowerCase();

  let mimeComparison: MimeComparisonResult;

  if (!normBrowser || normBrowser === 'application/octet-stream') {
    mimeComparison = {
      status: 'generic',
      browserReportedMime: browserReportedMime || 'application/octet-stream',
      detectedMime: detectedMime,
      standardDatabaseMime: standardDbMime,
      message: 'Browser reported generic binary stream',
      explanation: `The browser or operating system provided generic MIME type "${browserReportedMime || 'application/octet-stream'}". Binary signature analysis detected standard MIME "${detectedMime}".`,
    };
  } else if (normBrowser === normDetected) {
    mimeComparison = {
      status: 'match',
      browserReportedMime: browserReportedMime,
      detectedMime: detectedMime,
      standardDatabaseMime: standardDbMime,
      message: 'MIME types match',
      explanation: `Browser reported MIME "${browserReportedMime}" perfectly agrees with detected binary header MIME.`,
    };
  } else {
    mimeComparison = {
      status: 'mismatch',
      browserReportedMime: browserReportedMime,
      detectedMime: detectedMime,
      standardDatabaseMime: standardDbMime,
      message: 'MIME type discrepancy',
      explanation: `Browser reported "${browserReportedMime}", while verified binary signature specifies "${detectedMime}".`,
    };
  }

  const signatureMeaning = matchedPattern?.meaning || (
    bytes.length === 0
      ? 'Empty 0-byte file with no header signature.'
      : `Raw byte sequence at offset 0x00000000 (${hexSignature.slice(0, 24)}...). No standardized magic byte signature matched.`
  );

  const signatureAnalysis: SignatureAnalysis = {
    hexSignature,
    asciiSignature,
    matchedPattern,
    offset: matchedPattern?.offset || 0,
    meaning: signatureMeaning,
    sampleBytes: Array.from(bytes.slice(0, 32)),
    hexOffsetRows,
  };

  return {
    detectedExtension: detectedExt,
    detectedFormat,
    detectedMimeType: detectedMime,
    databaseMimeType: standardDbMime,
    confidence,
    confidenceScore,
    detectionMethod,
    matchedPattern,
    signatureAnalysis,
    mimeComparison,
    extensionComparison,
  };
}
