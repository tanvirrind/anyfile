import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Binary,
  FileCode,
  Lock,
  Cpu,
  Zap,
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
  Terminal,
  ExternalLink,
  Layers,
  HelpCircle,
  Hash,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { DiagnosticDropzone } from '../components/DiagnosticDropzone';
import {
  getAllTechnicalGuides,
  TechnicalAuthorityGuide
} from '../lib/database/technicalAuthorityData';
import { AppRoute } from '../types';

interface TechnicalHubPageProps {
  onNavigate: (route: AppRoute) => void;
  categoryFilter?: string;
}

export const TechnicalHubPage: React.FC<TechnicalHubPageProps> = ({
  onNavigate,
  categoryFilter
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || 'All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allGuides = useMemo(() => getAllTechnicalGuides(), []);

  const categories = [
    'All',
    'File Signatures & Headers',
    'Format Detection & MIME',
    'Integrity & Cryptography',
    'Security & Malware Mechanics'
  ];

  const filteredGuides = useMemo(() => {
    return allGuides.filter((guide) => {
      const matchesCat =
        selectedCategory === 'All' || guide.category === selectedCategory;

      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = guide.title.toLowerCase().includes(q);
      const inSubtitle = guide.subtitle.toLowerCase().includes(q);
      const inSummary = guide.executiveSummary.toLowerCase().includes(q);
      const inGlossary = guide.keyTermsGlossary?.some(k => k.term.toLowerCase().includes(q) || k.definition.toLowerCase().includes(q));
      const inStandards = guide.standardsAndRFCs?.some(s => s.standard.toLowerCase().includes(q) || s.title.toLowerCase().includes(q));

      return inTitle || inSubtitle || inSummary || inGlossary || inStandards;
    });
  }, [allGuides, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="File Security & Technical Authority Center – AnyFileX"
        description="Comprehensive technical guides on how digital files work: magic bytes, binary file signatures, IANA MIME types, Shannon entropy, SHA-256 integrity, ZIP bombs, and extension spoofing."
        canonicalPath="/security"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'AnyFileX File Security & Technical Authority Center',
          description:
            'Authoritative technical reference on file signatures, MIME types, cryptography, entropy, and file format mechanics.',
          url: 'https://www.anyfilex.com/security'
        }}
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200 dark:border-blue-800/60">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            AnyFileX Technical Authority & Standards
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            How Digital Files Work: Binary Signatures, Cryptography & Security
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Explore authoritative engineering references on file header mechanics, IANA media specifications, Shannon entropy calculation, cryptographic hash integrity, and structural vulnerability defenses.
          </p>
        </div>

        {/* Live File Diagnostic Dropzone */}
        <section>
          <DiagnosticDropzone
            onNavigate={onNavigate}
            highlightedProblem="File Structure & Security Analysis"
          />
        </section>

        {/* Search & Category Filter Controls */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search technical topics (e.g. Magic Bytes, Shannon Entropy, SHA-256, ZIP Bomb, MIME, RTLO Spoofing)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Technical Guides Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Authoritative Technical Reference Guides ({filteredGuides.length})
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Peer-Reviewed Architecture Articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => onNavigate({ view: 'technical-guide', slug: guide.slug } as any)}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-semibold uppercase tracking-wider border border-blue-200 dark:border-blue-800/40">
                      {guide.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                        {guide.difficulty}
                      </span>
                      <span>{guide.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {guide.executiveSummary}
                  </p>

                  {/* Standards & RFC Badges */}
                  {guide.standardsAndRFCs && guide.standardsAndRFCs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {guide.standardsAndRFCs.slice(0, 2).map((std, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/70 text-[10px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        >
                          {std.standard}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Read Complete Technical Guide</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Formal Standards Index Section */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Binary className="w-4 h-4" />
            International Standards & RFC Specifications
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              Foundational Technical Specifications Cited by AnyFileX
            </h2>
            <p className="text-xs text-slate-300">
              All detection algorithms, magic byte catalogs, and structural parsers in AnyFileX align directly with ratified international standards bodies:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5">
              <div className="font-mono text-xs font-bold text-blue-400">NIST FIPS 180-4</div>
              <div className="font-semibold text-xs text-white">Secure Hash Standard</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Standardizes SHA-224, SHA-256, SHA-384, and SHA-512 cryptographic digests.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5">
              <div className="font-mono text-xs font-bold text-emerald-400">RFC 2045 & 2046</div>
              <div className="font-semibold text-xs text-white">IANA MIME Specifications</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Governs two-part media type identifiers, boundaries, and encoding mechanisms.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5">
              <div className="font-mono text-xs font-bold text-purple-400">ISO/IEC 29500</div>
              <div className="font-semibold text-xs text-white">Office Open XML (OOXML)</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Defines modern DOCX, XLSX, and PPTX container structures and macro segregation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5">
              <div className="font-mono text-xs font-bold text-amber-400">Shannon (1948)</div>
              <div className="font-semibold text-xs text-white">Information Theory</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Mathematical basis for calculating byte entropy, compression density, and encryption randomness.
              </p>
            </div>
          </div>
        </section>

        {/* Connected Tools & Utilities Grid */}
        <section className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Interactive AnyFileX Diagnostic & Analysis Utilities
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div
              onClick={() => onNavigate({ view: 'magic-byte-detector' })}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-slate-900 dark:text-slate-100 cursor-pointer group flex flex-col justify-between transition-all"
            >
              <div className="space-y-2">
                <FileCode className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm">Magic Byte Detector</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Inspect raw hexadecimal headers and identify binary signatures.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Open Tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => onNavigate({ view: 'checksum-verifier' })}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-slate-900 dark:text-slate-100 cursor-pointer group flex flex-col justify-between transition-all"
            >
              <div className="space-y-2">
                <Hash className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-sm">Checksum Verifier</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Validate SHA-256, SHA-512, and MD5 hashes client-side.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Open Tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => onNavigate({ view: 'mime-checker' })}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-slate-900 dark:text-slate-100 cursor-pointer group flex flex-col justify-between transition-all"
            >
              <div className="space-y-2">
                <Binary className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm">MIME Type Checker</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Cross-reference IANA media types against extensions.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Open Tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => onNavigate({ view: 'file-analyzer' })}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-slate-900 dark:text-slate-100 cursor-pointer group flex flex-col justify-between transition-all"
            >
              <div className="space-y-2">
                <Cpu className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm">Full File Analyzer</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Comprehensive entropy, metadata, and structural container scan.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Open Tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
