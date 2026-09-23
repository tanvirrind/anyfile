import React, { useState, useEffect } from 'react';
import { AppRoute } from '../types';
import { FileAnalysis, BatchAnalysisQueueItem } from '../lib/analyzer/types';
import { analyzeFile, getStoredAnalysis } from '../lib/analyzer/fileAnalyzerService';
import { FileDropzone } from '../components/analyzer/FileDropzone';
import { AnalysisProgress } from '../components/analyzer/AnalysisProgress';
import { BatchFileQueue } from '../components/analyzer/BatchFileQueue';
import { FileAnalysisResultView } from '../components/analyzer/FileAnalysisResultView';
import { BatchWorkflowView } from '../components/workflow/BatchWorkflowView';
import { WorkflowHistoryModal } from '../components/workflow/WorkflowHistoryModal';
import {
  Cpu,
  ShieldCheck,
  Binary,
  Layers,
  HelpCircle,
  RefreshCw,
  Scale,
  Sparkles,
  ArrowRight,
  FileCheck,
  AlertTriangle,
  Lock,
  ChevronDown,
  Clock,
  Zap,
  Sliders
} from 'lucide-react';

interface FileAnalyzerPageProps {
  initialReportId?: string;
  onNavigate: (route: AppRoute) => void;
}

export const FileAnalyzerPage: React.FC<FileAnalyzerPageProps> = ({
  initialReportId,
  onNavigate,
}) => {
  const [analyzedFiles, setAnalyzedFiles] = useState<FileAnalysis[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'batch_workflow'>('single');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentProgressText, setCurrentProgressText] = useState('Initializing binary stream...');
  const [currentProgressPercent, setCurrentProgressPercent] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Load initial report if URL provided an ID
  useEffect(() => {
    if (initialReportId) {
      const stored = getStoredAnalysis(initialReportId);
      if (stored) {
        setAnalyzedFiles([stored]);
        setActiveAnalysisId(stored.id);
      }
    }
  }, [initialReportId]);

  // Handle files selection (single or batch)
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    setErrorMessage(null);
    setIsAnalyzing(true);
    setRawFiles((prev) => [...files, ...prev]);

    const newAnalyses: FileAnalysis[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentFileName(file.name);
      setCurrentProgressPercent(10);
      setCurrentProgressText(`Analyzing ${file.name} (${i + 1} of ${files.length})...`);

      try {
        const analysis = await analyzeFile(file, (stepText, percent) => {
          setCurrentProgressText(stepText);
          setCurrentProgressPercent(percent);
        });
        newAnalyses.push(analysis);
      } catch (err: any) {
        console.error('File analysis error for', file.name, err);
        setErrorMessage(`Failed to analyze ${file.name}: ${err?.message || 'Unknown read error'}`);
      }
    }

    setIsAnalyzing(false);

    if (newAnalyses.length > 0) {
      setAnalyzedFiles((prev) => {
        const combined = [...newAnalyses, ...prev];
        return combined;
      });
      setActiveAnalysisId(newAnalyses[0].id);
      if (files.length > 1) {
        setViewMode('single');
      }
    }
  };

  const activeAnalysis = analyzedFiles.find((a) => a.id === activeAnalysisId) || null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Title & Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" /> File Intelligence Engine
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          File Analyzer & Identifier
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Inspect binary headers, identify true file formats, detect extension mismatches, and view deep technical metadata — 100% locally in your browser.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Workflow History
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ view: 'workflows' })}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" /> Pipeline Builder
          </button>
        </div>
      </div>

      {/* Main Interactive Work Area */}
      <div className="space-y-6">
        {/* If Analyzing -> Show Progress Indicator */}
        {isAnalyzing ? (
          <AnalysisProgress
            fileName={currentFileName}
            stepText={currentProgressText}
            percent={currentProgressPercent}
          />
        ) : activeAnalysis ? (
          <div className="space-y-6">
            {/* Multi-File Tab Switcher & Batch View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <BatchFileQueue
                  analyses={analyzedFiles}
                  activeId={activeAnalysis.id}
                  onSelect={(id) => {
                    setActiveAnalysisId(id);
                    setViewMode('single');
                  }}
                  onAddMoreClick={() => {
                    setActiveAnalysisId(null);
                  }}
                />
              </div>

              {analyzedFiles.length > 1 && (
                <div className="flex items-center gap-2 self-end sm:self-center mb-6">
                  <button
                    type="button"
                    onClick={() => setViewMode('single')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      viewMode === 'single'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Single Inspection
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('batch_workflow')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      viewMode === 'batch_workflow'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Batch Workflows
                  </button>
                </div>
              )}
            </div>

            {/* View Mode Router */}
            {viewMode === 'batch_workflow' && analyzedFiles.length > 1 ? (
              <BatchWorkflowView
                analyses={analyzedFiles}
                rawFiles={rawFiles}
                onNavigate={onNavigate}
              />
            ) : (
              <FileAnalysisResultView
                analysis={activeAnalysis}
                onNavigate={onNavigate}
                onAnalyzeAnother={() => {
                  setActiveAnalysisId(null);
                }}
              />
            )}
          </div>
        ) : (
          /* Dropzone Upload Box */
          <div className="max-w-3xl mx-auto">
            {errorMessage && (
              <div className="mb-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}
            <FileDropzone onFilesSelected={handleFilesSelected} disabled={isAnalyzing} />
          </div>
        )}
      </div>

      {/* Educational Knowledge Section */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            How the AnyFileX File Intelligence Engine Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A multi-stage binary inspection pipeline that prioritizes internal file contents over untrusted filename extensions.
          </p>
        </div>

        {/* 4-Stage Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Magic Byte Inspection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Reads the initial binary header bytes (offset 0x00) and matches against 200+ standardized file format signatures.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Container Parsing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Inspects internal container structures like PKZIP manifests (DOCX/XLSX/APK), ISOBMFF ftyp brands (HEIC/AVIF/MP4), and RIFF forms.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              MIME & RFC Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Compares browser-reported MIME types against canonical IANA and RFC standards in the AnyFileX database.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Knowledge Graph Action
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Connects the identified format to verified software viewers, conversion tools, and step-by-step How-to-Open guides.
            </p>
          </div>
        </div>

        {/* Client-Side Privacy Architecture Feature Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Privacy-First Client-Side Architecture
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Zero file uploads required for file identification.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Unlike traditional online file scanners that upload full file contents to remote cloud servers, the AnyFileX File Intelligence Engine utilizes HTML5 File and ArrayBuffer slicing to inspect headers directly in your browser RAM. Your confidential documents, photos, CAD drawings, and archives stay entirely on your device.
          </p>
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
