const CACHE_NAME = 'parseit-v8'; // BOMBA ATÓMICA: v8 para limpiar todo
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/vendor/choices.min.js',
  '/vendor/choices.min.css',
  '/vendor/confetti.browser.min.js'
];

// Instalación: Cachear activos básicos
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 PWA: Cacheando activos estáticos...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activación: Limpieza agresiva de caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('🗑️ PWA: Borrando cache antiguo:', key);
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});

// Mensajes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch: Estrategia Network-First con Cache Busting
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. SI TIENE QUERY PARAMETERS (Cache Busting), NO USAR CACHE DEL SW
  // Esto obliga a ir a la red (Cloudflare)
  if (url.search.includes('v=')) {
    event.respondWith(fetch(request));
    return;
  }

  // 2. Catálogo y API (Network-First)
  if (url.pathname.includes('/catalog.json') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 3. Solo cachear nuestro dominio
  if (url.origin !== self.location.origin) {
    return;
  }

  // 4. Index.html (Network-First)
  if (url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 5. Assets estáticos (Cache-First)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
