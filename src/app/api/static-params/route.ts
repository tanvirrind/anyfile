import { NextResponse } from 'next/server';
import { buildRouteManifest } from '@/lib/routes/routeManifest';

export async function GET() {
  const manifest = buildRouteManifest();
  const routes = manifest.map((m) => m.path);

  return NextResponse.json({
    totalStaticRoutes: routes.length,
    routes,
  });
}
