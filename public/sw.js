const ZRC_CACHE_NAME = 'zrc-is-takip-cache-v150';
const ZRC_STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/zrc-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ZRC_CACHE_NAME)
      .then((cache) => cache.addAll(ZRC_STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== ZRC_CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;
  if (request.url.includes('/auth/v1/') || request.url.includes('/rest/v1/') || request.url.includes('/storage/v1/')) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clonedResponse = response.clone();

        caches.open(ZRC_CACHE_NAME).then((cache) => {
          cache.put(request, clonedResponse);
        });

        return response;
      })
      .catch(() => caches.match(request).then((cachedResponse) => cachedResponse || caches.match('/')))
  );
});
