// Service Worker pro Discgolf Designer
// Strategie: app shell + runtime cache pro mapy
const APP_VERSION = 'v1.1.2';
const APP_CACHE = `discgolf-app-${APP_VERSION}`;
const TILE_CACHE = 'discgolf-tiles-v1';

// Soubory které tvoří aplikaci (app shell)
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

// Install: pre-cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(APP_SHELL).catch(err => {
        console.warn('Partial cache failure:', err);
        // Try individual to skip 404s
        return Promise.allSettled(APP_SHELL.map(u => cache.add(u)));
      }))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== APP_CACHE && k !== TILE_CACHE)
        .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: stale-while-revalidate pro shell, cache-first pro tiles
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isTile = /\/(MapServer\/tile|tile\.openstreetmap\.org|WMService\.aspx|wms\.asp)/.test(url.href);

  if (isTile) {
    // Cache-first pro mapové dlaždice (rychlé v terénu, šetří data)
    event.respondWith(
      caches.open(TILE_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(resp => {
            if (resp.ok) cache.put(event.request, resp.clone());
            return resp;
          }).catch(() => cached || new Response('', { status: 504 }));
        })
      )
    );
    return;
  }

  // Stale-while-revalidate pro shell soubory
  event.respondWith(
    caches.open(APP_CACHE).then(cache =>
      cache.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(resp => {
          if (resp.ok && (event.request.method === 'GET')) {
            cache.put(event.request, resp.clone()).catch(() => {});
          }
          return resp;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    )
  );
});
