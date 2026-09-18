import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { REPAIR_GUIDES } from '../../data/repairData';
import { FileTypeInfo, CategoryType, SoftwareApp, ConversionPath } from '../../types';
import { generateExtensionFAQs } from './faqGenerator';
import { getExtensionAsFileTypeInfo } from '../database/extensionEngine';

// Dynamic extension lookup dictionary for extensions outside the top static set
const EXTENSION_KNOWLEDGE_BASE: Record<string, Partial<FileTypeInfo>> = {
  // Images
  jpg: {
    name: 'JPEG Image File',
    category: 'Images',
    description: 'JPEG (Joint Photographic Experts Group) is the most standard compressed digital photographic image format.',
    mimeType: 'image/jpeg',
    magicBytesHex: 'FF D8 FF E0 / FF D8 FF E1',
    typicalSize: '1 MB - 5 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'JPEG image files contain compressed bitmap pixel data without executable code.',
  },
  jpeg: {
    name: 'JPEG Image File',
    category: 'Images',
    description: 'JPEG image format used across digital cameras and web graphics.',
    mimeType: 'image/jpeg',
    magicBytesHex: 'FF D8 FF E0',
    typicalSize: '1 MB - 5 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Standard photographic image container.',
  },
  png: {
    name: 'Portable Network Graphics',
    category: 'Images',
    description: 'PNG is an uncompressed lossless raster image format supporting alpha transparency.',
    mimeType: 'image/png',
    magicBytesHex: '89 50 4E 47 0D 0A 1A 0A',
    typicalSize: '500 KB - 10 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Lossless bitmap graphics container.',
  },
  webp: {
    name: 'WebP Image Format',
    category: 'Images',
    description: 'WebP is Google\'s modern web image format providing lossy and lossless compression with transparency.',
    mimeType: 'image/webp',
    magicBytesHex: '52 49 46 46 ... 57 45 42 50',
    typicalSize: '100 KB - 2 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Modern web image container.',
  },
  avif: {
    name: 'AV1 Image File Format',
    category: 'Images',
    description: 'AVIF is a next-generation image format based on the AV1 video codec delivering ultra-high compression.',
    mimeType: 'image/avif',
    magicBytesHex: '00 00 00 1C 66 74 79 70 61 76 69 66',
    typicalSize: '50 KB - 1.5 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'AV1 video keyframe image container.',
  },
  svg: {
    name: 'Scalable Vector Graphics',
    category: 'Images',
    description: 'SVG is an XML-based vector image format for two-dimensional graphics with support for interactivity and animation.',
    mimeType: 'image/svg+xml',
    magicBytesHex: '3C 3F 78 6D 6C (<?xml) / 3C 73 76 67 (<svg)',
    typicalSize: '5 KB - 200 KB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'SVG files contain XML markup which can embed inline JavaScript scripts (<script> tags).',
  },
  gif: {
    name: 'Graphics Interchange Format',
    category: 'Images',
    description: 'GIF is a bitmap image format supporting 256 colors, frame animations, and simple transparency.',
    mimeType: 'image/gif',
    magicBytesHex: '47 49 46 38 37 61 / 47 49 46 38 39 61',
    typicalSize: '200 KB - 5 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Indexed color bitmap container.',
  },
  // CAD
  dxf: {
    name: 'Drawing Exchange Format',
    category: 'CAD & 3D',
    description: 'DXF is an open vector CAD data file format developed by Autodesk for interoperability between CAD applications.',
    mimeType: 'image/vnd.dxf',
    magicBytesHex: '30 0D 0A 53 45 43 54 49 4F 4E 53',
    typicalSize: '1 MB - 25 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Plaintext ASCII or binary CAD coordinate geometry representation.',
  },
  stl: {
    name: 'Stereolithography 3D Mesh',
    category: 'CAD & 3D',
    description: 'STL is the universal file format for 3D printing and additive manufacturing describing raw surface geometry.',
    mimeType: 'model/stl',
    magicBytesHex: '73 6F 6C 69 64 (solid ASCII) / 80-byte header',
    typicalSize: '2 MB - 100 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: '3D triangle mesh coordinate container.',
  },
  step: {
    name: 'STEP CAD Exchange File',
    category: 'CAD & 3D',
    description: 'STEP (ISO 10303) is a standard 3D CAD exchange format representing 3D solids and mechanical assemblies.',
    mimeType: 'application/step',
    magicBytesHex: '23 49 53 4F 2D 31 30 33 30 33 2D 32 31 (ISO-10303-21)',
    typicalSize: '5 MB - 150 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'ISO standard parametric CAD geometry container.',
  },
  stp: {
    name: 'STEP CAD Exchange File',
    category: 'CAD & 3D',
    description: 'Alternative extension for ISO 10303 STEP 3D CAD model exchange.',
    mimeType: 'application/step',
    magicBytesHex: '23 49 53 4F 2D 31 30 33 30 33 2D 32 31',
    typicalSize: '5 MB - 150 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Standard mechanical CAD design interchange file.',
  },
  blend: {
    name: 'Blender 3D Scene File',
    category: 'CAD & 3D',
    description: 'BLEND is the native project file format of Blender 3D animation, modeling, and rendering suite.',
    mimeType: 'application/x-blender',
    magicBytesHex: '42 4C 45 4E 44 45 52 (BLENDER)',
    typicalSize: '10 MB - 500 MB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'Can contain embedded Python scripts autorun upon scene load if enabled.',
  },
  // Documents
  docx: {
    name: 'Microsoft Word OpenXML Document',
    category: 'Documents',
    description: 'DOCX is the standard word processing document format created by Microsoft Word using ZIP-compressed XML.',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    magicBytesHex: '50 4B 03 04 (PK.. ZIP archive)',
    typicalSize: '50 KB - 10 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Standard OpenXML document container without macros.',
  },
  xlsx: {
    name: 'Microsoft Excel OpenXML Spreadsheet',
    category: 'Documents',
    description: 'XLSX is the standard spreadsheet format used by Microsoft Excel for financial calculations, charts, and tables.',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    magicBytesHex: '50 4B 03 04 (PK.. ZIP archive)',
    typicalSize: '100 KB - 25 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'XML spreadsheet container without embedded VBA macros.',
  },
  pptx: {
    name: 'Microsoft PowerPoint OpenXML Presentation',
    category: 'Documents',
    description: 'PPTX is the standard slide presentation format used by Microsoft PowerPoint.',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    magicBytesHex: '50 4B 03 04 (PK.. ZIP archive)',
    typicalSize: '1 MB - 50 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'XML presentation container for slides and media.',
  },
  epub: {
    name: 'Electronic Publication eBook',
    category: 'Documents',
    description: 'EPUB is an open eBook standard format maintained by the W3C for reflowable digital books.',
    mimeType: 'application/epub+zip',
    magicBytesHex: '50 4B 03 04 (PK.. ZIP containing mimetype)',
    typicalSize: '1 MB - 20 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'XHTML/CSS based eBook container.',
  },
  // Archives & System
  iso: {
    name: 'Optical Disc Image Archive',
    category: 'Archives',
    description: 'ISO is an uncompressed sector-for-sector copy of an optical disc (CD, DVD, Blu-ray) or OS installation image.',
    mimeType: 'application/x-iso9660-image',
    magicBytesHex: '43 44 30 30 31 (CD001 at offset 0x8000)',
    typicalSize: '500 MB - 8 GB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'Can mount automatically in Windows as a virtual drive and contain auto-executables.',
  },
  '7z': {
    name: '7-Zip Compressed Archive',
    category: 'Archives',
    description: '7z is an open compressed archive format featuring high compression ratios using the LZMA algorithm.',
    mimeType: 'application/x-7z-compressed',
    magicBytesHex: '37 7A BC AF 27 1C (7z..)',
    typicalSize: '1 MB - 5 GB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'Compressed archive container. Extract and scan contents with antivirus before running executables.',
  },
  exe: {
    name: 'Windows Executable Program',
    category: 'System & Executables',
    description: 'EXE is the standard executable binary program format for Microsoft Windows operating systems.',
    mimeType: 'application/x-msdownload',
    magicBytesHex: '4D 5A (MZ signature)',
    typicalSize: '1 MB - 500 MB',
    dangerRating: 'High Risk',
    dangerExplanation: 'Contains compiled Machine Code executable directly by CPU. Never run untrusted .exe files!',
  },
};

/**
 * Get or dynamically generate a complete FileTypeInfo record for ANY extension string.
 */
export function getOrGenerateExtensionInfo(extRaw: string): FileTypeInfo {
  const extClean = extRaw.toLowerCase().replace(/^\./, '').trim();

  // 1. First check static popular file types array
  const existing = POPULAR_FILE_TYPES.find((f) => f.extension.toLowerCase() === extClean);
  if (existing) {
    return {
      ...existing,
      faqs: generateExtensionFAQs(existing),
      osSupport: existing.osSupport || {
        windows: true,
        mac: true,
        linux: true,
        android: true,
        ios: true,
      },
    };
  }

  // 2. Check indexed engine schema (includes 100+ image formats and extensions dataset)
  const engineResult = getExtensionAsFileTypeInfo(extClean);
  if (engineResult) {
    return {
      ...engineResult,
      faqs: generateExtensionFAQs(engineResult),
    };
  }

  // 3. Check knowledge base map
  const kb = EXTENSION_KNOWLEDGE_BASE[extClean];

  // 3. Fallback Heuristics Generator for any arbitrary extension
  const extUpper = extClean.toUpperCase();
  const category: CategoryType = kb?.category || inferCategory(extClean);
  const name = kb?.name || `${extUpper} Digital Format File`;
  const description =
    kb?.description ||
    `.${extUpper} is a digital file extension categorized under ${category}. It requires compatible software or converters to view, edit, or process its contents safely.`;

  const mimeType = kb?.mimeType || inferMimeType(extClean, category);
  const magicBytesHex = kb?.magicBytesHex || inferMagicBytes(extClean);
  const typicalSize = kb?.typicalSize || '500 KB - 20 MB';
  const dangerRating = kb?.dangerRating || inferDangerRating(extClean);
  const dangerExplanation =
    kb?.dangerExplanation ||
    `Files with extension .${extUpper} have a ${dangerRating} safety profile. Always verify file signatures using AnyFileX's Magic Byte Detector before opening untrusted attachments.`;

  // Find related apps from software DB
  const popularApps: SoftwareApp[] = findAppsForExtension(extClean, category);

  // Find related conversions
  const conversions: ConversionPath[] = findConversionsForExtension(extClean, category);

  // Opening steps
  const openingSteps = [
    {
      title: `Step 1: Check native support on your operating system`,
      desc: `Double-click the .${extUpper} file on Windows, macOS, or Mobile to see if a default application is registered.`,
    },
    {
      title: `Step 2: Use recommended ${category} software`,
      desc: `If no application opens .${extUpper}, install a free software suite like ${popularApps.map((a) => a.name).slice(0, 2).join(' or ')}.`,
    },
    {
      title: `Step 3: Convert or view online with AnyFileX`,
      desc: `Use AnyFileX's 100% private in-browser converters or File Identifier to inspect raw file contents instantly without installing software.`,
    },
  ];

  const repairTips = [
    `Verify header integrity: Use AnyFileX Magic Byte Detector to check if the .${extUpper} file signature is corrupted.`,
    `Check file download completion: Interrupted downloads often cause broken .${extUpper} file headers. Re-download if needed.`,
    `Try universal media / document viewers: VLC for video/audio, LibreOffice for documents, or GIMP for graphics.`,
  ];

  const generated: FileTypeInfo = {
    extension: extUpper,
    name,
    category,
    description,
    detailedOverview: `${description} AnyFileX provides full specifications, software listings, in-browser converters, and safety verification for .${extUpper} files.`,
    mimeType,
    magicBytesHex,
    typicalSize,
    dangerRating,
    dangerExplanation,
    popularApps,
    openingSteps,
    conversions,
    repairTips,
    exampleUse: `Used in ${category} workflows across desktop and cloud environments.`,
    osSupport: {
      windows: true,
      mac: true,
      linux: true,
      android: category !== 'System & Executables',
      ios: category !== 'System & Executables',
    },
  };

  generated.faqs = generateExtensionFAQs(generated);
  return generated;
}

/**
 * Infer category based on extension string heuristics
 */
function inferCategory(ext: string): CategoryType {
  const e = ext.toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'bmp', 'tiff', 'tif', 'ico', 'heic', 'heif', 'psd', 'ai', 'raw', 'cr2', 'nef'].includes(e)) {
    return 'Images';
  }
  if (['dwg', 'dxf', 'stl', 'step', 'stp', 'obj', 'blend', 'fbx', '3ds', 'dae', 'ply', 'gcode', 'fcstd', 'skp'].includes(e)) {
    return 'CAD & 3D';
  }
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'txt', 'rtf', 'epub', 'mobi', 'csv'].includes(e)) {
    return 'Documents';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso', 'cab', 'tgz'].includes(e)) {
    return 'Archives';
  }
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'mp4', 'mkv', 'avi', 'mov', 'wmv', 'webm', 'flv'].includes(e)) {
    return 'Audio & Video';
  }
  if (['exe', 'msi', 'bat', 'sh', 'ps1', 'vbs', 'cmd', 'apk', 'app', 'deb', 'rpm'].includes(e)) {
    return 'System & Executables';
  }
  if (['json', 'xml', 'sql', 'html', 'css', 'js', 'ts', 'py', 'java', 'cpp', 'c', 'php'].includes(e)) {
    return 'Code & Data';
  }
  return 'Documents';
}

function inferMimeType(ext: string, category: CategoryType): string {
  switch (category) {
    case 'Images':
      return `image/${ext.toLowerCase()}`;
    case 'Audio & Video':
      return `video/${ext.toLowerCase()}`;
    case 'CAD & 3D':
      return `model/${ext.toLowerCase()}`;
    case 'Archives':
      return `application/x-${ext.toLowerCase()}-compressed`;
    case 'System & Executables':
      return `application/x-msdownload`;
    default:
      return `application/x-${ext.toLowerCase()}`;
  }
}

function inferMagicBytes(ext: string): string {
  return `Custom ${ext.toUpperCase()} Binary Header Signature`;
}

function inferDangerRating(ext: string): 'Low Risk' | 'Medium Risk' | 'High Risk' {
  const e = ext.toLowerCase();
  if (['exe', 'bat', 'vbs', 'ps1', 'cmd', 'scr', 'jar', 'com'].includes(e)) return 'High Risk';
  if (['docm', 'xlsm', 'pptm', 'zip', 'rar', 'iso', 'svg'].includes(e)) return 'Medium Risk';
  return 'Low Risk';
}

function findAppsForExtension(ext: string, category: CategoryType): SoftwareApp[] {
  // Search software list in database
  const matchingFromDb = SOFTWARE_LIST.filter((s) =>
    s.supportedExtensions.map((e) => e.toLowerCase()).includes(ext.toLowerCase())
  ).map((s) => ({
    name: s.name,
    os: (s.supportedOS as any) || ['windows', 'mac'],
    isFree: s.priceType === 'Free' || s.priceType === 'Freemium',
    developer: s.developer,
    slug: s.id,
  }));

  if (matchingFromDb.length > 0) return matchingFromDb;

  // Defaults per category
  if (category === 'Images') {
    return [
      { name: 'GIMP', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'GIMP Team', slug: 'gimp' },
      { name: 'Photopea Web', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'Photopea', slug: 'photopea' },
      { name: 'Adobe Photoshop', os: ['windows', 'mac'], isFree: false, developer: 'Adobe', slug: 'adobe-photoshop' },
    ];
  }
  if (category === 'CAD & 3D') {
    return [
      { name: 'FreeCAD', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'FreeCAD Project', slug: 'freecad' },
      { name: 'Autodesk Fusion 360', os: ['windows', 'mac'], isFree: false, developer: 'Autodesk', slug: 'autodesk-fusion360' },
      { name: 'Blender', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Blender Foundation', slug: 'blender' },
    ];
  }
  return [
    { name: 'VLC Media Player', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'VideoLAN', slug: 'vlc-media-player' },
    { name: 'LibreOffice Suite', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'The Document Foundation', slug: 'libreoffice' },
    { name: '7-Zip', os: ['windows', 'linux'], isFree: true, developer: 'Igor Pavlov', slug: '7zip' },
  ];
}

function findConversionsForExtension(ext: string, category: CategoryType): ConversionPath[] {
  const matchingConvs = CONVERTERS_LIST.filter(
    (c) => c.fromExt.toLowerCase() === ext.toLowerCase() || c.toExt.toLowerCase() === ext.toLowerCase()
  ).map((c) => ({
    targetExtension: c.fromExt.toLowerCase() === ext.toLowerCase() ? c.toExt : c.fromExt,
    description: c.description,
    difficulty: 'Easy' as const,
    onlinePossible: true,
    converterSlug: c.id,
  }));

  if (matchingConvs.length > 0) return matchingConvs;

  if (category === 'Images') {
    return [
      { targetExtension: 'JPG', description: 'Convert to universal JPG image format', difficulty: 'Easy', onlinePossible: true, converterSlug: 'heic-to-jpg' },
      { targetExtension: 'PNG', description: 'Convert to transparent PNG graphics', difficulty: 'Easy', onlinePossible: true, converterSlug: 'heic-to-png' },
      { targetExtension: 'WEBP', description: 'Convert to lightweight WebP web image', difficulty: 'Easy', onlinePossible: true, converterSlug: 'heic-to-webp' },
    ];
  }
  if (category === 'CAD & 3D') {
    return [
      { targetExtension: 'PDF', description: 'Convert CAD draft drawings to printable PDF', difficulty: 'Easy', onlinePossible: true, converterSlug: 'dwg-to-pdf' },
      { targetExtension: 'DXF', description: 'Convert binary CAD drawing to open DXF vector', difficulty: 'Easy', onlinePossible: true, converterSlug: 'dwg-to-dxf' },
    ];
  }
  return [
    { targetExtension: 'PDF', description: 'Convert document to universal PDF format', difficulty: 'Easy', onlinePossible: true, converterSlug: 'pdf-to-word' },
  ];
}

export const getExtensionInfo = getOrGenerateExtensionInfo;

