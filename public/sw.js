const CACHE_NAME = "eagle-pass-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE_RESOURCES = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/vite.svg",
  OFFLINE_URL,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_RESOURCES)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL)),
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request)),
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(handleSync());
  }
});

async function handleSync() {
  console.log("Background sync triggered");
}
