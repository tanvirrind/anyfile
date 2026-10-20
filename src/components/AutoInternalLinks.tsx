'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  RefreshCw,
  AppWindow,
  Wrench,
  FileCode,
  ArrowRight,
  GitCompare,
  Layers,
  BookOpen,
  HelpCircle,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  Grid
} from 'lucide-react';
import { POPULAR_FILE_TYPES } from '../data/fileTypesData';
import { SOFTWARE_LIST } from '../data/softwareData';
import { CONVERTERS_LIST } from '../data/convertersData';
import { REPAIR_GUIDES } from '../data/repairData';
import { GUIDES_LIST, BLOG_POSTS } from '../data/guidesData';
import { CATEGORIES_LIST } from '../data/categoriesData';
import { isValidComparisonSlug } from '../lib/routes/routeManifest';
import { routeToPath } from '../utils/router';
import { AppRoute, FileTypeInfo } from '../types';

interface AutoInternalLinksProps {
  currentExt: FileTypeInfo;
  onNavigate: (route: AppRoute) => void;
}

export const AutoInternalLinks: React.FC<AutoInternalLinksProps> = ({ currentExt, onNavigate }) => {
  const ext = currentExt.extension.toLowerCase();
  const extUpper = currentExt.extension.toUpperCase();
  const locale = useLocale();
  const localePrefix = locale === 'es' || locale === 'nl' ? `/${locale}` : '';
  // Real crawlable links. next/link keeps client-side SPA navigation while
  // emitting <a href> in SSR HTML, so crawlers (and Googlebot) see the
  // internal link graph that onNavigate buttons hid.
  const href = (route: AppRoute) => `${localePrefix}${routeToPath(route)}`;
  void onNavigate;
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Track recently viewed extensions in localStorage
  useEffect(() => {
    try {
      const key = 'anyfilex_recently_viewed';
      const rawStored = localStorage.getItem(key) || localStorage.getItem('openanyfile_recently_viewed');
      const stored: string[] = JSON.parse(rawStored || '[]');
      const filtered = stored.filter((x) => x.toUpperCase() !== extUpper);
      setRecentlyViewed(filtered);

      const updated = [extUpper, ...filtered].slice(0, 10);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (err) {
      // Storage unavailable fallback
    }
  }, [extUpper]);

  // 1. Related Extensions in same category
  const relatedExtensions = POPULAR_FILE_TYPES.filter(
    (f) => f.category === currentExt.category && f.extension.toLowerCase() !== ext
  ).slice(0, 8);

  // 2. Converters for this format or category. Exact from/to matches rank
  // first: without the sort, broad category matches (e.g. every "Images"
  // converter) can crowd the 6-slot cap and hide the exact converter for
  // this format (seen: psd-to-jpg and png-to-svg missing from their own
  // extension pages).
  const relevantConverters = CONVERTERS_LIST.filter(
    (c) =>
      c.fromExt.toLowerCase() === ext ||
      c.toExt.toLowerCase() === ext ||
      c.category.toLowerCase().includes(currentExt.category.toLowerCase())
  )
    .sort((a, b) => {
      const rank = (c: (typeof CONVERTERS_LIST)[number]) => {
        if (c.fromExt.toLowerCase() === ext) return 0;
        if (c.toExt.toLowerCase() === ext) return c.isInteractiveToolAvailable === true ? 1 : 2;
        return 3;
      };
      return rank(a) - rank(b);
    })
    .slice(0, 6);

  // 3. Software supporting this format or category
  const relevantSoftware = SOFTWARE_LIST.filter(
    (s) =>
      s.supportedExtensions.some((e) => e.toLowerCase() === ext) ||
      s.category.toLowerCase().includes(currentExt.category.toLowerCase())
  ).slice(0, 6);

  // 4. Related Repair Guides
  const relevantRepairGuides = REPAIR_GUIDES.filter(
    (r) =>
      r.extension.toLowerCase() === ext ||
      r.category.toLowerCase().includes(currentExt.category.toLowerCase())
  ).slice(0, 4);

  // 5. Relevant Format Comparisons — filtered against the curated slug
  // registry so synthetic pairs (e.g. exe-vs-jpg) never become dead links,
  // and deduped so a hardcoded entry can't repeat a dynamic one.
  const comparisons = [
    { slug: `${ext}-vs-jpg`, title: `.${extUpper} vs .JPG` },
    { slug: `${ext}-vs-pdf`, title: `.${extUpper} vs .PDF` },
    { slug: 'heic-vs-jpg', title: '.HEIC vs .JPG' },
    { slug: 'png-vs-webp', title: '.PNG vs .WEBP' },
    { slug: 'dwg-vs-dxf', title: '.DWG vs .DXF' },
  ]
    .filter(
      (comp, idx, arr) =>
        arr.findIndex((c) => c.slug === comp.slug) === idx && isValidComparisonSlug(comp.slug)
    )
    .slice(0, 4);

  // 6. Popular Guides
  const popularGuides = [...GUIDES_LIST, ...BLOG_POSTS].slice(0, 4);

  // 7. Category Pages
  const categoryPages = CATEGORIES_LIST;

  // 8. Related Questions
  const relatedQuestions = [
    {
      q: `What is a .${extUpper} file and what is it used for?`,
      a: `A .${extUpper} file is a ${currentExt.name} file format categorized under ${currentExt.category}. ${currentExt.description}`
    },
    {
      q: `How do I open .${extUpper} files without paid software?`,
      a: `You can view .${extUpper} files using free software such as ${currentExt.popularApps.map((a) => a.name).join(', ') || 'open source readers'}, or inspect its raw header with AnyFileX's browser-based File Identifier.`
    },
    {
      q: `Can a .${extUpper} file contain viruses or malware?`,
      a: `This format has a security rating of ${currentExt.dangerRating}. ${currentExt.dangerExplanation}`
    },
    {
      q: `How can I convert .${extUpper} to other formats?`,
      a: currentExt.conversions.length > 0
        ? `.${extUpper} files can be converted to ${currentExt.conversions.map((c) => '.' + c.targetExtension).join(', ')} using our free online converter.`
        : `You can convert .${extUpper} files using AnyFileX's client-side conversion engine directly in your browser.`
    }
  ];

  // 9. Popular Downloads (utilities)
  const popularDownloads = [
    { name: '7-Zip Archiver', ext: 'ZIP, 7Z, RAR', id: '7-zip', os: 'Windows, Mac, Linux' },
    { name: 'VLC Media Player', ext: 'MP4, MKV, AVI', id: 'vlc', os: 'All Platforms' },
    { name: 'Visual Studio Code', ext: 'JSON, Code, Data', id: 'vscode', os: 'Windows, Mac, Linux' },
    { name: 'Horos DICOM Viewer', ext: 'DCM, DICOM', id: 'horos', os: 'macOS' },
    { name: '3D Slicer Suite', ext: 'NII, DCM, STL', id: '3d-slicer', os: 'Windows, Mac, Linux' },
    { name: 'CloudCompare 3D', ext: 'LAS, LAZ, PCD', id: 'cloudcompare', os: 'Windows, Mac, Linux' }
  ];

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white space-y-10 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Layers className="w-4 h-4" />
            <span>Related Formats & Helpful Resources</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Explore related information about .{extUpper} files
          </h2>
        </div>
        <Link
          href={href({ view: 'extensions' })}
          className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          id="seo-browse-all-ext-btn"
        >
          <span>Browse 354 Extensions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid Block 1: Main Relationships (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        {/* 1. Related Extensions */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-violet-400 flex items-center gap-1.5 uppercase tracking-wide">
            <FileCode className="w-4 h-4" />
            <span>Related Extensions</span>
          </h3>
          <ul className="space-y-2">
            {relatedExtensions.map((f) => (
              <li key={f.extension}>
                <Link
                  href={href({ view: 'extension-detail', ext: f.extension.toLowerCase() })}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-violet-900/40 border border-slate-700/80 hover:border-violet-500 text-slate-200 hover:text-violet-300 font-medium transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="font-mono font-bold text-violet-300">.{f.extension}</span>
                  <span className="truncate text-slate-400 text-[11px] ml-1">{f.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-auto" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Related Converters */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
            <RefreshCw className="w-4 h-4" />
            <span>Related Converters</span>
          </h3>
          <ul className="space-y-2">
            {relevantConverters.map((c) => (
              <li key={c.id}>
                <Link
                  href={href({ view: 'converter-detail', id: c.id })}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-blue-900/40 border border-slate-700/80 hover:border-blue-500 text-slate-200 hover:text-blue-300 font-medium transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="truncate">{c.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Related Software */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
            <AppWindow className="w-4 h-4" />
            <span>Related Software</span>
          </h3>
          <ul className="space-y-2">
            {relevantSoftware.map((s) => (
              <li key={s.id}>
                <Link
                  href={href({ view: 'software-detail', id: s.id })}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700/80 hover:border-emerald-500 text-slate-200 hover:text-emerald-300 font-medium transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="truncate">{s.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Related Repair Guides & Comparisons */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
            <Wrench className="w-4 h-4" />
            <span>Repair & Comparisons</span>
          </h3>
          <ul className="space-y-2">
            {relevantRepairGuides.map((r) => (
              <li key={r.id}>
                <Link
                  href={href({ view: 'repair-detail', id: r.id })}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-900/40 border border-slate-700/80 hover:border-amber-500 text-slate-200 hover:text-amber-300 font-medium transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="truncate">{r.title}</span>
                  <Wrench className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 shrink-0" />
                </Link>
              </li>
            ))}
            {comparisons.map((comp) => (
              <li key={comp.slug}>
                <Link
                  href={href({ view: 'comparison-detail', slug: comp.slug })}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-900/40 border border-slate-700/80 hover:border-amber-500 text-slate-200 hover:text-amber-300 font-medium transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="truncate">{comp.title}</span>
                  <GitCompare className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grid Block 2: Popular Guides & Category Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 text-xs">
        {/* Popular Guides */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-sky-400 flex items-center gap-1.5 uppercase tracking-wide">
            <BookOpen className="w-4 h-4" />
            <span>Popular Knowledge Base Guides</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {popularGuides.map((guide) => (
              <Link
                key={guide.id}
                href={href({
                  // GUIDES_LIST entries are guides (/guides/<id>); only
                  // BLOG_POSTS live under /blog/<id>. Mixing them 404d.
                  view: BLOG_POSTS.some((p) => p.id === guide.id) ? 'blog-detail' : 'guide-detail',
                  id: guide.id,
                })}
                className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left transition-all cursor-pointer group space-y-1"
              >
                <div className="font-bold text-slate-200 group-hover:text-sky-300 transition-colors line-clamp-1">
                  {guide.title}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {'summary' in guide ? guide.summary : 'Read in-depth troubleshooting and conversion instructions.'}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Pages */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-1.5 uppercase tracking-wide">
            <Grid className="w-4 h-4" />
            <span>Browse Category Pages</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {categoryPages.map((cat) => (
              <Link
                key={cat.id}
                href={href({ view: 'extensions' })}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 font-semibold transition-all cursor-pointer text-[11px] flex items-center gap-1.5"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-slate-500">({cat.popularExtensions.length})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Block 3: Related Questions */}
      <div className="grid grid-cols-1 gap-6 pt-4 border-t border-slate-800 text-xs">
        {/* Related Questions Accordion */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
            <HelpCircle className="w-4 h-4" />
            <span>Related Questions</span>
          </h3>
          <div className="space-y-2">
            {relatedQuestions.map((qa, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-800/80 border border-slate-700/80 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full text-left p-3 font-semibold text-slate-200 hover:text-rose-300 flex items-center justify-between cursor-pointer"
                >
                  <span>{qa.q}</span>
                  {openFaqIdx === idx ? <ChevronUp className="w-4 h-4 text-rose-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> }
                </button>
                {openFaqIdx === idx && (
                  <div className="px-3 pb-3 pt-1 text-[11px] text-slate-400 border-t border-slate-700/50 leading-relaxed">
                    {qa.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Block 4: Recently Viewed & Popular Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 text-xs">
        {/* Recently Viewed */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
            <Clock className="w-4 h-4" />
            <span>Recently Viewed Extensions</span>
          </h3>
          {recentlyViewed.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recentlyViewed.map((rExt) => (
                <Link
                  key={rExt}
                  href={href({ view: 'extension-detail', ext: rExt.toLowerCase() })}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-amber-950/80 border border-slate-700 hover:border-amber-500 text-amber-300 font-mono font-bold transition-all cursor-pointer text-xs flex items-center gap-1"
                >
                  <span>.{rExt}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs">
              Your recently inspected file extensions will appear here for rapid re-visitation.
            </p>
          )}
        </div>

        {/* Popular Downloads */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
            <Download className="w-4 h-4" />
            <span>Popular Recommended Downloads</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {popularDownloads.map((dl) => (
              <Link
                key={dl.id}
                href={href({ view: 'software-detail', id: dl.id })}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500 text-left transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                    {dl.name}
                  </div>
                  <span className="text-[10px] text-slate-400">{dl.os} • {dl.ext}</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
