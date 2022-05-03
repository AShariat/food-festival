const APP_PREFIX = "FoodFest-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

// We can't hardcode an absolute path if we want this to work in development and production, because this page will be hosted at the github.io/projectname subroute. Instead, we'll use relative paths. Note that we didn't include the images in assets. This was intentional. Every browser has a cache limit, which can range anywhere from 50 MB to 250 MB. We've prioritized caching the JavaScript and HTML files so that the site is at least functional.
const FILES_TO_CACHE = [
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  "./dist/app.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js",
];

// Respond with cached resources
self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        // if cache is available, respond with cache
        console.log("responding with cache : " + e.request.url);
        return request;
      } else {
        // if there are no cache, try fetching request
        console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  );
});

// Why don't we use window.addEventListener instead of self? Well, service workers run before the window object has even been created. So instead we use the self keyword to instantiate listeners on the service worker. The context of self here refers to the service worker object.
self.addEventListener("install", function (e) {
  // We use e.waitUntil to tell the browser to wait until the work is complete before terminating the service worker. This ensures that the service worker doesn't move on from the installing phase until it's finished executing all of its code.
  e.waitUntil(
    // We use caches.open to find the specific cache by name, then add every file in the FILES_TO_CACHE array to the cache.
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Delete outdated caches
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create keeplist
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      // add current cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
