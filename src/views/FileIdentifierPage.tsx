import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Binary,
  Upload,
  Search,
  CheckCircle2,
  FileCode,
  ArrowRight,
  Cpu,
  Boxes,
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { FileIdentifierUploader } from '../components/FileIdentifierUploader';
import { FILE_SIGNATURES } from '../data/fileSignaturesData';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';

interface FileIdentifierPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const FileIdentifierPage: React.FC<FileIdentifierPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Images', 'Documents', 'Archives', 'Audio & Video', 'CAD & 3D', 'System & Executables'];

  const filteredSignatures = FILE_SIGNATURES.filter((sig) => {
    const matchesCat = selectedCategory === 'All' || sig.category.includes(selectedCategory);
    const matchesSearch =
      sig.extension.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sig.signature.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const faqs = [
    {
      question: 'How does the AnyFileX Magic Byte Identifier engine work?',
      answer: 'Every file format begins with a unique hexadecimal signature sequence in its header known as magic bytes. AnyFileX reads the first 64 bytes of your uploaded file directly in your browser RAM and checks it against our global database of 26+ binary signatures.'
    },
    {
      question: 'Are my private uploaded files sent to an external server?',
      answer: 'No! All binary inspection and SHA-256 hash calculations occur 100% locally inside your web browser RAM using HTML5 FileReader and WebAssembly APIs. Your files never touch any remote server.'
    },
    {
      question: 'What if a file has an incorrect or missing extension?',
      answer: 'Magic bytes remain unchanged even if someone renames a file from .heic to .jpg or removes the extension entirely. Our engine detects the underlying binary structure regardless of the file name.'
    },
    {
      question: 'Can I identify corrupted or truncated files?',
      answer: 'Yes. As long as the file header bytes (offset 0x00) are intact, our engine will accurately identify the original format specification.'
    }
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AnyFileX File Identifier Engine',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    description: 'Inspect raw binary file headers and identify unknown file formats using magic byte signature matching directly in your web browser.'
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="Identify Unknown Files by Magic Byte Header"
        description="Detect the true format of unknown, corrupted, or extensionless files instantly by analyzing hexadecimal binary magic signatures."
        canonicalPath="/tools/file-identifier"
        schemaData={schemaJson}
      />
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'File Identifier' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">
          <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Real-Time Magic Byte Inspector</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          File Identifier Engine
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Upload any unknown file to inspect its raw binary signature, detect magic bytes, and determine exact format specification with 99% accuracy.
        </p>
      </div>

      {/* Primary Upload Experience Component */}
      <div className="max-w-4xl mx-auto">
        <FileIdentifierUploader onNavigate={onNavigate} />
      </div>

      {/* Value Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Magic Byte Verification</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Reads the exact hexadecimal signature at byte offset 0x00 to identify files regardless of extension.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Zero Server Storage</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your files stay on your machine. Binary buffer analysis runs 100% client-side inside browser RAM.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
            <Binary className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">SHA-256 Checksums</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generates instant cryptographic SHA-256 hash fingerprints to verify download integrity and detect corruption.
          </p>
        </div>
      </div>

      {/* File Signature Database Reference Explorer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Boxes className="w-6 h-6 text-blue-600" />
              <span>File Signatures Database ({FILE_SIGNATURES.length} Specifications)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore magic bytes, MIME headers, and hexadecimal signature patterns across common formats.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search extension or magic byte..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Database Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {filteredSignatures.map((sig) => (
            <div
              key={sig.id}
              onClick={() => onNavigate({ view: 'extension-detail', ext: sig.extension.toLowerCase() })}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between font-sans">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-blue-600">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300 font-mono text-xs">
                    .{sig.extension}
                  </span>
                  <span className="line-clamp-1">{sig.name}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{sig.category}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px] flex items-center justify-between">
                  <span>Magic Bytes (Hex):</span>
                  <span>Offset: 0x{sig.offset.toString(16).padStart(2, '0')}</span>
                </div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 truncate">
                  {sig.signature}
                </div>
              </div>

              <p className="font-sans text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {sig.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <FAQAccordion faqs={faqs} />
      </div>

    </div>
  );
};
