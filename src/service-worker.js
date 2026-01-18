// Minimal SW - does not cache in dev, just registers for PWA installability
const CACHE_NAME = 'image3d-v3';

self.addEventListener('install', () => {
    self.skipWaiting();
    console.log('[SW] Installed (no-op)');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(
                names.map((name) => caches.delete(name))
            );
        }).then(() => {
            console.log('[SW] All caches cleared, claiming clients');
            return self.clients.claim();
        })
    );
});

// Pass-through: always fetch from network
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
