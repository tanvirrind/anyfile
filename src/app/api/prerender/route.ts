import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL, getRouteManifestEntry } from '@/lib/routes/routeManifest';

const BOT_MARKERS = ['bot', 'spider', 'crawler', 'slurp', 'google-extended', 'chatgpt-user'];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const routePath = url.searchParams.get('path') || '/';
  const userAgent = req.headers.get('user-agent') || '';
  const entry = getRouteManifestEntry(routePath);
  const isBot = BOT_MARKERS.some((marker) => userAgent.toLowerCase().includes(marker));
  const statusCode = entry ? 200 : 404;
  const title = entry?.title || 'Page Not Found | AnyFileX';
  const description = entry?.description || 'The requested AnyFileX page could not be found.';
  const canonicalUrl = entry?.canonicalUrl || `${BASE_URL}${routePath}`;

  return NextResponse.json({
    path: routePath,
    statusCode,
    title,
    description,
    canonicalUrl,
    robots: entry?.isIndexable ? 'index, follow' : 'noindex, nofollow',
    ogType: 'website',
    ogImage: `${BASE_URL}/og-image.png`,
    breadcrumbsCount: entry ? 1 : 0,
    schemaEntities: entry ? ['WebPage'] : [],
    isBotDetected: isBot,
    prerenderEngine: 'Next.js App Router (AnyFileX-Engine-v3)',
  });
}
