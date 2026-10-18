'use client';

import React, { useState } from 'react';
import { Link2, Copy, CheckCircle2, RefreshCw } from 'lucide-react';

export const UrlCodecWorkspace: React.FC = () => {
  const [mode, setMode] = useState<'component' | 'full'>('component');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError(null);
    setCopied(false);
    if (!input) {
      setOutput('');
      return;
    }
    try {
      if (direction === 'encode') {
        setOutput(mode === 'component' ? encodeURIComponent(input) : encodeURI(input));
      } else {
        // Be tolerant: try decodeURIComponent first (component mode), fall back to decodeURI.
        try {
          setOutput(decodeURIComponent(input));
        } catch {
          setOutput(decodeURI(input));
        }
      }
    } catch {
      setError('Could not process this input. Malformed percent-sequences (like a lone "%") cannot be decoded.');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Copy failed — select the output manually instead.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-3 text-sm font-medium text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-indigo-600" />
            <span>URL Encoder & Decoder</span>
          </h3>
          <p className="text-xs text-slate-500">
            Percent-encode query values or full URLs for safe use in links and APIs. Runs in your browser.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          Local Encoding
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Scope:</span>
          {(['component', 'full'] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                mode === m ? 'bg-indigo-600 text-white shadow-md' : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}>
              {m === 'component' ? 'Query Value (encodes / ? & =)' : 'Full URL (keeps structure)'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Direction:</span>
          {(['encode', 'decode'] as const).map((d) => (
            <button key={d} type="button" onClick={() => { setDirection(d); setError(null); setOutput(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                direction === d ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white' : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
              {d === 'encode' ? 'Encode →' : '← Decode'}
            </button>
          ))}
          <button type="button" onClick={() => { setInput(output); setOutput(''); setDirection(direction === 'encode' ? 'decode' : 'encode'); }}
            disabled={!output}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Swap
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="url-input">
            {direction === 'encode' ? (mode === 'component' ? 'Text to percent-encode' : 'URL to encode') : 'Encoded URL to decode'}
          </label>
          <textarea id="url-input" value={input} onChange={(e) => setInput(e.target.value)} rows={5}
            placeholder={direction === 'encode'
              ? (mode === 'component' ? 'hello world & more? #1' : 'https://example.com/search?q=hello world&lang=en')
              : 'hello%20world%20%26%20more%3F%20%231'}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
        </div>

        <button type="button" onClick={handleConvert}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md">
          {direction === 'encode' ? 'Encode URL' : 'Decode URL'}
        </button>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Output</label>
            <button type="button" onClick={handleCopy} disabled={!output}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 flex items-center gap-1.5">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <textarea readOnly value={output} rows={5} placeholder="Result appears here…"
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm font-mono text-slate-900 dark:text-white focus:outline-none resize-y" />
        </div>

        <p className="text-xs text-slate-500">
          <span className="font-bold text-slate-600 dark:text-slate-400">Query Value mode</span> encodes every reserved character (used for values inside ?q=…).{' '}
          <span className="font-bold text-slate-600 dark:text-slate-400">Full URL mode</span> keeps :, /, ?, # and &amp; intact and only encodes illegal characters.
        </p>
      </div>
    </div>
  );
};
