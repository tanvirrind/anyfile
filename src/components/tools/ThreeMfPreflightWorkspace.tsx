'use client';

import React, { useRef, useState } from 'react';
import { AlertTriangle, Box, CheckCircle2, FileCheck2, Info, ShieldCheck, Upload, XCircle } from 'lucide-react';
import { parse3mf, ThreeMfPackageInfo } from '../../lib/3d/threeMfEngine';

type Status = 'pass' | 'warn' | 'fail';
interface Check { label: string; value: string; status: Status; detail: string; }

const icon = (status: Status) => status === 'pass' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : status === 'fail' ? <XCircle className="h-5 w-5 text-rose-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />;
const formatBytes = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

function dimensions(info: ThreeMfPackageInfo) {
  const vertices = info.objects.flatMap((object) => object.vertices);
  if (!vertices.length) return 'Unknown';
  const xs = vertices.map((v) => v.x); const ys = vertices.map((v) => v.y); const zs = vertices.map((v) => v.z);
  return `${(Math.max(...xs) - Math.min(...xs)).toFixed(1)} × ${(Math.max(...ys) - Math.min(...ys)).toFixed(1)} × ${(Math.max(...zs) - Math.min(...zs)).toFixed(1)} mm`;
}

export const ThreeMfPreflightWorkspace: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [report, setReport] = useState<{ file: File; info: ThreeMfPackageInfo } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const scan = async (file?: File) => {
    if (!file) return;
    setError(''); setBusy(true);
    try { setReport({ file, info: await parse3mf(await file.arrayBuffer()) }); }
    catch (err) { setReport(null); setError(err instanceof Error ? err.message : 'This 3MF package could not be inspected.'); }
    finally { setBusy(false); }
  };

  const checks = report ? (() => {
    const { info } = report;
    const files = info.containedFiles.map((name) => name.toLowerCase());
    const hasThumbnail = files.some((name) => name.includes('thumbnail') || name.endsWith('.png'));
    const hasMaterials = files.some((name) => name.includes('material')) || info.objects.some((object) => object.type !== 'model');
    const emptyObject = info.objects.length === 0 || info.totalTriangles === 0;
    return [
      { label: '3MF package', value: `${info.containedFiles.length} package entries`, status: 'pass' as Status, detail: 'The ZIP-based 3MF container and model manifest were read successfully.' },
      { label: 'Units', value: info.unit, status: info.unit === 'millimeter' ? 'pass' as Status : 'warn' as Status, detail: info.unit === 'millimeter' ? 'Millimetres are the expected unit for most slicer workflows.' : `The model declares ${info.unit}; confirm scale before printing.` },
      { label: 'Build contents', value: `${info.buildItems.length} build item${info.buildItems.length === 1 ? '' : 's'} · ${info.objects.length} object${info.objects.length === 1 ? '' : 's'}`, status: emptyObject ? 'fail' as Status : 'pass' as Status, detail: emptyObject ? 'No printable triangle geometry was found.' : 'Objects and build items are present in the model manifest.' },
      { label: 'Geometry', value: `${info.totalTriangles.toLocaleString()} triangles`, status: emptyObject ? 'fail' as Status : 'pass' as Status, detail: `${info.totalVertices.toLocaleString()} vertices · bounding size ${dimensions(info)}.` },
      { label: 'Slicer origin', value: info.slicerOrigin || 'Generic 3MF', status: info.slicerOrigin && info.slicerOrigin !== 'Generic 3MF' ? 'pass' as Status : 'warn' as Status, detail: info.application ? `Application metadata: ${info.application}` : 'No known slicer origin was detected from package metadata.' },
      { label: 'Preview assets', value: hasThumbnail ? 'Thumbnail or preview found' : 'No thumbnail detected', status: hasThumbnail ? 'pass' as Status : 'warn' as Status, detail: hasThumbnail ? 'A preview asset is available for quick visual confirmation.' : 'The file may still print correctly, but it has no obvious package preview asset.' },
      { label: 'Materials & metadata', value: hasMaterials || info.title || info.designer ? 'Metadata present' : 'Minimal metadata', status: hasMaterials || info.title || info.designer ? 'pass' as Status : 'warn' as Status, detail: info.title || info.designer ? `${info.title || 'Untitled'}${info.designer ? ` · by ${info.designer}` : ''}` : 'No title, designer, or material resource metadata was detected.' },
    ];
  })() : [];

  return <div className="space-y-5">
    {!report && !busy && <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void scan(event.dataTransfer.files[0]); }} className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-8 text-center shadow-xs transition hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 sm:p-12">
      <input ref={inputRef} type="file" accept=".3mf" className="hidden" onChange={(event) => void scan(event.target.files?.[0])} />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400"><FileCheck2 className="h-8 w-8" /></div>
      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Check a 3MF print job before slicing</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">Inspect units, scale, build items, mesh size, slicer origin, thumbnails, and package metadata in your browser.</p>
      <button type="button" onClick={() => inputRef.current?.click()} className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-500"><Upload className="h-4 w-4" /> Choose 3MF file</button>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><ShieldCheck className="h-3.5 w-3.5" /> Your model stays in this browser tab</p>
    </div>}
    {busy && <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" /><p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Unpacking 3MF geometry and package metadata locally…</p></div>}
    {error && <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-relaxed text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"><Info className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
    {report && !busy && <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center"><div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-cyan-50 p-3 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400"><Box className="h-6 w-6" /></div><div className="min-w-0"><h3 className="truncate text-base font-bold text-slate-900 dark:text-white">{report.file.name}</h3><p className="mt-1 text-xs font-mono text-slate-500">{formatBytes(report.file.size)} · {report.info.slicerOrigin || 'Generic 3MF'}</p></div></div><button type="button" onClick={() => setReport(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Inspect another model</button></div>
      <div className="grid gap-3 sm:grid-cols-2">{checks.map((check) => <div key={check.label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{check.label}</p><p className="mt-1 text-sm font-bold capitalize text-slate-900 dark:text-white">{check.value}</p></div>{icon(check.status)}</div><p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{check.detail}</p></div>)}</div>
      <div className="flex items-start gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-xs leading-relaxed text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-200"><Info className="mt-0.5 h-4 w-4 shrink-0" /><p>This preflight checks package and geometry metadata. It does not replace slicer-specific checks for supports, wall thickness, clearance, filament profiles, or actual printability.</p></div>
    </div>}
  </div>;
};
