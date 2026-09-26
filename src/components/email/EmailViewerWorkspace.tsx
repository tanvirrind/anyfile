'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Mail,
  MailCheck,
  MailWarning,
  FileText,
  Paperclip,
  Download,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Printer,
  Eye,
  Code2,
  FolderArchive,
  CheckCircle2,
  Sparkles,
  Lock,
  Cpu,
  ExternalLink,
  Copy,
  Layers,
  Search,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import {
  parseEml,
  parseMsg,
  parseTnef,
  parseMbox,
  exportEmailToPdf,
  convertToEmlString,
  getSampleEml,
  ParsedEmail,
  EmailAttachment,
  MboxSummaryItem,
  createEmailSandboxDocument,
} from '../../lib/email/emailEngine';
import { AppRoute } from '../../types';

interface EmailViewerWorkspaceProps {
  initialFile?: File;
  onNavigate?: (route: AppRoute) => void;
}

export const EmailViewerWorkspace: React.FC<EmailViewerWorkspaceProps> = ({ initialFile, onNavigate }) => {
  const [email, setEmail] = useState<ParsedEmail | null>(null);
  const [mboxItems, setMboxItems] = useState<MboxSummaryItem[] | null>(null);
  const [selectedMboxIndex, setSelectedMboxIndex] = useState<number>(1);
  const [fileName, setFileName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'attachments' | 'headers' | 'mbox'>('html');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [headerSearch, setHeaderSearch] = useState<string>('');
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [copiedHeader, setCopiedHeader] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFile) void processFile(initialFile);
  }, [initialFile]);

  // Parse dropped or selected file
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);

    try {
      const lowerName = file.name.toLowerCase();
      const ext = lowerName.split('.').pop() || '';

      if (ext === 'msg') {
        const buffer = await file.arrayBuffer();
        const parsed = parseMsg(buffer);
        setEmail(parsed);
        setMboxItems(null);
        setActiveTab(parsed.htmlBody ? 'html' : 'text');
      } else if (lowerName.includes('winmail') || ext === 'tnef' || ext === 'dat') {
        const buffer = await file.arrayBuffer();
        try {
          const parsed = parseTnef(buffer);
          setEmail(parsed);
          setMboxItems(null);
          setActiveTab(parsed.attachments.length > 0 ? 'attachments' : 'text');
        } catch {
          // If not binary TNEF, attempt EML text parse
          const text = await file.text();
          const parsed = parseEml(text, file.size);
          setEmail(parsed);
          setMboxItems(null);
          setActiveTab(parsed.htmlBody ? 'html' : 'text');
        }
      } else if (ext === 'mbox' || lowerName.includes('mailbox')) {
        const text = await file.text();
        const items = parseMbox(text);
        if (items.length > 0) {
          setMboxItems(items);
          setSelectedMboxIndex(1);
          const firstParsed = parseEml(items[0].rawContent, items[0].size);
          setEmail(firstParsed);
          setActiveTab('mbox');
        } else {
          const parsed = parseEml(text, file.size);
          setEmail(parsed);
          setMboxItems(null);
          setActiveTab(parsed.htmlBody ? 'html' : 'text');
        }
      } else {
        // Standard .eml or text email
        const text = await file.text();
        const parsed = parseEml(text, file.size);
        setEmail(parsed);
        setMboxItems(null);
        setActiveTab(parsed.htmlBody ? 'html' : 'text');
      }
    } catch (err: any) {
      console.error('Email parsing error:', err);
      setError(err?.message || 'Failed to parse email file. Please ensure it is a valid .eml, .msg, or .mbox document.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load interactive sample EML
  const loadSample = () => {
    setIsProcessing(true);
    setError(null);
    setFileName('sample_cloud_invoice.eml');
    try {
      const sampleText = getSampleEml();
      const parsed = parseEml(sampleText, sampleText.length);
      setEmail(parsed);
      setMboxItems(null);
      setActiveTab('html');
    } catch (err: any) {
      setError(err?.message || 'Failed to load sample.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
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

  const downloadAllAttachmentsAsZip = async () => {
    if (!email || email.attachments.length === 0) return;
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      email.attachments.forEach((att) => {
        zip.file(att.filename, att.data);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(email.subject || 'attachments').replace(/[^a-z0-9_-]/gi, '_')}_files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create attachments ZIP:', err);
    }
  };

  const handleExportPdf = async () => {
    if (!email) return;
    setIsExportingPdf(true);
    try {
      const pdfBlob = await exportEmailToPdf(email, { includeRawHeaders: true });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(email.subject || 'email_record').replace(/[^a-z0-9_-]/gi, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportEml = () => {
    if (!email) return;
    const emlString = convertToEmlString(email);
    const blob = new Blob([emlString], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(email.subject || 'exported_message').replace(/[^a-z0-9_-]/gi, '_')}.eml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHeader(label);
    setTimeout(() => setCopiedHeader(null), 2000);
  };

  // Filter raw headers
  const filteredHeaders = email?.rawHeaders.filter(
    (h) =>
      h.key.toLowerCase().includes(headerSearch.toLowerCase()) ||
      h.value.toLowerCase().includes(headerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Controls & Dropzone Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>In-Browser Email Inspector</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  100% Private
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports RFC 822 (.eml), Outlook (.msg), Mailboxes (.mbox), and winmail.dat (TNEF)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
              accept=".eml,.msg,.mbox,.dat,.tnef,message/rfc822,application/vnd.ms-outlook,text/plain"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
              <span>Open Email File</span>
            </button>
            <button
              onClick={loadSample}
              className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Load Sample EML</span>
            </button>
          </div>
        </div>

        {/* Drag and Drop Zone (if no email or as alternate) */}
        {!email && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40"
          >
            <Mail className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drag & Drop your .EML, .MSG, .MBOX, or winmail.dat file here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Your message is parsed entirely in local browser RAM using client-side JavaScript. No email text, headers, or attachments are uploaded to any server.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Email Viewer Interface */}
      {email && (
        <div className="space-y-6">
          {/* Header Metadata Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {email.format.toUpperCase()} Message • {(email.rawSize / 1024).toFixed(1)} KB
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {email.subject || '(No Subject)'}
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                  title="Export message and headers to printable PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
                </button>
                <button
                  onClick={handleExportEml}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Save as standardized RFC 822 EML file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save EML</span>
                </button>
              </div>
            </div>

            {/* Address Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-500 dark:text-slate-400 w-14 shrink-0">From:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 break-all select-all">
                    {email.from}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-500 dark:text-slate-400 w-14 shrink-0">To:</span>
                  <span className="text-slate-700 dark:text-slate-300 break-all select-all">
                    {email.to}
                  </span>
                </div>
                {email.cc && (
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400 w-14 shrink-0">Cc:</span>
                    <span className="text-slate-600 dark:text-slate-400 break-all select-all">
                      {email.cc}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-500 dark:text-slate-400 w-14 shrink-0">Date:</span>
                  <span className="text-slate-700 dark:text-slate-300">{email.date}</span>
                </div>
                {email.messageId && (
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400 w-14 shrink-0">Msg-ID:</span>
                    <span className="text-slate-500 font-mono text-[10px] truncate max-w-xs" title={email.messageId}>
                      {email.messageId}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-bold text-slate-500 dark:text-slate-400 w-14 shrink-0">Files:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {email.attachments.length === 0 ? 'No attachments' : `${email.attachments.length} attached file(s)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Audit Banner */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                {email.security.hasSuspiciousAttachments ? (
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                ) : email.security.spfStatus === 'Fail' ? (
                  <MailWarning className="w-5 h-5 text-amber-500 shrink-0" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Email Security Audit:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        email.security.hasSuspiciousAttachments
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {email.security.safeVerdict}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
                    <span>SPF: <strong>{email.security.spfStatus}</strong></span>
                    <span>DKIM: <strong>{email.security.dkimStatus}</strong></span>
                    <span>Attachments: <strong>{email.attachments.length}</strong></span>
                  </div>
                </div>
              </div>

              {email.attachments.length > 0 && (
                <button
                  onClick={() => setActiveTab('attachments')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Inspect Files ({email.attachments.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {mboxItems && mboxItems.length > 0 && (
              <button
                onClick={() => setActiveTab('mbox')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'mbox'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <FolderArchive className="w-4 h-4" />
                <span>Mailbox Messages ({mboxItems.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('html')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'html'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>HTML Formatted Body</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Plain Text Body</span>
            </button>

            <button
              onClick={() => setActiveTab('attachments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'attachments'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Paperclip className="w-4 h-4" />
              <span>Attachments ({email.attachments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('headers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'headers'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Raw RFC 822 Headers</span>
            </button>
          </div>

          {/* TAB 1: HTML Formatted Body */}
          {activeTab === 'html' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> Scripts & External Tracker Beacons Stripped for Privacy
                </span>
                <button
                  onClick={() => setActiveTab('text')}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  View as Plain Text
                </button>
              </div>

              {email.htmlBody ? (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 min-h-[350px] overflow-hidden">
                  <iframe
                    title="Sanitized email HTML preview"
                    sandbox=""
                    referrerPolicy="no-referrer"
                    srcDoc={createEmailSandboxDocument(email.htmlBody)}
                    className="w-full min-h-[350px] border-0 bg-white"
                  />
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
                  <Mail className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm font-semibold">No HTML body part found in this message.</p>
                  <p className="text-xs">Switch to Plain Text view to read message content.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Plain Text Body */}
          {activeTab === 'text' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Plaintext Decoded Message:</span>
                <button
                  onClick={() => copyToClipboard(email.textBody, 'body')}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedHeader === 'body' ? 'Copied Body!' : 'Copy Text'}</span>
                </button>
              </div>
              <pre className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto select-all max-h-[500px]">
                {email.textBody || '(Message body is empty)'}
              </pre>
            </div>
          )}

          {/* TAB 3: Attachments Inspector */}
          {activeTab === 'attachments' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <span>Embedded Files ({email.attachments.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inspected and safe to download in isolated browser memory.
                  </p>
                </div>
                {email.attachments.length > 1 && (
                  <button
                    onClick={downloadAllAttachmentsAsZip}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All as ZIP</span>
                  </button>
                )}
              </div>

              {email.attachments.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Paperclip className="w-10 h-10 mx-auto opacity-30" />
                  <p className="text-sm font-semibold">No attached files in this email.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {email.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white break-all">
                            {att.filename}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                              att.securityRisk === 'High Risk'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300'
                                : att.securityRisk === 'Warning'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                            }`}
                          >
                            {att.securityRisk}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(att.size / 1024).toFixed(1)} KB • {att.contentType}
                        </p>
                        {att.riskReason && (
                          <p className="text-[11px] text-amber-600 dark:text-amber-400 pt-1">
                            {att.riskReason}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {att.isInline ? 'Inline Image/Asset' : 'Standard Attachment'}
                        </span>
                        <button
                          onClick={() => downloadAttachment(att)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Raw RFC 822 Headers */}
          {activeTab === 'headers' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    RFC 822 Internet Mail Headers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inspect routing hops, authentication results, and client headers.
                  </p>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter headers (e.g. spf, dkim)..."
                    value={headerSearch}
                    onChange={(e) => setHeaderSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs w-full sm:w-64"
                  />
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[450px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
                    <tr>
                      <th className="p-3 w-1/4">Header Field</th>
                      <th className="p-3 w-3/4">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                    {filteredHeaders && filteredHeaders.length > 0 ? (
                      filteredHeaders.map((h, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-950/60">
                          <td className="p-3 font-semibold text-blue-600 dark:text-blue-400 align-top break-all">
                            {h.key}
                          </td>
                          <td className="p-3 text-slate-800 dark:text-slate-200 align-top break-all select-all">
                            {h.value}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-6 text-center text-slate-400 font-sans">
                          No matching headers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MBOX Mailbox List */}
          {activeTab === 'mbox' && mboxItems && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-blue-600" />
                  <span>Mailbox Archive ({mboxItems.length} Messages)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select any message to inspect its body, headers, and attachments in full detail.
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto">
                {mboxItems.map((item) => (
                  <button
                    key={item.index}
                    onClick={() => {
                      setSelectedMboxIndex(item.index);
                      const parsed = parseEml(item.rawContent, item.size);
                      setEmail(parsed);
                      setActiveTab(parsed.htmlBody ? 'html' : 'text');
                    }}
                    className={`w-full p-3.5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                      selectedMboxIndex === item.index
                        ? 'bg-blue-50 dark:bg-blue-950/50'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-950/40'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        #{item.index} {item.subject}
                      </div>
                      <div className="text-slate-500">
                        From: <span className="font-medium text-slate-700 dark:text-slate-300">{item.from}</span>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 shrink-0">
                      <div>{item.date}</div>
                      <div>{(item.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Email Workflows Navigation Footer */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-500">Related Email Tools:</span>
              <button
                onClick={() => onNavigate?.({ view: 'converter-detail', id: 'eml-to-pdf' })}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>EML to PDF Converter</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => onNavigate?.({ view: 'tool-detail', slug: 'winmail-extractor' })}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>Winmail.dat Extractor</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => onNavigate?.({ view: 'tool-detail', slug: 'msg-to-eml' })}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>Outlook MSG to EML</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => {
                setEmail(null);
                setMboxItems(null);
              }}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Inspect Another Email</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
