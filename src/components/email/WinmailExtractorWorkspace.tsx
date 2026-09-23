'use client';

import React, { useState, useRef } from 'react';
import {
  FolderArchive,
  Download,
  FileText,
  AlertTriangle,
  Sparkles,
  Lock,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Paperclip,
  ArrowRight,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { parseTnef, EmailAttachment, ParsedEmail } from '../../lib/email/emailEngine';
import { AppRoute } from '../../types';

interface WinmailExtractorWorkspaceProps {
  onNavigate?: (route: AppRoute) => void;
}

export const WinmailExtractorWorkspace: React.FC<WinmailExtractorWorkspaceProps> = ({ onNavigate }) => {
  const [result, setResult] = useState<ParsedEmail | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const parsed = parseTnef(buffer);
      setResult(parsed);
    } catch (err: any) {
      console.error('Failed to parse winmail.dat:', err);
      setError(
        err?.message ||
          'Failed to decode winmail.dat file. Please ensure this is an authentic Microsoft Outlook TNEF attachment.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) processFile(dropped);
  };

  const downloadAttachment = (att: EmailAttachment) => {
    const blob = new Blob([att.data], { type: att.contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = att.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllAsZip = async () => {
    if (!result || result.attachments.length === 0) return;
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      result.attachments.forEach((att) => {
        zip.file(att.filename, att.data);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'winmail_extracted_files.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to bundle winmail attachments into ZIP:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Winmail.dat (TNEF) Extractor</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Zero Upload
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Extract hidden files and documents trapped in Microsoft Outlook winmail.dat attachments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
              accept=".dat,.tnef,application/ms-tnef,application/vnd.ms-outlook"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
              <span>Select winmail.dat File</span>
            </button>
          </div>
        </div>

        {/* Dropzone */}
        {!result && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40"
          >
            <FolderArchive className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drag & Drop your winmail.dat attachment here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              AnyFileX decodes the Microsoft Transport Neutral Encapsulation Format (TNEF) binary stream in memory and restores your trapped files.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Extracted Content Results */}
        {result && (
          <div className="space-y-6 pt-2">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-950/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    TNEF Package Decoded
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {result.subject || 'winmail.dat Package'}
                  </h3>
                </div>
                {result.attachments.length > 1 && (
                  <button
                    onClick={downloadAllAsZip}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All as ZIP</span>
                  </button>
                )}
              </div>

              {/* Attachments List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Extracted Files ({result.attachments.length}):
                </span>
                {result.attachments.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    No files were packaged inside this winmail.dat file. The attachment only contained Outlook rich-text styling.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-0.5 truncate">
                          <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {att.filename}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {(att.size / 1024).toFixed(1)} KB • {att.contentType}
                          </div>
                        </div>
                        <button
                          onClick={() => downloadAttachment(att)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message text if available */}
              {result.textBody && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Extracted Message Notes:
                  </span>
                  <pre className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                    {result.textBody}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate?.({ view: 'tool-detail', slug: 'email-viewer' })}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>Need to view full EML or MSG emails?</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setResult(null)}
                className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Extract Another File</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Explanatory Educational Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>What is a winmail.dat file and why did you receive it?</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          When a sender uses Microsoft Outlook and composes an email formatted in Microsoft Rich Text Format (RTF), Outlook and Exchange use a proprietary format called Transport Neutral Encapsulation Format (TNEF) to encode colors, fonts, and attachments. If the recipient uses a non-Exchange client (like Gmail, Apple Mail, Thunderbird, or Android Mail), the client cannot decode the TNEF stream and simply displays the entire package as an unopenable <strong>winmail.dat</strong> attachment. AnyFileX parses the binary structure in your browser memory and frees your documents without sharing sensitive contents with external services.
        </p>
      </div>
    </div>
  );
};
