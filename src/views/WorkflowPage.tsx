import React, { useState, useEffect } from 'react';
import { AppRoute } from '../types';
import { FileAnalysis } from '../lib/analyzer/types';
import { analyzeFile, createSampleFile } from '../lib/analyzer/fileAnalyzerService';
import { WorkflowBuilder } from '../components/workflow/WorkflowBuilder';
import { BatchWorkflowView } from '../components/workflow/BatchWorkflowView';
import { WorkflowHistoryModal } from '../components/workflow/WorkflowHistoryModal';
import { FileDropzone } from '../components/analyzer/FileDropzone';
import { AnalysisProgress } from '../components/analyzer/AnalysisProgress';
import { WorkflowStepConfig } from '../lib/workflow/types';
import {
  Sparkles,
  Sliders,
  Layers,
  Clock,
  ShieldCheck,
  FileCheck,
  Zap,
  RefreshCw,
  Maximize,
  FolderArchive,
  ArrowRight,
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

interface WorkflowPageProps {
  initialWorkflowId?: string;
  onNavigate: (route: AppRoute) => void;
}

export const WorkflowPage: React.FC<WorkflowPageProps> = ({
  initialWorkflowId,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'builder' | 'batch' | 'templates'>('builder');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analyses, setAnalyses] = useState<FileAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressText, setProgressText] = useState('Analyzing file headers...');
  const [progressPercent, setProgressPercent] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [customInitialSteps, setCustomInitialSteps] = useState<WorkflowStepConfig[] | undefined>(undefined);

  // Handle uploaded files
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    setIsAnalyzing(true);
    setSelectedFiles(files);

    const newAnalyses: FileAnalysis[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgressPercent(10 + Math.round((i / files.length) * 80));
      setProgressText(`Inspecting ${file.name} (${i + 1} of ${files.length})...`);

      try {
        const analysis = await analyzeFile(file);
        newAnalyses.push(analysis);
      } catch (err) {
        console.error('Analysis failed for', file.name, err);
      }
    }

    setAnalyses(newAnalyses);
    setIsAnalyzing(false);

    if (files.length > 1) {
      setActiveTab('batch');
    } else {
      setActiveTab('builder');
    }
  };

  // Quick sample loader
  const handleLoadSample = async (type: 'heic' | 'png' | 'pdf' | 'zip' | 'mismatch_photo') => {
    const sample = createSampleFile(type);
    await handleFilesSelected([sample]);
  };

  // Launch a template
  const handleLaunchTemplate = (templateSteps: WorkflowStepConfig[]) => {
    setCustomInitialSteps(templateSteps);
    if (selectedFiles.length === 0) {
      // Load a sample file for the template
      const sample = createSampleFile('heic');
      handleFilesSelected([sample]);
    }
    setActiveTab('builder');
  };

  const primaryFile = selectedFiles[0];
  const primaryAnalysis = analyses[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" /> Smart File Workflows
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Visual Multi-Step File Pipelines
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Chain format conversions, dimension resizing, compression quantization, metadata stripping, and post-process verification — 100% in your browser.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Recent History
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ view: 'file-analyzer' })}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> File Analyzer
          </button>
        </div>
      </div>

      {/* 2. Main Work Area */}
      {isAnalyzing ? (
        <AnalysisProgress
          fileName={selectedFiles[0]?.name || 'files'}
          stepText={progressText}
          percent={progressPercent}
        />
      ) : selectedFiles.length > 0 && primaryFile ? (
        <div className="space-y-6">
          {/* Navigation Mode Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('builder')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'builder'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Pipeline Builder
              </button>

              {selectedFiles.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('batch')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'batch'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Batch Workflows ({selectedFiles.length})
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'templates'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Preset Pipelines
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedFiles([]);
                setAnalyses([]);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Change File(s)
            </button>
          </div>

          {/* TAB 1: VISUAL PIPELINE BUILDER */}
          {activeTab === 'builder' && (
            <WorkflowBuilder
              sourceFile={primaryFile}
              sourceAnalysis={primaryAnalysis}
              initialSteps={customInitialSteps}
              onNavigate={onNavigate}
            />
          )}

          {/* TAB 2: BATCH WORKFLOW */}
          {activeTab === 'batch' && selectedFiles.length > 1 && (
            <BatchWorkflowView
              analyses={analyses}
              rawFiles={selectedFiles}
              onNavigate={onNavigate}
            />
          )}

          {/* TAB 3: TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Universal Web JPG Pipeline
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Converts input to JPG, scales to Full HD 1920px width, compresses to 80%, and verifies MIME output.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleLaunchTemplate([
                      { type: 'convert', targetFormat: 'jpg' },
                      { type: 'resize', targetWidth: 1920, lockRatio: true },
                      { type: 'compress', quality: 80 },
                      { type: 'verify' }
                    ])
                  }
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Load Template <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Privacy & WebP Fast Pipeline
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Converts to WebP, strips EXIF camera & GPS metadata tags, and optimizes compression ratio.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleLaunchTemplate([
                      { type: 'convert', targetFormat: 'webp' },
                      { type: 'strip_metadata' },
                      { type: 'compress', quality: 85 },
                      { type: 'verify' }
                    ])
                  }
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Load Template <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ZIP Package & Archival Pipeline
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Converts images, sanitizes file structures, and packages outputs into a clean downloadable ZIP.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleLaunchTemplate([
                      { type: 'compress', quality: 85 },
                      { type: 'zip_package', archiveName: 'optimized_files.zip' },
                      { type: 'verify' }
                    ])
                  }
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Load Template <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 3. Upload Box & Sample Selector */
        <div className="max-w-3xl mx-auto space-y-8">
          <FileDropzone onFilesSelected={handleFilesSelected} disabled={isAnalyzing} />

          {/* Quick Sample Selector */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Or Try with Synthetic Sample Files
              </span>
              <span className="text-[11px] text-slate-400">No upload required</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample('heic')}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                📸 Sample HEIC Photo
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('png')}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                🎨 Sample PNG Graphic
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('pdf')}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                📄 Sample PDF Document
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('zip')}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                📦 Sample ZIP Archive
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('mismatch_photo')}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-300 dark:border-amber-800 text-xs font-medium text-amber-800 dark:text-amber-200 transition-colors"
              >
                ⚠️ Mismatched .JPG (PNG Header)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Educational Workflow Architecture Section */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            How AnyFileX Workflows Execute
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A privacy-first pipeline where step outputs flow seamlessly into step inputs inside browser memory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Identify & Analyze
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Magic bytes and container structures determine format compatibility before operations begin.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Multi-Stage Processing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Converts pixel matrices, scales geometries, quantizes DCT coefficients, or extracts archives.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Output Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Runs the File Intelligence Engine on generated output to confirm valid header signatures.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Audit Trail & Download
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Provides instant downloads, batch ZIP archives, and exportable Markdown/JSON audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* History Modal */}
      <WorkflowHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </div>
  );
};
