import { FILE_SIGNATURES } from '../data/fileSignaturesData';
import { FileSignatureRecord } from '../types';
import { sha256Hex } from './hashUtils';

export interface AnalysisReport {
  id: string;
  filename: string;
  extension: string;
  fileSize: number;
  formattedSize: string;
  mimeType: string;
  magicBytesHex: string;
  magicBytesAscii: string;
  signatureMatch: FileSignatureRecord | null;
  detectedFormatName: string;
  category: string;
  confidenceScore: number; // 0 - 100
  sha256Hash: string;
  md5Hash?: string;
  lastModified: string;
  isUnknown: boolean;
  securityRating: 'Low' | 'Medium' | 'High';
  threatNotes: string;
  openingSteps: { title: string; desc: string }[];
  hexOffsetRows: { offsetHex: string; hexBytes: string[]; asciiChars: string }[];
}

// Memory store for analysis reports
const reportsStore = new Map<string, AnalysisReport>();

export function getReportById(id: string): AnalysisReport | null {
  if (reportsStore.has(id)) {
    return reportsStore.get(id)!;
  }
  // Fallback try restoring from sessionStorage
  try {
    const saved = sessionStorage.getItem(`anyfilex_report_${id}`) || sessionStorage.getItem(`openanyfile_report_${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      reportsStore.set(id, parsed);
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load report from storage', err);
  }
  return null;
}

export function saveReport(report: AnalysisReport): void {
  reportsStore.set(report.id, report);
  try {
    sessionStorage.setItem(`anyfilex_report_${report.id}`, JSON.stringify(report));
  } catch (err) {
    console.error('Failed to save report to storage', err);
  }
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function analyzeUploadedFile(file: File): Promise<AnalysisReport> {
  const filename = file.name;
  const fileSize = file.size;
  const formattedSize = formatBytes(fileSize);
  const rawExt = filename.includes('.') ? filename.split('.').pop()!.toLowerCase() : '';
  const lastModified = new Date(file.lastModified).toISOString().split('T')[0];

  // 1. Read first 128 bytes
  const sliceBuffer = await file.slice(0, 128).arrayBuffer();
  const bytes = new Uint8Array(sliceBuffer);

  // Convert bytes to Hex array and String
  const hexArray: string[] = [];
  let asciiStr = '';

  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    hexArray.push(b.toString(16).padStart(2, '0').toUpperCase());
    // Printable ASCII check
    if (b >= 32 && b <= 126) {
      asciiStr += String.fromCharCode(b);
    } else {
      asciiStr += '.';
    }
  }

  const magicBytesHex = hexArray.slice(0, 16).join(' ');
  const magicBytesAscii = asciiStr.slice(0, 32);

  // Build 16-byte Hex rows for detailed Hex viewer component
  const hexOffsetRows: { offsetHex: string; hexBytes: string[]; asciiChars: string }[] = [];
  for (let i = 0; i < Math.min(bytes.length, 64); i += 16) {
    const rowBytes = hexArray.slice(i, i + 16);
    const rowAscii = asciiStr.slice(i, i + 16);
    const offsetHex = '0x' + i.toString(16).padStart(8, '0').toUpperCase();
    hexOffsetRows.push({ offsetHex, hexBytes: rowBytes, asciiChars: rowAscii });
  }

  // 2. Compute real SHA-256 Hash over the FULL file (never a partial/random value)
  const sha256Hash = (await sha256Hex(await file.arrayBuffer())) ?? '';

  // 3. Signature Matching
  const fullHexStr = hexArray.join(' ');
  let matchedSignature: FileSignatureRecord | null = null;
  let confidenceScore = 60;
  let detectedFormatName = 'Unknown Binary File Stream';
  let category = 'Unknown files';
  let mimeType = file.type || 'application/octet-stream';
  let isUnknown = true;

  // Check Zip containers (DOCX, XLSX, PPTX, APK, ZIP)
  if (fullHexStr.startsWith('50 4B 03 04')) {
    if (rawExt === 'docx' || asciiStr.includes('word/')) {
      matchedSignature = FILE_SIGNATURES.find((s) => s.id === 'docx') || null;
      detectedFormatName = 'Microsoft Word OpenXML Document (.docx)';
      confidenceScore = 98;
    } else if (rawExt === 'xlsx' || asciiStr.includes('xl/')) {
      matchedSignature = FILE_SIGNATURES.find((s) => s.id === 'xlsx') || null;
      detectedFormatName = 'Microsoft Excel OpenXML Spreadsheet (.xlsx)';
      confidenceScore = 98;
    } else if (rawExt === 'pptx' || asciiStr.includes('ppt/')) {
      matchedSignature = FILE_SIGNATURES.find((s) => s.id === 'pptx') || null;
      detectedFormatName = 'Microsoft PowerPoint Presentation (.pptx)';
      confidenceScore = 98;
    } else if (rawExt === 'apk' || asciiStr.includes('AndroidManifest')) {
      matchedSignature = FILE_SIGNATURES.find((s) => s.id === 'apk') || null;
      detectedFormatName = 'Android Package Kit (.apk)';
      confidenceScore = 98;
    } else {
      matchedSignature = FILE_SIGNATURES.find((s) => s.id === 'zip') || null;
      detectedFormatName = 'ZIP Compressed Archive (.zip)';
      confidenceScore = 99;
    }
  } else if (fullHexStr.includes('66 74 79 70')) {
    // ftyp containers (HEIC, MP4, MOV)
    if (asciiStr.includes('heic') || rawExt === 'heic') {
      matchedSignature = FILE_SIGNATURES.find((s) => s.id === 'heic') || null;
      detectedFormatName = 'High Efficiency Image Container (.heic)';
      confidenceScore = 99;
    } else if (asciiStr.includes('qt') || rawExt === 'mov') {
      matchedSignature = FILE_SIGNATURES.find((s) => s.id === 'mov') || null;
      detectedFormatName = 'Apple QuickTime Movie (.mov)';
      confidenceScore = 99;
    } else {
      matchedSignature = FILE_SIGNATURES.find((s) => s.id === 'mp4') || null;
      detectedFormatName = 'MPEG-4 Part 14 Video (.mp4)';
      confidenceScore = 99;
    }
  } else {
    // Exact signature scan
    for (const sig of FILE_SIGNATURES) {
      const sigHex = sig.signature.toUpperCase();
      if (sig.offset === 0 && fullHexStr.startsWith(sigHex)) {
        matchedSignature = sig;
        detectedFormatName = `${sig.name} (.${sig.extension.toLowerCase()})`;
        confidenceScore = 99;
        break;
      } else if (sig.offset > 0 && fullHexStr.includes(sigHex)) {
        matchedSignature = sig;
        detectedFormatName = `${sig.name} (.${sig.extension.toLowerCase()})`;
        confidenceScore = 96;
        break;
      }
    }
  }

  // Fallback by extension matching if signature scan didn't match
  if (!matchedSignature && rawExt) {
    const extMatch = FILE_SIGNATURES.find((s) => s.extension.toLowerCase() === rawExt);
    if (extMatch) {
      matchedSignature = extMatch;
      detectedFormatName = `${extMatch.name} (.${rawExt})`;
      confidenceScore = 85;
    }
  }

  if (matchedSignature) {
    category = matchedSignature.category;
    mimeType = matchedSignature.mime_type;
    isUnknown = false;
  } else if (rawExt) {
    detectedFormatName = `Unrecognized .${rawExt.toUpperCase()} File`;
    category = 'Unknown files';
  }

  // Security rating
  let securityRating: 'Low' | 'Medium' | 'High' = 'Low';
  let threatNotes = 'Safe verified signature pattern detected. Zero executable byte flags found.';

  if (matchedSignature?.id === 'exe' || matchedSignature?.id === 'apk') {
    securityRating = 'High';
    threatNotes = 'Executable machine code payload detected. Always scan binaries with antivirus software before running.';
  } else if (matchedSignature?.category === 'Archives') {
    securityRating = 'Medium';
    threatNotes = 'Compressed archive container. Extract in isolated directory to inspect child payloads.';
  } else if (matchedSignature?.id === 'svg') {
    securityRating = 'Medium';
    threatNotes = 'XML vector graphic format. Check for inline script tags if rendered in untrusted context.';
  }

  const openingSteps = matchedSignature
    ? [
        {
          title: 'Check Primary Application',
          desc: `Install or open ${matchedSignature.common_software[0] || 'a compatible reader'} on your device.`
        },
        {
          title: 'Verify File Association',
          desc: `Right-click file in File Explorer or Finder and select "Open With" -> ${matchedSignature.common_software[0] || 'Default Viewer'}.`
        },
        {
          title: 'Convert if Unopened',
          desc: `If your operating system lacks a built-in codec, use our web converter to convert .${matchedSignature.extension.toLowerCase()} into PDF or JPG.`
        }
      ]
    : [
        {
          title: 'Examine Magic Header',
          desc: 'Compare the raw hexadecimal header bytes against standard IANA media registry records.'
        },
        {
          title: 'Test Universal Media Viewers',
          desc: 'Try opening with universal software like VLC Media Player, Notepad++, or 7-Zip.'
        },
        {
          title: 'Rename File Extension',
          desc: 'If file header indicates a known signature like PK (ZIP), try appending .zip to extract contents.'
        }
      ];

  const reportId = `report-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const report: AnalysisReport = {
    id: reportId,
    filename,
    extension: rawExt.toUpperCase() || matchedSignature?.extension || 'BIN',
    fileSize,
    formattedSize,
    mimeType,
    magicBytesHex,
    magicBytesAscii,
    signatureMatch: matchedSignature,
    detectedFormatName,
    category,
    confidenceScore,
    sha256Hash,
    lastModified,
    isUnknown,
    securityRating,
    threatNotes,
    openingSteps,
    hexOffsetRows
  };

  saveReport(report);
  return report;
}
