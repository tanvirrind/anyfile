import { NextRequest, NextResponse } from 'next/server';

// Legacy MIME URLs used literal '+' characters. Rewrite them to the safe,
// catalog-backed -plus- slug while preserving the old URL through a redirect.
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
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
