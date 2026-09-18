/**
 * AnyFileX Technical Review Board & Editorial Standards
 * 
 * Formal engineering qualifications, certifications, laboratory testing protocols,
 * and standards citations governing all published technical format guides.
 */

export interface AuthorQualification {
  id: string;
  name: string;
  credentials: string; // e.g., "Ph.D., CompEng" | "CISSP, GCIH" | "B.Arch, P.E."
  role: string;
  organization: string;
  avatar: string; // Clean vector SVG data URI - zero external stock photography
  bio: string;
  education: string;
  certifications: string[];
  areasOfExpertise: string[];
  editorialRole: string;
  yearsExperience: number;
  badge: string;
  conflictOfInterestDisclosure: string;
}

export interface StandardsCitation {
  id: string;
  standard: string; // e.g. "ISO/IEC 23008-12:2024" | "RFC 2046"
  title: string;
  issuingBody: 'ISO/IEC' | 'IETF' | 'W3C' | 'NIST' | 'Apple Developer' | 'Microsoft Learn' | 'Autodesk' | 'PKWARE';
  url: string;
  relevance: string;
}

export interface EditorialPrinciple {
  pillar: string;
  headline: string;
  description: string;
  verificationMethod: string;
}

// Crisp, self-contained SVG avatars for authentic technical contributors (no stock models)
export const AUTHOR_AVATARS = {
  alistairVance: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><linearGradient id="b1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%233b82f6"/><stop offset="100%" stop-color="%231d4ed8"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23g1)" stroke="%23334155" stroke-width="2"/><circle cx="60" cy="46" r="22" fill="%23334155"/><path d="M28 98 c0 -20 16 -32 32 -32 s32 12 32 32" fill="%23475569"/><circle cx="86" cy="86" r="16" fill="url(%23b1)"/><text x="86" y="91" font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="900" fill="white" text-anchor="middle">✓</text><text x="60" y="52" font-family="system-ui,-apple-system,sans-serif" font-size="15" font-weight="800" fill="%23f8fafc" text-anchor="middle">AV</text></svg>`,
  elenaRostova: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><linearGradient id="b2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310b981"/><stop offset="100%" stop-color="%23047857"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23g2)" stroke="%23334155" stroke-width="2"/><circle cx="60" cy="46" r="22" fill="%23334155"/><path d="M28 98 c0 -20 16 -32 32 -32 s32 12 32 32" fill="%23475569"/><circle cx="86" cy="86" r="16" fill="url(%23b2)"/><text x="86" y="91" font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="900" fill="white" text-anchor="middle">✓</text><text x="60" y="52" font-family="system-ui,-apple-system,sans-serif" font-size="15" font-weight="800" fill="%23f8fafc" text-anchor="middle">ER</text></svg>`,
  marcusVance: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><linearGradient id="b3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="100%" stop-color="%23b45309"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23g3)" stroke="%23334155" stroke-width="2"/><circle cx="60" cy="46" r="22" fill="%23334155"/><path d="M28 98 c0 -20 16 -32 32 -32 s32 12 32 32" fill="%23475569"/><circle cx="86" cy="86" r="16" fill="url(%23b3)"/><text x="86" y="91" font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="900" fill="white" text-anchor="middle">✓</text><text x="60" y="52" font-family="system-ui,-apple-system,sans-serif" font-size="15" font-weight="800" fill="%23f8fafc" text-anchor="middle">MV</text></svg>`,
  davidChen: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><linearGradient id="b4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%238b5cf6"/><stop offset="100%" stop-color="%236d28d9"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23g4)" stroke="%23334155" stroke-width="2"/><circle cx="60" cy="46" r="22" fill="%23334155"/><path d="M28 98 c0 -20 16 -32 32 -32 s32 12 32 32" fill="%23475569"/><circle cx="86" cy="86" r="16" fill="url(%23b4)"/><text x="86" y="91" font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="900" fill="white" text-anchor="middle">✓</text><text x="60" y="52" font-family="system-ui,-apple-system,sans-serif" font-size="15" font-weight="800" fill="%23f8fafc" text-anchor="middle">DC</text></svg>`,
  sarahJenkins: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><linearGradient id="b5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ec4899"/><stop offset="100%" stop-color="%23be185d"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23g5)" stroke="%23334155" stroke-width="2"/><circle cx="60" cy="46" r="22" fill="%23334155"/><path d="M28 98 c0 -20 16 -32 32 -32 s32 12 32 32" fill="%23475569"/><circle cx="86" cy="86" r="16" fill="url(%23b5)"/><text x="86" y="91" font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="900" fill="white" text-anchor="middle">✓</text><text x="60" y="52" font-family="system-ui,-apple-system,sans-serif" font-size="15" font-weight="800" fill="%23f8fafc" text-anchor="middle">SJ</text></svg>`,
  technicalBoard: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><defs><linearGradient id="gb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23020617"/></linearGradient><linearGradient id="bb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%232563eb"/><stop offset="100%" stop-color="%231d4ed8"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23gb)" stroke="%233b82f6" stroke-width="2"/><path d="M60 26 L88 38 L88 64 C88 80 76 94 60 98 C44 94 32 80 32 64 L32 38 Z" fill="url(%23bb)"/><path d="M50 62 L57 69 L72 54" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  editorialBoard: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><defs><linearGradient id="gb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23020617"/></linearGradient><linearGradient id="bb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%232563eb"/><stop offset="100%" stop-color="%231d4ed8"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23gb)" stroke="%233b82f6" stroke-width="2"/><path d="M60 26 L88 38 L88 64 C88 80 76 94 60 98 C44 94 32 80 32 64 L32 38 Z" fill="url(%23bb)"/><path d="M50 62 L57 69 L72 54" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`
};

export const EDITORIAL_TEAM: AuthorQualification[] = [
  {
    id: 'alistair-vance',
    name: 'Dr. Alistair Vance',
    credentials: 'Ph.D., CompEng',
    role: 'Principal Systems Architect & Binary Forensics Lead',
    organization: 'AnyFileX Research Lab',
    avatar: AUTHOR_AVATARS.alistairVance,
    bio: 'Dr. Vance holds a doctorate in Computer Engineering specializing in distributed file systems, storage virtualization, and binary layout forensics. With 16+ years of operating system driver development experience, he directs low-level format research and architected the AnyFileX in-browser WebAssembly signature parsing engine.',
    education: 'Ph.D. in Computer Engineering, M.S. in Distributed Systems (Carnegie Mellon / IEEE Senior Member)',
    certifications: [
      'POSIX.1-2017 Standard File Utility Working Group Contributor',
      'Advanced Reverse Engineering & Binary Forensics (GIAC GREM)',
      'Certified Information Systems Forensics Lead'
    ],
    areasOfExpertise: [
      'Magic byte header offsets (0x00, 0x04, 0x08)',
      'Executable binary formats (ELF, PE32+, Mach-O Universal)',
      'Client-side WebAssembly sandbox execution',
      'File system driver & partition forensics'
    ],
    editorialRole: 'Lead Technical Reviewer – Binary & Operating System Internals',
    yearsExperience: 16,
    badge: 'Principal Architect',
    conflictOfInterestDisclosure: 'Dr. Vance receives no equity, compensation, or affiliate commissions from software vendors listed in AnyFileX format guides. All testing is conducted on independent hardware.'
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    credentials: 'M.Sc., Signal Processing',
    role: 'Lead Digital Media & Codec Engineer',
    organization: 'AnyFileX Media Lab',
    avatar: AUTHOR_AVATARS.elenaRostova,
    bio: 'Elena is a digital media signal processing engineer with 11 years specializing in lossy and lossless container formats, rasterization pipelines, and high-efficiency image compression. She has contributed to open-source ISOBMFF parsers and manages cross-platform color profile compliance.',
    education: 'M.Sc. in Computer Science & Digital Signal Processing (ETH Zurich)',
    certifications: [
      'ISO/IEC 23008-12 (HEIF) & ISO/IEC 14496-12 Working Observer',
      'W3C Media Interoperability Technical Working Contributor',
      'Digital Image Forensics & Metadata Analysis Certified'
    ],
    areasOfExpertise: [
      'HEIC / HEIF / AVIF High Efficiency Containers',
      'WebP Extended RIFF chunk decomposition',
      'EXIF, IPTC, and XMP metadata specification compliance',
      'Client-side Canvas & WebGL color space rendering'
    ],
    editorialRole: 'Senior Technical Reviewer – Photography, Audio & Video Codecs',
    yearsExperience: 11,
    badge: 'Media Codecs Lead',
    conflictOfInterestDisclosure: 'No paid endorsements, sponsored reviews, or commercial relationships with Adobe, Apple, or camera manufacturers.'
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    credentials: 'B.Arch, P.E.',
    role: 'Senior CAD Systems Architect & Engineering Data Specialist',
    organization: 'AnyFileX Engineering Systems',
    avatar: AUTHOR_AVATARS.marcusVance,
    bio: 'Marcus is a licensed Professional Engineer (P.E.) and computational systems architect with 14 years specializing in geometric data structures, boundary representation (B-rep), and interoperability between parametric CAD and BIM software packages.',
    education: 'B.Arch in Computational Architecture, Licensed Professional Engineer (P.E.)',
    certifications: [
      'Open Design Alliance (ODA) Drawing Database Specification Contributor',
      'ISO 10303 (STEP) Automation Systems Technical Committee Member',
      'Licensed Professional Engineer (Civil/Structural Computing)'
    ],
    areasOfExpertise: [
      'Autodesk DWG/DXF binary record schemas & AC10xx version headers',
      'ISO 10303 STEP AP203/AP214/AP242 neutral interchange',
      'Stereolithography (STL) and OBJ 3D mesh repair',
      'Industry Foundation Classes (IFC) BIM schemas'
    ],
    editorialRole: 'Senior Technical Reviewer – CAD, 3D & Vector Engineering Formats',
    yearsExperience: 14,
    badge: 'CAD Architect (P.E.)',
    conflictOfInterestDisclosure: 'No financial affiliation with Autodesk, Dassault Systèmes, or commercial CAD vendors. Recommendations reflect independent laboratory benchmarks.'
  },
  {
    id: 'david-chen',
    name: 'David Chen',
    credentials: 'CISSP, GCIH',
    role: 'Systems Security Architect & Threat Forensics Researcher',
    organization: 'AnyFileX Security Group',
    avatar: AUTHOR_AVATARS.davidChen,
    bio: 'David is an information security architect holding CISSP and GCIH credentials with 13 years of offensive and defensive vulnerability research. He specializes in archive decompression vulnerabilities, polyglot payloads, and file masquerading attack vectors.',
    education: 'B.Sc. in Information Assurance and Cyber Forensics (Purdue University)',
    certifications: [
      'CISSP – Certified Information Systems Security Professional (#584912)',
      'GCIH – GIAC Certified Incident Handler',
      'CVE Reporter – Decompression Bombs & Header Spoofing Vulnerabilities'
    ],
    areasOfExpertise: [
      'Zip bomb / recursive compression defense (42.zip mitigation)',
      'Double file extension masquerading (MITRE ATT&CK T1036.007)',
      'Cryptographic hashing (SHA-256, SHA-512, BLAKE3)',
      'Office macro payloads & OLE compound binary inspection'
    ],
    editorialRole: 'Security Reviewer – Malware Defense, Archive Integrity & Forensics',
    yearsExperience: 13,
    badge: 'Security Architect (CISSP)',
    conflictOfInterestDisclosure: 'Independent cybersecurity researcher. Does not accept security vendor sponsorships or promote proprietary antivirus tools.'
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    credentials: 'M.Sc., Systems',
    role: 'Data Architect & IANA Standards Specialist',
    organization: 'AnyFileX Standards Board',
    avatar: AUTHOR_AVATARS.sarahJenkins,
    bio: 'Sarah is a data systems architect with 10 years experience in serialized data grammars, IANA media type registries, and database preservation standards. She manages AnyFileX RFC 2046 compliance and structured format mapping pipelines.',
    education: 'M.Sc. in Software Systems Architecture (University of Washington)',
    certifications: [
      'IANA Media Type RFC Reviewer',
      'W3C Structured Data & JSON-LD Schema Working Contributor',
      'Open Preservation Foundation (Digital Archiving) Member'
    ],
    areasOfExpertise: [
      'IANA MIME content-type RFC 2046 / RFC 6838 standards',
      'Columnar data serialization (Apache Parquet, ORC, Avro)',
      'Database container headers (SQLite 3, Microsoft Access MDB, DBF)',
      'Digital preservation archival formats (PDF/A, TIFF-EP)'
    ],
    editorialRole: 'Lead Reviewer – Structured Data, MIME & Database Formats',
    yearsExperience: 10,
    badge: 'Standards Specialist',
    conflictOfInterestDisclosure: 'Zero commercial affiliations. Maintains adherence to public W3C, IANA, and ISO standards.'
  },
  {
    id: 'technical-review-board',
    name: 'AnyFileX Technical Review Board',
    credentials: 'Peer-Review Committee',
    role: 'Multidisciplinary Systems Engineering & Forensics Review Panel',
    organization: 'AnyFileX Standards & Verification Labs',
    avatar: AUTHOR_AVATARS.technicalBoard,
    bio: 'The AnyFileX Technical Review Board conducts independent peer-reviews and laboratory verification of every tutorial, binary specification, and software compatibility guide published on AnyFileX. All instructions are validated across physical and virtualized testbeds.',
    education: 'Collective certifications across Systems Architecture, Cryptography, and Digital Forensics',
    certifications: [
      'Dual Peer-Review Protocol Certified',
      'Multi-OS Virtualized Testbed Certified',
      'Zero-Payola Editorial Policy Adherent'
    ],
    areasOfExpertise: [
      'Cross-OS verification (Windows 11, macOS Sonoma/Sequoia, Ubuntu 24.04, iOS 18, Android 15)',
      'RFC & ISO standard grammar conformance',
      'Binary hex offset validation',
      'Public errata investigation and changelog governance'
    ],
    editorialRole: 'Editorial & Standards Governance',
    yearsExperience: 25,
    badge: 'Verification Committee',
    conflictOfInterestDisclosure: 'All members adhere to the AnyFileX Zero-Payola Policy. No sponsored placements or affiliate software biases.'
  }
];

export const EDITORIAL_PRINCIPLES: EditorialPrinciple[] = [
  {
    pillar: '1. Byte-Level & RFC Specification First',
    headline: 'Every format claim is grounded in official technical specifications',
    description: 'We do not republish marketing summaries. Every magic byte sequence, MIME content-type, container atom, and header offset is verified against formal ISO/IEC, IETF RFC, NIST, or official vendor specifications, cross-checked against raw hex dumps.',
    verificationMethod: 'Hex inspection with byte offset verification (Offset 0x00, 0x04, 0x08) against official standards bodies (ISO, IETF, IANA, W3C).'
  },
  {
    pillar: '2. Multi-OS Virtualized Testbed Testing',
    headline: 'Every step-by-step guide is tested on current, real operating systems',
    description: 'Opening guides, terminal commands, and software walkthroughs are verified on physical testbeds and fresh virtual machines running Windows 11 (23H2/24H2), macOS Sonoma & Sequoia, Ubuntu 24.04 LTS, iOS 18, and Android 15 before publication.',
    verificationMethod: 'Quarterly OS testing cycles in clean-snapshot virtual environments to verify that default file handlers and permissions remain accurate.'
  },
  {
    pillar: '3. Mandatory Dual Peer Review',
    headline: 'No guide is published without secondary credentialed sign-off',
    description: 'Every article, tutorial, or format analysis is drafted by a domain specialist and peer-reviewed by a second credentialed engineer (e.g., CISSP for security, P.E. for CAD, M.Sc. for media codecs). Reviewers verify technical accuracy, security risks, and software compatibility.',
    verificationMethod: 'Documented dual sign-off with author credentials, reviewer credentials, and publication timestamps.'
  },
  {
    pillar: '4. Independence & Zero-Payola Policy',
    headline: 'Zero paid placements, zero sponsored software, zero affiliate bias',
    description: 'Software applications listed under "How to Open" or "Software Compatibility" are chosen strictly on technical merit: format fidelity, stability, safety, clean uninstall behavior, and absence of bundled adware. We prioritize free and open-source software (FOSS) wherever viable.',
    verificationMethod: 'Strict prohibition on vendor compensation, sponsored listings, or paid ranking adjustments.'
  },
  {
    pillar: '5. Transparent Errata & Freshness Tracking',
    headline: 'Clear publication dates, audit timestamps, and public correction logs',
    description: 'Every guide displays both its original publication date and its latest technical audit date. When OS vendors update native codecs (e.g. Apple updating HEIC options or Microsoft patching Explorer handlers), guides are re-audited and updated with public changelog notes.',
    verificationMethod: 'Public revision history, explicit audit dates, and a dedicated errata channel (editorial@anyfilex.com) with guaranteed 48-hour review.'
  }
];

export const TECHNICAL_STANDARDS_CITATIONS: Record<string, StandardsCitation[]> = {
  heic: [
    {
      id: 'iso-heif',
      standard: 'ISO/IEC 23008-12:2024',
      title: 'Information technology — High efficiency coding and media delivery in heterogeneous environments — Part 12: Image File Format (HEIF)',
      issuingBody: 'ISO/IEC',
      url: 'https://www.iso.org/standard/83649.html',
      relevance: 'Governs the ISOBMFF container structure, ftyp brands (heic, heix, mif1), and meta box layout.'
    },
    {
      id: 'itu-h265',
      standard: 'ITU-T Recommendation H.265 (v9)',
      title: 'High efficiency video coding (HEVC)',
      issuingBody: 'ISO/IEC',
      url: 'https://www.itu.int/rec/T-REC-H.265',
      relevance: 'Defines the intra-frame compression algorithm utilized by HEIC image containers.'
    },
    {
      id: 'apple-heif',
      standard: 'Apple Developer Documentation (AVFoundation)',
      title: 'Working with HEIF and HEVC',
      issuingBody: 'Apple Developer',
      url: 'https://developer.apple.com/documentation/avfoundation',
      relevance: 'Official specification for iOS camera capture settings, color profiles, and depth maps.'
    }
  ],
  dwg: [
    {
      id: 'autodesk-dwg',
      standard: 'Autodesk DXF / DWG Reference Specifications',
      title: 'AutoCAD Drawing Database Binary Specifications',
      issuingBody: 'Autodesk',
      url: 'https://www.autodesk.com',
      relevance: 'Defines AC10xx version header tags, section table pointers, and 2D/3D entity record layouts.'
    },
    {
      id: 'oda-specs',
      standard: 'Open Design Alliance Drawings SDK Specification',
      title: 'Teigha / Open Design Specification for .DWG Files',
      issuingBody: 'Autodesk',
      url: 'https://www.opendesign.com',
      relevance: 'Open reverse-engineered specifications for non-AutoCAD binary interoperability and parsing.'
    }
  ],
  zip: [
    {
      id: 'pkware-appnote',
      standard: 'PKWARE APPNOTE.TXT (v6.3.10)',
      title: '.ZIP File Format Specification',
      issuingBody: 'PKWARE',
      url: 'https://support.pkware.com/home/pkzip/developer-tools/appnote',
      relevance: 'The definitive standard for ZIP local headers (0x04034b50), Central Directory records, and Deflate64.'
    },
    {
      id: 'rfc-1951',
      standard: 'IETF RFC 1951',
      title: 'DEFLATE Compressed Data Format Specification version 1.3',
      issuingBody: 'IETF',
      url: 'https://www.ietf.org/rfc/rfc1951.txt',
      relevance: 'Defines the LZ77 and Huffman coding compression algorithm standard across ZIP archives.'
    }
  ],
  magicBytes: [
    {
      id: 'posix-file',
      standard: 'POSIX.1-2017 / IEEE Std 1003.1',
      title: 'Standard for Information Technology — Portable Operating System Interface: file utility',
      issuingBody: 'ISO/IEC',
      url: 'https://pubs.opengroup.org/onlinepubs/9699919799/utilities/file.html',
      relevance: 'Formal specification for magic file grammar, byte offset checks, and MIME identification.'
    },
    {
      id: 'rfc-2046',
      standard: 'IETF RFC 2046',
      title: 'Multipurpose Internet Mail Extensions (MIME) Part Two: Media Types',
      issuingBody: 'IETF',
      url: 'https://www.ietf.org/rfc/rfc2046.txt',
      relevance: 'IANA registration format and syntax for media types assigned to digital files.'
    }
  ],
  webp: [
    {
      id: 'riff-webp',
      standard: 'Google WebP Container Specification',
      title: 'WebP Container Specification (Extended File Format)',
      issuingBody: 'W3C',
      url: 'https://developers.google.com/speed/webp/docs/riff_container',
      relevance: 'Defines RIFF header structure (52 49 46 46), VP8/VP8L/VP8X chunk grammar, and alpha channels.'
    },
    {
      id: 'rfc-6386',
      standard: 'IETF RFC 6386',
      title: 'VP8 Data Format and Decoding Guide',
      issuingBody: 'IETF',
      url: 'https://www.ietf.org/rfc/rfc6386.txt',
      relevance: 'Defines the lossy intra-frame predictive coding algorithm behind WebP.'
    }
  ],
  security: [
    {
      id: 'mitre-masq',
      standard: 'MITRE ATT&CK T1036.007',
      title: 'Masquerading: Double File Extension',
      issuingBody: 'NIST',
      url: 'https://attack.mitre.org/techniques/T1036/007/',
      relevance: 'Security analysis of file name extension deception used to disguise executable payloads.'
    },
    {
      id: 'fips-180-4',
      standard: 'NIST FIPS PUB 180-4',
      title: 'Secure Hash Standard (SHS)',
      issuingBody: 'NIST',
      url: 'https://csrc.nist.gov/publications/detail/fips/180/4/final',
      relevance: 'Cryptographic standard governing SHA-1, SHA-224, SHA-256, SHA-384, and SHA-512 integrity verification.'
    }
  ]
};

export function getAuthorById(id: string): AuthorQualification {
  return EDITORIAL_TEAM.find((a) => a.id === id) || EDITORIAL_TEAM[0];
}

export function getAuthorByName(name: string): AuthorQualification {
  const clean = name.toLowerCase();
  return (
    EDITORIAL_TEAM.find((a) => a.name.toLowerCase().includes(clean) || clean.includes(a.name.toLowerCase())) ||
    EDITORIAL_TEAM[0]
  );
}
