import React, { useState, useEffect } from 'react';
import { WorkflowHistoryRecord } from '../../lib/workflow/types';
import {
  getWorkflowHistory,
  clearWorkflowHistory,
  deleteWorkflowRecord
} from '../../lib/workflow/workflowHistory';
import { formatBytes } from '../../lib/tools/imageEngine';
import {
  Clock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface WorkflowHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowHistoryModal: React.FC<WorkflowHistoryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [history, setHistory] = useState<WorkflowHistoryRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getWorkflowHistory());
    }
  }, [isOpen]);

  const handleClearAll = () => {
    clearWorkflowHistory();
    setHistory([]);
  };

  const handleDelete = (id: string) => {
    deleteWorkflowRecord(id);
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Recent Workflow History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stored in browser local storage only • Zero server retention
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {history.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-500">No workflow history yet.</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Workflows you run on AnyFileX will appear here for easy reference and audit trails.
              </p>
            </div>
          ) : (
            history.map((rec) => {
              const savedBytes = Math.max(0, rec.originalSize - rec.finalSize);
              const savedPercent = rec.originalSize > 0 ? Math.round((savedBytes / rec.originalSize) * 100) : 0;

              return (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {rec.workflowTitle}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                        {rec.stepsCount} steps
                      </span>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 truncate">
                      {rec.fileName} • {formatBytes(rec.originalSize)} → {formatBytes(rec.finalSize)}
                      {savedPercent > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                          ({savedPercent}% saved)
                        </span>
                      )}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {new Date(rec.executedAt).toLocaleString()} ({rec.durationMs}ms)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rec.status === 'completed' ? (
                      <span className="text-emerald-500" title="Completed">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-rose-500" title="Failed">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(rec.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">{history.length} records stored</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-semibold transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
