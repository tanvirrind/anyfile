import React, { useState, useEffect } from 'react';
import {
  Zap,
  FileCode,
  Hash,
  Binary,
  Search,
  CheckCircle2,
  ShieldOff,
  ArrowRight,
  Code2,
  Cpu,
  RefreshCw,
  Wrench,
  FileText,
  Lock,
  Sparkles,
  Sliders,
  FolderArchive,
  Image as ImageIcon,
  Layers,
  ShieldCheck,
  Mail,
  Box
} from 'lucide-react';
import { AppRoute, ToolTab } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import { TOOLS_REGISTRY, getAllTools, ToolDefinition } from '../lib/tools/toolsRegistry';
import { FORMATS_REGISTRY } from '../lib/converter/registry';

interface ToolsPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedCategory?: string;
  selectedToolId?: ToolTab;
}

interface ToolDisplayCard {
  id: string;
  name: string;
  category: string;
  desc: string;
  route: AppRoute;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  badge?: string;
  processingType: 'local' | 'server';
  isPopular?: boolean;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({
  onNavigate,
  selectedCategory: initialCategoryProp,
  selectedToolId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (initialCategoryProp) {
      const lower = initialCategoryProp.toLowerCase();
      if (lower === 'email' || lower === 'emails' || lower === 'mail') return 'Email & Mail';
      if (lower === 'cad' || lower === '3d') return '3D & CAD';
      if (lower === 'image' || lower === 'images') return 'Images';
      if (lower === 'document' || lower === 'documents') return 'Documents';
      if (lower === 'archive' || lower === 'archives') return 'Archives';
      if (lower === 'data') return 'Data & Privacy';
      if (lower === 'developer' || lower === 'security') return 'Developer & Security';
      if (lower === 'audio') return 'Audio';
      if (lower === 'video') return 'Video';
    }
    return 'All';
  });

  // "I have [X] -> I want [Y]" Quick Tool Selector Matrix
  const [sourceFormat, setSourceFormat] = useState('heic');
  const [targetFormat, setTargetFormat] = useState('jpg');

  const toolsList: ToolDisplayCard[] = [
    // Image Tools
    {
      id: 'image-compressor',
      name: 'Browser Image Compressor',
      category: 'Images',
      desc: 'Compress JPG, PNG, WEBP & HEIC images with interactive quality slider, percentage reduction metrics, and batch ZIP export.',
      route: { view: 'tool-detail', slug: 'image-compressor' } as any,
      icon: Sliders,
      tags: ['Quality Slider', 'Before/After Metrics', 'Batch ZIP', 'RAM Only'],
      badge: 'Popular Image Tool',
      processingType: 'local',
      isPopular: true
    },
    {
      id: 'heic-to-jpg',
      name: 'HEIC to JPG Converter',
      category: 'Images',
      desc: 'Convert Apple iPhone HEIC/HEIF photos to universal JPG format with zero cloud uploads and instant batch download.',
      route: { view: 'tool-detail', slug: 'heic-to-jpg' } as any,
      icon: ImageIcon,
      tags: ['iPhone Photos', 'Wasm Engine', 'Batch Queue', 'Zero Upload'],
      badge: 'Popular Converter',
      processingType: 'local',
      isPopular: true
    },
    {
      id: 'png-to-webp',
      name: 'PNG to WEBP Converter',
      category: 'Images',
      desc: 'Optimize heavy PNG graphics into lightweight WebP format for fast web pages with alpha transparency preserved.',
      route: { view: 'tool-detail', slug: 'png-to-webp' } as any,
      icon: RefreshCw,
      tags: ['Web Optimizer', 'Alpha Transparency', 'Fast Web', 'RAM Only'],
      badge: 'Web Optimizer',
      processingType: 'local',
      isPopular: true
    },
    {
      id: 'webp-to-jpg',
      name: 'WEBP to JPG Converter',
      category: 'Images',
      desc: 'Convert modern WebP images into universally compatible standard JPG format for Photoshop and desktop viewers.',
      route: { view: 'tool-detail', slug: 'webp-to-jpg' } as any,
      icon: ImageIcon,
      tags: ['Universal Format', 'Photoshop Ready', 'Local Decode'],
      processingType: 'local'
    },
    {
      id: 'jpg-to-png',
      name: 'JPG to PNG Converter',
      category: 'Images',
      desc: 'Convert compressed JPG pictures into lossless PNG format with zero re-compression degradation.',
      route: { view: 'tool-detail', slug: 'jpg-to-png' } as any,
      icon: ImageIcon,
      tags: ['Lossless Container', 'Universal Design', 'RAM Only'],
      processingType: 'local'
    },
    {
      id: 'svg-to-png',
      name: 'SVG to PNG Converter',
      category: 'Images',
      desc: 'Rasterize XML vector SVG graphics into high-resolution transparent PNG bitmap images.',
      route: { view: 'tool-detail', slug: 'svg-to-png' } as any,
      icon: Code2,
      tags: ['Vector Rasterizer', 'High DPI', 'Transparent PNG'],
      processingType: 'local'
    },

    // Document Tools
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG Page Converter',
      category: 'Documents',
      desc: 'Extract and render PDF document pages into high-resolution JPG images with PDF.js high DPI canvas rendering.',
      route: { view: 'tool-detail', slug: 'pdf-to-jpg' } as any,
      icon: FileText,
      tags: ['PDF Pages', 'High DPI', 'Multi-Page ZIP', 'Confidential Safe'],
      badge: 'Document Utility',
      processingType: 'local',
      isPopular: true
    },
    {
      id: 'pdf-to-png',
      name: 'PDF to PNG Page Converter',
      category: 'Documents',
      desc: 'Convert PDF document pages into lossless PNG graphics with crisp typography and diagrams.',
      route: { view: 'tool-detail', slug: 'pdf-to-png' } as any,
      icon: FileText,
      tags: ['Lossless Pages', 'High Resolution', 'RAM Only'],
      processingType: 'local'
    },
    {
      id: 'docx-to-pdf',
      name: 'DOCX to PDF Converter',
      category: 'Documents',
      desc: 'Convert Microsoft Word .docx documents to universal PDF format directly in browser memory.',
      route: { view: 'tool-detail', slug: 'docx-to-pdf' } as any,
      icon: FileText,
      tags: ['Word to PDF', 'OpenXML', 'Resume Safe', 'Zero Upload'],
      processingType: 'local'
    },
    {
      id: 'pptx-to-pdf',
      name: 'PPTX to PDF Converter',
      category: 'Documents',
      desc: 'Convert Microsoft PowerPoint presentations (.pptx) into portable PDF slide decks in your browser.',
      route: { view: 'tool-detail', slug: 'pptx-to-pdf' } as any,
      icon: FileText,
      tags: ['PowerPoint Slides', 'Landscape PDF', 'Client-Side'],
      processingType: 'local'
    },

    // Archive Tools
    {
      id: 'zip-creator',
      name: 'Online ZIP Creator',
      category: 'Archives',
      desc: 'Bundle multiple files and directory folder trees into a compressed .zip archive in browser memory.',
      route: { view: 'tool-detail', slug: 'zip-creator' } as any,
      icon: FolderArchive,
      tags: ['Directory Tree', 'JSZip Engine', 'No Size Limit'],
      badge: 'Archive Tool',
      processingType: 'local',
      isPopular: true
    },
    {
      id: 'zip-extractor',
      name: 'ZIP Extractor & Inspector',
      category: 'Archives',
      desc: 'Inspect file trees, preview photos/text, and safely extract files from .zip archives with path traversal protection.',
      route: { view: 'tool-detail', slug: 'zip-extractor' } as any,
      icon: FolderArchive,
      tags: ['Directory Tree', 'Safe Unzip', 'Zip Slip Protection'],
      processingType: 'local'
    },
    {
      id: 'rar-extractor',
      name: 'RAR Archive Inspector & Extractor',
      category: 'Archives',
      desc: 'Inspect file trees, verify header signatures, and extract files from RAR archives directly in your browser.',
      route: { view: 'tool-detail', slug: 'rar-extractor' } as any,
      icon: FolderArchive,
      tags: ['RAR Inspector', 'Signature Check', 'Zero Upload'],
      processingType: 'local'
    },

    // Format Intelligence & Developer Tools
    {
      id: 'file-identifier',
      name: 'File Format Identifier & Intelligence Engine',
      category: 'Developer & Security',
      desc: 'Inspect binary headers and magic signatures, identify unknown files, verify extension mismatches, calculate entropy, and extract deep metadata.',
      route: { view: 'file-identifier' },
      icon: Cpu,
      tags: ['Magic Bytes', 'Mismatch Detector', 'Entropy Score', 'Hex Dump'],
      badge: 'Core Engine',
      processingType: 'local',
      isPopular: true
    },
    {
      id: 'magic-byte-detector',
      name: 'Magic Byte Signature Detector',
      category: 'Developer & Security',
      desc: 'Analyze binary offset bytes, hexadecimal signatures, and detect spoofed file extensions.',
      route: { view: 'magic-byte-detector' },
      icon: Binary,
      tags: ['Hex Signature', 'Spoof Detector', 'Binary Offset'],
      processingType: 'local'
    },
    {
      id: 'hash-generator',
      name: 'Cryptographic Hash Generator',
      category: 'Developer & Security',
      desc: 'Calculate instant SHA-256, MD5, SHA-1, and SHA-512 cryptographic hashes for text strings or files.',
      route: { view: 'hash-generator' },
      icon: Hash,
      tags: ['SHA-256', 'MD5', 'SHA-512', 'Web Crypto'],
      processingType: 'local'
    },
    {
      id: 'checksum-verifier',
      name: 'Checksum Integrity Verifier',
      category: 'Developer & Security',
      desc: 'Compare calculated file hashes with expected publisher checksums to detect file corruption or tampering.',
      route: { view: 'checksum-verifier' },
      icon: CheckCircle2,
      tags: ['Hash Matcher', 'Integrity Test', 'Security'],
      processingType: 'local'
    },

    // Data & Privacy Tools
    {
      id: 'metadata-viewer',
      name: 'Metadata & EXIF Inspector',
      category: 'Data & Privacy',
      desc: 'Extract embedded camera EXIF, audio ID3 tags, PDF author properties, and video codec details privately.',
      route: { view: 'metadata-viewer' },
      icon: FileText,
      tags: ['EXIF Data', 'GPS Coordinates', 'Camera Specs'],
      badge: 'Privacy Inspector',
      processingType: 'local',
      isPopular: true
    },
    {
      id: 'remove-metadata',
      name: 'Metadata Cleaner & Privacy Stripper',
      category: 'Data & Privacy',
      desc: 'Scrub sensitive GPS coordinates, device serial numbers, and creator metadata before sharing online.',
      route: { view: 'remove-metadata' },
      icon: ShieldOff,
      tags: ['GPS Scrub', 'Privacy Safe', 'Zero Upload'],
      processingType: 'local'
    },
    {
      id: 'mime-checker',
      name: 'MIME Type & Content-Type Checker',
      category: 'Data & Privacy',
      desc: 'Lookup IANA Content-Type media standards, RFC specifications, and HTTP response header rules.',
      route: { view: 'mime-checker' },
      icon: Code2,
      tags: ['IANA Specs', 'Content-Type', 'HTTP Headers'],
      processingType: 'local'
    },

    // Email & Mail Tools
    {
      id: 'email-viewer',
      name: 'Browser-Based Email & EML/MSG Viewer',
      category: 'Email & Mail',
      desc: 'Inspect RFC 822 .eml, Outlook .msg, and MBOX files with sanitized HTML rendering, attachment extraction, and SPF/DKIM security auditing.',
      route: { view: 'tool-detail', slug: 'email-viewer' } as any,
      icon: Mail,
      tags: ['EML Viewer', 'MSG Viewer', 'MBOX Mailboxes', 'SPF/DKIM', 'Attachments'],
      badge: 'Email Forensics',
      processingType: 'local',
      isPopular: true
    },
    {
      id: 'winmail-extractor',
      name: 'Winmail.dat (TNEF) Extractor',
      category: 'Email & Mail',
      desc: 'Extract hidden files, PDFs, spreadsheets, and documents trapped in Microsoft Outlook winmail.dat attachments.',
      route: { view: 'tool-detail', slug: 'winmail-extractor' } as any,
      icon: FolderArchive,
      tags: ['Outlook TNEF', 'Winmail Rescue', 'Zip Download', '100% Private'],
      badge: 'TNEF Extractor',
      processingType: 'local',
      isPopular: true
    },
    {
      id: 'eml-to-pdf',
      name: 'EML to PDF Email Archiver',
      category: 'Email & Mail',
      desc: 'Convert RFC 822 and Outlook emails into publication-ready PDF documents with audit summaries and attachment manifests.',
      route: { view: 'tool-detail', slug: 'eml-to-pdf' } as any,
      icon: FileText,
      tags: ['PDF Archive', 'Legal Discovery', 'Forensic Headers', 'Print Ready'],
      badge: 'Legal Archive',
      processingType: 'local',
      isPopular: true
    },
    {
      id: 'msg-to-eml',
      name: 'Outlook MSG to EML Converter',
      category: 'Email & Mail',
      desc: 'Convert proprietary Microsoft Outlook .msg compound binary files to open RFC 822 .eml format in browser RAM.',
      route: { view: 'tool-detail', slug: 'msg-to-eml' } as any,
      icon: Mail,
      tags: ['Outlook MSG', 'Standard EML', 'MAPI Properties', 'Cross-Platform'],
      processingType: 'local'
    },

    // 3D & CAD Tools
    {
      id: 'stl-viewer',
      name: 'Interactive 3D STL Viewer',
      category: '3D & CAD',
      desc: 'Hardware-accelerated 3D WebGL renderer for binary and ASCII STL meshes with facet inspection, wireframe, bounding dimensions, and volume calculations.',
      route: { view: 'tool-detail', slug: 'stl-viewer' } as any,
      icon: Box,
      tags: ['WebGL 3D', 'Volume Calc', 'Weight Estimator', 'Bbox Dimensions'],
      badge: 'Interactive 3D',
      processingType: 'local',
      isPopular: true
    },
    {
      id: '3mf-viewer',
      name: '3MF Package & Model Inspector',
      category: '3D & CAD',
      desc: 'Unpack modern 3D Manufacturing Format containers, inspect multi-model mesh objects, slicer metadata, thumbnails, and color palettes.',
      route: { view: 'tool-detail', slug: '3mf-viewer' } as any,
      icon: Layers,
      tags: ['3MF Inspector', 'Slicer Profiles', 'Multi-Mesh', 'Thumbnails'],
      badge: '3MF Package',
      processingType: 'local',
      isPopular: true
    },
    {
      id: '3mf-to-stl',
      name: '3MF to STL 3D Mesh Converter',
      category: '3D & CAD',
      desc: 'Convert 3MF containers into universal binary or ASCII STL mesh files for 3D printing slicing software.',
      route: { view: 'converter-detail', id: '3mf-to-stl' } as any,
      icon: Box,
      tags: ['3D Printing', 'Slicer Ready', 'Binary STL', 'Zero Upload'],
      processingType: 'local'
    },
    {
      id: 'stl-repair',
      name: '3D STL Mesh Repair & Forensics',
      category: '3D & CAD',
      desc: 'Analyze 3D STL meshes for manifold defects, degenerate zero-area facets, unshared edges, and auto-repair inverted triangle normal vectors.',
      route: { view: 'tool-detail', slug: 'stl-repair' } as any,
      icon: Box,
      tags: ['Mesh Forensics', 'Manifold Check', 'Normal Inversion', 'Watertight'],
      badge: 'Forensics Tool',
      processingType: 'local',
      isPopular: true
    }
  ];

  const categories = ['All', 'Email & Mail', '3D & CAD', 'Images', 'Documents', 'Archives', 'Data & Privacy', 'Developer & Security'];

  const converterToolIds = new Set([
    'heic-to-jpg',
    'png-to-webp',
    'webp-to-jpg',
    'jpg-to-png',
    'svg-to-png',
    'pdf-to-jpg',
    'pdf-to-png',
    'docx-to-pdf',
    'pptx-to-pdf',
    'eml-to-pdf',
    'msg-to-eml',
    '3mf-to-stl',
  ]);

  const filteredTools = toolsList.filter((tool) => {
    if (converterToolIds.has(tool.id)) return false;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const availableFormatKeys = Object.keys(FORMATS_REGISTRY);

  const handleLaunchQuickMatcher = () => {
    const slug = `${sourceFormat.toLowerCase()}-to-${targetFormat.toLowerCase()}`;
    if (TOOLS_REGISTRY[slug]) {
      onNavigate({ view: 'tool-detail', slug } as any);
    } else {
      onNavigate({ view: 'converter-detail', id: slug });
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      <SEOHead
        title={
          activeCategory !== 'All'
            ? `${activeCategory} Utilities & Online Tools – Local Browser Suite`
            : 'Online File Utility Platform – Free Local Browser Tools'
        }
        description="Comprehensive browser-based file utilities: image compressor, resizer, format converters, PDF tools, archive extractors, metadata strippers, and file intelligence engine."
        canonicalPath="/tools"
      />

      <Breadcrumb items={[{ label: 'File Utility Platform' }]} onNavigate={onNavigate} />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Browser-Based File Utilities • 100% Client-Side RAM Processing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Client-Side File Utilities Platform
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Compress, resize, convert, extract, and inspect any digital file directly inside your browser memory.
          Zero cloud uploads, unlimited batch files, and maximum data privacy.
        </p>

        {/* Local Processing Guarantee Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-1">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Lock className="w-3.5 h-3.5" /> Zero File Uploads
          </span>
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <Cpu className="w-3.5 h-3.5" /> WebAssembly & Canvas RAM
          </span>
          <span className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Full Data Confidentiality
          </span>
        </div>
      </div>

      {/* Interactive "I have [X] -> I want [Y]" Quick Converter / Tool Matrix */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Quick Tool & Format Matcher</span>
            </h3>
            <p className="text-xs text-slate-300">
              Select what format you have and what you want to achieve to launch the matching tool instantly.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 border border-blue-400/30 text-blue-300">
            Smart Router
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Source Format */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              I have a file in:
            </label>
            <select
              value={sourceFormat}
              onChange={(e) => setSourceFormat(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {availableFormatKeys.map((ext) => (
                <option key={ext} value={ext}>
                  .{ext.toUpperCase()} — {FORMATS_REGISTRY[ext]?.name || ext}
                </option>
              ))}
            </select>
          </div>

          {/* Target Format */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              I want output in:
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {availableFormatKeys.map((ext) => (
                <option key={ext} value={ext}>
                  .{ext.toUpperCase()} — {FORMATS_REGISTRY[ext]?.name || ext}
                </option>
              ))}
            </select>
          </div>

          {/* Launch Button */}
          <div className="pt-5 sm:pt-0">
            <button
              onClick={handleLaunchQuickMatcher}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch .{sourceFormat.toUpperCase()} → .{targetFormat.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Directory Filter & Search Controls */}
      <div className="space-y-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tools (e.g. Compressor, HEIC, PDF, Resizer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              id="tools-search-input"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
            <Lock className="w-3.5 h-3.5" />
            <span>Local Browser Processing Engine</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onNavigate(tool.route)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-5 cursor-pointer relative"
              id={`tool-card-${tool.id}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tool.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                        {tool.badge}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800">
                      {tool.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {tool.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Open {tool.name.split(' ')[0]} Tool</span>
                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matching tools found</h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Try searching for another keyword or selecting "All" categories.
          </p>
        </div>
      )}
    </div>
  );
};
