import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { ListGroup, Form, Card, Alert, Container} from "react-bootstrap";
const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const announcementsRef = collection(db, "announcements");
    const unsubscribe = onSnapshot(announcementsRef, (snapshot) => {
      const updates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(updates);
    });

    return () => unsubscribe();
  }, []);

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h3 className="fw-bold text-primary">📢 Announcements</h3>
  
        {/* Search Announcements */}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="🔍 Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-2 border-primary shadow-sm"
          />
        </Form.Group>
      </Card>
  
      {/* Display Announcements */}
      <Card className="shadow-lg border border-3 border-dark rounded p-4 mt-4">
        {filteredAnnouncements.length > 0 ? (
          <ListGroup variant="flush">
            {filteredAnnouncements.map((announcement) => (
              <ListGroup.Item key={announcement.id} className="border border-2 border-secondary rounded shadow-sm p-3 bg-white">
                <h5 className="fw-bold text-dark">{announcement.title}</h5>
                <p className="text-muted">{announcement.message}</p>
                <small className="text-secondary">🕰 {new Date(announcement.timestamp?.toDate()).toLocaleString()}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Alert variant="warning fw-bold text-center mt-3">⚠ No announcements found.</Alert>
        )}
      </Card>
    </Container>
  );
  
};

export default Announcements;
