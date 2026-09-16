import React, { useState, useMemo } from 'react';
import { AppRoute } from '../types';
import { ContentEntity, ContentType, ContentStatus, ContentBrief, TopicalPillarKey } from '../lib/content/types';
import { CONTENT_CLUSTERS } from '../lib/content/contentClusters';
import {
  getAllContentEntities,
  saveContentEntity,
  updateContentStatus
} from '../lib/content/contentRegistry';
import {
  computeContentDashboardStats,
  CURRENT_KNOWLEDGE_GRAPH_VERSION
} from '../lib/content/contentAuditEngine';
import {
  generateContentBriefFromEntity,
  createDraftEntityFromBrief
} from '../lib/content/contentBriefGenerator';
import { POPULAR_FILE_TYPES } from '../data/fileTypesData';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';

// Phase 12 Modular Authority Components
import { TopicalCoverageMatrix } from '../components/authority/TopicalCoverageMatrix';
import { PrioritizationGapViewer } from '../components/authority/PrioritizationGapViewer';
import { ContentQualityAuditor } from '../components/authority/ContentQualityAuditor';
import { UpdateStaleManager } from '../components/authority/UpdateStaleManager';
import { DuplicateOrphanAuditor } from '../components/authority/DuplicateOrphanAuditor';
import { ExpansionGatingViewer } from '../components/authority/ExpansionGatingViewer';

import {
  Layers,
  FileText,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Plus,
  Eye,
  Edit3,
  RefreshCw,
  Link,
  ShieldCheck,
  TrendingUp,
  GitFork,
  Sliders,
  Check,
  ChevronDown,
  Cpu,
  Lock
} from 'lucide-react';

interface ContentDashboardPageProps {
  onNavigate: (route: AppRoute) => void;
}

export type AuthorityTab =
  | 'coverage'
  | 'priorities_gaps'
  | 'quality_cqs'
  | 'updates'
  | 'duplicate_orphans'
  | 'expansion_gating'
  | 'inventory'
  | 'brief_generator';

export const ContentDashboardPage: React.FC<ContentDashboardPageProps> = ({ onNavigate }) => {
  const [entities, setEntities] = useState<ContentEntity[]>(() => getAllContentEntities());
  const [activeTab, setActiveTab] = useState<AuthorityTab>('coverage');

  // Inventory Filter states
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Brief Generator states
  const [targetExt, setTargetExt] = useState<string>('HEIC');
  const [targetType, setTargetType] = useState<ContentType>('format-guide');
  const [generatedBrief, setGeneratedBrief] = useState<ContentBrief | null>(null);
  const [briefSaveSuccess, setBriefSaveSuccess] = useState<boolean>(false);

  // Dashboard Stats
  const stats = useMemo(() => computeContentDashboardStats(), [entities]);

  // Filtered inventory list
  const filteredEntities = useMemo(() => {
    return entities.filter((e) => {
      if (selectedCluster !== 'all' && e.clusterId !== selectedCluster) return false;
      if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesTopic = e.primaryTopic.toLowerCase().includes(q);
        const matchesExt = e.relatedExtensions?.some((ext) => ext.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTopic && !matchesExt) return false;
      }
      return true;
    });
  }, [entities, selectedCluster, selectedStatus, searchQuery]);

  const handleStatusChange = (id: string, newStatus: ContentStatus) => {
    updateContentStatus(id, newStatus);
    setEntities(getAllContentEntities());
  };

  const handleGenerateBrief = () => {
    const brief = generateContentBriefFromEntity({
      extension: targetExt,
      contentType: targetType
    });
    setGeneratedBrief(brief);
    setBriefSaveSuccess(false);
  };

  const handleCreateBriefFromParam = (params: {
    targetExt: string;
    contentType: ContentType;
    suggestedSlug: string;
  }) => {
    setTargetExt(params.targetExt);
    setTargetType(params.contentType);
    const brief = generateContentBriefFromEntity({
      extension: params.targetExt,
      contentType: params.contentType
    });
    setGeneratedBrief(brief);
    setBriefSaveSuccess(false);
    setActiveTab('brief_generator');
  };

  const handleSaveDraftFromBrief = () => {
    if (!generatedBrief) return;
    const newDraft = createDraftEntityFromBrief(generatedBrief);
    saveContentEntity(newDraft);
    setEntities(getAllContentEntities());
    setBriefSaveSuccess(true);
    setTimeout(() => setBriefSaveSuccess(false), 3000);
  };

  const refreshEntityList = () => {
    setEntities(getAllContentEntities());
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <SEOHead
        title="Topical Authority Expansion & Content Scaling Center | AnyFileX"
        description="Controlled content scaling system: 8-pillar topical coverage map, multi-factor prioritization scoring, content quality auditing (CQS), update monitoring, and programmatic SEO safety gating."
        canonicalPath="/admin/content"
        robots="noindex, nofollow"
      />

      <Breadcrumb
        items={[
          { label: 'Admin CMS', route: { view: 'admin' } },
          { label: 'Topical Authority & Content Engine' }
        ]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              Phase 12 Architecture
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Knowledge Graph v{CURRENT_KNOWLEDGE_GRAPH_VERSION}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Topical Authority & Content Scaling Center
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Controlled programmatic expansion system linking format architecture, conversion tools, diagnostic guides, and knowledge graph entities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('brief_generator')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Brief Generator
          </button>
        </div>
      </div>

      {/* Primary 7 Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <nav className="flex space-x-1 sm:space-x-4 min-w-max pb-px" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('coverage')}
            className={`py-3 px-3.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'coverage'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Topical Coverage Map</span>
          </button>

          <button
            onClick={() => setActiveTab('priorities_gaps')}
            className={`py-3 px-3.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'priorities_gaps'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Priorities & Gaps</span>
          </button>

          <button
            onClick={() => setActiveTab('quality_cqs')}
            className={`py-3 px-3.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'quality_cqs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Quality Score (CQS)</span>
          </button>

          <button
            onClick={() => setActiveTab('updates')}
            className={`py-3 px-3.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'updates'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Update & Stale Sync</span>
            {stats.needsUpdateCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-mono">
                {stats.needsUpdateCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('duplicate_orphans')}
            className={`py-3 px-3.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'duplicate_orphans'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Duplicates & Orphans</span>
          </button>

          <button
            onClick={() => setActiveTab('expansion_gating')}
            className={`py-3 px-3.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'expansion_gating'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Expansion Gating</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'inventory'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Content Inventory ({entities.length})</span>
          </button>
        </nav>
      </div>

      {/* TAB 1: TOPICAL COVERAGE MATRIX */}
      {activeTab === 'coverage' && (
        <TopicalCoverageMatrix
          onNavigate={onNavigate}
          onGenerateBriefForGap={(ext, pillar) => {
            const pillarToTypeMap: Record<TopicalPillarKey, ContentType> = {
              format_guide: 'format-guide',
              how_to_open: 'how-to',
              conversion: 'conversion-guide',
              comparison: 'comparison',
              troubleshooting: 'troubleshooting',
              security: 'technical-guide',
              software: 'software-compatibility',
              tool: 'format-guide'
            };
            handleCreateBriefFromParam({
              targetExt: ext,
              contentType: pillarToTypeMap[pillar] || 'format-guide',
              suggestedSlug: `${pillar}-${ext.toLowerCase()}`
            });
          }}
        />
      )}

      {/* TAB 2: PRIORITIZATION & GAP ENGINE */}
      {activeTab === 'priorities_gaps' && (
        <PrioritizationGapViewer
          onNavigate={onNavigate}
          onCreateBrief={handleCreateBriefFromParam}
        />
      )}

      {/* TAB 3: CONTENT QUALITY SCORE AUDITOR (CQS) */}
      {activeTab === 'quality_cqs' && (
        <ContentQualityAuditor onNavigate={onNavigate} />
      )}

      {/* TAB 4: UPDATE ENGINE & STALE CONTENT SYNC */}
      {activeTab === 'updates' && (
        <UpdateStaleManager
          onNavigate={onNavigate}
          onRefreshEntityList={refreshEntityList}
        />
      )}

      {/* TAB 5: DUPLICATES & ORPHANS AUDIT */}
      {activeTab === 'duplicate_orphans' && (
        <DuplicateOrphanAuditor
          onNavigate={onNavigate}
          onRefreshEntityList={refreshEntityList}
        />
      )}

      {/* TAB 6: CONTROLLED EXPANSION GATING */}
      {activeTab === 'expansion_gating' && (
        <ExpansionGatingViewer
          onNavigate={onNavigate}
          onCreateBrief={handleCreateBriefFromParam}
        />
      )}

      {/* TAB 7: CONTENT INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or format..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="all">All Clusters</option>
                {CONTENT_CLUSTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="brief">Brief</option>
                <option value="review">Review</option>
                <option value="needs_update">Needs Update</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Article Title</th>
                    <th className="py-3.5 px-3">Type</th>
                    <th className="py-3.5 px-3">Formats</th>
                    <th className="py-3.5 px-3 text-center">Status</th>
                    <th className="py-3.5 px-3">Schema</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                  {filteredEntities.map((entity) => (
                    <tr
                      key={entity.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 max-w-md">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{entity.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">/{entity.slug}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                          {entity.contentType}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px]">
                        {entity.relatedExtensions?.slice(0, 3).join(', ') || 'N/A'}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <select
                          value={entity.status}
                          onChange={(e) => handleStatusChange(entity.id, e.target.value as ContentStatus)}
                          className="px-2 py-1 text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="brief">Brief</option>
                          <option value="review">Review</option>
                          <option value="needs_update">Needs Update</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {entity.schemaType || 'None'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (entity.contentType === 'format-guide') {
                              onNavigate({ view: 'format-guide', format: entity.relatedExtensions?.[0]?.toLowerCase() || 'heic' });
                            } else if (entity.contentType === 'how-to') {
                              onNavigate({ view: 'how-to-open', ext: entity.relatedExtensions?.[0]?.toLowerCase() || 'heic' });
                            } else if (entity.contentType === 'technical-guide') {
                              onNavigate({ view: 'technical-guide', slug: entity.slug });
                            } else {
                              onNavigate({ view: 'guides' });
                            }
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: BRIEF GENERATOR */}
      {activeTab === 'brief_generator' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Knowledge Graph Brief Synthesizer
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generates an editorial brief pulling live binary signatures, software compatibility, and converter pathways.
                </p>
              </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target File Format
                </label>
                <select
                  value={targetExt}
                  onChange={(e) => setTargetExt(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono"
                >
                  {POPULAR_FILE_TYPES.map((f) => (
                    <option key={f.extension} value={f.extension}>
                      .{f.extension} — {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content Type Pillar
                </label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as ContentType)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                >
                  <option value="format-guide">Format Guide</option>
                  <option value="how-to">How to Open</option>
                  <option value="conversion-guide">Conversion Guide</option>
                  <option value="comparison">Format Comparison</option>
                  <option value="troubleshooting">Troubleshooting / Repair</option>
                  <option value="technical-guide">Technical / Security Spec</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateBrief}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Synthesize Brief
                </button>
              </div>
            </div>

            {/* Rendered Brief Output */}
            {generatedBrief && (
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Generated Editorial Brief
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {generatedBrief.suggestedTitle}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      Slug: /{generatedBrief.suggestedSlug}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveDraftFromBrief}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {briefSaveSuccess ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{briefSaveSuccess ? 'Draft Saved to Registry!' : 'Create Draft in Registry'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Structured H2 Sections & Requirements
                  </h4>
                  <div className="space-y-2">
                    {generatedBrief.outline.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
                      >
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center text-[10px] font-mono">
                            {idx + 1}
                          </span>
                          <span>{item.heading}</span>
                        </div>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-6 list-disc">
                          {item.corePointsToCover.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relevant Tools */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Connected AnyFileX Interactive Tools
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {generatedBrief.relevantAnyFileXTools.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900"
                      >
                        <div className="font-bold text-xs text-blue-950 dark:text-blue-300">
                          {t.toolName}
                        </div>
                        <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
                          {t.featureHighlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
