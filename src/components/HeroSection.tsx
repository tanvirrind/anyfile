'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Upload, ArrowRight, CheckCircle2, Zap, ShieldCheck, FileCode, AppWindow, RefreshCw, Wrench, BookOpen, Layers } from 'lucide-react';
import { searchEngine, SearchRecord } from '../lib/search/searchEngine';
import { AppRoute } from '../types';

interface HeroSectionProps {
  onSearchSubmit: (query: string) => void;
  onSelectExtension: (ext: string) => void;
  onDropFile: (file: File) => void;
  onNavigate?: (route: AppRoute) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchSubmit,
  onSelectExtension,
  onDropFile,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const POPULAR_CHIPS = ['HEIC', 'WEBP', 'PSD', 'DWG', 'STEP', 'JSON', 'DOCX', 'ZIP', 'PDF', 'AutoCAD', 'Photoshop'];

  const searchResults = searchQuery.trim()
    ? searchEngine.search(searchQuery, { limit: 8 }).allSorted
    : [];

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
      const selected = searchResults[selectedIndex];
      if (onNavigate) {
        onNavigate(selected.route);
        setSearchQuery('');
        return;
      }
    }

    if (searchResults.length > 0) {
      const topResult = searchResults[0];
      if (onNavigate) {
        onNavigate(topResult.route);
        setSearchQuery('');
        return;
      }
    }

    onSearchSubmit(searchQuery.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    }
  };

  const handleSelectResult = (rec: SearchRecord) => {
    setSearchQuery('');
    if (onNavigate) {
      onNavigate(rec.route);
    } else if (rec.extension) {
      onSelectExtension(rec.extension);
    } else {
      onSearchSubmit(rec.title);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDropFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onDropFile(e.target.files[0]);
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
    <section className="py-12 md:py-16 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* NEW Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 border border-blue-100 dark:border-blue-900/60">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>NEW: Batch convert DWG to PDF</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 font-heading">
          Open Any File in Seconds <span className="text-blue-600 dark:text-blue-400">with AnyFileX</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed">
          Find out what any file is, how to open it, what software you need, how to convert it, and how to fix common errors.
        </p>

        {/* Search Box */}
        <div className="relative w-full max-w-2xl mx-auto">
          <form onSubmit={handleFormSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search '.heic', '.dwg', 'Photoshop', 'HEIC to JPG', 'Repair ZIP'..."
              className="w-full h-16 pl-6 pr-32 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all text-base sm:text-lg text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
              id="hero-search-input"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold transition-colors shadow-lg shadow-blue-200 dark:shadow-none cursor-pointer flex items-center justify-center text-sm sm:text-base gap-2"
              id="hero-search-submit-btn"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Search Dropdown matches from Unified Search Engine */}
          {searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 text-left divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-semibold sticky top-0 z-10 backdrop-blur-md">
                <span>Quick Search Matches ({searchResults.length})</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Close search popup"
                  aria-label="Close search dropdown"
                  id="hero-dropdown-close-btn"
                >
                  <span className="text-[11px]">Close</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {searchResults.length > 0 ? (
                searchResults.map((rec, idx) => {
                  const badge = getTypeBadge(rec.type);
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => handleSelectResult(rec)}
                      className={`p-4 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {rec.extension ? (
                          <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shrink-0 uppercase border border-slate-200 dark:border-slate-700">
                            .{rec.extension}
                          </span>
                        ) : (
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase shrink-0 ${badge.bg}`}>
                            {badge.label}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
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
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery('');
                              if (onNavigate) onNavigate(qa.route);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            {qa.label}
                          </button>
                        ))}
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 ml-1 shrink-0" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-sm text-slate-500">
                  <p className="font-medium">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try searching for an extension like .heic, software like AutoCAD, or a tool like Metadata Viewer.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="text-xs text-slate-400 font-medium mr-1">POPULAR SEARCHES:</span>
          {POPULAR_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setSearchQuery(chip);
                const matches = searchEngine.search(chip).allSorted;
                if (matches.length > 0 && onNavigate) {
                  onNavigate(matches[0].route);
                } else {
                  onSelectExtension(chip);
                }
              }}
              className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400 cursor-pointer transition-colors shadow-2xs"
              id={`popular-chip-${chip.toLowerCase()}`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Drag & Drop File Identifier Box */}
        <div className="mt-10 w-full max-w-2xl">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center bg-white dark:bg-slate-900/80 shadow-sm ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-200 dark:border-slate-800 hover:border-blue-300'
            }`}
            id="hero-dropzone-box"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
              id="hero-file-input"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Drag & drop any file to inspect format signature
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Safe & Client-Side: Header bytes analyzed in browser memory. Zero files saved or uploaded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
