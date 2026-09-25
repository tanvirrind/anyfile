import { FileTypeInfo, SoftwareInfo, ConversionPath } from '../../types';
import { getOrGenerateExtensionInfo } from '../seo/extensionGenerator';
import { getAllFileTypeInfos } from './extensionEngine';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { CONVERTERS_LIST } from '../../data/convertersData';

export interface SoftwareCapability {
  software: SoftwareInfo;
  canOpen: boolean;
  canView: boolean;
  canEdit: boolean;
  canConvert: boolean;
  canCreate: boolean;
  platformBadges: string[];
}

export interface ComparisonPairMeta {
  slug: string;
  ext1: string;
  ext2: string;
  title: string;
  category: string;
  highlight: string;
}

export interface FormatKnowledgeNode {
  extension: string;
  upperExt: string;
  name: string;
  category: string;
  mimeType: string;
  magicBytesHex: string;
  description: string;
  howToOpenUrl: string;
  extensionUrl: string;
  converterUrls: { targetExt: string; label: string; url: string; routeId: string }[];
  comparisons: ComparisonPairMeta[];
  compatibleSoftware: SoftwareCapability[];
  relatedExtensions: { ext: string; name: string; category: string; url: string }[];
}

// Curated high-value head-to-head comparison graph
export const CURATED_COMPARISONS: ComparisonPairMeta[] = [
  // Images
  { slug: 'heic-vs-jpg', ext1: 'HEIC', ext2: 'JPG', category: 'Images', title: 'HEIC vs JPG', highlight: 'Modern Apple high-efficiency 16-bit format vs universal image standard' },
  { slug: 'heic-vs-png', ext1: 'HEIC', ext2: 'PNG', category: 'Images', title: 'HEIC vs PNG', highlight: 'Next-gen mobile photography container vs uncompressed lossless web graphics' },
  { slug: 'webp-vs-jpg', ext1: 'WEBP', ext2: 'JPG', category: 'Images', title: 'WEBP vs JPG', highlight: '25-34% smaller web payloads with alpha transparency vs 1992 JPEG baseline' },
  { slug: 'webp-vs-png', ext1: 'WEBP', ext2: 'PNG', category: 'Images', title: 'WEBP vs PNG', highlight: 'Lossless web graphics with 26% smaller payloads vs classic 32-bit PNG' },
  { slug: 'avif-vs-webp', ext1: 'AVIF', ext2: 'WEBP', category: 'Images', title: 'AVIF vs WEBP', highlight: 'Next-gen AV1-based image codec vs Google VP8/VP9 web format' },
  { slug: 'jpg-vs-png', ext1: 'JPG', ext2: 'PNG', category: 'Images', title: 'JPG vs PNG', highlight: 'Lossy photographic compression vs 100% pixel-perfect lossless transparency' },
  { slug: 'png-vs-svg', ext1: 'PNG', ext2: 'SVG', category: 'Images', title: 'PNG vs SVG', highlight: 'Fixed-resolution raster bitmap vs infinite-scaling XML vector graphics' },
  { slug: 'tiff-vs-png', ext1: 'TIFF', ext2: 'PNG', category: 'Images', title: 'TIFF vs PNG', highlight: 'Professional CMYK prepress raster vs standard RGB screen graphics' },
  { slug: 'gif-vs-webp', ext1: 'GIF', ext2: 'WEBP', category: 'Images', title: 'GIF vs WEBP', highlight: '256-color legacy animation vs 24-bit animated WebP compression' },
  { slug: 'tiff-vs-raw', ext1: 'TIFF', ext2: 'RAW', category: 'Images', title: 'TIFF vs RAW', highlight: 'Uncompressed raster print standard vs unbaked camera sensor data' },
  { slug: 'psd-vs-tiff', ext1: 'PSD', ext2: 'TIFF', category: 'Images', title: 'PSD vs TIFF', highlight: 'Adobe Photoshop layered master files vs universal prepress raster' },
  { slug: 'jpg-vs-jpeg', ext1: 'JPG', ext2: 'JPEG', category: 'Images', title: 'JPG vs JPEG', highlight: 'File extension difference, DOS 8.3 history, and identical binary specs' },

  // Documents
  { slug: 'pdf-vs-docx', ext1: 'PDF', ext2: 'DOCX', category: 'Documents', title: 'PDF vs DOCX', highlight: 'Fixed layout digital document publishing vs editable word processing' },
  { slug: 'csv-vs-xlsx', ext1: 'CSV', ext2: 'XLSX', category: 'Documents', title: 'CSV vs XLSX', highlight: 'Raw comma-delimited data streams vs multi-sheet workbooks with formulas' },
  { slug: 'doc-vs-docx', ext1: 'DOC', ext2: 'DOCX', category: 'Documents', title: 'DOC vs DOCX', highlight: 'Legacy Word binary format vs modern open XML zip package' },
  { slug: 'epub-vs-pdf', ext1: 'EPUB', ext2: 'PDF', category: 'Documents', title: 'EPUB vs PDF', highlight: 'Reflowable e-reader book layout vs fixed page typography' },
  { slug: 'odt-vs-docx', ext1: 'ODT', ext2: 'DOCX', category: 'Documents', title: 'ODT vs DOCX', highlight: 'OpenDocument standard vs Microsoft Office Open XML' },
  { slug: 'txt-vs-pdf', ext1: 'TXT', ext2: 'PDF', category: 'Documents', title: 'TXT vs PDF', highlight: 'Minimalist unformatted plain text vs styled vector document layout' },
  { slug: 'json-vs-xml', ext1: 'JSON', ext2: 'XML', category: 'Documents', title: 'JSON vs XML', highlight: 'Lightweight key-value data interchange vs extensible tagged markup' },
  { slug: 'awbs-vs-pdf', ext1: 'AWBS', ext2: 'PDF', category: 'Databases', title: 'AWBS vs PDF', highlight: 'Application-specific aviation records vs portable fixed-layout document export' },

  // Archives
  { slug: 'zip-vs-rar', ext1: 'ZIP', ext2: 'RAR', category: 'Archives', title: 'ZIP vs RAR', highlight: 'Universal OS-native compression vs Roshal Archive proprietary high-ratio' },
  { slug: 'zip-vs-7z', ext1: 'ZIP', ext2: '7Z', category: 'Archives', title: 'ZIP vs 7Z', highlight: 'Universal standard Deflate archive vs LZMA2 maximum compression ratio' },
  { slug: 'tar-gz-vs-zip', ext1: 'TAR.GZ', ext2: 'ZIP', category: 'Archives', title: 'TAR.GZ vs ZIP', highlight: 'Unix solid archive stream vs random-access zip catalog' },
  { slug: 'iso-vs-dmg', ext1: 'ISO', ext2: 'DMG', category: 'Archives', title: 'ISO vs DMG', highlight: 'Universal optical disk image vs Apple macOS disk image container' },

  // Audio & Video
  { slug: 'mp4-vs-mkv', ext1: 'MP4', ext2: 'MKV', category: 'Audio & Video', title: 'MP4 vs MKV', highlight: 'Universal web & device container vs Matroska multi-track subtitle powerhouse' },
  { slug: 'mov-vs-mp4', ext1: 'MOV', ext2: 'MP4', category: 'Audio & Video', title: 'MOV vs MP4', highlight: 'Apple QuickTime editing format vs universal streaming standard' },
  { slug: 'webm-vs-mp4', ext1: 'WEBM', ext2: 'MP4', category: 'Audio & Video', title: 'WEBM vs MP4', highlight: 'Royalty-free HTML5 web video (VP9/AV1) vs H.264/H.265 standard' },
  { slug: 'mp3-vs-flac', ext1: 'MP3', ext2: 'FLAC', category: 'Audio & Video', title: 'MP3 vs FLAC', highlight: 'Lossy compact audio vs 100% bit-for-bit lossless audiophile sound' },
  { slug: 'wav-vs-flac', ext1: 'WAV', ext2: 'FLAC', category: 'Audio & Video', title: 'WAV vs FLAC', highlight: 'Uncompressed PCM studio audio vs compressed lossless studio master' },
  { slug: 'aac-vs-mp3', ext1: 'AAC', ext2: 'MP3', category: 'Audio & Video', title: 'AAC vs MP3', highlight: 'Advanced audio coding (Apple/YouTube) vs legacy MP3 compression' },

  // CAD & Vector
  { slug: 'dwg-vs-dxf', ext1: 'DWG', ext2: 'DXF', category: 'CAD & 3D', title: 'DWG vs DXF', highlight: 'AutoCAD native binary drawing vs open ASCII drawing exchange format' },
  { slug: 'step-vs-iges', ext1: 'STEP', ext2: 'IGES', category: 'CAD & 3D', title: 'STEP vs IGES', highlight: 'Modern ISO 10303 3D solid model interchange vs legacy surface CAD geometry' },
  { slug: 'stl-vs-obj', ext1: 'STL', ext2: 'OBJ', category: 'CAD & 3D', title: 'STL vs OBJ', highlight: 'Raw triangle 3D printing mesh vs Wavefront polygon mesh with UV textures' },
  { slug: '3mf-vs-stl', ext1: '3MF', ext2: 'STL', category: 'CAD & 3D', title: '3MF vs STL', highlight: 'Modern multi-color XML package with unit fidelity vs legacy 1987 unitless triangle mesh' },
];

/**
 * Retrieves the full knowledge graph node for any extension.
 */
export function getFormatKnowledgeNode(extInput: string): FormatKnowledgeNode {
  const cleanExt = extInput.trim().replace(/^\./, '').toLowerCase();
  const upperExt = cleanExt.toUpperCase();
  const info: FileTypeInfo = getOrGenerateExtensionInfo(cleanExt);

  // 1. URLs
  const howToOpenUrl = `/how-to-open/${cleanExt}`;
  const extensionUrl = `/file-extensions/${cleanExt}`;

  // 2. Converters
  const matchedConverters = CONVERTERS_LIST.filter(
    (c) => c.fromExt.toLowerCase() === cleanExt || c.id.startsWith(`${cleanExt}-to-`)
  );
  const converterUrls = matchedConverters.map((c) => ({
    targetExt: c.toExt.toUpperCase(),
    label: `${upperExt} to ${c.toExt.toUpperCase()}`,
    url: `/converters/${c.id}`,
    routeId: c.id,
  }));

  // If no converter explicitly registered, generate common fallbacks
  if (converterUrls.length === 0) {
    if (info.category === 'Images') {
      converterUrls.push(
        { targetExt: 'JPG', label: `${upperExt} to JPG`, url: `/converters/${cleanExt}-to-jpg`, routeId: `${cleanExt}-to-jpg` },
        { targetExt: 'PNG', label: `${upperExt} to PNG`, url: `/converters/${cleanExt}-to-png`, routeId: `${cleanExt}-to-png` },
        { targetExt: 'PDF', label: `${upperExt} to PDF`, url: `/converters/${cleanExt}-to-pdf`, routeId: `${cleanExt}-to-pdf` }
      );
    } else if (info.category === 'Documents') {
      converterUrls.push(
        { targetExt: 'PDF', label: `${upperExt} to PDF`, url: `/converters/${cleanExt}-to-pdf`, routeId: `${cleanExt}-to-pdf` },
        { targetExt: 'TXT', label: `${upperExt} to TXT`, url: `/converters/${cleanExt}-to-txt`, routeId: `${cleanExt}-to-txt` }
      );
    }
  }

  // 3. Comparisons
  const comparisons = CURATED_COMPARISONS.filter(
    (c) => c.ext1.toLowerCase() === cleanExt || c.ext2.toLowerCase() === cleanExt
  );

  // If none matched, synthesize dynamic comparisons
  if (comparisons.length === 0) {
    const allExts = getAllFileTypeInfos();
    const sameCat = allExts.filter((e) => e.category === info.category && e.extension.toLowerCase() !== cleanExt);
    if (sameCat.length > 0) {
      const otherExt = sameCat[0].extension.toUpperCase();
      comparisons.push({
        slug: `${cleanExt}-vs-${otherExt.toLowerCase()}`,
        ext1: upperExt,
        ext2: otherExt,
        title: `${upperExt} vs ${otherExt}`,
        category: info.category,
        highlight: `Detailed technical benchmark comparing .${upperExt} and .${otherExt} formats`,
      });
    }
  }

  // 4. Compatible Software with Capabilities
  const compatibleSoftware: SoftwareCapability[] = SOFTWARE_LIST.filter((soft) =>
    soft.supportedExtensions.some((e) => e.toLowerCase() === cleanExt) ||
    info.popularApps.some((app) => app.name.toLowerCase().includes(soft.name.toLowerCase()) || soft.name.toLowerCase().includes(app.name.toLowerCase()))
  ).map((soft) => {
    const isEditor = soft.category.includes('Design') || soft.category.includes('Office') || soft.category.includes('Audio') || soft.category.includes('Developer');
    return {
      software: soft,
      canOpen: true,
      canView: true,
      canEdit: isEditor,
      canConvert: isEditor,
      canCreate: isEditor,
      platformBadges: soft.supportedOS,
    };
  });

  // 5. Related Extensions
  const allExts = getAllFileTypeInfos();
  const relatedExts = allExts
    .filter((e) => e.extension.toLowerCase() !== cleanExt && e.category === info.category)
    .slice(0, 8)
    .map((e) => ({
      ext: e.extension.toUpperCase(),
      name: e.name,
      category: e.category,
      url: `/file-extensions/${e.extension.toLowerCase()}`,
    }));

  return {
    extension: cleanExt,
    upperExt,
    name: info.name,
    category: info.category,
    mimeType: info.mimeType,
    magicBytesHex: info.magicBytesHex,
    description: info.description,
    howToOpenUrl,
    extensionUrl,
    converterUrls,
    comparisons,
    compatibleSoftware,
    relatedExtensions: relatedExts,
  };
}

/**
 * Returns all software applications that support a given extension.
 */
export function getSoftwareForExtension(ext: string): SoftwareInfo[] {
  const clean = ext.trim().toLowerCase();
  return SOFTWARE_LIST.filter((s) => s.supportedExtensions.map((e) => e.toLowerCase()).includes(clean));
}

/**
 * Returns all file extensions supported by a given software ID.
 */
export function getExtensionsForSoftware(softwareId: string): FileTypeInfo[] {
  const soft = SOFTWARE_LIST.find((s) => s.id === softwareId);
  if (!soft) return [];
  return soft.supportedExtensions.map((e) => getOrGenerateExtensionInfo(e));
}

/**
 * Returns the best curated or category-appropriate comparison for any extension.
 */
export function getBestComparisonForExtension(extInput: string, category?: string): {
  slug: string;
  targetExt: string;
  title: string;
  highlight: string;
} {
  const clean = extInput.trim().replace(/^\./, '').toLowerCase();
  const upper = clean.toUpperCase();

  // 1. Check curated comparisons
  const match = CURATED_COMPARISONS.find(
    (c) => c.ext1.toLowerCase() === clean || c.ext2.toLowerCase() === clean
  );
  if (match) {
    const isFirst = match.ext1.toLowerCase() === clean;
    const targetExt = isFirst ? match.ext2.toUpperCase() : match.ext1.toUpperCase();
    return {
      slug: match.slug,
      targetExt,
      title: match.title,
      highlight: match.highlight,
    };
  }

  // 2. Category-based fallback
  const cat = category || 'General';
  let targetExt = 'PDF';
  if (cat.includes('Image')) {
    targetExt = upper === 'JPG' || upper === 'JPEG' ? 'PNG' : 'JPG';
  } else if (cat.includes('CAD') || cat.includes('3D')) {
    targetExt = upper === 'DWG' ? 'DXF' : 'DWG';
  } else if (cat.includes('Archive')) {
    targetExt = upper === 'ZIP' ? '7Z' : 'ZIP';
  } else if (cat.includes('Audio')) {
    targetExt = upper === 'MP3' ? 'FLAC' : 'MP3';
  } else if (cat.includes('Video')) {
    targetExt = upper === 'MP4' ? 'MKV' : 'MP4';
  } else if (cat.includes('Document')) {
    targetExt = upper === 'PDF' ? 'DOCX' : 'PDF';
  }

  const slug = `${clean}-vs-${targetExt.toLowerCase()}`;
  return {
    slug,
    targetExt,
    title: `${upper} vs ${targetExt}`,
    highlight: `Compare .${upper} and .${targetExt} file structures, quality, and software compatibility.`,
  };
}
