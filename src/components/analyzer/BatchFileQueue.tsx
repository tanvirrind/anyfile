import React from 'react';
import { FileAnalysis } from '../../lib/analyzer/types';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';

interface BatchFileQueueProps {
  analyses: FileAnalysis[];
  activeId: string;
  onSelect: (id: string) => void;
  onAddMoreClick: () => void;
}

export const BatchFileQueue: React.FC<BatchFileQueueProps> = ({
  analyses,
  activeId,
  onSelect,
  onAddMoreClick,
}) => {
  if (analyses.length <= 1) {
    return null;
  }

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 mb-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 px-2 pb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800/60">
        <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
          <Layers className="w-3.5 h-3.5 text-blue-500" /> Multi-File Session ({analyses.length} files analyzed)
        </span>
        <button
          type="button"
          onClick={onAddMoreClick}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Analyze More
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-thin">
        {analyses.map((item) => {
          const isActive = item.id === activeId;
          const isMismatch = item.extensionComparison.status === 'mismatch';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all shrink-0 select-none ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-2 ring-blue-500/80 font-bold'
                  : 'bg-slate-200/60 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-mono font-bold">
                {item.detectedExtension.slice(0, 3)}
              </div>

              <div className="max-w-[150px] min-w-0">
                <p className="text-xs truncate">{item.fileName}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>{item.formattedSize}</span>
                  <span>•</span>
                  <span>.{item.detectedExtension.toLowerCase()}</span>
                </div>
              </div>

              {isMismatch ? (
                <span title="Extension mismatch" className="text-amber-500">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span title="Format aligned" className="text-emerald-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
