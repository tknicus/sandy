const CACHE_NAME = 'rs-shop-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json'
];

// 1. I-install ug i-save ang mga files sa device
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Pag-intercept sa network requests (Offline First)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // I-return ang naka-save nga file kung offline, o mag-fetch sa internet kung online
        return response || fetch(event.request);
      })
  );
});