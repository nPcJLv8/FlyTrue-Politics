// Deliberately does nothing but pass requests through to the network.
// Its only job is to exist and be registered — Chrome's fuller "Install app"
// flow (the one that actually uses your logo instead of a generic icon)
// checks for a registered service worker, on top of the manifest.
// No caching here on purpose: your page always loads fresh, no stale-version surprises.
self.addEventListener('fetch', function () {
  // Intentionally empty — let every request go to the network as normal.
});
