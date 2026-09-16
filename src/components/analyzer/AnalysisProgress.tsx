import React from 'react';
import { Cpu, ShieldCheck, Binary, RefreshCw } from 'lucide-react';

interface AnalysisProgressProps {
  fileName: string;
  stepText: string;
  percent: number;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  fileName,
  stepText,
  percent,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center animate-spin">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            Analyzing {fileName}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Client-Side Binary Inspection Engine
          </p>
        </div>
        <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
          {percent}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 transition-all duration-200 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Current Step */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-blue-500" /> {stepText}
        </span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" /> Local RAM Only
        </span>
      </div>
    </div>
  );
};
