/**
 * AnyFileX author information & editorial principles.
 *
 * AnyFileX is written and maintained by Tanveer Hussain. Format facts are
 * researched from official specifications, standards documents, and vendor
 * documentation. No credentialed review board or laboratory process is
 * claimed anywhere on the site.
 */

export interface AuthorQualification {
  id: string;
  name: string;
  credentials: string; // empty when the author claims no formal credential
  role: string;
  organization: string;
  avatar: string; // Self-contained SVG data URI - zero external stock photography
  bio: string;
  education: string;
  certifications: string[];
  areasOfExpertise: string[];
  editorialRole: string;
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

// Initials avatar for the site's author (no stock models, no invented personas)
export const AUTHOR_AVATARS = {
  tanveerHussain: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23g1)" stroke="%23334155" stroke-width="2"/><circle cx="60" cy="46" r="22" fill="%23334155"/><path d="M28 98 c0 -20 16 -32 32 -32 s32 12 32 32" fill="%23475569"/><text x="60" y="52" font-family="system-ui,-apple-system,sans-serif" font-size="15" font-weight="800" fill="%23f8fafc" text-anchor="middle">TH</text></svg>`
};

export const EDITORIAL_TEAM: AuthorQualification[] = [
  {
    id: 'tanveer-hussain',
    name: 'Tanveer Hussain',
    credentials: '',
    role: 'Founder, AnyFileX',
    organization: 'AnyFileX',
    avatar: AUTHOR_AVATARS.tanveerHussain,
    bio: 'Tanveer Hussain is a web developer and technical content creator focused on making complex digital systems easier to understand and use. At AnyFileX he writes clear, evidence-led content about file extensions, MIME types, magic bytes, software compatibility, conversion workflows, and privacy-aware browser tools.',
    education: '',
    certifications: [],
    areasOfExpertise: [
      'File extensions & MIME types',
      'Magic byte signature analysis',
      'Software compatibility research',
      'Privacy-first browser tools'
    ],
    editorialRole: 'Author & Editor',
    badge: 'Founder',
    conflictOfInterestDisclosure: 'Tanveer builds and maintains AnyFileX. Software listed in AnyFileX guides is chosen on technical merit; no vendor pays for placement, ranking, or reviews.'
  }
];

export const EDITORIAL_PRINCIPLES: EditorialPrinciple[] = [
  {
    pillar: '1. Researched from Official Documentation',
    headline: 'Format facts are taken from official specifications and documentation',
    description: 'AnyFileX guides are researched from official format specifications, standards documents (ISO/IEC, IETF RFC, IANA registries), and vendor documentation — not republished marketing summaries. Magic byte sequences, MIME types, and header offsets are stated only where a published source documents them; formats without a published signature are labelled honestly instead of guessed.',
    verificationMethod: 'Standards and documentation citations are listed on each guide where applicable.'
  },
  {
    pillar: '2. Honest, Countable Claims',
    headline: 'Every number on the site comes from the site\u2019s own data',
    description: 'Catalog sizes, tool counts, and guide counts displayed on AnyFileX are counted from the actual content registries and the format database. We do not publish inflated indexing figures, subscriber counters, or other vanity metrics.',
    verificationMethod: 'Counts generated from the content registry and format database records.'
  },
  {
    pillar: '3. Local, Private Tools',
    headline: 'Tools run in your browser — files are never uploaded',
    description: 'The file analyzer, converters, and inspectors on AnyFileX execute locally in browser memory. Format identification compares a file\u2019s opening bytes against a signature index of 82 verified byte signatures, and the result explains what was actually detected.',
    verificationMethod: 'Tool behavior checked locally against sample files in the browser.'
  },
  {
    pillar: '4. Independence & Zero-Payola Policy',
    headline: 'Zero paid placements, zero sponsored software, zero affiliate bias',
    description: 'Software applications listed under "How to Open" or "Software Compatibility" are chosen strictly on technical merit: format fidelity, stability, safety, clean uninstall behavior, and absence of bundled adware. We prioritize free and open-source software (FOSS) wherever viable.',
    verificationMethod: 'Strict prohibition on vendor compensation, sponsored listings, or paid ranking adjustments.'
  },
  {
    pillar: '5. Corrections & Updates',
    headline: 'Guides show their dates, and reported errors get fixed',
    description: 'Guides display publication and update dates. When a format specification or software behavior changes, or a reader reports an error, the guide is corrected and its date updated.',
    verificationMethod: 'Errata reports sent to editorial@anyfilex.com are checked against the source documentation before corrections are published.'
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
