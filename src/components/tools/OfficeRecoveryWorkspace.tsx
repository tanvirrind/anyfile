'use client';

import React, { useRef, useState } from 'react';
import JSZip from 'jszip';
import {
  AlertTriangle,
  CheckCircle2,
  FileArchive,
  FileText,
  Info,
  ShieldCheck,
  Upload,
  XCircle,
} from 'lucide-react';

type Status = 'pass' | 'warn' | 'fail';

interface Check {
  label: string;
  value: string;
  status: Status;
  detail: string;
}

interface Report {
  fileName: string;
  format: string;
  size: string;
  checks: Check[];
  recoverableParts: string[];
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const statusIcon = (status: Status) => {
  if (status === 'pass') return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  if (status === 'fail') return <XCircle className="h-5 w-5 text-rose-500" />;
  return <AlertTriangle className="h-5 w-5 text-amber-500" />;
};

const getFormat = (name: string) => {
  const extension = name.toLowerCase().split('.').pop();
  if (extension === 'docx') return { label: 'Word document', mainPart: 'word/document.xml' };
  if (extension === 'xlsx') return { label: 'Excel workbook', mainPart: 'xl/workbook.xml' };
  if (extension === 'pptx') return { label: 'PowerPoint presentation', mainPart: 'ppt/presentation.xml' };
  return null;
};

async function inspectOfficeFile(file: File): Promise<Report> {
  const format = getFormat(file.name);
  if (!format) throw new Error('Choose a DOCX, XLSX, or PPTX file.');

  const zip = await JSZip.loadAsync(await file.arrayBuffer(), { checkCRC32: true });
  const names = Object.keys(zip.files);
  const contentTypes = zip.files['[Content_Types].xml'];
  const relationships = zip.files['_rels/.rels'];
  const mainPart = zip.files[format.mainPart];
  const coreProperties = zip.files['docProps/core.xml'];
  const mediaCount = names.filter((name) => /^(word|xl|ppt)\/media\//.test(name)).length;
  const relCount = names.filter((name) => /\.rels$/.test(name)).length;
  const recoverableParts = names.filter((name) => /^(word|xl|ppt)\/(document|workbook|presentation|slide|media)\//.test(name) || /^(word|xl|ppt)\/(document|workbook|presentation)\.xml$/.test(name)).slice(0, 10);

  const checks: Check[] = [
    {
      label: 'Package container',
      value: `${names.length} ZIP entries readable`,
      status: 'pass',
      detail: 'The Office file opened as an OPC ZIP package and its entries could be enumerated.',
    },
    {
      label: 'Content types',
      value: contentTypes ? 'Present' : 'Missing',
      status: contentTypes ? 'pass' : 'fail',
      detail: contentTypes ? 'The package includes the MIME declarations used to identify Office parts.' : 'Without [Content_Types].xml, Office may report that the document is corrupt or unreadable.',
    },
    {
      label: 'Package relationships',
      value: relationships ? `${relCount} relationship file${relCount === 1 ? '' : 's'}` : 'Root relationships missing',
      status: relationships ? 'pass' : 'warn',
      detail: relationships ? 'Root and part relationships can be inspected by a recovery workflow.' : 'The root relationship map is missing; content may still be recoverable from individual XML parts.',
    },
    {
      label: 'Main document part',
      value: mainPart ? 'Present' : 'Missing',
      status: mainPart ? 'pass' : 'fail',
      detail: mainPart ? `${format.mainPart} is present in the package.` : `The expected ${format.mainPart} part was not found. Look for a backup or recover text from remaining parts.`,
    },
    {
      label: 'Media assets',
      value: `${mediaCount} embedded asset${mediaCount === 1 ? '' : 's'}`,
      status: mediaCount > 0 ? 'pass' : 'warn',
      detail: mediaCount > 0 ? 'Images and other media are present as separate recoverable package entries.' : 'No embedded media entries were found in the standard media folder.',
    },
    {
      label: 'Core properties',
      value: coreProperties ? 'Present' : 'Not found',
      status: coreProperties ? 'pass' : 'warn',
      detail: coreProperties ? 'Author, title, dates, and application metadata may be recoverable.' : 'The optional core-properties part is absent.',
    },
  ];

  return { fileName: file.name, format: format.label, size: formatBytes(file.size), checks, recoverableParts };
}

export const OfficeRecoveryWorkspace: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const scanFile = async (file?: File) => {
    if (!file) return;
    setError('');
    setIsScanning(true);
    try {
      setReport(await inspectOfficeFile(file));
    } catch (scanError) {
      setReport(null);
      setError(scanError instanceof Error && scanError.message.includes('DOCX') ? scanError.message : 'The Office package could not be opened. It may have a damaged ZIP container, an incomplete download, or an unsupported format.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-5">
      {!report && !isScanning && (
        <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void scanFile(event.dataTransfer.files[0]); }} className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-8 text-center shadow-xs transition hover:border-violet-500 dark:border-slate-700 dark:bg-slate-900/60 sm:p-12">
          <input ref={inputRef} type="file" accept=".docx,.xlsx,.pptx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation" className="hidden" onChange={(event) => void scanFile(event.target.files?.[0])} />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400"><FileArchive className="h-8 w-8" /></div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Drop a damaged Office file here</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">Inspect the internal package and find out whether text, media, or XML parts are still recoverable.</p>
          <button type="button" onClick={() => inputRef.current?.click()} className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-500"><Upload className="h-4 w-4" /> Choose Office file</button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><ShieldCheck className="h-3.5 w-3.5" /> DOCX, XLSX, and PPTX stay in this browser tab</p>
        </div>
      )}

      {isScanning && <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" /><p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Opening Office package and checking XML parts locally…</p></div>}
      {error && <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-relaxed text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"><Info className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

      {report && !isScanning && <div className="space-y-5">
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center"><div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400"><FileText className="h-6 w-6" /></div><div className="min-w-0"><h3 className="truncate text-base font-bold text-slate-900 dark:text-white">{report.fileName}</h3><p className="mt-1 text-xs font-mono text-slate-500">{report.format} · {report.size}</p></div></div><button type="button" onClick={() => { setReport(null); setError(''); }} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Inspect another file</button></div>
        <div className="grid gap-3 sm:grid-cols-2">{report.checks.map((check) => <div key={check.label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{check.label}</p><p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{check.value}</p></div>{statusIcon(check.status)}</div><p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{check.detail}</p></div>)}</div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center gap-2"><FileArchive className="h-5 w-5 text-violet-600" /><h3 className="text-sm font-bold text-slate-900 dark:text-white">Potentially recoverable package parts</h3></div><p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">These entries were readable and may contain text, slides, workbook data, or media even if the full document does not open.</p><div className="mt-4 flex flex-wrap gap-2">{report.recoverableParts.length > 0 ? report.recoverableParts.map((part) => <span key={part} className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">{part}</span>) : <span className="text-xs text-amber-600 dark:text-amber-400">No standard content parts were found.</span>}</div></div>
        <div className="flex items-start gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-xs leading-relaxed text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200"><Info className="mt-0.5 h-4 w-4 shrink-0" /><p>This tool diagnoses the Office package and identifies recoverable parts. It does not rewrite the original file, and it cannot guarantee recovery when XML content or ZIP entries are deeply corrupted.</p></div>
      </div>}
    </div>
  );
};
