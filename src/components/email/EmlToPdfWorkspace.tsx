import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Mail,
  Printer,
  Sparkles,
  Lock,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Paperclip,
  ExternalLink,
  ArrowRight,
  Settings2,
} from 'lucide-react';
import {
  parseEml,
  parseMsg,
  exportEmailToPdf,
  getSampleEml,
  ParsedEmail,
} from '../../lib/email/emailEngine';
import { AppRoute } from '../../types';

interface EmlToPdfWorkspaceProps {
  onNavigate?: (route: AppRoute) => void;
}

export const EmlToPdfWorkspace: React.FC<EmlToPdfWorkspaceProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState<ParsedEmail | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [includeRawHeaders, setIncludeRawHeaders] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsConverting(true);
    setError(null);
    setPdfBlobUrl(null);
    setFileName(file.name);

    try {
      let parsed: ParsedEmail;
      const lower = file.name.toLowerCase();
      if (lower.endsWith('.msg')) {
        const buf = await file.arrayBuffer();
        parsed = parseMsg(buf);
      } else {
        const text = await file.text();
        parsed = parseEml(text, file.size);
      }
      setEmail(parsed);

      const blob = await exportEmailToPdf(parsed, { includeRawHeaders });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err: any) {
      console.error('EML to PDF conversion failed:', err);
      setError(err?.message || 'Failed to parse and convert email.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleReconvert = async (includeHeaders: boolean) => {
    if (!email) return;
    setIsConverting(true);
    try {
      const blob = await exportEmailToPdf(email, { includeRawHeaders: includeHeaders });
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err: any) {
      setError(err?.message || 'Failed to regenerate PDF.');
    } finally {
      setIsConverting(false);
    }
  };

  const loadSample = async () => {
    setIsConverting(true);
    setError(null);
    setFileName('sample_invoice.eml');
    try {
      const sample = getSampleEml();
      const parsed = parseEml(sample, sample.length);
      setEmail(parsed);
      const blob = await exportEmailToPdf(parsed, { includeRawHeaders });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err: any) {
      setError(err?.message || 'Failed to load sample.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>EML to PDF Converter</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  Legal Compliance Ready
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transforms RFC 822 email files into archival PDF records in browser memory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept=".eml,.msg,message/rfc822"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Select .EML or .MSG File</span>
            </button>
            <button
              onClick={loadSample}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sample EML</span>
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        {!email && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40"
          >
            <FileText className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drag & Drop your .EML or .MSG email file here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Preserves exact email timestamp headers, sender details, message body, and attachment manifests with zero cloud uploads.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Converted Email Result & PDF Download */}
        {email && (
          <div className="space-y-6 pt-2">
            {/* Options Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-slate-900 dark:text-white">PDF Archival Options:</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeRawHeaders}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setIncludeRawHeaders(val);
                    handleReconvert(val);
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Append Forensic RFC 822 Headers Appendix
                </span>
              </label>
            </div>

            {/* Email Summary Box */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Ready to Download
                </span>
                <span className="text-xs text-slate-500">
                  {email.attachments.length} attachment(s) listed in header
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {email.subject || '(No Subject)'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div>From: <strong className="text-slate-900 dark:text-white">{email.from}</strong></div>
                <div>Date: <strong className="text-slate-900 dark:text-white">{email.date}</strong></div>
                <div>To: <span className="text-slate-800 dark:text-slate-200">{email.to}</span></div>
                {email.cc && <div>Cc: <span className="text-slate-800 dark:text-slate-200">{email.cc}</span></div>}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                {pdfBlobUrl && (
                  <a
                    href={pdfBlobUrl}
                    download={`${(email.subject || 'email_record').replace(/[^a-z0-9_-]/gi, '_')}.pdf`}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Document</span>
                  </a>
                )}
                <button
                  onClick={() => onNavigate?.({ view: 'tool-detail', slug: 'email-viewer' })}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open in Interactive Email Viewer</span>
                </button>
              </div>
            </div>

            {/* Embedded PDF Preview iframe */}
            {pdfBlobUrl && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Document Preview:
                </span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden h-[450px] bg-slate-100 dark:bg-slate-950">
                  <iframe
                    src={pdfBlobUrl}
                    title="PDF Email Preview"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helpful FAQ / Guide Snippet */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Why convert EML files to PDF?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          While .eml files require specialized email clients (like Thunderbird, Outlook, or Apple Mail) to display formatted rich-text, PDF is universally viewable on every phone, tablet, browser, and computer without email configuration. Converting email archives to PDF preserves legal evidentiary timestamps, authentic sender data, and provides immutable audit records for finance, legal discovery, and business records.
        </p>
      </div>
    </div>
  );
};
