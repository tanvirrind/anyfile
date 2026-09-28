import { NextRequest, NextResponse } from 'next/server';

// Legacy MIME URLs used literal '+' characters. Rewrite them to the safe,
// catalog-backed -plus- slug while preserving the old URL through a redirect.
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const forwardedHost = request.headers.get('x-forwarded-host');
  const requestHost = forwardedHost || request.headers.get('host') || request.nextUrl.hostname;
  const hostname = requestHost.split(',')[0].trim().split(':')[0].toLowerCase();

  // Keep one canonical origin for search engines and users. Preserve the
  // complete path and query string when moving the legacy www host.
  if (hostname === 'www.anyfilex.com') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.hostname = 'anyfilex.com';
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  const locale = pathname === '/nl' || pathname.startsWith('/nl/') ? 'nl' : pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en';
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-next-intl-locale', locale);

  if (locale !== 'en') {
    const url = request.nextUrl.clone();
    const localePrefix = `/${locale}`;
    url.pathname = pathname === localePrefix ? '/' : pathname.slice(localePrefix.length) || '/';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  if (pathname.startsWith('/mime-type/') && pathname.includes('+')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\+/g, '-plus-');
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // MIME slugs legitimately contain dots (for example
  // `image/vnd.adobe.photoshop`). Locale-prefixed routes must still pass
  // through Proxy even when they look like asset paths.
  matcher: ['/es/:path*', '/nl/:path*', '/((?!api|_next|.*\\..*).*)'],
};
