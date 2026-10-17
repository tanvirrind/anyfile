/**
 * Batch B structure-parser smoke tests.
 *
 * All fixtures are constructed in-code (no binary assets, no network):
 *  - ZIP: built with jszip — includes vbaProject.bin + a fake .exe entry
 *  - PDF: minimal hand-built PDF with computed xref + embedded /JavaScript
 *  - JPEG: hand-built EXIF APP1 segment with GPS rationals
 *  - MP4: hand-built ftyp + moov (mvhd + one avc1 video track)
 */
import { describe, expect, it } from 'vitest';
import { parseZipStructure } from '@/lib/analyzer/parsers/zipStructure';
import { parsePdfStructure } from '@/lib/analyzer/parsers/pdfStructure';
import { parseMediaStructure } from '@/lib/analyzer/parsers/mediaStructure';
import { extractExifDetails } from '@/lib/analyzer/parsers/exifDetails';
import { runStructureAnalysis } from '@/lib/analyzer/structureRunner';

// ── helpers ────────────────────────────────────────────────────────────────

function box(type: string, ...payloads: Uint8Array[]): Uint8Array {
  const body = concat(...payloads);
  const out = new Uint8Array(8 + body.length);
  const v = new DataView(out.buffer);
  v.setUint32(0, out.length, false);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(body, 8);
  return out;
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) { out.set(p, off); off += p.length; }
  return out;
}

function u32(n: number): Uint8Array {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, n, false);
  return b;
}

function ascii(s: string): Uint8Array {
  return new Uint8Array([...s].map((c) => c.charCodeAt(0)));
}

function fixed1616(n: number): Uint8Array {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setInt32(0, Math.round(n * 65536), false);
  return b;
}

// ── ZIP fixture ────────────────────────────────────────────────────────────

async function buildDocmZip(): Promise<File> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  zip.file('[Content_Types].xml', '<Types/>');
  zip.file('word/document.xml', '<w:document/>');
  zip.file('word/vbaProject.bin', new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
  const exe = new Uint8Array(64);
  exe[0] = 0x4d; exe[1] = 0x5a; // MZ
  zip.file('payloads/tool.exe', exe);
  zip.file('docs/readme.txt', 'hello');
  const buf = await zip.generateAsync({ type: 'uint8array' });
  return new File([buf as BlobPart], 'report.docm', {
    type: 'application/vnd.ms-word.document.macroEnabled.12',
  });
}

// ── PDF fixture (computed xref) ────────────────────────────────────────────

function buildPdf(withJs: boolean): Uint8Array {
  const objects: string[] = [];
  const catalog = withJs
    ? '<< /Type /Catalog /Pages 2 0 R /Names << /JavaScript << /Names [(init) 6 0 R] >> >> >>'
    : '<< /Type /Catalog /Pages 2 0 R >>';
  objects.push(catalog);
  objects.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>');
  objects.push('<< /Length 0 >>\nstream\n\nendstream');
  objects.push('<< /Producer (BatchB TestSuite) /Creator (AnyFileX Test) /Title (Fixture Doc) >>');
  if (withJs) objects.push('<< /S /JavaScript /JS (app.alert("x");) >>');

  const parts: string[] = ['%PDF-1.7\n'];
  const offsets: number[] = [];
  let cursor = parts[0].length;
  objects.forEach((body, i) => {
    offsets.push(cursor);
    const chunk = `${i + 1} 0 obj\n${body}\nendobj\n`;
    parts.push(chunk);
    cursor += chunk.length;
  });
  const xrefStart = cursor;
  const n = objects.length + 1;
  let xref = `xref\n0 ${n}\n0000000000 65535 f \n`;
  for (const off of offsets) xref += `${String(off).padStart(10, '0')} 00000 n \n`;
  xref += `trailer\n<< /Size ${n} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return ascii(parts.join('') + xref);
}

// ── JPEG + EXIF fixture ────────────────────────────────────────────────────

function buildJpegWithGps(): Uint8Array {
  // Proper little-endian TIFF: IFD entries sorted ascending; ASCII values
  // with count <= 4 stored inline in the 4-byte value field (per TIFF spec).
  const buf: number[] = [];
  const le16 = (n: number) => buf.push(n & 0xff, (n >> 8) & 0xff);
  const le32 = (n: number) => buf.push(n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff);
  const bytesOf = (s: string) => [...s].map((c) => c.charCodeAt(0)).concat([0]);
  const rat = (n: number, d: number) => [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff, d & 0xff, (d >> 8) & 0xff, (d >> 16) & 0xff, (d >> 24) & 0xff];

  const bMake = bytesOf('TestCamCo'); // 10
  const bModel = bytesOf('TestCam 1000'); // 13
  const bDate = bytesOf('2024:05:06 07:08:09'); // 20
  const bLat = [...rat(37, 1), ...rat(46, 1), ...rat(30, 1)]; // 24
  const bLng = [...rat(122, 1), ...rat(25, 1), ...rat(0, 1)]; // 24

  // Layout: TIFF header(8) + IFD0(2 + 4*12 + 4 = 54) + data, then GPS IFD(54) + its data
  const ifd0DataStart = 8 + 54;
  const offMake = ifd0DataStart;
  const offModel = offMake + bMake.length;
  const offDate = offModel + bModel.length;
  const gpsIfdOff = offDate + bDate.length;
  const gpsDataStart = gpsIfdOff + 54;
  const offLat = gpsDataStart;
  const offLng = gpsDataStart + bLat.length;

  buf.push(0x49, 0x49, 0x2a, 0x00); le32(8); // 'II', 42, IFD0 at 8
  le16(4);
  const asciiEntry = (tag: number, off: number, count: number) => { le16(tag); le16(2); le32(count); le32(off); };
  asciiEntry(0x010f, offMake, bMake.length); // Make
  asciiEntry(0x0110, offModel, bModel.length); // Model
  asciiEntry(0x0132, offDate, bDate.length); // DateTime
  le16(0x8825); le16(4); le32(1); le32(gpsIfdOff); // GPSInfo (LONG)
  le32(0); // next IFD
  buf.push(...bMake, ...bModel, ...bDate);

  // GPS IFD, entries sorted: LatRef(0x0001), Lat(0x0002), LngRef(0x0003), Lng(0x0004)
  le16(4);
  const inline2 = (s: string) => [s.charCodeAt(0), 0, 0, 0];
  le16(0x0001); le16(2); le32(2); buf.push(...inline2('N')); // GPSLatitudeRef
  le16(0x0002); le16(5); le32(3); le32(offLat); // GPSLatitude (3 rationals)
  le16(0x0003); le16(2); le32(2); buf.push(...inline2('W')); // GPSLongitudeRef
  le16(0x0004); le16(5); le32(3); le32(offLng); // GPSLongitude (3 rationals)
  le32(0);
  buf.push(...bLat, ...bLng);

  const tiff = new Uint8Array(buf);
  const exifHeader = concat(ascii('Exif\0\0'), tiff);
  const app1Len = exifHeader.length + 2;
  const app1 = concat(
    new Uint8Array([0xff, 0xe1, (app1Len >> 8) & 0xff, app1Len & 0xff]),
    exifHeader
  );
  const sof0 = new Uint8Array([0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x30, 0x00, 0x40, 0x01, 0x01, 0x11, 0x00]);
  return concat(new Uint8Array([0xff, 0xd8]), app1, sof0, new Uint8Array([0xff, 0xd9]));
}

// ── MP4 fixture ────────────────────────────────────────────────────────────

function buildMp4(): Uint8Array {
  const ftyp = box('ftyp', concat(ascii('isom'), u32(0), ascii('isom'), ascii('iso2')));
  const mvhdPayload = concat(
    new Uint8Array([0, 0, 0, 0]), // version+flags
    u32(0), u32(0), // creation, modification
    u32(1000), // timescale
    u32(60000), // duration -> 60 s
    new Uint8Array(76) // rest of mvhd v0
  );
  const mvhd = box('mvhd', mvhdPayload);
  const tkhdPayload = concat(
    new Uint8Array([0, 0, 0, 0]),
    new Uint8Array(72), // creation..matrix
    fixed1616(1920), fixed1616(1080)
  );
  const tkhd = box('tkhd', tkhdPayload);
  const hdlr = box('hdlr', concat(new Uint8Array(8), ascii('vide'), new Uint8Array(12)));
  const stsd = box('stsd', concat(new Uint8Array(8), box('avc1', new Uint8Array(78))));
  const stbl = box('stbl', stsd);
  const minf = box('minf', stbl);
  const mdia = box('mdia', concat(box('mdhd', new Uint8Array(24)), hdlr, minf));
  const trak = box('trak', concat(tkhd, mdia));
  const moov = box('moov', concat(mvhd, trak));
  return concat(ftyp, moov);
}

// ── tests ──────────────────────────────────────────────────────────────────

describe('zipStructure', () => {
  it('lists entries, detects OOXML macro flavor, macros, and embedded executables', async () => {
    const file = await buildDocmZip();
    const header = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
    const result = await parseZipStructure(file, 'DOCM', header);
    expect(result).not.toBeNull();
    expect(result!.totalEntries).toBe(5);
    expect(result!.truncated).toBe(false);
    expect(result!.containerKind).toBe('docm');
    expect(result!.hasMacros).toBe(true);
    expect(result!.executableEntries).toContain('payloads/tool.exe');
    expect(result!.riskyEntryCount).toBe(1);
  });

  it('returns null for non-zip input', async () => {
    const file = new File([new Uint8Array([1, 2, 3, 4])], 'x.bin');
    const header = new Uint8Array(await file.arrayBuffer());
    expect(await parseZipStructure(file, 'BIN', header)).toBeNull();
  });

  it('reports corrupt ZIP honestly instead of throwing', async () => {
    const bad = new Uint8Array(128);
    bad[0] = 0x50; bad[1] = 0x4b; bad[2] = 0x03; bad[3] = 0x04;
    const file = new File([bad], 'broken.zip');
    const report = await runStructureAnalysis(file, 'ZIP', bad);
    expect(report.family).toBe('zip');
    expect(report.available).toBe(false);
    expect(report.reason).toMatch(/could not be parsed|corrupt/i);
  });

  it('refuses oversized archives with an honest note', async () => {
    const big = new Uint8Array(101 * 1024 * 1024);
    big[0] = 0x50; big[1] = 0x4b; big[2] = 0x03; big[3] = 0x04;
    const file = new File([big], 'huge.zip');
    const report = await runStructureAnalysis(file, 'ZIP', new Uint8Array(big.slice(0, 4096)));
    expect(report.available).toBe(false);
    expect(report.reason).toMatch(/100 MB|memory/i);
  });
});

describe('pdfStructure', () => {
  it('extracts page count, version, producer, and embedded-JS heuristic', async () => {
    const bytes = buildPdf(true);
    const file = new File([bytes], 'fixture.pdf', { type: 'application/pdf' });
    const header = new Uint8Array(bytes.slice(0, 4096));
    const result = await parsePdfStructure(file, 'PDF', header);
    expect(result).not.toBeNull();
    expect(result!.pageCount).toBe(1);
    expect(result!.pdfVersion).toBe('PDF 1.7');
    expect(result!.producer).toBe('BatchB TestSuite');
    expect(result!.creator).toBe('AnyFileX Test');
    expect(result!.isEncrypted).toBe(false);
    expect(result!.hasJavaScript).toBe(true);
  });

  it('finds no JavaScript in a clean PDF', async () => {
    const bytes = buildPdf(false);
    const file = new File([bytes], 'clean.pdf', { type: 'application/pdf' });
    const result = await parsePdfStructure(file, 'PDF', new Uint8Array(bytes.slice(0, 4096)));
    expect(result!.hasJavaScript).toBe(false);
  });

  it('returns null for non-PDF input', async () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'x.bin');
    expect(await parsePdfStructure(file, 'BIN', new Uint8Array([1, 2, 3]))).toBeNull();
  });
});

describe('mediaStructure', () => {
  it('walks ftyp/moov and extracts duration, codec, and dimensions', async () => {
    const bytes = buildMp4();
    const file = new File([bytes], 'clip.mp4', { type: 'video/mp4' });
    const result = await parseMediaStructure(file, 'MP4', new Uint8Array(bytes.slice(0, 4096)));
    expect(result).not.toBeNull();
    expect(result!.majorBrand).toBe('isom');
    expect(result!.moovParsed).toBe(true);
    expect(result!.durationSec).toBeCloseTo(60, 5);
    expect(result!.tracks).toHaveLength(1);
    expect(result!.tracks[0].type).toBe('video');
    expect(result!.tracks[0].codec).toBe('avc1');
    expect(result!.tracks[0].width).toBe(1920);
    expect(result!.tracks[0].height).toBe(1080);
  });

  it('returns null for non-ISOBMFF input', async () => {
    const file = new File([new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])], 'x.bin');
    expect(await parseMediaStructure(file, 'BIN', new Uint8Array(12))).toBeNull();
  });
});

describe('exifDetails', () => {
  it('parses real GPS rationals and camera tags from a hand-built EXIF segment', async () => {
    const bytes = buildJpegWithGps();
    const file = new File([bytes], 'photo.jpg', { type: 'image/jpeg' });
    const { fields, properties } = await extractExifDetails(file);
    expect(fields.cameraMake).toBe('TestCamCo');
    expect(fields.cameraModel).toBe('TestCam 1000');
    expect(fields.gpsLatitude).toBeCloseTo(37 + 46 / 60 + 30 / 3600, 4);
    expect(fields.gpsLongitude).toBeCloseTo(-(122 + 25 / 60), 4);
    expect(properties.some((p) => p.key === 'GPS Coordinates')).toBe(true);
  });

  it('returns empty fields for a file without EXIF', async () => {
    const file = new File([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], 'plain.jpg');
    const { fields, properties } = await extractExifDetails(file);
    expect(fields.gpsLatitude).toBeUndefined();
    expect(properties).toHaveLength(0);
  });
});

describe('runStructureAnalysis', () => {
  it('marks RAR as archive_limited with an honest boundary note', async () => {
    const rar = new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x01, 0x00]);
    const file = new File([rar], 'a.rar');
    const report = await runStructureAnalysis(file, 'RAR', rar);
    expect(report.family).toBe('archive_limited');
    expect(report.available).toBe(false);
    expect(report.reason).toMatch(/not available/i);
  });

  it('marks unknown formats as unsupported without failing', async () => {
    const file = new File([new Uint8Array([9, 9, 9])], 'x.zzz');
    const report = await runStructureAnalysis(file, 'ZZZ', new Uint8Array([9, 9, 9]));
    expect(report.family).toBe('unsupported');
    expect(report.available).toBe(false);
  });
});
