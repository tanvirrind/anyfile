/**
 * Hand-rolled ICO container builder: ICONDIR + ICONDIRENTRY records
 * with PNG-compressed image payloads (Vista-era format, universally supported).
 */

/** Builds a real .ico binary from PNG payloads. */
export function buildIco(pngs: { size: number; data: ArrayBuffer }[]): ArrayBuffer {
  const count = pngs.length;
  const headerSize = 6 + 16 * count;
  const total = headerSize + pngs.reduce((s, p) => s + p.data.byteLength, 0);
  const buffer = new ArrayBuffer(total);
  const view = new DataView(buffer);
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: ICO
  view.setUint16(4, count, true); // image count
  let offset = headerSize;
  pngs.forEach((p, i) => {
    const entry = 6 + i * 16;
    view.setUint8(entry, p.size === 256 ? 0 : p.size); // width (0 = 256)
    view.setUint8(entry + 1, p.size === 256 ? 0 : p.size); // height
    view.setUint8(entry + 2, 0); // color palette: none
    view.setUint8(entry + 3, 0); // reserved
    view.setUint16(entry + 4, 1, true); // color planes
    view.setUint16(entry + 6, 32, true); // bits per pixel
    view.setUint32(entry + 8, p.data.byteLength, true); // payload size
    view.setUint32(entry + 12, offset, true); // payload offset
    new Uint8Array(buffer, offset, p.data.byteLength).set(new Uint8Array(p.data));
    offset += p.data.byteLength;
  });
  return buffer;
}

/** Parses an ICO header for verification (used by tests). */
export function parseIcoHeader(buffer: ArrayBuffer): {
  reserved: number;
  type: number;
  count: number;
  entries: { size: number; bytesInRes: number; imageOffset: number }[];
} {
  const view = new DataView(buffer);
  const count = view.getUint16(4, true);
  const entries: { size: number; bytesInRes: number; imageOffset: number }[] = [];
  for (let i = 0; i < count; i++) {
    const entry = 6 + i * 16;
    const raw = view.getUint8(entry);
    entries.push({
      size: raw === 0 ? 256 : raw,
      bytesInRes: view.getUint32(entry + 8, true),
      imageOffset: view.getUint32(entry + 12, true),
    });
  }
  return { reserved: view.getUint16(0, true), type: view.getUint16(2, true), count, entries };
}
