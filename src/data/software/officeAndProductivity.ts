import { SoftwareInfo } from '../../types';

export const OFFICE_AND_PRODUCTIVITY_SOFTWARE: SoftwareInfo[] = [
  {
    id: 'microsoft-word',
    name: 'Microsoft Word',
    developer: 'Microsoft Corporation',
    category: 'Productivity & Office',
    description: 'Leading word processing software for drafting documents, reports, and formatted text.',
    longDescription: 'Microsoft Word is the world’s benchmark word processor. Part of the Microsoft 365 suite, it allows users to author documents, collaborate in real time with comment threads, format complex layouts, and publish to PDF.',
    supportedOS: ['windows', 'mac', 'android', 'ios'],
    priceType: 'Paid',
    priceText: '$6.99 / month or $149.99 standalone',
    websiteUrl: 'https://microsoft.com/microsoft-365/word',
    downloadUrl: 'https://microsoft.com/microsoft-365/word',
    supportedExtensions: ['DOCX', 'DOC', 'DOCM', 'PDF', 'RTF', 'TXT', 'ODT', 'XML', 'HTML'],
    rating: 4.7,
    reviewCount: 65000,
    features: [
      'Real-time cloud co-authoring and revision history',
      'Advanced document layout, tables, and typography',
      'Built-in Microsoft Copilot AI writing assistant',
      'Direct export to PDF and EPUB formats',
      'Grammar checking and language translation'
    ],
    alternatives: [
      { name: 'Google Docs', slug: 'google-docs', description: 'Free web-based collaborative document editor.' },
      { name: 'LibreOffice Writer', slug: 'libreoffice-writer', description: 'Open-source desktop word processor.' },
      { name: 'Apple Pages', slug: 'apple-pages', description: 'Sleek word processor designed for Mac and iPad.' }
    ],
    tutorials: [
      { title: 'How to Recover Unsaved Word Documents (.docx)', description: 'Step-by-step guide to recovering AutoRecover document files in Word.', readTime: '4 min' },
      { title: 'Converting DOCX to PDF preserving formatting', description: 'Export clean PDFs directly from Microsoft Word without distortion.', readTime: '3 min' }
    ]
  },
  {
    id: 'microsoft-excel',
    name: 'Microsoft Excel',
    developer: 'Microsoft Corporation',
    category: 'Productivity & Office',
    description: 'Industry standard spreadsheet software for data analysis, financial modeling, and pivot tables.',
    longDescription: 'Microsoft Excel is the world’s most widely used spreadsheet program. Perform complex statistical calculations, construct dynamic financial models, visualize trends with chart graphics, and automate workflows with VBA macros.',
    supportedOS: ['windows', 'mac', 'android', 'ios'],
    priceType: 'Paid',
    priceText: '$6.99 / month',
    websiteUrl: 'https://microsoft.com/microsoft-365/excel',
    downloadUrl: 'https://microsoft.com/microsoft-365/excel',
    supportedExtensions: ['XLSX', 'XLS', 'XLSM', 'XLSB', 'CSV', 'TSV', 'ODS', 'XML'],
    rating: 4.8,
    reviewCount: 78000,
    features: [
      'Dynamic array formulas (XLOOKUP, FILTER, UNIQUE)',
      'PivotTables and Power Query ETL data transformation engine',
      'VBA macro automation and Power Pivot data modeling',
      'Python integration directly inside Excel grid cells'
    ],
    alternatives: [
      { name: 'Google Sheets', slug: 'google-sheets', description: 'Collaborative cloud spreadsheet tool.' },
      { name: 'LibreOffice Calc', slug: 'libreoffice-calc', description: 'Free open source desktop spreadsheet.' }
    ]
  },
  {
    id: 'microsoft-powerpoint',
    name: 'Microsoft PowerPoint',
    developer: 'Microsoft Corporation',
    category: 'Productivity & Office',
    description: 'Presentation slide deck design software for business proposals, lectures, and pitch decks.',
    longDescription: 'Microsoft PowerPoint is the leading presentation app. Design visually compelling slide decks with animations, embedded video, slide transitions, smart art diagrams, and speaker notes.',
    supportedOS: ['windows', 'mac', 'android', 'ios'],
    priceType: 'Paid',
    priceText: '$6.99 / month',
    websiteUrl: 'https://microsoft.com/microsoft-365/powerpoint',
    downloadUrl: 'https://microsoft.com/microsoft-365/powerpoint',
    supportedExtensions: ['PPTX', 'PPT', 'PPTM', 'POTX', 'PPSX', 'PDF', 'MP4'],
    rating: 4.7,
    reviewCount: 54000,
    features: [
      'Morph transition 3D object smoothly sliding animations',
      'Presenter view with teleprompter speaker notes',
      'Export slide shows to 4K MP4 video files'
    ],
    alternatives: [
      { name: 'Google Slides', slug: 'google-slides', description: 'Cloud presentation app.' },
      { name: 'Apple Keynote', slug: 'apple-keynote', description: 'Mac presentation software.' }
    ]
  },
  {
    id: 'libreoffice',
    name: 'LibreOffice Suite',
    developer: 'The Document Foundation',
    category: 'Productivity & Office',
    description: 'Free open source office suite including Writer, Calc, Impress, Draw, Math, and Base.',
    longDescription: 'LibreOffice is a powerful and free office suite, used by millions of people around the world. Its clean interface and feature-rich tools help you unleash your creativity and enhance your productivity.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: '100% Free Open Source',
    websiteUrl: 'https://libreoffice.org',
    downloadUrl: 'https://libreoffice.org/download/download-libreoffice/',
    supportedExtensions: ['ODT', 'ODS', 'ODP', 'ODG', 'ODB', 'DOCX', 'XLSX', 'PPTX', 'PDF', 'RTF'],
    rating: 4.7,
    reviewCount: 48000,
    features: [
      'Full compatibility with OpenDocument Format (ODF) standards',
      'Opens and edits Microsoft Office docx, xlsx, pptx files',
      'Includes vector drawing (Draw) and relational database (Base)'
    ],
    alternatives: [
      { name: 'Microsoft 365', slug: 'microsoft-word', description: 'Commercial office software suite.' },
      { name: 'OnlyOffice', slug: 'onlyoffice', description: 'Open source cloud office suite.' }
    ]
  },
  {
    id: 'adobe-acrobat-reader',
    name: 'Adobe Acrobat Reader',
    developer: 'Adobe Inc.',
    category: 'Productivity & Office',
    description: 'Global standard for viewing, signing, printing, and annotating PDF documents.',
    longDescription: 'Adobe Acrobat Reader is the free, trusted global standard for viewing, printing, e-signing, sharing, and annotating PDFs. Open all types of PDF content including forms and multimedia.',
    supportedOS: ['windows', 'mac', 'android', 'ios'],
    priceType: 'Freemium',
    priceText: 'Free Reader / Pro Subscription',
    websiteUrl: 'https://adobe.com/acrobat/pdf-reader.html',
    downloadUrl: 'https://get.adobe.com/reader/',
    supportedExtensions: ['PDF', 'FDF', 'XFDF', 'PDFA'],
    rating: 4.6,
    reviewCount: 92000,
    features: [
      'Fill out interactive PDF forms and place digital signatures',
      'High-resolution PDF rendering with text search',
      'Sticky note comments and highlight markup tools'
    ],
    alternatives: [
      { name: 'Foxit PDF Reader', slug: 'foxit-reader', description: 'Lightweight PDF viewer.' },
      { name: 'PDF24 Creator', slug: 'pdf24', description: 'Free PDF editing tools.' },
      { name: 'Sumatra PDF', slug: 'sumatra-pdf', description: 'Ultralight Windows PDF reader.' }
    ]
  },
  {
    id: 'foxit-reader',
    name: 'Foxit PDF Reader',
    developer: 'Foxit Software',
    category: 'Productivity & Office',
    description: 'Lightweight, fast PDF viewer and editor with e-signature and annotation support.',
    longDescription: 'Foxit PDF Reader is a small, lightning-fast, feature-rich PDF viewer which allows you to open, view, sign, and print any PDF file.',
    supportedOS: ['windows', 'mac', 'linux', 'android', 'ios'],
    priceType: 'Free',
    priceText: 'Free Desktop Viewer',
    websiteUrl: 'https://foxit.com/pdf-reader/',
    downloadUrl: 'https://foxit.com/downloads/',
    supportedExtensions: ['PDF', 'FDF'],
    rating: 4.7,
    reviewCount: 38000,
    features: [
      'Failsafe lightweight memory footprint',
      'Built-in tabbed document browser interface',
      'ConnectedPDF security tracking and permission management'
    ],
    alternatives: [
      { name: 'Adobe Acrobat', slug: 'adobe-acrobat-reader', description: 'Standard PDF app.' }
    ]
  },
  {
    id: 'sumatra-pdf',
    name: 'Sumatra PDF Reader',
    developer: 'Krzysztof Kowalczyk',
    category: 'Productivity & Office',
    description: 'Ultralight free open source PDF, eBook (ePub, MOBI), Comic Book (CBZ), and XPS viewer.',
    longDescription: 'Sumatra PDF is a free PDF, eBook (ePub, MOBI), XPS, DjVu, CHM, Comic Book (CBZ and CBR) reader for Windows. Small size, portable, starts up instantly.',
    supportedOS: ['windows'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://www.sumatrapdfreader.org/',
    downloadUrl: 'https://www.sumatrapdfreader.org/download-free-pdf-viewer',
    supportedExtensions: ['PDF', 'EPUB', 'MOBI', 'CBZ', 'CBR', 'XPS', 'DJVU', 'CHM'],
    rating: 4.8,
    reviewCount: 29000,
    features: [
      'Launches in under 50ms with zero background clutter',
      'Reads comic books (CBZ/CBR) and ePub eBooks',
      'Portable single executable mode supported'
    ],
    alternatives: [
      { name: 'Adobe Reader', slug: 'adobe-acrobat-reader', description: 'PDF viewer.' }
    ]
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    developer: 'Google LLC',
    category: 'Productivity & Office',
    description: 'Free web-based collaborative document editor with real-time multi-user editing.',
    longDescription: 'Google Docs is an online word processor that lets you create and format documents and work with other people in real time from any computer or mobile device.',
    supportedOS: ['windows', 'mac', 'linux', 'android', 'ios'],
    priceType: 'Free',
    priceText: 'Free Web App / Google Workspace',
    websiteUrl: 'https://docs.google.com',
    downloadUrl: 'https://docs.google.com',
    supportedExtensions: ['DOCX', 'DOC', 'ODT', 'RTF', 'TXT', 'PDF', 'EPUB', 'HTML'],
    rating: 4.8,
    reviewCount: 115000,
    features: [
      'Instant cloud autosave with granular revision version history',
      'Real-time simultaneous multi-user typing and commenting',
      'Built-in Gemini AI document writing assistant'
    ],
    alternatives: [
      { name: 'Microsoft Word', slug: 'microsoft-word', description: 'Desktop word processor.' }
    ]
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    developer: 'Google LLC',
    category: 'Productivity & Office',
    description: 'Cloud spreadsheet editor with real-time collaboration, pivot tables, and Apps Script.',
    longDescription: 'Google Sheets brings your data to life with colorful charts and graphs. Built-in formulas, pivot tables and conditional formatting options save time and simplify common spreadsheet tasks.',
    supportedOS: ['windows', 'mac', 'linux', 'android', 'ios'],
    priceType: 'Free',
    priceText: 'Free Web App',
    websiteUrl: 'https://sheets.google.com',
    downloadUrl: 'https://sheets.google.com',
    supportedExtensions: ['XLSX', 'XLS', 'CSV', 'TSV', 'ODS', 'PDF', 'HTML'],
    rating: 4.8,
    reviewCount: 98000,
    features: [
      'Google Apps Script JavaScript web automation API',
      'Real-time collaborative editing and cell history',
      'Direct integration with BigQuery and Google Forms'
    ],
    alternatives: [
      { name: 'Microsoft Excel', slug: 'microsoft-excel', description: 'Spreadsheet application.' }
    ]
  },
  {
    id: 'obsidian',
    name: 'Obsidian Note Taking',
    developer: 'Dynalist Inc.',
    category: 'Productivity & Office',
    description: 'Private, flexible Markdown knowledge base that adapts to the way you think.',
    longDescription: 'Obsidian is a powerful and extensible knowledge base that works on top of your local folder of plain text Markdown files. Build interconnected personal knowledge graphs.',
    supportedOS: ['windows', 'mac', 'linux', 'android', 'ios'],
    priceType: 'Free',
    priceText: 'Free Personal Use',
    websiteUrl: 'https://obsidian.md',
    downloadUrl: 'https://obsidian.md/download',
    supportedExtensions: ['MD', 'MARKDOWN', 'TXT', 'PDF', 'CANVAS', 'PNG'],
    rating: 4.9,
    reviewCount: 42000,
    features: [
      'Interactive 2D graph view of bi-directional note links',
      '100% offline local plain text Markdown storage',
      'Community plugin ecosystem with over 1,500 extensions'
    ],
    alternatives: [
      { name: 'Notion', slug: 'notion', description: 'Cloud workspace app.' },
      { name: 'Logseq', slug: 'logseq', description: 'Open source outliner tool.' }
    ]
  },
  {
    id: 'notion',
    name: 'Notion Workspace',
    developer: 'Notion Labs, Inc.',
    category: 'Productivity & Office',
    description: 'Connected workspace for notes, wikis, project management, and AI docs.',
    longDescription: 'Notion is the single workspace for your notes, tasks, wikis, and databases. Blend documents with structured database tables, Kanban boards, and calendars.',
    supportedOS: ['windows', 'mac', 'android', 'ios'],
    priceType: 'Freemium',
    priceText: 'Free Tier / $8 / month',
    websiteUrl: 'https://notion.so',
    downloadUrl: 'https://notion.so/desktop',
    supportedExtensions: ['MD', 'CSV', 'PDF', 'HTML'],
    rating: 4.7,
    reviewCount: 74000,
    features: [
      'Flexible block-based document editor',
      'Relational databases with Kanban, Table, and Timeline views',
      'Built-in Notion AI Q&A search assistant'
    ],
    alternatives: [
      { name: 'Obsidian', slug: 'obsidian', description: 'Local Markdown notes tool.' }
    ]
  },
  {
    id: 'calibre',
    name: 'Calibre eBook Manager',
    developer: 'Kovid Goyal',
    category: 'Productivity & Office',
    description: 'Free open source eBook manager, viewer, and e-reader converter utility.',
    longDescription: 'Calibre is a powerful and easy to use e-book manager. Organize your eBook library, convert between EPUB, MOBI, AZW3, PDF formats, and sync directly to Amazon Kindle or Kobo devices.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://calibre-ebook.com',
    downloadUrl: 'https://calibre-ebook.com/download',
    supportedExtensions: ['EPUB', 'MOBI', 'AZW3', 'PDF', 'CBR', 'CBZ', 'FB2', 'LIT', 'TXT'],
    rating: 4.8,
    reviewCount: 38000,
    features: [
      'Convert eBooks between EPUB, MOBI, AZW3, PDF formats',
      'Automatic metadata fetch from Google Books and ISBN databases',
      'Direct Kindle e-reader sync over USB or wireless email'
    ],
    alternatives: [
      { name: 'Sigil', slug: 'sigil', description: 'EPUB eBook editor.' }
    ]
  }
];
