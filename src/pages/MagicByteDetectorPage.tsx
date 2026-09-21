import React, { useState, useRef } from 'react';
import {
  FileCode,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Upload,
  Copy,
  Check,
  Download,
  Share2,
  Cpu,
  ArrowRight,
  Terminal,
  Lock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';
import {
  analyzeMagicBytes,
  MagicByteAnalysisResult
} from '../data/expandedMimeDatabase';

interface MagicByteDetectorPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const MagicByteDetectorPage: React.FC<MagicByteDetectorPageProps> = ({ onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MagicByteAnalysisResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file) return;
    setIsAnalyzing(true);

    try {
      // Read first 512 bytes of file
      const slice = file.slice(0, 512);
      const arrayBuffer = await slice.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const result = analyzeMagicBytes(file, bytes);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Magic Byte Analysis Error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopySingle = (val: string, keyName: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyJson = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
    setCopiedKey('JSON');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    const reportText = `AnyFileX Security Utility - Magic Byte Binary Signature Report
==================================================
File Name:          ${analysisResult.fileName}
File Size:          ${analysisResult.fileSize.toLocaleString()} bytes
Uploaded Extension: .${analysisResult.expectedExtension}
Detected Format:    ${analysisResult.detectedFormat} (.${analysisResult.detectedExtension})
MIME Type:          ${analysisResult.mimeType}
Category:           ${analysisResult.category}

Binary Signatures:
--------------------------------------------------
Hex Header (32 bytes):
${analysisResult.hexSignature}

ASCII Header Representation:
${analysisResult.asciiSignature}

Security Assessment:
--------------------------------------------------
Status:   ${analysisResult.securitySeverity.toUpperCase()}
Message:  ${analysisResult.securityMessage}
Spoofed:  ${analysisResult.isSpoofed ? 'YES (CRITICAL ANOMALY DETECTED)' : 'NO'}

Analyzed At: ${analysisResult.analyzedAt}
==================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysisResult.fileName}_magic_bytes_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSampleFile = (type: 'pdf' | 'spoofed' | 'png' | 'zip') => {
    let filename = 'document_invoice_2026.pdf';
    let content = '%PDF-1.7\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog >>\nendobj';

    if (type === 'spoofed') {
      filename = 'urgent_unpaid_invoice.pdf';
      content = 'MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xFF\xFF\x00\x00PE\x00\x00BINARY_EXECUTABLE_PAYLOAD_SAMPLE';
    } else if (type === 'png') {
      filename = 'company_logo.png';
      content = '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x01\x00\x00\x00\x01\x00';
    } else if (type === 'zip') {
      filename = 'project_backup_archive.zip';
      content = 'PK\x03\x04\x14\x00\x00\x00\x08\x00ZIP_HEADER_DATA_SAMPLE_PAYLOAD';
    }

    const blob = new Blob([content], { type: 'application/octet-stream' });
    const sample = new File([blob], filename, { type: 'application/octet-stream' });
    handleProcessFile(sample);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const faqs = [
    {
      question: 'What are file magic bytes (binary signatures)?',
      answer: 'Magic bytes are unique fixed hexadecimal byte sequences embedded at the very beginning (offset 0) of binary file headers. For instance, all PDF documents begin with hexadecimal bytes 25 50 44 46 (%PDF), and all Windows executable programs start with 4D 5A (MZ).'
    },
    {
      question: 'How do hackers use file extension spoofing?',
      answer: 'Attackers frequently rename malicious Windows executable binaries (.exe) to appear as innocent documents (e.g., invoice.pdf or photo.jpg) to trick users into double-clicking them. Inspecting magic bytes detects extension spoofing regardless of what filename is shown.'
    },
    {
      question: 'Is my uploaded file safe when analyzing magic bytes here?',
      answer: 'Yes! AnyFileX processes files 100% locally in your web browser memory using standard JavaScript FileReader streams. No file data is ever uploaded to any cloud server.'
    }
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AnyFileX Magic Byte Binary Signature Detector',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'All',
    description: 'Inspect binary file headers, magic byte hex signatures, and detect malicious file extension spoofing in browser.'
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="Magic Byte Detector – Binary Header Signature Analyzer"
        description="Inspect raw hexadecimal magic byte signatures, identify true file types, and detect extension spoofing before opening unknown files."
        canonicalPath="/tools/magic-byte-detector"
        schemaData={schemaJson}
      />
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'Magic Byte Detector' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="violet" size="md">
          <FileCode className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Binary Header Inspection & Extension Spoofing Analyzer</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Magic Byte Binary Signature Detector
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Upload any file to analyze its true hexadecimal header magic bytes. Uncover hidden file types and detect extension spoofing before execution.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="max-w-4xl mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
            dragActive
              ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/40 shadow-xl scale-[1.005]'
              : 'border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:border-purple-400 dark:hover:border-purple-600 shadow-xs'
          }`}
        >
          <div className="p-8 sm:p-12 text-center space-y-6">
            {!isAnalyzing && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-inner">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Drop File to Analyze Binary Magic Bytes
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Supports any binary file, document, image, audio, video, or installer or{' '}
                    <span
                      onClick={() => fileInputRef.current?.click()}
                      className="text-purple-600 dark:text-purple-400 font-bold underline underline-offset-4 cursor-pointer"
                    >
                      browse local file
                    </span>
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleProcessFile(e.target.files[0]);
                    }
                  }}
                  id="magic-byte-file-input"
                />

                {/* Test Sample Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                    Or try a preset test scenario:
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => loadSampleFile('pdf')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      Genuine PDF Document
                    </button>
                    <button
                      onClick={() => loadSampleFile('spoofed')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      <span>Spoofed EXE disguised as PDF</span>
                    </button>
                    <button
                      onClick={() => loadSampleFile('png')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      PNG Image
                    </button>
                    <button
                      onClick={() => loadSampleFile('zip')}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      Zip Archive
                    </button>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% In-Browser Memory Reading • Private & Secure</span>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="space-y-4 py-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto animate-spin">
                  <Cpu className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Reading Binary Offset 0 Headers...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          {/* Top Security Banner */}
          <div
            className={`p-6 rounded-3xl border-2 space-y-4 ${
              analysisResult.securitySeverity === 'critical'
                ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100'
                : analysisResult.securitySeverity === 'warning'
                ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-100'
                : 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  analysisResult.securitySeverity === 'critical'
                    ? 'bg-rose-600 text-white'
                    : analysisResult.securitySeverity === 'warning'
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {analysisResult.securitySeverity === 'critical' ? (
                  <ShieldAlert className="w-7 h-7 animate-pulse" />
                ) : analysisResult.securitySeverity === 'warning' ? (
                  <AlertTriangle className="w-7 h-7" />
                ) : (
                  <ShieldCheck className="w-7 h-7" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-extrabold uppercase ${
                      analysisResult.securitySeverity === 'critical'
                        ? 'bg-rose-600 text-white'
                        : analysisResult.securitySeverity === 'warning'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {analysisResult.securitySeverity.toUpperCase()} STATUS
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300">
                    File: {analysisResult.fileName}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold">
                  {analysisResult.isSpoofed
                    ? 'Security Risk: File Extension Spoofing Detected!'
                    : 'Binary Signature Validated'}
                </h2>

                <p className="text-xs sm:text-sm leading-relaxed">{analysisResult.securityMessage}</p>
              </div>
            </div>
          </div>

          {/* Analysis Details Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Binary Magic Byte Inspection
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {analysisResult.detectedFormat}
                </h3>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedKey === 'JSON' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy JSON</span>
                </button>

                <button
                  onClick={handleDownloadReport}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>

            {/* Properties Comparison Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Uploaded Extension</span>
                <p className="text-base font-mono font-bold text-slate-900 dark:text-white">
                  .{analysisResult.expectedExtension}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Detected Format</span>
                <p className="text-base font-mono font-bold text-purple-600 dark:text-purple-400">
                  .{analysisResult.detectedExtension}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Detected MIME Type</span>
                <p className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                  {analysisResult.mimeType}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Content Category</span>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {analysisResult.category}
                </p>
              </div>
            </div>

            {/* Interactive Hex Viewer Box */}
            <div className="p-5 rounded-2xl bg-slate-950 text-white font-mono space-y-4 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-bold text-purple-400 uppercase">First 32 Header Bytes (Offset 0x00)</span>
                <span>Hexadecimal / ASCII Stream</span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Hex Stream:</span>
                  <p className="text-xs sm:text-sm text-emerald-400 break-all select-all p-3 rounded-xl bg-slate-900 border border-slate-800 font-bold">
                    {analysisResult.hexSignature}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">ASCII String Stream:</span>
                  <p className="text-xs sm:text-sm text-indigo-300 break-all select-all p-3 rounded-xl bg-slate-900 border border-slate-800 font-bold">
                    {analysisResult.asciiSignature}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto">
        <FAQAccordion faqs={faqs} />
      </div>

    </div>
  );
};
