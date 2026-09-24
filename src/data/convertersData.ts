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
    id: 'heic-to-png',
    fromExt: 'HEIC',
    toExt: 'PNG',
    name: 'HEIC to PNG Converter',
    category: 'Images',
    description: 'Convert Apple HEIC photos into PNG images locally in your browser for editing and lossless workflows.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Upload a HEIC photo', desc: 'Select a HEIC image from your iPhone, Mac, or device storage.' },
      { title: 'Decode locally', desc: 'The browser decodes the HEIC image and re-encodes it as PNG without a server upload.' },
      { title: 'Download the PNG', desc: 'Save the converted PNG image locally.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Apple Preview', 'ImageMagick'],
    commonIssues: ['PNG files can be substantially larger than HEIC because PNG uses lossless image compression.'],
    faqs: [
      { question: 'Does HEIC to PNG reduce image quality?', answer: 'PNG output is lossless after decoding, but it cannot restore detail already removed by the source image encoding.' },
      { question: 'Are HEIC photos uploaded during conversion?', answer: 'No. The browser performs the conversion locally and the source photo is not sent to an AnyFileX server.' }
    ]
  },
  {
    id: 'dwg-to-pdf',
    fromExt: 'DWG',
    toExt: 'PDF',
    name: 'DWG to PDF Blueprint Converter',
    category: 'CAD & 3D',
    description: 'Convert AutoCAD DWG drawings and technical blueprints into vector PDF documents.',
    isInteractiveToolAvailable: false,
    onlineConversionSupported: false,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Open a DWG-capable application', desc: 'Open the .dwg drawing in AutoCAD, DWG TrueView, or another application that supports DWG plotting.' },
      { title: 'Choose the layout and plot settings', desc: 'Select the required model or paper-space layout, page size, plot style, line weights, fonts, and external references.' },
      { title: 'Plot or export to PDF', desc: 'Use the application’s PDF plotter or export command, then review the resulting PDF before sharing or printing.' }
    ],
    recommendedApps: ['Autodesk DWG TrueView', 'AutoCAD Web', 'Any DWG to PDF Converter'],
    commonIssues: [
      'Missing external reference drawings (XREFs) showing blank spots in PDF.',
      'Missing CAD font files (.shx) causing text to render as default sans-serif.'
    ],
    faqs: [
      { question: 'Will line weights and layers be preserved in PDF?', answer: 'They can be preserved when the DWG application uses the correct plot style, fonts, layouts, and external references. Review the PDF because preservation depends on the application and export settings.' }
    ]
  },
  {
    id: 'png-to-jpg',
    fromExt: 'PNG',
    toExt: 'JPG',
    name: 'PNG to JPG Converter',
    category: 'Images',
    description: 'Convert PNG graphics into compact JPG images with an optional background color for transparent pixels.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Lossy Compression',
    steps: [
      { title: 'Upload PNG graphics', desc: 'Select one or more PNG files from your device.' },
      { title: 'Choose quality and background', desc: 'Set JPEG quality and choose how transparent pixels should be filled.' },
      { title: 'Download JPG files', desc: 'Save the converted JPG images locally.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Squoosh', 'ImageMagick'],
    commonIssues: ['JPG does not support transparency, so transparent pixels require a solid background color.'],
    faqs: [
      { question: 'What happens to transparent pixels when converting PNG to JPG?', answer: 'JPG has no alpha channel, so transparent pixels are filled with the selected background color, white by default.' },
      { question: 'Are my PNG files uploaded?', answer: 'No. The conversion runs in your browser and the source file is not sent to an AnyFileX server.' }
    ]
  },
  {
    id: 'webp-to-png',
    fromExt: 'WEBP',
    toExt: 'PNG',
    name: 'WEBP to PNG Converter',
    category: 'Images',
    description: 'Convert WEBP images to PNG while retaining browser-rendered image dimensions and transparency where supported.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Upload a WEBP image', desc: 'Select a WEBP file from your device.' },
      { title: 'Render the image locally', desc: 'Your browser decodes the image and re-encodes it as PNG.' },
      { title: 'Download the PNG', desc: 'Save the converted PNG file.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Squoosh', 'ImageMagick'],
    commonIssues: ['Animated WEBP files may require frame-aware processing and should be checked after export.'],
    faqs: [
      { question: 'Will transparency be preserved?', answer: 'For supported still WEBP images, transparent pixels can be retained when the browser decodes the source with an alpha channel.' },
      { question: 'Does PNG conversion improve image quality?', answer: 'PNG avoids additional lossy compression, but it cannot restore detail already lost in a lossy WEBP source.' }
    ]
  },
  {
    id: 'pdf-to-jpg',
    fromExt: 'PDF',
    toExt: 'JPG',
    name: 'PDF to JPG Page Converter',
    category: 'Documents',
    description: 'Render PDF pages as JPG images locally in your browser for previews, sharing, and image-based workflows.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Near Lossless',
    steps: [
      { title: 'Upload a PDF', desc: 'Select a PDF document from your device.' },
      { title: 'Render the pages', desc: 'The browser renders each page into an image at the selected output scale.' },
      { title: 'Download JPG pages', desc: 'Save the rendered page images locally.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Adobe Acrobat', 'ImageMagick'],
    commonIssues: ['Text and vector graphics become raster pixels in JPG output; use a higher render scale for print use.'],
    faqs: [
      { question: 'Does each PDF page become a separate JPG?', answer: 'Yes. Multi-page PDFs are rendered as separate page images for download.' },
      { question: 'Are PDF files uploaded to a server?', answer: 'No. PDF rendering is performed in your browser where supported.' }
    ]
  },
  {
    id: 'jpg-to-png',
    fromExt: 'JPG',
    toExt: 'PNG',
    name: 'JPG to PNG Converter',
    category: 'Images',
    description: 'Convert JPG images to PNG format locally in your browser for editing and workflows that require PNG output.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Upload a JPG image', desc: 'Select one or more JPG files.' },
      { title: 'Convert locally', desc: 'Your browser decodes the JPG and writes a PNG image.' },
      { title: 'Download PNG files', desc: 'Save the converted PNG images locally.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Squoosh', 'ImageMagick'],
    commonIssues: ['PNG conversion does not restore detail removed by the original JPG compression.'],
    faqs: [
      { question: 'Does converting JPG to PNG restore lost quality?', answer: 'No. PNG preserves the decoded pixels without adding another lossy encode, but it cannot restore detail already removed from the JPG.' },
      { question: 'Why convert JPG to PNG?', answer: 'PNG is useful for workflows that require lossless re-saving or broad support for image editing pipelines.' }
    ]
  },
  {
    id: 'jpg-to-webp',
    fromExt: 'JPG',
    toExt: 'WEBP',
    name: 'JPG to WEBP Converter',
    category: 'Images',
    description: 'Convert JPG images into efficient WEBP files locally in your browser for smaller web assets.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Lossy Compression',
    steps: [
      { title: 'Upload a JPG image', desc: 'Select one or more JPG files from your device.' },
      { title: 'Choose image quality', desc: 'Adjust the WEBP quality setting for the balance of size and visual detail you need.' },
      { title: 'Download WEBP files', desc: 'Save the optimized WEBP images locally.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Squoosh', 'ImageMagick'],
    commonIssues: ['WEBP quality and file size vary with the selected compression setting and image content.'],
    faqs: [
      { question: 'Why convert JPG to WEBP?', answer: 'WEBP can provide smaller web image files at comparable visual quality, which may reduce page transfer size.' },
      { question: 'Does JPG to WEBP conversion upload my image?', answer: 'No. The conversion runs locally in your browser without sending the source image to an AnyFileX server.' }
    ]
  },
  {
    id: 'pdf-to-png',
    fromExt: 'PDF',
    toExt: 'PNG',
    name: 'PDF to PNG Page Converter',
    category: 'Documents',
    description: 'Render PDF pages as PNG images locally in your browser for lossless page previews and image workflows.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Upload a PDF', desc: 'Select a PDF document from your device.' },
      { title: 'Render the pages', desc: 'The browser renders each page into a PNG image at the selected output scale.' },
      { title: 'Download PNG pages', desc: 'Save the rendered page images locally.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Adobe Acrobat', 'ImageMagick'],
    commonIssues: ['Large or image-heavy PDFs can produce large PNG files; use an appropriate render scale.'],
    faqs: [
      { question: 'Does each PDF page become a separate PNG?', answer: 'Yes. Multi-page PDFs are rendered as separate PNG page images for download.' },
      { question: 'Are PDF files uploaded to a server?', answer: 'No. PDF rendering is performed locally in your browser where supported.' }
    ]
  },
  {
    id: 'docx-to-pdf',
    fromExt: 'DOCX',
    toExt: 'PDF',
    name: 'DOCX to PDF Converter',
    category: 'Documents',
    description: 'Convert DOCX documents into portable PDF files locally in your browser.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Near Lossless',
    steps: [
      { title: 'Upload a DOCX document', desc: 'Select a Microsoft Word DOCX file from your device.' },
      { title: 'Process the document locally', desc: 'The browser reads the document structure and lays out the PDF without a server upload.' },
      { title: 'Download the PDF', desc: 'Save the generated PDF file locally.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Microsoft Word', 'LibreOffice'],
    commonIssues: ['Complex fonts, tracked changes, floating objects, and advanced Word layout features may not reproduce identically.'],
    faqs: [
      { question: 'Will DOCX formatting be preserved?', answer: 'Common text, headings, paragraphs, lists, and basic tables are supported. Advanced Word-specific layout features should be reviewed after export.' },
      { question: 'Are DOCX files uploaded to a server?', answer: 'No. The browser processes the document locally and does not send the source file to an AnyFileX server.' }
    ]
  },
  {
    id: 'pptx-to-pdf',
    fromExt: 'PPTX',
    toExt: 'PDF',
    name: 'PPTX to PDF Converter',
    category: 'Documents',
    description: 'Convert PowerPoint PPTX presentations into portable PDF documents locally in your browser.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Near Lossless',
    steps: [
      { title: 'Upload a PPTX presentation', desc: 'Select a PowerPoint PPTX file from your device.' },
      { title: 'Process the slides locally', desc: 'The browser reads supported slide content and creates a PDF without a server upload.' },
      { title: 'Download the PDF', desc: 'Save the generated PDF presentation locally.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Microsoft PowerPoint', 'LibreOffice Impress'],
    commonIssues: ['Complex slide layouts, embedded media, custom fonts, and animations may not reproduce identically in PDF output.'],
    faqs: [
      { question: 'Will PPTX animations be preserved in PDF?', answer: 'No. PDF captures slide content as static pages; animations and transitions are not interactive in the exported document.' },
      { question: 'Are PPTX files uploaded during conversion?', answer: 'No. The browser processes the presentation locally and does not send the source file to an AnyFileX server.' }
    ]
  },
  {
    id: 'dwg-to-dxf',
    fromExt: 'DWG',
    toExt: 'DXF',
    name: 'DWG to DXF CAD Vector Converter',
    category: 'CAD & 3D',
    description: 'Convert binary AutoCAD DWG drawings into open ASCII DXF format for CNC routing, laser cutting, and third-party CAD modeling.',
    isInteractiveToolAvailable: false,
    onlineConversionSupported: false,
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
    isInteractiveToolAvailable: false,
    onlineConversionSupported: false,
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
    isInteractiveToolAvailable: false,
    onlineConversionSupported: false,
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
    id: 'svg-to-jpg',
    fromExt: 'SVG',
    toExt: 'JPG',
    name: 'SVG to JPG Converter',
    category: 'Images',
    description: 'Rasterize SVG graphics into JPG images locally in your browser for broad compatibility and sharing.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Lossy Compression',
    steps: [
      { title: 'Upload an SVG graphic', desc: 'Select an SVG file from your device.' },
      { title: 'Choose raster settings', desc: 'Set the output dimensions, quality, and background color for the JPG.' },
      { title: 'Download the JPG', desc: 'Save the rasterized JPG image locally.' }
    ],
    recommendedApps: ['AnyFileX In-Browser Converter', 'Inkscape', 'ImageMagick'],
    commonIssues: ['JPG does not support transparency, and external SVG fonts or assets may not render identically.'],
    faqs: [
      { question: 'Why convert SVG to JPG?', answer: 'JPG is widely accepted by applications and platforms that do not support vector SVG files.' },
      { question: 'Can JPG preserve SVG transparency?', answer: 'No. JPG has no alpha channel, so transparent areas require a selected solid background color.' }
    ]
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
  },
  {
    id: '3mf-to-stl',
    fromExt: '3MF',
    toExt: 'STL',
    name: '3MF to STL 3D Mesh Converter',
    category: 'CAD & 3D',
    description: 'Convert 3MF 3D printing project packages into standardized binary STL meshes for older slicers and CAM tools directly in your browser.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Instant',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Upload 3MF Package', desc: 'Drag and drop your .3mf model file or load the sample calibration cube.' },
      { title: 'Select Parts or Assembly', desc: 'Inspect parts in 3D WebGL and choose whether to export all objects merged or isolate a single part.' },
      { title: 'Download Binary STL', desc: 'Click Convert and instantly download your slicer-ready IEEE 754 binary STL file.' }
    ],
    recommendedApps: ['AnyFileX In-Browser 3D Converter', 'Bambu Studio', 'PrusaSlicer', 'OrcaSlicer', 'Blender'],
    commonIssues: [
      'Multi-color paint layers and AMS filament color maps are lost because STL only stores triangle geometry.',
      'Slicer-specific seam configurations and support painting are stripped in STL output.'
    ],
    faqs: [
      {
        question: 'Why convert 3MF to STL?',
        answer: 'Many legacy slicers, CNC software, laser cutters, and 3D printing services require standard binary STL files rather than multi-part 3MF packages.'
      },
      {
        question: 'Does AnyFileX upload my 3D CAD designs?',
        answer: 'No! The entire 3MF XML parsing and STL binary tessellation occurs 100% inside your web browser client memory.'
      }
    ]
  }
  ,{
    id: 'zip-creator',
    fromExt: 'FILES',
    toExt: 'ZIP',
    name: 'ZIP Archive Creator',
    category: 'Archives',
    description: 'Create a ZIP archive from files and folders locally in your browser.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Select files or folders', desc: 'Choose files or add a folder to the local archive queue.' },
      { title: 'Build the archive', desc: 'The browser compresses the selected files without uploading them.' },
      { title: 'Download the ZIP', desc: 'Save the generated ZIP archive locally.' }
    ],
    recommendedApps: ['AnyFileX ZIP Creator', '7-Zip', 'Windows File Explorer'],
    commonIssues: ['Files that cannot be read locally are reported instead of being silently omitted.'],
    faqs: [{ question: 'Are files uploaded while creating a ZIP?', answer: 'No. ZIP creation runs locally in your browser.' }]
  },
  {
    id: 'zip-extractor',
    fromExt: 'ZIP',
    toExt: 'FILES',
    name: 'ZIP Archive Extractor',
    category: 'Archives',
    description: 'Extract files from ZIP archives locally in your browser.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Select a ZIP archive', desc: 'Choose a ZIP file from your device.' },
      { title: 'Inspect the contents', desc: 'Review the archive entries in browser memory.' },
      { title: 'Download extracted files', desc: 'Save individual files or the extracted folder locally.' }
    ],
    recommendedApps: ['AnyFileX ZIP Extractor', '7-Zip', 'Windows File Explorer'],
    commonIssues: ['Encrypted archives require a compatible password-enabled extraction workflow.'],
    faqs: [{ question: 'Are ZIP files uploaded while extracting?', answer: 'No. Extraction runs locally in your browser.' }]
  },
  {
    id: 'rar-extractor',
    fromExt: 'RAR',
    toExt: 'FILES',
    name: 'RAR Archive Extractor',
    category: 'Archives',
    description: 'Inspect and extract supported RAR archives locally in your browser.',
    isInteractiveToolAvailable: true,
    onlineConversionSupported: true,
    speedRating: 'Fast (< 30s)',
    qualityRating: 'Lossless',
    steps: [
      { title: 'Select a RAR archive', desc: 'Choose a RAR file from your device.' },
      { title: 'Inspect archive entries', desc: 'Review the files detected in the archive.' },
      { title: 'Extract and download', desc: 'Save the extracted files locally.' }
    ],
    recommendedApps: ['AnyFileX RAR Extractor', '7-Zip', 'WinRAR'],
    commonIssues: ['Some encrypted, multi-volume, or newer RAR variants may require desktop extraction software.'],
    faqs: [{ question: 'Are RAR files uploaded while extracting?', answer: 'No. Extraction runs locally in your browser.' }]
  }
];
