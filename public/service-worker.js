self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('static-v1').then(cache => {
      return cache.addAll([
        '/',               // Root page
        '/index.html',     // Main HTML file
        '/src/styles/styles.css',      // Stylesheet
        '/src/app.js',         // JavaScript to register the service worker
        '/src/pages/offline.html',   // Fallback page for offline mode
        '/assets/icons/app icon/512x512.png'    // Icon used in manifest (just one here as example)
      ]);
    })
  );
});

// This event runs every time a request is made (HTML, CSS, image, etc.)
/*self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request)
        .catch(() => caches.match('/src/pages/offline.html'));
    })
  );
});*/
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/src/pages/offline.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request))
    );
  }
});