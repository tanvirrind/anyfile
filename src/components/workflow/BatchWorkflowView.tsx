'use client';

import React, { useState } from 'react';
import { AppRoute } from '../../types';
import { FileAnalysis } from '../../lib/analyzer/types';
import {
  BatchGroup,
  BatchFileItem,
  WorkflowStepConfig
} from '../../lib/workflow/types';
import { createWorkflow, executeWorkflow } from '../../lib/workflow/workflowEngine';
import { createBatchZip, formatBytes } from '../../lib/tools/imageEngine';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  FolderArchive,
  RefreshCw,
  Sliders,
  Maximize,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface BatchWorkflowViewProps {
  analyses: FileAnalysis[];
  rawFiles: File[];
  onNavigate: (route: AppRoute) => void;
}

export const BatchWorkflowView: React.FC<BatchWorkflowViewProps> = ({
  analyses,
  rawFiles,
  onNavigate
}) => {
  // Automatically group files by compatible format
  const groups: BatchGroup[] = React.useMemo(() => {
    const groupMap: Record<string, BatchGroup> = {};

    analyses.forEach((analysis) => {
      const ext = analysis.detectedExtension.toLowerCase();
      const cat = analysis.category;
      const fileObj = rawFiles.find((f) => f.name === analysis.fileName) || new File([], analysis.fileName);

      let groupKey = `${cat.toLowerCase()}-${ext}`;
      let title = `.${ext.toUpperCase()} Files (${cat})`;

      if (['heic', 'heif'].includes(ext)) {
        groupKey = 'image-heic';
        title = 'HEIC / HEIF Photos';
      } else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        groupKey = 'image-raster';
        title = 'Standard Web Images (JPG, PNG, WEBP)';
      } else if (ext === 'pdf') {
        groupKey = 'document-pdf';
        title = 'PDF Documents';
      } else if (ext === 'zip') {
        groupKey = 'archive-zip';
        title = 'ZIP Archives';
      }

      if (!groupMap[groupKey]) {
        const supportedActions: BatchGroup['supportedActions'] = [];

        if (groupKey.startsWith('image')) {
          supportedActions.push({
            id: 'batch_convert_jpg',
            title: 'Convert All to JPG',
            description: 'Transcode all images to high-compatibility JPEG files.',
            iconName: 'RefreshCw',
            steps: [
              { type: 'convert', targetFormat: 'jpg' },
              { type: 'verify' }
            ]
          });
          supportedActions.push({
            id: 'batch_compress',
            title: 'Compress All (80% Quality)',
            description: 'Reduce storage footprint across all images.',
            iconName: 'Sliders',
            steps: [
              { type: 'compress', quality: 80 },
              { type: 'verify' }
            ]
          });
          supportedActions.push({
            id: 'batch_resize_hd',
            title: 'Resize All to 1920px Width',
            description: 'Scale all images with locked aspect ratio.',
            iconName: 'Maximize',
            steps: [
              { type: 'resize', targetWidth: 1920, lockRatio: true },
              { type: 'compress', quality: 85 },
              { type: 'verify' }
            ]
          });
        }

        groupMap[groupKey] = {
          groupKey,
          title,
          format: ext,
          category: cat,
          items: [],
          supportedActions
        };
      }

      groupMap[groupKey].items.push({
        id: analysis.id,
        file: fileObj,
        analysis,
        groupKey,
        status: 'pending'
      });
    });

    return Object.values(groupMap);
  }, [analyses, rawFiles]);

  const [activeGroupKey, setActiveGroupKey] = useState<string>(groups[0]?.groupKey || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResults, setProcessedResults] = useState<
    Record<string, { status: 'completed' | 'failed'; blob?: Blob; fileName?: string; error?: string }>
  >({});
  const [downloadZipUrl, setDownloadZipUrl] = useState<string | null>(null);

  const activeGroup = groups.find((g) => g.groupKey === activeGroupKey) || groups[0];

  // Execute Batch Workflow for Selected Group
  const handleRunBatchAction = async (steps: WorkflowStepConfig[]) => {
    if (!activeGroup || isProcessing) return;
    setIsProcessing(true);
    setDownloadZipUrl(null);

    const results: Record<string, { status: 'completed' | 'failed'; blob?: Blob; fileName?: string; error?: string }> = {};
    const successfulBlobs: { blob: Blob; fileName: string }[] = [];

    for (const item of activeGroup.items) {
      try {
        const wf = createWorkflow(item.file, steps, item.analysis);
        const executed = await executeWorkflow(wf);

        if (executed.status === 'completed' && executed.finalOutput) {
          results[item.id] = {
            status: 'completed',
            blob: executed.finalOutput.blob,
            fileName: executed.finalOutput.fileName
          };
          successfulBlobs.push({
            blob: executed.finalOutput.blob,
            fileName: executed.finalOutput.fileName
          });
        } else {
          results[item.id] = {
            status: 'failed',
            error: executed.error || 'Processing failed'
          };
        }
      } catch (err: any) {
        results[item.id] = {
          status: 'failed',
          error: err?.message || 'Error occurred'
        };
      }

      setProcessedResults({ ...results });
    }

    // Generate ZIP if multiple successful
    if (successfulBlobs.length > 0) {
      try {
        const { zipUrl } = await createBatchZip(successfulBlobs, `anyfilex_${activeGroup.groupKey}_batch.zip`);
        setDownloadZipUrl(zipUrl);
      } catch (err) {
        console.warn('Failed to package batch zip:', err);
      }
    }

    setIsProcessing(false);
  };

  if (!activeGroup) return null;

  const totalCompleted = Object.values(processedResults).filter((r) => r.status === 'completed').length;
  const totalFailed = Object.values(processedResults).filter((r) => r.status === 'failed').length;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" /> Batch Intelligence Engine
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Batch Workflows ({analyses.length} Total Files)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Files grouped by format compatibility for unified batch processing with individual error isolation.
          </p>
        </div>

        {downloadZipUrl && (
          <a
            href={downloadZipUrl}
            download={`anyfilex_batch_output.zip`}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download {totalCompleted} Files (ZIP)
          </a>
        )}
      </div>

      {/* 2. Group Selector Tabs */}
      {groups.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {groups.map((group) => {
            const isSel = group.groupKey === activeGroup.groupKey;
            return (
              <button
                key={group.groupKey}
                type="button"
                onClick={() => setActiveGroupKey(group.groupKey)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{group.title}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isSel ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {group.items.length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Active Group Action Bar */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> Compatible Actions for {activeGroup.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an operation to execute across all {activeGroup.items.length} files in this group.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeGroup.supportedActions.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={isProcessing}
              onClick={() => handleRunBatchAction(action.steps)}
              className="p-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-left space-y-1.5 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                  {action.title}
                </span>
                <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 fill-current" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Group Files List & Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Files in Group ({activeGroup.items.length})</span>
          {isProcessing && <span className="text-blue-600 animate-pulse">Processing Batch...</span>}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {activeGroup.items.map((item) => {
            const res = processedResults[item.id];
            const isItemCompleted = res?.status === 'completed';
            const isItemFailed = res?.status === 'failed';

            return (
              <div
                key={item.id}
                className="p-4 bg-white dark:bg-slate-900 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono font-bold flex items-center justify-center shrink-0">
                    {item.analysis?.detectedExtension.slice(0, 3).toUpperCase() || 'FIL'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {item.file.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {item.analysis ? item.analysis.formattedSize : formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isItemCompleted ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Ready
                    </span>
                  ) : isItemFailed ? (
                    <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold" title={res?.error}>
                      <AlertTriangle className="w-4 h-4" /> {res?.error || 'Failed'}
                    </span>
                  ) : isProcessing ? (
                    <span className="text-slate-400">Queued</span>
                  ) : (
                    <span className="text-slate-400">Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
