import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { serverTimestamp } from "firebase/firestore";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const handleFeedbackSubmit = async () => {
    try {
      const feedbackRef = doc(collection(db, "feedback"));
      await setDoc(feedbackRef, {
        feedback,
        rating,
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        //timestamp: new Date(),
      });

      alert("Thank you for your feedback!");
      setFeedback("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong. Please try again later.");
    }
  };
  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h3 className="fw-bold text-primary">📝 Feedback</h3>
  
        {/* Feedback Input Field */}
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows="4"
            placeholder="💬 Leave your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="border border-2 border-primary shadow-sm"
            aria-label="Feedback message input"
          />
        </Form.Group>
  
        {/* Rating System */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-3 bg-white">
          <strong className="fw-bold text-dark">⭐ Rate Us :</strong>
          <div className="d-flex mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                className={`btn-sm fw-bold mx-1 ${rating >= star ? "btn-warning shadow-sm" : "btn-outline-warning border-2"}`}
                onClick={() => setRating(star)}
              >
                ★
              </Button>
            ))}
          </div>
        </Card>
  
        {/* Submit Button */}
        <Button variant="primary fw-bold shadow-sm w-100 mt-4" onClick={handleFeedbackSubmit}>
          📩 Submit Feedback
        </Button>
      </Card>
    </Container>
  );
  
};

export default Feedback;
