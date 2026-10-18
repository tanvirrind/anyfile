'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Copy, Check, ScanText, Loader2, AlertTriangle } from 'lucide-react';

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_DIMENSION = 4096;

/**
 * All tesseract assets are self-hosted (copied to public/ocr/ by
 * scripts/copy-ocr-assets.mjs during `prebuild`). Nothing here touches a
 * CDN — the worker, the WASM core, and the English traineddata all load
 * from this origin, so the zero-upload guarantee holds and the PWA can
 * serve the tool offline.
 */
const OCR_WORKER_PATH = '/ocr/worker.min.js';
const OCR_CORE_PATH = '/ocr/tesseract-core.wasm.js';
const OCR_LANG_PATH = '/ocr';

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

type Phase = 'idle' | 'loading-engine' | 'recognizing' | 'done' | 'error';

export const OcrWorkspace: React.FC = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [sourceInfo, setSourceInfo] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [statusLine, setStatusLine] = useState('');
  const [text, setText] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelled = useRef(false);

  useEffect(() => () => {
    cancelled.current = true;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = async (file: File) => {
    setError(null);
    setText('');
    setConfidence(null);
    setProgress(0);
    setPhase('idle');
    if (!/\.(png|jpe?g|webp)$/i.test(file.name)) {
      setError(`"${file.name}" is not a supported image (PNG, JPG, or WEBP).`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" exceeds the 25 MB limit for OCR.`);
      return;
    }
    setSourceFile(file);
    setSourceName(file.name);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    try {
      const bitmap = await createImageBitmap(file);
      if (bitmap.width > MAX_DIMENSION || bitmap.height > MAX_DIMENSION) {
        bitmap.close();
        setSourceFile(null);
        setSourceName(null);
        setError(`Image is ${bitmap.width}×${bitmap.height}px — OCR supports images up to ${MAX_DIMENSION}px on a side.`);
        return;
      }
      setSourceInfo(`${bitmap.width}×${bitmap.height}px • ${formatSize(file.size)}`);
      bitmap.close();
    } catch {
      setSourceInfo(formatSize(file.size));
    }
  };

  const handleRecognize = async () => {
    if (!sourceFile) {
      setError('Drop an image first.');
      return;
    }
    setError(null);
    setText('');
    setConfidence(null);
    setProgress(0);
    setPhase('loading-engine');
    setStatusLine('Loading OCR engine (first run only, served locally)…');
    cancelled.current = false;

    try {
      // Lazy: tesseract.js loads ONLY when the user starts a job.
      const mod = await import('tesseract.js');
      const worker = await mod.createWorker('eng', 1, {
        workerPath: OCR_WORKER_PATH,
        corePath: OCR_CORE_PATH,
        langPath: OCR_LANG_PATH,
        logger: (m: { status?: string; progress?: number }) => {
          if (cancelled.current) return;
          if (m.status === 'recognizing text') {
            setPhase('recognizing');
            setProgress(Math.round((m.progress ?? 0) * 100));
            setStatusLine(`Recognizing text… ${Math.round((m.progress ?? 0) * 100)}%`);
          } else if (m.status) {
            setStatusLine(`Loading: ${m.status}${m.progress != null ? ` ${Math.round(m.progress * 100)}%` : ''}`);
          }
        },
      });
      if (cancelled.current) {
        await worker.terminate();
        return;
      }
      setPhase('recognizing');
      const result = await worker.recognize(sourceFile);
      await worker.terminate();
      if (cancelled.current) return;
      const recognized = (result?.data?.text ?? '').trim();
      setText(recognized);
      setConfidence(typeof result?.data?.confidence === 'number' ? result.data.confidence : null);
      setProgress(100);
      setPhase('done');
      setStatusLine('');
      if (!recognized) {
        setError('No text was recognized in this image. OCR works best on clear, high-contrast printed text.');
      }
    } catch (e) {
      if (!cancelled.current) {
        setPhase('error');
        setError(`OCR failed: ${e instanceof Error ? e.message : 'unknown error'}. Try a clearer image.`);
      }
    }
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Copy failed — select the text manually.');
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const base = (sourceName || 'ocr').replace(/\.[a-z0-9]+$/i, '');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${base}-ocr.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const busy = phase === 'loading-engine' || phase === 'recognizing';

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
            <ScanText className="w-5 h-5 text-teal-600" />
            <span>Image to Text — OCR</span>
          </h3>
          <p className="text-xs text-slate-500">
            Extract printed text from PNG, JPG, or WEBP images. English only. Fully in your browser.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
          English OCR • Zero Upload
        </span>
      </div>

      {!sourceFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-teal-500 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input type="file" ref={fileInputRef} accept=".png,.jpg,.jpeg,.webp"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
            className="hidden" />
          <div className="space-y-3 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
              <Upload className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Drop an Image Here</h4>
              <p className="text-xs text-slate-500">PNG, JPG, or WEBP up to 25 MB — clear printed text works best</p>
            </div>
            <button type="button" className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700">
              Select Image
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {previewUrl && (
                <img src={previewUrl} alt="Source preview" className="w-12 h-12 rounded-xl object-cover border border-white/20" />
              )}
              <div>
                <p className="font-bold text-sm text-white">{sourceName}</p>
                <p className="text-xs font-mono text-slate-400">{sourceInfo}</p>
              </div>
            </div>
            <button type="button" onClick={() => { setSourceFile(null); setSourceName(null); if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); setText(''); setConfidence(null); setProgress(0); setPhase('idle'); setError(null); }}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
              Pick Another Image
            </button>
          </div>

          {busy && (
            <div className="space-y-2" role="status" aria-live="polite">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span>{statusLine || 'Working…'}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {phase !== 'done' || !text ? (
            <button type="button" onClick={handleRecognize} disabled={busy}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 shadow-md">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanText className="w-4 h-4" />}
              <span>{busy ? 'Reading text…' : phase === 'done' ? 'Read Text Again' : 'Extract Text'}</span>
            </button>
          ) : null}

          {phase === 'done' && text && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Recognized text</p>
                  {confidence !== null && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      confidence {Math.round(confidence)}%
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={handleCopy}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button type="button" onClick={handleDownload}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>.txt</span>
                  </button>
                </div>
              </div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono leading-relaxed"
                aria-label="Recognized text — editable" />
              <p className="text-xs text-slate-500 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>OCR is statistical — proofread before relying on the text. It currently reads English only and works best on clear, high-contrast printed text.</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
