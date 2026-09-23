import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Sparkles, ArrowRight, FileCode, CheckCircle2 } from 'lucide-react';
import { getAllFileTypeInfos } from '../lib/database/extensionEngine';
import { AppRoute, CategoryType, FileTypeInfo } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Pagination } from '../components/Pagination';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { SEOHead } from '../components/SEOHead';

interface ExtensionsPageProps {
  onNavigate: (route: AppRoute) => void;
  initialCategory?: string;
  initialLetter?: string;
  initialSearch?: string;
}

export const ExtensionsPage: React.FC<ExtensionsPageProps> = ({ onNavigate, initialCategory, initialLetter, initialSearch }) => {
  const [search, setSearch] = useState(initialSearch || '');
  const [category, setCategory] = useState<string>(initialCategory || 'All');
  const [letter, setLetter] = useState<string>(initialLetter || 'All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Honor ?q= from the URL (the declared SearchAction target) and re-sync on navigation.
  useEffect(() => {
    setSearch(initialSearch || '');
    setCurrentPage(1);
  }, [initialSearch]);

  const alphabet = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const categories = [
    'All',
    'Images',
    'CAD & 3D',
    'Documents',
    'Archives',
    'Audio & Video',
    'Code & Data',
    'Email & Comm',
    'System & Executables'
  ];

  const allExtensions = useMemo(() => getAllFileTypeInfos(), []);

  const filteredExtensions = useMemo(() => {
    return allExtensions.filter((item) => {
      // Search
      const matchesSearch =
        !search ||
        item.extension.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      // Category
      const matchesCategory = category === 'All' || item.category === category;

      // Letter
      const firstChar = item.extension.charAt(0).toUpperCase();
      let matchesLetter = true;
      if (letter !== 'All') {
        if (letter === '#') {
          matchesLetter = !isNaN(parseInt(firstChar));
        } else {
          matchesLetter = firstChar === letter;
        }
      }

      return matchesSearch && matchesCategory && matchesLetter;
    });
  }, [allExtensions, search, category, letter]);

  const totalPages = Math.ceil(filteredExtensions.length / itemsPerPage);
  const paginatedItems = filteredExtensions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setLetter('All');
    setCurrentPage(1);
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <SEOHead
        title={
          category !== 'All'
            ? `${category} File Extensions Directory`
            : letter !== 'All'
            ? `File Extensions Starting with '${letter}'`
            : 'File Extensions Directory & Technical Specifications'
        }
        description={
          category !== 'All'
            ? `Browse all ${category.toLowerCase()} file formats. Check compatible software, MIME types, binary signatures, and conversion options.`
            : 'Explore hundreds of digital file extensions alphabetically or by category. Find compatible software, MIME types, specifications, and repair guides.'
        }
        canonicalPath={
          category !== 'All'
            ? `/file-extensions?category=${encodeURIComponent(category)}`
            : letter !== 'All'
            ? `/file-extensions?letter=${encodeURIComponent(letter)}`
            : '/file-extensions'
        }
      />
      <Breadcrumb items={[{ label: 'Extensions Directory' }]} onNavigate={onNavigate} />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="blue" size="md">
          Universal Extension Directory
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Browse Digital File Extensions
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Search over 250+ file extensions, magic bytes, software compatibility, opening instructions, and conversion tools.
        </p>
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
        {/* Search bar */}
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search extensions by name or keyword (e.g. .heic, photoshop, cad)..."
            className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm sm:text-base text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
            id="extensions-search-input"
          />
        </div>

        {/* Alphabet Filter Bar */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alphabet Filter</div>
          <div className="flex flex-wrap gap-1 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => {
                setLetter('All');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                letter === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
              id="alphabet-all-btn"
            >
              ALL
            </button>
            {alphabet.map((char) => (
              <button
                key={char}
                onClick={() => {
                  setLetter(char);
                  setCurrentPage(1);
                }}
                className={`w-7 h-7 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                  letter === char
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                id={`alphabet-btn-${char}`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category Filter</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  category === cat
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                id={`category-filter-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Extension Cards Grid */}
      {filteredExtensions.length === 0 ? (
        <EmptyState onReset={handleReset} />
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Showing {filteredExtensions.length} file extensions</span>
            <span>Page {currentPage} of {totalPages || 1}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <div
                key={item.extension}
                onClick={() => onNavigate({ view: 'extension-detail', ext: item.extension })}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
                id={`extension-card-${item.extension.toLowerCase()}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-xl">
                      .{item.extension}
                    </span>
                    <Badge variant={item.dangerRating === 'Low Risk' ? 'emerald' : 'amber'}>
                      {item.dangerRating}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{item.mimeType}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Open & Convert</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => setCurrentPage(p)} />
        </>
      )}
    </div>
  );
};
