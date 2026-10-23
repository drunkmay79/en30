/* Service worker English 30. Версия подставляется сборкой: новая версия — новый кеш,
   старые кеши удаляются при активации. Приложение — один HTML-файл, поэтому
   стратегия простая: всё из кеша, навигация всегда отдаёт index.html.

   Предзагрузка идёт по адресам с ?v=версия: так ни браузерный кеш, ни CDN GitHub Pages
   (у каждого файла свой 10-минутный кеш) не подсунут старую копию. Дополнительно проверяем,
   что скачанный index.html той же версии, что и этот скрипт: если CDN ещё не обновился,
   установка откладывается до следующей проверки обновлений. */
const VERSION = '__VER__';
const CACHE = 'en30-' + VERSION;
const ASSETS = [
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon-180.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil((async function () {
    const cache = await caches.open(CACHE);
    for (const url of ASSETS) {
      const res = await fetch(url + '?v=' + encodeURIComponent(VERSION), { cache: 'reload' });
      if (!res.ok) throw new Error('precache failed: ' + url + ' ' + res.status);
      if (url === './index.html') {
        const txt = await res.clone().text();
        if (txt.indexOf("APP_VERSION = '" + VERSION + "'") < 0) throw new Error('index.html is not version ' + VERSION + ' yet');
        await cache.put('./', res.clone());
      }
      await cache.put(url, res);
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf('en30-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(function (r) { return r || fetch(req); }));
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (r) { return r || fetch(req); })
  );
});
