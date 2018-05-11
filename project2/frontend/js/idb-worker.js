importScripts('idb.js');

onmessage = (e) => {

    console.log('Worker IDB: Checking for changes');

    let restaurants = e.data;

    let dbPromise = idb.open('restaurants', 1, (upgradeDB) => {
        let restaurantStore = upgradeDB.createObjectStore('restaurants', {
            keyPath: 'id'
        });
        restaurantStore.createIndex('by-cuisine', 'cuisine_type');
        restaurantStore.createIndex('by-neighborhood', 'neighborhood');
    });

    dbPromise.then((db) => {
        let tx = db.transaction('restaurants', 'readwrite');
        let store = tx.objectStore('restaurants');
        restaurants.forEach(restaurant => {
            store.get(restaurant.id).then(idbRestaurant => {
                if (JSON.stringify(restaurant) !== JSON.stringify(idbRestaurant)) {
                    store.put(restaurant)
                        .then((restaurant) => console.log('Worker IDB: Restaurant updated', restaurant));
                }
            });
        });
    });

    postMessage('Worker IDB: Restaurants checked');
}