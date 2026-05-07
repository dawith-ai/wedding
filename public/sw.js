/* Wedding Invitation Service Worker
 * Strategy:
 *   - Precache the app shell (HTML/CSS/JS/icons) on install.
 *   - Network-first for HTML (so users get the latest), cache fallback offline.
 *   - Stale-while-revalidate for everything else (assets, fonts, image CDNs).
 *   - Bypass non-GET requests entirely.
 *
 * Cache name is bumped via the embedded build id; update the constant on
 * each release so old caches drop automatically.
 */

const VERSION = 'wedding-v2.0.0';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
  './icons/apple-touch-icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isHtmlRequest(request) {
  if (request.mode === 'navigate') return true;
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

async function networkFirst(request, cacheName) {
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, fresh.clone()).catch(() => {});
    }
    return fresh;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const shellFallback = await caches.match('./index.html');
    if (shellFallback) return shellFallback;
    return new Response('오프라인입니다. 네트워크를 다시 확인해주세요.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((res) => {
      if (res && res.ok) cache.put(request, res.clone()).catch(() => {});
      return res;
    })
    .catch(() => null);
  return cached || (await networkPromise) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin POST endpoints (Imgur upload, Firebase REST writes).
  // We only cache safe GETs from same-origin or known asset CDNs.
  const isSameOrigin = url.origin === self.location.origin;
  const isFontCdn =
    url.hostname.endsWith('fonts.googleapis.com') ||
    url.hostname.endsWith('fonts.gstatic.com');
  const isImageCdn =
    url.hostname.endsWith('imgur.com') ||
    url.hostname === 'i.imgur.com' ||
    url.hostname === 'images.unsplash.com' ||
    url.hostname === 'api.qrserver.com';

  if (!isSameOrigin && !isFontCdn && !isImageCdn) {
    return;
  }

  if (isSameOrigin && isHtmlRequest(request)) {
    event.respondWith(networkFirst(request, SHELL_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
