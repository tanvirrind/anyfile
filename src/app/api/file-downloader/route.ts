import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_REDIRECTS = 5;

const isPrivateIpv4 = (hostname: string) => {
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [first, second] = parts;
  return first === 10 || first === 127 || (first === 169 && second === 254) || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168);
};

const validateTarget = (value: string) => {
  const target = new URL(value);
  const hostname = target.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!['http:', 'https:'].includes(target.protocol)) throw new Error('Only HTTP and HTTPS links are supported.');
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '::1' || isPrivateIpv4(hostname)) {
    throw new Error('Private and local network addresses are not supported.');
  }
  return target;
};

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');
  if (!rawUrl) return NextResponse.json({ error: 'A file URL is required.' }, { status: 400 });

  try {
    let target = validateTarget(rawUrl);
    let upstream: Response | null = null;

    for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
      upstream = await fetch(target, {
        redirect: 'manual',
        headers: { 'user-agent': 'AnyFileX File Downloader' },
        signal: request.signal
      });

      if (![301, 302, 303, 307, 308].includes(upstream.status)) break;
      const location = upstream.headers.get('location');
      if (!location) break;
      if (redirectCount === MAX_REDIRECTS) throw new Error('The source redirected too many times.');
      target = validateTarget(new URL(location, target).toString());
    }

    if (!upstream || !upstream.ok || !upstream.body) {
      return NextResponse.json({ error: `The source returned HTTP ${upstream?.status || 502}.` }, { status: 502 });
    }

    const headers = new Headers();
    for (const name of ['content-type', 'content-disposition', 'content-length', 'etag', 'last-modified']) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    headers.set('cache-control', 'no-store');
    if (!headers.has('content-disposition')) headers.set('content-disposition', 'attachment');
    return new Response(upstream.body, { status: 200, headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The file could not be downloaded.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
