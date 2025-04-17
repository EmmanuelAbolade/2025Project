// src/initializeFCM.js
import { isSupported,getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase/firebaseConfig"; // Note: use 'app', not firebaseApp

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
