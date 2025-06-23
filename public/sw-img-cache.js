const CACHE_NAME = 'all-image-cache-v1';

// Cài đặt xong, kích hoạt ngay
self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  self.skipWaiting();
});

// Kích hoạt xong, dọn cache cũ nếu có
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        }
      }))
    )
  );
});

// Intercept tất cả fetch request
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 🏷️ Chỉ cache file ảnh theo đuôi file
  if (url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cachedResponse => {
          if (cachedResponse) {
            console.log('[SW] Serve from cache:', url.pathname);
            return cachedResponse;
          }

          return fetch(request).then(networkResponse => {
            console.log('[SW] Caching new image:', url.pathname);
            cache.put(request, networkResponse.clone());
            return networkResponse;
          }).catch(err => {
            console.error('[SW] Fetch failed:', err);
            throw err;
          });
        })
      )
    );
  }
});
