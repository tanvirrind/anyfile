'use client';

import React, { useState } from 'react';
import { FileText, Download, Type, Loader2 } from 'lucide-react';
import { generateTextPdf } from '@/lib/tools/textToPdf';

const MAX_CHARS = 50000;

export const TextToPdfWorkspace: React.FC = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneInfo, setDoneInfo] = useState<string | null>(null);

  const charCount = text.length;
  const pageCount = Math.max(1, Math.ceil(charCount / 3000));

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Type or paste some text first.');
      return;
    }
    if (charCount > MAX_CHARS) {
      setError(`Text is limited to ${MAX_CHARS.toLocaleString()} characters for in-browser PDF generation.`);
      return;
    }
    setError(null);
    setDoneInfo(null);
    setIsWorking(true);
    try {
      const bytes = await generateTextPdf(text, {
        title: title.trim() || undefined,
        fontSize,
        pageSize,
      });
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `${(title.trim() || 'document').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'document'}.pdf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDoneInfo(`Generated ${fileName}.`);
    } catch {
      setError('PDF generation failed. Try shorter text or a different browser.');
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
            <Type className="w-5 h-5 text-rose-600" />
            <span>Text to PDF — Write a PDF Document</span>
          </h3>
          <p className="text-xs text-slate-500">
            Paste plain text and download a paginated PDF. All formatting happens in your browser.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
          Local PDF Authoring
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2 sm:col-span-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="ttp-title">Document title (optional)</label>
          <input id="ttp-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="My Document"
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="ttp-fontsize">Font size</label>
          <select id="ttp-fontsize" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500">
            {[10, 11, 12, 14, 16].map((s) => <option key={s} value={s}>{s} pt</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="ttp-pagesize">Page size</label>
          <select id="ttp-pagesize" value={pageSize} onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter')}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500">
            <option value="a4">A4</option>
            <option value="letter">US Letter</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="ttp-text">
            Your text (plain text — ~{pageCount} page{pageCount === 1 ? '' : 's'})
          </label>
          <span className={`text-xs font-mono ${charCount > MAX_CHARS ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
        <textarea id="ttp-text" value={text} onChange={(e) => setText(e.target.value)} rows={14}
          placeholder="Type or paste your text here… Paragraphs are preserved; blank lines separate them."
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-y" />
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" /> Plain text only — this tool writes simple text PDFs, not rich layouts or images.
        </p>
      </div>

      <button type="button" onClick={handleGenerate} disabled={isWorking || !text.trim()}
        className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 shadow-md">
        {isWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        <span>{isWorking ? 'Generating…' : 'Generate & Download PDF'}</span>
      </button>
    </div>
  );
};
