//src\components\AdminAnnouncements.jsx 
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot, deleteDoc, doc} from "firebase/firestore";
import { Button, Form, Card, Alert, Container} from "react-bootstrap";
const AdminAnnouncements = () => {
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

  const handleDeleteAnnouncement = async (id) => {
    try {
      const announcementRef = doc(db, "announcements", id);
      await deleteDoc(announcementRef);

      alert("Announcement deleted successfully!");
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h3 className="fw-bold text-primary">📢 Manage Announcements</h3>
  
        {/* Announcement Input Fields */}
        <Form className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">📝 Announcement Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-2 border-primary"
            />
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">📄 Announcement Message</Form.Label>
            <Form.Control
              as="textarea"
              rows="4"
              placeholder="Enter announcement message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border border-2 border-primary"
            />
          </Form.Group>
  
          <Button variant="primary fw-bold w-100" onClick={handlePostAnnouncement}>
            🚀 Post Announcement
          </Button>
        </Form>
      </Card>
  
      {/* Display Existing Announcements */}
      <Card className="shadow-lg border border-3 border-dark rounded p-4 mt-4">
        <h3 className="fw-bold text-success">📌 Existing Announcements</h3>
        <div className="border rounded p-3 mb-3 bg-light" style={{ maxHeight: "300px", overflowY: "scroll" }}>
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <div key={ann.id} className="mb-3 p-3 border border-2 border-secondary rounded bg-white shadow-sm">
                <h5 className="fw-bold text-dark">{ann.title}</h5>
                <p className="text-muted">{ann.message}</p>
                <small className="text-secondary">
                  🕰 {new Date(ann.timestamp?.toDate()).toLocaleString()}
                </small>
                <Button
                  variant="danger fw-bold mt-2 shadow-sm"
                  size="sm"
                  onClick={() => handleDeleteAnnouncement(ann.id)}
                >
                  🗑 Delete Announcement
                </Button>
              </div>
            ))
          ) : (
            <Alert variant="warning fw-bold text-center">⚠ No announcements found.</Alert>
          )}
        </div>
      </Card>
    </Container>
  );
  
};

export default AdminAnnouncements;