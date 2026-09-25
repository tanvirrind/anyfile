import { FileTypeInfo } from '../types';

const BASE_POPULAR_FILE_TYPES: FileTypeInfo[] = [
  // --- IMAGES ---
  {
    extension: 'HEIC',
    name: 'High Efficiency Image Container',
    category: 'Images',
    description: 'Apple iOS default high-efficiency camera image format using HEVC compression.',
    detailedOverview: 'HEIC (High Efficiency Image Container) is the default photo image format introduced by Apple in iOS 11. It uses High Efficiency Video Coding (HEVC) compression to store ultra high-quality camera images at approximately half the file size of traditional JPEGs.',
    mimeType: 'image/heic',
    magicBytesHex: '00 00 00 18 66 74 79 70 68 65 69 63',
    typicalSize: '1.2 MB – 3.5 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Standard media container format with zero executable capability. Safe to view and convert.',
    exampleUse: 'iPhone Camera Photos, iPad Screenshots',
    featured: true,
    popularityScore: 98,
    developer: 'MPEG Group / Apple Inc.',
    firstReleased: '2017',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Apple Photos', os: ['mac', 'ios'], isFree: true, developer: 'Apple Inc.', link: 'https://apple.com/photos', slug: 'apple-photos' },
      { name: 'CopyTrans HEIC for Windows', os: ['windows'], isFree: true, developer: 'WindSolutions', link: 'https://copytrans.net', slug: 'copytrans' },
      { name: 'Adobe Photoshop 2024', os: ['windows', 'mac'], isFree: false, developer: 'Adobe Inc.', link: 'https://adobe.com', slug: 'adobe-photoshop' },
      { name: 'GIMP Open Source Editor', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'GIMP Team', link: 'https://gimp.org', slug: 'gimp' },
      { name: 'Google Photos', os: ['windows', 'mac', 'android', 'ios'], isFree: true, developer: 'Google LLC', link: 'https://photos.google.com', slug: 'google-photos' },
    ],
    openingSteps: [
      { title: 'Windows 11 Setup', desc: 'Install free HEIF Image Extensions from Microsoft Store or use AnyFileX Web Converter.' },
      { title: 'Mac / iOS Native', desc: 'Double click to open directly in macOS Preview or iOS Photos app without additional tools.' },
      { title: 'Linux Desktop', desc: 'Install libheif-examples and view in GIMP or ImageMagick.' }
    ],
    conversions: [
      { targetExtension: 'JPG', description: 'Convert HEIC to standard JPEG image for 100% universal device and web compatibility.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'heic-to-jpg' },
      { targetExtension: 'PDF', description: 'Convert single or multi-page HEIC photo batches into printable PDF documents.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'heic-to-pdf' },
      { targetExtension: 'PNG', description: 'Convert HEIC to lossless PNG format maintaining full alpha transparency.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'heic-to-png' },
      { targetExtension: 'WEBP', description: 'Convert HEIC to compressed WebP for fast website publishing and SEO.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'heic-to-webp' }
    ],
    repairTips: [
      'If file fails to open, inspect magic bytes to verify ftypheic (00 00 00 18 66 74 79 70 68 65 69 63) header string is present.',
      'For broken USB transfer files from iPhone, enable "Automatic" under iOS Settings > Photos > Transfer to Mac or PC.',
      'For Windows black screens or error 0x80070057, install HEIF Image Extensions and HEVC Video Extensions from Microsoft Store.',
      'Use AnyFileX Online HEIC Viewer to decode corrupted files or convert them directly to JPG in-browser.'
    ],
    faqs: [
      { question: 'What is a HEIC file and what does HEIC stand for?', answer: 'HEIC stands for High Efficiency Image Container. It is the file extension used for the HEIF (High Efficiency Image File Format) standard, adopted by Apple in iOS 11 to store high-resolution photos at approximately 50% the file size of JPEG using advanced HEVC (H.265) compression.' },
      { question: 'How do I open HEIC files on Windows 10 or Windows 11?', answer: 'To open HEIC files on Windows, install the free "HEIF Image Extensions" and "HEVC Video Extensions" from the Microsoft Store, or install "CopyTrans HEIC for Windows" which enables native thumbnail previews in Windows File Explorer. You can also open and view them instantly in your browser using AnyFileX.' },
      { question: 'How do I open HEIC files on Android?', answer: 'Android 9 (Pie) and newer versions natively support HEIC files through Google Photos and Samsung Gallery. On Samsung devices, you can view and share HEIC photos without installing third-party apps.' },
      { question: 'How do I open HEIC files on a Mac?', answer: 'macOS High Sierra (10.13) and later versions natively support HEIC. Simply double-click the file to open it in Apple Preview or Apple Photos, or select the file in Finder and tap the Spacebar for an instant Quick Look preview.' },
      { question: 'Is HEIC better quality than JPG / JPEG?', answer: 'Yes. HEIC delivers equal or superior visual quality to JPEG at half the file size. Furthermore, HEIC supports 10-bit and 16-bit color depth (over 1 billion colors), alpha channel transparency, live photos, and depth map data, whereas JPEG is limited to 8-bit color with no transparency.' },
      { question: 'How do I convert HEIC to JPG?', answer: 'You can convert HEIC to JPG for free right here on AnyFileX without downloading software. Simply drop your HEIC file into our online converter or viewer, and download the converted JPEG image in seconds.' },
      { question: 'How do I convert HEIC to PDF?', answer: 'Use the AnyFileX HEIC to PDF converter to transform your HEIC photos into single or multi-page PDF documents. The conversion preserves resolution and allows instant downloading or printing.' },
      { question: 'What is the MIME content-type for HEIC files?', answer: 'The official registered MIME types are image/heic for single images, image/heif for generic HEIF containers, and image/heic-sequence for image bursts and Live Photos.' },
      { question: 'What are the magic bytes / hex signatures for HEIC?', answer: 'A standard HEIC file begins with the 12-byte hex sequence: 00 00 00 18 66 74 79 70 68 65 69 63, which corresponds to ASCII ....ftypheic.' },
      { question: 'How do I stop my iPhone from taking HEIC photos and switch back to JPG?', answer: 'On your iPhone or iPad, go to Settings > Camera > Formats, and select "Most Compatible" instead of "High Efficiency". This causes the camera to save new photos directly as standard JPEG (.jpg) files.' }
    ]
  },
  {
    extension: 'PSD',
    name: 'Adobe Photoshop Document',
    category: 'Images',
    description: 'Layered raster graphics project file created in Adobe Photoshop with smart objects and masks.',
    detailedOverview: 'PSD (Photoshop Document) is the proprietary default file format used by Adobe Photoshop. It stores multi-layered image compositions, vector artwork, adjustment layers, transparency masks, text annotations, and color profiles.',
    mimeType: 'image/vnd.adobe.photoshop',
    magicBytesHex: '38 42 50 53 00 01 (8BPS)',
    typicalSize: '20 MB – 850 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Non-executable graphic project file. Low security risk unless paired with external linked scripts.',
    exampleUse: 'Graphic Design Mockups, UI Prototypes, Photo Composites',
    featured: true,
    popularityScore: 95,
    developer: 'Adobe Inc.',
    firstReleased: '1990',
    osSupport: { windows: true, mac: true, linux: false, android: false, ios: true },
    popularApps: [
      { name: 'Adobe Photoshop 2024', os: ['windows', 'mac'], isFree: false, developer: 'Adobe Inc.', slug: 'adobe-photoshop' },
      { name: 'Photopea Online Editor', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Ivan Kutskir', slug: 'photopea' },
      { name: 'GIMP', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'GIMP Team', slug: 'gimp' },
      { name: 'Paint.NET (with Plugin)', os: ['windows'], isFree: true, developer: 'dotPDN LLC', slug: 'paint-net' },
      { name: 'Affinity Photo 2', os: ['windows', 'mac', 'ios'], isFree: false, developer: 'Serif Ltd', slug: 'affinity-photo' },
    ],
    openingSteps: [
      { title: 'Open in Adobe Photoshop', desc: 'File > Open or drag file directly into Photoshop canvas.' },
      { title: 'Free Browser View in Photopea', desc: 'Visit photopea.com and drag your .PSD file to view and edit layers for free.' },
      { title: 'Open in GIMP', desc: 'Use GIMP File Open menu to import PSD layers and mask channels.' }
    ],
    conversions: [
      { targetExtension: 'JPG', description: 'Flatten layers and export high resolution JPEG graphic.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'psd-to-jpg' },
      { targetExtension: 'PNG', description: 'Export PSD design with transparent background preserved.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'psd-to-png' },
      { targetExtension: 'PDF', description: 'Convert PSD canvas into multi-page print-ready PDF.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'psd-to-pdf' }
    ],
    repairTips: [
      'Check for 8BPS header at byte offset 0. Corrupted PSDs often wipe this 4-byte signature.',
      'Use Photoshop built-in autosave recover directory: %AppData%/Adobe/Adobe Photoshop/AutoRecover',
      'Use AnyFileX PSD Header Recovery tool to strip broken layer adjustment tags.'
    ],
    faqs: [
      { question: 'Can I open PSD files without buying Photoshop?', answer: 'Yes! Photopea (web browser), GIMP, Krita, and Paint.NET can open and export PSD files for free.' },
      { question: 'What is the maximum file size for a PSD?', answer: 'PSD supports files up to 2 GB and 30,000 x 30,000 pixels. Larger projects require PSB (Photoshop Big) format.' }
    ]
  },
  {
    extension: 'WEBP',
    name: 'Google WebP Image Format',
    category: 'Images',
    description: 'Modern web image format developed by Google offering superior lossy and lossless compression.',
    detailedOverview: 'WebP is an open image format created by Google designed to replace JPEG, PNG, and GIF graphics on the web. It supports lossy compression, lossless compression, alpha channel transparency, and animation frames.',
    mimeType: 'image/webp',
    magicBytesHex: '52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)',
    typicalSize: '15 KB – 450 KB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Standard browser-native media format. Completely safe.',
    exampleUse: 'Website Graphics, Compressed Photos, Animated Web Stickers',
    featured: true,
    popularityScore: 96,
    developer: 'Google LLC',
    firstReleased: '2010',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Google Chrome / Edge / Safari', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'Google / MS / Apple', slug: 'chrome' },
      { name: 'IrfanView', os: ['windows'], isFree: true, developer: 'Irfan Skiljan', slug: 'irfanview' },
      { name: 'XnView MP', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Pierre-Emmanuel Gougelet', slug: 'xnview' },
      { name: 'GIMP', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'GIMP Team', slug: 'gimp' }
    ],
    openingSteps: [
      { title: 'Browser View', desc: 'Drag and drop any .webp file directly into Chrome, Safari, Edge, or Firefox.' },
      { title: 'Windows Photos', desc: 'Windows 11 supports WebP natively in the default Photos app.' },
      { title: 'Batch Conversion', desc: 'Use AnyFileX WebP Converter to convert WebP images back to JPG or PNG in bulk.' }
    ],
    conversions: [
      { targetExtension: 'JPG', description: 'Convert WebP to JPEG for desktop printing or older legacy photo editors.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'webp-to-jpg' },
      { targetExtension: 'PNG', description: 'Convert WebP to PNG format with full transparency preservation.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'webp-to-png' }
    ],
    repairTips: [
      'Verify RIFF and WEBP magic byte strings at header offset 0 and 8.',
      'Check if file is animated WebP (VP8X chunk) vs static lossy VP8 chunk.'
    ]
  },
  {
    extension: 'SVG',
    name: 'Scalable Vector Graphics',
    category: 'Images',
    description: 'XML-based vector image format supporting infinite scalability without resolution loss.',
    detailedOverview: 'Scalable Vector Graphics (SVG) is an XML-based vector image format developed by the W3C. SVG graphics can scale infinitely to any print or screen resolution without pixelation or quality loss.',
    mimeType: 'image/svg+xml',
    magicBytesHex: '3C 73 76 67 (XML text: <svg)',
    typicalSize: '2 KB – 150 KB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'SVG files can contain inline JavaScript <script> tags. Scan untrusted SVG files before rendering.',
    exampleUse: 'Logos, Vector Icons, UI Illustrations, Plotter Cutter Designs',
    featured: true,
    popularityScore: 92,
    developer: 'W3C (World Wide Web Consortium)',
    firstReleased: '2001',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Inkscape Vector Editor', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Inkscape Project', slug: 'inkscape' },
      { name: 'Adobe Illustrator 2024', os: ['windows', 'mac'], isFree: false, developer: 'Adobe Inc.', slug: 'adobe-illustrator' },
      { name: 'Figma', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Figma Inc.', slug: 'figma' },
      { name: 'VS Code', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Microsoft', slug: 'vscode' }
    ],
    openingSteps: [
      { title: 'Open in Web Browser', desc: 'Drag .svg into Chrome, Firefox, or Safari to inspect graphic.' },
      { title: 'Edit Code in VS Code', desc: 'Open SVG as plain text to edit XML coordinates and inline CSS styles.' },
      { title: 'Edit Vector Canvas in Inkscape', desc: 'Import into Inkscape to edit node paths and vector curves.' }
    ],
    conversions: [
      { targetExtension: 'PNG', description: 'Rasterize SVG vector graphics into high DPI PNG image.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'svg-to-png' },
      { targetExtension: 'PDF', description: 'Convert SVG paths to print vector PDF document.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'svg-to-pdf' }
    ],
    repairTips: [
      'Open SVG file in text editor to check for missing closing </svg> tag or XML syntax errors.',
      'Strip malicious <script> tags using AnyFileX Sanitizer Tool.'
    ]
  },
  {
    extension: 'TIFF',
    name: 'Tagged Image File Format',
    category: 'Images',
    description: 'High quality raster graphics format widely used in professional printing and photography.',
    detailedOverview: 'TIFF (Tagged Image File Format) is an adaptable raster image format widely favored by photographers, publishing houses, and medical imaging systems for storing uncompressed or losslessly compressed images.',
    mimeType: 'image/tiff',
    magicBytesHex: '49 49 2A 00 (Little Endian) or 4D 4D 00 2A (Big Endian)',
    typicalSize: '25 MB – 250 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Safe standard image container format.',
    exampleUse: 'High-res Scans, Printing Press Assets, Desktop Publishing',
    popularityScore: 84,
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Adobe Lightroom / Photoshop', os: ['windows', 'mac'], isFree: false, developer: 'Adobe Inc.', slug: 'adobe-photoshop' },
      { name: 'Apple Preview', os: ['mac'], isFree: true, developer: 'Apple Inc.', slug: 'apple-preview' },
      { name: 'FastStone Image Viewer', os: ['windows'], isFree: true, developer: 'FastStone Soft', slug: 'faststone' }
    ],
    openingSteps: [
      { title: 'Windows / Mac Native', desc: 'Double-click to view directly in macOS Preview or Windows Photos app.' },
      { title: 'Batch Processing', desc: 'Use Adobe Lightroom or FastStone to process multi-page TIFF bundles.' }
    ],
    conversions: [
      { targetExtension: 'JPG', description: 'Compress heavy TIFF file into shareable web JPEG.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'tiff-to-jpg' },
      { targetExtension: 'PDF', description: 'Bundle multi-page TIFF scans into a single PDF document.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'tiff-to-pdf' }
    ],
    repairTips: ['Check if file uses LZW compression vs raw uncompressed RGB values.']
  },
  {
    extension: 'CR3',
    name: 'Canon RAW Version 3 Image',
    category: 'Images',
    description: 'Raw unprocessed camera sensor data format created by Canon EOS digital cameras.',
    detailedOverview: 'CR3 is Canon\'s raw camera image format introduced with the DIGIC 8 image processor. It contains uncompressed or compressed raw sensor sensor pixel matrix data alongside EXIF metadata and embedded JPEG previews.',
    mimeType: 'image/x-canon-cr3',
    magicBytesHex: '00 00 00 18 66 74 79 70 63 72 78 33 (ftypcrx3)',
    typicalSize: '25 MB – 65 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Raw camera photo container. Zero security threat.',
    exampleUse: 'Professional DSLR Photography, RAW Photo Editing',
    popularityScore: 88,
    osSupport: { windows: true, mac: true, linux: true, android: false, ios: true },
    popularApps: [
      { name: 'Canon Digital Photo Professional', os: ['windows', 'mac'], isFree: true, developer: 'Canon Inc.', slug: 'canon-dpp' },
      { name: 'Adobe Camera Raw / Lightroom', os: ['windows', 'mac'], isFree: false, developer: 'Adobe Inc.', slug: 'adobe-photoshop' },
      { name: 'Darktable RAW Developer', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Darktable Team', slug: 'darktable' }
    ],
    openingSteps: [
      { title: 'Canon Official Software', desc: 'Download free Canon DPP from Canon support website.' },
      { title: 'Adobe Lightroom', desc: 'Import CR3 files into Lightroom CC or Photoshop Camera Raw plugin.' }
    ],
    conversions: [
      { targetExtension: 'JPG', description: 'Develop raw camera sensor data into standard JPEG photo.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'cr3-to-jpg' },
      { targetExtension: 'DNG', description: 'Convert Canon proprietary RAW to Adobe open Digital Negative format.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'cr3-to-dng' }
    ],
    repairTips: ['Extract embedded JPEG preview thumbnail if CR3 sensor matrix chunk is corrupted.']
  },

  // --- CAD & 3D ---
  {
    extension: 'DWG',
    name: 'AutoCAD Drawing Database',
    category: 'CAD & 3D',
    description: 'Industry standard binary CAD file format storing 2D and 3D architectural and engineering designs.',
    detailedOverview: 'DWG (Drawing) is a proprietary binary file format created by Autodesk in 1982. It is the gold standard format for computer-aided design (CAD) storing vector geometry, 3D meshes, BIM data, layers, and geospatial coordinates.',
    mimeType: 'image/vnd.dwg',
    magicBytesHex: '41 43 31 30 (AC10...)',
    typicalSize: '2 MB – 120 MB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'DWG drawings can embed AutoLISP macros and VBA scripts. Disable automatic macro execution when opening untrusted CAD drawings.',
    exampleUse: 'Architectural Blueprints, Mechanical Schematics, Civil Infrastructure',
    featured: true,
    popularityScore: 97,
    developer: 'Autodesk Inc.',
    firstReleased: '1982',
    osSupport: { windows: true, mac: true, linux: false, android: true, ios: true },
    popularApps: [
      { name: 'Autodesk AutoCAD 2024', os: ['windows', 'mac'], isFree: false, developer: 'Autodesk Inc.', slug: 'autocad' },
      { name: 'DWG TrueView (Free Viewer)', os: ['windows'], isFree: true, developer: 'Autodesk Inc.', slug: 'dwg-trueview' },
      { name: 'eDrawings Viewer', os: ['windows', 'mac'], isFree: true, developer: 'Dassault Systèmes', slug: 'edrawings' },
      { name: 'LibreCAD Open Source', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'LibreCAD Team', slug: 'librecad' },
      { name: 'Autocad Web App', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Autodesk Inc.', slug: 'autocad-web' }
    ],
    openingSteps: [
      { title: 'Download DWG TrueView', desc: 'Download official free DWG TrueView standalone viewer from Autodesk.' },
      { title: 'View Online in Browser', desc: 'Use Autodesk Web Viewer or AnyFileX DWG Inspector tool.' },
      { title: 'Open in AutoCAD', desc: 'Use File > Open command inside AutoCAD or DraftSight.' }
    ],
    conversions: [
      { targetExtension: 'PDF', description: 'Convert DWG blueprints to vector PDF for printing and client review.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'dwg-to-pdf' },
      { targetExtension: 'DXF', description: 'Convert binary DWG into open text DXF format for CNC compatibility.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'dwg-to-dxf' }
    ],
    repairTips: [
      'Use AutoCAD RECOVER or AUDIT command to reconstruct damaged drawing tables.',
      'Check DWG header version string (AC1032 = AutoCAD 2018+, AC1027 = AutoCAD 2013).',
      'If drawing freezes AutoCAD, purge external references (XREFs) using DWG Convert.'
    ],
    faqs: [
      { question: 'How can I view DWG files without buying AutoCAD?', answer: 'Autodesk provides free DWG TrueView for Windows and Autodesk Viewer for web browsers.' },
      { question: 'What is the difference between DWG and DXF?', answer: 'DWG is a compact binary format proprietary to Autodesk, while DXF is an open ASCII text exchange format supported by almost all CAD software.' }
    ]
  },
  {
    extension: 'STEP',
    name: 'ISO 10303 STEP CAD Model',
    category: 'CAD & 3D',
    description: 'Universal 3D CAD exchange format for solid model geometry and assembly structure.',
    detailedOverview: 'STEP (Standard for the Exchange of Product Model Data, ISO 10303) is a neutral 3D CAD exchange file format designed to facilitate interoperability between different mechanical CAD systems like SolidWorks, CATIA, Inventor, and Creo.',
    mimeType: 'application/step',
    magicBytesHex: '23 49 53 4F 2D 31 30 33 30 33 2D 32 31 (#ISO-10303-21)',
    typicalSize: '5 MB – 180 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Text-based CAD boundary representation geometry format. Safe.',
    exampleUse: '3D Mechanical Assemblies, CNC Machining Data, Industrial Engineering',
    featured: true,
    popularityScore: 91,
    developer: 'ISO Technical Committee TC 184',
    firstReleased: '1994',
    osSupport: { windows: true, mac: true, linux: true, android: false, ios: false },
    popularApps: [
      { name: 'FreeCAD Parametric Modeler', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'FreeCAD Project', slug: 'freecad' },
      { name: 'Autodesk Fusion 360', os: ['windows', 'mac'], isFree: true, developer: 'Autodesk Inc.', slug: 'fusion-360' },
      { name: 'SolidWorks', os: ['windows'], isFree: false, developer: 'Dassault Systèmes', slug: 'solidworks' },
      { name: 'eDrawings Viewer', os: ['windows', 'mac'], isFree: true, developer: 'Dassault Systèmes', slug: 'edrawings' }
    ],
    openingSteps: [
      { title: 'Open in FreeCAD', desc: 'Launch FreeCAD and select File > Import > .step file.' },
      { title: 'View in eDrawings', desc: 'Double click .step file in eDrawings Viewer to inspect 3D assemblies and cross sections.' }
    ],
    conversions: [
      { targetExtension: 'STL', description: 'Convert STEP B-Rep solid model into tessellated STL mesh for 3D printing.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'step-to-stl' },
      { targetExtension: 'OBJ', description: 'Export STEP geometry to 3D mesh OBJ for Blender animation rendering.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'step-to-obj' }
    ],
    repairTips: ['Open STEP file in text editor to confirm HEADER; and END-ISO-10303-21; delimiter blocks exist.']
  },
  {
    extension: 'STL',
    name: 'Stereolithography 3D Mesh',
    category: 'CAD & 3D',
    description: 'Raw 3D surface mesh format composed of triangular facets used universally in 3D printing.',
    detailedOverview: 'STL (Stereolithography) is the standard file format used for rapid prototyping, 3D printing, and computer-aided manufacturing. It describes raw unstructured 3D surface geometry using triangular facet meshes.',
    mimeType: 'model/stl',
    magicBytesHex: '73 6F 6C 69 64 (ASCII: solid) or 80-byte header (Binary)',
    typicalSize: '1 MB – 90 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Pure geometric vertex mesh data. Completely safe.',
    exampleUse: '3D Printing Slicers, Dental Scans, Rapid Prototyping',
    popularityScore: 93,
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'PrusaSlicer', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Prusa Research', slug: 'prusaslicer' },
      { name: 'Cura Slicer', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'UltiMaker', slug: 'cura' },
      { name: 'Blender 3D Suite', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Blender Foundation', slug: 'blender' },
      { name: 'Windows 3D Builder', os: ['windows'], isFree: true, developer: 'Microsoft', slug: 'windows-3d-builder' }
    ],
    openingSteps: [
      { title: 'Import to 3D Slicer', desc: 'Drag .stl file into PrusaSlicer, Cura, or Bambu Studio.' },
      { title: 'Edit in Blender', desc: 'File > Import > Stl (.stl) inside Blender 3D.' }
    ],
    conversions: [
      { targetExtension: 'OBJ', description: 'Convert STL triangular mesh to OBJ mesh format.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'stl-to-obj' },
      { targetExtension: '3MF', description: 'Package STL geometry into modern 3MF manufacturing file.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'stl-to-3mf' }
    ],
    repairTips: ['Repair non-manifold mesh edges and inverted normals using Netfabb or Windows 3D Builder.']
  },
  {
    extension: 'BLEND',
    name: 'Blender 3D Scene File',
    category: 'CAD & 3D',
    description: 'Complete 3D animation scene file containing meshes, rigs, shaders, and keyframes from Blender.',
    detailedOverview: 'BLEND is the native project file format created by Blender open-source 3D suite. It contains 3D geometry meshes, skeletal rigging, lighting data, material nodes, animation timelines, and simulation caches.',
    mimeType: 'application/x-blender',
    magicBytesHex: '42 4C 45 4E 44 45 52 (BLENDER)',
    typicalSize: '5 MB – 500 MB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'Blender project files can execute embedded Python scripts on load. Enable Auto Execution protection in Blender preferences.',
    exampleUse: '3D VFX Rendering, Game Asset Development, CGI Character Animation',
    popularityScore: 89,
    osSupport: { windows: true, mac: true, linux: true, android: false, ios: false },
    popularApps: [
      { name: 'Blender 3D Suite', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Blender Foundation', slug: 'blender' }
    ],
    openingSteps: [
      { title: 'Open in Blender', desc: 'Launch Blender and open .blend scene file directly.' }
    ],
    conversions: [
      { targetExtension: 'FBX', description: 'Export Blender meshes and skeletal rigs to FBX for Unity or Unreal Engine.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'blend-to-fbx' },
      { targetExtension: 'OBJ', description: 'Export 3D objects to universal Wavefront OBJ format.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'blend-to-obj' }
    ],
    repairTips: ['If scene crashes Blender on open, use File > Append to pull individual meshes from corrupt .blend file.']
  },

  // --- DOCUMENTS ---
  {
    extension: 'PDF',
    name: 'Portable Document Format',
    category: 'Documents',
    description: 'Universal document exchange format preserving fonts, formatting, and vector layouts.',
    detailedOverview: 'PDF (Portable Document Format) is a universal file format developed by Adobe in 1992. It presents documents, text, fonts, vector graphics, and interactive forms independently of application software, hardware, and operating system.',
    mimeType: 'application/pdf',
    magicBytesHex: '25 50 44 46 2D (%PDF-)',
    typicalSize: '200 KB – 25 MB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'PDF documents can contain embedded JavaScript, external links, and launch actions. Use safe PDF viewers like Chrome or Edge.',
    exampleUse: 'Contracts, Invoices, User Manuals, E-books, Printable Forms',
    featured: true,
    popularityScore: 100,
    developer: 'Adobe Inc. / ISO 32000',
    firstReleased: '1993',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Adobe Acrobat Reader', os: ['windows', 'mac', 'android', 'ios'], isFree: true, developer: 'Adobe Inc.', slug: 'acrobat-reader' },
      { name: 'Google Chrome / MS Edge / Safari', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'Google / MS / Apple', slug: 'chrome' },
      { name: 'PDFgear (Free Editor)', os: ['windows', 'mac', 'ios'], isFree: true, developer: 'PDFgear', slug: 'pdfgear' },
      { name: 'Apple Preview', os: ['mac'], isFree: true, developer: 'Apple Inc.', slug: 'apple-preview' }
    ],
    openingSteps: [
      { title: 'Browser View', desc: 'Double-click any PDF to open immediately in your web browser.' },
      { title: 'Adobe Acrobat', desc: 'Use Adobe Acrobat for digital signatures, form filling, and OCR text recognition.' }
    ],
    conversions: [
      { targetExtension: 'DOCX', description: 'Convert PDF document into editable Microsoft Word format.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'pdf-to-docx' },
      { targetExtension: 'JPG', description: 'Render PDF document pages into high resolution JPEG images.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'pdf-to-jpg' }
    ],
    repairTips: ['Use Ghostscript command line tool to rebuild damaged PDF cross-reference tables (%PDF- header required).']
  },
  {
    extension: 'DOCX',
    name: 'Microsoft Word Open XML Document',
    category: 'Documents',
    description: 'Zip-compressed XML document format created by Microsoft Word.',
    detailedOverview: 'DOCX is the default document file format used by Microsoft Word 2007 and newer. It is an open XML-based archive containing document text, formatting, images, tables, and embedded media.',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    magicBytesHex: '50 4B 03 04 (PK.. Zip archive)',
    typicalSize: '50 KB – 15 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Standard DOCX files cannot contain macros (DOCM format handles macros). Low risk.',
    exampleUse: 'Word Processing Documents, Essays, Resumes, Business Proposals',
    featured: true,
    popularityScore: 99,
    developer: 'Microsoft Corporation',
    firstReleased: '2006',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Microsoft Word 365', os: ['windows', 'mac', 'android', 'ios'], isFree: false, developer: 'Microsoft', slug: 'microsoft-word' },
      { name: 'Google Docs', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'Google LLC', slug: 'google-docs' },
      { name: 'LibreOffice Writer', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'The Document Foundation', slug: 'libreoffice' },
      { name: 'Apple Pages', os: ['mac', 'ios'], isFree: true, developer: 'Apple Inc.', slug: 'apple-pages' }
    ],
    openingSteps: [
      { title: 'Google Docs Online', desc: 'Upload .docx to Google Drive and open with Google Docs for instant free editing.' },
      { title: 'LibreOffice Writer', desc: 'Install free open-source LibreOffice to edit Word files natively.' }
    ],
    conversions: [
      { targetExtension: 'PDF', description: 'Export Word document to read-only PDF file for distribution.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'docx-to-pdf' },
      { targetExtension: 'TXT', description: 'Strip document formatting and extract plain unformatted text.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'docx-to-txt' }
    ],
    repairTips: [
      'Rename .docx extension to .zip and extract document.xml to recover raw document text.',
      'Use Word built-in "Open and Repair" feature under File > Open menu.'
    ]
  },
  {
    extension: 'XLSX',
    name: 'Microsoft Excel Open XML Spreadsheet',
    category: 'Documents',
    description: 'Zip-compressed XML spreadsheet format created by Microsoft Excel.',
    detailedOverview: 'XLSX is the default file format for Microsoft Excel 2007 and newer. It stores numerical data, formulas, charts, pivot tables, and lookup tables organized across worksheet grids.',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    magicBytesHex: '50 4B 03 04 (PK.. Zip archive)',
    typicalSize: '30 KB – 25 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Standard XLSX spreadsheets do not store macros (XLSM stores macros). Safe.',
    exampleUse: 'Financial Spreadsheets, Budgets, Data Analysis Tables, Inventory Logs',
    popularityScore: 97,
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Microsoft Excel 365', os: ['windows', 'mac', 'android', 'ios'], isFree: false, developer: 'Microsoft', slug: 'microsoft-excel' },
      { name: 'Google Sheets', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'Google LLC', slug: 'google-sheets' },
      { name: 'LibreOffice Calc', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'The Document Foundation', slug: 'libreoffice' }
    ],
    openingSteps: [
      { title: 'Open in Google Sheets', desc: 'Drag .xlsx into Google Drive to edit spreadsheets online for free.' }
    ],
    conversions: [
      { targetExtension: 'CSV', description: 'Export spreadsheet active sheet into comma-separated value CSV file.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'xlsx-to-csv' },
      { targetExtension: 'PDF', description: 'Print spreadsheet worksheets to PDF document.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'xlsx-to-pdf' }
    ],
    repairTips: ['Extract xl/worksheets/sheet1.xml from renamed .zip archive to retrieve cell data values.']
  },
  {
    extension: 'EPUB',
    name: 'Electronic Publication E-Book',
    category: 'Documents',
    description: 'Standard open e-book format with reflowable typography and XHTML layout structure.',
    detailedOverview: 'EPUB is an HTML-based open e-book format defined by the International Digital Publishing Forum (IDPF). It supports reflowable text layout, vector graphics, table of contents metadata, and CSS styling.',
    mimeType: 'application/epub+zip',
    magicBytesHex: '50 4B 03 04 ... 6D 69 6D 65 74 79 70 65 61 70 70 6C 69 63 61 74 69 6F 6E 2F 65 70 75 62 2B 7A 69 70',
    typicalSize: '500 KB – 12 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'HTML e-book container. Safe.',
    exampleUse: 'Digital E-Books, Academic Readers, Published Fiction',
    popularityScore: 90,
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Calibre E-Book Management', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Kovid Goyal', slug: 'calibre' },
      { name: 'Apple Books', os: ['mac', 'ios'], isFree: true, developer: 'Apple Inc.', slug: 'apple-books' },
      { name: 'Readium Web Reader', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Readium Foundation', slug: 'readium' }
    ],
    openingSteps: [
      { title: 'Apple Books', desc: 'Double-click EPUB file on Mac or iPhone to open in Apple Books.' },
      { title: 'Calibre Reader', desc: 'Use Calibre e-book manager to read, edit, and sync EPUB files across devices.' }
    ],
    conversions: [
      { targetExtension: 'PDF', description: 'Convert EPUB e-book into printable PDF document.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'epub-to-pdf' },
      { targetExtension: 'MOBI', description: 'Convert EPUB format into Kindle compatible MOBI reader file.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'epub-to-mobi' }
    ],
    repairTips: ['Validate mimetype file inside EPUB Zip package is uncompressed and at offset 30.']
  },

  // --- ARCHIVES ---
  {
    extension: 'ZIP',
    name: 'ZIP Compressed Archive',
    category: 'Archives',
    description: 'Universal lossless data compression and file container archive format.',
    detailedOverview: 'ZIP is the most widely used data compression and archive format created by Phil Katz in 1989. It supports lossless DEFLATE compression to combine multiple files into a single compressed container.',
    mimeType: 'application/zip',
    magicBytesHex: '50 4B 03 04 (PK..)',
    typicalSize: '1 MB – 5 GB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'ZIP archives can contain executable malware or scripts. Scan contents with antivirus before extracting.',
    exampleUse: 'Software Distribution, Email Attachments, Website Downloads',
    featured: true,
    popularityScore: 100,
    developer: 'PKWARE Inc.',
    firstReleased: '1989',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Windows File Explorer', os: ['windows'], isFree: true, developer: 'Microsoft', slug: 'windows-explorer' },
      { name: 'macOS Archive Utility', os: ['mac'], isFree: true, developer: 'Apple Inc.', slug: 'archive-utility' },
      { name: '7-Zip Open Source', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Igor Pavlov', slug: '7-zip' },
      { name: 'WinRAR', os: ['windows'], isFree: false, developer: 'win.rar GmbH', slug: 'winrar' }
    ],
    openingSteps: [
      { title: 'Extract in Windows', desc: 'Right-click .zip file and select "Extract All..."' },
      { title: 'Extract on Mac', desc: 'Double click .zip file to unpack contents directly onto desktop.' }
    ],
    conversions: [
      { targetExtension: '7Z', description: 'Recompress ZIP files into high-ratio 7-Zip LZMA2 archive.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'zip-to-7z' },
      { targetExtension: 'TAR.GZ', description: 'Convert ZIP to Linux tarball container.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'zip-to-targz' }
    ],
    repairTips: [
      'Use 7-Zip command line "7z t archive.zip" to test archive integrity.',
      'Fix corrupted central directory headers using WinRAR "Repair Archive" feature.'
    ]
  },
  {
    extension: 'RAR',
    name: 'Roshal Archive Compressed File',
    category: 'Archives',
    description: 'Proprietary compressed archive format created by Eugene Roshal with recovery records.',
    detailedOverview: 'RAR is a proprietary compressed archive format developed by Eugene Roshal. It features multi-volume splitting, solid archive compression, AES-256 encryption, and built-in error recovery records.',
    mimeType: 'application/vnd.rar',
    magicBytesHex: '52 61 72 21 1A 07 00 (Rar!.. RAR 4) or 52 61 72 21 1A 07 01 00 (RAR 5)',
    typicalSize: '10 MB – 25 GB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'May contain untrusted binaries inside compressed archive.',
    exampleUse: 'Large Software Bundles, Game Recompilations, Video Archives',
    featured: true,
    popularityScore: 94,
    developer: 'win.rar GmbH / Eugene Roshal',
    firstReleased: '1993',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'WinRAR', os: ['windows'], isFree: false, developer: 'win.rar GmbH', slug: 'winrar' },
      { name: '7-Zip', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Igor Pavlov', slug: '7-zip' },
      { name: 'The Unarchiver', os: ['mac'], isFree: true, developer: 'MacPaw', slug: 'the-unarchiver' },
      { name: 'ZArchiver', os: ['android'], isFree: true, developer: 'ZDevs', slug: 'zarchiver' }
    ],
    openingSteps: [
      { title: 'Extract with 7-Zip', desc: 'Download free 7-Zip, right click .rar file > 7-Zip > Extract Here.' },
      { title: 'Unpack on Mac', desc: 'Install free The Unarchiver app to open RAR files on macOS.' }
    ],
    conversions: [
      { targetExtension: 'ZIP', description: 'Convert RAR archive to standard ZIP for native OS compatibility.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'rar-to-zip' }
    ],
    repairTips: ['Use WinRAR "Keep Broken Files" option during extraction to save undamaged files from bad RAR volumes.']
  },
  {
    extension: '7Z',
    name: '7-Zip Compressed Archive',
    category: 'Archives',
    description: 'Open-source compressed archive format with ultra-high LZMA/LZMA2 compression ratio.',
    detailedOverview: '7z is an open-source compressed archive format featuring a modular architecture, strong AES-256 encryption, and high compression ratios using the LZMA and LZMA2 compression algorithms.',
    mimeType: 'application/x-7z-compressed',
    magicBytesHex: '37 7A BC AF 27 1C (7z..)',
    typicalSize: '5 MB – 10 GB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Standard open compressed archive format.',
    exampleUse: 'Data Backups, Large Software Distributions, Open Source Packages',
    popularityScore: 92,
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: '7-Zip', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Igor Pavlov', slug: '7-zip' },
      { name: 'PeaZip', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Giorgio Tani', slug: 'peazip' }
    ],
    openingSteps: [{ title: 'Extract with 7-Zip', desc: 'Right-click .7z archive > 7-Zip > Extract Files.' }],
    conversions: [{ targetExtension: 'ZIP', description: 'Convert 7Z archive to ZIP container.', difficulty: 'Easy', onlinePossible: true, converterSlug: '7z-to-zip' }],
    repairTips: ['Use 7z command line tool with -r switch to extract raw file blocks.']
  },

  // --- AUDIO & VIDEO ---
  {
    extension: 'AWBS',
    name: 'Automated Weight and Balance System Data File',
    category: 'Databases',
    description: 'AWBS is a specialized data-storage extension associated with Lockheed Martin’s Automated Weight and Balance System, used to maintain aircraft weight, balance, loading, and related aviation records.',
    detailedOverview: 'An .awbs file is generally associated with Automated Weight and Balance System (AWBS) software used by aviation weight-and-balance personnel. The application supports record keeping, tracking, calculations, and generation of weight-and-balance forms. AWBS is an application-specific data file rather than a broadly standardized interchange format: depending on the software version, the contents may be SQLite-like, XML-based, or proprietary binary data. Do not confuse .awbs with .awb, the AMR-WB audio format.',
    mimeType: 'application/octet-stream',
    magicBytesHex: 'No universal signature; inspect for “SQLite format 3”, XML, or proprietary binary data',
    typicalSize: 'Varies by aircraft records and database history',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'AWBS files are normally data containers, but they may contain operational aviation records and should be handled as sensitive data. The extension is application-specific, so verify the source and scan unknown files before opening them in privileged software.',
    exampleUse: 'Aircraft weight-and-balance records, loading calculations, aviation forms and fleet data',
    popularityScore: 48,
    developer: 'Lockheed Martin Corporation',
    firstReleased: 'Application-dependent',
    osSupport: { windows: true, mac: false, linux: false, android: false, ios: false },
    popularApps: [
      { name: 'Automated Weight and Balance System (AWBS)', os: ['windows'], isFree: false, developer: 'Lockheed Martin Corporation', slug: 'awbs' },
      { name: 'AWBS Hangar', os: ['windows'], isFree: false, developer: 'AWBS ecosystem', slug: 'awbs-hangar' },
      { name: 'SQLite Database Browser', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'SQLiteBrowser.org', slug: 'sqlite-browser' },
      { name: 'AnyFileX File Identifier', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'AnyFileX', slug: 'file-identifier' }
    ],
    openingSteps: [
      { title: 'Confirm the source and aviation workflow', desc: 'If the file came from an aircraft weight-and-balance or hangar workflow, confirm which AWBS installation and version created it before opening the file.' },
      { title: 'Open it with the original AWBS software', desc: 'Use Automated Weight and Balance System or the associated AWBS Hangar workflow. Application-specific files may not be portable between versions or installations.' },
      { title: 'Inspect the header without editing', desc: 'A copy can be examined with a hex viewer or AnyFileX. “SQLite format 3”, XML tags, or high-entropy binary data can help identify the underlying structure, but do not rewrite the original.' },
      { title: 'Protect operational records', desc: 'Treat aircraft configuration, loading, and balance data as sensitive. Keep the original backed up and share only through approved aviation or organizational channels.' }
    ],
    conversions: [
      { targetExtension: 'CSV', description: 'Export tables to CSV only through AWBS or a verified database workflow that understands the file schema. Do not import unknown AWBS data into a spreadsheet blindly.', difficulty: 'Advanced', onlinePossible: false },
      { targetExtension: 'XML', description: 'Some application workflows may exchange structured data as XML, but conversion is version- and schema-dependent.', difficulty: 'Advanced', onlinePossible: false },
      { targetExtension: 'SQLITE', description: 'If the header confirms SQLite, a database tool may inspect or export it; the AWBS application remains the safest way to interpret aviation fields.', difficulty: 'Advanced', onlinePossible: false }
    ],
    repairTips: [
      'Never repair or resave an AWBS file in a generic database editor until a verified backup exists and the file structure is known.',
      'Check whether the file begins with SQLite format 3, an XML declaration, or a proprietary binary header before choosing a recovery method.',
      'If AWBS cannot open the file, ask the source organization for a fresh export from the same software version rather than changing the extension.',
      'Keep a checksum and an untouched copy when transferring operational weight-and-balance records.'
    ],
    faqs: [
      { question: 'What is an AWBS file?', answer: 'AWBS is an application-specific data-storage file associated with Lockheed Martin’s Automated Weight and Balance System. It can contain aircraft weight-and-balance records, calculations, tracking data, and form information.' },
      { question: 'How do I open an AWBS file?', answer: 'Use the Automated Weight and Balance System software or the AWBS Hangar workflow that created the file. Generic viewers may identify its underlying structure but cannot reliably interpret the aviation data.' },
      { question: 'Is AWBS the same as AWB audio?', answer: 'No. .AWB is commonly an AMR-WB speech-audio file, while .AWBS is associated with Automated Weight and Balance System data. They are unrelated formats.' },
      { question: 'Does AWBS have a standard MIME type or magic number?', answer: 'No universal MIME type or signature is established for AWBS. Use application/octet-stream until the internal structure is confirmed. Some files may identify themselves as SQLite, XML, or proprietary binary data.' },
      { question: 'Can I convert AWBS to CSV or Excel?', answer: 'Only use an AWBS-supported export or a verified schema-aware database workflow. Converting an unknown file generically can lose relationships, units, validation rules, or aviation-specific meaning.' },
      { question: 'Are AWBS files safe to share?', answer: 'They may contain sensitive aircraft and operational records. Share them only with authorized recipients, preserve the original, and use approved secure transfer channels.' }
    ]
  },
  {
    extension: 'CAMREC',
    name: 'Camtasia Studio Screen Recording',
    category: 'Audio & Video',
    description: 'CAMREC is a legacy TechSmith Camtasia screen-recording container used by older Windows releases. It can hold captured screen video, microphone or system audio, cursor assets, keyboard and event data, and recording metadata.',
    detailedOverview: 'A .camrec file is the raw recording produced by the Windows version of Camtasia Studio, especially Camtasia 8.3 and earlier. It is not a normal standalone video stream: common files use a Microsoft Compound File / OLE2 container with internal assets such as Screen_Stream.avi, manifest.camxml, cursor icons, Events.dat, Keyboard.dat, and SysAudio.wav. Editing changes belong in a Camtasia project file, while newer Camtasia versions use .trec instead. macOS Camtasia historically used .cmrec.',
    mimeType: 'application/octet-stream',
    magicBytesHex: 'D0 CF 11 E0 A1 B1 1A E1 (Microsoft Compound File / OLE2)',
    typicalSize: '15 MB – 280 MB for common recordings; varies with duration and quality',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'CAMREC is normally a recording container rather than an executable program, but it is a legacy Compound File container and may contain multiple embedded streams. Open files from unknown sources only after scanning them and verifying the OLE2 header.',
    exampleUse: 'Software demos, product tutorials, training recordings, narrated presentations',
    popularityScore: 62,
    developer: 'TechSmith',
    firstReleased: 'Camtasia Studio legacy Windows releases',
    osSupport: { windows: true, mac: false, linux: false, android: false, ios: false },
    popularApps: [
      { name: 'TechSmith Camtasia Studio', os: ['windows'], isFree: false, developer: 'TechSmith', slug: 'camtasia' },
      { name: 'Microsoft Compound File Viewer / OLE Tools', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Various', slug: 'ole-viewer' },
      { name: 'AnyFileX File Identifier', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'AnyFileX', slug: 'file-identifier' }
    ],
    openingSteps: [
      { title: 'Use the legacy Windows Camtasia installation', desc: 'Open the file with the Camtasia Studio version that created it, or a compatible older Windows release. CAMREC support is not available in every current Camtasia version.' },
      { title: 'Import it into Camtasia before editing', desc: 'Camtasia can use the recording as source media and then export a modern video. Project edits belong in the Camtasia project rather than inside the CAMREC container.' },
      { title: 'Convert it to a standard video', desc: 'Use Camtasia to produce MP4 or another supported delivery format. This is the most reliable route because the CAMREC container can include proprietary event and cursor streams.' },
      { title: 'Inspect an unknown file locally', desc: 'Use AnyFileX to check the OLE2 header, embedded text, and container evidence without changing the original file.' }
    ],
    conversions: [
      { targetExtension: 'MP4', description: 'Export the screen recording to a broadly compatible H.264/AAC video using Camtasia or another tool that can read the specific CAMREC variant.', difficulty: 'Medium', onlinePossible: false },
      { targetExtension: 'AVI', description: 'Some older Camtasia workflows can render the internal screen stream or recording to AVI, but compatibility depends on the source version.', difficulty: 'Medium', onlinePossible: false },
      { targetExtension: 'TREC', description: 'Re-recording or migrating to TREC is a Camtasia-version workflow, not a simple file rename or generic container conversion.', difficulty: 'Advanced', onlinePossible: false }
    ],
    repairTips: [
      'Preserve the original CAMREC and work on a copy; repairing or re-saving a Compound File can remove streams that Camtasia expects.',
      'Check for the OLE2 signature D0 CF 11 E0 A1 B1 1A E1 at byte offset 0 before treating the file as a valid CAMREC recording.',
      'If Camtasia reports a damaged recording, try the Camtasia version that created it and look for the original CAMPROJ project or backup copy.',
      'Do not rename .camrec to .mp4 or .avi. The extension change does not decode the embedded screen, audio, cursor, and event streams.'
    ],
    faqs: [
      { question: 'What is a CAMREC file?', answer: 'CAMREC is a legacy TechSmith Camtasia screen-recording container for Windows. It can store screen video, audio, cursor graphics, keyboard and event data, and recording metadata.' },
      { question: 'How do I open a CAMREC file?', answer: 'Open it with a compatible Windows installation of TechSmith Camtasia Studio, preferably the version that created it. Current Camtasia releases may not support every legacy CAMREC recording.' },
      { question: 'Can I open CAMREC on Mac?', answer: 'CAMREC was used by the Windows version of Camtasia. Older Mac Camtasia recordings used CMREC, and newer Camtasia releases use TREC. A Windows Camtasia environment is usually required for a CAMREC file.' },
      { question: 'How do I convert CAMREC to MP4?', answer: 'Import the CAMREC recording into a compatible Camtasia installation and export or produce it as MP4. Online conversion is unreliable because CAMREC is a proprietary container with embedded recording streams.' },
      { question: 'What is the CAMREC magic number?', answer: 'Most CAMREC files identified in format databases begin with the Microsoft Compound File signature D0 CF 11 E0 A1 B1 1A E1. This identifies the OLE2 container, not every internal Camtasia stream.' },
      { question: 'Is CAMREC the same as CAMPROJ or TREC?', answer: 'No. CAMREC is the raw recording container, CAMPROJ stores editing-project information, and TREC replaced CAMREC in newer Camtasia workflows.' }
    ]
  },
  {
    extension: 'MOV',
    name: 'Apple QuickTime Movie',
    category: 'Audio & Video',
    description: 'Apple QuickTime digital video container storing video, audio, text, and metadata streams.',
    detailedOverview: 'MOV is the QuickTime multimedia file format developed by Apple. It acts as a flexible video container capable of holding multiple tracks of video, audio, subtitles, and timecode tracks encoded using HEVC, H.264, or ProRes codecs.',
    mimeType: 'video/quicktime',
    magicBytesHex: '00 00 00 14 66 74 79 70 71 74 20 20 (ftypqt)',
    typicalSize: '50 MB – 8 GB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Standard multimedia video container format. Safe to play.',
    exampleUse: 'iPhone Video Recordings, Final Cut Pro Editing, Screen Recordings',
    featured: true,
    popularityScore: 95,
    developer: 'Apple Inc.',
    firstReleased: '1991',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'VLC Media Player', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'VideoLAN', slug: 'vlc' },
      { name: 'Apple QuickTime Player', os: ['mac'], isFree: true, developer: 'Apple Inc.', slug: 'quicktime' },
      { name: 'HandBrake Video Converter', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'HandBrake Team', slug: 'handbrake' }
    ],
    openingSteps: [
      { title: 'Play in VLC', desc: 'Open VLC Media Player and drag .mov video file directly into player window.' },
      { title: 'Mac Native', desc: 'Double click to play natively in QuickTime or Apple TV app.' }
    ],
    conversions: [
      { targetExtension: 'MP4', description: 'Convert QuickTime MOV video to web-standard MP4 (H.264/AAC).', difficulty: 'Easy', onlinePossible: true, converterSlug: 'mov-to-mp4' },
      { targetExtension: 'MP3', description: 'Extract audio track from MOV video into MP3 sound file.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'mov-to-mp3' }
    ],
    repairTips: ['Rebuild missing "moov" atom header chunk using untrunc or HandBrake re-encoding.']
  },
  {
    extension: 'MP4',
    name: 'MPEG-4 Part 14 Video File',
    category: 'Audio & Video',
    description: 'Universal digital video container standard for streaming, broadcasting, and web playback.',
    detailedOverview: 'MP4 (MPEG-4 Part 14) is the global standard digital multimedia container format created by ISO/IEC. It supports video streams (H.264, H.265, AV1), audio tracks (AAC, MP3), and subtitle captions.',
    mimeType: 'video/mp4',
    magicBytesHex: '00 00 00 18 66 74 79 70 69 73 6F 6D (ftypisom)',
    typicalSize: '15 MB – 2 GB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Global standard media format. Completely safe.',
    exampleUse: 'YouTube Videos, Streaming Movies, Web Video Clips',
    featured: true,
    popularityScore: 100,
    developer: 'ISO / IEC Group',
    firstReleased: '2001',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'VLC Media Player', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'VideoLAN', slug: 'vlc' },
      { name: 'Windows Media Player', os: ['windows'], isFree: true, developer: 'Microsoft', slug: 'windows-media-player' }
    ],
    openingSteps: [{ title: 'Universal Playback', desc: 'Plays natively on almost every phone, smart TV, browser, and OS.' }],
    conversions: [
      { targetExtension: 'MP3', description: 'Extract audio track from MP4 video file into MP3 sound.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'mp4-to-mp3' },
      { targetExtension: 'GIF', description: 'Convert short MP4 video loop into animated GIF graphic.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'mp4-to-gif' }
    ],
    repairTips: ['Use Untrunc or Repair Video tool if MP4 recording was interrupted before moov header was written.']
  },
  {
    extension: 'FLAC',
    name: 'Free Lossless Audio Codec',
    category: 'Audio & Video',
    description: 'Open-source audio format providing bit-for-bit lossless audio compression.',
    detailedOverview: 'FLAC (Free Lossless Audio Codec) is an open audio format created by Xiph.Org Foundation. Unlike lossy MP3 compression, FLAC compresses digital audio without dropping any acoustic frequency data.',
    mimeType: 'audio/flac',
    magicBytesHex: '66 4C 61 43 (fLaC)',
    typicalSize: '25 MB – 80 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Lossless audio container. Safe.',
    exampleUse: 'Audiophile Music Collections, Studio Master Recordings',
    popularityScore: 89,
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'VLC Media Player', os: ['windows', 'mac', 'linux', 'android', 'ios'], isFree: true, developer: 'VideoLAN', slug: 'vlc' },
      { name: 'Foobar2000', os: ['windows', 'android', 'ios'], isFree: true, developer: 'Peter Pawlowski', slug: 'foobar2000' }
    ],
    openingSteps: [{ title: 'Play in Foobar2000 or VLC', desc: 'Drag .flac audio file into Foobar2000 or VLC.' }],
    conversions: [{ targetExtension: 'MP3', description: 'Convert heavy lossless FLAC audio to compressed MP3 for mobile earbud listening.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'flac-to-mp3' }],
    repairTips: ['Check fLaC signature block at offset 0.']
  },

  // --- CODE & DATA ---
  {
    extension: 'JSON',
    name: 'JavaScript Object Notation',
    category: 'Code & Data',
    description: 'Lightweight text-based data interchange format based on key-value data structures.',
    detailedOverview: 'JSON (JavaScript Object Notation) is an open text-based standard format for representing structured data using attribute-value pairs and array data types. It is ubiquitous across RESTful web APIs and configuration management.',
    mimeType: 'application/json',
    magicBytesHex: '7B 22 (Text string: {" or [)',
    typicalSize: '2 KB – 10 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Plain text structured data. Safe.',
    exampleUse: 'Web API Responses, App Configuration Files, Database Exports',
    featured: true,
    popularityScore: 98,
    developer: 'Douglas Crockford',
    firstReleased: '2001',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'VS Code', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Microsoft', slug: 'vscode' },
      { name: 'Notepad++', os: ['windows'], isFree: true, developer: 'Don Ho', slug: 'notepad-plus-plus' },
      { name: 'Sublime Text', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Sublime HQ', slug: 'sublime-text' }
    ],
    openingSteps: [
      { title: 'Inspect in Browser', desc: 'Drag .json file into Chrome or Firefox to view formatted JSON tree.' },
      { title: 'Edit in VS Code', desc: 'Open in VS Code for syntax highlighting, linting, and JSON schema validation.' }
    ],
    conversions: [
      { targetExtension: 'CSV', description: 'Convert JSON array objects into tabular CSV spreadsheet format.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'json-to-csv' },
      { targetExtension: 'YAML', description: 'Convert JSON key-value tree to human-readable YAML file.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'json-to-yaml' }
    ],
    repairTips: ['Validate bracket matching ({}) and quotation marks using JSONLint or AnyFileX JSON Validator.']
  },
  {
    extension: 'CSV',
    name: 'Comma-Separated Values',
    category: 'Code & Data',
    description: 'Plain text file format organizing structured data into rows and comma-delimited columns.',
    detailedOverview: 'CSV (Comma-Separated Values) is a plain text format for storing tabular data (numbers and text). Each line of the file is a data record, with individual fields delimited by commas.',
    mimeType: 'text/csv',
    magicBytesHex: 'ASCII Text Data',
    typicalSize: '10 KB – 50 MB',
    dangerRating: 'Low Risk',
    dangerExplanation: 'Plain text. Beware of formula injection strings (=CMD) if opening in Excel.',
    exampleUse: 'Database Exports, Customer Mailing Lists, Financial Data Feed',
    popularityScore: 96,
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Microsoft Excel', os: ['windows', 'mac'], isFree: false, developer: 'Microsoft', slug: 'microsoft-excel' },
      { name: 'Google Sheets', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Google LLC', slug: 'google-sheets' }
    ],
    openingSteps: [{ title: 'Open in Excel or Sheets', desc: 'Double-click to open in Microsoft Excel or upload to Google Sheets.' }],
    conversions: [{ targetExtension: 'XLSX', description: 'Convert CSV data table into formatted Excel workbook with formatting.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'csv-to-xlsx' }],
    repairTips: ['Check text encoding (UTF-8 vs ANSI) if special characters or accents appear garbled.']
  },

  // --- EMAIL & COMM ---
  {
    extension: 'EML',
    name: 'RFC 822 Email Message Archive',
    category: 'Email & Comm',
    description: 'Standard RFC 822 email file format containing email headers, text body, and file attachments.',
    detailedOverview: 'EML is an email archive file format developed by Microsoft for Outlook Express and standardized under RFC 822. It contains raw Internet email headers, plain text body, HTML body, and MIME encoded file attachments.',
    mimeType: 'message/rfc822',
    magicBytesHex: '46 72 6F 6D 3A (ASCII text: From:)',
    typicalSize: '15 KB – 10 MB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'EML files can carry malicious email attachments or phishing links. Exercise caution when opening untrusted EML files.',
    exampleUse: 'Email Backups, Legal Discovery Archives, Customer Support Tickets',
    featured: true,
    popularityScore: 91,
    developer: 'IETF (RFC 822 Standard)',
    firstReleased: '1982',
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Mozilla Thunderbird', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Mozilla Foundation', slug: 'thunderbird' },
      { name: 'Microsoft Outlook 365', os: ['windows', 'mac'], isFree: false, developer: 'Microsoft', slug: 'outlook' },
      { name: 'Apple Mail', os: ['mac', 'ios'], isFree: true, developer: 'Apple Inc.', slug: 'apple-mail' }
    ],
    openingSteps: [
      { title: 'Open in Thunderbird', desc: 'Drag .eml file into Mozilla Thunderbird or Apple Mail.' },
      { title: 'View in AnyFileX EML Viewer', desc: 'Drop .eml into AnyFileX online tool to inspect email headers and extract attachments.' }
    ],
    conversions: [
      { targetExtension: 'PDF', description: 'Convert email text and headers into printable PDF record.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'eml-to-pdf' },
      { targetExtension: 'MSG', description: 'Convert EML to Outlook proprietary MSG file format.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'eml-to-msg' }
    ],
    repairTips: ['Open .eml file in plain text editor (Notepad) to inspect raw MIME boundary delimiters.']
  },

  // --- SYSTEM & EXECUTABLES ---
  {
    extension: 'ELG',
    name: 'ELG Event and Diagnostic Log File',
    category: 'System & Executables',
    description: 'ELG is a shared file extension used for event, diagnostic, telemetry, and data-logger files. IBM Integrated Management Module (IMM) logs are a common association, but the actual structure depends on the application that created the file.',
    detailedOverview: 'An .elg file is usually a structured log rather than one single standardized format. Common ELG variants record server events, severity levels, login activity, VPN or firewall diagnostics, wireless telemetry, equipment readings, or geospatial events. Some variants are readable UTF-8 or ASCII text, while others are XML, compressed, or proprietary binary data. Identify the producer before attempting to edit or convert the file.',
    mimeType: 'application/octet-stream',
    magicBytesHex: 'No universal signature; common IBM IMM logs begin with ASCII “Index” or text log content',
    typicalSize: '2 KB – 110 KB for common event logs; varies by producer',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'A legitimate ELG is normally data-only, but the extension is ambiguous and may contain compressed or proprietary content. Verify the file signature and scan untrusted downloads before opening them in diagnostic software.',
    exampleUse: 'IBM IMM server events, Qualcomm diagnostics, VPN/firewall logs, industrial data logging',
    popularityScore: 70,
    developer: 'Application-specific; commonly IBM IMM and other diagnostic systems',
    firstReleased: 'Application-dependent',
    osSupport: { windows: true, mac: true, linux: true, android: false, ios: false },
    popularApps: [
      { name: 'IBM Integrated Management Module (IMM)', os: ['windows', 'linux'], isFree: false, developer: 'IBM', slug: 'ibm-imm' },
      { name: 'Qualcomm QXDM / QCAT', os: ['windows'], isFree: false, developer: 'Qualcomm', slug: 'qualcomm-qxdm' },
      { name: 'Eschmann Datalogger Software', os: ['windows'], isFree: false, developer: 'Eschmann Technologies', slug: 'eschmann-datalogger' },
      { name: 'Campbell Scientific LoggerNet', os: ['windows', 'mac', 'linux'], isFree: false, developer: 'Campbell Scientific', slug: 'loggernet' },
      { name: 'Text Editor or Hex Viewer', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Various', slug: 'text-editor' }
    ],
    openingSteps: [
      { title: 'Identify the source system first', desc: 'Check the file name, folder, device, or support ticket that produced the .elg file. The suffix alone does not identify one format.' },
      { title: 'Open IBM IMM event logs with the management tools', desc: 'For server files such as spevents.elg, use the IBM IMM web interface or the IBM support utilities that exported the log.' },
      { title: 'Inspect text-based ELG files safely', desc: 'If the file contains readable text, open a copy in a plain-text editor or hex viewer. Do not save it back unless the producing application documents the format.' },
      { title: 'Use the original diagnostic or logger application', desc: 'Qualcomm, Eschmann, LoggerNet, VPN, SAP, Trimble, and geospatial ELG variants may require their own import or analysis software.' },
      { title: 'Verify the file locally in AnyFileX', desc: 'Use the File Identifier and Magic Byte Detector to inspect the header, MIME guess, printable text, and compression indicators without uploading the file.' }
    ],
    conversions: [
      { targetExtension: 'TXT', description: 'Extract readable text from text-based ELG logs for review or archival. Preserve the original file because binary variants may not round-trip.', difficulty: 'Easy', onlinePossible: true },
      { targetExtension: 'CSV', description: 'Export event fields to CSV only when the source application can parse the specific ELG variant into rows and columns.', difficulty: 'Medium', onlinePossible: false },
      { targetExtension: 'XML', description: 'Some ELG producers store XML data; use the producing application or an XML-aware tool rather than renaming the extension.', difficulty: 'Medium', onlinePossible: false }
    ],
    repairTips: [
      'Do not rename .elg to .txt, .xml, or .gz as a repair. Renaming changes only the label and can make the file harder for its original application to recognize.',
      'Keep an untouched backup and work on a copy; proprietary logs may be invalidated by text-editor line-ending or encoding changes.',
      'If an IBM IMM log is truncated, re-export it from the management interface or collect a fresh diagnostic bundle from the server.',
      'Check the first bytes and file entropy with AnyFileX to distinguish text, XML, compressed, and binary variants before choosing a recovery tool.'
    ],
    faqs: [
      { question: 'What is an ELG file?', answer: 'ELG is an ambiguous log-file extension used by IBM IMM and several unrelated diagnostic, telemetry, data-logger, VPN, firewall, SAP, geospatial, and industrial applications. The correct opener depends on the program that created the file.' },
      { question: 'How do I open an ELG file on Windows?', answer: 'First identify its source. IBM IMM event logs should be handled with IBM management tools; Qualcomm logs with QXDM or QCAT; Eschmann and LoggerNet logs with their corresponding applications. If it is plain text, a text editor can inspect a copy.' },
      { question: 'Does ELG have a standard magic number or MIME type?', answer: 'No. ELG is not one universal container. Some common IBM IMM logs begin with readable text such as “Index”, while other ELG files may be XML, compressed, or proprietary binary. application/octet-stream is the safest generic Content-Type when the producer is unknown.' },
      { question: 'Can I convert an ELG file to TXT or CSV?', answer: 'Text-based ELG files can often be read or exported as TXT. CSV export is application-dependent because the log fields and delimiters differ between producers. Do not simply change the extension.' },
      { question: 'Are ELG files safe?', answer: 'Most ELG files are data logs, not executable programs, but the extension is ambiguous. Scan files from untrusted sources, verify their header, and avoid opening them in privileged diagnostic software until the source is confirmed.' }
    ]
  },
  {
    extension: 'DAT',
    name: 'Generic Data File',
    category: 'System & Executables',
    description: 'Generic data file container holding raw text, binary configuration data, or Winmail attachments.',
    detailedOverview: 'DAT is a generic file extension assigned to files that store arbitrary data created by a specific application. It can contain plain text, binary database records, video streams, or Microsoft Outlook winmail.dat attachments.',
    mimeType: 'application/octet-stream',
    magicBytesHex: 'Varies by application signature',
    typicalSize: '1 KB – 50 MB',
    dangerRating: 'Medium Risk',
    dangerExplanation: 'Varies widely depending on source application. Inspect magic bytes before executing.',
    exampleUse: 'Application Settings, Game Save Data, Outlook Winmail Attachments',
    featured: true,
    popularityScore: 93,
    osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
    popularApps: [
      { name: 'Winmail.dat Reader', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'AnyFileX Tools', slug: 'winmail-reader' },
      { name: 'Notepad++ / HxD Hex Editor', os: ['windows'], isFree: true, developer: 'Don Ho / Maël Hörz', slug: 'hxd' }
    ],
    openingSteps: [
      { title: 'Inspect with Magic Byte Detector', desc: 'Drop .dat file into AnyFileX File Identifier tool to detect true file format.' },
      { title: 'Open in Text Editor', desc: 'Right click > Open with > Notepad to check if text strings exist.' }
    ],
    conversions: [{ targetExtension: 'TXT', description: 'Extract printable text strings from raw DAT file.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'dat-to-txt' }],
    repairTips: ['If winmail.dat from Outlook, use AnyFileX Winmail Extractor to retrieve embedded attachments.']
  }
];

/**
 * Editorial enrichment for the first thin-content remediation batch.
 * These additions are intentionally format-specific so the shared extension
 * template has useful source material instead of relying on generic copy.
 */
const EDITORIAL_ENRICHMENTS: Record<string, Partial<FileTypeInfo>> = {
  PDF: {
    detailedOverview: 'PDF is a page-description container designed to preserve layout, fonts, vector artwork, raster images, annotations, forms, and document metadata across operating systems. A PDF may be digitally born, scanned, encrypted, signed, or assembled from several source files, so two PDFs can behave very differently even though they share the same extension. Look for the %PDF- header before assuming a file is a readable document.',
    openingSteps: [
      { title: 'Check whether the PDF is protected', desc: 'Open a copy in a trusted viewer and check for a password prompt, certificate requirement, or permissions that restrict printing and editing.' },
      { title: 'View a damaged PDF safely', desc: 'Use a local PDF viewer or AnyFileX inspection tools first. Avoid repeatedly saving a damaged file because some viewers may overwrite recoverable object data.' }
    ],
    repairTips: [
      'If the file begins with %PDF- but will not open, try downloading it again and compare its byte size with the source before attempting repair.',
      'For scanned PDFs, OCR can recover searchable text but cannot restore missing image pixels or a truncated cross-reference table.',
      'Preserve the original file and work on a duplicate when repairing encrypted, signed, or business-critical documents.'
    ],
    faqs: [
      { question: 'Why does a PDF open as a blank page?', answer: 'A blank display can result from a damaged cross-reference table, missing fonts, a rendering issue, or a page containing only an image layer. Try another trusted viewer and inspect the file header before concluding that the content is missing.' },
      { question: 'Can I edit every PDF?', answer: 'No. Some PDFs contain selectable text and editable objects, while scanned PDFs contain page images. A password, digital signature, or permissions flag may also limit editing.' },
      { question: 'What is the first signature of a PDF file?', answer: 'Most PDF files begin with the ASCII header %PDF-, represented by the hexadecimal bytes 25 50 44 46 2D.' },
      { question: 'Is converting PDF to Word always accurate?', answer: 'Conversion quality depends on whether the PDF contains real text, embedded fonts, tables, columns, or scanned images. OCR-based conversion can introduce recognition and layout errors.' }
    ]
  },
  ZIP: {
    detailedOverview: 'ZIP is an archive container that groups one or more files with a central directory describing names, offsets, compression methods, timestamps, and optional encryption. The familiar PK header is common but not sufficient to prove that an archive is complete; the end-of-central-directory record must also be readable. ZIP archives may contain ordinary files, application packages, backups, or nested archives.',
    openingSteps: [
      { title: 'Inspect the archive before extracting', desc: 'Check the source, filename, size, and security software status. List its contents before opening unknown executables, scripts, or macro-enabled documents.' },
      { title: 'Open a multi-part ZIP set', desc: 'Keep every numbered segment in one folder and start extraction from the first segment. Missing parts cannot be recreated by renaming a file.' }
    ],
    repairTips: [
      'A ZIP can contain readable entries even when its central directory is damaged; try listing or extracting individual files before discarding it.',
      'CRC errors usually identify a damaged member, while an end-of-central-directory error often indicates truncation or an incomplete download.',
      'Do not repair an archive by changing its extension. Re-download it or ask the sender for a fresh export when the source is available.'
    ],
    faqs: [
      { question: 'What does the PK signature mean in a ZIP file?', answer: 'PK identifies the ZIP format through the initials of Phil Katz, whose PKZIP software popularized the format. Common local-file headers begin with hexadecimal 50 4B 03 04.' },
      { question: 'Why does Windows say a ZIP folder is invalid?', answer: 'The archive may be incomplete, corrupted, encrypted in an unsupported way, or split into parts. Compare the downloaded size with the source and try a maintained archive utility.' },
      { question: 'Can a ZIP file contain malware?', answer: 'Yes. ZIP is a container and may carry executable files, scripts, shortcuts, or malicious documents. Scan it and inspect its file list before extracting or running anything.' },
      { question: 'Does converting ZIP to RAR improve damaged files?', answer: 'No. Repackaging cannot restore missing bytes. It may create a new archive only when the original contents can still be extracted.' }
    ]
  },
  DOCX: {
    detailedOverview: 'DOCX is an Office Open XML package stored as a ZIP-based collection of XML parts and media files. Its document text, styles, relationships, headers, footers, comments, charts, and images are stored in separate package members. This structure makes DOCX portable but also means that a damaged relationship or missing XML part can affect only one feature of an otherwise readable document.',
    openingSteps: [
      { title: 'Open in a compatible editor', desc: 'Use Microsoft Word, LibreOffice Writer, or a trusted browser office suite. Confirm the document source before enabling macros or external links.' },
      { title: 'Inspect a damaged DOCX', desc: 'Make a copy, then try opening it with another compatible editor. Because DOCX is a ZIP package, a ZIP listing can reveal whether core document parts are still present.' }
    ],
    repairTips: [
      'Use Word’s Open and Repair option before manually editing the package contents.',
      'If only images are needed, inspect the media folder in a copy of the DOCX package; this may recover embedded assets even when the document body is damaged.',
      'Keep track changes, comments, and external relationships in mind when removing damaged package parts because they may change the document layout.'
    ],
    faqs: [
      { question: 'Is DOCX the same as DOC?', answer: 'No. DOC is the older binary Word format, while DOCX is an XML-based package introduced with newer versions of Microsoft Office.' },
      { question: 'Can I open DOCX without Microsoft Word?', answer: 'Yes. LibreOffice, Google Docs, Apple Pages, and several browser-based editors can open DOCX, although advanced layout and feature compatibility may vary.' },
      { question: 'Why is a DOCX file actually a ZIP archive?', answer: 'DOCX uses ZIP compression to package XML document parts, relationships, styles, images, and metadata into one portable file.' },
      { question: 'Are DOCX files safe to open?', answer: 'DOCX files can contain macros, external links, and embedded objects. Keep macros disabled for untrusted documents and scan files before opening them.' }
    ]
  },
  XLSX: {
    detailedOverview: 'XLSX is an Office Open XML workbook package containing worksheets, shared strings, styles, formulas, charts, pivot metadata, relationships, and optional external connections. The visible spreadsheet is only one part of the package. Formula recalculation, unsupported features, hidden sheets, and linked workbooks can change how the same XLSX behaves in Excel, LibreOffice, and browser editors.',
    openingSteps: [
      { title: 'Open without refreshing external data', desc: 'When opening an unfamiliar workbook, keep external links, data connections, and macros disabled until the source is verified.' },
      { title: 'Recover a damaged workbook', desc: 'Try Excel’s Open and Repair command, then test a copy in LibreOffice Calc. If the package is readable, individual worksheets or shared strings may still be recoverable.' }
    ],
    repairTips: [
      'A workbook that opens with a repair log may have a damaged worksheet, style table, drawing, or relationship rather than a completely lost file.',
      'Do not overwrite the original after a repair attempt; Excel may remove unsupported or damaged objects when saving.',
      'If formulas show stale values, check calculation mode and external links before assuming the numeric data itself is corrupted.'
    ],
    faqs: [
      { question: 'What is the difference between XLS and XLSX?', answer: 'XLS is the older binary Excel workbook format. XLSX is the newer XML-based package and normally does not contain VBA macros.' },
      { question: 'Can XLSX files contain viruses?', answer: 'XLSX files can carry risky external links, embedded objects, and formula-based attacks even though standard XLSX does not support VBA macros. Treat unexpected workbooks cautiously.' },
      { question: 'Why does XLSX show different values in different programs?', answer: 'Differences can come from formula engines, unsupported functions, date systems, formatting, locale settings, or external data connections.' },
      { question: 'How can I open XLSX without Excel?', answer: 'LibreOffice Calc, Apple Numbers, Google Sheets, and compatible browser editors can open XLSX files. Complex workbooks should be checked in the original application when possible.' }
    ]
  },
  MP4: {
    detailedOverview: 'MP4 is a media container based on ISO Base Media File Format. It can hold video, audio, subtitles, metadata, timed text, and multiple codec tracks; the .mp4 extension alone does not identify the exact video codec or playback requirements. Common combinations include H.264 video with AAC audio, but HEVC, AV1, alternate audio tracks, and fragmented streaming layouts are also possible.',
    openingSteps: [
      { title: 'Check codec compatibility', desc: 'If the file opens with sound but no picture, or picture but no sound, inspect its video and audio codecs rather than changing the extension.' },
      { title: 'Play an incomplete recording', desc: 'A partially downloaded MP4 may fail because its metadata is stored at the end of the file. Re-download the source when possible before attempting a repair.' }
    ],
    repairTips: [
      'A valid MP4 commonly begins with an ftyp box, but a correct header does not guarantee that every media sample or the moov index is intact.',
      'Screen recordings and camera files may need their metadata index rebuilt after an interrupted write; use a tool designed for the specific codec and recording device.',
      'Avoid repeatedly re-encoding a damaged video because conversion can discard recoverable streams and reduce quality.'
    ],
    faqs: [
      { question: 'Is MP4 a video codec?', answer: 'No. MP4 is a container. The actual video and audio codecs are stored as tracks inside it, so two MP4 files may require different playback support.' },
      { question: 'Why does an MP4 have no sound?', answer: 'The audio track may use an unsupported codec, be muted or damaged, or be missing from the container. Media inspection can distinguish these cases.' },
      { question: 'Can I play MP4 files in a browser?', answer: 'Most current browsers support common MP4 combinations such as H.264 video with AAC audio. Less common codecs may require a desktop player or conversion.' },
      { question: 'Will converting MP4 to another format repair it?', answer: 'Only if the source contains a readable media stream. Conversion cannot recover frames that were never written or were lost through truncation.' }
    ]
  },
  RAR: {
    detailedOverview: 'RAR is a compressed archive format designed for packing files into one container while reducing storage and transfer size. It supports solid compression, recovery records, encryption, comments, and multi-volume archives. A RAR file may be one part of a larger set, so the presence of a single .rar file does not always mean the archive is complete.',
    openingSteps: [
      { title: 'Check for numbered archive parts', desc: 'Look for files such as .part1.rar, .part2.rar, or .r00 in the same folder. Start extraction from the first volume and keep every part together.' },
      { title: 'Preview contents before extraction', desc: 'Use a maintained archive utility to list files first, especially when the archive came from an unknown source or contains programs and scripts.' }
    ],
    repairTips: [
      'Recovery records can reconstruct some damaged RAR data, but they cannot replace an entirely missing volume.',
      'If extraction reports a CRC error, identify the specific member and try repairing or re-downloading that archive part.',
      'Never rename a RAR file to ZIP as a repair; the compression structures are different.'
    ],
    faqs: [
      { question: 'How do I open a RAR file?', answer: 'Use a compatible archive utility such as WinRAR, 7-Zip, The Unarchiver, or another maintained tool. Multi-part archives must be kept together.' },
      { question: 'Why does my RAR archive say a volume is missing?', answer: 'The archive is split across several files and one or more parts are absent, renamed, or stored in another folder. Obtain the complete set from the source.' },
      { question: 'Can a RAR file contain malware?', answer: 'Yes. Archives can contain executable files, scripts, and malicious documents. Scan the archive and inspect its contents before extracting or running anything.' },
      { question: 'Can a damaged RAR file be repaired?', answer: 'Sometimes. RAR recovery records may restore damaged blocks, but success depends on the archive settings and the amount of missing or corrupted data.' }
    ]
  },
  '7Z': {
    detailedOverview: '7Z is the native archive format of 7-Zip. It supports strong LZMA and LZMA2 compression, solid archives, AES-256 encryption, Unicode filenames, and multiple compression methods. Solid compression can produce excellent size reduction but may require more processing when extracting a single file or recovering from damage.',
    openingSteps: [
      { title: 'Open with 7-Zip or a compatible utility', desc: 'Use 7-Zip, PeaZip, or another maintained archive program. Keep the original archive unchanged while testing extraction.' },
      { title: 'Inspect encrypted archives carefully', desc: 'A password is required for encrypted entries, and filenames may also be encrypted. Do not upload sensitive archives to an unknown online extractor.' }
    ],
    repairTips: [
      'A 7Z header can be valid even when compressed data later in the archive is damaged; try extracting unaffected entries first.',
      'Solid archives may make one damaged block affect several files, so re-downloading is often more reliable than repeated repair attempts.',
      'Verify the checksum supplied by the source before diagnosing a 7Z archive as corrupt.'
    ],
    faqs: [
      { question: 'What is a 7Z file used for?', answer: '7Z stores one or more files in a compressed archive, often providing better compression than ZIP for large collections and technical data.' },
      { question: 'Can Windows open 7Z files?', answer: 'Windows does not provide universal native 7Z extraction in every version. 7-Zip, PeaZip, and similar utilities can open them.' },
      { question: 'Is 7Z more secure than ZIP?', answer: '7Z can use strong AES-256 encryption, but security depends on the password, software, and how the archive is shared. Encryption does not make untrusted contents safe.' },
      { question: 'Why is extracting one file from a 7Z archive slow?', answer: 'The archive may use solid compression, which requires reading earlier compressed data before reaching the requested file.' }
    ]
  },
  FLAC: {
    detailedOverview: 'FLAC is a lossless audio codec and container that reduces PCM audio size without discarding information. It stores stream metadata such as sample rate, channel count, bit depth, Vorbis comments, embedded pictures, and seek points. Unlike lossy formats, decoding a valid FLAC reproduces the original PCM samples exactly.',
    openingSteps: [
      { title: 'Play FLAC in a compatible player', desc: 'Use VLC, foobar2000, MusicBee, Audacity, or a current mobile and desktop player with FLAC support.' },
      { title: 'Check tags separately from audio', desc: 'If the sound plays but album art or artist information is missing, inspect the Vorbis comments and embedded-picture metadata rather than re-encoding the track.' }
    ],
    repairTips: [
      'Use a FLAC verification or test-decode command to detect corrupted audio frames without changing the file.',
      'If only metadata is damaged, recover tags from the original library or a trusted music database before converting the audio.',
      'Avoid converting a damaged FLAC to another lossless format and back; conversion cannot recreate missing frames.'
    ],
    faqs: [
      { question: 'Is FLAC better quality than MP3?', answer: 'FLAC is lossless, so it preserves the source PCM samples. MP3 is lossy and normally produces smaller files by removing audio information.' },
      { question: 'Can I play FLAC on an iPhone or Mac?', answer: 'macOS applications and many third-party iOS players support FLAC. Apple’s built-in music workflows may prefer ALAC, so conversion can be useful for library compatibility.' },
      { question: 'Does converting FLAC to WAV improve quality?', answer: 'No. Both can preserve the audio samples, but WAV is usually larger and may carry less convenient metadata.' },
      { question: 'How do I know if a FLAC file is corrupted?', answer: 'A decoder or integrity test can verify the stream. Playback interruptions, checksum failures, or a truncated STREAMINFO block are common signs of corruption.' }
    ]
  },
  CSV: {
    detailedOverview: 'CSV is a text interchange format for tabular data, but it has no single universal dialect. Files differ in delimiter, quoting rules, line endings, character encoding, header conventions, and handling of embedded newlines. A CSV that looks correct in one spreadsheet may shift columns or reinterpret dates and leading zeros in another application.',
    openingSteps: [
      { title: 'Inspect encoding and delimiter first', desc: 'Open a copy in a text editor or import wizard. Confirm UTF-8 versus another encoding, comma versus semicolon delimiters, and whether the first row contains headers.' },
      { title: 'Import instead of double-clicking', desc: 'Use the spreadsheet import dialog for identifiers, ZIP codes, dates, and large numbers so the application does not silently reformat values.' }
    ],
    repairTips: [
      'A malformed quote can make the rest of a CSV appear in one column; locate unmatched quotation marks before changing delimiters.',
      'Preserve leading zeros and long identifiers as text during import because spreadsheet auto-formatting can permanently change their displayed values.',
      'Keep the original encoding and line endings when repairing a CSV used by an automated data pipeline.'
    ],
    faqs: [
      { question: 'What does CSV stand for?', answer: 'CSV means comma-separated values. In practice, many CSV files use semicolons, tabs, or another delimiter, so the separator should be detected rather than assumed.' },
      { question: 'Why does a CSV open in one column?', answer: 'The spreadsheet selected the wrong delimiter, encoding, or quoting mode. Re-import the file and choose the separator used by the source.' },
      { question: 'Can CSV store formatting or multiple worksheets?', answer: 'No. CSV primarily stores text values in rows and columns. Formatting, formulas, charts, and multiple sheets require a workbook format such as XLSX.' },
      { question: 'Is CSV safe to open?', answer: 'CSV is plain text, but spreadsheet programs may interpret values beginning with characters such as =, +, -, or @ as formulas. Import untrusted CSV files carefully.' }
    ]
  },
  JSON: {
    detailedOverview: 'JSON is a structured text format built from objects, arrays, strings, numbers, booleans, and null. It is widely used for APIs, configuration, exports, and application data. Standard JSON requires double-quoted property names and does not allow comments or trailing commas, although many tools support non-standard JSON variants such as JSON5.',
    openingSteps: [
      { title: 'Validate before editing', desc: 'Use a JSON-aware editor or validator to identify the exact line and character where parsing fails. Preserve a copy before applying automatic formatting.' },
      { title: 'Check the expected schema', desc: 'Valid syntax does not guarantee valid application data. Confirm required keys, value types, nesting, and version fields with the producing application or API documentation.' }
    ],
    repairTips: [
      'Look for an unmatched brace, bracket, quote, or trailing comma near the parser’s reported location.',
      'Do not remove unknown fields blindly; they may be required for forward compatibility even if an older application does not use them.',
      'For large JSON files, stream or parse a copy rather than opening it in a text editor that may truncate or reformat the file.'
    ],
    faqs: [
      { question: 'Is JSON a programming language?', answer: 'No. JSON is a text data-interchange format. Programming languages provide parsers and serializers for reading and writing it.' },
      { question: 'Why is my JSON invalid?', answer: 'Common causes include single quotes, missing commas, unmatched braces, comments, trailing commas, and unescaped control characters.' },
      { question: 'What is the difference between JSON and JSON5?', answer: 'JSON5 is a relaxed extension that may allow comments, trailing commas, and unquoted keys. A strict JSON parser may reject those features.' },
      { question: 'Can JSON contain binary files?', answer: 'JSON has no native binary type. Applications commonly encode binary data as Base64 strings, but this increases size and requires an agreed schema.' }
    ]
  },
  MOV: {
    detailedOverview: 'MOV is the QuickTime File Format, a media container that can hold video, audio, timecode, subtitles, metadata, and editing references. It is closely related to ISO Base Media File Format, but compatibility depends on the codecs and track structures inside the container. Professional cameras and editors may use MOV for high-quality or metadata-rich recordings.',
    openingSteps: [
      { title: 'Inspect the tracks and codecs', desc: 'If a player reports an unsupported format, identify the video and audio codecs inside the MOV rather than assuming the container itself is damaged.' },
      { title: 'Open camera or editing MOV files carefully', desc: 'Use the application that created the file when possible; professional MOV files may contain timecode, proxy, alpha, or edit-list data that simpler players ignore.' }
    ],
    repairTips: [
      'An interrupted recording may have a missing or incomplete moov index. Rebuild metadata only on a copy and with a tool suited to the camera or recorder.',
      'Do not change .mov to .mp4 by renaming; the tracks may remain incompatible even when both use related container structures.',
      'Preserve timecode and original metadata when the MOV is part of a professional editing workflow.'
    ],
    faqs: [
      { question: 'What is the difference between MOV and MP4?', answer: 'Both are media containers, but MOV is associated with QuickTime and Apple editing workflows. Actual compatibility depends on the codecs, tracks, and metadata inside each file.' },
      { question: 'Why will a MOV play on Mac but not Windows?', answer: 'The Windows player may lack the required codec, support for a professional track, or a compatible renderer. Try a current cross-platform player or transcode the file.' },
      { question: 'Can MOV contain audio only?', answer: 'Yes. MOV can contain different media tracks, including audio, video, timecode, and metadata.' },
      { question: 'Will converting MOV to MP4 reduce quality?', answer: 'It can if the video is re-encoded with lossy settings. A compatible remux may preserve streams, but not every MOV track can be copied directly into MP4.' }
    ]
  },
  SVG: {
    detailedOverview: 'SVG is an XML-based vector graphics format built from paths, shapes, text, gradients, filters, masks, and reusable symbols. Because it is text and can contain external references or scripting, SVG combines the benefits of resolution-independent graphics with security and compatibility considerations that do not apply to a simple bitmap image.',
    openingSteps: [
      { title: 'Preview untrusted SVG as text first', desc: 'Inspect a copy for scripts, event handlers, external references, and unexpected links before rendering it in a browser or design application.' },
      { title: 'Choose an editor for the intended task', desc: 'Use Inkscape or Illustrator for vector editing, a browser for previewing, and a code editor for controlled XML or CSS changes.' }
    ],
    repairTips: [
      'Validate XML and check for an unclosed svg, path, style, or defs element when the image renders blank.',
      'External fonts, linked images, and filters may fail when an SVG is moved; embed required assets when portability matters.',
      'Sanitize scripts and external references before publishing an SVG supplied by an unknown source.'
    ],
    faqs: [
      { question: 'Is SVG better than PNG?', answer: 'SVG is usually better for logos, icons, and diagrams that need to scale. PNG is better for pixel-based screenshots, photographs, and guaranteed bitmap rendering.' },
      { question: 'Can SVG files contain malware?', answer: 'SVG can contain scripts, event handlers, and external references. Treat untrusted SVG as active content and sanitize it before opening or publishing it.' },
      { question: 'Why does my SVG look different in different apps?', answer: 'Applications can differ in CSS, font availability, filter support, scripting, and external-resource handling. Converting text to paths can improve consistency but reduces editability.' },
      { question: 'How do I convert SVG to PNG?', answer: 'Use a vector editor, browser-based converter, or image tool and choose the required output dimensions and background transparency.' }
    ]
  },
  WEBP: {
    detailedOverview: 'WebP is a modern image format that supports lossy and lossless compression, alpha transparency, animation, and metadata. It is based on RIFF and uses VP8-family image coding. The same extension may represent a static lossy image, a lossless image, or an animated WebP, so the internal chunks matter when diagnosing compatibility.',
    openingSteps: [
      { title: 'Open in a current browser or image viewer', desc: 'Chrome, Edge, Firefox, Safari, and many current image applications support WebP. Update the viewer if thumbnails or animation do not appear.' },
      { title: 'Check animation and transparency', desc: 'Before converting, confirm whether the file contains animation or an alpha channel so the chosen output format can preserve the required features.' }
    ],
    repairTips: [
      'Verify RIFF at the beginning and WEBP at the expected chunk position; a truncated RIFF size field can prevent decoding.',
      'If only a thumbnail is needed, extract or regenerate it without repeatedly re-encoding the original image.',
      'Keep an animated WebP as a copy before converting because JPEG and ordinary PNG do not preserve animation.'
    ],
    faqs: [
      { question: 'Is WebP smaller than JPG?', answer: 'WebP can be smaller at similar visual quality, but the result depends on image content, encoder settings, and whether the image uses lossy or lossless compression.' },
      { question: 'Does WebP support transparency?', answer: 'Yes. WebP supports alpha transparency in both lossless and lossy workflows.' },
      { question: 'Can WebP be animated?', answer: 'Yes. Animated WebP can store multiple frames, timing, and transparency. Check the file before converting it to a single-frame format.' },
      { question: 'Why will an older program not open WebP?', answer: 'Older software may not include a WebP decoder. Convert it to PNG or JPEG, or install a maintained image plugin or viewer.' }
    ]
  },
  TIFF: {
    detailedOverview: 'TIFF is a flexible tagged-image container used for scans, publishing, photography, and scientific or medical imagery. It can store multiple pages, high bit depths, color profiles, alpha channels, and several compression methods including uncompressed, LZW, Deflate, and JPEG. Compatibility depends on the tags and compression used by the producing application.',
    openingSteps: [
      { title: 'Check whether the TIFF is multi-page', desc: 'Some viewers show only the first image. Use a TIFF-aware application when the file is a scanned document or image stack.' },
      { title: 'Preserve color and bit depth', desc: 'For print or scientific work, confirm the color profile, channel depth, and compression before converting to a simpler image format.' }
    ],
    repairTips: [
      'The byte order and 42 marker in the TIFF header help identify the container, but they do not prove that every image directory is intact.',
      'If one page is damaged, extract readable pages to a new TIFF or PDF while preserving the original multi-page file.',
      'Avoid opening and resaving archival TIFFs in applications that silently reduce bit depth or discard metadata.'
    ],
    faqs: [
      { question: 'Is TIFF lossless?', answer: 'TIFF can be lossless or uncompressed, but it can also contain JPEG-compressed image data. The compression tag must be checked.' },
      { question: 'Why is a TIFF file so large?', answer: 'TIFF is often used for high-resolution images, multiple pages, high bit depth, or uncompressed data. Lossless compression can reduce size without discarding pixels.' },
      { question: 'Can TIFF store multiple pages?', answer: 'Yes. Multi-page TIFF is commonly used for scanned documents and image sequences, although not every viewer displays every page.' },
      { question: 'Should I convert TIFF to JPG?', answer: 'Convert when broad sharing or smaller size matters. Keep the TIFF as the master when preserving print quality, layers of metadata, or high bit depth is important.' }
    ]
  },
  EPUB: {
    detailedOverview: 'EPUB is a reflowable electronic-publication package built from XHTML or HTML content, CSS, images, fonts, metadata, and navigation files. EPUB 2 and EPUB 3 differ in supported features, and a book may include fixed-layout pages, audio, JavaScript, DRM, or accessibility metadata. The extension alone does not indicate whether a device can render every feature.',
    openingSteps: [
      { title: 'Open with an EPUB reader', desc: 'Use Apple Books, Thorium, Calibre, Kobo software, or another maintained reader. Keep DRM restrictions in mind when moving books between devices.' },
      { title: 'Inspect the package contents', desc: 'An EPUB is a ZIP-based package. Work on a copy and inspect its metadata and content files when diagnosing missing chapters, fonts, or navigation.' }
    ],
    repairTips: [
      'Validate the EPUB package structure before editing XHTML or CSS; a missing mimetype or broken container relationship can prevent the whole book from opening.',
      'If only one chapter is missing, recover the relevant XHTML and media files from a backup rather than rebuilding the entire book.',
      'Do not remove DRM or alter protected publications without authorization from the rights holder.'
    ],
    faqs: [
      { question: 'What is an EPUB file used for?', answer: 'EPUB is an electronic-book format that packages text, layout, images, fonts, metadata, and navigation for compatible reading applications.' },
      { question: 'Can Kindle open EPUB files?', answer: 'Many Kindle workflows accept EPUB through supported transfer or conversion services, but device support and DRM handling vary. Check the current requirements for the target device.' },
      { question: 'Why does an EPUB open with missing images?', answer: 'The package may contain broken paths, missing media files, unsupported formats, or an invalid content relationship. Validate a copy of the package.' },
      { question: 'Can I convert EPUB to PDF?', answer: 'Yes, but PDF uses fixed pages while EPUB is usually reflowable. Conversion may change pagination, fonts, navigation, and accessibility features.' }
    ]
  }
};

export const POPULAR_FILE_TYPES: FileTypeInfo[] = BASE_POPULAR_FILE_TYPES.map((format) => {
  const enrichment = EDITORIAL_ENRICHMENTS[format.extension];
  if (!enrichment) return format;
  return {
    ...format,
    ...enrichment,
    openingSteps: [...format.openingSteps, ...(enrichment.openingSteps || [])],
    repairTips: [...format.repairTips, ...(enrichment.repairTips || [])],
    faqs: [...(format.faqs || []), ...(enrichment.faqs || [])]
  };
});
