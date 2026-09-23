'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Eye,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  FileText,
  Image as ImageIcon,
  FileCode,
  Lock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Info
} from 'lucide-react';
import { analyzeFileMetadata, MetadataReport } from '../utils/metadataAnalyzer';
import { AppRoute } from '../types';

interface MetadataUploaderProps {
  onNavigate: (route: AppRoute) => void;
  onAnalysisComplete?: (report: MetadataReport) => void;
}

export const MetadataUploader: React.FC<MetadataUploaderProps> = ({
  onNavigate,
  onAnalysisComplete,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<'empty' | 'uploading' | 'extracting' | 'success' | 'error'>('empty');
  const [progress, setProgress] = useState(0);
  const [extractionStep, setExtractionStep] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractionSteps = [
    'Parsing file header binary structure...',
    'Locating EXIF / XMP / IPTC / PDF Info metadata chunks...',
    'Decoding camera lens, aperture & shutter parameters...',
    'Checking GPS geolocation tags & hardware serial numbers...',
    'Evaluating privacy risk assessment score & recommendations...',
  ];

  const handleProcessFile = async (file: File) => {
    if (!file) return;

    setCurrentFile(file);
    setUploadState('uploading');
    setProgress(20);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 100);

    setTimeout(async () => {
      clearInterval(interval);
      setProgress(100);
      setUploadState('extracting');

      for (let i = 0; i < extractionSteps.length; i++) {
        setExtractionStep(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      try {
        const report = await analyzeFileMetadata(file);
        setUploadState('success');
        if (onAnalysisComplete) {
          onAnalysisComplete(report);
        }
        setTimeout(() => {
          onNavigate({ view: 'metadata-result', id: report.id });
        }, 300);
      } catch (err) {
        console.error('Metadata extraction failed:', err);
        setErrorMessage('Failed to read file metadata. Please ensure the file is valid.');
        setUploadState('error');
      }
    }, 500);
  };

  const createSampleFile = (type: 'jpg' | 'heic' | 'pdf' | 'docx') => {
    let filename = 'camera_photo_gps.jpg';
    let mime = 'image/jpeg';
    let content = 'EXIF_SAMPLE_DATA_CAMERA_GPS';

    if (type === 'heic') {
      filename = 'iphone_photo.heic';
      mime = 'image/heic';
    } else if (type === 'pdf') {
      filename = 'confidential_contract.pdf';
      mime = 'application/pdf';
    } else if (type === 'docx') {
      filename = 'financial_report.docx';
      mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    const blob = new Blob([content], { type: mime });
    const sample = new File([blob], filename, { type: mime, lastModified: Date.now() - 3600000 });
    handleProcessFile(sample);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Drag & Drop Card Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-xl scale-[1.005]'
            : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

        <div className="relative p-8 sm:p-12 text-center space-y-6">
          {uploadState === 'empty' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Drop Image or Document
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  or <span className="text-indigo-600 dark:text-indigo-400 font-bold underline underline-offset-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>browse file</span> from your computer
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.heic,.webp,.pdf,.docx,.xlsx,.pptx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleProcessFile(e.target.files[0]);
                  }
                }}
                id="metadata-file-input"
              />

              {/* Format Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {[
                  'JPG', 'JPEG', 'PNG', 'HEIC', 'WEBP',
                  'PDF', 'DOCX', 'XLSX', 'PPTX'
                ].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold border border-slate-200/60 dark:border-slate-800"
                  >
                    .{fmt}
                  </span>
                ))}
              </div>

              {/* Sample Files Row */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                  Try inspecting a test sample file:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => createSampleFile('jpg')}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    JPG with GPS EXIF
                  </button>
                  <button
                    onClick={() => createSampleFile('heic')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    iPhone .HEIC Photo
                  </button>
                  <button
                    onClick={() => createSampleFile('pdf')}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    PDF Document
                  </button>
                  <button
                    onClick={() => createSampleFile('docx')}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    DOCX Office File
                  </button>
                </div>
              </div>

              {/* Privacy Reassurance Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Private Client-Side Parsing • Zero Server Uploads</span>
              </div>
            </div>
          )}

          {uploadState === 'uploading' && (
            <div className="space-y-6 max-w-md mx-auto py-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 flex items-center justify-center mx-auto">
                <Eye className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Reading Local Memory Stream...</h4>
                <p className="text-xs text-slate-500 font-mono line-clamp-1">{currentFile?.name}</p>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-400 font-mono font-bold block">{progress}% Read</span>
            </div>
          )}

          {uploadState === 'extracting' && (
            <div className="space-y-6 max-w-lg mx-auto py-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
                <Cpu className="w-7 h-7 animate-spin" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Extracting Embedded Metadata</h4>
                <p className="text-xs text-slate-500">Reading EXIF / XMP / IPTC / Document Info tables</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 text-left font-mono text-xs text-emerald-400 border border-slate-800 space-y-2 shadow-inner">
                {extractionSteps.map((stepText, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 transition-opacity duration-200 ${
                      idx <= extractionStep ? 'opacity-100' : 'opacity-20'
                    }`}
                  >
                    <span className="text-indigo-400 font-bold">&gt;</span>
                    <span className={idx === extractionStep ? 'text-white font-bold animate-pulse' : 'text-slate-400'}>
                      {stepText}
                    </span>
                    {idx < extractionStep && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadState === 'error' && (
            <div className="space-y-4 max-w-md mx-auto py-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg">Metadata Extraction Failed</h4>
              <p className="text-xs text-slate-500">{errorMessage}</p>
              <button
                onClick={() => setUploadState('empty')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Try Another File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
