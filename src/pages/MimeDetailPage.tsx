import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Share2,
  FileCode,
  ShieldCheck,
  Laptop,
  CheckCircle2,
  ArrowRight,
  Terminal,
  ExternalLink,
  Layers,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { FAQAccordion } from '../components/FAQAccordion';
import { SchemaMarkupView } from '../components/SchemaMarkupView';
import { SEOHead } from '../components/SEOHead';
import { parseMimeSlug } from '../data/expandedMimeDatabase';

interface MimeDetailPageProps {
  onNavigate: (route: AppRoute) => void;
  mimeSlug: string;
}

export const MimeDetailPage: React.FC<MimeDetailPageProps> = ({ onNavigate, mimeSlug }) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'nginx' | 'apache' | 'express' | 'python'>('nginx');

  const mimeInfo = parseMimeSlug(mimeSlug);

  const handleCopyCode = (codeText: string, tabKey: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedTab(tabKey);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const nginxSnippet = `# Nginx mime.types configuration for .${mimeInfo.extension}
types {
    ${mimeInfo.mimeType}    ${mimeInfo.extension.toLowerCase()};
}`;

  const apacheSnippet = `# Apache .htaccess configuration for .${mimeInfo.extension}
AddType ${mimeInfo.mimeType} .${mimeInfo.extension.toLowerCase()}`;

  const expressSnippet = `// Node.js Express.js Content-Type Header setup
app.get('/file.${mimeInfo.extension.toLowerCase()}', (req, res) => {
  res.setHeader('Content-Type', '${mimeInfo.mimeType}');
  res.sendFile(filePath);
});`;

  const pythonSnippet = `# Python Flask / FastAPI Content-Type Response
from flask import Flask, send_file
app = Flask(__name__)

@app.route('/download')
def download():
    return send_file('file.${mimeInfo.extension.toLowerCase()}', mimetype='${mimeInfo.mimeType}')`;

  const snippets = {
    nginx: nginxSnippet,
    apache: apacheSnippet,
    express: expressSnippet,
    python: pythonSnippet
  };

  const faqs = [
    {
      question: `What is the official MIME type for .${mimeInfo.extension}?`,
      answer: `The official MIME content type for .${mimeInfo.extension} files is "${mimeInfo.mimeType}". Web servers use this header to instruct browsers how to render or process .${mimeInfo.extension} data.`
    },
    {
      question: `Which operating systems support .${mimeInfo.extension} natively?`,
      answer: `.${mimeInfo.extension} is supported across: ${mimeInfo.supportedOs.join(', ').toUpperCase()}.`
    },
    {
      question: `How do I configure my web server to serve .${mimeInfo.extension} with the correct Content-Type?`,
      answer: `Add "${mimeInfo.mimeType}" to your server's mime.types configuration file (Nginx, Apache, or Express middleware) as shown in the developer snippets above.`
    }
  ];

  const schemaTechArticle = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `MIME Type Specification: ${mimeInfo.mimeType} (.${mimeInfo.extension})`,
    description: `Complete technical specification, RFC references, magic bytes, and server configuration for MIME type ${mimeInfo.mimeType}.`,
    dependencies: mimeInfo.mimeType,
    proficiencyLevel: 'Beginner'
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title={`${mimeInfo.mimeType} MIME Type – .${mimeInfo.extension.toUpperCase()} Content-Type Header`}
        description={`Full specification for MIME type ${mimeInfo.mimeType} (${mimeInfo.name}). Includes Nginx, Apache, Node.js configuration snippets and magic bytes.`}
        canonicalPath={`/mime/${mimeSlug}`}
        schemaData={schemaTechArticle}
      />
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'MIME Checker', route: { view: 'mime-checker' } },
          { label: `${mimeInfo.mimeType}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">
          <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Technical MIME Specification & Web Server Guide</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
          {mimeInfo.mimeType}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Technical overview, official IANA specification, header magic bytes, and server configuration snippets for <strong>.{mimeInfo.extension.toUpperCase()}</strong> files ({mimeInfo.name}).
        </p>
      </div>

      {/* Main Specs Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 max-w-4xl mx-auto">
        {/* Specification Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">File Extension</span>
            <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">
              .{mimeInfo.extension.toLowerCase()}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Content-Type Header</span>
            <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {mimeInfo.mimeType}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Format Category</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {mimeInfo.category}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Standard Specification</span>
            <p className="text-lg font-mono text-slate-700 dark:text-slate-300">
              {mimeInfo.rfcStandard || 'IANA Registered Standard'}
            </p>
          </div>
        </div>

        {/* Format Overview */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Description & Usage</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {mimeInfo.description}
          </p>
        </div>

        {/* Server Code Snippets Box */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>HTTP Server Content-Type Configuration Code</span>
            </h3>
          </div>

          {/* Snippet Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
            {(['nginx', 'apache', 'express', 'python'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSnippetTab(tab)}
                className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-colors cursor-pointer uppercase ${
                  activeSnippetTab === tab
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative p-5 rounded-2xl bg-slate-950 text-white font-mono text-xs border border-slate-800">
            <button
              onClick={() => handleCopyCode(snippets[activeSnippetTab], activeSnippetTab)}
              className="absolute right-3 top-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedTab === activeSnippetTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTab === activeSnippetTab ? 'Copied' : 'Copy Snippet'}</span>
            </button>

            <pre className="overflow-x-auto text-emerald-400 leading-relaxed pt-6">
              <code>{snippets[activeSnippetTab]}</code>
            </pre>
          </div>
        </div>

        {/* Operating Systems Support */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">OS Compatibility Matrix</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: 'windows', name: 'Windows' },
              { key: 'mac', name: 'macOS' },
              { key: 'linux', name: 'Linux' },
              { key: 'android', name: 'Android' },
              { key: 'ios', name: 'iOS' },
            ].map((os) => {
              const supported = mimeInfo.supportedOs.includes(os.key as any);
              return (
                <div
                  key={os.key}
                  className={`p-3 rounded-2xl border text-center space-y-1 ${
                    supported
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 mx-auto ${
                      supported ? 'text-emerald-600' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                  <span className="font-bold text-xs block">{os.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base">Want to test header signatures or binary files?</h4>
            <p className="text-xs text-slate-300">
              Run binary magic byte inspection in Magic Byte Detector.
            </p>
          </div>
          <button
            onClick={() => onNavigate({ view: 'magic-byte-detector' })}
            className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Open Magic Byte Detector</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto">
        <FAQAccordion faqs={faqs} />
      </div>

      {/* Schema.org */}
      <div className="max-w-4xl mx-auto">
        <SchemaMarkupView schemaData={schemaTechArticle} />
      </div>
    </div>
  );
};
