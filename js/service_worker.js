/*console.log('hello world');*/

// Set a name for the current cache
var staticCacheName = 'restaurant-stage1-v1'; 

// Default files to always cache
var cacheFiles = [
	'./',
	'./index.html',
	'./restaurant.html',
	'./js/main.js',
	'./js/dbhelper.js',
	'./js/restaurant_info.js',
	'./css/styles.css',
	'./data/restaurants.json',
	'./img/1.jpg',
	'./img/2.jpg',
	'./img/3.jpg',
	'./img/4.jpg',
	'./img/5.jpg',
	'./img/6.jpg',
	'./img/7.jpg',
	'./img/8.jpg',
	'./img/9.jpg',
];


self.addEventListener('install', function(event) {
    console.log('ServiceWorker Installed');
    event.waitUntil(
	    caches.open(staticCacheName).then(function(cache) {
			console.log('ServiceWorker Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	);
});


self.addEventListener('activate', function(event) {
    console.log('ServiceWorker Activated');

    event.waitUntil(

    	// Get all the cache keys (cacheName)
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName){
					return cacheName.startsWith('restaurant-')&& 
					cacheName != staticCacheName;
				}).map(function(cacheName) {
					// Delete that cached file
					console.log(' Removing Cached Files from Cache ', cacheName);
					return caches.delete(cacheName);
				})
			);
		})
	); 
});
self.addEventListener('fetch', function(event) {
	event.respondWith(
		//use the match method to determine if the event request url already exists within the cache 
		caches.match(event.request).then(function(response){
			if (response) {
				console.log(event.request,'found in cache');
				return response;
			}
			else {
				console.log(event.request,'Could not find in cache');
			    return fetch(event.request)
			    .then(function(response){
			    	//use clone here because response using twice
			    	const clonedRespons== response.clone();
			    	cache.open(staticCacheName).then(function(cache){
			    		cache.put(event.request,clonedRespons);
			    	})
			    	return response;
			    })
			    .catch(function(err){
			    	console.error(err);
			    });
		    }
		})
	);
}