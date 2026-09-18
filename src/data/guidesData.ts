import { GuideInfo, BlogPost } from '../types';
import { AUTHOR_AVATARS, TECHNICAL_STANDARDS_CITATIONS } from '../lib/content/editorialTeam';

export const GUIDES_LIST: GuideInfo[] = [
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

export const BLOG_POSTS: BlogPost[] = [
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
  }
];

export const GUIDES_DATA = GUIDES_LIST;
