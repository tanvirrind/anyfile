import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, FileSearch, BookOpen, Sparkles, CornerDownLeft } from 'lucide-react';
import { FileTypeInfo, GuideInfo, AppRoute } from '../types';
import { searchEngine, SearchRecord } from '../lib/search/searchEngine';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExtension: (ext: string) => void;
  onSelectGuide: (guide: GuideInfo) => void;
  onNavigateTools: () => void;
  onNavigate?: (route: AppRoute) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectExtension,
  onSelectGuide,
  onNavigateTools,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Handle Cmd+K global shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResult = searchEngine.search(query);
  const results = searchResult.allSorted.slice(0, 12);

  const handleSelectRecord = (rec: SearchRecord) => {
    onClose();
    if (onNavigate) {
      onNavigate(rec.route);
    } else if (rec.type === 'extension' && rec.extension) {
      onSelectExtension(rec.extension);
    } else if (rec.type === 'tool') {
      onNavigateTools();
    }
  };

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelectRecord(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelectRecord(results[0]);
      }
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'extension':
        return { label: 'Extension', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' };
      case 'software':
        return { label: 'Software', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' };
      case 'converter':
        return { label: 'Converter', bg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300' };
      case 'repair':
        return { label: 'Repair', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300' };
      case 'tool':
        return { label: 'Tool', bg: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300' };
      case 'guide':
      case 'blog':
        return { label: 'Guide', bg: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300' };
      default:
        return { label: type, bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass-card bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
          <Search className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownList}
            placeholder="Search .heic, .dwg, Photoshop, HEIC to JPG, or Repair ZIP..."
            className="w-full bg-transparent text-slate-900 dark:text-white text-base focus:outline-hidden placeholder:text-slate-600 dark:placeholder:text-slate-400 font-medium"
            id="global-search-modal-input"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Clear input text"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0 flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Close search modal"
            title="Close Search (ESC)"
            id="global-search-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {results.length > 0 ? (
            results.map((rec, idx) => {
              const badge = getTypeBadge(rec.type);
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={rec.id}
                  onClick={() => handleSelectRecord(rec)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-1 ring-blue-500/50'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {rec.extension ? (
                      <span className="w-10 h-7 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs flex items-center justify-center rounded-lg shrink-0 uppercase border border-blue-200 dark:border-blue-800">
                        .{rec.extension}
                      </span>
                    ) : (
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase shrink-0 ${badge.bg}`}>
                        {badge.label}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {rec.title}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {rec.category && (
                          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                            • {rec.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {rec.description}
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Pills */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {rec.quickActions && rec.quickActions.slice(0, 2).map((qa, qidx) => (
                      <button
                        key={qidx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          if (onNavigate) onNavigate(qa.route);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        {qa.label}
                      </button>
                    ))}
                    <CornerDownLeft className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400 space-y-2">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                No matching records found for "{query}"
              </p>
              <p className="text-xs">
                Try searching for an extension like .heic, software like AutoCAD, or a tool name.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
          <span>Search AnyFileX global database</span>
          <div className="flex items-center gap-3">
            <span>Press <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">↵</kbd> to select</span>
            <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">ESC to close</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
