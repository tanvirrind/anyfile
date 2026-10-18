'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { buildIco } from '@/lib/tools/icoBuilder';

const ICO_SIZES = [16, 32, 48, 64, 128, 256];
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_DIMENSION = 4096;

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const ImageToIcoWorkspace: React.FC = () => {
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [sourceInfo, setSourceInfo] = useState<string>('');
  const [sourceBitmap, setSourceBitmap] = useState<ImageBitmap | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sizes, setSizes] = useState<number[]>([16, 32, 48, 256]);
  const [isWorking, setIsWorking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneInfo, setDoneInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setDoneInfo(null);
    if (!/\.(png|jpe?g|webp)$/i.test(file.name)) {
      setError(`"${file.name}" is not a supported image (PNG, JPG, or WEBP).`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" exceeds the 25 MB limit for ICO conversion.`);
      return;
    }
    setIsLoading(true);
    try {
      const bitmap = await createImageBitmap(file);
      if (bitmap.width > MAX_DIMENSION || bitmap.height > MAX_DIMENSION) {
        bitmap.close();
        setError(`Image is ${bitmap.width}×${bitmap.height}px — ICO conversion supports images up to ${MAX_DIMENSION}px on a side.`);
        return;
      }
      if (sourceBitmap) sourceBitmap.close();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSourceBitmap(bitmap);
      setSourceName(file.name);
      setSourceInfo(`${bitmap.width}×${bitmap.height}px • ${formatSize(file.size)}`);
      setPreviewUrl(URL.createObjectURL(file));
    } catch {
      setError(`Could not decode "${file.name}" as an image.`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSize = (size: number) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)));
  };

  const renderPng = (size: number): Promise<ArrayBuffer> =>
    new Promise((resolve, reject) => {
      if (!sourceBitmap) {
        reject(new Error('no source'));
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('canvas unavailable'));
        return;
      }
      // Cover-crop to a square so the icon has no distortion.
      const side = Math.min(sourceBitmap.width, sourceBitmap.height);
      const sx = (sourceBitmap.width - side) / 2;
      const sy = (sourceBitmap.height - side) / 2;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(sourceBitmap, sx, sy, side, side, 0, 0, size, size);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('encode failed'));
          return;
        }
        resolve(await blob.arrayBuffer());
      }, 'image/png');
    });

  const handleConvert = async () => {
    if (!sourceBitmap || sizes.length === 0) {
      setError(sizes.length === 0 ? 'Select at least one icon size.' : 'Drop an image first.');
      return;
    }
    setError(null);
    setDoneInfo(null);
    setIsWorking(true);
    try {
      const pngs: { size: number; data: ArrayBuffer }[] = [];
      for (const size of sizes) {
        const data = await renderPng(size);
        pngs.push({ size, data });
      }
      const ico = buildIco(pngs);
      const blob = new Blob([ico], { type: 'image/x-icon' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(sourceName || 'icon').replace(/\.[a-z0-9]+$/i, '')}.ico`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDoneInfo(`Created a multi-size .ico (${sizes.map((s) => `${s}px`).join(', ')}) — works as a favicon.`);
    } catch {
      setError('ICO conversion failed. Try a different image.');
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
            <ImageIcon className="w-5 h-5 text-amber-600" />
            <span>Image to ICO — Favicon Converter</span>
          </h3>
          <p className="text-xs text-slate-500">
            Convert PNG, JPG, or WEBP into a multi-size Windows icon (.ico). Fully in your browser.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          Real ICO Container
        </span>
      </div>

      {!sourceBitmap ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-amber-500 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input type="file" ref={fileInputRef} accept=".png,.jpg,.jpeg,.webp"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
            className="hidden" />
          <div className="space-y-3 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Upload className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Drop an Image Here</h4>
              <p className="text-xs text-slate-500">PNG, JPG, or WEBP up to 25 MB</p>
            </div>
            <button type="button" className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700">
              Select Image
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {previewUrl && (
                <img src={previewUrl} alt="Source preview" className="w-12 h-12 rounded-xl object-cover border border-white/20" />
              )}
              <div>
                <p className="font-bold text-sm text-white">{sourceName}</p>
                <p className="text-xs font-mono text-slate-400">{sourceInfo}</p>
              </div>
            </div>
            <button type="button" onClick={() => { if (sourceBitmap) sourceBitmap.close(); setSourceBitmap(null); setSourceName(null); if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); setDoneInfo(null); setError(null); }}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
              Pick Another Image
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Icon sizes included in the .ico file
            </p>
            <div className="flex flex-wrap gap-2">
              {ICO_SIZES.map((size) => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors ${
                    sizes.includes(size)
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}>
                  {size}×{size}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">One .ico file holds all selected sizes — browsers and Windows pick the right one automatically.</p>
          </div>

          <button type="button" onClick={handleConvert} disabled={isWorking || sizes.length === 0}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 shadow-md">
            {isWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isWorking ? 'Converting…' : 'Convert & Download .ico'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
