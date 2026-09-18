import React from 'react';
import { X, Clock, BookOpen, ArrowLeft, Tag, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';
import { GuideInfo } from '../types';

interface GuideDetailModalProps {
  guide: GuideInfo | null;
  onClose: () => void;
  onSelectExtension: (ext: string) => void;
}

export const GuideDetailModal: React.FC<GuideDetailModalProps> = ({ guide, onClose, onSelectExtension }) => {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="glass-card bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <BookOpen className="w-4 h-4" />
            <span>{guide.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            id="guide-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {guide.title}
            </h1>

            {/* Author Attribution & Peer Review Info */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={guide.author.avatar} alt={guide.author.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{guide.author.name}</span>
                    {guide.author.credentials && (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {guide.author.credentials}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{guide.author.role}</div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end text-xs text-slate-500 dark:text-slate-400 gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                {guide.reviewedBy && (
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Peer-Reviewed by {guide.reviewedBy.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[11px]">
                  <span>Updated {guide.date}</span>
                  {guide.lastAuditedDate && <span>• Audited {guide.lastAuditedDate}</span>}
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {guide.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-base font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            {guide.summary}
          </p>

          {/* Guide Sections */}
          <div className="space-y-6">
            {guide.contentSections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">{section.heading}</h3>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{section.body}</p>

                {section.bullets && (
                  <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-2">
                    {section.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}

                {section.callout && (
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs font-medium">
                    {section.callout}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Authoritative Citations & RFCs */}
          {guide.citations && guide.citations.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Technical Standards Citations & Specifications
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {guide.citations.map((c, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{c.title}</span>
                      {c.issuingBody && <span className="text-slate-400 ml-1.5 font-mono">[{c.issuingBody}]</span>}
                    </div>
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 flex items-center gap-1 font-mono text-[11px] shrink-0">
                        <span>{c.standard || 'Specs'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Extensions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 block mb-2">
              Related File Formats
            </span>
            <div className="flex flex-wrap gap-2">
              {guide.relatedExtensions.map((ext) => (
                <button
                  key={ext}
                  onClick={() => {
                    onClose();
                    onSelectExtension(ext);
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 cursor-pointer"
                >
                  .{ext}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium text-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
