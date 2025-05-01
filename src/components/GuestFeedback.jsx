import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

const GuestFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const feedbackSnapshot = await getDocs(collection(db, "guestFeedback"));
      const fetchedFeedbacks = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(fetchedFeedbacks);
    };

    fetchFeedbacks();
  }, []);

  const handlePublish = async (id) => {
    const feedbackDoc = doc(db, "guestFeedback", id);
    await updateDoc(feedbackDoc, { published: true });
    alert("Feedback published to the homepage!");
  };

  const handleRemove = async (id) => {
    const feedbackDoc = doc(db, "guestFeedback", id);
    await deleteDoc(feedbackDoc);
    alert("Feedback removed!");
    setFeedbacks(feedbacks.filter(fb => fb.id !== id));
  };
  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h2 className="text-start fw-bold text-primary">📝 Guest Feedback</h2>
  
        {/* Feedback List */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-4">
          <ListGroup variant="flush">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <ListGroup.Item key={feedback.id} className="shadow-sm p-3 border border-2 border-secondary rounded">
                  <p className="text-dark fw-bold">{feedback.content}</p>
                  <div className="d-flex gap-2 mt-2">
                    <Button variant="success fw-bold shadow-sm" onClick={() => handlePublish(feedback.id)}>
                      ✅ Publish
                    </Button>
                    <Button variant="danger fw-bold shadow-sm" onClick={() => handleRemove(feedback.id)}>
                      🗑 Remove
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <Alert variant="warning fw-bold text-center mt-3">⚠ No feedback available.</Alert>
            )}
          </ListGroup>
        </Card>
      </Card>
    </Container>
  );
  
};

export default GuestFeedback;
