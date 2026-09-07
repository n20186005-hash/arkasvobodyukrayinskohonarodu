/* Service Worker - Arka Svobody Ukrayinsʹkoho Narodu (static site) */
const VERSION = 'arkasvobody-v3';
const ASSET_CACHE = 'arkasvobody-assets-v3';
const CORE_ASSETS = [
  '/manifest.webmanifest',
  '/icons/favicon-32.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(ASSET_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key.startsWith('arkasvobody-') && key !== ASSET_CACHE).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // 只处理同源请求（不拦截 Google Maps / GA / 字体等第三方）
  if (url.origin !== self.location.origin) return;

  // 页面导航：网络优先，失败回退缓存
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          // 静态托管会把默认首页保存为不同路径名，逐一尝试
          for (const fallback of ['/ru.html', '/ru/', '/ru']) {
            const hit = await caches.match(fallback);
            if (hit) return hit;
          }
          return undefined;
        })
    );
    return;
  }

  // 天气接口：网络优先（服务端 30 分钟自动刷新，不能被缓存优先策略锁死），离线回退最近一次
  if (url.pathname === '/api/weather') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || Response.error())
    );
    return;
  }

  // 静态资源：缓存优先，后台更新
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
