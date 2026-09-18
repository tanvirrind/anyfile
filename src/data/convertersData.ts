import { ConverterInfo } from '../types';

export const CONVERTERS_LIST: ConverterInfo[] = [
  {
    id: 'heic-to-jpg',
    fromExt: 'HEIC',
    toExt: 'JPG',
    name: 'HEIC to JPG Converter',
    category: 'Images',
    description: 'Convert Apple iPhone HEIC photos into universally compatible JPEG images instantly.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Near Lossless',
    steps: [
      { title: 'Upload or Drag HEIC File', desc: 'Select one or multiple .heic photos from your iPhone or Mac storage.' },
      { title: 'Adjust Compression Ratio', desc: 'Choose output JPEG quality preset (High 90%, Balanced 80%, Web 70%).' },
      { title: 'Download Converted JPG', desc: 'Click Download to save your instant JPG photo file.' }
    ],
    recommendedApps: ['CopyTrans HEIC for Windows', 'Adobe Photoshop 2024', 'iMazing HEIC Converter'],
    commonIssues: [
      'Original EXIF metadata (GPS coordinates, camera model) stripping.',
      'Color space shifting if HEIC uses Display P3 instead of sRGB.'
    ],
    faqs: [
      { question: 'Does HEIC to JPG conversion reduce photo quality?', answer: 'Converting from HEIC to JPEG involves slight lossy re-encoding, but at 90%+ quality settings the visual difference is imperceptible.' },
      { question: 'Is my photo private during web conversion?', answer: 'Yes! AnyFileX converts HEIC images directly inside your browser memory using WebAssembly. No photos are uploaded to external servers.' }
    ]
  },
  {
    id: 'heic-to-pdf',
    fromExt: 'HEIC',
    toExt: 'PDF',
    name: 'HEIC to PDF Document Converter',
    category: 'Images',
    description: 'Convert Apple iPhone HEIC photos, receipts, and scans into printable PDF documents in seconds.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Upload HEIC Image', desc: 'Drag and drop your .heic photo into the browser converter.' },
      { title: 'Configure Page Layout', desc: 'Auto-detect orientation (Portrait or Landscape) to match photo dimensions.' },
      { title: 'Export PDF File', desc: 'Download high-resolution PDF document ready for printing or legal archiving.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Adobe Acrobat Pro', 'Apple Preview'],
    commonIssues: ['Large photos creating multi-megabyte PDFs if not optimized.'],
    faqs: [
      { question: 'Can I combine multiple HEIC files into one PDF?', answer: 'Yes, AnyFileX allows you to batch convert multiple HEIC photos into a unified multi-page PDF document.' },
      { question: 'Is HEIC to PDF conversion secure?', answer: 'Yes. All PDF generation runs entirely in client-side browser memory via jsPDF. No files are transmitted across the network.' }
    ]
  },
  {
    id: 'dwg-to-pdf',
    fromExt: 'DWG',
    toExt: 'PDF',
    name: 'DWG to PDF Blueprint Converter',
    category: 'CAD & 3D',
    description: 'Convert AutoCAD DWG drawings and technical blueprints into vector PDF documents.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Drop CAD Drawing', desc: 'Drag your AutoCAD .dwg blueprint or technical drawing into converter.' },
      { title: 'Select Layout & Line Weight', desc: 'Pick Model Space or Layout Tab and configure monochrome or color pen tables.' },
      { title: 'Generate High-Res Vector PDF', desc: 'Download crystal-clear vector PDF suitable for large format printing.' }
    ],
    recommendedApps: ['Autodesk DWG TrueView', 'AutoCAD Web', 'Any DWG to PDF Converter'],
    commonIssues: [
      'Missing external reference drawings (XREFs) showing blank spots in PDF.',
      'Missing CAD font files (.shx) causing text to render as default sans-serif.'
    ],
    faqs: [
      { question: 'Will line weights and layers be preserved in PDF?', answer: 'Yes, converting DWG to vector PDF preserves vector geometry, line thickness, and embedded drawing layers.' }
    ]
  },
  {
    id: 'dwg-to-dxf',
    fromExt: 'DWG',
    toExt: 'DXF',
    name: 'DWG to DXF CAD Vector Converter',
    category: 'CAD & 3D',
    description: 'Convert binary AutoCAD DWG drawings into open ASCII DXF format for CNC routing, laser cutting, and third-party CAD modeling.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Upload DWG Drawing', desc: 'Drag or select your AutoCAD .dwg blueprint into the converter.' },
      { title: 'Configure DXF ASCII Revision', desc: 'Select standard AutoCAD 2018 or R12 DXF output for maximum machine compatibility.' },
      { title: 'Download Open DXF', desc: 'Download your open vector DXF file ready for CNC milling or alternative CAD tools.' }
    ],
    recommendedApps: ['Autodesk DWG TrueView', 'LibreCAD', 'Any DWG to DXF Converter', 'QCAD'],
    commonIssues: [
      'Complex 3D ACIS solid primitives may be converted to polygon wireframes in older DXF revisions.',
      'Line type scales ($LTSCALE) may display differently in third-party viewers without matching font files.'
    ],
    faqs: [
      { question: 'What is the main difference between DWG and DXF?', answer: 'DWG is Autodesk\'s proprietary binary database format, while DXF is an open tagged ASCII text format designed for cross-program exchange and CNC machinery.' },
      { question: 'Will layers and coordinates be preserved?', answer: 'Yes, converting DWG to DXF preserves all 2D vector polylines, layers, line colors, blocks, and coordinate dimensions.' }
    ]
  },
  {
    id: 'psd-to-jpg',
    fromExt: 'PSD',
    toExt: 'JPG',
    name: 'PSD to JPG Flattening Converter',
    category: 'Images',
    description: 'Flatten Adobe Photoshop PSD layer compositions into crisp JPEG graphics.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Near Lossless',
    steps: [
      { title: 'Select PSD File', desc: 'Choose layered .psd project file.' },
      { title: 'Choose Output Resolution', desc: 'Select 100% original dimensions or scale down for web sharing.' },
      { title: 'Export JPG Image', desc: 'Flatten all adjustment layers and download flat JPEG image.' }
    ],
    recommendedApps: ['Photopea', 'Adobe Photoshop', 'GIMP'],
    commonIssues: ['Transparent background areas convert to solid white in JPEG.'],
    faqs: [{ question: 'How can I keep transparent backgrounds?', answer: 'Use PSD to PNG conversion instead of JPG if your design contains transparency.' }]
  },
  {
    id: 'step-to-stl',
    fromExt: 'STEP',
    toExt: 'STL',
    name: 'STEP to STL 3D Printing Converter',
    category: 'CAD & 3D',
    description: 'Convert ISO 10303 STEP solid CAD assemblies into tessellated STL meshes for 3D slicers.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Near Lossless',
    steps: [
      { title: 'Upload STEP Model', desc: 'Drag .step or .stp CAD file.' },
      { title: 'Set Mesh Tolerance', desc: 'Adjust angular chord tolerance for fine curved surfaces.' },
      { title: 'Download STL Mesh', desc: 'Export STL ready for PrusaSlicer, Cura, or Bambu Studio.' }
    ],
    recommendedApps: ['FreeCAD', 'Autodesk Fusion 360', 'MeshLab'],
    commonIssues: ['Facet tessellation being too coarse, showing polygon lines on round cylinders.'],
    faqs: [{ question: 'Can I 3D print a STEP file directly?', answer: 'Most slicers require STL, 3MF, or OBJ meshes. Converting STEP to STL creates the triangular facets slicers need.' }]
  },
  {
    id: 'svg-to-png',
    fromExt: 'SVG',
    toExt: 'PNG',
    name: 'SVG to PNG Rasterizer',
    category: 'Images',
    description: 'Rasterize scalable vector SVG graphics into high DPI PNG images with transparent backgrounds.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Drag SVG File', desc: 'Select .svg vector file.' },
      { title: 'Choose DPI & Width', desc: 'Set target width (e.g. 1024px, 2048px, or 4K Retina).' },
      { title: 'Download PNG', desc: 'Save lossless transparent PNG graphic.' }
    ],
    recommendedApps: ['Inkscape', 'Adobe Illustrator', 'Figma'],
    commonIssues: ['Custom embedded web fonts failing to render if not converted to vector path outlines.'],
    faqs: [{ question: 'Why convert SVG to PNG?', answer: 'Some older apps, social platforms, and email clients do not display vector SVG files.' }]
  },
  {
    id: 'png-to-webp',
    fromExt: 'PNG',
    toExt: 'WEBP',
    name: 'PNG to WebP Image Compressor',
    category: 'Images',
    description: 'Compress heavy PNG images into lightweight Google WebP graphics saving up to 80% bandwidth.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Upload PNG Images', desc: 'Select single or batch PNG files.' },
      { title: 'Choose Compression Mode', desc: 'Select Lossless WebP or Lossy 85% preset.' },
      { title: 'Download WebP', desc: 'Save optimized WebP images for your website.' }
    ],
    recommendedApps: ['Google Squoosh', 'IrfanView', 'XnConvert'],
    commonIssues: ['Slight alpha channel transparency dithering on older browsers.'],
    faqs: [{ question: 'Does WebP support transparent backgrounds like PNG?', answer: 'Yes! WebP fully supports alpha transparency while producing much smaller files.' }]
  },
  {
    id: 'eml-to-pdf',
    fromExt: 'EML',
    toExt: 'PDF',
    name: 'EML to PDF Email Archiver',
    category: 'Email & Comm',
    description: 'Convert RFC 822 email files into printable PDF documents with headers and attachments.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Select EML Message', desc: 'Upload .eml email file.' },
      { title: 'Configure PDF Layout', desc: 'Choose whether to include full raw SMTP headers.' },
      { title: 'Download PDF Document', desc: 'Save formatted email PDF with embedded media.' }
    ],
    recommendedApps: ['Mozilla Thunderbird', 'Outlook', 'AnyFileX EML Viewer'],
    commonIssues: ['Remote tracking pixel images blocked in exported PDF.'],
    faqs: [{ question: 'Can I convert EML to PDF for legal compliance?', answer: 'Yes, PDF archives preserve exact timestamp headers, sender details, and message text for legal records.' }]
  }
];
