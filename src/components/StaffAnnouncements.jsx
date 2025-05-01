import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { Card, Form, ListGroup, Button, Alert, Container } from "react-bootstrap";

const StaffAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const announcementsRef = collection(db, "announcements");

    const unsubscribe = onSnapshot(announcementsRef, (snapshot) => {
      const fetchedAnnouncements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(fetchedAnnouncements);
    });

    return () => unsubscribe();
  }, []);

  const handlePostAnnouncement = async () => {
    try {
      if (!title || !message) return;

      await addDoc(collection(db, "announcements"), {
        title,
        message,
        timestamp: new Date(),
      });

      setTitle("");
      setMessage("");
      alert("Announcement posted!");
    } catch (error) {
      console.error("Error posting announcement:", error);
    }
  };

  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h3 className="fw-bold text-start text-primary">📢 Post Announcements</h3>
  
        {/* Announcement Form */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-3">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">📌 Announcement Title</Form.Label>
            <Form.Control
              type="text"
              className="border border-2 border-primary shadow-sm"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">📝 Announcement Message</Form.Label>
            <Form.Control
              as="textarea"
              rows="4"
              className="border border-2 border-primary shadow-sm"
              placeholder="Enter Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
  
          <Button variant="primary fw-bold shadow-sm w-100" onClick={handlePostAnnouncement}>
            ✅ Post Announcement
          </Button>
        </Card>
  
        <h3 className="fw-bold text-start text-primary mt-4">📜 Existing Announcements</h3>
  
        {/* Announcements List */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-3" style={{ maxHeight: "300px", overflowY: "scroll" }}>
          {announcements.length > 0 ? (
            <ListGroup variant="flush">
              {announcements.map((ann) => (
                <ListGroup.Item key={ann.id} className="shadow-sm p-3 border border-2 border-secondary rounded">
                  <h5 className="fw-bold text-dark">{ann.title}</h5>
                  <p className="text-muted fw-bold">{ann.message}</p>
                  <small className="text-muted">📅 {new Date(ann.timestamp?.toDate()).toLocaleString()}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="warning fw-bold text-center mt-3">⚠ No announcements yet.</Alert>
          )}
        </Card>
      </Card>
    </Container>
  );
  
};

export default StaffAnnouncements;
