import { NextRequest, NextResponse } from 'next/server';
import { resolveRouteMetadata } from '@/lib/ssr/routeMetadataResolver';
import { isSearchEngineBot } from '@/lib/ssr/ssrRenderer';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const routePath = url.searchParams.get('path') || '/';
  const userAgent = req.headers.get('user-agent') || '';
  const isBot = isSearchEngineBot(userAgent);
  const meta = resolveRouteMetadata(routePath);

  return NextResponse.json({
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
    prerenderEngine: 'Next.js App Router (AnyFileX-Engine-v3)',
  });
}
