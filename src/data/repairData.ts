import { RepairGuide } from '../types';

const BASE_REPAIR_GUIDES: RepairGuide[] = [
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
        title: 'AnyFileX Central Header Reconstruction',
        desc: 'Drop corrupted ZIP file into AnyFileX Repair Tool to scan raw local file headers and regenerate missing Central Directory table.',
        toolName: 'AnyFileX ZIP Repair',
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
        desc: 'Use AnyFileX Repair Tool to verify if 00 00 00 18 66 74 79 70 68 65 69 63 magic byte string was truncated.',
        toolName: 'AnyFileX HEIC Repair',
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

const REPAIR_ENRICHMENTS: Record<string, Partial<RepairGuide>> = {
  'broken-psd': {
    symptoms: ['Recovered file opens but layer thumbnails are blank or incorrect', 'Text layers, masks, or smart objects disappear after loading'],
    causes: ['A PSD was saved after memory pressure or a plugin crash', 'A file was copied while Photoshop was still writing it'],
    repairMethods: [
      { title: 'Recover a flattened preview', desc: 'If the composite preview is readable, export it as a new image before attempting deeper layer recovery. This preserves visible artwork even when editable layers are damaged.', toolName: 'Photoshop or Photopea', difficulty: 'Easy' },
      { title: 'Test a copy in another PSD parser', desc: 'Open a duplicate in Photopea or GIMP. Different parsers may recover a readable composite or some layer records that the original application rejects.', toolName: 'Photopea or GIMP', difficulty: 'Intermediate' }
    ],
    preventiveTips: ['Keep layered masters in PSB when they approach the PSD size limit.', 'Use versioned backups and avoid saving over the only copy after a crash.', 'Package linked assets with the project when transferring it between machines.'],
    faqs: [
      { question: 'Can a PSD be repaired if Photoshop says it is not a valid document?', answer: 'Sometimes. First verify the 8BPS header, try a backup or AutoRecover copy, and test a duplicate in another PSD parser. Do not overwrite the damaged original.' },
      { question: 'Why are PSD layers missing after recovery?', answer: 'Layer records or channel data may be damaged even when the composite preview remains readable. A recovered flattened image may be possible, but the original editability may not be.' },
      { question: 'When should I use PSB instead of PSD?', answer: 'Use PSB for very large documents, especially when the file or canvas exceeds standard PSD limits. Keep a versioned copy before converting formats.' }
    ]
  },
  'damaged-dwg': {
    symptoms: ['Proxy objects display incorrectly or prevent editing', 'Hatches, external references, or annotation scales are missing', 'The drawing opens only after repeated audit prompts'],
    causes: ['Unresolved proxy objects from an unavailable vertical product', 'Drawing database errors accumulated after repeated saves', 'A network or synchronization tool created a partial file'],
    repairMethods: [
      { title: 'Run AUDIT and PURGE on a copy', desc: 'After opening a duplicate, run AUDIT to repair database errors and PURGE to remove unused objects. Review the command log and save to a new filename.', toolName: 'AutoCAD', difficulty: 'Intermediate' },
      { title: 'Recover from a BAK or SV$ file', desc: 'Compare the drawing with its .bak or autosave .sv$ copy. Rename only a verified backup copy to .dwg and retain the original evidence.', toolName: 'AutoCAD backups', difficulty: 'Easy' },
      { title: 'Export readable geometry', desc: 'If the drawing opens partially, export or copy healthy layers into a new drawing and document which objects could not be recovered.', toolName: 'AutoCAD or DraftSight', difficulty: 'Advanced' }
    ],
    preventiveTips: ['Keep DWG backups outside the active network synchronization folder.', 'Use the correct DWG version for collaborators and audit drawings before issuing them.', 'Package XREFs, fonts, plot styles, and custom objects with the drawing.'],
    faqs: [
      { question: 'Should I rename a DWG backup file to repair it?', answer: 'Only work on a copy of a verified .bak or .sv$ backup. Renaming does not repair a damaged database; it only lets a CAD program attempt to open the backup.' },
      { question: 'Why are objects missing after AutoCAD recovery?', answer: 'Recovery may discard invalid objects, unresolved proxies, or corrupted references. Compare against a backup and inspect the recovery log.' },
      { question: 'Can a PDF be used to rebuild a damaged DWG?', answer: 'A vector PDF can provide visual reference, but it usually does not restore the original layers, blocks, constraints, or editable CAD features.' }
    ]
  },
  'fix-heic': {
    symptoms: ['The photo has correct dimensions but displays as a gray or black canvas', 'Only an embedded preview appears while the full-resolution image fails', 'The file opens on one device but not another'],
    causes: ['An incomplete iCloud, AirDrop, USB, or messaging transfer', 'Unsupported HEVC or HEIF components on the viewing system', 'Damaged image items or metadata inside the HEIF container'],
    repairMethods: [
      { title: 'Recover the original from the source device', desc: 'Download the original from iCloud Photos or re-transfer it with a verified cable or export workflow. Compare file size and checksum when possible.', toolName: 'iCloud Photos or Apple Photos', difficulty: 'Easy' },
      { title: 'Extract a preview or transcode a readable image', desc: 'If a preview or image item remains readable, export it to JPG or PNG while keeping the original damaged file for further recovery.', toolName: 'AnyFileX or a HEIF tool', difficulty: 'Intermediate' },
      { title: 'Install the required decoder', desc: 'On Windows, verify HEIF and HEVC support before declaring the image corrupt. A missing codec can look like a damaged header.', toolName: 'Windows image extensions', difficulty: 'Easy' }
    ],
    preventiveTips: ['Keep an untouched original and a second backup before repairing or converting.', 'Use the source application’s export command instead of renaming HEIC to JPG.', 'Verify transfer completion before deleting the device copy.'],
    faqs: [
      { question: 'Is a HEIC photo always corrupt if Windows cannot open it?', answer: 'No. Windows may be missing HEIF or HEVC support. Confirm the decoder is installed and test the file in another compatible viewer before repairing it.' },
      { question: 'Can a damaged HEIC preview be recovered?', answer: 'Sometimes. Some HEIF files contain an embedded preview or separate image item that can be extracted even when the full-resolution item is damaged.' },
      { question: 'Should I rename HEIC to JPG?', answer: 'No. Renaming changes only the label and does not decode the HEIF container. Use a compatible converter or export from the original photo application.' }
    ]
  }
};

export const REPAIR_GUIDES: RepairGuide[] = BASE_REPAIR_GUIDES.map((guide) => ({
  ...guide,
  ...(REPAIR_ENRICHMENTS[guide.id] || {}),
  symptoms: [...guide.symptoms, ...(REPAIR_ENRICHMENTS[guide.id]?.symptoms || [])],
  causes: [...guide.causes, ...(REPAIR_ENRICHMENTS[guide.id]?.causes || [])],
  repairMethods: [...guide.repairMethods, ...(REPAIR_ENRICHMENTS[guide.id]?.repairMethods || [])],
  preventiveTips: [...guide.preventiveTips, ...(REPAIR_ENRICHMENTS[guide.id]?.preventiveTips || [])],
  faqs: [...guide.faqs, ...(REPAIR_ENRICHMENTS[guide.id]?.faqs || [])]
}));
