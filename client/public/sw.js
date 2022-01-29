// Service worker setup: check https://developers.google.com/web/fundamentals/primers/service-workers
// source : https://qiita.com/TakeshiNickOsanai/items/8d012a128827c9db980d
// Currently not used; it is not registered

const NAME = 'Team-NaCom';
const VERSION = '1.0.0';
const CACHE_NAME = `${ NAME } v${ VERSION }`;

const urlsToCache = [
  '/index.html',
  '/favicon.ico',
  '/logo.png',
  '/editor-manual.md',
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
            if (!CACHE_NAME.includes(key)) {
                return caches.delete(key);
            }
            })
        )).then(() => {
            console.log(CACHE_NAME + ' activated');
        })
    );
});
