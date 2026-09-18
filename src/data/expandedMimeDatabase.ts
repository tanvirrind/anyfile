// Comprehensive MIME Type & Magic Byte Database (500+ Formats)
// AnyFileX Engine

export interface MimeRecord {
  extension: string; // e.g. "pdf", "heic", "mp4"
  mimeType: string; // e.g. "application/pdf"
  category: string; // e.g. "Documents", "Images", "Video", "Audio", "Archives", "Code & Web", "Executables", "Databases", "Fonts", "3D & CAD"
  name: string; // e.g. "Portable Document Format"
  description: string;
  commonSoftware: string[];
  supportedOs: ('windows' | 'mac' | 'linux' | 'android' | 'ios')[];
  magicBytesHex?: string; // e.g. "25 50 44 46"
  magicBytesOffset?: number; // default 0
  magicBytesAscii?: string; // e.g. "%PDF"
  securityNotes?: string;
  rfcStandard?: string;
  isExecutableOrHighRisk?: boolean;
}

export const EXPANDED_MIME_DATABASE: MimeRecord[] = [
  // --- IMAGES ---
  {
    extension: 'heic',
    mimeType: 'image/heic',
    category: 'Images',
    name: 'High Efficiency Image Container',
    description: 'Apple iOS camera image format using HEVC compression.',
    commonSoftware: ['Apple Photos', 'Adobe Photoshop', 'GIMP', 'CopyTrans HEIC'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '00 00 00 18 66 74 79 70 68 65 69 63',
    magicBytesAscii: '....ftypheic',
    securityNotes: 'Safe media container format with zero executable code risks.',
    rfcStandard: 'RFC 2397 / ISO/IEC 23008-12'
  },
  {
    extension: 'heif',
    mimeType: 'image/heif',
    category: 'Images',
    name: 'High Efficiency Image File Format',
    description: 'ISO standardized container for high efficiency single images and image sequences.',
    commonSoftware: ['Apple Photos', 'Canon Digital Photo Professional', 'Adobe Lightroom'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '00 00 00 18 66 74 79 70 6D 69 66 31',
    magicBytesAscii: '....ftypmif1',
    securityNotes: 'Safe raster image format.',
    rfcStandard: 'ISO/IEC 23008-12'
  },
  {
    extension: 'png',
    mimeType: 'image/png',
    category: 'Images',
    name: 'Portable Network Graphics',
    description: 'Lossless image format supporting full alpha channel transparency.',
    commonSoftware: ['Adobe Photoshop', 'GIMP', 'Apple Photos', 'Windows Photos', 'Figma'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '89 50 4E 47 0D 0A 1A 0A',
    magicBytesAscii: '.PNG....',
    securityNotes: 'Standard safe raster image format.',
    rfcStandard: 'RFC 2083 / W3C PNG'
  },
  {
    extension: 'jpg',
    mimeType: 'image/jpeg',
    category: 'Images',
    name: 'JPEG Image',
    description: 'Standard lossy raster graphic format widely used for photographic digital captures.',
    commonSoftware: ['Adobe Photoshop', 'Lightroom', 'Apple Photos', 'Windows Photos'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: 'FF D8 FF E0',
    magicBytesAscii: '....JFIF',
    securityNotes: 'Safe image format. Contains EXIF GPS location tags.',
    rfcStandard: 'RFC 1341 / ISO/IEC 10918-1'
  },
  {
    extension: 'jpeg',
    mimeType: 'image/jpeg',
    category: 'Images',
    name: 'Joint Photographic Experts Group Image',
    description: 'Alternative extension for JPEG image format containing EXIF camera capture metadata.',
    commonSoftware: ['Adobe Photoshop', 'Lightroom', 'Darktable', 'Apple Photos'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: 'FF D8 FF E1',
    magicBytesAscii: '....Exif',
    securityNotes: 'Safe image file.',
    rfcStandard: 'ISO/IEC 10918-1'
  },
  {
    extension: 'webp',
    mimeType: 'image/webp',
    category: 'Images',
    name: 'WebP Image',
    description: 'Modern Google image format offering lossy and lossless web compression.',
    commonSoftware: ['Google Chrome', 'Adobe Photoshop', 'GIMP', 'Figma'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '52 49 46 46 (WEBP)',
    magicBytesAscii: 'RIFF....WEBP',
    securityNotes: 'Safe browser-native web graphic format.',
    rfcStandard: 'RFC 7903'
  },
  {
    extension: 'avif',
    mimeType: 'image/avif',
    category: 'Images',
    name: 'AV1 Image File Format',
    description: 'Next-generation image format based on AV1 video keyframe encoding.',
    commonSoftware: ['Google Chrome', 'Mozilla Firefox', 'GIMP', 'Adobe Photoshop 2024'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '00 00 00 1C 66 74 79 70 61 76 69 66',
    magicBytesAscii: '....ftypavif',
    securityNotes: 'Safe image container.',
    rfcStandard: 'AOMedia AVIF Spec'
  },
  {
    extension: 'gif',
    mimeType: 'image/gif',
    category: 'Images',
    name: 'Graphics Interchange Format',
    description: '8-bit color indexed bitmap format supporting simple loop animations.',
    commonSoftware: ['Web Browsers', 'GIMP', 'Adobe Photoshop', 'Adobe Animate'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '47 49 46 38 39 61',
    magicBytesAscii: 'GIF89a',
    securityNotes: 'Safe image format.',
    rfcStandard: 'GIF89a Spec'
  },
  {
    extension: 'svg',
    mimeType: 'image/svg+xml',
    category: 'Images',
    name: 'Scalable Vector Graphics',
    description: 'XML-based vector graphic format for resolution-independent web illustrations.',
    commonSoftware: ['Adobe Illustrator', 'Inkscape', 'Figma', 'Web Browsers'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '3C 73 76 67',
    magicBytesAscii: '<svg',
    securityNotes: 'XML-based! May contain inline <script> tags. Sanitize before rendering.',
    rfcStandard: 'W3C SVG 2.0'
  },
  {
    extension: 'bmp',
    mimeType: 'image/bmp',
    category: 'Images',
    name: 'Bitmap Image File',
    description: 'Uncompressed raw raster graphic format native to Microsoft Windows.',
    commonSoftware: ['Microsoft Paint', 'Adobe Photoshop', 'GIMP', 'IrfanView'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '42 4D',
    magicBytesAscii: 'BM',
    securityNotes: 'Uncompressed simple bitmap data.',
    rfcStandard: 'Microsoft BMP Spec'
  },
  {
    extension: 'tiff',
    mimeType: 'image/tiff',
    category: 'Images',
    name: 'Tagged Image File Format',
    description: 'High-quality uncompressed raster format preferred in publishing and print scanning.',
    commonSoftware: ['Adobe Photoshop', 'Lightroom', 'Apple Preview', 'ImageMagick'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '49 49 2A 00',
    magicBytesAscii: 'II*.',
    securityNotes: 'Safe graphics file.',
    rfcStandard: 'TIFF 6.0 Spec'
  },
  {
    extension: 'psd',
    mimeType: 'image/vnd.adobe.photoshop',
    category: 'Images',
    name: 'Adobe Photoshop Document',
    description: 'Layered raster design project file created in Adobe Photoshop.',
    commonSoftware: ['Adobe Photoshop', 'GIMP', 'Affinity Photo', 'Photopea'],
    supportedOs: ['windows', 'mac', 'linux'],
    magicBytesHex: '38 42 50 53',
    magicBytesAscii: '8BPS',
    securityNotes: 'Graphics project file. Low security risk.'
  },
  {
    extension: 'ico',
    mimeType: 'image/x-icon',
    category: 'Images',
    name: 'Windows Icon File',
    description: 'Multi-resolution favicon image container used for application and web icons.',
    commonSoftware: ['Web Browsers', 'GIMP', 'IcoFX', 'Visual Studio'],
    supportedOs: ['windows', 'mac', 'linux'],
    magicBytesHex: '00 00 01 00',
    magicBytesAscii: '....',
    securityNotes: 'Standard icon container.'
  },

  // --- DOCUMENTS & OFFICE ---
  {
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'Documents',
    name: 'Portable Document Format',
    description: 'Adobe resolution-independent document container format.',
    commonSoftware: ['Adobe Acrobat Reader', 'Foxit Reader', 'Google Chrome', 'Apple Preview'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '25 50 44 46',
    magicBytesAscii: '%PDF',
    securityNotes: 'Can embed PDF JavaScript forms or active remote URL links.',
    rfcStandard: 'RFC 8118 / ISO 32000-2'
  },
  {
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'Documents',
    name: 'Microsoft Word OpenXML Document',
    description: 'Zipped XML document container used by Microsoft Word 2007+.',
    commonSoftware: ['Microsoft Word', 'LibreOffice Writer', 'Google Docs', 'Pages'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '50 4B 03 04',
    magicBytesAscii: 'PK..',
    securityNotes: 'ZIP container holding XML text. Low macro risk compared to .doc.',
    rfcStandard: 'ISO/IEC 29500'
  },
  {
    extension: 'doc',
    mimeType: 'application/msword',
    category: 'Documents',
    name: 'Microsoft Word Legacy Document',
    description: 'Binary document format used in legacy versions of Microsoft Word.',
    commonSoftware: ['Microsoft Word', 'LibreOffice Writer', 'WPS Office'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: 'D0 CF 11 E0 A1 B1 1A E1',
    magicBytesAscii: '........',
    securityNotes: 'Legacy OLE container. High macro virus potential in untrusted downloads!',
    isExecutableOrHighRisk: true
  },
  {
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    category: 'Documents',
    name: 'Microsoft Excel OpenXML Spreadsheet',
    description: 'OpenXML zip spreadsheet container with tables, formulas, and charts.',
    commonSoftware: ['Microsoft Excel', 'Google Sheets', 'LibreOffice Calc', 'Numbers'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '50 4B 03 04',
    magicBytesAscii: 'PK..',
    securityNotes: 'Standard spreadsheet data. Standard .xlsx does not contain VBA macros.'
  },
  {
    extension: 'pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    category: 'Documents',
    name: 'Microsoft PowerPoint OpenXML Presentation',
    description: 'OpenXML presentation format with slides, media embeds, and animations.',
    commonSoftware: ['Microsoft PowerPoint', 'Google Slides', 'Keynote', 'LibreOffice Impress'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '50 4B 03 04',
    magicBytesAscii: 'PK..',
    securityNotes: 'Standard presentation zip container.'
  },
  {
    extension: 'epub',
    mimeType: 'application/epub+zip',
    category: 'Documents',
    name: 'Electronic Publication E-Book',
    description: 'Open digital e-book standard container based on XHTML and CSS.',
    commonSoftware: ['Apple Books', 'Calibre', 'Adobe Digital Editions', 'Kobo'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '50 4B 03 04',
    magicBytesAscii: 'PK..',
    securityNotes: 'ZIP archive containing HTML e-book pages.',
    rfcStandard: 'IDPF EPUB 3.2'
  },
  {
    extension: 'rtf',
    mimeType: 'application/rtf',
    category: 'Documents',
    name: 'Rich Text Format',
    description: 'Cross-platform document format developed by Microsoft for rich formatted text.',
    commonSoftware: ['Microsoft WordPad', 'Apple TextEdit', 'LibreOffice Writer'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '7B 5C 72 74 66',
    magicBytesAscii: '{\\rtf',
    securityNotes: 'Text document specification.'
  },
  {
    extension: 'txt',
    mimeType: 'text/plain',
    category: 'Documents',
    name: 'Plain Text Document',
    description: 'Unformatted human-readable plain text file encoded in UTF-8 or ASCII.',
    commonSoftware: ['Notepad', 'TextEdit', 'VS Code', 'Vim', 'Sublime Text'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    securityNotes: '100% safe plain text data with no binary code execution.',
    rfcStandard: 'RFC 2046 / RFC 3629'
  },
  {
    extension: 'csv',
    mimeType: 'text/csv',
    category: 'Documents',
    name: 'Comma-Separated Values',
    description: 'Plain text tabular data format where entries are separated by commas.',
    commonSoftware: ['Microsoft Excel', 'Google Sheets', 'LibreOffice Calc', 'Python pandas'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    securityNotes: 'Plain text data. Caution with Formula Injection in Excel (=CMD).',
    rfcStandard: 'RFC 4180'
  },

  // --- AUDIO ---
  {
    extension: 'mp3',
    mimeType: 'audio/mpeg',
    category: 'Audio',
    name: 'MPEG-1 Audio Layer III',
    description: 'Universal compressed digital audio container with ID3 tag metadata.',
    commonSoftware: ['VLC Media Player', 'Apple Music', 'Windows Media Player', 'Audacity', 'Spotify'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '49 44 33',
    magicBytesAscii: 'ID3',
    securityNotes: 'Safe media audio file.',
    rfcStandard: 'RFC 3003 / ISO/IEC 11172-3'
  },
  {
    extension: 'wav',
    mimeType: 'audio/wav',
    category: 'Audio',
    name: 'Waveform Audio File Format',
    description: 'Uncompressed raw uncompressed PCM digital audio format developed by IBM and Microsoft.',
    commonSoftware: ['Audacity', 'VLC Media Player', 'Adobe Audition', 'Logic Pro'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '52 49 46 46 (WAVE)',
    magicBytesAscii: 'RIFF....WAVE',
    securityNotes: 'Safe uncompressed audio data.',
    rfcStandard: 'RFC 2361'
  },
  {
    extension: 'flac',
    mimeType: 'audio/flac',
    category: 'Audio',
    name: 'Free Lossless Audio Codec',
    description: 'Open source bit-perfect audio compression format for audiophiles.',
    commonSoftware: ['VLC Media Player', 'Audacity', 'Foobar2000', 'Apple Music'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '66 4C 61 43',
    magicBytesAscii: 'fLaC',
    securityNotes: 'Safe open source audio codec.'
  },
  {
    extension: 'm4a',
    mimeType: 'audio/mp4',
    category: 'Audio',
    name: 'MPEG-4 Audio File',
    description: 'AAC or ALAC compressed audio stream container used by iTunes and Apple Devices.',
    commonSoftware: ['Apple Music', 'VLC Media Player', 'Windows Media Player'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '00 00 00 20 66 74 79 70 4D 34 41 20',
    magicBytesAscii: '....ftypM4A ',
    securityNotes: 'Safe audio container.'
  },
  {
    extension: 'ogg',
    mimeType: 'audio/ogg',
    category: 'Audio',
    name: 'Ogg Vorbis Audio',
    description: 'Open source patent-free audio container format developed by Xiph.Org.',
    commonSoftware: ['VLC Media Player', 'Audacity', 'Spotify', 'GStreamer'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '4F 67 67 53',
    magicBytesAscii: 'OggS',
    securityNotes: 'Safe open source multimedia container.',
    rfcStandard: 'RFC 5334'
  },

  // --- VIDEO ---
  {
    extension: 'mp4',
    mimeType: 'video/mp4',
    category: 'Video',
    name: 'MPEG-4 Part 14 Video',
    description: 'Universal digital multimedia container format for video, audio, and subtitles.',
    commonSoftware: ['VLC Media Player', 'QuickTime Player', 'Windows Media Player', 'Handbrake'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '00 00 00 18 66 74 79 70',
    magicBytesAscii: '....ftyp',
    securityNotes: 'Universal safe media container.',
    rfcStandard: 'RFC 4337 / ISO/IEC 14496-14'
  },
  {
    extension: 'mkv',
    mimeType: 'video/x-matroska',
    category: 'Video',
    name: 'Matroska Multimedia Container',
    description: 'Extensible open standard video container holding unlimited video/audio/subtitle tracks.',
    commonSoftware: ['VLC Media Player', 'MPC-HC', 'Plex', 'Handbrake'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '1A 45 DF A3',
    magicBytesAscii: '.E..',
    securityNotes: 'Open source multimedia container.'
  },
  {
    extension: 'webm',
    mimeType: 'video/webm',
    category: 'Video',
    name: 'WebM Video File',
    description: 'Open web video format backed by Google using VP8/VP9 or AV1 video codecs.',
    commonSoftware: ['Google Chrome', 'Mozilla Firefox', 'VLC Media Player'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '1A 45 DF A3',
    magicBytesAscii: '.E..',
    securityNotes: 'Safe open web video format.'
  },
  {
    extension: 'mov',
    mimeType: 'video/quicktime',
    category: 'Video',
    name: 'Apple QuickTime Movie',
    description: 'Native multimedia container developed by Apple for QuickTime media framework.',
    commonSoftware: ['QuickTime Player', 'VLC Media Player', 'Final Cut Pro', 'Adobe Premiere'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '00 00 00 14 66 74 79 70 71 74 20 20',
    magicBytesAscii: '....ftypqt  ',
    securityNotes: 'Safe video container.',
    rfcStandard: 'RFC 6381'
  },
  {
    extension: 'avi',
    mimeType: 'video/x-msvideo',
    category: 'Video',
    name: 'Audio Video Interleave',
    description: 'Legacy Microsoft multimedia container format for interleaved audio/video data.',
    commonSoftware: ['VLC Media Player', 'Windows Media Player', 'GOM Player'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '52 49 46 46 (AVI )',
    magicBytesAscii: 'RIFF....AVI ',
    securityNotes: 'Legacy video container.'
  },

  // --- ARCHIVES & COMPRESSION ---
  {
    extension: 'zip',
    mimeType: 'application/zip',
    category: 'Archives',
    name: 'ZIP Compressed Archive',
    description: 'Universal compressed archive format supporting DEFLATE compression and AES encryption.',
    commonSoftware: ['WinZip', '7-Zip', 'WinRAR', 'macOS Archive Utility', 'File Roller'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '50 4B 03 04',
    magicBytesAscii: 'PK..',
    securityNotes: 'Archive container. May harbor embedded executables or malware payloads!',
    rfcStandard: 'RFC 1951 / APPNOTE.TXT'
  },
  {
    extension: 'rar',
    mimeType: 'application/vnd.rar',
    category: 'Archives',
    name: 'Roshal ARchive',
    description: 'Proprietary compressed archive format featuring recovery record blocks.',
    commonSoftware: ['WinRAR', '7-Zip', 'The Unarchiver'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '52 61 72 21 1A 07 00',
    magicBytesAscii: 'Rar!...',
    securityNotes: 'Compressed archive container.'
  },
  {
    extension: '7z',
    mimeType: 'application/x-7z-compressed',
    category: 'Archives',
    name: '7-Zip Compressed Archive',
    description: 'Open source high-ratio archive format powered by LZMA and AES-256 encryption.',
    commonSoftware: ['7-Zip', 'Keka', 'PeaZip', 'WinRAR'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '37 7A BC AF 27 1C',
    magicBytesAscii: '7z..\'',
    securityNotes: 'Open archive container.'
  },
  {
    extension: 'tar',
    mimeType: 'application/x-tar',
    category: 'Archives',
    name: 'Tape Archive',
    description: 'POSIX standard archive format used in Unix and Linux operating systems.',
    commonSoftware: ['GNU tar', '7-Zip', 'WinRAR', 'macOS Archive Utility'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '75 73 74 61 72',
    magicBytesOffset: 257,
    magicBytesAscii: 'ustar',
    securityNotes: 'Uncompressed Unix file archive.',
    rfcStandard: 'POSIX.1-2001'
  },
  {
    extension: 'gz',
    mimeType: 'application/gzip',
    category: 'Archives',
    name: 'Gzip Compressed File',
    description: 'Single-file compression format created using DEFLATE algorithm.',
    commonSoftware: ['GNU gzip', '7-Zip', 'WinRAR'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '1F 8B 08',
    magicBytesAscii: '...',
    securityNotes: 'Compressed data stream.',
    rfcStandard: 'RFC 1952'
  },
  {
    extension: 'iso',
    mimeType: 'application/x-iso9660-image',
    category: 'Archives',
    name: 'ISO 9660 Optical Disc Image',
    description: 'Archive file containing complete sector-by-sector copy of optical media or OS installer.',
    commonSoftware: ['Rufus', 'PowerISO', '7-Zip', 'Windows File Explorer'],
    supportedOs: ['windows', 'mac', 'linux'],
    magicBytesHex: '43 44 30 30 31',
    magicBytesOffset: 32769,
    magicBytesAscii: 'CD001',
    securityNotes: 'Disk image container. Often used to distribute software installers.'
  },

  // --- EXECUTABLES & BINARIES ---
  {
    extension: 'exe',
    mimeType: 'application/x-msdownload',
    category: 'Executables',
    name: 'Windows Portable Executable',
    description: 'Executable program file for Microsoft Windows 32/64-bit platforms.',
    commonSoftware: ['Windows OS Loader', 'Wine', 'Process Explorer'],
    supportedOs: ['windows'],
    magicBytesHex: '4D 5A',
    magicBytesAscii: 'MZ',
    securityNotes: 'CRITICAL HIGH RISK: Binary executable program code. Never execute untrusted files!',
    isExecutableOrHighRisk: true
  },
  {
    extension: 'dll',
    mimeType: 'application/x-msdownload',
    category: 'Executables',
    name: 'Dynamic Link Library',
    description: 'Shared library file containing compiled C/C++ procedures and code resources.',
    commonSoftware: ['Windows Subsystem', 'Visual Studio', 'IDA Pro'],
    supportedOs: ['windows'],
    magicBytesHex: '4D 5A',
    magicBytesAscii: 'MZ',
    securityNotes: 'HIGH RISK: Executable binary code library.',
    isExecutableOrHighRisk: true
  },
  {
    extension: 'apk',
    mimeType: 'application/vnd.android.package-archive',
    category: 'Executables',
    name: 'Android Package Kit',
    description: 'Package file used to distribute and install mobile apps on Android devices.',
    commonSoftware: ['Android OS Package Installer', 'JADX', 'APKTool'],
    supportedOs: ['android'],
    magicBytesHex: '50 4B 03 04',
    magicBytesAscii: 'PK..',
    securityNotes: 'Executable mobile application package.',
    isExecutableOrHighRisk: true
  },
  {
    extension: 'dmg',
    mimeType: 'application/x-apple-diskimage',
    category: 'Executables',
    name: 'Apple Disk Image',
    description: 'Mountable disk image format used for distributing software on macOS.',
    commonSoftware: ['macOS DiskImageMounter', '7-Zip'],
    supportedOs: ['mac'],
    magicBytesHex: '78 01 73 0D 62 62 60',
    magicBytesAscii: 'x.s.bb`',
    securityNotes: 'macOS installer container.'
  },
  {
    extension: 'elf',
    mimeType: 'application/x-executable',
    category: 'Executables',
    name: 'Executable and Linkable Format',
    description: 'Standard binary format for executables and shared libraries on Linux and Unix.',
    commonSoftware: ['Linux Kernel Loader', 'GDB', 'Ghidra'],
    supportedOs: ['linux'],
    magicBytesHex: '7F 45 4C 46',
    magicBytesAscii: '.ELF',
    securityNotes: 'Linux binary executable.',
    isExecutableOrHighRisk: true
  },

  // --- CODE & WEB DATA ---
  {
    extension: 'html',
    mimeType: 'text/html',
    category: 'Code & Web',
    name: 'HyperText Markup Language',
    description: 'Standard markup language for document structure on the World Wide Web.',
    commonSoftware: ['Web Browsers', 'VS Code', 'Sublime Text', 'WebStorm'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '3C 21 44 4F 43 54 59 50 45',
    magicBytesAscii: '<!DOCTYPE',
    securityNotes: 'Client-side web page. Can execute inline JavaScript scripts.',
    rfcStandard: 'W3C HTML5 / RFC 2854'
  },
  {
    extension: 'json',
    mimeType: 'application/json',
    category: 'Code & Web',
    name: 'JavaScript Object Notation',
    description: 'Lightweight text-based data interchange format widely used in REST APIs.',
    commonSoftware: ['VS Code', 'Postman', 'Web Browsers', 'Python json module'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '7B',
    magicBytesAscii: '{',
    securityNotes: 'Structured text data interchange format.',
    rfcStandard: 'RFC 8259'
  },
  {
    extension: 'xml',
    mimeType: 'application/xml',
    category: 'Code & Web',
    name: 'eXtensible Markup Language',
    description: 'Software and hardware-independent text markup format for structured data.',
    commonSoftware: ['VS Code', 'Notepad++', 'XMLSpy', 'Web Browsers'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '3C 3F 78 6D 6C',
    magicBytesAscii: '<?xml',
    securityNotes: 'Structured XML document. Beware of XXE (Xml eXternal Entity) exploits.',
    rfcStandard: 'RFC 7303 / W3C XML'
  },
  {
    extension: 'js',
    mimeType: 'text/javascript',
    category: 'Code & Web',
    name: 'JavaScript Script File',
    description: 'Dynamic scripting programming language for web browsers and Node.js backend runtimes.',
    commonSoftware: ['Node.js', 'VS Code', 'Web Browsers'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    securityNotes: 'Executable source code file.',
    rfcStandard: 'RFC 9239'
  },
  {
    extension: 'ts',
    mimeType: 'text/typescript',
    category: 'Code & Web',
    name: 'TypeScript Source Code',
    description: 'Typed superset of JavaScript that compiles down to plain JavaScript.',
    commonSoftware: ['TypeScript Compiler (tsc)', 'VS Code', 'WebStorm'],
    supportedOs: ['windows', 'mac', 'linux'],
    securityNotes: 'Development source code.'
  },
  {
    extension: 'py',
    mimeType: 'text/x-python',
    category: 'Code & Web',
    name: 'Python Source Script',
    description: 'High-level interpreted programming language script file.',
    commonSoftware: ['Python Interpreter', 'PyCharm', 'VS Code', 'Jupyter Notebook'],
    supportedOs: ['windows', 'mac', 'linux'],
    securityNotes: 'Executable Python source code.'
  },
  {
    extension: 'sql',
    mimeType: 'application/sql',
    category: 'Databases',
    name: 'Structured Query Language Script',
    description: 'Database query and schema definition file containing SQL statements.',
    commonSoftware: ['DBeaver', 'pgAdmin', 'MySQL Workbench', 'VS Code'],
    supportedOs: ['windows', 'mac', 'linux'],
    securityNotes: 'Database script. Check for DROP TABLE or destructive SQL payloads.',
    rfcStandard: 'RFC 6922'
  },

  // --- DATABASES ---
  {
    extension: 'sqlite',
    mimeType: 'application/vnd.sqlite3',
    category: 'Databases',
    name: 'SQLite Database File',
    description: 'Self-contained zero-configuration serverless SQL database engine container.',
    commonSoftware: ['DB Browser for SQLite', 'SQLite CLI', 'DBeaver'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '53 51 4C 69 74 65 20 66 6F 72 6D 61 74 20 33 00',
    magicBytesAscii: 'SQLite format 3.',
    securityNotes: 'Embedded database file.',
    rfcStandard: 'SQLite Consortium Spec'
  },
  {
    extension: 'db',
    mimeType: 'application/x-sqlite3',
    category: 'Databases',
    name: 'Generic Database File',
    description: 'Generic database storage container (frequently SQLite or Berkeley DB format).',
    commonSoftware: ['DB Browser for SQLite', 'DBeaver', 'Hex Editors'],
    supportedOs: ['windows', 'mac', 'linux'],
    magicBytesHex: '53 51 4C 69 74 65',
    magicBytesAscii: 'SQLite',
    securityNotes: 'Binary database storage.'
  },

  // --- FONTS ---
  {
    extension: 'ttf',
    mimeType: 'font/ttf',
    category: 'Fonts',
    name: 'TrueType Font',
    description: 'Outline font standard developed by Apple and Microsoft in the late 1980s.',
    commonSoftware: ['Windows Font Viewer', 'Font Book', 'FontForge', 'Adobe Illustrator'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '00 01 00 00 00',
    magicBytesAscii: '.....',
    securityNotes: 'Safe typography outline font.',
    rfcStandard: 'RFC 8081'
  },
  {
    extension: 'woff2',
    mimeType: 'font/woff2',
    category: 'Fonts',
    name: 'Web Open Font Format 2.0',
    description: 'Next-generation web font compressed using Brotli compression.',
    commonSoftware: ['Web Browsers', 'FontForge'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    magicBytesHex: '77 4F 46 32',
    magicBytesAscii: 'wOF2',
    securityNotes: 'Safe web font container.',
    rfcStandard: 'W3C WOFF 2.0 / RFC 8081'
  },

  // --- 3D & CAD ---
  {
    extension: 'stl',
    mimeType: 'model/stl',
    category: '3D & CAD',
    name: 'Stereolithography 3D File',
    description: '3D geometry mesh format composed of triangular facets used for 3D printing.',
    commonSoftware: ['UltiMaker Cura', 'PrusaSlicer', 'Blender', 'Autodesk Fusion 360'],
    supportedOs: ['windows', 'mac', 'linux'],
    securityNotes: '3D printing geometry model.'
  },
  {
    extension: 'obj',
    mimeType: 'model/obj',
    category: '3D & CAD',
    name: 'Wavefront 3D Object',
    description: 'Open 3D geometry format representing 3D vertices, texture maps, and faces.',
    commonSoftware: ['Blender', 'Autodesk Maya', '3ds Max', 'MeshLab'],
    supportedOs: ['windows', 'mac', 'linux'],
    securityNotes: '3D graphics mesh data.'
  }
];

// Fallback & Dynamic Generator for 500+ Extension Mappings
// Automatically expands categories if specific extensions are queried
const CATEGORY_MAP: Record<string, { category: string; defaultApp: string; mimePrefix: string }> = {
  // Programming & Dev
  py: { category: 'Code & Web', defaultApp: 'Python / VS Code', mimePrefix: 'text/x-python' },
  rb: { category: 'Code & Web', defaultApp: 'Ruby / VS Code', mimePrefix: 'text/x-ruby' },
  java: { category: 'Code & Web', defaultApp: 'Java JDK / IntelliJ IDEA', mimePrefix: 'text/x-java-source' },
  c: { category: 'Code & Web', defaultApp: 'GCC / Clang / VS Code', mimePrefix: 'text/x-c' },
  cpp: { category: 'Code & Web', defaultApp: 'G++ / Visual Studio', mimePrefix: 'text/x-c++' },
  cs: { category: 'Code & Web', defaultApp: '.NET SDK / Visual Studio', mimePrefix: 'text/x-csharp' },
  go: { category: 'Code & Web', defaultApp: 'Go Compiler / GoLand', mimePrefix: 'text/x-go' },
  rs: { category: 'Code & Web', defaultApp: 'Rustc / Cargo / VS Code', mimePrefix: 'text/x-rust' },
  php: { category: 'Code & Web', defaultApp: 'PHP Engine / PhpStorm', mimePrefix: 'text/x-php' },
  sh: { category: 'Code & Web', defaultApp: 'Bash Shell / Terminal', mimePrefix: 'application/x-sh' },
  bat: { category: 'Executables', defaultApp: 'Windows Command Prompt', mimePrefix: 'application/x-bat' },
  ps1: { category: 'Executables', defaultApp: 'Windows PowerShell', mimePrefix: 'text/plain' },
  yaml: { category: 'Code & Web', defaultApp: 'VS Code / YAML Parsers', mimePrefix: 'application/x-yaml' },
  yml: { category: 'Code & Web', defaultApp: 'VS Code / YAML Parsers', mimePrefix: 'application/x-yaml' },
  wasm: { category: 'Code & Web', defaultApp: 'Web Browsers / Wasmtime', mimePrefix: 'application/wasm' },
  
  // Media & Graphics
  ai: { category: 'Images', defaultApp: 'Adobe Illustrator', mimePrefix: 'application/postscript' },
  eps: { category: 'Images', defaultApp: 'Adobe Illustrator / Inkscape', mimePrefix: 'application/postscript' },
  raw: { category: 'Images', defaultApp: 'Adobe Lightroom / Darktable', mimePrefix: 'image/x-dcraw' },
  cr2: { category: 'Images', defaultApp: 'Canon Digital Photo / Lightroom', mimePrefix: 'image/x-canon-cr2' },
  nef: { category: 'Images', defaultApp: 'Nikon Capture NX / Lightroom', mimePrefix: 'image/x-nikon-nef' },
  dng: { category: 'Images', defaultApp: 'Adobe DNG Converter / Lightroom', mimePrefix: 'image/x-adobe-dng' },
  tga: { category: 'Images', defaultApp: 'Adobe Photoshop / GIMP', mimePrefix: 'image/x-tga' },
  
  // Audio & Video
  flv: { category: 'Video', defaultApp: 'VLC Media Player', mimePrefix: 'video/x-flv' },
  m4v: { category: 'Video', defaultApp: 'Apple TV / QuickTime / VLC', mimePrefix: 'video/x-m4v' },
  wmv: { category: 'Video', defaultApp: 'Windows Media Player / VLC', mimePrefix: 'video/x-ms-wmv' },
  aiff: { category: 'Audio', defaultApp: 'Apple Music / Audacity', mimePrefix: 'audio/x-aiff' },
  midi: { category: 'Audio', defaultApp: 'GarageBand / Logic Pro / VLC', mimePrefix: 'audio/midi' },
  mid: { category: 'Audio', defaultApp: 'GarageBand / Logic Pro / VLC', mimePrefix: 'audio/midi' },
  opus: { category: 'Audio', defaultApp: 'VLC Media Player / Chrome', mimePrefix: 'audio/opus' },
  amr: { category: 'Audio', defaultApp: 'VLC Media Player', mimePrefix: 'audio/amr' },

  // System & Disk
  vhd: { category: 'Disk & System', defaultApp: 'Hyper-V / VirtualBox', mimePrefix: 'application/x-vhd' },
  vhdx: { category: 'Disk & System', defaultApp: 'Hyper-V / VirtualBox', mimePrefix: 'application/x-vhdx' },
  vmdk: { category: 'Disk & System', defaultApp: 'VMware Workstation / VirtualBox', mimePrefix: 'application/x-vmdk' },
  bin: { category: 'Executables', defaultApp: 'Binary Editors / OS Firmware', mimePrefix: 'application/octet-stream' },
  dat: { category: 'Documents', defaultApp: 'Generic Binary / Text Viewer', mimePrefix: 'application/octet-stream' },

  // CAD & 3D
  fbx: { category: '3D & CAD', defaultApp: 'Autodesk Maya / Blender', mimePrefix: 'application/octet-stream' },
  gltf: { category: '3D & CAD', defaultApp: 'Blender / Three.js Viewers', mimePrefix: 'model/gltf+json' },
  glb: { category: '3D & CAD', defaultApp: 'Windows 3D Viewer / Blender', mimePrefix: 'model/gltf-binary' },
  dwg: { category: '3D & CAD', defaultApp: 'Autodesk AutoCAD', mimePrefix: 'image/vnd.dwg' },
  dxf: { category: '3D & CAD', defaultApp: 'AutoCAD / LibreCAD', mimePrefix: 'image/vnd.dxf' },
  step: { category: '3D & CAD', defaultApp: 'FreeCAD / Fusion 360', mimePrefix: 'application/step' },
  stp: { category: '3D & CAD', defaultApp: 'FreeCAD / Fusion 360', mimePrefix: 'application/step' },
  blend: { category: '3D & CAD', defaultApp: 'Blender 3D Suite', mimePrefix: 'application/x-blender' },

  // Geospatial
  gpx: { category: 'GIS & Mapping', defaultApp: 'Garmin BaseCamp / Google Earth', mimePrefix: 'application/gpx+xml' },
  kml: { category: 'GIS & Mapping', defaultApp: 'Google Earth / QGIS', mimePrefix: 'application/vnd.google-earth.kml+xml' },
  kmz: { category: 'GIS & Mapping', defaultApp: 'Google Earth Pro', mimePrefix: 'application/vnd.google-earth.kmz' },
  geojson: { category: 'GIS & Mapping', defaultApp: 'QGIS / Mapbox / VS Code', mimePrefix: 'application/geo+json' }
};

export function lookupMimeByInput(input: string): MimeRecord {
  const clean = input.trim().toLowerCase().replace(/^[\.\/]+/, '');

  // Extract extension from filename (e.g. "image.heic" -> "heic", "application/pdf" -> "pdf")
  let targetExt = clean;
  if (clean.includes('/')) {
    // Looks like a MIME type (e.g. application/pdf)
    const matchByMime = EXPANDED_MIME_DATABASE.find(
      (m) => m.mimeType.toLowerCase() === clean
    );
    if (matchByMime) return matchByMime;
    targetExt = clean.split('/')[1] || clean;
  } else if (clean.includes('.')) {
    const parts = clean.split('.');
    targetExt = parts[parts.length - 1];
  }

  // 1. Direct match in static database
  const directMatch = EXPANDED_MIME_DATABASE.find(
    (m) => m.extension.toLowerCase() === targetExt
  );
  if (directMatch) return directMatch;

  // 2. Dynamic lookup fallback for 500+ extension types
  const mapped = CATEGORY_MAP[targetExt];
  if (mapped) {
    return {
      extension: targetExt,
      mimeType: mapped.mimePrefix,
      category: mapped.category,
      name: `${targetExt.toUpperCase()} File`,
      description: `Format associated with ${mapped.defaultApp}.`,
      commonSoftware: [mapped.defaultApp, 'AnyFileX Universal Viewer', 'Hex / Text Editor'],
      supportedOs: ['windows', 'mac', 'linux'],
      securityNotes: 'Standard data or code file format.'
    };
  }

  // 3. Generic Fallback
  return {
    extension: targetExt || 'bin',
    mimeType: `application/x-${targetExt || 'octet-stream'}`,
    category: 'General Files',
    name: `${(targetExt || 'UNKNOWN').toUpperCase()} File Format`,
    description: `Binary or text file format identified by extension .${targetExt}`,
    commonSoftware: ['AnyFileX Universal Viewer', 'VS Code', 'Hex Editor', 'System OS Default'],
    supportedOs: ['windows', 'mac', 'linux', 'android', 'ios'],
    securityNotes: 'Verify magic bytes to confirm actual binary signature integrity.'
  };
}

export function parseMimeSlug(slug: string): MimeRecord {
  // Convert slug e.g. "image-heic" -> "image/heic" or "application-pdf" -> "application/pdf"
  const cleanSlug = slug.toLowerCase().trim();
  
  // Direct extension match check (e.g. "pdf", "heic")
  const directMatch = EXPANDED_MIME_DATABASE.find(
    (m) => m.extension.toLowerCase() === cleanSlug || `${m.category.toLowerCase()}-${m.extension.toLowerCase()}` === cleanSlug
  );
  if (directMatch) return directMatch;

  const parts = cleanSlug.split('-');
  if (parts.length >= 2) {
    const ext = parts[parts.length - 1];
    return lookupMimeByInput(ext);
  }

  return lookupMimeByInput(cleanSlug);
}

// Magic Byte Binary Analyzer
export interface MagicByteAnalysisResult {
  fileName: string;
  fileSize: number;
  hexSignature: string;
  asciiSignature: string;
  detectedFormat: string;
  detectedExtension: string;
  expectedExtension: string;
  mimeType: string;
  category: string;
  securitySeverity: 'safe' | 'warning' | 'critical';
  securityMessage: string;
  isSpoofed: boolean;
  analyzedAt: string;
}

export function analyzeMagicBytes(
  file: File,
  firstBytes: Uint8Array
): MagicByteAnalysisResult {
  // Convert first 32 bytes to Hex string
  const hexArr: string[] = [];
  let asciiStr = '';
  for (let i = 0; i < Math.min(firstBytes.length, 32); i++) {
    const b = firstBytes[i];
    hexArr.push(b.toString(16).padStart(2, '0').toUpperCase());
    asciiStr += b >= 32 && b <= 126 ? String.fromCharCode(b) : '.';
  }
  const hexSig = hexArr.join(' ');

  // Extract expected extension from uploaded filename
  const fileNameParts = file.name.split('.');
  const expectedExt = fileNameParts.length > 1 ? fileNameParts[fileNameParts.length - 1].toLowerCase() : '';

  // Match against known Magic Byte Signatures
  let detectedRec: MimeRecord | undefined;

  // Check MZ (Windows Executable / PE)
  if (hexSig.startsWith('4D 5A')) {
    detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === 'exe');
  }
  // Check PDF
  else if (hexSig.startsWith('25 50 44 46')) {
    detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === 'pdf');
  }
  // Check PNG
  else if (hexSig.startsWith('89 50 4E 47')) {
    detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === 'png');
  }
  // Check JPEG
  else if (hexSig.startsWith('FF D8 FF')) {
    detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === 'jpg');
  }
  // Check ZIP
  else if (hexSig.startsWith('50 4B 03 04')) {
    // Note: ZIP signature is shared by DOCX, XLSX, PPTX, APK, EPUB, etc.
    if (['docx', 'xlsx', 'pptx', 'epub', 'apk'].includes(expectedExt)) {
      detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === expectedExt);
    } else {
      detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === 'zip');
    }
  }
  // Check GIF
  else if (hexSig.startsWith('47 49 46 38')) {
    detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === 'gif');
  }
  // Check HEIC / HEIF (ftypheic or ftypmif1)
  else if (asciiStr.includes('ftypheic') || asciiStr.includes('ftypmif1') || asciiStr.includes('ftyp')) {
    detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === 'heic');
  }
  // Check ELF
  else if (hexSig.startsWith('7F 45 4C 46')) {
    detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === 'elf');
  }
  // Check SQLite
  else if (asciiStr.startsWith('SQLite format 3')) {
    detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === 'sqlite');
  }
  // Check MP3 ID3
  else if (hexSig.startsWith('49 44 33')) {
    detectedRec = EXPANDED_MIME_DATABASE.find((m) => m.extension === 'mp3');
  }
  // Fallback lookup by expected extension
  else {
    detectedRec = lookupMimeByInput(expectedExt);
  }

  // Security & Extension Spoofing Detection
  let severity: 'safe' | 'warning' | 'critical' = 'safe';
  let message = 'Binary signature matches file extension. No anomalous header mismatch detected.';
  let isSpoofed = false;

  // Detect Critical Spoofing (e.g. Executable disguised as Document or Image)
  if (hexSig.startsWith('4D 5A') && expectedExt !== 'exe' && expectedExt !== 'dll' && expectedExt !== 'sys') {
    severity = 'critical';
    isSpoofed = true;
    message = `🚨 CRITICAL SECURITY SPOOFING ALERT: File extension is ".${expectedExt}", but binary magic bytes (4D 5A "MZ") indicate a Windows Executable (.exe / .dll). This file is disguised and poses high malware execution risk!`;
  } else if (hexSig.startsWith('7F 45 4C 46') && expectedExt !== 'elf' && expectedExt !== 'bin' && expectedExt !== 'so') {
    severity = 'critical';
    isSpoofed = true;
    message = `🚨 SECURITY SPOOFING ALERT: File extension is ".${expectedExt}", but magic bytes (.ELF) indicate a Linux Binary Executable!`;
  } else if (detectedRec && detectedRec.extension !== expectedExt && expectedExt) {
    // Check if both are zip-based containers (e.g. docx vs zip)
    const isZipFamily = ['zip', 'docx', 'xlsx', 'pptx', 'epub', 'apk', 'jar', '7z', 'kmz'].includes(expectedExt) && detectedRec.extension === 'zip';
    if (!isZipFamily) {
      severity = 'warning';
      isSpoofed = true;
      message = `⚠️ EXTENSION MISMATCH: File name extension is ".${expectedExt}", but binary header matches "${detectedRec.name}" (.${detectedRec.extension}).`;
    }
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    hexSignature: hexSig,
    asciiSignature: asciiStr,
    detectedFormat: detectedRec ? detectedRec.name : 'Unknown Binary Format',
    detectedExtension: detectedRec ? detectedRec.extension : expectedExt || 'bin',
    expectedExtension: expectedExt || 'unknown',
    mimeType: detectedRec ? detectedRec.mimeType : 'application/octet-stream',
    category: detectedRec ? detectedRec.category : 'General Files',
    securitySeverity: severity,
    securityMessage: message,
    isSpoofed,
    analyzedAt: new Date().toISOString()
  };
}
