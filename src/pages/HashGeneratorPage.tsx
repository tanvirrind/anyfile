import React, { useState, useRef } from 'react';
import {
  Hash,
  ShieldCheck,
  Copy,
  Check,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  FileCode,
  Sliders,
  Terminal,
  HelpCircle,
  FileText,
  Search,
  RefreshCw,
  Cpu,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { FAQAccordion } from '../components/FAQAccordion';
import { SchemaMarkupView } from '../components/SchemaMarkupView';
import { SEOHead } from '../components/SEOHead';
import {
  calculateFileHashes,
  FileHashResult,
  compareChecksums,
  HashAlgorithm
} from '../utils/hashUtils';

interface HashGeneratorPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const HashGeneratorPage: React.FC<HashGeneratorPageProps> = ({ onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileHashes, setFileHashes] = useState<FileHashResult | null>(null);
  const [copiedAlgo, setCopiedAlgo] = useState<string | null>(null);
  const [useUppercase, setUseUppercase] = useState(false);
  const [compareInput, setCompareInput] = useState('');
  const [comparisonResult, setComparisonResult] = useState<{
    isMatch: boolean;
    matchedAlgorithm?: HashAlgorithm;
    detectedType?: HashAlgorithm;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    setCompareInput('');
    setComparisonResult(null);

    try {
      const result = await calculateFileHashes(file, (p) => setProgress(p));
      setFileHashes(result);
    } catch (err) {
      console.error('Failed to calculate hashes:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompareInputChange = (text: string) => {
    setCompareInput(text);
    if (!fileHashes) return;

    if (!text.trim()) {
      setComparisonResult(null);
      return;
    }

    const cmp = compareChecksums(text, fileHashes);
    setComparisonResult(cmp);
  };

  const handleCopyHash = (value: string, algo: string) => {
    const formatted = useUppercase ? value.toUpperCase() : value.toLowerCase();
    navigator.clipboard.writeText(formatted);
    setCopiedAlgo(algo);
    setTimeout(() => setCopiedAlgo(null), 2000);
  };

  const handleCopyAllHashes = () => {
    if (!fileHashes) return;
    const text = `File: ${fileHashes.fileName}\nSize: ${fileHashes.formattedSize}\nMD5: ${
      useUppercase ? fileHashes.md5.toUpperCase() : fileHashes.md5
    }\nSHA-1: ${
      useUppercase ? fileHashes.sha1.toUpperCase() : fileHashes.sha1
    }\nSHA-256: ${
      useUppercase ? fileHashes.sha256.toUpperCase() : fileHashes.sha256
    }\nSHA-512: ${
      useUppercase ? fileHashes.sha512.toUpperCase() : fileHashes.sha512
    }`;
    navigator.clipboard.writeText(text);
    setCopiedAlgo('ALL');
    setTimeout(() => setCopiedAlgo(null), 2000);
  };

  const handleDownloadReport = () => {
    if (!fileHashes) return;
    const reportText = `OpenAnyFile.net Security Utility - File Hash Report
==================================================
File Name:      ${fileHashes.fileName}
File Size:      ${fileHashes.formattedSize} (${fileHashes.fileSize} bytes)
MIME Type:      ${fileHashes.mimeType}
Calculated At:  ${fileHashes.calculatedAt}

Cryptographic Hashes:
--------------------------------------------------
MD5:     ${useUppercase ? fileHashes.md5.toUpperCase() : fileHashes.md5}
SHA-1:   ${useUppercase ? fileHashes.sha1.toUpperCase() : fileHashes.sha1}
SHA-256: ${useUppercase ? fileHashes.sha256.toUpperCase() : fileHashes.sha256}
SHA-512: ${useUppercase ? fileHashes.sha512.toUpperCase() : fileHashes.sha512}

Security Notice:
Hashes calculated 100% locally in browser memory via Web Crypto API.
Zero file payload transmitted to external servers.
==================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileHashes.fileName}_hashes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const createSampleFile = (type: 'zip' | 'iso' | 'exe') => {
    let filename = 'ubuntu-24.04-desktop-amd64.iso';
    let content = 'UBUNTU_ISO_PAYLOAD_SAMPLE_HEADER_DATA_2026';

    if (type === 'zip') {
      filename = 'backup_database_archive.zip';
      content = 'ZIP_HEADER_PK_SAMPLE_DATA_ENCRYPTED_STREAM';
    } else if (type === 'exe') {
      filename = 'setup_installer_v3.2.exe';
      content = 'MZ_PE_EXECUTABLE_SAMPLE_BINARY_STREAM';
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
      question: 'What is a cryptographic file hash generator?',
      answer: 'A file hash generator runs a mathematical algorithm (such as MD5, SHA-1, SHA-256, or SHA-512) over the binary data of a file to calculate a unique fixed-length string fingerprint. If even a single byte inside the file changes, the generated hash will alter completely.'
    },
    {
      question: 'Is my file uploaded to a server to compute hashes?',
      answer: 'No! All checksum calculations execute 100% locally in your web browser RAM using Web Crypto API (`crypto.subtle`) and JavaScript Uint8Array streams. Your file never leaves your computer.'
    },
    {
      question: 'Why should I use SHA-256 over MD5 or SHA-1?',
      answer: 'MD5 and SHA-1 are legacy hash algorithms that are vulnerable to collision attacks (where two different files produce the same hash). SHA-256 and SHA-512 are modern cryptographic standards recommended by security experts for verifying software integrity and digital signatures.'
    },
    {
      question: 'How do I compare a downloaded file checksum against a publisher hash?',
      answer: 'After generating hashes for your file, paste the official checksum provided by the software vendor into the "Compare Hash" field. The tool will instantly check all algorithms and highlight if your file is genuine or corrupted.'
    }
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'OpenAnyFile Online File Hash Generator & SHA256 Checker',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'All',
    description: 'Calculate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes locally in your browser. Verify file integrity and compare checksums instantly.'
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="File Hash Generator – SHA256, SHA512, MD5, SHA1 Calculator"
        description="Calculate cryptographic SHA-256, MD5, SHA-1, and SHA-512 hashes in your browser with zero server uploads using Web Crypto API."
        canonicalPath="/tools/hash-generator"
        schemaData={schemaJson}
      />
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'File Hash Generator' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="violet" size="md">
          <Hash className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Client-Side Security & Cryptographic Hash Engine</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Online File Hash Generator & SHA256 Checker
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Calculate MD5, SHA-1, SHA-256, and SHA-512 checksum fingerprints to verify file integrity. 100% private in-browser Web Crypto processing.
        </p>
      </div>

      {/* Main Upload Zone */}
      <div className="max-w-4xl mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-xl scale-[1.005]'
              : 'border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs'
          }`}
        >
          <div className="p-8 sm:p-12 text-center space-y-6">
            {!isProcessing && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Select File to Calculate Cryptographic Hashes
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Drop any binary file, ISO, installer, archive, or document here or{' '}
                    <span
                      onClick={() => fileInputRef.current?.click()}
                      className="text-indigo-600 dark:text-indigo-400 font-bold underline underline-offset-4 cursor-pointer"
                    >
                      browse file
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
                  id="hash-generator-file-input"
                />

                {/* Test Sample Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                    Or try a sample test binary file:
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => createSampleFile('iso')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      Ubuntu ISO Image (.iso)
                    </button>
                    <button
                      onClick={() => createSampleFile('zip')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      Zip Archive (.zip)
                    </button>
                    <button
                      onClick={() => createSampleFile('exe')}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      Executable Setup (.exe)
                    </button>
                  </div>
                </div>

                {/* Security Reassurance */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>In-Browser Web Crypto Processing • 100% Private & Offline</span>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-6 max-w-md mx-auto py-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
                  <Cpu className="w-7 h-7 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">Calculating Cryptographic Hashes...</h4>
                  <p className="text-xs text-slate-500">Processing MD5, SHA-1, SHA-256, and SHA-512 in browser RAM</p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-400 font-mono font-bold block">{progress}% Complete</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hash Results Section */}
      {fileHashes && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          {/* File Overview Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Target File Loaded
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-all">
                  {fileHashes.fileName}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>Size: <strong>{fileHashes.formattedSize}</strong> ({fileHashes.fileSize.toLocaleString()} bytes)</span>
                  <span>•</span>
                  <span>Type: <strong>{fileHashes.mimeType}</strong></span>
                </div>
              </div>

              {/* Controls Header */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setUseUppercase(!useUppercase)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-colors cursor-pointer ${
                    useUppercase
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {useUppercase ? 'UPPERCASE HEX' : 'lowercase hex'}
                </button>

                <button
                  onClick={handleCopyAllHashes}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  {copiedAlgo === 'ALL' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAlgo === 'ALL' ? 'All Copied!' : 'Copy All'}</span>
                </button>

                <button
                  onClick={handleDownloadReport}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Export hashes as TXT file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Compare Checksum Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-indigo-600" />
                <span>Compare Checksum (Paste expected hash from vendor or developer)</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={compareInput}
                  onChange={(e) => handleCompareInputChange(e.target.value)}
                  placeholder="Paste expected MD5, SHA-1, SHA-256, or SHA-512 hash string..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                {compareInput && (
                  <button
                    onClick={() => handleCompareInputChange('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Match Result Status Banner */}
              {comparisonResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-3 ${
                    comparisonResult.isMatch
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  {comparisonResult.isMatch ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Checksum Match Verified!</p>
                        <p className="text-xs">
                          Your input hash matches the calculated <strong>{comparisonResult.matchedAlgorithm}</strong> fingerprint. File integrity is authentic and intact.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Checksum Mismatch Warning!</p>
                        <p className="text-xs">
                          The input checksum does not match MD5, SHA-1, SHA-256, or SHA-512. The file may be corrupted or modified.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Individual Algorithm Hash Cards */}
          <div className="space-y-4">
            {[
              { algo: 'SHA-256', val: fileHashes.sha256, recommended: true, bits: '256-bit', desc: 'Modern NIST cryptographic standard recommended for software verification.' },
              { algo: 'SHA-512', val: fileHashes.sha512, recommended: false, bits: '512-bit', desc: 'High-security 512-bit cryptographic hash for ultra-critical integrity.' },
              { algo: 'SHA-1', val: fileHashes.sha1, recommended: false, bits: '160-bit', desc: 'Legacy 160-bit hash algorithm (used in Git commits and legacy checksums).' },
              { algo: 'MD5', val: fileHashes.md5, recommended: false, bits: '128-bit', desc: 'Fast legacy 128-bit checksum algorithm for basic download checking.' },
            ].map(({ algo, val, recommended, bits, desc }) => {
              const displayVal = useUppercase ? val.toUpperCase() : val.toLowerCase();
              const isComparedMatch = comparisonResult?.isMatch && comparisonResult.matchedAlgorithm === algo;

              return (
                <div
                  key={algo}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all ${
                    isComparedMatch
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-slate-900 dark:text-white font-mono">{algo}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px] font-bold">
                        {bits}
                      </span>
                      {recommended && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          Recommended
                        </span>
                      )}
                      {isComparedMatch && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Matched
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopyHash(val, algo)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
                    >
                      {copiedAlgo === algo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAlgo === algo ? 'Copied' : `Copy ${algo}`}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">{desc}</p>

                  <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm break-all select-all border border-slate-800">
                    {displayVal}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Nav Button to Checksum Verifier */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-base">Verifying a downloaded software installer or OS ISO?</h4>
              <p className="text-xs text-slate-300">
                Use our dedicated Checksum Verifier tool to paste original vendor checksums.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ view: 'checksum-verifier' })}
              className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Open Checksum Verifier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SEO Explainer Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Understanding Cryptographic Hashes & Checksums
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Why software developers and security professionals rely on SHA-256 for integrity verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Detecting File Corruption</span>
            </h3>
            <p>
              When downloading large files (like operating system ISOs, firmware binaries, or database archives) over unstable network connections, packet loss can corrupt silent bytes inside the file. Calculating the SHA-256 hash guarantees the downloaded file is 100% identical to the source.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>Protecting Against Malware Tampering</span>
            </h3>
            <p>
              Malicious actors often clone popular open-source software installers and inject backdoor spyware before re-hosting on unofficial mirrors. Comparing official SHA-256 published signatures ensures you never execute tampered executables.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto">
        <FAQAccordion faqs={faqs} />
      </div>

      {/* Schema.org Structured Data */}
      <div className="max-w-4xl mx-auto">
        <SchemaMarkupView schemaData={schemaJson} />
      </div>
    </div>
  );
};
