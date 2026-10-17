import type { ZipContainerKind, ZipStructureInfo } from '../types';
import { StructureUnavailableError } from '../structureRunner';

/**
 * ZIP-family structure parser (Batch B).
 *
 * Covers any PK\x03\x04 container: plain .zip plus ZIP-container formats —
 * DOCX/DOCM, XLSX/XLSM, PPTX/PPTM, EPUB, ODT/ODS/ODP, APK, JAR, VSDX.
 * Gating drives off the *detected* extension AND the magic header, so a
 * mislabeled file (report.doc renamed from a .zip) is still parsed honestly.
 *
 * Engineering rules:
 * - jszip is dynamically imported: non-ZIP files pay zero bundle cost.
 * - jszip indexes the central directory only; we never decompress entries
 *   except small executable-candidate samples (capped).
 * - Files over ZIP_STRUCTURE_MAX_BYTES are refused with an honest note:
 *   jszip requires the whole blob in memory (the analyzer already holds one
 *   full copy for SHA-256; a second large copy risks tab crashes).
 */

export const ZIP_STRUCTURE_MAX_BYTES = 100 * 1024 * 1024; // 100 MB
export const ZIP_ENTRY_LIST_CAP = 200;
const EXE_SAMPLE_CAP = 20;
const EXE_SAMPLE_MAX_BYTES = 2 * 1024 * 1024; // 2 MB per sampled entry
const RISKY_NAME_RE = /\.(exe|dll|sys|scr|com|bat|cmd|ps1|vbs|vbe|jar|msi|apk|elf|so|dylib)$/i;

const ZIP_FAMILY_EXTS = new Set([
  'ZIP', 'DOCX', 'DOCM', 'DOTX', 'DOTM',
  'XLSX', 'XLSM', 'XLTX', 'XLTM',
  'PPTX', 'PPTM', 'POTX', 'POTM',
  'EPUB', 'ODT', 'ODS', 'ODP', 'ODG',
  'JAR', 'APK', 'VSDX',
]);

function startsWithPk(headerBytes: Uint8Array): boolean {
  return (
    headerBytes.length >= 4 &&
    headerBytes[0] === 0x50 &&
    headerBytes[1] === 0x4b &&
    headerBytes[2] === 0x03 &&
    headerBytes[3] === 0x04
  );
}

function detectContainerKind(fileNames: Set<string>): ZipContainerKind {
  const hasVba = [...fileNames].some((n) => n.toLowerCase().endsWith('vbaproject.bin'));
  if (fileNames.has('[Content_Types].xml')) {
    const isWord = fileNames.has('word/document.xml');
    const isXl = fileNames.has('xl/workbook.xml');
    const isPpt = fileNames.has('ppt/presentation.xml');
    if (hasVba) return isWord ? 'docm' : isXl ? 'xlsm' : isPpt ? 'pptm' : 'ooxml-macro';
    return isWord ? 'docx' : isXl ? 'xlsx' : isPpt ? 'pptx' : 'ooxml';
  }
  if (fileNames.has('META-INF/container.xml')) return 'epub';
  if (fileNames.has('AndroidManifest.xml')) return 'apk';
  if (fileNames.has('content.xml') || [...fileNames].some((n) => n.startsWith('META-INF/'))) return 'odf';
  return 'zip';
}

function hasExecutableHeader(bytes: Uint8Array): boolean {
  if (bytes.length >= 2 && bytes[0] === 0x4d && bytes[1] === 0x5a) return true; // MZ (PE/COFF)
  if (bytes.length >= 4 && bytes[0] === 0x7f && bytes[1] === 0x45 && bytes[2] === 0x4c && bytes[3] === 0x46) return true; // ELF
  return false;
}

export async function parseZipStructure(
  file: File,
  detectedExt: string,
  headerBytes: Uint8Array
): Promise<ZipStructureInfo | null> {
  const ext = (detectedExt || '').toUpperCase().replace(/^\./, '');
  if (!ZIP_FAMILY_EXTS.has(ext) && !startsWithPk(headerBytes)) return null;

  if (file.size > ZIP_STRUCTURE_MAX_BYTES) {
    throw new StructureUnavailableError(
      `File exceeds ${(ZIP_STRUCTURE_MAX_BYTES / (1024 * 1024)).toFixed(0)} MB — ` +
        'in-browser ZIP listing is skipped to protect device memory. Identification and metadata above remain valid.'
    );
  }

  const { default: JSZip } = await import('jszip');

  let zip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    throw new StructureUnavailableError(
      'The ZIP container could not be parsed — the file may be corrupt, truncated, or use an unsupported encoding.'
    );
  }

  const allNames = Object.keys(zip.files).filter((name) => !zip.files[name].dir);
  const totalEntries = allNames.length;
  const nameSet = new Set(allNames);
  const containerKind = detectContainerKind(nameSet);

  const listedNames = allNames.slice(0, ZIP_ENTRY_LIST_CAP);
  const entries = listedNames.map((name) => {
    const entry = zip.files[name];
    // _data is jszip-internal; read defensively with fallbacks to 0.
    const internal = (entry as unknown as { _data?: { compressedSize?: number; uncompressedSize?: number } })._data;
    return {
      name,
      compressedSize: internal?.compressedSize ?? 0,
      uncompressedSize: internal?.uncompressedSize ?? 0,
      isDirectory: false,
      modifiedAt: entry.date ? entry.date.toISOString() : undefined,
    };
  });

  const hasVba = allNames.some((n) => n.toLowerCase().endsWith('vbaproject.bin'));

  // Sample executable-candidate entries: name looks risky AND header matches MZ/ELF.
  // Only the first bytes of small entries are loaded — never full decompression.
  const riskyNames = allNames.filter((n) => RISKY_NAME_RE.test(n));
  const executableEntries: string[] = [];
  for (const name of riskyNames.slice(0, EXE_SAMPLE_CAP)) {
    const entry = zip.files[name];
    const internal = (entry as unknown as { _data?: { uncompressedSize?: number } })._data;
    const size = internal?.uncompressedSize ?? 0;
    if (size === 0 || size > EXE_SAMPLE_MAX_BYTES) continue;
    try {
      const bytes = await entry.async('uint8array');
      if (hasExecutableHeader(bytes.slice(0, 16))) executableEntries.push(name);
    } catch {
      // Unreadable entry: skip silently, count it via riskyEntryCount.
    }
  }

  return {
    entries,
    totalEntries,
    truncated: totalEntries > ZIP_ENTRY_LIST_CAP,
    containerKind,
    hasMacros: hasVba,
    executableEntries: executableEntries.slice(0, 5),
    riskyEntryCount: riskyNames.length,
  };
}
