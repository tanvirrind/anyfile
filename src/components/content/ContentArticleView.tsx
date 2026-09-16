import React, { useState, useEffect } from 'react';
import { AppRoute } from '../../types';
import { ContentEntity } from '../../lib/content/types';
import { computeInternalLinksForEntity } from '../../lib/content/internalLinkingEngine';
import { Breadcrumb } from '../Breadcrumb';
import { Badge } from '../Badge';
import { TOCSidebar } from '../TOCSidebar';
import { SEOHead } from '../SEOHead';
import {
  Clock,
  User,
  Cpu,
  Layers,
  ArrowRight,
  Zap,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2,
  Bookmark,
  Check
} from 'lucide-react';

interface ContentArticleViewProps {
  entity: ContentEntity;
  onNavigate: (route: AppRoute) => void;
}

export const ContentArticleView: React.FC<ContentArticleViewProps> = ({ entity, onNavigate }) => {
  const [activeToc, setActiveToc] = useState('art-sec-0');
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const linkingMatrix = computeInternalLinksForEntity(entity);

  const tocItems = entity.contentSections.map((sec, idx) => ({
    id: `art-sec-${idx}`,
    label: sec.heading
  }));

  if (entity.faq && entity.faq.length > 0) {
    tocItems.push({
      id: 'art-sec-faq',
      label: 'Frequently Asked Questions'
    });
  }

  const handleTocSelect = (id: string) => {
    setActiveToc(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const secEl = document.getElementById(tocItems[i].id);
        if (secEl && scrollPosition >= secEl.offsetTop) {
          setActiveToc(tocItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [entity.id]);

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Generate real Schema.org JSON-LD
  const schemaPayload: any = {
    '@context': 'https://schema.org',
    '@type': entity.schemaType === 'HowTo' ? 'HowTo' : 'TechArticle',
    headline: entity.h1 || entity.title,
    description: entity.summary,
    author: {
      '@type': 'Person',
      name: entity.author.name,
      jobTitle: entity.author.role
    },
    datePublished: entity.publishedDate || entity.createdAt,
    dateModified: entity.updatedDate,
    mainEntityOfPage: `https://anyfilex.com/guides/${entity.slug}`
  };

  if (entity.schemaType === 'HowTo') {
    schemaPayload.step = entity.contentSections.map((sec, i) => ({
      '@type': 'HowToStep',
      name: sec.heading,
      text: sec.body,
      position: i + 1
    }));
  }

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <SEOHead
        title={entity.seoMeta?.title || `${entity.title} | AnyFileX Authority Guide`}
        description={entity.seoMeta?.description || entity.summary}
        canonicalPath={`/guides/${entity.slug}`}
        schemaData={schemaPayload}
      />

      <Breadcrumb
        items={[
          { label: 'Guides Hub', route: { view: 'guides' } },
          { label: entity.primaryTopic, route: linkingMatrix.parentHub?.route || { view: 'guides' } },
          { label: entity.title }
        ]}
        onNavigate={onNavigate}
      />

      {/* Header Container */}
      <div className="space-y-4 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="blue">{entity.contentType.replace('-', ' ').toUpperCase()}</Badge>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {entity.readingTimeMinutes} min read
          </span>
          <span className="text-xs text-slate-400">• Updated {entity.updatedDate}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
            Graph v{entity.knowledgeGraphVersion}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
          {entity.h1 || entity.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {entity.summary}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img src={entity.author.avatar} alt={entity.author.name} className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">{entity.author.name}</div>
              <div className="text-xs text-slate-500">{entity.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid with Sticky TOC and Body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left TOC Sidebar */}
        <div className="lg:col-span-1">
          <TOCSidebar items={tocItems} activeId={activeToc} onSelect={handleTocSelect} title="Guide Table of Contents" />
        </div>

        {/* Article Body Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
            {entity.contentSections.map((sec, idx) => (
              <div key={idx} id={`art-sec-${idx}`} className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-3">
                  {sec.stepNumber !== undefined && (
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {sec.stepNumber}
                    </span>
                  )}
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800/60 first:border-0 first:pt-0">
                    {sec.heading}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {sec.body}
                </p>

                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="space-y-2.5 pt-1 text-sm text-slate-700 dark:text-slate-300">
                    {sec.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2"></span>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sec.codeSnippet && (
                  <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
                    <code>{sec.codeSnippet}</code>
                  </div>
                )}

                {sec.callout && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-300">
                    {sec.callout}
                  </div>
                )}
              </div>
            ))}

            {/* In-Article Tool Action Callout */}
            {linkingMatrix.toolLinks.length > 0 && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-blue-900/10 border border-blue-200 dark:border-blue-900/50 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <Zap className="w-4 h-4" /> Live Interactive Tools
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Execute This Operation In Your Browser
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  AnyFileX processes all transformations, magic byte analysis, and batch pipelines 100% in client-side RAM with zero cloud storage exposure.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  {linkingMatrix.toolLinks.slice(0, 2).map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (t.route) onNavigate(t.route);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5" /> {t.targetTitle}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Accordion Section */}
            {entity.faq && entity.faq.length > 0 && (
              <div id="art-sec-faq" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" /> Frequently Asked Questions
                </h2>

                <div className="space-y-3">
                  {entity.faq.map((f, fIdx) => (
                    <div
                      key={fIdx}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(expandedFaqIndex === fIdx ? null : fIdx)}
                        className="w-full p-4 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <span>{f.question}</span>
                        {expandedFaqIndex === fIdx ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {expandedFaqIndex === fIdx && (
                        <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                          {f.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contextual Internal Links Section */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> Connected Knowledge Graph & Resources
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore deeply connected topics, format specifications, and verified software in the AnyFileX knowledge network.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {linkingMatrix.parentHub && (
                <div
                  onClick={() => linkingMatrix.parentHub?.route && onNavigate(linkingMatrix.parentHub.route)}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-blue-600 block uppercase">Topic Hub</span>
                  <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {linkingMatrix.parentHub.targetTitle}
                  </div>
                  <span className="text-xs text-slate-500 block mt-1">{linkingMatrix.parentHub.anchorText}</span>
                </div>
              )}

              {linkingMatrix.guideLinks.slice(0, 3).map((g, idx) => (
                <div
                  key={idx}
                  onClick={() => g.route && onNavigate(g.route)}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-emerald-600 block uppercase">{g.contextHint}</span>
                  <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                    {g.targetTitle}
                  </div>
                  <span className="text-xs text-slate-500 block mt-1">{g.anchorText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
