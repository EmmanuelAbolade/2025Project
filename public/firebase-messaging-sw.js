// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDg5WhdbhP0EMoNgFy_PEd41gZgnxKoCQ4",
  authDomain: "guestease-8a11c.firebaseapp.com",
  projectId: "guestease-8a11c",
  storageBucket: "guestease-8a11c.firebasestorage.app",
  messagingSenderId: "1047397018695",
  appId: "1:1047397018695:web:79178619ef016caa2c5562",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
