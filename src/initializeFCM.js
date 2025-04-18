// src/initializeFCM.js

import { isSupported, getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase/firebaseConfig";

// Set your VAPID Public Key here
const vapidKey =
  "BJLwNvgz_4GQojx8UHb2UXNKiPx7vVvoqVCVcGLQL2fcaRlwlPE-oiMx1GN8pemvVnORc3zi9B8pta3QK1eNlgo";

// Register the service worker using the correct base path
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      // Get the current base path; when your app is served at http://localhost:3000/2025Project,
      // window.location.pathname will be "/2025Project"
      const basePath = window.location.pathname;
      // Build the URL to the service worker file.
      const swUrl = `${basePath}/firebase-messaging-sw.js`;
      const registration = await navigator.serviceWorker.register(swUrl);
      console.log('Service Worker registration successful with scope: ', registration.scope);
      return registration;
    } catch (err) {
      console.error('Service Worker registration failed: ', err);
      throw err;
    }
  } else {
    throw new Error("Service workers are not supported by this browser.");
  }
}

export const initializeFCM = async () => {
  try {
    // Check if Firebase messaging is supported in this browser
    if (!await isSupported()) {
      console.log("Firebase Messaging is not supported on this browser.");
      return;
    }

    // First, register the service worker and get its registration
    const swRegistration = await registerServiceWorker();

    // Request browser notification permissions
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permission not granted for notifications");
      return;
    }

    const messaging = getMessaging(app);
    
    // Retrieve the FCM token using your VAPID key, and pass in the service worker registration.
    const currentToken = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swRegistration,
    });
    
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      // Optionally, send this token to your backend.
    } else {
      console.log("No registration token available.");
    }
  } catch (error) {
    console.error("Error retrieving token: ", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!navigator.serviceWorker) {
      console.log("Service workers are not supported by this browser.");
      return;
    }
  
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });







/*
// src/initializeFCM.js
import { isSupported,getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase/firebaseConfig"; // Note: use 'app', not firebaseApp


// Use the current path as the base for the service worker URL.
const basePath = window.location.pathname; // e.g., "/2025Project"
const swUrl = `${basePath}/firebase-messaging-sw.js`;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(swUrl)
    .then((registration) => {
      console.log('Service Worker registration successful with scope: ', registration.scope);
    })
    .catch((err) => {
      console.error('Service Worker registration failed: ', err);
    });
}



// Set your VAPID Public Key here
const vapidKey =
  "BJLwNvgz_4GQojx8UHb2UXNKiPx7vVvoqVCVcGLQL2fcaRlwlPE-oiMx1GN8pemvVnORc3zi9B8pta3QK1eNlgo";

export const initializeFCM = async () => {
  try {
    // Check if Firebase messaging is supported in this browser
    if (!await isSupported()) {
      console.log("Firebase Messaging is not supported on this browser.");
      return;
    }

    const messaging = getMessaging(app); // Use 'app' here
    // Request browser notification permissions
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permission not granted for notifications");
      return;
    }
    
    // Retrieve the FCM token using your VAPID key.
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      // Optionally, send this token to your backend.
    } else {
      console.log("No registration token available.");
    }
  } catch (error) {
    console.error("Error retrieving token: ", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!navigator.serviceWorker) {
      console.log("Service workers are not supported by this browser.");
      return;
    }
  
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
*/