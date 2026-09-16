import React, { useState, useEffect } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Share2,
  Search,
  FileCode,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  ArrowRight,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Terminal,
  Layers
} from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { FAQAccordion } from '../components/FAQAccordion';
import { SchemaMarkupView } from '../components/SchemaMarkupView';
import { SEOHead } from '../components/SEOHead';
import { lookupMimeByInput, MimeRecord } from '../data/expandedMimeDatabase';

interface MimeCheckerPageProps {
  onNavigate: (route: AppRoute) => void;
  initialQuery?: string;
}

export const MimeCheckerPage: React.FC<MimeCheckerPageProps> = ({
  onNavigate,
  initialQuery = 'photo.heic'
}) => {
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [currentResult, setCurrentResult] = useState<MimeRecord>(() =>
    lookupMimeByInput(initialQuery)
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setInputQuery(initialQuery);
      setCurrentResult(lookupMimeByInput(initialQuery));
    }
  }, [initialQuery]);

  const handleSearchChange = (text: string) => {
    setInputQuery(text);
    if (text.trim()) {
      setCurrentResult(lookupMimeByInput(text));
    }
  };

  const handleCopySingle = (val: string, keyName: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(currentResult, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedKey('JSON');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(currentResult, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentResult.extension}_mime_info.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareResult = () => {
    const shareUrl = `${window.location.origin}/tools/mime-checker?q=${encodeURIComponent(
      inputQuery
    )}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareUrl(true);
    setTimeout(() => setCopiedShareUrl(null as any), 2000);
  };

  const presetSamples = [
    { label: 'photo.heic', ext: 'photo.heic' },
    { label: 'document.pdf', ext: 'document.pdf' },
    { label: 'archive.zip', ext: 'archive.zip' },
    { label: 'audio.mp3', ext: 'audio.mp3' },
    { label: 'video.mp4', ext: 'video.mp4' },
    { label: 'data.json', ext: 'data.json' },
    { label: 'setup.exe', ext: 'setup.exe' },
    { label: 'image/webp', ext: 'image/webp' },
    { label: 'model/gltf+json', ext: 'model/gltf+json' }
  ];

  const faqs = [
    {
      question: 'What is a MIME type (Multipurpose Internet Mail Extensions)?',
      answer: 'A MIME type (also referred to as media type or Content-Type) is an official standard header used on the Internet to indicate the nature and format of a document, file, or byte stream. For example, web browsers rely on image/png to render PNG graphics and application/pdf to open PDF files.'
    },
    {
      question: 'How do web servers use MIME types?',
      answer: 'When a user requests a file, HTTP servers like Nginx, Apache, or Express send a Content-Type HTTP response header (e.g. Content-Type: application/json). This informs the client browser whether to display the content inline, play audio/video, or trigger a file download.'
    },
    {
      question: 'Why does my file extension not match its MIME type?',
      answer: 'Some files share identical internal magic byte structures but use different file extensions (such as .docx, .xlsx, .apk, and .epub all using ZIP container MIME application/zip). Always verify magic bytes for security integrity.'
    }
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'OpenAnyFile MIME Type & Extension Checker',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    description: 'Lookup MIME types, file categories, software compatibility, and magic bytes for 500+ extensions.'
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="MIME Type Lookup & Content-Type Checker"
        description="Lookup official RFC media types, HTTP Content-Type headers, and MIME mappings for any file extension or filename."
        canonicalPath="/tools/mime-checker"
      />
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'MIME Type Checker' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">
          <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Developer Utility & Media Type Inspection Engine</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          File MIME Type Checker
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Enter any filename or extension to inspect official MIME types, content categories, software compatibility, OS support, and header signatures.
        </p>
      </div>

      {/* Input / Search Bar */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Enter filename (e.g. photo.heic, report.pdf, data.json, image/webp)..."
            className="w-full pl-11 pr-24 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm sm:text-base focus:outline-hidden focus:border-blue-500 shadow-md transition-all"
            id="mime-checker-input"
          />
          {inputQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Preset Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Try example query:</span>
          {presetSamples.map((p) => (
            <button
              key={p.label}
              onClick={() => handleSearchChange(p.ext)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Card */}
      {currentResult && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          {/* Top Bar with Toolbar Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                MIME Analysis Result
              </span>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                  .{currentResult.extension.toLowerCase()}
                </h2>
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  {currentResult.category}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{currentResult.name}</p>
            </div>

            {/* Developer Toolbar */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <button
                onClick={() => handleCopySingle(currentResult.mimeType, 'MIME')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {copiedKey === 'MIME' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'MIME' ? 'MIME Copied!' : 'Copy MIME'}</span>
              </button>

              <button
                onClick={handleCopyJson}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedKey === 'JSON' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code2 className="w-3.5 h-3.5" />}
                <span>Copy JSON</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export JSON</span>
              </button>

              <button
                onClick={handleShareResult}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy shareable link"
              >
                {copiedShareUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedShareUrl ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Core Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property 1: Extension */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Extension</span>
              <p className="text-base font-mono font-bold text-slate-900 dark:text-white">
                .{currentResult.extension.toUpperCase()}
              </p>
            </div>

            {/* Property 2: MIME Type */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">MIME Media Type</span>
              <p className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                {currentResult.mimeType}
              </p>
            </div>

            {/* Property 3: Category */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Content Category</span>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {currentResult.category}
              </p>
            </div>

            {/* Property 4: RFC / Standard Standard */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Standard Specification</span>
              <p className="text-base font-mono text-slate-700 dark:text-slate-300">
                {currentResult.rfcStandard || 'IANA / ISO Registered Standard'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Format Overview & Purpose</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentResult.description}
            </p>
          </div>

          {/* Common Software Apps */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-blue-600" />
              <span>Common Software Applications</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentResult.commonSoftware.map((app) => (
                <span
                  key={app}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          {/* Operating Systems Support Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Operating System Compatibility Matrix</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { key: 'windows', name: 'Windows' },
                { key: 'mac', name: 'macOS' },
                { key: 'linux', name: 'Linux' },
                { key: 'android', name: 'Android' },
                { key: 'ios', name: 'iOS' },
              ].map((os) => {
                const supported = currentResult.supportedOs.includes(os.key as any);
                return (
                  <div
                    key={os.key}
                    className={`p-3 rounded-2xl border text-center space-y-1 ${
                      supported
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 mx-auto ${
                        supported ? 'text-emerald-600' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                    <span className="font-bold text-xs block">{os.name}</span>
                    <span className="text-[10px] uppercase font-mono block">
                      {supported ? 'Supported' : 'Plugin Required'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Header Magic Bytes Code Box */}
          {currentResult.magicBytesHex && (
            <div className="p-5 rounded-2xl bg-slate-950 text-white font-mono space-y-3 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-bold uppercase text-blue-400">Binary Magic Byte Header Signature</span>
                <span>Hex & ASCII</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Hexadecimal Bytes</span>
                  <p className="text-sm text-emerald-400 font-bold select-all">{currentResult.magicBytesHex}</p>
                </div>
                {currentResult.magicBytesAscii && (
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">ASCII String</span>
                    <p className="text-sm text-indigo-300 font-bold select-all">{currentResult.magicBytesAscii}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Link to Programmatic SEO Landing Page */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-base">Looking for detailed HTTP server code snippets & RFC specs?</h4>
              <p className="text-xs text-slate-300">
                View dedicated MIME specification page for {currentResult.mimeType}.
              </p>
            </div>
            <button
              onClick={() =>
                onNavigate({
                  view: 'mime-detail',
                  mimeSlug: `${currentResult.mimeType.replace('/', '-')}`
                })
              }
              className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>View MIME Specification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto">
        <FAQAccordion faqs={faqs} />
      </div>

      {/* Schema.org */}
      <div className="max-w-4xl mx-auto">
        <SchemaMarkupView schemaData={schemaJson} />
      </div>
    </div>
  );
};
