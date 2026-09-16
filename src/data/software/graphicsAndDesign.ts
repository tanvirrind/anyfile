import { SoftwareInfo } from '../../types';

export const GRAPHICS_AND_DESIGN_SOFTWARE: SoftwareInfo[] = [
  {
    id: 'adobe-photoshop',
    name: 'Adobe Photoshop',
    developer: 'Adobe Inc.',
    category: 'Graphics & Design',
    description: 'The industry-standard raster graphics editor for photo editing, digital art, and graphic design.',
    longDescription: 'Adobe Photoshop is the world’s leading digital image editing software used by photographers, graphic designers, and digital artists. It offers comprehensive layer editing, vector mask tools, generative AI fill, smart object compositing, and advanced color grading.',
    supportedOS: ['windows', 'mac', 'ios'],
    priceType: 'Paid',
    priceText: '$22.99 / month',
    websiteUrl: 'https://adobe.com/products/photoshop.html',
    downloadUrl: 'https://adobe.com/products/photoshop.html',
    supportedExtensions: ['PSD', 'PSB', 'TIFF', 'PNG', 'JPG', 'WEBP', 'HEIC', 'RAW', 'CR3', 'NEF', 'AI', 'EPS', 'GIF', 'BMP', 'SVG'],
    rating: 4.8,
    reviewCount: 48200,
    features: [
      'Multi-layer composition with masks and smart filters',
      'Generative AI expanding canvas & object removal',
      'Non-destructive RAW photo camera processing',
      'Advanced typography & 3D text styling',
      'Export presets for web, print, and mobile'
    ],
    alternatives: [
      { name: 'Photopea', slug: 'photopea', description: 'Free web browser Photoshop alternative with full PSD layer support.' },
      { name: 'GIMP', slug: 'gimp', description: 'Open source desktop raster editor for Windows, Mac, and Linux.' },
      { name: 'Affinity Photo 2', slug: 'affinity-photo', description: 'One-time purchase professional photo editing suite.' }
    ],
    tutorials: [
      { title: 'How to Open and Edit PSD Files in Photoshop', description: 'Learn how to open, unlock layers, and modify PSB/PSD files in Photoshop.', readTime: '5 min' },
      { title: 'Exporting High-Resolution PNG and JPGs', description: 'Step-by-step guide to exporting optimized web graphics with transparency.', readTime: '4 min' }
    ],
    frequentlyOpenedTypes: [
      { extension: 'PSD', name: 'Photoshop Document', description: 'Default multi-layer raster document file.' },
      { extension: 'PSB', name: 'Photoshop Large Document', description: 'Large format Photoshop file for images exceeding 300,000 pixels.' },
      { extension: 'TIFF', name: 'Tagged Image File Format', description: 'Uncompressed high-quality raster image format.' }
    ]
  },
  {
    id: 'adobe-illustrator',
    name: 'Adobe Illustrator',
    developer: 'Adobe Inc.',
    category: 'Graphics & Design',
    description: 'Industry-standard vector graphics software for creating logos, icons, drawings, and complex illustrations.',
    longDescription: 'Adobe Illustrator is the premier vector graphics editor used by logo designers, illustrators, and branding professionals. It creates scalable resolution-independent artwork using vector paths, Bezier curves, and typography controls.',
    supportedOS: ['windows', 'mac', 'ios'],
    priceType: 'Paid',
    priceText: '$22.99 / month',
    websiteUrl: 'https://adobe.com/products/illustrator.html',
    downloadUrl: 'https://adobe.com/products/illustrator.html',
    supportedExtensions: ['AI', 'EPS', 'SVG', 'PDF', 'DXF', 'DWG', 'PNG', 'JPG', 'AIT'],
    rating: 4.8,
    reviewCount: 42100,
    features: [
      'Vector Bezier curve and pen drawing toolsets',
      'Precision typography and kerning management',
      'Generative vector AI tool for pattern generation',
      'CMYK and Pantone color swatches for commercial print'
    ],
    alternatives: [
      { name: 'Inkscape', slug: 'inkscape', description: 'Free open source SVG vector editor.' },
      { name: 'Affinity Designer', slug: 'affinity-designer', description: 'Fast professional vector design suite.' },
      { name: 'CorelDRAW', slug: 'coreldraw', description: 'Vector graphics and page layout software.' }
    ],
    tutorials: [
      { title: 'Opening AI Files Without Illustrator', description: 'How to preview AI vector graphics using PDF readers and Inkscape.', readTime: '4 min' }
    ]
  },
  {
    id: 'adobe-indesign',
    name: 'Adobe InDesign',
    developer: 'Adobe Inc.',
    category: 'Graphics & Design',
    description: 'Page design and desktop publishing software for creating printed books, magazines, brochures, and digital PDFs.',
    longDescription: 'Adobe InDesign is the publishing industry standard layout application for digital and print media. Design multi-page books, magazines, interactive PDFs, ePub books, and corporate annual reports with master page templates.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$22.99 / month',
    websiteUrl: 'https://adobe.com/products/indesign.html',
    downloadUrl: 'https://adobe.com/products/indesign.html',
    supportedExtensions: ['INDD', 'IDML', 'INX', 'INDT', 'PDF', 'EPUB'],
    rating: 4.7,
    reviewCount: 29800,
    features: [
      'Master page templates and multi-column grid layouts',
      'Paragraph and character typography stylesheet presets',
      'EPUB and interactive PDF publishing workflow',
      'Preflight verification for print house CMYK output'
    ],
    alternatives: [
      { name: 'Scribus', slug: 'scribus', description: 'Free open-source desktop publishing software.' },
      { name: 'Affinity Publisher', slug: 'affinity-publisher', description: 'Professional layout application without subscription.' }
    ]
  },
  {
    id: 'gimp',
    name: 'GIMP Image Editor',
    developer: 'GIMP Team',
    category: 'Graphics & Design',
    description: 'Free open source raster image editor for photo retouching, image composition, and artwork.',
    longDescription: 'GIMP (GNU Image Manipulation Program) is a cross-platform image editor available for GNU/Linux, macOS, Windows and more operating systems. It is free software providing tools for high-quality image manipulation.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://gimp.org',
    downloadUrl: 'https://gimp.org/downloads/',
    supportedExtensions: ['XCF', 'PSD', 'PNG', 'JPG', 'WEBP', 'HEIC', 'TIFF', 'GIF', 'BMP', 'SVG'],
    rating: 4.6,
    reviewCount: 34000,
    features: [
      'Full layer channel and path mask management',
      'Extensible with Python and Scheme Script-Fu plugins',
      'Color management with GEGL high-precision processing',
      'Customizable brush engine and digitizer tablet support'
    ],
    alternatives: [
      { name: 'Krita', slug: 'krita', description: 'Free digital painting suite.' },
      { name: 'Photopea', slug: 'photopea', description: 'Online browser-based graphics editor.' },
      { name: 'Paint.NET', slug: 'paint-net', description: 'Lightweight image editing software for Windows.' }
    ]
  },
  {
    id: 'krita',
    name: 'Krita Digital Painting',
    developer: 'Krita Foundation',
    category: 'Graphics & Design',
    description: 'Free open-source digital painting suite designed for concept artists, illustrators, and matte painters.',
    longDescription: 'Krita is a professional free and open source painting program. It is made by artists that want to see affordable art tools for everyone. Concept art, texture and matte painters, illustrations and comics.',
    supportedOS: ['windows', 'mac', 'linux', 'android'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://krita.org',
    downloadUrl: 'https://krita.org/download/krita-desktop/',
    supportedExtensions: ['KRA', 'ORA', 'PSD', 'PNG', 'JPG', 'TIFF', 'EXR', 'CBZ'],
    rating: 4.8,
    reviewCount: 27500,
    features: [
      'Over 100 professionally crafted painting brushes',
      'Brush stabilizers and drawing assistants for line art',
      'Frame-by-frame 2D raster animation timeline',
      'Seamless texture wrap-around drawing mode'
    ],
    alternatives: [
      { name: 'Procreate', slug: 'procreate', description: 'Popular digital painting app for iPad.' },
      { name: 'Clip Studio Paint', slug: 'clip-studio-paint', description: 'Pro illustration and comic creation software.' }
    ]
  },
  {
    id: 'paint-net',
    name: 'Paint.NET',
    developer: 'dotPDN LLC',
    category: 'Graphics & Design',
    description: 'Fast, lightweight image and photo editing software for Windows with full layer support.',
    longDescription: 'Paint.NET is free image and photo editing software for PCs that run Windows. It features an intuitive and innovative user interface with support for layers, unlimited undo, special effects, and a wide variety of useful plugins.',
    supportedOS: ['windows'],
    priceType: 'Free',
    priceText: 'Free Desktop Application',
    websiteUrl: 'https://getpaint.net',
    downloadUrl: 'https://getpaint.net/download.html',
    supportedExtensions: ['PDN', 'PNG', 'JPG', 'BMP', 'GIF', 'TIFF', 'WEBP', 'DDS', 'HEIC'],
    rating: 4.7,
    reviewCount: 31000,
    features: [
      'Layered editing with blending modes',
      'Lightning fast GPU hardware accelerated rendering',
      'Vast third-party plugin ecosystem',
      'Unlimited history undo and redo buffer'
    ],
    alternatives: [
      { name: 'GIMP', slug: 'gimp', description: 'Advanced open source raster image editor.' },
      { name: 'Photopea', slug: 'photopea', description: 'Browser-based online Photoshop clone.' }
    ]
  },
  {
    id: 'affinity-photo',
    name: 'Affinity Photo 2',
    developer: 'Serif Ltd.',
    category: 'Graphics & Design',
    description: 'Award-winning professional photo editor with no subscription required.',
    longDescription: 'Affinity Photo 2 is a full-featured photo editing software that offers seamless raw file editing, HDR merge, focus stacking, panorama stitching, batch processing, and live filter layers.',
    supportedOS: ['windows', 'mac', 'ios'],
    priceType: 'Paid',
    priceText: '$69.99 one-time payment',
    websiteUrl: 'https://affinity.serif.com/photo/',
    downloadUrl: 'https://affinity.serif.com/photo/download/',
    supportedExtensions: ['AFPHOTO', 'PSD', 'PNG', 'JPG', 'TIFF', 'RAW', 'EXR', 'SVG', 'PDF'],
    rating: 4.8,
    reviewCount: 18400,
    features: [
      'Real-time non-destructive adjustments and live filter layers',
      '32-bit HDR merge and focus stacking algorithms',
      'Complete PSD import/export with vector smart objects',
      'One-time license cost with zero monthly subscriptions'
    ],
    alternatives: [
      { name: 'Adobe Photoshop', slug: 'adobe-photoshop', description: 'Subscription-based raster editor.' },
      { name: 'GIMP', slug: 'gimp', description: 'Free open source alternative.' }
    ]
  },
  {
    id: 'affinity-designer',
    name: 'Affinity Designer 2',
    developer: 'Serif Ltd.',
    category: 'Graphics & Design',
    description: 'Fast, smooth, and precise vector graphic design software for concept art, logos, and UI layout.',
    longDescription: 'Affinity Designer 2 combines vector graphics and raster painting tools in a single fluid application. Create UI graphics, brand identities, typography, and marketing materials with 1000,000% zoom capability.',
    supportedOS: ['windows', 'mac', 'ios'],
    priceType: 'Paid',
    priceText: '$69.99 one-time payment',
    websiteUrl: 'https://affinity.serif.com/designer/',
    downloadUrl: 'https://affinity.serif.com/designer/download/',
    supportedExtensions: ['AFDESIGN', 'AI', 'EPS', 'SVG', 'PDF', 'PSD', 'PNG', 'JPG'],
    rating: 4.8,
    reviewCount: 16200,
    features: [
      'Seamless switching between vector and raster personas',
      '1,000,000%+ zoom precision for detailed vector drafting',
      'Non-destructive boolean vector shape operations'
    ],
    alternatives: [
      { name: 'Adobe Illustrator', slug: 'adobe-illustrator', description: 'Industry vector design tool.' },
      { name: 'Inkscape', slug: 'inkscape', description: 'Free open source vector tool.' }
    ]
  },
  {
    id: 'inkscape',
    name: 'Inkscape Vector Editor',
    developer: 'Inkscape Community',
    category: 'Graphics & Design',
    description: 'Free open source professional vector graphics editor for Linux, Mac, and Windows.',
    longDescription: 'Inkscape is a professional vector graphics editor for Linux, Windows and macOS. It is free and open source. It uses SVG (Scalable Vector Graphics) as its native format for creating icons, logos, and illustrations.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://inkscape.org',
    downloadUrl: 'https://inkscape.org/release/',
    supportedExtensions: ['SVG', 'SVGZ', 'AI', 'EPS', 'PDF', 'CDR', 'DXF', 'PNG'],
    rating: 4.6,
    reviewCount: 26500,
    features: [
      'Flexible drawing tools with Bezier curves and spiral tools',
      'Node editing, path operations, and bitmap tracing engine',
      'Direct XML code editor for SVG fine-tuning'
    ],
    alternatives: [
      { name: 'Adobe Illustrator', slug: 'adobe-illustrator', description: 'Commercial vector graphics software.' },
      { name: 'CorelDRAW', slug: 'coreldraw', description: 'Vector design suite.' }
    ]
  },
  {
    id: 'coreldraw',
    name: 'CorelDRAW Graphics Suite',
    developer: 'Alludo / Corel',
    category: 'Graphics & Design',
    description: 'Comprehensive professional vector illustration, layout, and photo editing software.',
    longDescription: 'CorelDRAW Graphics Suite is a complete toolkit for professional vector illustration, layout, photo editing, and typography. Used by signmakers, apparel manufacturers, and graphic designers worldwide.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$269 / year',
    websiteUrl: 'https://coreldraw.com',
    downloadUrl: 'https://coreldraw.com/en/product/coreldraw/',
    supportedExtensions: ['CDR', 'CDX', 'CDT', 'AI', 'EPS', 'PDF', 'SVG', 'PSD', 'DWG'],
    rating: 4.5,
    reviewCount: 19800,
    features: [
      'LiveSketch AI vector drawing tool',
      'Specialized sign making and large-format printing features',
      'Bitmap-to-vector PowerTRACE engine'
    ],
    alternatives: [
      { name: 'Adobe Illustrator', slug: 'adobe-illustrator', description: 'Standard vector editor.' },
      { name: 'Inkscape', slug: 'inkscape', description: 'Free SVG vector editor.' }
    ]
  },
  {
    id: 'photopea',
    name: 'Photopea Online Editor',
    developer: 'Ivan Kutskir',
    category: 'Graphics & Design',
    description: 'Free browser-based photo and graphics editor supporting PSD, XCF, Sketch, and AI files.',
    longDescription: 'Photopea is an advanced web-based photo and graphics editor that works inside any browser without installation. It supports PSD, PSB, Sketch, XD, CDR, RAW, and XCF files with full layer editing.',
    supportedOS: ['windows', 'mac', 'linux', 'android', 'ios'],
    priceType: 'Free',
    priceText: 'Free Online / Browser-Based',
    websiteUrl: 'https://photopea.com',
    downloadUrl: 'https://photopea.com',
    supportedExtensions: ['PSD', 'PSB', 'SKETCH', 'XD', 'CDR', 'XCF', 'PNG', 'JPG', 'WEBP', 'SVG'],
    rating: 4.9,
    reviewCount: 52000,
    features: [
      'Runs 100% in web browser with WebAssembly hardware acceleration',
      'Opens and saves native Adobe Photoshop .PSD files',
      'Supports vector masks, adjustment layers, and smart objects'
    ],
    alternatives: [
      { name: 'Adobe Photoshop', slug: 'adobe-photoshop', description: 'Desktop Photoshop app.' },
      { name: 'GIMP', slug: 'gimp', description: 'Desktop open source editor.' }
    ]
  },
  {
    id: 'figma',
    name: 'Figma Design',
    developer: 'Figma Inc.',
    category: 'Graphics & Design',
    description: 'Collaborative web-based UI/UX interface design and prototyping tool.',
    longDescription: 'Figma is the leading collaborative interface design tool for building web and mobile applications. Work together in real time with design systems, auto layout, component variants, and interactive prototypes.',
    supportedOS: ['windows', 'mac', 'linux', 'ios', 'android'],
    priceType: 'Freemium',
    priceText: 'Free Tier / $12 / editor / month',
    websiteUrl: 'https://figma.com',
    downloadUrl: 'https://figma.com/downloads/',
    supportedExtensions: ['FIG', 'JAM', 'SVG', 'PNG', 'JPG', 'PDF'],
    rating: 4.9,
    reviewCount: 61000,
    features: [
      'Real-time multi-user design collaboration',
      'Auto Layout responsive component flexboxes',
      'Interactive prototyping and design system tokens'
    ],
    alternatives: [
      { name: 'Adobe XD', slug: 'adobe-xd', description: 'UI/UX prototyping application.' },
      { name: 'Sketch', slug: 'sketch', description: 'Mac native vector design software.' }
    ]
  },
  {
    id: 'sketch',
    name: 'Sketch App',
    developer: 'Sketch B.V.',
    category: 'Graphics & Design',
    description: 'Native macOS vector design and prototyping platform for web and mobile interfaces.',
    longDescription: 'Sketch is the ultimate vector design app for macOS. Craft user interfaces, icons, prototypes, and design systems with a lightweight native Swift interface.',
    supportedOS: ['mac'],
    priceType: 'Paid',
    priceText: '$10 / editor / month',
    websiteUrl: 'https://sketch.com',
    downloadUrl: 'https://sketch.com/downloads/mac/',
    supportedExtensions: ['SKETCH', 'SVG', 'PDF', 'EPS', 'PNG', 'JPG'],
    rating: 4.7,
    reviewCount: 22000,
    features: [
      'Native macOS Metal hardware accelerated vector rendering',
      'Symbol components and color variable tokens',
      'Offline-first workspace design'
    ],
    alternatives: [
      { name: 'Figma', slug: 'figma', description: 'Cross-platform web UI design tool.' }
    ]
  },
  {
    id: 'canva',
    name: 'Canva Design Platform',
    developer: 'Canva Pty Ltd',
    category: 'Graphics & Design',
    description: 'Online graphic design platform for social media graphics, presentations, and marketing visual content.',
    longDescription: 'Canva makes design accessible for everyone. Create social media posts, presentations, posters, videos, and logos with millions of customizable templates and AI design tools.',
    supportedOS: ['windows', 'mac', 'ios', 'android'],
    priceType: 'Freemium',
    priceText: 'Free Plan / $120 / year Pro',
    websiteUrl: 'https://canva.com',
    downloadUrl: 'https://canva.com/download/',
    supportedExtensions: ['PNG', 'JPG', 'PDF', 'SVG', 'MP4', 'GIF'],
    rating: 4.8,
    reviewCount: 88000,
    features: [
      'Drag-and-drop template editor with millions of stock assets',
      'Magic Studio AI photo and text generator',
      'One-click background removal and social media resizer'
    ],
    alternatives: [
      { name: 'Adobe Express', slug: 'adobe-express', description: 'Adobe quick web graphic design tool.' }
    ]
  },
  {
    id: 'darktable',
    name: 'Darktable Photography',
    developer: 'Darktable Team',
    category: 'Graphics & Design',
    description: 'Free open-source photography workflow application and RAW image developer.',
    longDescription: 'Darktable is an open source photography workflow application and raw developer. A virtual lighttable and darkroom for photographers to manage and non-destructively develop digital camera RAW files.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://darktable.org',
    downloadUrl: 'https://darktable.org/install/',
    supportedExtensions: ['RAW', 'CR2', 'CR3', 'NEF', 'ARW', 'DNG', 'ORF', 'TIFF', 'JPEG', 'EXR'],
    rating: 4.6,
    reviewCount: 14500,
    features: [
      'Non-destructive RAW editing buffer with GPU acceleration',
      'Color management and camera profile calibration',
      'Masking and parametric local adjustment modules'
    ],
    alternatives: [
      { name: 'Adobe Lightroom', slug: 'adobe-lightroom', description: 'Subscription RAW photo manager.' },
      { name: 'RawTherapee', slug: 'rawtherapee', description: 'Open source RAW photo editor.' }
    ]
  },
  {
    id: 'rawtherapee',
    name: 'RawTherapee',
    developer: 'RawTherapee Team',
    category: 'Graphics & Design',
    description: 'Free cross-platform RAW image processing software with advanced demosaicing algorithms.',
    longDescription: 'RawTherapee is a powerful, cross-platform raw image processing system designed for developing raw files from digital camera sensors with high fidelity.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://rawtherapee.com',
    downloadUrl: 'https://rawtherapee.com/downloads/',
    supportedExtensions: ['RAW', 'DNG', 'CR2', 'NEF', 'RAF', 'ARW', 'TIFF', 'PNG'],
    rating: 4.6,
    reviewCount: 12100,
    features: [
      'Advanced noise reduction and demosaicing pipelines',
      '96-bit floating point processing engine',
      'Deep lens distortion correction profile support'
    ],
    alternatives: [
      { name: 'Darktable', slug: 'darktable', description: 'Free photography workflow suite.' }
    ]
  },
  {
    id: 'capture-one',
    name: 'Capture One Pro',
    developer: 'Capture One A/S',
    category: 'Graphics & Design',
    description: 'Professional photo editing and tethered camera shooting software for studio photographers.',
    longDescription: 'Capture One Pro is the industry choice for studio photo tethering and color processing. Delivers lifelike color rendering and precision editing controls for high-end fashion and commercial shoots.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$179 / year or $299 one-time',
    websiteUrl: 'https://captureone.com',
    downloadUrl: 'https://captureone.com/download',
    supportedExtensions: ['RAW', 'EIP', 'IIQ', 'CR2', 'CR3', 'NEF', 'ARW', 'DNG', 'PSD', 'TIFF'],
    rating: 4.8,
    reviewCount: 15400,
    features: [
      'Instant live tethered shooting with camera remote control',
      'Precision skin tone color balance tool',
      'Speed edit hotkey workflow for high volume shoots'
    ],
    alternatives: [
      { name: 'Adobe Lightroom', slug: 'adobe-lightroom', description: 'Adobe photo editing ecosystem.' }
    ]
  },
  {
    id: 'irfanview',
    name: 'IrfanView Image Viewer',
    developer: 'Irfan Skiljan',
    category: 'Graphics & Design',
    description: 'Ultralight, fast graphic viewer for Windows with batch conversion and slideshow support.',
    longDescription: 'IrfanView is a fast, compact and innovative graphic viewer for Windows. Designed to be simple for beginners and powerful for professionals with support for over 100 image formats.',
    supportedOS: ['windows'],
    priceType: 'Free',
    priceText: 'Free for Non-Commercial Use',
    websiteUrl: 'https://irfanview.com',
    downloadUrl: 'https://irfanview.com/main_download_engl.htm',
    supportedExtensions: ['JPG', 'PNG', 'GIF', 'BMP', 'TIFF', 'TGA', 'WEBP', 'HEIC', 'ICO', 'PSD'],
    rating: 4.8,
    reviewCount: 41200,
    features: [
      'Launches in under 100 milliseconds',
      'Powerful multi-file batch format conversion tool',
      'Lossless JPEG crop, rotate, and EXIF comment editing'
    ],
    alternatives: [
      { name: 'XnView MP', slug: 'xnview', description: 'Cross-platform image viewer.' },
      { name: 'FastStone Image Viewer', slug: 'faststone', description: 'Windows photo browser.' }
    ]
  },
  {
    id: 'xnview',
    name: 'XnView Classic',
    developer: 'Pierre-Emmanuel Gougelet (XnSoft)',
    category: 'Graphics & Design',
    description: 'Fast, lightweight classic Windows image viewer, photo browser, and batch graphic format converter.',
    longDescription: 'XnView Classic is the original, lightweight image viewer, browser, and batch converter built specifically for Windows. It provides fast thumbnail generation, slideshow creation, and support for over 500 image formats with minimal memory footprint.',
    supportedOS: ['windows'],
    priceType: 'Free',
    priceText: 'Free for Personal Use',
    websiteUrl: 'https://www.xnview.com/en/xnview/',
    downloadUrl: 'https://www.xnview.com/en/xnview/#downloads',
    supportedExtensions: ['JPG', 'PNG', 'TIFF', 'GIF', 'BMP', 'ICO', 'TGA', 'PCX', 'PSD', 'RAW'],
    rating: 4.6,
    reviewCount: 18500,
    features: [
      'Ultra-fast thumbnail preview generation on Windows',
      'Batch conversion, resizing, and lossless JPEG rotation',
      'Contact sheet and multipage TIFF/PDF creation',
      'TWAIN and WIA scanner integration support'
    ],
    alternatives: [
      { name: 'XnView MP', slug: 'xnview-mp', description: 'Cross-platform 64-bit edition with enhanced multi-core performance.' },
      { name: 'IrfanView', slug: 'irfanview', description: 'Windows lightweight graphic viewer.' }
    ]
  },
  {
    id: 'procreate',
    name: 'Procreate iPad',
    developer: 'Savage Interactive',
    category: 'Graphics & Design',
    description: 'Leading digital illustration app crafted exclusively for iPad and Apple Pencil.',
    longDescription: 'Procreate is the complete digital studio for iPad. Create expressive sketches, rich paintings, and animations with hundreds of handmade brushes and 4K canvas support.',
    supportedOS: ['ios'],
    priceType: 'Paid',
    priceText: '$12.99 one-time payment',
    websiteUrl: 'https://procreate.com',
    downloadUrl: 'https://apps.apple.com/app/procreate/id425073498',
    supportedExtensions: ['PROCREATE', 'PSD', 'PNG', 'JPG', 'PDF', 'TIFF', 'GIF'],
    rating: 4.9,
    reviewCount: 105000,
    features: [
      'Valkyrie 64-bit brush engine powered by Apple Silicon',
      'Hover preview and pressure sensitivity Apple Pencil tuning',
      'Time-lapse video recording of entire artwork process'
    ],
    alternatives: [
      { name: 'Clip Studio Paint', slug: 'clip-studio-paint', description: 'Cross-platform illustration software.' },
      { name: 'Krita', slug: 'krita', description: 'Free digital painting suite.' }
    ]
  },
  {
    id: 'clip-studio-paint',
    name: 'Clip Studio Paint',
    developer: 'CELSYS, Inc.',
    category: 'Graphics & Design',
    description: 'Professional graphics software for manga, comics, character art, and 2D animation.',
    longDescription: 'Clip Studio Paint is the artist’s app for drawing and painting. Used by comic artists, manga creators, and webtoon illustrators worldwide with 3D poseable reference models.',
    supportedOS: ['windows', 'mac', 'ios', 'android'],
    priceType: 'Paid',
    priceText: '$49.99 one-time / $0.99 monthly',
    websiteUrl: 'https://clipstudio.net',
    downloadUrl: 'https://clipstudio.net/en/dl/',
    supportedExtensions: ['CLIP', 'PSD', 'PSB', 'PNG', 'JPG', 'BMP', 'SVG'],
    rating: 4.8,
    reviewCount: 38900,
    features: [
      'Integrated 3D character mannequin pose reference controls',
      'Specialized comic panel framing and speech bubble generators',
      'Webtoon vertical scrolling canvas export presets'
    ],
    alternatives: [
      { name: 'Procreate', slug: 'procreate', description: 'Digital illustration software.' },
      { name: 'Krita', slug: 'krita', description: 'Free open source art tool.' }
    ]
  }
];
