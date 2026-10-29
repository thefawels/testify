// Increment VERSION when publishing changed assets or icons.
const VERSION = 'v1';
// Scope-specific cache names keep other projects on the same GitHub domain intact.
const PREFIX = 'testify:' + self.registration.scope + ':';
const CACHE = PREFIX + VERSION;
const ASSETS = ['./', './index.html', './style.css', './app.js', './csv.js', './test-data.js', './analytics.js', './tap-guard.js', './manifest.webmanifest', './favicon-32.png', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png'].map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !ASSETS.includes(event.request.url)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && !response.redirected) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
    }
    return response;
  }).catch(async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    if (event.request.mode === 'navigate') {
      const page = await caches.match(new URL('./index.html', self.registration.scope).href);
      if (page) return page;
    }
    return Response.error();
  }));
});
