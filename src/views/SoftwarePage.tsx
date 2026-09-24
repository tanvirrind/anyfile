import React, { useState } from 'react';
import {
  AppWindow,
  ExternalLink,
  Star,
  ShieldCheck,
  Download,
  Search,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Apple,
  Terminal,
  Smartphone,
  Sparkles,
  Layers,
  FileText,
  Eye,
} from 'lucide-react';
import { SOFTWARE_LIST } from '../data/softwareData';
import { AppRoute, SoftwareInfo } from '../types';
import { getExtensionsForSoftware } from '../lib/database/knowledgeGraph';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { SEOHead } from '../components/SEOHead';
import { GoogleDocsDetailView, GOOGLE_DOCS_FAQS } from '../components/software/GoogleDocsDetailView';

interface SoftwarePageProps {
  onNavigate: (route: AppRoute) => void;
  selectedSoftwareId?: string;
}

export const SoftwarePage: React.FC<SoftwarePageProps> = ({ onNavigate, selectedSoftwareId }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOS, setSelectedOS] = useState<string>('all');

  const categories = [
    'All',
    'Graphics & Design',
    'CAD & Engineering',
    'Productivity & Office',
    'Media & Audio',
    'Developer Tools',
    'Utilities & Compression',
  ];

  // If selectedSoftwareId is provided, render detail view
  if (selectedSoftwareId) {
    const soft = SOFTWARE_LIST.find((s) => s.id === selectedSoftwareId) || SOFTWARE_LIST[0];
    const supportedExtInfos = getExtensionsForSoftware(soft.id);
    const isGoogleDocs = soft.id === 'google-docs';

    const softwareSchema = isGoogleDocs
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              '@id': 'https://anyfilex.com/software/google-docs#software',
              name: 'Google Docs',
              operatingSystem: 'Windows, macOS, Linux, Android, iOS, ChromeOS, Web',
              applicationCategory: 'WordProcessor, OfficeApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description:
                'Google Docs is a free cloud-based word processor for creating, opening, editing, and exporting DOCX, ODT, PDF, RTF, TXT, HTML, and EPUB files.',
              softwareVersion: 'Latest Cloud Release',
              author: {
                '@type': 'Organization',
                name: 'Google LLC',
              },
            },
            {
              '@type': 'FAQPage',
              mainEntity: GOOGLE_DOCS_FAQS.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            },
            {
              '@type': 'HowTo',
              name: 'How to Upload and Open a File in Google Docs',
              description:
                'Step-by-step guide to uploading and opening Microsoft Word, PDF, OpenDocument, or plain text files in Google Docs.',
              step: [
                {
                  '@type': 'HowToStep',
                  name: 'Access Google Drive or Docs',
                  text: 'Navigate to drive.google.com or docs.google.com and log in with your Google account.',
                },
                {
                  '@type': 'HowToStep',
                  name: 'Upload the Document',
                  text: 'Click the + New button in Google Drive and select File upload, or click File > Open > Upload in Google Docs.',
                },
                {
                  '@type': 'HowToStep',
                  name: 'Select and Open Document',
                  text: 'Choose your DOCX, DOC, ODT, RTF, TXT, HTML, or PDF file to upload and begin editing.',
                },
              ],
            },
          ],
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: soft.name,
          operatingSystem: soft.supportedOS.join(', '),
          applicationCategory: soft.category,
          offers: {
            '@type': 'Offer',
            price: soft.priceType === 'Free' ? '0' : 'Paid',
            priceCurrency: 'USD',
          },
          description: soft.description,
          softwareVersion: 'Latest',
          author: {
            '@type': 'Organization',
            name: soft.developer,
          },
        };

    if (isGoogleDocs) {
      return (
        <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
          <SEOHead
            title="Google Docs File Types: What Files Can Google Docs Open?"
            description="Discover what files Google Docs can open and export. Complete guide to supported formats, DOCX, ODT, PDF, EPUB, RTF, TXT, HTML compatibility and limitations."
            canonicalPath={`/software/${soft.id}`}
            schemaData={softwareSchema}
          />

          <Breadcrumb
            items={[
              { label: 'Software Directory', route: { view: 'software' } },
              { label: 'Google Docs File Types' },
            ]}
            onNavigate={onNavigate}
          />

          <GoogleDocsDetailView onNavigate={onNavigate} />

          {/* Alternative Software Applications */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Alternative Applications in {soft.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SOFTWARE_LIST.filter((s) => s.id !== soft.id && s.category === soft.category).slice(0, 3).map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => onNavigate({ view: 'software-detail', id: alt.id })}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer group space-y-1"
                >
                  <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600">
                    {alt.name}
                  </span>
                  <p className="text-xs text-slate-500 line-clamp-2">{alt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
        <SEOHead
          title={`${soft.name} File Compatibility & Supported Formats`}
          description={`Learn about ${soft.name} by ${soft.developer}. Supported file extensions (${soft.supportedExtensions.slice(0, 8).join(', ')}), operating systems (${soft.supportedOS.join(', ')}), pricing, and features.`}
          canonicalPath={`/software/${soft.id}`}
          schemaData={softwareSchema}
        />

        <Breadcrumb
          items={[
            { label: 'Software Directory', route: { view: 'software' } },
            { label: soft.name },
          ]}
          onNavigate={onNavigate}
        />

        {/* Hero Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-inner">
                <AppWindow className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="emerald">{soft.category}</Badge>
                  <Badge variant={soft.priceType === 'Free' ? 'emerald' : 'slate'}>{soft.priceText}</Badge>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {soft.name}
                </h1>
                <p className="text-xs text-slate-500">Developer: {soft.developer}</p>
              </div>
            </div>

            <a
              href={soft.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
              id="software-visit-website-btn"
            >
              <span>Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {soft.longDescription || soft.description}
          </p>

          {/* Supported Operating Systems */}
          <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Supported Platforms:</span>
            <div className="flex items-center gap-1.5">
              {soft.supportedOS.map((os) => (
                <span key={os} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 uppercase font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {os}
                </span>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Capabilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {soft.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supported Extensions Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Supported File Extensions ({soft.supportedExtensions.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Click any file extension to view format specifications or step-by-step opening guides.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {soft.supportedExtensions.map((ext) => {
              const cleanExt = ext.toLowerCase();
              return (
                <div
                  key={ext}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-400 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-lg">
                      .{ext}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      Compatible
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <button
                      onClick={() => onNavigate({ view: 'extension-detail', ext: cleanExt })}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Format Specs</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                    <button
                      onClick={() => onNavigate({ view: 'how-to-open', ext: cleanExt })}
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>How to Open</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alternative Software Applications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Alternative Applications in {soft.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SOFTWARE_LIST.filter((s) => s.id !== soft.id && s.category === soft.category).slice(0, 3).map((alt) => (
              <div
                key={alt.id}
                onClick={() => onNavigate({ view: 'software-detail', id: alt.id })}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer group space-y-1"
              >
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600">
                  {alt.name}
                </span>
                <p className="text-xs text-slate-500 line-clamp-2">{alt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------
  // Software Directory Hub View
  // ---------------------------------------------
  const filteredSoftware = SOFTWARE_LIST.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.developer.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.supportedExtensions.some((e) => e.toLowerCase().includes(search.toLowerCase().replace(/^\./, '')));

    const matchesCategory =
      selectedCategory === 'All' || s.category === selectedCategory;

    const matchesOS =
      selectedOS === 'all' || s.supportedOS.includes(selectedOS as any);

    return matchesSearch && matchesCategory && matchesOS;
  });

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      <SEOHead
        title="Software Directory – File Format Compatibility & Supported Extensions"
        description="Comprehensive directory of desktop, web, and mobile software applications with complete file format compatibility tables, supported extensions, and pricing."
        canonicalPath="/software"
      />

      <Breadcrumb
        items={[
          { label: 'Software Directory' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-12 shadow-xl space-y-6 relative overflow-hidden">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-300">
            <AppWindow className="w-3.5 h-3.5" />
            <span>Software & File Compatibility Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Software Compatibility Directory
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Find the right program to open, edit, create, or convert any file format. Browse verified desktop and mobile applications with detailed format support matrices.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search software by name (e.g. Photoshop, VLC) or file extension (e.g. .HEIC, .DWG)..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 dark:bg-slate-950/60 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-md text-sm sm:text-base font-medium shadow-inner"
          />
        </div>
      </div>

      {/* Categories & OS Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold shrink-0">
          <button
            onClick={() => setSelectedOS('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedOS === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-500'
            }`}
          >
            All OS
          </button>
          <button
            onClick={() => setSelectedOS('windows')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedOS === 'windows' ? 'bg-emerald-600 text-white' : 'text-slate-500'
            }`}
          >
            Windows
          </button>
          <button
            onClick={() => setSelectedOS('mac')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedOS === 'mac' ? 'bg-emerald-600 text-white' : 'text-slate-500'
            }`}
          >
            Mac
          </button>
          <button
            onClick={() => setSelectedOS('linux')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedOS === 'linux' ? 'bg-emerald-600 text-white' : 'text-slate-500'
            }`}
          >
            Linux
          </button>
        </div>
      </div>

      {/* Software Grid */}
      <div className="space-y-4">
        <div className="text-xs text-slate-500">
          Showing {filteredSoftware.length} software programs
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSoftware.map((soft) => (
            <div
              key={soft.id}
              onClick={() => onNavigate({ view: 'software-detail', id: soft.id })}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer group space-y-4"
            >
              <div className="flex items-center justify-between">
                <Badge variant="emerald">{soft.category}</Badge>
                <Badge variant={soft.priceType === 'Free' ? 'emerald' : 'slate'}>{soft.priceText}</Badge>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {soft.name}
                </h3>
                <p className="text-xs text-slate-400">By {soft.developer}</p>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {soft.description}
              </p>

              {/* Supported Extensions Pills Preview */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  Supported Formats ({soft.supportedExtensions.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {soft.supportedExtensions.slice(0, 6).map((ext) => (
                    <span
                      key={ext}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-bold text-[10px] text-slate-700 dark:text-slate-300"
                    >
                      .{ext}
                    </span>
                  ))}
                  {soft.supportedExtensions.length > 6 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-400">
                      +{soft.supportedExtensions.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
