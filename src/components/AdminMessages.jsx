
// src/components/AdminMessages.jsx


// src/components/AdminMessages.jsx
import React, { useState } from "react";
import { Container, Row, Col, ListGroup, Form, Button } from "react-bootstrap";

// Example data. In a real-world scenario, fetch these from Firestore.
const dummyConversations = [
  {
    id: "1",
    name: "Guest John",
    lastMessage: "Hello, I need a towel.",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    name: "Staff Mary",
    lastMessage: "I'll take care of it.",
    timestamp: "9:45 AM",
  },
];

const dummyMessages = {
  "1": [
    { id: "msg1", sender: "Guest John", content: "Hello, I need a towel.", timestamp: "10:30 AM" },
    { id: "msg2", sender: "Admin", content: "Hi John, I'm on it!", timestamp: "10:32 AM" },
  ],
  "2": [
    { id: "msg3", sender: "Staff Mary", content: "I'll take care of the request.", timestamp: "9:45 AM" },
    { id: "msg4", sender: "Admin", content: "Great, thank you Mary.", timestamp: "9:50 AM" },
  ],
};

const AdminMessages = () => {
  const [conversations] = useState(dummyConversations);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const handleConversationSelect = (conv) => {
    setSelectedConvId(conv.id);
    // Here you would fetch messages for the selected conversation.
    // We're using dummy data.
    setMessages(dummyMessages[conv.id] || []);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedConvId) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "Admin",
      content: newMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setNewMsg("");
    // In a real app, you'd also update Firestore here.
  };

  // Render conversation list on the left
  const renderConversationList = () => (
    <ListGroup>
      {conversations.map((conv) => (
        <ListGroup.Item
          key={conv.id}
          action
          active={conv.id === selectedConvId}
          onClick={() => handleConversationSelect(conv)}
        >
          <div>
            <strong>{conv.name}</strong>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#666" }}>{conv.lastMessage}</div>
          <div style={{ fontSize: "0.75rem", color: "#aaa" }}>{conv.timestamp}</div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );

  // Render messages on the right
  const renderMessages = () => (
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
              {msg.timestamp}
            </span>
          </div>
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  );

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={4}>
          <h3 style={{ marginBottom: "20px", color: "#2c3e50" }}>Conversations</h3>
          {renderConversationList()}
        </Col>
        <Col md={8}>
          {selectedConvId ? (
            <>
              <h4 style={{ marginBottom: "10px", color: "#2c3e50" }}>
                Chat with{" "}
                {
                  conversations.find((conv) => conv.id === selectedConvId)
                    ?.name
                }
              </h4>
              {renderMessages()}
              <Form onSubmit={handleSendMessage} className="mt-3 d-flex">
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
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