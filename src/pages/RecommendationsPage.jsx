//src/pages/RecommendationsPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Listen for real-time updates from the "recommendations" collection.
    const unsubscribe = onSnapshot(collection(db, "recommendations"), (snapshot) => {
      const recs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecommendations(recs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h1 className="text-center fw-bold text-primary">🏆 Recommended Services & Attractions</h1>
  
        <Row className="mt-4">
          {recommendations.map((rec) => (
            <Col key={rec.id} sm={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-lg rounded border border-2 border-secondary">
                {rec.image && (
                  <Card.Img
                    variant="top"
                    src={rec.image}
                    alt={rec.name}
                    className="rounded-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title className="fw-bold text-dark">{rec.name}</Card.Title>
                  <Card.Text className="text-secondary">
                    📍 <strong>Location:</strong> {rec.location}<br />
                    {rec.services && (
                      <>
                        🛠 <strong>Services:</strong> {rec.services}<br />
                      </>
                    )}
                    {rec.contacts && (
                      <>
                        📞 <strong>Contacts:</strong> {rec.contacts}<br />
                      </>
                    )}
                    {rec.hours && (
                      <>
                        ⏰ <strong>Hours:</strong> {rec.hours}<br />
                      </>
                    )}
                    {rec.url && (
                      <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-primary fw-bold">
                        🌐 Visit Website
                      </a>
                    )}
                  </Card.Text>
                </Card.Body>
                {rec.map && (
                  <Card.Footer className="text-center bg-light">
                    <a href={rec.map} target="_blank" rel="noopener noreferrer" className="text-success fw-bold">
                      📍 View on Map
                    </a>
                  </Card.Footer>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </Container>
  );
  
};

export default RecommendationsPage;