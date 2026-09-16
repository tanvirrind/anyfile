import React, { useState } from 'react';
import {
  GitCompare,
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  FileCode,
  Image as ImageIcon,
  FileText,
  Archive,
  Film,
  Music,
  Box,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AppRoute } from '../types';
import { CURATED_COMPARISONS } from '../lib/database/knowledgeGraph';
import { isValidComparisonPair } from '../lib/guides/comparisonGuideEngine';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';

interface CompareHubPageProps {
  onNavigate: (route: AppRoute) => void;
  categoryFilter?: string;
}

export const CompareHubPage: React.FC<CompareHubPageProps> = ({ onNavigate, categoryFilter }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || 'All');

  const [customExt1, setCustomExt1] = useState('heic');
  const [customExt2, setCustomExt2] = useState('jpg');
  const [customError, setCustomError] = useState<string | null>(null);

  const categories = [
    'All',
    'Images',
    'Documents',
    'Archives',
    'Audio & Video',
    'CAD & 3D',
  ];

  const filteredComparisons = CURATED_COMPARISONS.filter((comp) => {
    const matchesSearch =
      comp.title.toLowerCase().includes(search.toLowerCase()) ||
      comp.highlight.toLowerCase().includes(search.toLowerCase()) ||
      comp.ext1.toLowerCase().includes(search.toLowerCase()) ||
      comp.ext2.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || comp.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCustomCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customExt1 || !customExt2) return;
    const clean1 = customExt1.trim().replace(/^\./, '').toLowerCase();
    const clean2 = customExt2.trim().replace(/^\./, '').toLowerCase();

    const check = isValidComparisonPair(clean1, clean2);
    if (!check.isValid) {
      setCustomError(check.reason || 'Invalid comparison pair.');
      return;
    }
    setCustomError(null);
    onNavigate({ view: 'comparison-detail', slug: `${clean1}-vs-${clean2}` });
  };

  // High priority showdowns
  const featuredShowdowns = [
    { slug: 'heic-vs-jpg', ext1: 'HEIC', ext2: 'JPG', title: 'HEIC vs JPG', highlight: 'High efficiency 16-bit mobile photo capture vs 100% universal legacy standard.' },
    { slug: 'webp-vs-png', ext1: 'WEBP', ext2: 'PNG', title: 'WEBP vs PNG', highlight: '26% smaller lossless graphics and transparent cutouts for modern web speed.' },
    { slug: 'avif-vs-webp', ext1: 'AVIF', ext2: 'WEBP', title: 'AVIF vs WEBP', highlight: 'State-of-the-art AV1 image compression with 10/12-bit HDR vs Google VP8 standard.' },
    { slug: 'pdf-vs-docx', ext1: 'PDF', ext2: 'DOCX', title: 'PDF vs DOCX', highlight: 'Fixed layout digital paper and signing vs editable Word OpenXML documents.' },
    { slug: 'zip-vs-7z', ext1: 'ZIP', ext2: '7Z', title: 'ZIP vs 7Z', highlight: 'OS-native universal unzipping vs LZMA2 maximum archive compression ratios.' },
    { slug: 'csv-vs-xlsx', ext1: 'CSV', ext2: 'XLSX', title: 'CSV vs XLSX', highlight: 'Pure comma-delimited data pipeline streams vs rich styled workbooks with formulas.' },
  ];

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="Compare File Formats – Side-by-Side Compression, Quality & Specs Benchmark"
        description="Side-by-side technical comparisons between digital file formats. Compare compression ratios, visual quality, device compatibility, transparency, and converter pathways."
        canonicalPath="/compare"
      />

      <Breadcrumb
        items={[
          { label: 'Compare File Formats' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Card with Custom Comparison Builder */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-12 shadow-xl space-y-8 relative overflow-hidden">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold text-blue-300">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Format Head-to-Head Authority</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Compare File Formats Side by Side
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Discover verifiable technical differences in compression algorithms, image/audio fidelity, storage footprints, transparency, and cross-platform compatibility.
          </p>
        </div>

        {/* Interactive Comparison Builder */}
        <form
          onSubmit={handleCustomCompare}
          className="bg-white/10 dark:bg-slate-950/60 p-4 sm:p-6 rounded-2xl border border-white/20 backdrop-blur-md max-w-3xl space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Interactive Comparison Builder
            </span>
            <span className="text-xs text-slate-400">
              Enter any two compatible formats
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full relative">
              <input
                type="text"
                value={customExt1}
                onChange={(e) => {
                  setCustomExt1(e.target.value);
                  setCustomError(null);
                }}
                placeholder="Format 1 (e.g. HEIC)"
                className="w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-slate-900 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono font-bold text-sm uppercase"
              />
            </div>

            <span className="font-extrabold text-sm text-blue-300 px-2 shrink-0">VS</span>

            <div className="flex-1 w-full relative">
              <input
                type="text"
                value={customExt2}
                onChange={(e) => {
                  setCustomExt2(e.target.value);
                  setCustomError(null);
                }}
                placeholder="Format 2 (e.g. JPG)"
                className="w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-slate-900 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono font-bold text-sm uppercase"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Compare</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {customError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{customError}</span>
            </div>
          )}
        </form>
      </div>

      {/* Featured Showdowns */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            High-Priority Technical Showdowns
          </h2>
          <p className="text-sm text-slate-500">
            The most frequently evaluated format decisions across photography, web development, documents, and archiving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredShowdowns.map((showdown) => (
            <div
              key={showdown.slug}
              onClick={() => onNavigate({ view: 'comparison-detail', slug: showdown.slug })}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400">
                    .{showdown.ext1}
                  </span>
                  <span className="font-extrabold text-xs text-slate-400">VS</span>
                  <span className="text-2xl font-mono font-black text-indigo-600 dark:text-indigo-400">
                    .{showdown.ext2}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {showdown.title}: Comprehensive Benchmark
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {showdown.highlight}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Filter Pills & Search */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search comparison guides..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Curated Comparisons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComparisons.map((comp) => (
            <div
              key={comp.slug}
              onClick={() => onNavigate({ view: 'comparison-detail', slug: comp.slug })}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group space-y-4"
            >
              <div className="flex items-center justify-between">
                <Badge variant="blue">{comp.category}</Badge>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                  <span>View comparison</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400">
                  .{comp.ext1}
                </span>
                <span className="font-extrabold text-xs text-slate-400">VS</span>
                <span className="text-2xl font-mono font-black text-indigo-600 dark:text-indigo-400">
                  .{comp.ext2}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {comp.title}: Differences, Quality & Size
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {comp.highlight}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
