'use client';

import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  FileText,
  Info,
  ShieldCheck,
  Upload,
  XCircle,
} from 'lucide-react';

type CheckStatus = 'pass' | 'warn' | 'fail';

interface PdfCheck {
  label: string;
  value: string;
  status: CheckStatus;
  detail: string;
}

interface PdfReport {
  fileName: string;
  size: string;
  version: string;
  checks: PdfCheck[];
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

function inspectPdf(file: File, bytes: Uint8Array): PdfReport {
  const source = new TextDecoder('latin1').decode(bytes);
  const version = source.match(/%PDF-(\d\.\d)/)?.[1] || 'Unknown';
  const pageCount = (source.match(/\/Type\s*\/Page(?:\s|\/|>)/g) || []).length;
  const fontCount = (source.match(/\/Type\s*\/Font(?:\s|\/|>)/g) || []).length;
  const imageCount = (source.match(/\/Subtype\s*\/Image(?:\s|\/|>)/g) || []).length;
  const hasXref = /(?:\r?\n|^)xref(?:\r?\n|\s)/.test(source) || /startxref/.test(source);
  const hasTrailer = /trailer\s*<</.test(source);
  const encrypted = /\/Encrypt\b/.test(source);
  const riskyActions = /\/(?:JavaScript|JS|Launch|OpenAction|AA)\b/.test(source);
  const embeddedFiles = /\/EmbeddedFiles\b/.test(source);
  const hasBleedBox = /\/BleedBox\s*\[/.test(source);
  const hasTrimBox = /\/TrimBox\s*\[/.test(source);

  const checks: PdfCheck[] = [
    {
      label: 'PDF structure',
      value: hasXref && hasTrailer ? 'Healthy markers found' : 'Needs review',
      status: hasXref && hasTrailer ? 'pass' : 'warn',
      detail: hasXref && hasTrailer ? 'Header, cross-reference, and trailer markers are present.' : 'The file is missing common structural markers; some readers may have trouble opening it.',
    },
    {
      label: 'Page inventory',
      value: `${pageCount || 'Unknown'} page${pageCount === 1 ? '' : 's'}`,
      status: pageCount > 0 ? 'pass' : 'warn',
      detail: pageCount > 0 ? 'Page objects were detected in the document structure.' : 'No page objects were detected in the local scan.',
    },
    {
      label: 'Fonts',
      value: `${fontCount || 0} font object${fontCount === 1 ? '' : 's'}`,
      status: fontCount > 0 ? 'pass' : 'warn',
      detail: fontCount > 0 ? 'Font objects are present. Full embedding status may require a dedicated PDF preflight engine.' : 'No font objects were detected; text may be outlined, image-based, or incomplete.',
    },
    {
      label: 'Print boxes',
      value: hasTrimBox || hasBleedBox ? 'Trim/Bleed metadata found' : 'No trim or bleed box',
      status: hasTrimBox || hasBleedBox ? 'pass' : 'warn',
      detail: hasTrimBox || hasBleedBox ? 'The PDF contains print-production page box metadata.' : 'Commercial printers may ask for TrimBox and BleedBox values.',
    },
    {
      label: 'Embedded content',
      value: `${imageCount} image${imageCount === 1 ? '' : 's'}${embeddedFiles ? ' · embedded files found' : ''}`,
      status: embeddedFiles ? 'warn' : 'pass',
      detail: embeddedFiles ? 'Embedded files are present. Review them before distributing the PDF.' : 'Image and resource references were inspected locally.',
    },
    {
      label: 'Interactive actions',
      value: riskyActions ? 'Action entries detected' : 'No risky actions detected',
      status: riskyActions ? 'fail' : 'pass',
      detail: riskyActions ? 'JavaScript, launch, automatic-open, or additional-action entries need review.' : 'No JavaScript, launch, or automatic-action markers were found in the scanned bytes.',
    },
    {
      label: 'Encryption',
      value: encrypted ? 'Encrypted or password protected' : 'Not encrypted',
      status: encrypted ? 'warn' : 'pass',
      detail: encrypted ? 'Some inspection results may be incomplete until the document is unlocked.' : 'No encryption dictionary was found.',
    },
  ];

  return { fileName: file.name, size: formatBytes(file.size), version, checks };
}

const statusIcon = (status: CheckStatus) => {
  if (status === 'pass') return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  if (status === 'fail') return <XCircle className="h-5 w-5 text-rose-500" />;
  return <AlertTriangle className="h-5 w-5 text-amber-500" />;
};

export const PdfPreflightWorkspace: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [report, setReport] = useState<PdfReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const scanFile = async (file?: File) => {
    if (!file) return;
    setError('');
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.');
      return;
    }
    setIsScanning(true);
    try {
      const buffer = await file.arrayBuffer();
      setReport(inspectPdf(file, new Uint8Array(buffer.slice(0, Math.min(buffer.byteLength, 12 * 1024 * 1024)))));
    } catch {
      setError('This PDF could not be read in the browser. Try another copy of the file.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-5">
      {!report && (
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); void scanFile(event.dataTransfer.files[0]); }}
          className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-8 text-center shadow-xs transition hover:border-blue-500 dark:border-slate-700 dark:bg-slate-900/60 sm:p-12"
        >
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => void scanFile(event.target.files?.[0])} />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <FileCheck2 className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Drop a PDF to run a preflight check</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Check structure, pages, fonts, print boxes, embedded content, actions, and encryption before you print or share it.
          </p>
          <button type="button" onClick={() => inputRef.current?.click()} className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500">
            <Upload className="h-4 w-4" /> Choose PDF
          </button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><ShieldCheck className="h-3.5 w-3.5" /> Your PDF stays in this browser tab</p>
        </div>
      )}

      {isScanning && <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" /><p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Scanning PDF structure locally…</p></div>}
      {error && <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"><Info className="h-4 w-4 shrink-0" />{error}</div>}

      {report && !isScanning && (
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"><FileText className="h-6 w-6" /></div><div className="min-w-0"><h3 className="truncate text-base font-bold text-slate-900 dark:text-white">{report.fileName}</h3><p className="mt-1 text-xs font-mono text-slate-500">{report.size} · PDF {report.version}</p></div></div>
            <button type="button" onClick={() => { setReport(null); setError(''); }} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Scan another PDF</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {report.checks.map((check) => <div key={check.label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{check.label}</p><p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{check.value}</p></div>{statusIcon(check.status)}</div><p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{check.detail}</p></div>)}
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs leading-relaxed text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"><Info className="mt-0.5 h-4 w-4 shrink-0" /><p>This is a fast structural scan, not a replacement for a certified print-production preflight or malware scanner. The original file is never uploaded.</p></div>
        </div>
      )}
    </div>
  );
};
