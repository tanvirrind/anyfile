'use client';

import React, { useState, useRef } from 'react';
import { Upload, Scissors, Download, FileText, Loader2, Archive } from 'lucide-react';
import { splitPdfPages, parsePageRanges, looksLikePdf } from '@/lib/tools/pdfOps';

const MAX_FILE_BYTES = 100 * 1024 * 1024;

interface SplitPart {
  label: string;
  pages: number[];
  fileName: string;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const PdfSplitWorkspace: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [rangesInput, setRangesInput] = useState('');
  const [mode, setMode] = useState<'per-range' | 'single'>('per-range');
  const [isLoading, setIsLoading] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneInfo, setDoneInfo] = useState<string | null>(null);
  const [parts, setParts] = useState<SplitPart[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setDoneInfo(null);
    setParts([]);
    if (!/\.pdf$/i.test(file.name)) {
      setError(`"${file.name}" is not a PDF file.`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" exceeds the 100 MB limit for in-browser splitting.`);
      return;
    }
    setIsLoading(true);
    try {
      const data = await file.arrayBuffer();
      if (!looksLikePdf(data)) {
        setError(`"${file.name}" does not look like a PDF (missing %PDF header).`);
        return;
      }
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(data);
      if (doc.isEncrypted) {
        setError(`"${file.name}" is password-protected and cannot be split.`);
        return;
      }
      setFileName(file.name);
      setNumPages(doc.getPageCount());
      setFileSize(file.size);
      setBuffer(data);
      setRangesInput(`1-${Math.min(3, doc.getPageCount())}`);
    } catch {
      setError(`Could not read "${file.name}" — it may be corrupt or password-protected.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSplit = async () => {
    if (!buffer || numPages === 0) {
      setError('Drop a PDF file first.');
      return;
    }
    const parsed = parsePageRanges(rangesInput, numPages);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }
    setError(null);
    setDoneInfo(null);
    setIsWorking(true);
    try {
      const base = (fileName || 'document.pdf').replace(/\.pdf$/i, '');
      const produced = await splitPdfPages(buffer.slice(0), parsed.groups, mode, base);

      if (produced.length === 1) {
        const item = produced[0];
        const url = URL.createObjectURL(new Blob([item.bytes.buffer as ArrayBuffer], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDoneInfo(`Created ${item.name} with ${item.pages.length} page(s).`);
      } else {
        const { default: JSZip } = await import('jszip');
        const zip = new JSZip();
        produced.forEach((p) => zip.file(p.name, p.bytes));
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${base}-split.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDoneInfo(`Created ${produced.length} PDFs (one per range), downloaded as ${base}-split.zip.`);
      }
      setParts(produced.map((p) => ({ label: p.name, pages: p.pages, fileName: p.name })));
    } catch {
      setError('Split failed. The PDF may be corrupt — try again or pick a different file.');
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
            <Scissors className="w-5 h-5 text-rose-600" />
            <span>PDF Splitter — Extract Page Ranges</span>
          </h3>
          <p className="text-xs text-slate-500">
            Split a PDF by page ranges or extract specific pages. Everything runs in your browser.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
          In-Browser Split
        </span>
      </div>

      {!buffer ? (
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
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold text-sm text-white">{fileName}</p>
                <p className="text-xs font-mono text-slate-400">{numPages} pages • {formatSize(fileSize)}</p>
              </div>
            </div>
            <button type="button" onClick={() => { setBuffer(null); setFileName(null); setParts([]); setDoneInfo(null); setError(null); }}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
              Pick Another File
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="split-ranges">
              Page ranges to extract (e.g. 1-3, 5, 8-10)
            </label>
            <input id="split-ranges" type="text" value={rangesInput} onChange={(e) => setRangesInput(e.target.value)}
              placeholder="1-3, 5"
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
            <p className="text-xs text-slate-500">Pages are numbered from 1. In “one PDF per range” mode, ranges download as separate PDFs inside a ZIP.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['per-range', 'single'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  mode === m
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}>
                {m === 'per-range' ? 'One PDF Per Range' : 'Single Combined PDF'}
              </button>
            ))}
          </div>

          <button type="button" onClick={handleSplit} disabled={isWorking || isLoading}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 shadow-md">
            {isWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isWorking ? 'Splitting…' : 'Split & Download'}</span>
          </button>

          {parts.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Archive className="w-3.5 h-3.5" /> Produced {parts.length} file(s)
              </p>
              <ul className="text-xs font-mono text-slate-600 dark:text-slate-400 space-y-1">
                {parts.map((p) => (
                  <li key={p.fileName}>{p.fileName} — pages {p.pages.join(', ')}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
