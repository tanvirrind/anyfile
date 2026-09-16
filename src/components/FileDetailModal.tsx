import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, AlertTriangle, Monitor, RefreshCw, Wrench, Download, ExternalLink, Binary, FileText } from 'lucide-react';
import { FileTypeInfo } from '../types';

interface FileDetailModalProps {
  fileInfo: FileTypeInfo | null;
  onClose: () => void;
  onOpenConverter?: () => void;
}

export const FileDetailModal: React.FC<FileDetailModalProps> = ({ fileInfo, onClose, onOpenConverter }) => {
  if (!fileInfo) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'software' | 'steps' | 'conversions' | 'repair'>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="glass-card bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="font-mono font-extrabold text-2xl px-3.5 py-1.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              .{fileInfo.extension}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white">{fileInfo.name}</h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  {fileInfo.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{fileInfo.mimeType}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            id="file-detail-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'overview' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('software')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'software' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Compatible Apps ({fileInfo.popularApps.length})
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'steps' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            How to Open
          </button>
          <button
            onClick={() => setActiveTab('conversions')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'conversions' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Conversions
          </button>
          <button
            onClick={() => setActiveTab('repair')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'repair' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Repair & Recovery
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 tracking-wider mb-2">Detailed Format Description</h3>
                <p className="text-sm leading-relaxed">{fileInfo.detailedOverview}</p>
              </div>

              {/* Technical Specifications Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400">Typical File Size</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{fileInfo.typicalSize}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400">Magic Bytes (Header)</span>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">{fileInfo.magicBytesHex}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400">Security Threat Level</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>{fileInfo.dangerRating}</span>
                  </div>
                </div>
              </div>

              {/* Threat Note */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs space-y-1">
                <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Security & Executable Threat Analysis</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300">{fileInfo.dangerExplanation}</div>
              </div>
            </div>
          )}

          {activeTab === 'software' && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 tracking-wider">Recommended Software Applications</h3>
              <div className="space-y-3">
                {fileInfo.popularApps.map((app) => (
                  <div key={app.name} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{app.name}</span>
                        {app.isFree ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            100% Free
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            Paid License
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Developer: {app.developer}</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {app.os.map((osName) => (
                        <span key={osName} className="text-[10px] font-mono font-medium px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase">
                          {osName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 tracking-wider">Step-By-Step Opening Guide</h3>
              <div className="space-y-3">
                {fileInfo.openingSteps.map((step, idx) => (
                  <div key={step.title} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{step.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'conversions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 tracking-wider">Supported Target Formats</h3>
                <button
                  onClick={() => {
                    onClose();
                    onOpenConverter?.();
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Launch In-Browser Converter</span>
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {fileInfo.conversions.map((conv) => (
                  <div key={conv.targetExtension} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        .{fileInfo.extension} → .{conv.targetExtension}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{conv.description}</p>
                    </div>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {conv.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'repair' && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 tracking-wider">Corrupted Header & File Recovery Advice</h3>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                {fileInfo.repairTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Official MIME: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{fileInfo.mimeType}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium text-xs cursor-pointer"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
