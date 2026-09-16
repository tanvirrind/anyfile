import { ConverterPair, FormatInfo, FileCategory } from './types';

export const FORMATS_REGISTRY: Record<string, FormatInfo> = {
  heic: {
    ext: 'heic',
    name: 'High Efficiency Image Container',
    category: 'Image',
    mimeTypes: ['image/heic', 'image/heif'],
    description: 'Apple High Efficiency Image Format storing compressed photo data with high visual fidelity and half the file size of standard JPEG.',
    commonUses: ['iPhone Camera Photos', 'iPad Snapshots', 'Apple Live Photos'],
    developer: 'MPEG Group / Apple Inc.'
  },
  jpg: {
    ext: 'jpg',
    name: 'Joint Photographic Experts Group',
    category: 'Image',
    mimeTypes: ['image/jpeg', 'image/jpg'],
    description: 'Universal lossy compressed image format supported natively by every browser, operating system, camera, and device worldwide.',
    commonUses: ['Web Publishing', 'Digital Photography', 'Email Attachments', 'Social Media'],
    developer: 'Joint Photographic Experts Group'
  },
  jpeg: {
    ext: 'jpeg',
    name: 'Joint Photographic Experts Group',
    category: 'Image',
    mimeTypes: ['image/jpeg'],
    description: 'Standard photographic file format utilizing discrete cosine transform compression for optimal web distribution.',
    commonUses: ['Web Images', 'Digital Photography', 'Email Graphics'],
    developer: 'Joint Photographic Experts Group'
  },
  png: {
    ext: 'png',
    name: 'Portable Network Graphics',
    category: 'Image',
    mimeTypes: ['image/png'],
    description: 'Lossless raster graphics format supporting full alpha channel transparency, crisp text rendering, and sharp UI screenshots.',
    commonUses: ['UI Screenshots', 'Logos with Transparency', 'Web Graphics', 'Icons'],
    developer: 'PNG Development Group / W3C'
  },
  webp: {
    ext: 'webp',
    name: 'WebP Modern Image Format',
    category: 'Image',
    mimeTypes: ['image/webp'],
    description: 'Modern web image format developed by Google providing superior lossy and lossless compression for web pages.',
    commonUses: ['Web Page Optimization', 'E-commerce Catalogs', 'Mobile Web Assets'],
    developer: 'Google LLC'
  },
  pdf: {
    ext: 'pdf',
    name: 'Portable Document Format',
    category: 'Document',
    mimeTypes: ['application/pdf'],
    description: 'Universal multi-page document format capturing layout, fonts, graphics, and vector shapes consistently across devices.',
    commonUses: ['Business Contracts', 'Digital Invoices', 'E-Books', 'Print Layouts'],
    developer: 'Adobe Systems'
  },
  svg: {
    ext: 'svg',
    name: 'Scalable Vector Graphics',
    category: 'Vector',
    mimeTypes: ['image/svg+xml'],
    description: 'XML-based vector graphic format that scales infinitely to any screen resolution without loss of clarity or pixelation.',
    commonUses: ['Website Logos', 'UI Icons', 'Vector Illustrations', 'Infographics'],
    developer: 'World Wide Web Consortium (W3C)'
  },
  gif: {
    ext: 'gif',
    name: 'Graphics Interchange Format',
    category: 'Image',
    mimeTypes: ['image/gif'],
    description: 'Bitmap image format supporting 256 indexed colors and multi-frame loop animations for short silent clip sharing.',
    commonUses: ['Meme Animations', 'UI Loading Animations', 'Social Media Reactions'],
    developer: 'CompuServe'
  },
  bmp: {
    ext: 'bmp',
    name: 'Bitmap Image File',
    category: 'Image',
    mimeTypes: ['image/bmp'],
    description: 'Uncompressed raw raster graphic file format storing pixel color data directly in uncompressed Windows memory structures.',
    commonUses: ['Legacy Windows Graphics', 'Raw Pixel Displays', 'System Screenshots'],
    developer: 'Microsoft Corporation'
  },
  tiff: {
    ext: 'tiff',
    name: 'Tagged Image File Format',
    category: 'Image',
    mimeTypes: ['image/tiff'],
    description: 'High-quality uncompressed or losslessly compressed raster format favored by professional photographers, scanners, and print publishing.',
    commonUses: ['High-Res Photo Scans', 'Print Pre-press', 'Archival Images'],
    developer: 'Aldus / Adobe Systems'
  },
  avif: {
    ext: 'avif',
    name: 'AV1 Image File Format',
    category: 'Image',
    mimeTypes: ['image/avif'],
    description: 'Next-generation image format based on AV1 video keyframes, delivering exceptional compression efficiency and 10-bit color.',
    commonUses: ['High-Performance Web Images', 'HDR Photography'],
    developer: 'Alliance for Open Media (AOMedia)'
  },
  docx: {
    ext: 'docx',
    name: 'Microsoft Word OpenXML Document',
    category: 'Document',
    mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    description: 'Standard editable word processing document format composed of XML structure, styles, tables, and embedded media.',
    commonUses: ['Reports', 'Essays', 'Resumes', 'Business Letters'],
    developer: 'Microsoft Corporation'
  },
  xlsx: {
    ext: 'xlsx',
    name: 'Microsoft Excel OpenXML Spreadsheet',
    category: 'Spreadsheet',
    mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    description: 'XML-based spreadsheet document storing tabular data, mathematical formulas, charts, and pivot tables.',
    commonUses: ['Financial Models', 'Data Budgets', 'Inventory Tracking'],
    developer: 'Microsoft Corporation'
  },
  pptx: {
    ext: 'pptx',
    name: 'Microsoft PowerPoint Presentation',
    category: 'Presentation',
    mimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    description: 'Slide deck presentation format containing text slides, embedded graphics, transition animations, and speaker notes.',
    commonUses: ['Business Pitch Decks', 'Lecture Slides', 'Conference Talks'],
    developer: 'Microsoft Corporation'
  },
  txt: {
    ext: 'txt',
    name: 'Plain Text Document',
    category: 'Document',
    mimeTypes: ['text/plain'],
    description: 'Unformatted plain text document composed of standard UTF-8 or ASCII characters compatible with any editor.',
    commonUses: ['Code Snippets', 'Configuration Files', 'Plain Notes', 'System Logs'],
    developer: 'Standard Text Specification'
  },
  mp3: {
    ext: 'mp3',
    name: 'MPEG-1 Audio Layer III',
    category: 'Audio',
    mimeTypes: ['audio/mpeg', 'audio/mp3'],
    description: 'Universal compressed digital audio format utilizing psychoacoustic masking to reduce audio file size while maintaining fidelity.',
    commonUses: ['Music Streaming', 'Podcasts', 'Audiobooks', 'Ringtones'],
    developer: 'Fraunhofer IIS / Motion Picture Experts Group'
  },
  wav: {
    ext: 'wav',
    name: 'Waveform Audio File Format',
    category: 'Audio',
    mimeTypes: ['audio/wav', 'audio/x-wav'],
    description: 'Uncompressed raw LPCM digital audio format capturing pristine studio-quality audio waveforms.',
    commonUses: ['Studio Recording', 'Audio Editing', 'Sound Effects', 'Mastering'],
    developer: 'Microsoft & IBM'
  },
  mp4: {
    ext: 'mp4',
    name: 'MPEG-4 Part 14 Video Container',
    category: 'Video',
    mimeTypes: ['video/mp4'],
    description: 'Universal multimedia container format storing H.264/H.265 video streams and AAC audio compatible with all web browsers.',
    commonUses: ['Web Video', 'Streaming Platforms', 'Smartphone Video Clips'],
    developer: 'MPEG'
  },
  zip: {
    ext: 'zip',
    name: 'ZIP Compressed Archive',
    category: 'Archive',
    mimeTypes: ['application/zip'],
    description: 'Standard lossless file archive format combining multiple files and directories into a single compressed package.',
    commonUses: ['File Distribution', 'Email Attachment Bundles', 'Software Packages'],
    developer: 'PKWARE / Phil Katz'
  },
  epub: {
    ext: 'epub',
    name: 'Electronic Publication',
    category: 'Ebook',
    mimeTypes: ['application/epub+zip'],
    description: 'Reflowable electronic book format based on HTML5 and CSS for ereaders, iPads, and mobile devices.',
    commonUses: ['Digital Books', 'E-Readers', 'Interactive Publications'],
    developer: 'International Digital Publishing Forum (IDPF)'
  }
};

// Custom definitions for primary highlighted converters
export const POPULAR_CONVERTER_PAIRS: ConverterPair[] = [
  {
    id: 'heic-to-jpg',
    fromExt: 'heic',
    toExt: 'jpg',
    name: 'HEIC to JPG Converter',
    category: 'Image',
    description: 'Convert iPhone and iPad HEIC camera photos to standard, universally compatible JPG images directly in your browser without uploading.',
    isPopular: true,
    badge: 'Popular Photo Tool',
    features: [
      '100% In-Browser Conversion — Files stay on your device',
      'Batch processing for multiple iPhone HEIC photos',
      'Maintains maximum image resolution & color vibrance',
      'Instant download with zero waiting queues'
    ],
    steps: [
      { title: 'Upload HEIC Photos', desc: 'Drag and drop your .heic or .heif iPhone files into the upload box.' },
      { title: 'In-Browser Processing', desc: 'Our WebAssembly engine decodes HEIC pixel structures instantly in RAM.' },
      { title: 'Download JPG Images', desc: 'Click Download to save your converted .jpg files immediately.' }
    ],
    faqs: [
      {
        question: 'Why can’t Windows or web apps open my HEIC files?',
        answer: 'HEIC (High Efficiency Image Container) is Apple’s default camera format introduced in iOS 11. Most Windows PCs, web browsers, and online upload forms require standard JPG or PNG images.'
      },
      {
        question: 'Are my iPhone photos uploaded to any server?',
        answer: 'No! OpenAnyFile converts your HEIC files 100% locally inside your web browser memory. Your personal photos are never transferred over the network.'
      },
      {
        question: 'Does converting HEIC to JPG reduce photo quality?',
        answer: 'Our converter extracts the maximum pixel quality from your HEIC image and encodes it into high-quality JPEG (92% quality setting), preserving fine details and colors.'
      }
    ],
    fromFormat: FORMATS_REGISTRY.heic,
    toFormat: FORMATS_REGISTRY.jpg
  },
  {
    id: 'png-to-jpg',
    fromExt: 'png',
    toExt: 'jpg',
    name: 'PNG to JPG Converter',
    category: 'Image',
    description: 'Convert transparent or heavy PNG graphics to compressed, web-ready JPG images with custom background fill and quality controls.',
    isPopular: true,
    badge: 'Web Optimizer',
    features: [
      'Reduces image file size by up to 70% for faster website loading',
      'Customizable background fill color for transparent PNG pixels',
      'Adjustable JPEG compression quality slider (1-100%)',
      'Batch queue conversion with instant multi-download'
    ],
    steps: [
      { title: 'Select PNG Graphics', desc: 'Drag and drop .png files or select them from your computer.' },
      { title: 'Adjust Settings', desc: 'Optionally set background color (default white) and JPEG quality.' },
      { title: 'Download JPGs', desc: 'Save your optimized .jpg files individually or all at once.' }
    ],
    faqs: [
      {
        question: 'What happens to transparent pixels when converting PNG to JPG?',
        answer: 'Because JPEG does not support transparency, transparent background areas are automatically filled with clean solid white (or a background color of your choice).'
      },
      {
        question: 'Why should I convert PNG to JPG?',
        answer: 'PNG files are often 3x to 5x larger than JPGs. Converting screenshots and non-transparent photos to JPG significantly saves storage space and speeds up website loading.'
      }
    ],
    fromFormat: FORMATS_REGISTRY.png,
    toFormat: FORMATS_REGISTRY.jpg
  },
  {
    id: 'webp-to-png',
    fromExt: 'webp',
    toExt: 'png',
    name: 'WEBP to PNG Converter',
    category: 'Image',
    description: 'Convert modern Google WebP web images to high-resolution PNG format with full alpha channel transparency preserved.',
    isPopular: true,
    badge: 'Lossless Tool',
    features: [
      'Preserves transparent alpha channels and sharp vector edges',
      'Makes downloaded web images compatible with Photoshop and desktop editors',
      'Fast client-side canvas rendering in browser memory',
      'Zero quality loss during PNG re-encoding'
    ],
    steps: [
      { title: 'Upload WebP File', desc: 'Drop saved .webp images into the converter box.' },
      { title: 'Instant Render', desc: 'The browser decodes WebP frame data into lossless PNG format.' },
      { title: 'Save PNG File', desc: 'Download your uncompressed .png image ready for editing.' }
    ],
    faqs: [
      {
        question: 'Why do images saved from Google or websites save as .webp?',
        answer: 'Modern websites use WebP to load faster. However, many older image editors, graphic design tools, and desktop applications still do not support opening WebP files.'
      },
      {
        question: 'Will alpha channel transparency be preserved?',
        answer: 'Yes! Converting WebP to PNG keeps 100% of the original transparent background pixels intact.'
      }
    ],
    fromFormat: FORMATS_REGISTRY.webp,
    toFormat: FORMATS_REGISTRY.png
  },
  {
    id: 'pdf-to-jpg',
    fromExt: 'pdf',
    toExt: 'jpg',
    name: 'PDF to JPG Page Converter',
    category: 'Document',
    description: 'Extract and rasterize PDF pages into crisp high-resolution JPEG images directly in your browser without software installation.',
    isPopular: true,
    badge: 'Document Utility',
    features: [
      'Converts PDF pages into standalone JPG photo files',
      'High DPI page rendering for sharp text and clear graphics',
      '100% Private — Sensitive business PDFs never touch external servers',
      'Batch page export with individual download buttons'
    ],
    steps: [
      { title: 'Upload PDF Document', desc: 'Drop your .pdf document into the converter queue.' },
      { title: 'Page Processing', desc: 'HTML5 Canvas renders PDF page streams into high-res images.' },
      { title: 'Download Page JPGs', desc: 'Download individual page images or all pages in one bundle.' }
    ],
    faqs: [
      {
        question: 'Is it safe to convert confidential PDF contracts here?',
        answer: 'Absolutely! Our PDF converter processes document pages entirely inside your local browser memory using JavaScript and Web APIs. No document data is ever sent over the internet.'
      },
      {
        question: 'What resolution are the exported JPG pages?',
        answer: 'Pages are rendered at high display density (2x scale / 150-300 DPI) to ensure fine text, signatures, and diagrams remain razor sharp.'
      }
    ],
    fromFormat: FORMATS_REGISTRY.pdf,
    toFormat: FORMATS_REGISTRY.jpg
  },
  {
    id: 'jpg-to-png',
    fromExt: 'jpg',
    toExt: 'png',
    name: 'JPG to PNG Converter',
    category: 'Image',
    description: 'Convert compressed JPG images into uncompressed PNG graphics for editing, design software, or transparency layering.',
    isPopular: true,
    fromFormat: FORMATS_REGISTRY.jpg,
    toFormat: FORMATS_REGISTRY.png,
    features: ['Lossless PNG container', 'Editing software compatibility', 'Browser memory processing'],
    steps: [
      { title: 'Upload JPG', desc: 'Drop your .jpg files into the box.' },
      { title: 'Render PNG', desc: 'Browser converts JPEG matrix into PNG lossless pixels.' },
      { title: 'Download', desc: 'Save converted .png image.' }
    ],
    faqs: [
      { question: 'Does JPG to PNG add transparency?', answer: 'No, converting a JPG to PNG wraps the existing pixels in a lossless PNG container, but does not remove existing background colors automatically.' }
    ]
  },
  {
    id: 'png-to-webp',
    fromExt: 'png',
    toExt: 'webp',
    name: 'PNG to WEBP Converter',
    category: 'Image',
    description: 'Optimize heavy PNG graphics into lightweight WebP format for fast web page performance and smaller storage.',
    isPopular: true,
    fromFormat: FORMATS_REGISTRY.png,
    toFormat: FORMATS_REGISTRY.webp,
    features: ['Up to 80% file size reduction', 'Preserves transparency', 'Web speed optimization'],
    steps: [
      { title: 'Select PNGs', desc: 'Drop .png files to convert.' },
      { title: 'Encode WebP', desc: 'Modern WebP encoding runs instantly.' },
      { title: 'Download WebP', desc: 'Download lightweight web-ready files.' }
    ],
    faqs: [
      { question: 'Is WebP supported on all browsers?', answer: 'Yes! All modern browsers including Chrome, Safari, Edge, Firefox, and iOS/Android support WebP natively.' }
    ]
  },
  {
    id: 'svg-to-png',
    fromExt: 'svg',
    toExt: 'png',
    name: 'SVG to PNG Converter',
    category: 'Vector',
    description: 'Rasterize scalable vector SVG files into high-resolution PNG image graphics with transparent backgrounds.',
    isPopular: true,
    fromFormat: FORMATS_REGISTRY.svg,
    toFormat: FORMATS_REGISTRY.png,
    features: ['Scalable pixel density', 'Transparent background retention', 'Vector rasterization'],
    steps: [
      { title: 'Drop SVG File', desc: 'Upload .svg vector graphics.' },
      { title: 'Vector Render', desc: 'Canvas scales vector curves into bitmap pixels.' },
      { title: 'Save PNG', desc: 'Download high-res raster PNG.' }
    ],
    faqs: [
      { question: 'Can I set custom dimensions for SVG to PNG?', answer: 'Yes! Vector graphics scale cleanly to any pixel dimension.' }
    ]
  },
  {
    id: 'heic-to-png',
    fromExt: 'heic',
    toExt: 'png',
    name: 'HEIC to PNG Converter',
    category: 'Image',
    description: 'Convert iPhone HEIC photos into lossless PNG format directly in browser RAM with transparent layer support.',
    isPopular: true,
    badge: 'Photo Lossless',
    fromFormat: FORMATS_REGISTRY.heic,
    toFormat: FORMATS_REGISTRY.png,
    features: ['In-browser HEIC decoding', 'Lossless PNG container', 'Preserves iPhone photo metadata'],
    steps: [
      { title: 'Upload HEIC', desc: 'Select or drag .heic photos.' },
      { title: 'Decode RAM', desc: 'Transforms HEIC vectors to PNG pixels.' },
      { title: 'Download', desc: 'Save pristine .png image.' }
    ],
    faqs: [
      { question: 'Why convert HEIC to PNG instead of JPG?', answer: 'PNG uses lossless compression, preserving maximum detail without introducing compression artifacts.' }
    ]
  },
  {
    id: 'jpg-to-webp',
    fromExt: 'jpg',
    toExt: 'webp',
    name: 'JPG to WEBP Converter',
    category: 'Image',
    description: 'Convert standard JPG images to Google WebP format for 30%+ smaller file sizes and faster website loading.',
    isPopular: true,
    badge: 'Web Optimizer',
    fromFormat: FORMATS_REGISTRY.jpg,
    toFormat: FORMATS_REGISTRY.webp,
    features: ['Next-gen image compression', '30% smaller file size', 'Browser memory processing'],
    steps: [
      { title: 'Select JPGs', desc: 'Drop .jpg or .jpeg images.' },
      { title: 'Encode WebP', desc: 'In-memory WebP quantization.' },
      { title: 'Download', desc: 'Save lightweight web graphics.' }
    ],
    faqs: [
      { question: 'How much space does WebP save over JPG?', answer: 'WebP provides 25% to 35% smaller file sizes than JPEG at equivalent quality.' }
    ]
  },
  {
    id: 'svg-to-jpg',
    fromExt: 'svg',
    toExt: 'jpg',
    name: 'SVG to JPG Converter',
    category: 'Vector',
    description: 'Convert XML vector SVG graphics to standard compressed JPG images with customizable solid background colors.',
    isPopular: true,
    fromFormat: FORMATS_REGISTRY.svg,
    toFormat: FORMATS_REGISTRY.jpg,
    features: ['Vector to JPEG rasterization', 'Custom background fill', 'Batch processing'],
    steps: [
      { title: 'Drop SVG', desc: 'Upload .svg vector files.' },
      { title: 'Set Background', desc: 'Optionally choose white or custom background fill.' },
      { title: 'Download JPG', desc: 'Save converted .jpg graphic.' }
    ],
    faqs: [
      { question: 'Why does SVG to JPG add a white background?', answer: 'Because JPEG does not support transparency, transparent vector regions are filled with a clean background.' }
    ]
  },
  {
    id: 'pdf-to-png',
    fromExt: 'pdf',
    toExt: 'png',
    name: 'PDF to PNG Page Converter',
    category: 'Document',
    description: 'Render PDF document pages into high-resolution lossless PNG image files.',
    isPopular: true,
    badge: 'Document Utility',
    fromFormat: FORMATS_REGISTRY.pdf,
    toFormat: FORMATS_REGISTRY.png,
    features: ['Lossless page rasterization', 'Sharp typography and lines', 'Zero server upload'],
    steps: [
      { title: 'Upload PDF', desc: 'Drop .pdf files to process.' },
      { title: 'Render Pages', desc: 'Canvas generates high-DPI page images.' },
      { title: 'Download PNGs', desc: 'Save page image files.' }
    ],
    faqs: [
      { question: 'Can I extract individual PDF pages as PNG?', answer: 'Yes, each page is rasterized into a high-res PNG file for individual or batch downloading.' }
    ]
  },
  {
    id: 'docx-to-pdf',
    fromExt: 'docx',
    toExt: 'pdf',
    name: 'DOCX to PDF Document Converter',
    category: 'Document',
    description: 'Convert Microsoft Word .docx documents to universal PDF format directly inside browser memory.',
    isPopular: true,
    badge: 'Word to PDF',
    fromFormat: FORMATS_REGISTRY.docx,
    toFormat: FORMATS_REGISTRY.pdf,
    features: ['Word to PDF conversion', '100% Private local processing', 'Preserves document layout'],
    steps: [
      { title: 'Upload DOCX', desc: 'Select or drop .docx Word documents.' },
      { title: 'Local Render', desc: 'Processes document structure into PDF.' },
      { title: 'Download PDF', desc: 'Save PDF document file.' }
    ],
    faqs: [
      { question: 'Is my Word document safe?', answer: 'Yes! Your document never leaves your device and is processed entirely in browser memory.' }
    ]
  },
  {
    id: 'pptx-to-pdf',
    fromExt: 'pptx',
    toExt: 'pdf',
    name: 'PPTX to PDF Presentation Converter',
    category: 'Document',
    description: 'Convert Microsoft PowerPoint .pptx presentations into portable PDF slide decks directly in your browser.',
    isPopular: true,
    badge: 'PowerPoint Tool',
    fromFormat: FORMATS_REGISTRY.pptx,
    toFormat: FORMATS_REGISTRY.pdf,
    features: ['PowerPoint slide extraction', 'Landscape slide layout formatting', 'Zero server upload'],
    steps: [
      { title: 'Upload PPTX', desc: 'Select or drop .pptx presentation files.' },
      { title: 'Slide Processing', desc: 'JSZip & XML parser extracts slides and text layout.' },
      { title: 'Download PDF', desc: 'Save formatted PDF slide deck.' }
    ],
    faqs: [
      { question: 'Can I convert PowerPoint slides to PDF on Mac or Windows?', answer: 'Yes! Works instantly in any modern web browser on Mac, Windows, Chromebook, iOS, and Android.' }
    ]
  },
  {
    id: 'zip-creator',
    fromExt: 'files',
    toExt: 'zip',
    name: 'Online ZIP Archive Creator',
    category: 'Archive',
    description: 'Bundle multiple files and directories into a single compressed .zip file directly in browser memory.',
    isPopular: true,
    badge: 'Archive Tool',
    fromFormat: FORMATS_REGISTRY.zip,
    toFormat: FORMATS_REGISTRY.zip,
    features: ['Folder structure support', 'Deflate & Store compression methods', '100% Client-side archiving'],
    steps: [
      { title: 'Add Files/Folders', desc: 'Drop files or select folders to compress.' },
      { title: 'Configure Archive', desc: 'Set archive filename and compression settings.' },
      { title: 'Download ZIP', desc: 'Save compressed .zip file.' }
    ],
    faqs: [
      { question: 'Is there a file count limit for ZIP creation?', answer: 'No limit! You can bundle as many files and folders as your system RAM allows.' }
    ]
  },
  {
    id: 'zip-extractor',
    fromExt: 'zip',
    toExt: 'extract',
    name: 'Online ZIP Extractor & Inspector',
    category: 'Archive',
    description: 'Unpack, view file tree, preview text and photos, and extract files from .zip archives online without software.',
    isPopular: true,
    badge: 'Archive Tool',
    fromFormat: FORMATS_REGISTRY.zip,
    toFormat: FORMATS_REGISTRY.zip,
    features: ['Interactive archive file tree', 'Instant photo and code preview', 'Extract individual or all files'],
    steps: [
      { title: 'Upload .ZIP', desc: 'Drop .zip file to inspect.' },
      { title: 'Browse & Preview', desc: 'View folder structure and preview file contents.' },
      { title: 'Extract Files', desc: 'Download individual files or all extracted items.' }
    ],
    faqs: [
      { question: 'Do I need WinZip or 7-Zip installed?', answer: 'No! OpenAnyFile inspects and extracts ZIP files directly inside your browser.' }
    ]
  },
  {
    id: 'rar-extractor',
    fromExt: 'rar',
    toExt: 'extract',
    name: 'Online RAR Extractor & Inspector',
    category: 'Archive',
    description: 'Extract and view files inside Roshal Archive (.rar) files online without installing WinRAR.',
    isPopular: true,
    badge: 'Archive Tool',
    fromFormat: FORMATS_REGISTRY.zip, // archive format
    toFormat: FORMATS_REGISTRY.zip,
    features: ['In-browser RAR header parsing', 'Preview archived file text', 'Instant extraction'],
    steps: [
      { title: 'Upload .RAR', desc: 'Select or drop .rar file.' },
      { title: 'Inspect Archive', desc: 'Engine parses RAR block stream.' },
      { title: 'Extract Files', desc: 'Download extracted files.' }
    ],
    faqs: [
      { question: 'Can I extract RAR files on Mac or iPhone without WinRAR?', answer: 'Yes! OpenAnyFile unpacks RAR files in browser memory on Mac, iOS, Android, and Windows.' }
    ]
  }
];

/**
 * Dynamic Converter Slug Resolver
 * Parses any slug formatted like "{from}-to-{to}" (e.g. "heic-to-jpg" or "cr2-to-png" or "docx-to-pdf")
 * and returns or constructs a fully functional ConverterPair object!
 */
export function resolveConverterPair(slug: string): ConverterPair {
  const normalizedSlug = slug.toLowerCase().trim();

  // 1. Check if matching predefined popular pair
  const found = POPULAR_CONVERTER_PAIRS.find((p) => p.id === normalizedSlug);
  if (found) {
    return found;
  }

  // 2. Parse from-to slug pattern e.g. "heic-to-jpg" or "bmp-to-png"
  const match = normalizedSlug.match(/^([a-z0-9]+)-to-([a-z0-9]+)$/);
  if (match) {
    const [, fromExt, toExt] = match;

    const fromFormat: FormatInfo = FORMATS_REGISTRY[fromExt] || {
      ext: fromExt,
      name: `${fromExt.toUpperCase()} File`,
      category: 'Image',
      mimeTypes: [`application/x-${fromExt}`],
      description: `Data format with extension .${fromExt}.`,
      commonUses: ['Digital Files', 'Storage'],
    };

    const toFormat: FormatInfo = FORMATS_REGISTRY[toExt] || {
      ext: toExt,
      name: `${toExt.toUpperCase()} File`,
      category: 'Image',
      mimeTypes: [`application/x-${toExt}`],
      description: `Target file format with extension .${toExt}.`,
      commonUses: ['Export Files', 'Digital Distribution'],
    };

    const fromUpper = fromExt.toUpperCase();
    const toUpper = toExt.toUpperCase();

    return {
      id: normalizedSlug,
      fromExt,
      toExt,
      name: `${fromUpper} to ${toUpper} Converter`,
      category: fromFormat.category || 'Image',
      description: `Free, fast, private online tool to convert .${fromExt} files to .${toExt} format directly inside your browser memory.`,
      isPopular: false,
      badge: `${fromUpper} → ${toUpper}`,
      features: [
        `100% Browser In-Memory Processing for .${fromExt} to .${toExt}`,
        'Zero file uploads — Complete data privacy',
        'Batch queue processing with instant file downloads',
        'Cross-platform compatibility across Windows, Mac, iOS & Android'
      ],
      steps: [
        {
          title: `Upload .${fromExt} File`,
          desc: `Drag & drop your .${fromExt} file into the converter upload area.`
        },
        {
          title: 'In-Browser Conversion',
          desc: `Our client-side engine parses .${fromExt} data and encodes it into .${toExt} format in RAM.`
        },
        {
          title: `Download .${toExt}`,
          desc: `Click download to save your newly converted .${toExt} file instantly.`
        }
      ],
      faqs: [
        {
          question: `How do I convert .${fromExt} to .${toExt} online for free?`,
          answer: `Drag and drop your .${fromExt} file into the upload box above, select any optional format settings, and click Download to save your converted .${toExt} file.`
        },
        {
          question: `Are my .${fromExt} files uploaded to any external server?`,
          answer: `No. All file conversion and byte transformations execute 100% locally within your browser using JavaScript and Web APIs.`
        }
      ],
      fromFormat,
      toFormat
    };
  }

  // 3. Fallback default pair if slug format is completely unrecognized
  return POPULAR_CONVERTER_PAIRS[0]; // HEIC to JPG default
}

/**
 * Get list of all available / featured converter pairs for directory listing
 */
export function getAllConverterPairs(): ConverterPair[] {
  return POPULAR_CONVERTER_PAIRS;
}
