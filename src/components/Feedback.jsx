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
    <div className="mt-5">
      <h3 class= "text-start">Feedback</h3>
      <textarea
        className="form-control mb-3"
        rows="4"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Leave your feedback here..."
        aria-label="Feedback message input"
      ></textarea>
      <div className="mb-3">
        <strong>Rate Us :</strong>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`btn btn-sm ${rating >= star ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setRating(star)}
          >
            ★
          </button>
        ))}
      </div>
      <button className="btn btn-primary d-flex justify-content-between mb-5 mt-5" onClick={handleFeedbackSubmit}>
        Submit Feedback
      </button>
    </div>
  );
};

export default Feedback;
