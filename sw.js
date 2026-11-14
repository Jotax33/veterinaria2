// Service worker: deja la app disponible sin internet.
// Si cambias index.html, sube el número de VERSION para que los teléfonos descarguen la versión nueva.
const VERSION = 'veterinaria-v16';
const ARCHIVOS = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Solo se encarga de los archivos de la app y del código de Firebase (versionado). Lo demás (datos, inicio de sesión) pasa directo.
  const u = new URL(e.request.url);
  const propio = u.origin === location.origin;
  const sdk = u.origin === 'https://www.gstatic.com' && u.pathname.startsWith('/firebasejs/');
  if (!propio && !sdk) return;
  e.respondWith(
    caches.match(e.request).then((guardado) => {
      if (guardado) return guardado;
      return fetch(e.request)
        .then((resp) => {
          if (resp && resp.ok) {
            const copia = resp.clone();
            caches.open(VERSION).then((c) => c.put(e.request, copia));
          }
          return resp;
        })
        .catch(() => (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined));
    })
  );
});
