const cacheVersion = 'v1';
const cacheData = [
    './',
    'sw.js',
    './index.html',
    './restaurant.html',
    './data/restaurants.json',
    './css/styles.css',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './js/app.js',
    'imgs/1.jpg',
    'imgs/2.jpg',
    'imgs/3.jpg',
    'imgs/4.jpg',
    'imgs/5.jpg',
    'imgs/6.jpg',
    'imgs/7.jpg',
    'imgs/8.jpg',
    'imgs/9.jpg',
    'imgs/10.jpg',
    './restaurant.html?id=1',
    './restaurant.html?id=2',
    './restaurant.html?id=3',
    './restaurant.html?id=4',
    './restaurant.html?id=5',
    './restaurant.html?id=6',
    './restaurant.html?id=7',
    './restaurant.html?id=8',
    './restaurant.html?id=9',
    './restaurant.html?id=10'
];


//installing the service worker
self.addEventListener('install', (event) => {
    console.log('Service Worker Installed');
    event.waitUntil(caches.open(cacheVersion)
        .then((cache) => {
            return cache.addAll(cacheData);
        })
    )
});

//activating the service worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker Activated');
    event.waitUntil(
        caches.keys().then((cacheVersions) => {
            //looping through everything in the cache
            return Promise.all(cacheVersions.map((thiscacheVersion) => {

                if (thiscacheVersion !== cacheVersion) {
                    console.log('Removing the old cache');

                    return caches.delete(thiscacheVersion);
                }
            }))
        }).catch(error => console.log(error))
    );
});

self.addEventListener('fetch', (event) => {
    console.log('Fetch SW')
    event.respondWith(caches.match(event.request)
        .then((response) => {
            if (response && response !== undefined) return response;
            return fetch(event.request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(cacheVersion)
                        .then(cache => cache.put(event.request, responseClone))
                        .catch(err => console.log(err))
                    return response;
                })
        }).catch(err => console.log(err))
    );
});