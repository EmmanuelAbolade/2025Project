import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Card, Container, Form, Button, Alert } from "react-bootstrap";

const StaffShoppingMessage = ({ staffName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentStaffId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (!staffName) return;

    const messagesQuery = query(
      collection(db, "shoppingMessages"),
      where("recipient", "==", staffName),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [staffName]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !staffName) return;

    try {
      await addDoc(collection(db, "shoppingMessages"), {
        sender: staffName,
        recipient: "Guest",
        message: newMessage,
        timestamp: new Date(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h3 className="text-start fw-bold text-primary">🛒 Shopping Messages</h3>

        {/* Display Messages */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-3" style={{ maxHeight: "300px", overflowY: "scroll" }}>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <Alert key={msg.id} variant={msg.sender === "Guest" ? "info" : "success"} className="shadow-sm fw-bold">
                <strong>{msg.sender}:</strong> {msg.message}
                <small className="d-block text-muted mt-1">{new Date(msg.timestamp.toDate()).toLocaleString()}</small>
              </Alert>
            ))
          ) : (
            <Alert variant="warning fw-bold text-center">⚠ No messages yet.</Alert>
          )}
        </Card>

        {/* Send Message Form */}
        <Form onSubmit={sendMessage} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Type a message to the guest..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border border-2 border-primary shadow-sm"
            />
          </Form.Group>
          <Button variant="primary fw-bold shadow-sm w-100" type="submit">
            📩 Send Message
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default StaffShoppingMessage;
