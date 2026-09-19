/**
 * AnyFileX Canonical URL & 301 Redirect Engine
 * Enforces unified, canonical URL hierarchies, normalizes casing,
 * and eliminates duplicate crawler routes without causing trailing-slash redirect loops.
 */

export function getCanonicalRedirect(pathname: string, search: string = ''): string | null {
  // Ignore static assets and API routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/@') ||
    pathname.startsWith('/src/') ||
    pathname.startsWith('/node_modules/') ||
    pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|ico|json|map|woff|woff2|ttf|xml|txt)$/i)
  ) {
    return null;
  }

  // Normalize path for route pattern analysis (stripping trailing slash for comparison only)
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/') {
    return null;
  }

  const lowerPath = normalized.toLowerCase();
  const parts = lowerPath.split('/').filter(Boolean);
  if (parts.length === 0) {
    return null;
  }

  const section = parts[0];
  const param = parts[1];
  let targetPath: string | null = null;

  // Route Aliases and Canonical Hierarchy Normalization (only for legacy/alternate paths)
  if (section.startsWith('what-is-')) {
    const match = section.match(/^what-is-(?:a-)?([a-z0-9_-]+?)(?:-file)?$/);
    if (match && match[1]) {
      targetPath = `/file-extensions/${match[1]}`;
    }
  } else if (section === 'what-is') {
    if (param) {
      const cleanFormat = param.replace(/-file$/, '').replace(/^a-/, '');
      targetPath = `/file-extensions/${cleanFormat}`;
    } else {
      targetPath = '/file-extensions';
    }
  } else if (section === 'extension' || section === 'extensions' || section === 'file-extension') {
    targetPath = param ? `/file-extensions/${param}` : '/file-extensions';
  } else if (section === 'converter') {
    targetPath = param ? `/converters/${param}` : '/converters';
  } else if (section === 'repair' || section === 'troubleshooting') {
    targetPath = param ? `/troubleshoot/${param}` : '/troubleshoot';
  } else if (section === 'resources' || section === 'resource') {
    targetPath = param ? `/guides/${param}` : '/guides';
  } else if (section === 'guide' && param) {
    targetPath = `/guides/${param}`;
  } else if (section === 'comparison' || section === 'comparisons') {
    targetPath = param ? `/compare/${param}` : '/compare';
  } else if (section === 'tool' && !param) {
    targetPath = '/tools';
  } else if (section === 'tool' && param) {
    targetPath = `/tools/${param}`;
  } else if (section === 'categories') {
    targetPath = param ? `/category/${param}` : '/file-extensions';
  } else if (section === 'mime-types' || section === 'mime') {
    targetPath = param ? `/mime-type/${param}` : '/tools/mime-checker';
  } else if (section === 'analyzer' || section === 'file-analyzer') {
    targetPath = param ? `/tools/file-identifier/result/${param}` : '/tools/file-identifier';
  } else if (section === 'tools' && (param === 'file-analyzer' || param === 'analyzer')) {
    const sub = parts[2] ? `/result/${parts[2]}` : '';
    targetPath = `/tools/file-identifier${sub}`;
  } else if (section === 'tech-authority' || section === 'file-security' || section === 'technical' || section === 'authority') {
    targetPath = param ? `/security/${param}` : '/security';
  } else if (section === 'format' || section === 'formats' || section === 'format-guide' || section === 'format-guides') {
    if (param) {
      targetPath = `/file-extensions/${param}`;
    } else {
      targetPath = '/guides';
    }
  }

  // Only redirect if targetPath is genuinely different from the current request
  if (targetPath) {
    const targetClean = targetPath.replace(/\/+$/, '');
    if (targetClean !== pathname) {
      return targetClean + search;
    }
  }

  // Trailing slash normalization for non-root paths (e.g. /file-extensions/heic/ -> /file-extensions/heic)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const stripped = pathname.replace(/\/+$/, '') || '/';
    if (stripped !== '/') {
      const pathWithoutPercent = stripped.replace(/%[0-9A-Fa-f]{2}/g, '');
      if (/[A-Z]/.test(pathWithoutPercent)) {
        const lower = stripped.replace(/%[0-9A-Fa-f]{2}|[A-Z]/g, (match) => {
          if (match.startsWith('%')) return match.toUpperCase();
          return match.toLowerCase();
        });
        return lower + search;
      }
      return stripped + search;
    }
  }

  // Casing normalization (e.g. /FILE-EXTENSIONS -> /file-extensions)
  // RFC 3986 specifies uppercase percent-encoded triplets (%2B); do not flag percent triplets as casing issues
  const pathWithoutPercent = pathname.replace(/%[0-9A-Fa-f]{2}/g, '');
  if (/[A-Z]/.test(pathWithoutPercent)) {
    const lower = pathname.replace(/%[0-9A-Fa-f]{2}|[A-Z]/g, (match) => {
      if (match.startsWith('%')) return match.toUpperCase();
      return match.toLowerCase();
    });
    if (lower !== pathname) {
      return lower + search;
    }
  }

  return null;
}

