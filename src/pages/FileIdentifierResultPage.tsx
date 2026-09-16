import React, { useState, useEffect } from 'react';
import {
  FileCode,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  Download,
  ExternalLink,
  Laptop,
  Monitor,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Code,
  Info,
  Binary,
  Layers,
  Wrench,
  Search,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { getReportById, AnalysisReport } from '../utils/fileAnalyzer';
import { AppRoute, SoftwareInfo } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { SOFTWARE_LIST } from '../data/softwareData';
import { SchemaMarkupView } from '../components/SchemaMarkupView';
import { FAQAccordion } from '../components/FAQAccordion';
import { TOCSidebar } from '../components/TOCSidebar';
import { SEOHead } from '../components/SEOHead';

interface FileIdentifierResultPageProps {
  reportId: string;
  onNavigate: (route: AppRoute) => void;
}

export const FileIdentifierResultPage: React.FC<FileIdentifierResultPageProps> = ({
  reportId,
  onNavigate,
}) => {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);
  const [activeToc, setActiveToc] = useState('summary');

  useEffect(() => {
    const loaded = getReportById(reportId);
    if (loaded) {
      setReport(loaded);
    } else {
      // Fallback synthetic report if direct URL or stale ID
      setReport({
        id: reportId,
        filename: 'sample_photo.heic',
        extension: 'HEIC',
        fileSize: 2451000,
        formattedSize: '2.45 MB',
        mimeType: 'image/heic',
        magicBytesHex: '00 00 00 18 66 74 79 70 68 65 69 63',
        magicBytesAscii: '....ftypheic',
        signatureMatch: {
          id: 'heic',
          extension: 'HEIC',
          name: 'High Efficiency Image Container',
          mime_type: 'image/heic',
          signature: '66 74 79 70 68 65 69 63',
          offset: 4,
          category: 'Images',
          description: 'Apple iPhone high-efficiency image container based on HEVC codec encoding.',
          common_software: ['Apple Photos', 'Adobe Lightroom', 'CopyTrans HEIC', 'iMazing'],
          supported_os: ['windows', 'mac', 'ios', 'android'],
          security_notes: 'Safe camera photo format utilizing HEVC video codec frame compression.',
          example_header_hex: '00 00 00 18 66 74 79 70 68 65 69 63 00 00 00 00',
          magicBytesAscii: '....ftypheic....'
        },
        detectedFormatName: 'High Efficiency Image Container (.heic)',
        category: 'Images',
        confidenceScore: 99,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        lastModified: new Date().toISOString().split('T')[0],
        isUnknown: false,
        securityRating: 'Low',
        threatNotes: 'Safe camera photo format utilizing HEVC frame compression. Zero executable code detected.',
        openingSteps: [
          { title: 'Open on Apple Hardware', desc: 'macOS and iOS open .heic files natively in Apple Photos.' },
          { title: 'Windows HEIF Extension', desc: 'Download HEIF Image Extensions from Microsoft Store on Windows 10/11.' },
          { title: 'Convert Online', desc: 'Convert .heic to standard .jpg or .png using our web converter.' }
        ],
        hexOffsetRows: [
          { offsetHex: '0x00000000', hexBytes: ['00', '00', '00', '18', '66', '74', '79', '70', '68', '65', '69', '63', '00', '00', '00', '00'], asciiChars: '....ftypheic....' },
          { offsetHex: '0x00000010', hexBytes: ['00', '00', '00', '01', '6D', '69', '66', '31', '68', '65', '69', '63', '00', '00', '00', '00'], asciiChars: '....mif1heic....' }
        ]
      });
    }
  }, [reportId]);

  if (!report) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
          <Binary className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Loading Analysis Report...</h2>
      </div>
    );
  }

  const handleCopyHash = () => {
    navigator.clipboard.writeText(report.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyHex = () => {
    navigator.clipboard.writeText(report.magicBytesHex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  const matchedApps: SoftwareInfo[] = SOFTWARE_LIST.filter(
    (app) =>
      app.supportedExtensions.some((e) => e.toLowerCase() === report.extension.toLowerCase()) ||
      app.category.toLowerCase().includes(report.category.toLowerCase())
  ).slice(0, 4);

  const tocItems = [
    { id: 'summary', label: 'Analysis Summary & Hash' },
    { id: 'magic-bytes', label: 'Magic Bytes & Hex Stream' },
    { id: 'what-is-it', label: 'Format Description' },
    { id: 'how-to-open', label: 'How to Open File' },
    { id: 'software', label: 'Recommended Software' },
    { id: 'os-support', label: 'Platform Compatibility' },
    { id: 'conversion', label: 'Convert This Format' },
    { id: 'security', label: 'Security & Safety Check' },
    { id: 'schema-meta', label: 'Structured Schema' },
  ];

  const handleTocSelect = (id: string) => {
    setActiveToc(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -85;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: `File Identification Analysis: ${report.filename}`,
    headline: `Header Magic Byte Inspection Report for ${report.filename}`,
    description: `Diagnostic analysis report for ${report.filename}. Detected format: ${report.detectedFormatName} with ${report.confidenceScore}% confidence.`,
    about: {
      '@type': 'SoftwareApplication',
      name: report.detectedFormatName,
      fileFormat: report.mimeType
    }
  };

  const faqs = [
    {
      question: `How did OpenAnyFile identify ${report.filename}?`,
      answer: `Our identification engine inspected the raw binary magic header bytes at byte offset 0x00000000 and matched the hex signature against the global file_signatures database.`
    },
    {
      question: `Is ${report.filename} safe to open?`,
      answer: `${report.threatNotes} Safety Score rating: ${report.securityRating} Risk.`
    },
    {
      question: `Can I convert .${report.extension.toLowerCase()} into PDF or JPG?`,
      answer: `Yes, use our universal web converter tool to convert .${report.extension.toLowerCase()} files directly in your browser without software installation.`
    }
  ];

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <SEOHead
        title={`Analysis Report: ${report.filename} (${report.detectedFormatName})`}
        description={`Binary inspection results for ${report.filename}. Detected as ${report.detectedFormatName} (${report.mimeType}) with ${report.confidenceScore}% confidence.`}
        canonicalPath={`/tools/file-identifier/report`}
      />
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'File Identifier', route: { view: 'file-identifier' } },
          { label: `Result: ${report.filename}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider">
                .{report.extension}
              </span>
              <Badge variant="blue" size="sm">{report.category}</Badge>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{report.confidenceScore}% Confidence Match</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-all">
              {report.filename}
            </h1>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Identified as: {report.detectedFormatName}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate({ view: 'file-identifier' })}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Inspect Another File</span>
            </button>
          </div>
        </div>

        {/* Quick Spec Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">File Size</span>
            <span className="font-bold text-slate-900 dark:text-white">{report.formattedSize}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">MIME Media Type</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{report.mimeType}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Header Offset</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">0x00000000</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Security Rating</span>
            <span className={`font-bold ${
              report.securityRating === 'Low' ? 'text-emerald-600' : 'text-amber-500'
            }`}>
              {report.securityRating} Risk
            </span>
          </div>
        </div>

        {/* SHA-256 Checksum Block */}
        <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SHA-256 Cryptographic Checksum</span>
            </span>
            <button
              onClick={handleCopyHash}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>
          <p className="font-bold text-emerald-400 break-all select-all pt-1">{report.sha256Hash}</p>
        </div>
      </div>

      {/* Main Grid with TOC Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <TOCSidebar items={tocItems} activeId={activeToc} onSelect={handleTocSelect} title="Analysis Navigation" />
        </div>

        <div className="lg:col-span-3 space-y-8">
          {/* Section: Magic Bytes & Hex Stream */}
          <section id="magic-bytes" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Binary className="w-5 h-5 text-blue-600" />
                <span>Magic Bytes & Hexadecimal Header Stream</span>
              </h2>
              <button
                onClick={handleCopyHex}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
                title="Copy Hex Header"
              >
                {copiedHex ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline font-medium">{copiedHex ? 'Copied' : 'Copy Hex'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Below is the raw hexadecimal byte sequence extracted from the initial 64-byte file header slice:
            </p>

            {/* Hex Viewer Table Component */}
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs overflow-x-auto">
              <table className="w-full text-left text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[11px] uppercase tracking-wider">
                    <th className="py-2 pr-4 font-bold">Offset</th>
                    <th className="py-2 px-2 font-bold">Hexadecimal Bytes (16-Byte Rows)</th>
                    <th className="py-2 pl-4 font-bold text-right">ASCII String</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {report.hexOffsetRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60">
                      <td className="py-2.5 pr-4 text-blue-400 font-bold">{row.offsetHex}</td>
                      <td className="py-2.5 px-2 font-bold text-emerald-400 tracking-wider">
                        {row.hexBytes.join(' ')}
                      </td>
                      <td className="py-2.5 pl-4 text-right text-slate-400 font-bold">{row.asciiChars}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: What is this file? */}
          <section id="what-is-it" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-600" />
              <span>What is this file? ({report.detectedFormatName})</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {report.signatureMatch?.description ||
                `The file "${report.filename}" was identified as a ${report.detectedFormatName}. This format belongs to the ${report.category} media category.`}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Format Specifications:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <li>• <strong>Format Extension:</strong> .{report.extension}</li>
                <li>• <strong>Category Group:</strong> {report.category}</li>
                <li>• <strong>MIME Header:</strong> {report.mimeType}</li>
                <li>• <strong>Magic Signature:</strong> {report.signatureMatch?.signature || report.magicBytesHex}</li>
              </ul>
            </div>
          </section>

          {/* Section: How to Open */}
          <section id="how-to-open" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-emerald-600" />
              <span>How to Open .{report.extension} Files</span>
            </h2>

            <div className="space-y-3">
              {report.openingSteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Recommended Software */}
          <section id="software" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-violet-600" />
              <span>Recommended Software Applications</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchedApps.length > 0 ? (
                matchedApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onNavigate({ view: 'software-detail', id: app.id })}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{app.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        app.priceType === 'Free' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {app.priceType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{app.description}</p>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 pt-1">
                      <span>View Application Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-4 text-center text-xs text-slate-500">
                  Universal viewers like VLC Media Player or 7-Zip support this format.
                </div>
              )}
            </div>
          </section>

          {/* Section: Platform Compatibility */}
          <section id="os-support" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop className="w-5 h-5 text-blue-600" />
              <span>Compatible Operating Systems</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['Windows', 'macOS', 'Linux', 'Android', 'iOS'].map((platform) => {
                const isSupported = report.signatureMatch?.supported_os.includes(
                  platform.toLowerCase() as any
                ) ?? true;
                return (
                  <div
                    key={platform}
                    className={`p-3 rounded-2xl border text-center space-y-1 ${
                      isSupported
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{platform}</div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block ${
                      isSupported
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {isSupported ? 'Supported' : 'Plugin Needed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section: Convert this file */}
          <section id="conversion" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <span>Convert .{report.extension} to Other Formats</span>
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Need to convert this file into a widely accessible format? Use our instant browser converter:
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate({ view: 'converters' })}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>Launch Converter Tool</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Section: Security */}
          <section id="security" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Security & Safety Check</span>
            </h2>

            <div className={`p-4 rounded-2xl border text-sm leading-relaxed space-y-2 ${
              report.securityRating === 'Low'
                ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-slate-700 dark:text-slate-300'
                : 'bg-amber-50/50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-slate-700 dark:text-slate-300'
            }`}>
              <div className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Threat Analysis Summary ({report.securityRating} Risk Rating)</span>
              </div>
              <p className="text-xs sm:text-sm">{report.threatNotes}</p>
            </div>
          </section>

          {/* Section: FAQs */}
          <section id="faq" className="scroll-mt-24">
            <FAQAccordion faqs={faqs} />
          </section>

          {/* Section: Schema Markup */}
          <section id="schema-meta" className="scroll-mt-24">
            <SchemaMarkupView schemaData={schemaJson} />
          </section>
        </div>
      </div>
    </div>
  );
};
