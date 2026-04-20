const CACHE_NAME = 'parseit-v2';
// Solo cacheamos lo que es ESTÁTICO y no cambia de nombre con Vite
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/vendor/choices.min.js',
  '/vendor/choices.min.css',
  '/vendor/confetti.browser.min.js',
  '/data/catalog.json'
];

// Instalación: Cachear archivos básicos que no cambian de nombre
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 PWA: Cacheando activos estáticos...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activación: Limpieza
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch: Estrategia Network-First con Fallback a Caché
// Esto es ideal porque Vite cambia los nombres de los archivos JS/CSS
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Si hay red, guardamos la copia fresca en el caché
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Si no hay red (Offline), buscamos en el caché
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          // Si no hay nada en caché, error
          return new Response('⚠️ Contenido no disponible sin conexión.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
      })
  );
});
