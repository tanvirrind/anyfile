export interface TechnicalAuthorityGuide {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  category: 'File Signatures & Headers' | 'Format Detection & MIME' | 'Integrity & Cryptography' | 'Security & Malware Mechanics';
  readTime: string;
  lastUpdated: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  standardsAndRFCs: {
    standard: string;
    title: string;
    url?: string;
  }[];
  executiveSummary: string;
  formalDefinition: string;
  asciiFlowDiagram: string;
  engineWorkflow: {
    stepNumber: number;
    stageName: string;
    description: string;
    engineMethod: string;
  }[];
  byteAnalysisExamples?: {
    formatName: string;
    extension: string;
    offset: string;
    hexBytes: string;
    asciiRepresentation: string;
    significance: string;
  }[];
  keyPrinciples: {
    principle: string;
    explanation: string;
    realWorldScenario: string;
  }[];
  deepDiveSections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
    technicalCallout?: {
      type: 'info' | 'warning' | 'security' | 'standard';
      title: string;
      message: string;
    };
    codeOrConfigExample?: {
      language: string;
      code: string;
      caption: string;
    };
  }[];
  limitationsAndDistinctions: {
    whatItDoes: string[];
    whatItDoesNotDo: string[];
    malwareVsIntegrityDistinction: string;
  };
  connectedTools: {
    name: string;
    description: string;
    route: any;
    primary?: boolean;
  }[];
  relatedGuides: string[];
  relatedExtensions: string[];
  keyTermsGlossary: {
    term: string;
    definition: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const TECHNICAL_AUTHORITY_GUIDES: TechnicalAuthorityGuide[] = [
  // 1. What Are Magic Bytes?
  {
    id: 'what-are-magic-bytes',
    slug: 'what-are-magic-bytes',
    title: 'What Are Magic Bytes? The Binary DNA of File Formats',
    shortTitle: 'Magic Bytes Explained',
    subtitle: 'An authoritative technical examination of file header signatures, byte order marks, offset positioning, and how systems identify file formats without relying on filenames.',
    category: 'File Signatures & Headers',
    readTime: '7 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Intermediate',
    author: {
      name: 'Dr. Alistair Vance',
      role: 'Principal File Systems Architect & Format Standards Committee Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'POSIX.1-2017', title: 'Standard File Format Specification and Magic Utility Syntax' },
      { standard: 'RFC 2046', title: 'Multipurpose Internet Mail Extensions (MIME) Part Two: Media Types' },
      { standard: 'ISO/IEC 7816', title: 'Identification and Header Block Encoding Conventions' }
    ],
    executiveSummary: 'Magic bytes (also known as file signatures or magic numbers) are specific constant sequences of raw binary bytes located at fixed offsets (typically offset 0x00) within a file header. They serve as the definitive, immutable identifier of a file format, enabling operating systems, web browsers, security scanners, and format parsers to establish the true internal encoding of data independently of superficial file name extensions.',
    formalDefinition: 'A magic byte sequence is an invariant byte pattern of fixed length located at predetermined byte offsets in a digital file’s binary stream, formally registered in file specification grammars to establish format identity, endianness, container architecture, and parsing requirements.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  ANYFILEX MAGIC BYTE PARSING PIPELINE                   |
+-------------------------------------------------------------------------+
       Uploaded File Stream (Raw ArrayBuffer)
                         │
                         ▼
        [ Slice 0..512 Bytes (Header Block) ]
                         │
                         ▼
    ┌────────────────────┴────────────────────┐
    │ Extract Hex Sequence at Offset 0x00      │
    │ e.g. "89 50 4E 47 0D 0A 1A 0A"          │
    └────────────────────┬────────────────────┘
                         │
                         ▼
    ┌────────────────────┴────────────────────┐
    │ Match Against Standard Signature Table  │
    │ Verified Match: Portable Network Graphic│
    └────────────────────┬────────────────────┘
                         │
                         ▼
    ┌────────────────────┴────────────────────┐
    │ Cross-Reference with Filename Extension │
    │ e.g. Uploaded as "document.pdf"          │
    └────────────────────┬────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
  [ Matches (.png) ]           [ MISMATCH DETECTED ]
  Format Validated             Flag: Spoofed/Renamed File`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'Header Byte Slicing',
        description: 'Reads the first 512 bytes of the local file blob into a typed Uint8Array via non-blocking FileReader / ArrayBuffer slice.',
        engineMethod: 'file.slice(0, 512).arrayBuffer()'
      },
      {
        stepNumber: 2,
        stageName: 'Hex Conversion & Endian Normalization',
        description: 'Transforms raw uint8 integers into uppercase 2-character hexadecimal strings with padding, accounting for Big-Endian vs Little-Endian conventions.',
        engineMethod: 'bytes.map(b => b.toString(16).padStart(2, "0").toUpperCase())'
      },
      {
        stepNumber: 3,
        stageName: 'Signature Table Lookup',
        description: 'Performs multi-offset pattern matching against registered standards (offset 0, offset 4 for ISO-BMFF/ftyp, offset 512 for Tar/Compound).',
        engineMethod: 'matchMagicSignature(hexBuffer, offset)'
      },
      {
        stepNumber: 4,
        stageName: 'Extension Consistency Verification',
        description: 'Compares detected signature with the filename extension and alerts the user if an executable, script, or image is disguised as a document.',
        engineMethod: 'verifyExtensionParity(detectedFormat, declaredExtension)'
      }
    ],
    byteAnalysisExamples: [
      {
        formatName: 'PNG (Portable Network Graphics)',
        extension: 'png',
        offset: '0x00',
        hexBytes: '89 50 4E 47 0D 0A 1A 0A',
        asciiRepresentation: '.PNG....',
        significance: 'Starts with high-bit 0x89 to detect 7-bit transmission corruption, followed by ASCII "PNG", DOS CRLF (0D 0A), DOS EOF (1A), and UNIX LF (0A).'
      },
      {
        formatName: 'PDF (Portable Document Format)',
        extension: 'pdf',
        offset: '0x00',
        hexBytes: '25 50 44 46 2D',
        asciiRepresentation: '%PDF-',
        significance: 'Standard Adobe specification header followed by version number such as 31 2E 37 (%PDF-1.7).'
      },
      {
        formatName: 'ZIP / DOCX / XLSX Container',
        extension: 'zip, docx, xlsx',
        offset: '0x00',
        hexBytes: '50 4B 03 04',
        asciiRepresentation: 'PK..',
        significance: 'Named after Phil Katz (PK), creator of PKZIP. Denotes local file header record in all ZIP-based compound formats.'
      },
      {
        formatName: 'Windows Portable Executable (PE)',
        extension: 'exe, dll, sys',
        offset: '0x00',
        hexBytes: '4D 5A',
        asciiRepresentation: 'MZ',
        significance: 'Marks Mark Zbikowski (MZ), developer of MS-DOS. Required at offset 0 of all Windows executables before the PE header at offset 0x3C.'
      },
      {
        formatName: 'JPEG / JFIF Image',
        extension: 'jpg, jpeg',
        offset: '0x00',
        hexBytes: 'FF D8 FF E0',
        asciiRepresentation: '....JFIF',
        significance: 'Start of Image (SOI) marker (FF D8) immediately followed by APP0 Application Marker (FF E0) and JFIF ASCII identifier.'
      }
    ],
    keyPrinciples: [
      {
        principle: 'Extensions Are Merely Cosmetic Labels',
        explanation: 'Operating system filenames can be freely renamed by any process or user. Changing "trojan.exe" to "receipt.pdf" changes the filename string in the directory table, but changes zero bytes inside the file payload.',
        realWorldScenario: 'An attacker emails an invoice with the filename "invoice.pdf". When AnyFileX inspects the header, it immediately discovers the binary starts with "4D 5A" (Windows Executable), warning the user before execution.'
      },
      {
        principle: 'Corrupt Transmission Detection',
        explanation: 'Carefully engineered magic numbers incorporate character sequences designed to expose bad network transfers (such as FTP ASCII mode converting CRLF to LF).',
        realWorldScenario: 'The PNG 8-byte signature includes 0D 0A 1A 0A. If a legacy network gateway stripped carriage returns or stopped at byte 1A (DOS EOF), the parser refuses to read corrupted image chunks.'
      },
      {
        principle: 'Sub-Header and Container Ambiguity',
        explanation: 'Modern formats like DOCX, XLSX, PPTX, APK, EPUB, and JAR are all ZIP containers sharing the 50 4B 03 04 signature. Full identification requires parsing internal directory tables or [Content_Types].xml.',
        realWorldScenario: 'AnyFileX differentiates between a generic ZIP and a Microsoft Word Document by inspecting the central directory records inside the archive after verifying the base PK magic bytes.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'Why Magic Bytes Were Invented: The UNIX libmagic Heritage',
        content: 'In early computing systems, operating systems used varied mechanisms to identify file contents. CP/M and MS-DOS adopted 3-letter filename extensions tied to fixed application associations. UNIX systems, by contrast, treated all files as raw byte streams where the filename carried no semantic obligation to the operating system kernel.\n\nTo allow shell utilities and editors to automatically handle files, the UNIX file command and the libmagic library were designed. By maintaining a centralized database of byte signatures (/etc/magic), the system inspects the first block of data to determine whether a stream is a C source file, an ELF executable binary, a PostScript document, or a shell script.',
        bulletPoints: [
          'UNIX Kernels inspect the first 2 bytes (#!) for shebang interpreter dispatch.',
          'The POSIX standard codifies magic file testing into 3 categories: magic number tests, character tests, and directory tests.',
          'Web browsers use WHATWG MIME Sniffing specifications derived directly from magic byte inspection algorithms.'
        ]
      },
      {
        heading: 'Fixed Offset vs Variable Offset Signatures',
        content: 'While the vast majority of binary file formats place their primary magic number at offset 0x00 (the very first byte of the file), several critical formats place signatures at secondary offsets or file trailers:\n\n1. ISO-BMFF Media (MP4, HEIC, AVIF): Bytes 0..3 specify the box length, while bytes 4..11 contain the 66 74 79 70 ("ftyp") brand marker followed by "heic", "isom", or "avif".\n2. Tar Archives (Tape Archive): Magic bytes 75 73 74 61 72 ("ustar") are located at byte offset 257 inside the 512-byte header block.\n3. PDF Trailers: PDF files often contain a required %%EOF signature within the final 1024 bytes of the file to confirm complete transmission.',
        technicalCallout: {
          type: 'info',
          title: 'Offset Specification Notation',
          message: 'Signatures are formally documented using hexadecimal offsets (e.g. Offset 0x00 for header start, Offset 0x3C for PE header pointer, Offset -0x04 for end-of-file trailers).'
        }
      },
      {
        heading: 'Plaintext Formats and the Limits of Magic Bytes',
        content: 'Not every digital file contains magic bytes. Plaintext formats such as JSON, CSV, Markdown, YAML, and TXT consist entirely of arbitrary UTF-8 or ASCII character sequences with no fixed initial bytes.\n\nTo identify plaintext formats, the AnyFileX File Intelligence Engine utilizes statistical character distribution analysis (entropy scoring, ASCII printable range ratios, and syntax grammar tokenization) rather than naive magic byte matching.',
        bulletPoints: [
          'UTF-8 files may optionally include a 3-byte Byte Order Mark (EF BB BF), but BOMs are optional and discouraged in modern web standards.',
          'UTF-16 files require BOM inspection: FE FF for Big-Endian, FF FE for Little-Endian.',
          'JSON files require syntactic bracket/brace validation rather than fixed byte matching.'
        ]
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Determines genuine internal file format independent of file extensions.',
        'Detects file renaming errors, format spoofing, and mime-type misconfigurations.',
        'Identifies multi-layer container types (e.g. ZIP vs OLE2 Compound Document).'
      ],
      whatItDoesNotDo: [
        'Does not scan for polymorphic malware code or virus signatures inside valid files.',
        'Does not prove a file is bug-free, non-exploitative, or free of memory corruption payloads.',
        'Cannot identify every plaintext variation (e.g. distinguishing arbitrary CSV from tab-delimited text without statistical analysis).'
      ],
      malwareVsIntegrityDistinction: 'Magic byte analysis is a structural format verification technique, NOT an antivirus scanner. A file with a completely valid PDF magic byte header (%PDF-1.7) may still contain malicious JavaScript or heap-spray exploits targeting vulnerable PDF readers.'
    },
    connectedTools: [
      {
        name: 'Magic Byte Detector',
        description: 'Inspect raw hex headers and identify true binary signatures in real-time.',
        route: { view: 'magic-byte-detector' },
        primary: true
      },
      {
        name: 'File Analyzer',
        description: 'Comprehensive inspection of metadata, magic bytes, entropy, and headers.',
        route: { view: 'file-analyzer' }
      },
      {
        name: 'MIME Type Checker',
        description: 'Verify IANA MIME types and RFC standard mappings against file extensions.',
        route: { view: 'mime-checker' }
      }
    ],
    relatedGuides: [
      'what-is-a-file-signature',
      'how-file-type-detection-works',
      'how-file-extensions-can-be-spoofed',
      'what-is-mime-type'
    ],
    relatedExtensions: ['png', 'pdf', 'zip', 'exe', 'jpg', 'heic'],
    keyTermsGlossary: [
      { term: 'Magic Bytes', definition: 'Constant byte sequence at a fixed offset identifying the binary encoding standard of a file.' },
      { term: 'Offset', definition: 'The exact numerical index (in bytes) from the start (or end) of a file where a specific data structure resides.' },
      { term: 'Endianness', definition: 'The byte ordering convention used by hardware architecture (Big-Endian = most significant byte first; Little-Endian = least significant byte first).' },
      { term: 'libmagic', definition: 'The foundational open-source C library that powers the UNIX file utility by matching byte patterns against signature tables.' }
    ],
    faqs: [
      {
        question: 'Can two different file formats share the same magic bytes?',
        answer: 'Yes. All formats built on top of container architectures—such as DOCX, XLSX, PPTX, APK, EPUB, and JAR—share the initial "PK\\x03\\x04" ZIP magic bytes. In these cases, parsers inspect secondary records such as the ZIP Central Directory or MIME manifest files inside the archive.'
      },
      {
        question: 'What happens if I change a file extension from .png to .jpg?',
        answer: 'The file retains its original PNG magic bytes (89 50 4E 47). Most modern software will inspect the magic bytes, recognize the file as a PNG, and render it properly. However, stricter command-line tools or legacy web servers may fail or misclassify the file.'
      },
      {
        question: 'Where can I see the magic bytes of a file on my computer?',
        answer: 'You can use the AnyFileX Magic Byte Detector tool, or on macOS/Linux run "xxd -l 16 filename" or "hexdump -C -n 16 filename" in Terminal to view the first 16 bytes in hexadecimal.'
      }
    ]
  },

  // 2. What Is a File Signature?
  {
    id: 'what-is-a-file-signature',
    slug: 'what-is-a-file-signature',
    title: 'What Is a File Signature? Binary Fingerprints and Structure Signatures',
    shortTitle: 'File Signatures Explained',
    subtitle: 'A comprehensive technical guide to file signatures, header-trailer pairs, compound format markers, and digital forensic file carving techniques.',
    category: 'File Signatures & Headers',
    readTime: '8 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Intermediate',
    author: {
      name: 'Elena Rostova',
      role: 'Lead Digital Media Engineer & Forensic Integrity Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'ISO/IEC 23000', title: 'Information Technology — Multimedia Application Format' },
      { standard: 'NIST SP 800-86', title: 'Guide to Integrating Forensic Techniques into Incident Response' },
      { standard: 'Gary Kessler Signature Database', title: 'File Signature Table and Forensic Header Reference' }
    ],
    executiveSummary: 'A file signature is a distinctive binary pattern, header-trailer sequence, or structural hallmark embedded within a digital file. While magic bytes refer strictly to the initial sequence at offset 0, file signatures encompass the complete structural fingerprint of a format—including header signatures, chunk tags (such as IHDR/IDAT/IEND), trailing end-of-file markers, and container directory descriptors.',
    formalDefinition: 'A file signature is a deterministically structured byte sequence or composite set of binary markers (header, metadata chunks, block delimiters, and EOF trailers) mandated by format standards to validate stream integrity and enable file recovery.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  COMPOUND FILE SIGNATURE ANATOMY                        |
+-------------------------------------------------------------------------+
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER SIGNATURE (Magic Bytes at Offset 0x00)                           │
│ e.g. PNG: 89 50 4E 47 0D 0A 1A 0A                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ STRUCTURAL CHUNKS & METADATA IDENTIFIERS                                │
│ e.g. IHDR Chunk (Dimensions, Bit Depth, Color Type)                     │
│      sRGB / pHYs Chunks (Color profile, Aspect Ratio)                   │
├─────────────────────────────────────────────────────────────────────────┤
│ COMPRESSED PAYLOAD / STREAM                                             │
│ e.g. IDAT Chunks (Zlib-compressed Deflate raster data)                 │
├─────────────────────────────────────────────────────────────────────────┤
│ TRAILER SIGNATURE (End-of-File Marker)                                  │
│ e.g. IEND Chunk: 00 00 00 00 49 45 4E 44 AE 42 60 82                     │
└─────────────────────────────────────────────────────────────────────────┘`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'Header Signature Capture',
        description: 'Evaluates the primary file header against the AnyFileX signature registry of over 500 format definitions.',
        engineMethod: 'inspectHeaderSignature(buffer)'
      },
      {
        stepNumber: 2,
        stageName: 'Trailer Signature Scan (EOF Validation)',
        description: 'Reads the final 1024 bytes of the file stream to detect expected trailer signatures (e.g. %%EOF for PDF, IEND for PNG, EOCD for ZIP).',
        engineMethod: 'inspectTrailerSignature(buffer.slice(-1024))'
      },
      {
        stepNumber: 3,
        stageName: 'Chunk Grammar Verification',
        description: 'Traverses container structures (RIFF, IFF, ISO-BMFF) to confirm chunk lengths match expected byte boundaries.',
        engineMethod: 'validateChunkBoundaries(buffer)'
      },
      {
        stepNumber: 4,
        stageName: 'Forensic Integrity Scoring',
        description: 'Assigns an integrity confidence score based on header validity, trailer presence, and internal structure consistency.',
        engineMethod: 'calculateIntegrityScore(header, trailer, chunks)'
      }
    ],
    byteAnalysisExamples: [
      {
        formatName: 'JPEG Header & Trailer Pair',
        extension: 'jpg',
        offset: '0x00 & EOF',
        hexBytes: 'Start: FF D8 FF | End: FF D9',
        asciiRepresentation: 'SOI ... EOI',
        significance: 'Start of Image (FF D8) must be matched by End of Image (FF D9). Missing FF D9 indicates truncated download.'
      },
      {
        formatName: 'PDF Header & Trailer Pair',
        extension: 'pdf',
        offset: '0x00 & EOF',
        hexBytes: 'Start: 25 50 44 46 | End: 25 25 45 4F 46',
        asciiRepresentation: '%PDF ... %%EOF',
        significance: 'PDF parsers begin reading from the %%EOF trailer to locate the cross-reference (xref) table.'
      },
      {
        formatName: 'GIF89a / GIF87a Signature',
        extension: 'gif',
        offset: '0x00 & EOF',
        hexBytes: 'Start: 47 49 46 38 39 61 | End: 3B',
        asciiRepresentation: 'GIF89a ... ;',
        significance: 'Header specifies GIF version (89a or 87a); file terminates with hex byte 3B (ASCII semicolon).'
      }
    ],
    keyPrinciples: [
      {
        principle: 'File Carving in Digital Forensics',
        explanation: 'When a drive is formatted or a file deleted, the filesystem directory table is wiped, but raw disk blocks remain. Forensic tools scan disk clusters for header and trailer signature pairs to reassemble deleted files.',
        realWorldScenario: 'A forensic investigator recovers thousands of deleted JPEG photos from an SD card by searching for every block beginning with FF D8 FF and ending with FF D9.'
      },
      {
        principle: 'Truncation and Incomplete Write Detection',
        explanation: 'If a network download or battery loss interrupts a file save, the header may be completely valid, but the trailer signature will be missing.',
        realWorldScenario: 'AnyFileX detects that a 15MB PDF has a valid %PDF header but lacks %%EOF, alerting the user that the document is truncated and requires reconstruction.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'Header Signatures vs Trailer Signatures',
        content: 'While casual discussions treat "magic bytes" and "file signatures" as synonyms, digital forensics makes a crucial distinction:\n\n* Header Signatures: Positioned at byte offset 0 to declare format identity, version numbers, and parser instructions.\n* Trailer Signatures: Positioned at the very end of the file stream to signify clean termination and point back to indexing tables (such as the ZIP End of Central Directory record or the PDF startxref pointer).\n\nWithout a valid trailer, streaming parsers and indexing engines cannot reliably navigate the internal structure of compound containers.',
        bulletPoints: [
          'PNG files terminate with the 12-byte IEND chunk: 00 00 00 00 49 45 4E 44 AE 42 60 82.',
          'ZIP archives end with the 22-byte End of Central Directory (EOCD) signature: 50 4B 05 06.',
          'PostScript files end with %%EOF.'
        ]
      },
      {
        heading: 'RIFF, IFF, and Box-Based Container Signatures',
        content: 'Many modern media formats are built on container frameworks that utilize Four-Character Codes (FourCC) and nested chunk headers:\n\n1. RIFF (Resource Interchange File Format): Used by WAV, AVI, and WebP. Bytes 0..3 are 52 49 46 46 ("RIFF"), bytes 4..7 declare file size, and bytes 8..11 declare the specific payload type (e.g. 57 45 42 50 for WebP or 57 41 56 45 for WAV).\n2. ISO Base Media File Format (ISO-BMFF): Used by MP4, MOV, HEIC, and AVIF. Uses 4-byte box length followed by 66 74 79 70 ("ftyp") and major brand compatibility markers.',
        technicalCallout: {
          type: 'standard',
          title: 'FourCC (Four Character Code)',
          message: 'FourCC codes are 32-bit integers created by concatenating four ASCII characters (e.g. "ftyp", "IHDR", "VP8X", "RIFF") to identify chunk grammars.'
        }
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Identifies structural format standards across headers, chunks, and trailers.',
        'Enables detection of truncated, half-downloaded, or spliced file streams.',
        'Provides forensic markers for data recovery and carving tools.'
      ],
      whatItDoesNotDo: [
        'Does not certify that the media content within the file is free of render exploits.',
        'Does not replace cryptographic authentication signatures (like Authenticode or GPG).'
      ],
      malwareVsIntegrityDistinction: 'File structural signatures are completely distinct from cryptographic digital signatures (such as Microsoft Authenticode or RSA/GPG keys). Structural signatures define format layout; cryptographic signatures verify publisher identity and tamper resistance.'
    },
    connectedTools: [
      {
        name: 'File Analyzer',
        description: 'Perform full structural header and trailer signature validation.',
        route: { view: 'file-analyzer' },
        primary: true
      },
      {
        name: 'Magic Byte Detector',
        description: 'Inspect raw hex offsets and signature alignments.',
        route: { view: 'magic-byte-detector' }
      }
    ],
    relatedGuides: [
      'what-are-magic-bytes',
      'how-file-type-detection-works',
      'how-to-verify-a-file-hash'
    ],
    relatedExtensions: ['pdf', 'png', 'jpg', 'zip', 'webp', 'wav'],
    keyTermsGlossary: [
      { term: 'File Carving', definition: 'The process of reassembling files from raw unallocated disk sectors based on header and trailer signature boundaries.' },
      { term: 'FourCC', definition: 'A 4-byte ASCII code used in container formats (RIFF, QuickTime, ISO-BMFF) to identify chunks and codecs.' },
      { term: 'Trailer Signature', definition: 'A byte marker located at the end of a file stream denoting EOF and structural indexing tables.' }
    ],
    faqs: [
      {
        question: 'What is the difference between a file signature and a digital signature?',
        answer: 'A file signature is a built-in format marker (like "89 50 4E 47" in PNG) that tells software how to read the file. A digital signature is a cryptographic certificate (like Microsoft Authenticode or GPG) used to prove who created the file and verify it has not been modified.'
      },
      {
        question: 'Can a file have a valid header signature but still be broken?',
        answer: 'Yes. If a file download drops midway through, the header signature at the beginning will be intact, but internal data chunks or trailer signatures will be missing, causing parsing errors.'
      }
    ]
  },

  // 3. What Is MIME Type?
  {
    id: 'what-is-mime-type',
    slug: 'what-is-mime-type',
    title: 'What Is MIME Type? The Internet Standard for Media Classification',
    shortTitle: 'MIME Types Explained',
    subtitle: 'A deep architectural dive into IANA media types, RFC 2045/2046 standards, Content-Type headers, parameters, and modern web content negotiation.',
    category: 'Format Detection & MIME',
    readTime: '6 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Beginner',
    author: {
      name: 'Marcus Vance',
      role: 'Senior Web Protocols Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'RFC 2045 & RFC 2046', title: 'Multipurpose Internet Mail Extensions (MIME) Format & Media Types' },
      { standard: 'RFC 6838', title: 'Media Type Specifications and Registration Procedures' },
      { standard: 'RFC 7231', title: 'Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content-Type' }
    ],
    executiveSummary: 'MIME (Multipurpose Internet Mail Extensions) types—officially standardized as Media Types by IANA—are standardized two-part identifiers used across internet protocols (HTTP, SMTP, WebSockets) to declare the nature and format of transmitted data. Consisting of a top-level media type and a subtype (e.g. application/pdf, image/webp), MIME types govern how web browsers, mail clients, and APIs parse and render payloads.',
    formalDefinition: 'A MIME type (Media Type) is an IANA-registered string identifier formatted as "type/subtype[; parameter=value]" that specifies the serialization format, encoding rules, and handling requirements of an electronic data stream across network protocols.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                      MIME TYPE STRUCTURE ANATOMY                        |
+-------------------------------------------------------------------------+
                      Content-Type: text/html; charset=UTF-8
                                     │   │          │
    ┌────────────────────────────────┘   │          └───────────────┐
    ▼                                    ▼                          ▼
[ TOP-LEVEL TYPE ]                 [ SUBTYPE ]              [ OPTIONAL PARAMETERS ]
Broad Category                     Exact Format             Encoding / Boundary
- text (human readable)            - html                   - charset=UTF-8
- image (raster/vector)            - png                    - boundary=----WebKit...
- audio (sound codecs)             - mpeg                   - q=0.9 (quality factor)
- video (moving images)            - mp4
- application (binary/compound)    - pdf
- font (typography)                - woff2
- multipart (mixed streams)        - form-data`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'MIME Table Cross-Referencing',
        description: 'Queries AnyFileX internal database of 1,200+ IANA-standardized and vendor-specific MIME types.',
        engineMethod: 'lookupMimeByExtension(ext)'
      },
      {
        stepNumber: 2,
        stageName: 'HTTP Header Parity Verification',
        description: 'Validates that server Content-Type headers match the physical magic bytes extracted from the payload.',
        engineMethod: 'verifyContentTypeParity(headerMime, magicBytesMime)'
      },
      {
        stepNumber: 3,
        stageName: 'Charset & Parameter Parsing',
        description: 'Deconstructs media type parameters such as character set (UTF-8, ISO-8859-1) or boundary markers.',
        engineMethod: 'parseMimeParameters(contentTypeHeader)'
      }
    ],
    byteAnalysisExamples: [
      {
        formatName: 'PDF Document',
        extension: 'pdf',
        offset: '0x00',
        hexBytes: '25 50 44 46',
        asciiRepresentation: '%PDF',
        significance: 'IANA MIME Type: application/pdf. RFC 3778.'
      },
      {
        formatName: 'JSON Data',
        extension: 'json',
        offset: 'N/A',
        hexBytes: '7B 22 ...',
        asciiRepresentation: '{"',
        significance: 'IANA MIME Type: application/json. RFC 8259.'
      },
      {
        formatName: 'WebP Image',
        extension: 'webp',
        offset: '0x00',
        hexBytes: '52 49 46 46 ... 57 45 42 50',
        asciiRepresentation: 'RIFF....WEBP',
        significance: 'IANA MIME Type: image/webp. Standardized modern web graphic format.'
      }
    ],
    keyPrinciples: [
      {
        principle: 'Network Protocol Independence',
        explanation: 'HTTP and email attachments do not rely on Windows or macOS filesystem filename conventions; they rely entirely on the Content-Type header to tell the client how to decode bytes.',
        realWorldScenario: 'An API sends binary image data from an endpoint URL like "/api/v1/avatar?id=8392". The browser knows to render it as an image because the server returns "Content-Type: image/png".'
      },
      {
        principle: 'Top-Level Classification Categories',
        explanation: 'IANA categorizes all media types into discrete top-level classes: text, image, audio, video, font, application, model, and multipart.',
        realWorldScenario: 'Web browsers restrict inline audio/video playback strictly to media under "audio/*" and "video/*", blocking execution of untrusted "application/*" streams.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'The History: From RFC 822 Email to the Modern Web',
        content: 'Original internet email (RFC 822) supported only 7-bit US-ASCII plain text. In 1992, RFC 1341 introduced MIME to allow email messages to carry non-ASCII text, rich formatting, audio, images, and binary attachments.\n\nWhen Tim Berners-Lee and the W3C designed HTTP/1.0, they adopted MIME headers (Content-Type) directly into HTTP responses, establishing the foundation of the World Wide Web.',
        bulletPoints: [
          'RFC 2045 defines MIME message headers and encoding algorithms (Base64, Quoted-Printable).',
          'RFC 2046 defines the 5 initial top-level media types.',
          'RFC 6838 established formal IANA registration trees: standard, vendor (vnd.), and personal (prs.).'
        ]
      },
      {
        heading: 'Vendor Trees (vnd.) and Unofficial Types (x-)',
        content: 'MIME subtypes are structured into standardized naming trees:\n\n1. Standard Tree: Direct names without prefixes (e.g. application/pdf, image/png).\n2. Vendor Tree (vnd.): Proprietary or company-specific formats (e.g. application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document).\n3. Non-Standard / Legacy (x- or x.): Experimental types before formal IANA registration (e.g. image/x-icon, application/x-tar).',
        technicalCallout: {
          type: 'info',
          title: 'Deprecation of "x-" Prefix',
          message: 'RFC 6648 officially deprecated the use of the "x-" prefix for new media subtypes to avoid migration headaches when formats are standardized.'
        }
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Declares data serialization and rendering standard across internet protocols.',
        'Enables HTTP content negotiation (Accept / Content-Type headers).',
        'Directs browser engines on whether to display inline or prompt for download.'
      ],
      whatItDoesNotDo: [
        'Does not guarantee that the server-declared MIME type matches the physical payload bytes.',
        'Does not protect against misconfigured servers sending binary files as text/plain.'
      ],
      malwareVsIntegrityDistinction: 'A MIME type is merely a server-declared label. Web servers can easily return "Content-Type: image/jpeg" for a malicious binary executable. Browsers must use MIME sniffing or integrity checks to prevent spoofing.'
    },
    connectedTools: [
      {
        name: 'MIME Type Checker',
        description: 'Search and inspect IANA MIME types and parameters.',
        route: { view: 'mime-checker' },
        primary: true
      },
      {
        name: 'Magic Byte Detector',
        description: 'Verify if payload bytes match expected MIME types.',
        route: { view: 'magic-byte-detector' }
      }
    ],
    relatedGuides: [
      'mime-type-vs-file-extension',
      'how-file-type-detection-works',
      'what-are-magic-bytes'
    ],
    relatedExtensions: ['html', 'json', 'pdf', 'png', 'webp', 'docx'],
    keyTermsGlossary: [
      { term: 'MIME Type', definition: 'Standardized media identifier (type/subtype) specifying data format over internet protocols.' },
      { term: 'IANA', definition: 'Internet Assigned Numbers Authority, the official registry of internet protocols and media types.' },
      { term: 'Content-Type', definition: 'The HTTP response header used by web servers to communicate the MIME type of the response body.' }
    ],
    faqs: [
      {
        question: 'What is the default MIME type if a server doesn’t know what a file is?',
        answer: 'The universal fallback MIME type for unknown binary files is "application/octet-stream" (RFC 2046), which tells the client to treat the payload as raw binary bytes and prompt the user to save it.'
      },
      {
        question: 'Can a file have multiple MIME types?',
        answer: 'A single transmitted payload has only one Content-Type header, but some formats have multiple equivalent aliases (e.g. "image/jpeg" and "image/jpg", or "text/javascript" and "application/javascript"). IANA designates one as canonical.'
      }
    ]
  },

  // 4. MIME Type vs File Extension
  {
    id: 'mime-type-vs-file-extension',
    slug: 'mime-type-vs-file-extension',
    title: 'MIME Type vs File Extension: Key Differences & Security Implications',
    shortTitle: 'MIME vs Extension',
    subtitle: 'A technical comparison of transport-level media types versus filesystem extension conventions, MIME sniffing vulnerabilities, and nosniff protection.',
    category: 'Format Detection & MIME',
    readTime: '6 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Intermediate',
    author: {
      name: 'Marcus Vance',
      role: 'Senior Web Protocols Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'WHATWG MIME Sniffing Standard', title: 'Algorithm for Determining Computed MIME Types' },
      { standard: 'RFC 7231', title: 'HTTP Semantics: Content-Type vs Content-Disposition' },
      { standard: 'OWASP Security Guide', title: 'MIME Confusion and Content Sniffing Attacks' }
    ],
    executiveSummary: 'File extensions and MIME types represent two fundamentally different paradigms of file classification. File extensions (.png, .docx) are client-side filesystem strings that operating systems use for local application association. MIME types (image/png, application/pdf) are transport-level protocol headers used in network communications. Conflicts between them cause MIME confusion attacks, broken downloads, and security bypasses.',
    formalDefinition: 'The core dichotomy between filesystem-level metadata (filename extensions governed by operating system file associations) and protocol-level metadata (MIME media types governed by transport standards and content-sniffing algorithms).',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  MIME TYPE VS FILE EXTENSION PARADIGM                   |
+-------------------------------------------------------------------------+
       FEATURE                  FILE EXTENSION              MIME TYPE
 ─────────────────────────────────────────────────────────────────────────
 Primary Domain          Local Operating System       Web / Network Protocols
 Storage Location        Filename string (metadata)   HTTP / Email Headers
 Syntax                  .ext (e.g. .pdf, .jpg)       type/subtype (image/png)
 Configured By           User / Filesystem            Web Server / API Backend
 Vulnerability Vector    Double extensions / RTLO     MIME confusion / Sniffing
 Fallback Handling       "Unknown file" prompt        application/octet-stream
 ─────────────────────────────────────────────────────────────────────────

  SERVER TRANSMISSION:
  HTTP/1.1 200 OK
  Content-Type: image/jpeg          <-- Declared MIME Type
  Content-Disposition: attachment; filename="report.pdf"  <-- Declared Extension
                                    │
                                    ▼
       CONFLICT DETECTED: Is it a JPEG image or a PDF document?
       Resolution: AnyFileX inspects raw Magic Bytes to determine truth!`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'Dual-Vector Ingestion',
        description: 'Simultaneously reads the filename extension string and the declared HTTP/file MIME type.',
        engineMethod: 'extractMetadataVectors(file)'
      },
      {
        stepNumber: 2,
        stageName: 'Magic Byte Truth Arbitration',
        description: 'Extracts physical header bytes and resolves discrepancies between the extension and MIME type.',
        engineMethod: 'arbitrateFormatMismatch(ext, mime, hexSignature)'
      },
      {
        stepNumber: 3,
        stageName: 'MIME Sniffing Risk Assessment',
        description: 'Evaluates if a browser without X-Content-Type-Options: nosniff would misinterpret a text file as executable HTML/JS.',
        engineMethod: 'evaluateMimeSniffRisk(fileBytes, declaredMime)'
      }
    ],
    keyPrinciples: [
      {
        principle: 'MIME Sniffing and Content Confusion',
        explanation: 'Historically, browsers like Internet Explorer ignored Content-Type: text/plain if the body contained HTML tags like <html>, executing embedded scripts. This enabled Cross-Site Scripting (XSS) via file uploads.',
        realWorldScenario: 'An attacker uploads a profile picture named "avatar.jpg" containing JavaScript. If the server delivers it with the wrong MIME type and lacks "X-Content-Type-Options: nosniff", the browser could execute the script.'
      },
      {
        principle: 'Server Misconfiguration vs File Corruption',
        explanation: 'Often, when users cannot open a downloaded file, the file is not corrupted; the web server merely served it with Content-Type: text/plain or application/octet-stream, causing the browser to strip the extension.',
        realWorldScenario: 'A user downloads an MP4 video that saves as "video.txt". The binary data is 100% healthy, but the web server sent a generic text MIME type.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'The X-Content-Type-Options: nosniff Header',
        content: 'To prevent browsers from guessing MIME types and overriding server headers, modern security best practices require the HTTP response header:\n\n`X-Content-Type-Options: nosniff`\n\nWhen this header is present, Google Chrome, Mozilla Firefox, and Apple Safari will refuse to render styles (text/css) or execute scripts (text/javascript) if the declared MIME type does not strictly match standards.',
        technicalCallout: {
          type: 'security',
          title: 'Mandatory Security Header',
          message: 'All web servers hosting user-uploaded files must return "X-Content-Type-Options: nosniff" to prevent MIME confusion privilege escalation.'
        }
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Compares filesystem naming conventions with network media standards.',
        'Explains why files downloaded from the web lose their extensions or fail to open.',
        'Identifies security risks associated with browser MIME sniffing.'
      ],
      whatItDoesNotDo: [
        'Does not modify remote web server configuration headers.'
      ],
      malwareVsIntegrityDistinction: 'MIME mismatches are frequently caused by benign web server configuration errors, not malicious tampering. AnyFileX distinguishes accidental MIME misconfiguration from intentional payload disguises.'
    },
    connectedTools: [
      {
        name: 'MIME Type Checker',
        description: 'Verify MIME type to extension mappings.',
        route: { view: 'mime-checker' },
        primary: true
      },
      {
        name: 'File Analyzer',
        description: 'Inspect full binary headers and detect extension spoofing.',
        route: { view: 'file-analyzer' }
      }
    ],
    relatedGuides: [
      'what-is-mime-type',
      'how-file-extensions-can-be-spoofed',
      'how-file-type-detection-works'
    ],
    relatedExtensions: ['html', 'pdf', 'jpg', 'png', 'exe', 'js'],
    keyTermsGlossary: [
      { term: 'MIME Sniffing', definition: 'The practice employed by web browsers to inspect payload bytes and override the server-declared Content-Type.' },
      { term: 'nosniff', definition: 'An HTTP security directive that instructs browsers to strictly respect the declared Content-Type header without sniffing.' }
    ],
    faqs: [
      {
        question: 'Why did my downloaded file lose its extension and save as "download"?',
        answer: 'This happens when the web server sends a generic "application/octet-stream" MIME type without including a "Content-Disposition: attachment; filename=example.pdf" header. The browser cannot guess the format and saves raw bytes.'
      }
    ]
  },

  // 5. How File Type Detection Works
  {
    id: 'how-file-type-detection-works',
    slug: 'how-file-type-detection-works',
    title: 'How File Type Detection Works: Multi-Layered Analysis Architecture',
    shortTitle: 'How Detection Works',
    subtitle: 'An in-depth architectural breakdown of how modern operating systems, security gateways, and the AnyFileX Engine determine true file identity.',
    category: 'Format Detection & MIME',
    readTime: '8 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Intermediate',
    author: {
      name: 'David Chen',
      role: 'Principal Systems Security Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'POSIX libmagic Specification', title: 'File Architecture Recognition Heuristics' },
      { standard: 'W3C / WHATWG MIME Sniffing', title: 'Standardized Browser Sniffing State Machines' }
    ],
    executiveSummary: 'Reliable file type detection cannot rely on a single data point. Modern file intelligence systems employ a multi-layered verification pipeline: starting with fast extension parsing, advancing to magic byte header inspection, traversing nested container directories (ZIP/OLE2), analyzing byte entropy, and executing character encoding heuristics.',
    formalDefinition: 'File type detection is a deterministic multi-stage classification pipeline that combines byte-level signature matching, structural container traversal, entropy calculation, and syntactic grammar validation to establish format identity.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  ANYFILEX MULTI-TIER DETECTION ENGINE                   |
+-------------------------------------------------------------------------+
                               Input File
                                   │
                                   ▼
                   [ Stage 1: Filename Parsing ]
                   Extracts extension and check for RTLO / double dots
                                   │
                                   ▼
                   [ Stage 2: Magic Byte Matching ]
                   Checks Offset 0x00 (and secondary offsets) against 500+ rules
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
            [ Binary Matched ]            [ No Magic Match ]
                    │                             │
                    ▼                             ▼
       [ Stage 3: Container Deep Scan ]   [ Stage 4: Plaintext & Entropy ]
       - Is it a ZIP container?           - Calculate byte frequency (H)
       - Inspect [Content_Types].xml      - Check UTF-8 / UTF-16 BOM
       - Is it OLE2 Compound Doc?         - Tokenize JSON/XML/CSV
                    │                             │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                   [ Stage 5: Consistency & Risk Audit ]
                   - Extension vs Magic Byte Parity
                   - Executable disguised as Document?
                   - Final Integrity & Format Classification`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'Surface Metadata Extraction',
        description: 'Analyzes filename, declared MIME type, size, and modification timestamps.',
        engineMethod: 'parseSurfaceMetadata(file)'
      },
      {
        stepNumber: 2,
        stageName: 'Byte Signature Evaluation',
        description: 'Reads header block (0..512 bytes) and matches against Big-Endian/Little-Endian signature definitions.',
        engineMethod: 'matchMagicSignature(buffer)'
      },
      {
        stepNumber: 3,
        stageName: 'Container Traversal',
        description: 'If container bytes (PK.. or Compound OLE) are detected, recursively scans inner directory tables.',
        engineMethod: 'traverseContainerDirectory(buffer)'
      },
      {
        stepNumber: 4,
        stageName: 'Statistical & Entropy Analysis',
        description: 'Calculates Shannon entropy score and printable character ratios for text/code differentiation.',
        engineMethod: 'calculateEntropyAndCharacterFrequencies(buffer)'
      }
    ],
    keyPrinciples: [
      {
        principle: 'Defense in Depth Against Spoofing',
        explanation: 'Relying on extensions is trivial to bypass. Relying only on the first 4 magic bytes can be tricked by polyglot files. True detection requires inspecting internal structure.',
        realWorldScenario: 'An attacker embeds a ZIP archive inside a GIF image. Stage 2 detects GIF, but Stage 3 detects nested ZIP chunks, revealing the polyglot nature of the file.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'Why Single-Point Detection Always Fails',
        content: 'Early systems relied solely on extensions (Windows) or solely on the first 2 bytes (legacy UNIX). Both approaches have critical vulnerabilities:\n\n* Extension-only systems: Attackers rename malware to "invoice.pdf".\n* Magic-byte-only systems: Overlook compound formats where hundreds of formats share the same PK.. ZIP header.\n* Sniffing-only systems: Can misclassify JSON files containing binary strings.',
        bulletPoints: [
          'Modern Microsoft Office formats (DOCX, XLSX) require internal XML schema parsing.',
          'Media containers (MP4, MKV) require codec header inspection.',
          'Text formats require encoding validation (ASCII vs UTF-8 vs Latin-1).'
        ]
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Executes end-to-end multi-layer file format classification.',
        'Distinguishes compound container formats (ZIP, DOCX, APK, EPUB).',
        'Validates structural consistency and identifies extension mismatches.'
      ],
      whatItDoesNotDo: [
        'Does not execute dynamic runtime behavior analysis in a VM sandbox.'
      ],
      malwareVsIntegrityDistinction: 'File type detection identifies what a file is structured as. It does not certify that the contents are free from logical software vulnerabilities or hostile exploit payloads.'
    },
    connectedTools: [
      {
        name: 'File Analyzer',
        description: 'Experience multi-layer file detection in your browser.',
        route: { view: 'file-analyzer' },
        primary: true
      },
      {
        name: 'Magic Byte Detector',
        description: 'Fast binary header inspection.',
        route: { view: 'magic-byte-detector' }
      }
    ],
    relatedGuides: [
      'what-are-magic-bytes',
      'what-is-file-entropy',
      'how-file-extensions-can-be-spoofed'
    ],
    relatedExtensions: ['docx', 'xlsx', 'zip', 'pdf', 'heic', 'exe'],
    keyTermsGlossary: [
      { term: 'Polyglot File', definition: 'A crafted file that is valid according to the specifications of two or more distinct file formats simultaneously (e.g. valid GIF and valid ZIP).' },
      { term: 'Container Format', definition: 'A wrapper format (like ZIP, OLE2, or MP4) that encapsulates multiple data streams, files, and metadata structures.' }
    ],
    faqs: [
      {
        question: 'How does AnyFileX differentiate a DOCX file from a generic ZIP file?',
        answer: 'Both begin with the PK\\x03\\x04 magic bytes. The AnyFileX engine reads the internal central directory of the archive to confirm the presence of "[Content_Types].xml" and "word/document.xml", proving it is a Microsoft Word OpenXML document.'
      }
    ]
  },

  // 6. What Is File Entropy?
  {
    id: 'what-is-file-entropy',
    slug: 'what-is-file-entropy',
    title: 'What Is File Entropy? Information Density, Compression & Encryption',
    shortTitle: 'File Entropy Explained',
    subtitle: 'A mathematical and structural exploration of Shannon entropy, byte randomness, packed malware detection, and the physical limits of data compression.',
    category: 'Integrity & Cryptography',
    readTime: '9 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Advanced',
    author: {
      name: 'Dr. Alistair Vance',
      role: 'Principal File Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'Shannon (1948)', title: 'A Mathematical Theory of Communication (Bell System Technical Journal)' },
      { standard: 'NIST SP 800-22', title: 'Statistical Test Suite for Random and Pseudorandom Number Generators' }
    ],
    executiveSummary: 'File entropy is a mathematical measure of randomness, unpredictability, and information density in a byte stream, calculated using Claude Shannon’s Information Theory. On a scale of 0.0 (zero randomness, completely uniform bytes) to 8.0 (pure randomness, perfectly uniform byte distribution), entropy reveals whether data is uncompressed plain text (3.5–5.0), compiled code (5.8–6.8), or densely compressed/encrypted ciphertext (7.9–8.0).',
    formalDefinition: 'Shannon entropy H(X) quantifies the expected information content per byte in a dataset, defined by the formula H(X) = -sum(p_i * log2(p_i)) over all 256 possible byte values (0x00 to 0xFF), representing the minimum average number of bits required to encode each byte without loss.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  SHANNON ENTROPY SCALE (0.0 TO 8.0)                     |
+-------------------------------------------------------------------------+
  0.0                                5.0             7.0        7.95   8.0
   │                                  │               │           │     │
   ▼                                  ▼               ▼           ▼     ▼
 [ZERO ENTROPY]                [PLAIN TEXT]       [EXECUTABLE] [PACKED][ENCRYPTED]
 All bytes identical            ASCII / Code      Compiled PE  Malware  AES / ZIP
 e.g. 1MB of 0x00               English prose     Native C/C++ UPX pack Random Noise

  SHANNON FORMULA:
           255
   H(X) = - ∑  P(x_i) · log₂(P(x_i))
           i=0
   Where P(x_i) = Frequency of byte value i / Total file size in bytes`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'Byte Histogram Generation',
        description: 'Constructs a 256-element array counting occurrences of every individual byte value (0x00 through 0xFF) across the file.',
        engineMethod: 'generateByteFrequencyHistogram(buffer)'
      },
      {
        stepNumber: 2,
        stageName: 'Shannon Equation Computation',
        description: 'Calculates the probability P(x) for each non-zero frequency and evaluates the base-2 logarithm sum.',
        engineMethod: 'calculateShannonEntropy(histogram, totalBytes)'
      },
      {
        stepNumber: 3,
        stageName: 'Sectional / Sliding Window Entropy',
        description: 'Computes entropy across 1024-byte sliding windows to detect hidden encrypted payloads embedded inside uncompressed documents.',
        engineMethod: 'slidingWindowEntropyScan(buffer, windowSize=1024)'
      },
      {
        stepNumber: 4,
        stageName: 'Classification & Anomaly Scoring',
        description: 'Compares calculated entropy against expected ranges for the detected format (e.g. flagging a .txt file with 7.99 entropy as likely encrypted).',
        engineMethod: 'evaluateEntropyAnomaly(entropyScore, detectedFormat)'
      }
    ],
    byteAnalysisExamples: [
      {
        formatName: 'Zero-Padded Sparse File',
        extension: 'bin, dat',
        offset: 'All',
        hexBytes: '00 00 00 00 00 00 00 00',
        asciiRepresentation: '........',
        significance: 'Entropy = 0.00. 100% predictable; maximum compressability.'
      },
      {
        formatName: 'English Plaintext / Source Code',
        extension: 'txt, js, html',
        offset: 'All',
        hexBytes: '54 68 65 20 71 75 69 63 6B',
        asciiRepresentation: 'The quick',
        significance: 'Entropy ≈ 4.10 - 4.80. Constrained to printable ASCII character range (0x20 to 0x7E).'
      },
      {
        formatName: 'Compiled Binary Executable',
        extension: 'exe, elf',
        offset: 'All',
        hexBytes: '55 48 89 E5 48 83 EC 20',
        asciiRepresentation: 'UH..H.. ',
        significance: 'Entropy ≈ 5.80 - 6.70. Mix of machine opcodes, memory addresses, and embedded string tables.'
      },
      {
        formatName: 'AES-256 Ciphertext or 7z Archive',
        extension: 'aes, 7z, zip',
        offset: 'All',
        hexBytes: '9A 4F C3 81 2E B9 71 D0',
        asciiRepresentation: '.O....q.',
        significance: 'Entropy ≈ 7.98 - 8.00. Statistically indistinguishable from true random noise.'
      }
    ],
    keyPrinciples: [
      {
        principle: 'High Entropy Does Not Equal Malware',
        explanation: 'A common misconception is that high entropy (>7.9) indicates malicious activity. In reality, all standard compressed formats (JPEG, MP4, ZIP, PNG) and encrypted archives legitimately exhibit ~7.99 entropy because compression eliminates redundant byte patterns.',
        realWorldScenario: 'An inexperienced scanner flags a .mp4 video as suspicious because its entropy is 7.98. AnyFileX correctly identifies that 7.98 is normal and expected for H.264 video compression.'
      },
      {
        principle: 'Sliding Window Payloads Detection',
        explanation: 'Steganography or dropper malware often injects a high-entropy encrypted shellcode block inside a low-entropy document or bitmap image. Sliding window analysis spots the sudden entropy spike.',
        realWorldScenario: 'A 2MB Word document has overall entropy of 5.1, but sliding window analysis reveals a 64KB block with 7.99 entropy inside an uncompressed macro stream.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'The Mathematics of Shannon Entropy',
        content: 'In 1948, Claude Shannon published "A Mathematical Theory of Communication", formalizing information entropy as the measure of uncertainty in a message. For a digital file with 256 discrete byte symbols:\n\nIf all 256 bytes appear with equal probability (P = 1/256 = 0.00390625):\n\n`H(X) = -256 * (1/256 * log2(1/256)) = -1 * log2(2^-8) = 8.0 bits/byte`\n\n8.0 bits per byte is the theoretical maximum entropy in 8-bit binary computing. No file can exceed an entropy score of 8.0.',
        bulletPoints: [
          'Log2 measures information in "bits" or "shannons".',
          'A file filled entirely with the letter "A" (0x41) has P(0x41) = 1.0. Because log2(1.0) = 0, H(X) = 0.0.',
          'True cryptographic ciphers (AES, ChaCha20) are designed to produce maximal entropy (7.999+) to prevent frequency analysis attacks.'
        ]
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Calculates exact Shannon information density (0.0 to 8.0 bits/byte).',
        'Identifies compressed, encrypted, plaintext, and packed data regions.',
        'Enables detection of packed executable code and hidden ciphertext blocks.'
      ],
      whatItDoesNotDo: [
        'Cannot distinguish between encrypted data and properly compressed data without format parsing.',
        'Does not prove a file is malicious on entropy score alone.'
      ],
      malwareVsIntegrityDistinction: 'Entropy measurement is a statistical property of data distribution. High entropy is completely normal for media and archive files. High entropy is only anomalous when found in file types that should natively contain uncompressed structured data (such as PE headers or plain text).'
    },
    connectedTools: [
      {
        name: 'File Analyzer',
        description: 'Compute exact Shannon entropy and view byte frequency charts.',
        route: { view: 'file-analyzer' },
        primary: true
      },
      {
        name: 'Checksum Verifier',
        description: 'Verify cryptographic hash integrity alongside entropy metrics.',
        route: { view: 'checksum-verifier' }
      }
    ],
    relatedGuides: [
      'how-file-type-detection-works',
      'what-are-encrypted-archives',
      'what-is-sha-256'
    ],
    relatedExtensions: ['zip', '7z', 'rar', 'exe', 'txt', 'bin'],
    keyTermsGlossary: [
      { term: 'Shannon Entropy', definition: 'A mathematical formula measuring the randomness and information density of a byte stream from 0.0 to 8.0.' },
      { term: 'Sliding Window', definition: 'An analytical technique calculating metrics over moving consecutive blocks (e.g. 1024 bytes) to pinpoint localized anomalies.' },
      { term: 'Packed Binary', definition: 'An executable compressed or obfuscated with a runtime packer (like UPX) to hinder static reverse engineering.' }
    ],
    faqs: [
      {
        question: 'What is a "normal" entropy score for a file?',
        answer: 'It depends entirely on the file format. Plain text (.txt, .json): 3.5–5.0. Native executables (.exe): 5.8–6.8. Compressed media (.jpg, .mp4, .zip): 7.8–8.0. Encrypted files (.aes, .gpg): 7.99–8.0.'
      }
    ]
  },

  // 7. What Is SHA-256?
  {
    id: 'what-is-sha-256',
    slug: 'what-is-sha-256',
    title: 'What Is SHA-256? The Standard for Cryptographic Hash Integrity',
    shortTitle: 'SHA-256 Explained',
    subtitle: 'An authoritative technical explanation of Secure Hash Algorithm 256-bit, NIST FIPS 180-4 specifications, collision resistance, and the avalanche effect.',
    category: 'Integrity & Cryptography',
    readTime: '7 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Intermediate',
    author: {
      name: 'David Chen',
      role: 'Principal Systems Security Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'NIST FIPS 180-4', title: 'Secure Hash Standard (SHS) — Specifications for SHA-1, SHA-2, SHA-3' },
      { standard: 'RFC 6234', title: 'US Secure Hash Algorithms (SHA and SHA-based HMAC and HKDF)' },
      { standard: 'ISO/IEC 10118-3', title: 'Information Technology — Dedicated Hash-Functions' }
    ],
    executiveSummary: 'SHA-256 (Secure Hash Algorithm 256-bit) is a deterministic one-way cryptographic hash function designed by the United States National Security Agency (NSA) and standardized by NIST in FIPS 180-4. It processes input data of any size into a fixed-length 256-bit (32-byte / 64-character hexadecimal) digest. SHA-256 guarantees pre-image resistance, second pre-image resistance, and collision resistance.',
    formalDefinition: 'SHA-256 is a Merkle–Damgård iterated cryptographic hash function employing 64 rounds of bitwise operations (AND, XOR, ROTR, SHR, ADD modulo 2^32) operating on 512-bit message blocks to compute a unique 256-bit authentication digest.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  SHA-256 PROCESSING ARCHITECTURE (NIST)                 |
+-------------------------------------------------------------------------+
     Arbitrary Length Input (e.g. 500 MB ISO Image or 1-byte text)
                                 │
                                 ▼
         [ Message Padding & Length Appending (512-bit Blocks) ]
                                 │
                                 ▼
         ┌─────────────────────────────────────────────────┐
         │ 64-Round Compression Function (Per 512-bit Block)│
         │ - 8 Working Variables (A, B, C, D, E, F, G, H)   │
         │ - Bitwise Functions: Ch, Maj, Σ0, Σ1, σ0, σ1    │
         │ - 64 Constant K-Values derived from cube roots  │
         └───────────────────────┬─────────────────────────┘
                                 │
                                 ▼
                   [ 256-bit State Digest Output ]
   e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
               (Fixed 64-character hexadecimal string)`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'Stream Buffer Streaming',
        description: 'Reads local file in 64KB chunk buffers to prevent browser memory exhaustion on multi-gigabyte files.',
        engineMethod: 'file.stream().getReader()'
      },
      {
        stepNumber: 2,
        stageName: 'Web Crypto API Hardware Acceleration',
        description: 'Dispatches raw byte chunks directly to the browser native CryptoSubtle engine (hardware AES-NI / SHA acceleration).',
        engineMethod: 'crypto.subtle.digest("SHA-256", arrayBuffer)'
      },
      {
        stepNumber: 3,
        stageName: 'Hex Digest Formatting',
        description: 'Converts the resulting 32-byte ArrayBuffer into a standardized lowercase 64-character hexadecimal string.',
        engineMethod: 'Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("")'
      },
      {
        stepNumber: 4,
        stageName: 'Checksum Match Verification',
        description: 'Performs constant-time character comparison against publisher-supplied checksums to prevent timing attacks.',
        engineMethod: 'constantTimeCompare(calculatedHash, expectedHash)'
      }
    ],
    keyPrinciples: [
      {
        principle: 'The Avalanche Effect (Strict Sensitivity)',
        explanation: 'In a secure cryptographic hash function, changing a single bit in a 10-gigabyte file will cause approximately 50% of the bits in the output hash to flip unpredictably.',
        realWorldScenario: 'If you change one letter in a 500-page manuscript, the SHA-256 hash changes completely from "9f86d08188..." to "5e884898da...", proving tampering or corruption instantly.'
      },
      {
        principle: 'Collision Resistance',
        explanation: 'A collision occurs when two different inputs produce the exact same hash. For SHA-256, finding a collision requires approximately 2^128 operations (3.4 × 10^38 computations)—making accidental or intentional collisions mathematically infeasible with modern computing.',
        realWorldScenario: 'Unlike legacy MD5 (broken in 2004) and SHA-1 (broken in 2017 with SHAttered), SHA-256 has zero known practical collision attacks.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'Why MD5 and SHA-1 Were Retired in Favor of SHA-256',
        content: 'For decades, MD5 (128-bit) and SHA-1 (160-bit) were the standard hashing algorithms. However, cryptographic researchers demonstrated practical collision attacks:\n\n* MD5 Collision Attack (Wang et al., 2004): Collisions can now be generated on a laptop in seconds, allowing attackers to create two distinct files (one benign, one malicious) sharing identical MD5 hashes.\n* SHA-1 SHAttered Attack (Google & CWI Amsterdam, 2017): Generated two distinct PDF files with the exact same SHA-1 hash using 9 quintillion SHA-1 computations.\n\nBecause of these vulnerabilities, NIST, modern operating systems, and security standards mandate SHA-256 or SHA-512 for file integrity and code signing.',
        bulletPoints: [
          'MD5 is unsafe for security verification; use only for non-cryptographic checksum caches.',
          'SHA-1 is deprecated across all SSL/TLS certificates and git security repositories.',
          'SHA-256 provides 128 bits of security against collision attacks.'
        ]
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Computes a mathematically unique, immutable 256-bit fingerprint of any byte stream.',
        'Verifies exact bit-for-bit file integrity against publisher checksums.',
        'Detects single-bit transmission corruption and intentional file modifications.'
      ],
      whatItDoesNotDo: [
        'Does not encrypt data (SHA-256 is a one-way function and cannot be decrypted).',
        'Does not verify who created the file unless combined with public-key digital signatures (HMAC or RSA/ECDSA).'
      ],
      malwareVsIntegrityDistinction: 'A SHA-256 hash verifies integrity (that the file on your disk is identical to the file hashed by the publisher). It does not evaluate whether the publisher’s original file is benign or malicious. If an attacker publishes a virus and provides its valid SHA-256 hash, the hash will verify perfectly.'
    },
    connectedTools: [
      {
        name: 'Checksum Verifier',
        description: 'Verify SHA-256, SHA-512, and MD5 hashes instantly in your browser.',
        route: { view: 'checksum-verifier' },
        primary: true
      },
      {
        name: 'Hash Generator',
        description: 'Generate multi-algorithm cryptographic hashes for files and text.',
        route: { view: 'hash-generator' }
      }
    ],
    relatedGuides: [
      'how-to-verify-a-file-hash',
      'what-is-file-entropy',
      'what-is-a-file-signature'
    ],
    relatedExtensions: ['iso', 'exe', 'dmg', 'zip', 'tar', 'bin'],
    keyTermsGlossary: [
      { term: 'Cryptographic Hash', definition: 'A one-way mathematical function that maps arbitrary data to a fixed-size bit string.' },
      { term: 'Collision', definition: 'The rare event where two different inputs produce the exact same hash output.' },
      { term: 'Pre-image Resistance', definition: 'The computational infeasibility of finding the original input given only the hash output.' }
    ],
    faqs: [
      {
        question: 'Can SHA-256 be decrypted or reversed?',
        answer: 'No. Cryptographic hash functions are strictly one-way mathematical operations. They compress arbitrary amounts of data into 256 bits, destroying information in the process. It is impossible to "decrypt" a hash back to its source file.'
      },
      {
        question: 'What is the empty string SHA-256 hash?',
        answer: 'The SHA-256 hash of an empty 0-byte file is always "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855".'
      }
    ]
  },

  // 8. How to Verify a File Hash
  {
    id: 'how-to-verify-a-file-hash',
    slug: 'how-to-verify-a-file-hash',
    title: 'How to Verify a File Hash: Complete Guide for Windows, Mac & Linux',
    shortTitle: 'How to Verify File Hashes',
    subtitle: 'Step-by-step practical manual for calculating and validating SHA-256, SHA-512, and MD5 checksums across PowerShell, Terminal, and client-side browser tools.',
    category: 'Integrity & Cryptography',
    readTime: '6 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Beginner',
    author: {
      name: 'David Chen',
      role: 'Principal Systems Security Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'NIST FIPS 180-4', title: 'Cryptographic Checksum Verification Standards' },
      { standard: 'GNU Coreutils', title: 'Standard sha256sum and md5sum Utility Specifications' }
    ],
    executiveSummary: 'Verifying a file hash is the standard industry procedure to ensure that a downloaded file (such as an operating system ISO, software installer, or forensic image) is 100% authentic and free from transmission corruption or malicious tampering. By comparing a locally computed hash against the publisher’s published checksum, users obtain mathematical proof of file integrity.',
    formalDefinition: 'File hash verification is the deterministic process of executing a standardized hashing algorithm over a local binary stream and comparing the resulting fixed digest against an authoritative reference digest published over a secure channel.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  FILE HASH VERIFICATION WORKFLOW                        |
+-------------------------------------------------------------------------+
  1. Download File from Mirror Site
     e.g. ubuntu-24.04-desktop-amd64.iso
                    │
                    ▼
  2. Copy Official SHA-256 Checksum from Official Vendor HTTPS Site
     e.g. "8762b7e... (64 hex characters)"
                    │
                    ▼
  3. Compute Local Hash (PowerShell, Terminal, or AnyFileX Checksum Verifier)
     Local Result: 8762b7e51b...
                    │
                    ▼
  4. Compare Local Hash vs Official Hash
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
   [ EXACT MATCH ]         [ MISMATCH DETECTED ]
   File is authentic.      File corrupted or tampered!
   Safe to execute.        DO NOT RUN — Redownload.`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'Local File Ingestion',
        description: 'Processes file directly in browser memory without uploading any bytes to remote servers.',
        engineMethod: 'crypto.subtle.digest()'
      },
      {
        stepNumber: 2,
        stageName: 'Multi-Algorithm Hash Generation',
        description: 'Generates SHA-256, SHA-512, and MD5 hashes concurrently.',
        engineMethod: 'generateConcurrentHashes(buffer)'
      },
      {
        stepNumber: 3,
        stageName: 'Sanitized String Comparison',
        description: 'Strips whitespace, trims uppercase/lowercase differences, and compares strings with visual diff highlights.',
        engineMethod: 'compareHashesSanitized(local, expected)'
      }
    ],
    keyPrinciples: [
      {
        principle: 'Never Download Hash and File from the Same Compromised Mirror',
        explanation: 'If a mirror download site has been hacked, the attacker will replace both the installer and the hash file on that mirror. Always obtain the reference hash from the main official HTTPS website or a PGP-signed SHA256SUMS file.',
        realWorldScenario: 'When downloading Linux Mint, users verify the SHA-256 hash against the PGP-signed release notes hosted on the main Linux Mint official repository.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'Command Line Hash Verification by Operating System',
        content: 'You can verify file hashes natively without installing third-party software on any major operating system:',
        bulletPoints: [
          'Windows 10/11 (PowerShell): Get-FileHash -Algorithm SHA256 .\\installer.exe',
          'macOS (Terminal): shasum -a 256 installer.dmg',
          'Linux (Bash / Coreutils): sha256sum installer.tar.gz',
          'Automated Batch Verification (Linux): sha256sum -c SHA256SUMS'
        ],
        codeOrConfigExample: {
          language: 'bash',
          code: '# Calculate SHA-256 on Linux/macOS\nshasum -a 256 debian-12.0.0-amd64-netinst.iso\n\n# PowerShell on Windows\nGet-FileHash -Algorithm SHA256 .\\debian-12.0.0-amd64-netinst.iso | Format-List',
          caption: 'Native CLI commands to compute SHA-256 hashes.'
        }
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Proves whether the local file matches the exact bitstream hashed by the vendor.',
        'Guarantees zero download transmission errors or drive sector corruption.',
        'Runs 100% offline inside your local terminal or client browser.'
      ],
      whatItDoesNotDo: [
        'Does not prove the vendor themselves was not compromised.'
      ],
      malwareVsIntegrityDistinction: 'Hash verification proves equality, not safety. If an authentic software vendor has their build pipeline compromised (supply chain attack), the malicious software will match the official hash perfectly.'
    },
    connectedTools: [
      {
        name: 'Checksum Verifier',
        description: 'Paste your expected hash and verify files instantly.',
        route: { view: 'checksum-verifier' },
        primary: true
      },
      {
        name: 'Hash Generator',
        description: 'Generate SHA-256, SHA-512, MD5, and SHA-1 digests.',
        route: { view: 'hash-generator' }
      }
    ],
    relatedGuides: [
      'what-is-sha-256',
      'how-file-type-detection-works',
      'what-is-a-file-signature'
    ],
    relatedExtensions: ['iso', 'exe', 'dmg', 'tar', 'gz', 'zip'],
    keyTermsGlossary: [
      { term: 'Checksum', definition: 'A small-sized datum derived from a block of digital data for the purpose of detecting errors.' },
      { term: 'SHA256SUMS', definition: 'A standard text file format containing list of SHA-256 hashes alongside filenames for automated batch validation.' }
    ],
    faqs: [
      {
        question: 'What should I do if the hash does not match?',
        answer: 'DO NOT run or open the file. Delete the file immediately and re-download it from the official source. A mismatch indicates an incomplete download, corrupted storage sectors, or tampering.'
      }
    ]
  },

  // 9. What Is a ZIP Bomb?
  {
    id: 'what-is-a-zip-bomb',
    slug: 'what-is-a-zip-bomb',
    title: 'What Is a ZIP Bomb? Decompression Bombs & Resource Exhaustion',
    shortTitle: 'ZIP Bombs Explained',
    subtitle: 'A technical analysis of recursive archive bombs, non-recursive overlapping ZIP bombs, compression ratios, and parser defense mechanisms.',
    category: 'Security & Malware Mechanics',
    readTime: '8 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Advanced',
    author: {
      name: 'David Chen',
      role: 'Principal Systems Security Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'PKWARE APPNOTE', title: '.ZIP File Format Specification — Deflate and Directory Layout' },
      { standard: 'CWE-409', title: 'Improper Handling of Highly Compressed Data (Decompression Bomb)' },
      { standard: 'David Fifield (USENIX WOOT 2019)', title: 'A Better Zip Bomb: Non-Recursive Zip Bombs' }
    ],
    executiveSummary: 'A ZIP bomb (also known as a decompression bomb or archive bomb) is a maliciously crafted archive file designed to crash, hang, or exhaust the storage, memory, or CPU of an archive extractor, antivirus scanner, or cloud upload service (Denial of Service). While tiny on disk (kilobytes or megabytes), uncompressing a ZIP bomb expands into gigabytes or petabytes of data.',
    formalDefinition: 'A ZIP bomb is an algorithmic resource-exhaustion exploit that leverages high-ratio DEFLATE compression or overlapping central directory references to achieve disproportionately astronomical expansion ratios exceeding 1,000,000:1.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  ZIP BOMB ANATOMY & EXPANSION PARADIGM                  |
+-------------------------------------------------------------------------+
  RECURSIVE ZIP BOMB (e.g. 42.zip):
  42 KB Zip File
    └── Contains 16 Nested Zip Files (Layer 1)
          └── Each Contains 16 Zip Files (Layer 2)
                └── ... Nested 5 Layers Deep ...
                      └── Expands to 4.5 Petabytes (4,500,000 Gigabytes!)

  NON-RECURSIVE OVERLAPPING ZIP BOMB (Fifield 2019):
  46 MB Zip File
    ├── Central Directory references the SAME compressed kernel 281,000 times
    └── Expands to 4.5 Terabytes without needing nested zip recursion!
                                 │
                                 ▼
              ANYFILEX EXTRACTION DEFENSE MECHANISM:
  - Check declared uncompressed size in Central Directory before extraction.
  - Enforce hard compression ratio ceiling (Maximum 100:1).
  - Stream decompress with absolute memory / byte quota caps.`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'Central Directory Record Inspection',
        description: 'Parses the End of Central Directory (EOCD) to sum the declared uncompressed size of all archive members.',
        engineMethod: 'parseCentralDirectoryHeaders(buffer)'
      },
      {
        stepNumber: 2,
        stageName: 'Compression Ratio Calculation',
        description: 'Computes Ratio = (Total Declared Uncompressed Bytes) / (Archive File Size). Flags if Ratio > 100:1.',
        engineMethod: 'evaluateCompressionRatio(uncompressedBytes, compressedBytes)'
      },
      {
        stepNumber: 3,
        stageName: 'Overlapping Offset Detection',
        description: 'Checks whether multiple file entries in the central directory point to the identical local header data offset.',
        engineMethod: 'detectOverlappingLocalHeaders(centralDirectoryEntries)'
      },
      {
        stepNumber: 4,
        stageName: 'Stream Extraction Quota Enforcement',
        description: 'Caps streaming inflation to predefined limits (e.g. 250MB max extracted) and aborts if exceeded.',
        engineMethod: 'streamWithByteCap(inflateStream, maxBytes=250000000)'
      }
    ],
    keyPrinciples: [
      {
        principle: 'Denial of Service, Not Code Execution',
        explanation: 'A ZIP bomb does not contain executable shellcode or memory overflow exploits. It works purely through resource exhaustion (filling 100% of hard drive space, exhausting RAM, and locking the CPU during decompression).',
        realWorldScenario: 'An attacker uploads a 50KB ZIP bomb to a document processing portal. The backend server attempts to extract it, running out of disk space and crashing all services on the server.'
      },
      {
        principle: 'Modern Non-Recursive Overlapping Bombs',
        explanation: 'Historically, scanners defeated bombs by banning nested archives (archives inside archives). In 2019, researcher David Fifield designed non-recursive ZIP bombs where the central directory references overlapping DEFLATE streams, bypassing recursive filters.',
        realWorldScenario: 'A single 46MB ZIP file with no nested archives unpacks to 4.5TB of data by reusing a single kernel block across thousands of directory records.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'How AnyFileX and Modern Systems Defend Against ZIP Bombs',
        content: 'Secure archive parsers must implement strict defenses before and during extraction:\n\n1. Pre-Extraction Size Check: Calculate total uncompressed size from the central directory headers before allocating disk or memory.\n2. Compression Ratio Limit: Discard archives exhibiting compression ratios greater than 100:1 (normal text archives rarely exceed 15:1; high-efficiency media formats are already compressed).\n3. Streaming Byte Limits: Decompress data through a counting stream that throws an immediate exception if output exceeds safety quotas.\n4. Overlap Detection: Verify that local header offsets increase monotonically without pointing back to previously read bytes.',
        technicalCallout: {
          type: 'security',
          title: 'CWE-409 Mitigation',
          message: 'Never invoke naive extraction libraries (like unzip -o or standard unzippers) on untrusted user uploads without setting hard storage quotas.'
        }
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Analyzes ZIP headers, compression ratios, and overlapping entry offsets.',
        'Explains the mechanics of algorithmic Denial-of-Service attacks.',
        'Details standard defensive extraction quota implementations.'
      ],
      whatItDoesNotDo: [
        'Does not provide tools to create or weaponize malicious archives.'
      ],
      malwareVsIntegrityDistinction: 'A ZIP bomb is a Denial-of-Service (DoS) structural hazard, not a virus or trojan. It causes harm strictly through storage and memory saturation.'
    },
    connectedTools: [
      {
        name: 'File Analyzer',
        description: 'Inspect archive headers, internal structures, and compression ratios.',
        route: { view: 'file-analyzer' },
        primary: true
      },
      {
        name: 'File Repair & Troubleshoot',
        description: 'Troubleshoot damaged or suspicious ZIP archive headers.',
        route: { view: 'repair' }
      }
    ],
    relatedGuides: [
      'what-are-encrypted-archives',
      'what-is-file-entropy',
      'how-file-type-detection-works'
    ],
    relatedExtensions: ['zip', 'gz', 'tar', '7z', 'bz2'],
    keyTermsGlossary: [
      { term: 'Decompression Bomb', definition: 'A small archive file that expands to an enormous volume of data to exhaust system resources.' },
      { term: 'Compression Ratio', definition: 'The ratio between uncompressed data size and compressed data size (Uncompressed / Compressed).' },
      { term: 'EOCD', definition: 'End of Central Directory, the standard 22-byte trailer record at the end of a ZIP archive.' }
    ],
    faqs: [
      {
        question: 'Will double-clicking a ZIP bomb infect my computer with a virus?',
        answer: 'No. A ZIP bomb does not execute malicious code or steal data. However, opening it may cause your file manager to freeze, run out of memory, or fill your hard drive to capacity until the extraction process is canceled.'
      }
    ]
  },

  // 10. What Are Encrypted Archives?
  {
    id: 'what-are-encrypted-archives',
    slug: 'what-are-encrypted-archives',
    title: 'What Are Encrypted Archives? AES-256 vs ZipCrypto & Header Security',
    shortTitle: 'Encrypted Archives',
    subtitle: 'A technical review of archive cryptography, AES-256 payload encryption, legacy ZipCrypto vulnerabilities, PBKDF2 key derivation, and header encryption.',
    category: 'Security & Malware Mechanics',
    readTime: '7 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Intermediate',
    author: {
      name: 'Elena Rostova',
      role: 'Forensic Integrity Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'WinZip AES Specification', title: 'AE-1 and AE-2 Encryption Specification for ZIP' },
      { standard: 'NIST SP 800-38A', title: 'Recommendation for Block Cipher Modes of Operation (CBC / CTR)' },
      { standard: 'PKWARE APPNOTE Section 7', title: 'Traditional PKZIP Encryption Specification' }
    ],
    executiveSummary: 'Encrypted archives (such as password-protected ZIP, 7z, and RAR files) use symmetric cryptography to protect confidential data. However, there is a massive security gap between legacy ZipCrypto (trivially cracked in minutes using known-plaintext attacks) and modern AES-256 encryption. Furthermore, formats like 7z and RAR support Header Encryption, hiding file names and directory trees from unauthorized inspection.',
    formalDefinition: 'An encrypted archive is a container format that applies symmetric block ciphers (AES-256 in CTR/CBC mode) and cryptographic key derivation functions (PBKDF2, Argon2) to payload data streams and optionally file allocation metadata tables.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  ENCRYPTED ARCHIVE SECURITY TAXONOMY                    |
+-------------------------------------------------------------------------+
       FEATURE                  LEGACY ZIPCRYPTO           MODERN AES-256 (7z/ZIP)
 ─────────────────────────────────────────────────────────────────────────
 Cipher Standard         Proprietary 3-state cipher   NIST FIPS 197 (AES-256)
 Key Length              96 bits                      256 bits
 Known-Plaintext Attack  VULNERABLE (Cracked in mins) IMMUNE
 Key Derivation (KDF)    Weak CRC-based iteration     PBKDF2 (10,000+ rounds)
 Header Encryption       UNSUPPORTED (Filenames clear)SUPPORTED in 7z & RAR
 ─────────────────────────────────────────────────────────────────────────

  HEADER ENCRYPTION COMPARISON:
  Standard Encrypted ZIP:
  ├── [Filename Visible]: "Confidential_Financials.xlsx"  <-- Anyone can see name!
  └── [Payload Encrypted]: Encrypted Bytes

  7z / RAR with "Encrypt File Names" Enabled:
  └── [Entire Header Encrypted]: File names, sizes, and structure 100% hidden!`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'General Purpose Bit Flag Inspection',
        description: 'Checks Bit 0 (Encrypted flag) in the ZIP local file header and central directory record.',
        engineMethod: 'checkBitFlag0(localHeader)'
      },
      {
        stepNumber: 2,
        stageName: 'Encryption Method Header Parsing',
        description: 'Detects whether Extra Field 0x9901 (WinZip AES) is present vs legacy ZipCrypto compression method 99.',
        engineMethod: 'parseEncryptionExtraFields(buffer)'
      },
      {
        stepNumber: 3,
        stageName: 'Header Encryption Detection',
        description: 'For 7z/RAR, tests whether the initial signature is immediately followed by an Encrypted Header block marker.',
        engineMethod: 'checkHeaderEncryptionBlock(buffer)'
      }
    ],
    keyPrinciples: [
      {
        principle: 'Never Use Legacy ZipCrypto in 2024+',
        explanation: 'Legacy PKZIP encryption (ZipCrypto) is mathematically broken. If an attacker possesses just 12 bytes of known uncompressed data (such as standard PNG headers), tools like bkcrack can recover the encryption keys in under 5 minutes without needing the password.',
        realWorldScenario: 'A user protects a secret ZIP with ZipCrypto. An attacker who knows one file inside is a standard PDF uses the known "%PDF" header bytes to instantly break the archive password.'
      },
      {
        principle: 'Metadata Leakage in Standard Password-Protected ZIPs',
        explanation: 'In standard ZIP files, passwords encrypt the file contents, but NOT the central directory. Anyone who opens the ZIP can see every file name, directory folder structure, timestamp, and uncompressed byte size.',
        realWorldScenario: 'An encrypted ZIP named "taxes.zip" reveals filenames like "Swiss_Bank_Account_Statement.pdf" even before entering a password. To hide filenames, users must use 7-Zip (.7z) or RAR with "Encrypt file names" enabled.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'How Modern 7-Zip AES-256 Protects Both Data and Filenames',
        content: '7-Zip uses AES-256 in Cipher Block Chaining (CBC) mode combined with SHA-256 key derivation running over 2^19 (524,288) iterations. When the "Encrypt file names" option is selected, the entire main header block is encrypted, meaning that without the password, forensic tools and inspect engines cannot determine how many files exist, what they are named, or what formats they contain.',
        bulletPoints: [
          'PBKDF2 and Argon2 key stretching slows down brute-force GPU hash attacks.',
          'WinZip AES uses HMAC-SHA1 for authenticated decryption (preventing bit-flipping).',
          'Modern RAR 5.0 uses PBKDF2-HMAC-SHA256 with 200,000 iterations.'
        ]
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Identifies encryption methods (AES-256, WinZip AES, ZipCrypto, 7z AES).',
        'Detects whether archive filenames are visible or encrypted in headers.',
        'Warns users against insecure legacy ZipCrypto encryption algorithms.'
      ],
      whatItDoesNotDo: [
        'Does not crack, bypass, or recover lost passwords for AES-256 archives.'
      ],
      malwareVsIntegrityDistinction: 'Encrypted archives are widely used for legitimate data confidentiality. However, threat actors also use password-protected archives to bypass email antivirus gateways that cannot inspect encrypted contents.'
    },
    connectedTools: [
      {
        name: 'File Analyzer',
        description: 'Inspect archive encryption flags and compression algorithms.',
        route: { view: 'file-analyzer' },
        primary: true
      },
      {
        name: 'Magic Byte Detector',
        description: 'Identify archive header signatures.',
        route: { view: 'magic-byte-detector' }
      }
    ],
    relatedGuides: [
      'what-is-a-zip-bomb',
      'what-is-file-entropy',
      'what-is-sha-256'
    ],
    relatedExtensions: ['7z', 'zip', 'rar', 'tar', 'gz'],
    keyTermsGlossary: [
      { term: 'AES-256', definition: 'Advanced Encryption Standard using a 256-bit key, the gold standard for symmetric encryption.' },
      { term: 'ZipCrypto', definition: 'The legacy, mathematically vulnerable proprietary encryption algorithm used in original 1989 PKZIP.' },
      { term: 'Header Encryption', definition: 'A security feature (supported by 7z and RAR) that encrypts the file list metadata in addition to file contents.' }
    ],
    faqs: [
      {
        question: 'Can AnyFileX open or recover my forgotten ZIP password?',
        answer: 'No. Properly configured AES-256 encryption is mathematically unbreakable without the correct password or key. AnyFileX does not store passwords or offer password recovery cracking tools.'
      }
    ]
  },

  // 11. What Are Macro-Enabled Office Files?
  {
    id: 'what-are-macro-enabled-office-files',
    slug: 'what-are-macro-enabled-office-files',
    title: 'What Are Macro-Enabled Office Files? DOCM, XLSM & VBA Security',
    shortTitle: 'Macro-Enabled Office Files',
    subtitle: 'An architectural exploration of Microsoft OpenXML vs Compound Binary formats, VBA project streams, Mark-of-the-Web (MOTW), and macro security policies.',
    category: 'Security & Malware Mechanics',
    readTime: '8 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Intermediate',
    author: {
      name: 'David Chen',
      role: 'Principal Systems Security Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'ISO/IEC 29500', title: 'Information Technology — Document Description and Processing Languages (Office Open XML)' },
      { standard: 'MS-OVBA Specification', title: 'Microsoft Office Visual Basic for Applications (VBA) File Format Structure' }
    ],
    executiveSummary: 'Macro-enabled Office files (.docm, .xlsm, .pptm, and legacy .doc/.xls) are Microsoft Office documents capable of executing embedded Visual Basic for Applications (VBA) programming code or Excel 4.0 (XLM) macros. While macros provide legitimate spreadsheet automation and document formatting, they remain one of the most historically abused delivery mechanisms for malware, droppers, and ransomware.',
    formalDefinition: 'A macro-enabled file is an Office Open XML or Compound File Binary (CFB) package containing an embedded "vbaProject.bin" compound binary stream that can invoke system API calls, PowerShell scripts, and file I/O operations upon document opening or user trigger.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  OFFICE OPENXML MACRO SEGREGATION ARCHITECTURE          |
+-------------------------------------------------------------------------+
  STANDARD (MACRO-FREE) FORMAT:
  document.docx (ZIP Container)
  ├── [Content_Types].xml
  ├── word/document.xml (Text & formatting only)
  └── [VBA PROJECT CANNOT EXIST] -> Word refuses to load code in .docx!

  MACRO-ENABLED FORMAT:
  document.docm (ZIP Container)
  ├── [Content_Types].xml -> Declares "application/vnd.ms-word.document.macroEnabled"
  ├── word/document.xml
  └── word/vbaProject.bin  <-- Embedded OLE Compound File containing compiled VBA!
                                │
                                ▼
               WINDOWS MOTW (MARK-OF-THE-WEB) POLICY:
  - If downloaded from Internet -> "ZoneId=3" NTFS Alternate Data Stream.
  - Microsoft Office 2022+ automatically blocks macros by default on internet files!`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'OpenXML Package Unbundling',
        description: 'Inspects the ZIP central directory of .docx, .docm, .xlsx, and .xlsm files.',
        engineMethod: 'inspectZipDirectoryEntries(buffer)'
      },
      {
        stepNumber: 2,
        stageName: 'vbaProject.bin Stream Detection',
        description: 'Scans for the presence of "word/vbaProject.bin", "xl/vbaProject.bin", or "ppt/vbaProject.bin".',
        engineMethod: 'findVbaProjectStream(entries)'
      },
      {
        stepNumber: 3,
        stageName: 'Extension vs Macro-Type Verification',
        description: 'Verifies whether a file with a .docx extension illegally contains a vbaProject.bin stream (corrupt or spoofed).',
        engineMethod: 'verifyMacroExtensionParity(extension, hasVba)'
      },
      {
        stepNumber: 4,
        stageName: 'Legacy OLE2 Compound Document Scan',
        description: 'For legacy .doc / .xls formats (D0 CF 11 E0 magic bytes), scans directory sectors for "_VBA_PROJECT" streams.',
        engineMethod: 'scanOle2CompoundDirectory(buffer)'
      }
    ],
    keyPrinciples: [
      {
        principle: 'Strict Format Segregation (.docx vs .docm)',
        explanation: 'In 2007, Microsoft introduced OpenXML to strictly separate macro-free documents (.docx, .xlsx, .pptx) from macro-enabled documents (.docm, .xlsm, .pptm). Microsoft Word will strictly refuse to execute VBA macros in a file with a .docx extension.',
        realWorldScenario: 'If an attacker renames a malicious "invoice.docm" file to "invoice.docx", Microsoft Word displays a format error or opens the document in protected view without executing any VBA code.'
      },
      {
        principle: 'Mark-of-the-Web (MOTW) Protection',
        explanation: 'When Windows downloads a file from the internet, it attaches a hidden NTFS Alternate Data Stream (Zone.Identifier: ZoneId=3). Microsoft Office uses this tag to permanently block macros from running on internet files.',
        realWorldScenario: 'A user downloads an Excel invoice from webmail. Excel detects MOTW ZoneId=3 and displays a red security banner: "Microsoft has blocked macros from running because the source of this file is untrusted."'
      }
    ],
    deepDiveSections: [
      {
        heading: 'The Internal Structure of vbaProject.bin',
        content: 'Inside a .docm or .xlsm archive, macros are compiled into a binary file named `vbaProject.bin`. This binary is structured according to the MS-OVBA specification as an OLE Compound Document containing:\n\n* PROJECT stream: Text metadata containing project name, help IDs, and code module lists.\n* VBA module streams: Compressed source code and compiled p-code (pseudo-code) for Document objects (ThisDocument, Sheet1) and Standard Modules.\n* References: Dynamic link libraries (DLLs) and COM components invoked by the macro.',
        bulletPoints: [
          'Macros can execute automatically upon opening using "AutoOpen" or "Workbook_Open" subroutines.',
          'VBA code can invoke Windows API functions (URLDownloadToFile, ShellExecute) to download and run payloads.'
        ]
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Identifies macro-enabled formats (.docm, .xlsm, .pptm, .dotm).',
        'Detects embedded vbaProject.bin streams and legacy OLE2 VBA modules.',
        'Explains Microsoft MOTW security policies and format segregation.'
      ],
      whatItDoesNotDo: [
        'Does not decompile or execute VBA code.',
        'Does not scan for specific antivirus heuristic threat signatures inside macro code.'
      ],
      malwareVsIntegrityDistinction: 'The presence of a VBA macro does not mean a file is malicious. Millions of legitimate accounting spreadsheets and enterprise templates rely on macros. AnyFileX detects macro capability, distinguishing format structure from behavioral threat.'
    },
    connectedTools: [
      {
        name: 'File Analyzer',
        description: 'Inspect OpenXML container structure and detect embedded VBA streams.',
        route: { view: 'file-analyzer' },
        primary: true
      },
      {
        name: 'Magic Byte Detector',
        description: 'Check ZIP vs OLE2 Compound Document magic signatures.',
        route: { view: 'magic-byte-detector' }
      }
    ],
    relatedGuides: [
      'how-file-extensions-can-be-spoofed',
      'how-file-type-detection-works',
      'what-are-magic-bytes'
    ],
    relatedExtensions: ['docm', 'xlsm', 'pptm', 'docx', 'xlsx', 'doc'],
    keyTermsGlossary: [
      { term: 'VBA', definition: 'Visual Basic for Applications, the event-driven programming language developed by Microsoft for Office automation.' },
      { term: 'MOTW', definition: 'Mark-of-the-Web, an NTFS metadata flag identifying files downloaded from untrusted internet zones.' },
      { term: 'OpenXML', definition: 'The ISO/IEC 29500 standardized XML and ZIP container format used by modern Microsoft Office files.' }
    ],
    faqs: [
      {
        question: 'Can a standard .docx or .xlsx file run macros?',
        answer: 'No. Modern Microsoft Office software strictly enforces that .docx and .xlsx files cannot contain or execute macros. Only .docm, .xlsm, .pptm, and legacy .doc/.xls files can execute VBA code.'
      }
    ]
  },

  // 12. How File Extensions Can Be Spoofed
  {
    id: 'how-file-extensions-can-be-spoofed',
    slug: 'how-file-extensions-can-be-spoofed',
    title: 'How File Extensions Can Be Spoofed: Techniques & Detection Methods',
    shortTitle: 'Extension Spoofing',
    subtitle: 'A technical analysis of double extensions, Unicode Right-to-Left Override (RTLO) attacks, hidden extension policies, and magic-byte discrepancy detection.',
    category: 'Security & Malware Mechanics',
    readTime: '7 min read',
    lastUpdated: 'August 2024',
    difficulty: 'Intermediate',
    author: {
      name: 'David Chen',
      role: 'Principal Systems Security Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    standardsAndRFCs: [
      { standard: 'Unicode Standard Annex #9', title: 'The Unicode Bidirectional Algorithm (UBA) & RTLO Character U+202E' },
      { standard: 'MITRE ATT&CK T1036.007', title: 'Masquerading: Double Extension and Name Obfuscation' }
    ],
    executiveSummary: 'File extension spoofing is a social engineering and evasive technique where an attacker disguises an executable program, script, or hostile payload to look like an innocuous document, image, or media file. Mechanisms range from abusing default Windows "Hide extensions for known file types" settings to weaponizing Unicode Right-to-Left Override (RTLO) characters and polyglot files.',
    formalDefinition: 'Extension spoofing is the deliberate manipulation of filename string representations, directory metadata, or bidirectional text formatting to deceive human operators or naive file filters regarding the true executable nature of a binary payload.',
    asciiFlowDiagram: `+-------------------------------------------------------------------------+
|                  COMMON EXTENSION SPOOFING VECTORS                      |
+-------------------------------------------------------------------------+
  1. DEFAULT WINDOWS HIDDEN EXTENSION EXPLOITATION:
     Real Filename on Disk:   "Quarterly_Report.pdf.exe"
     Displayed in Explorer:   "Quarterly_Report.pdf"  (with PDF icon!)
     Result upon Click:       Executes .EXE binary payload!

  2. UNICODE RIGHT-TO-LEFT OVERRIDE (RTLO U+202E):
     Underlying UTF-8 String: "Payroll_Report_[U+202E]cod.exe"
     Rendered Visual String:  "Payroll_Report_exe.doc"  (Looks like .DOC!)
     True Binary Format:      Windows Executable (.EXE)

  3. ANYFILEX DETECTION METHODOLOGY:
     Filename String:  "invoice.pdf"
            │
            ▼
     Read Magic Bytes: 4D 5A (MZ)
            │
            ▼
     MISMATCH ALERT: Extension is ".pdf", but binary magic bytes are "MZ" (.exe)!`,
    engineWorkflow: [
      {
        stepNumber: 1,
        stageName: 'Unicode Character Array Audit',
        description: 'Scans the filename string for invisible control characters, bidirectional override markers (U+202E RTLO), and zero-width spaces.',
        engineMethod: 'scanUnicodeControlCharacters(fileName)'
      },
      {
        stepNumber: 2,
        stageName: 'Double-Extension Parsing',
        description: 'Tokenizes filename by dot delimiters to identify dangerous multi-extension sequences (e.g. .pdf.exe, .docx.vbs).',
        engineMethod: 'detectDoubleExtensions(fileName)'
      },
      {
        stepNumber: 3,
        stageName: 'Magic Byte Discrepancy Evaluation',
        description: 'Extracts the true binary signature and cross-references against the declared extension to flag severe executable masquerades.',
        engineMethod: 'evaluateSignatureMismatch(detectedExt, declaredExt)'
      }
    ],
    keyPrinciples: [
      {
        principle: 'Never Trust the Visual Filename',
        explanation: 'Operating systems render filenames according to user interface formatting rules. Filename characters and icons can be spoofed; physical header magic bytes cannot lie.',
        realWorldScenario: 'An email arrives with "Invoice_2024.pdf". When dropped into AnyFileX, the engine instantly flags that the magic bytes are "4D 5A", preventing the user from running a trojan.'
      }
    ],
    deepDiveSections: [
      {
        heading: 'How the Unicode RTLO (U+202E) Attack Works',
        content: 'The Unicode Right-to-Left Override character (U+202E) was designed to support languages written from right to left, such as Arabic and Hebrew. When injected into a filename, it instructs the operating system to reverse the visual order of all subsequent characters:\n\n* Attack Filename String: `annual_summary_[U+202E]fdp.exe`\n* Visually Displayed String: `annual_summary_exe.pdf`\n\nTo human users, the file appears to end with the safe extension `.pdf`. But to the Windows operating system kernel, the true extension remains `.exe`, causing it to execute as a program when double-clicked.',
        technicalCallout: {
          type: 'security',
          title: 'RTLO Detection in AnyFileX',
          message: 'The AnyFileX File Intelligence Engine automatically strips and flags bidirectional Unicode control characters (U+202A to U+202E) during file ingestion.'
        }
      },
      {
        heading: 'Configuring Windows Explorer to Always Show Extensions',
        content: 'By default, Windows hides file extensions for known file types, which attackers exploit by creating files named `document.pdf.exe` (which displays as `document.pdf`).\n\nTo disable this vulnerability on Windows 10/11:\n1. Open File Explorer.\n2. Click "View" -> "Show" (or "Folder Options").\n3. Check the box "File name extensions".',
        bulletPoints: [
          'Always enable file name extensions in Windows File Explorer.',
          'Verify downloaded files with AnyFileX Magic Byte Detector before opening from untrusted senders.'
        ]
      }
    ],
    limitationsAndDistinctions: {
      whatItDoes: [
        'Detects binary-to-extension spoofing (e.g. Executable disguised as PDF or JPEG).',
        'Scans filenames for Unicode RTLO (U+202E) and double-extension obfuscation.',
        'Explains defensive OS configurations to prevent social engineering attacks.'
      ],
      whatItDoesNotDo: [
        'Does not modify your operating system registry settings automatically.'
      ],
      malwareVsIntegrityDistinction: 'Extension spoofing detection identifies deception in naming and header consistency. It is a vital layer of defensive file intelligence, but should be combined with endpoint protection.'
    },
    connectedTools: [
      {
        name: 'Magic Byte Detector',
        description: 'Instantly detect if a file extension is spoofed or mismatched.',
        route: { view: 'magic-byte-detector' },
        primary: true
      },
      {
        name: 'File Analyzer',
        description: 'Full metadata, Unicode filename audit, and header verification.',
        route: { view: 'file-analyzer' }
      }
    ],
    relatedGuides: [
      'what-are-magic-bytes',
      'how-file-type-detection-works',
      'what-are-macro-enabled-office-files'
    ],
    relatedExtensions: ['exe', 'pdf', 'docx', 'jpg', 'vbs', 'scr'],
    keyTermsGlossary: [
      { term: 'RTLO', definition: 'Right-to-Left Override (Unicode character U+202E), a formatting character used to reverse the visual direction of text.' },
      { term: 'Double Extension', definition: 'The tactic of naming a file with two extensions (e.g. file.pdf.exe) to trick users when extensions are hidden.' },
      { term: 'Spoofing', definition: 'The act of disguising a communication or payload from an unknown source as being from a trusted source.' }
    ],
    faqs: [
      {
        question: 'Can a photo or music file secretly contain a virus?',
        answer: 'A genuine raster image (.png, .jpg) or audio file (.mp3) cannot execute code on its own. However, an attacker can disguise an executable by renaming "virus.exe" to "song.mp3.exe" or "photo.jpg", relying on users to double-click it. AnyFileX checks the magic bytes to expose this trick.'
      }
    ]
  }
];

export function getTechnicalGuide(slugOrId: string): TechnicalAuthorityGuide {
  const normalized = (slugOrId || '').toLowerCase().trim();
  const guide = TECHNICAL_AUTHORITY_GUIDES.find(
    (g) => g.slug.toLowerCase() === normalized || g.id.toLowerCase() === normalized
  );
  return guide || TECHNICAL_AUTHORITY_GUIDES[0];
}

export function getAllTechnicalGuides(): TechnicalAuthorityGuide[] {
  return TECHNICAL_AUTHORITY_GUIDES;
}

export function getTechnicalGuidesByCategory(category: string): TechnicalAuthorityGuide[] {
  if (!category || category.toLowerCase() === 'all') {
    return TECHNICAL_AUTHORITY_GUIDES;
  }
  return TECHNICAL_AUTHORITY_GUIDES.filter(
    (g) => g.category.toLowerCase() === category.toLowerCase()
  );
}
