// Check if the browser supports service workers
if ('serviceWorker' in navigator) {

  // Try to register the service worker file
  navigator.serviceWorker.register('/public/service-worker.js')

    // If successful, log a confirmation message in the console
    .then(() => console.log('Service Worker registered'))

    // If there's an error, log it in the console
    .catch(err => console.error('SW registration failed', err));
}
