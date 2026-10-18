'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Maximize2, Lock, Unlock, Loader2, RefreshCw } from 'lucide-react';

import {
  ResizeMode, ResizeOutFormat, RESIZE_PRESETS, MAX_DIMENSION,
  computeTargetDims, lockedCounterpart, mimeForFormat, extForFormat,
} from '@/lib/tools/resizeMath';

const MAX_FILE_BYTES = 25 * 1024 * 1024;

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const ImageResizerWorkspace: React.FC = () => {
  const [sourceBitmap, setSourceBitmap] = useState<ImageBitmap | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<string>('');
  const [sourceInfo, setSourceInfo] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [mode, setMode] = useState<ResizeMode>('percent');
  const [percent, setPercent] = useState(50);
  const [pixelW, setPixelW] = useState(0);
  const [pixelH, setPixelH] = useState(0);
  const [aspectLocked, setAspectLocked] = useState(true);
  const [presetIdx, setPresetIdx] = useState(1);

  const [outFormat, setOutFormat] = useState<ResizeOutFormat>('original');
  const [quality, setQuality] = useState(85);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultInfo, setResultInfo] = useState<string | null>(null);
  const [resultDims, setResultDims] = useState<{ w: number; h: number } | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPixelEdit = useRef<'w' | 'h' | null>(null);

  const naturalW = sourceBitmap?.width ?? 0;
  const naturalH = sourceBitmap?.height ?? 0;

  // Initialize pixel fields when a source loads.
  useEffect(() => {
    if (naturalW > 0) {
      setPixelW(naturalW);
      setPixelH(naturalH);
    }
  }, [naturalW, naturalH]);

  // Cleanup result URL on unmount.
  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  const targetDims = (): { w: number; h: number } => {
    if (mode === 'percent') return computeTargetDims(naturalW, naturalH, { mode: 'percent', percent });
    if (mode === 'preset') return computeTargetDims(naturalW, naturalH, { mode: 'preset', preset: RESIZE_PRESETS[presetIdx] });
    return computeTargetDims(naturalW, naturalH, { mode: 'pixels', w: pixelW, h: pixelH });
  };

  const handleFile = async (file: File) => {
    setError(null);
    setResultUrl(null);
    setResultInfo(null);
    setResultDims(null);
    if (!/\.(png|jpe?g|webp)$/i.test(file.name)) {
      setError(`"${file.name}" is not a supported image (PNG, JPG, or WEBP).`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" exceeds the 25 MB limit for resizing.`);
      return;
    }
    setIsLoading(true);
    try {
      const bitmap = await createImageBitmap(file);
      if (bitmap.width > MAX_DIMENSION || bitmap.height > MAX_DIMENSION) {
        bitmap.close();
        setError(`Image is ${bitmap.width}×${bitmap.height}px — resizing supports images up to ${MAX_DIMENSION}px on a side.`);
        return;
      }
      if (sourceBitmap) sourceBitmap.close();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSourceBitmap(bitmap);
      setSourceName(file.name);
      setSourceType(file.type);
      setSourceInfo(`${bitmap.width}×${bitmap.height}px • ${formatSize(file.size)}`);
      setPreviewUrl(URL.createObjectURL(file));
      setPercent(50);
      setPixelW(bitmap.width);
      setPixelH(bitmap.height);
    } catch {
      setError(`Could not decode "${file.name}" as an image.`);
    } finally {
      setIsLoading(false);
    }
  };

  const onPixelW = (v: number) => {
    setPixelW(v);
    lastPixelEdit.current = 'w';
    if (aspectLocked) {
      const h = lockedCounterpart(naturalW, naturalH, 'w', v);
      if (h > 0) setPixelH(h);
    }
  };

  const onPixelH = (v: number) => {
    setPixelH(v);
    lastPixelEdit.current = 'h';
    if (aspectLocked) {
      const w = lockedCounterpart(naturalW, naturalH, 'h', v);
      if (w > 0) setPixelW(w);
    }
  };

  const handleResize = async () => {
    if (!sourceBitmap) {
      setError('Drop an image first.');
      return;
    }
    const { w, h } = targetDims();
    if (w <= 0 || h <= 0 || w > MAX_DIMENSION || h > MAX_DIMENSION) {
      setError(`Target dimensions must be between 1 and ${MAX_DIMENSION}px.`);
      return;
    }
    setError(null);
    setIsWorking(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas unavailable');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(sourceBitmap, 0, 0, w, h);
      const mime = mimeForFormat(outFormat, sourceType);
      const lossy = mime === 'image/jpeg' || mime === 'image/webp';
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, mime, lossy ? quality / 100 : undefined)
      );
      if (!blob) throw new Error('encode failed');
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultDims({ w, h });
      setResultInfo(`${w}×${h}px • ${extForFormat(outFormat, mime).toUpperCase()} • ${formatSize(blob.size)}`);
    } catch {
      setError('Resizing failed. Try a different image.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const { w } = targetDims();
    const base = (sourceName || 'image').replace(/\.[a-z0-9]+$/i, '');
    const ext = extForFormat(outFormat, mimeForFormat(outFormat, sourceType));
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${base}-${w}px.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const { w: tw, h: th } = targetDims();
  const showQuality = outFormat === 'jpg' || outFormat === 'webp' || (outFormat === 'original' && (sourceType === 'image/jpeg' || sourceType === 'image/webp'));

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
            <Maximize2 className="w-5 h-5 text-sky-600" />
            <span>Image Resizer</span>
          </h3>
          <p className="text-xs text-slate-500">
            Resize PNG, JPG, or WEBP by pixels, percent, or preset. Fully in your browser.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
          {naturalW > 0 ? `${naturalW}×${naturalH}` : 'No image'}
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
              ? 'border-sky-600 bg-sky-50/70 dark:bg-sky-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-sky-500 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input type="file" ref={fileInputRef} accept=".png,.jpg,.jpeg,.webp"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
            className="hidden" />
          <div className="space-y-3 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
              {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Upload className="w-7 h-7" />}
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Drop an Image Here</h4>
              <p className="text-xs text-slate-500">PNG, JPG, or WEBP up to 25 MB</p>
            </div>
            <button type="button" className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700">
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
            <button type="button" onClick={() => { if (sourceBitmap) sourceBitmap.close(); setSourceBitmap(null); setSourceName(null); if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); setResultUrl(null); setResultInfo(null); setResultDims(null); setError(null); }}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
              Pick Another Image
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resize mode</p>
            <div className="flex flex-wrap gap-2">
              {(['percent', 'pixels', 'preset'] as ResizeMode[]).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors capitalize ${
                    mode === m
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}>
                  {m === 'pixels' ? 'Exact pixels' : m === 'percent' ? 'Percent' : 'Presets'}
                </button>
              ))}
            </div>

            {mode === 'percent' && (
              <div className="flex items-center gap-4">
                <input type="range" min={1} max={100} value={percent} onChange={(e) => setPercent(Number(e.target.value))}
                  className="flex-1 accent-sky-600" aria-label="Resize percent" />
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white w-16 text-right">{percent}%</span>
                <span className="text-xs font-mono text-slate-500 w-32">→ {tw}×{th}px</span>
              </div>
            )}

            {mode === 'pixels' && (
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  W
                  <input type="number" min={1} max={MAX_DIMENSION} value={pixelW} onChange={(e) => onPixelW(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono" />
                </label>
                <span className="text-slate-400 font-bold">×</span>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  H
                  <input type="number" min={1} max={MAX_DIMENSION} value={pixelH} onChange={(e) => onPixelH(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono" />
                </label>
                <button type="button" onClick={() => setAspectLocked((v) => !v)} title={aspectLocked ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                  className={`p-2 rounded-xl border transition-colors ${aspectLocked ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 dark:border-slate-700 text-slate-500'}`}>
                  {aspectLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>
            )}

            {mode === 'preset' && (
              <div className="flex flex-wrap gap-2">
                {RESIZE_PRESETS.map((p, i) => (
                  <button key={p.label} type="button" onClick={() => setPresetIdx(i)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      presetIdx === i
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}>
                    {p.label}
                    <span className="ml-1 font-mono font-normal opacity-70">{p.height > 0 ? `${p.width}×${p.height}` : `${p.width}w`}</span>
                  </button>
                ))}
              </div>
            )}

            <p className="text-xs font-mono text-slate-500">
              Result: <span className="font-bold text-slate-900 dark:text-white">{tw}×{th}px</span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Output format</p>
              <div className="flex flex-wrap gap-2">
                {(['original', 'png', 'jpg', 'webp'] as ResizeOutFormat[]).map((f) => (
                  <button key={f} type="button" onClick={() => setOutFormat(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors uppercase ${
                      outFormat === f
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}>
                    {f === 'original' ? 'Keep' : f}
                  </button>
                ))}
              </div>
            </div>
            {showQuality && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quality <span className="font-mono normal-case font-normal">{quality}%</span></p>
                <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-sky-600" aria-label="Output quality" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleResize} disabled={isWorking}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 shadow-md">
              {isWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>{isWorking ? 'Resizing…' : 'Resize Image'}</span>
            </button>
            {resultUrl && (
              <button type="button" onClick={handleDownload}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center gap-2 shadow-md">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
          </div>

          {resultUrl && resultInfo && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <img src={resultUrl} alt="Resized result" className="max-h-24 rounded-xl border border-slate-200 dark:border-slate-700" />
              <div className="text-sm">
                <p className="font-bold text-slate-900 dark:text-white">Resized image ready</p>
                <p className="text-xs font-mono text-slate-500">{resultInfo}</p>
                {resultDims && (
                  <p className="text-xs font-mono text-slate-500">Actual output: {resultDims.w}×{resultDims.h}px</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
