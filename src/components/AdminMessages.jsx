// src/components/AdminMessages.jsx
import React from "react";
import ChatWindow from "./ChatWindow";

const AdminMessages = () => {
  return <ChatWindow currentUserId="admin" senderLabel="Admin" />;
};

export default AdminMessages;















































/* commented 17/4/2025 at 10:50pm
// src/components/AdminMessages.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Form, Button } from "react-bootstrap";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getMessaging, onMessage } from "firebase/messaging";

// Make sure you have correctly initialized Firebase Cloud Messaging 
// and integrated a service worker (firebase-messaging-sw.js) for notifications.

const AdminMessages = () => {
  // List of conversations (these should include the name of the correspondent).
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  // Messages in the currently selected conversation.
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Use onSnapshot to subscribe to real-time updates for conversations.
  useEffect(() => {
    // Assuming you store conversations in a collection "conversations"
    // Each document could have properties like: name, lastMessage, etc.
    const convQuery = query(collection(db, "conversations"));
    const unsubscribeConvs = onSnapshot(convQuery, snapshot => {
      const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConversations(convs);
    });
    return () => unsubscribeConvs();
  }, []);

  // Subscribe in real time to messages in the selected conversation.
  useEffect(() => {
    if (selectedConv) {
      const messagesRef = collection(db, "conversations", selectedConv.id, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
      const unsubscribeMsgs = onSnapshot(messagesQuery, snapshot => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      });
      return () => unsubscribeMsgs();
    }
  }, [selectedConv]);

  // FCM in-app notification listener:
  useEffect(() => {
    const messaging = getMessaging();
    // Listen for foreground messages.
    onMessage(messaging, (payload) => {
      console.log("New FCM message: ", payload);
      // Display a browser notification (requires permission).
      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon,
        });
      }
      // Optionally, update your UI or refresh conversation lists.
    });
  }, []);

  const handleConversationSelect = (conv) => {
    setSelectedConv(conv);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;
    // Add a new message to the selected conversation's messages subcollection.
    const messagesRef = collection(db, "conversations", selectedConv.id, "messages");
    await addDoc(messagesRef, {
      sender: "Admin", // or use the current admin's name/ID
      content: newMessage,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
    // Firestore's onSnapshot will auto-update the messages list.
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={4}>
          <h3 style={{ marginBottom: "20px", color: "#2c3e50" }}>Conversations</h3>
          <ListGroup>
            {conversations.map(conv => (
              <ListGroup.Item
                key={conv.id}
                action
                active={conv.id === (selectedConv && selectedConv.id)}
                onClick={() => handleConversationSelect(conv)}
              >
                <div>
                  <strong>{conv.name}</strong>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  {conv.lastMessage || "No messages yet..."}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8}>
          {selectedConv ? (
            <>
              <h4 style={{ marginBottom: "10px", color: "#2c3e50" }}>
                Chat with {selectedConv.name}
              </h4>
              <div
                style={{
                  height: "400px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#fbfbfb",
                }}
              >
                {messages.map((msg) => (
                  <div key={msg.id} style={{ marginBottom: "15px" }}>
                    <div style={{ fontWeight: "bold" }}>
                      {msg.sender}{" "}
                      <span style={{ fontWeight: "normal", fontSize: "0.8rem", color: "#aaa" }}>
                        {msg.timestamp && new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div>{msg.content}</div>
                  </div>
                ))}
              </div>
              <Form onSubmit={handleSendMessage} className="mt-3 d-flex">
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button variant="primary" className="ms-2">
                  Send
                </Button>
              </Form>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#888", marginTop: "50px" }}>
              <h4>Select a conversation to start messaging.</h4>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminMessages;

/*
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