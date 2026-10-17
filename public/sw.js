/**
 * AnyFileX service worker — Phase 1 (installability).
 *
 * Strategy:
 *  - cache-first for versioned/hashed static assets, PWA icons, fonts
 *  - network-first for navigations, with a minimal offline fallback page
 *  - everything else passes through untouched
 *
 * Hard rules:
 *  - NEVER intercept non-GET requests (route handlers / form POSTs untouched)
 *  - NEVER cache HTML responses (navigations always go to network first so
 *    guide/extension data baked in at build time never goes stale)
 *  - only same-origin requests are handled at all
 */

const CACHE_VERSION = 'anyfilex-v1';
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
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Rule 1: only simple GET requests are ever intercepted.
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
