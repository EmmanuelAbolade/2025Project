
// src/components/AdminMessages.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { Button, Form } from "react-bootstrap";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      msgs.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    try {
      await addDoc(collection(db, "messages"), { 
        content: newMessage,
        sender: "admin",
        // Using Firestore timestamp field is recommended; here we use JS Date for simplicity:
        timestamp: new Date()
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      <div style={{ maxHeight: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map(message => (
          <div key={message.id} style={{ marginBottom: "10px" }}>
            <strong>{message.sender}:</strong> {message.content}{" "}
            <em>({new Date(message.timestamp.seconds * 1000).toLocaleString()})</em>
          </div>
        ))}
      </div>
      <Form.Group className="mt-3">
        <Form.Control 
          as="textarea" 
          rows={3} 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Write a message..."
        />
      </Form.Group>
      <Button className="mt-2" variant="primary" onClick={handleSendMessage}>
        Send
      </Button>
    </div>
  );
};

export default AdminMessages;



/*
//comented 16/4/2025
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesSnapshot = await getDocs(collection(db, "messages"));
      const fetchedMessages = messagesSnapshot.docs.map(doc => doc.data());
      setMessages(fetchedMessages);
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      await addDoc(collection(db, "messages"), { content: newMessage, timestamp: new Date() });
      setMessages([...messages, { content: newMessage, timestamp: new Date() }]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{new Date(msg.timestamp).toLocaleString()}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Write a message..."
        className="form-control mb-3"
      ></textarea>
      <button className="btn btn-primary" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};

export default AdminMessages;
*/