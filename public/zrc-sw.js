const ZRC_SW_VERSION = 'v316-safe-pwa';
const ZRC_CACHE_NAME = `zrc-portal-core-${ZRC_SW_VERSION}`;

const ZRC_CORE_ASSETS = [
  '/manifest.webmanifest',
  '/zrc-favicon-32.png',
  '/zrc-favicon-192.png',
  '/zrc-apple-touch-icon.png',
  '/zrc-app-icon.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches
      .open(ZRC_CACHE_NAME)
      .then((cache) => cache.addAll(ZRC_CORE_ASSETS).catch(() => null))
      .catch(() => null)
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key.startsWith('zrc-portal-') && key !== ZRC_CACHE_NAME) {
              return caches.delete(key);
            }

            return Promise.resolve();
          })
        )
      )
      .finally(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (url.searchParams.get('zrc-reset-pwa') === '1') return;

  const isCoreAsset = ZRC_CORE_ASSETS.includes(url.pathname);

  if (!isCoreAsset) {
    return;
  }

  event.respondWith(
    caches.open(ZRC_CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);

      const networkPromise = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            cache.put(request, response.clone());
          }

          return response;
        })
        .catch(() => cached);

      return cached || networkPromise;
    })
  );
});
