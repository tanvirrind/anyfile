'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCode,
  ShieldCheck,
  Cpu,
  Sparkles,
  Layers,
  FileText,
  Boxes,
  AlertTriangle,
  FileImage,
  FolderArchive,
  Terminal,
} from 'lucide-react';
import { createSampleFile } from '../../lib/analyzer/fileAnalyzerService';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFilesSelected, disabled = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

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
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      e.target.value = ''; // Reset input to allow selecting same file again
    }
  };

  const handleSampleClick = (type: 'heic' | 'pdf' | 'dwg' | 'zip' | 'mismatch_photo') => {
    if (disabled) return;
    const sample = createSampleFile(type);
    onFilesSelected([sample]);
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden File Input supporting multiple files */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
      />

      {/* Main Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none group ${
          dragActive
            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-900/90 shadow-sm'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center transition-transform group-hover:scale-110">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Select or Drop Any File to Analyze
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Drag & drop a file here, or click to browse. Supports single or multiple file selection.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300 font-medium">
              <Cpu className="w-3.5 h-3.5 text-blue-500" /> Magic Byte Header Read
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Client-Side RAM
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Extension Mismatch Detection
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Statement */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Local Analysis Guarantee:</strong> Your file is analyzed locally in your browser whenever possible. File contents are not uploaded to any server for identification.
          </span>
        </div>
      </div>

      {/* Try with Sample Files */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          No file on hand? Try a test sample:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSampleClick('heic')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors flex items-center gap-1"
          >
            <FileImage className="w-3 h-3 text-blue-500" /> HEIC Photo
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick('mismatch_photo')}
            className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-medium transition-colors flex items-center gap-1 border border-amber-200 dark:border-amber-800/40"
            title="Tests mismatch: File named photo.jpg that actually contains PNG bytes"
          >
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Mismatched Extension
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick('pdf')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors flex items-center gap-1"
          >
            <FileText className="w-3 h-3 text-red-500" /> PDF Document
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick('dwg')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors flex items-center gap-1"
          >
            <Terminal className="w-3 h-3 text-cyan-500" /> CAD DWG
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick('zip')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors flex items-center gap-1"
          >
            <FolderArchive className="w-3 h-3 text-amber-500" /> ZIP Archive
          </button>
        </div>
      </div>
    </div>
  );
};
