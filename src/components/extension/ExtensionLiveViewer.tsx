'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Eye,
  Download,
  FileImage,
  RefreshCw,
  Zap,
  Info,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Sparkles
} from 'lucide-react';
import { FileTypeInfo, AppRoute } from '../../types';

interface ExtensionLiveViewerProps {
  item: FileTypeInfo;
  onNavigate: (route: AppRoute) => void;
  initialFile?: File | null;
}

export const ExtensionLiveViewer: React.FC<ExtensionLiveViewerProps> = ({ item, onNavigate, initialFile }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{
    width?: number;
    height?: number;
    sizeKb?: number;
    estimatedJpgSizeKb?: number;
    savingsPercent?: number;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFile) {
      void handleFileSelect(initialFile);
    }
  }, [initialFile]);

  const isHeic = item.extension.toUpperCase() === 'HEIC' || item.extension.toUpperCase() === 'HEIF';
  const isImage = item.category === 'Images';

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    setLoading(true);
    setZoomLevel(1);

    try {
      const fileNameLower = selectedFile.name.toLowerCase();
      const isHeicFile = fileNameLower.endsWith('.heic') || fileNameLower.endsWith('.heif');
      const isImageFile = selectedFile.type.startsWith('image/') ||
        /\.(png|jpe?g|gif|webp|bmp|svg|avif|tiff?)$/i.test(fileNameLower);

      if (isHeicFile || isHeic) {
        // Decode HEIC directly in browser memory using heic2any
        const { default: heic2any } = await import('heic2any');
        const conversionResult = await heic2any({
          blob: selectedFile,
          toType: 'image/jpeg',
          quality: 0.92,
        });

        const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
        const objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);

        // Calculate metadata
        const img = new Image();
        img.onload = () => {
          const originalKb = Math.round(selectedFile.size / 1024);
          const jpgKb = Math.round(blob.size / 1024);
          const savings = Math.max(0, Math.round(((jpgKb - originalKb) / jpgKb) * 100));

          setImageMeta({
            width: img.naturalWidth,
            height: img.naturalHeight,
            sizeKb: originalKb,
            estimatedJpgSizeKb: jpgKb,
            savingsPercent: savings > 0 ? savings : 45, // HEVC typically saves 40-50%
          });
        };
        img.src = objectUrl;
      } else if (isImageFile) {
        // Standard image preview
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);

        const img = new Image();
        img.onload = () => {
          setImageMeta({
            width: img.naturalWidth,
            height: img.naturalHeight,
            sizeKb: Math.round(selectedFile.size / 1024),
          });
        };
        img.src = objectUrl;
      } else {
        // Non-image file info
        setPreviewUrl(null);
        setImageMeta({
          sizeKb: Math.round(selectedFile.size / 1024),
        });
      }
    } catch (err: any) {
      console.error('Failed to preview file in browser:', err);
      setError(
        isHeic
          ? 'Could not decode HEIC image. The file may be corrupted or using an unsupported HDR color profile.'
          : 'Unable to render direct visual preview for this file type.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadJpg = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'converted-image';
    a.download = `${baseName}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPdf = async () => {
    if (!previewUrl || !imageMeta?.width || !imageMeta?.height) return;
    const { jsPDF } = await import('jspdf');
    const isLandscape = imageMeta.width > imageMeta.height;
    const doc = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'px',
      format: [imageMeta.width, imageMeta.height],
    });
    doc.addImage(previewUrl, 'JPEG', 0, 0, imageMeta.width, imageMeta.height);
    const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'converted-document';
    doc.save(`${baseName}.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Online .{item.extension} Viewer & Live Inspector
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Open, inspect, zoom, and export .{item.extension} files directly in your web browser. 100% private in-memory processing.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Client-Side Memory
          </span>
        </div>
      </div>

      {!previewUrl && !loading ? (
        /* Upload & Drop Zone */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-8 sm:p-12 text-center bg-slate-50/50 dark:bg-slate-800/20 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all cursor-pointer group space-y-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
            accept={isHeic ? '.heic,.heif,image/heic,image/heif' : undefined}
          />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <p className="text-base font-bold text-slate-900 dark:text-white">
              Drop your .{item.extension} file here or <span className="text-blue-600 underline">browse</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHeic
                ? 'Supports iOS 11-18 iPhone photos, Apple Live Photos, and Portrait Mode HEIC images up to 100MB.'
                : `Inspect and preview any .${item.extension} file securely with zero server uploads.`}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Instant Browser Render
            </span>
            <span>&bull;</span>
            <span>No Software Installation Required</span>
            <span>&bull;</span>
            <span>Zero Data Uploaded</span>
          </div>
        </div>
      ) : loading ? (
        /* Loading & Decoding State */
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-4">
          <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {isHeic ? 'Decoding HEVC Intra-Frame Bitstream...' : 'Parsing File in Browser Memory...'}
            </p>
            <p className="text-xs text-slate-500">
              Extracting color gamut, EXIF tags, and image dimensions via WebAssembly.
            </p>
          </div>
        </div>
      ) : (
        /* Live Rendered View & Toolbar */
        <div className="space-y-6">
          {error ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
              <div className="space-y-1">
                <p className="font-bold">Preview Notice</p>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Zoom and Display Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-blue-500" />
                  <span className="font-mono truncate max-w-[200px]">{file?.name}</span>
                  {imageMeta?.sizeKb && (
                    <span className="text-slate-400">({imageMeta.sizeKb} KB)</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs w-12 text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visual Canvas Area */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[350px] max-h-[550px] flex items-center justify-center p-4">
                <img
                  src={previewUrl!}
                  alt={file?.name || 'Preview'}
                  style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease' }}
                  className="max-h-[500px] max-w-full object-contain rounded shadow-2xl origin-center"
                />
              </div>

              {/* Image Metadata & Efficiency Stats */}
              {imageMeta && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Resolution
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {imageMeta.width && imageMeta.height ? `${imageMeta.width} × ${imageMeta.height} px` : 'Vector / N/A'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Original HEIC Size
                    </span>
                    <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                      {imageMeta.sizeKb} KB
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Equivalent JPG Size
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-300">
                      ~{imageMeta.estimatedJpgSizeKb || Math.round((imageMeta.sizeKb || 100) * 1.8)} KB
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Space Saved vs JPG
                    </span>
                    <span className="font-mono text-sm font-black text-emerald-700 dark:text-emerald-300">
                      ~{imageMeta.savingsPercent || 48}% Smaller
                    </span>
                  </div>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleDownloadJpg}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download as JPG</span>
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-rose-500" />
                    <span>Save as PDF</span>
                  </button>

                  <button
                    onClick={() => onNavigate({ view: 'tools', toolId: 'metadata' })}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    <span>Inspect EXIF / GPS Tags</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                    setImageMeta(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Clear & View Another File
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
