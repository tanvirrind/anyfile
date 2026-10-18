/**
 * Shared pdf.js worker setup (Batch B).
 *
 * Browser/PWA: the worker is bundled LOCALLY (public/pdf.worker.min.mjs,
 * copied from the installed pdfjs-dist package by the `prebuild` script) so
 * PDF parsing works offline inside the PWA. Previously the converter pointed
 * at a cdnjs CDN URL — that broke offline analysis.
 *
 * Node (tests): pdfjs-dist v6's standard build does not run under Node —
 * the legacy build is used with its worker file loaded via worker_threads.
 *
 * Both the converter and the analyzer's PDF structure parser call this;
 * the resolved library instance is cached and returned.
 */

export interface PdfPageTextItem {
  str?: string;
  hasEOL?: boolean;
}

export interface PdfPageLike {
  getViewport(options: { scale: number }): { width: number; height: number };
  render(options: { canvasContext: unknown; viewport: unknown }): { promise: Promise<void> };
  getTextContent(): Promise<{ items: PdfPageTextItem[] }>;
}

export interface PdfDocumentLike {
  numPages: number;
  getMetadata(): Promise<{ info: unknown }>;
  getAttachments?: () => Promise<Record<string, unknown> | null>;
  getPage(pageNumber: number): Promise<PdfPageLike>;
  destroy(): Promise<void>;
}

export interface PdfJsLib {
  getDocument(options: { data: Uint8Array | ArrayBuffer; isEvalSupported?: boolean }): {
    promise: Promise<PdfDocumentLike>;
  };
}

let cachedLib: PdfJsLib | null = null;

export async function ensurePdfWorkerOptions(): Promise<PdfJsLib> {
  if (cachedLib) return cachedLib;

  if (typeof window === 'undefined') {
    // Node (tests/smoke): legacy build + local worker file.
    const legacy = (await import(/* webpackIgnore: true */ 'pdfjs-dist/legacy/build/pdf.mjs')) as unknown as {
      GlobalWorkerOptions: { workerSrc: string };
    };
    const { createRequire } = await import(/* webpackIgnore: true */ 'node:module');
    const require = createRequire(import.meta.url);
    legacy.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
    cachedLib = legacy as unknown as PdfJsLib;
    return cachedLib;
  }

  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }
  cachedLib = pdfjsLib as unknown as PdfJsLib;
  return cachedLib;
}
