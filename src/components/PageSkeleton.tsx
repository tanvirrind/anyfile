import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>

      {/* Hero / Header Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="h-6 w-32 bg-blue-100 dark:bg-blue-950/60 rounded-full"></div>
        <div className="h-10 w-3/4 max-w-xl bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-4 w-full max-w-2xl bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-2/3 max-w-lg bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded"></div>
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded"></div>
              <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
            </div>
            <div className="h-32 bg-slate-100 dark:bg-slate-800/40 rounded-2xl"></div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
              <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
              <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
              <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
