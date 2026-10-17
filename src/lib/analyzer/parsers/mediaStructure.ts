import type { MediaStructureInfo, MediaTrackInfo } from '../types';
import { StructureUnavailableError } from '../structureRunner';

/**
 * ISOBMFF (ISO Base Media File Format) structure parser (Batch B).
 *
 * Hand-rolled box walker, zero new dependencies. Covers MP4/MOV/M4A/M4V/3GP:
 *   - ftyp: major brand + compatible brands
 *   - moov/mvhd: timescale + duration → duration seconds
 *   - trak/tkhd: video width/height (16.16 fixed-point)
 *   - mdia/hdlr: track handler ('vide'/'soun'/'subt')
 *   - mdia/minf/stbl/stsd: sample-entry fourcc → codec (avc1, hvc1, mp4a, ...)
 *
 * Memory discipline: media files are often hundreds of MB, and the moov box
 * frequently sits at the END of the file. We read only a head chunk and a
 * tail chunk (MEDIA_SAMPLE_BYTES each) via ranged file.slice() calls — the
 * full file is never loaded. If moov falls outside the samples, we report
 * the brands honestly and say duration/tracks were unavailable.
 */

const MEDIA_EXTS = new Set(['MP4', 'MOV', 'M4A', 'M4V', '3GP']);
const MEDIA_SAMPLE_BYTES = 256 * 1024; // 256 KB head + 256 KB tail

interface RawBox {
  type: string;
  dataStart: number; // index into the chunk's Uint8Array
  dataEnd: number;
}

function readAscii(bytes: Uint8Array, offset: number, length: number): string {
  let s = '';
  for (let i = 0; i < length && offset + i < bytes.length; i++) {
    s += String.fromCharCode(bytes[offset + i]);
  }
  return s;
}

function readBoxes(bytes: Uint8Array, view: DataView, start: number, end: number): RawBox[] {
  const boxes: RawBox[] = [];
  let off = start;
  while (off + 8 <= end) {
    let size = view.getUint32(off, false);
    const type = readAscii(bytes, off + 4, 4);
    let headerLen = 8;
    if (size === 1) {
      // largesize (64-bit)
      if (off + 16 > end) break;
      const hi = view.getUint32(off + 8, false);
      const lo = view.getUint32(off + 12, false);
      size = hi * 4294967296 + lo;
      headerLen = 16;
    } else if (size === 0) {
      size = end - off;
    }
    if (!Number.isSafeInteger(size) || size < headerLen) break;
    const dataEnd = Math.min(off + size, end);
    boxes.push({ type, dataStart: off + headerLen, dataEnd });
    if (off + size <= off) break; // overflow guard
    off += size;
    if (off > end) break;
  }
  return boxes;
}

function fixed1616(view: DataView, offset: number): number {
  return view.getInt32(offset, false) / 65536;
}

function parseMvhd(bytes: Uint8Array, view: DataView, box: RawBox): { timescale: number; durationSec: number } | null {
  if (box.dataEnd - box.dataStart < 24) return null;
  const version = bytes[box.dataStart];
  try {
    if (version === 1) {
      if (box.dataEnd - box.dataStart < 32) return null;
      const timescale = view.getUint32(box.dataStart + 20, false);
      const hi = view.getUint32(box.dataStart + 24, false);
      const lo = view.getUint32(box.dataStart + 28, false);
      const duration = hi * 4294967296 + lo;
      return timescale > 0 ? { timescale, durationSec: duration / timescale } : null;
    }
    const timescale = view.getUint32(box.dataStart + 12, false);
    const duration = view.getUint32(box.dataStart + 16, false);
    return timescale > 0 ? { timescale, durationSec: duration / timescale } : null;
  } catch {
    return null;
  }
}

function parseTkhd(bytes: Uint8Array, view: DataView, box: RawBox): { width?: number; height?: number } {
  if (box.dataEnd - box.dataStart < 84) return {};
  const version = bytes[box.dataStart];
  const wOff = version === 1 ? 88 : 76;
  const hOff = version === 1 ? 92 : 80;
  if (box.dataEnd - box.dataStart < hOff + 4) return {};
  return { width: Math.round(fixed1616(view, box.dataStart + wOff)), height: Math.round(fixed1616(view, box.dataStart + hOff)) };
}

function parseTrack(bytes: Uint8Array, view: DataView, trak: RawBox): MediaTrackInfo | null {
  let dims: { width?: number; height?: number } = {};
  let handler = 'other';
  let codec: string | undefined;

  const trakChildren = readBoxes(bytes, view, trak.dataStart, trak.dataEnd);
  for (const child of trakChildren) {
    if (child.type === 'tkhd') dims = parseTkhd(bytes, view, child);
    if (child.type === 'mdia') {
      const mdiaChildren = readBoxes(bytes, view, child.dataStart, child.dataEnd);
      for (const mdia of mdiaChildren) {
        if (mdia.type === 'hdlr' && mdia.dataEnd - mdia.dataStart >= 12) {
          const h = readAscii(bytes, mdia.dataStart + 8, 4);
          handler = h === 'vide' ? 'video' : h === 'soun' ? 'audio' : h === 'subt' || h === 'text' ? 'subtitle' : 'other';
        }
        if (mdia.type === 'minf') {
          const minfChildren = readBoxes(bytes, view, mdia.dataStart, mdia.dataEnd);
          for (const minf of minfChildren) {
            if (minf.type === 'stbl') {
              const stblChildren = readBoxes(bytes, view, minf.dataStart, minf.dataEnd);
              for (const stbl of stblChildren) {
                if (stbl.type === 'stsd' && stbl.dataEnd - stbl.dataStart >= 16) {
                  // version/flags(4) + entry_count(4); first entry: size(4) + fourcc(4)
                  codec = readAscii(bytes, stbl.dataStart + 12, 4).trim() || undefined;
                }
              }
            }
          }
        }
      }
    }
  }

  return { type: handler as MediaTrackInfo['type'], codec, width: dims.width || undefined, height: dims.height || undefined };
}

export async function parseMediaStructure(
  file: File,
  detectedExt: string,
  headerBytes: Uint8Array
): Promise<MediaStructureInfo | null> {
  const ext = (detectedExt || '').toUpperCase().replace(/^\./, '');
  const looksIso = headerBytes.length >= 12 && readAscii(headerBytes, 4, 4) === 'ftyp';
  if (!MEDIA_EXTS.has(ext) && !looksIso) return null;

  // Ranged reads only: head chunk + tail chunk. No full-file load.
  const headLen = Math.min(file.size, MEDIA_SAMPLE_BYTES);
  const head = new Uint8Array(await file.slice(0, headLen).arrayBuffer());
  const tailStart = Math.max(headLen, file.size - MEDIA_SAMPLE_BYTES);
  const tail = tailStart < file.size ? new Uint8Array(await file.slice(tailStart, file.size).arrayBuffer()) : new Uint8Array(0);

  const headView = new DataView(head.buffer, head.byteOffset, head.byteLength);
  const headBoxes = readBoxes(head, headView, 0, head.length);
  if (headBoxes.length === 0 || headBoxes[0].type !== 'ftyp') return null;

  const ftyp = headBoxes[0];
  const majorBrand = readAscii(head, ftyp.dataStart, 4);
  const compatibleBrands: string[] = [];
  for (let off = ftyp.dataStart + 8; off + 4 <= ftyp.dataEnd; off += 4) {
    const brand = readAscii(head, off, 4).trim();
    if (brand) compatibleBrands.push(brand);
  }

  // Find moov: prefer the head chunk, fall back to the tail chunk.
  let moov: RawBox | null = headBoxes.find((b) => b.type === 'moov') || null;
  let moovBytes: Uint8Array = head;
  let moovView: DataView = headView;
  if (!moov && tail.length > 0) {
    const tailView = new DataView(tail.buffer, tail.byteOffset, tail.byteLength);
    moov = readBoxes(tail, tailView, 0, tail.length).find((b) => b.type === 'moov') || null;
    moovBytes = tail;
    moovView = tailView;
  }

  const out: MediaStructureInfo = {
    majorBrand,
    compatibleBrands: compatibleBrands.length > 0 ? compatibleBrands : undefined,
    tracks: [],
    moovParsed: false,
  };

  if (!moov) {
    // Honest partial: brands known, moov outside the sampled chunks.
    return out;
  }

  const moovChildren = readBoxes(moovBytes, moovView, moov.dataStart, moov.dataEnd);
  for (const child of moovChildren) {
    if (child.type === 'mvhd') {
      const mvhd = parseMvhd(moovBytes, moovView, child);
      if (mvhd) {
        out.timescale = mvhd.timescale;
        out.durationSec = Math.round(mvhd.durationSec * 100) / 100;
      }
    }
    if (child.type === 'trak') {
      const track = parseTrack(moovBytes, moovView, child);
      if (track) out.tracks.push(track);
    }
  }

  out.moovParsed = true;
  if (out.tracks.length > 0) {
    out.hasAudio = out.tracks.some((t) => t.type === 'audio');
  }
  return out;
}
