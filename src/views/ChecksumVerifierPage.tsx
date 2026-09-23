'use client';

import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Copy,
  Check,
  Search,
  Terminal,
  Download,
  Cpu,
  ArrowRight,
  FileCode,
  Lock,
  Sparkles,
  HelpCircle,
  RefreshCw,
  FileText,
  Sliders,
  XCircle
} from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';
import {
  calculateFileHashes,
  FileHashResult,
  compareChecksums,
  HashAlgorithm
} from '../utils/hashUtils';

interface ChecksumVerifierPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const ChecksumVerifierPage: React.FC<ChecksumVerifierPageProps> = ({ onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [fileHashes, setFileHashes] = useState<FileHashResult | null>(null);
  const [expectedChecksum, setExpectedChecksum] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    isMatch: boolean;
    matchedAlgorithm?: HashAlgorithm;
    detectedType?: HashAlgorithm;
    cleanInput: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File, presetChecksum?: string) => {
    if (!file) return;
    setCurrentFile(file);
    setIsVerifying(true);

    try {
      const hashes = await calculateFileHashes(file);
      setFileHashes(hashes);

      const targetSum = presetChecksum !== undefined ? presetChecksum : expectedChecksum;
      if (targetSum.trim()) {
        const cmp = compareChecksums(targetSum, hashes);
        setVerificationResult(cmp);
      } else {
        setVerificationResult(null);
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChecksumInputChange = (text: string) => {
    setExpectedChecksum(text);
    if (fileHashes && text.trim()) {
      const cmp = compareChecksums(text, fileHashes);
      setVerificationResult(cmp);
    } else {
      setVerificationResult(null);
    }
  };

  const loadPresetSample = (status: 'match' | 'mismatch') => {
    const filename = 'ubuntu-24.04.1-desktop-amd64.iso';
    const content = 'UBUNTU_DESKTOP_24_04_RELEASE_OFFICIAL_ISO_PAYLOAD_2026';
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const sample = new File([blob], filename, { type: 'application/octet-stream' });

    if (status === 'match') {
      // Calculate real SHA256 of the payload dynamically, then feed as expected
      calculateFileHashes(sample).then((hashes) => {
        setExpectedChecksum(hashes.sha256);
        handleProcessFile(sample, hashes.sha256);
      });
    } else {
      // Intentionally invalid checksum
      const tamperedChecksum = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      setExpectedChecksum(tamperedChecksum);
      handleProcessFile(sample, tamperedChecksum);
    }
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
      question: 'What is checksum verification?',
      answer: 'Checksum verification compares the calculated cryptographic hash of a downloaded file against the official hash string published by the software developer. If the two strings match character for character, you can be 100% certain the downloaded file is authentic and uncorrupted.'
    },
    {
      question: 'What happens if the checksum result is a Mismatch?',
      answer: 'A mismatch means the downloaded file does NOT match the publisher\'s original binary. This usually indicates that the download was interrupted/corrupted, or in worst cases, that the file was altered by malware or tampered with on an untrusted mirror site. Do NOT execute or open mismatched installer files.'
    },
    {
      question: 'How do I find the official checksum for my software download?',
      answer: 'Most open-source projects, Linux distribution websites (Ubuntu, Fedora, Debian), and security software vendors publish checksum files (such as SHA256SUMS or checksum.txt) directly on their official download pages.'
    }
  ];

  const schemaHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Verify Downloaded File Checksums',
    description: 'Verify downloaded software installers, ISO images, and firmware against official publisher checksums.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Upload Downloaded File',
        text: 'Select or drag your downloaded .iso, .exe, or archive file into Checksum Verifier.'
      },
      {
        '@type': 'HowToStep',
        name: 'Paste Original Checksum',
        text: 'Paste the official MD5, SHA-1, SHA-256, or SHA-512 string from the software publisher.'
      },
      {
        '@type': 'HowToStep',
        name: 'Check Result',
        text: 'Instantly verify if the file matches or shows a corruption mismatch.'
      }
    ]
  };

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AnyFileX Download Checksum Verifier',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'All',
    description: 'Verify downloaded file integrity by comparing MD5, SHA1, SHA256, and SHA512 checksums against publisher signatures.'
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="Checksum Verifier – Compare SHA256 & MD5 Hashes"
        description="Verify software download integrity and detect corrupted or tampered files by comparing SHA-256, SHA-512, MD5 checksums."
        canonicalPath="/tools/checksum-verifier"
        schemaData={schemaJson}
      />
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'Checksum Verifier' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="emerald" size="md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Software Download Verification & Integrity Tool</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          File Checksum Verifier
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Verify downloaded ISOs, software installers, and archives against publisher signatures. Ensure your downloads are authentic and free from malware or corruption.
        </p>
      </div>

      {/* Main Interactive Checksum Verifier Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 max-w-4xl mx-auto">
        {/* Step 1 & Step 2 Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: File Selection */}
          <div className="space-y-3">
            <label className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
              <span>Select Downloaded File</span>
            </label>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-3 transition-all cursor-pointer ${
                dragActive
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                  : currentFile
                  ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
              {currentFile ? (
                <div className="space-y-1">
                  <p className="font-bold text-xs text-slate-900 dark:text-white break-all">{currentFile.name}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    File Loaded ({(currentFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-bold text-xs text-slate-700 dark:text-slate-300">Drop file here or click to browse</p>
                  <p className="text-[11px] text-slate-400">ISOs, installers, .zip, .exe, .dmg, firmware</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleProcessFile(e.target.files[0]);
                  }
                }}
                id="checksum-file-input"
              />
            </div>
          </div>

          {/* Box 2: Publisher Hash Input */}
          <div className="space-y-3">
            <label className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <span>Paste Official Checksum</span>
            </label>

            <div className="space-y-2">
              <textarea
                rows={3}
                value={expectedChecksum}
                onChange={(e) => handleChecksumInputChange(e.target.value)}
                placeholder="Paste the official SHA-256, SHA-512, SHA-384, MD5, SHA-1, or CRC-32 checksum published by vendor..."
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
              />

              {/* Detected Algorithm Tag */}
              {verificationResult?.detectedType && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  Detected Input Algorithm: {verificationResult.detectedType} ({verificationResult.cleanInput.length} chars)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Preset Sample Triggers */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Test Interactive Verification Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadPresetSample('match')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulate Genuine File (MATCH)</span>
            </button>
            <button
              onClick={() => loadPresetSample('mismatch')}
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Tampered File (MISMATCH)</span>
            </button>
          </div>
        </div>

        {/* Verifying Loader State */}
        {isVerifying && (
          <div className="text-center py-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-spin">
              <Cpu className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">Calculating File Checksums in Browser...</p>
          </div>
        )}

        {/* Verification Result Banner & Comparison View */}
        {fileHashes && expectedChecksum.trim() && !isVerifying && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-300">
            {verificationResult?.isMatch ? (
              /* MATCH STATE */
              <div className="p-6 rounded-3xl bg-emerald-500/10 dark:bg-emerald-950/40 border-2 border-emerald-500 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-xs font-extrabold uppercase">
                        MATCH VERIFIED
                      </span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                        Algorithm: {verificationResult.matchedAlgorithm}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      File Integrity Authenticated!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      The calculated checksum for <strong>{fileHashes.fileName}</strong> matches the official publisher hash identically. The file is authentic, uncorrupted, and safe to execute.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
                    <span>MATCHED {verificationResult.matchedAlgorithm} CHECKSUM</span>
                    <span className="text-emerald-400 font-bold">100% MATCH</span>
                  </div>
                  <p className="text-emerald-400 break-all select-all font-bold">
                    {verificationResult.cleanInput}
                  </p>
                </div>
              </div>
            ) : (
              /* MISMATCH STATE */
              <div className="p-6 rounded-3xl bg-rose-500/10 dark:bg-rose-950/40 border-2 border-rose-500 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/30">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono text-xs font-extrabold uppercase">
                        CHECKSUM MISMATCH
                      </span>
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-300 font-mono">
                        WARNING: INVALID FILE
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      File Verification Failed!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      The checksum calculated for <strong>{fileHashes.fileName}</strong> does NOT match your expected publisher signature across CRC-32, MD5, SHA-1, SHA-256, SHA-384, or SHA-512. The file may be incomplete, corrupted during download, or modified.
                    </p>
                  </div>
                </div>

                {/* Diff Comparison Table */}
                <div className="p-4 rounded-2xl bg-slate-950 text-white font-mono text-xs space-y-3 border border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[11px] text-rose-400 font-bold block uppercase">Expected Publisher Checksum:</span>
                    <p className="text-slate-300 break-all p-2 bg-slate-900 rounded-lg border border-slate-800">
                      {verificationResult?.cleanInput}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-amber-400 font-bold block uppercase">Calculated File SHA-256:</span>
                    <p className="text-emerald-400 break-all p-2 bg-slate-900 rounded-lg border border-slate-800">
                      {fileHashes.sha256}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Command Line Checksum Guide Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            How to Verify Checksums via Native Terminal / Command Line
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Windows PowerShell */}
          <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-3">
            <span className="px-2.5 py-1 rounded-md bg-blue-600 font-bold text-[10px] text-white uppercase block w-max">
              Windows PowerShell
            </span>
            <p className="text-slate-400 font-sans text-xs">Run command in PowerShell:</p>
            <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 select-all border border-slate-800 break-all">
              Get-FileHash -Algorithm SHA256 filename.iso
            </div>
          </div>

          {/* macOS Terminal */}
          <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-3">
            <span className="px-2.5 py-1 rounded-md bg-indigo-600 font-bold text-[10px] text-white uppercase block w-max">
              macOS Terminal
            </span>
            <p className="text-slate-400 font-sans text-xs">Run command in Terminal:</p>
            <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 select-all border border-slate-800 break-all">
              shasum -a 256 filename.iso
            </div>
          </div>

          {/* Linux Terminal */}
          <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-3">
            <span className="px-2.5 py-1 rounded-md bg-emerald-600 font-bold text-[10px] text-white uppercase block w-max">
              Linux Bash
            </span>
            <p className="text-slate-400 font-sans text-xs">Run command in Bash:</p>
            <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 select-all border border-slate-800 break-all">
              sha256sum filename.iso
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto">
        <FAQAccordion faqs={faqs} />
      </div>

    </div>
  );
};
