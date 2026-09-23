import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FolderPlus,
  Download,
  X,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
  Archive,
  Ban,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Folder,
  FileText,
  Eye,
  Check,
  FileCheck
} from 'lucide-react';
import { ConverterPair, QueueItem, ConversionOptions } from '../../lib/converter/types';
import {
  ConversionQueueManager,
  QueueStats,
  extractFilesFromDataTransfer,
} from '../../lib/converter/queueManager';
import { createZipFromQueueItems } from '../../lib/converter/zipExporter';
import { convertFileInBrowser } from '../../lib/converter/engine';

interface ConverterUploadBoxProps {
  pair: ConverterPair;
  onConversionComplete?: () => void;
}

export const ConverterUploadBox: React.FC<ConverterUploadBoxProps> = ({
  pair,
  onConversionComplete,
}) => {
  const [manager] = useState(() => new ConversionQueueManager(2)); // 2 concurrent workers
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    total: 0,
    completed: 0,
    converting: 0,
    pending: 0,
    error: 0,
    cancelled: 0,
    overallProgressPercent: 0,
  });

  const [dragActive, setDragActive] = useState(false);
  const [options, setOptions] = useState<ConversionOptions>({
    quality: 92,
    bgFill: '#FFFFFF',
  });
  const [targetExt, setTargetExt] = useState<string>(pair.toExt);
  const [showOptions, setShowOptions] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [zipProgress, setZipProgress] = useState<number | null>(null);
  const [autoDeleteMins, setAutoDeleteMins] = useState<number>(30);
  const [convertingItemFormats, setConvertingItemFormats] = useState<Record<string, string>>({});
  const [previewItem, setPreviewItem] = useState<{ name: string; url: string; ext: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const onConversionCompleteRef = useRef(onConversionComplete);
  useEffect(() => {
    onConversionCompleteRef.current = onConversionComplete;
  }, [onConversionComplete]);

  const prevCompletedRef = useRef<number>(manager.getStats().completed);

  // Sync manager with props and state
  useEffect(() => {
    setTargetExt(pair.toExt);
  }, [pair]);

  useEffect(() => {
    manager.setOptions(options);
  }, [options, manager]);

  useEffect(() => {
    manager.setAutoDeleteMinutes(autoDeleteMins);
  }, [autoDeleteMins, manager]);

  // Subscribe to queue changes
  useEffect(() => {
    const unsubscribe = manager.subscribe((updatedQueue, updatedStats) => {
      setQueue(updatedQueue);
      setStats(updatedStats);
      if (updatedStats.completed > prevCompletedRef.current) {
        onConversionCompleteRef.current?.();
      }
      prevCompletedRef.current = updatedStats.completed;
    });

    return () => {
      unsubscribe();
    };
  }, [manager]);

  // Handle file list input
  const handleFiles = (files: FileList | File[], folderPath?: string) => {
    setValidationErrors([]);
    const items = Array.from(files).map((file) => ({ file, folderPath }));
    const result = manager.addFiles(items, pair.fromExt, targetExt);

    if (result.errors.length > 0) {
      setValidationErrors(result.errors);
    }
  };

  // Folder drag & drop handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const extracted = await extractFilesFromDataTransfer(e.dataTransfer.items);
      if (extracted.length > 0) {
        setValidationErrors([]);
        const result = manager.addFiles(extracted, pair.fromExt, targetExt);
        if (result.errors.length > 0) {
          setValidationErrors(result.errors);
        }
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Single file download or on-the-fly format conversion download
  const handleDownloadSingleFile = async (item: QueueItem, exportExt?: string) => {
    const formatToUse = (exportExt || item.toExt).toLowerCase();
    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const cleanExt = formatToUse === 'jpeg' ? 'jpg' : formatToUse;
    const downloadFilename = `${baseName}.${cleanExt}`;

    // If it's the already-converted format and URL is available
    if ((!exportExt || exportExt.toLowerCase() === item.toExt.toLowerCase()) && item.resultBlobUrl) {
      const a = document.createElement('a');
      a.href = item.resultBlobUrl;
      a.download = item.resultFileName || downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Convert on-the-fly for requested single-file format (e.g. JPG, PNG, WEBP, PDF)
    try {
      setConvertingItemFormats((prev) => ({ ...prev, [item.id]: cleanExt }));
      const result = await convertFileInBrowser(item.file, item.fromExt, cleanExt, options);
      const a = document.createElement('a');
      a.href = result.resultBlobUrl;
      a.download = result.resultFileName || downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(result.resultBlobUrl), 5000);
    } catch (err: any) {
      console.error('Error generating single file conversion:', err);
      setValidationErrors((prev) => [
        ...prev,
        `Could not convert single file to .${cleanExt.toUpperCase()}: ${err.message || 'Unknown error'}`
      ]);
    } finally {
      setConvertingItemFormats((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }
  };

  // Download all completed individual files one by one
  const handleDownloadAllIndividual = async () => {
    const completedItems = queue.filter((item) => item.status === 'completed' && item.resultBlobUrl);
    for (let i = 0; i < completedItems.length; i++) {
      const item = completedItems[i];
      await handleDownloadSingleFile(item);
      // Small tick between downloads so browser doesn't block multiple files
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  // Batch Zip Export
  const handleDownloadZip = async () => {
    const completedItems = queue.filter((item) => item.status === 'completed' && item.resultBlobUrl);
    if (completedItems.length === 0) return;

    try {
      setZipProgress(10);
      const zipResult = await createZipFromQueueItems(
        completedItems,
        `${pair.fromExt}_to_${targetExt}_batch.zip`,
        (percent) => setZipProgress(percent)
      );

      const a = document.createElement('a');
      a.href = zipResult.zipBlobUrl;
      a.download = zipResult.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Never ship a silently incomplete archive: report anything that was left out.
      if (zipResult.skipped.length > 0) {
        setValidationErrors((prev) => [
          ...prev,
          `ZIP created, but ${zipResult.skipped.length} file(s) could not be included: ${zipResult.skipped.join(', ')}`
        ]);
      }
    } catch (err: any) {
      console.error('ZIP generation error:', err);
      setValidationErrors((prev) => [
        ...prev,
        `Could not create the ZIP archive: ${err?.message || 'Unknown error'}`
      ]);
    } finally {
      setTimeout(() => setZipProgress(null), 1000);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isTargetJpg = targetExt.toLowerCase() === 'jpg' || targetExt.toLowerCase() === 'jpeg';
  const availableQuickFormats = ['jpg', 'png', 'webp', 'pdf'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Upload Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer relative ${
          dragActive
            ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30'
        }`}
        onClick={() => fileInputRef.current?.click()}
        id="converter-dropzone"
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept={`.${pair.fromExt.toLowerCase()}`}
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
          className="hidden"
          id="converter-file-input"
        />

        {/* Directory Upload Input */}
        <input
          type="file"
          ref={folderInputRef}
          /* @ts-ignore */
          webkitdirectory="true"
          directory="true"
          onChange={(e) => {
            if (e.target.files) {
              handleFiles(e.target.files);
            }
          }}
          className="hidden"
          id="converter-folder-input"
        />

        <div className="space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Drop .{pair.fromExt.toUpperCase()} files or folders here
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Drag & drop individual files, multiple selection, or entire subfolders
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select Files</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                folderInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-blue-400" />
              <span>Upload Folder</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target Output: .{targetExt.toUpperCase()} • Max 100MB per file</span>
          </div>
        </div>
      </div>

      {/* Validation Warnings */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Some files could not be added:</span>
            </span>
            <button onClick={() => setValidationErrors([])} className="hover:underline">
              Dismiss
            </button>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90 pl-1">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Controls Header: Settings & Target Format Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-500" />
            <span>Settings ({options.quality}% Quality)</span>
          </button>

          {/* Target Extension Picker */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            <span>To:</span>
            <select
              value={targetExt}
              onChange={(e) => setTargetExt(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-mono font-bold border-none focus:ring-0 cursor-pointer text-xs"
            >
              {['jpg', 'png', 'webp', 'pdf'].map((ext) => (
                <option key={ext} value={ext} className="bg-slate-900 text-white">
                  .{ext.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {queue.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => manager.clearQueue()}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Queue</span>
            </button>
          </div>
        )}
      </div>

      {/* Expandable Advanced Options */}
      {showOptions && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Converter Output & Auto-Delete Settings
            </h4>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Auto-delete results:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                <span>Output Quality</span>
                <span className="text-blue-600 dark:text-blue-400">{options.quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={options.quality || 92}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, quality: parseInt(e.target.value) }))
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Background Fill for JPG */}
            {isTargetJpg && (
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Background Fill
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'White', color: '#FFFFFF' },
                    { label: 'Black', color: '#000000' },
                  ].map((fill) => (
                    <button
                      key={fill.color}
                      type="button"
                      onClick={() => setOptions((prev) => ({ ...prev, bgFill: fill.color }))}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                        options.bgFill === fill.color
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: fill.color }}
                      ></span>
                      <span>{fill.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-Delete Privacy Selector */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                Auto-Delete Timer
              </span>
              <select
                value={autoDeleteMins}
                onChange={(e) => setAutoDeleteMins(parseInt(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 rounded-xl p-2 cursor-pointer"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={0}>Disabled (Keep until closed)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Batch Progress Bar & Queue Header */}
      {queue.length > 0 && (
        <div className="space-y-4 pt-2">
          {/* Overall Batch Progress Header */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Conversion Queue ({stats.total} Files)</span>
              </div>

              {/* Batch Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {stats.converting > 0 && (
                  <button
                    onClick={() => manager.cancelAll()}
                    className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Cancel Active</span>
                  </button>
                )}

                {(stats.error > 0 || stats.cancelled > 0) && (
                  <button
                    onClick={() => manager.retryAllFailed()}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry Failed</span>
                  </button>
                )}

                {stats.completed > 0 && (
                  <>
                    <button
                      onClick={handleDownloadAllIndividual}
                      title="Download each single converted file individually"
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download All ({stats.completed} Files)</span>
                    </button>

                    <button
                      onClick={handleDownloadZip}
                      disabled={zipProgress !== null}
                      title="Package all completed files into a single ZIP archive"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>
                        {zipProgress !== null ? `Zipping ${zipProgress}%` : `Download ZIP (${stats.completed})`}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Batch Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-300">
                <span>
                  {stats.completed} of {stats.total} Completed ({stats.converting} converting, {stats.pending} pending)
                </span>
                <span className="font-bold text-blue-400">{stats.overallProgressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${stats.overallProgressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Queue Items List */}
          <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-1">
            {queue.map((item) => {
              const baseName = item.name.replace(/\.[^/.]+$/, '');
              const cleanOutputExt = (item.toExt === 'jpeg' ? 'jpg' : item.toExt).toLowerCase();
              const convertedDisplayFilename = item.resultFileName || `${baseName}.${cleanOutputExt}`;
              const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'heic', 'heif', 'bmp'].includes(item.fromExt.toLowerCase());

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.status === 'completed'
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/80 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80'
                  } space-y-3`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    {/* File Meta Info */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      }`}>
                        {item.status === 'completed' ? (
                          <FileCheck className="w-5 h-5" />
                        ) : item.folderPath ? (
                          <Folder className="w-5 h-5 text-amber-500" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        {/* Title: Converted File Name if completed, otherwise original file name */}
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
                            {item.status === 'completed' ? convertedDisplayFilename : item.name}
                          </p>
                          {item.status === 'completed' && (
                            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-extrabold uppercase bg-emerald-600 text-white shadow-xs">
                              .{cleanOutputExt}
                            </span>
                          )}
                        </div>

                        {/* Size & Source details */}
                        <p className="text-[11px] text-slate-500 font-mono flex flex-wrap items-center gap-1.5">
                          {item.folderPath && (
                            <span className="text-amber-500 font-semibold">{item.folderPath}/</span>
                          )}
                          <span className="text-slate-400">Original: {item.name} ({formatSize(item.originalSize)})</span>
                          {item.resultSize && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              → Converted: {formatSize(item.resultSize)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                      {item.status === 'queued' && (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          Queued
                        </span>
                      )}

                      {item.status === 'converting' && (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 animate-pulse">
                            Converting {item.progress}%
                          </span>
                          <button
                            onClick={() => manager.cancelItem(item.id)}
                            title="Cancel conversion"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Primary Single File Download Button */}
                      {item.status === 'completed' && item.resultBlobUrl && (
                        <div className="flex items-center gap-1.5">
                          {/* Preview Button */}
                          {isImage && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewItem({
                                  name: convertedDisplayFilename,
                                  url: item.resultBlobUrl!,
                                  ext: cleanOutputExt,
                                })
                              }
                              title="Preview Converted File"
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-500" />
                              <span className="hidden sm:inline">Preview</span>
                            </button>
                          )}

                          {/* Main Converted File Download Button */}
                          <button
                            type="button"
                            onClick={() => handleDownloadSingleFile(item)}
                            title={`Download single converted ${cleanOutputExt.toUpperCase()} file`}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>
                              Download .{cleanOutputExt.toUpperCase()}
                              {item.resultSize ? ` (${formatSize(item.resultSize)})` : ''}
                            </span>
                          </button>
                        </div>
                      )}

                      {(item.status === 'error' || item.status === 'cancelled') && (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                            {item.status === 'cancelled' ? 'Cancelled' : 'Failed'}
                          </span>
                          <button
                            onClick={() => manager.retryItem(item.id)}
                            title="Retry item"
                            className="px-2 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer hover:bg-blue-700"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => manager.removeItem(item.id)}
                        title="Remove from list"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Single File Alternative Formats Bar */}
                  {item.status === 'completed' && isImage && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 font-medium">
                        Quick Single File Download Formats:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {availableQuickFormats.map((fmt) => {
                          const isCurrentFmt = cleanOutputExt === fmt;
                          const isConvertingThis = convertingItemFormats[item.id] === fmt;

                          return (
                            <button
                              key={fmt}
                              type="button"
                              disabled={isConvertingThis}
                              onClick={() => handleDownloadSingleFile(item, fmt)}
                              title={`Download single file as .${fmt.toUpperCase()}`}
                              className={`px-2.5 py-1 rounded-lg font-bold font-mono transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                                isCurrentFmt
                                  ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600'
                              } disabled:opacity-50`}
                            >
                              <Download className="w-3 h-3" />
                              <span>.{fmt.toUpperCase()}</span>
                              {isConvertingThis && <span className="animate-spin text-[9px]">⌛</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Individual Progress Bar */}
                  {item.status === 'converting' && (
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  )}

                  {/* Error details */}
                  {item.status === 'error' && item.errorMessage && (
                    <p className="text-[11px] text-rose-600 font-medium">
                      Error: {item.errorMessage}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-sm">
                  {previewItem.name}
                </h4>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center items-center bg-slate-950/80 rounded-2xl p-4 min-h-[16rem] max-h-[26rem] overflow-hidden">
              <img
                src={previewItem.url}
                alt={previewItem.name}
                className="max-h-[24rem] max-w-full object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                Format: .{previewItem.ext.toUpperCase()}
              </span>

              <a
                href={previewItem.url}
                download={previewItem.name}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Converted File (.{previewItem.ext.toUpperCase()})</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
