import { resolveRouteMetadata } from './routeMetadataResolver';

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
  'twitterbot',
  'facebookexternalhit',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'whatsapp',
  'telegrambot',
  'discordbot',
  'applebot',
  'duckduckbot',
  // SEO & Auditing Crawlers
  'screaming frog',
  'screamingfrogseospider',
  'ahrefsbot',
  'semrushbot',
  'sitebulb',
  'dotbot',
  'mj12bot',
  // AI Search & Answer Engine Crawlers
  'gptbot',
  'chatgpt-user',
  'oai-searchbot',
  'claudebot',
  'claude-web',
  'anthropic-ai',
  'perplexitybot',
  'cohere-ai',
  'bytespider',
  'ccbot',
  'diffbot',
  'google-extended',
  'meta-externalagent',
  'amazonbot',
  'ia_archiver',
];

export function isSearchEngineBot(userAgent?: string): boolean {
  if (!userAgent) return false;
  const lower = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => lower.includes(bot));
}

/**
 * Master SSR Page Renderer:
 * Injects accurate dynamic <title>, <meta description>, canonical link,
 * OpenGraph, Twitter tags, Schema JSON-LD, prerendered semantic HTML,
 * and initial client route state into the base HTML template.
 */
export function renderSsrPageHtml(
  pathname: string,
  templateHtml: string,
  search: string = ''
): { html: string; statusCode: number } {
  const meta = resolveRouteMetadata(pathname, search);

  let output = templateHtml;

  // 1. Replace Document Title
  output = output.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);

  // 2. Replace Meta Description
  if (output.includes('<meta name="description"')) {
    output = output.replace(
      /<meta\s+name="description"\s+content="[^"]*"/i,
      `<meta name="description" content="${escapeAttr(meta.description)}"`
    );
  }

  // 3. Replace or Inject Canonical Link
  const canonicalTag = `<link rel="canonical" href="${meta.canonicalUrl}" />`;
  if (output.includes('<link rel="canonical"')) {
    output = output.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, canonicalTag);
  } else {
    output = output.replace('</head>', `    ${canonicalTag}\n  </head>`);
  }

  // 4. Update Robots Directive
  if (output.includes('<meta name="robots"')) {
    output = output.replace(
      /<meta\s+name="robots"\s+content="[^"]*"/i,
      `<meta name="robots" content="${escapeAttr(meta.robots)}"`
    );
  }

  // 5. Update Open Graph Meta Tags
  output = replaceOrInsertMeta(output, 'property', 'og:title', meta.title);
  output = replaceOrInsertMeta(output, 'property', 'og:description', meta.description);
  output = replaceOrInsertMeta(output, 'property', 'og:url', meta.canonicalUrl);
  output = replaceOrInsertMeta(output, 'property', 'og:type', meta.ogType);
  output = replaceOrInsertMeta(output, 'property', 'og:image', meta.ogImage);
  output = replaceOrInsertMeta(output, 'property', 'og:image:alt', meta.ogImageAlt);

  // 6. Update Twitter Card Tags
  output = replaceOrInsertMeta(output, 'name', 'twitter:title', meta.title);
  output = replaceOrInsertMeta(output, 'name', 'twitter:description', meta.description);
  output = replaceOrInsertMeta(output, 'name', 'twitter:image', meta.ogImage);
  output = replaceOrInsertMeta(output, 'name', 'twitter:image:alt', meta.ogImageAlt);

  // 7. Inject Updated Schema.org JSON-LD Graph
  const schemaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': meta.schemaGraph,
  }, null, 2);

  const schemaScriptTag = `<script type="application/ld+json" id="anyfilex-jsonld-schema">\n${schemaJson}\n    </script>`;
  if (output.includes('<script type="application/ld+json"')) {
    output = output.replace(
      /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i,
      schemaScriptTag
    );
  } else {
    output = output.replace('</head>', `    ${schemaScriptTag}\n  </head>`);
  }

  // 8. Inject Initial Route State for seamless client hydration
  const initialStateScript = `<script id="__ANYFILEX_INITIAL_STATE__">window.__INITIAL_ROUTE__ = ${JSON.stringify(meta.route)};</script>`;

  // 9. Inject Pre-rendered Semantic HTML Body into #root
  const fullBodyHtml = buildSsrPageShell(meta.prerenderedHtml);
  const renderedRoot = `<div id="root">${fullBodyHtml}</div>\n    ${initialStateScript}`;
  output = output.replace(/<div id="root"><\/div>/i, renderedRoot);

  return {
    html: output,
    statusCode: meta.statusCode,
  };
}

/**
 * Builds a complete, crawlable SSR semantic HTML layout shell
 * with standard global header navigation and global footer navigation.
 * This guarantees that every SSR page (including deep pages) exposes
 * the site's complete internal link graph to web crawlers.
 */
function buildSsrPageShell(contentHtml: string): string {
  return `
    <div class="anyfilex-ssr-wrapper min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <!-- Universal Crawlable SSR Header -->
      <header class="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div class="flex items-center gap-8">
            <a href="/" class="flex items-center gap-2.5 font-heading font-extrabold text-xl text-slate-900 dark:text-white" id="ssr-nav-logo">
              <span class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">X</span>
              <span>AnyFile<span class="text-blue-600 dark:text-blue-400">X</span></span>
            </a>
            <nav aria-label="Primary Navigation" class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="/file-extensions" class="hover:text-blue-600 dark:hover:text-blue-400" id="ssr-nav-extensions">Extensions</a>
              <a href="/converters" class="hover:text-blue-600 dark:hover:text-blue-400" id="ssr-nav-converters">Converters</a>
              <a href="/tools" class="hover:text-blue-600 dark:hover:text-blue-400" id="ssr-nav-tools">Tools</a>
              <a href="/how-to-open" class="hover:text-blue-600 dark:hover:text-blue-400" id="ssr-nav-how-to-open">How to Open</a>
              <a href="/compare" class="hover:text-blue-600 dark:hover:text-blue-400" id="ssr-nav-compare">Compare</a>
              <a href="/troubleshoot" class="hover:text-blue-600 dark:hover:text-blue-400" id="ssr-nav-troubleshoot">Troubleshoot</a>
              <a href="/software" class="hover:text-blue-600 dark:hover:text-blue-400" id="ssr-nav-software">Software</a>
              <a href="/guides" class="hover:text-blue-600 dark:hover:text-blue-400" id="ssr-nav-guides">Guides</a>
            </nav>
          </div>
          <div class="flex items-center gap-3 text-xs font-semibold">
            <a href="/tools/file-identifier" class="hidden sm:inline-block px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800" id="ssr-nav-quick-identifier">Identify File</a>
            <a href="/converters" class="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700" id="ssr-nav-quick-convert">Open Converter</a>
          </div>
        </div>
      </header>

      <!-- Main Semantic Content Body -->
      <main class="flex-1 anyfilex-ssr-main" id="main-content">
        ${contentHtml}
      </main>

      <!-- Universal Crawlable SSR Footer -->
      <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 shrink-0 text-xs" id="ssr-footer">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8 text-left">
            <div class="col-span-2 space-y-3">
              <a href="/" class="text-white font-heading font-extrabold text-lg flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">X</span>
                <span>AnyFileX</span>
              </a>
              <p class="max-w-sm text-slate-400 leading-relaxed">
                Universal digital file format intelligence platform. Inspect binary magic bytes, open obscure formats, convert files client-side, and resolve file corruption.
              </p>
            </div>
            <div>
              <h3 class="font-bold text-white uppercase tracking-wider mb-3 text-xs">Popular Formats</h3>
              <ul class="space-y-2">
                <li><a href="/file-extensions/heic" class="hover:text-white">.HEIC Format Guide</a></li>
                <li><a href="/file-extensions/dwg" class="hover:text-white">.DWG Format Guide</a></li>
                <li><a href="/file-extensions/pdf" class="hover:text-white">.PDF Format Guide</a></li>
                <li><a href="/file-extensions/psd" class="hover:text-white">.PSD Format Guide</a></li>
                <li><a href="/file-extensions/step" class="hover:text-white">.STEP Format Guide</a></li>
                <li><a href="/file-extensions/webp" class="hover:text-white">.WEBP Format Guide</a></li>
                <li><a href="/file-extensions/zip" class="hover:text-white">.ZIP Format Guide</a></li>
                <li><a href="/file-extensions/docx" class="hover:text-white">.DOCX Format Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold text-white uppercase tracking-wider mb-3 text-xs">Online Utilities</h3>
              <ul class="space-y-2">
                <li><a href="/tools/file-identifier" class="hover:text-white">Magic Byte Identifier</a></li>
                <li><a href="/tools/metadata-viewer" class="hover:text-white">EXIF & File Metadata Viewer</a></li>
                <li><a href="/tools/remove-metadata" class="hover:text-white">Remove Metadata Privacy</a></li>
                <li><a href="/tools/hash-generator" class="hover:text-white">File Hash Generator (SHA256)</a></li>
                <li><a href="/tools/checksum-verifier" class="hover:text-white">Checksum Verifier</a></li>
                <li><a href="/tools/mime-checker" class="hover:text-white">MIME Type Checker</a></li>
                <li><a href="/tools/magic-byte-detector" class="hover:text-white">Magic Byte Detector</a></li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold text-white uppercase tracking-wider mb-3 text-xs">Directories & Guides</h3>
              <ul class="space-y-2">
                <li><a href="/converters" class="hover:text-white">File Converters Directory</a></li>
                <li><a href="/how-to-open" class="hover:text-white">How-To-Open Hub</a></li>
                <li><a href="/compare" class="hover:text-white">Format Comparisons</a></li>
                <li><a href="/troubleshoot" class="hover:text-white">Corrupt File Repair</a></li>
                <li><a href="/software" class="hover:text-white">Software Compatibility</a></li>
                <li><a href="/guides" class="hover:text-white">Engineering Guides</a></li>
                <li><a href="/sitemaps" class="hover:text-white">HTML Sitemaps Index</a></li>
                <li><a href="/sitemap.xml" class="hover:text-white">XML Master Sitemap</a></li>
              </ul>
            </div>
          </div>
          <div class="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
            <p>&copy; ${new Date().getFullYear()} AnyFileX. All rights reserved. 100% In-Memory Private Processing.</p>
            <div class="flex items-center gap-4">
              <a href="/about" class="hover:text-slate-400">About</a>
              <a href="/contact" class="hover:text-slate-400">Contact</a>
              <a href="/sitemaps" class="hover:text-slate-400">Sitemaps</a>
              <a href="/security" class="hover:text-slate-400">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;
}

function replaceOrInsertMeta(
  html: string,
  keyAttr: 'name' | 'property',
  keyVal: string,
  contentVal: string
): string {
  const regex = new RegExp(`<meta\\s+${keyAttr}="${keyVal}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
  const replacement = `<meta ${keyAttr}="${keyVal}" content="${escapeAttr(contentVal)}" />`;

  if (regex.test(html)) {
    return html.replace(regex, replacement);
  }
  return html.replace('</head>', `    ${replacement}\n  </head>`);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
