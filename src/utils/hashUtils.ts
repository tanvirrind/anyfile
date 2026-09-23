// Pure JavaScript MD5 Implementation (RFC 1321), IEEE 802.3 CRC-32 & Web Crypto API for SHA-1, SHA-256, SHA-384, SHA-512

export interface FileHashResult {
  fileName: string;
  fileSize: number;
  formattedSize: string;
  mimeType: string;
  crc32: string;
  md5: string;
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
  calculatedAt: string;
}

export type HashAlgorithm = 'CRC-32' | 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

// Precomputed CRC-32 table (IEEE 802.3 standard polynomial 0xEDB88320)
function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = makeCrcTable();

export function crc32Uint8Array(bytes: Uint8Array): string {
  let crc = 0 ^ (-1);
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
  }
  const result = (crc ^ (-1)) >>> 0;
  return result.toString(16).padStart(8, '0');
}

// Standard MD5 implementation for Uint8Array
function md5Uint8Array(bytes: Uint8Array): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }

  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  const len = bytes.length;
  // Convert bytes to 32-bit words
  const blocks: number[] = [];
  for (let i = 0; i < len; i++) {
    blocks[i >> 2] |= bytes[i] << ((i % 4) * 8);
  }

  // Padding
  blocks[len >> 2] |= 0x80 << ((len % 4) * 8);
  const totalWords = (((len + 8) >> 6) + 1) * 16;
  while (blocks.length < totalWords) {
    blocks.push(0);
  }

  // Bit length (64-bit integer split into two 32-bit words)
  const bitLen = len * 8;
  blocks[totalWords - 2] = bitLen & 0xffffffff;
  blocks[totalWords - 1] = Math.floor(bitLen / 0x100000000);

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < blocks.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;

    a = md5ff(a, b, c, d, blocks[i], 7, -680876936);
    d = md5ff(d, a, b, c, blocks[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, blocks[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, blocks[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, blocks[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, blocks[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, blocks[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, blocks[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, blocks[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, blocks[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, blocks[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, blocks[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, blocks[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, blocks[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, blocks[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, blocks[i + 15], 22, 1236535329);

    a = md5gg(a, b, c, d, blocks[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, blocks[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, blocks[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, blocks[i], 20, -373897302);
    a = md5gg(a, b, c, d, blocks[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, blocks[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, blocks[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, blocks[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, blocks[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, blocks[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, blocks[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, blocks[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, blocks[i + 13], 5, -144468057);
    d = md5gg(d, a, b, c, blocks[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, blocks[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, blocks[i + 12], 20, -1926607734);

    a = md5hh(a, b, c, d, blocks[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, blocks[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, blocks[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, blocks[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, blocks[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, blocks[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, blocks[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, blocks[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, blocks[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, blocks[i], 11, -358537222);
    c = md5hh(c, d, a, b, blocks[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, blocks[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, blocks[i + 9], 4, -640364409);
    d = md5hh(d, a, b, c, blocks[i + 12], 11, -321641275);
    c = md5hh(c, d, a, b, blocks[i + 15], 16, 616512768);
    b = md5hh(b, c, d, a, blocks[i + 8], 23, -150988699);

    a = md5ii(a, b, c, d, blocks[i], 6, -198630844);
    d = md5ii(d, a, b, c, blocks[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, blocks[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, blocks[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, blocks[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, blocks[i + 3], 10, -1894980156);
    c = md5ii(c, d, a, b, blocks[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, blocks[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, blocks[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, blocks[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, blocks[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, blocks[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, blocks[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, blocks[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, blocks[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, blocks[i + 9], 21, -343485551);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  function wordToHex(val: number) {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      const byte = (val >> (i * 8)) & 0xff;
      hex += byte.toString(16).padStart(2, '0');
    }
    return hex;
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}

// Convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < byteArray.length; i++) {
    hex += byteArray[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * SHA-256 hex digest of a full buffer, or null if the Web Crypto API is
 * unavailable (insecure/non-HTTPS context). Never fabricates a fallback value.
 */
export async function sha256Hex(buffer: ArrayBuffer): Promise<string | null> {
  try {
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return bufferToHex(digest);
  } catch {
    return null;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function calculateFileHashes(
  file: File,
  onProgress?: (percent: number) => void
): Promise<FileHashResult> {
  onProgress?.(10);
  const buffer = await file.arrayBuffer();
  onProgress?.(30);

  const bytes = new Uint8Array(buffer);

  // CRC-32
  const crc32Hex = crc32Uint8Array(bytes);
  onProgress?.(45);

  // MD5
  const md5Hex = md5Uint8Array(bytes);
  onProgress?.(60);

  // Web Crypto API for SHA-1, SHA-256, SHA-384, SHA-512
  const sha1Buf = await crypto.subtle.digest('SHA-1', buffer);
  onProgress?.(70);

  const sha256Buf = await crypto.subtle.digest('SHA-256', buffer);
  onProgress?.(80);

  const sha384Buf = await crypto.subtle.digest('SHA-384', buffer);
  onProgress?.(90);

  const sha512Buf = await crypto.subtle.digest('SHA-512', buffer);
  onProgress?.(100);

  return {
    fileName: file.name,
    fileSize: file.size,
    formattedSize: formatFileSize(file.size),
    mimeType: file.type || 'application/octet-stream',
    crc32: crc32Hex,
    md5: md5Hex,
    sha1: bufferToHex(sha1Buf),
    sha256: bufferToHex(sha256Buf),
    sha384: bufferToHex(sha384Buf),
    sha512: bufferToHex(sha512Buf),
    calculatedAt: new Date().toISOString()
  };
}

export function sanitizeHashString(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-f0-9]/g, '');
}

export function compareChecksums(
  inputChecksum: string,
  hashes: { crc32?: string; md5: string; sha1: string; sha256: string; sha384?: string; sha512: string }
): {
  isMatch: boolean;
  matchedAlgorithm?: HashAlgorithm;
  detectedType?: HashAlgorithm;
  cleanInput: string;
} {
  const clean = sanitizeHashString(inputChecksum);
  if (!clean) {
    return { isMatch: false, cleanInput: '' };
  }

  let detectedType: HashAlgorithm | undefined;
  if (clean.length === 8) detectedType = 'CRC-32';
  else if (clean.length === 32) detectedType = 'MD5';
  else if (clean.length === 40) detectedType = 'SHA-1';
  else if (clean.length === 64) detectedType = 'SHA-256';
  else if (clean.length === 96) detectedType = 'SHA-384';
  else if (clean.length === 128) detectedType = 'SHA-512';

  if (hashes.crc32 && clean === hashes.crc32.toLowerCase()) {
    return { isMatch: true, matchedAlgorithm: 'CRC-32', detectedType, cleanInput: clean };
  }
  if (clean === hashes.md5.toLowerCase()) {
    return { isMatch: true, matchedAlgorithm: 'MD5', detectedType, cleanInput: clean };
  }
  if (clean === hashes.sha1.toLowerCase()) {
    return { isMatch: true, matchedAlgorithm: 'SHA-1', detectedType, cleanInput: clean };
  }
  if (clean === hashes.sha256.toLowerCase()) {
    return { isMatch: true, matchedAlgorithm: 'SHA-256', detectedType, cleanInput: clean };
  }
  if (hashes.sha384 && clean === hashes.sha384.toLowerCase()) {
    return { isMatch: true, matchedAlgorithm: 'SHA-384', detectedType, cleanInput: clean };
  }
  if (clean === hashes.sha512.toLowerCase()) {
    return { isMatch: true, matchedAlgorithm: 'SHA-512', detectedType, cleanInput: clean };
  }

  return { isMatch: false, detectedType, cleanInput: clean };
}
