// Batch 2: how-to-open rich overrides (ai, dwg, dat, msg) — re-added from the
// original publishing snippets. Spread into FORMAT_SPECIFIC_OVERRIDES in
// howToOpenEngine.ts after HOW_TO_OPEN_BATCH_OCT2026.
import type { HowToOpenGuideData } from './howToOpenEngine';

export const HOW_TO_OPEN_BATCH_OCT2026B: Record<string, Partial<HowToOpenGuideData>> = {
  ai: {
  extension: 'ai',
  upperExt: 'AI',
  name: 'Adobe Illustrator Artwork',
  category: 'Images',

  summary:
    "An .ai file is the native file format of Adobe Illustrator, Adobe's vector graphics editor. Vector files store shapes as mathematical paths instead of pixels, so they scale from a business card to a billboard without losing sharpness — which is why designers deliver logos and artwork as .ai. The catch: Illustrator is subscription-only. The good news is that if you just need to look at a file someone sent you, several free options work, most of them reading the PDF-compatible layer Illustrator embeds by default.",

  whyItIsHardToOpen:
    "Modern AI files (from Illustrator 9 onward) are built on top of the PDF standard — Illustrator saves them with a PDF-compatible stream by default (the \u201cCreate PDF Compatible File\u201d option). That means many PDF viewers and programs can read the artwork even though they can't edit it like Illustrator could. The catch is that files saved with PDF compatibility switched off, or very old EPS-based AI files (Illustrator 8 and earlier), won't cooperate with any free method.",

  inBrowserSupport: {
    supported: true,
    type: 'image',
    note: "AI files saved with PDF compatibility can be previewed right in your browser — open them with the free web-based Photopea editor, or rename a copy to .pdf and view it in any browser's built-in PDF viewer.",
  },

  osGuides: {
    windows: {
      isSupported: true,
      title: 'Open AI files on Windows',
      badge: 'Free methods',
      defaultApp: 'Inkscape',
      steps: [
        {
          stepNumber: 1,
          title: 'Rename a copy to .pdf (fastest)',
          detail: "Copy design.ai, rename the copy to design.pdf, then open it in your browser or any PDF viewer. The artwork appears at full quality — viewable and printable. You can't edit the vectors this way, but for checking a logo or printing a proof it takes ten seconds.",
          tip: 'This only works if the file was saved with PDF compatibility (Illustrator\u2019s default).',
        },
        {
          stepNumber: 2,
          title: 'Open and edit with Inkscape',
          detail: "Download and install Inkscape from inkscape.org. Go to File > Open and select your .ai file (drag-and-drop doesn't work for AI files, so use the menu). An import dialog appears with PDF import settings — accept the defaults and click OK. The artwork opens, fully editable.",
          tip: 'Elements arrive grouped together — press F2 for the Edit Nodes tool, then click individual parts to select them.',
        },
        {
          stepNumber: 3,
          title: 'Use Adobe Acrobat if installed',
          detail: "Open Acrobat and choose File > Open, then browse to your .ai file. Acrobat reads the embedded PDF content, and you can save it as a proper PDF that opens anywhere.",
          tip: 'A good route on office computers that have Acrobat but not Illustrator.',
        },
      ],
    },
    mac: {
      isSupported: true,
      title: 'Open AI files on Mac',
      badge: 'No install needed',
      defaultApp: 'Preview',
      steps: [
        {
          stepNumber: 1,
          title: 'Double-click to open in Preview',
          detail: 'macOS Preview can display AI files saved with PDF compatibility without any changes. Just double-click the file.',
        },
        {
          stepNumber: 2,
          title: 'Edit for free with Inkscape',
          detail: "Install Inkscape for Mac from inkscape.org, then use File > Open (not drag-and-drop) to open the .ai file. Accept the PDF import defaults to get fully editable vectors.",
        },
        {
          stepNumber: 3,
          title: 'View in your browser with Photopea',
          detail: "Go to photopea.com and click File > Open, then select your .ai file. View it, make basic edits, and export to PNG or JPG — no install needed.",
        },
      ],
    },
    linux: {
      isSupported: true,
      title: 'Open AI files on Linux',
      badge: 'Free & open source',
      defaultApp: 'Inkscape',
      steps: [
        {
          stepNumber: 1,
          title: 'Install Inkscape',
          detail: "Install Inkscape from inkscape.org or your distribution's package manager — it's the free, open-source vector editor for Linux.",
        },
        {
          stepNumber: 2,
          title: 'Open via File > Open',
          detail: "Use File > Open and select your .ai file (drag-and-drop doesn't work for AI files). Accept the defaults in the import dialog.",
        },
        {
          stepNumber: 3,
          title: 'Save as SVG or EPS',
          detail: "Inkscape reads the file's PDF or EPS layer, not Illustrator's private editing data, and you can't save back to .ai — save your edited version as SVG or EPS instead.",
          tip: 'Plain paths come through well, but complex gradient meshes and some live effects may look approximate.',
        },
      ],
    },
    ios: {
      isSupported: true,
      title: 'Open AI files on iPhone & iPad',
      badge: 'No app needed',
      defaultApp: 'Files app',
      steps: [
        {
          stepNumber: 1,
          title: 'Rename a copy to .pdf',
          detail: 'Copy the file and rename the copy from design.ai to design.pdf.',
        },
        {
          stepNumber: 2,
          title: 'Open in the Files app',
          detail: "Tap the renamed file to view the artwork at full quality in your phone's built-in viewer — printable and viewable, though not editable.",
        },
      ],
    },
    android: {
      isSupported: true,
      title: 'Open AI files on Android',
      badge: 'No app needed',
      defaultApp: 'Built-in file viewer',
      steps: [
        {
          stepNumber: 1,
          title: 'Rename a copy to .pdf',
          detail: 'Copy the file and rename the copy from design.ai to design.pdf.',
        },
        {
          stepNumber: 2,
          title: "Open in your phone's viewer",
          detail: 'Open the renamed file in your browser or your phone\u2019s built-in PDF viewer to see the artwork at full quality.',
        },
      ],
    },
  },

  recommendedSoftware: [
    {
      id: 'inkscape',
      name: 'Inkscape',
      developer: 'Inkscape Project',
      category: 'Vector Graphics Editor',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://inkscape.org',
    },
    {
      id: 'photopea',
      name: 'Photopea',
      developer: 'Ivan Kutskir',
      category: 'Online Image Editor',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Free',
      priceText: 'Free in browser',
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.photopea.com',
    },
    {
      id: 'adobe-acrobat',
      name: 'Adobe Acrobat',
      developer: 'Adobe Inc.',
      category: 'PDF Reader',
      supportedOS: ['windows', 'mac'],
      priceType: 'Freemium',
      priceText: 'Free Reader; paid Acrobat opens and converts AI files',
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.adobe.com',
    },
  ],

  browserOptions: [
    {
      title: 'Photopea — free online editor',
      description: "Open your .ai file at photopea.com with File > Open. View it, make basic edits, and export to PNG or JPG — no install needed, handy on computers where you can't install programs.",
      badge: 'Free · No install',
      actionUrl: 'https://www.photopea.com',
    },
    {
      title: 'Rename to .pdf and open in your browser',
      description: 'Copy design.ai to design.pdf and open it in any browser — the artwork renders at full quality from the embedded PDF layer. The fastest option when you only need to view or print.',
      badge: 'Fastest',
    },
    {
      title: 'Online AI viewers',
      description: "Web viewers such as imageonline.io's AI viewer open the file in your browser and let you download the artwork as a high-resolution image, artboard by artboard.",
      badge: 'Free',
      actionUrl: 'http://imageonline.io/ai-viewer/',
    },
  ],

  troubleshooting: [
    {
      id: 'legacy-ai-eps',
      issue: "Legacy AI file from Illustrator 8 or older won't open",
      cause: 'Very old AI files are built on EPS rather than PDF, so the rename-to-PDF trick and PDF-based viewers fail.',
      diagnostic: 'Every method above fails; the file may date from Illustrator 8 or earlier.',
      solution: "Open it through Inkscape's EPS import, or ask the sender to re-save the artwork in a modern format.",
    },
    {
      id: 'pdf-compatibility-off',
      issue: 'File saved without PDF compatibility',
      cause: 'The sender unchecked \u201cCreate PDF Compatible File\u201d when saving, which blocks every free method except Illustrator itself.',
      diagnostic: "Rename-to-PDF produces an error and Inkscape/Photopea can't read the file.",
      solution: 'Ask the sender to open the file in Illustrator once and re-save with \u201cCreate PDF Compatible File\u201d checked — a one-minute change for them.',
    },
    {
      id: 'misnamed-ai',
      issue: "The file isn't really an AI file",
      cause: 'Files are often mislabeled — a \u201c.ai\u201d file might actually be a PDF, an EPS, or something else entirely.',
      diagnostic: 'Nothing opens it, or a PDF viewer opens it directly.',
      solution: "Check the file's true signature with a file identifier before picking a method — if it's a misnamed PDF, every solution gets simpler.",
      toolAction: {
        label: 'Identify the true file type',
        route: { view: 'file-identifier' },
      },
    },
  ],

  internalLinks: {
    formatGuideUrl: '/format/ai',
    extensionUrl: '/file-extensions/ai',
    comparisons: [],
    relatedExtensions: [
      { ext: 'SVG', name: 'Scalable Vector Graphics', category: 'Images' },
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
        description: 'Inspect the raw header bytes to identify the real format behind the extension.',
      },
    ],
  },

  faqs: [
    {
      question: 'Can I open an AI file as a PDF?',
      answer: "Usually, yes. If it was saved with \u201cCreate PDF Compatible File\u201d (Illustrator's default), the file is a valid PDF in disguise — rename it from .ai to .pdf and open it in any PDF viewer. Older EPS-based AI files and files saved with compatibility switched off won't work this way.",
    },
    {
      question: "Why won't my AI file open at all?",
      answer: "The most common causes are a legacy file from Illustrator 8 or older, or a file saved without PDF compatibility. Another possibility: the file isn't actually an AI file — check its true type with a file signature tool first.",
    },
    {
      question: 'Can I edit an AI file without Illustrator?',
      answer: "Yes, with limits. Inkscape opens AI files and lets you edit the vectors, but you can't save back to .ai — use SVG or EPS instead. Some effects and gradient meshes may not translate perfectly. For full fidelity, only Illustrator works.",
    },
    {
      question: 'Can I open an AI file on a Mac without installing anything?',
      answer: 'Yes. macOS Preview can display AI files saved with PDF compatibility without any changes. Just double-click the file.',
    },
    {
      question: 'Is an AI file the same as SVG?',
      answer: "No. Both are vector formats, but AI is Adobe's proprietary editing format while SVG is the open W3C web standard that browsers render directly. Convert AI to SVG in Illustrator or Inkscape when you need the artwork on the web.",
    },
  ],
  },
  dwg: {
  extension: 'dwg',
  upperExt: 'DWG',
  name: 'AutoCAD Drawing Database',
  category: 'CAD & 3D',
  mimeType: 'image/vnd.dwg',
  magicBytesHex: '41 43 31 30 (AC10...)',
  dangerRating: 'Medium Risk',

  summary:
    "DWG is the native file format of AutoCAD, Autodesk's industry-standard CAD program for architectural plans, engineering drawings, and technical designs. If a contractor or architect emails you a .dwg file and you don't own AutoCAD, your computer probably won't know what to do with it. You don't need to buy AutoCAD just to look at a drawing — Autodesk itself publishes free viewers, and there are solid open-source alternatives.",

  whyItIsHardToOpen:
    "DWG is Autodesk's proprietary binary CAD format built around complex vector geometries, and Autodesk has published several format variations over the years. Because of that complexity and Autodesk licensing, general graphics software cannot view or render DWG blueprints — you need a specialized CAD viewer. An older or newer DWG variant can also trip up third-party viewers that haven't kept up.",

  inBrowserSupport: {
    supported: true,
    type: 'hex',
    note: "Inspect DWG header versions (AC1032, AC1027, etc.) in-browser with the Magic Byte Detector — or render the full drawing in your browser with Autodesk's free web viewer, no install needed.",
  },

  osGuides: {
    windows: {
      isSupported: true,
      title: 'Open DWG files on Windows',
      badge: 'Best fidelity',
      defaultApp: 'DWG TrueView',
      steps: [
        {
          stepNumber: 1,
          title: "Download DWG TrueView",
          detail: "Download DWG TrueView from Autodesk's official site — it's free, with no subscription.",
        },
        {
          stepNumber: 2,
          title: 'Open your .dwg file',
          detail: 'Install it and open your .dwg file. Pan, zoom, and use the measurement tools to check distances and areas.',
        },
        {
          stepNumber: 3,
          title: 'Plot, print, or batch-convert',
          detail: 'Plot/print the drawing, or batch-convert DWG files to DWF, PDF, or DGN — handy if you need to send someone a viewable copy.',
          tip: "TrueView is view-only (no editing) and Windows-only — Mac users should use the browser viewer or LibreCAD below.",
        },
      ],
    },
    mac: {
      isSupported: true,
      title: 'Open DWG files on Mac',
      badge: 'Free',
      defaultApp: 'LibreCAD',
      steps: [
        {
          stepNumber: 1,
          title: 'Install LibreCAD',
          detail: 'Download LibreCAD from librecad.org and install it — free, open-source, and running natively on macOS. (DWG TrueView has no Mac version.)',
        },
        {
          stepNumber: 2,
          title: 'Open the .dwg directly',
          detail: "Open your .dwg file directly. View, measure, and even make basic edits — it's a real drafting tool, not just a viewer.",
          tip: "LibreCAD is fully offline, so your drawings never leave your machine.",
        },
        {
          stepNumber: 3,
          title: 'Or use the browser-based Autodesk Viewer',
          detail: 'Go to viewer.autodesk.com, create a free Autodesk account, and upload the .dwg. It renders in your browser with pan, zoom, and layer controls.',
          tip: "Don't upload sensitive or confidential plans — uploaded drawings land on Autodesk's servers.",
        },
      ],
    },
    linux: {
      isSupported: true,
      title: 'Open DWG files on Linux',
      badge: 'Free & open source',
      defaultApp: 'LibreCAD',
      steps: [
        {
          stepNumber: 1,
          title: 'Install LibreCAD',
          detail: "Install LibreCAD from librecad.org or your distribution's package manager.",
        },
        {
          stepNumber: 2,
          title: 'Open and work with the drawing',
          detail: 'Open the .dwg file directly to view, measure, and make light edits such as fixing a label or removing an element.',
          tip: 'FreeCAD is another open-source option that can handle DWG viewing, aimed more at 3D parametric modeling.',
        },
      ],
    },
    ios: {
      isSupported: true,
      title: 'Open DWG files on iPhone & iPad',
      badge: 'Free',
      defaultApp: 'Autodesk mobile app',
      steps: [
        {
          stepNumber: 1,
          title: "Use Autodesk's mobile app",
          detail: "Install Autodesk's mobile app to open DWG files on the go — useful for checking a plan on site.",
        },
        {
          stepNumber: 2,
          title: 'Or use the browser viewer',
          detail: 'The browser-based Autodesk Viewer works fine on mobile browsers: open viewer.autodesk.com with a free account and upload the .dwg.',
        },
      ],
    },
    android: {
      isSupported: true,
      title: 'Open DWG files on Android',
      badge: 'Free',
      defaultApp: 'Autodesk mobile app',
      steps: [
        {
          stepNumber: 1,
          title: "Use Autodesk's mobile app",
          detail: "Install Autodesk's mobile app to open DWG files on the go — useful for checking a plan on site.",
        },
        {
          stepNumber: 2,
          title: 'Or use the browser viewer',
          detail: 'The browser-based Autodesk Viewer works fine on mobile browsers: open viewer.autodesk.com with a free account and upload the .dwg.',
        },
      ],
    },
  },

  recommendedSoftware: [
    {
      id: 'dwg-trueview',
      name: 'DWG TrueView',
      developer: 'Autodesk Inc.',
      category: 'CAD Viewer',
      supportedOS: ['windows'],
      priceType: 'Free',
      priceText: 'Free — no subscription',
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://www.autodesk.com',
    },
    {
      id: 'autodesk-viewer',
      name: 'Autodesk Viewer',
      developer: 'Autodesk Inc.',
      category: 'Online CAD Viewer',
      supportedOS: ['windows', 'mac', 'linux', 'android', 'ios'],
      priceType: 'Free',
      priceText: 'Free with Autodesk account',
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: false,
      routeId: 'software',
      websiteUrl: 'https://viewer.autodesk.com',
    },
    {
      id: 'librecad',
      name: 'LibreCAD',
      developer: 'LibreCAD Team',
      category: 'CAD Software',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      canOpen: true,
      canView: true,
      canEdit: true,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://librecad.org',
    },
  ],

  browserOptions: [
    {
      title: 'Autodesk Viewer (official)',
      description: "Autodesk's own web viewer renders DWG plus 80+ other 2D and 3D file types in your browser, with pan, zoom, and layer controls. Requires a free Autodesk account.",
      badge: 'Official · Free',
      actionUrl: 'https://viewer.autodesk.com',
    },
    {
      title: 'ShareCAD and other quick online viewers',
      description: 'Several browser-based viewers open DWG without any account — ShareCAD accepts files up to 50 MB with layer viewing and zoom. Fine for a one-off look at a non-sensitive drawing. Warning: never upload client plans, site drawings, or anything under NDA — uploaded files land on someone else\u2019s server.',
      badge: 'No account needed',
    },
  ],

  troubleshooting: [
    {
      id: 'dwg-version-variant',
      issue: "DWG version variant won't open in third-party viewers",
      cause: 'Autodesk has published several DWG format variations over the years, and an older or newer variant can trip up third-party viewers.',
      diagnostic: 'The file opens in DWG TrueView but not in other viewers.',
      solution: "Use DWG TrueView — being Autodesk's own tool, it handles the widest range of versions — and convert the file there to a friendlier version or to PDF.",
    },
    {
      id: 'misnamed-dwg',
      issue: 'The file might be mislabeled',
      cause: 'The file could be a DXF, DWF, or something else saved with a .dwg extension.',
      diagnostic: 'No viewer recognizes the file at all.',
      solution: "Run a file signature check — AnyFileX's free file identifier does this in your browser with no upload — to confirm it's genuinely a DWG and not a DXF, DWF, or something else.",
      toolAction: {
        label: 'Identify the true file type',
        route: { view: 'file-identifier' },
      },
    },
    {
      id: 'need-editable-or-pdf',
      issue: 'You need an editable or shareable copy',
      cause: 'The free viewers are view-only, and not everyone you share the drawing with has CAD software.',
      diagnostic: 'You can view the drawing but need to edit it or send a viewable copy.',
      solution: 'Ask the sender for a PDF (for viewing and printing) or a DXF (for editing in LibreCAD) — most CAD users can export both in a minute. Or batch-convert to PDF in DWG TrueView and share that; PDFs open on any device and nobody risks editing the original.',
    },
  ],

  internalLinks: {
    formatGuideUrl: '/format/dwg',
    extensionUrl: '/file-extensions/dwg',
    comparisons: [],
    relatedExtensions: [
      { ext: 'PDF', name: 'Portable Document Format', category: 'Documents' },
    ],
    recommendedTools: [
      {
        name: 'File Identifier',
        slug: 'file-identifier',
        description: "Confirm a drawing's true type from its signature in your browser — nothing is uploaded.",
      },
      {
        name: 'Magic Byte Detector',
        slug: 'magic-byte-detector',
        description: 'Inspect DWG header versions and raw binary signatures directly.',
      },
    ],
  },

  faqs: [
    {
      question: 'Is DWG TrueView really free?',
      answer: "Yes. It's free software from Autodesk with no subscription, fully functional for viewing, measuring, plotting, and converting DWG files. It is view-only — you can't edit drawings with it — and it's Windows-only.",
    },
    {
      question: 'Can I open a DWG file on a Mac?',
      answer: "Yes. Use the browser-based Autodesk Viewer, or install LibreCAD, which is free, open source, and runs natively on macOS. DWG TrueView doesn't have a Mac version.",
    },
    {
      question: 'Can I measure distances in a free DWG viewer?',
      answer: "Yes. DWG TrueView includes measurement tools for length, area, and angle checks, and LibreCAD has measuring tools too. Accuracy depends on the file's scale being set correctly.",
    },
    {
      question: 'Can I edit a DWG file without AutoCAD?',
      answer: 'Light editing is possible with free tools like LibreCAD (2D drafting) or FreeCAD. For serious CAD work, professional tools are needed — but for viewing, measuring, printing, and converting, the free options are enough.',
    },
    {
      question: 'Is it safe to use an online DWG viewer?',
      answer: "For harmless, non-sensitive drawings, yes. For anything confidential — client plans, site layouts, proprietary designs — no. Uploaded files land on someone else's server. Use an offline viewer like DWG TrueView or LibreCAD instead.",
    },
  ],
  },
  dat: {
  extension: 'dat',
  upperExt: 'DAT',
  name: 'Generic Data File',
  category: 'System & Executables',
  mimeType: 'application/octet-stream',
  magicBytesHex: 'Varies by application signature',
  dangerRating: 'Medium Risk',

  summary:
    "A file ending in .dat is a mystery by design. Unlike .jpg or .pdf, the .dat extension doesn't describe a format — it's short for \u201cdata,\u201d and practically any program can create a .dat file to store anything: text, images, video, settings, database records. That means there is no single program that \u201copens DAT files.\u201d The trick is figuring out what's actually inside yours, then opening it with the right tool.",

  whyItIsHardToOpen:
    "DAT is a generic file extension used by thousands of unrelated applications — Microsoft Outlook winmail.dat attachments, VCD video streams, game save databases, proprietary binary caches. Without knowing the creating application or inspecting the file's magic bytes, standard operating systems do not know which program to associate, so double-clicking a .dat usually does nothing useful.",

  inBrowserSupport: {
    supported: true,
    type: 'hex',
    note: "Run your .dat through AnyFileX's free file identifier — it checks the file's signature right in your browser with nothing uploaded — then inspect the raw header bytes with the Magic Byte Detector if the real format is still unclear.",
  },

  osGuides: {
    windows: {
      isSupported: true,
      title: 'Open DAT files on Windows',
      badge: 'Identify first',
      defaultApp: 'Notepad',
      steps: [
        {
          stepNumber: 1,
          title: "Find out what's really inside",
          detail: "Run the .dat through AnyFileX's free file identifier in your browser — it reads the file's signature and tells you what the file really is, even if it's misnamed. If it turns out to be a renamed MP4, PDF, or ZIP, you'll know exactly which program to open it with.",
          tip: 'Guessing wastes time — a signature check first saves the trial and error.',
        },
        {
          stepNumber: 2,
          title: 'Try a text editor',
          detail: 'Right-click the .dat file, choose Open with, and pick Notepad — or a better free editor like Notepad++ or VS Code for structured text such as JSON or XML. Readable text? Done — you\u2019ve accessed the raw data.',
        },
        {
          stepNumber: 3,
          title: "If it's gibberish, try VLC",
          detail: "A wall of random symbols means the file isn't text — it's binary. Try VLC Media Player, which plays almost anything (older video software stored video files as .dat). Look for readable hints in the gibberish — words like \u201cMP4\u201d, \u201cExif\u201d, or \u201c%PDF\u201d reveal the true format.",
        },
        {
          stepNumber: 4,
          title: 'Use the rename trick',
          detail: 'In File Explorer enable View > Show > File name extensions, then rename file.dat to file.mp4, file.pdf, or whatever the true format is. The extension is just a label — the file\u2019s content never changes.',
          tip: 'Make a copy first so you can always revert.',
        },
      ],
    },
    mac: {
      isSupported: true,
      title: 'Open DAT files on Mac',
      badge: 'Identify first',
      defaultApp: 'TextEdit',
      steps: [
        {
          stepNumber: 1,
          title: "Find out what's really inside",
          detail: "Run the .dat through AnyFileX's free file identifier in your browser to learn what the file really is before picking an app.",
        },
        {
          stepNumber: 2,
          title: 'Try TextEdit for text, VLC for media',
          detail: 'Text DAT files open in TextEdit; media files play in VLC, which is free for Mac. If you see readable text mixed with junk characters, a code editor like VS Code renders it more legibly than TextEdit.',
        },
        {
          stepNumber: 3,
          title: 'winmail.dat attachments: use Klammer',
          detail: 'If the file is winmail.dat from an email, the free Klammer app from the App Store opens it and extracts the real attachments with their proper names and formats.',
        },
      ],
    },
    linux: {
      isSupported: true,
      title: 'Open DAT files on Linux',
      badge: 'Identify first',
      defaultApp: 'Text editor',
      steps: [
        {
          stepNumber: 1,
          title: "Find out what's really inside",
          detail: "Run the .dat through AnyFileX's free file identifier in your browser — the check happens locally with nothing uploaded.",
        },
        {
          stepNumber: 2,
          title: 'Try a text editor',
          detail: "Open the file with your distribution's text editor or VS Code to check for readable text or structured data.",
        },
        {
          stepNumber: 3,
          title: 'Try VLC for media',
          detail: 'If the file is binary gibberish in a text editor, try VLC Media Player — it handles most media containers regardless of the .dat label.',
        },
      ],
    },
    ios: {
      isSupported: true,
      title: 'Open DAT files on iPhone & iPad',
      badge: 'Browser-based',
      defaultApp: 'Safari / browser',
      steps: [
        {
          stepNumber: 1,
          title: 'Identify it in your mobile browser',
          detail: "Open AnyFileX's free file identifier in Safari — the signature check runs entirely in your browser with nothing uploaded — to learn what the .dat really is.",
        },
        {
          stepNumber: 2,
          title: 'Rename and open',
          detail: "If it's a renamed PDF, image, or video, rename the extension to match and open it with the iPhone's built-in viewer.",
        },
      ],
    },
    android: {
      isSupported: true,
      title: 'Open DAT files on Android',
      badge: 'Browser-based',
      defaultApp: 'Chrome / browser',
      steps: [
        {
          stepNumber: 1,
          title: 'Identify it in your mobile browser',
          detail: "Open AnyFileX's free file identifier in Chrome — the signature check runs entirely in your browser with nothing uploaded — to learn what the .dat really is.",
        },
        {
          stepNumber: 2,
          title: 'Rename and open',
          detail: "If it's a renamed PDF, image, or video, rename the extension to match and open it with Android's built-in viewer.",
        },
      ],
    },
  },

  recommendedSoftware: [
    {
      id: 'vlc-media-player',
      name: 'VLC Media Player',
      developer: 'VideoLAN',
      category: 'Media Player',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: false,
      routeId: 'software',
      websiteUrl: 'https://www.videolan.org',
    },
    {
      id: 'klamper',
      name: 'Klammer',
      developer: 'Klammer',
      category: 'Email Attachment Opener',
      supportedOS: ['mac'],
      priceType: 'Free',
      priceText: 'Free on the Mac App Store',
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: false,
      routeId: 'software',
      websiteUrl: 'https://apps.apple.com',
    },
    {
      id: 'winmaildat',
      name: 'winmaildat.com',
      developer: 'winmaildat.com',
      category: 'Online Extraction Tool',
      supportedOS: ['windows', 'mac', 'linux', 'android', 'ios'],
      priceType: 'Free',
      priceText: 'Free online (50 MB limit)',
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://winmaildat.com',
    },
  ],

  browserOptions: [
    {
      title: 'winmaildat.com — extract winmail.dat attachments',
      description: 'Save the winmail.dat file to your computer and upload it to winmaildat.com (free, no sign-up) to extract the real attachments with their proper names and formats.',
      badge: 'Free · 50 MB limit',
      actionUrl: 'https://winmaildat.com',
    },
  ],

  troubleshooting: [
    {
      id: 'dat-gibberish',
      issue: 'DAT file shows gibberish in Notepad',
      cause: "The file isn't text — it's binary data like video, audio, or an image.",
      diagnostic: 'A wall of random symbols when opened in a text editor.',
      solution: 'Check its true type with a signature checker, then open it with the matching program (VLC for media) instead of a text editor. Readable hints in the gibberish — \u201cMP4\u201d, \u201cExif\u201d, \u201c%PDF\u201d — reveal the real format; rename the extension to match and it will usually open.',
      toolAction: {
        label: 'Detect the true file type',
        route: { view: 'file-identifier' },
      },
    },
    {
      id: 'dat-unidentifiable',
      issue: "You can't tell what the DAT file is",
      cause: 'The file is binary, the signature check is inconclusive, and renaming does nothing.',
      diagnostic: 'None of the guesses work.',
      solution: "Look at the file's context — a DAT next to a game save is game data, one in an email is an attachment, one in a program's install folder is app data; location is often the best clue. Check the file size (a 2 KB DAT is probably settings or text; a 50 MB DAT is probably media or a database), inspect the signature directly, or ask the sender what program made the file.",
      toolAction: {
        label: 'Inspect magic bytes',
        route: { view: 'magic-byte-detector' },
      },
    },
    {
      id: 'dat-winmail',
      issue: 'Email attachment named winmail.dat (or ATT00001.dat)',
      cause: "The sender used Microsoft Outlook's rich-text format (TNEF), which your mail client can't decode — the real attachments are trapped inside the winmail.dat wrapper.",
      diagnostic: 'You received winmail.dat instead of the actual documents.',
      solution: 'Extract the real attachments with winmaildat.com or the Klammer app on Mac. To stop it recurring, ask the Outlook user to switch their message format from Rich Text to HTML or Plain Text — that stops winmail.dat from being generated.',
    },
    {
      id: 'dat-leave-alone',
      issue: 'Should you even open this DAT file?',
      cause: "Many .dat files belong to programs and games — settings, save data, cached assets — and were never meant to be opened by hand.",
      diagnostic: 'The DAT sits inside a program folder and everything works fine.',
      solution: "The correct action is no action: don't edit a game's data file or an app's config — changing a byte can corrupt the software. Only open DAT files you received from someone, downloaded, or are troubleshooting.",
    },
  ],

  internalLinks: {
    formatGuideUrl: '/format/dat',
    extensionUrl: '/file-extensions/dat',
    comparisons: [],
    relatedExtensions: [
      { ext: 'ZIP', name: 'ZIP Compressed Archive', category: 'Archives' },
      { ext: 'PDF', name: 'Portable Document Format', category: 'Documents' },
      { ext: 'MP4', name: 'MPEG-4 Part 14 Video File', category: 'Audio & Video' },
    ],
    recommendedTools: [
      {
        name: 'File Identifier',
        slug: 'file-identifier',
        description: "Identify a mystery DAT file's true type from its signature — in your browser, nothing uploaded.",
      },
      {
        name: 'Magic Byte Detector',
        slug: 'magic-byte-detector',
        description: "Inspect the file's raw header bytes when the signature check is inconclusive.",
      },
    ],
  },

  faqs: [
    {
      question: 'How do I open a DAT file on a Mac?',
      answer: 'The same logic applies: identify the contents first, then use the right app. Text DAT files open in TextEdit, media in VLC (free for Mac), and winmail.dat attachments in the Klammer app. macOS\u2019s built-in tools cover most cases.',
    },
    {
      question: 'What is winmail.dat and why did I get one?',
      answer: "It's an email attachment created when Microsoft Outlook sends a message in its rich-text (TNEF) format to a mail client that can't decode it. The real attachments are bundled inside. Extract them with winmaildat.com or the Klammer app on Mac.",
    },
    {
      question: 'Why is my DAT file gibberish in Notepad?',
      answer: "Because it's not a text file — it's binary data like video, audio, or an image. Check its true type with a signature checker, then open it with the matching program instead of a text editor.",
    },
    {
      question: 'Can a DAT file be a virus?',
      answer: "A .dat file is just data, and data alone can't run. But malware can hide inside any download, so scan files from untrusted sources with your antivirus before opening them — the same rule as for any file type.",
    },
    {
      question: 'Should I delete DAT files I find on my computer?',
      answer: "Not unless you know what they are. DAT files inside program folders usually belong to installed software; deleting them can break the program. Only remove DAT files you're sure are leftovers.",
    },
  ],
  },
  msg: {
  extension: 'msg',
  upperExt: 'MSG',
  name: 'Outlook Mail Message',
  category: 'Email & Comm',
  mimeType: 'application/vnd.ms-outlook',
  magicBytesHex: 'D0 CF 11 E0 A1 B1 1A E1',
  dangerRating: 'Medium Risk',

  summary:
    "An .msg file is a saved email from Microsoft Outlook — the message body, sender, date, and attachments bundled into one binary file. Outlook stores it in a format built on Microsoft's OLE compound document structure, which is why only Outlook (and tools that understand that format) can read it properly. If you don't have Outlook — a Mac user, a Linux user, or a Windows user without a Microsoft 365 subscription — you can still read the message. Some methods show just the text; the better ones recover attachments too.",

  whyItIsHardToOpen:
    "MSG is Microsoft Outlook's proprietary binary format built on the OLE compound document structure — unlike the open EML standard most other clients use, only Outlook and specialized tools can parse it properly. Some guides suggest simply renaming .msg to .eml, which occasionally works because clients key off the extension, but it often fails to render the body or attachments properly — treat it as a gamble, not a solution.",

  inBrowserSupport: {
    supported: true,
    type: 'hex',
    note: "Verify the OLE compound-document signature (D0 CF 11 E0\u2026) in-browser with the Magic Byte Detector — then convert offline with a free tool to read the message and rescue attachments.",
  },

  osGuides: {
    windows: {
      isSupported: true,
      title: 'Open MSG files on Windows',
      badge: 'Free',
      defaultApp: 'Mozilla Thunderbird',
      steps: [
        {
          stepNumber: 1,
          title: 'Quick peek: rename a copy to .txt',
          detail: 'Copy the .msg file (keep the original untouched), rename the copy from email.msg to email.txt, and open it in Notepad. You\u2019ll see the message headers, sender, subject, and the plain text of the body mixed with formatting codes. It works because MSG files store their text as readable strings inside the binary wrapper.',
          tip: 'You get no formatting and no attachments this way — fine when you just need to read what someone wrote.',
        },
        {
          stepNumber: 2,
          title: 'Convert MSG to EML with extract-msg',
          detail: 'Install with pip install extract-msg, then run python -m extract_msg email.msg. It creates a folder with the message content and extracts the attachments alongside it — attachments intact, which the rename tricks can\u2019t do.',
          command: 'python -m extract_msg email.msg',
          tip: 'For a batch of MSG files (a legal archive, an old mailbox export), convert a small sample of 3\u20134 files first and spot-check before running the full batch.',
        },
        {
          stepNumber: 3,
          title: 'Open the .eml in Thunderbird',
          detail: 'Install Thunderbird (no email account setup needed for this), then drag the .eml file into a Thunderbird local folder or double-click it. The message renders with sender, date, body, and attachments intact.',
        },
      ],
    },
    mac: {
      isSupported: true,
      title: 'Open MSG files on Mac',
      badge: 'Free',
      defaultApp: 'SeaMonkey',
      steps: [
        {
          stepNumber: 1,
          title: 'Install SeaMonkey',
          detail: "Install SeaMonkey on your Mac — one of the few genuinely free graphical routes on macOS, since Apple Mail itself doesn't open .msg files.",
        },
        {
          stepNumber: 2,
          title: 'Open Mail & Newsgroups',
          detail: 'Choose Window > Mail & Newsgroups and cancel the new-account prompt.',
        },
        {
          stepNumber: 3,
          title: 'Open the .msg file',
          detail: 'Choose File > Open File and select your .msg file.',
        },
        {
          stepNumber: 4,
          title: 'Alternative: convert with extract-msg',
          detail: 'For attachment-preserving conversion, install extract-msg (pip install extract-msg), run python -m extract_msg email.msg, and open the resulting .eml in Thunderbird or Apple Mail.',
        },
      ],
    },
    linux: {
      isSupported: true,
      title: 'Open MSG files on Linux',
      badge: 'Free & open source',
      defaultApp: 'Thunderbird',
      steps: [
        {
          stepNumber: 1,
          title: 'Install msgconvert',
          detail: 'Install the Email::Outlook::Message Perl module — on Debian/Ubuntu via apt.',
          command: 'sudo apt-get install libemail-outlook-message-perl',
        },
        {
          stepNumber: 2,
          title: 'Convert MSG to EML',
          detail: 'Run msgconvert email.msg to produce email.eml with attachments intact. You can convert an entire directory of MSG files to EML in one run.',
          command: 'msgconvert email.msg',
          tip: 'Batch-friendly: point it at a whole folder of MSG files, then import the folder into Thunderbird\u2019s local folders.',
        },
        {
          stepNumber: 3,
          title: 'Import into Thunderbird',
          detail: "Import the converted EML folder into Thunderbird's local folders and browse the messages like a normal mailbox — you can even reply from there.",
        },
      ],
    },
    ios: {
      isSupported: false,
      title: 'Open MSG files on iPhone & iPad',
      badge: 'Convert on desktop first',
      defaultApp: 'Files app',
      steps: [
        {
          stepNumber: 1,
          title: 'Convert on a desktop first',
          detail: 'iOS has no native MSG reader and Gmail offers no MSG preview. Convert the message on a computer with extract-msg or msgconvert first.',
        },
        {
          stepNumber: 2,
          title: 'Transfer the converted file',
          detail: 'Move the resulting EML or PDF to your iPhone.',
        },
        {
          stepNumber: 3,
          title: 'Open it natively',
          detail: 'EML files open in most mobile mail apps; PDFs open directly in the Files app.',
        },
      ],
    },
    android: {
      isSupported: false,
      title: 'Open MSG files on Android',
      badge: 'Convert on desktop first',
      defaultApp: 'Files app',
      steps: [
        {
          stepNumber: 1,
          title: 'Convert on a desktop first',
          detail: 'Android has no native MSG reader and Gmail offers no MSG preview. Convert the message on a computer with extract-msg or msgconvert first.',
        },
        {
          stepNumber: 2,
          title: 'Transfer the converted file',
          detail: 'Move the resulting EML or PDF to your phone.',
        },
        {
          stepNumber: 3,
          title: 'Open it natively',
          detail: "EML files open in most mobile mail apps; PDFs open in Android's built-in viewer.",
        },
      ],
    },
  },

  recommendedSoftware: [
    {
      id: 'thunderbird',
      name: 'Mozilla Thunderbird',
      developer: 'Mozilla Foundation',
      category: 'Email Client',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: false,
      routeId: 'software',
      websiteUrl: 'https://www.thunderbird.net',
    },
    {
      id: 'extract-msg',
      name: 'extract-msg',
      developer: 'TeamMsgExtractor',
      category: 'Command-line Converter',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      canOpen: true,
      canView: false,
      canEdit: false,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://github.com/TeamMsgExtractor/msg-extractor',
    },
    {
      id: 'msgconvert',
      name: 'msgconvert',
      developer: 'Email::Outlook::Message Project',
      category: 'Command-line Converter',
      supportedOS: ['windows', 'mac', 'linux'],
      priceType: 'Open Source',
      priceText: 'Free & open source',
      canOpen: true,
      canView: false,
      canEdit: false,
      canConvert: true,
      routeId: 'software',
      websiteUrl: 'https://metacpan.org/pod/Email::Outlook::Message',
    },
    {
      id: 'seamonkey',
      name: 'SeaMonkey',
      developer: 'SeaMonkey Project',
      category: 'Email Client',
      supportedOS: ['mac'],
      priceType: 'Free',
      priceText: 'Free download',
      canOpen: true,
      canView: true,
      canEdit: false,
      canConvert: false,
      routeId: 'software',
      websiteUrl: 'https://www.seamonkey-project.org',
    },
  ],

  browserOptions: [
    {
      title: 'Online MSG viewers',
      description: "Plenty of websites offer to open MSG files in your browser, and they work — but an MSG file is someone's email: it can contain personal details, business negotiations, account numbers, or credentials. Rule: harmless, non-sensitive message? An online viewer is fine. Anything work-related or confidential? Keep it on your own machine with one of the offline methods above.",
      badge: 'Use with caution',
    },
  ],

  troubleshooting: [
    {
      id: 'msg-no-attachments',
      issue: "You can't see the attachments",
      cause: "The method you used only reads the message text — renaming tricks expose text, not attachments, which are stored inside the MSG in a way plain text can't show.",
      diagnostic: 'Body text is visible but attached files are missing.',
      solution: 'Use a converter like msgconvert or extract-msg to get the files out intact.',
    },
    {
      id: 'msg-rename-eml-fails',
      issue: 'Renaming .msg to .eml didn\u2019t render properly',
      cause: "Mail clients key off the extension, but MSG's binary OLE structure isn't EML — the body or attachments often fail to render.",
      diagnostic: 'The renamed file opens but shows a broken body or missing attachments.',
      solution: 'Convert properly instead: run msgconvert email.msg or python -m extract_msg email.msg, then open the resulting .eml in Thunderbird.',
    },
    {
      id: 'msg-gmail',
      issue: "Gmail won't preview the MSG file",
      cause: 'Gmail has no built-in MSG preview.',
      diagnostic: 'Uploading or attaching the .msg in Gmail shows no preview.',
      solution: 'Convert the message to PDF or plain text first (extract-msg can produce readable output), then view or attach that instead.',
    },
    {
      id: 'msg-safety',
      issue: 'Unexpected MSG file from an unknown sender',
      cause: 'MSG files come from email and deserve the same caution as any unexpected attachment.',
      diagnostic: "You weren't expecting this file.",
      solution: "Don't open files from senders you don't recognize, and scan downloads with your antivirus. The methods above are for reading messages you were expecting.",
    },
  ],

  internalLinks: {
    formatGuideUrl: '/format/msg',
    extensionUrl: '/file-extensions/msg',
    comparisons: [],
    relatedExtensions: [
      { ext: 'EML', name: 'RFC 822 Email Message Archive', category: 'Email & Comm' },
      { ext: 'PDF', name: 'Portable Document Format', category: 'Documents' },
    ],
    recommendedTools: [
      {
        name: 'File Identifier',
        slug: 'file-identifier',
        description: "Confirm a mystery file's true type from its signature in your browser — nothing is uploaded.",
      },
      {
        name: 'Magic Byte Detector',
        slug: 'magic-byte-detector',
        description: 'Verify the OLE compound-document signature (D0 CF 11 E0\u2026) directly.',
      },
    ],
  },

  faqs: [
    {
      question: 'Can I open an MSG file without Outlook?',
      answer: "Yes. For a quick text read, rename a copy of the file to .txt and open it in Notepad. For a clean copy with formatting and attachments, convert it to EML with free tools like msgconvert or extract-msg and open the result in Thunderbird — none of which needs Outlook.",
    },
    {
      question: 'Is an MSG file the same as EML?',
      answer: "No. MSG is Microsoft Outlook's proprietary binary format; EML is the open standard email format most other clients use. That's why conversion between them works — tools translate the Outlook structure into the standard one.",
    },
    {
      question: "Why can't I see the attachments?",
      answer: "Because the method you used only reads the message text. Renaming tricks expose text, not attachments — attachments are stored inside the MSG in a way plain text can't show. Use a converter like msgconvert or extract-msg to get the files out intact.",
    },
    {
      question: 'Can I open an MSG file in Gmail?',
      answer: 'Gmail has no built-in MSG preview. Convert the message to PDF or plain text first (extract-msg can produce readable output), then view or attach that instead.',
    },
    {
      question: 'Can I reply to an MSG file without Outlook?',
      answer: "Not directly. These methods are for reading. Once you've converted the message to EML, you can import it into Thunderbird and reply from there as a normal email.",
    },
  ],
  }
};
