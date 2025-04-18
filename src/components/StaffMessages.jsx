
// src/components/StaffMessages.jsx
import React from "react";
import ChatWindow from "./ChatWindow";

const StaffMessages = () => {
  return <ChatWindow currentUserId="staff" senderLabel="Staff" />;
};

export default StaffMessages;




/* //commented 18/4/2025 at 3.30pm
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, addDoc, query, orderBy } from "firebase/firestore";

const StaffMessages = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [replyToId, setReplyToId] = useState(null);

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

  const handleReply = async () => {
    try {
      if (!replyToId || !reply) return;

      await addDoc(collection(db, "messages"), {
        senderId: "staff",
        message: reply,
        replyTo: replyToId,
        timestamp: new Date(),
      });

      setReply("");
      setReplyToId(null);
      alert("Reply sent!");
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <div className="mt-5">
      <h3>Guest Messages</h3>
      <div className="border rounded p-3 mb-3" style={{ maxHeight: "400px", overflowY: "scroll" }}>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="mb-3">
              <p>
                <strong>{msg.senderId === "staff" ? "Staff" : "Guest"}:</strong> {msg.message}
              </p>
              {msg.replyTo && (
                <small className="text-muted">Replying to message ID: {msg.replyTo}</small>
              )}
              <small className="text-muted d-block">
                {new Date(msg.timestamp?.toDate()).toLocaleString()}
              </small>
              {msg.senderId !== "staff" && (
                <button
                  className="btn btn-sm btn-link text-primary"
                  onClick={() => setReplyToId(msg.id)}
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
      {replyToId && (
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder={`Replying to message ID: ${replyToId}`}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleReply}>
            Send Reply
          </button>
        </div>
      )}
    </div>
  );
};

export default StaffMessages;
*/