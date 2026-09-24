import type { FAQItem } from '@/components/FAQAccordion';

export const GOOGLE_DOCS_FAQS: FAQItem[] = [
  { question: 'Does Google Docs have its own native file extension?', answer: 'No. Google Docs stores documents in Google cloud infrastructure. A .gdoc file is a lightweight JSON web shortcut, not the document contents.' },
  { question: 'What file formats can Google Docs open or import?', answer: 'Google Docs can open Microsoft Word, OpenDocument Text, Rich Text Format, plain text, HTML, and PDF files.' },
  { question: 'Can Google Docs open and edit Microsoft Word (.docx) files without converting them?', answer: 'Yes. Google Docs supports Office Editing Mode for Microsoft Word files and can edit them directly.' },
  { question: 'What formats can Google Docs export or download?', answer: 'Google Docs can download documents as DOCX, ODT, RTF, PDF, TXT, HTML, and EPUB.' },
  { question: 'Why did my Word document formatting change when opened in Google Docs?', answer: 'Formatting changes can result from font substitution and differences in support for complex lists, tables, floating images, WordArt, and macros.' },
  { question: 'What is the maximum file size Google Docs can open or convert?', answer: 'Google Docs has documented size and character limits that vary by import and conversion workflow.' },
  { question: 'Can Google Docs open password-protected Word or PDF files?', answer: 'No. Password-protected documents must be unlocked before uploading them to Google Docs.' },
  { question: 'Can Google Docs open or export EPUB ebook files?', answer: 'Google Docs cannot import EPUB ebooks directly, but it can export a document to EPUB.' },
];
