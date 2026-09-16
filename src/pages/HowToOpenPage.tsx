import React, { useState } from 'react';
import {
  FileText,
  Monitor,
  Apple,
  Smartphone,
  Terminal,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Eye,
  Laptop,
  Layers,
  Sparkles,
  Info,
  AlertTriangle,
  FileCheck,
  Wrench,
  Search,
  Lock,
  FileCode,
  Compass,
  Download,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { AppRoute, FileTypeInfo } from '../types';
import { getHowToOpenGuide, HowToOpenGuideData } from '../lib/guides/howToOpenEngine';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { FAQAccordion } from '../components/FAQAccordion';
import { ExtensionLiveViewer } from '../components/extension/ExtensionLiveViewer';
import { getOrGenerateExtensionInfo } from '../lib/seo/extensionGenerator';

interface HowToOpenPageProps {
  ext: string;
  onNavigate: (route: AppRoute) => void;
}

export const HowToOpenPage: React.FC<HowToOpenPageProps> = ({ ext, onNavigate }) => {
  const cleanExt = (ext || 'heic').trim().replace(/^\./, '').toLowerCase();
  const guide: HowToOpenGuideData = getHowToOpenGuide(cleanExt);
  const extInfo: FileTypeInfo = getOrGenerateExtensionInfo(cleanExt);

  const [activeOS, setActiveOS] = useState<'windows' | 'mac' | 'linux' | 'ios' | 'android'>('windows');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title={`How to Open a .${guide.upperExt} File – Windows, Mac, Android & iOS Guide`}
        description={`Learn how to open, view, and troubleshoot .${guide.upperExt} (${guide.name}) files on Windows 11/10, macOS, Linux, iPhone, and Android. Verified software and free in-browser viewer.`}
        canonicalPath={`/how-to-open/${guide.extension}`}
        schemaData={guide.schemaJson}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'How to Open', path: '/how-to-open' },
          { name: `How to Open .${guide.upperExt}`, path: `/how-to-open/${guide.extension}` },
        ]}
      />

      <Breadcrumb
        items={[
          { label: 'How to Open Files', route: { view: 'how-to-open' } },
          { label: `How to Open .${guide.upperExt}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* 1. HERO & WHAT THE FILE IS */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300">
            <Eye className="w-3.5 h-3.5" />
            <span>Compatibility & Opening Guide</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate({ view: 'format-guide', format: guide.extension })}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/80 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>What Is a {guide.upperExt} File?</span>
            </button>

            <button
              onClick={() => onNavigate({ view: 'extension-detail', ext: guide.extension })}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/80 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>.{guide.upperExt} Specs</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How to Open a <span className="text-blue-600 dark:text-blue-400">.{guide.upperExt}</span> File
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
            A <strong className="text-slate-900 dark:text-white">.{guide.upperExt}</strong> file is a <strong className="text-slate-900 dark:text-white">{guide.name}</strong> belonging to the <strong className="text-slate-900 dark:text-white">{guide.category}</strong> category. Below are verified instructions for opening it on Windows, macOS, Linux, iPhone, and Android, along with free in-browser inspection tools.
          </p>
        </div>

        {/* Why opening can be tricky */}
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong className="font-semibold block mb-0.5">Why this file may not open automatically:</strong>
            {guide.whyItIsHardToOpen}
          </div>
        </div>

        {/* Quick Technical Properties Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-medium mb-1">Format Category</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{guide.category}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-medium mb-1">MIME Type</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">{guide.mimeType}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-medium mb-1">Magic Bytes Signature</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">{guide.magicBytesHex}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-medium mb-1">Security Risk Rating</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{guide.dangerRating}</span>
          </div>
        </div>
      </section>

      {/* 2. LIVE IN-BROWSER ANALYZER & VIEWER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span>Instant In-Browser .{guide.upperExt} Viewer & Inspector</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Drop your file below to preview, decode, and inspect header signatures with 100% client-side privacy. Zero server uploads.
            </p>
          </div>
        </div>

        <ExtensionLiveViewer item={extInfo} onNavigate={onNavigate} />
      </section>

      {/* 3. STEP-BY-STEP OPERATING SYSTEM INSTRUCTIONS (Windows, macOS, Linux, iOS, Android) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Step-by-Step Instructions by Operating System
          </h2>
          <p className="text-sm text-slate-500">
            Select your platform to see verified, technically accurate steps for opening .${guide.upperExt} files.
          </p>
        </div>

        {/* OS Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            onClick={() => setActiveOS('windows')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeOS === 'windows'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Windows 11 / 10</span>
          </button>
          <button
            onClick={() => setActiveOS('mac')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeOS === 'mac'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>macOS</span>
          </button>
          <button
            onClick={() => setActiveOS('linux')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeOS === 'linux'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Linux</span>
          </button>
          <button
            onClick={() => setActiveOS('ios')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeOS === 'ios'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / iPad</span>
          </button>
          <button
            onClick={() => setActiveOS('android')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeOS === 'android'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android</span>
          </button>
        </div>

        {/* Active OS Guide Container */}
        {(() => {
          const currentGuide = guide.osGuides[activeOS];
          return (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {currentGuide.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Default system handler: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentGuide.defaultApp}</span>
                  </p>
                </div>
                <Badge variant="blue">{currentGuide.badge}</Badge>
              </div>

              {/* Optional Codec / Package Warning */}
              {currentGuide.codecNote && (
                <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs sm:text-sm text-blue-900 dark:text-blue-200">
                  <strong>Important Codec Notice:</strong> {currentGuide.codecNote}
                </div>
              )}

              {/* Steps List */}
              <div className="space-y-4">
                {currentGuide.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {step.stepNumber}
                    </div>
                    <div className="space-y-2 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.detail}
                      </p>

                      {step.tip && (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                          <strong className="text-blue-600 dark:text-blue-400">Pro Tip:</strong> {step.tip}
                        </div>
                      )}

                      {step.command && (
                        <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs flex items-center justify-between gap-2 overflow-x-auto">
                          <code>{step.command}</code>
                          <button
                            onClick={() => handleCopy(step.command!)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 inline-flex items-center gap-1 cursor-pointer"
                          >
                            {copiedCmd === step.command ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedCmd === step.command ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* 4. RECOMMENDED SOFTWARE (From AnyFileX Database) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Recommended Software for .{guide.upperExt} Files
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Applications from the AnyFileX compatibility graph with verified ability to open, view, or edit .${guide.upperExt}.
            </p>
          </div>
          <button
            onClick={() => onNavigate({ view: 'software' })}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Software</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guide.recommendedSoftware.map((soft) => (
            <div
              key={soft.id}
              onClick={() => onNavigate({ view: 'software-detail', id: soft.routeId })}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 transition-colors">
                    {soft.name}
                  </span>
                  <Badge variant={soft.priceType === 'Free' || soft.priceType === 'Open Source' ? 'emerald' : 'slate'}>
                    {soft.priceText}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{soft.developer}</p>

                {/* Platform OS badges */}
                <div className="flex flex-wrap gap-1 text-[10px] text-slate-500 font-medium">
                  {soft.supportedOS.map(o => (
                    <span key={o} className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/60 uppercase">
                      {o}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-1">
                {soft.canOpen && <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-[10px] font-bold text-blue-700 dark:text-blue-300">Opens</span>}
                {soft.canView && <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Views</span>}
                {soft.canEdit && <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/50 text-[10px] font-bold text-purple-700 dark:text-purple-300">Edits</span>}
                {soft.canConvert && <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-[10px] font-bold text-amber-700 dark:text-amber-300">Converts</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHAT TO DO IF THE FILE WON'T OPEN (TROUBLESHOOTING & FAILURE MODES) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>File Intelligence Diagnostics</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            What to Do If Your .{guide.upperExt} File Won't Open
          </h2>
          <p className="text-sm text-slate-500">
            If your application crashes or throws an error, match your symptom to one of the 6 common failure modes below:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.troubleshooting.map((mode) => (
            <div
              key={mode.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {mode.issue}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">Cause:</strong> {mode.cause}
                </p>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <strong className="text-slate-900 dark:text-white block font-semibold">Diagnostic Indicator:</strong>
                  <span>{mode.diagnostic}</span>
                </div>
              </div>

              {mode.toolAction && (
                <button
                  onClick={() => onNavigate(mode.toolAction!.route)}
                  className="mt-2 w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{mode.toolAction.label}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. CONVERSION PATH: Analyze -> Convert -> Open */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-10 text-white space-y-8 shadow-xl shadow-blue-500/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-xs font-bold text-white">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Alternative Path</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Can't Open the File Directly? Use the 3-Step Conversion Path
          </h2>
          <p className="text-sm text-blue-100 max-w-2xl">
            When software installation isn't possible, transform your .{guide.upperExt} into a universal format in seconds with 100% private in-memory WebAssembly tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guide.conversionWorkflow.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="w-7 h-7 rounded-lg bg-white text-blue-700 font-bold text-xs flex items-center justify-center">
                  {step.stepNumber}
                </span>
                <h3 className="font-bold text-white text-base">{step.title}</h3>
                <p className="text-xs text-blue-100 leading-relaxed">{step.description}</p>
              </div>

              <button
                onClick={() => onNavigate(step.route)}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>{step.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Conversion Target Buttons */}
        {guide.conversionWorkflow.availableConverters.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/15">
            <span className="text-xs text-blue-200 font-medium block">Direct In-Browser Converters:</span>
            <div className="flex flex-wrap gap-2">
              {guide.conversionWorkflow.availableConverters.map((conv) => (
                <button
                  key={conv.routeId}
                  onClick={() => onNavigate({ view: 'converter-detail', id: conv.routeId })}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{conv.label}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 7. RELATED COMPARISONS & FORMAT SPECIFICATIONS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Head-to-Head Comparisons */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Format Comparisons
            </h3>
            <button
              onClick={() => onNavigate({ view: 'compare-hub' })}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              All Comparisons &rarr;
            </button>
          </div>
          <div className="space-y-2">
            {guide.internalLinks.comparisons.map((comp) => (
              <div
                key={comp.slug}
                onClick={() => onNavigate({ view: 'comparison-detail', slug: comp.slug })}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/80 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600">
                    {comp.title}
                  </span>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{comp.highlight}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>

        {/* Related Formats */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Related {guide.category} Formats
            </h3>
            <button
              onClick={() => onNavigate({ view: 'extensions' })}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Browse All &rarr;
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {guide.internalLinks.relatedExtensions.map((rel) => (
              <div
                key={rel.ext}
                onClick={() => onNavigate({ view: 'how-to-open', ext: rel.ext.toLowerCase() })}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/80 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer group"
              >
                <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 block">
                  .{rel.ext}
                </span>
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600">
                  How to Open {rel.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions about Opening .{guide.upperExt} Files
          </h2>
          <p className="text-sm text-slate-500">
            Answers to common questions regarding .{guide.upperExt} file troubleshooting, security, and compatibility.
          </p>
        </div>

        <FAQAccordion faqs={guide.faqs} />
      </section>
    </div>
  );
};
