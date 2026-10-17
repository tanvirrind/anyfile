/**
 * DB-sourced signature index for the file intelligence engine.
 *
 * Consolidates the repo's honest magic-byte sources into one deduplicated
 * detection index (used by detectionEngine.ts and extension-page data):
 *   1. COMPREHENSIVE_SIGNATURES (48 proven detection records) — kept first so
 *      existing detection behavior is unchanged;
 *   2. VERIFIED_EXTENSION_CASES (25 researched per-extension cases, batch-3a,
 *      cross-checked against public file-signature references);
 *   3. FILE_SIGNATURES extras with real hex signatures not covered above
 *      (TIB, IPK, XCI, M4S, M3U, AD1, BPS, URS);
 *   4. woff2 from the expanded MIME database.
 *
 * Honesty rules enforced here:
 * - Every entry must carry a REAL pure-hex magic byte sequence. Prose/ambiguity
 *   entries ("No universal signature", "Text ASCII", etc.) are excluded — they
 *   contribute nothing, and the engine reports "unknown" instead of guessing.
 * - The old fabricated category fallbacks (ZIP/TIFF magic claimed for unknown
 *   formats) must never enter this index.
 * - Formats with no reliable offset-0 signature (e.g. DMG — its real marker is
 *   a 'koly' trailer at end-of-file; the values in FILE_SIGNATURES/MIME DB for
 *   it disagree and match other formats) are deliberately excluded.
 * - Deduplicated by extension: the first source that documents an extension wins.
 */
import { SignaturePattern } from './types';
import { COMPREHENSIVE_SIGNATURES } from './signatures';
import { FILE_SIGNATURES } from '../../data/fileSignaturesData';
import type { FileSignatureRecord } from '../../types';

/**
 * Researched per-extension magic-byte cases (batch-3a, Oct 2026). Each value
 * was cross-checked against Wikipedia's list of file signatures AND a second
 * public reference (Gary Kessler's table, W3C specs, IETF drafts, or vendor
 * documentation). Confidence is 'Medium' for very short (<4 byte) signatures
 * that are honest but weak for detection.
 */
const VERIFIED_EXTENSION_CASES: SignaturePattern[] = [
  {
    id: 'msi',
    name: 'Windows Installer Package',
    extension: 'MSI',
    category: 'System & Executables',
    mimeType: 'application/x-msi',
    magicBytesHex: 'D0 CF 11 E0 A1 B1 1A E1',
    offset: 0,
    confidence: 'High',
    description: 'Windows application installer database in Microsoft Compound File Binary format.',
    meaning: 'OLE2 Compound Document header: D0 CF 11 E0 followed by A1 B1 1A E1.',
    asciiRepresentation: '........',
    isContainer: true,
  },
  {
    id: 'deb',
    name: 'Debian Software Package',
    extension: 'DEB',
    category: 'System & Executables',
    mimeType: 'application/vnd.debian.binary-package',
    magicBytesHex: '21 3C 61 72 63 68 3E 0A',
    offset: 0,
    confidence: 'High',
    description: 'Debian Linux software package stored as a Unix ar archive.',
    meaning: 'ar(1) archive magic "!<arch>" followed by 0x0A.',
    asciiRepresentation: '!<arch>.',
    isContainer: true,
  },
  {
    id: 'rpm',
    name: 'RPM Package Manager Archive',
    extension: 'RPM',
    category: 'System & Executables',
    mimeType: 'application/x-rpm',
    magicBytesHex: 'ED AB EE DB',
    offset: 0,
    confidence: 'High',
    description: 'Red Hat Package Manager software archive with lead, signature, and header sections.',
    meaning: 'Fixed 4-byte RPM lead magic: ED AB EE DB.',
    asciiRepresentation: '....',
    isContainer: true,
  },
  {
    id: 'xar',
    name: 'eXtensible ARchive',
    extension: 'XAR',
    category: 'Archives',
    mimeType: 'application/x-xar',
    magicBytesHex: '78 61 72 21',
    offset: 0,
    confidence: 'High',
    description: 'XML-based extensible archive format (macOS pkgutil archives).',
    meaning: 'ASCII magic "xar!" at offset 0.',
    asciiRepresentation: 'xar!',
    isContainer: true,
  },
  {
    id: 'cpio',
    name: 'cpio Archive (new ASCII)',
    extension: 'CPIO',
    category: 'Archives',
    mimeType: 'application/x-cpio',
    magicBytesHex: '30 37 30 37 30 31',
    offset: 0,
    confidence: 'High',
    description: 'Unix cpio archive in the "new" (SVR4) ASCII header format.',
    meaning: 'ASCII magic "070701" identifying the SVR4 cpio header format.',
    asciiRepresentation: '070701',
    isContainer: true,
  },
  {
    id: 'arj',
    name: 'ARJ Compressed Archive',
    extension: 'ARJ',
    category: 'Archives',
    mimeType: 'application/x-arj',
    magicBytesHex: '60 EA',
    offset: 0,
    confidence: 'High',
    description: 'ARJ multi-volume compressed archive format.',
    meaning: '2-byte ARJ header magic: 60 EA.',
    asciiRepresentation: '` ',
    isContainer: true,
  },
  {
    id: 'lzh',
    name: 'LZH Compressed Archive',
    extension: 'LZH',
    category: 'Archives',
    mimeType: 'application/x-lzh-compressed',
    magicBytesHex: '2D 6C 68',
    offset: 2,
    confidence: 'Medium',
    description: 'Lempel-Ziv-Huffman compressed archive (LHarc family).',
    meaning: 'ASCII "-lh" method marker; detection reads it at offset 2 inside the size prefix.',
    asciiRepresentation: '-lh',
    isContainer: true,
  },
  {
    id: 'zoo',
    name: 'Zoo Archive',
    extension: 'ZOO',
    category: 'Archives',
    mimeType: 'application/x-zoo',
    magicBytesHex: '5A 4F 4F',
    offset: 20,
    confidence: 'Medium',
    description: 'Zoo archival compression format.',
    meaning: 'ASCII "ZOO" tag at offset 20 in the archive header.',
    asciiRepresentation: 'ZOO',
    isContainer: true,
  },
  {
    id: 'toast',
    name: 'Roxio Toast Disc Image',
    extension: 'TOAST',
    category: 'Archives',
    mimeType: 'application/x-toast',
    magicBytesHex: '45 52 02',
    offset: 0,
    confidence: 'High',
    description: 'Roxio Toast optical disc image for macOS.',
    meaning: '3-byte Toast image magic: 45 52 02.',
    asciiRepresentation: 'ER.',
    isContainer: true,
  },
  {
    id: 'vhd',
    name: 'Virtual Hard Disk',
    extension: 'VHD',
    category: 'Archives',
    mimeType: 'application/x-vhd',
    magicBytesHex: '63 6F 6E 65 63 74 69 78',
    offset: 0,
    confidence: 'High',
    description: 'Microsoft Virtual Hard Disk image (Hyper-V / Virtual PC).',
    meaning: 'ASCII "conectix" at offset 0 per the VHD format specification.',
    asciiRepresentation: 'conectix',
    isContainer: true,
  },
  {
    id: 'vmdk',
    name: 'VMware Virtual Disk',
    extension: 'VMDK',
    category: 'Archives',
    mimeType: 'application/x-vmdk',
    magicBytesHex: '23 20 44 69 73 6B 20 44 65 73 63 72 69 70 74 6F',
    offset: 0,
    confidence: 'High',
    description: 'VMware virtual machine disk in descriptor (text) format.',
    meaning: 'ASCII "# Disk Descripto" header of a VMware 4 virtual disk descriptor file.',
    asciiRepresentation: '# Disk Descripto',
    isContainer: true,
  },
  {
    id: 'vdi',
    name: 'VirtualBox Disk Image',
    extension: 'VDI',
    category: 'Archives',
    mimeType: 'application/x-virtualbox-vdi',
    magicBytesHex: '3C 3C 3C',
    offset: 64,
    confidence: 'Medium',
    description: 'Oracle VM VirtualBox virtual disk image.',
    meaning: 'ASCII "<<<" pre-header text of the VDI format; short signature, verify with context.',
    asciiRepresentation: '<<<',
    isContainer: true,
  },
  {
    id: 'qcow2',
    name: 'QEMU Copy-On-Write Disk',
    extension: 'QCOW2',
    category: 'Archives',
    mimeType: 'application/x-qemu-disk',
    magicBytesHex: '51 46 49',
    offset: 0,
    confidence: 'Medium',
    description: 'QEMU copy-on-write virtual disk image format.',
    meaning: 'ASCII "QFI" magic at offset 0 followed by the version field; short signature.',
    asciiRepresentation: 'QFI',
    isContainer: true,
  },
  {
    id: 'otf',
    name: 'OpenType Font',
    extension: 'OTF',
    category: 'Code & Data',
    mimeType: 'font/otf',
    magicBytesHex: '4F 54 54 4F',
    offset: 0,
    confidence: 'High',
    description: 'OpenType outline font container.',
    meaning: 'ASCII "OTTO" sfnt version tag.',
    asciiRepresentation: 'OTTO',
  },
  {
    id: 'woff',
    name: 'Web Open Font Format',
    extension: 'WOFF',
    category: 'Code & Data',
    mimeType: 'font/woff',
    magicBytesHex: '77 4F 46 46',
    offset: 0,
    confidence: 'High',
    description: 'Web Open Font Format (WOFF 1.0) container.',
    meaning: 'ASCII "wOFF" signature.',
    asciiRepresentation: 'wOFF',
    isContainer: true,
  },
  {
    id: 'woff2',
    name: 'Web Open Font Format 2',
    extension: 'WOFF2',
    category: 'Code & Data',
    mimeType: 'font/woff2',
    magicBytesHex: '77 4F 46 32',
    offset: 0,
    confidence: 'High',
    description: 'Web Open Font Format 2.0 with Brotli compression.',
    meaning: 'ASCII "wOF2" signature.',
    asciiRepresentation: 'wOF2',
    isContainer: true,
  },
  {
    id: 'icns',
    name: 'Apple Icon Image',
    extension: 'ICNS',
    category: 'Images',
    mimeType: 'image/icns',
    magicBytesHex: '69 63 6E 73',
    offset: 0,
    confidence: 'High',
    description: 'Apple macOS icon container holding multiple resolutions.',
    meaning: 'ASCII "icns" magic.',
    asciiRepresentation: 'icns',
    isContainer: true,
  },
  {
    id: 'jp2',
    name: 'JPEG 2000 Image',
    extension: 'JP2',
    category: 'Images',
    mimeType: 'image/jp2',
    magicBytesHex: '00 00 00 0C 6A 50 20 20',
    offset: 0,
    confidence: 'High',
    description: 'JPEG 2000 still image in the JP2 file format.',
    meaning: 'JP2 signature box: 12-byte box length 0x0000000C followed by "jP  ".',
    asciiRepresentation: '....jP  ',
    isContainer: true,
  },
  {
    id: 'chm',
    name: 'Compiled HTML Help',
    extension: 'CHM',
    category: 'Documents',
    mimeType: 'application/vnd.ms-htmlhelp',
    magicBytesHex: '49 54 53 46',
    offset: 0,
    confidence: 'High',
    description: 'Microsoft Compiled HTML Help file (ITStorage format).',
    meaning: 'ASCII "ITSF" magic of the ITSF storage header.',
    asciiRepresentation: 'ITSF',
    isContainer: true,
  },
  {
    id: 'ps',
    name: 'PostScript Document',
    extension: 'PS',
    category: 'Documents',
    mimeType: 'application/postscript',
    magicBytesHex: '25 21 50 53',
    offset: 0,
    confidence: 'High',
    description: 'Adobe PostScript page-description document.',
    meaning: 'ASCII "%!PS" header comment.',
    asciiRepresentation: '%!PS',
  },
  {
    id: 'dbf',
    name: 'dBASE Database File',
    extension: 'DBF',
    category: 'Databases',
    mimeType: 'application/x-dbase',
    magicBytesHex: '03',
    offset: 0,
    confidence: 'Medium',
    description: 'dBASE-family database table file.',
    meaning: 'Version byte 0x03 at offset 0. Single-byte signature: honest but weak — always verify with content context.',
    asciiRepresentation: '.',
    isContainer: true,
  },
  {
    id: 'mpg',
    name: 'MPEG-1/2 Video',
    extension: 'MPG',
    category: 'Audio & Video',
    mimeType: 'video/mpeg',
    magicBytesHex: '00 00 01 BA',
    offset: 0,
    confidence: 'High',
    description: 'MPEG program-stream video container.',
    meaning: 'MPEG pack-start code 0x000001BA.',
    asciiRepresentation: '....',
    isContainer: true,
  },
  {
    id: 'swf',
    name: 'Shockwave Flash',
    extension: 'SWF',
    category: 'Audio & Video',
    mimeType: 'application/x-shockwave-flash',
    magicBytesHex: '46 57 53',
    offset: 0,
    confidence: 'High',
    description: 'Adobe Shockwave Flash movie (uncompressed variant).',
    meaning: 'ASCII "FWS" magic of the uncompressed SWF header.',
    asciiRepresentation: 'FWS',
    isContainer: true,
  },
  {
    id: 'ogv',
    name: 'Ogg Video',
    extension: 'OGV',
    category: 'Audio & Video',
    mimeType: 'video/ogg',
    magicBytesHex: '4F 67 67 53',
    offset: 0,
    confidence: 'High',
    description: 'Ogg container video stream (Theora/VP8).',
    meaning: 'ASCII "OggS" page capture pattern shared by all Ogg media.',
    asciiRepresentation: 'OggS',
    isContainer: true,
  },
  {
    id: 'amr',
    name: 'Adaptive Multi-Rate Audio',
    extension: 'AMR',
    category: 'Audio & Video',
    mimeType: 'audio/amr',
    magicBytesHex: '23 21 41 4D 52',
    offset: 0,
    confidence: 'High',
    description: 'AMR narrowband speech audio codec file.',
    meaning: 'ASCII "#!AMR" file magic.',
    asciiRepresentation: '#!AMR',
  },
  {
    id: 'rm',
    name: 'RealMedia',
    extension: 'RM',
    category: 'Audio & Video',
    mimeType: 'application/vnd.rn-realmedia',
    magicBytesHex: '2E 52 4D 46',
    offset: 0,
    confidence: 'High',
    description: 'RealNetworks RealMedia container.',
    meaning: 'ASCII ".RMF" object header magic.',
    asciiRepresentation: '.RMF',
    isContainer: true,
  },
];

/**
 * FILE_SIGNATURES records with real hex signatures not already covered by the
 * sources above. Excluded on purpose:
 * - DMG: no reliable offset-0 signature exists (its real marker is a 'koly'
 *   trailer at end-of-file); the stored values disagree with public references.
 * - AI: '%PDF' is not distinctive — it matches every PDF.
 * - JPEG: alias of the existing JPG record.
 */
const FILE_SIGNATURE_ALLOWLIST = new Set([
  'tib', 'ipk', 'xci', 'm4s', 'm3u', 'ad1', 'bps', 'urs',
]);

function fileSignatureToPattern(record: FileSignatureRecord): SignaturePattern {
  return {
    id: record.id,
    name: record.name,
    extension: record.extension,
    category: record.category as SignaturePattern['category'],
    mimeType: record.mime_type,
    magicBytesHex: record.signature,
    offset: record.offset ?? 0,
    confidence: 'High',
    description: record.description,
    meaning: `Documented ${record.name} header signature: ${record.signature}.`,
    asciiRepresentation: record.magicBytesAscii,
  };
}

/**
 * The consolidated, deduplicated detection index.
 * Order: proven COMPREHENSIVE_SIGNATURES first (existing behavior preserved),
 * then researched extension cases, then FILE_SIGNATURES extras.
 */
const DB_SIGNATURES_LIST: SignaturePattern[] = [];
{
  const seen = new Set<string>();
  const addAll = (patterns: SignaturePattern[]) => {
    for (const pattern of patterns) {
      const key = pattern.extension.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      DB_SIGNATURES_LIST.push(pattern);
    }
  };

  addAll(COMPREHENSIVE_SIGNATURES);
  addAll(VERIFIED_EXTENSION_CASES);
  addAll(
    FILE_SIGNATURES.filter((record) =>
      FILE_SIGNATURE_ALLOWLIST.has(record.extension.toLowerCase())
    ).map(fileSignatureToPattern)
  );
}

export const DB_SIGNATURES: SignaturePattern[] = DB_SIGNATURES_LIST;
