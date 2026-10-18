'use client';

import React, { useState, useRef } from 'react';
import { Binary, Copy, Download, Upload, CheckCircle2, RefreshCw } from 'lucide-react';

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const isValidBase64 = (s: string) => /^[A-Za-z0-9+/]*={0,2}$/.test(s.replace(/\s+/g, '')) && s.replace(/\s+/g, '').length % 4 === 0;

export const Base64Workspace: React.FC = () => {
  const [tab, setTab] = useState<'text' | 'file'>('text');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [mime, setMime] = useState('application/octet-stream');
  const [saveAs, setSaveAs] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encodeUtf8 = (str: string) => {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    return btoa(binary);
  };

  const decodeUtf8 = (b64: string) => {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  };

  const handleText = () => {
    setError(null);
    setCopied(false);
    if (!input) {
      setOutput('');
      return;
    }
    try {
      if (direction === 'encode') {
        setOutput(encodeUtf8(input));
      } else {
        const clean = input.replace(/\s+/g, '');
        if (!isValidBase64(clean)) {
          setError('That does not look like valid Base64 (allowed: A-Z, a-z, 0-9, +, /, = padding).');
          setOutput('');
          return;
        }
        setOutput(decodeUtf8(clean));
      }
    } catch {
      setError('Could not process this input. Decoding Base64 with invalid padding fails.');
      setOutput('');
    }
  };

  const handleFileToBase64 = async (file: File) => {
    setError(null);
    setCopied(false);
    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" is ${(file.size / 1048576).toFixed(1)} MB — file-to-Base64 is limited to 5 MB to keep the browser responsive.`);
      return;
    }
    setIsWorking(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const CHUNK = 0x8000;
      for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
      }
      setInput(file.name);
      setOutput(btoa(binary));
      setFileName(file.name);
      setMime(file.type || 'application/octet-stream');
    } catch {
      setError(`Could not read "${file.name}".`);
    } finally {
      setIsWorking(false);
    }
  };

  const handleBase64ToFile = () => {
    setError(null);
    if (!output.trim()) {
      setError('Generate or paste Base64 above first (use Text → Decode, or encode a file).');
      return;
    }
    const clean = output.replace(/\s+/g, '');
    if (!isValidBase64(clean)) {
      setError('The output is not valid Base64, so it cannot be turned back into a file.');
      return;
    }
    try {
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = saveAs.trim() || 'decoded.bin';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError('Could not convert that Base64 into a file.');
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
            <Binary className="w-5 h-5 text-indigo-600" />
            <span>Base64 Encoder & Decoder</span>
          </h3>
          <p className="text-xs text-slate-500">
            Encode text or files to Base64, or decode Base64 back to text and files. Runs entirely in your browser.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          Local Encoding
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['text', 'file'] as const).map((t) => (
          <button key={t} type="button" onClick={() => { setTab(t); setError(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              tab === t ? 'bg-indigo-600 text-white shadow-md' : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}>
            {t === 'text' ? 'Text ⇄ Base64' : 'File ⇄ Base64'}
          </button>
        ))}
      </div>

      {tab === 'text' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Direction:</span>
            {(['encode', 'decode'] as const).map((d) => (
              <button key={d} type="button" onClick={() => { setDirection(d); setError(null); setOutput(''); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  direction === d ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white' : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                {d === 'encode' ? 'Text → Base64' : 'Base64 → Text'}
              </button>
            ))}
            <button type="button" onClick={() => { setInput(output); setOutput(''); setDirection(direction === 'encode' ? 'decode' : 'encode'); }}
              disabled={!output}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Swap
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="b64-input">
              {direction === 'encode' ? 'Text to encode (UTF-8)' : 'Base64 to decode'}
            </label>
            <textarea id="b64-input" value={input} onChange={(e) => setInput(e.target.value)} rows={6}
              placeholder={direction === 'encode' ? 'Type or paste text…' : 'Paste Base64…'}
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
          </div>

          <button type="button" onClick={handleText}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md">
            {direction === 'encode' ? 'Encode to Base64' : 'Decode Base64'}
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
            <textarea readOnly value={output} rows={6} placeholder="Result appears here…"
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm font-mono text-slate-900 dark:text-white focus:outline-none resize-y" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFileToBase64(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              dragActive ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/30'
            }`}
          >
            <input type="file" ref={fileInputRef}
              onChange={(e) => { if (e.target.files?.[0]) handleFileToBase64(e.target.files[0]); e.target.value = ''; }}
              className="hidden" />
            <div className="space-y-3 max-w-sm mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
                <Upload className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Drop a File Here</h4>
                <p className="text-xs text-slate-500">Any file up to 5 MB — converted to Base64 in your browser</p>
              </div>
              <button type="button" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
                Select File
              </button>
            </div>
          </div>

          {output && (
            <div className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono text-slate-500">
                  {fileName ? `${fileName} → Base64` : 'Base64 output'} ({output.length.toLocaleString()} chars)
                </p>
                <button type="button" onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea readOnly value={output} rows={6}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 resize-y" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="b64-mime">MIME type</label>
                  <input id="b64-mime" type="text" value={mime} onChange={(e) => setMime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="b64-saveas">File name</label>
                  <input id="b64-saveas" type="text" value={saveAs} onChange={(e) => setSaveAs(e.target.value)}
                    placeholder="decoded.bin"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white" />
                </div>
                <div className="flex items-end">
                  <button type="button" onClick={handleBase64ToFile} disabled={isWorking}
                    className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Base64 → Download File
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500">Round-trip check: decode the Base64 on the Text tab, or download it back as the original bytes.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
