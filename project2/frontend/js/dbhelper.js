/**
 * Common database helper functions.
 */



class DBHelper {

  static getDATA(fetchApi, callback) {
    const port = 1337;
    let apiUrl = `http://localhost:`;
    let options;
    fetch(apiUrl)
      .then(response => {
        console.log(`${apiUrl} fetched !`)

        const content = response.headers.get('content-type')
        if (content && content.indexOf('application/json') !== -1) {
          return response.json()
        } else {
          return 'API call successfull'
        }
      }, error => console.log(error))
      .then((data) => {
        callback(data)
      })
      .catch(error => console.error(error))

  }


  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */




  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static insertRestaurantsToDB(restaurants) {
    // If db exists or create one
    console.log('iserting to db' + restaurants);

    // const dbPromise = idb.open('restaurants', 1, (upgradeDB) => {
    //   const restaurantStore = upgradeDB.createObjectStore('restaurants', {
    //     keyPath: 'id'
    //   });
    // });

    // dbPromise.then(db => {
    //     let tx = db.transaction('restaurants');
    //     let store = tx.objectStore('restaurants');
    //     return store.getAll();
    //   })
    //   .then(restaurants => {
    //     if (restaurants && restaurants !== null) {
    //       console.log('indexDB got data!');
    //       // callback(null, restaurants);
    //       console.log(restaurants)
    //       const worker = new Worker('/js/idb-worker.js');
    //       worker.postMessage(restaurants);
    //       worker.onmessage = (e) => console.log(e.data);
    //     }
    //   })
  }


  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    console.log(`Fetching restaurants as ${DBHelper.DATABASE_URL}`)
    fetch(DBHelper.DATABASE_URL, {
        method: 'GET'
      })
      .then(response => callback(response))
      .then(response => response = response.json())
      .then(res => console.log(res))
      .catch(err => {
        // Fetch from indexdb incase network is not available
        // DBHelper.getDATA().then(restaurants => {
        //   console.log("Restaurants: ", restaurants)
        //   callback(null, restaurants)
        // })
      });
  }

  static fetchRestaurantsFromClient() {
    console.log('fetching from local IDB!')
    if (!('indexedDB' in window)) {
      console.log('no db')
      return null;
    }
    const dbPromise = idb.open('restaurants', 1, (upgradeDB) => {
      const restaurantStore = upgradeDB.createObjectStore('restaurants', {
        keyPath: 'id'
      });
    });
    dbPromise.then(db => {
        console.log(db)
        let tx = db.transaction('restaurants');
        let store = tx.objectStore('restaurants');
        return store.getAll();
      })
      .then(restaurants => {
        console.log('indexDB got data!');
        callback(null, restaurants);
        DBHelper.fetchRestaurants((restaurants) => {
          console.log(restaurants)
          const worker = new Worker('js/idb-worker.js');
          worker.postMessage(restaurants);
          worker.onmessage = (e) => console.log(e.data);
        });

      })
    // return DBHelper.openDB().then(db => {
    //   return db.transaction('restaurants')
    //     .objectStore('restaurants').get(parseInt(id));
    // }).then(restaurant => {
    //   return restaurant;
    // });
  }


  /**
   * Fetch a restaurant by its ID.
   */

  static fetchRestaurantById(id, callback) {
    fetch(`${apiUrl}${port}/restaurants/${id}`)
      .then(response => response.json())
      .then(restaurant => callback(null, restaurant))
      .catch(err => {
        console.log(err)
        // Fetch from indexdb incase network is not available
        DBHelper.fetchRestaurantsByIdFromClient(id)
          .then(restaurant => callback(null, restaurant))
      });
  }

  static fetchRestaurantsByIdFromClient(id) {
    console.log('fetching from local IDB!')
    if (!('indexedDB' in window)) {
      console.log('no db')
      return null;
    }
    const worker = new Worker('./idb-worker.js');
    worker.postMessage()
    // return DBHelper.openDB().then(db => {
    //   return db.transaction('restaurants')
    //     .objectStore('restaurants').get(parseInt(id));
    // }).then(restaurant => {
    //   return restaurant
    // }).catch(err => console.log(err))
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    console.log('fetch by cuisine')
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants(restaurants => {
      if (error) {
        callback(error, null)
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine)
        callback(null, results)
      }
    })
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    console.log('fetch by neighborhood')
    // Fetch all restaurants
    DBHelper.fetchRestaurants(restaurants => {
      if (error) {
        callback(error, null)
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood)
        callback(null, results)
      }
    })
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    console.log('fetch by cuisine and neighborhood')
    // Fetch all restaurants
    DBHelper.fetchRestaurants(restaurants => {
      if (error) {
        callback(error, null)
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine)
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood)
        }
        callback(null, results)
      }
    })
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants(restaurants => {
      if (error) {
        callback(error, null)
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods)
      }
    })
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants(restaurants => {
      if (error) {
        callback(error, null)
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines)
      }
    })
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`)
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/imgs/${restaurant.photograph}.jpg`)
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    })
    return marker
  }

}