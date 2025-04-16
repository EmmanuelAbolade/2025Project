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
    <Container className="mt-5">
      <h1 className="mb-4 text-center">Recommended Services & Attractions</h1>
      <Row>
        {recommendations.map((rec) => (
          <Col key={rec.id} sm={12} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              {rec.image && (
                <Card.Img
                  variant="top"
                  src={rec.image}
                  alt={rec.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{rec.name}</Card.Title>
                <Card.Text>
                  <strong>Location:</strong> {rec.location}<br />
                  {rec.services && (
                    <>
                      <strong>Services:</strong> {rec.services}<br />
                    </>
                  )}
                  {rec.contacts && (
                    <>
                      <strong>Contacts:</strong> {rec.contacts}<br />
                    </>
                  )}
                  {rec.hours && (
                    <>
                      <strong>Hours:</strong> {rec.hours}<br />
                    </>
                  )}
                  {rec.url && (
                    <a href={rec.url} target="_blank" rel="noopener noreferrer"
                    className="custom-link text-decoration-none fw-bold fs-6"
                    >
                      <i className = "fa fa-globe"></i> Visit Website
                    </a>
                  )}
                </Card.Text>
              </Card.Body>
              {rec.map && (
                <Card.Footer>
                  <a href={rec.map} target="_blank" rel="noopener noreferrer"
                  className="custom-link text-decoration-none fw-bold fs-6"
                  >
                    <i className = "fa fa-map-marker" aria-hidden = "true"></i> View on Map
                  </a>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RecommendationsPage;
