import { CategoryType } from '../../types';

export interface TroubleshootingStep {
  os: 'windows' | 'mac' | 'linux' | 'all' | 'mobile';
  title: string;
  instructions: string[];
  tips?: string;
}

export interface TroubleshootingToolLink {
  name: string;
  description: string;
  route: { view: string; [key: string]: any };
  iconType: 'analyzer' | 'converter' | 'metadata' | 'signature' | 'checksum' | 'open';
  primary?: boolean;
}

export interface TroubleshootingGuideItem {
  id: string; // slug e.g. 'why-wont-my-file-open'
  title: string;
  subtitle: string;
  category: CategoryType | 'Universal' | 'General';
  problemSummary: string;
  commonErrorMessages: string[];
  symptoms: string[];
  
  // 4-Stage Diagnostic Flow Model
  diagnosticFlow: {
    problemStatement: string;
    analysisTechnique: string;
    identifiedRootCause: string;
    recommendedResolution: string;
  };

  // Detailed Explanations
  whyItHappens: {
    cause: string;
    explanation: string;
    technicalContext?: string;
  }[];

  howToConfirm: {
    method: string;
    steps: string[];
    whatToLookFor: string;
  }[];

  // OS-specific Fixes
  osWorkflows: TroubleshootingStep[];

  // Security & Integrity Assertions (Measurable, No false promises)
  measurableSecurityNotes: {
    verifiedAspects: string[];
    antivirusDistinction: string;
  };

  // Connected AnyFileX Tools
  connectedTools: TroubleshootingToolLink[];

  // Related File Extensions & Guides
  relatedExtensions: string[];
  relatedGuideIds: string[];

  // FAQ Schema
  faqs: { question: string; answer: string }[];
}

export const TROUBLESHOOTING_GUIDES: TroubleshootingGuideItem[] = [
  {
    id: 'why-wont-my-file-open',
    title: "Why Won't My File Open? The Complete Diagnostic Guide",
    subtitle: "A systematic 5-point troubleshooting protocol to diagnose unreadable, unsupported, or crashing files across any operating system.",
    category: 'Universal',
    problemSummary: "When you double-click a file and receive an error, a blank screen, or an application crash, the root cause almost always falls into one of five technical buckets: missing codecs/software, extension mismatch, container corruption, permission locks, or incomplete downloads.",
    commonErrorMessages: [
      "Windows cannot open this file",
      "No application is set to open the document",
      "The file is damaged and could not be repaired",
      "Format not supported or invalid file header",
      "The compressed folder is invalid or corrupt"
    ],
    symptoms: [
      "Operating system prompts: 'How do you want to open this file?' with no default app",
      "Application launches but displays a blank canvas, black screen, or immediately closes",
      "File opens as garbled, unreadable binary text (gibberish characters)",
      "File explorer shows generic white icon instead of app preview thumbnail"
    ],
    diagnosticFlow: {
      problemStatement: "File fails to open or throws an 'unsupported format' error upon launch.",
      analysisTechnique: "Inspect the first 16 bytes (Magic Bytes / File Header) to determine true binary format vs filename extension.",
      identifiedRootCause: "Missing dedicated rendering software, spoofed/renamed file extension, or incomplete network download.",
      recommendedResolution: "Verify true format via AnyFileX File Analyzer, install matching codec or software, or convert to a universal format."
    },
    whyItHappens: [
      {
        cause: "File Extension Mismatch",
        explanation: "The file was renamed manually (e.g. from .webp to .jpg) without actual format transcoding. Software expecting JPEG data encounters WebP RIFF headers and aborts."
      },
      {
        cause: "Missing System Codecs or Default App",
        explanation: "Modern container formats like HEIC (Apple iOS), AVIF, or MKV require specialized decoder libraries that may not come pre-installed on Windows 10/11 or older macOS versions."
      },
      {
        cause: "Incomplete Download or Zero-Byte Truncation",
        explanation: "Browser downloads or cloud sync transfers that terminate early leave partial files lacking end-of-file trailers or central directories."
      },
      {
        cause: "Operating System File Association Corruption",
        explanation: "Windows Registry or macOS LaunchServices database maps the extension to an obsolete or uninstalled program."
      }
    ],
    howToConfirm: [
      {
        method: "Magic Byte Inspection",
        steps: [
          "Load the file into AnyFileX File Analyzer (processed locally in your browser).",
          "Compare the detected Magic Byte signature (e.g. '89 50 4E 47') against the declared filename extension.",
          "Check whether the confidence score indicates a 100% verified match or a mismatch."
        ],
        whatToLookFor: "A mismatch alert indicating the true format differs from the filename extension."
      },
      {
        method: "File Size & Truncation Check",
        steps: [
          "Right-click the file and select 'Properties' (Windows) or 'Get Info' (macOS).",
          "Check the file size on disk."
        ],
        whatToLookFor: "Files showing 0 KB or drastically smaller than expected (e.g., 1 KB HTML error pages instead of a 20 MB video)."
      }
    ],
    osWorkflows: [
      {
        os: 'windows',
        title: 'Windows 11 / 10 Triage Workflow',
        instructions: [
          "Right-click the file, choose 'Open with' > 'Choose another app'.",
          "If the desired program is missing, browse to 'More apps' or 'Look for another app on this PC'.",
          "Enable file extensions in File Explorer: View > Show > File name extensions to verify the true suffix.",
          "If the file came from the internet, right-click > Properties > Check 'Unblock' at the bottom of the General tab, then click Apply."
        ],
        tips: "Windows Defender SmartScreen or Mark-of-the-Web (Zone.Identifier) blocks downloaded files without warning."
      },
      {
        os: 'mac',
        title: 'macOS Sonoma / Ventura / Monterey Workflow',
        instructions: [
          "Right-click (Control-click) the file, select 'Get Info' (Cmd+I).",
          "Expand 'Open with:', select the compatible application, and click 'Change All...' to reset system associations.",
          "If macOS Gatekeeper blocks opening ('unidentified developer'), go to System Settings > Privacy & Security > click 'Open Anyway'."
        ],
        tips: "Hold Option while right-clicking and select 'Open' to trigger the Gatekeeper override dialog directly."
      },
      {
        os: 'linux',
        title: 'Linux (Ubuntu / Fedora / Arch) Workflow',
        instructions: [
          "Open a terminal and run `file --mime-type filename` to identify the real container format via libmagic.",
          "Run `xdg-open filename` to observe system error output.",
          "Install missing codec bundles: `sudo apt install ubuntu-restricted-extras`."
        ]
      }
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        "Binary magic bytes match declared format standards.",
        "File size is non-zero and passes structural header validation.",
        "No hidden executable extensions or double suffixes detected."
      ],
      antivirusDistinction: "AnyFileX analyzes structural integrity and binary format signatures. This verification does not execute code and does not substitute for real-time endpoint antivirus scanning."
    },
    connectedTools: [
      {
        name: 'Instant File Analyzer',
        description: 'Detect real format, magic bytes, and extension mismatches in your browser.',
        route: { view: 'file-analyzer' },
        iconType: 'analyzer',
        primary: true
      },
      {
        name: 'File Format Converters',
        description: 'Convert problematic files to universally supported standard formats.',
        route: { view: 'converters' },
        iconType: 'converter'
      },
      {
        name: 'Magic Byte Detector',
        description: 'Lookup raw byte signatures and structural offsets.',
        route: { view: 'magic-byte-detector' },
        iconType: 'signature'
      }
    ],
    relatedExtensions: ['heic', 'pdf', 'zip', 'docx', 'webp', 'mkv', 'dat'],
    relatedGuideIds: ['how-to-identify-unknown-file', 'fix-file-wrong-extension', 'how-to-check-corrupted-file'],
    faqs: [
      {
        question: "Why does my file open with garbled text and strange symbols?",
        answer: "This happens when binary data (like an image, PDF, or compressed archive) is opened in a plain text editor like Notepad. The text editor interprets binary bytes as ASCII/UTF characters instead of decoding the structure."
      },
      {
        question: "How can I tell if a file is permanently broken or just needs a different app?",
        answer: "Load the file into the AnyFileX File Analyzer. If valid header magic bytes are found, the data is intact and you only need the right application or a format conversion. If the file is 0 bytes or filled with null bytes (0x00), the content is truncated."
      }
    ]
  },
  {
    id: 'how-to-identify-unknown-file',
    title: "How to Identify an Unknown File With No Extension",
    subtitle: "Identify extensionless files, generic .DAT or .BIN files, and mystery attachments using binary header inspection.",
    category: 'Universal',
    problemSummary: "Files without an extension or with generic names like 'attachment.dat' or 'download.bin' confuse operating systems because file explorers rely on filename extensions to choose opening software. However, the true file identity is encoded inside the first few bytes of the file.",
    commonErrorMessages: [
      "How do you want to open this file?",
      "Windows cannot open this type of file (.DAT / .BIN)",
      "There is no application set to open this document",
      "Unknown File Type"
    ],
    symptoms: [
      "File has no dot or extension in its name (e.g., 'document_v2')",
      "File has a generic .dat, .bin, .tmp, or .part extension",
      "Email client downloaded attachment as 'winmail.dat' or 'message.bin'"
    ],
    diagnosticFlow: {
      problemStatement: "The operating system cannot recognize the file because the filename lacks an extension or uses a generic container name.",
      analysisTechnique: "Read the leading 16-64 magic bytes (file signature) at offset 0x00000000 and match against the global signature database.",
      identifiedRootCause: "Missing filename extension resulting from email stripping, web server misconfiguration, or Unix-to-Windows transfer.",
      recommendedResolution: "Append the verified extension detected by AnyFileX to the filename (e.g. rename 'file' to 'file.pdf')."
    },
    whyItHappens: [
      {
        cause: "Email Attachment MIME Stripping",
        explanation: "Microsoft Outlook and Exchange servers encapsulate rich-text attachments into TNEF packages named 'winmail.dat' when communicating with non-Exchange email clients."
      },
      {
        cause: "Unix / macOS Cross-Platform Transfers",
        explanation: "Unix and Linux file systems do not require filename extensions because they identify files through inode MIME data. Moving files to Windows leaves them without extension associations."
      },
      {
        cause: "Incomplete Web Browser Downloads",
        explanation: "Browsers save active downloads as '.crdownload' (Chrome), '.part' (Firefox), or generic temporary hash names until completion."
      }
    ],
    howToConfirm: [
      {
        method: "Instant Browser-Local Binary Analysis",
        steps: [
          "Drag the unknown file into the AnyFileX File Identifier.",
          "The engine analyzes byte signatures locally in your browser memory without uploading.",
          "Read the identified format name, standard extension, and official MIME type."
        ],
        whatToLookFor: "A confirmed file match with high confidence score and matching magic bytes."
      },
      {
        method: "Terminal Command (macOS / Linux)",
        steps: [
          "Open Terminal.",
          "Type `file -b --mime-type ` and drag the file into the terminal window.",
          "Press Enter."
        ],
        whatToLookFor: "The output shows the official MIME type (e.g., `application/pdf` or `image/png`)."
      }
    ],
    osWorkflows: [
      {
        os: 'windows',
        title: 'Fix Unknown File on Windows 11 / 10',
        instructions: [
          "Identify the real extension using AnyFileX (e.g., .pdf).",
          "Ensure file extensions are visible: File Explorer > View > Show > File name extensions.",
          "Right-click the file > Rename (or press F2).",
          "Add the dot and extension to the end (e.g., `invoice` -> `invoice.pdf`).",
          "Press Enter and click 'Yes' to confirm the extension change dialog."
        ]
      },
      {
        os: 'mac',
        title: 'Fix Unknown File on macOS',
        instructions: [
          "Identify the extension with AnyFileX (e.g., .jpg).",
          "Select the file in Finder and press Return.",
          "Type the extension at the end (e.g., `photo.jpg`) and press Return.",
          "Click 'Add' or 'Use .jpg' when prompted."
        ]
      }
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        "Identified file signature against 400+ standardized binary magic byte patterns.",
        "Confirmed file structural container integrity.",
        "Verified absence of hidden double extensions (e.g., .pdf.exe)."
      ],
      antivirusDistinction: "Format identification establishes binary container type only; it does not evaluate whether macros or embedded scripts contain malicious code."
    },
    connectedTools: [
      {
        name: 'File Identifier & Analyzer',
        description: 'Drop any unknown file to instantly discover its true extension and format.',
        route: { view: 'file-analyzer' },
        iconType: 'analyzer',
        primary: true
      },
      {
        name: 'Magic Byte Detector',
        description: 'Explore the full database of binary signatures and hexadecimal headers.',
        route: { view: 'magic-byte-detector' },
        iconType: 'signature'
      },
      {
        name: 'Metadata Viewer',
        description: 'Inspect author details, camera EXIF, and creation software tags.',
        route: { view: 'metadata-viewer' },
        iconType: 'metadata'
      }
    ],
    relatedExtensions: ['dat', 'bin', 'pdf', 'zip', 'png', 'jpg', 'docx'],
    relatedGuideIds: ['why-wont-my-file-open', 'fix-file-wrong-extension', 'how-to-check-file-signature'],
    faqs: [
      {
        question: "Is it safe to rename an unknown file by adding an extension?",
        answer: "Yes, provided you verified the true format first using a magic byte analyzer. Renaming a file simply tells the operating system which program to use to open it without altering the underlying data."
      },
      {
        question: "What is winmail.dat and how can I open it?",
        answer: "A winmail.dat file is a proprietary Microsoft Outlook package containing rich text formatting and attachments. AnyFileX File Analyzer can detect whether your winmail.dat contains embedded PDFs, Word docs, or images."
      }
    ]
  },
  {
    id: 'fix-file-wrong-extension',
    title: "How to Fix a File With the Wrong Extension (Format Mismatch)",
    subtitle: "Identify and resolve extension mismatches where files were incorrectly named, converted by renaming, or corrupted by web scrapers.",
    category: 'Universal',
    problemSummary: "Renaming 'photo.png' to 'photo.jpg' does not convert the image—it merely mislabels the container. When software expects JPEG DCT blocks but receives PNG zlib chunks, it fails with errors like 'Invalid Image Header' or 'Format Not Supported'.",
    commonErrorMessages: [
      "Invalid file format or file extension does not match content",
      "The file format and extension of 'filename' don't match",
      "Windows Photo Viewer can't open this picture because the file appears to be damaged, corrupted, or is too large",
      "QuickTime Player cannot open this file. It is not a supported file type"
    ],
    symptoms: [
      "File opens in some apps (like Google Chrome) but fails in desktop editors (like Photoshop or Word)",
      "Office displays: 'The file is corrupt and cannot be opened' for a .docx that is actually .rtf or .doc",
      "Image viewer displays broken icon or solid grey box"
    ],
    diagnosticFlow: {
      problemStatement: "The file's declared filename suffix contradicts the actual binary magic byte sequence.",
      analysisTechnique: "Cross-reference the filename extension against the magic byte detection table.",
      identifiedRootCause: "Manual file renaming without transcoding or incorrect web server Content-Disposition headers.",
      recommendedResolution: "Either rename the file extension to match the true signature or use the AnyFileX Converter to perform a true binary transcode."
    },
    whyItHappens: [
      {
        cause: "Manual Renaming Instead of True Conversion",
        explanation: "Users frequently try to change format by simply typing a different extension in File Explorer. Because the binary data remains unchanged, applications reading the file fail header checks."
      },
      {
        cause: "Web Browser / CMS Automatic Renaming",
        explanation: "Content delivery networks and web scrapers often serve modern formats (like WebP or AVIF) with .jpg or .png URL extensions for legacy compatibility."
      },
      {
        cause: "Zip vs Office OpenXML Confusion",
        explanation: "Modern DOCX, XLSX, and PPTX files are zipped XML archives. If renamed to .zip, opening software may decompress them instead of launching Microsoft Office."
      }
    ],
    howToConfirm: [
      {
        method: "AnyFileX Mismatch Detection",
        steps: [
          "Drop the problematic file into the AnyFileX File Analyzer.",
          "Check the 'Extension vs Header Match' indicator.",
          "Observe the exact mismatch report (e.g. 'Filename says .jpg, but byte header is PNG 89 50 4E 47')."
        ],
        whatToLookFor: "A yellow or red mismatch banner displaying the true required extension."
      }
    ],
    osWorkflows: [
      {
        os: 'windows',
        title: 'Correcting Wrong Extension on Windows',
        instructions: [
          "Open File Explorer, click 'View' in the top menu > 'Show' > check 'File name extensions'.",
          "Right-click the mismatched file and select 'Rename' (or press F2).",
          "Replace the incorrect extension with the true extension verified by AnyFileX (e.g. change `.jpg` to `.png`).",
          "Press Enter. When Windows warns 'If you change a file name extension, the file might become unusable', click Yes."
        ]
      },
      {
        os: 'mac',
        title: 'Correcting Wrong Extension on macOS',
        instructions: [
          "Select the file in Finder and press Command + I (Get Info).",
          "In the 'Name & Extension' field, edit the extension to match the verified format.",
          "Press Return and confirm 'Use .[new extension]' in the dialog prompt."
        ]
      }
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        "Specific mismatch identified between filename extension and RFC-registered magic byte signature.",
        "Verified that the underlying payload matches standard codec specifications."
      ],
      antivirusDistinction: "Extension correction solves container mislabeling. It does not certify that binary code inside the file is free of security vulnerabilities."
    },
    connectedTools: [
      {
        name: 'File Analyzer & Extension Verifier',
        description: 'Instantly diagnose extension mismatches and find the true format.',
        route: { view: 'file-analyzer' },
        iconType: 'analyzer',
        primary: true
      },
      {
        name: 'Format Converters',
        description: 'Perform a real binary transcode (e.g., truly convert PNG to JPEG).',
        route: { view: 'converters' },
        iconType: 'converter'
      }
    ],
    relatedExtensions: ['webp', 'jpg', 'png', 'avif', 'docx', 'zip', 'mp4'],
    relatedGuideIds: ['why-wont-my-file-open', 'how-to-identify-unknown-file', 'how-to-check-file-signature'],
    faqs: [
      {
        question: "Why doesn't renaming .jpg to .png make it a real PNG?",
        answer: "The filename extension is just a label for the operating system. A PNG file is encoded with distinct chunk markers (IHDR, IDAT, IEND) and DEFLATE compression. Renaming the file doesn't transform the underlying JPEG compression matrix; you need a converter tool for true transcoding."
      },
      {
        question: "Why did a website download a .webp file as .jpg?",
        answer: "Many modern websites serve next-gen WebP or AVIF images dynamically to save bandwidth, but leave the URL ending in .jpg for SEO or backward compatibility. AnyFileX detects this immediately."
      }
    ]
  },
  {
    id: 'how-to-check-corrupted-file',
    title: "How to Check if a File Is Corrupted or Broken",
    subtitle: "A forensic approach to testing file integrity, verifying checksums, and finding missing headers without risking data loss.",
    category: 'Universal',
    problemSummary: "File corruption occurs when stored binary data is altered, truncated, or overwritten by hardware failures, incomplete downloads, or software crashes. Knowing whether a file is recoverable requires checking header signatures, EOF markers, and hash checksums.",
    commonErrorMessages: [
      "The file is corrupt and cannot be opened",
      "CRC failed in file or checksum mismatch",
      "Unexpected end of file (EOF)",
      "File header is invalid or unreadable"
    ],
    symptoms: [
      "File size is 0 bytes (zero-byte corruption)",
      "Opening the file causes the application to freeze or crash with memory access violations",
      "Images display bottom half as solid gray or multicolored artifacts",
      "Audio or video files stop playing abruptly midway"
    ],
    diagnosticFlow: {
      problemStatement: "Application reports file corruption or unexpectedly crashes during parsing.",
      analysisTechnique: "Check for zero-byte size, verify header magic bytes, check for required trailer/EOF markers, and calculate SHA-256 integrity hash.",
      identifiedRootCause: "Truncated download, storage drive bit rot, or application crash during write operation.",
      recommendedResolution: "If header is missing but body intact, repair header; if checksum matches official distributor, re-download; if 0 bytes, recover from backup."
    },
    whyItHappens: [
      {
        cause: "Interrupted File Transfers",
        explanation: "Network drops or disconnecting USB drives before cache flushing leaves files without essential ending markers (e.g. missing %%EOF on PDF or missing Central Directory on ZIP)."
      },
      {
        cause: "Storage Drive Bit Rot & Bad Sectors",
        explanation: "Failing SSD flash cells or magnetic hard drive platter degradation corrupt individual data sectors, altering binary checksums."
      },
      {
        cause: "Application Crashes During File Save",
        explanation: "If an app crashes while saving, the temporary file may overwrite the original with an incomplete byte stream."
      }
    ],
    howToConfirm: [
      {
        method: "Integrity & Hash Verification via AnyFileX",
        steps: [
          "Load the file into the AnyFileX File Analyzer.",
          "Check the 'Header Integrity' test and the 'Truncation Detection' flag.",
          "Generate SHA-256 and MD5 hashes via the Checksum Verifier."
        ],
        whatToLookFor: "Whether the file possesses intact start and end markers, or if it is truncated to 0 bytes."
      },
      {
        method: "Checksum Comparison",
        steps: [
          "Obtain the official SHA-256 hash from the download provider.",
          "Paste the hash into AnyFileX Checksum Verifier alongside your downloaded file."
        ],
        whatToLookFor: "A green 'Hashes Match' confirmation indicating 100% bit-for-bit integrity."
      }
    ],
    osWorkflows: [
      {
        os: 'all',
        title: 'Standard File Integrity Audit Checklist',
        instructions: [
          "Check File Size: If 0 bytes, the data is completely missing and cannot be repaired.",
          "Check Magic Bytes: Verify if the file starts with the correct signature bytes.",
          "Check File Trailer: Verify if container-specific closing markers exist (e.g. `50 4B 05 06` for ZIP, `%%EOF` for PDF).",
          "Test Alternative Parsers: Open the file in robust fault-tolerant software (such as VLC for video or 7-Zip for archives)."
        ]
      }
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        "SHA-256 / MD5 cryptographic integrity checksum calculated.",
        "Structural container headers and tail markers analyzed for byte truncation.",
        "File size verified against standard non-zero allocation thresholds."
      ],
      antivirusDistinction: "Integrity verification confirms whether file bytes are intact and match expected formats. It does not scan for malicious payload execution."
    },
    connectedTools: [
      {
        name: 'File Analyzer & Integrity Engine',
        description: 'Inspect raw container bytes, header health, and truncation status.',
        route: { view: 'file-analyzer' },
        iconType: 'analyzer',
        primary: true
      },
      {
        name: 'Checksum & Hash Verifier',
        description: 'Compute and verify SHA-256, MD5, and SHA-1 checksums instantly.',
        route: { view: 'checksum-verifier' },
        iconType: 'checksum'
      },
      {
        name: 'Repair Center',
        description: 'Explore step-by-step repair guides for ZIP, PDF, HEIC, PSD, and DWG.',
        route: { view: 'repair' },
        iconType: 'open'
      }
    ],
    relatedExtensions: ['zip', 'pdf', 'mp4', 'docx', 'psd', 'dwg', 'heic'],
    relatedGuideIds: ['why-zip-file-not-opening', 'why-pdf-not-opening', 'why-wont-my-file-open'],
    faqs: [
      {
        question: "Can a 0-byte file be recovered?",
        answer: "No. A file showing 0 bytes contains zero data blocks on disk. You must recover it from a backup, cloud revision history, or re-download the source file."
      },
      {
        question: "What is a CRC error?",
        answer: "A Cyclic Redundancy Check (CRC) error means the mathematical checksum calculated from the extracted data does not match the checksum stored in the file header, indicating corrupted bits."
      }
    ]
  },
  {
    id: 'why-zip-file-not-opening',
    title: "Why Is My ZIP File Not Opening? Causes & Repair Solutions",
    subtitle: "Troubleshoot 'Unexpected end of archive', CRC mismatch, invalid compressed folders, and corrupted central directory headers.",
    category: 'Archives',
    problemSummary: "ZIP files require three distinct structural components: local file headers, compressed data blocks, and the End of Central Directory (EOCD) record at the very end of the file. If a download cuts off or a byte shifts, standard archive utilities refuse to extract files.",
    commonErrorMessages: [
      "The compressed (zipped) folder is invalid or corrupted",
      "Unexpected end of archive",
      "CRC failed in encrypted file (wrong password?)",
      "Cannot open file: it does not appear to be a valid archive",
      "Archive is corrupted or incomplete"
    ],
    symptoms: [
      "Windows Built-in zip extraction hangs at 99% or throws an error dialog",
      "Archive opens but shows empty folder despite having a large file size",
      "7-Zip or WinRAR displays red CRC failure banner during decompression"
    ],
    diagnosticFlow: {
      problemStatement: "Operating system refuses to unzip archive or reports an invalid compressed folder.",
      analysisTechnique: "Inspect the final 22-64 bytes for the End of Central Directory signature (50 4B 05 06) and local file headers (50 4B 03 04).",
      identifiedRootCause: "Truncated download missing the EOCD record or CRC corruption in individual compressed member streams.",
      recommendedResolution: "Use 7-Zip CLI force-extract or WinRAR built-in archive repair to rebuild the Central Directory."
    },
    whyItHappens: [
      {
        cause: "Missing End of Central Directory (EOCD)",
        explanation: "ZIP archives store the master file catalog at the very end of the file (bytes `50 4B 05 06`). If a download stops even 1 KB before the end, standard unzippers cannot locate the file index."
      },
      {
        cause: "Non-Standard Compression Methods (e.g. Deflate64 / Zstandard)",
        explanation: "Native Windows File Explorer only supports standard DEFLATE (compression method 8). Archives compressed with newer algorithms fail in Windows Explorer."
      },
      {
        cause: "Multi-Part Archive Missing Volume",
        explanation: "If the file is part of a split archive (.z01, .z02, .zip), attempting to extract without all companion volumes triggers an archive error."
      }
    ],
    howToConfirm: [
      {
        method: "AnyFileX Binary Header & Trailer Audit",
        steps: [
          "Load the .zip file into the AnyFileX File Analyzer.",
          "Verify the magic bytes at offset 0 (must be `50 4B 03 04` or `50 4B 05 06`).",
          "Check the trailer status to confirm whether the End of Central Directory record is present."
        ],
        whatToLookFor: "Confirmation that the ZIP header exists, indicating whether the archive is intact or truncated."
      }
    ],
    osWorkflows: [
      {
        os: 'windows',
        title: 'Step-by-Step ZIP Recovery on Windows',
        instructions: [
          "Install the free open-source 7-Zip utility (https://7-zip.org).",
          "Right-click the broken ZIP file > 7-Zip > 'Extract to [folder name]'.",
          "7-Zip is far more fault-tolerant than Windows Explorer and can extract all uncorrupted files even if the central directory is damaged.",
          "If using WinRAR: Open WinRAR, select the file > Tools > Repair archive (Alt + R) > Treat as ZIP."
        ]
      },
      {
        os: 'mac',
        title: 'Step-by-Step ZIP Recovery on macOS',
        instructions: [
          "If Archive Utility fails with 'Error 1 - Operation not permitted', open Terminal.",
          "Type `unzip -q ` and drag the ZIP file into Terminal, then press Return.",
          "If damaged, use The Unarchiver (free on Mac App Store) to bypass corrupted headers."
        ]
      },
      {
        os: 'linux',
        title: 'Step-by-Step ZIP Recovery on Linux',
        instructions: [
          "Run `zip -FF broken.zip --out repaired.zip` in terminal to reconstruct the archive catalog.",
          "Extract repaired archive: `unzip repaired.zip`."
        ]
      }
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        "Verified PK zip header signature (`50 4B 03 04`).",
        "Checked for End of Central Directory record (`50 4B 05 06`).",
        "Scanned for directory traversal exploits (Zip Slip vulnerabilities)."
      ],
      antivirusDistinction: "Archive integrity verification checks file structure only. It does not inspect uncompressed executables inside the archive for malware."
    },
    connectedTools: [
      {
        name: 'Archive & Binary Analyzer',
        description: 'Verify ZIP magic bytes, header integrity, and detect file truncation.',
        route: { view: 'file-analyzer' },
        iconType: 'analyzer',
        primary: true
      },
      {
        name: 'ZIP Repair Guide',
        description: 'Detailed command line and GUI walkthroughs to recover broken archives.',
        route: { view: 'repair-detail', id: 'corrupted-zip' },
        iconType: 'open'
      },
      {
        name: 'Checksum Verifier',
        description: 'Verify if your downloaded ZIP matches the distributor SHA-256 hash.',
        route: { view: 'checksum-verifier' },
        iconType: 'checksum'
      }
    ],
    relatedExtensions: ['zip', 'rar', '7z', 'tar.gz', 'iso'],
    relatedGuideIds: ['how-to-check-corrupted-file', 'why-wont-my-file-open'],
    faqs: [
      {
        question: "Why does Windows say 'The compressed folder is invalid'?",
        answer: "Windows built-in ZIP handler is strict: if the file was compressed with BZIP2, LZMA, or if the download was truncated by even a single byte, Windows refuses to open it. Free tools like 7-Zip can extract the intact files."
      },
      {
        question: "Can I repair a ZIP file if the download was interrupted?",
        answer: "If the initial files were downloaded before the cut-off, tools like 7-Zip or command-line `zip -FF` can salvage all files up to the point of interruption."
      }
    ]
  },
  {
    id: 'why-pdf-not-opening',
    title: "Why Is My PDF Not Opening? Diagnostic & Repair Guide",
    subtitle: "Fix corrupted PDF documents, damaged %PDF- headers, missing EOF trailers, and browser PDF viewer crashes.",
    category: 'Documents',
    problemSummary: "PDF files are structured document streams with precise byte offsets indexed in a Cross-Reference (XREF) table. If a PDF lacks the `%PDF-` header signature, has broken XREF offsets, or contains unsupported DRM security permissions, standard PDF readers will refuse to open it.",
    commonErrorMessages: [
      "Adobe Acrobat could not open 'filename' because it is either not a supported file type or because the file has been damaged",
      "Failed to load PDF document",
      "The file is damaged and could not be repaired (error 14)",
      "This document is password protected or encrypted"
    ],
    symptoms: [
      "Browser displays black screen or 'Failed to load PDF document'",
      "Adobe Acrobat or Reader displays error dialog upon opening",
      "PDF opens but renders blank white pages for all content"
    ],
    diagnosticFlow: {
      problemStatement: "PDF reader refuses to display document or crashes during rendering.",
      analysisTechnique: "Check for `%PDF-1.x` magic bytes at byte offset 0 and verify the `%%EOF` marker in the trailer.",
      identifiedRootCause: "Broken XREF table, web server returning HTML error page disguised as PDF, or missing EOF marker.",
      recommendedResolution: "Open in a fault-tolerant PDF engine (like Google Chrome or Firefox) to auto-rebuild the XREF table, or transcode to clean PDF."
    },
    whyItHappens: [
      {
        cause: "Web Server Error Disguised as PDF",
        explanation: "When a portal requires login, clicking 'Download PDF' often downloads an HTML login or 403 Forbidden page named 'document.pdf'. The file contains HTML (`<!DOCTYPE html>`) instead of PDF binary data."
      },
      {
        cause: "Damaged Cross-Reference (XREF) Table",
        explanation: "PDFs use an XREF table to pinpoint the exact byte location of every page and font. Modifying a PDF in a text editor breaks byte offsets."
      },
      {
        cause: "Truncated %%EOF Trailer",
        explanation: "If a PDF download stops early, the closing `%%EOF` tag is missing, causing strict readers like Acrobat to reject the file."
      }
    ],
    howToConfirm: [
      {
        method: "AnyFileX PDF Header & Signature Check",
        steps: [
          "Drop the PDF into the AnyFileX File Analyzer.",
          "Check whether the file begins with `%PDF-` (hex `25 50 44 46`).",
          "If the analyzer detects HTML tags (`<html` or `<!DOCTYPE`), the file is an error webpage, not a true PDF."
        ],
        whatToLookFor: "Verification of true `%PDF-` signature vs an HTML error page."
      }
    ],
    osWorkflows: [
      {
        os: 'all',
        title: 'Universal PDF Recovery Workflow',
        instructions: [
          "Test in Modern Web Browser: Drag the PDF directly into Google Chrome, Microsoft Edge, or Mozilla Firefox. Web browsers use resilient PDF rendering engines (PDFium / PDF.js) that automatically reconstruct broken XREF tables.",
          "Print to PDF: If the browser displays the document, press Ctrl+P (or Cmd+P) > Select 'Save as PDF' or 'Microsoft Print to PDF' to generate a brand new, fully compliant PDF file.",
          "Use Ghostscript Command (Advanced): `gs -o repaired.pdf -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress damaged.pdf`."
        ]
      }
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        "Verified `%PDF-` binary magic bytes (ISO 32000-1 specification).",
        "Checked for trailer `%%EOF` boundary markers.",
        "Scanned for unauthorized embedded JavaScript actions."
      ],
      antivirusDistinction: "PDF structural validation confirms document syntax only. It does not execute embedded JavaScript or sandbox active forms."
    },
    connectedTools: [
      {
        name: 'PDF Analyzer & Inspector',
        description: 'Verify PDF version, header integrity, and detect fake HTML disguised as PDF.',
        route: { view: 'file-analyzer' },
        iconType: 'analyzer',
        primary: true
      },
      {
        name: 'PDF to Word & Image Converters',
        description: 'Extract pages or convert PDF to universally viewable image formats.',
        route: { view: 'converters' },
        iconType: 'converter'
      },
      {
        name: 'Metadata Viewer',
        description: 'Inspect author, creation date, and PDF generator software tags.',
        route: { view: 'metadata-viewer' },
        iconType: 'metadata'
      }
    ],
    relatedExtensions: ['pdf', 'docx', 'txt', 'epub', 'xps'],
    relatedGuideIds: ['how-to-check-corrupted-file', 'fix-file-wrong-extension', 'why-wont-my-file-open'],
    faqs: [
      {
        question: "Why does my downloaded PDF show an HTML error when opened?",
        answer: "If the download URL was behind an expired login session or paywall, the server delivered an HTML webpage (like 'Session Expired') saved with a .pdf filename. AnyFileX File Analyzer identifies this instantly."
      },
      {
        question: "How can I fix a damaged PDF for free?",
        answer: "Open the PDF in Google Chrome or Microsoft Edge. Modern browsers bypass broken XREF indexes. Once opened, press Print > Save as PDF to create a clean, repaired copy."
      }
    ]
  },
  {
    id: 'why-heic-not-opening',
    title: "Why Is My HEIC File Not Opening on Windows or PC?",
    subtitle: "Troubleshoot Apple iPhone High Efficiency Image Container (HEIC) incompatibility, missing HEVC codecs, and black screens.",
    category: 'Images',
    problemSummary: "Apple devices save photos in the High Efficiency Image Container (HEIC/HEIF) format using HEVC compression. Because Windows 10/11 does not include royalty-bearing HEVC codecs by default, the native Photos app displays an error or blank box.",
    commonErrorMessages: [
      "The HEVC Video Extension is required to display this file",
      "We can't open this file. It may be damaged or in a format Photos doesn't support",
      "Format not supported: .HEIC",
      "Windows Photo Viewer cannot open this picture"
    ],
    symptoms: [
      "iPhone photos transferred to Windows PC show generic blue mountain icon instead of thumbnail",
      "Double-clicking photo opens Windows Photos with a prompt to buy a $0.99 codec from Microsoft Store",
      "Photo editing software (Photoshop, Paint) refuses to import the file"
    ],
    diagnosticFlow: {
      problemStatement: "Windows PC cannot preview or open iPhone .HEIC photos.",
      analysisTechnique: "Verify `ftypheic` / `ftypmif1` container box signature at byte offset 4.",
      identifiedRootCause: "Windows OS lacks native HEIF image parser and HEVC video decoder codecs.",
      recommendedResolution: "Convert .HEIC to standard .JPG/.PNG locally in browser with AnyFileX, or install CopyTrans HEIC."
    },
    whyItHappens: [
      {
        cause: "Proprietary HEVC Licensing on Windows",
        explanation: "HEIC uses MPEG HEVC (H.265) compression, which requires patent licensing fees. Microsoft omitted the decoder from base Windows installations to reduce licensing costs."
      },
      {
        cause: "Transfer Settings on iPhone",
        explanation: "If iOS 'Transfer to Mac or PC' is set to 'Keep Originals', photos transfer as .HEIC instead of automatically converting to .JPG upon connection."
      }
    ],
    howToConfirm: [
      {
        method: "AnyFileX HEIC Header Verification",
        steps: [
          "Drop the file into AnyFileX File Analyzer.",
          "Check the container box signature (must display `ftypheic` or `ftypheix`)."
        ],
        whatToLookFor: "A confirmed HEIC image with 100% verified container headers."
      }
    ],
    osWorkflows: [
      {
        os: 'windows',
        title: 'Solutions for Opening HEIC on Windows 11 / 10',
        instructions: [
          "Option 1 (Instant & Free): Use the AnyFileX HEIC to JPG Converter to convert photos in your browser with zero data upload.",
          "Option 2 (System-Wide Thumbnails): Install 'CopyTrans HEIC for Windows' (free for personal use) to enable native Windows Explorer thumbnails and full photo viewer support.",
          "Option 3: Prevent future issues on iPhone by going to Settings > Photos > scroll down and set 'Transfer to Mac or PC' to 'Automatic'."
        ]
      }
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        "Verified ISO Base Media File Format (ISO/IEC 15444-12) container headers.",
        "Checked `ftyp` brand compatibility (`heic`, `heix`, `mif1`).",
        "Verified presence of EXIF and color profile atom records."
      ],
      antivirusDistinction: "HEIC structural container analysis confirms image header validity. It does not scan for firmware exploit payloads."
    },
    connectedTools: [
      {
        name: 'Instant HEIC to JPG Converter',
        description: 'Convert Apple HEIC photos to universal JPG/PNG in your browser with 0 upload.',
        route: { view: 'converter-detail', id: 'heic-to-jpg' },
        iconType: 'converter',
        primary: true
      },
      {
        name: 'HEIC Format Specs & Viewer Guide',
        description: 'Complete technical breakdown of HEIF/HEVC compression and compatibility.',
        route: { view: 'extension-detail', ext: 'heic' },
        iconType: 'open'
      },
      {
        name: 'HEIC vs JPG Comparison',
        description: 'Side-by-side technical benchmark of storage size, bit-depth, and quality.',
        route: { view: 'comparison-detail', slug: 'heic-vs-jpg' },
        iconType: 'signature'
      }
    ],
    relatedExtensions: ['heic', 'heif', 'jpg', 'png', 'webp', 'avif'],
    relatedGuideIds: ['why-wont-my-file-open', 'fix-file-wrong-extension'],
    faqs: [
      {
        question: "How do I convert HEIC to JPG on Windows without paying for Microsoft extensions?",
        answer: "Use AnyFileX's built-in HEIC to JPG converter. It processes the files entirely inside your browser's WebAssembly engine without uploading photos to external servers."
      },
      {
        question: "Why does my iPhone take photos in HEIC instead of JPG?",
        answer: "HEIC compresses images to roughly half the file size of JPEG while supporting 16-bit color and depth maps. You can switch to JPEG by going to Settings > Camera > Formats > Most Compatible."
      }
    ]
  },
  {
    id: 'wrong-mime-type-explained',
    title: "Why Does My File Have the Wrong MIME Type? Causes & Fixes",
    subtitle: "Understand Content-Type header mismatches, application/octet-stream fallbacks, and server configuration errors.",
    category: 'Universal',
    problemSummary: "MIME types (Multipurpose Internet Mail Extensions) tell web browsers and email clients how to handle digital media. When a web server serves an SVG as 'text/plain' or a WebP image as 'application/octet-stream', browsers download the file instead of displaying it.",
    commonErrorMessages: [
      "Resource interpreted as Document but transferred with MIME type application/octet-stream",
      "Refused to execute script because its MIME type ('text/plain') is not executable and strict MIME type checking is enabled",
      "Strict MIME type checking blocked resource",
      "Failed to load resource: net::ERR_CONTENT_TYPE_MISMATCH"
    ],
    symptoms: [
      "Browser downloads an image or video instead of playing it inline on the web page",
      "CSS stylesheets or JavaScript files fail to load with console security errors",
      "File upload form rejects valid files claiming 'Invalid MIME type'"
    ],
    diagnosticFlow: {
      problemStatement: "Web browser or API rejects file due to MIME type mismatch or triggers an unexpected download.",
      analysisTechnique: "Inspect the file's binary magic bytes and cross-reference with the IANA standard MIME registry.",
      identifiedRootCause: "Server misconfiguration (e.g. missing mime.types in Nginx/Apache) or browser relying on filename extension.",
      recommendedResolution: "Audit file with AnyFileX MIME Checker to identify official MIME string and update server configuration."
    },
    whyItHappens: [
      {
        cause: "Missing Server MIME Type Configuration",
        explanation: "If web servers (like Nginx, Apache, or AWS S3) do not have a modern MIME mapping for formats like `.avif`, `.webp`, or `.wasm`, they default to `application/octet-stream` (binary download)."
      },
      {
        cause: "Browser MIME Sniffing & X-Content-Type-Options: nosniff",
        explanation: "Modern browsers enforce strict MIME checking. If a server serves a script as `text/plain` with `nosniff` headers, the browser blocks execution."
      }
    ],
    howToConfirm: [
      {
        method: "AnyFileX MIME Checker",
        steps: [
          "Drop your file or enter your extension into the AnyFileX MIME Checker.",
          "View the authoritative IANA MIME type (e.g., `image/webp` for .webp)."
        ],
        whatToLookFor: "The correct RFC-compliant MIME string to configure in your server or upload validation code."
      }
    ],
    osWorkflows: [
      {
        os: 'all',
        title: 'Server-Side MIME Correction Protocol',
        instructions: [
          "Nginx: Add mapping to `/etc/nginx/mime.types` (e.g., `image/webp webp;`).",
          "Apache: Add directive to `.htaccess` (e.g., `AddType image/webp .webp`).",
          "AWS S3 / CloudFront: Update the `Content-Type` metadata property on the S3 object.",
          "Node.js / Express: Ensure `res.type('png')` or proper Content-Type headers are returned."
        ]
      }
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        "Cross-referenced binary magic bytes against official IANA media type database.",
        "Verified standard vs vendor-specific MIME prefixes (e.g. `application/x-` vs `application/`)."
      ],
      antivirusDistinction: "MIME analysis verifies media declaration syntax; it does not evaluate payload execution safety."
    },
    connectedTools: [
      {
        name: 'MIME Type Lookup & Validator',
        description: 'Explore the full database of 500+ MIME types with header samples.',
        route: { view: 'mime-checker' },
        iconType: 'signature',
        primary: true
      },
      {
        name: 'File Analyzer',
        description: 'Detect true binary MIME type vs browser-reported MIME string.',
        route: { view: 'file-analyzer' },
        iconType: 'analyzer'
      }
    ],
    relatedExtensions: ['webp', 'avif', 'svg', 'json', 'wasm', 'mkv', 'mp4'],
    relatedGuideIds: ['fix-file-wrong-extension', 'how-to-check-file-signature'],
    faqs: [
      {
        question: "What does application/octet-stream mean?",
        answer: "It is the universal generic binary MIME type. It tells browsers: 'This is an arbitrary stream of bytes; do not render it in the browser, download it to disk instead.'"
      }
    ]
  },
  {
    id: 'how-to-check-file-signature',
    title: "How to Check a File Signature (Magic Bytes & Headers)",
    subtitle: "A practical guide to reading hexadecimal headers, understanding file offsets, and verifying binary authenticity.",
    category: 'Universal',
    problemSummary: "Every standardized file format embeds unique identification bytes at specific byte offsets (usually byte 0x00). Learning to read magic bytes enables instant format verification, forensics, and fraud detection without relying on untrustworthy filename extensions.",
    commonErrorMessages: [
      "Invalid magic number or unrecognized file header",
      "Corrupted magic byte sequence",
      "Bad magic number in superblock"
    ],
    symptoms: [
      "File analyzer reports unknown signature or unrecognized byte sequence",
      "Security audit flags executable file disguised as innocent document"
    ],
    diagnosticFlow: {
      problemStatement: "Need to verify the authentic technical structure of a file beyond its filename.",
      analysisTechnique: "Read the first 16 to 64 bytes in hexadecimal format and look up known magic byte sequences.",
      identifiedRootCause: "File extension misrepresentation or binary container investigation.",
      recommendedResolution: "Inspect hex dump using AnyFileX Magic Byte Detector or terminal hex viewers."
    },
    whyItHappens: [
      {
        cause: "Why Formats Use Magic Bytes",
        explanation: "Operating systems and parsers need a deterministic way to verify file types before parsing memory blocks. Magic bytes provide instant, standardized verification."
      }
    ],
    howToConfirm: [
      {
        method: "AnyFileX Interactive Magic Byte Detector",
        steps: [
          "Open the AnyFileX Magic Byte Detector.",
          "Inspect the live 16-byte hex dump table (e.g. `89 50 4E 47 0D 0A 1A 0A` for PNG).",
          "Read ASCII representations alongside hexadecimal offsets."
        ],
        whatToLookFor: "Match against official signatures in the AnyFileX database."
      }
    ],
    osWorkflows: [
      {
        os: 'all',
        title: 'Command-Line Hex Inspection',
        instructions: [
          "macOS / Linux: Run `xxd -l 16 filename` or `hexdump -C -n 16 filename` in terminal.",
          "Windows PowerShell: Run `Format-Hex -Path filename -Count 16`."
        ]
      }
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        "Hexadecimal bytes verified against international file format specifications.",
        "Exact byte offsets documented (0x00, 0x04, 0x08, 0x18)."
      ],
      antivirusDistinction: "Magic byte inspection verifies header integrity; it does not evaluate payload behavior."
    },
    connectedTools: [
      {
        name: 'Magic Byte Detector',
        description: 'Search hundreds of hexadecimal signatures and inspect offsets.',
        route: { view: 'magic-byte-detector' },
        iconType: 'signature',
        primary: true
      },
      {
        name: 'File Analyzer',
        description: 'Drop any file to view its raw 128-byte hex matrix and ASCII dump.',
        route: { view: 'file-analyzer' },
        iconType: 'analyzer'
      }
    ],
    relatedExtensions: ['png', 'jpg', 'pdf', 'zip', 'gif', 'mp4', 'exe'],
    relatedGuideIds: ['how-to-identify-unknown-file', 'fix-file-wrong-extension', 'wrong-mime-type-explained'],
    faqs: [
      {
        question: "What are the most common file magic bytes?",
        answer: "PNG is `89 50 4E 47`, JPEG is `FF D8 FF`, PDF is `25 50 44 46` (%PDF), ZIP/DOCX/XLSX is `50 4B 03 04` (PK..), and GIF is `47 49 46 38` (GIF8)."
      }
    ]
  }
];

export function getTroubleshootingGuide(idOrSlug: string): TroubleshootingGuideItem {
  const clean = idOrSlug.toLowerCase().trim().replace(/^\//, '');
  const found = TROUBLESHOOTING_GUIDES.find(
    (g) => g.id === clean || g.id.replace(/-/g, '') === clean.replace(/-/g, '')
  );

  if (found) return found;

  // Fallback to first guide with normalized context
  return TROUBLESHOOTING_GUIDES[0];
}
