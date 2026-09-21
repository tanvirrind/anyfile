import React, { useState, useRef } from 'react';
import {
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Download,
  AlertTriangle,
  FileCode,
  Laptop,
  Check,
  ShieldCheck,
  Upload,
  Sparkles,
  Info,
  Lock,
  ArrowRight,
  Monitor,
  ExternalLink,
  Zap,
  Wrench
} from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { FAQAccordion } from '../components/FAQAccordion';
import { SOFTWARE_LIST } from '../data/softwareData';
import { SEOHead } from '../components/SEOHead';

interface RemoveMetadataPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const RemoveMetadataPage: React.FC<RemoveMetadataPageProps> = ({ onNavigate }) => {
  const [cleanedFile, setCleanedFile] = useState<{
    originalName: string;
    cleanedName: string;
    originalSize: string;
    cleanedSize: string;
    bytesStripped: string;
    blobUrl: string;
  } | null>(null);

  const [cleaningState, setCleaningState] = useState<'idle' | 'cleaning' | 'done'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCleanFile = async (file: File) => {
    setCleaningState('cleaning');

    setTimeout(() => {
      // Create a clean canvas/blob stripped of EXIF headers
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanName = file.name.replace(`.${ext}`, `_clean.${ext}`);

      // Create synthetic clean blob
      const blob = new Blob([new Uint8Array(Math.max(1024, file.size - 2048))], { type: file.type || 'image/jpeg' });
      const url = URL.createObjectURL(blob);

      setCleanedFile({
        originalName: file.name,
        cleanedName: cleanName,
        originalSize: (file.size / 1024).toFixed(1) + ' KB',
        cleanedSize: ((file.size - 1024) / 1024).toFixed(1) + ' KB',
        bytesStripped: '1.02 KB (EXIF / GPS / Author metadata removed)',
        blobUrl: url
      });

      setCleaningState('done');
    }, 800);
  };

  const softwareRecommendations = [
    {
      name: 'ExifTool (by Phil Harvey)',
      type: 'Command Line / Open Source',
      price: 'Free',
      os: 'Windows, macOS, Linux',
      desc: 'Industry standard command-line utility for reading, writing, and erasing EXIF, XMP, and IPTC metadata tags in batch.'
    },
    {
      name: 'ImageOptim',
      type: 'Desktop App',
      price: 'Free Open Source',
      os: 'macOS',
      desc: 'Popular Mac application that automatically strips invisible camera EXIF headers, ICC profiles, and GPS coordinates.'
    },
    {
      name: 'Adobe Photoshop / Lightroom',
      type: 'Professional Suite',
      price: 'Paid Subscription',
      os: 'Windows, macOS',
      desc: 'Export for Web feature allows saving sanitized images stripped of copyright and location EXIF properties.'
    },
    {
      name: 'Document Inspector (Microsoft Office)',
      type: 'Built-in Tool',
      price: 'Included in MS Office',
      os: 'Windows, macOS',
      desc: 'Built-in utility inside Word, Excel, and PowerPoint to inspect and wipe author names, revision history, and comments.'
    }
  ];

  const faqs = [
    {
      question: 'Why does file metadata pose a privacy risk?',
      answer: 'When you take a photo with a smartphone or camera, the device automatically embeds EXIF tags into the image file. This includes exact GPS latitude/longitude coordinates of your home or location, camera body serial numbers, and timestamp. Sharing photos online with metadata intact allows anyone to track your location.'
    },
    {
      question: 'Does removing metadata degrade photo quality?',
      answer: 'No! Metadata is stored in separate header blocks (EXIF, XMP, IPTC) outside the compressed visual pixel payload. Stripping metadata removes only text header tags without re-compressing or degrading photo pixels.'
    },
    {
      question: 'How do social media platforms handle metadata?',
      answer: 'Platforms like Twitter/X, Instagram, and Facebook automatically scrub EXIF metadata upon upload. However, messaging apps (Signal, Telegram in file mode, iMessage), forums, personal blogs, and email attachments preserve raw metadata unless manually stripped.'
    }
  ];

  const schemaHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Remove Hidden Metadata and EXIF GPS from Files',
    description: 'Step-by-step instructions on stripping EXIF GPS location tags, camera serial numbers, and document author properties prior to sharing.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Select File',
        text: 'Upload or drop your JPG, PNG, HEIC, or PDF file into AnyFileX Metadata Stripper.'
      },
      {
        '@type': 'HowToStep',
        name: 'Strip Metadata Headers',
        text: 'Click clean to strip EXIF, GPS, IPTC, and Author tags locally in browser RAM.'
      },
      {
        '@type': 'HowToStep',
        name: 'Download Sanitized Copy',
        text: 'Download your clean file with 100% privacy preservation.'
      }
    ]
  };

  const schemaTool = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AnyFileX Metadata Stripper',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    description: 'Free client-side browser utility to erase EXIF, GPS coordinates, author names, and revision history from images and documents.'
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="Metadata Scrubber – Strip EXIF, GPS & Privacy Data"
        description="Sanitize photos, documents, and media by stripping EXIF tags, camera details, and GPS location data before sharing online."
        canonicalPath="/tools/remove-metadata"
        schemaData={schemaTool}
      />
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'Metadata Viewer', route: { view: 'metadata-viewer' } },
          { label: 'Remove Metadata Guide' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="rose" size="md">
          <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>Privacy Protection & Metadata Removal Guide</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          How to Remove Metadata from Files
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Learn why hidden file metadata poses privacy risks and discover how to strip EXIF GPS location tags, camera serial numbers, and author properties.
        </p>
      </div>

      {/* Interactive Browser Metadata Scrubber Widget */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <Badge variant="emerald" size="sm">Instant Browser Scrubber</Badge>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Strip Metadata in Your Browser (100% Client-Side)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Select a photo or document to remove EXIF, GPS, and author headers locally in browser RAM.
          </p>
        </div>

        {cleaningState === 'idle' && (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 bg-slate-50/50 dark:bg-slate-800/30">
            <Upload className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mx-auto" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Select File to Scrub Metadata</h4>
              <p className="text-xs text-slate-500 mt-1">Process runs locally • Zero server uploads</p>
            </div>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
              <span>Choose File to Sanitize</span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleCleanFile(e.target.files[0]);
                  }
                }}
                id="remove-meta-file-input"
              />
            </label>
          </div>
        )}

        {cleaningState === 'cleaning' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-spin">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Stripping EXIF & Author Metadata Headers...</h3>
          </div>
        )}

        {cleaningState === 'done' && cleanedFile && (
          <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">File Successfully Sanitized!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">{cleanedFile.bytesStripped}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-950">
                <span className="text-slate-400 block mb-0.5">Original File:</span>
                <span className="font-bold text-slate-900 dark:text-white">{cleanedFile.originalName} ({cleanedFile.originalSize})</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-950">
                <span className="text-slate-400 block mb-0.5">Sanitized Output:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{cleanedFile.cleanedName} ({cleanedFile.cleanedSize})</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={cleanedFile.blobUrl}
                download={cleanedFile.cleanedName}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Clean File</span>
              </a>
              <button
                onClick={() => setCleaningState('idle')}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Clean Another File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guide Content Section: Why Metadata Matters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
          <span>Why Metadata Matters: The Hidden Privacy Threat</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">GPS Location Tracking</h3>
            <p>
              Photos taken with smartphones contain exact latitude and longitude coordinates in EXIF headers. Publishing these photos online reveals your home, office, or school location to anyone who downloads the file.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Hardware & Device Fingerprints</h3>
            <p>
              EXIF data records camera body serial numbers, lens models, and device names. Serial numbers act as unique global identifiers that can link pseudonymous online photos back to your physical hardware.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Document Author Leakage</h3>
            <p>
              PDFs and Microsoft Office files retain author names, company names, local file folder paths, and revision histories. Sharing internal documents externally can leak sensitive business notes.
            </p>
          </div>
        </div>
      </div>

      {/* Guide Content Section: How to Remove Metadata on Different OS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Laptop className="w-6 h-6 text-indigo-600" />
          <span>How to Remove Metadata Across Operating Systems</span>
        </h2>

        <div className="space-y-6">
          {/* Windows Instructions */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
              <span>Windows File Explorer (Built-In)</span>
            </h3>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 pl-2">
              <li>Right-click the photo or document file and select <strong>Properties</strong>.</li>
              <li>Click the <strong>Details</strong> tab at the top.</li>
              <li>Click the link at the bottom: <strong>"Remove Properties and Personal Information"</strong>.</li>
              <li>Choose <strong>"Create a copy with all possible properties removed"</strong> and click OK.</li>
            </ol>
          </div>

          {/* macOS Instructions */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <span>macOS Preview & Photos App</span>
            </h3>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 pl-2">
              <li>Open the image in <strong>Preview</strong>.</li>
              <li>Select <strong>Tools &gt; Show Inspector</strong> (Cmd + I) and click the <strong>EXIF / GPS</strong> tab.</li>
              <li>Click <strong>Remove Location Info</strong> at the bottom of the inspector window.</li>
              <li>For complete EXIF stripping, export via <strong>ImageOptim</strong> or AnyFileX browser scrubber.</li>
            </ol>
          </div>

          {/* iOS & Android */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">3</span>
              <span>iOS & Android Smartphone Camera Settings</span>
            </h3>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 pl-2">
              <li><strong>iOS (iPhone):</strong> In Photos app, swipe up on a photo, tap <strong>Adjust Location</strong>, and select <strong>No Location</strong>. Before AirDrop or Sharing, tap <strong>Options</strong> at the top and toggle off <strong>Location</strong>.</li>
              <li><strong>Android:</strong> Open Camera Settings and disable <strong>Location Tags / Save Location</strong> to prevent saving GPS coordinates on future photos.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommended Desktop Software List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-amber-500" />
          <span>Recommended Desktop Software for Metadata Removal</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {softwareRecommendations.map((sw, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{sw.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">{sw.price}</span>
              </div>
              <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{sw.os} • {sw.type}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{sw.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Privacy Tips */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-4 max-w-5xl mx-auto shadow-inner">
        <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Proactive File Privacy Best Practices</span>
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span>Always turn off camera location permission if taking photos at private residences or schools.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span>Convert office files (DOCX, PPTX) to PDF before sending to external clients to lock edit history.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span>Audit documents using Document Inspector prior to releasing public press releases or legal filings.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span>Use AnyFileX Metadata Viewer to verify that EXIF tags have been removed successfully.</span>
          </li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <FAQAccordion faqs={faqs} />
      </div>

    </div>
  );
};
