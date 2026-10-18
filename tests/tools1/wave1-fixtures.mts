/**
 * Behavioral fixtures for missing-tools Wave 1.
 * Run: node --experimental-strip-types tests/tools1/wave1-fixtures.mts
 * Exercises the SAME lib modules the workspaces call (pdfOps, icoBuilder, textToPdf).
 */
import { mergePdfs, splitPdfPages, parsePageRanges, looksLikePdf } from '../../src/lib/tools/pdfOps.ts';
import { buildIco, parseIcoHeader } from '../../src/lib/tools/icoBuilder.ts';
import { generateTextPdf } from '../../src/lib/tools/textToPdf.ts';

let passed = 0;
let failed = 0;
const ok = (name: string, cond: boolean, detail = '') => {
  if (cond) { passed++; console.log(`PASS ${name}`); }
  else { failed++; console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); }
};

async function makePdfWithText(lines: string[]) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  lines.forEach((line: string) => {
    const page = doc.addPage([600, 800]);
    page.drawText(line, { x: 50, y: 700, size: 14, font, color: rgb(0, 0, 0) });
  });
  return doc.save();
}

async function pdfPageCount(bytes: Uint8Array) {
  const { PDFDocument } = await import('pdf-lib');
  const doc = await PDFDocument.load(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  return doc.getPageCount();
}

async function extractTextViaPdfjs(bytes: Uint8Array) {
  // Node path: legacy build + workerSrc (same pattern as the analyzer's batch-B tests)
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const pdfjs = require('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes) }).promise;
  const chunks = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    chunks.push(tc.items.map((it: { str?: string }) => it.str).join(' '));
  }
  if (typeof doc.destroy === 'function') await doc.destroy();
  return chunks.join('\n');
}

// 1. MERGE: 2-page + 3-page PDFs -> 5 pages, opens via pdfjs
const pdf2 = await makePdfWithText(['Merge A page 1', 'Merge A page 2']);
const pdf3 = await makePdfWithText(['Merge B page 1', 'Merge B page 2', 'Merge B page 3']);
const merged = await mergePdfs([pdf2.buffer.slice(0), pdf3.buffer.slice(0)]);
ok('merge: 2+3 pages = 5 pages', (await pdfPageCount(merged)) === 5);
ok('merge: output opens in pdfjs', (await extractTextViaPdfjs(merged)).includes('Merge B page 3'));
ok('merge: output has %PDF magic', looksLikePdf(merged.buffer.slice(0)));

// 2. SPLIT: 5-page PDF, range "2-4" -> one 3-page output
const pdf5 = await makePdfWithText(['S1', 'S2', 'S3', 'S4', 'S5']);
const parsed = parsePageRanges('2-4', 5);
ok('parse: "2-4" -> [2,3,4]', !parsed.error && JSON.stringify(parsed.groups) === '[[2,3,4]]');
const bad = parsePageRanges('3-1', 5);
ok('parse: "3-1" rejected', !!bad.error);
const oob = parsePageRanges('1-9', 5);
ok('parse: "1-9" rejected (only 5 pages)', !!oob.error);
const single = await splitPdfPages(pdf5.buffer.slice(0), [[2, 3, 4]], 'single', 'test.pdf');
ok('split single: 1 file, 3 pages', single.length === 1 && (await pdfPageCount(single[0].bytes)) === 3);
ok('split single: naming', single[0].name === 'test-split.pdf');
const perRange = await splitPdfPages(pdf5.buffer.slice(0), [[1, 2], [5]], 'per-range', 'test.pdf');
ok('split per-range: 2 files', perRange.length === 2);
ok('split per-range: names', perRange[0].name === 'test-pages-1-2.pdf' && perRange[1].name === 'test-page-5.pdf');
ok('split per-range: page counts', (await pdfPageCount(perRange[0].bytes)) === 2 && (await pdfPageCount(perRange[1].bytes)) === 1);
const splitText = await extractTextViaPdfjs(single[0].bytes);
ok('split: extracted pages are 2-4', splitText.includes('S2') && splitText.includes('S4') && !splitText.includes('S5'));

// 3. TEXT -> PDF: generate, then pdfjs reads the fixture text back
const FIXTURE_TEXT = 'The quick brown fox jumps over the lazy dog. AnyFileX fixture 987654321.';
const tpdf = await generateTextPdf(FIXTURE_TEXT, { title: 'Fixture Doc', fontSize: 12, pageSize: 'a4' });
ok('text->pdf: %PDF magic', looksLikePdf(tpdf.buffer.slice(0)));
const back = await extractTextViaPdfjs(tpdf);
ok('text->pdf: fixture text readable by pdfjs', back.includes('987654321') && back.includes('quick brown fox'));

// 4. PDF -> TEXT path: pdf-lib PDF with known string, extracted via pdfjs (workspace uses same getTextContent)
const knownPdf = await makePdfWithText(['Known extraction string ZULU-42.']);
const knownText = await extractTextViaPdfjs(knownPdf);
ok('pdf->text: known string extracted', knownText.includes('ZULU-42'));

// 5. BASE64 roundtrip incl. binary (same chunked algorithm as the workspace)
const bin = new Uint8Array(60000);
for (let i = 0; i < bin.length; i++) bin[i] = (i * 7 + 13) % 256;
const CHUNK = 0x8000;
let binary = '';
for (let i = 0; i < bin.length; i += CHUNK) binary += String.fromCharCode(...bin.subarray(i, i + CHUNK));
const b64 = btoa(binary);
const binBack = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
ok('base64: binary roundtrip byte-identical', binBack.length === bin.length && binBack.every((v, i) => v === bin[i]));
const utf8Text = 'Héllo wörld — emoji 🎉';
const encBytes = new TextEncoder().encode(utf8Text);
let b2 = '';
for (let i = 0; i < encBytes.length; i += CHUNK) b2 += String.fromCharCode(...encBytes.subarray(i, i + CHUNK));
const decBytes = Uint8Array.from(atob(btoa(b2)), (c) => c.charCodeAt(0));
ok('base64: UTF-8 text roundtrip', new TextDecoder().decode(decBytes) === utf8Text);

// 6. URL codec roundtrip with reserved chars
const reserved = 'hello world & more? #1 = 100%';
ok('url: component encode', encodeURIComponent(reserved) === 'hello%20world%20%26%20more%3F%20%231%20%3D%20100%25');
ok('url: component roundtrip', decodeURIComponent(encodeURIComponent(reserved)) === reserved);
const full = 'https://example.com/search?q=hello world&lang=en#frag ment';
const fullEnc = encodeURI(full);
ok('url: full mode keeps :/?#&', fullEnc.includes('://') && fullEnc.includes('?q=') && fullEnc.includes('#'));
ok('url: full mode roundtrip', decodeURI(fullEnc) === full);

// 7. ICO: magic + entry table
const fakePngs = [16, 32, 256].map((size) => ({ size, data: new Uint8Array([0x89, 0x50, 0x4e, 0x47, size]).buffer }));
const ico = buildIco(fakePngs);
const v = new DataView(ico);
ok('ico: magic 00 00 01 00', v.getUint8(0) === 0 && v.getUint8(1) === 0 && v.getUint16(2, true) === 1);
const parsed_ico = parseIcoHeader(ico);
ok('ico: count = 3', parsed_ico.count === 3);
ok('ico: size entries 16/32/256', JSON.stringify(parsed_ico.entries.map((e) => e.size)) === '[16,32,256]');
ok('ico: offsets are sequential and inside buffer', parsed_ico.entries.every((e, i) =>
  e.imageOffset === 6 + 16 * 3 + fakePngs.slice(0, i).reduce((s, p) => s + p.data.byteLength, 0) &&
  e.bytesInRes === 5));
ok('ico: 256 encoded as byte 0', v.getUint8(6 + 2 * 16) === 0);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
