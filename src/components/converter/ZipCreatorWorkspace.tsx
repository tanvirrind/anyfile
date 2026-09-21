import React, { useState, useRef } from 'react';
import {
  Upload,
  FolderPlus,
  FileText,
  Trash2,
  Archive,
  Download,
  Sliders,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';

interface FileEntry {
  id: string;
  file: File;
  path: string;
  size: number;
}

export const ZipCreatorWorkspace: React.FC = () => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [zipName, setZipName] = useState('archive.zip');
  const [compressionLevel, setCompressionLevel] = useState<'STORE' | 'DEFLATE'>('DEFLATE');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = (fileList: FileList | File[]) => {
    const newEntries: FileEntry[] = Array.from(fileList).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      path: (f as any).webkitRelativePath || f.name,
      size: f.size,
    }));

    setFiles((prev) => [...prev, ...newEntries]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setFiles([]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const handleCreateZip = async () => {
    if (files.length === 0) return;

    setIsGenerating(true);
      setError(null);
    setProgress(10);

    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();

      files.forEach((item) => {
        zip.file(item.path, item.file, {
          compression: compressionLevel,
        });
      });

      setProgress(40);

      const blob = await zip.generateAsync(
        {
          type: 'blob',
          compression: compressionLevel,
          compressionOptions: {
            level: compressionLevel === 'DEFLATE' ? 6 : 0,
          },
        },
        (metadata) => {
          setProgress(Math.floor(40 + (metadata.percent / 100) * 55));
        }
      );

      setProgress(100);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP creation error:', err);
      setError(err instanceof Error && err.message ? `Could not create the ZIP archive: ${err.message}` : 'Could not create the ZIP archive.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const totalBytes = files.reduce((sum, item) => sum + item.size, 0);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
            <Archive className="w-5 h-5 text-blue-600" />
            <span>Online ZIP Archive Creator</span>
          </h3>
          <p className="text-xs text-slate-500">
            Combine multiple files and folders into a compressed .zip package directly in your browser memory.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          Client-Side JSZip Engine
        </span>
      </div>

      {/* Dropzone Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative ${
          dragActive
            ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
          }}
          className="hidden"
        />
        <input
          type="file"
          ref={folderInputRef}
          /* @ts-ignore */
          webkitdirectory="true"
          directory="true"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
          }}
          className="hidden"
        />

        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <Upload className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Drag & Drop Files or Folder Here
            </h4>
            <p className="text-xs text-slate-500">
              Select documents, images, PDFs, or software code to package into ZIP
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
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
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-blue-400" />
              <span>Upload Folder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Config Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700 dark:text-slate-200">
            Archive Output Filename:
          </label>
          <input
            type="text"
            value={zipName}
            onChange={(e) => setZipName(e.target.value)}
            placeholder="archive.zip"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700 dark:text-slate-200">
            Compression Method:
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCompressionLevel('DEFLATE')}
              className={`flex-1 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                compressionLevel === 'DEFLATE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Deflate (Standard Compress)
            </button>
            <button
              type="button"
              onClick={() => setCompressionLevel('STORE')}
              className={`flex-1 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                compressionLevel === 'STORE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Store (Fast No Compression)
            </button>
          </div>
        </div>
      </div>

      {/* Queue Listing */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>
              Queue Items ({files.length} Files • Total {formatSize(totalBytes)})
            </span>
            <button
              onClick={handleClearAll}
              className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {files.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {item.path}
                  </span>
                  <span className="font-mono text-slate-400 shrink-0">
                    ({formatSize(item.size)})
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFile(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Download Action */}
          <div className="pt-2">
            <button
              onClick={handleCreateZip}
              disabled={isGenerating}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>
                {isGenerating
                  ? `Building ZIP Archive ${progress}%...`
                  : `Create & Download ZIP Archive (${formatSize(totalBytes)})`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
