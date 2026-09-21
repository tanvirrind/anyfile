export interface ZipEntryItem {
  name: string;
  size: number; // Uncompressed size
  compressedSize?: number;
  date: Date;
  isDirectory: boolean;
  isEncrypted: boolean;
  comment?: string;
}

export interface ZipInspectionResult {
  fileName: string;
  totalEntries: number;
  totalUncompressedBytes: number;
  isEncrypted: boolean;
  entries: ZipEntryItem[];
  warnings: string[];
}

export interface ExtractedFileItem {
  fileName: string;
  blob: Blob;
  size: number;
  mimeType: string;
}

const MAX_UNCOMPRESSED_ARCHIVE_SIZE = 250 * 1024 * 1024; // 250 MB browser heap safety cap
const MAX_ENTRIES_COUNT = 5000;

/**
 * Inspects a ZIP archive file with security defenses against Zip Slip and ZIP bombs.
 */
export async function inspectZipArchive(file: File): Promise<ZipInspectionResult> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  const entries: ZipEntryItem[] = [];
  const warnings: string[] = [];
  let totalUncompressedBytes = 0;
  let isEncrypted = false;

  const entryKeys = Object.keys(loadedZip.files);
  if (entryKeys.length > MAX_ENTRIES_COUNT) {
    warnings.push(`Archive contains ${entryKeys.length} entries, which exceeds safe inspection threshold (${MAX_ENTRIES_COUNT}).`);
  }

  for (const relativePath of entryKeys) {
    // 1. Security: Path Traversal Protection (Zip Slip defense)
    if (relativePath.includes('..') || relativePath.startsWith('/') || relativePath.startsWith('\\')) {
      warnings.push(`Suspicious entry path detected: '${relativePath}'. Path traversal prevented.`);
    }

    const zipObj = loadedZip.files[relativePath];
    const isDir = zipObj.dir;

    // Check encryption flags in JSZip internals if available
    const isEntryEncrypted = (zipObj as any)._data?.uncompressedSize === 0 && (zipObj as any)._data?.crc32 === 0;
    if (isEntryEncrypted) {
      isEncrypted = true;
    }

    const uncompressedSize = (zipObj as any)._data?.uncompressedSize || 0;
    const compressedSize = (zipObj as any)._data?.compressedSize || 0;
    totalUncompressedBytes += uncompressedSize;

    // Heuristic: flag extreme compression ratios (a hallmark of ZIP bombs).
    if (compressedSize > 0 && uncompressedSize / compressedSize > 1000) {
      warnings.push(`Entry '${relativePath}' has a suspicious ${Math.round(uncompressedSize / compressedSize)}:1 compression ratio (possible ZIP bomb).`);
    }

    entries.push({
      name: relativePath,
      size: uncompressedSize,
      compressedSize: compressedSize || undefined,
      date: zipObj.date || new Date(),
      isDirectory: isDir,
      isEncrypted: isEntryEncrypted,
      comment: zipObj.comment || undefined
    });
  }

  // 2. Security: ZIP bomb threshold check
  if (totalUncompressedBytes > MAX_UNCOMPRESSED_ARCHIVE_SIZE) {
    warnings.push(`Uncompressed size exceeds 250 MB (${Math.round(totalUncompressedBytes / 1024 / 1024)} MB). Extraction may be constrained by browser memory.`);
  }

  return {
    fileName: file.name,
    totalEntries: entries.length,
    totalUncompressedBytes,
    isEncrypted,
    entries,
    warnings
  };
}

/**
 * Safely extracts entries from a ZIP archive in browser memory.
 */
export async function extractZipEntries(
  file: File,
  selectedEntries?: string[]
): Promise<ExtractedFileItem[]> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);
  const results: ExtractedFileItem[] = [];

  let accumulatedBytes = 0;

  for (const relativePath of Object.keys(loadedZip.files)) {
    // Check if entry was filtered
    if (selectedEntries && !selectedEntries.includes(relativePath)) {
      continue;
    }

    const zipObj = loadedZip.files[relativePath];
    if (zipObj.dir) continue; // skip directory placeholders

    // Security: Path traversal protection
    if (relativePath.includes('..') || relativePath.startsWith('/') || relativePath.startsWith('\\')) {
      throw new Error(`Extraction aborted: Malicious path traversal detected in '${relativePath}'`);
    }

    // Security: pre-decompression ZIP bomb guard. Check the declared uncompressed
    // size BEFORE inflating, so a bomb is rejected without materializing it in memory.
    const declaredSize = (zipObj as any)._data?.uncompressedSize || 0;
    if (accumulatedBytes + declaredSize > MAX_UNCOMPRESSED_ARCHIVE_SIZE) {
      throw new Error(
        `Extraction halted: uncompressed size would exceed the ${Math.round(MAX_UNCOMPRESSED_ARCHIVE_SIZE / 1024 / 1024)} MB safety limit.`
      );
    }

    const blob = await zipObj.async('blob');
    accumulatedBytes += blob.size;

    // Backstop: verify the actual decompressed size, defending against entries that
    // understate their declared uncompressed size in the archive metadata.
    if (accumulatedBytes > MAX_UNCOMPRESSED_ARCHIVE_SIZE) {
      throw new Error(`Extraction halted: Maximum safety limit (250 MB) exceeded to protect browser stability.`);
    }

    const cleanFileName = relativePath.split('/').pop() || relativePath;
    const ext = cleanFileName.split('.').pop()?.toLowerCase() || '';

    let mimeType = 'application/octet-stream';
    if (['jpg', 'jpeg'].includes(ext)) mimeType = 'image/jpeg';
    else if (ext === 'png') mimeType = 'image/png';
    else if (ext === 'webp') mimeType = 'image/webp';
    else if (ext === 'pdf') mimeType = 'application/pdf';
    else if (['txt', 'csv', 'json', 'md', 'xml'].includes(ext)) mimeType = 'text/plain';

    results.push({
      fileName: cleanFileName,
      blob,
      size: blob.size,
      mimeType
    });
  }

  return results;
}

/**
 * Packages multiple files into a clean ZIP archive.
 */
export async function createZipPackage(
  files: Array<{ name: string; blob: Blob }>,
  archiveName: string = 'archive.zip'
): Promise<{ zipBlob: Blob; zipUrl: string; size: number }> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  files.forEach((f) => {
    // Sanitize filename
    const safeName = f.name.replace(/[\\/:]/g, '_');
    zip.file(safeName, f.blob);
  });

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const zipUrl = URL.createObjectURL(zipBlob);
  return {
    zipBlob,
    zipUrl,
    size: zipBlob.size
  };
}
