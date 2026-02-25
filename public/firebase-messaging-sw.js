importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyBcv7anIkkK6nBdJ7YFuqjUze_CGc83ztM',
  authDomain: 'poojabook-8ba7f.firebaseapp.com',
  projectId: 'poojabook-8ba7f',
  storageBucket: 'poojabook-8ba7f.firebasestorage.app',
  messagingSenderId: '656611524011',
  appId: '1:656611524011:web:c4a722b2516e61ea6de6ee'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload)

  const notificationTitle = payload.notification?.title || 'PoojaBook'
  const notificationBody = payload.notification?.body || ''
  const notificationIcon = '/favicon.svg'
  const notificationData = payload.data || {}

  self.registration.showNotification(notificationTitle, {
    body: notificationBody,
    icon: notificationIcon,
    badge: '/favicon.svg',
    tag: 'poojabook-notification',
    renotify: true,
    data: notificationData,
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    const urlToOpen = event.notification.data?.url || '/'
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        if (windowClients.length > 0) {
          windowClients[0].focus()
          windowClients[0].navigate(urlToOpen)
        } else {
          clients.openWindow(urlToOpen)
        }
      })
    )
  }
})
