import React, { useState } from 'react';
import { CheckCircle, Copy, Check, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import type { AppRoute } from '../../../types';
import type { FileAnalysis } from '../../../lib/analyzer/types';
import { Badge } from '../../Badge';
import { SmartLink, DeadLink } from '../../SmartLink';
import { isValidCatalogExtension } from '../../../lib/routes/routeManifest';

interface VerdictHeaderProps {
  analysis: FileAnalysis;
  onNavigate: (route: AppRoute) => void;
}

const VERDICT_STYLE: Record<FileAnalysis['security']['status'], string> = {
  safe: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800',
  caution: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
  warning: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
  unknown: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
};

const VERDICT_ICON: Record<FileAnalysis['security']['status'], React.ReactNode> = {
  safe: <CheckCircle className="w-4 h-4 text-emerald-600" />,
  caution: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  warning: <AlertTriangle className="w-4 h-4 text-red-600" />,
  unknown: <ShieldCheck className="w-4 h-4 text-slate-500" />,
};

const METHOD_LABEL: Record<FileAnalysis['detectionMethod'], string> = {
  magic_bytes: 'Magic bytes',
  container_inspection: 'Container inspection',
  text_heuristic: 'Text heuristic',
  mime_fallback: 'MIME fallback',
  extension_fallback: 'Extension fallback',
  unknown: 'Unknown',
};

export const VerdictHeader: React.FC<VerdictHeaderProps> = ({ analysis, onNavigate }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const { security, extensionComparison, mimeComparison } = analysis;

  const mismatch = extensionComparison.status === 'mismatch' || mimeComparison.status === 'mismatch';
  const nameExt = (analysis.fileNameExtension || '').toLowerCase();
  const detectedExt = (analysis.detectedExtension || '').toLowerCase();
  const shownExt = detectedExt && detectedExt !== 'unknown' ? detectedExt : nameExt;
  const detectedExtUpper = shownExt.toUpperCase();

  const copyHash = () => {
    if (!analysis.diagnostics.sha256Hash) return;
    navigator.clipboard.writeText(analysis.diagnostics.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Spoof / mismatch banner */}
      {mismatch && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-red-800 dark:text-red-200">
              Extension mismatch: this file claims to be .{nameExt || '???'} but its binary content is{' '}
              {analysis.detectedFormat}
              {detectedExt && detectedExt !== nameExt ? ` (.${detectedExt})` : ''}
            </p>
            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
              {extensionComparison.message} {extensionComparison.explanation}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider">
              .{detectedExtUpper}
            </span>
            {nameExt && nameExt !== detectedExt && (
              <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-xs">
                named .{nameExt.toUpperCase()}
              </span>
            )}
            <Badge variant="blue" size="sm">{analysis.category}</Badge>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{analysis.confidenceScore}% Confidence Match</span>
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            File Intelligence Report
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-all">
            {analysis.fileName}
          </h1>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Identified as:{' '}
            isValidCatalogExtension(shownExt) ? (
            <SmartLink
              route={{ view: 'extension-detail', ext: shownExt }}
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >              <span>{analysis.detectedFormat}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </SmartLink>
            ) : (
            <DeadLink
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >              <span>{analysis.detectedFormat}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </DeadLink>
            )
          </p>
        </div>
      </div>

      {/* Safety verdict */}
      <div className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${VERDICT_STYLE[security.status]}`}>
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
          {VERDICT_ICON[security.status]}
          <span>Safety verdict: {security.badgeText}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {security.neutralStatement}
        </p>
        {security.indicators.length > 0 && (
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1">
            {security.indicators.slice(0, 3).map((ind) => (
              <li key={ind.id} className="flex items-start gap-1.5">
                <span className="mt-1.5">•</span>
                <span>
                  <strong className="text-slate-800 dark:text-slate-200">{ind.title}</strong> — {ind.description}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick spec grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">File Size</span>
          <span className="font-bold text-slate-900 dark:text-white">{analysis.formattedSize}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Detected MIME</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
            {analysis.detectedMimeType}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Detection Method</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {METHOD_LABEL[analysis.detectionMethod]}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Header Offset</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            0x{analysis.signature.offset.toString(16).padStart(8, '0')}
          </span>
        </div>
      </div>

      {/* SHA-256 block */}
      {analysis.diagnostics.sha256Hash && (
        <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SHA-256 Cryptographic Checksum</span>
            </span>
            <button
              onClick={copyHash}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>
          <p className="font-bold text-emerald-400 break-all select-all pt-1">
            {analysis.diagnostics.sha256Hash}
          </p>
        </div>
      )}
    </div>
  );
};
