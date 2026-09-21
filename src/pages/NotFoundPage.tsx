import React, { useState } from 'react';
import {
  FileQuestion,
  Search,
  ArrowLeft,
  Home,
  FileCode2,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Binary,
  Layers,
  Sparkles,
  Wrench,
  FileSearch,
  ExternalLink
} from 'lucide-react';
import { AppRoute } from '../types';
import { SEOHead } from '../components/SEOHead';
import { POPULAR_FILE_TYPES } from '../data/fileTypesData';

interface NotFoundPageProps {
  onNavigate: (route: AppRoute) => void;
  requestedPath?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate, requestedPath }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().toLowerCase().replace(/^\./, '');
    if (!clean) return;

    // Check if it's a known extension search or general search
    if (clean.length <= 6 && !clean.includes(' ')) {
      onNavigate({ view: 'extension-detail', ext: clean });
    } else {
      onNavigate({ view: 'extensions' });
    }
  };

  const quickPicks = ['HEIC', 'PDF', 'DOCX', 'DWG', 'PSD', 'ZIP', 'MP4', 'SVG', 'XLSX', 'STEP', 'WEBP', 'STL'];

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <SEOHead
        title="404 – Page Not Found"
        description="The requested page, file extension specification, or utility could not be found on AnyFileX."
        canonicalPath="/404"
        robots="noindex, nofollow"
      />

      {/* Main 404 Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8 sm:p-12 text-center relative">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Badge & Code */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldAlert className="w-3.5 h-3.5" />
            HTTP 404 &bull; Resource Missing
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-800/60 border border-blue-200/60 dark:border-slate-700/60 flex items-center justify-center shadow-inner">
                <FileQuestion className="w-12 h-12 sm:w-14 sm:h-14 text-blue-600 dark:text-blue-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-md bg-slate-900 text-white dark:bg-blue-600 text-xs font-mono font-bold tracking-tight shadow-md">
                404
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            File Specification or Page Not Found
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-2 leading-relaxed">
            The link you followed may be broken, or the requested URL does not match an active format specification.
          </p>

          {requestedPath && (
            <p className="text-xs font-mono text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 py-1.5 px-3 rounded-lg inline-block mb-8 border border-slate-200 dark:border-slate-700/60">
              Requested path: <span className="text-rose-500 font-semibold">{requestedPath}</span>
            </p>
          )}

          {/* Quick Search Input */}
          <div className="max-w-lg mx-auto mb-10 mt-4">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search file extension (e.g. .heic, .dwg, .psd)..."
                className="w-full pl-11 pr-28 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Find Format</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3.5 mb-10">
            <button
              onClick={() => onNavigate({ view: 'home' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-500/20"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
            <button
              onClick={() => onNavigate({ view: 'extensions' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors border border-slate-200 dark:border-slate-700"
            >
              <FileCode2 className="w-4 h-4 text-blue-500" />
              Browse 250+ Extensions
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  window.history.back();
                } else {
                  onNavigate({ view: 'home' });
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          {/* Popular Extension Badges */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Looking for a common file extension?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickPicks.map((ext) => (
                <button
                  key={ext}
                  onClick={() => onNavigate({ view: 'extension-detail', ext: ext.toLowerCase() })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
                >
                  .{ext}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Utilities Grid */}
      <div className="mt-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 text-center">
          Or try our free browser-based file utilities:
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate({ view: 'file-identifier' })}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-105 transition-transform">
              <FileSearch className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              File Identifier
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Detect unknown file types by inspecting real magic bytes signatures.
            </p>
          </div>

          <div
            onClick={() => onNavigate({ view: 'converters' })}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Format Converters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Convert images, documents, audio, CAD, and vector formats online.
            </p>
          </div>

          <div
            onClick={() => onNavigate({ view: 'metadata-viewer' })}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-3 group-hover:scale-105 transition-transform">
              <Binary className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Metadata & EXIF Viewer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Extract embedded headers, camera metadata, and hidden tags.
            </p>
          </div>

          <div
            onClick={() => onNavigate({ view: 'repair' })}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              File Repair Guides
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Troubleshoot corrupted headers, unreadable archives, and damaged files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
