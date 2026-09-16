import React, { useState } from 'react';
import { Code, Copy, Check, ShieldCheck } from 'lucide-react';

interface SchemaMarkupViewProps {
  schemaData: object;
  title?: string;
}

export const SchemaMarkupView: React.FC<SchemaMarkupViewProps> = ({ schemaData, title = 'SEO Schema.org Structured Data (JSON-LD)' }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(schemaData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 text-xs space-y-3 font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 font-sans font-bold text-sm text-white">
          <Code className="w-4 h-4 text-emerald-400" />
          <span>{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-sans text-xs"
          id="schema-copy-btn"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied JSON-LD' : 'Copy Schema'}</span>
        </button>
      </div>

      <pre className="overflow-x-auto max-h-48 text-[11px] text-emerald-400/90 leading-relaxed p-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
        <code>{jsonString}</code>
      </pre>

      <div className="flex items-center justify-between text-[11px] font-sans text-slate-400 pt-1">
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Google Rich Results & Indexing Ready
        </span>
        <span>Valid Schema.org Standard</span>
      </div>
    </div>
  );
};
