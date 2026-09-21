import React, { useState } from 'react';
import { FileAnalysis } from '../../lib/analyzer/types';
import { AppRoute } from '../../types';
import { generateSmartActions } from '../../lib/workflow/smartActionEngine';
import { computeFileHealth } from '../../lib/workflow/diagnosticsEngine';
import { WorkflowBuilder } from '../workflow/WorkflowBuilder';
import { exportAnalysisReport } from '../../lib/workflow/workflowEngine';
import { WorkflowStepConfig } from '../../lib/workflow/types';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  Scale,
  Copy,
  Check,
  Download,
  Info,
  ShieldCheck,
  Cpu,
  Layers,
  Code2,
  Terminal,
  Binary,
  Monitor,
  Apple,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Share2,
  Activity,
  ArrowRight,
  Sparkles,
  Sliders,
  Maximize,
  FolderArchive,
  Zap,
  Clock,
  X
} from 'lucide-react';

interface FileAnalysisResultViewProps {
  analysis: FileAnalysis;
  onNavigate: (route: AppRoute) => void;
  onAnalyzeAnother: () => void;
}

export const FileAnalysisResultView: React.FC<FileAnalysisResultViewProps> = ({
  analysis,
  onNavigate,
  onAnalyzeAnother,
}) => {
  const [activeTab, setActiveTab] = useState<'technical' | 'metadata' | 'security' | 'software' | 'related'>('technical');
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [initialWorkflowSteps, setInitialWorkflowSteps] = useState<WorkflowStepConfig[] | undefined>(undefined);
  const [reportFormat, setReportFormat] = useState<'markdown' | 'html' | 'json'>('markdown');

  const isMismatch = analysis.extensionComparison.status === 'mismatch';
  const isMissingExt = analysis.extensionComparison.status === 'missing';
  const hasMetadata = analysis.metadata.rawPropertyList.length > 0;

  // Compute Smart Actions & Diagnostics
  const smartActions = generateSmartActions(analysis);
  const fileHealth = smartActions.fileHealth;

  // Resolve raw File object
  const targetFile = analysis.rawFile || new File([new Uint8Array(analysis.signature.sampleBytes || [])], analysis.fileName, {
    type: analysis.detectedMimeType
  });

  const handleLaunchWorkflow = (steps?: WorkflowStepConfig[]) => {
    setInitialWorkflowSteps(steps);
    setShowWorkflowModal(true);
  };

  const handleExportReport = (format: 'markdown' | 'html' | 'json') => {
    exportAnalysisReport(analysis, format);
  };

  const handleCopySha256 = () => {
    navigator.clipboard.writeText(analysis.diagnostics.sha256Hash ?? '');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(analysis, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${analysis.fileName}_analysis_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const summary = `AnyFileX File Analysis Report\n` +
      `File: ${analysis.fileName} (${analysis.formattedSize})\n` +
      `Detected Format: ${analysis.detectedFormat} (.${analysis.detectedExtension.toLowerCase()})\n` +
      `Detected MIME: ${analysis.detectedMimeType}\n` +
      `Extension Match: ${analysis.extensionComparison.message}\n` +
      `SHA-256: ${analysis.diagnostics.sha256Hash ?? 'Unavailable'}\n` +
      `Security Assessment: ${analysis.security.badgeText}\n` +
      `Analyzed: ${new Date(analysis.diagnostics.analyzedAt).toLocaleString()} (Client-Side Local)`;

    navigator.clipboard.writeText(summary);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Hero Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                .{analysis.detectedExtension.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {analysis.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  analysis.confidence === 'High'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {analysis.confidence} Confidence ({analysis.confidenceScore}%)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {analysis.detectedFormat}
            </h1>

            <p className="text-sm font-mono text-slate-500 dark:text-slate-400 break-all">
              {analysis.fileName} • <span className="font-sans font-semibold text-slate-700 dark:text-slate-300">{analysis.formattedSize}</span>
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate({ view: 'how-to-open', ext: analysis.detectedExtension.toLowerCase() })}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" /> How to Open
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'converters' })}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-semibold transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-blue-500" /> Convert File
            </button>
            <button
              type="button"
              onClick={onAnalyzeAnother}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-all"
            >
              Analyze Another
            </button>
          </div>
        </div>

        {/* Extension Mismatch Banner */}
        {isMismatch && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <h4 className="font-bold text-amber-900 dark:text-amber-200">
                Extension Mismatch Detected!
              </h4>
              <p className="text-amber-800 dark:text-amber-300 text-xs sm:text-sm">
                {analysis.extensionComparison.explanation}
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs">
                <span className="font-medium text-amber-900 dark:text-amber-200">Recommended action:</span>
                <span className="bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded text-amber-900 dark:text-amber-100 font-mono font-bold">
                  Rename extension to .{analysis.detectedExtension.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {isMissingExt && (
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <h4 className="font-bold text-blue-900 dark:text-blue-200">
                Identified Missing Extension
              </h4>
              <p className="text-blue-800 dark:text-blue-300 text-xs">
                {analysis.extensionComparison.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Detected Format</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {analysis.detectedFormat}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">MIME Type</span>
            <p className="text-sm font-mono font-bold text-slate-900 dark:text-white truncate">
              {analysis.detectedMimeType}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Magic Header</span>
            <p className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 truncate">
              {analysis.signature.hexSignature.slice(0, 11) || 'N/A'}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">File Health</span>
            <p className="text-sm font-bold truncate flex items-center gap-1">
              <span className={`px-2 py-0.5 rounded-full text-xs border ${fileHealth.badgeClass}`}>
                {fileHealth.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. File Diagnostics & Technical Health Assessment */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Technical Diagnostics & Health Assessment
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {fileHealth.summary}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${fileHealth.badgeClass}`}>
              Status: {fileHealth.status}
            </span>
          </div>
        </div>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {fileHealth.signals.map((sig) => (
            <div
              key={sig.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{sig.name}</span>
                {sig.status === 'pass' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : sig.status === 'warn' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-blue-500 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {sig.message}
              </p>
            </div>
          ))}
        </div>

        {/* Human-Readable Diagnostic Advice */}
        {smartActions.diagnostics.map((diag, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
              diag.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : diag.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> {diag.title}
            </div>
            <p className="leading-relaxed opacity-90">{diag.message}</p>
            <p className="font-semibold text-xs pt-1">
              Diagnosis Recommendation: <span className="opacity-90">{diag.recommendedAction}</span>
            </p>
          </div>
        ))}

        <p className="text-[11px] text-slate-400 italic pt-1">
          {fileHealth.disclaimer}
        </p>
      </div>

      {/* 3. Smart Actions Matrix: What Would You Like To Do? */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Next Steps & Workflows
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Recommended Actions for .{analysis.detectedExtension.toUpperCase()}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => handleLaunchWorkflow()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sliders className="w-4 h-4" /> Custom Pipeline Builder
          </button>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Quick Conversion Options */}
          {smartActions.conversionTargets.map((target) => (
            <button
              key={target.format}
              type="button"
              onClick={() => handleLaunchWorkflow([{ type: 'convert', targetFormat: target.format as any }, { type: 'verify' }])}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-left space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {target.isRecommended ? 'Recommended' : 'Convert'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Convert to .{target.format.toUpperCase()}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {target.rationale}
              </p>
            </button>
          ))}

          {/* Quick Compress Action */}
          {analysis.category === 'Images' && (
            <button
              type="button"
              onClick={() => handleLaunchWorkflow([{ type: 'compress', quality: 80 }, { type: 'verify' }])}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-left space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Optimization
                </span>
                <Sliders className="w-4 h-4 text-emerald-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                Compress Image Payload
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Quantize DCT matrix to reduce byte size with visual fidelity slider.
              </p>
            </button>
          )}

          {/* Quick Resize Action */}
          {analysis.category === 'Images' && (
            <button
              type="button"
              onClick={() => handleLaunchWorkflow([{ type: 'resize', targetWidth: 1920, lockRatio: true }, { type: 'compress', quality: 85 }, { type: 'verify' }])}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-left space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Dimensions
                </span>
                <Maximize className="w-4 h-4 text-indigo-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                Resize Dimensions (Full HD)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Scale resolution to standard 1920px width with aspect ratio lock.
              </p>
            </button>
          )}

          {/* Preset Multi-Step Pipelines */}
          {smartActions.recommendedWorkflows.map((recWf) => (
            <button
              key={recWf.id}
              type="button"
              onClick={() => handleLaunchWorkflow(recWf.steps)}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 text-left space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {recWf.stepNames.length} Steps
                </span>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                {recWf.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {recWf.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Builder Inline / Modal Overlay */}
      {showWorkflowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
            <WorkflowBuilder
              sourceFile={targetFile}
              sourceAnalysis={analysis}
              initialSteps={initialWorkflowSteps}
              onNavigate={onNavigate}
              onClose={() => setShowWorkflowModal(false)}
            />
          </div>
        </div>
      )}

      {/* 4. Deep Inspection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('technical')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'technical'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" /> Technical & Hex
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('metadata')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'metadata'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Deep Metadata
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'security'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Security & Integrity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('software')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'software'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Monitor className="w-4 h-4" /> Compatibility
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('related')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'related'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Actions & Tools
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: TECHNICAL & HEX INSPECTOR */}
      {activeTab === 'technical' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* MIME & Extension Comparison Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Extension Comparison */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Filename vs Binary Header
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500 dark:text-slate-400">Filename Extension:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {analysis.extensionComparison.filenameExtension}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500 dark:text-slate-400">Detected Format Extension:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {analysis.extensionComparison.detectedExtension}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500 dark:text-slate-400">Comparison Status:</span>
                  <span
                    className={`font-semibold ${
                      analysis.extensionComparison.status === 'match'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {analysis.extensionComparison.message}
                  </span>
                </div>
              </div>
            </div>

            {/* MIME Comparison */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-500" /> MIME Type Verification
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500 dark:text-slate-400">Browser Reported:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {analysis.mimeComparison.browserReportedMime}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500 dark:text-slate-400">Detected MIME:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {analysis.mimeComparison.detectedMime}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500 dark:text-slate-400">Standard RFC Database:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {analysis.mimeComparison.standardDatabaseMime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Magic Bytes Signature Meaning */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" /> Header Signature Explanation
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {analysis.signature.meaning}
            </p>
          </div>

          {/* Raw 16-Byte Hex Dump Viewer */}
          <div className="bg-slate-950 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" /> Binary Header Hex Dump (First 128 Bytes)
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Offset (16 Bytes / Row)</span>
            </div>

            <div className="overflow-x-auto font-mono text-xs leading-relaxed py-2 bg-slate-900/70 rounded-2xl p-4 border border-slate-800/60">
              <div className="text-slate-500 pb-2 border-b border-slate-800 mb-2 grid grid-cols-12 gap-2 text-[11px]">
                <span className="col-span-3">Offset</span>
                <span className="col-span-6">Hexadecimal Representation</span>
                <span className="col-span-3 text-right">ASCII Preview</span>
              </div>

              {analysis.signature.hexOffsetRows.length > 0 ? (
                analysis.signature.hexOffsetRows.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 py-0.5 hover:bg-slate-800/50 rounded px-1">
                    <span className="col-span-3 text-blue-400 font-bold">{row.offsetHex}</span>
                    <span className="col-span-6 text-emerald-300 tracking-wide">
                      {row.hexBytes.join(' ')}
                    </span>
                    <span className="col-span-3 text-slate-300 text-right font-semibold">
                      {row.asciiChars}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic">No bytes available (0-byte file)</div>
              )}
            </div>
          </div>

          {/* Cryptographic Hashes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Cryptographic Integrity Fingerprint
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="space-y-1 min-w-0">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">SHA-256 Checksum</span>
                <p className="font-mono text-xs sm:text-sm text-slate-900 dark:text-white break-all font-bold">
                  {analysis.diagnostics.sha256Hash ?? 'Unavailable'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopySha256}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-600 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Hash
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEEP METADATA */}
      {activeTab === 'metadata' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> Extracted Technical Properties
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {analysis.metadata.rawPropertyList.length} properties detected
              </span>
            </div>

            {/* Specialized Metadata Cards (Image/Video/Audio/Doc) */}
            {analysis.metadata.image && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase">Width × Height</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {analysis.metadata.image.width ? `${analysis.metadata.image.width} × ${analysis.metadata.image.height} px` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase">Aspect Ratio</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {analysis.metadata.image.aspectRatio || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase">Resolution</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {analysis.metadata.image.megapixels || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase">Color Space</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {analysis.metadata.image.colorSpace || 'sRGB'}
                  </p>
                </div>
              </div>
            )}

            {analysis.metadata.audio && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase">Duration</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {analysis.metadata.audio.formattedDuration || 'Variable'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase">Channels</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {analysis.metadata.audio.channelLayout || 'Stereo (2)'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase">Codec</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {analysis.metadata.audio.codec || analysis.detectedExtension}
                  </p>
                </div>
              </div>
            )}

            {/* Property Key-Value List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800 pt-2">
              {analysis.metadata.rawPropertyList.map((prop, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {prop.key}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">
                    {prop.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & INTEGRITY */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> Structural Safety & Integrity Assessment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                  Neutral format inspection based on byte signatures and container flags.
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  analysis.security.status === 'safe'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}
              >
                {analysis.security.badgeText}
              </span>
            </div>

            {/* Checklist of Indicators */}
            <div className="space-y-3">
              {analysis.security.indicators.map((ind) => (
                <div
                  key={ind.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                    ind.type === 'danger'
                      ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'
                      : ind.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                      : ind.type === 'caution'
                      ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="mt-0.5">
                    {ind.type === 'danger' ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : ind.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {ind.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ind.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Entropy Meter */}
            {analysis.security.entropy !== undefined && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Shannon Data Entropy: {analysis.security.entropy} / 8.0
                  </span>
                  <span className="text-slate-400">
                    {analysis.security.entropy > 7.5 ? 'Compressed / Encrypted Payload' : 'Standard Structured Stream'}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(analysis.security.entropy / 8.0) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                <strong>Notice:</strong> AnyFileX File Analyzer is a binary inspection tool, not an antivirus or antimalware engine. It evaluates header integrity, container specifications, and format mismatches.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOFTWARE COMPATIBILITY */}
      {activeTab === 'software' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-500" /> Platform & Software Ecosystem for .{analysis.detectedExtension.toUpperCase()}
            </h3>

            {/* OS Support Matrix */}
            {analysis.knowledgeNode && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                  <Monitor className="w-5 h-5 mx-auto text-blue-500" />
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">Windows</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {analysis.knowledgeNode.compatibleSoftware.some(s => s.software.supportedOS.includes('windows')) ? 'Supported' : 'Plugin Required'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                  <Apple className="w-5 h-5 mx-auto text-slate-700 dark:text-slate-300" />
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">macOS</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {analysis.knowledgeNode.compatibleSoftware.some(s => s.software.supportedOS.includes('mac')) ? 'Supported' : 'Third-Party'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                  <Terminal className="w-5 h-5 mx-auto text-orange-500" />
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">Linux</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {analysis.knowledgeNode.compatibleSoftware.some(s => s.software.supportedOS.includes('linux')) ? 'Supported' : 'CLI Tools'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                  <Smartphone className="w-5 h-5 mx-auto text-emerald-500" />
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">iOS</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {analysis.knowledgeNode.compatibleSoftware.some(s => s.software.supportedOS.includes('ios')) ? 'Native / App' : 'Viewer App'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                  <Smartphone className="w-5 h-5 mx-auto text-emerald-600" />
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">Android</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {analysis.knowledgeNode.compatibleSoftware.some(s => s.software.supportedOS.includes('android')) ? 'Native / App' : 'Viewer App'}
                  </span>
                </div>
              </div>
            )}

            {/* Compatible Software List */}
            {analysis.knowledgeNode && analysis.knowledgeNode.compatibleSoftware.length > 0 ? (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recommended Programs & Viewers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.knowledgeNode.compatibleSoftware.map(({ software, platformBadges }) => (
                    <div
                      key={software.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                          {software.name}
                        </h5>
                        <span className="text-xs font-medium text-slate-500">
                          {software.priceType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {software.description}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {platformBadges.map((badge) => (
                            <span
                              key={badge}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => onNavigate({ view: 'software-detail', id: software.id })}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                        >
                          Details <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                General file format handler. Standard system utilities or category editors can view this file.
              </p>
            )}

            {/* Direct How-to-open Link */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate({ view: 'how-to-open', ext: analysis.detectedExtension.toLowerCase() })}
                className="w-full py-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                View Detailed How-to-Open Guide for .{analysis.detectedExtension.toUpperCase()} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACTIONS & TOOLS */}
      {activeTab === 'related' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" /> AnyFileX Knowledge Engine Tools for .{analysis.detectedExtension.toUpperCase()}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysis.availableTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onNavigate(tool.route)}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-800/40 hover:shadow-md transition-all text-left group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                      {tool.badge || 'Tool'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {tool.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Related Category Formats */}
            {analysis.knowledgeNode && analysis.knowledgeNode.relatedExtensions.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Related Formats in {analysis.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.knowledgeNode.relatedExtensions.map((relExt) => (
                    <button
                      key={relExt.ext}
                      type="button"
                      onClick={() => onNavigate({ view: 'extension-detail', ext: relExt.ext.toLowerCase() })}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      .{relExt.ext.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Action Bar Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Local RAM session analysis completed in {analysis.diagnostics.analysisTimeMs}ms.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-1"
          >
            {copiedJson ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            Copy Summary
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-1"
          >
            <Download className="w-3 h-3" /> Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};
