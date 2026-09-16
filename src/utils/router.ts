import { AppRoute, ToolTab } from '../types';

export function routeToPath(route: AppRoute): string {
  switch (route.view) {
    case 'home':
      return '/';
    case 'extensions': {
      const params = new URLSearchParams();
      if (route.categoryFilter) params.set('category', route.categoryFilter);
      if (route.letterFilter) params.set('letter', route.letterFilter);
      const q = params.toString().replace(/\+/g, '%20');
      return `/file-extensions${q ? '?' + q : ''}`;
    }
    case 'extension-detail':
      return `/file-extensions/${encodeURIComponent(route.ext.toLowerCase())}`;
    case 'how-to-open': {
      if (route.ext) {
        return `/how-to-open/${encodeURIComponent(route.ext.toLowerCase())}`;
      }
      const params = new URLSearchParams();
      if (route.categoryFilter) params.set('category', route.categoryFilter);
      const q = params.toString().replace(/\+/g, '%20');
      return `/how-to-open${q ? '?' + q : ''}`;
    }
    case 'compare-hub': {
      const params = new URLSearchParams();
      if (route.categoryFilter) params.set('category', route.categoryFilter);
      const q = params.toString().replace(/\+/g, '%20');
      return `/compare${q ? '?' + q : ''}`;
    }
    case 'comparison-detail':
      return `/compare/${encodeURIComponent(route.slug.toLowerCase())}`;
    case 'software':
      return '/software';
    case 'software-detail':
      return `/software/${encodeURIComponent(route.id)}`;
    case 'converters':
      return '/converters';
    case 'converter-detail':
      return `/converters/${encodeURIComponent(route.id)}`;
    case 'repair':
    case 'troubleshoot-hub':
      return '/troubleshoot';
    case 'repair-detail':
      return `/troubleshoot/${encodeURIComponent(route.id)}`;
    case 'troubleshoot-guide':
      return `/troubleshoot/${encodeURIComponent(route.slug)}`;
    case 'security-hub':
      return '/security';
    case 'technical-guide':
      return `/security/${encodeURIComponent(route.slug)}`;
    case 'tools':
      if (route.categoryFilter) {
        return `/tools/${encodeURIComponent(route.categoryFilter.toLowerCase())}`;
      }
      return route.toolId ? `/tools/${encodeURIComponent(route.toolId)}` : '/tools';
    case 'tool-detail':
      return `/tools/${encodeURIComponent(route.slug.toLowerCase())}`;
    case 'file-analyzer':
      return route.id ? `/tools/file-identifier/result/${encodeURIComponent(route.id)}` : '/tools/file-identifier';
    case 'file-identifier':
      return '/tools/file-identifier';
    case 'file-identifier-result':
      return `/tools/file-identifier/result/${encodeURIComponent(route.id)}`;
    case 'metadata-viewer':
      return '/tools/metadata-viewer';
    case 'metadata-result':
      return `/tools/metadata-viewer/result/${encodeURIComponent(route.id)}`;
    case 'remove-metadata':
      return '/tools/remove-metadata';
    case 'hash-generator':
      return '/tools/hash-generator';
    case 'checksum-verifier':
      return '/tools/checksum-verifier';
    case 'mime-checker': {
      const q = route.query ? `?q=${encodeURIComponent(route.query)}` : '';
      return `/tools/mime-checker${q}`;
    }
    case 'magic-byte-detector':
      return '/tools/magic-byte-detector';
    case 'mime-detail':
      return `/mime-type/${encodeURIComponent(route.mimeSlug)}`;
    case 'guides':
    case 'resources':
      return '/guides';
    case 'guide-detail':
      return `/guides/${encodeURIComponent(route.id)}`;
    case 'blog':
      return '/blog';
    case 'blog-detail':
    case 'blog-post':
      return `/blog/${encodeURIComponent(route.id)}`;
    case 'category-detail':
      return `/category/${encodeURIComponent(route.id)}`;
    case 'admin':
      return '/admin';
    case 'assistant':
      return '/assistant';
    case 'seo-audit':
      return '/seo-audit';
    case 'sitemaps':
      return '/sitemaps';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'workflows':
      return route.workflowId ? `/workflows/${encodeURIComponent(route.workflowId)}` : '/workflows';
    case 'format-guide':
      return `/file-extensions/${encodeURIComponent(route.format.toLowerCase())}`;
    case 'content-hub':
      return `/hub/${encodeURIComponent(route.topic)}`;
    case 'content-dashboard':
      return '/admin/content';
    case 'not-found':
      return '/404';
    default:
      return '/';
  }
}

export function parsePathToRoute(pathname: string, search: string = ''): AppRoute {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const parts = cleanPath.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { view: 'home' };
  }

  const searchParams = new URLSearchParams(search);

  const section = parts[0].toLowerCase();
  const param = parts[1] ? decodeURIComponent(parts[1]) : undefined;

  switch (section) {
    case '404':
    case 'not-found':
      return { view: 'not-found', requestedPath: pathname };

    case 'file-extensions':
    case 'file-extension':
    case 'extension':
    case 'extensions': {
      if (param) {
        return { view: 'extension-detail', ext: param.toLowerCase() };
      }
      const categoryFilter = searchParams.get('category') || undefined;
      const letterFilter = searchParams.get('letter') || undefined;
      return { view: 'extensions', categoryFilter, letterFilter };
    }

    case 'how-to-open': {
      if (param) {
        return { view: 'how-to-open', ext: param.toLowerCase() };
      }
      const categoryFilter = searchParams.get('category') || undefined;
      return { view: 'how-to-open', categoryFilter };
    }

    case 'compare':
    case 'comparison':
    case 'comparisons': {
      if (param) {
        return { view: 'comparison-detail', slug: param.toLowerCase() };
      }
      const categoryFilter = searchParams.get('category') || undefined;
      return { view: 'compare-hub', categoryFilter };
    }

    case 'software': {
      if (param) {
        return { view: 'software-detail', id: param };
      }
      return { view: 'software' };
    }
    case 'converter':
    case 'converters': {
      if (param) {
        return { view: 'converter-detail', id: param };
      }
      return { view: 'converters' };
    }
    case 'analyzer':
    case 'file-analyzer': {
      if (param) {
        return { view: 'file-identifier-result', id: param };
      }
      return { view: 'file-identifier' };
    }
    case 'repair':
    case 'troubleshoot':
    case 'troubleshooting':
    case 'fix':
    case 'problem':
    case 'problems':
    case 'diagnose':
    case 'diagnostics': {
      if (param) {
        return { view: 'troubleshoot-guide', slug: param.toLowerCase() };
      }
      const categoryFilter = searchParams.get('category') || undefined;
      return { view: 'troubleshoot-hub', categoryFilter };
    }
    case 'security':
    case 'authority':
    case 'tech-authority':
    case 'file-security':
    case 'technical': {
      if (param) {
        return { view: 'technical-guide', slug: param.toLowerCase() };
      }
      const categoryFilter = searchParams.get('category') || undefined;
      return { view: 'security-hub', categoryFilter };
    }
    case 'tools':
    case 'tool': {
      if (parts[1] === 'analyzer' || parts[1] === 'file-analyzer' || parts[1] === 'file-identifier' || parts[1] === 'identifier') {
        if (parts[2] === 'result' && parts[3]) {
          return { view: 'file-identifier-result', id: decodeURIComponent(parts[3]) };
        }
        if (parts[2] && parts[2] !== 'result') {
          return { view: 'file-identifier-result', id: decodeURIComponent(parts[2]) };
        }
        return { view: 'file-identifier' };
      }
      if (parts[1] === 'metadata-viewer' || parts[1] === 'metadata') {
        if (parts[2] === 'result' && parts[3]) {
          return { view: 'metadata-result', id: decodeURIComponent(parts[3]) };
        }
        return { view: 'metadata-viewer' };
      }
      if (parts[1] === 'remove-metadata' || parts[1] === 'clean-metadata') {
        return { view: 'remove-metadata' };
      }
      if (parts[1] === 'hash-generator' || parts[1] === 'hash') {
        return { view: 'hash-generator' };
      }
      if (parts[1] === 'checksum-verifier' || parts[1] === 'checksum') {
        return { view: 'checksum-verifier' };
      }
      if (parts[1] === 'mime-checker' || parts[1] === 'mime') {
        const q = searchParams.get('q') || undefined;
        return { view: 'mime-checker', query: q };
      }
      if (parts[1] === 'magic-byte-detector' || parts[1] === 'magic-bytes' || parts[1] === 'signatures') {
        return { view: 'magic-byte-detector' };
      }
      const catLower = (parts[1] || '').toLowerCase();
      if (['image', 'images', 'document', 'documents', 'archive', 'archives', 'data', 'developer', 'security', 'audio', 'video'].includes(catLower)) {
        return { view: 'tools', categoryFilter: catLower };
      }
      if (param) {
        return { view: 'tool-detail', slug: param.toLowerCase() };
      }
      return { view: 'tools' };
    }
    case 'mime-types':
    case 'mime-type':
    case 'mime': {
      if (param) {
        return { view: 'mime-detail', mimeSlug: param };
      }
      return { view: 'mime-checker' };
    }
    case 'format':
    case 'formats':
    case 'format-guide':
    case 'format-guides': {
      if (param) {
        return { view: 'format-guide', format: param.toLowerCase() };
      }
      return { view: 'guides' };
    }
    case 'what-is': {
      if (param) {
        const cleanFormat = param.replace(/-file$/, '').replace(/^a-/, '');
        return { view: 'extension-detail', ext: cleanFormat.toLowerCase() };
      }
      return { view: 'guides' };
    }
    case 'resources':
    case 'resource':
    case 'guide':
    case 'guides': {
      if (param) {
        if (param.startsWith('what-is-a-') || param.startsWith('what-is-')) {
          const match = param.match(/^what-is-(?:a-)?([a-z0-9_-]+?)(?:-file)?$/i);
          if (match && match[1]) {
            return { view: 'extension-detail', ext: match[1].toLowerCase() };
          }
        }
        return { view: 'guide-detail', id: param };
      }
      return { view: 'guides' };
    }
    case 'blog': {
      if (param) {
        return { view: 'blog-post', id: param };
      }
      return { view: 'blog' };
    }
    case 'categories':
    case 'category': {
      if (param) {
        return { view: 'category-detail', id: param };
      }
      return { view: 'extensions' };
    }
    case 'hub':
    case 'hubs':
    case 'topic':
    case 'topics': {
      if (param) {
        return { view: 'content-hub', topic: param.toLowerCase() };
      }
      return { view: 'guides' };
    }
    case 'about':
      return { view: 'about' };
    case 'admin':
    case 'cms': {
      if (param === 'content' || param === 'authority') {
        return { view: 'content-dashboard' };
      }
      return { view: 'admin' };
    }
    case 'content-dashboard':
      return { view: 'content-dashboard' };
    case 'assistant':
    case 'ai':
      return { view: 'assistant' };
    case 'seo-audit':
    case 'seo':
      return { view: 'seo-audit' };
    case 'sitemaps':
    case 'sitemap':
      return { view: 'sitemaps' };
    case 'workflows':
    case 'workflow':
      return { view: 'workflows', workflowId: param };
    case 'contact':
      return { view: 'contact' };
    default: {
      if (section.startsWith('what-is-')) {
        const match = section.match(/^what-is-(?:a-)?([a-z0-9_-]+?)(?:-file)?$/i);
        if (match && match[1]) {
          return { view: 'extension-detail', ext: match[1].toLowerCase() };
        }
      }
      return { view: 'not-found', requestedPath: pathname };
    }
  }
}

