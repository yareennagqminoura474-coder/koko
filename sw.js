const SW_VERSION = '20260530-fix-33';
const CACHE_NAME = `koko-cache-${SW_VERSION}`;

self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
                return undefined;
            }))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('message', event => {
    if (event.data !== 'CLEAR_CACHES') return;
    event.waitUntil((async () => {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(cacheKey => caches.delete(cacheKey)));
    })());
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    const isIndexRequest =
        event.request.mode === 'navigate' ||
        url.pathname.endsWith('/') ||
        url.pathname.endsWith('/index.html');

    if (!isIndexRequest) return;

    event.respondWith(fetch(event.request, { cache: 'reload' }));
});
