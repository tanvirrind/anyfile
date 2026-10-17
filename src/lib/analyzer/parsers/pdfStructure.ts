import type { PdfStructureInfo } from '../types';
import { StructureUnavailableError } from '../structureRunner';
import { ensurePdfWorkerOptions, type PdfDocumentLike } from '../../pdfWorker';

/**
 * PDF structure parser (Batch B).
 *
 * Uses pdfjs-dist (already a dependency, dynamically imported). Extracts what
 * pdf.js honestly exposes: page count, format version, info-dictionary
 * metadata (producer/creator/author/title/dates), attachment count.
 *
 * Encryption: pdfjs-dist v6 does NOT expose an isEncrypted flag on the public
 * API — an encrypted file without a password rejects getDocument().promise
 * with a PasswordException. We detect that and report encryption honestly
 * without attempting to bypass it.
 *
 * JavaScript detection: pdfjs-dist v6 has no getJavaScript() either, so we
 * run an honestly-labeled heuristic scan of the file head for JavaScript
 * name objects (/JavaScript, /JS). Reported as heuristic, never as a parser
 * verdict.
 */

export const PDF_STRUCTURE_MAX_BYTES = 100 * 1024 * 1024; // 100 MB
const JS_HEURISTIC_SCAN_BYTES = 256 * 1024;

function startsWithPdf(headerBytes: Uint8Array): boolean {
  return (
    headerBytes.length >= 5 &&
    headerBytes[0] === 0x25 && // %
    headerBytes[1] === 0x50 && // P
    headerBytes[2] === 0x44 && // D
    headerBytes[3] === 0x46 && // F
    headerBytes[4] === 0x2d // -
  );
}

export async function parsePdfStructure(
  file: File,
  detectedExt: string,
  headerBytes: Uint8Array
): Promise<PdfStructureInfo | null> {
  const ext = (detectedExt || '').toUpperCase().replace(/^\./, '');
  if (ext !== 'PDF' && !startsWithPdf(headerBytes)) return null;

  if (file.size > PDF_STRUCTURE_MAX_BYTES) {
    throw new StructureUnavailableError(
      `File exceeds ${(PDF_STRUCTURE_MAX_BYTES / (1024 * 1024)).toFixed(0)} MB — ` +
        'in-browser PDF structure scan is skipped to protect device memory.'
    );
  }

  const pdfjsLib = await ensurePdfWorkerOptions();

  const data = new Uint8Array(await file.arrayBuffer());
  let doc: PdfDocumentLike;
  try {
    const loadingTask = pdfjsLib.getDocument({ data, isEvalSupported: false });
    doc = await loadingTask.promise;
  } catch (err: unknown) {
    const name = (err as { name?: string } | null)?.name || '';
    const message = (err as { message?: string } | null)?.message || '';
    if (name === 'PasswordException' || /password/i.test(message)) {
      return { isEncrypted: true };
    }
    throw new StructureUnavailableError(
      'The PDF could not be parsed — the file may be corrupt or truncated.'
    );
  }

  const out: PdfStructureInfo = { isEncrypted: false };
  try {
    out.pageCount = doc.numPages;

    try {
      const { info } = await doc.getMetadata();
      const i = (info || {}) as Record<string, unknown>;
      const str = (v: unknown): string | undefined => (typeof v === 'string' && v.length > 0 ? v : undefined);
      if (str(i.PDFFormatVersion)) out.pdfVersion = `PDF ${i.PDFFormatVersion as string}`;
      out.producer = str(i.Producer);
      out.creator = str(i.Creator);
      out.author = str(i.Author);
      out.title = str(i.Title);
      out.creationDate = str(i.CreationDate);
      out.modificationDate = str(i.ModDate);
    } catch {
      // Info-dictionary metadata is optional; the structural facts stand.
    }

    try {
      if (typeof doc.getAttachments === 'function') {
        const attachments = await doc.getAttachments();
        if (attachments && Object.keys(attachments).length > 0) {
          out.embeddedFiles = Object.keys(attachments).length;
        }
      }
    } catch {
      // Attachment enumeration is best-effort.
    }

    // JavaScript heuristic: name-object scan of the file head.
    const scanLen = Math.min(file.size, JS_HEURISTIC_SCAN_BYTES);
    const sample = new Uint8Array(await file.slice(0, scanLen).arrayBuffer());
    const text = new TextDecoder('latin1').decode(sample);
    out.hasJavaScript = /\/(JavaScript|JS)[\s\/\(<]/i.test(text);
  } finally {
    try {
      await doc.destroy();
    } catch {
      // Cleanup is best-effort.
    }
  }

  return out;
}
