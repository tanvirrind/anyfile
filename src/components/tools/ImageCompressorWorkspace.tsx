import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileImage,
  Sliders,
  Download,
  FolderArchive,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  Maximize2,
  X
} from 'lucide-react';
import {
  compressImageFile,
  createBatchZip,
  formatBytes,
  ProcessedImageResult,
  CompressImageOptions
} from '../../lib/tools/imageEngine';

interface CompressItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: ProcessedImageResult;
  error?: string;
}

export const ImageCompressorWorkspace: React.FC = () => {
  const [items, setItems] = useState<CompressItem[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'original' | 'jpg' | 'png' | 'webp'>('original');
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<CompressItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incomingFiles: FileList | File[]) => {
    const validFiles = Array.from(incomingFiles).filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      return ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'bmp', 'svg', 'gif'].includes(ext) || file.type.startsWith('image/');
    });

    if (validFiles.length === 0) return;

    const newItems: CompressItem[] = validFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      file,
      status: 'pending',
      progress: 0
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleProcessAll = async () => {
    if (items.length === 0 || isProcessing) return;

    setIsProcessing(true);
    const options: CompressImageOptions = {
      quality: quality / 100,
      outputFormat,
      maxWidth: maxWidth && maxWidth > 0 ? maxWidth : undefined
    };

    const updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      if (item.status === 'completed' && item.result) continue;

      item.status = 'processing';
      item.progress = 25;
      setItems([...updatedItems]);

      try {
        const result = await compressImageFile(item.file, options);
        item.status = 'completed';
        item.progress = 100;
        item.result = result;
      } catch (err: any) {
        item.status = 'error';
        item.error = err.message || 'Compression failed.';
      }

      setItems([...updatedItems]);
    }

    setIsProcessing(false);
  };

  // Auto-process newly added files if user dropped them after adjusting settings
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

  const handleDownloadSingle = (item: CompressItem) => {
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

    const { zipUrl } = await createBatchZip(payload, 'anyfilex-compressed-images.zip');
    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = 'anyfilex-compressed-images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(zipUrl), 30000);
  };

  // Compute aggregate statistics
  const completedItems = items.filter((i) => i.status === 'completed' && i.result);
  const totalOriginalBytes = completedItems.reduce((acc, i) => acc + (i.result?.metrics.originalSizeBytes || 0), 0);
  const totalOutputBytes = completedItems.reduce((acc, i) => acc + (i.result?.metrics.outputSizeBytes || 0), 0);
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalOutputBytes);
  const totalSavedPercent = totalOriginalBytes > 0 ? Math.round((totalSavedBytes / totalOriginalBytes) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Privacy Notice Banner */}
      <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-semibold">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span>Client-Side RAM Processing: Photos never leave your browser or upload to any remote server.</span>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] shrink-0">
          100% Private Memory
        </span>
      </div>

      {/* Control Panel Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Compression Settings</span>
            </h3>
            <p className="text-xs text-slate-500">
              Customize output quality, image format, and optional max dimensions.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 mr-1">Presets:</span>
            <button
              onClick={() => setQuality(60)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                quality === 60
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Max Save (60%)
            </button>
            <button
              onClick={() => setQuality(80)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                quality === 80
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Web Standard (80%)
            </button>
            <button
              onClick={() => setQuality(90)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                quality === 90
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              High Quality (90%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* Quality Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="quality-slider" className="text-slate-700 dark:text-slate-300">Compression Quality</label>
              <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{quality}%</span>
            </div>
            <input
              id="quality-slider"
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Smallest File</span>
              <span>Balanced</span>
              <span>Best Quality</span>
            </div>
          </div>

          {/* Output Format Selector */}
          <div className="space-y-2">
            <label htmlFor="output-format-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Output Format
            </label>
            <select
              id="output-format-select"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="original">Keep Original Format</option>
              <option value="webp">Convert to WebP (Recommended for Web)</option>
              <option value="jpg">Convert to JPG (Universal)</option>
              <option value="png">Convert to PNG (Lossless)</option>
            </select>
          </div>

          {/* Optional Max Width */}
          <div className="space-y-2">
            <label htmlFor="max-width-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Max Dimension Limit
            </label>
            <select
              id="max-width-select"
              value={maxWidth || ''}
              onChange={(e) => setMaxWidth(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Original Full Resolution</option>
              <option value="1920">Max 1920px (Full HD)</option>
              <option value="1280">Max 1280px (Standard Web)</option>
              <option value="800">Max 800px (Blog / Thumbnails)</option>
            </select>
          </div>
        </div>

        {items.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Compressing in RAM...' : 'Re-Compress with Current Settings'}</span>
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
        id="image-compressor-dropzone"
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
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Drag & drop images here, or <span className="text-blue-600 underline">browse files</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supports JPG, PNG, WEBP, HEIC, GIF, SVG, BMP up to 100MB per file • Batch processing supported
            </p>
          </div>
        </div>
      </div>

      {/* Aggregate Metrics Summary Card (When items completed) */}
      {completedItems.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-300">
                Batch Compression Results
              </span>
              <h4 className="text-xl font-extrabold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Saved {formatBytes(totalSavedBytes)} ({totalSavedPercent}% Reduction)</span>
              </h4>
            </div>

            <button
              onClick={handleDownloadAllZip}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderArchive className="w-4 h-4" />
              <span>Download All as ZIP</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-slate-400 block">Total Files</span>
              <span className="text-lg font-bold text-white font-mono">{completedItems.length}</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-slate-400 block">Original Size</span>
              <span className="text-lg font-bold text-slate-300 font-mono">{formatBytes(totalOriginalBytes)}</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-slate-400 block">Compressed Size</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{formatBytes(totalOutputBytes)}</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-slate-400 block">Space Saved</span>
              <span className="text-lg font-bold text-amber-400 font-mono">
                {totalSavedPercent}% ({formatBytes(totalSavedBytes)})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Queue Items List */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileImage className="w-4 h-4 text-blue-600" />
              <span>Image Queue ({items.length} files)</span>
            </h4>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const res = item.result;
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Thumbnail / Status Icon */}
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
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {item.file.name}
                        </span>
                        {res && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            Saved {res.metrics.savedPercent}%
                          </span>
                        )}
                      </div>

                      {res ? (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-mono">
                          <span>Original: <strong className="text-slate-700 dark:text-slate-300">{formatBytes(res.metrics.originalSizeBytes)}</strong></span>
                          <span>•</span>
                          <span>Compressed: <strong className="text-emerald-600 dark:text-emerald-400">{formatBytes(res.metrics.outputSizeBytes)}</strong></span>
                          <span>•</span>
                          <span>{res.metrics.outputWidth}×{res.metrics.outputHeight}px</span>
                        </div>
                      ) : item.status === 'processing' ? (
                        <span className="text-xs text-blue-600 animate-pulse font-semibold">
                          Compressing in browser RAM...
                        </span>
                      ) : item.status === 'error' ? (
                        <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {item.error}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">
                          {formatBytes(item.file.size)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    {res && (
                      <>
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-colors cursor-pointer"
                          title="Preview Compressed Image"
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
                      title="Remove file"
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
                  {previewItem.result.metrics.outputWidth} × {previewItem.result.metrics.outputHeight} px • {formatBytes(previewItem.result.metrics.outputSizeBytes)} (Reduced by {previewItem.result.metrics.savedPercent}%)
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

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500 font-mono">
                Original: {formatBytes(previewItem.result.metrics.originalSizeBytes)} → Compressed: {formatBytes(previewItem.result.metrics.outputSizeBytes)}
              </div>
              <div className="flex items-center gap-3">
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
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
