import React, { useState } from 'react';
import {
  FileText,
  Layers,
  Monitor,
  Laptop,
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Code,
  ShieldCheck,
  RefreshCw,
  Zap,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Cpu,
  Sparkles,
  Server,
  HelpCircle,
  FileCode,
  Sliders,
  FolderArchive,
  Compass
} from 'lucide-react';
import { FileTypeInfo, AppRoute } from '../../types';
import { getOrGenerateFormatGuide } from '../../lib/guides/formatGuideEngine';
import { getBestComparisonForExtension } from '../../lib/database/knowledgeGraph';
import { getComparisonGuide } from '../../lib/guides/comparisonGuideEngine';
import { FILE_SIGNATURES } from '../../data/fileSignaturesData';
import { CONVERTERS_LIST } from '../../data/convertersData';

interface ExtensionTopicalAuthorityProps {
  item: FileTypeInfo;
  onNavigate: (route: AppRoute) => void;
}

export const ExtensionTopicalAuthority: React.FC<ExtensionTopicalAuthorityProps> = ({ item, onNavigate }) => {
  const [copiedMime, setCopiedMime] = useState(false);
  const [copiedMagic, setCopiedMagic] = useState(false);
  const [activeCompatCategory, setActiveCompatCategory] = useState<'os' | 'browsers' | 'software' | 'platforms'>('os');

  const extUpper = item.extension.toUpperCase();
  const extLower = item.extension.toLowerCase();
  const isHeic = extUpper === 'HEIC' || extUpper === 'HEIF';
  const isDwg = extUpper === 'DWG';

  const formatGuide = getOrGenerateFormatGuide(extUpper);
  const bestComparison = getBestComparisonForExtension(item.extension, item.category);
  const comparisonGuide = getComparisonGuide(bestComparison.slug);
  const sigMatch = FILE_SIGNATURES.find((s) => s.extension.toLowerCase() === extLower);

  const handleCopyText = (text: string, type: 'mime' | 'magic') => {
    navigator.clipboard.writeText(text);
    if (type === 'mime') {
      setCopiedMime(true);
      setTimeout(() => setCopiedMime(false), 2000);
    } else {
      setCopiedMagic(true);
      setTimeout(() => setCopiedMagic(false), 2000);
    }
  };

  // ---------------------------------------------------------------------------
  // Compatibility Matrix Data Definition
  // ---------------------------------------------------------------------------
  const compatData = (() => {
    if (isHeic) {
      return {
        os: [
          { name: 'Windows 11 / 10', supported: true, notes: 'Supported natively with Microsoft HEIF/HEVC Extensions or CopyTrans', badge: 'Full Support' },
          { name: 'macOS High Sierra (10.13)+', supported: true, notes: 'Native out-of-the-box support in Preview, Finder, Photos, Safari', badge: 'Native' },
          { name: 'iOS 11 & iPadOS', supported: true, notes: 'Default camera capture format for all Apple devices since 2017', badge: 'Default Native' },
          { name: 'Android 9 (Pie)+', supported: true, notes: 'Supported natively in Google Photos & Samsung Gallery', badge: 'Native' },
          { name: 'Linux (Ubuntu / Fedora)', supported: true, notes: 'Supported via libheif, heif-gdk-pixbuf, and GIMP', badge: 'Via Library' },
          { name: 'ChromeOS', supported: true, notes: 'Native support in Files app and Chrome browser', badge: 'Native' },
          { name: 'Windows 7 & 8', supported: false, notes: 'Unsupported natively; requires third-party viewers (IrfanView, CopyTrans)', badge: 'Requires App' },
        ],
        browsers: [
          { name: 'Apple Safari (macOS & iOS)', supported: true, notes: 'Hardware accelerated full native <img> tag rendering', badge: 'Native' },
          { name: 'Google Chrome', supported: true, notes: 'Decodes via client-side WebAssembly / modern Chrome on supported OS', badge: 'WASM / OS' },
          { name: 'Microsoft Edge', supported: true, notes: 'Supported when Windows HEVC extensions are present', badge: 'OS Dependent' },
          { name: 'Mozilla Firefox', supported: false, notes: 'No direct <img> tag support; converts client-side via JavaScript', badge: 'JS Decode' },
          { name: 'Opera / Brave', supported: true, notes: 'Chromium engine support with client-side fallback', badge: 'WASM' },
        ],
        software: [
          { name: 'Adobe Photoshop 2020-2025', supported: true, notes: 'Opens and edits full 16-bit color and transparency', badge: 'Full Edit' },
          { name: 'Adobe Lightroom & Camera Raw', supported: true, notes: 'Full HDR and raw color grading support', badge: 'Full Support' },
          { name: 'GIMP (v2.10.22+)', supported: true, notes: 'Opens HEIC with embedded color profiles and layer export', badge: 'Free / Open Source' },
          { name: 'Affinity Photo 2', supported: true, notes: 'Hardware accelerated import and export', badge: 'Full Support' },
          { name: 'Canva & Figma Web', supported: true, notes: 'Automatic server/client side conversion upon drag and drop', badge: 'Auto-Convert' },
          { name: 'CorelDRAW 2024', supported: true, notes: 'Import and raster vector tracing support', badge: 'Full Support' },
        ],
        platforms: [
          { name: 'Apple iCloud Photos', supported: true, notes: 'Native sync, web album sharing, and original format retention', badge: 'Native' },
          { name: 'Google Photos / Drive', supported: true, notes: 'Full preview, backup, search, and instant JPG sharing', badge: 'Native' },
          { name: 'Microsoft OneDrive', supported: true, notes: 'Renders thumbnail previews and supports cloud photo sync', badge: 'Native' },
          { name: 'Instagram & Threads', supported: true, notes: 'Accepts HEIC uploads directly from iOS/Android camera roll', badge: 'Auto-Convert' },
          { name: 'Discord', supported: true, notes: 'Transcodes HEIC to JPG automatically for desktop chat rendering', badge: 'Auto-Transcode' },
          { name: 'WordPress Core (6.5+)', supported: true, notes: 'Media library upload support when ImageMagick/libheif is enabled on server', badge: 'Server Dependent' },
        ],
      };
    }

    if (isDwg) {
      return {
        os: [
          { name: 'Windows 11 / 10', supported: true, notes: 'Full native support via AutoCAD, Autodesk DWG TrueView, LibreCAD, and DraftSight', badge: 'Native / Full' },
          { name: 'macOS Sequoia / Sonoma', supported: true, notes: 'Native macOS support via AutoCAD for Mac, CorelCAD, and LibreCAD', badge: 'Native Mac' },
          { name: 'Linux (Ubuntu / Fedora)', supported: true, notes: 'Supported via LibreCAD, BricsCAD, FreeCAD, and Open Design Alliance (ODA) SDK', badge: 'Via CAD App' },
          { name: 'iOS / iPadOS', supported: true, notes: 'Supported in AutoCAD Mobile, DWG FastView, and Autodesk Construction Cloud', badge: 'Dedicated App' },
          { name: 'Android 10+', supported: true, notes: 'Supported in AutoCAD Mobile, DWG FastView, and GstarCAD Mobile', badge: 'Dedicated App' },
          { name: 'ChromeOS', supported: true, notes: 'Accessible via Autodesk Web Viewer in Chrome and Android CAD applications', badge: 'Web / Android' },
          { name: 'Windows 7 & 8', supported: true, notes: 'Supported using legacy Autodesk DWG TrueView or LibreCAD', badge: 'Legacy App' },
        ],
        browsers: [
          { name: 'Autodesk Web Viewer (Chrome / Safari / Edge)', supported: true, notes: 'Full interactive 2D pan/zoom and 3D orbit via WebGL and WebAssembly', badge: 'Full WebGL' },
          { name: 'Chrome & Edge Canvas', supported: true, notes: 'Direct WebGL CAD rendering using three-dxf or client-side WebAssembly CAD engines', badge: 'WebGL / WASM' },
          { name: 'Apple Safari (macOS & iOS)', supported: true, notes: 'Supported through WebGL-based online CAD viewers and Autodesk Drive preview', badge: 'WebGL 2.0' },
          { name: 'Mozilla Firefox', supported: true, notes: 'Renders blueprints via WebAssembly CAD viewers with hardware canvas acceleration', badge: 'WASM Canvas' },
          { name: 'Native HTML5 <img> Tag', supported: false, notes: 'Web browsers cannot render raw binary CAD databases directly; requires PDF or SVG conversion', badge: 'Requires Export' },
        ],
        software: [
          { name: 'Autodesk AutoCAD 2018-2025', supported: true, notes: 'Primary creation, 2D drafting, 3D ACIS solids, dynamic blocks, and XREFs', badge: 'Native Master' },
          { name: 'Autodesk DWG TrueView', supported: true, notes: 'Free official standalone viewer, measurement tool, and schema version converter', badge: 'Free Official' },
          { name: 'LibreCAD / FreeCAD', supported: true, notes: 'Free open-source 2D drafting and 3D parametric modeling with DWG import support', badge: 'Free / Open Source' },
          { name: 'Dassault DraftSight', supported: true, notes: 'Full commercial 2D CAD drafting and native DWG database manipulation', badge: 'Full CAD' },
          { name: 'Rhino 3D & Vectorworks', supported: true, notes: 'Direct import of DWG vector curves, solids, surfaces, and architectural layers', badge: 'Full Import' },
          { name: 'Adobe Illustrator', supported: true, notes: 'Imports 2D DWG vector paths and layers for graphic design vectorization', badge: 'Vector Import' },
        ],
        platforms: [
          { name: 'Autodesk Construction Cloud (BIM 360)', supported: true, notes: 'Cloud blueprint hosting, version comparison, and contractor issue tracking', badge: 'Native Cloud' },
          { name: 'Trimble Connect', supported: true, notes: 'Collaborative architectural blueprint coordination and 3D clash detection', badge: 'BIM Cloud' },
          { name: 'Google Drive & Microsoft OneDrive', supported: true, notes: 'Cloud file sync, version history, and mobile viewer integration', badge: 'Cloud Sync' },
          { name: 'Procore', supported: true, notes: 'Construction project management and field blueprint distribution', badge: 'Field Mobile' },
          { name: 'Dropbox', supported: true, notes: 'Direct file sharing and preview integration with Autodesk cloud viewer', badge: 'Integrated' },
          { name: 'Box Enterprise', supported: true, notes: 'Enterprise file preview with integrated CAD viewing capabilities', badge: 'Enterprise' },
        ],
      };
    }

    // Dynamic Generic Fallback for Other Formats
    const firstApp = item.popularApps[0]?.name || 'Standard Viewer';
    const secondApp = item.popularApps[1]?.name || 'Universal Viewer';

    return {
      os: [
        { name: 'Windows 11 / 10', supported: true, notes: `Supported natively or through ${firstApp}`, badge: 'Full Support' },
        { name: 'macOS Sonoma / Ventura', supported: true, notes: `Supported natively or via ${secondApp}`, badge: 'Supported' },
        { name: 'Linux (Ubuntu / Fedora)', supported: true, notes: 'Supported via open-source tools and command line utilities', badge: 'Supported' },
        { name: 'iOS & iPadOS', supported: true, notes: 'Accessible through compatible mobile viewers or cloud previewers', badge: 'Mobile App' },
        { name: 'Android 10+', supported: true, notes: 'Supported through dedicated mobile apps or cloud viewers', badge: 'Mobile App' },
        { name: 'ChromeOS', supported: true, notes: 'Accessible via web browser applications and Chrome extensions', badge: 'Web / App' },
      ],
      browsers: [
        { name: 'Google Chrome', supported: true, notes: 'Direct viewing or online inspection via AnyFileX web tools', badge: 'Web View' },
        { name: 'Apple Safari', supported: true, notes: 'Browser-based rendering and cloud document preview', badge: 'Web View' },
        { name: 'Microsoft Edge', supported: true, notes: 'Built-in document reader and WebAssembly viewing engine', badge: 'Web View' },
        { name: 'Mozilla Firefox', supported: true, notes: 'Compliant web standards decoding and online sandbox inspection', badge: 'Web View' },
      ],
      software: item.popularApps.slice(0, 6).map((app) => ({
        name: app.name,
        supported: true,
        notes: `Recommended software application by ${app.developer || 'software vendor'} for opening and manipulating .${extLower} files`,
        badge: app.isFree ? 'Free' : 'Commercial',
      })),
      platforms: [
        { name: 'Google Drive', supported: true, notes: 'Cloud file storage, sharing, and online file preview', badge: 'Cloud Sync' },
        { name: 'Microsoft OneDrive', supported: true, notes: 'Integrated cloud backup and Office synchronization', badge: 'Cloud Sync' },
        { name: 'Dropbox', supported: true, notes: 'Cross-platform synchronization and direct file sharing links', badge: 'Integrated' },
        { name: 'AnyFileX Cloud Engine', supported: true, notes: 'Client-side sandboxed file inspection, hex forensics, and conversion', badge: 'Zero Upload' },
      ],
    };
  })();

  // ---------------------------------------------------------------------------
  // Conversion Hub Items
  // ---------------------------------------------------------------------------
  const conversionCards = (() => {
    if (isHeic) {
      return [
        {
          target: 'JPG',
          badge: 'Most Popular',
          speed: 'Instant WASM',
          description: 'Convert your iPhone HEIC photos into standard JPEG format for 100% universal compatibility across older Windows PCs, web browsers, print shops, and social media platforms.',
          buttonText: 'Convert HEIC to JPG Online Free',
          buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',
          converterId: 'heic-to-jpg',
        },
        {
          target: 'PDF',
          badge: 'Document / Print',
          speed: 'Vector PDF',
          description: 'Package single or multiple HEIC photos, invoice scans, and receipts into a formatted, printable PDF document without compromising photo clarity.',
          buttonText: 'Convert HEIC to PDF Document',
          buttonColor: 'bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white',
          converterId: 'heic-to-pdf',
        },
      ];
    }

    if (isDwg) {
      return [
        {
          target: 'DXF',
          badge: 'CAD Vector / CNC',
          speed: 'Lossless Vector',
          description: 'Convert binary AutoCAD DWG blueprints into open ASCII DXF vector paths for CNC routing, plasma cutting, laser fabrication, and third-party CAD modeling.',
          buttonText: 'Convert DWG to DXF Online Free',
          buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',
          converterId: 'dwg-to-dxf',
        },
        {
          target: 'PDF',
          badge: 'Blueprint to Document',
          speed: 'High-Res Vector',
          description: 'Package AutoCAD blueprint sheets, drawing layouts, and vector layers into high-resolution printable PDF documents with preserved scale and line weights.',
          buttonText: 'Convert DWG to PDF Document',
          buttonColor: 'bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white',
          converterId: 'dwg-to-pdf',
        },
      ];
    }

    // Generic Fallback
    const target1 = bestComparison.targetExt;
    const target2 = target1 === 'PDF' ? 'JPG' : 'PDF';
    const c1Id = `${extLower}-to-${target1.toLowerCase()}`;
    const c2Id = `${extLower}-to-${target2.toLowerCase()}`;

    const c1Exists = CONVERTERS_LIST.some((c) => c.id === c1Id);
    const c2Exists = CONVERTERS_LIST.some((c) => c.id === c2Id);

    return [
      {
        target: target1,
        badge: 'Top Conversion',
        speed: 'Fast Online',
        description: `Convert your .${extUpper} files directly into standardized .${target1} format with high precision and zero privacy compromises.`,
        buttonText: `Convert ${extUpper} to ${target1} Online`,
        buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',
        converterId: c1Exists ? c1Id : null,
      },
      {
        target: target2,
        badge: 'Universal Export',
        speed: 'Standard Output',
        description: `Export .${extUpper} files to .${target2} for universal cross-platform viewing, printing, and sharing.`,
        buttonText: `Convert ${extUpper} to ${target2} Online`,
        buttonColor: 'bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white',
        converterId: c2Exists ? c2Id : null,
      },
    ];
  })();

  // ---------------------------------------------------------------------------
  // MIME Types & Headers
  // ---------------------------------------------------------------------------
  const mimeRows = (() => {
    if (isHeic) {
      return [
        { mime: 'image/heic', usage: 'Single still image encoded with HEVC', ext: '.heic' },
        { mime: 'image/heif', usage: 'Generic High Efficiency Image File container', ext: '.heif, .hif' },
        { mime: 'image/heic-sequence', usage: 'Image sequence, photo burst, or Apple Live Photo', ext: '.heics, .heic' },
      ];
    }

    if (isDwg) {
      return [
        { mime: 'image/vnd.dwg', usage: 'Official IANA standard MIME identifier for AutoCAD DWG drawings', ext: '.dwg' },
        { mime: 'model/vnd.dwg', usage: 'Alternative 3D model & CAD vector MIME designation', ext: '.dwg' },
        { mime: 'application/acad', usage: 'Legacy AutoCAD binary drawing MIME type', ext: '.dwg' },
      ];
    }

    const rows = [
      { mime: item.mimeType || 'application/octet-stream', usage: `Standard official MIME type for .${extLower} files`, ext: `.${extLower}` },
    ];
    if (formatGuide.alternativeMimes && formatGuide.alternativeMimes.length > 0) {
      formatGuide.alternativeMimes.forEach((altMime) => {
        rows.push({ mime: altMime, usage: `Alternative / legacy MIME identifier for .${extLower}`, ext: `.${extLower}` });
      });
    }
    return rows;
  })();

  const primaryMime = mimeRows[0]?.mime || 'application/octet-stream';
  const secondaryMime = mimeRows[1]?.mime;

  // ---------------------------------------------------------------------------
  // Magic Bytes & Forensics Information
  // ---------------------------------------------------------------------------
  const magicForensics = (() => {
    if (isHeic) {
      return {
        hexString: '00 00 00 18 66 74 79 70 68 65 69 63',
        asciiString: '....ftypheic',
        offsetLabel: 'Offset 0x00',
        explanation: `In digital forensics and file verification, a valid .${extLower} file begins with an ISO Base Media File Format (ISOBMFF) ftyp box starting at byte offset 0x00000000:`,
        boxes: [
          { label: 'Box Length (Bytes 0-3)', value: '0x00000018 (24 bytes)', color: 'text-slate-900 dark:text-white' },
          { label: "Box Type (Bytes 4-7)", value: "66 74 79 70 ('ftyp')", color: 'text-blue-600 dark:text-blue-400' },
          { label: "Major Brand (Bytes 8-11)", value: "68 65 69 63 ('heic')", color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Compatible Brands', value: 'mif1, msf1, heix', color: 'text-amber-600 dark:text-amber-400' },
        ],
      };
    }

    if (isDwg) {
      return {
        hexString: '41 43 31 30 33 32 00 00 00 00 00 00',
        asciiString: 'AC1032......',
        offsetLabel: 'Offset 0x00',
        explanation: `In digital forensics and binary verification, an authentic .${extLower} drawing begins with Autodesk's official ASCII header signature starting at byte offset 0x00000000. The 6-byte string AC1032 denotes AutoCAD 2018–2025:`,
        boxes: [
          { label: 'Byte Offset', value: '0x00000000 (Byte 0)', color: 'text-slate-900 dark:text-white' },
          { label: 'Magic Bytes (Bytes 0-3)', value: "41 43 31 30 ('AC10')", color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Version String (Bytes 4-5)', value: "33 32 ('32' = AC1032)", color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Binary Structure', value: 'Indexed CAD Database', color: 'text-amber-600 dark:text-amber-400' },
        ],
      };
    }

    const hex = item.magicBytesHex || sigMatch?.example_header_hex || sigMatch?.signature || '00 00 00 00';
    const ascii = sigMatch?.magicBytesAscii || extUpper;

    return {
      hexString: hex,
      asciiString: ascii,
      offsetLabel: sigMatch?.offset !== undefined ? `Offset 0x0${sigMatch.offset}` : 'Offset 0x00',
      explanation: `In digital forensics and file signature analysis, authentic .${extLower} files begin with a standardized magic byte sequence at byte offset 0x00 to verify file integrity and prevent extension spoofing:`,
      boxes: [
        { label: 'Byte Offset', value: sigMatch?.offset !== undefined ? `Offset 0x0${sigMatch.offset}` : 'Offset 0x00', color: 'text-slate-900 dark:text-white' },
        { label: 'Leading Hex Signature', value: hex.substring(0, 14), color: 'text-blue-600 dark:text-blue-400' },
        { label: 'ASCII Representation', value: ascii.substring(0, 12), color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Forensic Domain', value: `${item.category} File Format`, color: 'text-amber-600 dark:text-amber-400' },
      ],
    };
  })();

  return (
    <div className="space-y-10">
      {/* ========================================================================= */}
      {/* 1. WHAT IS .EXT? / DEEP TECHNICAL ARCHITECTURE */}
      {/* ========================================================================= */}
      <section
        id="what-is-format"
        className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              What is a .{extUpper} File? (Technical Definition & Architecture)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
            {formatGuide.standardization || item.developer || item.category}
          </span>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
          <p>
            {formatGuide.whatIsOverview || item.description}
          </p>

          {/* Dynamic Characteristic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose pt-2">
            {formatGuide.characteristics.slice(0, 3).map((char, cIdx) => (
              <div
                key={cIdx}
                className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 space-y-2"
              >
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
                  {cIdx === 0 ? <Cpu className="w-4 h-4" /> : cIdx === 1 ? <Sparkles className="w-4 h-4" /> : <Sliders className="w-4 h-4" />}
                  <span>{char.title}</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                  {char.value}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {char.description}
                </p>
              </div>
            ))}
          </div>

          {/* Technical Deep Dive Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-500" />
              <span>{formatGuide.technicalDeepDive.heading}</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {formatGuide.technicalDeepDive.description}
            </p>
            {formatGuide.technicalDeepDive.bullets && formatGuide.technicalDeepDive.bullets.length > 0 && (
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {formatGuide.technicalDeepDive.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HOW TO OPEN .EXT FILES (WINDOWS, MAC, ANDROID, LINUX) */}
      {/* ========================================================================= */}
      <section
        id="how-to-open-os-guide"
        className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Monitor className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              How to Open .{extUpper} Files on Windows, Mac & Android
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">Step-by-Step OS Guide</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Windows Guide */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                <Monitor className="w-4 h-4" />
              </div>
              <span>How to Open on Windows 10/11</span>
            </div>

            <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {isHeic ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>
                      <strong>Install Microsoft Store Extensions:</strong> Search and install <em>"HEIF Image Extensions"</em> (free) and <em>"HEVC Video Extensions"</em> in the Microsoft Store.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>
                      <strong>Use Free CopyTrans HEIC:</strong> Download <em>CopyTrans HEIC for Windows</em> to enable native thumbnail previews and printing in File Explorer.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>
                      <strong>Third-Party Viewers:</strong> Open instantly with IrfanView, XnView MP, or Adobe Photoshop.
                    </span>
                  </li>
                </>
              ) : isDwg ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>
                      <strong>Autodesk DWG TrueView:</strong> Download the free official <em>Autodesk DWG TrueView</em> desktop software to view, measure, and convert AutoCAD drawings.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>
                      <strong>CAD Drafting Software:</strong> Open for active drafting in <em>AutoCAD</em>, <em>DraftSight</em>, or open-source <em>LibreCAD</em>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>
                      <strong>Convert to Vector PDF:</strong> Use AnyFileX online to convert your .dwg blueprint to vector PDF for instant viewing without CAD software.
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>
                      <strong>Primary Application:</strong> Double-click or open directly with <em>{item.popularApps[0]?.name || 'default viewer'}</em>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>
                      <strong>Alternative Software:</strong> Open using <em>{item.popularApps[1]?.name || 'compatible third-party software'}</em>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>
                      <strong>File Association:</strong> Right-click the file, select <em>Open with &gt; Choose another app</em>, and check <em>Always use this app</em>.
                    </span>
                  </li>
                </>
              )}
            </ol>
          </div>

          {/* Mac & iOS Guide */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center text-xs">
                <Laptop className="w-4 h-4" />
              </div>
              <span>How to Open on Mac & iPhone</span>
            </div>

            <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {isHeic ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>
                      <strong>Native Double Click:</strong> Double-click the file to open natively in <em>Apple Preview</em> or <em>Apple Photos</em> (macOS 10.13+).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>
                      <strong>Quick Look:</strong> Highlight the .heic file in Finder and press the <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border rounded text-[10px]">Spacebar</kbd> for instant full-screen preview.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>
                      <strong>iOS Camera Setting:</strong> Go to <em>Settings &gt; Camera &gt; Formats</em> to toggle between <em>"High Efficiency" (HEIC)</em> and <em>"Most Compatible" (JPEG)</em>.
                    </span>
                  </li>
                </>
              ) : isDwg ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>
                      <strong>AutoCAD for Mac / LibreCAD:</strong> Open natively in <em>AutoCAD for Mac</em>, <em>CorelCAD</em>, or the open-source <em>LibreCAD</em> app on macOS.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>
                      <strong>Autodesk Web Viewer:</strong> Drag the .dwg file into Safari to view full multi-layer blueprints in Autodesk Viewer without installation.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>
                      <strong>3D Modeling Import:</strong> Import DWG vector paths and blocks into <em>Rhino 3D</em>, <em>Vectorworks</em>, or <em>SketchUp</em>.
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>
                      <strong>Native macOS Application:</strong> Open with <em>{item.popularApps[0]?.name || 'default macOS viewer'}</em>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>
                      <strong>Quick Look Preview:</strong> Highlight the file in Finder and tap the <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border rounded text-[10px]">Spacebar</kbd>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>
                      <strong>Set Default App:</strong> Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border rounded text-[10px]">Cmd + I</kbd>, expand <em>Open with</em>, select your application, and click <em>Change All</em>.
                    </span>
                  </li>
                </>
              )}
            </ol>
          </div>

          {/* Android Guide */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <span>How to Open on Android & Mobile</span>
            </div>

            <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {isHeic ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>
                      <strong>Google Photos:</strong> Tap any .heic photo in Google Photos on Android 9+ for hardware-accelerated playback.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>
                      <strong>Samsung Galaxy Gallery:</strong> Supported natively in Samsung Gallery on Galaxy S10 / Note 10 and newer devices.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>
                      <strong>Samsung Camera Toggle:</strong> In Camera Settings, open <em>"Advanced picture options"</em> to toggle <em>"High efficiency pictures"</em>.
                    </span>
                  </li>
                </>
              ) : isDwg ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>
                      <strong>AutoCAD Mobile App:</strong> Install <em>AutoCAD Mobile</em> or <em>DWG FastView</em> from Google Play to inspect blueprints on mobile screens.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>
                      <strong>Cloud Storage Preview:</strong> Upload drawings to Google Drive or OneDrive to view embedded previews in mobile apps.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>
                      <strong>AnyFileX Mobile Viewer:</strong> Use AnyFileX live viewer in Chrome on Android to inspect CAD file headers and metadata instantly.
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>
                      <strong>Compatible Mobile Apps:</strong> Download a dedicated viewer for .{extLower} from the Google Play Store.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>
                      <strong>Cloud Storage:</strong> Open through Google Drive, Dropbox, or OneDrive mobile apps.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>
                      <strong>Online Browser Conversion:</strong> Use AnyFileX mobile browser tools to convert the file into universal PDF or image formats.
                    </span>
                  </li>
                </>
              )}
            </ol>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CONVERSIONS HUB */}
      {/* ========================================================================= */}
      <section
        id="conversions-hub"
        className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Convert .{extUpper} Files Online & Free
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">Zero Server Uploads</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conversionCards.map((card, cardIdx) => (
            <div
              key={cardIdx}
              className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${
                cardIdx === 0
                  ? 'border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>.{extUpper} to .{card.target}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-blue-600 text-white font-medium">
                      {card.badge}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {card.speed}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <button
                onClick={() => {
                  if (card.converterId) {
                    onNavigate({ view: 'converter-detail', id: card.converterId });
                  } else {
                    onNavigate({ view: 'converters' });
                  }
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${card.buttonColor}`}
              >
                <span>{card.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MIME TYPES & HTTP HEADERS */}
      {/* ========================================================================= */}
      <section
        id="mime-types"
        className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              .{extUpper} MIME Types & HTTP Server Headers
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">IANA Standard</span>
        </div>

        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            When serving <code>.{extLower}</code> files over HTTP or configuring REST APIs, web servers must send the official IANA registered Content-Type headers:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">MIME Type Identifier</th>
                  <th className="p-3.5">Standard Usage</th>
                  <th className="p-3.5">File Extensions</th>
                  <th className="p-3.5 text-right">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {mimeRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{row.mime}</td>
                    <td className="p-3.5">{row.usage}</td>
                    <td className="p-3.5 font-mono">{row.ext}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleCopyText(row.mime, 'mime')}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                        title="Copy MIME Type"
                      >
                        {copiedMime ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                Nginx / Apache Server Configuration
              </span>
            </div>
            <pre className="overflow-x-auto text-[11px] text-emerald-400">
{`# Nginx mime.types
types {
    ${primaryMime.padEnd(38, ' ')} ${extLower};${secondaryMime ? `\n    ${secondaryMime.padEnd(38, ' ')} ${extLower};` : ''}
}

# Apache .htaccess
AddType ${primaryMime} .${extLower}`}
            </pre>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MAGIC BYTES & BINARY FORENSICS */}
      {/* ========================================================================= */}
      <section
        id="magic-bytes"
        className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              .{extUpper} Magic Bytes & Hex File Signatures
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {magicForensics.offsetLabel}
          </span>
        </div>

        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {magicForensics.explanation}
          </p>

          {/* Hex display box */}
          <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
              <span className="text-[11px] font-bold">Standard Hex Header Signature</span>
              <button
                onClick={() => handleCopyText(magicForensics.hexString, 'magic')}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                {copiedMagic ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMagic ? 'Copied' : 'Copy Hex'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Hex Representation:</span>
                <span className="font-bold tracking-wider">{magicForensics.hexString}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">ASCII Representation:</span>
                <span className="text-amber-400 font-bold">{magicForensics.asciiString}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {magicForensics.boxes.map((b, bIdx) => (
              <div key={bIdx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{b.label}</span>
                <code className={`font-bold ${b.color}`}>{b.value}</code>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigate({ view: 'tools', toolId: 'magic-bytes' })}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              <span>Inspect Header in Magic Byte Forensics Tool</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FORMAT COMPARISON (e.g. .DWG vs .DXF or .HEIC vs .JPG) */}
      {/* ========================================================================= */}
      <section
        id="format-comparison"
        className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        {/* Anchor compatibility tag for legacy heic-vs-jpg target */}
        <span id="heic-vs-jpg" className="block -mt-24 pt-24 invisible" />

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              .{extUpper} vs .{bestComparison.targetExt} (Detailed Format Comparison)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">Head-to-Head</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Feature Metric</th>
                <th className="p-3.5 text-blue-600 dark:text-blue-400">.{extUpper}</th>
                <th className="p-3.5 text-slate-600 dark:text-slate-400">.{bestComparison.targetExt}</th>
                <th className="p-3.5 text-right">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {comparisonGuide.tableRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{row.feature}</td>
                  <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">{row.ext1Value}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{row.ext2Value}</td>
                  <td className="p-3.5 text-right font-bold">
                    {row.advantage === 'ext1' ? (
                      <span className="text-emerald-600 dark:text-emerald-400">.{extUpper} Wins</span>
                    ) : row.advantage === 'ext2' ? (
                      <span className="text-blue-600 dark:text-blue-400">.{bestComparison.targetExt} Wins</span>
                    ) : (
                      <span className="text-slate-500">Tie / Equal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onNavigate({ view: 'comparison-detail', slug: bestComparison.slug })}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Read Full {extUpper} vs {bestComparison.targetExt} In-Depth Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. COMPATIBILITY MATRIX */}
      {/* ========================================================================= */}
      <section
        id="compatibility-matrix"
        className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              .{extUpper} Compatibility Matrix
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveCompatCategory('os')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCompatCategory === 'os'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Operating Systems
            </button>
            <button
              onClick={() => setActiveCompatCategory('browsers')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCompatCategory === 'browsers'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Browsers
            </button>
            <button
              onClick={() => setActiveCompatCategory('software')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCompatCategory === 'software'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveCompatCategory('platforms')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCompatCategory === 'platforms'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Cloud Platforms
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {compatData[activeCompatCategory].map((entry, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {entry.supported ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {entry.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6 leading-relaxed">
                  {entry.notes}
                </p>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                  entry.supported
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                }`}
              >
                {entry.badge}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
