import fs from 'fs';
import path from 'path';
import { getStaticRoutePaths, generateStaticHtmlForRoute } from '../src/lib/ssr/staticGenerator';

async function prerenderSite() {
  console.log('🚀 Starting AnyFileX Static Prerendering (SSG)...');
  const distDir = path.resolve(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html not found. Run `vite build` first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  const routes = getStaticRoutePaths();
  console.log(`📦 Prerendering ${routes.length} static routes...`);

  let count = 0;
  for (const route of routes) {
    try {
      const { html, statusCode } = generateStaticHtmlForRoute(route, templateHtml);
      const cleanRoute = route === '/' ? '/index' : route;
      const targetDir = path.join(distDir, cleanRoute);
      
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
      count++;
    } catch (err) {
      console.warn(`⚠️ Warning: Failed to prerender ${route}:`, err);
    }
  }

  console.log(`✅ Successfully prerendered ${count} static HTML routes into dist/`);
}

prerenderSite();
