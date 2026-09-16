import React, { useState, useEffect } from 'react';
import { History, Download, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { ConversionHistoryItem } from '../../lib/converter/types';
import { getConversionHistory, clearConversionHistory } from '../../lib/converter/history';

export const ConversionHistoryWidget: React.FC = () => {
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getConversionHistory());
  }, []);

  const handleClear = () => {
    clearConversionHistory();
    setHistory([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Conversion History</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-500">
            {history.length}
          </span>
        </div>

        <button
          onClick={handleClear}
          className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="font-bold text-slate-900 dark:text-white truncate">{item.fileName}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>.{item.fromExt.toUpperCase()}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-blue-600 dark:text-blue-400 font-bold">.{item.toExt.toUpperCase()}</span>
                  <span>•</span>
                  <span>{formatSize(item.convertedSize)}</span>
                </div>
              </div>
            </div>

            {item.resultBlobUrl && (
              <a
                href={item.resultBlobUrl}
                download={item.fileName}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
