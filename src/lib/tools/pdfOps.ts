/**
 * Shared PDF merge/split operations for the PDF tool workspaces.
 * Client-safe: pdf-lib is dynamically imported so pages that never use
 * these tools do not pay for the dependency.
 */

export interface SplitResult {
  name: string;
  bytes: Uint8Array;
  pages: number[];
}

/** Merges a list of PDF buffers (in order) into a single PDF. */
export async function mergePdfs(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const merged = await PDFDocument.create();
  for (const buffer of buffers) {
    const src = await PDFDocument.load(buffer.slice(0));
    const copied = await merged.copyPages(src, src.getPageIndices());
    copied.forEach((page) => merged.addPage(page));
  }
  return merged.save();
}

/**
 * Parses "1-3, 5, 8-10" into groups of 1-based page numbers.
 * Returns an error string instead of throwing for bad input.
 */
export function parsePageRanges(
  input: string,
  numPages: number,
  maxRanges = 20
): { groups: number[][]; error: string | null } {
  const groups: number[][] = [];
  const trimmed = input.trim();
  if (!trimmed) return { groups, error: 'Enter at least one page or range, e.g. "1-3, 5".' };
  const chunks = trimmed.split(',').map((c) => c.trim()).filter(Boolean);
  if (chunks.length > maxRanges) return { groups, error: `Split supports up to ${maxRanges} ranges at a time.` };
  for (const chunk of chunks) {
    const m = chunk.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) return { groups, error: `"${chunk}" is not valid. Use pages like "5" or ranges like "1-3".` };
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    if (start < 1 || end < 1) return { groups, error: `Page numbers must start at 1 (got "${chunk}").` };
    if (start > end) return { groups, error: `"${chunk}": the first page must be less than or equal to the last.` };
    if (end > numPages) return { groups, error: `"${chunk}" exceeds this PDF, which has ${numPages} pages.` };
    const pages: number[] = [];
    for (let p = start; p <= end; p++) pages.push(p);
    groups.push(pages);
  }
  return { groups, error: null };
}

/**
 * Extracts page groups from a PDF.
 * @param mode 'per-range' -> one PDF per group; 'single' -> one PDF with all pages in order
 */
export async function splitPdfPages(
  buffer: ArrayBuffer,
  groups: number[][],
  mode: 'per-range' | 'single',
  baseName: string
): Promise<SplitResult[]> {
  const { PDFDocument } = await import('pdf-lib');
  const src = await PDFDocument.load(buffer.slice(0));
  const base = baseName.replace(/\.pdf$/i, '');
  const results: SplitResult[] = [];

  const buildOne = async (pages: number[], name: string): Promise<SplitResult> => {
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, pages.map((p) => p - 1));
    copied.forEach((page) => out.addPage(page));
    return { name, bytes: await out.save(), pages };
  };

  if (mode === 'single') {
    const allPages = Array.from(new Set(groups.flat())).sort((a, b) => a - b);
    results.push(await buildOne(allPages, `${base}-split.pdf`));
  } else {
    for (const group of groups) {
      const label = group.length === 1 ? `page-${group[0]}` : `pages-${group[0]}-${group[group.length - 1]}`;
      results.push(await buildOne(group, `${base}-${label}.pdf`));
    }
  }
  return results;
}

/** Quick %PDF magic-byte check for honest corrupt-file messages. */
export function looksLikePdf(buffer: ArrayBuffer): boolean {
  const head = new Uint8Array(buffer.slice(0, 5));
  return head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46 && head[4] === 0x2d;
}
