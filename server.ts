import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { generateLocalFallbackResponse } from './src/lib/assistant/knowledgeEngine';
import { getSegmentedSitemapXml } from './src/lib/seo/sitemapGenerator';
import { renderSsrPageHtml, isSearchEngineBot } from './src/lib/ssr/ssrRenderer';
import { getStaticRoutePaths } from './src/lib/ssr/staticGenerator';
import { resolveRouteMetadata } from './src/lib/ssr/routeMetadataResolver';
import { getCanonicalRedirect } from './src/lib/ssr/canonicalRedirects';
import compression from 'compression';

dotenv.config();

// Content-Security-Policy, grounded against the actual SSR output (inspected 2026-09-20):
// inline gtag bootstrap + __INITIAL_ROUTE__ hydration script + JSON-LD, plus Google
// Fonts / Tag Manager / GA4 are the only external origins. No external images are
// hot-linked (all https:// URLs in src are anchor hrefs or JSON-LD, not subresources).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "media-src 'self' data: blob:",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "worker-src 'self' blob:",
].join('; ');

// Simple in-memory per-IP rate limiter (no external dependency).
// Keys on the client IP; returns 429 once `max` requests hit within `windowMs`.
function apiRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
      .toString().split(',')[0].trim();
    const now = Date.now();
    const entry = hits.get(ip);
    if (entry && now < entry.resetAt && entry.count >= max) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    if (!entry || now >= entry.resetAt) {
      hits.set(ip, { count: 0, resetAt: now + windowMs });
    }
    hits.get(ip)!.count += 1;
    next();
  };
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');

  // gzip/brotli compression for all compressible text responses (HTML, XML, JSON, JS, CSS).
  app.use(compression());
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // 1. Canonical Host Redirection (www host -> anyfilex.com)
  app.use((req, res, next) => {
    const rawHost = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().toLowerCase();
    const host = rawHost.split(':')[0]; // strip port if present
    if (host.startsWith('www.') && host.slice(4) === 'anyfilex.com') {
      const search = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
      return res.redirect(301, `https://anyfilex.com${req.path}${search}`);
    }
    next();
  });

  // Global HTTP Headers for SEO, Crawlers, and Security
  app.use((req, res, next) => {
    const isAdminOrRestricted =
      req.path.startsWith('/admin') ||
      req.path.startsWith('/admin-cms') ||
      req.path.startsWith('/seo-audit');

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Content-Security-Policy', CSP);
    }

    if (isAdminOrRestricted) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
    }

    // Response header interception: Ensure non-200 responses send noindex, nofollow regardless of path
    const originalWriteHead = res.writeHead.bind(res);
    res.writeHead = function (statusCode: any, ...args: any[]) {
      const code = (typeof statusCode === 'number' ? statusCode : res.statusCode) || 200;
      if (isAdminOrRestricted) {
        res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
      } else if (code !== 200) {
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      } else {
        res.setHeader('X-Robots-Tag', 'index, follow, max-image-preview:large');
      }
      return (originalWriteHead as any)(statusCode, ...args);
    };

    next();
  });

  // 301 Canonical URL Normalization and Redirect Middleware
  app.use((req, res, next) => {
    const search = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
    const redirectUrl = getCanonicalRedirect(req.path, search);
    if (redirectUrl) {
      return res.redirect(301, redirectUrl);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      ssrEngine: 'active',
      timestamp: new Date().toISOString(),
    });
  });

  // SSR Diagnostic & Prerender Inspector Endpoint
  app.get('/api/prerender', (req, res) => {
    const routePath = (req.query.path as string) || '/';
    const userAgent = req.headers['user-agent'] || '';
    const isBot = isSearchEngineBot(userAgent);
    const meta = resolveRouteMetadata(routePath);
    
    res.json({
      path: routePath,
      statusCode: meta.statusCode,
      title: meta.title,
      description: meta.description,
      canonicalUrl: meta.canonicalUrl,
      robots: meta.robots,
      ogType: meta.ogType,
      ogImage: meta.ogImage,
      breadcrumbsCount: meta.breadcrumbs.length,
      schemaEntities: meta.schemaGraph.map((s) => s['@type']),
      isBotDetected: isBot,
      prerenderEngine: 'AnyFileX-Universal-SSR-v2',
    });
  });

  // Static Params List
  app.get('/api/static-params', (req, res) => {
    const routes = getStaticRoutePaths();
    res.json({
      totalStaticRoutes: routes.length,
      routes,
    });
  });

  // XML Sitemap Endpoints
  app.get(['/sitemap.xml', '/sitemap_index.xml', '/sitemap-index.xml'], (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.send(getSegmentedSitemapXml('index'));
  });

  app.get('/sitemap-:segment.xml', (req, res) => {
    const { segment } = req.params;
    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.send(getSegmentedSitemapXml(segment));
  });

  // AI Assistant Endpoint (graceful rate-limiting + input-capped)
  function assistantRateLimiter(max: number, windowMs: number) {
    const hits = new Map<string, { count: number; resetAt: number }>();
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
        .toString().split(',')[0].trim();
      const now = Date.now();
      const entry = hits.get(ip);
      if (entry && now < entry.resetAt && entry.count >= max) {
        const body = req.body || {};
        const prompt = typeof body.message === 'string' ? body.message.trim() : 'Hello';
        const fallback = generateLocalFallbackResponse(prompt);
        res.setHeader('Retry-After', '60');
        return res.json({
          text: `${fallback.text}\n\n*(Note: High request volume detected. Answered instantly via AnyFileX offline knowledge engine.)*`,
          suggestedActions: fallback.suggestedActions,
          isFallback: true,
          rateLimitExceeded: true,
        });
      }
      if (!entry || now >= entry.resetAt) {
        hits.set(ip, { count: 0, resetAt: now + windowMs });
      }
      hits.get(ip)!.count += 1;
      next();
    };
  }

  const assistantLimiter = assistantRateLimiter(150, 15 * 60 * 1000); // 150 req / 15 min / IP

  app.post('/api/assistant', assistantLimiter, async (req, res) => {
    const body = req.body || {};
    const rawMessage: unknown = body.message;
    const message =
      typeof rawMessage === 'string'
        ? rawMessage.trim()
        : rawMessage === null || rawMessage === undefined
          ? ''
          : String(rawMessage);

    if (message.length > 4000) {
      return res.status(400).json({ error: 'Message too long (max 4000 characters).' });
    }

    const prompt = message || 'Hello';

    const fallback = generateLocalFallbackResponse(prompt);
    return res.json({
      text: fallback.text,
      suggestedActions: fallback.suggestedActions,
      isFallback: true,
    });
  });

  // Serve static assets from public directory
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  // Vite middleware in development vs Static serving in production with SSR
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    // Development SSR Handler
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (
        url.startsWith('/@') ||
        url.startsWith('/src/') ||
        url.startsWith('/node_modules/') ||
        url.match(/\.(js|jsx|ts|tsx|mjs|cjs|css|svg|png|jpg|jpeg|gif|webp|ico|json|map|woff|woff2|ttf|wasm)$/i)
      ) {
        return next();
      }
      try {
        const rawTemplate = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        const template = await vite.transformIndexHtml(url, rawTemplate);
        const search = url.includes('?') ? url.slice(url.indexOf('?')) : '';
        const { html, statusCode } = renderSsrPageHtml(req.path, template, search);

        res.status(statusCode);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Rendered-By', 'AnyFileX-SSR-Engine-Dev');
        const isAdmin = req.path.startsWith('/admin') || req.path.startsWith('/admin-cms') || req.path.startsWith('/seo-audit');
        if (isAdmin) {
          res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
        } else if (statusCode !== 200) {
          res.setHeader('X-Robots-Tag', 'noindex, nofollow');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
        }
        return res.send(html);
      } catch (err: any) {
        console.error('SSR Dev Error:', err);
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    let cachedTemplate = '';
    try {
      if (fs.existsSync(indexPath)) {
        cachedTemplate = fs.readFileSync(indexPath, 'utf-8');
      }
    } catch (e) {
      console.warn('Could not preload dist/index.html:', e);
    }

    app.use(express.static(distPath, {
      index: false,
      redirect: false,
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));

    // Production SSR / Prerender Handler
    app.get('*', (req, res, next) => {
      const url = req.originalUrl;
      // Skip static files with extensions if static middleware missed them
      if (url.match(/\.(js|jsx|ts|tsx|mjs|cjs|css|svg|png|jpg|jpeg|gif|webp|ico|json|map|woff|woff2|ttf|wasm)$/i)) {
        return next();
      }

      try {
        const template = cachedTemplate || fs.readFileSync(indexPath, 'utf-8');
        const isBot = isSearchEngineBot(req.headers['user-agent']);
        const search = url.includes('?') ? url.slice(url.indexOf('?')) : '';
        const { html, statusCode } = renderSsrPageHtml(req.path, template, search);

        res.status(statusCode);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Rendered-By', 'AnyFileX-SSR-Engine-Prod');
        const isAdmin = req.path.startsWith('/admin') || req.path.startsWith('/admin-cms') || req.path.startsWith('/seo-audit');
        if (isAdmin) {
          res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
        } else if (statusCode !== 200) {
          res.setHeader('X-Robots-Tag', 'noindex, nofollow');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
        }
        if (isBot || req.headers['x-prerender-token'] || req.headers['x-prerendered']) {
          res.setHeader('X-Prerendered', '1');
        }
        return res.send(html);
      } catch (err: any) {
        console.error('SSR Prod Error:', err);
        // Surface a real 500 instead of silently serving the blank SPA shell with a 200
        // (which hid errors from monitoring and let crawlers index empty pages).
        res.status(500);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        return res.send(
          '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
          '<meta name="robots" content="noindex, nofollow"><title>500 — Server Error</title></head>' +
          '<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;color:#0f172a">' +
          '<h1>500 — Internal Server Error</h1>' +
          '<p>Something went wrong while rendering this page. Please try again shortly.</p>' +
          '</body></html>'
        );
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AnyFileX server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
