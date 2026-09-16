import { ContentEntity, InternalLinkItem } from './types';
import { getAllContentEntities } from './contentRegistry';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { getAllTools, getToolBySlug } from '../tools/toolsRegistry';
import { SOFTWARE_LIST } from '../../data/softwareData';

export interface EntityLinkingMatrix {
  parentHub?: InternalLinkItem;
  formatLinks: InternalLinkItem[];
  extensionLinks: InternalLinkItem[];
  toolLinks: InternalLinkItem[];
  guideLinks: InternalLinkItem[];
  softwareLinks: InternalLinkItem[];
  comparisonLinks: InternalLinkItem[];
  analyzerLink: InternalLinkItem;
}

export function computeInternalLinksForEntity(entity: ContentEntity): EntityLinkingMatrix {
  const allGuides = getAllContentEntities();
  const formatKey = entity.relatedExtensions[0]?.toLowerCase() || entity.slug.split('-').pop() || '';
  const extUpper = formatKey.toUpperCase();

  // 1. Parent Topic Hub
  const parentHub: InternalLinkItem = {
    targetTitle: `${extUpper} Topic Authority Hub`,
    targetUrl: `/hub/${formatKey}`,
    targetType: 'hub',
    anchorText: `explore the complete ${extUpper} format hub`,
    contextHint: 'Format Ecosystem Overview',
    route: { view: 'content-hub' as any, topic: formatKey }
  };

  // 2. Extension detail links
  const extensionLinks: InternalLinkItem[] = entity.relatedExtensions.slice(0, 3).map(ext => ({
    targetTitle: `.${ext} File Extension Guide`,
    targetUrl: `/file-extension/${ext.toLowerCase()}`,
    targetType: 'format',
    anchorText: `inspect .${ext} specification and specifications`,
    contextHint: 'Extension database entry',
    route: { view: 'extension-detail', ext: ext.toLowerCase() }
  }));

  // 3. Tool Links (Smart Action integration)
  const toolLinks: InternalLinkItem[] = [];
  
  // Standard File Analyzer
  const analyzerLink: InternalLinkItem = {
    targetTitle: 'AnyFileX Binary File Analyzer',
    targetUrl: '/file-analyzer',
    targetType: 'analyzer',
    anchorText: `verify genuine .${extUpper} magic bytes in File Analyzer`,
    contextHint: 'Binary validation & security inspection',
    route: { view: 'file-analyzer' }
  };

  // Dedicated format converters or tools
  if (entity.relatedTools && entity.relatedTools.length > 0) {
    for (const toolId of entity.relatedTools.slice(0, 3)) {
      const matched = getToolBySlug(toolId);
      if (matched) {
        toolLinks.push({
          targetTitle: matched.name,
          targetUrl: `/tools/${matched.slug}`,
          targetType: 'tool',
          anchorText: `launch ${matched.name.toLowerCase()} in browser RAM`,
          contextHint: matched.tagline || 'In-browser tool',
          route: { view: 'tool-detail', slug: matched.slug }
        });
      }
    }
  }

  // Workflows pipeline builder
  toolLinks.push({
    targetTitle: 'Visual Workflow Pipeline Builder',
    targetUrl: '/workflows',
    targetType: 'tool',
    anchorText: `build a multi-step ${extUpper} batch conversion pipeline`,
    contextHint: 'Client-side automated workflow',
    route: { view: 'workflows' }
  });

  // 4. Related Content Guides
  const guideLinks: InternalLinkItem[] = [];
  const relatedSlugs = new Set(entity.relatedGuides || []);
  
  // Also find guides sharing the same extension
  allGuides.forEach(g => {
    if (g.id !== entity.id && (relatedSlugs.has(g.slug) || relatedSlugs.has(g.id) || g.relatedExtensions.some(e => entity.relatedExtensions.includes(e)))) {
      if (guideLinks.length < 4) {
        guideLinks.push({
          targetTitle: g.title,
          targetUrl: `/guides/${g.slug}`,
          targetType: 'guide',
          anchorText: `read our comprehensive guide on ${g.primaryTopic}`,
          contextHint: g.contentType.replace('-', ' '),
          route: { view: 'guide-detail', id: g.slug }
        });
      }
    }
  });

  // 5. Software Links
  const softwareLinks: InternalLinkItem[] = [];
  if (entity.relatedSoftware) {
    for (const softSlug of entity.relatedSoftware.slice(0, 3)) {
      const softApp = SOFTWARE_LIST.find(s => s.id === softSlug);
      if (softApp) {
        softwareLinks.push({
          targetTitle: softApp.name,
          targetUrl: `/software/${softApp.id}`,
          targetType: 'software',
          anchorText: `view ${softApp.name} compatibility and supported formats`,
          contextHint: `${softApp.developer} (${softApp.priceType})`,
          route: { view: 'software-detail', id: softApp.id }
        });
      }
    }
  }

  // 6. Comparison Links
  const comparisonLinks: InternalLinkItem[] = [];
  if (entity.relatedComparisons) {
    for (const compSlug of entity.relatedComparisons.slice(0, 2)) {
      const parts = compSlug.split('-vs-');
      if (parts.length === 2) {
        comparisonLinks.push({
          targetTitle: `${parts[0].toUpperCase()} vs ${parts[1].toUpperCase()} Comparison`,
          targetUrl: `/compare/${parts[0]}-vs-${parts[1]}`,
          targetType: 'comparison',
          anchorText: `compare ${parts[0].toUpperCase()} vs ${parts[1].toUpperCase()} benchmarks and specs`,
          contextHint: 'Format side-by-side comparison',
          route: { view: 'compare-detail' as any, id: `${parts[0]}-vs-${parts[1]}` }
        });
      }
    }
  }

  return {
    parentHub,
    formatLinks: extensionLinks,
    extensionLinks,
    toolLinks,
    guideLinks,
    softwareLinks,
    comparisonLinks,
    analyzerLink
  };
}
