import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Clock,
  ArrowRight,
  User,
  Search,
  Layers,
  Sparkles,
  Zap,
  Filter,
  FileText,
  FolderOpen,
  RefreshCw,
  GitCompare,
  AlertTriangle,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { GUIDES_LIST } from '../data/guidesData';
import { AppRoute, GuideInfo } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import { getAllContentEntities, getContentEntityBySlug } from '../lib/content/contentRegistry';
import { CONTENT_CLUSTERS, getClusterById } from '../lib/content/contentClusters';
import { ContentArticleView } from '../components/content/ContentArticleView';
import { ContentEntity } from '../lib/content/types';

interface GuidesPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedGuideId?: string;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ onNavigate, selectedGuideId }) => {
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allContentEntities = useMemo(() => getAllContentEntities(), []);

  // Check if a specific guide was selected
  if (selectedGuideId) {
    const matchedEntity = getContentEntityBySlug(selectedGuideId);
    if (matchedEntity) {
      return <ContentArticleView entity={matchedEntity} onNavigate={onNavigate} />;
    }

    // Fallback to legacy GUIDES_LIST if present
    const legacyGuide = GUIDES_LIST.find(g => g.id === selectedGuideId || g.slug === selectedGuideId);
    if (legacyGuide) {
      // Map legacy guide to ContentEntity format for uniform high-fidelity rendering
      const adaptedEntity: ContentEntity = {
        id: legacyGuide.id,
        slug: legacyGuide.slug || legacyGuide.id,
        title: legacyGuide.title,
        contentType: 'format-guide',
        clusterId: 'cluster-a-formats',
        primaryTopic: legacyGuide.category,
        searchIntent: 'informational',
        summary: legacyGuide.summary,
        contentSections: legacyGuide.contentSections.map(s => ({
          heading: s.heading,
          body: s.body ?? '',
          bullets: s.bullets,
          callout: s.callout
        })),
        relatedFormats: legacyGuide.relatedExtensions || [],
        relatedExtensions: legacyGuide.relatedExtensions || [],
        relatedTools: ['file-analyzer', 'image-compressor'],
        relatedSoftware: [],
        relatedGuides: [],
        faq: [],
        schemaType: 'Article',
        status: 'published',
        publishedDate: legacyGuide.date,
        updatedDate: '2024-11-20',
        createdAt: '2024-05-01',
        knowledgeGraphVersion: '5.2.0',
        seoMeta: {
          title: `${legacyGuide.title} | AnyFileX`,
          description: legacyGuide.summary,
          canonical: `https://anyfilex.com/guides/${legacyGuide.slug || legacyGuide.id}`,
          robots: 'index, follow'
        },
        author: {
          name: legacyGuide.author.name,
          role: legacyGuide.author.role,
          avatar: legacyGuide.author.avatar
        },
        readingTimeMinutes: parseInt(legacyGuide.readTime) || 5,
        difficulty: 'Beginner'
      };
      return <ContentArticleView entity={adaptedEntity} onNavigate={onNavigate} />;
    }
  }

  // Filter content
  const filteredEntities = allContentEntities.filter(e => {
    if (e.status !== 'published') return false;
    if (selectedClusterFilter !== 'all' && e.clusterId !== selectedClusterFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchTopic = e.primaryTopic.toLowerCase().includes(q);
      const matchExt = e.relatedExtensions.some(ext => ext.toLowerCase().includes(q));
      if (!matchTitle && !matchTopic && !matchExt) return false;
    }
    return true;
  });

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      <SEOHead
        title="File Format Educational Guides & Knowledge Hub | AnyFileX"
        description="Authoritative, in-depth technical guides on file formats, magic bytes, container architecture, OS opening instructions, and client-side conversion workflows."
        canonicalPath="/guides"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          headline: 'AnyFileX Technical Knowledge Base & Format Guides',
          description: 'Comprehensive guides covering file format specs, binary header identification, and troubleshooting.'
        }}
      />

      <Breadcrumb items={[{ label: 'Guides Hub' }]} onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="blue" size="md">
          Topical Authority Engine
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          File Format Educational Knowledge Hub
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Structured, verified architectural tutorials on container specifications, binary signatures, OS opening steps, and private conversions.
        </p>

        {/* Quick Format Hub Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-bold text-slate-400">Popular Hubs:</span>
          {['HEIC', 'WEBP', 'AVIF', 'DOCX', 'ZIP', 'PDF', 'PNG', 'JPG'].map(ext => (
            <button
              key={ext}
              onClick={() => onNavigate({ view: 'content-hub' as any, topic: ext.toLowerCase() })}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 transition-all"
            >
              .{ext} Hub
            </button>
          ))}
        </div>
      </div>

      {/* Search & Cluster Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides by title, extension, or concept (e.g. Magic Bytes, HEIC to JPG, WEBP)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Cluster:</span>
            <select
              value={selectedClusterFilter}
              onChange={e => setSelectedClusterFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="all">All Topical Clusters (A–H)</option>
              {CONTENT_CLUSTERS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cluster Tabs Pill Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedClusterFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedClusterFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Guides ({allContentEntities.filter(e => e.status === 'published').length})
          </button>
          {CONTENT_CLUSTERS.map(cluster => {
            const count = allContentEntities.filter(e => e.clusterId === cluster.id && e.status === 'published').length;
            if (count === 0) return null;
            return (
              <button
                key={cluster.id}
                onClick={() => setSelectedClusterFilter(cluster.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedClusterFilter === cluster.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cluster.shortName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntities.map(item => {
          const cluster = getClusterById(item.clusterId);
          return (
            <div
              key={item.id}
              onClick={() => onNavigate({ view: 'guide-detail', id: item.slug })}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
              id={`guide-card-${item.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="blue">{cluster?.shortName || item.contentType}</Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.readingTimeMinutes} min
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {item.relatedExtensions && item.relatedExtensions.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.relatedExtensions.map(ext => (
                      <span
                        key={ext}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-bold"
                      >
                        .{ext}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuidesPage;
