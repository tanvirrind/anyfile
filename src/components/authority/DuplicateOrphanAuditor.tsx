'use client';

import React, { useState, useMemo } from 'react';
import { AppRoute } from '../../types';
import { DuplicateContentWarning, OrphanedContentReport } from '../../lib/content/types';
import { detectDuplicateContent } from '../../lib/content/duplicateDetectionEngine';
import { detectOrphanedContent, autoFixEntityLinks } from '../../lib/content/orphanDetectionEngine';
import {
  GitFork,
  AlertTriangle,
  Link,
  CheckCircle2,
  Sparkles,
  Search,
  ExternalLink,
  Layers,
  Wrench,
  HelpCircle,
  FolderOpen
} from 'lucide-react';

interface DuplicateOrphanAuditorProps {
  onNavigate: (route: AppRoute) => void;
  onRefreshEntityList: () => void;
}

export const DuplicateOrphanAuditor: React.FC<DuplicateOrphanAuditorProps> = ({
  onNavigate,
  onRefreshEntityList
}) => {
  const [activeTab, setActiveTab] = useState<'duplicates' | 'orphans'>('duplicates');
  const [duplicateList, setDuplicateList] = useState<DuplicateContentWarning[]>(() => detectDuplicateContent());
  const [orphanList, setOrphanList] = useState<OrphanedContentReport[]>(() => detectOrphanedContent());
  const [healingSuccess, setHealingSuccess] = useState<string | null>(null);

  const handleFixOrphan = (entityId: string) => {
    const success = autoFixEntityLinks(entityId);
    if (success) {
      setOrphanList(detectOrphanedContent());
      onRefreshEntityList();
      setHealingSuccess(`Auto-injected parent hub and tool links for entity ${entityId}`);
      setTimeout(() => setHealingSuccess(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {healingSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{healingSuccess}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Cannibalization Risk</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {duplicateList.length} Pair{duplicateList.length === 1 ? '' : 's'} Analyzed
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Token Jaccard & semantic intent overlap check preventing duplicate pages.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Orphaned & Weak Links</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {orphanList.length} Entity Deficiencies
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Entities missing parent hubs, tool bridges, or incoming anchor links.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Automatic Link Healing</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            1-Click Repair
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Instantly attaches relevant converter tools and sibling articles to orphaned nodes.
          </p>
        </div>
      </div>

      {/* Switcher */}
      <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-950 w-fit">
        <button
          onClick={() => setActiveTab('duplicates')}
          className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'duplicates'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Duplicate & Cannibalization Checker ({duplicateList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orphans')}
          className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'orphans'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>Orphan & Weak Link Auditor ({orphanList.length})</span>
        </button>
      </div>

      {/* TAB 1: DUPLICATES */}
      {activeTab === 'duplicates' && (
        <div className="space-y-3.5">
          {duplicateList.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Zero Content Cannibalization Detected
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                All titles, outlines, summaries, and search intents are distinct and non-competing.
              </p>
            </div>
          ) : (
            duplicateList.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                        item.severity === 'high'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                          : item.severity === 'medium'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.similarityScore}% Overlap ({item.severity.toUpperCase()})
                    </span>
                    <span className="text-xs text-slate-500">
                      Dimensions: {item.duplicateDimensions.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Entity A:</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{item.entityA.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">/{item.entityA.slug}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Entity B:</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{item.entityB.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">/{item.entityB.slug}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {item.recommendation}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ORPHANS & WEAK LINKS */}
      {activeTab === 'orphans' && (
        <div className="space-y-3.5">
          {orphanList.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                All Content Entities Fully Connected
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Zero isolated nodes. Every article has verified incoming links, parent hub anchors, and tool bridges.
              </p>
            </div>
          ) : (
            orphanList.map((orphan) => (
              <div
                key={orphan.entityId}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                      {orphan.missingElements.length} Link Deficiencies
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      In: {orphan.linkCount.incoming} | Out: {orphan.linkCount.outgoing}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{orphan.title}</h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Missing:</span>
                    {orphan.missingElements.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                      >
                        {m.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <button
                    onClick={() => handleFixOrphan(orphan.entityId)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Heal Links</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
