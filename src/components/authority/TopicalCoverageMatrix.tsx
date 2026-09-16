import React, { useState, useMemo } from 'react';
import { AppRoute } from '../../types';
import { FormatTopicalCoverage, TopicalPillarKey } from '../../lib/content/types';
import { computeTopicalCoverage, computeClusterCoverageSummary } from '../../lib/content/topicalCoverageEngine';
import {
  Layers,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCode,
  FolderOpen,
  GitCompare,
  Wrench,
  ShieldCheck,
  Cpu,
  AlertCircle
} from 'lucide-react';

interface TopicalCoverageMatrixProps {
  onNavigate: (route: AppRoute) => void;
  onGenerateBriefForGap?: (ext: string, pillar: TopicalPillarKey) => void;
}

const PILLAR_CONFIG: Record<
  TopicalPillarKey,
  { label: string; short: string; icon: React.ComponentType<{ className?: string }> }
> = {
  format_guide: { label: 'Format Guide', short: 'Guide', icon: FileCode },
  how_to_open: { label: 'How to Open', short: 'Open', icon: FolderOpen },
  conversion: { label: 'Conversion', short: 'Convert', icon: TrendingUp },
  comparison: { label: 'Comparison', short: 'Compare', icon: GitCompare },
  troubleshooting: { label: 'Troubleshooting', short: 'Troubleshoot', icon: AlertCircle },
  security: { label: 'Security & Tech', short: 'Security', icon: ShieldCheck },
  software: { label: 'Software', short: 'Software', icon: Cpu },
  tool: { label: 'Tool / Analyzer', short: 'Tool', icon: Wrench }
};

export const TopicalCoverageMatrix: React.FC<TopicalCoverageMatrixProps> = ({
  onNavigate,
  onGenerateBriefForGap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [coverageFilter, setCoverageFilter] = useState<'all' | 'incomplete' | 'complete'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allCoverage = useMemo(() => computeTopicalCoverage(), []);
  const clusterSummaries = useMemo(() => computeClusterCoverageSummary(), []);

  const filteredCoverage = useMemo(() => {
    return allCoverage.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (coverageFilter === 'incomplete' && item.coveragePercentage === 100) return false;
      if (coverageFilter === 'complete' && item.coveragePercentage < 100) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesExt = item.extension.toLowerCase().includes(q);
        const matchesName = item.formatName.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesExt && !matchesName && !matchesCat) return false;
      }
      return true;
    });
  }, [allCoverage, selectedCategory, coverageFilter, searchQuery]);

  const overallAvg = useMemo(() => {
    if (allCoverage.length === 0) return 0;
    const sum = allCoverage.reduce((acc, curr) => acc + curr.coveragePercentage, 0);
    return Math.round(sum / allCoverage.length);
  }, [allCoverage]);

  const fullyCoveredCount = useMemo(
    () => allCoverage.filter((c) => c.coveragePercentage === 100).length,
    [allCoverage]
  );

  return (
    <div className="space-y-6">
      {/* Cluster Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Overall Topical Saturation</span>
            <span className="font-mono text-blue-600 font-bold">{overallAvg}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallAvg}%` }}
            />
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-white">{fullyCoveredCount}</span> of{' '}
            {allCoverage.length} formats at 100% 8-pillar saturation
          </div>
        </div>

        {clusterSummaries.slice(0, 3).map((cs) => (
          <div
            key={cs.category}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>{cs.category}</span>
              <span className="font-mono text-emerald-600 font-bold">{cs.avgCoverage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${cs.avgCoverage}%` }}
              />
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {cs.fullyCoveredCount} / {cs.totalFormats} formats fully linked
            </div>
          </div>
        ))}
      </div>

      {/* Control Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search format (e.g. HEIC, PSD, PDF, DWG)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            {clusterSummaries.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category} ({c.totalFormats})
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-950">
            <button
              onClick={() => setCoverageFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                coverageFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({allCoverage.length})
            </button>
            <button
              onClick={() => setCoverageFilter('incomplete')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                coverageFilter === 'incomplete'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Incomplete ({allCoverage.filter((c) => c.coveragePercentage < 100).length})
            </button>
            <button
              onClick={() => setCoverageFilter('complete')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                coverageFilter === 'complete'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              100% Complete ({fullyCoveredCount})
            </button>
          </div>
        </div>
      </div>

      {/* 8-Pillar Coverage Matrix Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-3 text-center">Coverage</th>
                {(Object.keys(PILLAR_CONFIG) as TopicalPillarKey[]).map((key) => {
                  const Icon = PILLAR_CONFIG[key].icon;
                  return (
                    <th key={key} className="py-3.5 px-2.5 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 font-semibold">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{PILLAR_CONFIG[key].short}</span>
                      </div>
                    </th>
                  );
                })}
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
              {filteredCoverage.map((item) => {
                return (
                  <tr
                    key={item.extension}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Format Identity */}
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

                    {/* Coverage Progress Bar */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.coveragePercentage === 100
                                ? 'bg-emerald-500'
                                : item.coveragePercentage >= 75
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.coveragePercentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          {item.coveragePercentage}%
                        </span>
                      </div>
                    </td>

                    {/* 8 Pillars */}
                    {(Object.keys(PILLAR_CONFIG) as TopicalPillarKey[]).map((pillarKey) => {
                      const pillarData = item.pillars[pillarKey];
                      const exists = pillarData.exists;

                      return (
                        <td key={pillarKey} className="py-3 px-2.5 text-center">
                          {exists ? (
                            <button
                              onClick={() => pillarData.route && onNavigate(pillarData.route)}
                              title={`${PILLAR_CONFIG[pillarKey].label}: Active`}
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:scale-110 transition-transform"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onGenerateBriefForGap && onGenerateBriefForGap(item.extension, pillarKey)}
                              title={`Missing ${PILLAR_CONFIG[pillarKey].label}. Click to generate brief.`}
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      );
                    })}

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigate({ view: 'format-guide', format: item.extension.toLowerCase() })}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>View Format</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
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
