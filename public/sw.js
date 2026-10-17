/**
 * AnyFileX service worker — Phase 1 (installability).
 *
 * Strategy:
 *  - cache-first for versioned/hashed static assets, PWA icons, fonts
 *  - network-first for navigations, with a minimal offline fallback page
 *  - everything else passes through untouched
 *
 * Hard rules:
 *  - The ONLY POST requests ever intercepted are Web Share Target posts to
 *    /tools/file-identifier (all other non-GET requests pass through)
 *  - NEVER cache HTML responses (navigations always go to network first so
 *    guide/extension data baked in at build time never goes stale)
 *  - only same-origin requests are handled at all
 */

const CACHE_VERSION = 'anyfilex-v2';
const SHARE_CACHE = 'anyfilex-share-v1';
const PRECACHE = [
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const keep = new Set([CACHE_VERSION, SHARE_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !keep.has(key)).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

/**
 * Web Share Target handler (Phase 2).
 * The OS posts a shared file as multipart form data. The file is stashed in
 * Cache Storage under a generated id and the browser is redirected (303) to
 * the identifier page, which picks the file up and immediately deletes it.
 * The file NEVER touches the server — the POST is consumed here, in the SW.
 */
async function handleSharePost(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return Response.redirect('/tools/file-identifier', 303);
    }
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    const key = `/__share__/${id}`;
    const cache = await caches.open(SHARE_CACHE);
    await cache.put(
      new Request(key),
      new Response(file, {
        headers: {
          'x-share-filename': encodeURIComponent(file.name || 'shared-file'),
          'x-share-type': file.type || 'application/octet-stream',
        },
      })
    );
    return Response.redirect(`/tools/file-identifier?share=${encodeURIComponent(id)}`, 303);
  } catch {
    // Never strand the user on an error — the plain uploader is the fallback.
    return Response.redirect('/tools/file-identifier', 303);
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Rule 0: Web Share Target — the ONLY POST interception in this worker.
  // A shared file arrives as multipart POST from the OS; stash it in Cache
  // Storage and redirect to the identifier page. Every other POST passes
  // through untouched (no response, no side effects).
  if (req.method === 'POST') {
    const url = new URL(req.url);
    if (url.origin === self.location.origin && url.pathname === '/tools/file-identifier') {
      event.respondWith(handleSharePost(req));
    }
    return;
  }

  // Rule 1: only simple GET requests are ever intercepted beyond Rule 0.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Rule 2: cache-first for immutable assets (hashed Next chunks, PWA icons, fonts).
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/fonts/') ||
    /\.(?:woff2?|ttf|otf|eot)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(req).then(
          (hit) =>
            hit ||
            fetch(req).then((res) => {
              if (res.ok) cache.put(req, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  // Rule 3: network-first for navigations; offline fallback on failure.
  // HTML is never written to the cache.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.open(CACHE_VERSION).then((cache) => cache.match('/offline.html'))
      )
    );
    return;
  }

  // Rule 4: everything else (API-ish routes, locale JSON, uncached GETs)
  // passes through to the network untouched.
});
