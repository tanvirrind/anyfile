import { GuideInfo, BlogPost } from '../types';
import { AUTHOR_AVATARS, TECHNICAL_STANDARDS_CITATIONS } from '../lib/content/editorialTeam';

const BASE_GUIDES_LIST: GuideInfo[] = [
  {
    id: 'heic-guide',
    title: 'The Definitive Guide to Opening and Converting HEIC Files on Windows 11 and Mac',
    slug: 'how-to-open-heic-files-windows-mac',
    summary: 'Learn how to open, view, batch convert, and troubleshoot Apple HEIC photos on PC, Mac, Linux, and Android.',
    category: 'Photography',
    readTime: '6 min read',
    date: 'July 2024',
    lastAuditedDate: 'September 2026',
    difficulty: 'Beginner',
    author: {
      name: 'Elena Rostova',
      role: 'Lead Digital Media & Codec Engineer',
      avatar: AUTHOR_AVATARS.elenaRostova,
      credentials: 'M.Sc., Signal Processing',
      bio: 'Elena specializes in modern high-efficiency image container parsing, ISOBMFF box decomposition, and color profile preservation.'
    },
    reviewedBy: {
      name: 'Dr. Alistair Vance',
      role: 'Principal Systems Architect',
      credentials: 'Ph.D., CompEng'
    },
    verifiedPlatforms: [
      'Windows 11 (23H2 & 24H2)',
      'macOS Sonoma (14.6) & Sequoia (15.0)',
      'Ubuntu 24.04 LTS',
      'iOS 18',
      'Android 15'
    ],
    citations: TECHNICAL_STANDARDS_CITATIONS.heic.map(c => ({
      standard: c.standard,
      title: c.title,
      issuingBody: c.issuingBody,
      url: c.url
    })),
    relatedExtensions: ['HEIC', 'WEBP', 'JPG', 'PNG'],
    contentSections: [
      {
        heading: 'What is HEIC and Why Does Apple Use It?',
        body: 'HEIC (High Efficiency Image Container) is the modern file format used by iPhones and iPads running iOS 11 and newer. It utilizes High Efficiency Video Coding (HEVC) compression to reduce file size by approximately 50% compared to traditional JPEGs while preserving superior 16-bit color depth.',
        callout: 'Pro Tip: HEIC photos store live photo motion bursts, multi-camera depth maps, and alpha channel transparency in a single file.'
      },
      {
        heading: 'How to Open HEIC Files on Windows 10 and 11',
        body: 'Windows does not ship with HEVC video extensions enabled out of the box due to patent licensing fees. Here are the three easiest ways to view HEIC files on Windows:',
        bullets: [
          'Install Microsoft HEIF Image Extensions & HEVC Video Extensions from the Microsoft Store.',
          'Use CopyTrans HEIC for Windows (Free for personal use) to enable native thumbnails in File Explorer.',
          'Use AnyFileX Web Converter to convert HEIC photos to JPG instantly in your browser without installing software.'
        ]
      },
      {
        heading: 'How to Automatically Convert iPhone Photos to JPG When Transferring',
        body: 'If you frequently transfer photos from your iPhone to a Windows PC, you can configure iOS to automatically convert HEIC files to JPG during USB transfer:',
        bullets: [
          'Open Settings on your iPhone.',
          'Scroll down and tap Photos.',
          'Scroll to the bottom section titled "TRANSFER TO MAC OR PC".',
          'Select Automatic instead of Keep Originals.'
        ]
      }
    ]
  },
  {
    id: 'dwg-guide',
    title: 'How to View, Edit, and Convert AutoCAD DWG Drawings Without AutoCAD',
    slug: 'view-dwg-files-without-autocad',
    summary: 'A complete architectural guide to inspecting binary DWG blueprints, converting CAD drawings to vector PDF, and fixing corrupt drawing tables.',
    category: 'CAD',
    readTime: '8 min read',
    date: 'June 2024',
    lastAuditedDate: 'September 2026',
    difficulty: 'Intermediate',
    author: {
      name: 'Marcus Vance',
      role: 'Senior CAD Systems Architect & Engineering Data Specialist',
      avatar: AUTHOR_AVATARS.marcusVance,
      credentials: 'B.Arch, P.E.',
      bio: 'Licensed Professional Engineer (P.E.) with 14 years specializing in geometric data schemas, B-rep structures, and CAD interchange.'
    },
    reviewedBy: {
      name: 'Dr. Alistair Vance',
      role: 'Principal Systems Architect',
      credentials: 'Ph.D., CompEng'
    },
    verifiedPlatforms: [
      'Windows 11 Pro 24H2 (x86_64)',
      'macOS Sequoia (Apple Silicon)',
      'Ubuntu 24.04 LTS (LibreCAD / ODA)'
    ],
    citations: TECHNICAL_STANDARDS_CITATIONS.dwg.map(c => ({
      standard: c.standard,
      title: c.title,
      issuingBody: c.issuingBody,
      url: c.url
    })),
    relatedExtensions: ['DWG', 'DXF', 'STEP', 'PDF'],
    contentSections: [
      {
        heading: 'Understanding the DWG Drawing Format',
        body: 'DWG (Drawing) is a proprietary binary format created by Autodesk in 1982. It stores 2D vector geometry, 3D surface meshes, building information modeling (BIM) data, layers, and geospatial coordinates.',
        callout: 'DWG Version Check: The first 6 bytes of every DWG file contain the version code. For example, AC1032 indicates AutoCAD 2018-2024 drawing format.'
      },
      {
        heading: 'Free DWG Viewers for Desktop and Web',
        body: 'You do not need an expensive AutoCAD subscription just to inspect or print a DWG drawing:',
        bullets: [
          'Autodesk DWG TrueView: Official free standalone desktop viewer from Autodesk with full measurement tools.',
          'Autodesk Web Viewer: Drag and drop DWG files into your web browser to view, measure, and mark up 2D drawings.',
          'LibreCAD: Open-source 2D CAD drafting software for Windows, Mac, and Linux.'
        ]
      }
    ]
  },
  {
    id: 'zip-guide',
    title: 'Fixing Corrupted ZIP Archives and CRC Errors: Step-by-Step Recovery Guide',
    slug: 'fix-corrupted-zip-archives-crc-errors',
    summary: 'Learn how to recover data from damaged ZIP archives, fix bad headers, and force extraction using open-source tools.',
    category: 'Windows',
    readTime: '5 min read',
    date: 'May 2024',
    lastAuditedDate: 'September 2026',
    difficulty: 'Intermediate',
    author: {
      name: 'David Chen',
      role: 'Systems Security Architect & Threat Forensics Researcher',
      avatar: AUTHOR_AVATARS.davidChen,
      credentials: 'CISSP, GCIH',
      bio: 'Cybersecurity researcher with CISSP credentials focusing on archive decompression security, file integrity, and payload analysis.'
    },
    reviewedBy: {
      name: 'Sarah Jenkins',
      role: 'Data Architect & IANA Standards Specialist',
      credentials: 'M.Sc., Systems'
    },
    verifiedPlatforms: [
      'Windows 11 (Command Prompt & PowerShell)',
      'macOS Terminal (unzip & 7z CLI)',
      'Linux Ubuntu 24.04 LTS'
    ],
    citations: TECHNICAL_STANDARDS_CITATIONS.zip.map(c => ({
      standard: c.standard,
      title: c.title,
      issuingBody: c.issuingBody,
      url: c.url
    })),
    relatedExtensions: ['ZIP', 'RAR', '7Z'],
    contentSections: [
      {
        heading: 'Why Do ZIP Archives Get Corrupted?',
        body: 'ZIP archives rely on a Central Directory header written at the very end of the file. If a file download is interrupted, or if storage drive sectors fail, the archive engine cannot find the file index.',
        bullets: [
          'Interrupted network downloads cutting off trailing header bytes.',
          'CRC checksum mismatches caused by bad RAM or drive sectors.',
          'Interrupted USB flash drive transfers.'
        ]
      }
    ]
  }
];

const GUIDE_ENRICHMENTS: Record<string, GuideInfo['contentSections']> = {
  'dwg-guide': [
    { heading: 'Choosing the Right DWG Viewer', body: 'A viewer is enough when you need to measure, print, or review a drawing, but editing and recovery require an application that understands the drawing version and proxy objects. Autodesk DWG TrueView is useful on Windows for inspection and plotting. Web viewers are convenient for quick review, while LibreCAD and other open tools may be better for simple 2D workflows. Always confirm that external references, fonts, line weights, and layouts are present before approving a drawing.' },
    { heading: 'Converting DWG to PDF Without Losing Context', body: 'Plot the intended paper-space layout rather than exporting only the model view. Check page size, scale, orientation, plot style, layer visibility, fonts, and XREF paths. A PDF is excellent for review and distribution, but it does not preserve the full editable CAD database. Keep the original DWG and a record of the application and plot settings used to create the PDF.' },
    { heading: 'Safe DWG Recovery Workflow', body: 'Work on a copy and try RECOVER, AUDIT, and PURGE in that order where appropriate. Compare BAK and SV$ files before rebuilding geometry manually. If the drawing opens partially, export healthy layers into a new file and record missing blocks, proxy objects, XREFs, and annotation data. Do not overwrite the only copy during recovery.' }
  ],
  'zip-guide': [
    { heading: 'Diagnose the ZIP Error Before Repairing', body: 'An unexpected end-of-archive message usually points to truncation, while a CRC error identifies a member whose decompressed data does not match its recorded checksum. A missing volume means the archive set is incomplete. Compare the file size with the source and keep the original untouched before trying repair or force-extraction commands.' },
    { heading: 'Recover Readable Files Safely', body: 'Try listing the archive first, then extract into an empty destination. Some tools can recover local file entries even when the central directory is damaged. Prioritize documents and media that can be validated independently, and treat recovered executables as untrusted until scanned. Recovery cannot recreate bytes that were never downloaded or were overwritten.' },
    { heading: 'Prevent Future Archive Corruption', body: 'Use checksums for important downloads, keep multi-part volumes together, and eject removable storage only after compression has finished. For critical backups, maintain a second copy and consider parity recovery data. Password protection and compression are separate concerns: encryption can protect confidentiality but does not prevent storage corruption.' }
  ]
};

export const GUIDES_LIST: GuideInfo[] = BASE_GUIDES_LIST.map((guide) => ({
  ...guide,
  contentSections: [...guide.contentSections, ...(GUIDE_ENRICHMENTS[guide.id] || [])]
}));

const BASE_BLOG_POSTS: BlogPost[] = [
  {
    id: 'magic-bytes-explained',
    title: 'Why Extension Names Lie: Understanding Magic Bytes & Raw Header Inspection',
    slug: 'understanding-magic-bytes-file-headers',
    summary: 'Renaming .exe to .jpg does not change what a file actually is. Learn how operating systems and security tools inspect magic bytes.',
    category: 'Tutorials',
    date: 'July 2024',
    lastAuditedDate: 'September 2026',
    readTime: '5 min read',
    author: {
      name: 'David Chen',
      role: 'Systems Security Architect & Threat Forensics Researcher',
      avatar: AUTHOR_AVATARS.davidChen,
      credentials: 'CISSP, GCIH',
      bio: 'Specialist in binary payload detection, header spoofing forensics, and file signature parsing.'
    },
    reviewedBy: {
      name: 'Dr. Alistair Vance',
      role: 'Principal Systems Architect',
      credentials: 'Ph.D., CompEng'
    },
    citations: TECHNICAL_STANDARDS_CITATIONS.magicBytes.map(c => ({
      standard: c.standard,
      title: c.title,
      url: c.url
    })),
    tags: ['Security', 'Magic Bytes', 'Binary Analysis'],
    relatedExtensions: ['DAT', 'EXE', 'HEIC', 'ZIP', 'PDF'],
    content: `File extensions like .jpg or .pdf are merely hints for desktop operating systems. Attackers and malware authors frequently trick users by renaming malicious executable binaries (.exe) to innocent document extensions (.pdf or .jpg).

To reliably detect what a file actually is, operating systems, security scanners, and AnyFileX read the first 4 to 32 bytes of the file—known as **Magic Bytes** or **File Signatures**.

### Examples of Common Magic Byte Signatures:
- **PDF Documents**: \`25 50 44 46 2D\` (\`%PDF-\`)
- **PNG Images**: \`89 50 4E 47 0D 0A 1A 0A\` (\`PNG\`)
- **ZIP Archives**: \`50 4B 03 04\` (\`PK..\`)
- **Windows Executables (EXE/DLL)**: \`4D 5A\` (\`MZ\`)

When you upload a file to AnyFileX's File Identifier, our WebAssembly engine checks these magic bytes directly in your browser memory, guaranteeing accurate format detection regardless of file name.`
  },
  {
    id: 'next-gen-image-codecs',
    title: 'AVIF vs WebP vs HEIC vs JPEG: Which Image Format Should You Use in 2025?',
    slug: 'avif-vs-webp-vs-heic-vs-jpeg-comparison',
    summary: 'A deep architectural comparison of modern image compression codecs, browser support, transparency, and page speed impacts.',
    category: 'Comparisons',
    date: 'June 2024',
    lastAuditedDate: 'September 2026',
    readTime: '7 min read',
    author: {
      name: 'Elena Rostova',
      role: 'Lead Digital Media & Codec Engineer',
      avatar: AUTHOR_AVATARS.elenaRostova,
      credentials: 'M.Sc., Signal Processing',
      bio: 'Specialist in next-generation lossy and lossless image codecs and browser rendering performance.'
    },
    reviewedBy: {
      name: 'Dr. Alistair Vance',
      role: 'Principal Systems Architect',
      credentials: 'Ph.D., CompEng'
    },
    citations: TECHNICAL_STANDARDS_CITATIONS.webp.map(c => ({
      standard: c.standard,
      title: c.title,
      url: c.url
    })),
    tags: ['Web Performance', 'Image Codecs', 'Optimization'],
    relatedExtensions: ['HEIC', 'WEBP', 'JPG', 'PNG', 'AVIF'],
    content: `Choosing the right image format can drastically improve website speed and reduce server bandwidth costs. In this guide, we break down the performance tradeoffs between JPEG, WebP, AVIF, and HEIC.`
  },
  {
    id: 'how-to-open-unknown-files',
    title: 'How to Open Unknown Files Safely: A Practical File Identification Guide',
    slug: 'how-to-open-unknown-files-safely',
    summary: 'Learn how to identify an unfamiliar file, verify its header, choose a compatible application, and avoid malware disguised with a misleading extension.',
    category: 'Tips',
    date: 'September 2026',
    lastAuditedDate: 'September 2026',
    readTime: '6 min read',
    author: {
      name: 'David Chen',
      role: 'Systems Security Architect & Threat Forensics Researcher',
      avatar: AUTHOR_AVATARS.davidChen,
      credentials: 'CISSP, GCIH',
      bio: 'Specialist in file-signature analysis, extension spoofing, and safe local inspection workflows.'
    },
    reviewedBy: {
      name: 'Dr. Alistair Vance',
      role: 'Principal Systems Architect',
      credentials: 'Ph.D., CompEng'
    },
    citations: TECHNICAL_STANDARDS_CITATIONS.magicBytes.map(c => ({
      standard: c.standard,
      title: c.title,
      url: c.url
    })),
    tags: ['File Safety', 'Magic Bytes', 'Troubleshooting', 'Privacy'],
    relatedExtensions: ['DAT', 'EXE', 'ZIP', 'PDF', 'CAMREC', 'AWBS'],
    content: `An unfamiliar filename is not enough to identify a file. The extension is only a label used by the operating system; the internal header, structure, and application that created the file provide stronger evidence.

Start with the source. Ask where the file came from, which device or application created it, and whether the sender expected a document, image, archive, recording, or database. This context helps distinguish a legitimate proprietary file from a renamed or incomplete download.

Next, inspect the file locally before opening it in a full application. AnyFileX File Identifier and Magic Byte Detector can read the opening bytes in your browser without uploading the file. Compare the detected signature with the filename extension. Common examples include %PDF- for PDF documents, PK for ZIP-based containers, MZ for Windows executables, and SQLite format 3 for SQLite databases.

If the header and extension disagree, do not force the file open by changing its name. A renamed executable can still run as an executable, and renaming a proprietary database to .txt does not make it readable. Keep the original unchanged and work from a copy.

Choose software from the producing vendor or a well-known, maintained viewer. For specialized formats, a generic application may show raw bytes but cannot interpret the file’s relationships, metadata, or calculations. Avoid unofficial cracked viewers and browser uploads when the file contains private, financial, medical, aviation, or work-related information.

Scan files from untrusted sources with current security software, especially archives, executable formats, office documents with macros, and files that ask you to install a codec or viewer. If a file is corrupted, re-download or request a fresh export before attempting repair. Preserve a backup and record a checksum when the file matters.

The safest workflow is: identify the source, inspect the header, verify the detected format, open a copy with trusted software, and keep the original available for comparison. This approach resolves most “Windows cannot open this file” errors without guessing or exposing the file to an unnecessary online service.`
  }
];

const BLOG_ENRICHMENTS: Record<string, string> = {
  'next-gen-image-codecs': `Choosing an image format starts with the delivery requirement, not with a single compression score. JPEG remains useful when compatibility with older software, cameras, and publishing systems matters. WebP is a practical web format with lossy, lossless, transparency, and animation support. AVIF can deliver excellent compression and modern color features, but encoding cost, editing support, and browser or application compatibility should be checked for the intended audience. HEIC and HEIF are especially common in Apple and mobile-camera workflows, where they can preserve photo features and reduce storage compared with JPEG.

For website images, compare the actual files at the dimensions users will receive. A large source image that is resized in CSS still transfers more bytes than necessary. Generate responsive sizes, choose a meaningful quality setting, preserve important metadata only when needed, and test the result on text, gradients, skin tones, transparency, and fine detail. A visually small file is not automatically better if it introduces ringing or destroys readable edges.

Transparency and animation narrow the choice. PNG is dependable for lossless graphics and alpha channels, WebP supports both transparency and animation, and AVIF can support modern image features but may need fallback handling. HEIC is efficient for personal photo storage but is not always the safest public-web delivery format because older browsers and editing tools may not decode it.

The best workflow is usually adaptive: keep an original or archival master, create appropriately sized delivery variants, serve a widely supported fallback, and measure real page performance. Format selection should balance bytes, decode time, browser support, visual quality, accessibility, and the cost of maintaining multiple assets rather than optimizing one laboratory image in isolation.`
};

export const BLOG_POSTS: BlogPost[] = BASE_BLOG_POSTS.map((post) => ({
  ...post,
  ...(BLOG_ENRICHMENTS[post.id] ? { content: BLOG_ENRICHMENTS[post.id] } : {})
}));

export const GUIDES_DATA = GUIDES_LIST;
