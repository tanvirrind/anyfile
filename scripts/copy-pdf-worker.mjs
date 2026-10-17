/**
 * Copies the pdf.js worker from the installed pdfjs-dist package into
 * public/, so the analyzer's PDF parser and the converters can load the
 * worker from a same-origin URL (works offline in the PWA).
 *
 * Runs automatically before every build via the `prebuild` npm script.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const dest = join(root, 'public', 'pdf.worker.min.mjs');

if (!existsSync(src)) {
  console.error(`[copy-pdf-worker] worker not found at ${src}`);
  process.exit(1);
}

copyFileSync(src, dest);
console.log('[copy-pdf-worker] pdf.worker.min.mjs -> public/');
