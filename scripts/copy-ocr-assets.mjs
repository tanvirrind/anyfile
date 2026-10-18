/**
 * Copies the tesseract.js OCR assets from the installed packages into
 * public/ocr/, so the OCR tool loads its worker, WASM core, and English
 * language data from same-origin URLs (no CDN; works offline in the PWA
 * and preserves the zero-upload guarantee).
 *
 * Runs automatically before every build via the `prebuild` npm script,
 * alongside scripts/copy-pdf-worker.mjs.
 *
 * Copied assets:
 *   tesseract.js/dist/worker.min.js              -> public/ocr/worker.min.js
 *   tesseract.js-core/tesseract-core.wasm.js     -> public/ocr/tesseract-core.wasm.js
 *   tesseract.js-core/tesseract-core.wasm        -> public/ocr/tesseract-core.wasm
 *   @tesseract.js-data/eng/4.0.0/eng.traineddata.gz -> public/ocr/eng.traineddata.gz
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const destDir = join(root, 'public', 'ocr');
mkdirSync(destDir, { recursive: true });

const files = [
  ['tesseract.js', 'dist/worker.min.js', 'worker.min.js'],
  ['tesseract.js-core', 'tesseract-core.wasm.js', 'tesseract-core.wasm.js'],
  ['tesseract.js-core', 'tesseract-core.wasm', 'tesseract-core.wasm'],
  ['@tesseract.js-data/eng', '4.0.0/eng.traineddata.gz', 'eng.traineddata.gz'],
];

for (const [pkg, rel, name] of files) {
  const src = join(root, 'node_modules', pkg, rel);
  const dest = join(destDir, name);
  if (!existsSync(src)) {
    console.error(`[copy-ocr-assets] asset not found: ${src}`);
    process.exit(1);
  }
  copyFileSync(src, dest);
  console.log(`[copy-ocr-assets] ${name} -> public/ocr/`);
}
