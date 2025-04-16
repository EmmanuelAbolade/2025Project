// src/components/AdminFeedback.jsx
import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const querySnapshot = await getDocs(collection(db, "guestFeedback"));
      const fetchedFeedbacks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(fetchedFeedbacks);
      setLoading(false);
    };

    fetchFeedbacks();
  }, []);

  const handlePublish = async (id) => {
    const feedbackRef = doc(db, "guestFeedback", id);
    await updateDoc(feedbackRef, { published: true });
    setFeedbacks(feedbacks.map(fb => fb.id === id ? { ...fb, published: true } : fb));
    alert("Feedback published for carousel.");
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this feedback?")) {
      await deleteDoc(doc(db, "guestFeedback", id));
      setFeedbacks(feedbacks.filter(fb => fb.id !== id));
      alert("Feedback removed.");
    }
  };

  if (loading) return <p>Loading feedback...</p>;
  
  return (
    <>
      <h2>Guest Feedback</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Feedback</th>
            <th>Guest Name</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(fb => (
            <tr key={fb.id}>
              <td>{fb.content}</td>
              <td>{fb.guestName || "Unknown"}</td>
              <td>{fb.published ? "Yes" : "No"}</td>
              <td>
                <Button variant="success" onClick={() => handlePublish(fb.id)} className="me-2">
                  Publish
                </Button>
                <Button variant="danger" onClick={() => handleRemove(fb.id)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default AdminFeedback;
