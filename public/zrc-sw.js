const ZRC_CACHE_NAME = 'zrc-portal-v427d';
const ZRC_CACHEABLE_DESTINATIONS = new Set(['script', 'style', 'image', 'font']);

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(ZRC_CACHE_NAME).then((cache) => cache.addAll(['/', '/manifest.json', '/zrc-logo.png']).catch(() => null)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('zrc-portal-') && key !== ZRC_CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin || requestUrl.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/')));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && ZRC_CACHEABLE_DESTINATIONS.has(request.destination)) {
          const cachedResponse = response.clone();
          event.waitUntil(caches.open(ZRC_CACHE_NAME).then((cache) => cache.put(request, cachedResponse)));
        }

        return response;
      })
      .catch(async () => (await caches.match(request)) || Response.error())
  );
});

self.addEventListener('push', (event) => {
  let payload = { title: 'ZRC', body: 'Yeni bildirimin var.' };
  try { payload = event.data ? event.data.json() : payload; } catch {}
  event.waitUntil(
    self.registration.showNotification(payload.title || 'ZRC', {
      body: payload.body || 'Yeni bildirimin var.',
      icon: '/zrc-logo.png',
      badge: '/zrc-logo.png',
      tag: payload.tag || 'zrc-portal-notification'
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
      return null;
    })
  );
});
