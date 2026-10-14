// Batch: 2 FileTypeInfo entries (2026-10-13) for the new how-to-open overrides.
// Imported and spread into POPULAR_FILE_TYPES in fileTypesData.ts.
import type { FileTypeInfo } from '../types';

export const FILE_TYPES_BATCH_OCT2026: FileTypeInfo[] = [
{
  extension: 'VCF',
  name: 'vCard Contact File',
  category: 'Contacts',
  description:
    'Plain-text vCard contact file — each .vcf holds one or more contact cards with names, phone numbers, emails, and addresses, readable in any text editor.',
  detailedOverview:
    "VCF is the file extension for vCard, the universal plain-text format for contact information standardized by the IETF (vCard 4.0 in RFC 6350; vCard 3.0 in RFC 2426). Each contact is a block of human-readable text between BEGIN:VCARD and END:VCARD markers, with properties like FN (full name), TEL (phone), EMAIL, ADR (address), ORG, and PHOTO. A single .vcf file can contain one contact or hundreds — it is the format phones, email clients, and address books use to exchange contacts, and the format QR-code business cards encode. Because the content is plain text, you can preview it safely in any text editor before importing anything.",
  mimeType: 'text/vcard',
  // NOTE: VCF is a text format with no binary magic-byte signature — identifier tools
  // recognize it by its BEGIN:VCARD text marker (same convention as the JSON/CSV entries).
  magicBytesHex: 'BEGIN:VCARD (Text marker)',
  typicalSize: '1 KB – 5 MB',
  dangerRating: 'Medium Risk',
  dangerExplanation:
    'A VCF is an address book — it can hold hundreds of people\u2019s names, phone numbers, and emails. Uploading one to an untrusted online viewer hands all of that data to a stranger\u2019s server. Preview and import VCF files locally, and treat unexpected ones like any unexpected attachment.',
  exampleUse: 'Contact exports from phones, email signature attachments, QR-code business cards, address book backups',
  developer: 'IETF (standards body); originally created by the Versit Consortium',
  osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
  popularApps: [
    { name: 'Google Contacts', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Google LLC', slug: 'google-contacts' },
    { name: 'Apple Contacts', os: ['mac'], isFree: true, developer: 'Apple Inc.', slug: 'apple-contacts' },
    { name: 'Mozilla Thunderbird', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Mozilla Foundation', slug: 'thunderbird' },
  ],
  openingSteps: [
    { title: 'Peek as plain text', desc: 'Open the file in Notepad, TextEdit, or a browser tab — read the contacts and count the BEGIN:VCARD blocks with zero import risk.' },
    { title: 'Import on your platform', desc: 'Google Contacts (Import menu), Apple Contacts (double-click or File > Import), or your phone\u2019s contacts app — choose the account or group that should receive the contacts first.' },
    { title: 'Verify the landing', desc: 'Search for a name you saw in the text peek and confirm the phone and email landed in the right account or list.' },
  ],
  conversions: [
    { targetExtension: 'CSV', description: 'Import the VCF into Google Contacts, then Export to CSV for a spreadsheet with proper columns — the reliable route for large contact lists.', difficulty: 'Easy', onlinePossible: true },
  ],
  repairTips: [
    'A genuine vCard starts each contact block with BEGIN:VCARD — files missing it are mislabeled or corrupt, so identify the true type first.',
    'Garbled non-Latin names usually come from an old 2.1/3.0 file decoded with the wrong encoding — import into a modern address book and re-export.',
    'For a file with unexpectedly many contacts, split the BEGIN:VCARD\u2026END:VCARD blocks you want into a new file in a text editor before importing.',
  ],
  faqs: [
    { question: 'Can I open a VCF file without importing the contacts?', answer: 'Yes — open it in any text editor (Notepad, TextEdit) or drag it into a browser tab. A VCF is plain text, so you can read every contact inside without anything touching your address book.' },
    { question: 'How do I know how many contacts are in a VCF file?', answer: 'Open it in a text editor and count the BEGIN:VCARD markers — each one is a single contact card.' },
    { question: 'Is it safe to upload my VCF to an online viewer?', answer: 'Avoid it. A VCF is an address book, and uploading it hands everyone\u2019s names, numbers, and emails to the site\u2019s operator. Read it locally in a text editor instead.' },
  ],
},
{
  extension: 'PAGES',
  name: 'Apple Pages Document',
  category: 'Documents',
  description:
    'Word processing document created by Apple Pages, stored as a ZIP package with an embedded PDF preview of the document inside.',
  detailedOverview:
    "Pages is Apple's word processor, part of the iWork suite alongside Keynote and Numbers, free on Mac, iPhone, and iPad. A modern .pages file is a ZIP archive in disguise: alongside the document data it usually carries a ready-made PDF preview (QuickLook/Preview.pdf) of the whole document. Apple never released a Windows version, and Microsoft Word cannot read the format — which is why .pages files are a classic cross-platform headache. The reliable free routes on Windows are Pages for iCloud in the browser (full editing with a free Apple ID) and extracting the embedded PDF preview with any ZIP tool. Documents from iWork '09 and older use the previous format generation, which LibreOffice can open; modern files (Pages 5.0 onward) it cannot.",
  mimeType: 'application/zip',
  magicBytesHex: '50 4B 03 04',
  typicalSize: '50 KB – 50 MB',
  dangerRating: 'Low Risk',
  dangerExplanation:
    "Pages documents are generally safe — the format has no macro system like Office. But any file arriving as an email attachment can be a phishing lure or carry a malicious payload, so verify unexpected .pages files come from a sender you trust and scan downloads with antivirus before opening.",
  exampleUse: 'Apple Pages documents shared with Windows users, iCloud-synced documents, iWork document archives',
  developer: 'Apple Inc.',
  osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
  popularApps: [
    { name: 'Apple Pages', os: ['windows', 'mac', 'linux', 'ios', 'android'], isFree: true, developer: 'Apple Inc.', link: 'https://www.icloud.com', slug: 'apple-pages' },
    { name: 'LibreOffice', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'The Document Foundation', link: 'https://www.libreoffice.org', slug: 'libreoffice' },
    { name: '7-Zip', os: ['windows'], isFree: true, developer: 'Igor Pavlov', link: 'https://www.7-zip.org', slug: '7-zip' },
  ],
  openingSteps: [
    { title: 'Open in Pages for iCloud', desc: 'Sign in at icloud.com with a free Apple ID, open the Pages web app, and upload the .pages file. Read, edit, and download a Word or PDF copy — the only free method with true editing on Windows.' },
    { title: 'Extract the PDF preview', desc: 'Copy the file, rename the copy from document.pages to document.zip, and extract it. Open QuickLook/Preview.pdf inside for a full readable snapshot — no account or upload needed.' },
    { title: 'Ask the sender to export', desc: 'Have the Mac user choose File > Export To > Word or PDF in Pages and resend. PDF keeps the exact layout; Word gives you an editable document.' },
  ],
  conversions: [
    { targetExtension: 'DOCX', description: 'Convert Pages to Word format for editing in Microsoft Word or Google Docs; expect minor font and layout shifts on complex documents.', difficulty: 'Easy', onlinePossible: true },
    { targetExtension: 'PDF', description: 'Turn the Pages document into a PDF that preserves the exact layout for reading, printing, and sharing anywhere.', difficulty: 'Easy', onlinePossible: true },
  ],
  repairTips: [
    'Verify the file starts with the ZIP signature 50 4B 03 04 — a genuine modern .pages archive begins with those bytes; anything else suggests a corrupt download or a misnamed file.',
    'If the renamed .zip refuses to extract, re-download the attachment — interrupted downloads are the most common cause — and check the file was not sent as a Mac bundle folder instead of a single file.',
    'If there is no Preview.pdf inside the extracted archive, the author saved without a preview; open the file in Pages for iCloud instead of hunting for it.',
  ],
  faqs: [
    { question: 'Can I open a Pages file on Windows without an Apple ID?', answer: "Yes, for reading: rename a copy from .pages to .zip, extract it, and open QuickLook/Preview.pdf. For editing, create a free Apple ID and use Pages for iCloud in your browser." },
    { question: 'Why does Word say my Pages file is corrupt?', answer: "It is not corrupt — Word cannot read the Pages format. Get a genuine Word export via Pages for iCloud (Download a Copy > Word) or ask the sender to export it." },
    { question: 'Will converting a Pages file to Word keep the formatting?', answer: "Mostly. Text, tables, and images survive, but Apple-only fonts get substituted on Windows and layouts can shift. Convert to PDF instead when exact fidelity matters." },
    { question: 'Can LibreOffice open Pages files?', answer: "Only documents from iWork '09 and older. Modern Pages files (Pages 5.0 onward) fail in LibreOffice — use Pages for iCloud for those." },
  ],
},
];
