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
  numbers: {
  extension: 'numbers',
  upperExt: 'NUMBERS',
  name: 'Apple Numbers Spreadsheet',
  category: 'Spreadsheets',
  mimeType: 'application/zip',
  magicBytesHex: '50 4B 03 04',
  dangerRating: 'Low Risk',

  summary:
    "A .numbers file is a spreadsheet made in Apple Numbers, Apple's spreadsheet app and part of the iWork suite alongside Pages and Keynote. Numbers is free on Mac, iPhone, and iPad — but Apple never released a Windows version, and Microsoft Excel cannot open .numbers files directly. So when a colleague on a Mac emails you a spreadsheet, double-clicking it on a Windows PC usually produces an error or an offer to pick a program that will not actually work. The reliable fixes are all free: open the file in Numbers for iCloud in your browser with a free Apple ID, ask the sender to export an Excel or PDF copy (thirty seconds on their Mac), or convert it with a trusted tool. This guide walks through each method for Windows, Mac, Linux, iPhone, and Android, explains where LibreOffice genuinely helps and where it does not, and shows how to convert to XLSX without mangling formulas. One warning up front, because spreadsheets are different from documents: they often hold payroll figures, client lists, and financial data, so the conversion method you pick matters for privacy as much as for convenience.",

  whyItIsHardToOpen:
    "Numbers files are hard to open on Windows for one simple reason: no native Windows program reads the format, and Excel will not touch it. Double-clicking a .numbers file on a PC typically triggers Excel, which responds with a corruption or invalid-format error — the file is fine, Excel just has no idea what it is. Renaming the extension to .xlsx changes nothing, because the inside of the file is not an Excel workbook. The second complication is version history: like the rest of iWork, the Numbers format has evolved, and third-party support is uneven — LibreOffice can open some Numbers files but fails on many modern ones, which is exactly where people waste an afternoon. What saves you is Apple's own free web app: Numbers for iCloud runs in any modern browser, opens the file properly, and exports a genuine Excel copy. Between that and asking the sender for an export, every Windows user has a free path — the only real decision is which one fits your file and your privacy comfort.",

  inBrowserSupport: {
    supported: false,
    type: 'none',
    note: "No browser renders a .numbers file directly, and Google Sheets cannot open the format either — it must be converted to XLSX first. Use AnyFileX's File Identifier in your browser to confirm the file is genuinely a Numbers spreadsheet, then open it in Numbers for iCloud or convert it with a trusted tool.",
  },

  osGuides: {
    windows: {
      isSupported: true,
      title: 'Open NUMBERS files on Windows',
      badge: 'Free methods',
      defaultApp: 'Numbers for iCloud',
      steps: [
        {
          stepNumber: 1,
          title: 'Open and convert with Numbers for iCloud (best method)',
          detail: "Go to icloud.com in Chrome, Edge, or Firefox and sign in with an Apple ID — creating one is free and takes a couple of minutes. Click the Numbers icon, then upload your .numbers file using the upload button. The spreadsheet opens in the web version of Numbers, where you can view it, edit values, and recalculate. To get an Excel copy, use the download option and choose Excel: Numbers converts the file to a genuine .xlsx workbook you can open in Microsoft Excel, LibreOffice Calc, or Google Sheets. This is the only free method that handles every Numbers version correctly, because it is Apple's own converter doing the work.",
          tip: 'Upload the file once and keep it in iCloud Drive — you can re-export it as Excel, PDF, or CSV any time without re-uploading.',
        },
        {
          stepNumber: 2,
          title: 'Ask the sender to export an Excel or PDF copy',
          detail: "The fastest fix is often human: ask the Mac user to open the spreadsheet in Numbers, choose File > Export To > Excel (or PDF), and send you that instead. It takes them about thirty seconds. An Excel export gives you an editable workbook with formulas mostly intact; a PDF export freezes the layout exactly for reading and printing; a CSV export gives you raw values with no formatting. If you trade spreadsheets with this person regularly, ask them to export to Excel by default and the problem disappears permanently.",
          tip: 'Excel export for editing, PDF for exact layout, CSV when you only need the raw numbers.',
        },
        {
          stepNumber: 3,
          title: 'Try LibreOffice Calc — with honest expectations',
          detail: "LibreOffice is free and its Calc spreadsheet app can open some Numbers files — support for the format was added years ago, but it is incomplete and uneven across Numbers versions. Install LibreOffice, choose File > Open, and select the .numbers file. If your spreadsheet opens with data and formulas intact, you are done. If it errors out, opens blank, or shows a mangled layout, do not keep fighting it: the file is simply too new for LibreOffice's importer, and the iCloud method above will handle it. A practical rule: simple tables often survive LibreOffice; spreadsheets with complex formulas, charts, and interactive elements usually do not.",
          tip: 'Treat LibreOffice as a quick experiment, not a plan — if the first try fails, switch to iCloud instead of troubleshooting the import.',
        },
        {
          stepNumber: 4,
          title: 'Open the converted file in Excel or Google Sheets',
          detail: "Once you have an .xlsx copy (from iCloud, from the sender, or from a converter), open it in Microsoft Excel on Windows, or upload it to Google Drive and open it with Google Sheets for a free browser-based option. Google Sheets cannot open .numbers files directly — the conversion to XLSX must happen first, which is the step people miss. After opening, spot-check a few formula cells: most standard formulas translate cleanly, but Numbers-specific functions may arrive as static values or errors, which you can then fix by hand.",
          tip: 'After conversion, compare totals on a few key rows against the original before trusting the workbook for decisions.',
        },
        {
          stepNumber: 5,
          title: 'Online converters work — but mind what is in the sheet',
          detail: "Websites like CloudConvert and Zamzar convert .numbers to .xlsx or .pdf: upload the file, wait, download the result. It works and needs no account. But stop and think about what spreadsheets contain: budgets, salaries, client lists, invoices, bank details. Uploading that to a stranger's server is a different proposition than converting a holiday photo. For anything with financial or personal data, use the iCloud or sender-export methods above, which keep the file with Apple or on the sender's machine. Reserve upload converters for spreadsheets you would not mind a stranger reading.",
          tip: 'Rule of thumb: if the spreadsheet holds money or names, do not upload it to a random converter.',
        },
      ],
    },
    mac: {
      isSupported: true,
      title: 'Open NUMBERS files on Mac',
      badge: 'Built in',
      defaultApp: 'Apple Numbers',
      steps: [
        {
          stepNumber: 1,
          title: 'Open with Numbers (free)',
          detail: "Numbers is a free download from the Mac App Store and ships with most new Macs. Double-click the .numbers file and it opens with full formatting, formulas, and charts. This is the zero-friction route — if you are on a Mac, you already have everything you need.",
        },
        {
          stepNumber: 2,
          title: 'Export a Windows-friendly copy for others',
          detail: "If you are the Mac user sending the file, save your Windows colleagues the trouble: in Numbers choose File > Export To and pick Excel before attaching it. Excel keeps the workbook editable; PDF freezes the layout for reading; CSV strips it to raw values. One export from you replaces a troubleshooting session for them.",
        },
        {
          stepNumber: 3,
          title: 'Use Numbers for iCloud as a backup',
          detail: "Even on a Mac, the web version at icloud.com is handy when the installed app misbehaves or you are on someone else's machine. Upload the file and work in the browser — no install needed.",
        },
      ],
    },
    linux: {
      isSupported: true,
      title: 'Open NUMBERS files on Linux',
      badge: 'Free methods',
      defaultApp: 'Numbers for iCloud',
      steps: [
        {
          stepNumber: 1,
          title: 'Use Numbers for iCloud in your browser',
          detail: "There is no native Numbers app for Linux, but the web version does not care about your operating system. Sign in at icloud.com with a free Apple ID, open the Numbers web app, and upload the .numbers file. View and edit in Firefox or Chrome, then download an Excel, PDF, or CSV copy when finished.",
        },
        {
          stepNumber: 2,
          title: 'LibreOffice Calc for simple files',
          detail: "Install LibreOffice from your distribution's package manager and use File > Open on the .numbers file. Simple tables may open fine; modern or complex spreadsheets often fail. If it fails, use the iCloud method above rather than hunting for another converter.",
        },
        {
          stepNumber: 3,
          title: 'Google Sheets after conversion',
          detail: "Google Sheets cannot open .numbers directly, but once you have exported an .xlsx copy (via iCloud), upload that to Google Drive and open it in Sheets for free browser-based editing on Linux.",
        },
      ],
    },
    ios: {
      isSupported: true,
      title: 'Open NUMBERS files on iPhone & iPad',
      badge: 'Free',
      defaultApp: 'Apple Numbers',
      steps: [
        {
          stepNumber: 1,
          title: 'Install the free Numbers app',
          detail: "Download Numbers free from the App Store. Open the .numbers file from the Files app, an email attachment, or Messages — tap it and choose Numbers. The spreadsheet opens with full formatting and you can edit it on the spot.",
        },
        {
          stepNumber: 2,
          title: 'Open files already in iCloud Drive',
          detail: "If the file is in your iCloud Drive, it appears in the Numbers app's document browser automatically. Open it, edit it, and changes sync to your Mac and iCloud.com.",
        },
        {
          stepNumber: 3,
          title: 'Send a Windows-friendly copy',
          detail: "To share with a Windows user, open the spreadsheet in Numbers, tap the Share button, and export as Excel, PDF, or CSV — then send that file instead of the .numbers original.",
        },
      ],
    },
    android: {
      isSupported: true,
      title: 'Open NUMBERS files on Android',
      badge: 'Free',
      defaultApp: 'Numbers for iCloud',
      steps: [
        {
          stepNumber: 1,
          title: 'Open it with Numbers for iCloud in Chrome',
          detail: "There is no Numbers app for Android, but the web version works in Chrome. Go to icloud.com, sign in with a free Apple ID, open the Numbers web app, and upload the .numbers file. You can view and edit the spreadsheet in the browser and download an Excel or PDF copy.",
        },
        {
          stepNumber: 2,
          title: 'Convert once, then use Google Sheets',
          detail: "For repeated access on your phone, use the iCloud web app once to download an Excel copy, move that file to Google Drive, and open it in Google Sheets. From then on you have a native-feeling spreadsheet on Android with no further conversion.",
        },
        {
          stepNumber: 3,
          title: 'Ask the sender for an Excel export',
          detail: "The simplest long-term fix: have the Mac user export to Excel before sending. One thirty-second export on their side saves you the conversion dance on every file.",
        },
      ],
    },
  },

  // NOTE: ratings below are placeholders — verify before publishing
  recommendedSoftware: [
    {
      id: 'apple-numbers',
      name: 'Apple Numbers',
      developer: 'Apple Inc.',
      category: 'Spreadsheet',
      supportedOS: ['windows', 'mac', 'linux', 'ios', 'android'],
      priceType: 'Free',
      priceText: 'Free; Apple ID required for the iCloud web version',
      rating: 4.6,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.icloud.com',
    },
    {
      id: 'libreoffice-calc',
      name: 'LibreOffice Calc',
      developer: 'The Document Foundation',
      category: 'Spreadsheet',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      rating: 4.4,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.libreoffice.org',
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      developer: 'Google LLC',
      category: 'Spreadsheet',
      supportedOS: ['windows', 'mac', 'linux', 'ios', 'android'],
      priceType: 'Free',
      priceText: 'Free with a Google account',
      rating: 4.6,
      canOpen: false,
      canView: true,
      canEdit: true,
      canConvert: false,
      routeId: 'software',
      websiteUrl: 'https://sheets.google.com',
    },
  ],

  browserOptions: [
    {
      title: 'Numbers for iCloud — the real web version of Numbers',
      description: "Sign in at icloud.com with a free Apple ID and open the Numbers web app: upload the .numbers file, view and edit it in your browser, then download a copy as Excel, PDF, or CSV. The only free method that handles every Numbers version correctly, because it is Apple's own format doing the conversion.",
      badge: 'Free · Best option',
      actionUrl: 'https://www.icloud.com',
    },
    {
      title: 'Google Sheets — after converting to Excel',
      description: "Google Sheets cannot open .numbers files directly, but it happily opens the .xlsx copy you export from iCloud. Upload that to Google Drive and you have free browser-based spreadsheet editing with no install.",
      badge: 'Free',
      actionUrl: 'https://sheets.google.com',
    },
    {
      title: 'Online converters — check the contents first',
      description: "Upload-to-convert sites handle .numbers to .xlsx fine, but spreadsheets are the worst file type to hand to a stranger's server: budgets, salaries, and client lists are exactly what these files hold. For sensitive sheets, use iCloud or a sender export instead of an upload converter.",
      badge: 'Privacy warning',
    },
  ],

  troubleshooting: [
    {
      id: 'numbers-excel-corrupt',
      issue: 'Excel says the file is corrupt or invalid',
      cause: 'The file is not corrupt — Excel simply cannot read the Numbers format. The error message is misleading: it means "I do not understand this format," not "this file is damaged."',
      diagnostic: 'Double-clicking the .numbers file opens Excel (or prompts you to pick an app) and shows a corruption or invalid-format error.',
      solution: 'Do not try to repair it — convert it instead. Open the file in Numbers for iCloud and download an Excel copy, or ask the sender to export one. The "corrupt" message disappears the moment Excel gets a genuine .xlsx file.',
      toolAction: {
        label: 'Identify the true file type',
        route: { view: 'file-identifier' },
      },
    },
    {
      id: 'numbers-libreoffice-fails',
      issue: "LibreOffice won't open it or shows a mangled sheet",
      cause: "LibreOffice's Numbers importer is incomplete and version-sensitive: simple tables from older Numbers versions often open, while modern files with complex formulas, charts, or interactive elements fail or render badly.",
      diagnostic: 'LibreOffice errors out, opens the file blank, or shows data in the wrong cells while the file opens fine on a Mac or in iCloud.',
      solution: 'Use Numbers for iCloud for that file instead — it handles every Numbers version. Reserve LibreOffice for genuinely simple spreadsheets, and always compare a converted result against the original before trusting it.',
    },
    {
      id: 'numbers-formulas-lost',
      issue: 'Formulas broke or turned into static values after conversion',
      cause: 'Numbers and Excel do not share an identical function library: Numbers-specific functions have no Excel equivalent, so converters either drop them, freeze them as values, or return errors. Complex charts and interactive controls rarely survive translation either.',
      diagnostic: 'Cells that calculated on the Mac now show errors, zeros, or plain numbers in the converted Excel file.',
      solution: 'After converting, scan the formula cells and re-enter any broken ones in Excel syntax. For formula-heavy workbooks, the sender exporting directly from Numbers on their Mac gives the cleanest result — ask for that before re-typing anything yourself.',
    },
    {
      id: 'numbers-icloud-upload-fails',
      issue: 'iCloud refuses the upload or the file will not open there',
      cause: 'The usual culprits: a very large file hitting upload limits, an interrupted upload leaving a partial file, or a damaged download that was incomplete before it ever reached iCloud.',
      diagnostic: 'The upload stalls, errors out, or the file appears in iCloud Drive but will not open in the Numbers web app.',
      solution: 'Re-download the original attachment and check the file size looks sane, then upload again on a stable connection. If a second upload also fails, ask the sender to re-export and resend — the source file itself may be damaged.',
    },
  ],

  internalLinks: {
    // NOTE: /format/* URLs do not exist in the sitemap (verified) — omitted like file 37.
    // /file-extensions/numbers, /how-to-open/pages, /file-extensions/pages verified in sitemap-urls.txt.
    extensionUrl: '/file-extensions/numbers',
    comparisons: [
      {
        slug: 'csv-vs-xlsx',
        title: 'CSV vs XLSX: Which Spreadsheet Format Should You Use?',
        highlight: 'Once converted, pick the right format for the job: editable workbook or raw data.',
      },
    ],
    relatedExtensions: [
      { ext: 'XLSX', name: 'Microsoft Excel Workbook', category: 'Spreadsheets' },
      { ext: 'CSV', name: 'Comma-Separated Values', category: 'Data' },
      { ext: 'PDF', name: 'Portable Document Format', category: 'Documents' },
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
        description: 'Verify the ZIP signature (50 4B 03 04) that a genuine modern .numbers file starts with.',
      },
    ],
  },

  faqs: [
    {
      question: 'Can Microsoft Excel open a Numbers file directly?',
      answer: "No. Excel cannot read the .numbers format — it will show a corruption or invalid-format error, which really means 'I do not understand this file.' Convert the spreadsheet to .xlsx first: the reliable free route is uploading it to Numbers for iCloud and downloading an Excel copy, or asking the sender to export one from their Mac.",
    },
    {
      question: 'Do I need an Apple ID to open a Numbers file on Windows?',
      answer: "Only for the iCloud method. Numbers for iCloud needs a free Apple ID to sign in — creating one takes a couple of minutes and costs nothing. If you would rather not create an account, ask the sender to export an Excel or PDF copy, or try LibreOffice for simple files.",
    },
    {
      question: 'Will converting a Numbers file to Excel keep my formulas?',
      answer: "Mostly, but not always. Standard formulas usually translate cleanly; Numbers-specific functions may arrive as static values or errors, and complex charts or interactive elements often do not survive. After converting, spot-check formula cells against the original before trusting the workbook — and for formula-heavy sheets, ask the sender to export from their Mac for the cleanest result.",
    },
    {
      question: 'Is it safe to upload my Numbers file to an online converter?',
      answer: "Think about what is inside first. Spreadsheets are the most privacy-sensitive common file type — budgets, salaries, client lists, invoices. An upload converter's operator can read all of it. For anything with financial or personal data, use Numbers for iCloud or a sender export instead. Reserve upload converters for spreadsheets you would not mind a stranger reading.",
    },
    {
      question: 'Why does LibreOffice open some Numbers files but not others?',
      answer: "LibreOffice's Numbers support is incomplete and version-sensitive: simple tables, especially from older Numbers versions, often open fine, while modern files with complex formulas, charts, or interactive elements frequently fail. If LibreOffice chokes on your file, that is normal — use Numbers for iCloud, which handles every version.",
    },
  ],
},
  key: {
  extension: 'key',
  upperExt: 'KEY',
  name: 'Apple Keynote Presentation',
  category: 'Presentations',
  mimeType: 'application/zip',
  magicBytesHex: '50 4B 03 04',
  dangerRating: 'Low Risk',

  summary:
    "A .key file is a presentation made in Apple Keynote, Apple's presentation app and part of the iWork suite alongside Pages and Numbers. Keynote is free on Mac, iPhone, and iPad — but Apple never released a Windows version, and Microsoft PowerPoint cannot open .key files directly. So when a Mac user sends you a deck, double-clicking it on a Windows PC usually produces an error or a repair prompt that goes nowhere. The reliable fixes are all free: open the presentation in Keynote for iCloud in your browser with a free Apple ID, ask the sender to export a PowerPoint or PDF copy (thirty seconds on their Mac), or convert it with a trusted tool. This guide walks through each method for Windows, Mac, Linux, iPhone, and Android, explains where LibreOffice genuinely helps and where it does not, and covers what survives the trip to PowerPoint — animations and transitions usually do not. It completes the iWork triangle with our guides to opening Pages and Numbers files on Windows, which share the same playbook.",

  whyItIsHardToOpen:
    "Keynote files are hard to open on Windows for one simple reason: no native Windows program reads the format, and PowerPoint will not touch it. Double-clicking a .key file on a PC typically triggers PowerPoint, which attempts a repair and fails — the file is fine, PowerPoint just has no idea what it is. Renaming the extension to .pptx changes nothing, because the inside of the file is not a PowerPoint deck. The second complication is version history: like the rest of iWork, the Keynote format has evolved, and third-party support is uneven — LibreOffice can open some Keynote files but fails on many modern ones, which is exactly where people waste an afternoon. What saves you is Apple's own free web app: Keynote for iCloud runs in any modern browser, opens the file properly, and exports a genuine PowerPoint copy. Between that and asking the sender for an export, every Windows user has a free path — the only real decision is which one fits your file.",

  inBrowserSupport: {
    supported: false,
    type: 'none',
    note: "No browser renders a .key file directly — no web-based Keynote viewer exists. Use AnyFileX's File Identifier in your browser to confirm the file is genuinely a Keynote presentation, then open it in Keynote for iCloud or convert it with a trusted tool.",
  },

  osGuides: {
    windows: {
      isSupported: true,
      title: 'Open KEY files on Windows',
      badge: 'Free methods',
      defaultApp: 'Keynote for iCloud',
      steps: [
        {
          stepNumber: 1,
          title: 'Open and convert with Keynote for iCloud (best method)',
          detail: "Go to icloud.com in Chrome, Edge, or Firefox and sign in with an Apple ID — creating one is free and takes a couple of minutes. Click the Keynote icon, then upload your .key file using the upload button. The presentation opens in the web version of Keynote, where you can view every slide and even edit it. To get a PowerPoint copy, use the download option and choose PowerPoint: Keynote converts the deck to a genuine .pptx file you can open in Microsoft PowerPoint or Google Slides. This is the only free method that handles every Keynote version correctly, because it is Apple's own converter doing the work.",
          tip: 'Upload once and keep it in iCloud Drive — you can re-export as PowerPoint or PDF any time without re-uploading.',
        },
        {
          stepNumber: 2,
          title: 'Ask the sender to export a PowerPoint or PDF copy',
          detail: "The fastest fix is often human: ask the Mac user to open the presentation in Keynote, choose File > Export To > PowerPoint (or PDF), and send you that instead. It takes them about thirty seconds. A PowerPoint export gives you an editable deck; a PDF export freezes every slide exactly for presenting or printing. If you trade decks with this person regularly, ask them to export to PowerPoint by default and the problem disappears permanently. Exports made directly in Keynote on a Mac also tend to keep formatting more accurately than web conversions.",
          tip: 'PowerPoint export for editing, PDF when the slides must look pixel-perfect.',
        },
        {
          stepNumber: 3,
          title: 'Try Google Slides for a quick view',
          detail: "Google Slides can import some .key files directly: create a new presentation, choose File > Open, switch to the Upload tab, and select the .key file. Slides converts it on the fly and shows you the deck in your browser — no Apple ID needed, just a Google account. It works well enough for reading through slides, though complex transitions, animations, and unusual fonts may not survive. Think of it as the fastest free peek, not the highest-fidelity conversion.",
          tip: 'If Slides mangles the layout, fall back to the iCloud method, which converts more faithfully.',
        },
        {
          stepNumber: 4,
          title: 'Try LibreOffice Impress — with honest expectations',
          detail: "LibreOffice is free and its Impress presentation app can open some Keynote files — but support is incomplete and version-sensitive. Install LibreOffice, choose File > Open, and select the .key file. If the deck opens with slides and text intact, you are done. If it errors out or renders badly, do not keep fighting it: the file is simply too new for LibreOffice's importer, and the iCloud method above will handle it. Simple decks from older Keynote versions fare best; modern decks with fancy transitions and builds usually do not.",
          tip: 'Treat LibreOffice as a quick experiment — if the first try fails, switch to iCloud instead of troubleshooting the import.',
        },
        {
          stepNumber: 5,
          title: 'Online converters work — but watch for confidential decks',
          detail: "Websites like CloudConvert and Zamzar convert .key to .pptx or .pdf: upload the file, wait, download the result. It works and needs no account. But presentations are often the most confidential files people handle — investor decks, sales figures, unreleased product plans, HR reviews. Uploading that to a stranger's server deserves a second thought. For sensitive decks, use the iCloud or sender-export methods above. Reserve upload converters for decks you would not mind a stranger flipping through.",
          tip: 'Rule of thumb: if the deck holds numbers or names you would not post publicly, do not upload it to a random converter.',
        },
      ],
    },
    mac: {
      isSupported: true,
      title: 'Open KEY files on Mac',
      badge: 'Built in',
      defaultApp: 'Apple Keynote',
      steps: [
        {
          stepNumber: 1,
          title: 'Open with Keynote (free)',
          detail: "Keynote is a free download from the Mac App Store and ships with most new Macs. Double-click the .key file and it opens with full slides, transitions, and builds. This is the zero-friction route — if you are on a Mac, you already have everything you need.",
        },
        {
          stepNumber: 2,
          title: 'Export a Windows-friendly copy for others',
          detail: "If you are the Mac user sending the deck, save your Windows colleagues the trouble: in Keynote choose File > Export To and pick PowerPoint or PDF before attaching it. PowerPoint keeps the deck editable; PDF freezes every slide exactly. One export from you replaces a troubleshooting session for them.",
        },
        {
          stepNumber: 3,
          title: 'Use Keynote for iCloud as a backup',
          detail: "Even on a Mac, the web version at icloud.com is handy when the installed app misbehaves or you are on someone else's machine. Upload the file and present or edit in the browser — no install needed.",
        },
      ],
    },
    linux: {
      isSupported: true,
      title: 'Open KEY files on Linux',
      badge: 'Free methods',
      defaultApp: 'Keynote for iCloud',
      steps: [
        {
          stepNumber: 1,
          title: 'Use Keynote for iCloud in your browser',
          detail: "There is no native Keynote app for Linux, but the web version does not care about your operating system. Sign in at icloud.com with a free Apple ID, open the Keynote web app, and upload the .key file. View and edit in Firefox or Chrome, then download a PowerPoint or PDF copy when finished.",
        },
        {
          stepNumber: 2,
          title: 'LibreOffice Impress for simple decks',
          detail: "Install LibreOffice from your distribution's package manager and use File > Open on the .key file. Simple decks may open fine; modern or transition-heavy presentations often fail. If it fails, use the iCloud method above rather than hunting for another converter.",
        },
        {
          stepNumber: 3,
          title: 'Google Slides after upload',
          detail: "Google Slides can import some .key files directly in the browser — create a new presentation, File > Open > Upload, and select the file. Good for a quick read-through on Linux with no installs.",
        },
      ],
    },
    ios: {
      isSupported: true,
      title: 'Open KEY files on iPhone & iPad',
      badge: 'Free',
      defaultApp: 'Apple Keynote',
      steps: [
        {
          stepNumber: 1,
          title: 'Install the free Keynote app',
          detail: "Download Keynote free from the App Store. Open the .key file from the Files app, an email attachment, or Messages — tap it and choose Keynote. The deck opens with full slides, and you can present straight from your phone or iPad.",
        },
        {
          stepNumber: 2,
          title: 'Open files already in iCloud Drive',
          detail: "If the file is in your iCloud Drive, it appears in the Keynote app's document browser automatically. Open it, edit it, and changes sync to your Mac and iCloud.com.",
        },
        {
          stepNumber: 3,
          title: 'Send a Windows-friendly copy',
          detail: "To share with a Windows user, open the deck in Keynote, tap the Share button, and export as PowerPoint or PDF — then send that file instead of the .key original.",
        },
      ],
    },
    android: {
      isSupported: true,
      title: 'Open KEY files on Android',
      badge: 'Free',
      defaultApp: 'Keynote for iCloud',
      steps: [
        {
          stepNumber: 1,
          title: 'Open it with Keynote for iCloud in Chrome',
          detail: "There is no Keynote app for Android, but the web version works in Chrome. Go to icloud.com, sign in with a free Apple ID, open the Keynote web app, and upload the .key file. You can view the slides in the browser and download a PowerPoint or PDF copy.",
        },
        {
          stepNumber: 2,
          title: 'Convert once, then use Google Slides',
          detail: "For repeated access on your phone, use the iCloud web app once to download a PowerPoint copy, move that file to Google Drive, and open it in Google Slides. From then on you have the deck on Android with no further conversion.",
        },
        {
          stepNumber: 3,
          title: 'Ask the sender for a PowerPoint export',
          detail: "The simplest long-term fix: have the Mac user export to PowerPoint before sending. One thirty-second export on their side saves you the conversion dance on every deck.",
        },
      ],
    },
  },

  // NOTE: ratings below are placeholders — verify before publishing
  recommendedSoftware: [
    {
      id: 'apple-keynote',
      name: 'Apple Keynote',
      developer: 'Apple Inc.',
      category: 'Presentation',
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
      id: 'libreoffice-impress',
      name: 'LibreOffice Impress',
      developer: 'The Document Foundation',
      category: 'Presentation',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      rating: 4.3,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.libreoffice.org',
    },
    {
      id: 'google-slides',
      name: 'Google Slides',
      developer: 'Google LLC',
      category: 'Presentation',
      supportedOS: ['windows', 'mac', 'linux', 'ios', 'android'],
      priceType: 'Free',
      priceText: 'Free with a Google account',
      rating: 4.5,
      canOpen: false,
      canView: true,
      canEdit: true,
      canConvert: false,
      routeId: 'software',
      websiteUrl: 'https://slides.google.com',
    },
  ],

  browserOptions: [
    {
      title: 'Keynote for iCloud — the real web version of Keynote',
      description: "Sign in at icloud.com with a free Apple ID and open the Keynote web app: upload the .key file, view and edit it in your browser, then download a copy as PowerPoint or PDF. The only free method that handles every Keynote version correctly, because it is Apple's own format doing the conversion.",
      badge: 'Free · Best option',
      actionUrl: 'https://www.icloud.com',
    },
    {
      title: 'Google Slides — a quick free peek',
      description: "Google Slides can import some .key files directly: new presentation, File > Open > Upload. No Apple ID needed. Good for reading through slides fast, though fancy transitions and unusual fonts may not survive the trip.",
      badge: 'Free',
      actionUrl: 'https://slides.google.com',
    },
    {
      title: 'Online converters — check the contents first',
      description: "Upload-to-convert sites handle .key to .pptx fine, but decks are often the most confidential files people handle — investor numbers, unreleased plans, HR material. For sensitive decks, use iCloud or a sender export instead of an upload converter.",
      badge: 'Privacy warning',
    },
  ],

  troubleshooting: [
    {
      id: 'key-powerpoint-repair-fails',
      issue: 'PowerPoint tries to repair the file and fails',
      cause: 'PowerPoint cannot read the Keynote format at all — the repair attempt is its generic response to any file it does not understand. The file is not broken; it is simply not a PowerPoint deck.',
      diagnostic: 'Double-clicking the .key file opens PowerPoint, which shows a repair dialog and then an error.',
      solution: 'Do not try to repair it — convert it instead. Open the file in Keynote for iCloud and download a PowerPoint copy, or ask the sender to export one. The repair dialog disappears the moment PowerPoint gets a genuine .pptx file.',
      toolAction: {
        label: 'Identify the true file type',
        route: { view: 'file-identifier' },
      },
    },
    {
      id: 'key-libreoffice-fails',
      issue: "LibreOffice won't open it or renders it badly",
      cause: "LibreOffice's Keynote importer is incomplete and version-sensitive: simple decks, especially from older Keynote versions, often open, while modern decks with transitions, builds, and complex layouts frequently fail.",
      diagnostic: 'LibreOffice errors out, opens the deck blank, or shows slides with broken layouts while the file opens fine on a Mac or in iCloud.',
      solution: 'Use Keynote for iCloud for that file instead — it handles every Keynote version. Reserve LibreOffice for simple decks, and always compare the result against the original before presenting from it.',
    },
    {
      id: 'key-animations-lost',
      issue: 'Transitions and animations vanished after conversion',
      cause: 'Keynote and PowerPoint do not share a transition library: Keynote-exclusive effects (Magic Move, Object Cube, and friends) have no PowerPoint equivalent, so converters drop them or substitute the closest match. Fonts unique to macOS get substituted too.',
      diagnostic: 'The converted .pptx opens fine but slides that animated on the Mac now cut instantly, or text looks different.',
      solution: 'If the deck must be presented exactly as designed, export or convert to PDF instead — PDF freezes every slide. When you need an editable file, accept that some effects will not survive and rebuild the key transitions in PowerPoint by hand.',
    },
    {
      id: 'key-icloud-upload-fails',
      issue: 'iCloud refuses the upload or the file will not open there',
      cause: 'The usual culprits: a very large file hitting upload limits, an interrupted upload leaving a partial file, or a damaged download that was incomplete before it ever reached iCloud.',
      diagnostic: 'The upload stalls, errors out, or the file appears in iCloud Drive but will not open in the Keynote web app.',
      solution: 'Re-download the original attachment and check the file size looks sane, then upload again on a stable connection. If a second upload also fails, ask the sender to re-export and resend — the source file itself may be damaged.',
    },
  ],

  internalLinks: {
    // NOTE: /format/* URLs do not exist in the sitemap (verified) — omitted like file 37.
    // /file-extensions/key, /file-extensions/numbers, /file-extensions/pages verified in sitemap-urls.txt.
    extensionUrl: '/file-extensions/key',
    comparisons: [],
    relatedExtensions: [
      { ext: 'PPTX', name: 'Microsoft PowerPoint Presentation', category: 'Presentations' },
      { ext: 'PDF', name: 'Portable Document Format', category: 'Documents' },
      { ext: 'NUMBERS', name: 'Apple Numbers Spreadsheet', category: 'Spreadsheets' },
      { ext: 'PAGES', name: 'Apple Pages Document', category: 'Documents' },
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
        description: 'Verify the ZIP signature (50 4B 03 04) that a genuine modern .key file starts with.',
      },
    ],
  },

  faqs: [
    {
      question: 'Can PowerPoint open a Keynote file directly?',
      answer: "No. PowerPoint cannot read the .key format — it will attempt a repair and fail, which really means 'I do not understand this file.' Convert the deck to .pptx first: the reliable free route is uploading it to Keynote for iCloud and downloading a PowerPoint copy, or asking the sender to export one from their Mac.",
    },
    {
      question: 'Do I need an Apple ID to open a Keynote file on Windows?',
      answer: "Only for the iCloud method. Keynote for iCloud needs a free Apple ID to sign in — creating one takes a couple of minutes and costs nothing. If you would rather not create an account, ask the sender to export a PowerPoint or PDF copy, or try Google Slides for a quick view.",
    },
    {
      question: 'Will converting a Keynote file to PowerPoint keep the animations?',
      answer: "Usually not all of them. Keynote-exclusive transitions and builds have no PowerPoint equivalent, so converters drop them or substitute the closest match, and macOS-only fonts get substituted too. For pixel-perfect presenting, convert to PDF instead — it freezes every slide exactly as designed.",
    },
    {
      question: 'Is it safe to upload my Keynote file to an online converter?',
      answer: "Consider what is in the deck first. Presentations often hold the most confidential material people handle — investor figures, sales data, unreleased plans, HR reviews. An upload converter's operator can read all of it. For sensitive decks, use Keynote for iCloud or a sender export instead. Reserve upload converters for decks you would not mind a stranger flipping through.",
    },
    {
      question: 'Why does LibreOffice open some Keynote files but not others?',
      answer: "LibreOffice's Keynote support is incomplete and version-sensitive: simple decks, especially from older Keynote versions, often open fine, while modern decks with transitions, builds, and complex layouts frequently fail. If LibreOffice chokes on your file, that is normal — use Keynote for iCloud, which handles every version.",
    },
  ],
},
  odt: {
  extension: 'odt',
  upperExt: 'ODT',
  name: 'OpenDocument Text Document',
  category: 'Documents',
  mimeType: 'application/vnd.oasis.opendocument.text',
  magicBytesHex: '50 4B 03 04',
  dangerRating: 'Low Risk',

  summary:
    "An .odt file is a document in OpenDocument Text format — the open, royalty-free standard maintained by OASIS and the default format of LibreOffice Writer. Unlike the iWork formats, ODT is genuinely easy to open without Microsoft Office: LibreOffice opens it natively and free, Google Docs opens it in your browser, and even Microsoft Word itself can open ODT files (Word has supported the format since 2007). So why does anyone search for this? Usually because the file arrived from a LibreOffice or Linux user, double-clicking it opened the wrong program or showed a conversion prompt, or the document looks subtly wrong — fonts shifted, page breaks moved, tracked changes mangled. This guide covers the free ways to open ODT files on Windows, Mac, Linux, iPhone, and Android, explains what ODT actually is under the hood (a ZIP archive of XML files, which matters for recovery), and gives honest formatting-fidelity caveats for each method. Spoiler: for most documents, LibreOffice or Google Docs just works — the edge cases are where the details below earn their keep.",

  whyItIsHardToOpen:
    "ODT files are not hard to open the way iWork files are — the format is an open standard and half a dozen free programs read it. The difficulty is subtler: fidelity and defaults. On a Windows machine with no office suite installed, double-clicking an .odt may open it in the wrong app or trigger a download prompt for software you do not have. If you do have Microsoft Word, it opens ODT — but Word is not the format\'s native home, so complex documents can arrive with shifted fonts, moved page breaks, or mangled tracked changes, and Word warns you when saving back to ODT might drop Word-only features. The second wrinkle is expectation: people assume 'Word didn't open it perfectly, so the file must be broken,' when the file is fine and the converter is the weak link. The fix is picking the right opener for the job — LibreOffice Writer for full fidelity, Google Docs for quick browser access, Word Online for a free Microsoft-flavored route — and knowing which compromises each one makes.",

  inBrowserSupport: {
    supported: true,
    type: 'text',
    note: "Google Docs opens ODT files right in your browser: upload the file to Google Drive, right-click it, and open with Google Docs — it converts to an editable document while preserving most formatting. Word for the web (free with a Microsoft account) opens ODT from OneDrive too.",
  },

  osGuides: {
    windows: {
      isSupported: true,
      title: 'Open ODT files on Windows',
      badge: 'Free methods',
      defaultApp: 'LibreOffice Writer',
      steps: [
        {
          stepNumber: 1,
          title: 'Open with LibreOffice Writer (best fidelity, free)',
          detail: "Download and install LibreOffice — it is free and open source — then double-click the .odt file. ODT is LibreOffice Writer's native format, so this is the reference implementation: full formatting, styles, tables, images, and tracked changes all render as intended. This is the method to use when the document must look exactly right, or when you need to edit and save back to ODT without losing anything.",
          tip: 'If Windows asks which program to use, right-click the file, choose Open with, and pick LibreOffice Writer — then tick "always use this app" to stop the prompt.',
        },
        {
          stepNumber: 2,
          title: 'Open in Google Docs (no install)',
          detail: "Go to Google Drive in your browser, upload the .odt file, right-click it, and choose Open with > Google Docs. Docs converts it into an editable document and preserves most formatting. You can edit it in the browser and download it back as .odt, .docx, or .pdf via File > Download. This is the fastest route when you cannot or do not want to install software — a library computer, a work machine, a borrowed laptop.",
          tip: 'After Docs converts the file, skim through it once before editing — complex layouts sometimes need a touch-up after conversion.',
        },
        {
          stepNumber: 3,
          title: 'Open in Word for the web (free Microsoft route)',
          detail: "Sign in to your Microsoft account, upload the .odt file to OneDrive, and open it with Word for the web. Microsoft's free online Word opens ODT files directly in the browser — handy if you live in the Microsoft ecosystem but do not have desktop Office installed. Like all conversions, very complex formatting may shift slightly, so check the document after opening.",
        },
        {
          stepNumber: 4,
          title: 'Use desktop Word if you already have it',
          detail: "Recent versions of Microsoft Word open ODT files directly: use File > Open and select the file. Word has supported the format for years and handles the current OpenDocument standard reasonably well, including improvements to page numbers, headers, footers, and content controls in newer releases. Expect good — not perfect — fidelity: save a copy as .docx if you plan to keep working in Word, and note that Word warns you when saving back to ODT might drop Word-only features.",
          tip: 'If the layout looks off in Word, try LibreOffice before assuming the file is damaged — the native app is the fairer test.',
        },
        {
          stepNumber: 5,
          title: 'Quick view without editing',
          detail: "If you only need to read the document, lighter options exist: the free 'ODT, ODP, ODS Viewer' Chrome extension opens ODT files (up to size limits) in the browser and can export to PDF, and several free ODT viewer apps show the text without a full office install. Viewers are read-only — fine for checking what the document says, not for editing it.",
          tip: 'For anything you need to change, use one of the full editors above instead of a viewer.',
        },
      ],
    },
    mac: {
      isSupported: true,
      title: 'Open ODT files on Mac',
      badge: 'Free methods',
      defaultApp: 'LibreOffice Writer',
      steps: [
        {
          stepNumber: 1,
          title: 'Open with LibreOffice (free, native)',
          detail: "Download LibreOffice for Mac (available for both Apple silicon and Intel) and double-click the .odt file. As the format's native application, Writer gives you the most faithful rendering and editing on macOS — free.",
        },
        {
          stepNumber: 2,
          title: 'Open in Word for Mac if you have it',
          detail: "Microsoft Word for Mac opens ODT files like the Windows version: File > Open, select the file. Fidelity is good for typical documents; complex layouts may shift slightly.",
        },
        {
          stepNumber: 3,
          title: 'Use Google Docs in the browser',
          detail: "Upload the file to Google Drive and open it with Google Docs — no install, works in Safari or Chrome, and you can download it back as ODT, DOCX, or PDF.",
        },
      ],
    },
    linux: {
      isSupported: true,
      title: 'Open ODT files on Linux',
      badge: 'Built in',
      defaultApp: 'LibreOffice Writer',
      steps: [
        {
          stepNumber: 1,
          title: 'Double-click it — LibreOffice is usually preinstalled',
          detail: "Most Linux desktop distributions ship LibreOffice out of the box, and ODT is its native format. Double-click the file and it opens in Writer with full fidelity. This is the platform where ODT files cause the least trouble by far.",
        },
        {
          stepNumber: 2,
          title: 'Open from the terminal if you prefer',
          detail: "You can also launch Writer directly on the file from a terminal. Replace the path with the actual location of your file on disk.",
          command: 'libreoffice --writer /path/to/document.odt',
          tip: 'Handy when scripting batch conversions or opening files on a headless setup via a remote session.',
        },
        {
          stepNumber: 3,
          title: 'AbiWord for lightweight viewing',
          detail: "If you want something lighter than LibreOffice, AbiWord opens ODT files for quick viewing and editing. It is less complete than Writer on complex layouts, so treat it as a fast reader rather than a full replacement.",
        },
      ],
    },
    ios: {
      isSupported: true,
      title: 'Open ODT files on iPhone & iPad',
      badge: 'Free apps',
      defaultApp: 'Collabora Office',
      steps: [
        {
          stepNumber: 1,
          title: 'Install Collabora Office (best fidelity)',
          detail: "Collabora Office is the LibreOffice-based office suite for iOS, free on the App Store. Open the .odt from the Files app and it renders with desktop-grade fidelity — the highest-quality ODF editing available on iPhone or iPad.",
        },
        {
          stepNumber: 2,
          title: 'Open via Google Docs',
          detail: "Upload the file to Google Drive and open it in the Google Docs app: Docs converts it for editing on the phone. Good for reading and light edits; heavy formatting is better handled in Collabora.",
        },
        {
          stepNumber: 3,
          title: 'Quick view with a document reader',
          detail: "Free ODT reader apps (OpenDocument Reader and similar) open the file for reading when you do not need to edit. Expect formatting and layout to be simplified on small screens — fine for checking content, not for presenting it.",
        },
      ],
    },
    android: {
      isSupported: true,
      title: 'Open ODT files on Android',
      badge: 'Free apps',
      defaultApp: 'Collabora Office',
      steps: [
        {
          stepNumber: 1,
          title: 'Install Collabora Office (best fidelity)',
          detail: "Collabora Office on Android is the LibreOffice-based suite that opens and edits ODT with desktop-grade fidelity. Open the .odt from your file manager or the Files app and edit it properly — the best option on Android by a clear margin.",
        },
        {
          stepNumber: 2,
          title: 'Open via Google Docs',
          detail: "Upload the file to Google Drive and open it in the Google Docs app, which converts it for editing. Convenient and free; complex layouts may simplify.",
        },
        {
          stepNumber: 3,
          title: 'Quick view with OpenDocument Reader',
          detail: "The free OpenDocument Reader app opens ODT files for reading on Android. Formatting may be simplified, so use it for checking content rather than final review.",
        },
      ],
    },
  },

  // NOTE: ratings below are placeholders — verify before publishing
  recommendedSoftware: [
    {
      id: 'libreoffice-writer',
      name: 'LibreOffice Writer',
      developer: 'The Document Foundation',
      category: 'Word Processor',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      rating: 4.6,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.libreoffice.org',
    },
    {
      id: 'google-docs',
      name: 'Google Docs',
      developer: 'Google LLC',
      category: 'Word Processor',
      supportedOS: ['windows', 'mac', 'linux', 'ios', 'android'],
      priceType: 'Free',
      priceText: 'Free with a Google account',
      rating: 4.7,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://docs.google.com',
    },
    {
      id: 'collabora-office',
      name: 'Collabora Office',
      developer: 'Collabora Productivity',
      category: 'Office Suite',
      supportedOS: ['ios', 'android'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      rating: 4.3,
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.collaboraoffice.com',
    },
  ],

  browserOptions: [
    {
      title: 'Google Docs — no install, full editing',
      description: "Upload the .odt to Google Drive, right-click it, and open with Google Docs. It converts to an editable document preserving most formatting, and you can download it back as ODT, DOCX, or PDF. The fastest free route on any computer with a browser.",
      badge: 'Free · Best option',
      actionUrl: 'https://docs.google.com',
    },
    {
      title: 'Word for the web — the free Microsoft route',
      description: "Sign in with a free Microsoft account, upload the ODT to OneDrive, and open it in Word for the web. Handy if you live in the Microsoft ecosystem but do not have desktop Office.",
      badge: 'Free',
      actionUrl: 'https://www.office.com',
    },
    {
      title: 'Chrome ODT viewer extension — read-only peek',
      description: "The free 'ODT, ODP, ODS Viewer' Chrome extension opens ODT files in the browser (within size limits) and can export to PDF. Read-only — fine for checking what a document says, not for editing it.",
      badge: 'Read-only',
    },
  ],

  troubleshooting: [
    {
      id: 'odt-word-formatting-shift',
      issue: 'Word opened it but the formatting shifted',
      cause: 'Word is not the format\'s native home: fonts unavailable on your system get substituted, and complex styles, page breaks, or tracked changes can translate imperfectly. Word also warns when saving back to ODT might drop Word-only features.',
      diagnostic: 'The document opens and is readable, but fonts differ, pages break in new places, or tracked changes look wrong compared to how the sender saw it.',
      solution: 'For the fairest rendering, open the file in LibreOffice Writer — the native application — and compare. If Writer shows it correctly, the file is fine and Word\'s conversion is the weak link. Save a .docx copy if you plan to keep working in Word.',
      toolAction: {
        label: 'Identify the true file type',
        route: { view: 'file-identifier' },
      },
    },
    {
      id: 'odt-wont-open-default',
      issue: 'Double-clicking opens the wrong program or nothing at all',
      cause: 'Windows has no built-in ODT handler, so with no office suite installed the system does not know what to do with the file — it may prompt you to pick an app from the Store or fail silently.',
      diagnostic: 'Double-clicking the .odt shows a "how do you want to open this file" prompt, opens an unrelated app, or does nothing.',
      solution: 'Install LibreOffice (free) and set it as the default for .odt: right-click the file > Open with > choose LibreOffice Writer and tick "always use this app". Alternatively, use Google Docs in the browser with no install at all.',
    },
    {
      id: 'odt-tracked-changes-mangled',
      issue: 'Tracked changes or comments look wrong after opening in Word',
      cause: 'Change-tracking markup is one of the trickier parts of the ODT specification to translate: Word usually preserves the text but can misrender who changed what, or flatten the markup into plain text.',
      diagnostic: 'The document body looks right but the revision history, comment threads, or change colors differ from the original.',
      solution: 'Review tracked changes in LibreOffice Writer, which implements the ODT change-tracking model natively. If you must work in Word, accept its version of the markup and confirm important edits with the document author.',
    },
    {
      id: 'odt-corrupt-or-misnamed',
      issue: 'Nothing opens the file, or it shows binary gibberish',
      cause: 'A genuine ODT is a ZIP archive of XML files — if the download was interrupted, the ZIP structure breaks and no program can open it. Alternatively, the file may be misnamed and not an ODT at all.',
      diagnostic: 'Every program refuses the file, or a text editor shows binary garbage instead of anything readable.',
      solution: "Verify the file starts with the ZIP signature 50 4B 03 04 — if it does not, the file is corrupt or misnamed. Re-download the attachment and check the size looks sane. You can also try opening it with a ZIP tool: a healthy ODT extracts into folders including META-INF and a content.xml.",
    },
  ],

  internalLinks: {
    // NOTE: /format/* URLs do not exist in the sitemap (verified) — omitted like file 37.
    // /file-extensions/odt, /file-extensions/docx, /file-extensions/pdf, /file-extensions/zip verified in sitemap-urls.txt.
    extensionUrl: '/file-extensions/odt',
    comparisons: [],
    relatedExtensions: [
      { ext: 'DOCX', name: 'Microsoft Word Open XML Document', category: 'Documents' },
      { ext: 'PDF', name: 'Portable Document Format', category: 'Documents' },
      { ext: 'ZIP', name: 'ZIP Compressed Archive', category: 'Archives' },
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
        description: 'Verify the ZIP signature (50 4B 03 04) — a genuine ODT starts with those bytes.',
      },
    ],
  },

  faqs: [
    {
      question: 'Can I open an ODT file without Microsoft Office?',
      answer: "Yes — several free options exist. LibreOffice Writer opens ODT natively and is the most faithful choice; Google Docs opens it in your browser after uploading to Google Drive; Word for the web (free with a Microsoft account) opens it from OneDrive. You do not need desktop Office at all.",
    },
    {
      question: 'Will Microsoft Word open an ODT file?',
      answer: "Yes. Word has been able to open ODT files for years, and newer releases handle the current OpenDocument standard reasonably well, including page numbers, headers, footers, and content controls. Expect good but not perfect fidelity — for the most faithful rendering, use LibreOffice Writer.",
    },
    {
      question: 'What is inside an ODT file?',
      answer: "An ODT file is a ZIP archive containing XML files: the document text lives in content.xml, styles in styles.xml, and metadata in META-INF. That is why every genuine ODT starts with the ZIP signature 50 4B 03 04 — and why a healthy ODT can be opened with a ZIP tool to inspect its parts.",
    },
    {
      question: 'Why does my ODT file look different in Word than in LibreOffice?',
      answer: "LibreOffice Writer is the format's native application, so it renders ODT exactly as specified. Word translates the format on open, and font substitution plus style-translation differences can shift the layout. When fidelity matters, trust LibreOffice's rendering over Word's.",
    },
    {
      question: 'Can I convert an ODT file to Word or PDF?',
      answer: "Yes. In LibreOffice choose File > Export or Save As and pick DOCX or PDF; in Google Docs use File > Download after opening. PDF freezes the layout exactly; DOCX keeps it editable. For complex documents, convert from LibreOffice rather than Word for the cleanest result.",
    },
  ],
}
};