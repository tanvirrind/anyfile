import React, { useState } from 'react';
import { AppRoute } from '../../types';
import { FileAnalysis } from '../../lib/analyzer/types';
import {
  FileWorkflow,
  WorkflowStep,
  WorkflowStepConfig,
  FileHealthAssessment
} from '../../lib/workflow/types';
import {
  createWorkflow,
  createWorkflowStep,
  executeWorkflow,
  exportAnalysisReport
} from '../../lib/workflow/workflowEngine';
import { computeFileHealth } from '../../lib/workflow/diagnosticsEngine';
import { formatBytes } from '../../lib/tools/imageEngine';
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sliders,
  Maximize,
  RefreshCw,
  ShieldCheck,
  FolderArchive,
  FileCheck,
  Download,
  Share2,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

interface WorkflowBuilderProps {
  sourceFile: File;
  sourceAnalysis?: FileAnalysis;
  initialSteps?: WorkflowStepConfig[];
  onNavigate: (route: AppRoute) => void;
  onClose?: () => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  sourceFile,
  sourceAnalysis,
  initialSteps,
  onNavigate,
  onClose
}) => {
  const [workflow, setWorkflow] = useState<FileWorkflow>(() =>
    createWorkflow(sourceFile, initialSteps, sourceAnalysis)
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'markdown' | 'html' | 'json'>('markdown');

  const fileHealth: FileHealthAssessment | null = sourceAnalysis ? computeFileHealth(sourceAnalysis) : null;

  // Add Step
  const handleAddStep = (type: WorkflowStepConfig['type'], params: Partial<WorkflowStepConfig> = {}) => {
    const newConfig: WorkflowStepConfig = {
      type,
      targetFormat: params.targetFormat || 'jpg',
      quality: params.quality || 80,
      targetWidth: params.targetWidth || 1920,
      lockRatio: true,
      mode: 'contain',
      ...params
    };

    const newStep = createWorkflowStep(newConfig, workflow.steps.length);
    setWorkflow((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
      status: 'draft'
    }));
    setShowAddMenu(false);
  };

  // Remove Step
  const handleRemoveStep = (index: number) => {
    setWorkflow((prev) => {
      const updated = prev.steps.filter((_, i) => i !== index);
      return {
        ...prev,
        steps: updated,
        status: 'draft'
      };
    });
  };

  // Move Step Up/Down
  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    setWorkflow((prev) => {
      const updated = [...prev.steps];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;

      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;

      return {
        ...prev,
        steps: updated,
        status: 'draft'
      };
    });
  };

  // Update Step Config
  const handleUpdateStepConfig = (index: number, partialConfig: Partial<WorkflowStepConfig>) => {
    setWorkflow((prev) => {
      const updated = [...prev.steps];
      const current = updated[index];
      const mergedConfig = { ...current.config, ...partialConfig };
      const refreshedStep = createWorkflowStep(mergedConfig, index);
      updated[index] = refreshedStep;

      return {
        ...prev,
        steps: updated,
        status: 'draft'
      };
    });
  };

  // Run Workflow
  const handleRunWorkflow = async () => {
    if (isExecuting) return;
    setIsExecuting(true);

    try {
      const result = await executeWorkflow(workflow, (stepIdx, updatedStep) => {
        setWorkflow((prev) => {
          const nextSteps = [...prev.steps];
          nextSteps[stepIdx] = updatedStep;
          return {
            ...prev,
            steps: nextSteps,
            currentStepIndex: stepIdx
          };
        });
      });

      setWorkflow(result);
    } catch (err: any) {
      console.error('Workflow execution failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Download Output
  const handleDownloadOutput = () => {
    if (!workflow.finalOutput) return;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = workflow.finalOutput.blobUrl;
    downloadAnchor.download = workflow.finalOutput.fileName;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export Report
  const handleExportReport = () => {
    if (sourceAnalysis) {
      exportAnalysisReport(sourceAnalysis, selectedFormat, workflow);
    }
  };

  const isCompleted = workflow.status === 'completed';
  const isFailed = workflow.status === 'failed';

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
      {/* 1. Header & Source File Hero */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Smart Workflow Engine
            </span>
            {fileHealth && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${fileHealth.badgeClass}`}>
                {fileHealth.status}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Workflow Builder: {sourceFile.name}
          </h2>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Source Size: {formatBytes(sourceFile.size)} • Client-Side Local Execution
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          )}

          <button
            type="button"
            onClick={handleRunWorkflow}
            disabled={isExecuting || workflow.steps.length === 0}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            {isExecuting ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" /> Processing Step {workflow.currentStepIndex + 1}...
              </>
            ) : isCompleted ? (
              <>
                <RotateCcw className="w-4 h-4" /> Re-run Workflow
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Run Workflow
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Visual Pipeline Step Graph */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500" /> Pipeline Operations ({workflow.steps.length} steps)
          </h3>
          <span className="text-xs text-slate-400">Operations execute sequentially from top to bottom</span>
        </div>

        {/* Step List */}
        <div className="space-y-3 relative">
          {workflow.steps.map((step, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === workflow.steps.length - 1;

            return (
              <div
                key={step.id}
                className={`relative p-5 rounded-2xl border transition-all ${
                  step.status === 'running'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/50'
                    : step.status === 'completed'
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : step.status === 'failed'
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                {/* Step Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        step.status === 'completed'
                          ? 'bg-emerald-500 text-white'
                          : step.status === 'running'
                          ? 'bg-blue-600 text-white animate-pulse'
                          : step.status === 'failed'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : step.status === 'failed' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {step.name}
                        {step.metrics?.durationMs && (
                          <span className="text-[11px] font-normal text-slate-400">
                            ({step.metrics.durationMs}ms)
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
                    </div>
                  </div>

                  {/* Step Action Buttons (Reorder, Delete) */}
                  <div className="flex items-center gap-1 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={isFirst || isExecuting}
                      onClick={() => handleMoveStep(idx, 'up')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                      title="Move Step Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast || isExecuting}
                      onClick={() => handleMoveStep(idx, 'down')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                      title="Move Step Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isExecuting}
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-30 transition-colors ml-1"
                      title="Remove Step"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Step Configuration Controls */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
                  {/* CONVERT CONFIG */}
                  {step.type === 'convert' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Target Format:</span>
                      {(['jpg', 'png', 'webp', 'pdf'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          disabled={isExecuting}
                          onClick={() => handleUpdateStepConfig(idx, { targetFormat: fmt })}
                          className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                            step.config.targetFormat === fmt
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          .{fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* RESIZE CONFIG */}
                  {step.type === 'resize' && (
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Target Width:</span>
                        <input
                          type="number"
                          disabled={isExecuting}
                          value={step.config.targetWidth || 1920}
                          onChange={(e) =>
                            handleUpdateStepConfig(idx, { targetWidth: parseInt(e.target.value) || 1920 })
                          }
                          className="w-24 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-semibold"
                        />
                        <span className="text-slate-400">px</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Preset:</span>
                        {[
                          { label: 'Full HD (1920)', w: 1920 },
                          { label: 'Standard (1280)', w: 1280 },
                          { label: 'Square (1080)', w: 1080 },
                          { label: 'Thumb (500)', w: 500 }
                        ].map((p) => (
                          <button
                            key={p.w}
                            type="button"
                            disabled={isExecuting}
                            onClick={() => handleUpdateStepConfig(idx, { targetWidth: p.w })}
                            className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px]"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COMPRESS CONFIG */}
                  {step.type === 'compress' && (
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Quality:</span>
                        <input
                          type="range"
                          min="20"
                          max="95"
                          step="5"
                          disabled={isExecuting}
                          value={step.config.quality || 80}
                          onChange={(e) =>
                            handleUpdateStepConfig(idx, { quality: parseInt(e.target.value) })
                          }
                          className="w-32 accent-blue-600 cursor-pointer"
                        />
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {step.config.quality || 80}%
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        {step.config.quality && step.config.quality >= 85
                          ? 'High visual fidelity / minimal artifacts'
                          : 'Recommended balance of size & sharpness'}
                      </span>
                    </div>
                  )}

                  {/* STEP ERROR DISPLAY */}
                  {step.status === 'failed' && step.error && (
                    <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block">Step Execution Error:</strong>
                        <span>{step.error}</span>
                        <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-1">
                          The original file was not modified. You can adjust parameters and retry.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP SUCCESS METRICS */}
                  {step.status === 'completed' && step.metrics && (
                    <div className="flex items-center gap-3 text-[11px] text-emerald-700 dark:text-emerald-300">
                      {step.metrics.outputSizeBytes && (
                        <span>Output: {formatBytes(step.metrics.outputSizeBytes)}</span>
                      )}
                      {step.metrics.savedPercent && step.metrics.savedPercent > 0 ? (
                        <span>• Reduced by {step.metrics.savedPercent}%</span>
                      ) : null}
                      {step.metrics.width && step.metrics.height ? (
                        <span>• Dimensions: {step.metrics.width} × {step.metrics.height} px</span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Step Action Menu */}
        <div className="pt-2">
          {showAddMenu ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Operation to Append
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddMenu(false)}
                  className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleAddStep('convert', { targetFormat: 'webp' })}
                  className="p-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-600 text-left space-y-1 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Convert Format</div>
                  <div className="text-[10px] text-slate-400">JPG, PNG, WEBP, PDF</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddStep('resize', { targetWidth: 1920 })}
                  className="p-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-600 text-left space-y-1 transition-colors"
                >
                  <Maximize className="w-4 h-4 text-indigo-500" />
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Resize Dimensions</div>
                  <div className="text-[10px] text-slate-400">Width & Height scaling</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddStep('compress', { quality: 80 })}
                  className="p-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-600 text-left space-y-1 transition-colors"
                >
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Compress Payload</div>
                  <div className="text-[10px] text-slate-400">Lossy quality slider</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddStep('strip_metadata')}
                  className="p-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-600 text-left space-y-1 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Strip Metadata</div>
                  <div className="text-[10px] text-slate-400">Remove EXIF & GPS tags</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddStep('zip_package', { archiveName: 'processed_bundle.zip' })}
                  className="p-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-600 text-left space-y-1 transition-colors"
                >
                  <FolderArchive className="w-4 h-4 text-amber-500" />
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Package into ZIP</div>
                  <div className="text-[10px] text-slate-400">Archive packaging</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddStep('verify')}
                  className="p-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-600 text-left space-y-1 transition-colors"
                >
                  <FileCheck className="w-4 h-4 text-emerald-500" />
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Verify Integrity</div>
                  <div className="text-[10px] text-slate-400">Output magic check</div>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={isExecuting}
              onClick={() => setShowAddMenu(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Operation to Workflow
            </button>
          )}
        </div>
      </div>

      {/* 3. Output Verification & Download Section (Shown when completed) */}
      {isCompleted && workflow.finalOutput && (
        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Workflow Successfully Executed
              </span>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {workflow.finalOutput.fileName}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Final Size: <strong>{formatBytes(workflow.finalOutput.size)}</strong> (Original: {formatBytes(sourceFile.size)})
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadOutput}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Processed Output
              </button>
            </div>
          </div>

          {/* Output Intelligence Verification Badge */}
          {workflow.finalOutput.verification && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h5 className="font-bold text-slate-900 dark:text-white">
                  Output Integrity Verified by File Intelligence Engine
                </h5>
                <p className="text-slate-600 dark:text-slate-400">
                  Binary header recognized as <strong>{workflow.finalOutput.verification.detectedFormat}</strong> ({workflow.finalOutput.verification.detectedMimeType}). Extension matches output buffer perfectly.
                </p>
              </div>
            </div>
          )}

          {/* Export Audit Report Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-200 dark:border-emerald-900/50 text-xs">
            <span className="text-emerald-800 dark:text-emerald-300 font-medium">
              Export Audit Trail:
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                <option value="markdown">Markdown (.md)</option>
                <option value="html">HTML Report (.html)</option>
                <option value="json">JSON (.json)</option>
              </select>
              <button
                type="button"
                onClick={handleExportReport}
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Save Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
