import { NextRequest, NextResponse } from 'next/server';

// Legacy MIME URLs used literal '+' characters. Rewrite them to the safe,
// catalog-backed -plus- slug while preserving the old URL through a redirect.
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/mime-type/') && pathname.includes('+')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\+/g, '-plus-');
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/mime-type/:path*'] };
