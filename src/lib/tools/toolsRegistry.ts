import { AppRoute } from '../../types';
import { FormatKnowledgeNode, getFormatKnowledgeNode } from '../database/knowledgeGraph';

export type ToolCategory =
  | 'image'
  | 'document'
  | 'archive'
  | 'audio'
  | 'video'
  | 'data'
  | 'developer';

export interface ToolDefinition {
  slug: string;
  name: string;
  category: ToolCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  processingType: 'local' | 'server' | 'hybrid';
  supportedInputFormats: string[];
  supportedOutputFormats: string[];
  features: string[];
  steps: { title: string; desc: string }[];
  technicalDetails: string;
  faqs: { question: string; answer: string }[];
  isPopular?: boolean;
  badge?: string;
  relatedToolSlugs: string[];
  relatedExtensionSlugs: string[];
  comparisonSlugs?: string[];
  howToOpenSlugs?: string[];
}

export const TOOLS_REGISTRY: Record<string, ToolDefinition> = {
  'image-compressor': {
    slug: 'image-compressor',
    name: 'Browser-Based Image Compressor',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Compress JPG, PNG, WEBP & HEIC images locally in browser RAM without quality loss',
    description: 'Optimize and reduce image file sizes with interactive quality controls, percentage saved calculations, and before/after previews. 100% private in-browser compression.',
    processingType: 'local',
    supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'bmp', 'svg', 'gif'],
    supportedOutputFormats: ['jpg', 'png', 'webp'],
    isPopular: true,
    badge: 'Popular Image Tool',
    features: [
      'Interactive quality slider (1-100%) with instant visual preview',
      'Real-time before/after file size and percentage reduction metrics',
      'Batch compression with single download and multi-file ZIP export',
      '100% Client-Side — Photos never leave your device or upload to servers'
    ],
    steps: [
      { title: 'Upload Images', desc: 'Drag and drop your images (JPG, PNG, WEBP, HEIC) into the compressor zone.' },
      { title: 'Adjust Quality & Format', desc: 'Set your preferred compression level (e.g. 80% Web Standard) or change target format.' },
      { title: 'Download Compressed Output', desc: 'Download individual optimized files or save the entire batch as a ZIP archive.' }
    ],
    technicalDetails: 'Image compression executes client-side via HTML5 Canvas rasterization, discrete cosine transform quantization, and WebP lossy entropy encoding. Original pixel buffers are allocated strictly within browser WebAssembly and JavaScript heap memory and discarded when closed.',
    faqs: [
      {
        question: 'How much file size reduction can I expect?',
        answer: 'Typical reductions range from 40% to 75% for high-resolution camera photos and PNG screenshots, depending on the chosen quality setting (e.g., 80% standard) and original image complexity.'
      },
      {
        question: 'Are my private photos uploaded to external servers?',
        answer: 'No! The AnyFileX Image Compressor processes 100% of your image data inside your local browser memory. No files or byte chunks are ever transferred over the internet.'
      },
      {
        question: 'Can I compress multiple images at once?',
        answer: 'Yes! Batch compression is fully supported. You can drop multiple images or entire folders and download all compressed files individually or packaged in a single ZIP.'
      }
    ],
    relatedToolSlugs: ['image-resizer', 'heic-to-jpg', 'png-to-webp', 'webp-to-jpg', 'jpg-to-png', 'metadata-viewer'],
    relatedExtensionSlugs: ['jpg', 'png', 'webp', 'heic'],
    comparisonSlugs: ['png-vs-webp', 'heic-vs-jpg'],
    howToOpenSlugs: ['heic', 'webp']
  },

  'image-resizer': {
    slug: 'image-resizer',
    name: 'Precision Image Resizer',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Resize image dimensions in pixels or percentages with aspect ratio lock and batch export',
    description: 'Scale, crop, and resize images to exact width and height dimensions with aspect ratio constraints, preset scales, and format transcoding.',
    processingType: 'local',
    supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'bmp', 'svg'],
    supportedOutputFormats: ['jpg', 'png', 'webp'],
    isPopular: true,
    badge: 'Precision Sizing',
    features: [
      'Custom pixel dimensions (Width & Height) with Aspect Ratio Lock',
      'One-click percentage scaling presets (25%, 50%, 75%, 150%, 200%)',
      'Crop, Contain, and Exact-Stretch scaling modes',
      'Batch resizing and ZIP export in browser memory'
    ],
    steps: [
      { title: 'Add Images to Resize', desc: 'Drag and drop one or multiple image files into the resizing workspace.' },
      { title: 'Set Target Dimensions', desc: 'Input desired width/height or select a percentage scaling preset with locked ratio.' },
      { title: 'Export Resized Images', desc: 'Download resized images with clean, predictable filenames or as a bundled ZIP.' }
    ],
    technicalDetails: 'Image resizing uses HTML5 Canvas 2D image smoothing algorithms (bilinear and bicubic sub-pixel interpolation) to ensure crisp edges, text readability, and sharp downsampling without artifacts.',
    faqs: [
      {
        question: 'Will resizing distort my images?',
        answer: 'Not when the Aspect Ratio Lock is enabled. The tool automatically recalculates the corresponding height or width to prevent stretching.'
      },
      {
        question: 'Can I resize transparent PNG logos?',
        answer: 'Yes! PNG alpha transparency is fully preserved when exporting to PNG or WebP.'
      }
    ],
    relatedToolSlugs: ['image-compressor', 'heic-to-jpg', 'png-to-jpg', 'jpg-to-webp'],
    relatedExtensionSlugs: ['jpg', 'png', 'webp', 'svg'],
    comparisonSlugs: ['svg-vs-png', 'png-vs-webp'],
    howToOpenSlugs: ['png', 'jpg']
  },

  'heic-to-jpg': {
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Convert iPhone HEIC photos to standard JPG format locally in your browser',
    description: 'Convert Apple iOS iPhone HEIC/HEIF camera photos into universally compatible JPG images with zero file uploads and batch processing.',
    processingType: 'local',
    supportedInputFormats: ['heic', 'heif'],
    supportedOutputFormats: ['jpg', 'png'],
    isPopular: true,
    badge: 'Popular Converter',
    features: [
      'Native in-memory HEIC decoding via WebAssembly and Canvas',
      'Maintains full camera sensor resolution and color reproduction',
      'Batch queue conversion with instant multi-file download',
      'Complete privacy — Sensitive personal photos never touch cloud servers'
    ],
    steps: [
      { title: 'Drop iPhone Photos', desc: 'Upload .heic or .heif photos from your iPhone, iPad, or Mac.' },
      { title: 'In-Memory Decode', desc: 'The client-side engine decodes the High Efficiency Image Container in RAM.' },
      { title: 'Save JPG Output', desc: 'Download converted .jpg files immediately or bundle them in a ZIP archive.' }
    ],
    technicalDetails: 'Uses client-side libheif WebAssembly and HTML5 Canvas pipelines to parse ISO Base Media File Format (ISOBMFF) boxes with ftyp brands (mif1, heic) and re-encode to baseline JPEG.',
    faqs: [
      {
        question: 'Why can’t Windows PCs open HEIC files natively?',
        answer: 'HEIC is Apple’s proprietary default format. Windows PCs without paid codec extensions require converting HEIC photos to standard JPG.'
      },
      {
        question: 'Are my iPhone camera photos kept private?',
        answer: 'Yes. Processing occurs 100% inside your browser memory on your device.'
      }
    ],
    relatedToolSlugs: ['image-compressor', 'heic-to-png', 'image-resizer', 'metadata-viewer'],
    relatedExtensionSlugs: ['heic', 'jpg', 'png'],
    comparisonSlugs: ['heic-vs-jpg'],
    howToOpenSlugs: ['heic']
  },

  'webp-to-jpg': {
    slug: 'webp-to-jpg',
    name: 'WEBP to JPG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Convert modern WebP images to universally compatible standard JPG format',
    description: 'Transform downloaded Google WebP web images into standard JPG pictures compatible with all image editors, desktop viewers, and email clients.',
    processingType: 'local',
    supportedInputFormats: ['webp'],
    supportedOutputFormats: ['jpg', 'png'],
    isPopular: true,
    badge: 'Web Utility',
    features: [
      'Instant browser-level decoding with zero quality degradation',
      'Clean solid background fill for transparent web graphics',
      'Batch queue conversion and ZIP archive packaging',
      '100% Client-Side local processing'
    ],
    steps: [
      { title: 'Select WebP Files', desc: 'Drop saved .webp images into the converter dropzone.' },
      { title: 'Client-Side Decode', desc: 'Browser decodes WebP VP8 raster streams into JPEG pixels.' },
      { title: 'Download JPG Files', desc: 'Save converted .jpg photos directly to your computer.' }
    ],
    technicalDetails: 'Browser decodes RIFF WEBP containers directly into RGBA pixel buffers, composites onto background fill, and encodes to JPEG using native browser codecs.',
    faqs: [
      {
        question: 'Why convert WebP to JPG?',
        answer: 'Many desktop graphic programs (like older versions of Photoshop or Corel) and document systems cannot open WebP files directly.'
      }
    ],
    relatedToolSlugs: ['webp-to-png', 'jpg-to-webp', 'image-compressor', 'image-resizer'],
    relatedExtensionSlugs: ['webp', 'jpg', 'png'],
    comparisonSlugs: ['png-vs-webp'],
    howToOpenSlugs: ['webp']
  },

  'png-to-webp': {
    slug: 'png-to-webp',
    name: 'PNG to WEBP Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Optimize heavy PNG graphics into lightweight WebP format for fast web pages',
    description: 'Convert PNG graphics into modern Google WebP format with up to 80% file size reduction while keeping alpha transparency intact.',
    processingType: 'local',
    supportedInputFormats: ['png'],
    supportedOutputFormats: ['webp', 'jpg'],
    isPopular: true,
    badge: 'Web Optimizer',
    features: [
      'Preserves transparent background layers and sharp typography',
      'Reduces PNG storage footprint by 50% to 80%',
      'Batch queue processing with instant file downloads',
      'Zero server uploads'
    ],
    steps: [
      { title: 'Upload PNGs', desc: 'Select or drag .png screenshots, logos, or illustrations.' },
      { title: 'WebP Compression', desc: 'Client-side engine encodes WebP lossy or lossless streams.' },
      { title: 'Download WebP', desc: 'Save lightweight web-ready .webp assets.' }
    ],
    technicalDetails: 'Converts uncompressed PNG RGBA matrices into Google WebP format, taking advantage of spatial prediction and adaptive quantization.',
    faqs: [
      {
        question: 'Does WebP support transparency like PNG?',
        answer: 'Yes! WebP fully supports 8-bit alpha channels just like PNG, but at a fraction of the file size.'
      }
    ],
    relatedToolSlugs: ['image-compressor', 'png-to-jpg', 'webp-to-png', 'image-resizer'],
    relatedExtensionSlugs: ['png', 'webp', 'jpg'],
    comparisonSlugs: ['png-vs-webp'],
    howToOpenSlugs: ['png', 'webp']
  },

  'jpg-to-png': {
    slug: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Convert compressed JPG pictures to lossless PNG format for design & editing',
    description: 'Convert standard JPEG photos into lossless PNG container graphics ready for Photoshop, Figma, or desktop graphic editing.',
    processingType: 'local',
    supportedInputFormats: ['jpg', 'jpeg'],
    supportedOutputFormats: ['png', 'webp'],
    isPopular: true,
    badge: 'Image Utility',
    features: [
      'Lossless PNG container re-encoding',
      'Universal compatibility with graphic design software',
      'Batch multi-file conversion with ZIP packaging',
      '100% In-browser RAM processing'
    ],
    steps: [
      { title: 'Upload JPG Files', desc: 'Drag and drop your .jpg or .jpeg images.' },
      { title: 'In-Memory Conversion', desc: 'Browser translates JPEG image data into lossless PNG format.' },
      { title: 'Download PNGs', desc: 'Save your newly converted .png files.' }
    ],
    technicalDetails: 'Decodes JPEG baseline DCT streams to uncompressed raster bitmaps and applies Deflate compression within a PNG container.',
    faqs: [
      {
        question: 'Does JPG to PNG make the image higher resolution?',
        answer: 'It does not invent new pixel details from compression artifacts, but it prevents further compression loss during subsequent edits.'
      }
    ],
    relatedToolSlugs: ['png-to-jpg', 'image-compressor', 'jpg-to-webp', 'image-resizer'],
    relatedExtensionSlugs: ['jpg', 'png', 'webp'],
    comparisonSlugs: ['jpg-vs-jpeg', 'png-vs-webp'],
    howToOpenSlugs: ['jpg', 'png']
  },

  'png-to-jpg': {
    slug: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Convert heavy PNG graphics to compressed, web-ready JPG images',
    description: 'Convert screenshots and heavy PNG graphics into compressed JPG images with customizable solid background colors and quality sliders.',
    processingType: 'local',
    supportedInputFormats: ['png'],
    supportedOutputFormats: ['jpg', 'webp'],
    isPopular: true,
    badge: 'Web Optimizer',
    features: [
      'Reduces image file size by up to 70% for faster sharing and loading',
      'Solid background color fill for transparent PNG pixels',
      'Adjustable JPEG compression quality (1-100%)',
      'Multi-file batch conversion and ZIP archive export'
    ],
    steps: [
      { title: 'Select PNG Files', desc: 'Drag & drop .png screenshots or graphic files.' },
      { title: 'Set Quality & Background', desc: 'Optionally choose white or custom background fill.' },
      { title: 'Download JPGs', desc: 'Save optimized .jpg images individually or as a ZIP.' }
    ],
    technicalDetails: 'Blends PNG transparent alpha channels with solid matte background (default #FFFFFF) and encodes into JPEG discrete cosine transform matrices.',
    faqs: [
      {
        question: 'Why do transparent areas turn white in JPG?',
        answer: 'JPEG does not support alpha transparency, so transparent areas are filled with a clean solid background color.'
      }
    ],
    relatedToolSlugs: ['jpg-to-png', 'image-compressor', 'png-to-webp', 'image-resizer'],
    relatedExtensionSlugs: ['png', 'jpg'],
    comparisonSlugs: ['png-vs-webp'],
    howToOpenSlugs: ['png', 'jpg']
  },

  'webp-to-png': {
    slug: 'webp-to-png',
    name: 'WEBP to PNG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Convert Google WebP images to lossless PNG format with transparency preserved',
    description: 'Convert WebP graphics into high-resolution PNG format with 100% alpha transparency retained for editing in Photoshop, Illustrator, and desktop apps.',
    processingType: 'local',
    supportedInputFormats: ['webp'],
    supportedOutputFormats: ['png', 'jpg'],
    isPopular: true,
    badge: 'Lossless Tool',
    features: [
      'Preserves transparent alpha channels and sharp vector edges',
      'Desktop graphic design editor compatibility',
      'Fast client-side canvas rendering in browser memory',
      'Zero quality loss during PNG re-encoding'
    ],
    steps: [
      { title: 'Upload WebP Image', desc: 'Drop saved .webp images into the converter box.' },
      { title: 'Instant Render', desc: 'The browser decodes WebP frame data into lossless PNG format.' },
      { title: 'Save PNG File', desc: 'Download uncompressed .png image ready for editing.' }
    ],
    technicalDetails: 'Decodes WebP lossy or lossless VP8L chunk streams into full 32-bit RGBA arrays and generates standard PNG chunks (IHDR, IDAT, IEND).',
    faqs: [
      {
        question: 'Is transparency preserved when converting WebP to PNG?',
        answer: 'Yes! All transparent pixel layers and alpha gradients remain 100% intact.'
      }
    ],
    relatedToolSlugs: ['png-to-webp', 'webp-to-jpg', 'image-compressor'],
    relatedExtensionSlugs: ['webp', 'png'],
    comparisonSlugs: ['png-vs-webp'],
    howToOpenSlugs: ['webp', 'png']
  },

  'heic-to-png': {
    slug: 'heic-to-png',
    name: 'HEIC to PNG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Convert iPhone HEIC photos to lossless PNG format with transparent layer support',
    description: 'Extract pristine, uncompressed pixels from Apple iPhone HEIC/HEIF photos into lossless PNG format locally in browser memory.',
    processingType: 'local',
    supportedInputFormats: ['heic', 'heif'],
    supportedOutputFormats: ['png', 'jpg'],
    isPopular: true,
    badge: 'Photo Lossless',
    features: [
      '100% In-browser HEIC decoding via WebAssembly',
      'Lossless PNG container preserving fine texture details',
      'Batch queue conversion with instant multi-download',
      'Zero server upload — Complete data privacy'
    ],
    steps: [
      { title: 'Upload HEIC Photos', desc: 'Drop .heic or .heif files from iPhone or Mac.' },
      { title: 'Decode in RAM', desc: 'Transforms HEIC frames into uncompressed PNG pixels.' },
      { title: 'Download PNG', desc: 'Save pristine .png files.' }
    ],
    technicalDetails: 'Executes HEVC intra-frame pixel decompression in client-side WebAssembly memory and outputs uncompressed RGBA arrays to PNG canvas buffers.',
    faqs: [
      {
        question: 'Why convert HEIC to PNG instead of JPG?',
        answer: 'PNG uses lossless compression, preserving maximum detail without introducing JPEG compression artifacts.'
      }
    ],
    relatedToolSlugs: ['heic-to-jpg', 'image-compressor', 'image-resizer'],
    relatedExtensionSlugs: ['heic', 'png'],
    comparisonSlugs: ['heic-vs-jpg'],
    howToOpenSlugs: ['heic']
  },

  'svg-to-png': {
    slug: 'svg-to-png',
    name: 'SVG to PNG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Rasterize scalable vector SVG graphics into high-resolution PNG images',
    description: 'Convert XML vector SVG graphics to high-resolution PNG bitmaps with transparent backgrounds and customizable output pixel dimensions.',
    processingType: 'local',
    supportedInputFormats: ['svg'],
    supportedOutputFormats: ['png', 'jpg'],
    isPopular: true,
    badge: 'Vector Rasterizer',
    features: [
      'Scalable pixel density rasterization',
      'Preserves transparent vector background paths',
      'Batch multi-SVG conversion and ZIP export',
      '100% Client-side vector parsing'
    ],
    steps: [
      { title: 'Drop SVG File', desc: 'Upload .svg vector graphics.' },
      { title: 'Vector Render', desc: 'Canvas scales vector bezier curves into crisp bitmap pixels.' },
      { title: 'Save PNG', desc: 'Download high-res raster PNG.' }
    ],
    technicalDetails: 'Parses SVG XML DOM tree, renders vector paths onto an HTML5 Canvas at target scaling DPI, and serializes into PNG format.',
    faqs: [
      {
        question: 'Can I render SVGs at very high resolutions?',
        answer: 'Yes! Vector graphics scale infinitely without pixelation before being rendered into PNG.'
      }
    ],
    relatedToolSlugs: ['svg-to-jpg', 'png-to-webp', 'image-resizer'],
    relatedExtensionSlugs: ['svg', 'png'],
    comparisonSlugs: ['svg-vs-png'],
    howToOpenSlugs: ['svg', 'png']
  },

  'svg-to-jpg': {
    slug: 'svg-to-jpg',
    name: 'SVG to JPG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Convert XML vector SVG graphics to standard compressed JPG images',
    description: 'Rasterize SVG vector illustrations into standard JPEG images with customizable solid background colors.',
    processingType: 'local',
    supportedInputFormats: ['svg'],
    supportedOutputFormats: ['jpg', 'png'],
    isPopular: false,
    badge: 'Vector Tool',
    features: [
      'Vector to JPEG rasterization',
      'Custom solid background fill for transparent regions',
      'Batch conversion and download',
      'Zero server upload'
    ],
    steps: [
      { title: 'Drop SVG', desc: 'Upload .svg vector files.' },
      { title: 'Set Background', desc: 'Optionally choose white or custom background fill.' },
      { title: 'Download JPG', desc: 'Save converted .jpg graphic.' }
    ],
    technicalDetails: 'Renders vector paths onto a solid color canvas matte before outputting to standard JPEG.',
    faqs: [
      {
        question: 'Why does SVG to JPG add a white background?',
        answer: 'Because JPEG format does not support transparency, transparent vector paths are rendered over a clean white background.'
      }
    ],
    relatedToolSlugs: ['svg-to-png', 'image-compressor', 'jpg-to-png'],
    relatedExtensionSlugs: ['svg', 'jpg'],
    comparisonSlugs: ['svg-vs-png'],
    howToOpenSlugs: ['svg']
  },

  'jpg-to-webp': {
    slug: 'jpg-to-webp',
    name: 'JPG to WEBP Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    tagline: 'Convert standard JPG images to Google WebP format for 30%+ smaller file sizes',
    description: 'Optimize JPEG photographs into modern WebP format for faster web page speeds and reduced bandwidth usage.',
    processingType: 'local',
    supportedInputFormats: ['jpg', 'jpeg'],
    supportedOutputFormats: ['webp', 'png'],
    isPopular: true,
    badge: 'Web Optimizer',
    features: [
      'Next-generation WebP image compression',
      '25% to 35% smaller file size than JPEG at identical visual quality',
      'Multi-file batch conversion and ZIP bundling',
      '100% In-browser processing'
    ],
    steps: [
      { title: 'Select JPGs', desc: 'Drop .jpg or .jpeg images.' },
      { title: 'Encode WebP', desc: 'In-memory WebP quantization and compression.' },
      { title: 'Download', desc: 'Save lightweight web graphics.' }
    ],
    technicalDetails: 'Translates JPEG YCbCr macroblocks into WebP VP8 intra-coded frames with optimized prediction modes.',
    faqs: [
      {
        question: 'How much smaller is WebP compared to JPG?',
        answer: 'WebP is typically 25% to 35% smaller than JPEG at equivalent visual quality.'
      }
    ],
    relatedToolSlugs: ['image-compressor', 'webp-to-jpg', 'png-to-webp'],
    relatedExtensionSlugs: ['jpg', 'webp'],
    comparisonSlugs: ['png-vs-webp'],
    howToOpenSlugs: ['jpg', 'webp']
  },

  'pdf-to-jpg': {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG Page Converter',
    category: 'document',
    categoryLabel: 'Document Tools',
    tagline: 'Rasterize PDF document pages into high-resolution JPG images directly in your browser',
    description: 'Extract and convert PDF document pages into sharp, high-DPI JPEG images locally in browser RAM without software installation.',
    processingType: 'local',
    supportedInputFormats: ['pdf'],
    supportedOutputFormats: ['jpg', 'png'],
    isPopular: true,
    badge: 'Document Utility',
    features: [
      'Extracts and renders PDF pages into crisp high-resolution images',
      'High DPI page rendering (300 DPI clarity) for sharp text and diagrams',
      '100% Private — Sensitive contracts never touch external servers',
      'Batch page export with individual download and ZIP bundling'
    ],
    steps: [
      { title: 'Upload PDF Document', desc: 'Drop your .pdf document into the converter queue.' },
      { title: 'Page Processing', desc: 'PDF.js and HTML5 Canvas render PDF page streams into high-res images.' },
      { title: 'Download Page JPGs', desc: 'Download individual page images or all pages in one bundle.' }
    ],
    technicalDetails: 'Uses PDF.js to interpret PostScript/PDF font dictionaries and vector streams, rendering them at 2x viewport density onto HTML5 Canvas.',
    faqs: [
      {
        question: 'Is it safe to convert confidential PDF contracts here?',
        answer: 'Absolutely! Our PDF converter processes document pages entirely inside your local browser memory. No document data is ever sent over the internet.'
      },
      {
        question: 'What resolution are the exported JPG pages?',
        answer: 'Pages are rendered at high display density (2x scale / 150-300 DPI) to ensure fine text, signatures, and diagrams remain razor sharp.'
      }
    ],
    relatedToolSlugs: ['pdf-to-png', 'docx-to-pdf', 'image-compressor', 'metadata-viewer'],
    relatedExtensionSlugs: ['pdf', 'jpg', 'png'],
    comparisonSlugs: ['pdf-vs-docx', 'epub-vs-pdf'],
    howToOpenSlugs: ['pdf']
  },

  'pdf-to-png': {
    slug: 'pdf-to-png',
    name: 'PDF to PNG Page Converter',
    category: 'document',
    categoryLabel: 'Document Tools',
    tagline: 'Render PDF document pages into high-resolution lossless PNG image files',
    description: 'Convert PDF document pages into lossless PNG graphics with sharp text, vector curves, and uncompressed quality.',
    processingType: 'local',
    supportedInputFormats: ['pdf'],
    supportedOutputFormats: ['png', 'jpg'],
    isPopular: true,
    badge: 'Document Lossless',
    features: [
      'Lossless page rasterization with crystal clear typography',
      'High-DPI rendering for presentation decks and blueprints',
      '100% Client-side local execution in browser memory',
      'Multi-page batch extraction and ZIP export'
    ],
    steps: [
      { title: 'Upload PDF', desc: 'Drop .pdf files to process.' },
      { title: 'Render Pages', desc: 'Canvas generates high-DPI lossless page images.' },
      { title: 'Download PNGs', desc: 'Save page image files.' }
    ],
    technicalDetails: 'Executes client-side PDF document parsing and writes raster outputs directly into lossless PNG binary streams.',
    faqs: [
      {
        question: 'Can I extract all pages as PNG at once?',
        answer: 'Yes! You can download all extracted page images individually or download the complete set as a ZIP file.'
      }
    ],
    relatedToolSlugs: ['pdf-to-jpg', 'docx-to-pdf', 'metadata-viewer'],
    relatedExtensionSlugs: ['pdf', 'png'],
    comparisonSlugs: ['pdf-vs-docx'],
    howToOpenSlugs: ['pdf']
  },

  'docx-to-pdf': {
    slug: 'docx-to-pdf',
    name: 'DOCX to PDF Document Converter',
    category: 'document',
    categoryLabel: 'Document Tools',
    tagline: 'Convert Microsoft Word .docx documents to universal PDF format in browser RAM',
    description: 'Convert Microsoft Word documents (.docx) to universal PDF format directly inside browser memory without uploading to cloud servers.',
    processingType: 'local',
    supportedInputFormats: ['docx'],
    supportedOutputFormats: ['pdf'],
    isPopular: true,
    badge: 'Word to PDF',
    features: [
      'Word OpenXML to PDF conversion in browser RAM',
      '100% Private local processing — Sensitive resumes and business letters remain confidential',
      'Standard A4 document typography and pagination',
      'Instant download with zero cloud wait queues'
    ],
    steps: [
      { title: 'Upload DOCX', desc: 'Select or drop .docx Word documents.' },
      { title: 'Local Render', desc: 'Processes document structure and typography into PDF format.' },
      { title: 'Download PDF', desc: 'Save PDF document file.' }
    ],
    technicalDetails: 'Parses DOCX PKZIP XML packages (word/document.xml, word/styles.xml) client-side using Mammoth.js and compiles into PDF vector streams via jsPDF.',
    faqs: [
      {
        question: 'Is my Word document confidential?',
        answer: 'Yes! Your document never leaves your device and is processed entirely in browser memory.'
      }
    ],
    relatedToolSlugs: ['pptx-to-pdf', 'pdf-to-jpg', 'pdf-to-png', 'metadata-viewer'],
    relatedExtensionSlugs: ['docx', 'pdf'],
    comparisonSlugs: ['pdf-vs-docx', 'doc-vs-docx'],
    howToOpenSlugs: ['docx', 'pdf']
  },

  'pptx-to-pdf': {
    slug: 'pptx-to-pdf',
    name: 'PPTX to PDF Presentation Converter',
    category: 'document',
    categoryLabel: 'Document Tools',
    tagline: 'Convert PowerPoint .pptx presentations into portable PDF slide decks in your browser',
    description: 'Convert Microsoft PowerPoint presentations (.pptx) into portable PDF slide decks directly in your browser without software installation.',
    processingType: 'local',
    supportedInputFormats: ['pptx'],
    supportedOutputFormats: ['pdf'],
    isPopular: true,
    badge: 'PowerPoint Tool',
    features: [
      'PowerPoint slide text and layout extraction in browser RAM',
      'Landscape slide layout formatting for presentations',
      'Zero server uploads — 100% Client-side privacy',
      'Instant slide deck export'
    ],
    steps: [
      { title: 'Upload PPTX', desc: 'Select or drop .pptx presentation files.' },
      { title: 'Slide Processing', desc: 'JSZip & XML parser extracts slides and text layout.' },
      { title: 'Download PDF', desc: 'Save formatted PDF slide deck.' }
    ],
    technicalDetails: 'Inspects PPTX PKZIP containers, sorts slide XML files (ppt/slides/slide*.xml), extracts text paragraphs, and generates landscape A4 presentation PDF pages via jsPDF.',
    faqs: [
      {
        question: 'Can I convert PowerPoint slides on Mac or Chromebook without Office?',
        answer: 'Yes! Works instantly in any modern web browser on Mac, Windows, Chromebook, iOS, and Android.'
      }
    ],
    relatedToolSlugs: ['docx-to-pdf', 'pdf-to-jpg', 'zip-extractor'],
    relatedExtensionSlugs: ['pptx', 'pdf'],
    comparisonSlugs: ['pdf-vs-docx'],
    howToOpenSlugs: ['pptx', 'pdf']
  },

  'zip-creator': {
    slug: 'zip-creator',
    name: 'Online ZIP Archive Creator',
    category: 'archive',
    categoryLabel: 'Archive Tools',
    tagline: 'Bundle multiple files and directories into a compressed .zip file in browser memory',
    description: 'Create compressed .zip archives from multiple files or folder hierarchies directly in browser memory with zero file size limits.',
    processingType: 'local',
    supportedInputFormats: ['*'],
    supportedOutputFormats: ['zip'],
    isPopular: true,
    badge: 'Archive Tool',
    features: [
      'Full folder hierarchy and directory tree preservation',
      'Deflate & Store compression algorithms in browser RAM',
      '100% Client-side archiving — Unlimited file count',
      'Instant ZIP packaging and download'
    ],
    steps: [
      { title: 'Add Files or Folders', desc: 'Drop files or select directory folders to compress.' },
      { title: 'Configure Archive', desc: 'Set archive filename and compression settings.' },
      { title: 'Download ZIP', desc: 'Save compressed .zip file.' }
    ],
    technicalDetails: 'Constructs PKZIP archive structures (Local File Headers, Central Directory Headers, and End of Central Directory Record) in RAM using JSZip.',
    faqs: [
      {
        question: 'Is there a file count limit for ZIP creation?',
        answer: 'No limit! You can bundle as many files and folders as your system RAM allows.'
      }
    ],
    relatedToolSlugs: ['zip-extractor', 'image-compressor', 'checksum-verifier'],
    relatedExtensionSlugs: ['zip', 'rar', '7z'],
    comparisonSlugs: ['zip-vs-rar', '7z-vs-zip'],
    howToOpenSlugs: ['zip']
  },

  'zip-extractor': {
    slug: 'zip-extractor',
    name: 'Online ZIP Extractor & Archive Inspector',
    category: 'archive',
    categoryLabel: 'Archive Tools',
    tagline: 'Unpack, inspect file trees, preview photos/text, and extract files safely in your browser',
    description: 'Inspect file trees, view file sizes, preview images and code, and safely extract files from .zip archives online without software.',
    processingType: 'local',
    supportedInputFormats: ['zip', 'docx', 'xlsx', 'pptx', 'apk', 'jar'],
    supportedOutputFormats: ['*'],
    isPopular: true,
    badge: 'Archive Inspector',
    features: [
      'Interactive archive file directory tree',
      'Path traversal security protection against malicious zip slip files',
      'Instant in-browser photo and text file previewing',
      'Extract individual files or unpack all items'
    ],
    steps: [
      { title: 'Upload .ZIP', desc: 'Drop .zip file to inspect.' },
      { title: 'Browse & Preview', desc: 'View folder structure and preview file contents.' },
      { title: 'Extract Files', desc: 'Download individual files or all extracted items.' }
    ],
    technicalDetails: 'Parses ZIP Central Directory headers with strict sanitization preventing path traversal (`../`) and decompression bomb resource exhaustion.',
    faqs: [
      {
        question: 'Do I need WinZip or 7-Zip installed?',
        answer: 'No! AnyFileX inspects and extracts ZIP files directly inside your browser.'
      },
      {
        question: 'Is it safe against zip slip path traversal vulnerabilities?',
        answer: 'Yes! All file paths are strictly sanitized to prevent directory escaping.'
      }
    ],
    relatedToolSlugs: ['zip-creator', 'file-analyzer', 'checksum-verifier'],
    relatedExtensionSlugs: ['zip', 'rar', '7z', 'tar.gz'],
    comparisonSlugs: ['zip-vs-rar', '7z-vs-zip'],
    howToOpenSlugs: ['zip', 'rar']
  },

  'file-identifier': {
    slug: 'file-identifier',
    name: 'File Intelligence Engine & Deep Diagnostic',
    category: 'developer',
    categoryLabel: 'Developer & Security Tools',
    tagline: 'Inspect binary headers, detect extension mismatches, calculate entropy, and extract deep metadata',
    description: 'Advanced file diagnostic tool analyzing magic bytes, true binary signatures, container markers, Shannon entropy, SHA-256 hashes, and embedded metadata in browser memory.',
    processingType: 'local',
    supportedInputFormats: ['*'],
    supportedOutputFormats: ['json', 'txt'],
    isPopular: true,
    badge: 'Core Intelligence Engine',
    features: [
      'Multi-stage magic byte signature detection (200+ signatures)',
      'Extension spoof and mismatch detection',
      'Shannon entropy scoring and macro security auditing',
      'Raw hexadecimal dump inspector with ASCII gutter mapping'
    ],
    steps: [
      { title: 'Drop Any File', desc: 'Select or drag any digital file of any format or size.' },
      { title: 'Binary Diagnostics', desc: 'Engine inspects magic bytes, MIME types, entropy, and metadata.' },
      { title: 'Explore Intelligence Report', desc: 'View complete OS compatibility matrix, hex viewer, and repair advice.' }
    ],
    technicalDetails: 'Performs non-destructive ArrayBuffer slicing, byte offset matching, container parsing (PKZIP, ISOBMFF, RIFF), and crypto hash calculation in Web Workers and RAM.',
    faqs: [
      {
        question: 'What is extension mismatch detection?',
        answer: 'It verifies whether a file’s real internal binary format matches its filename extension, flagging disguised executables or misnamed documents.'
      }
    ],
    relatedToolSlugs: ['magic-byte-detector', 'metadata-viewer', 'hash-generator', 'checksum-verifier'],
    relatedExtensionSlugs: ['exe', 'zip', 'pdf', 'heic'],
    comparisonSlugs: ['jpg-vs-jpeg', 'zip-vs-rar'],
    howToOpenSlugs: ['dat', 'bin']
  },

  'file-analyzer': {
    slug: 'file-identifier',
    name: 'File Intelligence Engine & Deep Diagnostic',
    category: 'developer',
    categoryLabel: 'Developer & Security Tools',
    tagline: 'Inspect binary headers, detect extension mismatches, calculate entropy, and extract deep metadata',
    description: 'Advanced file diagnostic tool analyzing magic bytes, true binary signatures, container markers, Shannon entropy, SHA-256 hashes, and embedded metadata in browser memory.',
    processingType: 'local',
    supportedInputFormats: ['*'],
    supportedOutputFormats: ['json', 'txt'],
    isPopular: true,
    badge: 'Core Intelligence Engine',
    features: [
      'Multi-stage magic byte signature detection (200+ signatures)',
      'Extension spoof and mismatch detection',
      'Shannon entropy scoring and macro security auditing',
      'Raw hexadecimal dump inspector with ASCII gutter mapping'
    ],
    steps: [
      { title: 'Drop Any File', desc: 'Select or drag any digital file of any format or size.' },
      { title: 'Binary Diagnostics', desc: 'Engine inspects magic bytes, MIME types, entropy, and metadata.' },
      { title: 'Explore Intelligence Report', desc: 'View complete OS compatibility matrix, hex viewer, and repair advice.' }
    ],
    technicalDetails: 'Performs non-destructive ArrayBuffer slicing, byte offset matching, container parsing (PKZIP, ISOBMFF, RIFF), and crypto hash calculation in Web Workers and RAM.',
    faqs: [
      {
        question: 'What is extension mismatch detection?',
        answer: 'It verifies whether a file’s real internal binary format matches its filename extension, flagging disguised executables or misnamed documents.'
      }
    ],
    relatedToolSlugs: ['magic-byte-detector', 'metadata-viewer', 'hash-generator', 'checksum-verifier'],
    relatedExtensionSlugs: ['exe', 'zip', 'pdf', 'heic'],
    comparisonSlugs: ['jpg-vs-jpeg', 'zip-vs-rar'],
    howToOpenSlugs: ['dat', 'bin']
  },

  'metadata-viewer': {
    slug: 'metadata-viewer',
    name: 'Metadata & EXIF Inspector',
    category: 'data',
    categoryLabel: 'Data & Privacy Tools',
    tagline: 'Extract embedded camera EXIF, audio ID3 tags, PDF author properties, and video codec details',
    description: 'Inspect embedded camera EXIF tags, GPS locations, lens specs, color profiles, and document author details privately in browser RAM.',
    processingType: 'local',
    supportedInputFormats: ['jpg', 'jpeg', 'png', 'heic', 'webp', 'pdf', 'mp3', 'mp4'],
    supportedOutputFormats: ['json', 'txt'],
    isPopular: true,
    badge: 'Privacy Inspector',
    features: [
      'Camera EXIF & GPS location introspection',
      'PDF author, title, creation date, and software metadata',
      'Audio ID3 artist, album, bitrate, and sample rate inspector',
      'Zero server upload — 100% Client-side privacy'
    ],
    steps: [
      { title: 'Upload File', desc: 'Drop photos, documents, or media files.' },
      { title: 'Extract Metadata', desc: 'Parser inspects TIFF/EXIF IFD0 and XMP markers in RAM.' },
      { title: 'View & Export', desc: 'Inspect properties table or copy JSON metadata.' }
    ],
    technicalDetails: 'Scans file buffers for APP1 EXIF markers, IPTC datasets, and XMP XML packets using client-side binary stream parsing.',
    faqs: [
      {
        question: 'Can I see GPS coordinates where a photo was taken?',
        answer: 'Yes! If the camera recorded GPS EXIF tags, coordinates and altitude will be extracted and displayed.'
      }
    ],
    relatedToolSlugs: ['remove-metadata', 'file-analyzer', 'image-compressor'],
    relatedExtensionSlugs: ['jpg', 'heic', 'pdf'],
    comparisonSlugs: ['heic-vs-jpg'],
    howToOpenSlugs: ['heic', 'jpg']
  },

  'remove-metadata': {
    slug: 'remove-metadata',
    name: 'Metadata Cleaner & Privacy Stripper',
    category: 'data',
    categoryLabel: 'Data & Privacy Tools',
    tagline: 'Scrub sensitive GPS coordinates, device serial numbers, and creator metadata before sharing online',
    description: 'Strip embedded EXIF markers, GPS coordinates, device serial numbers, and creator metadata from photos and documents before posting online.',
    processingType: 'local',
    supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
    supportedOutputFormats: ['jpg', 'png', 'webp'],
    isPopular: true,
    badge: 'Privacy Safe',
    features: [
      'Removes GPS location tags, camera serial numbers, and device data',
      'Strips XMP and IPTC creator properties',
      'Preserves original pixel resolution and visual quality',
      '100% Client-side scrubbing in browser memory'
    ],
    steps: [
      { title: 'Select Photos', desc: 'Drag and drop image files containing private metadata.' },
      { title: 'Strip Metadata', desc: 'Canvas sanitizes metadata headers while preserving pixels.' },
      { title: 'Download Cleaned Photos', desc: 'Download sanitized photos safe for public sharing.' }
    ],
    technicalDetails: 'Re-encodes image pixel buffers into clean JPEG/PNG binary containers without copying APP1 EXIF or XMP metadata chunks.',
    faqs: [
      {
        question: 'Does stripping metadata reduce photo quality?',
        answer: 'No! Visual pixel dimensions and quality settings remain high while only hidden metadata tags are removed.'
      }
    ],
    relatedToolSlugs: ['metadata-viewer', 'image-compressor', 'file-analyzer'],
    relatedExtensionSlugs: ['jpg', 'png', 'heic'],
    comparisonSlugs: ['heic-vs-jpg'],
    howToOpenSlugs: ['jpg']
  },

  'hash-generator': {
    slug: 'hash-generator',
    name: 'Cryptographic Hash Generator',
    category: 'developer',
    categoryLabel: 'Developer & Security Tools',
    tagline: 'Calculate instant SHA-256, SHA-512, MD5, and SHA-1 cryptographic hashes for files and text',
    description: 'Compute cryptographic hashes (SHA-256, SHA-512, SHA-384, SHA-1, MD5) for files or text strings using native Web Crypto API in browser memory.',
    processingType: 'local',
    supportedInputFormats: ['*'],
    supportedOutputFormats: ['txt'],
    isPopular: true,
    badge: 'Security Utility',
    features: [
      'Web Crypto API hardware-accelerated SHA-256 / SHA-512 calculation',
      'Supports files of any size with chunked ArrayBuffer hashing',
      'One-click hash copying and verification format export',
      '100% Client-side calculation'
    ],
    steps: [
      { title: 'Upload File or Text', desc: 'Drop any file or enter a text string to hash.' },
      { title: 'Instant Hash', desc: 'Web Crypto API computes cryptographic digest in RAM.' },
      { title: 'Copy Hash', desc: 'Copy SHA-256 or SHA-512 hexadecimal string.' }
    ],
    technicalDetails: 'Uses `window.crypto.subtle.digest` for NIST-certified SHA algorithms and WebAssembly MD5 algorithms.',
    faqs: [
      {
        question: 'Are large files supported for hashing?',
        answer: 'Yes! Files are hashed in memory chunks with zero upload requirements.'
      }
    ],
    relatedToolSlugs: ['checksum-verifier', 'file-analyzer', 'magic-byte-detector'],
    relatedExtensionSlugs: ['iso', 'zip', 'exe'],
    comparisonSlugs: ['zip-vs-rar'],
    howToOpenSlugs: ['iso', 'bin']
  },

  'checksum-verifier': {
    slug: 'checksum-verifier',
    name: 'Checksum File Integrity Verifier',
    category: 'developer',
    categoryLabel: 'Developer & Security Tools',
    tagline: 'Compare calculated file hashes with expected publisher checksums to detect file corruption or tampering',
    description: 'Verify file integrity by comparing computed SHA-256 or MD5 hashes against expected publisher checksums to ensure files are not corrupted or tampered with.',
    processingType: 'local',
    supportedInputFormats: ['*'],
    supportedOutputFormats: ['txt'],
    isPopular: false,
    badge: 'Integrity Matcher',
    features: [
      'Real-time hash comparison and mismatch alert',
      'Detects partial download corruption and file modifications',
      'Supports SHA-256, SHA-512, and MD5 hashes',
      '100% In-browser verification'
    ],
    steps: [
      { title: 'Select File', desc: 'Drop downloaded installer, ISO, or archive file.' },
      { title: 'Paste Expected Checksum', desc: 'Paste the publisher SHA-256 or MD5 hash.' },
      { title: 'Verify Match', desc: 'Get immediate confirmation if hashes match 100%.' }
    ],
    technicalDetails: 'Computes cryptographic digest using Web Crypto API and performs constant-time string comparison against user input.',
    faqs: [
      {
        question: 'Why should I verify file checksums?',
        answer: 'To ensure a downloaded file was not corrupted during transfer or modified by an attacker.'
      }
    ],
    relatedToolSlugs: ['hash-generator', 'file-analyzer', 'zip-extractor'],
    relatedExtensionSlugs: ['iso', 'zip', 'exe'],
    comparisonSlugs: ['iso-vs-dmg'],
    howToOpenSlugs: ['iso']
  },

  'mime-checker': {
    slug: 'mime-checker',
    name: 'MIME Type & Content-Type Checker',
    category: 'data',
    categoryLabel: 'Data & Standards Tools',
    tagline: 'Lookup IANA Content-Type media standards, RFC specifications, and HTTP response header rules',
    description: 'Search and inspect IANA media types, RFC standards, common file extension associations, and HTTP header rules.',
    processingType: 'local',
    supportedInputFormats: ['*'],
    supportedOutputFormats: ['txt', 'json'],
    isPopular: false,
    badge: 'Web Standard',
    features: [
      'Search 500+ official IANA MIME types and RFC definitions',
      'HTTP Content-Type and Content-Disposition headers guide',
      'Extension to MIME mapping database',
      'Instant search and filter'
    ],
    steps: [
      { title: 'Search MIME or Extension', desc: 'Type an extension or MIME type (e.g. image/webp, pdf, docx).' },
      { title: 'Inspect Technical Specs', desc: 'Review RFC number, canonical extension, and HTTP header syntax.' }
    ],
    technicalDetails: 'Indexed database of IANA media types with standard RFC cross-references.',
    faqs: [
      {
        question: 'What is a MIME type?',
        answer: 'A Multipurpose Internet Mail Extension (MIME) type describes the media format of a file or byte stream sent across the web.'
      }
    ],
    relatedToolSlugs: ['magic-byte-detector', 'file-analyzer'],
    relatedExtensionSlugs: ['heic', 'webp', 'pdf', 'mp4'],
    comparisonSlugs: ['jpg-vs-jpeg'],
    howToOpenSlugs: ['heic', 'webp']
  },

  'magic-byte-detector': {
    slug: 'magic-byte-detector',
    name: 'Magic Byte Signature Detector',
    category: 'developer',
    categoryLabel: 'Developer & Security Tools',
    tagline: 'Analyze binary offset bytes, hexadecimal signatures, and detect spoofed file extensions',
    description: 'Inspect the initial header bytes of any file to identify its true binary magic signature and detect spoofed file extensions.',
    processingType: 'local',
    supportedInputFormats: ['*'],
    supportedOutputFormats: ['hex', 'txt'],
    isPopular: false,
    badge: 'Binary Sniffer',
    features: [
      'Inspects offset 0-64 raw binary bytes in hex and ASCII',
      'Matches signatures against 200+ standardized format headers',
      'Detects extension mismatches and disguised executables',
      '100% In-browser RAM inspection'
    ],
    steps: [
      { title: 'Drop File', desc: 'Drop any file to inspect initial header bytes.' },
      { title: 'Inspect Magic Bytes', desc: 'View hex signature and matched file format specification.' }
    ],
    technicalDetails: 'Reads the first 64 bytes using FileReader ArrayBuffer slicing and converts bytes to hexadecimal representation for pattern matching.',
    faqs: [
      {
        question: 'What are magic bytes?',
        answer: 'Magic bytes are specific byte sequences located at the beginning of a file that uniquely identify its file format regardless of its extension.'
      }
    ],
    relatedToolSlugs: ['file-analyzer', 'hash-generator', 'metadata-viewer'],
    relatedExtensionSlugs: ['exe', 'zip', 'pdf', 'png'],
    comparisonSlugs: ['jpg-vs-jpeg'],
    howToOpenSlugs: ['dat', 'bin']
  }
};

export const TOOL_CATEGORIES: { id: ToolCategory; label: string; description: string }[] = [
  { id: 'image', label: 'Image Tools', description: 'Compress, resize, convert, and inspect image formats locally in browser RAM.' },
  { id: 'document', label: 'Document Tools', description: 'Convert PDF pages, Word DOCX, and PowerPoint PPTX documents securely.' },
  { id: 'archive', label: 'Archive Tools', description: 'Create ZIP archives, inspect archive contents, and extract files with path traversal security.' },
  { id: 'data', label: 'Data & Privacy', description: 'Inspect and clean EXIF metadata, lookup MIME standards, and format data.' },
  { id: 'developer', label: 'Developer & Security', description: 'Magic byte signature detection, SHA-256/MD5 hashing, checksum verification, and binary diagnostics.' },
  { id: 'audio', label: 'Audio Tools', description: 'Audio format inspection and local browser converters.' },
  { id: 'video', label: 'Video Tools', description: 'Video container inspection and conversion paths.' }
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  const norm = slug.toLowerCase().trim();
  return TOOLS_REGISTRY[norm];
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return Object.values(TOOLS_REGISTRY).filter((t) => t.category === category);
}

export function getAllTools(): ToolDefinition[] {
  return Object.values(TOOLS_REGISTRY);
}
