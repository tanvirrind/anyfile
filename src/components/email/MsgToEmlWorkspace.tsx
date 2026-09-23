import React, { useState, useRef } from 'react';
import {
  Mail,
  Download,
  FileCode,
  Sparkles,
  Lock,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { parseMsg, convertToEmlString, ParsedEmail } from '../../lib/email/emailEngine';
import { AppRoute } from '../../types';

interface MsgToEmlWorkspaceProps {
  onNavigate?: (route: AppRoute) => void;
}

export const MsgToEmlWorkspace: React.FC<MsgToEmlWorkspaceProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState<ParsedEmail | null>(null);
  const [emlBlobUrl, setEmlBlobUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsConverting(true);
    setError(null);
    setEmlBlobUrl(null);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const parsed = parseMsg(buffer);
      setEmail(parsed);

      const emlText = convertToEmlString(parsed);
      const blob = new Blob([emlText], { type: 'message/rfc822' });
      const url = URL.createObjectURL(blob);
      setEmlBlobUrl(url);
    } catch (err: any) {
      console.error('MSG to EML conversion error:', err);
      setError(err?.message || 'Failed to convert Outlook .msg file. Please verify it is a valid Outlook item.');
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
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Outlook MSG to EML Converter</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  Open Standards
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Converts proprietary Outlook .msg compound binary files to open RFC 822 .eml format
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept=".msg,application/vnd.ms-outlook"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Select .MSG File</span>
            </button>
          </div>
        </div>

        {/* Dropzone */}
        {!email && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40"
          >
            <Mail className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drag & Drop your Microsoft Outlook .MSG file here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Extracts subject, sender, body, and embedded attachments into an open, cross-platform RFC 822 standard email compatible with Apple Mail, Thunderbird, and Gmail.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Converted Result */}
        {email && (
          <div className="space-y-6 pt-2">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Conversion Complete • Standard EML Generated
                </span>
                <span className="text-xs text-slate-500">
                  {email.attachments.length} attachment(s) preserved
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {email.subject || '(No Subject)'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div>From: <strong className="text-slate-900 dark:text-white">{email.from}</strong></div>
                <div>To: <strong className="text-slate-900 dark:text-white">{email.to}</strong></div>
                <div>Date: <span className="text-slate-800 dark:text-slate-200">{email.date}</span></div>
                {email.cc && <div>Cc: <span className="text-slate-800 dark:text-slate-200">{email.cc}</span></div>}
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                {emlBlobUrl && (
                  <a
                    href={emlBlobUrl}
                    download={`${(email.subject || 'converted_message').replace(/[^a-z0-9_-]/gi, '_')}.eml`}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Standard .EML File</span>
                  </a>
                )}
                <button
                  onClick={() => onNavigate?.({ view: 'tool-detail', slug: 'email-viewer' })}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Inspect in Email Viewer</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => onNavigate?.({ view: 'converter-detail', id: 'eml-to-pdf' })}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>Need to export to PDF instead?</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setEmail(null);
                  setEmlBlobUrl(null);
                }}
                className="text-slate-500 hover:text-slate-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Convert Another File</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guide Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Why convert Outlook MSG to standard EML?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The Microsoft Outlook .MSG format is a proprietary Compound File Binary Format (CFBF/OLE2) designed specifically for Windows Outlook. Other operating systems (macOS, Linux, iOS, Android) and modern mail clients cannot open .MSG files without specialized third-party software. Converting .MSG into RFC 822 .EML translates the message into the universal open internet standard, readable by Apple Mail, Mozilla Thunderbird, Windows Mail, and webmail clients worldwide.
        </p>
      </div>
    </div>
  );
};
