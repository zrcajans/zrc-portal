// zrc-v427c-pwa-import-fix
const ZRC_CACHE_NAME = 'zrc-portal-v427c';

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
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then((cached) => cached || caches.match('/'))));
});

self.addEventListener('push', (event) => {
  let payload = { title: 'ZRC Portal', body: 'Yeni bildirimin var.' };
  try { payload = event.data ? event.data.json() : payload; } catch {}
  event.waitUntil(
    self.registration.showNotification(payload.title || 'ZRC Portal', {
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
