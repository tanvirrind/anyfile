import React from 'react';
import {
  Eye,
  ShieldCheck,
  Zap,
  Camera,
  FileText,
  MapPin,
  AlertTriangle,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { MetadataUploader } from '../components/MetadataUploader';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';

interface MetadataViewerPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const MetadataViewerPage: React.FC<MetadataViewerPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      question: 'What is metadata in files?',
      answer: 'Metadata is hidden information stored inside files. In photos, metadata (EXIF/XMP) includes camera model, shutter speed, ISO, exact GPS location, and date taken. In documents (PDF/DOCX), metadata includes author name, software version, revision count, and edit timestamp.'
    },
    {
      question: 'Is my file uploaded to any remote server?',
      answer: 'No. All file parsing, EXIF chunk reading, and metadata extraction occur 100% locally inside your web browser RAM using WebAssembly and HTML5 APIs. Your private photos and documents never leave your device.'
    },
    {
      question: 'Why should I check file metadata for privacy risks?',
      answer: 'Sharing photos online without stripping EXIF metadata can leak your exact physical location (GPS coordinates), home address, camera serial numbers, and device names to strangers. Checking metadata helps you identify sensitive data before publishing.'
    },
    {
      question: 'How do I remove metadata from my files?',
      answer: 'You can use our free Remove Metadata tool to scrub EXIF, GPS, author names, and revision history directly in your browser.'
    }
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AnyFileX File Metadata Viewer',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    description: 'Inspect hidden EXIF, GPS, camera specs, and author metadata inside image and document files directly in your web browser.'
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="EXIF & File Metadata Viewer – Inspect Hidden Tag Data"
        description="View deep EXIF, ID3, PDF metadata, GPS geolocation tags, and camera parameters directly in your browser without uploading."
        canonicalPath="/tools/metadata-viewer"
        schemaData={schemaJson}
      />
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'Metadata Viewer' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">
          <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Client-Side EXIF & Document Inspector</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          File Metadata Analysis System
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Inspect hidden EXIF camera parameters, GPS coordinates, author names, software revisions, and privacy risks embedded inside photos and documents.
        </p>
      </div>

      {/* Privacy Warning Banner */}
      <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/80 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <p className="font-bold">Privacy Warning Notice:</p>
          <p>
            Metadata can contain personal information such as exact home GPS coordinates, device serial numbers, personal author names, and internal corporate document revision histories. Always audit files before publishing.
          </p>
        </div>
      </div>

      {/* Main Upload Drag-and-Drop Component */}
      <div className="max-w-4xl mx-auto">
        <MetadataUploader onNavigate={onNavigate} />
      </div>

      {/* Supported File Types Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Supported File Types & Extracted Properties
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            AnyFileX extracts detailed binary headers across popular image and document formats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images Card */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Images</h3>
                <p className="text-xs text-slate-500">JPG, JPEG, PNG, HEIC, WEBP</p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span><strong>Camera Hardware:</strong> Make, Model, Body Serial Number</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span><strong>Lens & Exposure:</strong> Lens Specification, Focal Length, Aperture, ISO, Shutter Speed</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span><strong>GPS Geolocation:</strong> Latitude, Longitude, Altitude, Map Coordinates</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span><strong>Image Spec:</strong> Date Taken, Width x Height Resolution, Megapixels, Color Space</span>
              </li>
            </ul>
          </div>

          {/* Documents Card */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Documents</h3>
                <p className="text-xs text-slate-500">PDF, DOCX, XLSX, PPTX</p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span><strong>Authoring Info:</strong> Document Author, Company, Original Creator</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span><strong>Creator Software:</strong> Application Version, PDF Producer, Generator Signature</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span><strong>Timestamps:</strong> Creation Date, Last Saved Date, Total Editing Duration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span><strong>Structure:</strong> Page Count, Sheet Count, Slide Count, Revision Number</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Link to Remove Metadata Page */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base">Need to strip metadata from your files?</h4>
            <p className="text-xs text-slate-300">
              Learn how to clean EXIF and document properties or use our browser scrubber.
            </p>
          </div>
          <button
            onClick={() => onNavigate({ view: 'remove-metadata' })}
            className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Remove Metadata Guide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <FAQAccordion faqs={faqs} />
      </div>

    </div>
  );
};
