import type { StructureReport } from './types';
import { parseZipStructure } from './parsers/zipStructure';
import { parsePdfStructure } from './parsers/pdfStructure';
import { parseMediaStructure } from './parsers/mediaStructure';

/**
 * Structure-analysis dispatcher (Batch B).
 *
 * After identification, this probes the file's internal STRUCTURE per format
 * family and returns a plain-JSON StructureReport (API-serializable).
 *
 * Per-parser isolation: each family parser is attempted in a fixed order
 * (zip → pdf → media — a mislabeled file is caught by magic as well as by
 * detected extension). A failing parser NEVER fails the whole analysis:
 * StructureUnavailableError becomes an honest `available: false` report,
 * anything else becomes an honest unexpected-error report.
 */

export class StructureUnavailableError extends Error {
  constructor(public readonly reason: string) {
    super(reason);
    this.name = 'StructureUnavailableError';
  }
}

const ARCHIVE_LIMITED_EXTS = new Set(['RAR', '7Z', 'TAR', 'GZ', 'BZ2', 'XZ', 'CAB', 'ARJ', 'LZH']);

function unavailable(family: StructureReport['family'], reason: string): StructureReport {
  return { family, available: false, reason, notes: [] };
}

export async function runStructureAnalysis(
  file: File,
  detectedExt: string,
  headerBytes: Uint8Array
): Promise<StructureReport> {
  const ext = (detectedExt || '').toUpperCase().replace(/^\./, '');

  // 1. ZIP family (zip + OOXML + EPUB + ODF + APK + JAR…)
  try {
    const zip = await parseZipStructure(file, ext, headerBytes);
    if (zip) {
      return { family: 'zip', available: true, notes: [], zip };
    }
  } catch (err) {
    if (err instanceof StructureUnavailableError) return unavailable('zip', err.reason);
    return unavailable('zip', 'ZIP structure analysis failed unexpectedly.');
  }

  // 2. PDF
  try {
    const pdf = await parsePdfStructure(file, ext, headerBytes);
    if (pdf) {
      const notes: string[] = [];
      if (pdf.isEncrypted) {
        notes.push('The PDF is password protected — pages and metadata could not be inspected.');
      }
      return { family: 'pdf', available: true, notes, pdf };
    }
  } catch (err) {
    if (err instanceof StructureUnavailableError) return unavailable('pdf', err.reason);
    return unavailable('pdf', 'PDF structure analysis failed unexpectedly.');
  }

  // 3. ISOBMFF media (mp4/mov/m4a/m4v/3gp)
  try {
    const media = await parseMediaStructure(file, ext, headerBytes);
    if (media) {
      const notes: string[] = [];
      if (!media.moovParsed) {
        notes.push(
          'The moov box was not within the sampled file header/trailer — duration and tracks could not be determined without loading the full file.'
        );
      }
      return { family: 'media', available: true, notes, media };
    }
  } catch (err) {
    if (err instanceof StructureUnavailableError) return unavailable('media', err.reason);
    return unavailable('media', 'Media structure analysis failed unexpectedly.');
  }

  // 4. Archives with no in-browser listing capability: honest boundary.
  if (ARCHIVE_LIMITED_EXTS.has(ext)) {
    return unavailable(
      'archive_limited',
      `Contents listing is not available in-browser for the ${ext} format — its container structure has no open JavaScript parser. Identification and metadata above remain valid.`
    );
  }

  return unavailable(
    'unsupported',
    'Structure analysis is not implemented for this format yet. Identification, metadata and security checks above remain valid.'
  );
}
