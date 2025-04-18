// src/components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, ListGroup, Form, Button, Spinner } from "react-bootstrap";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getMessaging, onMessage } from "firebase/messaging";

// Props:
// currentUserId: The authenticated user's id (used in the query and to filter conversations)
// senderLabel: A string to indicate the sender when posting messages ("Admin", "Staff", or "Guest")
const ChatWindow = ({ currentUserId, senderLabel }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // Load only conversations that include the current user.
  useEffect(() => {
    const convQuery = query(
      collection(db, "conversations"),
      where("members", "array-contains", currentUserId)
    );
    const unsubscribeConvs = onSnapshot(convQuery, (snapshot) => {
      const convs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setConversations(convs);
    });
    return () => unsubscribeConvs();
  }, [currentUserId]);

  // Load messages for the selected conversation.
  useEffect(() => {
    if (selectedConv) {
      setLoadingMessages(true);
      const messagesRef = collection(db, "conversations", selectedConv.id, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
      const unsubscribeMsgs = onSnapshot(messagesQuery, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
        setLoadingMessages(false);
      });
      return () => unsubscribeMsgs();
    } else {
      setMessages([]);
    }
  }, [selectedConv]);

  // Auto-scroll to the bottom when messages update.
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Setup FCM foreground listener.
  useEffect(() => {
    const messaging = getMessaging();
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
    onMessage(messaging, (payload) => {
      console.log("New FCM message: ", payload);
      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon,
        });
      }
    });
  }, []);

  const handleConversationSelect = (conv) => {
    setSelectedConv(conv);
  };

  // When sending a message, use the senderLabel passed via props.
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;
    const messagesRef = collection(db, "conversations", selectedConv.id, "messages");
    try {
      await addDoc(messagesRef, {
        sender: senderLabel, // <-- value comes from props (Admin, Staff, or Guest)
        content: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={4}>
          <h3 style={{ marginBottom: "20px", color: "#2c3e50" }}>Conversations</h3>
          <ListGroup>
            {conversations.map((conv) => (
              <ListGroup.Item
                key={conv.id}
                action
                active={selectedConv && conv.id === selectedConv.id}
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
              <h4 style={{ marginBottom: "10px", color: "#2c3e50" }}>Chat with {selectedConv.name}</h4>
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
                {loadingMessages ? (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} style={{ marginBottom: "15px" }}>
                      <div style={{ fontWeight: "bold" }}>
                        {msg.sender}{" "}
                        <span style={{ fontWeight: "normal", fontSize: "0.8rem", color: "#aaa" }}>
                          {msg.timestamp && msg.timestamp.toDate
                            ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                      <div>{msg.content}</div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <Form onSubmit={handleSendMessage} className="mt-3 d-flex">
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button variant="primary" className="ms-2" type="submit">
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

export default ChatWindow;
