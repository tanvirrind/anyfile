// Batch: 3 how-to-open overrides (2026-10-13). Spread into FORMAT_SPECIFIC_OVERRIDES
// in howToOpenEngine.ts (keeps the engine diff small).
// NOTE (engine limitation, per PUBLISHING.md): getHowToOpenGuide() currently only reads
// override.whyItIsHardToOpen and override.inBrowserSupport; the rich override fields here
// are data-ready for a future engine merge.
import type { HowToOpenGuideData } from './howToOpenEngine';

export const HOW_TO_OPEN_BATCH_OCT2026: Record<string, Partial<HowToOpenGuideData>> = {
  vcf: {
  extension: 'vcf',
  upperExt: 'VCF',
  name: 'vCard Contact File',
  category: 'Contacts',

  summary:
    "A .vcf file is a vCard — the universal, plain-text format for contact information, defined by the IETF in RFC 6350 (vCard 4.0; earlier versions were standardized in RFC 2426 as vCard 3.0). Each contact is stored as a block of readable text between BEGIN:VCARD and END:VCARD markers, with lines like FN for the full name, TEL for phone numbers, and EMAIL for email addresses. One file can hold a single contact card or hundreds of them, which is why people get nervous: tapping a received VCF on your phone often dumps every contact inside into your address book at once. The reassuring part is that a VCF is just text. You can open it in Notepad or TextEdit and read exactly what is inside — names, numbers, emails — before you ever import anything. Every major platform handles VCF too: Google Contacts and Android import it, Apple\u2019s Contacts app and iCloud.com accept it, and Windows and Linux contacts apps read it. This guide leads with preview-without-import methods so you can inspect the file safely, then covers importing cleanly on each platform, converting contacts to a spreadsheet, and fixing the common problems like garbled names and bloated photo data. And because a VCF is literally an address book — the most personal file type on your computer — the privacy rule runs through everything: peek locally, import deliberately, and be careful about handing the file to any website that asks you to upload it.",

  whyItIsHardToOpen:
    "VCF files are not really hard to open — they are hard to open safely. The format itself is plain text and every major address book app reads it, but the danger is the import step. A single .vcf file can contain hundreds of contact cards stacked back to back, and most apps treat opening the file as an instruction to save all of them. Double-click a VCF on a Mac and the Contacts app offers to add every person inside to your address book. Tap one on an iPhone and you get a preview with an Add button — one wrong tap and a stranger\u2019s entire contact list becomes part of yours. Google\u2019s web Contacts imports a VCF with no real preview in the classic flow (it quietly labels the imported contacts so you can find them afterward), while newer Android versions show a count of how many contacts are in the file first. Add in version quirks — vCard 4.0 is the current standard, but many exports are still 3.0 or the older 2.1, and apps don\u2019t all handle each version\u2019s details identically — and it\u2019s easy to see why people hesitate. The fix is not a special program; it is a habit: look inside the file as text first, count the contacts, and only then import into a clearly labeled group you can undo.",

  inBrowserSupport: {
    supported: true,
    type: 'text',
    note: "VCF files are plain text, so you can open them in any browser tab without uploading: drag the file into a new tab (or rename a copy to .txt) and read the contacts directly. Verify the true type first with the File Identifier — a genuine vCard starts each block with BEGIN:VCARD.",
  },

  osGuides: {
    windows: {
      isSupported: true,
      title: 'Open VCF files on Windows',
      badge: 'Preview first',
      defaultApp: 'Notepad',
      steps: [
        {
          stepNumber: 1,
          title: 'Peek inside with Notepad (zero import risk)',
          detail: "Right-click the .vcf file, choose Open with > Notepad, and read it like a document. Every contact is a readable block starting with BEGIN:VCARD and ending with END:VCARD. You can see each name (FN), phone (TEL), and email (EMAIL) in plain text. This is the safest possible method: nothing is installed, nothing is synced, and not a single contact touches your address book.",
          tip: 'To count how many contacts are hiding inside, use Edit > Find and search for BEGIN:VCARD — each match is one contact card.',
        },
        {
          stepNumber: 2,
          title: 'Import into the Windows Contacts folder',
          detail: "If you decide you do want the contacts, the classic Windows Contacts folder (run wab.exe) has an Import option that accepts vCard (VCF) files. It steps through each contact and asks you to confirm with OK before adding it, so you review them one by one instead of getting a bulk dump. This is the built-in Windows route for inspecting a VCF without third-party software.",
          tip: 'Importing this way keeps the contacts in the local Windows Contacts store, separate from your Microsoft or Google accounts.',
        },
        {
          stepNumber: 3,
          title: 'Import via Google Contacts in the browser',
          detail: "Go to contacts.google.com in your browser, choose Import from the side menu, and select the VCF file. Google reads every contact in the file and saves them to your account — the classic import gives no detailed preview, but imported contacts get a label so you can find and delete them easily if the file was not what you expected. Newer Android-side import flows show the contact count before importing, so use the phone flow if you want that check.",
          tip: 'After importing, search Google Contacts for a name you saw in the Notepad peek to confirm the data landed correctly.',
        },
        {
          stepNumber: 4,
          title: 'Turn the contacts into a spreadsheet',
          detail: "If your real goal is a table rather than an address book, open the VCF in Notepad first, then copy the FN, TEL, and EMAIL lines into Excel and use Data > Text to Columns to split them into columns. For a bigger file, importing into Google Contacts first and then using Export > Google CSV gives you a clean spreadsheet with proper columns instead of manual cutting and pasting.",
          tip: 'The Google Contacts import-then-export route preserves fields more reliably than manual text splitting on large files.',
        },
      ],
    },
    mac: {
      isSupported: true,
      title: 'Open VCF files on Mac',
      badge: 'Built in',
      defaultApp: 'Contacts',
      steps: [
        {
          stepNumber: 1,
          title: 'Peek inside with TextEdit first',
          detail: "Right-click the file, choose Open With > TextEdit, and read it as plain text. Check the names, and count the BEGIN:VCARD blocks so you know whether you are looking at one contact or five hundred. This is the step that removes all the anxiety: you now know exactly what importing will add.",
        },
        {
          stepNumber: 2,
          title: 'Import into a new group you control',
          detail: "Double-click the VCF and macOS Contacts offers to add the contacts. Before you accept, decide where they should live: contacts added to your Apple Account list will sync to your iPhone and iPad, while contacts in an \u201cOn My Mac\u201d list stay local. Contacts also flags duplicates it finds, so pause on that notice instead of clicking through it — accepting it prevents a second copy of everyone you already know.",
          tip: 'Create a new group first (File > New Group) and drag the imported contacts into it — then you can review or delete them as a batch.',
        },
        {
          stepNumber: 3,
          title: 'Convert to CSV via Numbers',
          detail: "If you need a spreadsheet, select the imported contacts in the Contacts app, drag them into Numbers, and then use File > Export To > CSV. You get a proper table you can open in Excel or Google Sheets without retyping anything.",
          tip: 'Compare a few exported rows against the original VCF text to make sure notes and addresses came through before you delete the import.',
        },
      ],
    },
    linux: {
      isSupported: true,
      title: 'Open VCF files on Linux',
      badge: 'Free & open source',
      defaultApp: 'GNOME Contacts',
      steps: [
        {
          stepNumber: 1,
          title: 'Peek inside in any text editor',
          detail: "Open the file in gedit, Kate, or whatever editor your desktop ships — VCF is plain text, so no special software is needed. Read the FN, TEL, and EMAIL lines and count the BEGIN:VCARD blocks to see how many contacts are inside before you commit to an import.",
        },
        {
          stepNumber: 2,
          title: 'Import with GNOME Contacts',
          detail: "GNOME Contacts handles vCard import and export and is designed around previewing contacts before importing — use it to review what the file contains rather than blind-importing. Import into a clearly labeled address book so the new contacts stay separate from your existing ones.",
          tip: 'If your distribution does not ship GNOME Contacts, install it from your package manager — it is the standard free vCard-capable address book on Linux desktops.',
        },
        {
          stepNumber: 3,
          title: 'Extract to CSV with a text tool',
          detail: "Because a VCF is structured text, simple command-line tools can pull out the fields you need — grep the FN and TEL lines into a file and open that in LibreOffice Calc. For a many-hundred-contact file, import into GNOME Contacts first and export from there rather than hand-editing.",
          tip: 'Always work on a copy of the VCF when experimenting — the original stays your backup.',
        },
      ],
    },
    ios: {
      isSupported: true,
      title: 'Open VCF files on iPhone & iPad',
      badge: 'Preview first',
      defaultApp: 'Contacts',
      steps: [
        {
          stepNumber: 1,
          title: 'Tap the attachment to get a preview',
          detail: "When a VCF arrives as an email or message attachment, tap it and iOS shows a contact preview screen before anything is saved. This is the moment to be careful: read through what is shown, check how many contacts the file contains, and notice whether the preview looks like one person or a whole company directory. Nothing is added to your contacts until you choose to add it.",
          tip: 'If the preview shows far more contacts than you expected, stop here — go peek at the file on a computer before adding anything.',
        },
        {
          stepNumber: 2,
          title: 'Choose where the contacts go',
          detail: "When you add the contacts, decide whether they belong in your iCloud list (which syncs to all your Apple devices) or a local On My iPhone list. For a file you received from someone else, a local list is usually the safer choice — it keeps unfamiliar contacts out of your synced address book.",
          tip: 'You can check afterwards in the Contacts app: search for a name from the file and see which list it landed in.',
        },
        {
          stepNumber: 3,
          title: 'Review and clean up after importing',
          detail: "After adding, scroll through the new contacts and delete anything that does not belong. If an import ever goes badly, restoring from an iCloud.com contacts archive or your most recent backup is faster than deleting hundreds of entries by hand — which is why the text peek in step one of the Mac/Windows guides is worth doing before you import on the phone.",
        },
      ],
    },
    android: {
      isSupported: true,
      title: 'Open VCF files on Android',
      badge: 'Free',
      defaultApp: 'Google Contacts',
      steps: [
        {
          stepNumber: 1,
          title: 'Peek at the file before importing',
          detail: "Android has no great built-in text preview for VCF, so if the file came from someone else, open it on a computer in a text editor first (see the Windows/Mac steps) and read what is inside. Knowing the contact count up front turns the import step from a gamble into a routine.",
        },
        {
          stepNumber: 2,
          title: 'Import from the Contacts app',
          detail: "Open the Google Contacts app, tap Organize (or the menu), choose Import from file, pick the Google account that should own the contacts, and select the VCF. Choosing the right account matters: contacts added to the wrong account sync to the wrong place. Newer versions of the app show a preview of how many contacts are in the file before importing — read that number before confirming.",
          tip: 'If more than one Google account is signed in, the app asks which one to use — make that choice before browsing for the file.',
        },
        {
          stepNumber: 3,
          title: 'Verify and undo if needed',
          detail: "After importing, search the Contacts app for a name from the file and confirm the phone and email landed correctly. If the file contained surprises, the imported contacts carry the account you chose, so you can select and delete them — another reason the count preview in the previous step is worth reading.",
        },
      ],
    },
  },

  // NOTE: ratings below are placeholders — verify before publishing
  recommendedSoftware: [
    {
      id: 'google-contacts',
      name: 'Google Contacts',
      developer: 'Google LLC',
      category: 'Contact Manager',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Free',
      priceText: 'Free with a Google account',
      rating: 4.5,
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://contacts.google.com',
    },
    {
      id: 'apple-contacts',
      name: 'Apple Contacts',
      developer: 'Apple Inc.',
      category: 'Contact Manager',
      supportedOS: ['mac'],
      priceType: 'Free',
      priceText: 'Built into macOS',
      rating: 4.4,
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.apple.com',
    },
    {
      id: 'thunderbird',
      name: 'Mozilla Thunderbird',
      developer: 'Mozilla Foundation',
      category: 'Email Client',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      rating: 4.5,
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: false,
      routeId: 'software',
      websiteUrl: 'https://www.thunderbird.net',
    },
  ],

  browserOptions: [
    {
      title: 'Drag the VCF into a browser tab',
      description: "Browsers render plain-text files natively, so dragging contacts.vcf into an open tab shows you the contacts as text — names, numbers, and emails in the open, no import, no install, no account. Rename a copy to .txt first if the browser tries to download the file instead of displaying it.",
      badge: 'Fastest · Private',
    },
    {
      title: 'Import into Google Contacts web',
      description: "At contacts.google.com you can import the VCF, then review every contact in the browser and export back out to CSV or vCard. The classic flow imports without a detailed preview, so treat the browser as your review room after the fact: scan the list, keep what you want, delete the rest.",
      badge: 'Free',
      actionUrl: 'https://contacts.google.com',
    },
    {
      title: 'Why you should skip random online VCF viewers',
      description: "Dozens of sites offer to \u201cview your VCF online\u201d by uploading the file. They work — but a VCF is an address book, possibly hundreds of people\u2019s names, numbers, and emails, and an upload hands the whole thing to a stranger\u2019s server. For a file that is someone else\u2019s contacts, that is a privacy breach you cannot undo. The text-peek methods above do the same job with the file never leaving your device.",
      badge: 'Privacy warning',
    },
  ],

  troubleshooting: [
    {
      id: 'vcf-garbled-names',
      issue: 'Names with non-English characters show as gibberish',
      cause: 'Older vCards (especially version 2.1 and 3.0) were created in an era before UTF-8 was universal, so names in Arabic, Urdu, Chinese, or accented Latin scripts were stored in the encoding of whatever computer made the file. Opening them in an app that assumes the wrong encoding turns those names into unreadable symbols.',
      diagnostic: 'Names in non-Latin scripts (or accented characters like \u00e9 and \u00f1) show as question marks, boxes, or random symbols while phone numbers look fine.',
      solution: "Try importing the file in a different app — modern address books (Google Contacts, Apple Contacts) are usually better at guessing encodings than old ones. If the file opens fine as text but the characters are mangled, ask the sender to re-export it; many old exports are the source of the problem.",
    },
    {
      id: 'vcf-hundreds-of-contacts',
      issue: 'The file contains hundreds of contacts you did not expect',
      cause: 'A single VCF can hold any number of vCards, and exports default to \u201call of them\u201d — the file you received may be someone\u2019s complete address book rather than the one contact you asked for.',
      diagnostic: 'The text peek shows many BEGIN:VCARD blocks, or the import preview reports a large contact count.',
      solution: "Split before you import: copy the BEGIN:VCARD\u2026END:VCARD blocks you actually want into a new file in a text editor and import only that. If you already imported, delete the batch from the labeled group or account you imported into — which is why importing into a separate group matters.",
    },
    {
      id: 'vcf-bloated-photos',
      issue: 'The VCF is huge — megabytes for a handful of contacts',
      cause: 'Contact photos are embedded directly in the VCF as long blocks of encoded image data inside PHOTO properties. A few high-resolution profile pictures can make a tiny contact file balloon to many megabytes, which slows imports and sometimes breaks older apps.',
      diagnostic: 'The file is much larger than expected for its contact count, and opening it in a text editor reveals enormous PHOTO blocks.',
      solution: 'If you only need names and numbers, delete the PHOTO lines (everything from the PHOTO property through the end of its encoded block) from a copy of the file in a text editor. Keep the original untouched in case the photos matter later.',
    },
    {
      id: 'vcf-version-quirks',
      issue: 'One app opens the VCF fine but another mangles or skips fields',
      cause: 'vCard has three widespread versions — 2.1, 3.0, and the current 4.0 — and they are not strictly compatible. An app that handles 4.0\u2019s property parameters may misread a 2.1 file\u2019s older encoding conventions, dropping photos, misreading addresses, or misplacing phone labels.',
      diagnostic: 'The VERSION: line in the text peek says 2.1 or 3.0, and some fields render wrong in your app of choice while the text itself looks correct.',
      solution: "Import the file into a modern address book first (Google Contacts or Apple Contacts handle old versions well), then re-export from there — the export comes out in a current, clean format that plays nicely everywhere.",
    },
    {
      id: 'vcf-not-really-vcard',
      issue: "Nothing will open the file, or it shows nonsense text",
      cause: 'Not every file ending in .vcf is actually a vCard — some are mislabeled, renamed, or damaged, and a corrupt file will not have the BEGIN:VCARD markers a real vCard must have.',
      diagnostic: 'No contact app recognizes the file, and the text peek shows binary gibberish or unrelated content instead of readable contact lines.',
      solution: "Check the file\u2019s true signature with a file identifier before trying more import tricks — if it is a mislabeled file of another type, the fix is completely different.",
      toolAction: {
        label: 'Identify the true file type',
        route: { view: 'file-identifier' },
      },
    },
  ],

  internalLinks: {
    // NOTE: formatGuideUrl/extensionUrl omitted — neither /format/vcf nor /file-extensions/vcf
    // exists in the sitemap. All URLs below were verified against sitemap-urls.txt.
    comparisons: [
      {
        slug: 'csv-vs-xlsx',
        title: 'CSV vs XLSX: Which Spreadsheet Format Should You Use?',
        highlight: 'Convert your imported contacts into the right spreadsheet format.',
      },
    ],
    relatedExtensions: [
      { ext: 'CSV', name: 'Comma-Separated Values', category: 'Data' },
      { ext: 'TXT', name: 'Plain Text File', category: 'Documents' },
      { ext: 'EML', name: 'Email Message File', category: 'Email & Comm' },
    ],
    recommendedTools: [
      {
        name: 'File Identifier',
        slug: 'file-identifier',
        description: 'Confirm a mystery file really is a vCard from its signature in your browser — nothing is uploaded.',
      },
      {
        name: 'Magic Byte Detector',
        slug: 'magic-byte-detector',
        description: 'Inspect the raw header bytes to identify the real format behind a suspicious extension.',
      },
    ],
  },

  faqs: [
    {
      question: 'Can I open a VCF file without importing the contacts?',
      answer: "Yes — that is the recommended first step. Open the file in Notepad (Windows), TextEdit (Mac), or any text editor: a VCF is plain text, so you can read every name, number, and email inside without anything touching your address book. Dragging it into a browser tab works the same way. Only import after you have looked.",
    },
    {
      question: 'How do I know how many contacts are in a VCF file?',
      answer: "Open it in a text editor and count the BEGIN:VCARD markers — each one is a single contact card. The classic Google Contacts web import gives no detailed preview (it labels imports so you can find them after), while newer Android import flows show the contact count before you confirm.",
    },
    {
      question: 'Is it safe to upload my VCF to an online viewer?',
      answer: "Avoid it. A VCF is an address book — potentially hundreds of people\u2019s names, phone numbers, and email addresses — and uploading it hands all of that to whoever runs the site. For a file containing anyone else\u2019s contacts, that is a privacy breach you cannot undo. Read it locally in a text editor instead, which shows you the same information with the file never leaving your device.",
    },
    {
      question: 'Can I convert a VCF file to Excel or CSV?',
      answer: "Yes. The reliable route is to import the VCF into Google Contacts, then use Export and choose Google CSV — you get a clean spreadsheet with proper columns. For a handful of contacts, copying the FN, TEL, and EMAIL lines out of a text editor into Excel works too, though the import-then-export route is safer for large files.",
    },
    {
      question: 'What is the difference between vCard 2.1, 3.0, and 4.0?',
      answer: "They are successive versions of the vCard standard: 4.0 is the current one, defined by the IETF in RFC 6350, while 3.0 was standardized in RFC 2426 and 2.1 is the oldest still floating around in exports. The versions are similar but not strictly compatible, so a file in an old version can render quirks in a modern app. Importing into Google Contacts or Apple Contacts and re-exporting normalizes the file to a current, clean format.",
    },
    {
      question: 'How do I split a multi-contact VCF into separate files?',
      answer: "Because each contact is a self-contained text block, splitting is simple: open the file in a text editor, select from BEGIN:VCARD through END:VCARD for the contact you want, and paste it into a new file. Repeat for each contact. Work on copies so the original multi-contact file stays intact as your backup.",
    },
  ],
},
  pages: {
  extension: 'pages',
  upperExt: 'PAGES',
  name: 'Apple Pages Document',
  category: 'Documents',
  mimeType: 'application/zip',
  magicBytesHex: '50 4B 03 04',
  dangerRating: 'Low Risk',

  summary:
    "A .pages file is a document made in Apple Pages, Apple's word processor and part of the iWork suite alongside Keynote and Numbers. Pages is free on Mac, iPhone, and iPad — but Apple never made a Windows version, and Microsoft Word cannot read .pages files. So when a Mac user emails you one, double-clicking it on a PC usually opens the wrong program or shows an error. The good news is that modern .pages files are ZIP archives in disguise with a ready-made PDF preview tucked inside, and Apple's free web version of Pages runs in any browser. Between those two facts, every Windows user can read — and usually fully edit — a Pages file without paying anything.",

  whyItIsHardToOpen:
    "Pages files have two complications. First, the format changed in 2013: files from Pages 5.0 onward use a new internal structure, while iWork '09 and older files use the previous one — so a tool that opens one era may fail on the other. That is exactly where people trip up with LibreOffice, which only understands Pages '09 and older. Second, there is no native Windows app for the format, and Word will not touch it. What saves you is that Apple packs the modern format as a ZIP archive containing a ready-made PDF preview of the document, and Pages for iCloud — free with any Apple ID — opens every Pages version right in your browser. So the fix is never 'install a Pages reader'; it is picking the right one of the methods below for the file era you have.",

  inBrowserSupport: {
    supported: false,
    type: 'none',
    note: "No browser can render a .pages file directly — no web-based Pages viewer exists. Use AnyFileX's File Identifier in your browser to confirm the file is genuinely a Pages document, then either extract its embedded PDF preview with a ZIP tool or open it fully in Pages for iCloud.",
  },

  osGuides: {
    windows: {
      isSupported: true,
      title: 'Open PAGES files on Windows',
      badge: 'Free methods',
      defaultApp: 'Pages for iCloud',
      steps: [
        {
          stepNumber: 1,
          title: 'Open and edit with Pages for iCloud (best method)',
          detail: "Go to icloud.com in Chrome, Edge, or Firefox and sign in with an Apple ID — creating one is free and takes a couple of minutes if you do not have one. Open the Pages web app, then drag your .pages file into the window (or use the Upload button). The document opens in a web version of Pages where you can read it, edit it, and make quick changes. When you are done, choose Download a Copy and pick Word or PDF: the Word version opens in Microsoft Word or Google Docs, and the PDF keeps the exact layout.",
          tip: 'This is the only free method that gives you true editing on Windows — the others below are for viewing or converting.',
        },
        {
          stepNumber: 2,
          title: 'Extract the embedded PDF preview (no account needed)',
          detail: "Make a copy of the .pages file so the original stays untouched, then rename the copy's extension from .pages to .zip — for example, report.pages becomes report.zip. Right-click the renamed file and choose Extract All. Inside the extracted folder, open the QuickLook folder and double-click Preview.pdf: that is a full-page PDF snapshot of the document, readable in any PDF viewer and printable. You cannot edit the text this way, but for reading a contract, a resume, or a school assignment it takes under a minute and requires no sign-up.",
          tip: 'If the QuickLook folder only has Thumbnail.jpg, that is just a first-page thumbnail — and if Preview.pdf is missing entirely, the author saved without a preview and you will need method 1 or 3.',
        },
        {
          stepNumber: 3,
          title: 'Ask the sender to export as Word or PDF',
          detail: "The simplest fix is often human, not technical: ask the Mac user to open the document in Pages, choose File > Export To, and send you the Word or PDF version instead. It takes them about thirty seconds. A PDF export preserves the layout exactly — fonts, images, page breaks — while a Word export gives you an editable document you can change freely. If you exchange files with this person regularly, suggest they export to Word by default and skip the whole problem.",
          tip: 'PDF for reading and printing exactly as designed; Word when you need to edit the text yourself.',
        },
        {
          stepNumber: 4,
          title: 'Try LibreOffice — but only for old files',
          detail: "LibreOffice, the free office suite, can open Pages documents from iWork '09 and older — but not the modern format used since Pages 5.0 (2013). If your file is old enough, install LibreOffice, choose File > Open, and select the .pages file; it converts the content into an editable document. How do you know which era you have? Try it: if LibreOffice opens the file fine, it was an old-format file. If it shows an error or a blank page, the file is modern and you should use the iCloud method above instead of fighting the converter.",
          tip: 'Do not install LibreOffice just for a modern .pages file — it will not open it. The iCloud method handles every Pages version.',
        },
        {
          stepNumber: 5,
          title: 'Use an online converter (mind the privacy tradeoff)',
          detail: "Websites like CloudConvert and Zamzar convert .pages to .docx or .pdf: upload the file, wait a minute, download the result. It works and needs no account — but the service sees your entire document, so never upload contracts, medical records, financial statements, or anything confidential. For sensitive files, stick to the offline methods above. And remember AnyFileX's own tools run entirely in your browser with nothing uploaded — a good habit is keeping private documents on your own machine whenever you can.",
          tip: 'After downloading your converted file, delete the upload from the service if it offers a delete option.',
        },
      ],
    },
    mac: {
      isSupported: true,
      title: 'Open PAGES files on Mac',
      badge: 'Built-in',
      defaultApp: 'Apple Pages',
      steps: [
        {
          stepNumber: 1,
          title: 'Open with Pages (free)',
          detail: "Pages is a free download from the Mac App Store and comes with most new Macs. Double-click the .pages file and it opens in Pages, ready to read and edit. Pages opens every version of the format, old and new, so this is the zero-friction route.",
        },
        {
          stepNumber: 2,
          title: 'Preview it without Pages',
          detail: "Even without Pages installed, macOS can display the document: drag the .pages file onto the Preview icon in your Dock, or right-click it and choose Open With > Preview. You can read the text, copy passages out, search within it, and print — handy on a borrowed Mac where you cannot install apps.",
        },
        {
          stepNumber: 3,
          title: 'Export a copy for Windows users',
          detail: "If you are the Mac user sending the file, save your Windows friends the trouble: in Pages choose File > Export To and pick Word or PDF before attaching it. One export from you replaces a troubleshooting session for them.",
        },
      ],
    },
    linux: {
      isSupported: true,
      title: 'Open PAGES files on Linux',
      badge: 'Free methods',
      defaultApp: 'Pages for iCloud',
      steps: [
        {
          stepNumber: 1,
          title: 'Use Pages for iCloud in your browser',
          detail: "There is no native Pages app for Linux, but the web version does not care what operating system you run. Sign in at icloud.com with a free Apple ID, open the Pages web app, and upload the .pages file. You get full viewing and editing in Firefox or Chrome, and you can download a Word or PDF copy when finished.",
        },
        {
          stepNumber: 2,
          title: 'LibreOffice handles iWork \'09 files only',
          detail: "Install LibreOffice from your distribution's package manager and use File > Open on the .pages file. This works for documents from iWork '09 and older; modern Pages files will fail to open. If it fails, fall back to the iCloud method above rather than hunting for another converter.",
        },
        {
          stepNumber: 3,
          title: 'Extract the preview from the terminal',
          detail: 'Copy the file, rename the copy from document.pages to document.zip, and extract it. The QuickLook folder inside holds Preview.pdf — a full readable snapshot of the document.',
          command: 'cp document.pages document.zip && unzip document.zip',
          tip: 'Open QuickLook/Preview.pdf after extracting; that is the whole document as a PDF.',
        },
      ],
    },
    ios: {
      isSupported: true,
      title: 'Open PAGES files on iPhone & iPad',
      badge: 'Free',
      defaultApp: 'Apple Pages',
      steps: [
        {
          stepNumber: 1,
          title: 'Install the free Pages app',
          detail: "Download Pages free from the App Store. Then open the .pages file from the Files app, from an email attachment, or from Messages — tap it and choose to open it in Pages. The document opens with full formatting, and you can edit it right there.",
        },
        {
          stepNumber: 2,
          title: 'Open files already in iCloud Drive',
          detail: "If the file is in your iCloud Drive, it appears in the Pages app's document browser automatically. Open it, edit it, and your changes sync to your Mac and to iCloud.com.",
        },
        {
          stepNumber: 3,
          title: 'Share a Windows-friendly copy',
          detail: "To send the document to a Windows user, open it in Pages, tap the Share button, and choose Export — pick PDF for exact layout or Word for editability — then send that file instead of the .pages original.",
        },
      ],
    },
    android: {
      isSupported: true,
      title: 'Open PAGES files on Android',
      badge: 'Free',
      defaultApp: 'Pages for iCloud',
      steps: [
        {
          stepNumber: 1,
          title: 'Open it with Pages for iCloud in Chrome',
          detail: "There is no Pages app for Android, but the web version works in Chrome. Go to icloud.com, sign in with a free Apple ID, open the Pages web app, and upload the .pages file. You can read and edit the document in the browser and download a Word or PDF copy.",
        },
        {
          stepNumber: 2,
          title: 'Convert to Word or PDF first',
          detail: "If the browser route feels clumsy on a small screen, use the iCloud web app once on any computer to download a Word or PDF copy, then move that file to your phone. Word copies open in Google Docs or Microsoft Word for Android; PDFs open anywhere.",
        },
        {
          stepNumber: 3,
          title: 'Extract the preview with a file manager',
          detail: "Many Android file-manager apps can open ZIP archives. Make a copy of the .pages file, rename the copy to end in .zip, and open it with your file manager — then look in the QuickLook folder for Preview.pdf, a full snapshot of the document.",
        },
      ],
    },
  },

  // NOTE: ratings below are placeholders — verify before publishing
  recommendedSoftware: [
    {
      id: 'apple-pages',
      name: 'Apple Pages',
      developer: 'Apple Inc.',
      category: 'Word Processor',
      supportedOS: ['windows', 'mac', 'linux', 'ios', 'android'],
      priceType: 'Free',
      priceText: 'Free; Apple ID required for the iCloud web version',
      rating: 4.7,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.icloud.com',
    },
    {
      id: 'libreoffice',
      name: 'LibreOffice',
      developer: 'The Document Foundation',
      category: 'Office Suite',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      rating: 4.5,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.libreoffice.org',
    },
    {
      id: '7-zip',
      name: '7-Zip',
      developer: 'Igor Pavlov',
      category: 'File Archiver',
      supportedOS: ['windows'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      rating: 4.8,
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: false,
      routeId: 'software',
      websiteUrl: 'https://www.7-zip.org',
    },
  ],

  browserOptions: [
    {
      title: 'Pages for iCloud — the real web version of Pages',
      description: "Sign in at icloud.com with a free Apple ID and open the Pages web app: upload the .pages file, read and edit it in your browser, then download a copy as Word or PDF. This is the only method that gives you genuine Pages editing on Windows or Linux, and it handles every Pages version, old and new.",
      badge: 'Free · Best option',
      actionUrl: 'https://www.icloud.com',
    },
    {
      title: 'Online converters (CloudConvert, Zamzar, and similar)',
      description: "Upload the .pages file and download a .docx or .pdf conversion — fast and no account needed. The tradeoff is privacy: the service sees your whole document, so keep contracts, medical, and financial files off these services and use the offline methods instead.",
      badge: 'Fast · Upload required',
    },
    {
      title: 'Extract the preview offline — no upload at all',
      description: "Rename a copy of the file from .pages to .zip, extract it, and open QuickLook/Preview.pdf. Nothing leaves your computer, nothing is uploaded, and it takes under a minute when you only need to read the document.",
      badge: 'Private · Offline',
    },
  ],

  troubleshooting: [
    {
      id: 'pages-word-gibberish',
      issue: 'Word opens the file as gibberish or refuses it',
      cause: 'Microsoft Word cannot read the Pages format at all. Renaming a .pages file to .docx never works — the inside of the file is not a Word document, so Word shows symbols or an error.',
      diagnostic: 'You renamed the extension to .docx (or Word opened it directly) and see garbage characters or a corruption warning.',
      solution: "Do not rename to .docx. Either open the file in Pages for iCloud and choose Download a Copy > Word to get a genuine Word file, or extract the embedded PDF preview with the rename-to-.zip trick for reading.",
      toolAction: {
        label: 'Identify the true file type',
        route: { view: 'file-identifier' },
      },
    },
    {
      id: 'pages-damaged',
      issue: "'File is damaged' or the rename-to-.zip trick fails",
      cause: 'Three usual culprits: the download was interrupted and the file is incomplete; what you received is a Mac bundle (a folder) copied over as a folder rather than a single .pages archive; or the document is password-protected, which blocks extraction.',
      diagnostic: 'The .zip rename produces an error, the archive will not extract, or the file arrived as a folder instead of a single file.',
      solution: 'Re-download the attachment and confirm the file size looks sane. If it arrived as a folder, ask the sender to compress it to a .zip on their Mac first and resend. For password-protected files you need the password — no trick bypasses it — then open it in Pages for iCloud.',
    },
    {
      id: 'pages-old-format',
      issue: "LibreOffice won't open it or shows a blank page",
      cause: "You have a modern Pages file (Pages 5.0 or newer, from 2013 onward). LibreOffice's Pages support only covers iWork '09 and older documents, so modern files fail or render empty.",
      diagnostic: 'LibreOffice errors out or opens the file blank while the file opens fine on a Mac or in iCloud.',
      solution: 'Use Pages for iCloud instead — it opens every Pages version, old and new. Reserve LibreOffice for genuinely old iWork \'09 files.',
    },
    {
      id: 'pages-layout-shift',
      issue: 'Fonts and layout shifted after converting to Word',
      cause: 'Pages documents often use Apple fonts that do not exist on Windows, so Word substitutes the closest match and text reflows. Complex layouts, text boxes, and precise spacing can also shift during format translation.',
      diagnostic: 'The converted .docx looks mostly right but fonts differ, pages break in new places, or elements moved.',
      solution: 'When the layout must stay pixel-perfect — a resume, a flyer, a contract — export or convert to PDF instead of Word. And always compare the result against the original PDF preview extracted from the .pages file before sending it on.',
    },
  ],

  internalLinks: {
    formatGuideUrl: '/format/pages',
    extensionUrl: '/file-extensions/pages',
    comparisons: [],
    relatedExtensions: [
      { ext: 'DOCX', name: 'Microsoft Word Open XML Document', category: 'Documents' },
      { ext: 'PDF', name: 'Portable Document Format', category: 'Documents' },
      { ext: 'ZIP', name: 'ZIP Compressed Archive', category: 'Archives' },
      { ext: 'ODT', name: 'OpenDocument Text', category: 'Documents' },
    ],
    recommendedTools: [
      {
        name: 'File Identifier',
        slug: 'file-identifier',
        description: "Confirm the file's true type from its signature in your browser — nothing is uploaded.",
      },
      {
        name: 'Magic Byte Detector',
        slug: 'magic-byte-detector',
        description: 'Verify the ZIP signature (50 4B 03 04) that a genuine modern .pages file starts with.',
      },
    ],
  },

  faqs: [
    {
      question: 'Can I open a Pages file on Windows without an Apple ID?',
      answer: "Yes, for reading. Rename a copy of the file from .pages to .zip, extract it, and open QuickLook/Preview.pdf — no account needed. Online converters also work without an Apple ID, but they see your document, so avoid them for sensitive files. If you need to edit the file rather than just read it, the free route is creating an Apple ID (free) and using Pages for iCloud.",
    },
    {
      question: 'Why does Word say my Pages file is corrupt?',
      answer: "It is not corrupt — Word simply cannot read the Pages format. A .pages file is not a Word document in disguise, so opening it in Word (or renaming it to .docx) produces errors or gibberish. Get a genuine Word export instead: open the file in Pages for iCloud and choose Download a Copy > Word, or ask the sender to export it.",
    },
    {
      question: 'Will converting a Pages file to Word keep the formatting?',
      answer: "Mostly, but not perfectly. Text, headings, tables, and images usually survive; Apple-only fonts get substituted on Windows, which can reflow text and shift page breaks. For exact layout fidelity, convert to PDF instead of Word — PDF freezes the design exactly as the author saw it.",
    },
    {
      question: 'Can I edit a Pages file on Windows for free?',
      answer: "Yes. Pages for iCloud at icloud.com is free with an Apple ID and runs in Chrome, Edge, or Firefox — you can edit the document in your browser and download a Word or PDF copy. LibreOffice is a second free option, but only for documents from iWork '09 and older; it cannot open modern Pages files.",
    },
    {
      question: "How do I know if my Pages file is the old or new format?",
      answer: "The practical test: try opening it in LibreOffice. If it opens, it is an iWork '09-era (or older) file; if LibreOffice fails or shows a blank page, it is a modern file from Pages 5.0 onward. Either way, Pages for iCloud opens both — so when in doubt, skip the detective work and use iCloud.",
    },
  ],
},
  psd: {
  extension: 'psd',
  upperExt: 'PSD',
  name: 'Adobe Photoshop Document',
  category: 'Images',

  summary:
    "A .psd file is the native project file of Adobe Photoshop. Instead of one flat picture, it stores the designer's full working state: layers you can move and hide independently, masks that cut shapes without deleting pixels, adjustment layers that change color without touching the original image, text layers, and smart objects. That editable state is what makes PSD the industry's working format — and it's also why the file won't open in a plain photo viewer. The good news: you don't need Photoshop or its subscription to open one. The best free option runs entirely in your browser — Photopea, a web-based editor that opens layered PSD files with layers, masks, blend modes, and even smart objects and adjustment layers preserved. Behind it sit GIMP (the free open-source editor, on Windows, Mac, and Linux), Paint.NET with a free PSD plugin (Windows), and the preview apps already built into your Mac. If you only need the picture, you can also flatten the design to a JPG or PNG without installing anything.",

  whyItIsHardToOpen:
    "A PSD is a project file, not a picture. Where a JPG saves a single grid of pixels — the finished look, nothing more — a PSD saves the ingredients and the recipe: every layer, how the layers blend together, the masks, the adjustment layers, the text with its font settings, the smart objects that hold the original unscaled artwork. That layered recipe is Photoshop's private language, which is why generic viewers either refuse the file or show only a rough guess. To make life easier for everyone else, Photoshop can bake a flattened composite image into the file — a preview of the finished design that other programs can display. That setting is called Maximize PSD and PSB File Compatibility, and it is exactly what macOS Preview, Quick Look, and most lightweight viewers rely on. If the file was saved without it, those one-glance viewers show nothing at all. Free editors like Photopea and GIMP go further by reading the layers themselves, but even they have honest limits: adjustment layers may not behave the way Photoshop renders them, smart objects may lose their editability, and text usually arrives rasterized — converted to plain pixels — because the font settings don't always translate. So the practical rule is this: if you want to look at the design, almost any free method works. If you want to edit the layers, use Photopea in your browser for the best fidelity. And if you later send an edited file back to a Photoshop user, check it looks right first — round-tripping through another editor can shift fine details.",

  inBrowserSupport: {
    supported: true,
    type: 'image',
    note: "PSD files can be parsed right in your browser — Photopea opens full layered PSDs (layers, masks, blend modes, smart objects) at photopea.com with nothing uploaded: everything is processed locally on your device. This is exactly the model AnyFileX uses for its own in-browser file tools.",
  },

  osGuides: {
    windows: {
      isSupported: true,
      title: 'Open PSD files on Windows',
      badge: 'Free methods',
      defaultApp: 'Photopea',
      steps: [
        {
          stepNumber: 1,
          title: 'Open it in your browser with Photopea (recommended)',
          detail: "Go to photopea.com and choose File > Open, then pick your PSD. The file loads with its layer panel, masks, blend modes, and smart objects intact, and the interface closely mirrors Photoshop's layout — tools on the left, layers on the right. Edit what you need, then export to PSD, PNG, or JPG. It is free, needs no account, and processes your file locally on your device rather than uploading it anywhere.",
          tip: 'Photopea does not auto-save — if you close the tab before saving, your work is gone. Save early and save often.',
        },
        {
          stepNumber: 2,
          title: 'Open and edit with GIMP',
          detail: "Install GIMP from gimp.org (also available on the Microsoft Store). Use File > Open and select the PSD — GIMP reads the layered document directly, no plugins needed. Expect pixel layers to come through reliably; adjustment layers and smart objects usually won't behave the way Photoshop renders them, and text layers typically arrive rasterized into plain pixels.",
          tip: "Don't save over the original PSD if you plan to reopen it in Photoshop later — saving through another editor can shift fine details.",
        },
        {
          stepNumber: 3,
          title: 'Use Paint.NET with the PSD plugin',
          detail: "Install Paint.NET from getpaint.net, then add the free PSD plugin: download the plugin's ZIP, copy its PhotoShop.dll file into the FileTypes subfolder of the Paint.NET installation folder (usually C:\\Program Files\\paint.net), and restart Paint.NET. It then opens PSDs with layers and common blend modes — best for RGB images at standard 8-bits-per-channel depth.",
          tip: 'Paint.NET is lighter than GIMP, so it can struggle with very large or complex PSDs — use Photopea or GIMP for those.',
        },
      ],
    },
    mac: {
      isSupported: true,
      title: 'Open PSD files on Mac',
      badge: 'No install needed',
      defaultApp: 'Photopea',
      steps: [
        {
          stepNumber: 1,
          title: 'Peek at it instantly with Quick Look or Preview',
          detail: "Select the PSD in Finder and press the Space bar for an instant Quick Look preview, or double-click to open it in the built-in Preview app. You'll see the design as a flattened image — perfect for checking what a client sent. You can't see or edit individual layers, but for a quick look nothing beats zero installs.",
          tip: 'This only works if Photoshop saved a composite preview inside the file — if you get a blank preview, ask the sender to re-save with Maximize Compatibility enabled.',
        },
        {
          stepNumber: 2,
          title: 'Edit the layers in your browser with Photopea',
          detail: "Open photopea.com in Safari or Chrome and choose File > Open. Photopea loads the full layered document — layers, masks, blend modes, smart objects — with a Photoshop-style interface, entirely in the browser. It processes the file locally on your device, so nothing is uploaded.",
        },
        {
          stepNumber: 3,
          title: 'Convert the preview with Preview itself',
          detail: "With the PSD open in Preview, choose File > Export and pick PNG or JPG as the format. You get a usable flat image for sharing or uploading in about ten seconds.",
          tip: 'This is a one-way trip — the exported file has no layers, so keep the original PSD.',
        },
      ],
    },
    linux: {
      isSupported: true,
      title: 'Open PSD files on Linux',
      badge: 'Free & open source',
      defaultApp: 'GIMP',
      steps: [
        {
          stepNumber: 1,
          title: 'Open it in your browser with Photopea',
          detail: "Go to photopea.com and choose File > Open, then select your PSD. You get the full layered document — layers, masks, blend modes, smart objects — with no installation at all, and the file is processed locally on your device rather than uploaded.",
        },
        {
          stepNumber: 2,
          title: 'Install GIMP from your package manager',
          detail: "GIMP is the free, open-source image editor for Linux — install it from your distribution's package manager or gimp.org. Use File > Open to load the PSD; pixel layers open reliably, while adjustment layers and text may need flattening or rasterizing.",
        },
        {
          stepNumber: 3,
          title: 'Flatten to JPG or PNG for viewing',
          detail: "If you only need the finished picture, convert the PSD to a flattened JPG or PNG — AnyFileX's PSD-to-JPG converter runs entirely in your browser at anyfilex.com/converters/psd-to-jpg.",
          tip: 'Flattening discards the layers, so keep the original PSD for any future edits.',
        },
      ],
    },
    ios: {
      isSupported: true,
      title: 'Open PSD files on iPhone & iPad',
      badge: 'No app needed',
      defaultApp: 'Photopea',
      steps: [
        {
          stepNumber: 1,
          title: 'Open it in your mobile browser with Photopea',
          detail: "In Safari or Chrome on your iPhone or iPad, go to photopea.com and use File > Open to load the PSD. The layers and editing tools work on mobile too, though very large files can feel slow on a phone — give it a moment.",
        },
        {
          stepNumber: 2,
          title: 'Convert to JPG or PNG for quick viewing',
          detail: "For a quick look without editing, convert the PSD to a JPG or PNG first (AnyFileX's PSD-to-JPG converter works in your mobile browser), then open the result in the Photos app like any normal picture.",
          tip: 'The converted image is flattened — keep the original PSD so you can still edit layers later.',
        },
      ],
    },
    android: {
      isSupported: true,
      title: 'Open PSD files on Android',
      badge: 'No app needed',
      defaultApp: 'Photopea',
      steps: [
        {
          stepNumber: 1,
          title: 'Open it in Chrome with Photopea',
          detail: "Go to photopea.com in your Android browser and choose File > Open. The full layered PSD loads with its layers, masks, and blend modes — the interface works on tablets and phones, though a tablet-sized screen is much more comfortable for actual editing.",
        },
        {
          stepNumber: 2,
          title: 'Convert to JPG or PNG for quick viewing',
          detail: "If you just need to see the design, convert the PSD to a JPG or PNG in your browser (AnyFileX's PSD-to-JPG converter runs entirely on-device), then view the result in your phone's gallery app.",
          tip: 'The converted image is flattened — keep the original PSD so you can still edit layers later.',
        },
      ],
    },
  },

  // NOTE: ratings below are placeholders — verify before publishing
  recommendedSoftware: [
    {
      id: 'photopea',
      name: 'Photopea',
      developer: 'Photopea',
      category: 'Online Image Editor',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Free',
      priceText: 'Free in browser, supported by ads',
      rating: 4.5,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.photopea.com',
    },
    {
      id: 'gimp',
      name: 'GIMP',
      developer: 'GIMP',
      category: 'Image Editor',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      rating: 4.6,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.gimp.org',
    },
    {
      id: 'paint-net',
      name: 'Paint.NET',
      developer: 'dotPDN LLC',
      category: 'Image Editor',
      supportedOS: ['windows'],
      priceType: 'Free',
      priceText: 'Free; PSD support via free third-party plugin',
      rating: 4.4,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.getpaint.net',
    },
  ],

  browserOptions: [
    {
      title: 'Photopea — the browser Photoshop',
      description: "Open your PSD at photopea.com with File > Open. Layers, masks, blend modes, smart objects, and adjustment layers load intact, and you can edit and export back to PSD, PNG, or JPG. Free with no account, and your file is processed locally on your device rather than uploaded — this is the same nothing-uploaded model AnyFileX's own tools use.",
      badge: 'Free · No install',
      actionUrl: 'https://www.photopea.com',
    },
    {
      title: 'Flatten it to JPG or PNG in your browser',
      description: "When you only need the finished picture — for sharing, uploading, or previewing — convert the PSD to a flat JPG or PNG. AnyFileX's PSD-to-JPG converter runs entirely in your browser at /converters/psd-to-jpg. Flattening merges the layers into one image, so keep the original PSD for future edits.",
      badge: 'Flattened copy',
    },
    {
      title: 'Preview it in cloud storage',
      description: "If you already use Google Drive or Dropbox, uploading the PSD there usually gives you a quick preview of the design without installing anything. Heads-up: unlike the browser methods above, this does upload your file to someone else's servers.",
      badge: 'Needs upload',
    },
  ],

  troubleshooting: [
    {
      id: 'maximize-compatibility-off',
      issue: "Preview shows nothing, or the file won't preview at all",
      cause: "The file was saved without Maximize Compatibility, so Photoshop never baked a flattened composite image into it — and previews like macOS Quick Look and Preview rely on exactly that.",
      diagnostic: 'Editors like Photopea or GIMP may still open the file, but Quick Look, Preview, and thumbnail views show nothing.',
      solution: "Ask the sender to open the file in Photoshop and set Edit > Preferences > File Handling > Maximize PSD and PSB File Compatibility to Always (or Ask), then re-save. Alternatively, open the file in Photopea and export a copy — the copy will carry a usable preview.",
    },
    {
      id: 'huge-psd-psb',
      issue: 'Very large file behaves badly or refuses to open',
      cause: "Extremely large Photoshop documents are saved as PSB (Large Document Format) rather than PSD, and giant files strain memory in any editor.",
      diagnostic: 'The file is hundreds of megabytes or gigabytes; editors load slowly, run out of memory, or only open a low-resolution preview.',
      solution: 'Open it in Photopea, which is built to handle large PSDs, and work from a smaller proxy if you only need the look. If someone sent you a PSB when a PSD would do, ask them to check the file format and send the right one.',
    },
    {
      id: 'layers-look-wrong',
      issue: 'The design looks different than in Photoshop',
      cause: "Free editors approximate Photoshop-only features: adjustment layers may not render live, smart objects may lose their editability, and text gets rasterized into plain pixels when the fonts or settings don't translate.",
      diagnostic: 'Colors or effects shift, text looks slightly different, or layers that were live filters now appear baked in.',
      solution: "For the closest match, use Photopea, which preserves smart objects and adjustment layers better than desktop free editors. If you're just checking a deliverable, compare against a JPG export from the sender rather than trying to match Photoshop pixel-for-pixel.",
    },
    {
      id: 'cmyk-colors-off',
      issue: 'Colors look wrong, especially in print-ready files',
      cause: 'The PSD is in CMYK color mode (meant for printing), and some free editors are built around RGB for screen work, so colors shift on open.',
      diagnostic: 'Washed-out or shifted colors in a file destined for print, while RGB files look fine in the same app.',
      solution: 'Open it in Photopea, which handles CMYK better than most free editors, and check the colors before sending anything to a printer. For real print work, there is no substitute for seeing the file in Photoshop.',
    },
    {
      id: 'misnamed-psd',
      issue: "The file isn't really a PSD",
      cause: "Files are often mislabeled — a 'design.psd' might actually be a TIFF, a flattened export someone renamed, or even a different file altogether.",
      diagnostic: 'Nothing opens it, or an image viewer opens it without complaint about layers.',
      solution: "Check the file's true signature with a file identifier before picking a method — if it's actually a misnamed TIFF or PNG, every solution gets simpler.",
      toolAction: {
        label: 'Identify the true file type',
        route: { view: 'file-identifier' },
      },
    },
  ],

  internalLinks: {
    formatGuideUrl: '/file-extensions/psd',
    extensionUrl: '/file-extensions/psd',
    comparisons: [
      {
        slug: 'psd-vs-tiff',
        title: 'PSD vs TIFF',
        highlight: 'When to keep the layered PSD versus archiving in the more universally readable TIFF format.',
      },
    ],
    relatedExtensions: [
      { ext: 'TIFF', name: 'Tagged Image File Format', category: 'Images' },
      { ext: 'PNG', name: 'Portable Network Graphics', category: 'Images' },
      { ext: 'JPG', name: 'JPEG Image', category: 'Images' },
    ],
    recommendedTools: [
      {
        name: 'File Identifier',
        slug: 'file-identifier',
        description: "Confirm the file's true type from its signature in your browser — nothing is uploaded.",
      },
      {
        name: 'Magic Byte Detector',
        slug: 'magic-byte-detector',
        description: 'Inspect the raw header bytes to identify the real format behind the extension.',
      },
    ],
  },

  faqs: [
    {
      question: 'Can I open a PSD file without Photoshop?',
      answer: "Yes. The easiest way is Photopea at photopea.com — a free, browser-based editor that opens layered PSDs with layers, masks, blend modes, and smart objects intact, with nothing uploaded. GIMP (Windows/Mac/Linux) and Paint.NET with a free PSD plugin (Windows) are the main free desktop options, and Mac users can preview the design with Quick Look or Preview without installing anything.",
    },
    {
      question: 'Can I edit the layers of a PSD without Photoshop?',
      answer: 'Yes, with limits. Photopea gives you the closest to a real layered editing experience — you can move, hide, and edit layers and export back to PSD. GIMP opens the layer stack too, but adjustment layers and smart objects usually flatten or rasterize, and text layers become plain pixels. For light edits and checking designs, free tools are excellent; for pixel-perfect production work, Photoshop is still the reference.',
    },
    {
      question: "Why does my PSD show a blank preview on my Mac?",
      answer: "macOS Preview and Quick Look display the flattened composite image Photoshop bakes into the file — but only if the sender saved with Maximize Compatibility enabled (Edit > Preferences > File Handling > Maximize PSD and PSB File Compatibility). Without that composite, there is nothing for Preview to show. Open the file in Photopea instead, or ask the sender to re-save with compatibility enabled.",
    },
    {
      question: 'Can I convert a PSD to JPG or PNG?',
      answer: "Yes — this flattens the layers into a single image you can share, upload, or preview anywhere. AnyFileX's PSD-to-JPG converter does it in your browser at /converters/psd-to-jpg. You can also export from Photopea or from macOS Preview. Keep the original PSD, because the flattened copy can't be re-separated into layers.",
    },
    {
      question: 'Is it safe to open a PSD in an online editor?',
      answer: "With Photopea, your file is processed locally on your own device rather than uploaded to a server — the editor runs in your browser tab. Still, as a habit, avoid uploading sensitive design files to random online converters you can't vouch for, and never download 'free PSD viewers' from sketchy download sites.",
    },
  ],
},
};
