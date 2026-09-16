import React, { useState, useMemo } from 'react';
import { AppRoute } from '../../types';
import { ExpansionGatingResult, TopicalPillarKey } from '../../lib/content/types';
import { evaluateAllFormatsReadiness } from '../../lib/content/expansionGatingEngine';
import {
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface ExpansionGatingViewerProps {
  onNavigate: (route: AppRoute) => void;
  onCreateBrief: (params: { targetExt: string; contentType: any; suggestedSlug: string }) => void;
}

export const ExpansionGatingViewer: React.FC<ExpansionGatingViewerProps> = ({
  onNavigate,
  onCreateBrief
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const gatingResults = useMemo(() => evaluateAllFormatsReadiness(), []);

  const filteredResults = useMemo(() => {
    return gatingResults.filter((g) => {
      if (selectedTier !== 'all' && g.tier !== selectedTier) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!g.extension.toLowerCase().includes(q) && !g.formatName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [gatingResults, selectedTier, searchQuery]);

  const readyCount = useMemo(
    () => gatingResults.filter((g) => g.tier === 'Ready for Production').length,
    [gatingResults]
  );

  return (
    <div className="space-y-6">
      {/* Programmatic SEO Safety Statement */}
      <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sm text-blue-950 dark:text-white">
            Programmatic SEO Safety & Anti-Slop Gating
          </div>
          <p className="leading-relaxed">
            AnyFileX prohibits bulk generation of thin pages. Content expansion is strictly gated by the completeness of our underlying binary format specifications, MIME registries, and software compatibility maps. If a format lacks core data, automated generation for that pillar is locked.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Production Ready Formats</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {readyCount} Formats
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Meets both Minimum Recommended Data & Deep Technical Data standards (Score 80+).
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Needs Core Data</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {gatingResults.filter((g) => g.tier === 'Needs Core Data').length} Formats
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Sufficient for basic how-to or conversion guides, but locked for deep security specs.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Gating Enforcement</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            Active Guardrails
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Blocks unverified programmatic generation across all 8 topical pillars.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search format..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          >
            <option value="all">All Gating Tiers</option>
            <option value="Ready for Production">Ready for Production</option>
            <option value="Needs Core Data">Needs Core Data</option>
            <option value="Incomplete Schema">Incomplete Schema</option>
          </select>
        </div>
      </div>

      {/* Gating Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-3 text-center">Readiness</th>
                <th className="py-3.5 px-3 text-center">Gate Status</th>
                <th className="py-3.5 px-4">Minimum Data (Core 6)</th>
                <th className="py-3.5 px-4">Deep Data (Technical 5)</th>
                <th className="py-3.5 px-4 text-right">Unlocked Pillars</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
              {filteredResults.map((item) => {
                const mc = item.minimumCriteria;
                const dc = item.deepDataCriteria;

                return (
                  <tr
                    key={item.extension}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          .{item.extension}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            {item.formatName}
                          </div>
                          <div className="text-[10px] text-slate-500">{item.category}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-xs">
                      {item.readinessScore}%
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.tier === 'Ready for Production'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : item.tier === 'Needs Core Data'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {item.tier === 'Ready for Production' ? (
                          <Unlock className="w-3 h-3" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                        <span>{item.tier}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px]">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded ${mc.hasExtension ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>Ext</span>
                        <span className={`px-1.5 py-0.5 rounded ${mc.hasName ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>Name</span>
                        <span className={`px-1.5 py-0.5 rounded ${mc.hasDescription ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>Desc</span>
                        <span className={`px-1.5 py-0.5 rounded ${mc.hasMimeType ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>MIME</span>
                        <span className={`px-1.5 py-0.5 rounded ${mc.hasPopularApps ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>Apps</span>
                        <span className={`px-1.5 py-0.5 rounded ${mc.hasAtLeastOneRelationship ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>Rel</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[11px]">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded ${dc.hasMagicBytes ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>Hex</span>
                        <span className={`px-1.5 py-0.5 rounded ${dc.hasRepairTips ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>Repair</span>
                        <span className={`px-1.5 py-0.5 rounded ${dc.hasOpeningSteps ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>Steps</span>
                        <span className={`px-1.5 py-0.5 rounded ${dc.hasSpecifications ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>Specs</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {item.safeToGeneratePillars.length} / 8 Safe
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.blockedPillars.length > 0 ? `${item.blockedPillars.length} Locked` : 'All Unlocked'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
