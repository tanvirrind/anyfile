'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Crop, Loader2 } from 'lucide-react';
import {
  CropRect, CropBounds, CropHandle, defaultCrop, fitAspect, moveCrop, resizeCrop,
} from '@/lib/tools/cropMath';

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_DIMENSION = 8192;
const MAX_DISPLAY_W = 680;

const ASPECTS: { label: string; ratio: number | null }[] = [
  { label: 'Free', ratio: null },
  { label: '1:1', ratio: 1 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '3:2', ratio: 3 / 2 },
  { label: '16:9', ratio: 16 / 9 },
];

type OutFormat = 'png' | 'jpg' | 'webp';

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const HANDLES: CropHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

export const ImageCropperWorkspace: React.FC = () => {
  const [sourceBitmap, setSourceBitmap] = useState<ImageBitmap | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [sourceInfo, setSourceInfo] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [aspect, setAspect] = useState<number | null>(1);
  const [outFormat, setOutFormat] = useState<OutFormat>('png');
  const [quality, setQuality] = useState(90);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultInfo, setResultInfo] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const dragState = useRef<{
    mode: 'move' | CropHandle;
    startX: number; startY: number; startCrop: CropRect;
  } | null>(null);

  const naturalW = sourceBitmap?.width ?? 0;
  const naturalH = sourceBitmap?.height ?? 0;
  const displayW = Math.min(MAX_DISPLAY_W, naturalW || MAX_DISPLAY_W);
  const scale = naturalW > 0 ? displayW / naturalW : 1;
  const displayH = naturalH * scale;
  const bounds: CropBounds = { w: naturalW, h: naturalH };

  // Live crop preview.
  const renderPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !sourceBitmap || crop.w < 1 || crop.h < 1) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const maxPrev = 180;
    const s = Math.min(1, maxPrev / crop.w, maxPrev / crop.h);
    canvas.width = Math.max(1, Math.round(crop.w * s));
    canvas.height = Math.max(1, Math.round(crop.h * s));
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceBitmap, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);
  }, [sourceBitmap, crop]);

  useEffect(() => { renderPreview(); }, [renderPreview]);
  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  const handleFile = async (file: File) => {
    setError(null);
    setResultUrl(null);
    setResultInfo(null);
    if (!/\.(png|jpe?g|webp)$/i.test(file.name)) {
      setError(`"${file.name}" is not a supported image (PNG, JPG, or WEBP).`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" exceeds the 25 MB limit for cropping.`);
      return;
    }
    setIsLoading(true);
    try {
      const bitmap = await createImageBitmap(file);
      if (bitmap.width > MAX_DIMENSION || bitmap.height > MAX_DIMENSION) {
        bitmap.close();
        setError(`Image is ${bitmap.width}×${bitmap.height}px — cropping supports images up to ${MAX_DIMENSION}px on a side.`);
        return;
      }
      if (sourceBitmap) sourceBitmap.close();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSourceBitmap(bitmap);
      setSourceName(file.name);
      setSourceInfo(`${bitmap.width}×${bitmap.height}px • ${formatSize(file.size)}`);
      setPreviewUrl(URL.createObjectURL(file));
      const b: CropBounds = { w: bitmap.width, h: bitmap.height };
      setCrop(fitAspect(defaultCrop(b), 1, b));
      setAspect(1);
    } catch {
      setError(`Could not decode "${file.name}" as an image.`);
    } finally {
      setIsLoading(false);
    }
  };

  const onAspect = (ratio: number | null) => {
    setAspect(ratio);
    setCrop((c) => fitAspect(c, ratio, bounds));
  };

  const toSourceDelta = (clientX: number, clientY: number, startX: number, startY: number) => ({
    dx: (clientX - startX) / scale,
    dy: (clientY - startY) / scale,
  });

  const onPointerDown = (e: React.PointerEvent, mode: 'move' | CropHandle) => {
    if (!sourceBitmap) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragState.current = { mode, startX: e.clientX, startY: e.clientY, startCrop: { ...crop } };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d || !sourceBitmap) return;
    const { dx, dy } = toSourceDelta(e.clientX, e.clientY, d.startX, d.startY);
    setCrop(d.mode === 'move'
      ? moveCrop(d.startCrop, dx, dy, bounds)
      : resizeCrop(d.startCrop, dx, dy, d.mode, aspect, bounds));
  };

  const onPointerUp = () => {
    dragState.current = null;
  };

  const handleExport = async () => {
    if (!sourceBitmap || crop.w < 1 || crop.h < 1) {
      setError('Select a crop region first.');
      return;
    }
    setError(null);
    setIsWorking(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(crop.w);
      canvas.height = Math.round(crop.h);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas unavailable');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(sourceBitmap, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);
      const mime = outFormat === 'png' ? 'image/png' : outFormat === 'jpg' ? 'image/jpeg' : 'image/webp';
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, mime, outFormat === 'png' ? undefined : quality / 100)
      );
      if (!blob) throw new Error('encode failed');
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultInfo(`${canvas.width}×${canvas.height}px • ${outFormat.toUpperCase()} • ${formatSize(blob.size)}`);
    } catch {
      setError('Cropping failed. Try a different image.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const base = (sourceName || 'image').replace(/\.[a-z0-9]+$/i, '');
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${base}-cropped.${outFormat === 'jpg' ? 'jpg' : outFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const boxStyle: React.CSSProperties = {
    left: crop.x * scale,
    top: crop.y * scale,
    width: Math.max(2, crop.w * scale),
    height: Math.max(2, crop.h * scale),
  };

  const handlePos = (h: CropHandle): React.CSSProperties => {
    const pos: React.CSSProperties = { position: 'absolute', width: 12, height: 12, borderRadius: 3, background: '#fff', border: '2px solid #2563eb', transform: 'translate(-50%, -50%)', cursor: `${h}-resize`, zIndex: 10 };
    if (h.includes('n')) pos.top = 0; else if (h.includes('s')) pos.top = '100%';
    if (h.includes('w')) pos.left = 0; else if (h.includes('e')) pos.left = '100%';
    if (h === 'n' || h === 's') pos.left = '50%';
    if (h === 'e' || h === 'w') pos.top = '50%';
    return pos;
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
            <Crop className="w-5 h-5 text-violet-600" />
            <span>Image Cropper</span>
          </h3>
          <p className="text-xs text-slate-500">
            Drag the crop frame to any region, then export at full resolution. Fully in your browser.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
          {naturalW > 0 ? `${Math.round(crop.w)}×${Math.round(crop.h)} px` : 'No image'}
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
              ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-violet-500 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input type="file" ref={fileInputRef} accept=".png,.jpg,.jpeg,.webp"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
            className="hidden" />
          <div className="space-y-3 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-violet-500/20">
              {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Upload className="w-7 h-7" />}
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Drop an Image Here</h4>
              <p className="text-xs text-slate-500">PNG, JPG, or WEBP up to 25 MB</p>
            </div>
            <button type="button" className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700">
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
            <button type="button" onClick={() => { if (sourceBitmap) sourceBitmap.close(); setSourceBitmap(null); setSourceName(null); if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); setResultUrl(null); setResultInfo(null); setError(null); }}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
              Pick Another Image
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Aspect ratio</p>
            <div className="flex flex-wrap gap-2">
              {ASPECTS.map((a) => (
                <button key={a.label} type="button" onClick={() => onAspect(a.ratio)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors ${
                    aspect === a.ratio
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            <div
              ref={areaRef}
              className="relative select-none touch-none mx-auto"
              style={{ width: displayW, height: displayH, maxWidth: '100%' }}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {previewUrl && (
                <img src={previewUrl} alt="Crop source" draggable={false}
                  className="absolute inset-0 w-full h-full object-fill rounded-xl border border-slate-200 dark:border-slate-700" />
              )}
              <div
                className="absolute border-2 border-violet-500 cursor-move"
                style={{ ...boxStyle, boxShadow: '0 0 0 9999px rgba(2,6,23,0.55)' }}
                onPointerDown={(e) => onPointerDown(e, 'move')}
              >
                {HANDLES.map((h) => (
                  <div key={h} style={handlePos(h)} onPointerDown={(e) => onPointerDown(e, h)} />
                ))}
              </div>
            </div>
            <div className="flex lg:flex-col items-center gap-3 shrink-0">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Live preview</p>
                <canvas ref={previewCanvasRef} className="rounded-xl border border-slate-200 dark:border-slate-700 max-w-[180px]" />
                <p className="text-xs font-mono text-slate-500 mt-2">
                  {Math.round(crop.w)}×{Math.round(crop.h)} px
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Output format</p>
              <div className="flex flex-wrap gap-2">
                {(['png', 'jpg', 'webp'] as OutFormat[]).map((f) => (
                  <button key={f} type="button" onClick={() => setOutFormat(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors uppercase ${
                      outFormat === f
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {outFormat !== 'png' && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quality <span className="font-mono normal-case font-normal">{quality}%</span></p>
                <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-violet-600" aria-label="Output quality" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleExport} disabled={isWorking}
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 shadow-md">
              {isWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crop className="w-4 h-4" />}
              <span>{isWorking ? 'Cropping…' : 'Crop Image'}</span>
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
              <img src={resultUrl} alt="Cropped result" className="max-h-24 rounded-xl border border-slate-200 dark:border-slate-700" />
              <div className="text-sm">
                <p className="font-bold text-slate-900 dark:text-white">Cropped image ready</p>
                <p className="text-xs font-mono text-slate-500">{resultInfo}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
