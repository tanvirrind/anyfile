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
  },
  {
    id: 'repair-corrupted-zip',
    title: 'How to Repair a Corrupted ZIP File (Without Installing Anything)',
    subtitle:
      'Corrupted ZIP file? Learn how to repair it step by step: WinRAR repair, re-download checks, and a no-install browser method for Windows and Mac.',
    category: 'Archives',
    problemSummary:
      'A corrupted ZIP file always shows up at the worst possible moment: the download you need for work, the backup of your photos, the project archive a client just sent. Before you assume the data is gone, work through this guide in order. Most "corrupted" ZIPs are not badly damaged at all — the most common cause is simply an incomplete download, which no repair tool can fix but a fresh download solves in minutes. The second most common cause is structural damage to the archive\'s headers, which repair tools handle well. This guide walks you from the quick checks (re-download, verify the file is really a ZIP) through WinRAR\'s built-in repair for severe cases, to a no-install browser method for when you cannot or do not want to install software.',
    commonErrorMessages: [
      'Unexpected end of archive',
      'The archive is either in unknown format or damaged',
      'Cannot open file: it does not appear to be a valid archive',
      'CRC failed in the encrypted file (wrong password?)',
      'End-of-central-directory signature not found',
    ],
    symptoms: [
      'Double-clicking the ZIP shows an error instead of the file list',
      'The archive opens but extraction fails partway through with a CRC or "unexpected end" error',
      'Only some files extract; others fail or come out as 0 bytes',
      'The ZIP is much smaller than you expected (a sign the download was cut short)',
      'The archive opens fine on one computer but not on another',
      'You are asked for a password on a ZIP you do not remember encrypting',
    ],
    diagnosticFlow: {
      problemStatement:
        'A ZIP archive will not open or extract correctly, and it is unclear whether the file is truly damaged, merely incomplete, mislabeled, or password-protected.',
      analysisTechnique:
        'Rule out the cheap explanations before attempting repair. First, check the file size against what you expected — a ZIP that is much smaller than advertised is almost certainly a truncated download, and repair tools cannot rebuild data that was never downloaded. Second, confirm the file is actually a ZIP by reading its magic bytes (its file signature) rather than trusting the extension: a download that failed can leave you with an HTML error page named .zip. Third, test whether the archive is a multi-part set with missing pieces — a lone .z01 or .zip.001 without its siblings will always fail. Only when the file is complete, correctly labeled, and still will not extract is a repair tool the right next step.',
      identifiedRootCause:
        'In most cases, an interrupted or incomplete download — the archive is missing its tail end, which is why "Unexpected end of archive" is the single most common error. When the download is complete, the next most likely culprit is structural damage to the archive\'s central directory (the index at the end of the ZIP that lists its contents), often caused by bad storage sectors, a USB drive removed mid-write, or antivirus software quarantining part of the file mid-download.',
      recommendedResolution:
        'If the file is incomplete, re-download it from the original source — preferably over a stable connection — and compare sizes. If the file is complete but structurally damaged, run WinRAR\'s Repair archive function (Tools menu, or Alt+R), making sure to treat the archive as ZIP; it rebuilds the headers and writes a new file named rebuilt.<original>.zip. For partial damage, extract with "Keep broken files" enabled to salvage whatever is intact. If you cannot install software, use an in-browser repair tool that rebuilds the archive headers locally on your device.',
    },
    whyItHappens: [
      {
        cause: 'Incomplete or interrupted download (most common)',
        explanation:
          'Downloads get cut short more often than people realize: a flaky Wi-Fi connection, a browser tab closed too early, a VPN dropping, or a server timing out. The result is a ZIP that is missing its end — and because a ZIP stores its central directory (the index of everything inside) at the very end of the file, a truncated archive usually refuses to open at all, or fails with "Unexpected end of archive." No repair tool can reconstruct file data that never arrived; the fix is a fresh, complete download. If the source offers a checksum (a hash value) for the download, compare it after re-downloading to confirm the file arrived intact.',
        technicalContext:
          'The central directory sits at the tail of a ZIP file. Truncation almost always destroys it first, which is why truncated archives typically fail at the "open" stage rather than mid-extraction.',
      },
      {
        cause: 'Damaged storage or interrupted writes',
        explanation:
          'Bad sectors on a hard drive, a USB stick pulled out while files were being copied, a phone running out of battery mid-transfer, or a cloud sync that only half-finished can all leave a ZIP with damaged bytes in the middle. Unlike a truncated download, these files are usually the right size — the damage is scattered, so some files inside extract fine while others fail with CRC errors. (A CRC error means the extracted data does not match the checksum stored when the file was archived — proof that bytes changed somewhere along the way.)',
      },
      {
        cause: 'Antivirus or security software interference',
        explanation:
          'Security software sometimes quarantines a file inside an archive while it is being downloaded or extracted, or blocks the archiver from writing temp files. The visible symptom is an extraction that fails mysteriously, or an archive that worked yesterday and does not today. If extraction fails on a file you trust, try temporarily pausing real-time protection for the extraction only — and re-enable it immediately after. Never disable protection to open an archive from an untrusted source.',
      },
      {
        cause: 'Multi-part archive with missing pieces',
        explanation:
          'Large archives are often split into parts (.zip.001, .zip.002, or .z01, .z02) for easier uploading. Every part must be present in the same folder before you open the first one — a single missing or renamed part makes the whole set unreadable, and the error looks exactly like corruption. Before repairing anything, check whether the sender split the archive and confirm you have all the pieces.',
      },
      {
        cause: 'The file is not really a ZIP',
        explanation:
          'A failed download sometimes saves an HTML error page ("404 Not Found", a login page) with a .zip filename. Email attachments can be mangled by encoding problems in transit. And occasionally a different archive format (RAR, 7Z) is simply renamed to .zip. In all these cases the "corruption" is a labeling problem, not damaged data — renaming it back or re-downloading correctly is the fix, and no repair tool will help. Checking the file\'s magic bytes tells you what the file truly is in seconds.',
      },
      {
        cause: 'Password protection mistaken for corruption',
        explanation:
          'An encrypted ZIP asks for a password before showing anything, and some archivers phrase this confusingly — a wrong or missing password can surface as a CRC failure ("CRC failed in the encrypted file") rather than a clear password prompt. If you see a CRC error specifically flagged as encrypted, stop and find the password: repair tools cannot and should not bypass encryption, and repeated guessing will not help.',
      },
    ],
    howToConfirm: [
      {
        method: 'Size check and fresh-download comparison',
        steps: [
          'Right-click the ZIP and check its size. Compare it against the size stated on the download page or in the sender\'s message.',
          'If the file is dramatically smaller than expected — or 0 bytes — it is incomplete. Re-download it; do not bother with repair tools.',
          'Re-download over a stable connection (wired if possible), ideally from the original source rather than a mirror.',
          'If the source publishes a checksum (MD5, SHA-1, or SHA-256 hash), verify the new download against it before extracting.',
        ],
        whatToLookFor:
          'A size mismatch means truncation — re-download. A matching size with extraction failures means real structural damage — proceed to repair.',
      },
      {
        method: 'Verify the file is genuinely a ZIP',
        steps: [
          'Use AnyFileX\'s free in-browser file identifier to read the file\'s magic bytes — the signature at the start of the file. Nothing is uploaded; the check runs on your device.',
          'If the signature says HTML, text, RAR, or 7Z instead of ZIP, the extension is the problem, not the data.',
          'An HTML signature means a failed download saved an error page — open it in a text editor to see the actual error message, then re-download correctly.',
          'A RAR or 7Z signature means the file was misnamed — rename it to the correct extension and open it with the matching archiver.',
        ],
        whatToLookFor:
          'A non-ZIP signature means relabel or re-download, not repair. Only a genuine ZIP signature with extraction failures warrants a repair attempt.',
      },
      {
        method: 'Test the archive structure before repairing',
        steps: [
          'Open the archive in 7-Zip (free) or WinRAR and use the built-in test function to list which entries are damaged.',
          'Check whether the archive is part of a split set: look for sibling files like .z01, .zip.001 in the same folder.',
          'Note exactly which files fail — if only one file inside fails with a CRC error while the rest extract, the damage is localized and partial extraction will save the rest.',
        ],
        whatToLookFor:
          'Localized damage (one bad entry) favors partial extraction; global failure to even list contents favors a full header repair.',
      },
    ],
    osWorkflows: [
      {
        os: 'windows',
        title: 'Windows: repair with WinRAR (best for severe damage)',
        instructions: [
          'Open WinRAR and navigate to the folder containing the corrupted ZIP (or right-click the file and open it with WinRAR).',
          'Select the corrupted archive in the WinRAR file list.',
          'Go to the Tools menu and choose "Repair archive" (or press Alt+R).',
          'In the dialog, set "Archive type" to "Treat the corrupt archive as ZIP" — do not leave it on RAR for a ZIP file.',
          'Choose the folder where the repaired archive should be saved, then click OK.',
          'Wait for the repair to finish. WinRAR rebuilds the archive structure and writes a new file named rebuilt.<originalname>.zip in the folder you chose.',
          'Open the rebuilt file and extract it. Depending on the damage, recovery may be complete or partial.',
          'If extraction still fails on individual files, re-open the rebuilt archive and extract with the "Keep broken files" option enabled (in the extraction dialog under Miscellaneous) to salvage everything that is intact.',
        ],
        tips:
          'WinRAR is paid software but the trial handles repairs fine. 7-Zip is a completely free alternative for opening and testing archives, though it has no dedicated repair function — for 7-Zip, the practical fallback is partial extraction of the undamaged entries.',
      },
      {
        os: 'mac',
        title: 'macOS: repair options without a Windows machine',
        instructions: [
          'First, rule out the easy causes: re-download the file and confirm it is a genuine ZIP using the magic-byte check above.',
          'The built-in Archive Utility cannot repair archives, so install a third-party archiver: 7-Zip is not native to macOS, but the free apps Keka and The Unarchiver open ZIPs reliably for testing.',
          'For a real repair on macOS, download RAR for macOS from rarlab.com, open Terminal, and run the command-line repair: drag the rar program into the Terminal window, type "r", drop the corrupted archive into the window, then type the destination folder path and press Return. The tool scans the archive and builds a repaired copy.',
          'If the archive opens but some entries fail, extract with a tool that keeps partial results rather than aborting on the first error.',
          'When none of the desktop options are available, use the no-install browser method below — it works identically on macOS.',
        ],
        tips:
          'macOS quarantines files downloaded from the internet; if extraction fails with permission errors rather than corruption errors, right-click the ZIP and check for quarantine flags before assuming damage.',
      },
      {
        os: 'all',
        title: 'All platforms: no-install browser repair and partial salvage',
        instructions: [
          'Re-download the archive first if there is any chance the download was interrupted — repair cannot replace missing bytes.',
          'Open AnyFileX\'s in-browser archive repair tool and drop the ZIP in. The repair runs entirely on your device — the file is never uploaded to a server, which matters when the archive contains private documents.',
          'The tool rebuilds the archive\'s central directory headers from the intact local file headers and gives you a repaired archive to download.',
          'Try extracting the repaired archive. Files whose compressed data survived will extract normally.',
          'For archives where only a few entries are damaged, use the "Keep broken files" approach: extract everything, let the damaged entries fail, and keep the intact ones. A partial recovery beats starting over.',
          'If the archive is password-protected and you do not have the password, stop here — no legitimate repair tool bypasses encryption.',
          'When nothing works and the data matters, go back to the source and ask for a fresh copy or a different transfer method (cloud link instead of email attachment, for example).',
        ],
        tips:
          'Browser-based repair fixes structural damage (broken headers and indexes). It cannot recover file content that was never downloaded or was overwritten — set expectations accordingly: headers yes, missing bytes no.',
      },
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        'Magic-bytes signature check confirms whether the file is genuinely a ZIP archive or a mislabeled HTML page, RAR, or 7Z file.',
        'File-size plausibility check flags truncated downloads before any repair is attempted.',
        'Archive test listing identifies exactly which entries are damaged, so repair effort targets the real problem.',
      ],
      antivirusDistinction:
        'These are structural integrity checks — they verify the archive\'s headers, indexes, and checksums. They do not scan for malware. A repaired archive from an untrusted source should still be scanned by your antivirus before you open the files inside it, and repair tools should only be downloaded from their official sites (rarlab.com for WinRAR/RAR).',
    },
    connectedTools: [
      {
        name: 'File Identifier',
        description:
          'Reads the file\'s magic bytes entirely in your browser (no upload) and reports what the file truly is — confirms whether your "ZIP" is really a ZIP or a mislabeled HTML error page, RAR, or 7Z file.',
        route: { view: 'file-analyzer' },
        iconType: 'analyzer',
        primary: true,
      },
    ],
    relatedExtensions: ['zip', 'rar', '7z'],
    relatedGuideIds: [
      'why-zip-file-not-opening',
      'how-to-check-corrupted-file',
      'how-to-identify-unknown-file',
    ],
    faqs: [
      {
        question: 'Can a corrupted ZIP file be repaired without WinRAR?',
        answer:
          'Yes. Start with a re-download, since most "corruption" is really an incomplete download. For genuine structural damage, an in-browser repair tool can rebuild the archive headers with nothing to install — the file never leaves your device. WinRAR\'s Repair archive function remains the strongest option for severe damage on Windows, and 7-Zip is a free alternative for testing and partial extraction.',
      },
      {
        question: 'What does "Unexpected end of archive" mean?',
        answer:
          'It means the archive is cut short — the file ends before the ZIP\'s central directory (its index of contents) appears. This is the classic signature of an interrupted download. Re-download the file completely; repair tools cannot invent the missing bytes.',
      },
      {
        question: 'Will repairing a ZIP file delete any of my data?',
        answer:
          'No — repair tools work on a copy. WinRAR writes a new file named rebuilt.<originalname>.zip and leaves your original untouched. Browser-based tools likewise produce a new repaired download. Your original file is never modified, so there is no risk in trying.',
      },
      {
        question: 'Can I repair a password-protected ZIP without the password?',
        answer:
          'No, and you should be suspicious of any tool that claims otherwise. Encryption is doing its job when the contents stay locked. Repair tools fix damaged archive structure; they do not bypass passwords. Find the password first, then repair if needed.',
      },
      {
        question: 'Why does my ZIP open on one computer but not another?',
        answer:
          'Usually one of three things: the two computers have different copies of the file (one download was truncated), one archiver is stricter about minor header damage than the other, or security software on one machine is interfering. Copy the exact same file to both machines and test — if it fails identically, the file is the problem; if not, the software or system is.',
      },
    ],
  };,
  {
    id: 'pdf-wont-open',
    title: "PDF Won't Open? How to Diagnose and Fix It",
    subtitle:
      "PDF won't open? Diagnose it in minutes — reader, download, password, or real corruption — then apply the matching fix. No guesswork.",
    category: 'Documents',
    problemSummary:
      'A PDF that will not open is maddening because the error messages are vague: "could not open," "file is damaged," "not a supported file type." Most guides respond by telling you to download their repair software. Do not start there. In the majority of cases the file is perfectly fine and the problem is something simpler — a broken reader installation, an incomplete download, a password prompt disguised as an error, or a file that was never a PDF to begin with. This guide gives you a diagnosis ladder: six quick tests, ordered from most to least likely, that pinpoint the actual cause in a few minutes. You will learn how to tell a reader problem from a file problem in under a minute, how to verify a download actually completed, and how to confirm a file is genuinely a PDF before you trust any error message about it. Only at the end, if the file is genuinely corrupted, do we talk about repair — including a private in-browser option for documents you would rather not upload anywhere.',
    commonErrorMessages: [
      'Adobe Acrobat Reader could not open file because it is either not a supported file type or because the file has been damaged',
      'There was an error opening this document. The file is damaged and could not be repaired',
      'Adobe Reader cannot open file because it is not a valid PDF document',
      'Failed to load PDF document',
      'This file is password protected. Please enter the password',
    ],
    symptoms: [
      'Double-clicking the PDF does nothing, or shows a generic error',
      'The PDF opens in your browser but not in Adobe Reader (or vice versa)',
      'The file opens but pages are blank, garbled, or cut off halfway',
      'You get a "damaged" or "not a supported file type" message immediately',
      'The PDF worked last week and now refuses to open',
      'A password prompt appears on a document you do not remember protecting',
      'The file size looks wrong — 0 bytes, or far smaller than the sender described',
      'Other PDFs open normally, so the problem is clearly this one file',
    ],
    diagnosticFlow: {
      problemStatement:
        'A PDF file will not open, and the error message does not make clear whether the reader software, the download, a password, or genuine file corruption is at fault.',
      analysisTechnique:
        'Work the ladder from the outside in. First, isolate the reader: open the same PDF in a different reader — your web browser is the fastest test, since Chrome, Edge, and Firefox all render PDFs natively. If it opens in the browser, the file is fine and your desktop reader is the problem. Second, check the download: compare the file size with what you expected and re-download from the original source if anything looks off — an interrupted download is the most common source of genuinely broken PDFs. Third, read any prompt literally: a password dialog means encryption, not corruption. Fourth, check for a zero-byte file (nothing to repair — re-download). Fifth, verify the file is actually a PDF by checking that it begins with the %PDF- marker or by reading its magic bytes; a failed download often saves an HTML error page with a .pdf name. Sixth, consider provenance: PDFs transferred as email attachments are disproportionately affected by encoding damage in transit, so a file that arrived by email deserves extra suspicion. Only if all of these tests point to a real PDF that is complete yet unreadable should you attempt repair.',
      identifiedRootCause:
        'Most often, the reader software itself — an outdated, half-updated, or corrupted Adobe Reader installation fails on files that are perfectly valid. Adobe\'s own support path for this starts with updating Reader and running Help > Repair Installation, which tells you how common reader-side breakage is. The second most common cause is an incomplete or email-mangled download rather than true corruption.',
      recommendedResolution:
        'Match the fix to the rung of the ladder where the failure appeared: repair or reinstall the reader (Help > Repair Installation in Adobe Reader) when other readers open the file fine; re-download from the original source when the file is truncated or zero bytes; enter the password (or ask the sender) when encryption is confirmed; and for a complete, genuine PDF that still will not render, try a different reader first, restore a previous version of the file if your system kept one, and only then attempt repair — including an in-browser repair tool that never uploads your document.',
    },
    whyItHappens: [
      {
        cause: 'Broken or outdated reader installation (most common)',
        explanation:
          'Adobe Reader is a large, frequently updated program, and updates sometimes go wrong — leaving an installation that crashes on launch or rejects valid files. The telltale sign: the same PDF opens fine in your browser or another reader, but not in Adobe. Reader can also break silently after an operating system update changes shared components it depends on. Adobe\'s own recommended fix is telling: open Reader, go to Help, and choose Repair Installation, which restores damaged or missing program components without touching your documents. If repair does not help, updating to the latest version or doing a clean reinstall usually does. This cause is so common that "try a different reader" should always be your first test, not your last resort — it takes thirty seconds and eliminates the most likely culprit immediately.',
      },
      {
        cause: 'Incomplete or interrupted download',
        explanation:
          'A PDF that stopped downloading halfway is missing its ending — and PDF readers need the file\'s cross-reference table, which lives near the end, to render anything. The reader reports this as "damaged," which is technically true but misleading: the file was never whole. Check the file size against the expected size (a 0-byte file is the extreme case — there is nothing to repair), then re-download from the original source over a stable connection. If the PDF came from cloud storage and the original was deleted or moved, re-download it fresh rather than trusting a cached copy.',
      },
      {
        cause: 'The file was never a PDF',
        explanation:
          'This one fools everyone. A download that failed can save a "404 Not Found" or login page as an HTML file named .pdf. Email attachments can be damaged by encoding problems in transit, arriving as garbage that no reader recognizes. And sometimes a different document type is simply misnamed. A genuine PDF always begins with the characters %PDF- — you can verify this by opening the file in a plain text editor like Notepad and reading the first line, or faster, by checking the file\'s magic bytes with an identifier tool. If the signature says HTML or text, the fix is a correct re-download, not a repair.',
      },
      {
        cause: 'Password protection mistaken for corruption',
        explanation:
          'An encrypted PDF demands its password before rendering a single page, and the prompt is not always obvious — some readers show a confusing error instead of a clean password dialog. If the file asks for credentials, or opens as a blank/garbled document in one reader but prompts in another, you are dealing with encryption, not damage. No repair tool removes a password you do not have; that is the encryption working as designed. Ask the sender for the password, check whether your organization uses a standard document password, and look for the password in the email or message the file arrived with.',
      },
      {
        cause: 'Genuine file corruption',
        explanation:
          'Real corruption does happen: bad sectors on a drive, a USB stick removed mid-copy, a crash while the file was being saved, or an email client stripping data during transfer. It also happens when a PDF is generated by buggy software — some scanners and print drivers produce files with malformed internal structure that strict readers reject. The signature is a complete, correctly-named PDF — right size, %PDF- header present — that still will not render in any reader, or renders with missing pages and garbled text. For these files, try opening in a more tolerant reader first (browsers and some third-party readers render damaged PDFs that make Adobe give up), restore a previous version via your operating system\'s file history if available, and only then consider a dedicated repair step. Keep your expectations honest here: repair tools rebuild broken document structure, but they cannot recreate page content whose bytes are gone.',
      },
      {
        cause: 'System-level issues: associations, permissions, interference',
        explanation:
          'Sometimes the PDF is fine and Windows is the problem: another program has hijacked the .pdf file association, the file sits in a folder your reader cannot access, or security software is blocking the reader from opening files from the internet. Symptoms that point here: no PDF opens at all (not just this one), or the reader launches and immediately closes. Fix the file association in Settings, move the file to your Documents folder and try again, and check whether antivirus is quarantining your reader\'s temp files.',
      },
    ],
    howToConfirm: [
      {
        method: 'The two-reader test',
        steps: [
          'Drag the problem PDF into your web browser (Chrome, Edge, or Firefox) — all three render PDFs natively with no plugins.',
          'If it opens in the browser, the file is fine: your desktop reader installation is broken. Repair or reinstall it.',
          'If it fails in the browser too, try one more independent reader (such as SumatraPDF or Foxit Reader) to be thorough.',
          'If no reader on the machine opens it, but the same readers open other PDFs normally, the problem is this specific file — move to the download check.',
        ],
        whatToLookFor:
          'Opens anywhere = reader problem. Fails everywhere while other PDFs work = file problem. Fails everywhere including healthy PDFs = system/reader problem.',
      },
      {
        method: 'Size, header, and true-type verification',
        steps: [
          'Check the file size: 0 bytes means an empty file — re-download, there is nothing to repair.',
          'Compare the size with the expected size from the source; a big shortfall means a truncated download.',
          'Open the file in Notepad or any plain text editor and read the very first characters: a real PDF starts with %PDF-.',
          'For a faster, more reliable check, run the file through AnyFileX\'s free in-browser file identifier, which reads the magic bytes and reports the true format with nothing uploaded.',
          'If the header says HTML or plain text, you downloaded an error page — open it in the text editor to read the actual error, then download correctly.',
        ],
        whatToLookFor:
          'A %PDF- header with a plausible size means a genuine PDF; anything else means a download or labeling problem, not corruption.',
      },
      {
        method: 'Password and provenance check',
        steps: [
          'Look carefully at the exact error or dialog: a password prompt, even a cryptic one, means encryption.',
          'Ask yourself where the file came from — banks, HR departments, and legal firms routinely password-protect documents.',
          'Search the email or message thread the file arrived in for a password; senders often include it separately.',
          'If a password exists and works, the "corruption" is solved. If no password can be found, no repair tool will help — contact the sender.',
        ],
        whatToLookFor:
          'Any credential prompt reframes the problem entirely: stop troubleshooting corruption and start hunting for the password.',
      },
    ],
    osWorkflows: [
      {
        os: 'windows',
        title: 'Windows: repair the reader before touching the file',
        instructions: [
          'Run the two-reader test above. If the PDF opens in your browser, the file is fine — fix the reader.',
          'Open Adobe Acrobat Reader, go to the Help menu, and choose "Repair Installation." This restores damaged or missing program components automatically.',
          'After the repair, check for updates (Help > Check for Updates) and install any pending ones — many "won\'t open" bugs are fixed versions behind.',
          'If repair does not help, uninstall Reader completely and reinstall the latest version from Adobe\'s official site.',
          'Right-click the problem PDF, choose "Restore previous versions," and see whether Windows kept an earlier, working copy.',
          'If double-clicking opens the wrong program, right-click the file > Open with > choose your preferred reader and tick "Always use this app."',
          'As a last resort for a genuinely damaged file, try opening it in your browser or a lightweight reader like SumatraPDF, which sometimes renders files Adobe rejects.',
        ],
        tips:
          'Do a reader repair before downloading any third-party "PDF fixer" — most of those are paid software funnels, and the built-in repair solves the most common case for free.',
      },
      {
        os: 'mac',
        title: 'macOS: Preview, Adobe, and the re-download',
        instructions: [
          'Try opening the PDF in Preview (double-click it). If Preview renders it but Adobe does not, your Adobe installation is the problem — update or reinstall Adobe Reader.',
          'If Preview also fails, the file itself is suspect: check its size and re-download it from the original source.',
          'Verify the file is a real PDF with the %PDF- header check or an in-browser magic-byte identifier.',
          'For a password-protected PDF, Preview will prompt for the password just like Adobe — find the password rather than troubleshooting further.',
          'Use Time Machine or iCloud version history to recover an earlier copy if the file was damaged by a crashed save.',
        ],
        tips:
          'Preview is surprisingly tolerant of minor PDF damage — a file that opens in Preview but not Adobe is almost never truly corrupted.',
      },
      {
        os: 'all',
        title: 'All platforms: the repair path for genuinely damaged PDFs',
        instructions: [
          'Confirm genuine damage first: the file has a %PDF- header, a plausible size, is not password-protected, and fails in every reader you try.',
          'Re-download from the original source anyway — it costs two minutes and fixes more "corruption" than any tool.',
          'Check for a previous version: Windows "Restore previous versions," macOS Time Machine, or your cloud drive\'s version history.',
          'Try a tolerant reader (your web browser is the easiest) — many partially damaged PDFs render well enough to read or print even when Adobe refuses them.',
          'For sensitive documents — contracts, medical records, financial statements — prefer an in-browser repair tool that processes the file on your device without uploading it anywhere.',
          'If the document is not sensitive, a desktop repair utility is the next step; get it from the vendor\'s official site, not a download aggregator.',
          'After any successful repair, save the recovered document under a new filename immediately — do not overwrite your only copy until you have confirmed every page renders.',
          'When nothing works, accept the verdict and go back to the source for a fresh copy — a PDF with destroyed content streams cannot be rebuilt from nothing.',
        ],
        tips:
          'Repair can fix broken structure (headers, cross-reference tables). It cannot restore pages whose content data is gone, and it cannot remove a password. Anyone promising otherwise is selling something.',
      },
    ],
    measurableSecurityNotes: {
      verifiedAspects: [
        'The %PDF- header check (or magic-byte identification) confirms whether the file is genuinely a PDF or a mislabeled HTML/text file.',
        'The two-reader test isolates reader-side breakage from file-side damage without modifying anything.',
        'File-size plausibility flags truncated downloads and zero-byte files before any repair is attempted.',
      ],
      antivirusDistinction:
        'These are structural checks — they verify what the file is and whether its container is intact. They do not scan for malware. PDFs can carry malicious scripts and embedded exploits, so a file from an untrusted source should be scanned by your antivirus even after it opens cleanly, and "repair" tools should only come from official vendor sites.',
    },
    connectedTools: [
      {
        name: 'File Identifier',
        description:
          'Reads the file\'s magic bytes entirely in your browser (no upload) and reports what the file truly is — confirms whether your "PDF" is really a PDF or a mislabeled HTML error page or text file.',
        route: { view: 'file-analyzer' },
        iconType: 'analyzer',
        primary: true,
      },
    ],
    relatedExtensions: ['pdf'],
    relatedGuideIds: [
      'why-pdf-not-opening',
      'how-to-check-corrupted-file',
      'why-wont-my-file-open',
    ],
    faqs: [
      {
        question: 'Why does my PDF open in Chrome but not in Adobe Reader?',
        answer:
          'Your Adobe Reader installation is broken or outdated — the file itself is fine. Run Help > Repair Installation inside Adobe Reader, then check for updates. If that fails, reinstall Reader from Adobe\'s official site. This is the single most common "PDF won\'t open" scenario.',
      },
      {
        question: 'What does "not a supported file type or file has been damaged" mean?',
        answer:
          'It is Adobe\'s generic way of saying "I cannot read this file\'s structure." The two usual causes: the file is not actually a PDF (check for the %PDF- header or verify its magic bytes), or the download was interrupted and the file is incomplete. Re-download from the original source before assuming corruption.',
      },
      {
        question: 'Can a PDF be repaired without uploading it to a website?',
        answer:
          'Yes. An in-browser repair tool processes the file locally on your device — nothing is sent to a server — which is the right choice for contracts, medical records, or financial documents. Desktop repair utilities are the alternative for non-sensitive files. Either way, repair fixes broken file structure; it cannot recover pages whose content is gone or remove a password.',
      },
      {
        question: 'The PDF asks for a password I don\'t have. Is it corrupted?',
        answer:
          'No — it is encrypted, which is a completely different situation. The file is working exactly as designed. No repair tool will open it without the password. Check the email or message the file arrived with, ask the sender, or check whether your organization uses a standard document password.',
      },
      {
        question: 'Should I download a PDF repair program?',
        answer:
          'Only as a last resort, and only from the vendor\'s official site. Most "PDF won\'t open" cases are solved by repairing your reader installation, updating it, re-downloading the file, or opening it in a different reader — all free. Paid repair software makes sense only for a genuinely damaged, irreplaceable document, and even then it cannot work miracles on destroyed content.',
      },
    ],
  };

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
