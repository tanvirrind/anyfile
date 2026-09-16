import React, { useState, useMemo } from 'react';
import { AppRoute } from '../../types';
import { ContentQualityAudit } from '../../lib/content/types';
import { auditAllEntitiesQuality } from '../../lib/content/contentQualityScoreEngine';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
  FileText,
  Zap,
  Code2,
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react';

interface ContentQualityAuditorProps {
  onNavigate: (route: AppRoute) => void;
}

export const ContentQualityAuditor: React.FC<ContentQualityAuditorProps> = ({ onNavigate }) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedEntityId, setExpandedEntityId] = useState<string | null>(null);

  const audits = useMemo(() => auditAllEntitiesQuality(), []);

  const filteredAudits = useMemo(() => {
    return audits.filter((a) => {
      if (selectedGrade !== 'all' && a.grade !== selectedGrade) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.slug.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [audits, selectedGrade, searchQuery]);

  const avgQualityScore = useMemo(() => {
    if (audits.length === 0) return 0;
    const sum = audits.reduce((acc, curr) => acc + curr.overallScore, 0);
    return Math.round(sum / audits.length);
  }, [audits]);

  const gradeCount = useMemo(() => {
    const counts = { 'A+': 0, A: 0, B: 0, C: 0, D: 0 };
    audits.forEach((a) => counts[a.grade]++);
    return counts;
  }, [audits]);

  return (
    <div className="space-y-6">
      {/* Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Average Quality Score</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {avgQualityScore}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${avgQualityScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">A+ Grade (95-100)</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {gradeCount['A+']} Entities
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Full 8-vector structural completeness.</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">A & B Grade (70-94)</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {gradeCount['A'] + gradeCount['B']} Entities
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Production ready with minor expansion room.</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">C & D Grade (&lt;70)</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {gradeCount['C'] + gradeCount['D']} Drafts
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires schema, FAQs, or tool links.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search article titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          >
            <option value="all">All Grades</option>
            <option value="A+">A+ (95+ pts)</option>
            <option value="A">A (85-94 pts)</option>
            <option value="B">B (70-84 pts)</option>
            <option value="C">C (50-69 pts)</option>
            <option value="D">D (&lt;50 pts)</option>
          </select>
        </div>
      </div>

      {/* Audited Entities List */}
      <div className="space-y-3.5">
        {filteredAudits.map((audit) => {
          const isExpanded = expandedEntityId === audit.entityId;
          const bd = audit.breakdown;

          return (
            <div
              key={audit.entityId}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono ${
                        audit.grade === 'A+' || audit.grade === 'A'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : audit.grade === 'B'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      Grade {audit.grade} ({audit.overallScore}/100)
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/{audit.slug}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{audit.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedEntityId(isExpanded ? null : audit.entityId)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Breakdown' : 'View Audit Breakdown'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Detailed Breakdown */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-500 font-medium">Knowledge Graph</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {bd.knowledgeGraphCoverage.score} / {bd.knowledgeGraphCoverage.max} pts
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-500 font-medium">Internal Links</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {bd.internalLinkingHealth.score} / {bd.internalLinkingHealth.max} pts
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-500 font-medium">Tool Integration</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {bd.toolIntegration.score} / {bd.toolIntegration.max} pts
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-500 font-medium">Schema & Author</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {bd.structuredSchema.score} / {bd.structuredSchema.max} pts
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-500 font-medium">Metadata SEO</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {bd.metadataCompleteness.score} / {bd.metadataCompleteness.max} pts
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-500 font-medium">FAQ Breadth</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {bd.faqBreadth.score} / {bd.faqBreadth.max} pts
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-500 font-medium">Technical Accuracy</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {bd.technicalAccuracy.score} / {bd.technicalAccuracy.max} pts
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-500 font-medium">Unique Depth</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {bd.uniqueInformation.score} / {bd.uniqueInformation.max} pts
                      </div>
                    </div>
                  </div>

                  {/* Checklist of Improvement Items */}
                  {audit.improvementsChecklist.length > 0 ? (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs">
                      <div className="font-bold text-amber-800 dark:text-amber-400 mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Action Checklist to Reach 100% CQS Score:
                      </div>
                      <ul className="space-y-1 text-amber-900 dark:text-amber-300">
                        {audit.improvementsChecklist.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      All 8 quality dimensions verified. Perfect structural completeness.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
