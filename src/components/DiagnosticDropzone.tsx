import React, { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileQuestion,
  ArrowRight,
  ShieldCheck,
  Binary,
  RotateCw,
  Sparkles,
  Zap,
  HelpCircle,
  FileCode,
  HardDrive,
  Copy,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  diagnoseFile,
  DiagnosticReport,
  DEMO_DIAGNOSTIC_CASES
} from '../lib/diagnostics/troubleshootingEngine';
import { AppRoute } from '../types';

interface DiagnosticDropzoneProps {
  onNavigate: (route: AppRoute) => void;
  initialFile?: File | null;
  compact?: boolean;
  highlightedProblem?: string;
}

export const DiagnosticDropzone: React.FC<DiagnosticDropzoneProps> = ({
  onNavigate,
  initialFile,
  compact = false,
  highlightedProblem
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [showHexDetails, setShowHexDetails] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runDiagnosis = async (file: File) => {
    setIsProcessing(true);
    try {
      const result = await diagnoseFile(file);
      setReport(result);
    } catch (err) {
      console.error('Diagnosis failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (initialFile) {
      runDiagnosis(initialFile);
    }
  }, [initialFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      runDiagnosis(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      runDiagnosis(e.target.files[0]);
    }
  };

  const handleRunDemo = (demoCase: typeof DEMO_DIAGNOSTIC_CASES[0]) => {
    const mock = demoCase.createMockFile();
    runDiagnosis(mock);
  };

  const handleCopyHash = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Engine Header */}
      <div className="bg-slate-900 text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-base sm:text-lg">
                AnyFileX File Intelligence Diagnostic Engine
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full font-mono font-medium border border-emerald-500/30">
                100% Local & Private
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Inspect magic bytes, detect extension mismatches, and verify structural integrity in real-time.
            </p>
          </div>
        </div>

        {report && (
          <button
            onClick={() => setReport(null)}
            className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Analyze Another File
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {!report ? (
          <div>
            {/* Dropzone Container */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.005]'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
                  {isProcessing ? (
                    <RotateCw className="w-7 h-7 animate-spin" />
                  ) : (
                    <Binary className="w-7 h-7" />
                  )}
                </div>

                <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {isProcessing
                    ? 'Auditing File Headers & Magic Bytes...'
                    : 'Drop Any Problematic File Here for Instant Diagnosis'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  Files are analyzed entirely inside your browser memory using WebAssembly. No data is ever uploaded to external servers.
                </p>

                <div className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition-colors">
                  Select File from Computer
                </div>
              </div>
            </div>

            {/* Quick Interactive Scenario Simulator */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Don't have a broken file? Try an interactive simulated scenario:
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {DEMO_DIAGNOSTIC_CASES.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => handleRunDemo(demo)}
                    className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all group"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1 flex items-center justify-between">
                      <span className="line-clamp-1">{demo.name}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {demo.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Live Diagnostic Result View */
          <div className="space-y-6">
            {/* 4-Stage Diagnostic Flow Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                4-Stage Diagnostic Pipeline
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Stage 1 */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold">1</span>
                    Problem Statement
                  </div>
                  <div className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                    {report.problemDetected}
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center text-[10px] font-bold">2</span>
                    Analysis Technique
                  </div>
                  <div className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                    {report.analysisMethod}
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center text-[10px] font-bold">3</span>
                    Identified Cause
                  </div>
                  <div className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                    {report.rootCause}
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">4</span>
                    Recommended Action
                  </div>
                  <div className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                    {report.recommendedAction}
                  </div>
                </div>
              </div>
            </div>

            {/* Findings & Human-Readable Diagnosis */}
            <div className="space-y-3">
              {report.findings.map((finding, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                    finding.severity === 'critical'
                      ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                      : finding.severity === 'warning'
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                      : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {finding.severity === 'critical' ? (
                      <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    ) : finding.severity === 'warning' ? (
                      <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">{finding.title}</div>
                    <p className="text-xs leading-relaxed opacity-90 mb-2">{finding.description}</p>
                    {finding.technicalDetails && (
                      <div className="text-[11px] font-mono bg-white/70 dark:bg-slate-900/70 px-2.5 py-1.5 rounded border border-current/10">
                        {finding.technicalDetails}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* File Metrics & Measurable Integrity Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File Identity Card */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>File Name:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                    {report.fileName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>File Size:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {report.fileSizeFormatted} ({report.fileSize.toLocaleString()} bytes)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Declared Extension:</span>
                  <span className="font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium">
                    {report.declaredExtension ? `.${report.declaredExtension}` : '(None)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Detected Format:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {report.detectedFormatName} {report.detectedExtension && `(.${report.detectedExtension})`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Header Signature:</span>
                  <span className="font-mono text-[11px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200">
                    {report.magicBytesHex.slice(0, 23)}
                  </span>
                </div>
              </div>

              {/* Measurable Integrity Assertions */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Measurable Integrity Assertions
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {report.measurableIntegrityStatements.map((stmt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{stmt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 italic">
                  {report.securityNotice}
                </div>
              </div>
            </div>

            {/* Prescribed Action Buttons */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                Recommended Action Pathways
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {report.actions.map((act, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigate(act.route as any)}
                    className={`p-3.5 rounded-xl text-left border transition-all group flex flex-col justify-between ${
                      act.primary
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs sm:text-sm flex items-center justify-between mb-1">
                        <span>{act.label}</span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                          act.primary ? 'text-white' : 'text-blue-500'
                        }`} />
                      </div>
                      <p className={`text-xs ${
                        act.primary ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {act.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hex Dump Toggle */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                onClick={() => setShowHexDetails(!showHexDetails)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
              >
                <Binary className="w-3.5 h-3.5" />
                {showHexDetails ? 'Hide Raw Hex Header Dump' : 'View Raw Hex Header Dump (64 Bytes)'}
                {showHexDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showHexDetails && (
                <div className="mt-3 p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto">
                  <div className="space-y-1">
                    {report.hexRows.map((row, rIdx) => (
                      <div key={rIdx} className="flex gap-4 font-mono text-[11px] leading-tight">
                        <span className="text-slate-500 select-none">{row.offsetHex}</span>
                        <span className="text-emerald-400 font-semibold tracking-wider">
                          {row.hexBytes.join(' ')}
                        </span>
                        <span className="text-amber-300 border-l border-slate-800 pl-3">
                          {row.asciiChars}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
