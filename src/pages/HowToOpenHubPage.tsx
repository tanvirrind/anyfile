import React, { useState } from 'react';
import {
  Eye,
  Search,
  Monitor,
  Apple,
  Smartphone,
  Terminal,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCode,
  ShieldAlert,
  Layers,
  FolderOpen,
  Wrench,
  RefreshCw,
  Compass,
  FileCheck,
} from 'lucide-react';
import { AppRoute, FileTypeInfo } from '../types';
import { getAllFileTypeInfos } from '../lib/database/extensionEngine';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { HIGH_VALUE_OPEN_FORMATS } from '../lib/guides/howToOpenEngine';

interface HowToOpenHubPageProps {
  onNavigate: (route: AppRoute) => void;
  categoryFilter?: string;
}

export const HowToOpenHubPage: React.FC<HowToOpenHubPageProps> = ({ onNavigate, categoryFilter }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || 'All');

  const allExtensions = getAllFileTypeInfos();

  const categories = [
    'All',
    'Images',
    'Documents',
    'Archives',
    'Audio & Video',
    'CAD & 3D',
    'Code & Data',
    'System & Executables',
  ];

  const filteredExtensions = allExtensions.filter((e) => {
    const matchesSearch =
      e.extension.toLowerCase().includes(search.toLowerCase()) ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      e.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="How to Open Any File – Complete Directory & Guides for Windows, Mac & Mobile"
        description="Search and browse step-by-step guides on how to open, view, and troubleshoot 50,000+ file formats across Windows 11/10, macOS, Linux, iPhone, and Android."
        canonicalPath="/how-to-open"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'How to Open Files', path: '/how-to-open' },
        ]}
      />

      <Breadcrumb
        items={[
          { label: 'How to Open Files' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-12 shadow-xl space-y-6 relative overflow-hidden">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold text-blue-300">
            <Eye className="w-3.5 h-3.5" />
            <span>Universal File Opening Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            How to Open Any File Extension
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Stuck with an unrecognized or unreadable file? Find verified step-by-step instructions for Windows 11/10, macOS, Linux, iPhone, and Android, backed by real software compatibility data and free in-browser tools.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by extension or format (e.g. HEIC, DMG, AVIF, DAT, PSD, RAR)..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 dark:bg-slate-950/60 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md text-sm sm:text-base font-medium shadow-inner"
          />
        </div>
      </div>

      {/* High-Demand Formats Quick Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>High-Search Priority Opening Guides</span>
            </h2>
            <p className="text-xs text-slate-500">
              The most commonly encountered difficult file types across modern operating systems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {HIGH_VALUE_OPEN_FORMATS.slice(0, 24).map((ext) => (
            <button
              key={ext}
              onClick={() => onNavigate({ view: 'how-to-open', ext: ext.toLowerCase() })}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all text-center group cursor-pointer"
            >
              <span className="text-base font-mono font-black text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform block">
                .{ext.toUpperCase()}
              </span>
              <span className="text-[11px] text-slate-500 truncate block mt-0.5 font-medium">
                How to Open
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Troubleshooting Triage Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs">
            <Wrench className="w-3.5 h-3.5" />
            <span>File Intelligence Diagnostic Suite</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Not Sure Why Your File Won't Open?
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Use the AnyFileX Magic Byte Detector to verify if a file has been misnamed or corrupted, or run it through the File Forensics Inspector to check cryptographic hashes and embedded streams.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => onNavigate({ view: 'magic-byte-detector' })}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer shadow-sm"
          >
            Detect Magic Bytes
          </button>
          <button
            onClick={() => onNavigate({ view: 'file-analyzer' })}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs sm:text-sm text-slate-200 transition-colors cursor-pointer border border-slate-700"
          >
            Inspect File Forensics
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Browse Guides by Category
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredExtensions.length} format guides
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Extensions Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredExtensions.map((e) => (
            <div
              key={e.extension}
              onClick={() => onNavigate({ view: 'how-to-open', ext: e.extension.toLowerCase() })}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-lg text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    .{e.extension.toUpperCase()}
                  </span>
                  <Badge variant="slate">{e.category}</Badge>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 transition-colors">
                  {e.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {e.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                <span>View Opening Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
