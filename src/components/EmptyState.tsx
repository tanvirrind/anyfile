import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'Try adjusting your search terms or filter selection.',
  onReset,
  resetText = 'Reset Filters',
}) => {
  return (
    <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto shadow-2xs">
      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
          id="empty-state-reset-btn"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{resetText}</span>
        </button>
      )}
    </div>
  );
};
