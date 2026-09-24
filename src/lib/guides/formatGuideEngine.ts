import { FileTypeInfo, SoftwareApp, ConversionPath, AppRoute } from '../../types';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { getOrGenerateExtensionInfo } from '../seo/extensionGenerator';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { CURATED_COMPARISONS } from '../database/knowledgeGraph';
import { getAllTools, getToolBySlug } from '../tools/toolsRegistry';
import { FILE_SIGNATURES } from '../../data/fileSignaturesData';

export interface FormatCharacteristic {
  title: string;
  value: string;
  badge?: string;
  description: string;
}

export interface FormatOsCompatibility {
  osName: string;
  supported: boolean;
  statusText: string;
  nativeApp: string;
  setupInstructions: string;
  codecRequired?: boolean;
}

export interface FormatSoftwareItem {
  id: string;
  name: string;
  developer: string;
  category: string;
  supportedOS: ('windows' | 'mac' | 'linux' | 'android' | 'ios')[];
  priceType: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  rating: number;
  routeId: string;
}

export interface FormatConversionItem {
  targetExt: string;
  converterSlug: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  onlinePossible: boolean;
  quality: string;
  description: string;
}

export interface FormatGuideData {
  format: string; // e.g. "HEIC"
  slug: string; // e.g. "heic"
  fullName: string; // e.g. "High Efficiency Image Container"
  category: string; // "Images" | "Documents" | "Archives" | "Audio & Video" | etc.
  mimeType: string;
  alternativeMimes: string[];
  extensions: string[]; // [".heic", ".heif"]
  developer: string;
  initialRelease: string;
  standardization: string;
  summary: string;

  // 15 Standard Sections
  whatIsOverview: string;
  fileExtensionDetails: {
    primaryExt: string;
    alternativeExts: string[];
    caseSensitivity: string;
    dosOrigin?: string;
  };
  mimeTypeDetails: {
    primaryMime: string;
    secondaryMimes: string[];
    rfcStandard?: string;
    headerSample: string;
  };
  primaryUseCases: string[];
  typicalFileSizeRange: string;
  
  // Category-Adaptive Characteristics
  characteristicsCategory: 'image' | 'document' | 'archive' | 'media' | 'code' | 'system' | 'cad';
  characteristics: FormatCharacteristic[];
  technicalDeepDive: {
    heading: string;
    description: string;
    bullets: string[];
    architectureSnippet?: string;
  };

  advantages: string[];
  limitations: string[];

  // Compatibility & Software
  osCompatibility: FormatOsCompatibility[];
  softwareList: FormatSoftwareItem[];

  // Related Formats & Ecosystem
  relatedFormats: {
    ancestor?: string;
    successor?: string;
    cousins: string[];
    comparisons: { slug: string; title: string; highlight: string }[];
  };

  // Conversions
  conversions: FormatConversionItem[];

  // Identification & Binary Signature
  fileIdentification: {
    magicBytesHex: string;
    magicBytesAscii: string;
    byteOffset: number;
    dangerRating: 'Low Risk' | 'Medium Risk' | 'High Risk';
    dangerExplanation: string;
    spoofingWarning: string;
  };

  // Relevant AnyFileX Tools
  relevantTools: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
  }>;

  // FAQs
  faqs: Array<{ question: string; answer: string }>;

  // Meta & SEO
  seoMeta: {
    title: string;
    description: string;
    canonical: string;
    h1: string;
    keywords: string[];
  };
}

// --------------------------------------------------------------------------
// Curated Deep Technical Database for Top 35 Prioritized Formats
// --------------------------------------------------------------------------
const CURATED_FORMAT_SPECS: Record<string, Partial<FormatGuideData>> = {
  HEIC: {
    format: 'HEIC',
    fullName: 'High Efficiency Image Container',
    category: 'Images',
    mimeType: 'image/heic',
    alternativeMimes: ['image/heif', 'image/heic-sequence'],
    extensions: ['.heic', '.heif'],
    developer: 'MPEG Group / Apple Inc.',
    initialRelease: '2017 (iOS 11)',
    standardization: 'ISO/IEC 23008-12 (HEIF standard)',
    summary: 'HEIC (High Efficiency Image Container) is Apple’s implementation of the HEIF image standard, using HEVC (H.265) intra-frame compression to achieve 50% smaller file sizes than JPEG with 16-bit color and depth maps.',
    whatIsOverview: 'HEIC is an advanced ISO Base Media File Format (ISOBMFF) container designed to store digital photos, image bursts, auxiliary depth maps, and alpha channels using High Efficiency Video Coding (HEVC / H.265) intra-frame compression. Adopted by Apple in 2017 as the default photo format for iPhone cameras, HEIC solves the storage and bandwidth bottlenecks of modern ultra-high-resolution sensors.',
    characteristicsCategory: 'image',
    characteristics: [
      { title: 'Compression Algorithm', value: 'HEVC (H.265) Intra-Frame', badge: 'Next-Gen', description: 'Uses variable Coding Tree Units (CTUs) from 4x4 to 64x64 pixels for dynamic detail optimization.' },
      { title: 'Color Depth & Gamut', value: '10-bit / 16-bit Display P3', badge: 'HDR Ready', description: 'Supports over 281 trillion color values, eliminating color banding in sky and skin gradients.' },
      { title: 'Transparency & Alpha', value: 'Full 16-bit Auxiliary Channel', badge: 'Supported', description: 'Stores lossless or lossy alpha transparency channels directly inside the image container.' },
      { title: 'Computational Data', value: 'Stereo Disparity & Depth Maps', badge: 'Multi-Item', description: 'Stores focal distance and depth map layers for post-capture Portrait Mode adjustments.' }
    ],
    technicalDeepDive: {
      heading: 'ISO/IEC 23008-12 Container Architecture & Box Hierarchy',
      description: 'Unlike JPEG which is a flat stream of 8x8 DCT blocks, HEIC is a structured hierarchical container. It organizes data into ISOBMFF "boxes": ftyp (brand definition), meta (item references, EXIF tags, and color profiles), and mdat (raw HEVC encoded NAL units).',
      bullets: [
        'ftyp Box: Header containing FourCC code "heic" or "mif1" identifying codec capabilities.',
        'meta Box: Stores item location (iloc), item protection (ipro), and color profile atoms.',
        'mdat Box: Contains the compressed NAL packets containing high-frequency and low-frequency image coefficients.',
        'Non-Destructive Transform Metadata: Rotations, crops, and overlays can be applied as metadata instructions without re-encoding the underlying pixels.'
      ],
      architectureSnippet: '00 00 00 18 66 74 79 70 68 65 69 63 | ....ftypheic'
    },
    advantages: [
      'Delivers equivalent or superior visual quality to JPEG at approximately 50% the file size.',
      'Supports wide color gamut (Display P3) and 10-bit/16-bit color depth for high dynamic range (HDR).',
      'Encapsulates Live Photos, continuous burst shots, and audio tracks in a single unified file.',
      'Stores stereo depth maps and computational photography metadata for non-destructive bokeh tuning.',
      'Native hardware-accelerated decoding across modern Apple, Android (9+), and Intel/AMD GPUs.'
    ],
    limitations: [
      'Windows 10 and 11 require purchasing or installing the HEVC Video Extensions codec from Microsoft Store.',
      'Web browsers (Chrome, Firefox) do not natively render HEIC directly in HTML <img> tags, requiring conversion to WebP or JPG.',
      'Older legacy photo editing software and CMS platforms may reject .heic uploads.'
    ]
  },
  PDF: {
    format: 'PDF',
    fullName: 'Portable Document Format',
    category: 'Documents',
    mimeType: 'application/pdf',
    alternativeMimes: ['application/x-pdf', 'application/acrobat'],
    extensions: ['.pdf'],
    developer: 'Adobe Systems / ISO (ISO 32000-2)',
    initialRelease: '1993',
    standardization: 'ISO 32000-1 / ISO 32000-2',
    summary: 'PDF is the universal digital document publishing standard that encapsulates layout, vector typography, fonts, color profiles, and interactive forms with pixel-perfect fidelity across any operating system or printer.',
    whatIsOverview: 'PDF (Portable Document Format) is an open international standard (ISO 32000) created by Adobe Systems in 1993. It encapsulates text, typography, vector geometry, raster images, electronic forms, and cryptographic signatures into a self-contained document that displays identically regardless of hardware, operating system, or application.',
    characteristicsCategory: 'document',
    characteristics: [
      { title: 'Page Layout Model', value: 'Fixed-Coordinate PostScript Vector Engine', badge: 'Pixel Perfect', description: 'Defines precise typographic coordinates, embedded font glyphs, and high-DPI vector paths.' },
      { title: 'Security & Signatures', value: 'AES-256 Encryption & X.509 PKI', badge: 'Legally Binding', description: 'Supports password authorization, permission bitmasks, and certified digital signatures.' },
      { title: 'Interactive Capabilities', value: 'AcroForms & XFA XML Forms', badge: 'Dynamic', description: 'Allows interactive form filling, JavaScript validation, calculations, and digital submission.' },
      { title: 'Archival Standards', value: 'PDF/A (ISO 19005 Compliance)', badge: 'Long-Term', description: 'Guarantees document reproducibility across decades by strictly embedding all fonts and color profiles.' }
    ],
    technicalDeepDive: {
      heading: 'PostScript Object Model & Cross-Reference Table (XREF)',
      description: 'A valid PDF file comprises four major structural sections: Header (%PDF-1.7), Body (stream objects and dictionaries), Cross-Reference Table (xref), and Trailer. The XREF table allows instant random-access page rendering without parsing the entire file sequentially.',
      bullets: [
        'Header: Declares the PDF specification version (e.g. %PDF-1.7 or %PDF-2.0).',
        'Body: A graph of indirect objects containing fonts, page trees, content streams, and embedded ICC profiles.',
        'XREF Table: Byte offset index for every object in the file, enabling linear fast web view streaming.',
        'Trailer & %%EOF: Points to the root catalog dictionary and provides cryptographic hash verification.'
      ],
      architectureSnippet: '%PDF-1.7\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\nxref\n0 3\ntrailer << /Root 1 0 R >>\n%%EOF'
    },
    advantages: [
      '100% universal rendering consistency: documents print and display identically on all devices.',
      'Self-contained architecture embeds all required fonts, vector paths, and color ICC profiles.',
      'Supports industry-standard AES-256 encryption, role permissions, and legal digital signatures.',
      'Compact compression using Flate, JBIG2, and JPEG2000 compression filters for text and images.',
      'Extensive sub-standards for specific industries: PDF/A (Archival), PDF/X (Prepress), PDF/E (Engineering).'
    ],
    limitations: [
      'Fixed-coordinate layout makes reflowing text on small smartphone screens awkward compared to EPUB.',
      'Full-featured editing requires specialized software like Adobe Acrobat or vector editors.',
      'Embedded JavaScript engines and complex form annotations can introduce security attack vectors.'
    ]
  },
  DWG: {
    format: 'DWG',
    fullName: 'AutoCAD Drawing Database',
    category: 'CAD & 3D',
    mimeType: 'image/vnd.dwg',
    alternativeMimes: ['model/vnd.dwg', 'application/acad', 'application/x-dwg'],
    extensions: ['.dwg'],
    developer: 'Autodesk, Inc.',
    initialRelease: '1982',
    standardization: 'Autodesk RealDWG / Open Design Alliance',
    summary: 'DWG is the worldwide computer-aided design (CAD) standard for 2D drafting and 3D architectural modeling created by Autodesk.',
    whatIsOverview: 'DWG is a proprietary binary database format created by Autodesk in 1982 alongside the original launch of AutoCAD. It serves as the primary global standard for two-dimensional architectural drafting, civil engineering blueprints, and 3D solid mechanical parts. Engineered as an indexed binary database, DWG provides instant random-access editing of massive multi-layered vector drawings.',
    characteristicsCategory: 'cad',
    characteristics: [
      { title: 'Vector Coordinate Engine', value: 'Double-Precision 64-bit Floating Point', badge: 'High Precision', description: 'Calculates structural coordinates, arcs, and parametric splines with millimeter and sub-micron accuracy.' },
      { title: 'Layer & Block Hierarchy', value: 'Indexed Drawing Database Architecture', badge: 'Structured', description: 'Separates architectural models into independent layers with custom linetypes, colors, and reusable blocks.' },
      { title: '3D Solid Modeling', value: 'ACIS Solid Modeling Engine', badge: '3D Solid B-Rep', description: 'Stores true volumetric solids, boundary representations (B-rep), surfaces, and realistic render materials.' },
      { title: 'External Referencing', value: 'XREF Dynamic Linking System', badge: 'Collaborative', description: 'Enables multidisciplinary design teams to reference master floorplans and structural models in real time.' }
    ],
    technicalDeepDive: {
      heading: 'AutoCAD Binary Header Signatures & Section Pointers',
      description: 'A valid DWG drawing begins with a 6-byte ASCII version string (magic bytes). Version AC1032 denotes AutoCAD 2018-2025, AC1027 denotes AutoCAD 2013-2017, and AC1024 denotes AutoCAD 2010-2012. The file contains four primary binary structures: Header Variables, Class Definitions, Object Map, and Entity Handles.',
      bullets: [
        'Version Header (Offset 0x00): Identifies AutoCAD release compatibility (e.g., AC1032 for modern versions).',
        'Drawing Variables ($HEADER): Stores scale, units ($INSUNITS), grid limits, and coordinate systems (UCS).',
        'Object Map & Handles: Unique 64-bit integer IDs enabling non-destructive linking and external references (XREFs).',
        'Entity Section: Contains lines, polylines, 3D solids, dimensions, text annotations, and block definitions.'
      ],
      architectureSnippet: '41 43 31 30 33 32 00 00 00 00 00 00 | AC1032..........'
    },
    advantages: [
      'De-facto global standard for architecture, civil engineering, construction, and mechanical drafting.',
      'Binary compression yields file sizes 70% to 85% smaller than plain-text ASCII DXF files.',
      'Retains full 3D solid geometry (ACIS), parametric constraints, and dynamic blocks.',
      'Supports external reference drawings (XREFs) for seamless team collaboration on massive projects.',
      'Free viewers available from Autodesk (Autodesk DWG TrueView, Autodesk Web Viewer).'
    ],
    limitations: [
      'Proprietary format requires Autodesk software, licensed RealDWG libraries, or specialized CAD viewers.',
      'Periodic format revisions (e.g. 2018 vs 2013 schema) may require converting drawings back for legacy systems.',
      'Cannot be natively previewed in web browsers without WebGL CAD engines or conversion to vector PDF.'
    ]
  },
  WEBP: {
    format: 'WEBP',
    fullName: 'Google WebP Image Format',
    category: 'Images',
    mimeType: 'image/webp',
    alternativeMimes: [],
    extensions: ['.webp'],
    developer: 'Google LLC',
    initialRelease: '2010',
    standardization: 'Open Royalty-Free Web Standard',
    summary: 'WebP is an open modern web image format developed by Google offering superior lossy and lossless compression, alpha transparency, and animations inside a lightweight RIFF container.',
    whatIsOverview: 'WebP is a modern raster image format introduced by Google in 2010 to accelerate web page loading speeds. Built upon VP8 video intra-frame compression algorithms and packaged inside a RIFF container, WebP provides 26% smaller file sizes than PNG and 25-34% smaller sizes than JPEG while supporting 24-bit color, lossless alpha channels, and animation.',
    characteristicsCategory: 'image',
    characteristics: [
      { title: 'Lossy Compression', value: 'VP8 Intra-Frame Macroblocks', badge: 'High Density', description: 'Predicts sub-block color gradients from neighboring pixels before computing discrete cosine transforms.' },
      { title: 'Lossless Compression', value: 'VP8L Entropy Coding', badge: '26% < PNG', description: 'Uses spatial transformations, color subtraction, local cache indices, and Huffman coding.' },
      { title: 'Alpha Transparency', value: '8-bit Alpha Channel', badge: 'Lossy & Lossless', description: 'Enables smooth anti-aliased transparency over lossy photographic payloads.' },
      { title: 'Animation Support', value: 'VP8X Multi-Frame Animation', badge: 'Replaces GIF', description: 'Compresses multi-frame animated sequences with 64-90% smaller byte sizes than legacy GIFs.' }
    ],
    technicalDeepDive: {
      heading: 'RIFF Container Chunks & VP8/VP8L Payloads',
      description: 'A WebP file is structured as a standard Resource Interchange File Format (RIFF) container. The 12-byte header contains the "RIFF" signature, 4-byte size, and "WEBP" FourCC code, followed by one of three primary payload chunks.',
      bullets: [
        'VP8 Chunk: Contains lossy keyframe bitstream based on the VP8 video specification.',
        'VP8L Chunk: Contains lossless pixel stream with dynamic color codebook indices.',
        'VP8X Extended Chunk: Declares ICC color profile, EXIF metadata, XMP tags, alpha channel, and animation frames.',
        'ALPH Chunk: Dedicated compressed alpha channel data preceding the color payload.'
      ],
      architectureSnippet: '52 49 46 46 [Size] 57 45 42 50 56 50 38 | RIFF....WEBPVP8'
    },
    advantages: [
      'Reduces website image payload by 25-35% compared to JPEG and PNG at equivalent visual fidelity.',
      'Supported natively by >97% of modern web browsers (Chrome, Safari, Firefox, Edge, Opera).',
      'Supports lossy color compression combined with lossless alpha transparency in a single file.',
      'Replaces heavy GIF animations with lightweight 24-bit animated WebP sequences.',
      'Improves Core Web Vitals (LCP) and mobile page loading performance.'
    ],
    limitations: [
      'Maximum canvas dimensions capped at 16,383 x 16,383 pixels.',
      'Limited to 8-bit color channels (no native 10-bit or 16-bit HDR support like AVIF or HEIC).',
      'Legacy desktop software and print publishing workflows may require converting to JPG or TIFF.'
    ]
  },
  ZIP: {
    format: 'ZIP',
    fullName: 'ZIP Compressed Archive File',
    category: 'Archives',
    mimeType: 'application/zip',
    alternativeMimes: ['application/x-zip-compressed'],
    extensions: ['.zip'],
    developer: 'PKWARE / Phil Katz',
    initialRelease: '1989',
    standardization: 'APPNOTE.TXT Open Specification',
    summary: 'ZIP is the universal cross-platform archive format providing lossless Deflate compression, random file extraction, and directory tree encapsulation across all major operating systems.',
    whatIsOverview: 'ZIP is a compressed file archive format created by Phil Katz in 1989 for the PKZIP utility. It encapsulates multiple files and directory hierarchies into a single package using lossless compression (principally Deflate, bzip2, or LZMA). Every major modern operating system (Windows, macOS, Linux, Android, iOS) includes native, zero-installation support for extracting and creating ZIP archives.',
    characteristicsCategory: 'archive',
    characteristics: [
      { title: 'Compression Algorithm', value: 'Deflate (LZ77 + Huffman Coding)', badge: 'Universal', description: 'Lossless dictionary compression balancing high speed with solid data compaction.' },
      { title: 'Directory Architecture', value: 'Central Directory Table', badge: 'Random Access', description: 'Stores index catalog at end of file, allowing individual files to be extracted without decompressing the whole archive.' },
      { title: 'Encryption Standards', value: 'WinZip AES-256 & PKZIP Crypto', badge: 'Secure', description: 'Supports standard 256-bit AES encryption with password key derivation (PBKDF2).' },
      { title: 'Capacity & Limits', value: 'ZIP64 (16 Exabytes & 4B Files)', badge: 'Unlimited', description: 'ZIP64 extensions remove the legacy 4GB file size and 65,535 file count limits.' }
    ],
    technicalDeepDive: {
      heading: 'Central Directory Catalog & Binary Magic Signatures',
      description: 'A ZIP archive consists of a series of local file records followed by a central directory record and an End of Central Directory (EOCD) record at the very end of the file. This structure makes adding and extracting single files instantaneous.',
      bullets: [
        'Local File Header: Begins with magic bytes 50 4B 03 04 (PK\\x03\\x04) preceding each compressed member.',
        'Central Directory Header: Begins with 50 4B 01 02 (PK\\x01\\x02) indexing filename, attributes, and byte offsets.',
        'End of Central Directory (EOCD): Begins with 50 4B 05 06 (PK\\x05\\x06) containing central directory offsets and comments.',
        'Underlying Base for Office Formats: Modern .docx, .xlsx, .pptx, .apk, and .jar files are technically ZIP archives.'
      ],
      architectureSnippet: '50 4B 03 04 (Local) ... 50 4B 01 02 (Central) ... 50 4B 05 06 (EOCD)'
    },
    advantages: [
      '100% native operating system support: open and extract on Windows, Mac, Linux, iOS, and Android without third-party software.',
      'Random access extraction: pull out a single 10KB file from a 10GB archive without decompressing everything.',
      'Robust industry standard serving as the physical container format for DOCX, XLSX, APK, EPUB, and JAR.',
      'Supports strong WinZip AES-256 encryption with password protection.',
      'High decompression throughput with low CPU overhead.'
    ],
    limitations: [
      'Non-solid compression: compression ratio is lower than solid 7Z or RAR archives when compressing thousands of similar files.',
      'Legacy ZipCrypto encryption is vulnerable to known-plaintext attacks (always use AES-256).',
      'Filename encoding issues can occur with non-ASCII characters if UTF-8 flag (bit 11) is not set in older archivers.'
    ]
  },
  MP4: {
    format: 'MP4',
    fullName: 'MPEG-4 Part 14 Video Container',
    category: 'Audio & Video',
    mimeType: 'video/mp4',
    alternativeMimes: ['video/x-m4v', 'audio/mp4'],
    extensions: ['.mp4', '.m4v', '.m4a'],
    developer: 'ISO / IEC (Moving Picture Experts Group)',
    initialRelease: '2001 (revised 2003)',
    standardization: 'ISO/IEC 14496-14',
    summary: 'MP4 is the universal multimedia container format for video, audio, subtitles, and chapter metadata, supported natively by virtually every smartphone, browser, TV, and media player on Earth.',
    whatIsOverview: 'MPEG-4 Part 14 (MP4) is an open international digital multimedia container format standardized by ISO/IEC. Based directly on Apple’s QuickTime File Format (.MOV), MP4 encapsulates video streams (H.264, H.265/HEVC, AV1), audio tracks (AAC, MP3, AC3, Opus), subtitle streams, chapter markers, and variable bitrate metadata into a streamable binary container.',
    characteristicsCategory: 'media',
    characteristics: [
      { title: 'Video Codec Support', value: 'H.264 (AVC), H.265 (HEVC), AV1, VP9', badge: 'Universal', description: 'Encapsulates modern high-definition 4K/8K video streams with hardware acceleration.' },
      { title: 'Audio Codec Support', value: 'AAC-LC, HE-AAC, MP3, Dolby AC-3, Opus', badge: 'High Fidelity', description: 'Supports multi-channel 5.1 and 7.1 surround sound audio with high compression efficiency.' },
      { title: 'Streaming Fast Start', value: 'moov Atom Header Placement', badge: 'Instant Play', description: 'Positioning the moov atom at the front of the file enables progressive HTTP streaming without full download.' },
      { title: 'Timed Metadata', value: 'VTT Subtitles, Chapters, 3D Spatial Audio', badge: 'Rich Data', description: 'Stores embedded closed captions, chapter points, and spatial panning coordinates.' }
    ],
    technicalDeepDive: {
      heading: 'ISOBMFF Atom & Box Structure (ftyp, moov, mdat)',
      description: 'MP4 files are composed of discrete data blocks called "atoms" or "boxes". Each atom has an 8-byte header specifying its size and 4-character FourCC code.',
      bullets: [
        'ftyp Atom: Specifies compatibility brands such as "isom", "mp42", or "avc1".',
        'moov Atom: The movie metadata directory containing track headers (trak), sample tables (stbl), and timing indexes.',
        'mdat Atom: The media data payload containing interleaved video frames and audio packets.',
        'Fast-Start / Web Optimization: Moving the moov box ahead of mdat allows web browsers to start playback instantly.'
      ],
      architectureSnippet: '00 00 00 18 66 74 79 70 69 73 6F 6D | ....ftypisom'
    },
    advantages: [
      'Unmatched universal playback: 100% supported by all web browsers, smartphones, game consoles, smart TVs, and desktop OS.',
      'Supports cutting-edge hardware-accelerated video codecs (H.264, HEVC/H.265, AV1).',
      'Instant web playback via progressive streaming when the moov atom is located at file start.',
      'Encapsulates multi-track audio, language selection, chapter markers, and subtitles.',
      'Standard format for YouTube, Vimeo, TikTok, Netflix, and social media broadcasting.'
    ],
    limitations: [
      'Container corruption risk: if recording terminates unexpectedly before the moov atom is written, the video cannot be opened without repair tools.',
      'MKV offers more flexible support for exotic audio codecs (FLAC, TrueHD) and complex ASS subtitle styling than standard MP4.',
      'HEVC and H.264 codecs inside MP4 carry commercial licensing and patent pool fees for hardware manufacturers.'
    ]
  }
};

// --------------------------------------------------------------------------
// Core Generator: Produces Complete FormatGuideData for ANY Format
// --------------------------------------------------------------------------
export function getOrGenerateFormatGuide(formatInput: string): FormatGuideData {
  const clean = formatInput.trim().replace(/^\./, '').toLowerCase();
  const upper = clean.toUpperCase();
  const info: FileTypeInfo = getOrGenerateExtensionInfo(clean);

  // 1. Check curated overrides
  const curated = CURATED_FORMAT_SPECS[upper];

  // 2. Identify Category Archetype
  let catArchetype: FormatGuideData['characteristicsCategory'] = 'image';
  const catLower = info.category.toLowerCase();
  if (catLower.includes('image') || catLower.includes('photo')) {
    catArchetype = 'image';
  } else if (catLower.includes('doc') || catLower.includes('office') || catLower.includes('text') || catLower.includes('pdf')) {
    catArchetype = 'document';
  } else if (catLower.includes('archive') || catLower.includes('compress') || catLower.includes('disk')) {
    catArchetype = 'archive';
  } else if (catLower.includes('audio') || catLower.includes('video') || catLower.includes('media')) {
    catArchetype = 'media';
  } else if (catLower.includes('code') || catLower.includes('data') || catLower.includes('dev')) {
    catArchetype = 'code';
  } else if (catLower.includes('cad') || catLower.includes('3d')) {
    catArchetype = 'cad';
  } else {
    catArchetype = 'system';
  }

  // 3. Dynamic Characteristics Generator based on Category
  const defaultCharacteristics: FormatCharacteristic[] = (() => {
    switch (catArchetype) {
      case 'image':
        return [
          { title: 'Compression Architecture', value: upper.includes('PNG') || upper.includes('SVG') || upper.includes('TIFF') ? 'Lossless Compression' : 'Adaptive Lossy / Lossless', badge: 'Visual Fidelity', description: `Optimized raster or vector algorithms designed for digital rendering and photo encoding.` },
          { title: 'Color Spectrum & Gamut', value: 'sRGB / Display P3 Color Channels', badge: 'TrueColor', description: 'Encapsulates color matrices preserving natural contrast and tonal distribution.' },
          { title: 'Alpha Channel Transparency', value: ['PNG', 'WEBP', 'SVG', 'GIF', 'HEIC', 'AVIF', 'PSD', 'TIFF'].includes(upper) ? 'Native Alpha Channel' : 'Opaque Canvas', badge: 'Transparency', description: 'Enables layered compositing, icon cutouts, and transparent website assets.' },
          { title: 'Browser Compatibility', value: ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'SVG', 'AVIF'].includes(upper) ? 'Universal Browser Native' : 'Requires Codec / Conversion', badge: 'Web Ready', description: 'Direct HTML5 <img> rendering support across Google Chrome, Apple Safari, and Firefox.' }
        ];
      case 'document':
        return [
          { title: 'Document Structure', value: upper.includes('X') ? 'Office Open XML (ZIP + XML)' : 'Formatted Structured Document', badge: 'Standardized', description: 'Organizes body paragraphs, styles, table schemas, and embedded media assets.' },
          { title: 'Layout & Typography', value: upper === 'PDF' ? 'Fixed-Coordinate Vector Engine' : 'Dynamic Flowable Typography', badge: 'Layout', description: 'Preserves font embedding, line spacing, margins, and print pagination.' },
          { title: 'Metadata & Versioning', value: 'Author, Timestamps & Revision History', badge: 'Trackable', description: 'Encapsulates document modification metadata, comments, and change tracking.' },
          { title: 'Security & Access Control', value: 'Password Protection & Cryptography', badge: 'Enterprise', description: 'Supports file permissions, password encryption, and digital signatures.' }
        ];
      case 'archive':
        return [
          { title: 'Compression Algorithm', value: upper === '7Z' ? 'LZMA2 High-Ratio Engine' : upper === 'RAR' ? 'Roshal Archive Algorithm' : 'Deflate / LZS Lossless Compression', badge: 'Lossless', description: 'Reduces raw disk footprint through dictionary and entropy symbol substitution.' },
          { title: 'File Tree Integrity', value: 'Hierarchical Folder Encapsulation', badge: 'Preservation', description: 'Retains directory trees, UNIX file permissions, symlinks, and timestamps.' },
          { title: 'Encryption & Hashing', value: 'AES-256 & CRC-32 Checksums', badge: 'Cryptographic', description: 'Protects archive contents with encryption and verifies transfer integrity.' },
          { title: 'Extraction Method', value: upper === 'ZIP' ? 'Random Access Indexing' : 'Solid Archive Compression', badge: 'Streamable', description: 'Allows selective member extraction without decompressing the entire payload.' }
        ];
      case 'media':
        return [
          { title: 'Container Box Structure', value: 'Interleaved Audio / Video Tracks', badge: 'Multi-Track', description: 'Multiplexes video keyframes, audio channels, and subtitle streams into unified packets.' },
          { title: 'Hardware Acceleration', value: 'GPU-Decoded Playback', badge: 'Fast Stream', description: 'Direct playback acceleration on Intel, Apple Silicon, Nvidia, and Qualcomm hardware.' },
          { title: 'Bitrate & Quality Scaling', value: 'Variable Bitrate (VBR / CBR)', badge: 'Adaptive', description: 'Dynamically balances bandwidth consumption with high visual and acoustic fidelity.' },
          { title: 'Streaming Readiness', value: 'Progressive Web Streaming', badge: 'Zero Wait', description: 'Enables immediate playback over HTTP/HTTPS connections.' }
        ];
      default:
        return [
          { title: 'Binary Encoding', value: 'Structured Data Stream', badge: 'Binary / Text', description: 'Formatted byte alignment adhering to international format specifications.' },
          { title: 'Validation Standard', value: 'Specification Conformance', badge: 'Standardized', description: 'Adheres to formal schema and protocol documentation.' },
          { title: 'Cross-Platform Portability', value: 'Cross-Platform Interoperability', badge: 'Universal', description: 'Parsed and executed identically across Windows, macOS, and Linux kernels.' },
          { title: 'Security & Safety', value: info.dangerRating, badge: 'Audited', description: info.dangerExplanation }
        ];
    }
  })();

  // 4. Build OS Support Matrix
  const osList: FormatOsCompatibility[] = [
    {
      osName: 'Windows 11 / 10',
      supported: info.osSupport?.windows ?? true,
      statusText: info.osSupport?.windows ? 'Native or Codec Supported' : 'Third-Party App Required',
      nativeApp: upper.includes('HEIC') ? 'Windows Photos (with HEIF Extensions)' : upper === 'PDF' ? 'Microsoft Edge / Acrobat' : upper.includes('DOC') ? 'Microsoft Word / WordPad' : 'Windows File Explorer',
      setupInstructions: info.openingSteps[0]?.desc || `Double click to open or right-click to choose default application.`
    },
    {
      osName: 'macOS (Apple Mac)',
      supported: info.osSupport?.mac ?? true,
      statusText: 'Native macOS Support',
      nativeApp: 'Apple Preview / Quick Look',
      setupInstructions: `Select the .${clean} file in Finder and tap the Spacebar for an instant Quick Look preview, or double-click to open in Preview.`
    },
    {
      osName: 'Linux (Ubuntu / Fedora)',
      supported: info.osSupport?.linux ?? true,
      statusText: info.osSupport?.linux ? 'Open Source Supported' : 'Requires Wine or Converter',
      nativeApp: 'GNOME Document Viewer / GIMP / LibreOffice',
      setupInstructions: `Open via default desktop tools or install package dependencies using your distribution package manager.`
    },
    {
      osName: 'Android',
      supported: info.osSupport?.android ?? true,
      statusText: info.osSupport?.android ? 'Native Mobile Support' : 'Viewer App Required',
      nativeApp: 'Google Files / Google Photos / Google Drive',
      setupInstructions: `Open directly in Google Files or compatible Google Play viewer applications.`
    },
    {
      osName: 'iOS (iPhone & iPad)',
      supported: info.osSupport?.ios ?? true,
      statusText: info.osSupport?.ios ? 'Native iOS Support' : 'Third-Party App Required',
      nativeApp: 'Apple Photos / Files App / Safari',
      setupInstructions: `Tap the file in Apple Files or Safari to view instantly with built-in iOS Quick Look.`
    }
  ];

  // 5. Build Verified Software Directory
  const softwareList: FormatSoftwareItem[] = SOFTWARE_LIST.filter(s =>
    s.supportedExtensions.some(e => e.toLowerCase() === clean) ||
    info.popularApps.some(app => app.name.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(app.name.toLowerCase()))
  ).slice(0, 6).map(s => ({
    id: s.id,
    name: s.name,
    developer: s.developer,
    category: s.category,
    supportedOS: s.supportedOS,
    priceType: s.priceType,
    rating: s.rating,
    routeId: s.id
  }));

  // Fallback software if none linked
  if (softwareList.length === 0) {
    softwareList.push({
      id: 'anyfilex-viewer',
      name: 'AnyFileX Online Inspector',
      developer: 'AnyFileX Labs',
      category: 'Web Browser Utility',
      supportedOS: ['windows', 'mac', 'linux', 'android', 'ios'],
      priceType: 'Free',
      rating: 4.9,
      routeId: 'file-analyzer'
    });
  }

  // 6. Build Conversions List
  const matchedConverters = CONVERTERS_LIST.filter(c => c.fromExt.toLowerCase() === clean || c.id.startsWith(`${clean}-to-`));
  const conversions: FormatConversionItem[] = matchedConverters.map(c => ({
    targetExt: c.toExt.toUpperCase(),
    converterSlug: c.id,
    name: `${upper} to ${c.toExt.toUpperCase()}`,
    difficulty: 'Easy',
    onlinePossible: true,
    quality: c.qualityRating,
    description: c.description
  }));

  if (conversions.length === 0 && info.conversions) {
    info.conversions.forEach(c => {
      conversions.push({
        targetExt: c.targetExtension,
        converterSlug: c.converterSlug || `${clean}-to-${c.targetExtension.toLowerCase()}`,
        name: `${upper} to ${c.targetExtension}`,
        difficulty: c.difficulty,
        onlinePossible: c.onlinePossible,
        quality: 'High Fidelity',
        description: c.description
      });
    });
  }

  // 7. Comparisons
  const comparisons = CURATED_COMPARISONS.filter(c => c.ext1.toLowerCase() === clean || c.ext2.toLowerCase() === clean).map(c => ({
    slug: c.slug,
    title: c.title,
    highlight: c.highlight
  }));

  // 8. Relevant AnyFileX Tools
  const allTools = getAllTools();
  const relevantTools = allTools.filter(t => {
    if (t.slug === 'file-analyzer') return true;
    if (catArchetype === 'image' && (t.slug === 'image-compressor' || t.slug === 'remove-metadata' || t.slug === 'metadata-viewer')) return true;
    if (catArchetype === 'document' && (t.slug === 'remove-metadata' || t.slug === 'hash-generator')) return true;
    if (t.slug === 'magic-byte-detector' || t.slug === 'mime-checker') return true;
    return false;
  }).slice(0, 4).map(t => ({
    id: t.slug,
    name: t.name,
    slug: t.slug,
    description: t.description,
    category: t.category
  }));

  // 9. Standard FAQs
  const baseFaqs = info.faqs && info.faqs.length > 0 ? info.faqs : [
    {
      question: `What is a .${upper} file and how is it used?`,
      answer: `A .${upper} file is a ${info.name}. It is widely used for ${info.exampleUse || 'storing digital data and assets'} with official MIME type ${info.mimeType}.`
    },
    {
      question: `How do I open a .${upper} file on Windows and Mac?`,
      answer: `On Windows, you can open .${upper} files using ${info.popularApps[0]?.name || 'compatible default viewers'} or inspect them directly in your browser using AnyFileX. On macOS, double-click or use Quick Look (Spacebar) to preview the file.`
    },
    {
      question: `Can I convert .${upper} files to other formats online?`,
      answer: `Yes. AnyFileX provides free in-browser converters to transform .${upper} files into universal formats like PDF, JPG, and PNG with zero software downloads or server uploads.`
    },
    {
      question: `What are the magic bytes and binary header of a .${upper} file?`,
      answer: `The standard file signature for .${upper} is: ${info.magicBytesHex}. This unique byte sequence identifies the true format regardless of the file extension.`
    }
  ];

  // 10. Assemble Final Structured Object
  return {
    format: upper,
    slug: clean,
    fullName: curated?.fullName || info.name,
    category: curated?.category || info.category,
    mimeType: curated?.mimeType || info.mimeType,
    alternativeMimes: curated?.alternativeMimes || [],
    extensions: curated?.extensions || [`.${clean}`],
    developer: curated?.developer || info.developer || 'Standards Organization / Software Community',
    initialRelease: curated?.initialRelease || info.firstReleased || 'Standardized Digital Format',
    standardization: curated?.standardization || 'ISO / IETF / Industry Standard',
    summary: curated?.summary || info.description,

    whatIsOverview: curated?.whatIsOverview || info.detailedOverview || `The .${upper} file format (${info.name}) is a standardized digital file specification used across operating systems for ${info.exampleUse}.`,

    fileExtensionDetails: {
      primaryExt: `.${clean}`,
      alternativeExts: (curated?.extensions || [`.${clean}`]).filter(e => e.toLowerCase() !== `.${clean}`),
      caseSensitivity: 'Case-Insensitive (Windows/macOS standard)',
      dosOrigin: upper.length > 3 ? `Often shortened to 3 letters in legacy DOS 8.3 file systems.` : undefined
    },

    mimeTypeDetails: {
      primaryMime: curated?.mimeType || info.mimeType,
      secondaryMimes: curated?.alternativeMimes || [],
      rfcStandard: curated?.mimeType === 'image/heic' ? 'RFC 23008-12' : curated?.mimeType === 'application/pdf' ? 'RFC 3778 / ISO 32000' : 'IANA Registered Content-Type',
      headerSample: `Content-Type: ${curated?.mimeType || info.mimeType}`
    },

    primaryUseCases: [
      info.exampleUse || 'Digital Media & Data Storage',
      `Cross-platform asset sharing between Windows, macOS, Android, and iOS`,
      `Standard output format in professional software workflows`,
      `Web and desktop document, image, or media distribution`
    ],

    typicalFileSizeRange: info.typicalSize || '50 KB – 50 MB',

    characteristicsCategory: curated?.characteristicsCategory || catArchetype,
    characteristics: curated?.characteristics || defaultCharacteristics,

    technicalDeepDive: curated?.technicalDeepDive || {
      heading: `${upper} Binary Structure & Header Specifications`,
      description: `The .${upper} format organizes data into validated sequential or hierarchical byte structures. Inspecting the header offset reveals the magic byte sequence ${info.magicBytesHex}.`,
      bullets: [
        `File Signature (Magic Bytes): ${info.magicBytesHex}`,
        `MIME Content-Type: ${info.mimeType}`,
        `Payload Structure: Optimized data stream with metadata headers and checksum records.`,
        `Safety Classification: ${info.dangerRating} – ${info.dangerExplanation}`
      ],
      architectureSnippet: info.magicBytesHex
    },

    advantages: curated?.advantages || [
      `High compatibility across major operating systems and applications.`,
      `Optimized data density balancing speed and storage efficiency.`,
      `Standardized format supported by open-source libraries and commercial editors.`,
      `Integrated metadata storage for author, creation date, and technical parameters.`
    ],

    limitations: curated?.limitations || [
      `May require installing third-party codecs or software on older operating systems.`,
      `Certain proprietary features may not render identically in all third-party viewers.`,
      `Large files may require compression before sending via email or messaging apps.`
    ],

    osCompatibility: osList,
    softwareList: softwareList,

    relatedFormats: {
      ancestor: undefined,
      successor: undefined,
      cousins: [info.category === 'Images' ? 'JPG' : 'PDF', 'PNG', 'WEBP'].filter(e => e !== upper),
      comparisons: comparisons
    },

    conversions: conversions,

    fileIdentification: {
      magicBytesHex: info.magicBytesHex,
      magicBytesAscii: info.magicBytesHex.includes('(') ? info.magicBytesHex.split('(')[1].replace(')', '') : 'N/A',
      byteOffset: 0,
      dangerRating: info.dangerRating,
      dangerExplanation: info.dangerExplanation,
      spoofingWarning: `Always verify that the file's internal magic bytes (${info.magicBytesHex.slice(0, 16)}) match the .${clean} extension to prevent malicious executable spoofing.`
    },

    relevantTools: relevantTools,
    faqs: baseFaqs,

    seoMeta: {
      title: `What Is a ${upper} File? ${info.name}, Specs & How to Open | AnyFileX`,
      description: `Complete guide to .${upper} files (${info.name}). Learn MIME type ${info.mimeType}, magic bytes, compatibility on Windows/Mac, free converters, and software.`,
      canonical: `https://anyfilex.com/file-extensions/${clean}`,
      h1: `What Is a ${upper} File? Architecture, Specifications & How to Open`,
      keywords: [`what is a ${clean} file`, `${clean} file format`, `how to open ${clean}`, `${clean} specs`, `${clean} converter`]
    }
  };
}

/**
 * Returns all top prioritized format slugs for pre-rendering, sitemaps, and directory browsing.
 */
export function getPrioritizedFormatList(): string[] {
  return [
    'heic', 'heif', 'jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg', 'tiff', 'bmp',
    'pdf', 'docx', 'xlsx', 'pptx', 'csv', 'json', 'xml', 'epub',
    'zip', 'rar', '7z', 'tar', 'gz', 'dmg', 'iso', 'apk', 'jar',
    'mp4', 'mov', 'mkv', 'avi', 'wav', 'mp3', 'flac'
  ];
}
