'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Copy, Download, Loader2, CheckCircle2 } from 'lucide-react';

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const MAX_PAGES = 500;

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const PdfToTextWorkspace: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [pageCount, setPageCount] = useState(0);
  const [pagesExtracted, setPagesExtracted] = useState(0);
  const [truncated, setTruncated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setExtractedText('');
    setPagesExtracted(0);
    setTruncated(false);
    setCopied(false);
    if (!/\.pdf$/i.test(file.name)) {
      setError(`"${file.name}" is not a PDF file.`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" exceeds the 100 MB limit for in-browser text extraction.`);
      return;
    }
    setIsLoading(true);
    try {
      const data = await file.arrayBuffer();
      const head = new Uint8Array(data.slice(0, 5));
      if (!(head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46)) {
        setError(`"${file.name}" does not look like a PDF (missing %PDF header).`);
        return;
      }
      const { ensurePdfWorkerOptions } = await import('@/lib/pdfWorker');
      const pdfjs = await ensurePdfWorkerOptions();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
      setFileName(file.name);
      setPageCount(doc.numPages);
      const limit = Math.min(doc.numPages, MAX_PAGES);
      const chunks: string[] = [];
      for (let i = 1; i <= limit; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const lines: string[] = [];
        let current = '';
        for (const item of content.items) {
          current += item.str ?? '';
          if (item.hasEOL) {
            lines.push(current);
            current = '';
          } else {
            current += ' ';
          }
        }
        if (current.trim()) lines.push(current);
        const pageText = lines.join('\n').replace(/[ \t]+\n/g, '\n').trim();
        if (pageText) chunks.push(`--- Page ${i} ---\n${pageText}`);
      }
      await doc.destroy();
      setPagesExtracted(limit);
      setTruncated(doc.numPages > MAX_PAGES);
      const joined = chunks.join('\n\n');
      setExtractedText(joined);
      if (!joined) {
        setError('No extractable text found. This PDF is likely made of scanned images — text extraction needs OCR for such files.');
      }
    } catch {
      setError(`Could not extract text from "${file.name}" — it may be corrupt or password-protected.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Copy failed — select the text manually instead.');
    }
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(fileName || 'document.pdf').replace(/\.pdf$/i, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-3 text-sm font-medium text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-600" />
            <span>PDF to Text — Extract Plain Text</span>
          </h3>
          <p className="text-xs text-slate-500">
            Pull the text layer out of a PDF into editable plain text. Layout and images are not preserved — only text.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
          Local Text Extraction
        </span>
      </div>

      {!fileName ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-rose-600 bg-rose-50/70 dark:bg-rose-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-rose-500 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input type="file" ref={fileInputRef} accept=".pdf,application/pdf"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
            className="hidden" />
          <div className="space-y-3 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
              <Upload className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Drop a PDF Here</h4>
              <p className="text-xs text-slate-500">Click to browse or drag a PDF (up to 100 MB)</p>
            </div>
            <button type="button" className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700">
              Select PDF File
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold text-sm text-white">{fileName}</p>
                <p className="text-xs font-mono text-slate-400">
                  {pageCount} pages • extracted from {pagesExtracted}{truncated ? ` (first ${MAX_PAGES} only)` : ''} • {extractedText.length.toLocaleString()} characters
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleCopy} disabled={!extractedText}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
              <button type="button" onClick={handleDownload} disabled={!extractedText}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
              <button type="button" onClick={() => { setFileName(null); setExtractedText(''); setError(null); }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
                New File
              </button>
            </div>
          </div>

          <textarea readOnly value={isLoading ? 'Extracting text…' : extractedText}
            rows={16}
            placeholder={isLoading ? '' : 'Extracted text will appear here.'}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm font-mono text-slate-900 dark:text-white focus:outline-none resize-y" />
          {isLoading && (
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Reading pages…
            </p>
          )}
        </div>
      )}
    </div>
  );
};
