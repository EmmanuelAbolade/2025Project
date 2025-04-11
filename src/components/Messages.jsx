import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { auth } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null); // To reply to specific staff

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User is not authenticated");

      const messageData = {
        senderId: user.uid,
        message: newMessage,
        timestamp: new Date(),
      };

      // Add reply-to functionality if necessary
      if (replyTo) {
        messageData.replyTo = replyTo;
      }

      await addDoc(collection(db, "messages"), messageData);
      setNewMessage(""); // Clear input field after sending
      setReplyTo(null); // Clear reply state
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="mt-5">
      <h3>Messages</h3>
      <div className="border rounded p-3 mb-3" style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <div className="d-flex align-items-center mb-1">
                {/* Display Avatar or Initials */}
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", marginRight: "10px" }}
                >
                  {msg.senderId === auth.currentUser?.uid ? "You" : msg.senderInitials || "S"}
                </div>
                <strong>{msg.senderId === auth.currentUser?.uid ? "You" : "Staff"}:</strong>
              </div>
              <p className="mb-1">{msg.message || "Message not available"}</p>
              <small className="text-muted">
              {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleString() : "Timestamp missing"}
              </small>
              {msg.replyTo && (
                <small className="text-muted">Replying to message ID: {msg.replyTo}</small>
              )}
              <small className="text-muted">{new Date(msg.timestamp?.toDate()).toLocaleString()}</small>
              {/* Reply Button */}
              {msg.senderId !== auth.currentUser?.uid && (
                <button
                  className="btn btn-sm btn-link text-primary"
                  onClick={() => setReplyTo(msg.id)}
                >
                  Reply
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={replyTo ? `Replying to ID: ${replyTo}` : "Type your message..."}
          aria-label="Message input field"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSendMessage}>
          {replyTo ? "Send Reply" : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Messages;
