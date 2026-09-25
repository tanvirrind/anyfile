import { FileTypeInfo } from '../types';

export const POPULAR_FILE_TYPES: FileTypeInfo[] = [
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
