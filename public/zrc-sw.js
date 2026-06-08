const ZRC_CACHE_NAME = 'zrc-portal-v291-safe-cache';
const ZRC_CORE_ASSETS = [
  '/manifest.webmanifest',
  '/zrc-app-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(ZRC_CACHE_NAME)
      .then((cache) => cache.addAll(ZRC_CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith('zrc-portal-') && cacheName !== ZRC_CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'ZRC_SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (!isSameOrigin) return;

  // HTML sayfa, JS ve CSS dosyaları her zaman ağdan gelsin.
  // Böylece eski sürüm takılması / beyaz ekran / yenileme döngüsü riski azalır.
  if (
    request.mode === 'navigate' ||
    requestUrl.pathname.endsWith('.js') ||
    requestUrl.pathname.endsWith('.css') ||
    requestUrl.pathname.includes('/assets/')
  ) {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cachedResponse) => {
          return cachedResponse || new Response('ZRC Portal çevrimdışı. İnternet bağlantısını kontrol et.', {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        })
      )
    );
    return;
  }

  // Sadece ikon/manifest gibi küçük PWA kimlik dosyalarını cache kullanarak aç.
  if (ZRC_CORE_ASSETS.includes(requestUrl.pathname)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((networkResponse) => {
          const responseCopy = networkResponse.clone();

          caches.open(ZRC_CACHE_NAME).then((cache) => {
            cache.put(request, responseCopy);
          });

          return networkResponse;
        });
      })
    );
  }
});
