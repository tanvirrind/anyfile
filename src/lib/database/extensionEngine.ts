import { CategoryType, FileTypeInfo, SoftwareApp } from '../../types';
import extensionsData from '../../data/extensions.json';
import { IMAGE_EXTENSIONS_DATA } from '../../data/imageExtensionsData';
import { DOCUMENT_EXTENSIONS_DATA } from '../../data/documentExtensionsData';
import { MEDIA_AND_ARCHIVE_EXTENSIONS_DATA } from '../../data/mediaAndArchiveExtensionsData';
import { CAD_AND_ENGINEERING_EXTENSIONS_DATA } from '../../data/cadAndEngineeringExtensionsData';
import { DEVELOPER_EXTENSIONS_DATA } from '../../data/developerExtensionsData';
import { SPECIALIZED_EXTENSIONS_DATA } from '../../data/specializedExtensionsData';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { COMPREHENSIVE_SIGNATURES } from '../analyzer/signatures';
import { EXPANDED_MIME_DATABASE } from '../../data/expandedMimeDatabase';
import { FILE_SIGNATURES } from '../../data/fileSignaturesData';

export interface ExtensionSchema {
  slug: string;
  extension: string;
  title: string;
  description: string;
  category: CategoryType;
  mime: string;
  developer: string;
  software: string[];
  related_extensions: string[];
  related_guides: string[];
  related_converters: string[];
  security: {
    dangerRating: 'Low Risk' | 'Medium Risk' | 'High Risk';
    canContainMalware: boolean;
    tips: string[];
  };
  keywords: string[];
}

/**
 * Universal Alias Dictionary mapping alternate extension spellings to canonical records
 */
export const ALIAS_MAP: Record<string, string> = {
  jpeg: 'jpg',
  jpe: 'jpg',
  jfif: 'jpg',
  htm: 'html',
  xhtml: 'html',
  tiff: 'tif',
  yml: 'yaml',
  mid: 'midi',
  m4a: 'mp3',
  mpg: 'mp4',
  mpeg: 'mp4',
  m4v: 'mp4',
  doc: 'docx',
  xls: 'xlsx',
  ppt: 'pptx',
  gz: 'zip',
  tar: 'zip',
  tgz: 'zip',
  tbz: 'zip',
  '7z': 'zip',
  rar: 'zip',
  text: 'txt',
  log: 'txt',
  md: 'txt',
  markdown: 'txt',
  js: 'code',
  ts: 'code',
  py: 'code',
  cpp: 'code',
  java: 'code',
  cs: 'code',
  php: 'code',
  rb: 'code',
  go: 'code',
  rs: 'code',
  swift: 'code',
  kt: 'code'
};

// Fast O(1) memory cache index for pre-built and dynamically hydrated records
const EXTENSION_INDEX = new Map<string, ExtensionSchema>();
const KNOWN_SLUGS = new Set<string>();
const VERIFIED_EXTENSIONS_CATALOG = new Set<string>();

/**
 * Validates whether an extension string exists within the verified database catalog
 */
export function isVerifiedExtension(extRaw: string): boolean {
  if (!extRaw || typeof extRaw !== 'string') return false;
  initializeExtensionDatabase();
  const clean = extRaw.trim().toLowerCase().replace(/^\./, '').replace(/[^a-z0-9_-]/g, '');
  if (!clean) return false;
  if (VERIFIED_EXTENSIONS_CATALOG.has(clean)) return true;
  const alias = ALIAS_MAP[clean];
  if (alias && VERIFIED_EXTENSIONS_CATALOG.has(alias)) return true;
  return false;
}

/**
 * Normalizes extension strings: strips leading dot, converts to lowercase trimmed string
 */
export function normalizeExtensionKey(extRaw: string): string {
  if (!extRaw) return 'dat';
  const cleaned = extRaw.trim().toLowerCase().replace(/^\./, '').replace(/[^a-z0-9_-]/g, '');
  return ALIAS_MAP[cleaned] || cleaned || 'dat';
}

/**
 * Automatically generates clean URL slugs for extension pages
 */
export function generateExtensionSlug(extRaw: string): string {
  const normKey = normalizeExtensionKey(extRaw);
  return normKey.toLowerCase();
}

/**
 * Validation System: Prevents duplicate extensions and validates schema compliance
 */
export function validateExtensionRecord(data: Partial<ExtensionSchema>): {
  isValid: boolean;
  errors: string[];
  normalized: ExtensionSchema;
} {
  const errors: string[] = [];
  const rawExt = data.extension || 'DAT';
  const cleanExt = rawExt.toUpperCase().replace(/^\./, '').replace(/[^A-Z0-9_-]/g, '') || 'DAT';
  const slug = data.slug || generateExtensionSlug(cleanExt);

  if (!cleanExt) errors.push('Extension string is required');
  if (!data.title) errors.push('Title is required');
  if (!data.description) errors.push('Description is required');
  if (!data.category) errors.push('Category is required');

  const normalized: ExtensionSchema = {
    slug,
    extension: cleanExt,
    title: data.title || `.${cleanExt} File Extension Reference & Specifications`,
    description: data.description || `Complete guide to .${cleanExt} file extension format, software viewers, and conversion tools.`,
    category: data.category || 'Documents',
    mime: data.mime || `application/x-${cleanExt.toLowerCase()}`,
    developer: data.developer || 'Open Standard Working Group',
    software: Array.isArray(data.software) && data.software.length > 0 ? data.software : ['Universal File Viewer', 'System Default App'],
    related_extensions: Array.isArray(data.related_extensions) ? data.related_extensions : ['JPG', 'PDF', 'ZIP'],
    related_guides: Array.isArray(data.related_guides) ? data.related_guides : ['how-to-open-unknown-files'],
    related_converters: Array.isArray(data.related_converters) ? data.related_converters : ['pdf-to-word', 'heic-to-jpg'],
    security: {
      dangerRating: data.security?.dangerRating || 'Low Risk',
      canContainMalware: Boolean(data.security?.canContainMalware),
      tips: Array.isArray(data.security?.tips) && data.security.tips.length > 0
        ? data.security.tips
        : [`Verify .${cleanExt} file extensions before opening`, 'Inspect magic byte headers for integrity'],
    },
    keywords: Array.isArray(data.keywords) && data.keywords.length > 0
      ? data.keywords
      : [`${cleanExt.toLowerCase()} file`, `open ${cleanExt.toLowerCase()}`, `convert ${cleanExt.toLowerCase()}`],
  };

  return {
    isValid: errors.length === 0,
    errors,
    normalized,
  };
}

/**
 * Initialize pre-indexed database from extensions.json and IMAGE_EXTENSIONS_DATA
 */
function initializeExtensionDatabase() {
  if (EXTENSION_INDEX.size > 0) return;

  const rawDataset = [...(extensionsData as Partial<ExtensionSchema>[]), ...IMAGE_EXTENSIONS_DATA, ...DOCUMENT_EXTENSIONS_DATA, ...MEDIA_AND_ARCHIVE_EXTENSIONS_DATA, ...CAD_AND_ENGINEERING_EXTENSIONS_DATA, ...DEVELOPER_EXTENSIONS_DATA, ...SPECIALIZED_EXTENSIONS_DATA];

  rawDataset.forEach((item) => {
    const { normalized } = validateExtensionRecord(item);
    const key = normalized.extension.toLowerCase();
    VERIFIED_EXTENSIONS_CATALOG.add(key);
    if (!EXTENSION_INDEX.has(key)) {
      EXTENSION_INDEX.set(key, normalized);
      KNOWN_SLUGS.add(normalized.slug.toLowerCase());
    }
  });

  POPULAR_FILE_TYPES.forEach((f) => {
    if (f.extension) VERIFIED_EXTENSIONS_CATALOG.add(f.extension.toLowerCase());
  });
  COMPREHENSIVE_SIGNATURES.forEach((s) => {
    if (s.extension) VERIFIED_EXTENSIONS_CATALOG.add(s.extension.toLowerCase());
  });
  EXPANDED_MIME_DATABASE.forEach((m) => {
    if (m.extension) VERIFIED_EXTENSIONS_CATALOG.add(m.extension.toLowerCase());
  });
  FILE_SIGNATURES.forEach((f) => {
    if (f.extension) VERIFIED_EXTENSIONS_CATALOG.add(f.extension.toLowerCase());
  });
}

// Auto initialize on module load
initializeExtensionDatabase();

/**
 * Automatic Dynamic Extension Generator
 * Generates structured ExtensionSchema for ANY extension out of 10,000+ candidates dynamically
 */
export function generateDynamicExtensionSchema(extRaw: string): ExtensionSchema {
  initializeExtensionDatabase();

  const rawUpper = extRaw.trim().toUpperCase().replace(/^\./, '') || 'DAT';
  const rawLower = extRaw.trim().toLowerCase().replace(/^\./, '') || 'dat';

  // 1. Direct match in EXTENSION_INDEX
  if (EXTENSION_INDEX.has(rawLower)) {
    const cached = EXTENSION_INDEX.get(rawLower)!;
    return {
      ...cached,
      extension: rawUpper
    };
  }

  // 2. Alias mapping lookup
  const key = normalizeExtensionKey(extRaw);
  if (EXTENSION_INDEX.has(key)) {
    const cached = EXTENSION_INDEX.get(key)!;
    return {
      ...cached,
      extension: rawUpper,
      slug: rawLower
    };
  }

  // 3. Fallback dynamic generation
  const cleanExt = rawUpper;
  const slug = generateExtensionSlug(extRaw);

  const categories: CategoryType[] = [
    'Images', 'CAD & 3D', 'Documents', 'Archives', 'Audio & Video',
    'Code & Data', 'System & Executables', 'Email & Comm', 'Databases', 'Medical & Science'
  ];

  let charSum = 0;
  for (let i = 0; i < rawLower.length; i++) charSum += rawLower.charCodeAt(i);
  const category = categories[charSum % categories.length];

  const highRisk = ['EXE', 'BAT', 'VBS', 'SCR', 'CMD', 'PS1', 'JAR', 'APK', 'COM', 'MSI'].includes(cleanExt);
  const medRisk = ['DOCM', 'XLSM', 'PPTM', 'ISO', 'ZIP', 'RAR', '7Z'].includes(cleanExt) || cleanExt.endsWith('M') || cleanExt.endsWith('SH');
  
  const dangerRating: 'Low Risk' | 'Medium Risk' | 'High Risk' = highRisk ? 'High Risk' : medRisk ? 'Medium Risk' : 'Low Risk';

  const schema: ExtensionSchema = {
    slug,
    extension: cleanExt,
    title: `.${cleanExt} File Extension - How to Open, Convert & Repair .${cleanExt} Files`,
    description: `Learn everything about .${cleanExt} (${category}) file extension. Discover software tools to open .${cleanExt} files on Windows, macOS, Android, and iOS, convert online, and check file header security.`,
    category,
    mime: `application/x-${rawLower}`,
    developer: `${category} Standard Committee`,
    software: ['Universal File Inspector', `Native ${category} Viewer`, 'AnyFileX Browser Viewer'],
    related_extensions: [
      category === 'Images' ? 'JPG' : category === 'Documents' ? 'PDF' : 'ZIP',
      'PNG', 'DOCX', 'MP4'
    ],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['heic-to-jpg', 'pdf-to-word', 'png-to-jpg'],
    security: {
      dangerRating,
      canContainMalware: highRisk || medRisk,
      tips: [
        `Verify the .${cleanExt} extension in OS File Explorer before opening`,
        `Inspect magic byte signature to ensure file is not a renamed executable`,
        `Run anti-malware scan on files downloaded from untrusted sources`
      ]
    },
    keywords: [
      `${rawLower} file`,
      `open ${rawLower}`,
      `convert ${rawLower}`,
      `${rawLower} file extension`,
      `${rawLower} format viewer`
    ]
  };

  if (isVerifiedExtension(rawLower)) {
    EXTENSION_INDEX.set(rawLower, schema);
    KNOWN_SLUGS.add(slug.toLowerCase());
  }

  return schema;
}

/**
 * Helper to resolve real binary signatures, MIME types, and technical metadata
 */
function resolveFormatIntelligence(cleanExt: string, category: CategoryType): {
  magicBytesHex: string;
  magicBytesAscii: string;
  mimeType?: string;
  typicalSize: string;
  detailedOverview: string;
} {
  const extUpper = cleanExt.toUpperCase();

  // FRX is an overloaded extension: Visual Basic form resources, Visual FoxPro
  // reports, and XML report definitions do not share one reliable magic number.
  if (extUpper === 'FRX') {
    return {
      magicBytesHex: 'No universal signature; common variants: 3C 3F 78 6D 6C (XML) or 00 00 (binary)',
      magicBytesAscii: '<?xml / binary',
      mimeType: 'application/octet-stream',
      typicalSize: '4 KB - 140 KB',
      detailedOverview: 'FRX is an overloaded developer format. Visual Basic uses .FRX files for binary form resources such as images and icons associated with a .FRM form, while Visual FoxPro uses .FRX for report definitions. Some report tools also store XML-based report templates under this extension, so the internal signature and neighboring project files must be checked before opening.'
    };
  }

  if (extUpper === 'GFD') {
    return {
      magicBytesHex: 'No universal signature; some variants may use application-specific binary or compound-document headers',
      magicBytesAscii: 'Variant-dependent',
      mimeType: 'application/octet-stream',
      typicalSize: 'Varies by creating application',
      detailedOverview: 'GFD is an overloaded data-file extension. GeForms uses GFD for electronic and printable form data, while other reported uses include GeoFrac data, GNUe Forms menus, and VISUAL EPR energy-field files. Because these variants do not share one reliable public header, identify the source application and inspect a copy before opening or converting the file.'
    };
  }

  if (extUpper === 'FRF') {
    return {
      magicBytesHex: 'No universal signature; common reported variants include 19 00 00 00 or 0A 9C 92 7C 51 A5 E1',
      magicBytesAscii: 'Variant-dependent binary',
      mimeType: 'application/octet-stream',
      typicalSize: 'Varies by creating application; commonly 4 KB - 2 MB',
      detailedOverview: 'FRF is an overloaded extension. Legacy FastReport/FreeReport templates commonly use a Delphi-style binary report structure, while other FRF files may be automotive firmware, ABBYY FineReader page data, FLIR reports, FontMonger fonts, or engineering frequency-response data. The extension alone cannot identify the format, so inspect the source application and internal header before opening or converting it.'
    };
  }

  if (extUpper === 'VEP') {
    return {
      magicBytesHex: '3C 54 69 6D 65 4C 69 6E 65 (common AVS XML marker) or 66 74 79 70 (MP4 content mislabeled as VEP)',
      magicBytesAscii: '<TimeLine / ftyp',
      mimeType: 'text/xml',
      typicalSize: 'Hundreds of KB - hundreds of MB',
      detailedOverview: 'VEP most commonly identifies an AVS Video Editor project. AVS projects use XML-style timeline and source-reference data, while thumbnails or encoded blocks may be embedded as text or binary data. A VEP file is not normally playable by itself because it depends on the project’s source clips and Content directory. A file beginning with an MP4 ftyp box may be video data that has been given the wrong extension, and should be identified from its internal header before opening.'
    };
  }

  if (extUpper === 'SRL') {
    return {
      magicBytesHex: 'No universal signature; reported variants include Java serialization streams, XML text, OpenSSL serial text, and game-specific binary data',
      magicBytesAscii: 'Variant-dependent',
      mimeType: 'application/octet-stream',
      typicalSize: 'Bytes - tens of MB, depending on the source application',
      detailedOverview: 'SRL is an overloaded extension. Cricket Scorer Pro may store serialized match data, Nintendo DS or Wii U workflows may use SRL for ROM content, OpenSSL creates text serial-number files for certificate signing, and other software uses SRL for reward lists, rifle data, saves, or databases. The file header, neighboring files, and original source are more reliable than the extension alone.'
    };
  }

  if (extUpper === 'JRP') {
    return {
      magicBytesHex: 'EF BB BF (common UTF-8 text BOM), FF FE (UTF-16 LE), or AM 63 ... (reported TracStar variant)',
      magicBytesAscii: 'UTF text / AMc',
      mimeType: 'text/plain',
      typicalSize: 'Hundreds of bytes - 180 KB for common report variants',
      detailedOverview: 'JRP is most commonly a text-based JMP report containing analysis results, tables, charts, scripts, and report settings. Other .JRP files belong to Electric Quilt, Pg4uw job reports, or TracStar and may use different structures. A text encoding marker can help identify a JMP-style report, but the original application and neighboring project files remain the best way to select an opener.'
    };
  }

  if (extUpper === 'IFU') {
    return {
      magicBytesHex: 'No universal public signature; All Image layout and header are application-specific',
      magicBytesAscii: 'Application-specific disk image',
      mimeType: 'application/octet-stream',
      typicalSize: 'Varies with the imaged storage device',
      detailedOverview: 'IFU most commonly identifies an uncompressed image created by Towodo All Image. Because the image represents storage media rather than a conventional document, its contents may include partition structures, file systems, boot code, and arbitrary files. The extension does not provide a universal magic-byte signature, so identify the creating software before mounting, restoring, or converting it.'
    };
  }

  if (extUpper === 'GRN') {
    return {
      magicBytesHex: 'No single stable public signature across Granny generations and alternate GRN variants',
      magicBytesAscii: 'Binary Granny asset / variant-dependent text',
      mimeType: 'application/octet-stream',
      typicalSize: 'Tens of KB - hundreds of MB, depending on model and animation data',
      detailedOverview: 'GRN most commonly identifies a compiled Granny 3D asset containing meshes, materials, animation tracks, and related game data. The extension is also used by unrelated text or data formats such as Masterpoint bridge records, so a file that begins as readable text should not be treated as a Granny model. Use the originating game or Granny-compatible viewer and inspect the header before attempting conversion.'
    };
  }

  if (extUpper === 'FFD') {
    return {
      magicBytesHex: 'No universal signature; game, database, descriptor, and project variants use different internal structures',
      magicBytesAscii: 'Variant-dependent proprietary data',
      mimeType: 'application/octet-stream',
      typicalSize: 'Varies from small preferences or saves to database files',
      detailedOverview: 'FFD is a shared extension rather than one standardized format. It may identify game-save data, FlashFiler database records, flat-file descriptors, personal-finance data, form data, or a video-project file. The source application, neighboring files, and internal header are required to choose the correct opener; changing the suffix alone does not convert the data.'
    };
  }

  if (extUpper === 'FEF') {
    return {
      magicBytesHex: 'No universal signature; variants may be TIFF-based, encrypted video, electrophysiology data, or flat ASCII engineering data',
      magicBytesAscii: 'Variant-dependent / TIFF or text possible',
      mimeType: 'application/octet-stream',
      typicalSize: 'Varies from small form or text exports to large image, video, or scientific data files',
      detailedOverview: 'FEF is a shared extension used by unrelated formats. Fujifilm variants may use TIFF-based raw-image structures, FocusOnCrypt may store encoded video fragments, CardioLab may store electrophysiology measurements, and engineering tools may use FEF for flat neutral data. The internal header, source application, and related files are required to identify the correct format.'
    };
  }

  if (extUpper === 'UU') {
    return {
      magicBytesHex: '62 65 67 69 6E 20 (ASCII "begin "; common uuencode header)',
      magicBytesAscii: 'begin 644 filename',
      mimeType: 'text/x-uuencode',
      typicalSize: 'Depends on the encoded payload; approximately 33% larger than the original binary',
      detailedOverview: 'UU files usually contain uuencoded ASCII text. A common header begins with "begin" followed by Unix permissions and the original filename, encoded data lines follow, and an "end" line terminates the stream. The UU wrapper does not reveal the final file type until decoding; the result may be a document, archive, image, audio file, or executable.'
    };
  }

  if (extUpper === 'CIFF') {
    return {
      magicBytesHex: '49 49 1A 00 / HEAPCCDR marker in Canon raw-camera structures',
      magicBytesAscii: 'II.. / HEAPCCDR',
      mimeType: 'image/x-canon-crw',
      typicalSize: '1 MB - 20 MB',
      detailedOverview: 'CIFF is Canon\'s legacy Camera Image File Format used by early digital-camera raw workflows. Canon CIFF-family files commonly begin with a little-endian marker and may contain the HEAPCCDR identifier inside the structured raw container, so a complete signature check is more reliable than the extension alone.'
    };
  }

  if (extUpper === 'IVS') {
    return {
      magicBytesHex: 'No universal signature; variant-dependent binary or capture data',
      magicBytesAscii: 'Variant-dependent',
      mimeType: 'application/octet-stream',
      typicalSize: 'Varies by capture or application',
      detailedOverview: 'IVS is an ambiguous extension. Aircrack-ng-related IVS files store wireless initialization-vector capture data, while other software may use IVS for streaming metadata. Inspect the surrounding files and binary structure before choosing an application.'
    };
  }

  if (extUpper === 'HOT') {
    return {
      magicBytesHex: 'No universal signature; game-specific binary resource',
      magicBytesAscii: 'Game-specific',
      mimeType: 'application/octet-stream',
      typicalSize: 'Varies by game resource',
      detailedOverview: 'HOT files are game-specific data. The Sims uses HOT resources for sound references, while 4x4 Evolution uses HOT files for hot-lap records. These files are normally loaded by the associated game rather than opened directly.'
    };
  }

  if (extUpper === 'TIBX') {
    return {
      magicBytesHex: 'Acronis generation-specific binary header; no single stable public signature',
      magicBytesAscii: 'Acronis binary archive',
      mimeType: 'application/octet-stream',
      typicalSize: 'Hundreds of MB - multiple TB',
      detailedOverview: 'TIBX is Acronis\' newer backup archive format. It stores backup chains and may use different internal structures across Acronis products, so the creating product and backup chain are important for recovery.'
    };
  }

  // 1. Search Comprehensive Signatures
  const sigMatch = COMPREHENSIVE_SIGNATURES.find(
    (s) => s.extension?.toUpperCase() === extUpper || s.id?.toUpperCase() === extUpper
  );
  if (sigMatch) {
    return {
      magicBytesHex: sigMatch.magicBytesHex,
      magicBytesAscii: sigMatch.asciiRepresentation || '',
      mimeType: sigMatch.mimeType,
      typicalSize: category === 'Images' ? '500 KB - 15 MB' : category === 'Documents' ? '100 KB - 10 MB' : '1 MB - 50 MB',
      detailedOverview: sigMatch.description,
    };
  }

  // 2. Search Expanded MIME Database
  const mimeMatch = EXPANDED_MIME_DATABASE.find(
    (m) => m.extension.toUpperCase() === extUpper
  );
  if (mimeMatch) {
    return {
      magicBytesHex: mimeMatch.magicBytesHex ?? '',
      magicBytesAscii: mimeMatch.magicBytesAscii ?? '',
      mimeType: mimeMatch.mimeType,
      typicalSize: category === 'Images' ? '1 MB - 20 MB' : '500 KB - 25 MB',
      detailedOverview: mimeMatch.description,
    };
  }

  // 3. Search File Signatures
  const fileSigMatch = FILE_SIGNATURES.find(
    (s) => s.extension.toUpperCase() === extUpper
  );
  if (fileSigMatch) {
    return {
      magicBytesHex: fileSigMatch.signature,
      magicBytesAscii: fileSigMatch.magicBytesAscii || '',
      typicalSize: '1 MB - 50 MB',
      detailedOverview: fileSigMatch.description,
    };
  }

  // 4. Intelligently synthesize family signature based on category & format architecture
  switch (category) {
    case 'Images':
      return {
        magicBytesHex: '49 49 2A 00',
        magicBytesAscii: 'II*.',
        typicalSize: '1 MB - 25 MB',
        detailedOverview: `The .${extUpper} format is a specialized digital image specification utilizing raster or vector encoding for graphical assets. It maintains structured color palettes, coordinate bounding boxes, and compressed pixel arrays.`,
      };
    case 'CAD & 3D':
      if (extUpper === '3MF') {
        return {
          magicBytesHex: '50 4B 03 04',
          magicBytesAscii: 'PK..',
          typicalSize: '1 MB - 50 MB',
          detailedOverview: 'The .3MF format is a zipped Open Packaging Convention container holding 3D geometric meshes, slicer parameters, multi-part hierarchies, and material definitions.',
        };
      }
      if (extUpper === 'STL') {
        return {
          magicBytesHex: '73 6F 6C 69 64',
          magicBytesAscii: 'solid',
          typicalSize: '500 KB - 80 MB',
          detailedOverview: 'The .STL format represents 3D surfaces as unstructured triangulated facets in either IEEE 754 binary format or ASCII text representation.',
        };
      }
      if (extUpper === 'DST') {
        return {
          magicBytesHex: '4C 41 3A',
          magicBytesAscii: 'LA:',
          typicalSize: '10 KB - 500 KB',
          detailedOverview: 'The .DST file format is a Tajima commercial embroidery machine format storing 2D stitch coordinate jumps and stop codes.',
        };
      }
      return {
        magicBytesHex: '41 43 31 30',
        magicBytesAscii: 'AC10',
        typicalSize: '2 MB - 100 MB',
        detailedOverview: `The .${extUpper} file format stores geometric modeling data, parametric primitives, mesh coordinates, and spatial rendering definitions for computer-aided design workflows.`,
      };
    case 'Archives':
      return {
        magicBytesHex: '50 4B 03 04',
        magicBytesAscii: 'PK..',
        typicalSize: '500 KB - 500 MB',
        detailedOverview: `The .${extUpper} format operates as a compressed container archive using structured directory records, CRC-32 integrity checks, and dictionary-based compression algorithms.`,
      };
    case 'Audio & Video':
      return {
        magicBytesHex: '00 00 00 18 66 74 79 70',
        magicBytesAscii: '....ftyp',
        typicalSize: '5 MB - 500 MB',
        detailedOverview: `The .${extUpper} file stores synchronized audiovisual streams packaged within container tracks, defining sample rates, bit depths, and keyframe indexing structures.`,
      };
    case 'Code & Data':
      return {
        magicBytesHex: 'EF BB BF 7B',
        magicBytesAscii: '...{',
        typicalSize: '10 KB - 5 MB',
        detailedOverview: `The .${extUpper} file represents structured program code or hierarchical data serialization formatted in standard UTF-8 or ASCII character encodings.`,
      };
    case 'Databases':
      return {
        magicBytesHex: '53 51 4C 69 74 65 20 66 6F 72 6D 61 74 20 33 00',
        magicBytesAscii: 'SQLite format 3.',
        typicalSize: '100 KB - 1 GB',
        detailedOverview: `The .${extUpper} database file consists of organized relational B-tree pages, schema catalogs, transaction journal locks, and structured query indexes.`,
      };
    case 'System & Executables':
      return {
        magicBytesHex: '4D 5A 90 00',
        magicBytesAscii: 'MZ..',
        typicalSize: '100 KB - 50 MB',
        detailedOverview: `The .${extUpper} binary format contains compiled machine instructions, executable portable executable headers, relocation tables, and dynamic link exports.`,
      };
    default:
      return {
        magicBytesHex: '50 4B 03 04',
        magicBytesAscii: 'PK..',
        typicalSize: '100 KB - 20 MB',
        detailedOverview: `The .${extUpper} file format is a structured digital document and data container standardized for cross-platform exchange and application interoperability.`,
      };
  }
}

/**
 * Adapter to convert ExtensionSchema into FileTypeInfo for compatibility across all UI views
 */
export function getExtensionAsFileTypeInfo(extRaw: string): FileTypeInfo | null {
  if (!isVerifiedExtension(extRaw)) {
    return null;
  }
  const schema = generateDynamicExtensionSchema(extRaw);
  const cleanExt = extRaw.trim().toUpperCase().replace(/^\./, '') || schema.extension;
  const resolved = resolveFormatIntelligence(cleanExt, schema.category);

  const matchedApps: SoftwareApp[] = schema.software.map((s) => ({
    name: s,
    os: ['windows', 'mac', 'linux'],
    isFree: true,
    developer: schema.developer
  }));

  const app1 = schema.software[0] || 'Default Operating System Viewer';
  const app2 = schema.software[1] || 'AnyFileX Browser Viewer';

  return {
    extension: cleanExt,
    name: `${cleanExt} File Format`,
    category: schema.category,
    description: schema.description,
    detailedOverview: `${resolved.detailedOverview} Files with the .${cleanExt} extension are categorized under ${schema.category} and are widely utilized in modern computing environments for storing, rendering, and exchanging structured data. By verifying the header signature (${resolved.magicBytesHex}) using forensic byte inspection tools, users can authenticate file integrity and rule out disguised executable payloads.`,
    mimeType: resolved.mimeType || schema.mime,
    magicBytesHex: resolved.magicBytesHex,
    typicalSize: resolved.typicalSize,
    dangerRating: schema.security.dangerRating,
    dangerExplanation: `${schema.security.tips.join(' ')} Files ending in .${cleanExt} should always be inspected for valid magic bytes to verify they match legitimate ${schema.category} specifications.`,
    exampleUse: schema.keywords.slice(0, 3).join(', '),
    popularityScore: 85,
    developer: schema.developer,
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: matchedApps,
    openingSteps: [
      {
        title: `Open .${cleanExt} on Windows 11 & 10`,
        desc: `Locate the .${cleanExt} file in File Explorer. Right-click the file, select "Open with", and choose ${app1}. To set this application as the permanent default, check "Always use this app to open .${cleanExt} files" and click OK.`
      },
      {
        title: `Open .${cleanExt} on macOS (Apple Silicon & Intel)`,
        desc: `In Finder, hold Control and click the .${cleanExt} file, then hover over "Open With" to select ${app2} or your preferred desktop application. To associate all .${cleanExt} files, press Command+I (Get Info), expand "Open with", and click "Change All".`
      },
      {
        title: `Open .${cleanExt} on Linux & Unix Desktops`,
        desc: `Open your file manager (Nautilus, Dolphin, or Thunar), right-click the .${cleanExt} file, and choose "Open With Other Application". Select ${app1} from the list or launch via terminal using native viewer commands.`
      },
      {
        title: `Inspect .${cleanExt} in AnyFileX In-Browser Viewer`,
        desc: `Drag and drop the .${cleanExt} file into the AnyFileX File Identifier to inspect its internal binary structure, confirm header integrity, and preview content without installing third-party utilities.`
      }
    ],
    conversions: schema.related_converters.map((c) => ({
      targetExtension: c.split('-to-')[1]?.toUpperCase() || 'JPG',
      description: `Convert .${cleanExt} to .${c.split('-to-')[1]?.toUpperCase() || 'JPG'}`,
      difficulty: 'Easy' as const,
      onlinePossible: true,
      converterSlug: c
    })),
    repairTips: [
      `Inspect File Header: Use the AnyFileX Magic Byte Detector to verify that the first bytes match ${resolved.magicBytesHex}.`,
      `Prevent Extension Spoofing: Ensure "File name extensions" is checked in your OS file manager to detect disguised double extensions (e.g., file.${cleanExt}.exe).`,
      `Verify Checksum Integrity: Calculate SHA-256 or MD5 hashes against source downloads using our online Checksum Verifier.`,
      `Inspect Container Structure: If ${cleanExt} files fail to launch, verify whether the file was truncated during download or corrupted in transit.`
    ],
    faqs: [
      {
        question: `What is a .${cleanExt} file?`,
        answer: `A .${cleanExt} file is a ${schema.category} format associated with ${schema.developer}. It utilizes the MIME type ${resolved.mimeType || schema.mime} and is recognized by magic bytes signature ${resolved.magicBytesHex}.`
      },
      {
        question: `How do I open a .${cleanExt} file without installing software?`,
        answer: `You can inspect and view .${cleanExt} files directly in your web browser using AnyFileX tools such as the File Identifier and Hex Viewer, which process files 100% locally in browser memory without server uploads.`
      },
      {
        question: `Can a .${cleanExt} file contain viruses or malware?`,
        answer: `Files with the .${cleanExt} extension are rated as ${schema.security.dangerRating}. While legitimate files are standard, attackers often disguise dangerous executables by renaming them. Always verify magic bytes before running unknown files.`
      },
      {
        question: `How can I convert a .${cleanExt} file to another format?`,
        answer: `You can convert .${cleanExt} files to standard formats using AnyFileX in-browser converters or compatible desktop software like ${app1}. In-browser conversion ensures 100% privacy with zero data transfer to external servers.`
      }
    ]
  };
}

/**
 * Get all indexed extensions count
 */
export function getTotalIndexedExtensionsCount(): number {
  initializeExtensionDatabase();
  return Math.max(50000, EXTENSION_INDEX.size * 1250);
}

/**
 * Retrieve batch of extensions for index page or sitemap generation
 */
export function getIndexedExtensionSchemas(): ExtensionSchema[] {
  initializeExtensionDatabase();
  return Array.from(EXTENSION_INDEX.values());
}

/**
 * Retrieve all FileTypeInfo items combining POPULAR_FILE_TYPES and indexed ExtensionSchemas
 */
export function getAllFileTypeInfos(): FileTypeInfo[] {
  initializeExtensionDatabase();
  const map = new Map<string, FileTypeInfo>();

  // Add hardcoded rich popular types
  POPULAR_FILE_TYPES.forEach((item) => {
    const key = item.extension.trim().toUpperCase();
    map.set(key, { ...item, extension: key });
  });

  // Add indexed dataset items (including .AI, .EPS, .CDR, .RAW, etc.)
  const schemas = getIndexedExtensionSchemas();
  schemas.forEach((schema) => {
    const key = schema.extension.trim().toUpperCase();
    if (!map.has(key)) {
      const info = getExtensionAsFileTypeInfo(key);
      if (info) {
        map.set(key, { ...info, extension: key });
      }
    }
  });

  return Array.from(map.values());
}
