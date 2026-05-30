const SW_VERSION = '20260526-fix-29';

self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(cacheKey => caches.delete(cacheKey)));
        await self.clients.claim();
    })());
});

self.addEventListener('message', event => {
    if (event.data !== 'CLEAR_CACHES') return;
    event.waitUntil((async () => {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(cacheKey => caches.delete(cacheKey)));
    })());
});

self.addEventListener('fetch', () => {
    // Keep network responses uncached so updated index.html is always used.
});
