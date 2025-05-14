self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('static-v1').then(cache => {
      return cache.addAll([
        '/',               // Root page
        '/index.html',     // Main HTML file
        '/frontend/src/styles/styles.css',      // Stylesheet
        '/frontend/src/app.js',         // JavaScript to register the service worker
        '/frontend/src/pages/offline.html',   // Fallback page for offline mode
        '/frontend/assets/icons/app icon/512x512.png'    // Icon used in manifest (just one here as example)
      ]);
    })
  );
});

// This event runs every time a request is made (HTML, CSS, image, etc.)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request)
        .catch(() => caches.match('/frontend/src/pages/offline.html'));
    })
  );
});