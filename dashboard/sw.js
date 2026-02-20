// sw.js - Service Worker para notificaciones
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activado');
  return self.clients.claim();
});

// Escuchar mensajes desde la app
self.addEventListener('message', event => {
  if (event.data.type === 'NOTIFICAR') {
    self.registration.showNotification(event.data.titulo, {
      body: event.data.mensaje,
      icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png',
      vibrate: [200, 100, 200]
    });
  }
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
