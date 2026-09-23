'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileImage,
  Sliders,
  Download,
  FolderArchive,
  RefreshCw,
  Trash2,
  Lock,
  Unlock,
  AlertCircle,
  Eye,
  Sparkles,
  Maximize,
  X
} from 'lucide-react';
import {
  resizeImageFile,
  loadImageElement,
  createBatchZip,
  formatBytes,
  ProcessedImageResult,
  ResizeImageOptions
} from '../../lib/tools/imageEngine';

interface ResizeItem {
  id: string;
  file: File;
  origWidth: number;
  origHeight: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: ProcessedImageResult;
  error?: string;
}

export const ImageResizerWorkspace: React.FC = () => {
  const [items, setItems] = useState<ResizeItem[]>([]);
  const [targetWidth, setTargetWidth] = useState<number | undefined>(1920);
  const [targetHeight, setTargetHeight] = useState<number | undefined>(1080);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [scalePercent, setScalePercent] = useState<number | undefined>(undefined);
  const [mode, setMode] = useState<'contain' | 'cover' | 'exact'>('contain');
  const [outputFormat, setOutputFormat] = useState<'jpg' | 'png' | 'webp'>('jpg');
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<ResizeItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (incomingFiles: FileList | File[]) => {
    const validFiles = Array.from(incomingFiles).filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      return ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'bmp', 'svg'].includes(ext) || file.type.startsWith('image/');
    });

    if (validFiles.length === 0) return;

    const newItems: ResizeItem[] = [];

    for (const file of validFiles) {
      try {
        const { width, height } = await loadImageElement(file);
        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          origWidth: width,
          origHeight: height,
          status: 'pending',
          progress: 0
        });
      } catch (err) {
        console.warn('Could not inspect dimensions for file:', file.name);
      }
    }

    if (newItems.length > 0) {
      // If this is the first file and target dimensions aren't set, default to 50% or first file's dimensions
      if (items.length === 0 && newItems[0]) {
        setTargetWidth(newItems[0].origWidth);
        setTargetHeight(newItems[0].origHeight);
      }
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    setScalePercent(undefined);
    if (lockRatio && items.length > 0 && items[0].origWidth > 0) {
      const ratio = items[0].origHeight / items[0].origWidth;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    setScalePercent(undefined);
    if (lockRatio && items.length > 0 && items[0].origHeight > 0) {
      const ratio = items[0].origWidth / items[0].origHeight;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const handlePercentPreset = (percent: number) => {
    setScalePercent(percent);
    if (items.length > 0 && items[0]) {
      setTargetWidth(Math.round((items[0].origWidth * percent) / 100));
      setTargetHeight(Math.round((items[0].origHeight * percent) / 100));
    }
  };

  const handleProcessAll = async () => {
    if (items.length === 0 || isProcessing) return;

    setIsProcessing(true);
    const options: ResizeImageOptions = {
      width: targetWidth,
      height: targetHeight,
      scalePercent,
      maintainAspectRatio: lockRatio,
      mode,
      outputFormat,
      quality: quality / 100
    };

    const updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      item.status = 'processing';
      item.progress = 25;
      setItems([...updatedItems]);

      try {
        const result = await resizeImageFile(item.file, options);
        item.status = 'completed';
        item.progress = 100;
        item.result = result;
      } catch (err: any) {
        item.status = 'error';
        item.error = err.message || 'Resize failed.';
      }

      setItems([...updatedItems]);
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    const pendingCount = items.filter((i) => i.status === 'pending').length;
    if (pendingCount > 0 && !isProcessing) {
      handleProcessAll();
    }
  }, [items.length]);

  const handleClearAll = () => {
    items.forEach((i) => {
      if (i.result?.outputBlobUrl) {
        URL.revokeObjectURL(i.result.outputBlobUrl);
      }
    });
    setItems([]);
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.result?.outputBlobUrl) {
      URL.revokeObjectURL(item.result.outputBlobUrl);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDownloadSingle = (item: ResizeItem) => {
    if (!item.result) return;
    const a = document.createElement('a');
    a.href = item.result.outputBlobUrl;
    a.download = item.result.outputFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAllZip = async () => {
    const completed = items.filter((i) => i.status === 'completed' && i.result);
    if (completed.length === 0) return;

    const payload = completed.map((i) => ({
      blob: i.result!.outputBlob,
      fileName: i.result!.outputFileName
    }));

    const { zipUrl } = await createBatchZip(payload, 'anyfilex-resized-images.zip');
    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = 'anyfilex-resized-images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(zipUrl), 30000);
  };

  const completedItems = items.filter((i) => i.status === 'completed' && i.result);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Privacy Notice Banner */}
      <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-semibold">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span>Client-Side RAM Processing: Images are resized in high-fidelity browser canvas without cloud uploads.</span>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] shrink-0">
          Zero Uploads
        </span>
      </div>

      {/* Resize Settings Control Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Target Dimensions & Scale</span>
            </h3>
            <p className="text-xs text-slate-500">
              Set exact pixel width and height, or choose a percentage scaling preset.
            </p>
          </div>

          {/* Scale Percentage Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 mr-1">Scale:</span>
            {[25, 50, 75, 150, 200].map((pct) => (
              <button
                key={pct}
                onClick={() => handlePercentPreset(pct)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  scalePercent === pct
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {/* Target Width */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Width (Pixels)
            </label>
            <input
              type="number"
              min="1"
              max="16000"
              value={targetWidth || ''}
              onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 1920"
            />
          </div>

          {/* Aspect Ratio Lock Toggle */}
          <div className="flex items-center justify-center pb-1">
            <button
              onClick={() => setLockRatio(!lockRatio)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                lockRatio
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{lockRatio ? 'Ratio Locked' : 'Ratio Unlocked'}</span>
            </button>
          </div>

          {/* Target Height */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Height (Pixels)
            </label>
            <input
              type="number"
              min="1"
              max="16000"
              value={targetHeight || ''}
              onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 1080"
            />
          </div>

          {/* Output Format */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Target Format
            </label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="jpg">JPG (Compressed)</option>
              <option value="png">PNG (Lossless)</option>
              <option value="webp">WebP (Next-Gen Web)</option>
            </select>
          </div>
        </div>

        {/* Bottom Actions */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Resizing Images...' : 'Apply Resizing to Queue'}</span>
            </button>

            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Queue</span>
            </button>
          </div>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        className="group border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-8 sm:p-12 text-center bg-white dark:bg-slate-900 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg relative overflow-hidden"
        id="image-resizer-dropzone"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.heic,.heif,.svg"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Maximize className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Drop images to resize, or <span className="text-blue-600 underline">browse files</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supports JPG, PNG, WEBP, HEIC, GIF, SVG, BMP • Batch resizing supported
            </p>
          </div>
        </div>
      </div>

      {/* Batch Export Button (When items completed) */}
      {completedItems.length > 0 && (
        <div className="flex items-center justify-between bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md">
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{completedItems.length} Images Resized Successfully</span>
            </h4>
            <p className="text-xs text-slate-400">
              All images have been scaled to target dimensions in browser RAM.
            </p>
          </div>

          <button
            onClick={handleDownloadAllZip}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <FolderArchive className="w-4 h-4" />
            <span>Download All as ZIP</span>
          </button>
        </div>
      )}

      {/* Queue List */}
      {items.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileImage className="w-4 h-4 text-blue-600" />
            <span>Resizing Queue ({items.length} files)</span>
          </h4>

          <div className="space-y-3">
            {items.map((item) => {
              const res = item.result;
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden relative">
                      {res ? (
                        <img
                          src={res.outputBlobUrl}
                          alt={item.file.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <FileImage className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate block">
                        {item.file.name}
                      </span>

                      {res ? (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-mono">
                          <span>Original: <strong className="text-slate-700 dark:text-slate-300">{item.origWidth}×{item.origHeight}px</strong> ({formatBytes(res.metrics.originalSizeBytes)})</span>
                          <span>→</span>
                          <span>Resized: <strong className="text-emerald-600 dark:text-emerald-400">{res.metrics.outputWidth}×{res.metrics.outputHeight}px</strong> ({formatBytes(res.metrics.outputSizeBytes)})</span>
                        </div>
                      ) : item.status === 'processing' ? (
                        <span className="text-xs text-blue-600 animate-pulse font-semibold">
                          Resizing in RAM...
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">
                          {item.origWidth}×{item.origHeight}px • {formatBytes(item.file.size)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    {res && (
                      <>
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-colors cursor-pointer"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadSingle(item)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && previewItem.result && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {previewItem.result.outputFileName}
                </h3>
                <p className="text-xs text-slate-500">
                  {previewItem.result.metrics.outputWidth} × {previewItem.result.metrics.outputHeight} px • {formatBytes(previewItem.result.metrics.outputSizeBytes)}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto rounded-2xl bg-slate-950 flex items-center justify-center p-4 border border-slate-800">
              <img
                src={previewItem.result.outputBlobUrl}
                alt="Preview"
                className="max-h-[50vh] object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadSingle(previewItem);
                  setPreviewItem(null);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Resized Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
