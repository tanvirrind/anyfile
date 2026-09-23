'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Laptop,
  Smartphone,
  HelpCircle,
  FileCode,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck,
  FolderOpen,
  Mail,
  Layers,
  Check
} from 'lucide-react';
import { AppRoute } from '../../types';
import { Badge } from '../Badge';
import { FAQAccordion, FAQItem } from '../FAQAccordion';

interface GoogleDocsDetailViewProps {
  onNavigate: (route: AppRoute) => void;
}

interface FormatRow {
  ext: string;
  name: string;
  mime: string;
  canOpen: boolean;
  openMode: 'Native' | 'Office Mode' | 'OCR Conversion' | 'Auto-Convert' | 'Not Supported';
  canExport: boolean;
  exportFormat: string;
  limitations: string;
}

export const GOOGLE_DOCS_FAQS: FAQItem[] = [
  {
    question: 'Does Google Docs have its own native file extension?',
    answer: 'No. Google Docs does not have a traditional standalone native file extension like .docx or .pages. Documents are stored directly in Google cloud infrastructure. When you use the Google Drive desktop sync client, shortcuts with the .gdoc extension appear on your drive. However, a .gdoc file is simply a lightweight JSON web shortcut containing a document URL and unique resource ID—it does not contain the actual document contents or text.'
  },
  {
    question: 'What file formats can Google Docs open or import?',
    answer: 'Google Docs can open and import Microsoft Word (.docx, .doc, .docm, .dot, .dotx), OpenDocument Text (.odt), Rich Text Format (.rtf), Plain Text (.txt), HTML (.html, .htm), and Adobe Portable Document Format (.pdf) via Google Cloud OCR text extraction.'
  },
  {
    question: 'Can Google Docs open and edit Microsoft Word (.docx) files without converting them?',
    answer: 'Yes. Google Docs features native "Office Editing Mode" for Microsoft Word (.docx) files. You can view, comment, suggest, and edit .docx files directly without converting them to Google Docs format. All changes are saved directly back to the original .docx file, preserving compatibility for Word users.'
  },
  {
    question: 'What formats can Google Docs export or download?',
    answer: 'Google Docs allows you to download documents in 7 universal formats by navigating to File > Download: Microsoft Word (.docx), OpenDocument Format (.odt), Rich Text Format (.rtf), PDF Document (.pdf), Plain Text (.txt), Web Page (.html, packaged as a zipped archive with images), and EPUB Publication (.epub).'
  },
  {
    question: 'Why did my Word document formatting change when opened in Google Docs?',
    answer: 'Formatting shifts usually happen because of font substitution. If your Word document uses fonts installed locally on your computer (such as Aptos, Calibri, or proprietary corporate fonts), Google Docs substitutes them with similar Google Fonts (like Carlito, Roboto, or Arial). Differences in table margin calculation, complex multi-level lists, nested tables, floating images, and unsupported WordArt or VBA macros can also cause layout changes.'
  },
  {
    question: 'What is the maximum file size Google Docs can open or convert?',
    answer: 'For text documents converted into Google Docs format, the limit is up to 50 MB or 1.02 million characters (regardless of page count). If you upload embedded images, they cannot exceed 50 MB each. For PDF documents converted to Google Docs via OCR, the maximum file size is 50 MB and only the first 10 pages are processed if the document is excessively large.'
  },
  {
    question: 'Can Google Docs open password-protected Word or PDF files?',
    answer: 'No. Google Docs cannot open encrypted or password-protected documents. You must remove the password protection using Microsoft Word, Adobe Acrobat, or AnyFileX converter tools before uploading the file to Google Docs.'
  },
  {
    question: 'Can Google Docs open or export EPUB ebook files?',
    answer: 'Google Docs CANNOT open or import .epub files directly. However, Google Docs CAN export any document into a reflowable .epub ebook by selecting File > Download > EPUB Publication (.epub). Heading 1 styles automatically generate clean chapter breaks in the resulting ebook.'
  }
];

export const GoogleDocsDetailView: React.FC<GoogleDocsDetailViewProps> = ({ onNavigate }) => {
  const [activeUploadMethod, setActiveUploadMethod] = useState<'drive' | 'docs' | 'gmail' | 'mobile'>('drive');

  const formatRows: FormatRow[] = [
    {
      ext: 'docx',
      name: 'Microsoft Word (OpenXML)',
      mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      canOpen: true,
      openMode: 'Office Mode',
      canExport: true,
      exportFormat: '.docx (Native OpenXML)',
      limitations: 'Up to 50MB / 1.02M characters. Desktop fonts (Calibri, Aptos) map to Google Fonts. VBA macros (.docm) are stripped. SmartArt converts to static drawings.'
    },
    {
      ext: 'doc',
      name: 'Legacy Microsoft Word 97-2003',
      mime: 'application/msword',
      canOpen: true,
      openMode: 'Auto-Convert',
      canExport: false,
      exportFormat: 'Exports to modern .docx only',
      limitations: 'Binary Word 97-2003 files are automatically converted to Google Docs or modern DOCX. Cannot re-export to legacy .doc format.'
    },
    {
      ext: 'odt',
      name: 'OpenDocument Text',
      mime: 'application/vnd.oasis.opendocument.text',
      canOpen: true,
      openMode: 'Native',
      canExport: true,
      exportFormat: '.odt (OpenDocument standard)',
      limitations: 'Standard formatting is well supported. Complex LibreOffice frame anchors, nested sections, and Math formula objects may shift or become raster images.'
    },
    {
      ext: 'pdf',
      name: 'Adobe Portable Document Format',
      mime: 'application/pdf',
      canOpen: true,
      openMode: 'OCR Conversion',
      canExport: true,
      exportFormat: '.pdf (Print-ready vector PDF)',
      limitations: 'Opening a PDF triggers Google OCR text extraction. Multi-column text flow, intricate tabular lines, vector drawings, and form fields may lose positioning.'
    },
    {
      ext: 'epub',
      name: 'Electronic Publication',
      mime: 'application/epub+zip',
      canOpen: false,
      openMode: 'Not Supported',
      canExport: true,
      exportFormat: '.epub (Reflowable EPUB 3.0)',
      limitations: 'Google Docs cannot open/import EPUB ebooks directly. For export, Heading 1 styles create chapter splits; audio/video elements are not supported.'
    },
    {
      ext: 'rtf',
      name: 'Rich Text Format',
      mime: 'application/rtf',
      canOpen: true,
      openMode: 'Native',
      canExport: true,
      exportFormat: '.rtf (Universal rich text)',
      limitations: 'Preserves basic typography, bold, italic, and simple tables. Advanced drawing canvases, annotations, and embedded OLE binary objects are discarded.'
    },
    {
      ext: 'txt',
      name: 'Plain Text File',
      mime: 'text/plain',
      canOpen: true,
      openMode: 'Native',
      canExport: true,
      exportFormat: '.txt (Plain UTF-8 text)',
      limitations: 'Zero visual formatting: bold, font sizes, colors, margins, and inline media are stripped on plain text export.'
    },
    {
      ext: 'html',
      name: 'HyperText Markup Language',
      mime: 'text/html',
      canOpen: true,
      openMode: 'Native',
      canExport: true,
      exportFormat: '.zip (Containing .html + /images)',
      limitations: 'External CSS stylesheets, Flexbox, CSS Grid, scripts, and responsive queries are stripped on import. Export creates a ZIP archive.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* 1. Page Heading & Search-Intent Hero Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-inner shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="blue">Productivity & Office</Badge>
                <Badge variant="emerald">Free Cloud App</Badge>
                <span className="text-xs font-semibold text-slate-500">Google Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                Google Docs File Types: What Files Can Google Docs Open & Export?
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Developer: Google LLC &bull; Official Cloud Web Word Processor &bull; Updated for 2026
              </p>
            </div>
          </div>

          <a
            href="https://docs.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all inline-flex items-center gap-2 cursor-pointer shrink-0"
            id="open-google-docs-btn"
          >
            <span>Launch Google Docs</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Comprehensive Introductory Overview Addressing Intent */}
        <div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-6">
          <p>
            <strong>Google Docs</strong> is Google’s flagship cloud-based collaborative word processor. Unlike traditional desktop software such as Microsoft Word or LibreOffice Writer, Google Docs runs entirely inside your web browser or mobile app, providing continuous real-time multi-user editing, automatic cloud revision history, and smart writing assistance.
          </p>
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-sm sm:text-base text-amber-900 dark:text-amber-200 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Does Google Docs have a native file extension?</strong>
              <p className="mt-1 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                <strong>No.</strong> Google Docs does not use a standalone local file format. All documents exist as structured database entities inside Google Drive cloud storage. When using Google Drive for desktop, files with the <code>.gdoc</code> extension may appear on your computer; however, a <code>.gdoc</code> file is not an offline document container. It is a tiny JSON web shortcut that points to the document’s online URL. To store, share, or archive offline documents, Google Docs imports and exports industry-standard formats.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Files Google Docs Can Open or Import</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Supports opening and editing <strong>Microsoft Word (.docx, .doc, .docm, .dot, .dotx)</strong>, <strong>OpenDocument Text (.odt)</strong>, <strong>Rich Text (.rtf)</strong>, <strong>Plain Text (.txt)</strong>, <strong>HTML (.html, .htm)</strong>, and <strong>Adobe PDF (.pdf)</strong> via built-in optical character recognition (OCR).
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Files Google Docs Can Export or Download</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Allows downloading documents directly as <strong>Microsoft Word (.docx)</strong>, <strong>OpenDocument (.odt)</strong>, <strong>Rich Text (.rtf)</strong>, <strong>PDF Document (.pdf)</strong>, <strong>Plain Text (.txt)</strong>, <strong>Web Page (.html, zipped)</strong>, and <strong>EPUB Publication (.epub)</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Supported Formats Master Table: Open vs. Export vs. Limitations */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" />
              <span>Google Docs Supported File Formats Table</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Direct comparison of what Google Docs can open, what it can export, and key formatting limitations. Click any format for full specifications.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
            8 Major Formats Audited
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th scope="col" className="py-3.5 px-4 sm:px-6 rounded-l-2xl">Format & Extension</th>
                  <th scope="col" className="py-3.5 px-4">Can Open / Import?</th>
                  <th scope="col" className="py-3.5 px-4">Can Export / Download?</th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6 rounded-r-2xl">Important Limitations & Caveats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70 text-xs sm:text-sm">
                {formatRows.map((row) => (
                  <tr key={row.ext} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => onNavigate({ view: 'extension-detail', ext: row.ext })}
                          className="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-base hover:underline cursor-pointer"
                          title={`View .${row.ext.toUpperCase()} technical format guide`}
                        >
                          .{row.ext.toUpperCase()}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">{row.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono hidden md:block">{row.mime}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {row.canOpen ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Yes ({row.openMode})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>No (Cannot Open)</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {row.canExport ? (
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
                          <Download className="w-4 h-4 shrink-0" />
                          <span>{row.exportFormat}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>{row.exportFormat}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm sm:max-w-md">
                      {row.limitations}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Practical Instructions: How to Upload & Open Files */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-indigo-600" />
            <span>How to Upload & Open a File in Google Docs</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose your preferred workflow to import local files, Word documents, or PDFs into Google Docs.
          </p>
        </div>

        {/* Workflow Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'drive', label: '1. Via Google Drive Web', icon: Upload },
            { id: 'docs', label: '2. Inside Google Docs', icon: FileText },
            { id: 'gmail', label: '3. From Gmail Attachment', icon: Mail },
            { id: 'mobile', label: '4. Android & iPhone Apps', icon: Smartphone }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveUploadMethod(id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeUploadMethod === id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeUploadMethod === 'drive' && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>Method 1: Upload via Google Drive (Recommended for Batch Files)</span>
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                Open your browser and navigate to <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">drive.google.com</a>, signing in with your Google account.
              </li>
              <li>
                Click the large <strong>"+ New"</strong> button in the top-left navigation panel.
              </li>
              <li>
                Select <strong>"File upload"</strong> (or drag and drop files directly from your desktop into the Google Drive window).
              </li>
              <li>
                Select your <code>.docx</code>, <code>.doc</code>, <code>.odt</code>, <code>.rtf</code>, <code>.txt</code>, or <code>.pdf</code> file.
              </li>
              <li>
                Once uploaded, double-click the file in Google Drive, or right-click and choose <strong>"Open with &gt; Google Docs"</strong>.
              </li>
            </ol>
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                <strong>Office Compatibility Mode Tip:</strong> In Google Drive, double-clicking a <code>.docx</code> file opens it in native Office Editing mode (indicated by a blue <code>.DOCX</code> badge beside the title). Changes save back to the original Word file without conversion!
              </p>
            </div>
          </div>
        )}

        {activeUploadMethod === 'docs' && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>Method 2: Open Directly from Inside Google Docs</span>
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                Go to <a href="https://docs.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">docs.google.com</a> and open a blank document or any existing file.
              </li>
              <li>
                In the top toolbar menu, click <strong>File &gt; Open</strong> (or use keyboard shortcut <code>Ctrl + O</code> on Windows / <code>Cmd + O</code> on Mac).
              </li>
              <li>
                In the pop-up modal dialog, click the <strong>"Upload"</strong> tab on the far right.
              </li>
              <li>
                Click <strong>"Browse"</strong> or drag and drop your document file directly into the designated drop zone.
              </li>
              <li>
                Google Docs will instantly upload, convert, and open the document in your workspace.
              </li>
            </ol>
          </div>
        )}

        {activeUploadMethod === 'gmail' && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>Method 3: Open Email Attachments Directly in Gmail</span>
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                Open the email containing the document attachment in <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Gmail</a>.
              </li>
              <li>
                Scroll down to the attachment card at the bottom of the email message.
              </li>
              <li>
                Hover over the attachment thumbnail and click the <strong>"Edit with Google Docs"</strong> icon (Docs symbol with a pencil).
              </li>
              <li>
                Gmail automatically creates a copy of the attachment in your Google Drive and opens it for immediate editing.
              </li>
            </ol>
          </div>
        )}

        {activeUploadMethod === 'mobile' && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>Method 4: Mobile App on Android, iPhone, or iPad</span>
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                Install the official <strong>Google Docs</strong> app from Google Play Store (Android) or Apple App Store (iOS).
              </li>
              <li>
                Tap the folder icon in the top search bar to browse Google Drive, or tap <strong>"+ New"</strong> at the bottom.
              </li>
              <li>
                To open files stored locally on your device (Files app on iOS or My Files on Android), tap <strong>"Device storage"</strong> or share the file into Google Docs using your system share sheet.
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* 4. Common Formatting & Conversion Issues Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <span>Common Formatting Issues When Converting to Google Docs</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Understanding why layout shifts happen when converting Word, OpenDocument, PDF, HTML, and Plain Text.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Word (.docx / .doc) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>Microsoft Word (.docx, .doc, .docm)</span>
              </span>
              <button
                onClick={() => onNavigate({ view: 'extension-detail', ext: 'docx' })}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                .DOCX Specs &rarr;
              </button>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
              <li>
                <strong>Font Substitution:</strong> Proprietary desktop fonts (such as Calibri, Aptos, Cambria, or Segoe UI) are substituted with Google Fonts (Carlito, Roboto, or Arial), altering character widths and pushing paragraphs onto unexpected pages.
              </li>
              <li>
                <strong>VBA Macros (.docm):</strong> Macro code and Visual Basic automation are completely disabled and stripped upon import for security reasons.
              </li>
              <li>
                <strong>Floating Shapes & SmartArt:</strong> Complex WordArt graphics and floating canvas diagrams are flattened into static bitmap drawings.
              </li>
              <li>
                <strong>Nested Tables & Margins:</strong> Multi-layer nested tables or custom cell border padding may experience alignment drift.
              </li>
            </ul>
          </div>

          {/* OpenDocument (.odt) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>OpenDocument (.odt)</span>
              </span>
              <button
                onClick={() => onNavigate({ view: 'extension-detail', ext: 'odt' })}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                .ODT Specs &rarr;
              </button>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
              <li>
                <strong>Frame Anchors:</strong> Frames anchored to pages or paragraphs in LibreOffice / Apache OpenOffice may collapse into inline text blocks.
              </li>
              <li>
                <strong>Math Formulas:</strong> Embedded StarMath XML equations are converted to non-editable raster images rather than native Google Docs equation objects.
              </li>
              <li>
                <strong>Footnote / Endnote Spacing:</strong> Separator lines and custom numbering rules may revert to standard document defaults.
              </li>
            </ul>
          </div>

          {/* PDF (.pdf) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-rose-600" />
                <span>Adobe PDF (.pdf) OCR Conversion</span>
              </span>
              <button
                onClick={() => onNavigate({ view: 'extension-detail', ext: 'pdf' })}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                .PDF Specs &rarr;
              </button>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
              <li>
                <strong>Multi-Column Collisions:</strong> PDF is a visual layout language, not a reflowable word processing document. Google OCR can accidentally read across newspaper columns as a single line.
              </li>
              <li>
                <strong>Border-Free Tables:</strong> Tabular data without crisp outline borders often breaks apart into disconnected individual paragraphs.
              </li>
              <li>
                <strong>OCR Recognition Errors:</strong> Scanned paper documents with low DPI or cursive handwriting can result in mistranslated characters.
              </li>
            </ul>
          </div>

          {/* HTML (.html / .htm) & Plain Text (.txt) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-600" />
                <span>Web Pages (.html) & Plain Text (.txt)</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate({ view: 'extension-detail', ext: 'html' })}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  .HTML
                </button>
                <span>&bull;</span>
                <button
                  onClick={() => onNavigate({ view: 'extension-detail', ext: 'txt' })}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  .TXT
                </button>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
              <li>
                <strong>CSS Style Stripping (.html):</strong> External CSS stylesheets, CSS Grid, Flexbox, media queries, and JavaScript are stripped. Only inline font colors, basic tables, and bold tags are imported.
              </li>
              <li>
                <strong>Zero Visual Styling (.txt):</strong> Plain text export discards all font faces, colors, heading styles, tables, and images. Text alignment relies exclusively on monospaced character spacing.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Supported Platforms, Ecosystem & Common Use Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platforms */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Supported Platforms & Requirements</h3>
              <p className="text-xs text-slate-500">Accessible across desktop, mobile, and web browsers</p>
            </div>
          </div>
          <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-semibold">Web Browsers (Zero Installation Required)</strong>
              <p className="text-xs text-slate-500">
                Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge on Windows 11/10, macOS, Linux, and ChromeOS.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-semibold">Mobile Apps (iOS & Android)</strong>
              <p className="text-xs text-slate-500">
                Native apps available on iPhone, iPad, Android smartphones, and tablets with offline editing capabilities.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-semibold">Offline Access Support</strong>
              <p className="text-xs text-slate-500">
                Enable offline editing via the official Google Docs Offline Chrome Extension to write and edit without an active internet connection.
              </p>
            </div>
          </div>
        </div>

        {/* Common Use Cases */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Common Use Cases for Google Docs</h3>
              <p className="text-xs text-slate-500">Why millions of professionals and students use Google Docs</p>
            </div>
          </div>
          <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-semibold">Simultaneous Collaborative Co-authoring</strong>
              <p className="text-xs text-slate-500">
                Multiple team members can write, comment, and assign action items in real-time with zero file version conflicts.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-semibold">Free Microsoft Word Replacement</strong>
              <p className="text-xs text-slate-500">
                Open, edit, and export .docx documents without paying for an expensive Microsoft 365 desktop license.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-semibold">Fast PDF-to-Text OCR Extraction</strong>
              <p className="text-xs text-slate-500">
                Convert scanned PDFs and paper documents into editable text using Google’s enterprise OCR engine.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-semibold">Direct EPUB Ebook Publishing</strong>
              <p className="text-xs text-slate-500">
                Format books with Heading 1 chapter styles and export directly to clean .epub format ready for e-readers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Frequently Asked Questions (Accordion) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <FAQAccordion
          faqs={GOOGLE_DOCS_FAQS}
          title="Google Docs File Types: Frequently Asked Questions"
          subtitle="Clear answers to the most common questions about opening, editing, and exporting files with Google Docs."
        />
      </div>

      {/* 7. Verified Format Specifications & How-To Guides Hub */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Explore Supported File Extensions ({formatRows.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access deep technical specifications, magic byte signatures, and step-by-step opening guides on AnyFileX.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {formatRows.map((row) => (
            <div
              key={row.ext}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-lg">
                  .{row.ext.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                  {row.canOpen ? 'Importable' : 'Export Only'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold line-clamp-1">
                {row.name}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <button
                  onClick={() => onNavigate({ view: 'extension-detail', ext: row.ext })}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Format Specs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                <button
                  onClick={() => onNavigate({ view: 'how-to-open', ext: row.ext })}
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>How to Open</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
