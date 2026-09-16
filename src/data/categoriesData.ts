import { CategoryInfo } from '../types';

export const CATEGORIES_LIST: CategoryInfo[] = [
  {
    id: 'images',
    name: 'Images & Raster Graphics',
    iconName: 'Image',
    description: 'Digital photo formats, raw camera sensors, vector graphics, icons, and image layer projects.',
    popularExtensions: ['HEIC', 'PSD', 'WEBP', 'SVG', 'AI', 'EPS', 'PNG', 'JPG', 'AVIF', 'TIFF', 'CR3', 'NEF', 'ARW', 'DNG', 'ICO', 'RAW'],
    latestGuideIds: ['heic-guide', 'psd-guide'],
    popularTools: ['Metadata Viewer', 'MIME Checker', 'File Identifier'],
    topSoftware: ['Adobe Photoshop', 'GIMP', 'Photopea'],
    faqs: [
      { question: 'What is the best image format for website performance?', answer: 'WebP and AVIF offer superior compression ratios over legacy JPEG and PNG formats.' },
      { question: 'How do I open raw camera files like CR3 and NEF?', answer: 'Use Adobe Camera Raw, Canon DPP, or free open-source Darktable software.' }
    ]
  },
  {
    id: 'cad-3d',
    name: 'CAD & 3D Modeling',
    iconName: 'Box',
    description: 'Architectural blueprints, mechanical STEP models, 3D printing STL meshes, and animation scenes.',
    popularExtensions: ['DWG', 'DXF', 'STEP', 'STP', 'STL', 'OBJ', 'FBX', 'IGES', 'IFC', 'DGN', 'SKP', 'SLDPRT', 'SLDASM', 'IPT', 'IAM', 'CATPART', 'CATPRODUCT', 'BLEND', 'GLTF', 'GLB', '3DS', 'PLY', '3MF'],
    latestGuideIds: ['dwg-guide'],
    popularTools: ['Magic Byte Detector', 'File Identifier'],
    topSoftware: ['Autodesk AutoCAD', 'Blender 3D Suite', 'DWG TrueView', 'FreeCAD'],
    faqs: [
      { question: 'How can I view AutoCAD DWG blueprints for free?', answer: 'Download free DWG TrueView for Windows or view online via Autodesk Web Viewer.' }
    ]
  },
  {
    id: 'documents',
    name: 'Documents & E-Books',
    iconName: 'FileText',
    description: 'PDF publications, Word processing DOCX files, Excel spreadsheets, and EPUB electronic e-books.',
    popularExtensions: ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'CSV', 'PPT', 'PPTX', 'ODP', 'ODT', 'RTF', 'TXT', 'PAGES', 'NUMBERS', 'KEY', 'EPUB', 'MOBI', 'AZW', 'AZW3'],
    latestGuideIds: ['pdf-guide'],
    popularTools: ['File Size Calculator', 'MIME Checker'],
    topSoftware: ['Microsoft Word', 'Adobe Acrobat Reader', 'Calibre'],
    faqs: [
      { question: 'How do I edit PDF text without Adobe Acrobat Pro?', answer: 'Use PDFgear, Google Docs, or LibreOffice Draw for free PDF editing.' }
    ]
  },
  {
    id: 'archives',
    name: 'Archives & Compression',
    iconName: 'Archive',
    description: 'Compressed containers, multi-part zip archives, encrypted RAR files, and Linux tarballs.',
    popularExtensions: ['ZIP', 'RAR', '7Z', 'TAR', 'GZ', 'TGZ', 'ISO', 'DMG', 'BZ2', 'XZ', 'CAB', 'WIM'],
    latestGuideIds: ['zip-guide'],
    popularTools: ['Checksum Verifier', 'Hash Generator'],
    topSoftware: ['7-Zip', 'WinRAR', 'The Unarchiver'],
    faqs: [
      { question: 'Why won\'t my ZIP file extract?', answer: 'If extraction fails with CRC errors, the archive may be partially downloaded or corrupted.' }
    ]
  },
  {
    id: 'audio-video',
    name: 'Audio & Video Media',
    iconName: 'Video',
    description: 'High-definition video recordings, streaming media containers, lossless FLAC audio, and MP3 tracks.',
    popularExtensions: ['MP4', 'MOV', 'AVI', 'MKV', 'WMV', 'FLV', 'WEBM', 'MPEG', '3GP', 'VOB', 'TS', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'M4A', 'AIFF', 'ALAC', 'OPUS'],
    latestGuideIds: ['video-guide'],
    popularTools: ['Metadata Viewer', 'File Identifier'],
    topSoftware: ['VLC Media Player', 'HandBrake'],
    faqs: [
      { question: 'What media player opens every video format?', answer: 'VLC Media Player plays almost all audio and video formats without needing external codecs.' }
    ]
  },
  {
    id: 'code-data',
    name: 'Code & Data Structures',
    iconName: 'Code',
    description: 'Developer source code, JSON API feeds, CSV spreadsheet data, XML schemas, and configuration scripts.',
    popularExtensions: ['JSON', 'JSONC', 'JSON5', 'XML', 'YAML', 'YML', 'TOML', 'INI', 'ENV', 'CONF', 'SQL', 'DB', 'SQLITE', 'SQLITE3', 'ACCDB', 'MDB', 'BAT', 'CMD', 'SH', 'PS1', 'VBS', 'JS', 'TS', 'JSX', 'TSX', 'HTML', 'CSS', 'SCSS', 'PHP', 'PY', 'JAVA', 'CLASS', 'JAR', 'CPP', 'C', 'H', 'CS', 'GO', 'RS', 'RB', 'SWIFT', 'KT'],
    latestGuideIds: ['json-guide'],
    popularTools: ['Hex Viewer', 'Binary Viewer', 'Hash Generator'],
    topSoftware: ['Visual Studio Code', 'Sublime Text', 'Notepad++'],
    faqs: [
      { question: 'How do I format unformatted JSON data?', answer: 'Open in VS Code or press Shift+Alt+F to auto-format JSON trees.' }
    ]
  },
  {
    id: 'email-comm',
    name: 'Email & Communication',
    iconName: 'Mail',
    description: 'RFC 822 email archives, Outlook MSG messages, MBOX mailboxes, and vCard contact cards.',
    popularExtensions: ['EML', 'MSG', 'MBOX', 'PST', 'ICS', 'VCF'],
    latestGuideIds: ['eml-guide'],
    popularTools: ['MIME Checker', 'File Identifier'],
    topSoftware: ['Mozilla Thunderbird', 'Microsoft Outlook', 'Apple Mail'],
    faqs: [
      { question: 'How do I open .eml files on Windows 11?', answer: 'Open in Mail app, Thunderbird, or use OpenAnyFile online EML viewer.' }
    ]
  },
  {
    id: 'system-executables',
    name: 'System & Executables',
    iconName: 'Cpu',
    description: 'Binary system executables, installers, generic DAT configuration stores, and driver files.',
    popularExtensions: ['DAT', 'EXE', 'DMG', 'APK', 'MSI', 'DLL', 'SYS'],
    latestGuideIds: ['dat-guide'],
    popularTools: ['Magic Byte Detector', 'Hex Viewer', 'Binary Viewer'],
    topSoftware: ['HxD Hex Editor', 'Winmail Reader'],
    faqs: [
      { question: 'What is inside a .dat file?', answer: 'DAT files store application settings or raw binary records. Use OpenAnyFile File Identifier to inspect its magic byte signature.' }
    ]
  },
  {
    id: 'medical-science',
    name: 'Medical & Science',
    iconName: 'Activity',
    description: 'Medical DICOM radiology scans, genomic FASTA sequence alignments, 3D molecular PDB models, LiDAR point clouds, and statistical data.',
    popularExtensions: ['DCM', 'DICOM', 'NII', 'FASTA', 'FA', 'BAM', 'SAM', 'PDB', 'MAT', 'HDF5', 'H5', 'NETCDF', 'NC', 'LAS', 'LAZ', 'PCD', 'SAV', 'POR', 'RDATA', 'RDS', 'SAS7BDAT', 'DTA'],
    latestGuideIds: ['dcm-guide'],
    popularTools: ['Magic Byte Detector', 'File Identifier'],
    topSoftware: ['Horos', '3D Slicer', 'PyMOL', 'CloudCompare', 'IBM SPSS', 'RStudio'],
    faqs: [
      { question: 'How do I open .dcm DICOM medical files?', answer: 'Use free medical DICOM viewers like Horos (macOS) or MicroDicom Viewer (Windows).' }
    ]
  }
];
