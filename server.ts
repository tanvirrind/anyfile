import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { buildDatabaseContext, extractSuggestedActions, generateLocalFallbackResponse } from './src/lib/assistant/knowledgeEngine';
import { getSegmentedSitemapXml } from './src/lib/seo/sitemapGenerator';
import { renderSsrPageHtml, isSearchEngineBot } from './src/lib/ssr/ssrRenderer';
import { getStaticRoutePaths } from './src/lib/ssr/staticGenerator';
import { resolveRouteMetadata } from './src/lib/ssr/routeMetadataResolver';
import { getCanonicalRedirect } from './src/lib/ssr/canonicalRedirects';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // 1. Canonical Host Redirection (anyfilex.com -> www.anyfilex.com)
  app.use((req, res, next) => {
    const rawHost = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().toLowerCase();
    const host = rawHost.split(':')[0]; // strip port if present
    if (host === 'anyfilex.com') {
      const search = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
      return res.redirect(301, `https://www.anyfilex.com${req.path}${search}`);
    }
    next();
  });

  // Global HTTP Headers for SEO, Crawlers, and Security
  app.use((req, res, next) => {
    const isAdminOrRestricted =
      req.path.startsWith('/admin') ||
      req.path.startsWith('/admin-cms') ||
      req.path.startsWith('/seo-audit');

    res.setHeader('X-Powered-By', 'AnyFileX-Engine');

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

  // Initialize Gemini AI Client (Lazy & Safe)
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini GenAI SDK initialized successfully.');
    } catch (err) {
      console.warn('Failed to initialize Gemini SDK:', err);
    }
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      ssrEngine: 'active',
      geminiAvailable: !!process.env.GEMINI_API_KEY,
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

  // AI Assistant Endpoint
  app.post('/api/assistant', async (req, res) => {
    const { message, fileContext } = req.body || {};
    const prompt = message || 'Hello';

    let promptContent = prompt;
    if (fileContext) {
      promptContent = `[ATTACHED FILE FOR ANALYSIS]:
FileName: ${fileContext.name}
FileSize: ${fileContext.size} bytes
MIME Type: ${fileContext.mimeType}
Magic Bytes Hex: ${fileContext.magicBytes || 'N/A'}

USER QUESTION:
${prompt}`;
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      console.log('No GEMINI_API_KEY found or AI uninitialized, returning local knowledge engine response.');
      const fallback = generateLocalFallbackResponse(prompt);
      return res.json({
        text: fallback.text,
        suggestedActions: fallback.suggestedActions,
        isFallback: true,
      });
    }

    try {
      const systemInstruction = buildDatabaseContext();

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptContent,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || 'I apologize, but I was unable to generate a response for that file format query.';
      const suggestedActions = extractSuggestedActions(prompt, responseText);

      return res.json({
        text: responseText,
        suggestedActions,
        isFallback: false,
      });
    } catch (error: any) {
      console.error('Error generating AI response via Gemini:', error);
      const fallback = generateLocalFallbackResponse(prompt);
      return res.json({
        text: `${fallback.text}\n\n*(Note: Generated via AnyFileX Local Knowledge Engine due to network fallback)*`,
        suggestedActions: fallback.suggestedActions,
        isFallback: true,
        error: error.message || 'Gemini API call error',
      });
    }
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
      if (url.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|ico|json|map|woff|woff2|ttf)$/)) {
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
      if (url.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|ico|json|map|woff|woff2|ttf)$/)) {
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
        return res.sendFile(indexPath);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AnyFileX server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();


