'use client';

import React, { useState, useRef } from 'react';
import { Upload, Files, ArrowUp, ArrowDown, X, Download, FileText, Loader2 } from 'lucide-react';
import { mergePdfs, looksLikePdf } from '@/lib/tools/pdfOps';

interface MergeItem {
  id: number;
  name: string;
  size: number;
  buffer: ArrayBuffer;
  pages: number;
}

const MAX_FILES = 20;
const MAX_FILE_BYTES = 100 * 1024 * 1024;

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const PdfMergeWorkspace: React.FC = () => {
  const [items, setItems] = useState<MergeItem[]>([]);
  const [isWorking, setIsWorking] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneInfo, setDoneInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);

  const handleFiles = async (files: FileList | File[]) => {
    setError(null);
    setDoneInfo(null);
    const arr = Array.from(files);
    if (items.length + arr.length > MAX_FILES) {
      setError(`Merge supports up to ${MAX_FILES} PDF files at a time.`);
      return;
    }
    setIsWorking(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const added: MergeItem[] = [];
      for (const file of arr) {
        if (!/\.pdf$/i.test(file.name)) {
          setError(`"${file.name}" is not a PDF file — skipped.`);
          continue;
        }
        if (file.size > MAX_FILE_BYTES) {
          setError(`"${file.name}" exceeds the 100 MB per-file limit — skipped.`);
          continue;
        }
        const buffer = await file.arrayBuffer();
        if (!looksLikePdf(buffer)) {
          setError(`"${file.name}" does not look like a PDF (missing %PDF header) — skipped.`);
          continue;
        }
        let pages = 0;
        try {
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
          if (doc.isEncrypted) {
            setError(`"${file.name}" is password-protected and cannot be merged — skipped.`);
            continue;
          }
          pages = doc.getPageCount();
        } catch (e) {
          setError(`Could not read "${file.name}" — it may be corrupt or password-protected. Skipped.`);
          continue;
        }
        added.push({ id: ++idCounter.current, name: file.name, size: file.size, buffer, pages });
      }
      setItems((prev) => [...prev, ...added]);
    } finally {
      setIsWorking(false);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const handleMerge = async () => {
    if (items.length < 2) {
      setError('Add at least two PDF files to merge.');
      return;
    }
    setError(null);
    setDoneInfo(null);
    setIsWorking(true);
    try {
      const bytes = await mergePdfs(items.map((i) => i.buffer));
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      const totalPages = items.reduce((s, i) => s + i.pages, 0);
      setDoneInfo(`Merged ${items.length} files into one PDF with ${totalPages} pages.`);
    } catch (e) {
      setError('Merge failed. One of the files may be corrupt — try removing it and merging again.');
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-3 text-sm font-medium text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}
      {doneInfo && (
        <div role="status" className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {doneInfo}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Files className="w-5 h-5 text-rose-600" />
            <span>PDF Merger — Combine PDF Files</span>
          </h3>
          <p className="text-xs text-slate-500">
            Add PDFs in order, rearrange them, and merge into a single document. Files never leave your browser.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
          In-Browser Merge
        </span>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-rose-600 bg-rose-50/70 dark:bg-rose-950/40'
            : 'border-slate-300 dark:border-slate-700 hover:border-rose-500 bg-slate-50/50 dark:bg-slate-800/30'
        }`}
      >
        <input type="file" ref={fileInputRef} accept=".pdf,application/pdf" multiple
          onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
          className="hidden" />
        <div className="space-y-3 max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
            <Upload className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Drop PDF Files Here</h4>
            <p className="text-xs text-slate-500">Click to browse or drag multiple PDFs (up to {MAX_FILES} files, 100 MB each)</p>
          </div>
          <button type="button" className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700">
            Select PDF Files
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Merge order — top file comes first ({items.length} of {MAX_FILES})
          </p>
          <ol className="space-y-2">
            {items.map((item, index) => (
              <li key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="w-7 h-7 shrink-0 rounded-lg bg-slate-900 dark:bg-black text-white text-xs font-bold flex items-center justify-center">{index + 1}</span>
                <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-xs font-mono text-slate-500">{item.pages} pages • {formatSize(item.size)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30" aria-label="Move up">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30" aria-label="Move down">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600" aria-label="Remove file">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button type="button" onClick={handleMerge} disabled={isWorking || items.length < 2}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 shadow-md">
              {isWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isWorking ? 'Merging…' : 'Merge & Download PDF'}</span>
            </button>
            <button type="button" onClick={() => { setItems([]); setDoneInfo(null); setError(null); }}
              className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
