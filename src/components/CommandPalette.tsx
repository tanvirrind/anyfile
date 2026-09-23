'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  FileCode,
  AppWindow,
  RefreshCw,
  Wrench,
  BookOpen,
  Layers,
  ArrowRight,
  CornerDownLeft,
  Sparkles,
  Clock,
  Zap,
  ShieldOff,
  Hash,
  CheckCircle2,
  Code2,
  Cpu,
  FileSearch,
  FileText
} from 'lucide-react';
import { searchEngine, SearchRecord } from '../lib/search/searchEngine';
import { CATEGORIES_LIST } from '../data/categoriesData';
import { AppRoute } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: AppRoute) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'extensions' | 'tools' | 'converters' | 'software' | 'repair' | 'guides'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(['HEIC', 'DWG', 'PSD', 'PDF', 'ZIP']);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveTab('all');
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }
      }
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResult = searchEngine.search(query, { type: activeTab });
  const allResults = searchResult.allSorted;

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (!allResults.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allResults.length) {
        handleSelect(allResults[selectedIndex].route, allResults[selectedIndex].title);
      } else if (allResults.length > 0) {
        handleSelect(allResults[0].route, allResults[0].title);
      }
    }
  };

  const handleSelect = (route: AppRoute, title?: string) => {
    if (title && !recentSearches.includes(title)) {
      setRecentSearches((prev) => [title, ...prev.slice(0, 4)]);
    }
    onNavigate(route);
    onClose();
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-2.5">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownList}
            placeholder="Search extensions, tools, converters, software, repair... (Ctrl+K)"
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-base focus:outline-hidden font-medium"
            id="command-palette-input"
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
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800/80 rounded-md border border-slate-200 dark:border-slate-700 shrink-0">
            ESC
          </kbd>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Close Search (ESC)"
            aria-label="Close search"
            id="command-palette-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Category Tabs */}
        {query.trim() && (
          <div className="flex items-center gap-1 px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: `All Results (${searchResult.totalCount})` },
              { id: 'extensions', label: `Extensions (${searchResult.extensions.length})` },
              { id: 'tools', label: `Tools (${searchResult.tools.length})` },
              { id: 'converters', label: `Converters (${searchResult.converters.length})` },
              { id: 'software', label: `Software (${searchResult.software.length})` },
              { id: 'repair', label: `Repair (${searchResult.repair.length})` },
              { id: 'guides', label: `Guides (${searchResult.guides.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {!query.trim() ? (
            <div className="space-y-4 py-2">
              {/* Quick AI Assistant Entry Banner */}
              <button
                onClick={() => handleSelect({ view: 'assistant' }, 'AI Assistant')}
                className="w-full p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 text-left transition-all hover:border-blue-400 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-950 dark:text-blue-100 group-hover:text-blue-600 flex items-center gap-2">
                      <span>Ask AnyFileX AI Assistant</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md">
                        AI Powered
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Instant answers on "What opens DWG?", "Convert HEIC", "Is this file safe?"
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-3 mt-1.5">
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              <div>
                <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Popular Categories
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-3 mt-1.5">
                  {CATEGORIES_LIST.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelect({ view: 'category-detail', id: cat.id }, cat.name)}
                      className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-slate-50/50 dark:bg-slate-800/40 text-left transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                          {cat.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{cat.popularExtensions.slice(0, 3).join(', ')}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Ask AI Assistant Prompt bar for active query */}
              <button
                onClick={() => handleSelect({ view: 'assistant' }, query)}
                className="w-full p-2.5 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-left transition-all flex items-center justify-between cursor-pointer group mb-2"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-blue-950 dark:text-blue-100">
                    Ask AI Assistant: <span className="underline italic">"{query}"</span>
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {allResults.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400 space-y-2">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    No matching records found for "{query}"
                  </p>
                  <p className="text-xs">
                    Try typing an extension like .heic, software like AutoCAD, or click "Ask AI Assistant" above!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allResults.map((rec, idx) => {
                    const badge = getTypeBadge(rec.type);
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={rec.id}
                        onClick={() => handleSelect(rec.route, rec.title)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-1 ring-blue-500/50'
                            : 'bg-white dark:bg-slate-900/90 border-slate-100 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
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
                                <span className="text-xs text-slate-400 font-medium">
                                  • {rec.category}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {rec.description}
                            </p>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          {rec.quickActions && rec.quickActions.slice(0, 2).map((qa, qidx) => (
                            <button
                              key={qidx}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(qa.route, rec.title);
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
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Search 250+ extensions, software, tools, converters & AI Assistant</span>
          <div className="flex items-center gap-3">
            <span>
              Press <kbd className="px-1.5 py-0.5 font-mono bg-white dark:bg-slate-800 border rounded">↵</kbd> to select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 font-mono bg-white dark:bg-slate-800 border rounded">ESC</kbd> to exit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
