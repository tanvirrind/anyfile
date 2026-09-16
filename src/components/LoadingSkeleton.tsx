import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4 w-full">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3"></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>
    </div>
  );
};
