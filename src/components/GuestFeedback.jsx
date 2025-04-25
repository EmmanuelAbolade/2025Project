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
    <div>
      <h2 class= "text-start">Guest Feedback</h2>
      <ul>
        {feedbacks.map(feedback => (
          <li key={feedback.id}>
            <p>{feedback.content}</p>
            <button onClick={() => handlePublish(feedback.id)}>Publish</button>
            <button onClick={() => handleRemove(feedback.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuestFeedback;
