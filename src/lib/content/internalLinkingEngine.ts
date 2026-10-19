import { ContentEntity, InternalLinkItem } from './types';
import { getAllContentEntities } from './contentRegistry';
import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { getAllTools, getToolBySlug } from '../tools/toolsRegistry';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { isVerifiedExtension } from '../database/extensionEngine';
import { isValidComparisonPair } from '../guides/comparisonGuideEngine';
import { isValidComparisonSlug } from '../routes/routeManifest';
import { CONVERTERS_LIST } from '../../data/convertersData';

export interface EntityLinkingMatrix {
  parentHub?: InternalLinkItem;
  formatLinks: InternalLinkItem[];
  extensionLinks: InternalLinkItem[];
  toolLinks: InternalLinkItem[];
  converterLinks: InternalLinkItem[];
  guideLinks: InternalLinkItem[];
  softwareLinks: InternalLinkItem[];
  comparisonLinks: InternalLinkItem[];
  analyzerLink: InternalLinkItem;
}

/**
 * Locale used to prefix emitted target URLs. EN is the canonical (unprefixed)
 * locale; ES/NL pages are served via proxy rewrite of the same App Router
 * pages, so every contextual link rendered under /es/ or /nl/ must keep its
 * locale prefix or it silently drops the reader back into the English page.
 */
export type LinkingLocale = 'en' | 'es' | 'nl';

function normalizeLocale(raw: unknown): LinkingLocale {
  return raw === 'es' || raw === 'nl' ? raw : 'en';
}

export function computeInternalLinksForEntity(
  entity: ContentEntity,
  rawLocale: unknown = 'en'
): EntityLinkingMatrix {
  const locale = normalizeLocale(rawLocale);
  const prefix = locale === 'en' ? '' : `/${locale}`;
  // Single funnel for every URL this engine emits, so the locale prefix
  // and existence guards can never drift out of sync across link groups.
  const url = (path: string) => `${prefix}${path}`;

  const allGuides = getAllContentEntities();
  const formatKey = entity.relatedExtensions[0]?.toLowerCase() || entity.slug.split('-').pop() || '';
  const extUpper = formatKey.toUpperCase();

  // 1. Parent Topic Hub — only emitted when the format key resolves to a real
  // extension page. Data like 'FAT32' (a filesystem, not an extension) must
  // never produce a /file-extensions/fat32 URL that 404s.
  const parentHub: InternalLinkItem | undefined = isVerifiedExtension(formatKey)
    ? {
        targetTitle: `.${extUpper} File Extension Guide`,
        targetUrl: url(`/file-extensions/${formatKey}`),
        targetType: 'hub',
        anchorText: `explore the complete ${extUpper} format hub`,
        contextHint: 'Format Ecosystem Overview',
        route: { view: 'extension-detail', ext: formatKey }
      }
    : undefined;

  // 2. Extension detail links — filtered against the verified extension index
  // so stale/typo'd relatedExtensions entries cannot emit 404 targets.
  const extensionLinks: InternalLinkItem[] = entity.relatedExtensions
    .filter((ext) => isVerifiedExtension(ext))
    .slice(0, 3)
    .map(ext => ({
      targetTitle: `.${ext} File Extension Guide`,
      targetUrl: url(`/file-extensions/${ext.toLowerCase()}`),
      targetType: 'format',
      anchorText: `inspect .${ext} specification and specifications`,
      contextHint: 'Extension database entry',
      route: { view: 'extension-detail', ext: ext.toLowerCase() }
    }));

  // 3. Tool Links (Smart Action integration)
  const toolLinks: InternalLinkItem[] = [];
  
  // Standard File Analyzer (canonical slug; /tools/file-analyzer 301s here)
  const analyzerLink: InternalLinkItem = {
    targetTitle: 'AnyFileX Binary File Analyzer',
    targetUrl: url('/tools/file-identifier'),
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
        // 'file-analyzer' is a legacy slug that 307s; link the canonical directly.
        const canonicalSlug = matched.slug === 'file-analyzer' ? 'file-identifier' : matched.slug;
        toolLinks.push({
          targetTitle: matched.name,
          targetUrl: url(`/tools/${canonicalSlug}`),
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
    targetUrl: url('/workflows'),
    targetType: 'tool',
    anchorText: `build a multi-step ${extUpper} batch conversion pipeline`,
    contextHint: 'Client-side automated workflow',
    route: { view: 'workflows' }
  });

  // 3b. Converter page links (data-driven via entity.relatedConverters).
  // Only curated CONVERTERS_LIST ids become links, so typos can never emit
  // 404 targets. Copy stays honest about capability: interactive tools get
  // the in-browser CTA; guide-only converter pages get "conversion guide".
  const converterLinks: InternalLinkItem[] = [];
  if (entity.relatedConverters && entity.relatedConverters.length > 0) {
    for (const convId of entity.relatedConverters.slice(0, 3)) {
      const conv = CONVERTERS_LIST.find((c) => c.id === convId);
      if (!conv) continue;
      const isTool = conv.isInteractiveToolAvailable === true;
      converterLinks.push({
        targetTitle: conv.name,
        targetUrl: url(`/converters/${conv.id}`),
        targetType: 'converter',
        anchorText: isTool
          ? `convert ${conv.fromExt} to ${conv.toExt} in your browser — free, no upload`
          : `read the ${conv.fromExt}-to-${conv.toExt} conversion guide`,
        contextHint: isTool ? 'In-browser converter' : 'Conversion guide',
        route: { view: 'converter-detail', id: conv.id }
      });
    }
  }

  // 4. Related Content Guides — curated first, heuristics second.
  // Explicit relatedGuides always win a slot (in declared order) so data
  // wiring is deterministic; extension-overlap discovery only fills the
  // remainder. Previously a single capped pass let auto-discovered guides
  // crowd out curated ones depending on registry iteration order.
  const guideLinks: InternalLinkItem[] = [];
  const seenGuideSlugs = new Set<string>();
  const pushGuide = (g: ContentEntity) => {
    if (guideLinks.length >= 4 || seenGuideSlugs.has(g.slug)) return;
    seenGuideSlugs.add(g.slug);
    guideLinks.push({
      targetTitle: g.title,
      targetUrl: url(`/guides/${g.slug}`),
      targetType: 'guide',
      anchorText: `read our comprehensive guide on ${g.primaryTopic}`,
      contextHint: g.contentType.replace('-', ' '),
      route: { view: 'guide-detail', id: g.slug }
    });
  };
  for (const slug of entity.relatedGuides || []) {
    const g = allGuides.find((x) => x.id !== entity.id && (x.slug === slug || x.id === slug));
    if (g) pushGuide(g);
  }
  // Also find guides sharing the same extension
  allGuides.forEach(g => {
    if (g.id !== entity.id && g.relatedExtensions.some(e => entity.relatedExtensions.includes(e))) {
      pushGuide(g);
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
          targetUrl: url(`/software/${softApp.id}`),
          targetType: 'software',
          anchorText: `view ${softApp.name} compatibility and supported formats`,
          contextHint: `${softApp.developer} (${softApp.priceType})`,
          route: { view: 'software-detail', id: softApp.id }
        });
      }
    }
  }

  // 6. Comparison Links — only for pairs that BOTH make topical sense AND have
  // a real comparison page. isValidComparisonPair alone is insufficient: it
  // approves any same-category pair, but /compare/[slug] only renders curated
  // slugs (generateStaticParams), so anything else 404s.
  const comparisonLinks: InternalLinkItem[] = [];
  if (entity.relatedComparisons) {
    for (const compSlug of entity.relatedComparisons.slice(0, 2)) {
      const parts = compSlug.split('-vs-');
      const pageSlug = parts.length === 2 ? `${parts[0]}-vs-${parts[1]}` : '';
      if (parts.length === 2 && isValidComparisonPair(parts[0], parts[1]).isValid && isValidComparisonSlug(pageSlug)) {
        comparisonLinks.push({
          targetTitle: `${parts[0].toUpperCase()} vs ${parts[1].toUpperCase()} Comparison`,
          targetUrl: url(`/compare/${parts[0]}-vs-${parts[1]}`),
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
    converterLinks,
    guideLinks,
    softwareLinks,
    comparisonLinks,
    analyzerLink
  };
}
