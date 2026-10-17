// Batch: 2 FileTypeInfo entries (2026-10-13) for the new how-to-open overrides.
// Imported and spread into POPULAR_FILE_TYPES in fileTypesData.ts.
import type { FileTypeInfo } from '../types';

export const FILE_TYPES_BATCH_OCT2026: FileTypeInfo[] = [
{
  extension: 'VCF',
  name: 'vCard Contact File',
  category: 'Email & Comm',
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
{
  extension: 'NUMBERS',
  name: 'Apple Numbers Spreadsheet',
  category: 'Documents',
  description:
    'Spreadsheet created by Apple Numbers, stored as a ZIP package — the iWork counterpart to Excel workbooks.',
  detailedOverview:
    "Numbers is Apple's spreadsheet app, part of the iWork suite alongside Pages and Keynote, free on Mac, iPhone, and iPad. A modern .numbers file is a ZIP archive in disguise, which is why it starts with the same PK signature as any ZIP file. Apple never released a Windows version, and Microsoft Excel cannot read the format — the classic cross-platform headache when a Mac colleague emails you a spreadsheet. The reliable free routes on Windows are Numbers for iCloud in the browser (open, edit, and export to Excel/PDF/CSV with a free Apple ID) and asking the sender to export an Excel copy from their Mac. LibreOffice Calc can open some Numbers files, but its importer is incomplete and version-sensitive, so modern or complex spreadsheets often fail there.",
  mimeType: 'application/zip',
  magicBytesHex: '50 4B 03 04',
  typicalSize: '20 KB – 30 MB',
  dangerRating: 'Low Risk',
  dangerExplanation:
    "Numbers files themselves are safe — the format has no macro system like Excel. The real risk is privacy: spreadsheets routinely hold budgets, salaries, and client lists, so avoid uploading sensitive .numbers files to random online converters. Convert via iCloud or a sender export instead.",
  exampleUse: 'Spreadsheets shared by Mac/iPhone users, iCloud-synced workbooks, iWork document archives',
  developer: 'Apple Inc.',
  osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
  popularApps: [
    { name: 'Apple Numbers', os: ['windows', 'mac', 'linux', 'ios', 'android'], isFree: true, developer: 'Apple Inc.', link: 'https://www.icloud.com', slug: 'apple-numbers' },
    { name: 'LibreOffice Calc', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'The Document Foundation', link: 'https://www.libreoffice.org', slug: 'libreoffice-calc' },
    { name: 'Google Sheets', os: ['windows', 'mac', 'linux', 'ios', 'android'], isFree: true, developer: 'Google LLC', link: 'https://sheets.google.com', slug: 'google-sheets' },
  ],
  openingSteps: [
    { title: 'Open in Numbers for iCloud', desc: 'Sign in at icloud.com with a free Apple ID, open the Numbers web app, and upload the .numbers file. View, edit, and download an Excel, PDF, or CSV copy.' },
    { title: 'Ask the sender to export', desc: 'Have the Mac user choose File > Export To > Excel (or PDF/CSV) in Numbers and resend. Excel keeps the workbook editable; PDF freezes the layout.' },
    { title: 'Try LibreOffice for simple files', desc: 'LibreOffice Calc opens some Numbers files — simple tables often work, modern or complex ones frequently fail. If it fails, use iCloud instead.' },
  ],
  conversions: [
    { targetExtension: 'XLSX', description: 'Convert Numbers to Excel format for editing in Microsoft Excel or Google Sheets; spot-check formulas after conversion.', difficulty: 'Easy', onlinePossible: true },
    { targetExtension: 'CSV', description: 'Export raw values with no formatting — ideal when you only need the data, not the layout.', difficulty: 'Easy', onlinePossible: true },
    { targetExtension: 'PDF', description: 'Freeze the spreadsheet layout exactly for reading, printing, and sharing anywhere.', difficulty: 'Easy', onlinePossible: true },
  ],
  repairTips: [
    'Verify the file starts with the ZIP signature 50 4B 03 04 — a genuine modern .numbers archive begins with those bytes; anything else suggests a corrupt download or a misnamed file.',
    'An Excel "corrupt file" error on a .numbers file means Excel cannot read the format, not that the file is damaged — convert it instead of trying to repair it.',
    'If LibreOffice opens the file but formulas are wrong, the importer mangled them — re-export from Numbers (via iCloud) rather than fixing the import by hand.',
  ],
  faqs: [
    { question: 'Can Microsoft Excel open a Numbers file directly?', answer: 'No — Excel cannot read the .numbers format. Convert to .xlsx first via Numbers for iCloud or a sender export.' },
    { question: 'Do I need an Apple ID to open a Numbers file on Windows?', answer: 'Only for the iCloud method, and the Apple ID is free. Otherwise ask the sender to export an Excel copy or try LibreOffice for simple files.' },
    { question: 'Is it safe to upload my Numbers file to an online converter?', answer: 'Spreadsheets often hold financial or personal data — avoid uploading sensitive ones to random converters. Use iCloud or a sender export instead.' },
  ],
},
{
  extension: 'KEY',
  name: 'Apple Keynote Presentation',
  category: 'Documents',
  description:
    'Presentation created by Apple Keynote, stored as a ZIP package — the iWork counterpart to PowerPoint decks.',
  detailedOverview:
    "Keynote is Apple's presentation app, part of the iWork suite alongside Pages and Numbers, free on Mac, iPhone, and iPad. A modern .key file is a ZIP archive in disguise, which is why it starts with the same PK signature as any ZIP file. Apple never released a Windows version, and Microsoft PowerPoint cannot read the format — the classic cross-platform headache when a Mac colleague sends you a deck. The reliable free routes on Windows are Keynote for iCloud in the browser (open, edit, and export to PowerPoint or PDF with a free Apple ID) and asking the sender to export a PowerPoint copy from their Mac. LibreOffice Impress can open some Keynote files, but its importer is incomplete and version-sensitive, so modern or transition-heavy decks often fail there.",
  mimeType: 'application/zip',
  magicBytesHex: '50 4B 03 04',
  typicalSize: '500 KB – 200 MB',
  dangerRating: 'Low Risk',
  dangerExplanation:
    "Keynote files themselves are safe — the format has no macro system like PowerPoint. The real risk is privacy: decks often hold investor figures, sales data, and unreleased plans, so avoid uploading sensitive .key files to random online converters. Convert via iCloud or a sender export instead.",
  exampleUse: 'Presentations shared by Mac/iPhone users, iCloud-synced decks, iWork document archives',
  developer: 'Apple Inc.',
  osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
  popularApps: [
    { name: 'Apple Keynote', os: ['windows', 'mac', 'linux', 'ios', 'android'], isFree: true, developer: 'Apple Inc.', link: 'https://www.icloud.com', slug: 'apple-keynote' },
    { name: 'LibreOffice Impress', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'The Document Foundation', link: 'https://www.libreoffice.org', slug: 'libreoffice-impress' },
    { name: 'Google Slides', os: ['windows', 'mac', 'linux', 'ios', 'android'], isFree: true, developer: 'Google LLC', link: 'https://slides.google.com', slug: 'google-slides' },
  ],
  openingSteps: [
    { title: 'Open in Keynote for iCloud', desc: 'Sign in at icloud.com with a free Apple ID, open the Keynote web app, and upload the .key file. View, edit, and download a PowerPoint or PDF copy.' },
    { title: 'Ask the sender to export', desc: 'Have the Mac user choose File > Export To > PowerPoint (or PDF) in Keynote and resend. PowerPoint keeps the deck editable; PDF freezes every slide.' },
    { title: 'Try Google Slides or LibreOffice', desc: 'Google Slides can import some .key files for a quick view; LibreOffice Impress opens simple older decks. If either fails, use iCloud instead.' },
  ],
  conversions: [
    { targetExtension: 'PPTX', description: 'Convert Keynote to PowerPoint format for editing in Microsoft PowerPoint or Google Slides; transitions and animations may not survive.', difficulty: 'Easy', onlinePossible: true },
    { targetExtension: 'PDF', description: 'Freeze every slide exactly for presenting, printing, and sharing anywhere.', difficulty: 'Easy', onlinePossible: true },
  ],
  repairTips: [
    'Verify the file starts with the ZIP signature 50 4B 03 04 — a genuine modern .key archive begins with those bytes; anything else suggests a corrupt download or a misnamed file.',
    'A PowerPoint "repair" failure on a .key file means PowerPoint cannot read the format, not that the file is damaged — convert it instead of trying to repair it.',
    'If iCloud opens the file but the layout looks off, the deck may use macOS-only fonts — export to PDF from iCloud to freeze the design as intended.',
  ],
  faqs: [
    { question: 'Can PowerPoint open a Keynote file directly?', answer: 'No — PowerPoint cannot read the .key format. Convert to .pptx first via Keynote for iCloud or a sender export.' },
    { question: 'Do I need an Apple ID to open a Keynote file on Windows?', answer: 'Only for the iCloud method, and the Apple ID is free. Otherwise ask the sender to export a PowerPoint copy or try Google Slides.' },
    { question: 'Is it safe to upload my Keynote file to an online converter?', answer: 'Decks often hold confidential material — avoid uploading sensitive ones to random converters. Use iCloud or a sender export instead.' },
  ],
},
{
  extension: 'ODT',
  name: 'OpenDocument Text Document',
  category: 'Documents',
  description:
    'Text document in the open OpenDocument format — a ZIP package of XML files, the native format of LibreOffice Writer.',
  detailedOverview:
    "ODT (OpenDocument Text) is the open, royalty-free document standard maintained by OASIS, with ISO standardization as ISO/IEC 26300. It is the default format of LibreOffice Writer and Apache OpenOffice, and the format Google Docs can export. Technically, an .odt file is a ZIP archive: the document text lives in content.xml, styles in styles.xml, and metadata in META-INF — which is why every genuine ODT starts with the ZIP signature 50 4B 03 04, and why a healthy ODT can be inspected with any ZIP tool. Unlike the iWork formats, ODT is genuinely easy to open without paid software: LibreOffice opens it natively, Google Docs and Word for the web open it in the browser, and even desktop Microsoft Word has supported it for years. The honest caveat is fidelity: complex formatting, tracked changes, and unusual fonts can shift when moving between applications, so the native app (LibreOffice) is the fairest judge of what a document really looks like.",
  mimeType: 'application/vnd.oasis.opendocument.text',
  magicBytesHex: '50 4B 03 04',
  typicalSize: '10 KB – 20 MB',
  dangerRating: 'Low Risk',
  dangerExplanation:
    "ODT files are generally safe — the format has no macro system comparable to Office's. As with any document arriving unexpectedly, verify the sender before opening, and be cautious with files that ask you to enable anything or follow external links.",
  exampleUse: 'LibreOffice Writer documents, Linux office documents, Google Docs exports, open-standards document archives',
  developer: 'OASIS (standard); reference implementation by The Document Foundation (LibreOffice)',
  osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
  popularApps: [
    { name: 'LibreOffice Writer', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'The Document Foundation', link: 'https://www.libreoffice.org', slug: 'libreoffice-writer' },
    { name: 'Google Docs', os: ['windows', 'mac', 'linux', 'ios', 'android'], isFree: true, developer: 'Google LLC', link: 'https://docs.google.com', slug: 'google-docs' },
    { name: 'Collabora Office', os: ['ios', 'android'], isFree: true, developer: 'Collabora Productivity', link: 'https://www.collaboraoffice.com', slug: 'collabora-office' },
  ],
  openingSteps: [
    { title: 'Open in LibreOffice Writer', desc: 'Install LibreOffice (free) and double-click the .odt file — ODT is its native format, so fidelity is the best you will get anywhere.' },
    { title: 'Open in Google Docs', desc: 'Upload the file to Google Drive, right-click it, and open with Google Docs. Edit in the browser and download back as ODT, DOCX, or PDF.' },
    { title: 'Use Word or Word Online', desc: 'Desktop Word opens ODT directly; Word for the web (free with a Microsoft account) opens it from OneDrive. Expect minor formatting shifts on complex documents.' },
  ],
  conversions: [
    { targetExtension: 'DOCX', description: 'Convert ODT to Word format for editing in Microsoft Word; convert from LibreOffice for the cleanest result on complex documents.', difficulty: 'Easy', onlinePossible: true },
    { targetExtension: 'PDF', description: 'Freeze the document layout exactly for reading, printing, and sharing anywhere.', difficulty: 'Easy', onlinePossible: true },
  ],
  repairTips: [
    'Verify the file starts with the ZIP signature 50 4B 03 04 — if it does not, the file is corrupt or misnamed; re-download it.',
    'A healthy ODT opens as a ZIP archive: if a ZIP tool can list META-INF and content.xml, the container is intact and the problem is elsewhere.',
    'When Word mangles formatting, open the file in LibreOffice Writer to see the true rendering before assuming the document is damaged.',
  ],
  faqs: [
    { question: 'Can I open an ODT file without Microsoft Office?', answer: 'Yes — LibreOffice Writer (free, native), Google Docs (browser), and Word for the web (free Microsoft account) all open ODT without desktop Office.' },
    { question: 'Will Microsoft Word open an ODT file?', answer: 'Yes, Word has supported ODT for years. Fidelity is good for typical documents; complex layouts may shift slightly.' },
    { question: 'What is inside an ODT file?', answer: 'A ZIP archive of XML files — content.xml holds the text, styles.xml the styles, META-INF the metadata. Every genuine ODT starts with the ZIP signature 50 4B 03 04.' },
  ],
}
,
{
  extension: 'MSG',
  name: 'Outlook Mail Message',
  category: 'Email & Comm',
  description:
    'Saved email message from Microsoft Outlook bundling the body, sender, date, and attachments into one binary file.',
  detailedOverview:
    "MSG is Microsoft Outlook's proprietary binary email format built on the OLE compound document structure. Each .msg file bundles the message body, sender, date, headers, and attachments into a single container that only Outlook — and tools that understand the OLE format — can read properly. Unlike the open EML standard, MSG keeps messages tied to Microsoft's ecosystem unless converted.",
  mimeType: 'application/vnd.ms-outlook',
  magicBytesHex: 'D0 CF 11 E0 A1 B1 1A E1',
  typicalSize: '10 KB – 25 MB',
  dangerRating: 'Medium Risk',
  dangerExplanation:
    'MSG files come from email and can carry phishing lures or malicious attachments. Treat unexpected .msg files like any unexpected attachment: verify the sender and scan with antivirus before opening.',
  exampleUse: 'Saved Outlook emails, mailbox exports, legal email archives',
  developer: 'Microsoft',
  osSupport: { windows: true, mac: true, linux: true, android: true, ios: true },
  popularApps: [
    { name: 'Mozilla Thunderbird', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Mozilla Foundation', slug: 'thunderbird' },
    { name: 'extract-msg', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'TeamMsgExtractor', link: 'https://github.com/TeamMsgExtractor/msg-extractor', slug: 'extract-msg' },
    { name: 'msgconvert', os: ['windows', 'mac', 'linux'], isFree: true, developer: 'Email::Outlook::Message Project', link: 'https://metacpan.org/pod/Email::Outlook::Message', slug: 'msgconvert' },
    { name: 'SeaMonkey', os: ['mac'], isFree: true, developer: 'SeaMonkey Project', slug: 'seamonkey' },
  ],
  openingSteps: [
    { title: 'Quick text peek', desc: 'Copy the file, rename the copy from email.msg to email.txt, and open it in Notepad — headers, sender, subject, and plain-text body appear (no formatting or attachments).' },
    { title: 'Convert MSG to EML', desc: 'Run extract-msg (pip install extract-msg, then python -m extract_msg email.msg) or msgconvert (msgconvert email.msg) to get an attachment-preserving .eml.' },
    { title: 'Open in Thunderbird or Apple Mail', desc: "Drag the .eml into Thunderbird's local folders — or open it in Apple Mail — to read the full message with attachments intact." },
  ],
  conversions: [
    { targetExtension: 'EML', description: 'Convert MSG to the open EML email standard for reading in Thunderbird, Apple Mail, and most other clients.', difficulty: 'Easy', onlinePossible: true },
    { targetExtension: 'PDF', description: 'Turn converted emails into shareable, archivable PDFs.', difficulty: 'Easy', onlinePossible: true, converterSlug: 'eml-to-pdf' },
  ],
  repairTips: [
    'Verify the OLE signature D0 CF 11 E0 A1 B1 1A E1 at byte offset 0 — files missing it are not genuine MSG files.',
    'If a renamed .msg-to-.eml file renders a broken body, reconvert with msgconvert or extract-msg instead of relying on the rename gamble.',
    'For batch archives, convert a 3–4 file sample first — very old MSG files occasionally convert with quirks — and spot-check before running the full batch.',
  ],
  faqs: [
    { question: 'Can I open an MSG file without Outlook?', answer: "Yes. For a quick text read, rename a copy of the file to .txt and open it in Notepad. For a clean copy with formatting and attachments, convert it to EML with free tools like msgconvert or extract-msg and open the result in Thunderbird — none of which needs Outlook." },
    { question: 'Is an MSG file the same as EML?', answer: "No. MSG is Microsoft Outlook's proprietary binary format; EML is the open standard email format most other clients use. That's why conversion between them works — tools translate the Outlook structure into the standard one." },
    { question: "Why can't I see the attachments?", answer: "Because the method you used only reads the message text. Renaming tricks expose text, not attachments — attachments are stored inside the MSG in a way plain text can't show. Use a converter like msgconvert or extract-msg to get the files out intact." },
    { question: 'Can I open an MSG file in Gmail?', answer: 'Gmail has no built-in MSG preview. Convert the message to PDF or plain text first (extract-msg can produce readable output), then view or attach that instead.' },
    { question: 'Can I reply to an MSG file without Outlook?', answer: "Not directly. These methods are for reading. Once you've converted the message to EML, you can import it into Thunderbird and reply from there as a normal email." },
  ],
}
];