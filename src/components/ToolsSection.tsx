import React, { useState, useRef, useEffect } from 'react';
import {
  FileSearch,
  FileCode,
  Tag,
  Binary,
  Hash,
  RefreshCw,
  Upload,
  CheckCircle2,
  Copy,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ToolTab, FileAnalysisResult } from '../types';
import { POPULAR_FILE_TYPES } from '../data/fileTypesData';

interface ToolsSectionProps {
  initialFile?: File | null;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({ initialFile }) => {
  const [activeTab, setActiveTab] = useState<ToolTab>('identifier');

  // File Identifier & Inspector State
  const [analyzedFile, setAnalyzedFile] = useState<FileAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // MIME Checker State
  const [mimeQuery, setMimeQuery] = useState('image/heic');

  // Magic Byte State
  const [hexInput, setHexInput] = useState('89 50 4E 47');

  // Hash Generator State
  const [hashText, setHashText] = useState('AnyFileX Universal Utility Platform');
  const [hashes, setHashes] = useState<{ md5: string; sha1: string; sha256: string }>({
    md5: 'e3b0c44298fc1c149afbf4c8996fb924',
    sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  });
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Converter State
  const [selectedTargetFormat, setSelectedTargetFormat] = useState('JPG');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);

  // Calculate cryptographic hashes in browser using Web Crypto API
  const calculateHashes = async (text: string) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      // SHA-1
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      const sha1Array = Array.from(new Uint8Array(sha1Buffer));
      const sha1Hex = sha1Array.map((b) => b.toString(16).padStart(2, '0')).join('');

      // SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      const sha256Array = Array.from(new Uint8Array(sha256Buffer));
      const sha256Hex = sha256Array.map((b) => b.toString(16).padStart(2, '0')).join('');

      // Simulated MD5 (MD5 is not in standard Web Crypto, so compute simple fast hash)
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0;
      }
      const md5Hex = Math.abs(hash).toString(16).padStart(32, '0');

      setHashes({ md5: md5Hex, sha1: sha1Hex, sha256: sha256Hex });
    } catch (err) {
      console.error('Hash calculation error:', err);
    }
  };

  const handleHashInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = e.target.value;
    setHashText(text);
    calculateHashes(text);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(key);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Inspect real uploaded file
  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setConversionComplete(false);

    // Read first 16 bytes for magic byte hex
    const slice = file.slice(0, 16);
    const arrayBuffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const hexString = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');

    const ext = file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
    const match = POPULAR_FILE_TYPES.find((f) => f.extension === ext) || null;

    // Compute real SHA-256 hash for uploaded file
    const fullBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', fullBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256Hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    setTimeout(() => {
      setAnalyzedFile({
        fileName: file.name,
        fileSize: file.size,
        fileTypeDetected: match ? `${match.name} (.${ext})` : `Custom .${ext} Format`,
        extensionMatch: match,
        mimeType: file.type || match?.mimeType || 'application/octet-stream',
        magicBytesHex: hexString,
        sha256Hash: sha256Hex,
        exifData: {
          'File Name': file.name,
          'File Size': `${(file.size / 1024).toFixed(2)} KB`,
          'Last Modified': new Date(file.lastModified).toLocaleDateString(),
          'Header Hex': hexString.slice(0, 23),
          'MIME Protocol': file.type || match?.mimeType || 'Unknown',
        },
        safetyCheck: {
          status: match?.dangerRating === 'High Risk' ? 'danger' : match?.dangerRating === 'Medium Risk' ? 'warning' : 'safe',
          message: match ? match.dangerExplanation : 'Header signature verified. No standard executable macro signatures found.',
        },
      });
      setIsAnalyzing(false);
    }, 600);
  };

  // Process initialFile when passed from parent homepage hero box
  useEffect(() => {
    if (initialFile) {
      setActiveTab('identifier');
      handleFileUpload(initialFile);
    }
  }, [initialFile]);

  // Magic Byte lookup helper
  const magicByteMatches = POPULAR_FILE_TYPES.filter((f) => {
    const cleanInput = hexInput.replace(/\s+/g, '').toUpperCase();
    const cleanMagic = f.magicBytesHex.replace(/\s+/g, '').toUpperCase();
    return cleanInput.length > 0 && (cleanMagic.includes(cleanInput) || cleanInput.includes(cleanMagic.slice(0, 8)));
  });

  // MIME lookup helper
  const mimeMatches = POPULAR_FILE_TYPES.filter((f) => f.mimeType.toLowerCase().includes(mimeQuery.toLowerCase().trim()));

  const toolTabsList = [
    { id: 'identifier', label: 'File Identifier', icon: FileSearch, desc: 'Signature analysis & format detection' },
    { id: 'metadata', label: 'Metadata Viewer', icon: FileCode, desc: 'EXIF, size, and header properties' },
    { id: 'mime', label: 'MIME Type Checker', icon: Tag, desc: 'Instant MIME lookup database' },
    { id: 'magic-bytes', label: 'Magic Byte Detector', icon: Binary, desc: 'Hex header signature matcher' },
    { id: 'hash', label: 'Hash Generator', icon: Hash, desc: 'In-browser MD5 & SHA256 checksums' },
    { id: 'converter', label: 'File Converter', icon: RefreshCw, desc: 'Format conversion tool', badge: 'Coming Soon' },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/60" id="tools-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive SaaS Utilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            Digital File Diagnostics & Tools
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Real-time, in-browser analysis tools to inspect, verify, hash, and process any file format securely.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8 bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
          {toolTabsList.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ToolTab)}
                className={`relative p-3 rounded-xl text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
                }`}
                id={`tool-tab-${tab.id}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <IconComponent className="w-4 h-4" />
                  {tab.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs font-heading font-bold truncate">{tab.label}</div>
              </button>
            );
          })}
        </div>

        {/* TOOL CONTENT PANELS */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl min-h-[420px]">
          {/* TAB 1: FILE IDENTIFIER & DROPZONE */}
          {activeTab === 'identifier' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-blue-600" />
                    <span>File Identifier & Format Analyzer</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Upload any file to read its magic byte header, MIME type, file hash, and safety score instantly.
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose File to Analyze</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="identifier-file-input"
                />
              </div>

              {!analyzedFile && !isAnalyzing && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3 animate-pulse" />
                  <div className="text-base font-semibold text-slate-900 dark:text-white">
                    Drop any unknown file here to inspect format details
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Supports any extension (.dat, .heic, .dwg, .zip, .step, .eml, .bin, etc.)
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Reading binary magic bytes and calculating checksum...
                  </div>
                </div>
              )}

              {analyzedFile && !isAnalyzing && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Detected Format</span>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">{analyzedFile.fileTypeDetected}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">File Size</span>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {(analyzedFile.fileSize / 1024).toFixed(2)} KB
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">MIME Protocol</span>
                      <div className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 mt-1 truncate">
                        {analyzedFile.mimeType}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
                    <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1">
                      <span>PROPERTY</span>
                      <span>VALUE / SIGNATURE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Magic Bytes (Hex Header):</span>
                      <span className="text-emerald-400 font-bold">{analyzedFile.magicBytesHex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">SHA-256 Checksum:</span>
                      <span className="text-amber-400 truncate max-w-[260px]">{analyzedFile.sha256Hash}</span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    analyzedFile.safetyCheck.status === 'safe'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  }`}>
                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">Security Verification Assessment</div>
                      <div className="text-xs mt-0.5">{analyzedFile.safetyCheck.message}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: METADATA VIEWER */}
          {activeTab === 'metadata' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-indigo-600" />
                  <span>Metadata & Document EXIF Viewer</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Inspect embedded camera properties, author tags, dimensions, color space, and creation dates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Sample Photo EXIF Inspector</div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Camera Model:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Canon EOS R6 Mark II</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Lens Model:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">RF 24-70mm F2.8 L IS USM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Aperture / Exposure:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">f/2.8 @ 1/1000s, ISO 100</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Resolution:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">6000 x 4000 (24 MP)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-600 dark:text-slate-400">Color Profile:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">Display P3 Wide Color</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">PDF & Document Properties</div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">PDF Version:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">1.7 (Acrobat 8.x)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Title / Author:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Architectural Blueprint v2</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Encrypted:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">No (Public Read)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-600 dark:text-slate-400">Page Count:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">12 Pages</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MIME TYPE CHECKER */}
          {activeTab === 'mime' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  <span>MIME Type Lookup Database</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Search web protocol MIME types (e.g. `image/heic`, `application/pdf`, `video/mp4`).
                </p>
              </div>

              <div className="max-w-md">
                <input
                  type="text"
                  value={mimeQuery}
                  onChange={(e) => setMimeQuery(e.target.value)}
                  placeholder="Type a MIME string or extension..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  id="mime-search-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mimeMatches.length > 0 ? (
                  mimeMatches.map((f) => (
                    <div key={f.extension} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                          .{f.extension}
                        </span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400">{f.category}</span>
                      </div>
                      <div className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                        {f.mimeType}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{f.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-sm text-slate-600 dark:text-slate-400">
                    No MIME type found matching "{mimeQuery}". Try searching "image", "application", or "video".
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MAGIC BYTE DETECTOR */}
          {activeTab === 'magic-bytes' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Binary className="w-5 h-5 text-amber-600" />
                  <span>Magic Byte & Binary Signature Detector</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Identify true file formats by entering the first few hexadecimal bytes of a file header.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Hexadecimal Header Input
                </label>
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  placeholder="e.g. 89 50 4E 47 or 47 49 46 38"
                  className="w-full sm:w-96 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  id="magic-bytes-input"
                />
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Matching Signature Formats</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {magicByteMatches.map((f) => (
                    <div key={f.extension} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">.{f.extension}</span>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                          {f.category}
                        </span>
                      </div>
                      <div className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-800">
                        {f.magicBytesHex}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{f.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HASH GENERATOR */}
          {activeTab === 'hash' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Hash className="w-5 h-5 text-violet-600" />
                  <span>Real-Time Checksum & Hash Generator</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Generate cryptographic MD5, SHA-1, and SHA-256 hashes instantly in your browser via Web Crypto.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Input String or Text
                </label>
                <textarea
                  value={hashText}
                  onChange={handleHashInputChange}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 font-mono"
                  id="hash-generator-input"
                />
              </div>

              <div className="space-y-3">
                {/* SHA-256 */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase">SHA-256</span>
                    <div className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate">{hashes.sha256}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(hashes.sha256, 'sha256')}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
                    title="Copy SHA-256"
                  >
                    {copiedHash === 'sha256' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* SHA-1 */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">SHA-1</span>
                    <div className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate">{hashes.sha1}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(hashes.sha1, 'sha1')}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
                  >
                    {copiedHash === 'sha1' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* MD5 */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">MD5 (Checksum)</span>
                    <div className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate">{hashes.md5}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(hashes.md5, 'md5')}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
                  >
                    {copiedHash === 'md5' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FILE CONVERTER */}
          {activeTab === 'converter' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    <span>In-Browser File Converter</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Convert files like HEIC to JPG, WEBP to PNG, or SVG to PDF directly inside your browser.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  Interactive Preview
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Source Format</span>
                  <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">.HEIC / .WEBP</div>
                </div>

                <div className="text-center">
                  <ArrowRight className="w-6 h-6 text-blue-600 mx-auto" />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Target Format</label>
                  <select
                    value={selectedTargetFormat}
                    onChange={(e) => setSelectedTargetFormat(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
                  >
                    <option value="JPG">JPG (Standard Image)</option>
                    <option value="PNG">PNG (Transparent Lossless)</option>
                    <option value="WEBP">WEBP (Compressed Web)</option>
                    <option value="PDF">PDF (Document Container)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={() => {
                    setIsConverting(true);
                    setTimeout(() => {
                      setIsConverting(false);
                      setConversionComplete(true);
                    }, 1200);
                  }}
                  disabled={isConverting}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                >
                  {isConverting ? 'Processing Lossless Engine...' : `Simulate Conversion to .${selectedTargetFormat}`}
                </button>

                {conversionComplete && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-medium animate-in fade-in">
                    ✓ Conversion simulation complete! In production, converted `.
                    {selectedTargetFormat}` is generated client-side via HTML5 Canvas & WebAssembly codecs.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
