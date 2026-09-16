import React, { useState, useMemo } from 'react';
import { AppRoute } from '../../types';
import { FormatPrioritizationScore, ContentGapItem, PriorityTier, ContentType } from '../../lib/content/types';
import { computeAllFormatPriorities } from '../../lib/content/contentPrioritizationEngine';
import { detectContentGaps } from '../../lib/content/contentGapEngine';
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sliders,
  Layers,
  FileCode,
  Zap,
  Wrench,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface PrioritizationGapViewerProps {
  onNavigate: (route: AppRoute) => void;
  onCreateBrief: (params: { targetExt: string; contentType: ContentType; suggestedSlug: string }) => void;
}

export const PrioritizationGapViewer: React.FC<PrioritizationGapViewerProps> = ({
  onNavigate,
  onCreateBrief
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'priorities' | 'gaps'>('gaps');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedGapType, setSelectedGapType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFormat, setExpandedFormat] = useState<string | null>(null);

  const priorities = useMemo(() => computeAllFormatPriorities(), []);
  const gaps = useMemo(() => detectContentGaps(), []);

  const filteredPriorities = useMemo(() => {
    return priorities.filter((p) => {
      if (selectedTier !== 'all' && p.tier !== selectedTier) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.extension.toLowerCase().includes(q) && !p.formatName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [priorities, selectedTier, searchQuery]);

  const filteredGaps = useMemo(() => {
    return gaps.filter((g) => {
      if (selectedTier !== 'all' && g.tier !== selectedTier) return false;
      if (selectedGapType !== 'all' && g.gapType !== selectedGapType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !g.extension.toLowerCase().includes(q) &&
          !g.title.toLowerCase().includes(q) &&
          !g.description.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [gaps, selectedTier, selectedGapType, searchQuery]);

  const criticalGapsCount = useMemo(() => gaps.filter((g) => g.tier === 'Critical').length, [gaps]);
  const highGapsCount = useMemo(() => gaps.filter((g) => g.tier === 'High').length, [gaps]);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>High-Value Content Gaps</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 text-xs font-bold font-mono">
              {gaps.length} Total
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {criticalGapsCount} Critical
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Missing conversion & how-to guides where tool & format relationships already exist.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Critical Priority Formats</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 text-xs font-bold font-mono">
              Score 85+
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {priorities.filter((p) => p.tier === 'Critical').length} Formats
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            HEIC, PSD, PDF, DOCX, DWG, WEBP, ZIP rated on importance and tool richness.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Scoring Engine Mode</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              Deterministic
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            8-Factor Matrix
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Strict factual signals: OS support, AnyFileX tools, specs, and relationship density.
          </p>
        </div>
      </div>

      {/* Sub-Tabs Switcher & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-950">
          <button
            onClick={() => setActiveSubTab('gaps')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
              activeSubTab === 'gaps'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Content Gap Engine ({gaps.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('priorities')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
              activeSubTab === 'priorities'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Format Priority Scoring ({priorities.length})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by extension..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          >
            <option value="all">All Tiers</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {activeSubTab === 'gaps' && (
            <select
              value={selectedGapType}
              onChange={(e) => setSelectedGapType(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              <option value="all">All Gap Types</option>
              <option value="missing-conversion-guide">Missing Conversion Guide</option>
              <option value="missing-how-to-open">Missing How-to-Open</option>
              <option value="missing-comparison">Missing Comparison</option>
              <option value="missing-format-guide">Missing Format Guide</option>
              <option value="missing-troubleshooting">Missing Diagnostic/Repair</option>
            </select>
          )}
        </div>
      </div>

      {/* VIEW 1: CONTENT GAPS LIST */}
      {activeSubTab === 'gaps' && (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredGaps.map((gap) => (
            <div
              key={gap.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    .{gap.extension}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      gap.tier === 'Critical'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                        : gap.tier === 'High'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {gap.tier} Priority ({gap.urgencyScore}/100)
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {gap.gapType.replace('missing-', '').replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {gap.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {gap.description}
                </p>

                {/* Prerequisites Badge Row */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Prerequisites:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Format Profile
                  </span>
                  {gap.prerequisitesMet.toolExists && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Live Tool Active
                    </span>
                  )}
                  {gap.prerequisitesMet.softwareExists && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> App Compatibility Mapped
                    </span>
                  )}
                  {gap.prerequisitesMet.comparisonTargetExists && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Sibling Format Target
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                <button
                  onClick={() => onCreateBrief(gap.briefParams)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Brief</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: 8-FACTOR PRIORITIZATION TABLE */}
      {activeSubTab === 'priorities' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Rank / Format</th>
                  <th className="py-3.5 px-3 text-center">Score</th>
                  <th className="py-3.5 px-3 text-center">Tier</th>
                  <th className="py-3.5 px-4">Factor Breakdown (8 Vectors)</th>
                  <th className="py-3.5 px-4">Signals</th>
                  <th className="py-3.5 px-4 text-right">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                {filteredPriorities.map((item, index) => {
                  const fb = item.factorBreakdown;
                  return (
                    <tr
                      key={item.extension}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-slate-400 font-bold text-xs w-4">
                            #{index + 1}
                          </span>
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

                      <td className="py-3 px-3 text-center font-mono font-black text-sm text-slate-900 dark:text-white">
                        {item.totalScore}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.tier === 'Critical'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                              : item.tier === 'High'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                              : item.tier === 'Medium'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item.tier}
                        </span>
                      </td>

                      <td className="py-3 px-4 min-w-[220px]">
                        <div className="space-y-1 text-[10px]">
                          <div className="flex justify-between text-slate-500">
                            <span>Imp: {fb.formatImportance}/20</span>
                            <span>Tools: {fb.existingTools}/15</span>
                            <span>KG: {fb.knowledgeGraphCompleteness}/15</span>
                            <span>Gap: {fb.contentGap}/15</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                            <div className="bg-blue-500 h-full" style={{ width: `${fb.formatImportance}%` }} />
                            <div className="bg-emerald-500 h-full" style={{ width: `${fb.existingTools}%` }} />
                            <div className="bg-purple-500 h-full" style={{ width: `${fb.knowledgeGraphCompleteness}%` }} />
                            <div className="bg-amber-500 h-full" style={{ width: `${fb.contentGap}%` }} />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {item.signals.toolsCount} Tools Active
                          </span>{' '}
                          • {item.signals.missingPillarsCount} Gaps
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() =>
                            onCreateBrief({
                              targetExt: item.extension,
                              contentType: 'format-guide',
                              suggestedSlug: `what-is-a-${item.extension.toLowerCase()}-file`
                            })
                          }
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <span>{item.recommendedNextActions[0] || 'Create Brief'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
