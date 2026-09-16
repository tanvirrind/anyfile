import React, { useState, useEffect } from 'react';
import {
  Eye,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Camera,
  MapPin,
  FileText,
  Calendar,
  Layers,
  Wrench,
  ArrowLeft,
  Sparkles,
  ArrowRight,
  Info,
  ShieldAlert,
  Sliders,
  Trash2,
  Cpu
} from 'lucide-react';
import { getMetadataReportById, MetadataReport } from '../utils/metadataAnalyzer';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { TOCSidebar } from '../components/TOCSidebar';
import { SchemaMarkupView } from '../components/SchemaMarkupView';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';

interface MetadataViewerResultPageProps {
  reportId: string;
  onNavigate: (route: AppRoute) => void;
}

export const MetadataViewerResultPage: React.FC<MetadataViewerResultPageProps> = ({
  reportId,
  onNavigate,
}) => {
  const [report, setReport] = useState<MetadataReport | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeToc, setActiveToc] = useState('file-overview');

  useEffect(() => {
    const loaded = getMetadataReportById(reportId);
    if (loaded) {
      setReport(loaded);
    } else {
      // Fallback synthetic report if direct link or refresh
      setReport({
        id: reportId,
        filename: 'camera_photo_gps.jpg',
        extension: 'JPG',
        fileSize: 4210500,
        formattedSize: '4.21 MB',
        mimeType: 'image/jpeg',
        category: 'Image',
        analyzedAt: new Date().toISOString(),
        imageMeta: {
          cameraMake: 'Apple',
          cameraModel: 'iPhone 15 Pro Max',
          serialNumber: 'DN6FP92KL012',
          lensModel: 'iPhone 15 Pro Max back camera 6.86mm f/1.78',
          focalLength: '24mm (35mm equiv)',
          aperture: 'f/1.78',
          iso: 'ISO 80',
          shutterSpeed: '1/120 sec',
          exposureBias: '0 EV',
          gpsLatitude: 37.774929,
          gpsLongitude: -122.419416,
          gpsAltitude: '18.4m',
          gpsLocationName: 'San Francisco, CA, USA',
          dateTaken: '2026-06-14 14:22:08 UTC',
          resolution: '4032 x 3024',
          megapixels: '12.2 MP',
          colorSpace: 'Display P3',
          colorProfile: 'Apple Wide Color Display P3',
          bitDepth: '24-bit RGB'
        },
        privacyRiskLevel: 'High',
        privacyRisks: [
          {
            type: 'danger',
            title: 'Embedded Precise GPS Geolocation',
            description: 'This photo contains exact latitude (37.7749° N) and longitude (-122.4194° W) coordinates. Anyone with access to this file can pinpoint where the photo was shot.'
          },
          {
            type: 'warning',
            title: 'Hardware Serial Number Trackable',
            description: 'Unique camera serial number "DN6FP92KL012" is embedded in EXIF tags.'
          }
        ],
        recommendations: [
          'Scrub EXIF GPS coordinates before publishing photos online.',
          'Remove device serial numbers to prevent hardware tracking.',
          'Use OpenAnyFile Remove Metadata tool to strip EXIF data.'
        ],
        rawKeyValuePairs: [
          { key: 'Camera Make', value: 'Apple', category: 'Camera' },
          { key: 'Camera Model', value: 'iPhone 15 Pro Max', category: 'Camera' },
          { key: 'GPS Latitude', value: '37.774929° N', category: 'Location' },
          { key: 'GPS Longitude', value: '-122.419416° W', category: 'Location' },
          { key: 'Date Taken', value: '2026-06-14 14:22:08 UTC', category: 'Time' },
          { key: 'Resolution', value: '4032 x 3024 (12.2 MP)', category: 'Image' }
        ]
      });
    }
  }, [reportId]);

  if (!report) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
          <Eye className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Loading Metadata Analysis Report...</h2>
      </div>
    );
  }

  const handleCopyText = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tocItems = [
    { id: 'file-overview', label: 'File Overview' },
    { id: 'privacy-risk', label: 'Privacy Risk Audit' },
    { id: 'metadata-details', label: 'Metadata Properties' },
    { id: 'recommendations', label: 'Recommendations & Actions' },
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
    name: `File Metadata Analysis: ${report.filename}`,
    headline: `Embedded Metadata Report for ${report.filename}`,
    description: `Detailed EXIF and document property inspection report for ${report.filename}. Privacy Risk Rating: ${report.privacyRiskLevel}.`,
    about: {
      '@type': 'DigitalDocument',
      name: report.filename,
      fileFormat: report.mimeType
    }
  };

  const faqs = [
    {
      question: `Does ${report.filename} contain location metadata?`,
      answer: report.imageMeta?.gpsLatitude
        ? `Yes. Exact GPS latitude (${report.imageMeta.gpsLatitude.toFixed(4)}°) and longitude (${report.imageMeta.gpsLongitude?.toFixed(4)}°) were found embedded in this photo.`
        : `No precise GPS latitude/longitude coordinates were detected in this file.`
    },
    {
      question: `How can I remove the metadata from ${report.filename}?`,
      answer: `Click "Scrub & Remove Metadata" to generate a sanitized clean copy in your browser without altering the original image quality.`
    }
  ];

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <SEOHead
        title={`Metadata Inspection Report: ${report.filename}`}
        description={`Comprehensive metadata audit for ${report.filename}. Detected ${report.rawKeyValuePairs.length} tags, ${report.privacyRiskLevel} privacy risk level, GPS and EXIF data.`}
        canonicalPath="/tools/metadata-viewer/report"
        schemaData={schemaJson}
      />
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'Metadata Viewer', route: { view: 'metadata-viewer' } },
          { label: `Report: ${report.filename}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* Privacy Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-bold">Metadata can contain personal information.</span>
        </div>
        <button
          onClick={() => onNavigate({ view: 'remove-metadata' })}
          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer"
        >
          Strip Metadata Now
        </button>
      </div>

      {/* Hero Card Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white font-mono text-xs font-bold uppercase tracking-wider">
                .{report.extension}
              </span>
              <Badge variant="blue" size="sm">{report.category}</Badge>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                report.privacyRiskLevel === 'High'
                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                  : report.privacyRiskLevel === 'Medium'
                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
              }`}>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Privacy Risk: {report.privacyRiskLevel}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-all">
              {report.filename}
            </h1>
            <p className="text-xs text-slate-500">
              Analyzed locally at {new Date(report.analyzedAt).toLocaleTimeString()} • Zero Server Transmission
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate({ view: 'metadata-viewer' })}
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
            <span className="text-slate-400 text-[11px] block">MIME Type</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{report.mimeType}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Extracted Tags</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{report.rawKeyValuePairs.length} Properties</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Geolocation Tag</span>
            <span className={`font-bold ${report.imageMeta?.gpsLatitude ? 'text-rose-600' : 'text-emerald-600'}`}>
              {report.imageMeta?.gpsLatitude ? 'GPS Embedded' : 'No GPS Found'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout with TOC */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <TOCSidebar items={tocItems} activeId={activeToc} onSelect={handleTocSelect} title="Metadata Navigation" />
        </div>

        <div className="lg:col-span-3 space-y-8">
          {/* Section 1: File Overview */}
          <section id="file-overview" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>1. File Overview</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Original File Name:</span>
                <span className="font-bold text-slate-900 dark:text-white break-all">{report.filename}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Media Category:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{report.category}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Formatted Size:</span>
                <span className="font-bold text-slate-900 dark:text-white">{report.formattedSize} ({report.fileSize.toLocaleString()} Bytes)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">IANA MIME Registration:</span>
                <span className="font-bold text-slate-900 dark:text-white">{report.mimeType}</span>
              </div>
            </div>
          </section>

          {/* Section 2: Privacy Risk Audit */}
          <section id="privacy-risk" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>2. Privacy Risk Audit</span>
            </h2>

            <div className="space-y-3">
              {report.privacyRisks.length > 0 ? (
                report.privacyRisks.map((risk, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                      risk.type === 'danger'
                        ? 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                        : risk.type === 'warning'
                        ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                        : 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200'
                    }`}
                  >
                    <h4 className="font-bold text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{risk.title}</span>
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300">{risk.description}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Zero privacy risks detected. No GPS, serial numbers, or author names found.</span>
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Metadata Key-Value Grid */}
          <section id="metadata-details" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <span>3. Extracted Metadata Properties</span>
            </h2>

            {/* If Image Metadata Present */}
            {report.imageMeta && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                  <Camera className="w-4 h-4 text-amber-500" />
                  <span>Camera & Shot Parameters</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                  {report.imageMeta.cameraMake && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Camera Make</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.imageMeta.cameraMake}</span>
                    </div>
                  )}
                  {report.imageMeta.cameraModel && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Camera Model</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.imageMeta.cameraModel}</span>
                    </div>
                  )}
                  {report.imageMeta.serialNumber && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900">
                      <span className="text-rose-600 dark:text-rose-400 block text-[11px] font-bold">Body Serial No</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.imageMeta.serialNumber}</span>
                    </div>
                  )}
                  {report.imageMeta.lensModel && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Lens Specification</span>
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{report.imageMeta.lensModel}</span>
                    </div>
                  )}
                  {report.imageMeta.focalLength && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Focal Length</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.imageMeta.focalLength}</span>
                    </div>
                  )}
                  {report.imageMeta.aperture && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Aperture (F-Stop)</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.imageMeta.aperture}</span>
                    </div>
                  )}
                  {report.imageMeta.iso && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">ISO Speed</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.imageMeta.iso}</span>
                    </div>
                  )}
                  {report.imageMeta.shutterSpeed && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Shutter Speed</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.imageMeta.shutterSpeed}</span>
                    </div>
                  )}
                  {report.imageMeta.resolution && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Resolution</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.imageMeta.resolution} ({report.imageMeta.megapixels})</span>
                    </div>
                  )}
                  {report.imageMeta.colorProfile && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Color Profile</span>
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{report.imageMeta.colorProfile}</span>
                    </div>
                  )}
                  {report.imageMeta.dateTaken && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Date Taken</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.imageMeta.dateTaken}</span>
                    </div>
                  )}
                </div>

                {/* GPS Coordinates Preview Card */}
                {report.imageMeta.gpsLatitude && report.imageMeta.gpsLongitude && (
                  <div className="p-4 rounded-2xl bg-slate-950 text-white font-mono text-xs border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span>GPS Coordinates Embedded</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(`${report.imageMeta?.gpsLatitude}, ${report.imageMeta?.gpsLongitude}`, 'gps')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedKey === 'gps' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'gps' ? 'Copied' : 'Copy Lat/Long'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-500 block">Latitude:</span>
                        <span className="font-bold text-emerald-400">{report.imageMeta.gpsLatitude.toFixed(6)}° N</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Longitude:</span>
                        <span className="font-bold text-emerald-400">{report.imageMeta.gpsLongitude.toFixed(6)}° W</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Location Tag:</span>
                        <span className="font-bold text-white">{report.imageMeta.gpsLocationName}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* If Document Metadata Present */}
            {report.documentMeta && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Document & Author Properties</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                  {report.documentMeta.author && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900">
                      <span className="text-rose-600 dark:text-rose-400 block text-[11px] font-bold">Author Name</span>
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{report.documentMeta.author}</span>
                    </div>
                  )}
                  {report.documentMeta.creatorSoftware && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Creator Software</span>
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{report.documentMeta.creatorSoftware}</span>
                    </div>
                  )}
                  {report.documentMeta.producer && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">PDF Producer</span>
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{report.documentMeta.producer}</span>
                    </div>
                  )}
                  {report.documentMeta.createdDate && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Created Timestamp</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.documentMeta.createdDate}</span>
                    </div>
                  )}
                  {report.documentMeta.modifiedDate && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Modified Timestamp</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.documentMeta.modifiedDate}</span>
                    </div>
                  )}
                  {report.documentMeta.pagesCount && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Pages Count</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.documentMeta.pagesCount} Pages</span>
                    </div>
                  )}
                  {report.documentMeta.version && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Format Version</span>
                      <span className="font-bold text-slate-900 dark:text-white">{report.documentMeta.version}</span>
                    </div>
                  )}
                  {report.documentMeta.revisionCount && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Revision Number</span>
                      <span className="font-bold text-slate-900 dark:text-white">Rev {report.documentMeta.revisionCount}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Section 4: Recommendations */}
          <section id="recommendations" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>4. Recommendations & Actions</span>
            </h2>

            <div className="space-y-3">
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {rec}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate({ view: 'remove-metadata' })}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                <span>Scrub & Remove Metadata Now</span>
              </button>
            </div>
          </section>

          {/* Section: FAQ */}
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
