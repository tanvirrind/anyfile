/**
 * Boundary adapter: maps the rich engine's FileAnalysis to the legacy
 * AnalysisReport shape consumed by FileIdentifierResultPage.
 *
 * Batch A contract: no UI redesign — the result page keeps rendering
 * AnalysisReport exactly as before; only the data underneath gets richer
 * (verified signature index, mismatch detection, security engine output).
 * This adapter (plus saveReport) is what the result page's getReportById
 * reads, so navigation/storage contracts are unchanged.
 */
import { AnalysisReport, saveReport } from '../../utils/fileAnalyzer';
import { FILE_SIGNATURES } from '../../data/fileSignaturesData';
import type { FileSignatureRecord } from '../../types';
import type { FileAnalysis } from './types';

/**
 * Best-effort FileSignatureRecord for the result page's software/OS sections.
 * Prefers FILE_SIGNATURES (real common_software / supported_os lists); falls
 * back to constructing one from the detection pattern (empty software lists,
 * never invented).
 */
function buildSignatureRecord(analysis: FileAnalysis): FileSignatureRecord | null {
  const detected = (analysis.detectedExtension || '').toLowerCase();
  const fromDb = FILE_SIGNATURES.find(
    (record) => record.extension.toLowerCase() === detected
  );
  if (fromDb) return fromDb;

  const pattern = analysis.signature.matchedPattern;
  if (!pattern) return null;
  return {
    id: pattern.id,
    extension: pattern.extension,
    name: pattern.name,
    mime_type: pattern.mimeType,
    signature: pattern.magicBytesHex,
    offset: pattern.offset,
    category: pattern.category,
    description: pattern.description,
    common_software: [],
    supported_os: [],
    security_notes: '',
    example_header_hex: pattern.magicBytesHex,
    magicBytesAscii: pattern.asciiRepresentation,
  };
}

function mapSecurityRating(status: FileAnalysis['security']['status']): AnalysisReport['securityRating'] {
  switch (status) {
    case 'safe':
      return 'Low';
    case 'caution':
      return 'Medium';
    case 'warning':
      return 'High';
    case 'unknown':
    default:
      return 'Medium';
  }
}

function buildOpeningSteps(signatureMatch: FileSignatureRecord | null): AnalysisReport['openingSteps'] {
  if (signatureMatch) {
    const primaryApp = signatureMatch.common_software[0] || 'a compatible reader';
    const ext = signatureMatch.extension.toLowerCase();
    return [
      {
        title: 'Check Primary Application',
        desc: `Install or open ${primaryApp} on your device.`,
      },
      {
        title: 'Verify File Association',
        desc: `Right-click file in File Explorer or Finder and select "Open With" -> ${primaryApp}.`,
      },
      {
        title: 'Convert if Unopened',
        desc: `If your operating system lacks a built-in codec, use our web converter to convert .${ext} into PDF or JPG.`,
      },
    ];
  }
  return [
    {
      title: 'Examine Magic Header',
      desc: 'Compare the raw hexadecimal header bytes against standard IANA media registry records.',
    },
    {
      title: 'Test Universal Media Viewers',
      desc: 'Try opening with universal software like VLC Media Player, Notepad++, or 7-Zip.',
    },
    {
      title: 'Rename File Extension',
      desc: 'If file header indicates a known signature like PK (ZIP), try appending .zip to extract contents.',
    },
  ];
}

export function mapFileAnalysisToReport(analysis: FileAnalysis, file: File): AnalysisReport {
  const signatureMatch = buildSignatureRecord(analysis);
  const isUnknown =
    analysis.detectedExtension === 'UNKNOWN' ||
    analysis.detectionMethod === 'unknown';

  return {
    id: analysis.id,
    filename: analysis.fileName,
    extension: (analysis.fileNameExtension || 'bin').toUpperCase(),
    fileSize: analysis.fileSize,
    formattedSize: analysis.formattedSize,
    mimeType: analysis.detectedMimeType,
    magicBytesHex: analysis.signature.hexSignature,
    magicBytesAscii: analysis.signature.asciiSignature ?? '',
    signatureMatch,
    detectedFormatName: analysis.detectedFormat,
    category: analysis.category,
    confidenceScore: analysis.confidenceScore,
    sha256Hash: analysis.diagnostics.sha256Hash ?? '',
    lastModified: new Date(file.lastModified || Date.now()).toISOString(),
    isUnknown,
    securityRating: mapSecurityRating(analysis.security.status),
    threatNotes: analysis.security.neutralStatement,
    openingSteps: buildOpeningSteps(signatureMatch),
    hexOffsetRows: analysis.signature.hexOffsetRows,
  };
}

/**
 * Analyzes via the rich engine, adapts to the result-page report shape, and
 * persists it under the legacy sessionStorage contract getReportById reads.
 */
export async function analyzeAndSaveReport(file: File): Promise<AnalysisReport> {
  const { analyzeFile } = await import('./fileAnalyzerService');
  const analysis = await analyzeFile(file);
  const report = mapFileAnalysisToReport(analysis, file);
  saveReport(report);
  return report;
}

export { saveReport };
