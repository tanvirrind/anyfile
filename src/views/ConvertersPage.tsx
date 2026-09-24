'use client';

import React, { useState } from 'react';
import {
  RefreshCw,
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Cpu,
  Layers
} from 'lucide-react';
import { AppRoute } from '../types';
import { getAllConverterPairs, POPULAR_CONVERTER_PAIRS, FORMATS_REGISTRY } from '../lib/converter/registry';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { FAQAccordion } from '../components/FAQAccordion';
import { ConverterDetailPage } from './ConverterDetailPage';
import { ConversionHistoryWidget } from '../components/converter/ConversionHistoryWidget';
import { SEOHead } from '../components/SEOHead';

export interface ConvertersPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedConverterId?: string;
}

export const ConvertersPage: React.FC<ConvertersPageProps> = ({
  onNavigate,
  selectedConverterId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Custom Pair Generator State
  const [customFrom, setCustomFrom] = useState('heic');
  const [customTo, setCustomTo] = useState('jpg');

  // If a specific converter ID is passed in route e.g. /converter/heic-to-jpg
  if (selectedConverterId) {
    return <ConverterDetailPage onNavigate={onNavigate} pairSlug={selectedConverterId} />;
  }

  const allPairs = getAllConverterPairs();

  const categories = ['All', 'Image', 'Document', 'Vector', 'Audio', 'Video', 'Archive'];

  const filteredPairs = allPairs.filter((pair) => {
    const matchesSearch =
      pair.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.fromExt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.toExt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || pair.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const availableFormatKeys = Object.keys(FORMATS_REGISTRY);

  const handleLaunchCustomPair = () => {
    const slug = `${customFrom.toLowerCase()}-to-${customTo.toLowerCase()}`;
    onNavigate({ view: 'converter-detail', id: slug });
  };

  const directoryFaqs = [
    {
      question: 'How do AnyFileX online file converters work?',
      answer: 'Our converters leverage client-side HTML5 Canvas, WebAssembly, and modern Web APIs to decode input file byte streams and re-encode them into target formats directly inside your browser RAM. Your original files are never uploaded to any remote server.'
    },
    {
      question: 'Which file formats are supported for conversion?',
      answer: 'AnyFileX supports standard image formats (HEIC, JPG, PNG, WEBP, SVG, GIF, BMP, TIFF, AVIF), documents (PDF, DOCX, TXT), audio (MP3, WAV), and compressed archives. You can generate any custom format conversion pair dynamically.'
    },
    {
      question: 'Is there a file size limit or file count restriction?',
      answer: 'You can convert files up to 100MB per file with unlimited daily conversions and batch queue processing for multiple files at once.'
    }
  ];

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      <SEOHead
        title={
          selectedCategory !== 'All'
            ? `${selectedCategory} Online File Converters – Local Browser Tools`
            : 'Online File Converters – Instant Browser Conversion'
        }
        description="Convert files instantly in your browser with zero server uploads. High-speed local conversions for images, documents, archives, audio, and video."
        canonicalPath="/converters"
      />
      <Breadcrumb items={[{ label: 'Online File Converters Directory' }]} onNavigate={onNavigate} />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Universal Client-Side Converter Architecture • 9 Converter Pairs</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Universal Online File Converters
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Fast, privacy-focused vector, raster, document, audio, and archival file format converters.
          Transform files 100% locally in your browser memory without cloud queues.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-1">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Zero File Uploads
          </span>
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Cpu className="w-4 h-4" /> WebAssembly RAM Engine
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-violet-500" /> 100% Data Security
          </span>
        </div>
      </div>

      {/* Interactive Custom Converter Pair Builder Box */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Launch Any Custom Converter Pair</span>
            </h3>
            <p className="text-xs text-slate-300">
              Select any input and target format combination to launch a dedicated converter instantly.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 border border-blue-400/30 text-blue-300">
            Dynamic Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* From Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Convert From:
            </label>
            <select
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              id="custom-from-select"
            >
              {availableFormatKeys.map((ext) => (
                <option key={ext} value={ext}>
                  .{ext.toUpperCase()} — {FORMATS_REGISTRY[ext]?.name || ext}
                </option>
              ))}
            </select>
          </div>

          {/* To Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Convert To:
            </label>
            <select
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              id="custom-to-select"
            >
              {availableFormatKeys.map((ext) => (
                <option key={ext} value={ext}>
                  .{ext.toUpperCase()} — {FORMATS_REGISTRY[ext]?.name || ext}
                </option>
              ))}
            </select>
          </div>

          {/* Launch Button */}
          <div className="pt-5 sm:pt-0">
            <button
              onClick={handleLaunchCustomPair}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="launch-custom-converter-btn"
            >
              <span>Launch .{customFrom.toUpperCase()} → .{customTo.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Directory Search & Filter Controls */}
      <div className="space-y-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search converters (e.g. HEIC, PNG to JPG, PDF)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              id="converters-search-input"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-900 dark:text-white font-bold">{filteredPairs.length}</span> featured converters
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Converter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPairs.map((pair) => (
          <div
            key={pair.id}
            onClick={() => onNavigate({ view: 'converter-detail', id: pair.id })}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-5"
            id={`converter-pair-card-${pair.id}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono font-extrabold text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-900">
                  <span>.{pair.fromExt.toUpperCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                  <span>.{pair.toExt.toUpperCase()}</span>
                </div>
                {pair.badge && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {pair.badge}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {pair.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {pair.description}
                </p>
              </div>

              {pair.features && pair.features.length > 0 && (
                <div className="space-y-1 pt-1">
                  {pair.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Open Converter</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Conversion History Widget */}
      <ConversionHistoryWidget />

      {/* Directory FAQs */}
      <div className="space-y-4 max-w-4xl mx-auto pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
          Converter Architecture FAQ
        </h2>
        <FAQAccordion faqs={directoryFaqs} />
      </div>
    </div>
  );
};
