'use client';

import React, { FormEvent, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Download, ExternalLink, Link2, Loader2, ShieldCheck } from 'lucide-react';

const getFilenameFromUrl = (value: string) => {
  try {
    const pathname = new URL(value).pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop();
    return lastSegment ? decodeURIComponent(lastSegment) : 'download';
  } catch {
    return 'download';
  }
};

const safeFilename = (value: string) => {
  const cleaned = value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_').trim();
  return (cleaned || 'download').slice(0, 180);
};

const isYouTubePageUrl = (value: URL) => {
  const hostname = value.hostname.toLowerCase().replace(/^www\./, '');
  return hostname === 'youtube.com' || hostname.endsWith('.youtube.com') || hostname === 'youtu.be';
};

const getHeaderFilename = (value: string | null) => {
  if (!value) return null;
  const match = value.match(/filename\*?=(?:UTF-8''|"|')?([^"';\s]+|[^"']+)/i);
  if (!match?.[1]) return null;
  try {
    return safeFilename(decodeURIComponent(match[1].replace(/^['"]|['"]$/g, '')));
  } catch {
    return safeFilename(match[1]);
  }
};

const triggerDownload = (blob: Blob, filename: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

export const FileDownloaderWorkspace: React.FC = () => {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const suggestedFilename = useMemo(() => {
    if (!url.trim()) return 'download';
    return getFilenameFromUrl(url.trim());
  }, [url]);

  const openDirectly = () => {
    if (!url.trim()) return;
    window.open(url.trim(), '_blank', 'noopener,noreferrer');
  };

  const downloadFile = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.trim());
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Only HTTP and HTTPS links are supported.');
      if (isYouTubePageUrl(parsedUrl)) throw new Error('YouTube links are watch-page URLs, not direct video files. Use an official YouTube download or offline option, or paste a direct .mp4/.webm file URL from a source that permits downloading.');
    } catch (cause) {
      setError(cause instanceof Error && cause.message !== 'Invalid URL' ? cause.message : 'Enter a valid HTTP or HTTPS file URL.');
      return;
    }

    setBusy(true);
    try {
      let response: Response;
      try {
        response = await fetch(parsedUrl.toString(), { redirect: 'follow' });
        if (!response.ok) throw new Error(`The source returned HTTP ${response.status}.`);
      } catch {
        response = await fetch(`/api/file-downloader?url=${encodeURIComponent(parsedUrl.toString())}`);
        if (!response.ok) {
          const payload = await response.json().catch(() => null) as { error?: string } | null;
          throw new Error(payload?.error || `The source returned HTTP ${response.status}.`);
        }
      }
      const blob = await response.blob();
      const chosenFilename = safeFilename(filename.trim() || getHeaderFilename(response.headers.get('content-disposition')) || suggestedFilename);
      triggerDownload(blob, chosenFilename);
      setSuccess(`${chosenFilename} is ready in your browser downloads.`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'The file could not be downloaded. Check the URL and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={downloadFile} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"><Download className="h-8 w-8" /></div>
        <div className="mx-auto mt-4 max-w-2xl text-center"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Download any file from a URL</h3><p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Paste a direct file link to download it with a clean filename. AnyFileX tries the browser first and falls back to a transient stream when CORS blocks the source.</p></div>
        <div className="mx-auto mt-7 max-w-3xl space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="file-download-url">File URL</label>
          <div className="flex flex-col gap-3 sm:flex-row"><div className="relative min-w-0 flex-1"><Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="file-download-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/file.zip" className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div><button type="submit" disabled={busy} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}{busy ? 'Fetching…' : 'Download file'}</button></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="file-download-name">Filename (optional)</label><input id="file-download-name" type="text" value={filename} onChange={(event) => setFilename(event.target.value)} placeholder={suggestedFilename} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Suggested name: <span className="font-mono">{suggestedFilename}</span></p></div>
        </div>
      </form>
      {error && <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><div><p>{error}</p><button type="button" onClick={openDirectly} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-600">Open source <ExternalLink className="h-3.5 w-3.5" /></button></div></div>}
      {success && <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</div>}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs leading-relaxed text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><p>AnyFileX first tries a direct browser download. If the source blocks CORS, a short-lived server fetch completes the download without storing the file. Private and local network addresses are blocked for safety.</p></div>
    </div>
  );
};
