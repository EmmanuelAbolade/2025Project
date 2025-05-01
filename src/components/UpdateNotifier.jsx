import React, { useEffect, useState } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { auth } from "../firebase/firebaseConfig";
import { Alert } from "react-bootstrap";

const UpdateNotifier = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const messaging = getMessaging();

    //  Listen for incoming messages (notifications)
    onMessage(messaging, (payload) => {
      console.log("Notification received:", payload);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
    });
  }, []);

  return (
    <div>
      {notification && (
        <Alert variant="info">
          <strong>{notification.title}</strong>: {notification.body}
        </Alert>
      )}
    </div>
  );
};

export default UpdateNotifier;
