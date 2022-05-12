const CACHE_NAME = 'static-v1'
const urlsToCache = ['index.html', 'offline.html']

const self = this

// Install SW
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
	)
})

// Activate the SW
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames
						.filter((cacheName) => cacheName !== CACHE_NAME)
						.map((cacheName) => caches.delete(cacheName))
				)
			)
	)
})

// Listen for requests
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches
			.match(event.request)
			.then(() =>
				fetch(event.request).catch(() => caches.match('offline.html'))
			)
	)
})

// Handle push notifications
self.addEventListener('push', (event) => {
	const data = event.data.json()

	self.registration.showNotification(data.title, {
		body: data.message,
		icon: './favicons/android-chrome-192x192.png',
		data: data.url,
	})
})

self.addEventListener('notificationclick', (event) => {
	const notification = event.notification

	notification.close()
	self.clients.openWindow(notification.data)
})
