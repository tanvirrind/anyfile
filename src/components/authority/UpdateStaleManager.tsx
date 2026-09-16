import React, { useState, useMemo } from 'react';
import { AppRoute } from '../../types';
import { StaleContentItem } from '../../lib/content/types';
import { detectStaleContent, markEntityFresh, flagEntityForReview, LATEST_KG_SPEC_VERSION } from '../../lib/content/updateEngine';
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sliders,
  Sparkles,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

interface UpdateStaleManagerProps {
  onNavigate: (route: AppRoute) => void;
  onRefreshEntityList: () => void;
}

export const UpdateStaleManager: React.FC<UpdateStaleManagerProps> = ({
  onNavigate,
  onRefreshEntityList
}) => {
  const [staleList, setStaleList] = useState<StaleContentItem[]>(() => detectStaleContent());
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleMarkFresh = (id: string) => {
    const success = markEntityFresh(id);
    if (success) {
      setStaleList(detectStaleContent());
      onRefreshEntityList();
      setActionNotice('Entity verified & updated to Knowledge Graph v' + LATEST_KG_SPEC_VERSION);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleFlagForReview = (id: string) => {
    const success = flagEntityForReview(id);
    if (success) {
      setStaleList(detectStaleContent());
      onRefreshEntityList();
      setActionNotice('Entity status updated to "needs_update" for editorial team.');
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner if Action performed */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Stale & Sync Alerts</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {staleList.length} Items Flagged
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Articles with schema discrepancies, new tool availability, or review age &gt; 180 days.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Knowledge Graph Version</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
            v{LATEST_KG_SPEC_VERSION}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Standard format schema including Shannon entropy baselines & RFC specs.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Non-Destructive Guarantee</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            Safe Review Mode
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            System flags content for review without automatically overwriting published pages.
          </p>
        </div>
      </div>

      {/* Stale List */}
      <div className="space-y-4">
        {staleList.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              All Content Synchronized & Verified
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Every published guide is synced with Knowledge Graph v{LATEST_KG_SPEC_VERSION} and has been verified within the last 180 days.
            </p>
          </div>
        ) : (
          staleList.map((item) => (
            <div
              key={item.entityId}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                      {item.triggerReasons.length} Review Trigger{item.triggerReasons.length > 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Last Verified: {item.lastUpdated} ({item.daysSinceUpdate}d ago)
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleMarkFresh(item.entityId)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Verified & Fresh</span>
                  </button>
                  <button
                    onClick={() => handleFlagForReview(item.entityId)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
                  >
                    Flag as Needs Update
                  </button>
                </div>
              </div>

              {/* Specific Update Suggestions */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 text-xs space-y-1.5">
                <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  <span>Detected Changes & Editorial Recommendations:</span>
                </div>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-5 list-disc">
                  {item.suggestedUpdates.map((sug, sIdx) => (
                    <li key={sIdx}>{sug}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
