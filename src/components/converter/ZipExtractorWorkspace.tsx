import React, { useState, useRef } from 'react';
import {
  Upload,
  Archive,
  FileText,
  Download,
  Folder,
  Eye,
  X,
  Search,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import type JSZip from 'jszip';

interface ExtractedEntry {
  name: string;
  isDir: boolean;
  size: number;
  compressedSize: number;
  date?: Date;
  zipObject: JSZip.JSZipObject;
}

export const ZipExtractorWorkspace: React.FC = () => {
  const [zipFileName, setZipFileName] = useState<string | null>(null);
  const [entries, setEntries] = useState<ExtractedEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewContent, setPreviewContent] = useState<{ name: string; text?: string; url?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZipFile = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    setZipFileName(file.name);
    setPreviewContent(null);

    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);

      const parsed: ExtractedEntry[] = [];
      for (const relativePath of Object.keys(zipData.files)) {
        const obj = zipData.files[relativePath];
        parsed.push({
          name: relativePath,
          isDir: obj.dir,
          size: (obj as any)._data?.uncompressedSize || 0,
          compressedSize: (obj as any)._data?.compressedSize || 0,
          date: obj.date,
          zipObject: obj,
        });
      }

      setEntries(parsed);
    } catch (err) {
      console.error('Failed to parse ZIP archive:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadEntry = async (entry: ExtractedEntry) => {
    if (entry.isDir) return;
    try {
      const blob = await entry.zipObject.async('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = entry.name.split('/').pop() || entry.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error extracting file:', err);
    }
  };

  const handlePreviewEntry = async (entry: ExtractedEntry) => {
    if (entry.isDir) return;
    try {
      const ext = entry.name.split('.').pop()?.toLowerCase();

      if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext || '')) {
        const blob = await entry.zipObject.async('blob');
        const url = URL.createObjectURL(blob);
        setPreviewContent({ name: entry.name, url });
      } else {
        const text = await entry.zipObject.async('text');
        setPreviewContent({ name: entry.name, text: text.substring(0, 10000) });
      }
    } catch (err) {
      console.error('Error previewing file:', err);
    }
  };

  const handleExtractAll = async () => {
    const filesToExtract = entries.filter((e) => !e.isDir);
    for (const entry of filesToExtract) {
      await handleDownloadEntry(entry);
    }
  };

  const filteredEntries = entries.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalUncompressed = entries.reduce((s, e) => s + (e.isDir ? 0 : e.size), 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-emerald-600" />
            <span>Online ZIP Extractor & Archive Inspector</span>
          </h3>
          <p className="text-xs text-slate-500">
            Open, browse, preview, and extract files from .zip packages directly in your browser without WinRAR or software.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          Client-Side Unzip
        </span>
      </div>

      {/* Upload Box */}
      {!zipFileName ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files[0]) handleZipFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".zip"
            onChange={(e) => {
              if (e.target.files?.[0]) handleZipFile(e.target.files[0]);
            }}
            className="hidden"
          />

          <div className="space-y-3 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Upload className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Drop .ZIP Archive Here
              </h4>
              <p className="text-xs text-slate-500">
                Click to browse or drop compressed files to inspect contents
              </p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer hover:bg-emerald-700">
              Select ZIP File
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Archive Info Header */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Archive className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-sm text-white">{zipFileName}</p>
                <p className="text-xs font-mono text-slate-400">
                  {entries.length} items • Total Uncompressed: {formatSize(totalUncompressed)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExtractAll}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Extract All Files</span>
              </button>

              <button
                onClick={() => {
                  setZipFileName(null);
                  setEntries([]);
                  setPreviewContent(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Open Another
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter files inside ZIP archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* File Tree / Listing */}
          <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
            {filteredEntries.map((entry, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {entry.isDir ? (
                    <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  )}
                  <span className="font-mono font-bold text-slate-900 dark:text-white truncate">
                    {entry.name}
                  </span>
                  {!entry.isDir && (
                    <span className="font-mono text-slate-400 shrink-0">
                      ({formatSize(entry.size)})
                    </span>
                  )}
                </div>

                {!entry.isDir && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handlePreviewEntry(entry)}
                      title="Preview content"
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] hover:bg-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleDownloadEntry(entry)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Extract</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Inline File Preview Modal / Sheet */}
          {previewContent && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 relative border border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-xs font-bold text-emerald-400 truncate">
                  Previewing: {previewContent.name}
                </span>
                <button
                  onClick={() => setPreviewContent(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {previewContent.url ? (
                <div className="flex justify-center bg-black/50 p-4 rounded-xl">
                  <img
                    src={previewContent.url}
                    alt={previewContent.name}
                    className="max-h-64 object-contain rounded-lg"
                  />
                </div>
              ) : (
                <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-slate-300 max-h-48 overflow-auto whitespace-pre-wrap">
                  {previewContent.text}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
