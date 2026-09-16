import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileText,
  Binary,
  Layers,
  Image as ImageIcon,
  Archive,
  Film,
  Music,
  Boxes,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { analyzeUploadedFile, AnalysisReport } from '../utils/fileAnalyzer';
import { AppRoute } from '../types';

interface FileIdentifierUploaderProps {
  onNavigate: (route: AppRoute) => void;
  onAnalysisComplete?: (report: AnalysisReport) => void;
}

export const FileIdentifierUploader: React.FC<FileIdentifierUploaderProps> = ({
  onNavigate,
  onAnalysisComplete,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<'empty' | 'uploading' | 'analyzing' | 'success' | 'error'>('empty');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedSample, setCopiedSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisSteps = [
    'Reading binary offset 0x00000000 header bytes...',
    'Extracting magic byte signature (Hex & ASCII)...',
    'Matching against file_signatures database rules...',
    'Calculating SHA-256 cryptographic checksum...',
    'Generating threat security & software compatibility matrix...',
  ];

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    setCurrentFile(file);
    setUploadState('uploading');
    setUploadProgress(15);

    // Simulate uploading stream
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 25;
      });
    }, 120);

    setTimeout(async () => {
      clearInterval(uploadInterval);
      setUploadProgress(100);
      setUploadState('analyzing');

      // Animate analysis engine steps
      for (let i = 0; i < analysisSteps.length; i++) {
        setAnalysisStep(i);
        await new Promise((resolve) => setTimeout(resolve, 220));
      }

      try {
        const report = await analyzeUploadedFile(file);
        setUploadState('success');
        if (onAnalysisComplete) {
          onAnalysisComplete(report);
        }
        // Navigate to result route
        setTimeout(() => {
          onNavigate({ view: 'file-identifier-result', id: report.id });
        }, 300);
      } catch (err) {
        console.error('File analysis failed:', err);
        setErrorMessage('Failed to read file binary headers. Please try another file.');
        setUploadState('error');
      }
    }, 600);
  };

  const createSampleFile = (type: 'heic' | 'dwg' | 'zip' | 'pdf') => {
    let filename = 'sample_photo.heic';
    let bytesHex = '00000018667479706865696300000000';
    let mime = 'image/heic';

    if (type === 'dwg') {
      filename = 'architectural_plan.dwg';
      bytesHex = '41433130333200000000000000000000';
      mime = 'image/vnd.dwg';
    } else if (type === 'zip') {
      filename = 'project_backup.zip';
      bytesHex = '504B0304140000000800000021000000';
      mime = 'application/zip';
    } else if (type === 'pdf') {
      filename = 'contract_document.pdf';
      bytesHex = '255044462D312E370D0A252548656164';
      mime = 'application/pdf';
    }

    const uint8 = new Uint8Array(bytesHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
    const blob = new Blob([uint8], { type: mime });
    const sampleFile = new File([blob], filename, { type: mime, lastModified: Date.now() });
    handleFileProcess(sampleFile);
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
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Zone Container */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
          dragActive
            ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 shadow-xl scale-[1.005]'
            : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm'
        }`}
      >
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

        <div className="relative p-8 sm:p-12 text-center space-y-6">
          {uploadState === 'empty' && (
            <div className="space-y-6 max-w-xl mx-auto">
              {/* Upload Icon Badge */}
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Drop your file here
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  or <span className="text-blue-600 dark:text-blue-400 font-bold underline underline-offset-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>browse file</span> from your computer
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
                id="file-identifier-input"
              />

              {/* Supported Format Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {[
                  { label: 'Images', icon: ImageIcon },
                  { label: 'Documents', icon: FileText },
                  { label: 'Archives', icon: Archive },
                  { label: 'Audio', icon: Music },
                  { label: 'Video', icon: Film },
                  { label: 'CAD & 3D', icon: Boxes },
                  { label: 'Unknown Files', icon: HelpCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <span
                      key={item.label}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-800"
                    >
                      <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{item.label}</span>
                    </span>
                  );
                })}
              </div>

              {/* Sample Files Trigger Row */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                  Don't have a file handy? Try a test sample:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => createSampleFile('heic')}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Sample .HEIC</span>
                  </button>
                  <button
                    onClick={() => createSampleFile('dwg')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Sample .DWG</span>
                  </button>
                  <button
                    onClick={() => createSampleFile('zip')}
                    className="px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900 text-xs font-semibold hover:bg-violet-100 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Sample .ZIP</span>
                  </button>
                  <button
                    onClick={() => createSampleFile('pdf')}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Sample .PDF</span>
                  </button>
                </div>
              </div>

              {/* Privacy Reassurance Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Client-Side RAM Processing • Zero Server Uploads</span>
              </div>
            </div>
          )}

          {uploadState === 'uploading' && (
            <div className="space-y-6 max-w-md mx-auto py-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center mx-auto">
                <Binary className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Reading File Stream...
                </h4>
                <p className="text-xs text-slate-500 font-mono line-clamp-1">{currentFile?.name}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-400 font-mono font-bold block">{uploadProgress}% Complete</span>
            </div>
          )}

          {uploadState === 'analyzing' && (
            <div className="space-y-6 max-w-lg mx-auto py-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
                <Cpu className="w-7 h-7 animate-spin" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Analyzing Magic Byte Signatures</h4>
                <p className="text-xs text-slate-500">Comparing byte stream against 26+ specification records</p>
              </div>

              {/* Terminal Log Step Output */}
              <div className="p-4 rounded-2xl bg-slate-950 text-left font-mono text-xs text-emerald-400 border border-slate-800 space-y-2 shadow-inner">
                {analysisSteps.map((stepText, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 transition-opacity duration-200 ${
                      idx <= analysisStep ? 'opacity-100' : 'opacity-20'
                    }`}
                  >
                    <span className="text-blue-500 font-bold">&gt;</span>
                    <span className={idx === analysisStep ? 'text-white font-bold animate-pulse' : 'text-slate-400'}>
                      {stepText}
                    </span>
                    {idx < analysisStep && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
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
              <h4 className="font-bold text-slate-900 dark:text-white text-lg">Header Read Error</h4>
              <p className="text-xs text-slate-500">{errorMessage}</p>
              <button
                onClick={() => setUploadState('empty')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
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
