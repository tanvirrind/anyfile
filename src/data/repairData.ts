import { RepairGuide } from '../types';

export const REPAIR_GUIDES: RepairGuide[] = [
  {
    id: 'corrupted-zip',
    title: 'How to Repair Corrupted ZIP Archives & CRC Extraction Errors',
    extension: 'ZIP',
    category: 'Archive',
    symptoms: [
      'Unexpected end of archive error when opening ZIP file',
      'CRC failed in encrypted file or checksum mismatch error',
      'The compressed (zipped) folder is invalid or corrupted'
    ],
    causes: [
      'Incomplete download due to unstable network connection',
      'Bad sectors on storage drive or USB flash disk',
      'Corrupted Central Directory header block at end of ZIP structure'
    ],
    repairMethods: [
      {
        title: 'WinRAR Built-in Archive Repair Command',
        desc: 'Open WinRAR, navigate to damaged .zip file, select Tools > Repair archive (Alt+R), select Treat as ZIP archive.',
        toolName: 'WinRAR',
        difficulty: 'Easy'
      },
      {
        title: '7-Zip Command Line Force Extraction',
        desc: 'Run terminal command "7z x archive.zip -o/destination_folder" to bypass corrupted CRC checks and extract readable files.',
        toolName: '7-Zip CLI',
        difficulty: 'Intermediate'
      },
      {
        title: 'OpenAnyFile Central Header Reconstruction',
        desc: 'Drop corrupted ZIP file into OpenAnyFile Repair Tool to scan raw local file headers and regenerate missing Central Directory table.',
        toolName: 'OpenAnyFile ZIP Repair',
        difficulty: 'Easy'
      }
    ],
    recoveryTools: [
      { name: '7-Zip CLI', type: 'Free', link: 'https://7-zip.org' },
      { name: 'WinRAR Repair', type: 'Paid' },
      { name: 'Disk Drill Archive Recovery', type: 'Paid' }
    ],
    preventiveTips: [
      'Always use multi-part download managers for ZIP downloads larger than 1 GB.',
      'Create PAR2 parity recovery volumes alongside critical data archives.',
      'Never unplug USB flash drives while zip compression write is active.'
    ],
    faqs: [
      { question: 'Why does my ZIP file say "Unexpected end of archive"?', answer: 'This means the file download was cut off before writing the Central Directory table at the end of the ZIP file.' },
      { question: 'Can I extract files if the password block is corrupted?', answer: 'If header encryption metadata is damaged, you must repair the header before 7-Zip can prompt for password decryption.' }
    ]
  },
  {
    id: 'fix-heic',
    title: 'How to Repair Damaged HEIC Photos & Missing Header Atoms',
    extension: 'HEIC',
    category: 'Image',
    symptoms: [
      'iPhone photo shows grey preview box or fails to render',
      'Error message: "Format not supported" or "File header invalid"',
      'Image renders partially with green artifact stripes across bottom'
    ],
    causes: [
      'File transfer interrupt during iCloud sync or AirDrop transfer',
      'Storage card corruption on iPhone or iPad',
      'Missing ftypheic container atom block at byte offset 0'
    ],
    repairMethods: [
      {
        title: 'Force Re-sync from Original iCloud Photo Backup',
        desc: 'Log into icloud.com/photos on desktop web browser, select damaged photo, click "Download Original" button.',
        toolName: 'iCloud Web',
        difficulty: 'Easy'
      },
      {
        title: 'HEIF Atom Signature Patching',
        desc: 'Use OpenAnyFile Repair Tool to verify if 00 00 00 18 66 74 79 70 68 65 69 63 magic byte string was truncated.',
        toolName: 'OpenAnyFile HEIC Repair',
        difficulty: 'Easy'
      }
    ],
    recoveryTools: [
      { name: 'CopyTrans HEIC Doctor', type: 'Free' },
      { name: 'Stellar Photo Repair', type: 'Paid' }
    ],
    preventiveTips: [
      'Keep "Transfer Originals" enabled in iOS Settings > Photos.',
      'Avoid disconnecting lightning/USB cables during AirDrop photo transfers.'
    ],
    faqs: [
      { question: 'Can I recover photos that show solid green or gray boxes?', answer: 'If partial tile frames remain intact, photo repair tools can salvage top image portions or extract embedded JPEG previews.' }
    ]
  },
  {
    id: 'broken-psd',
    title: 'How to Fix Damaged Adobe Photoshop PSD Files & Missing Layers',
    extension: 'PSD',
    category: 'Image',
    symptoms: [
      'Error: "Could not complete request because it is not a valid Photoshop document"',
      'Photoshop freezes or crashes when loading PSD canvas',
      'All layers appear merged into a single corrupt white box'
    ],
    causes: [
      'System crash or power outage while Photoshop was saving .psd file',
      'Exceeding 2 GB file size limit for standard PSD format',
      'Corrupted 8BPS header signature or broken layer channel records'
    ],
    repairMethods: [
      {
        title: 'Check Photoshop AutoRecover Temp Directory',
        desc: 'Navigate to %AppData%\\Adobe\\Adobe Photoshop\\AutoRecover on Windows or ~/Library/Application Support/Adobe/Adobe Photoshop/AutoRecover on macOS to locate automatic recovery drafts.',
        toolName: 'Windows File Explorer',
        difficulty: 'Easy'
      },
      {
        title: 'Open in Photopea Web Canvas',
        desc: 'Drag broken .psd file into photopea.com. Photopea uses an alternative PSD parsing engine that frequently bypasses corrupt layer tags.',
        toolName: 'Photopea Browser Tool',
        difficulty: 'Easy'
      }
    ],
    recoveryTools: [
      { name: 'Photopea Web Editor', type: 'Free', link: 'https://photopea.com' },
      { name: 'PSD Repair Kit', type: 'Paid' }
    ],
    preventiveTips: [
      'Convert project file format to PSB (Photoshop Big) if project file exceeds 1.5 GB.',
      'Enable Photoshop Cloud Documents auto-versioning in Creative Cloud.'
    ],
    faqs: [
      { question: 'What is the AutoRecover directory path on Windows?', answer: 'C:\\Users\\[Username]\\AppData\\Roaming\\Adobe\\Adobe Photoshop [Version]\\AutoRecover' }
    ]
  },
  {
    id: 'damaged-dwg',
    title: 'How to Recover Corrupted AutoCAD DWG Drawings',
    extension: 'DWG',
    category: 'CAD',
    symptoms: [
      'AutoCAD error: "Drawing file is not valid"',
      'Fatal Error: Unhandled Access Violation when opening blueprint',
      'Drawing opens with missing blocks, layers, or corrupted objects'
    ],
    causes: [
      'AutoCAD crash during DWG write operation',
      'Network share disconnect while drawing was locked',
      'Version mismatch between AutoCAD 2024 and older DWG format structures'
    ],
    repairMethods: [
      {
        title: 'AutoCAD RECOVER & RECOVERALL Commands',
        desc: 'Launch AutoCAD, type RECOVER in command bar, select damaged DWG file. AutoCAD will audit and rebuild object drawing tables.',
        toolName: 'AutoCAD',
        difficulty: 'Intermediate'
      },
      {
        title: 'Import Drawing as External Reference (XREF)',
        desc: 'Create a fresh blank DWG drawing file, type XREF command, and attach broken .dwg as overlay block to extract geometry.',
        toolName: 'AutoCAD',
        difficulty: 'Intermediate'
      }
    ],
    recoveryTools: [
      { name: 'AutoCAD Built-in RECOVER', type: 'Paid' },
      { name: 'DWG Fix Toolbox', type: 'Paid' }
    ],
    preventiveTips: [
      'Set SAVETIME in AutoCAD to automatic 5-minute interval backups.',
      'Store drawing files on local SSD drive rather than raw network drives during editing.'
    ],
    faqs: [
      { question: 'Where are AutoCAD automatic BAK and SV$ backup files saved?', answer: 'Look in C:\\Users\\[User]\\AppData\\Local\\Temp for files ending in .sv$ or same directory as drawing for .bak files.' }
    ]
  }
];
