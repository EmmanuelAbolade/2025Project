//src\components\guestDashboard\FeedbackForm.js
import { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import "../../css/style.css"; // Add CSS file for styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const FeedbackForm = () => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("App Experience");

  async function submitFeedback() {
    await addDoc(collection(db, "guestFeedback"), {
      rating,
      comment,
      category,
      timestamp: new Date(),
      status: "pending",
    });
    alert("Thanks for your feedback! 🎉");
  }

  return (
    <div className="feedback-container">
      <h2>Give Us Your Feedback</h2>

      {/* Star Rating System */}
      <div className="rating-stars">
        {[...Array(5)].map((_, index) => {
          const currentRating = index + 1;
          return (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className={`star ${currentRating <= (hover || rating) ? "active" : ""}`}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(currentRating)}
            />
          );
        })}
      </div>

      <label>Category:</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>App Experience</option>
        <option>Service</option>
        <option>Staff Assistance</option>
      </select>

      <label>Comment:</label>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts..." />

      <button className="submit-btn" onClick={submitFeedback}>Submit Feedback</button>
    </div>
  );
};

export default FeedbackForm;
