import { AvailableToolAction } from './types';
import { getFormatKnowledgeNode, FormatKnowledgeNode } from '../database/knowledgeGraph';

/**
 * Connects the detected format entity to the AnyFileX Phase 1 Knowledge Graph
 * and resolves high-value actionable tools, converters, guides, and comparison links.
 */
export function resolveAvailableTools(
  detectedExt: string,
  knowledgeNode: FormatKnowledgeNode | null
): AvailableToolAction[] {
  const tools: AvailableToolAction[] = [];
  const cleanExt = (detectedExt || '').trim().toLowerCase();
  const upperExt = cleanExt.toUpperCase();

  if (!cleanExt || cleanExt === 'unknown' || cleanExt === 'bin') {
    tools.push({
      id: 'general_magic_bytes',
      title: 'Magic Byte Signature Search',
      description: 'Search our database of 200+ raw binary file signatures.',
      actionType: 'open_guide',
      route: { view: 'magic-byte-detector' },
      badge: 'Database',
      iconName: 'Cpu',
      isPrimary: true,
    });
    tools.push({
      id: 'hash_gen',
      title: 'Generate File Hashes',
      description: 'Calculate cryptographic SHA-256 and MD5 checksums.',
      actionType: 'hash',
      route: { view: 'hash-generator' },
      iconName: 'Hash',
    });
    return tools;
  }

  // 1. Primary Action: How to Open Guide
  tools.push({
    id: `how_to_open_${cleanExt}`,
    title: `How to Open .${upperExt} Files`,
    description: `Step-by-step instructions and verified viewers for Windows, Mac, iOS & Android.`,
    actionType: 'open_guide',
    route: { view: 'how-to-open', ext: cleanExt },
    badge: 'Guide',
    iconName: 'HelpCircle',
    isPrimary: true,
  });

  // 2. Converters (from Knowledge Node or direct)
  if (knowledgeNode && knowledgeNode.converterUrls.length > 0) {
    knowledgeNode.converterUrls.slice(0, 3).forEach((c) => {
      tools.push({
        id: `converter_${c.routeId}`,
        title: `Convert .${upperExt} to .${c.targetExt}`,
        description: `Online conversion workflow to export .${upperExt} into universally supported .${c.targetExt}.`,
        actionType: 'converter',
        route: { view: 'converter-detail', id: c.routeId },
        badge: 'Converter',
        iconName: 'RefreshCw',
      });
    });
  } else {
    // Default conversion search
    tools.push({
      id: `converter_search_${cleanExt}`,
      title: `Convert .${upperExt} Format`,
      description: `Explore online converters and batch export tools for .${upperExt}.`,
      actionType: 'converter',
      route: { view: 'converters' },
      badge: 'Tools',
      iconName: 'RefreshCw',
    });
  }

  // 3. Format Comparisons (Head-to-head)
  if (knowledgeNode && knowledgeNode.comparisons.length > 0) {
    const comp = knowledgeNode.comparisons[0];
    tools.push({
      id: `compare_${comp.slug}`,
      title: comp.title,
      description: comp.highlight || `Compare ${comp.ext1} vs ${comp.ext2} compression and compatibility.`,
      actionType: 'compare',
      route: { view: 'comparison-detail', slug: comp.slug },
      badge: 'Comparison',
      iconName: 'Scale',
    });
  }

  // 4. Detailed Format Specification & History Entity
  tools.push({
    id: `ext_detail_${cleanExt}`,
    title: `.${upperExt} File Extension Specs`,
    description: `Full technical specifications, MIME definitions, structure diagrams, and history.`,
    actionType: 'extension_info',
    route: { view: 'extension-detail', ext: cleanExt },
    badge: 'Encyclopedia',
    iconName: 'FileText',
  });

  // 5. Deep Metadata Inspector
  tools.push({
    id: `meta_inspector_${cleanExt}`,
    title: 'Deep Metadata & EXIF Viewer',
    description: 'Inspect embedded camera tags, audio streams, and document revisions.',
    actionType: 'metadata',
    route: { view: 'metadata-viewer' },
    badge: 'Inspector',
    iconName: 'Search',
  });

  return tools;
}
