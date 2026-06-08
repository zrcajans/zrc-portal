const ZRC_CACHE_NAME = 'zrc-portal-v288';
const ZRC_CORE_ASSETS = [
  '/',
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

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedHome = await caches.match('/');
        return cachedHome || new Response('ZRC Portal çevrimdışı. İnternet bağlantısını kontrol et.', {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
    );
    return;
  }

  if (!isSameOrigin) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        const responseCopy = networkResponse.clone();

        caches.open(ZRC_CACHE_NAME).then((cache) => {
          cache.put(request, responseCopy);
        });

        return networkResponse;
      });
    })
  );
});
