//src\components\AdminFeedback.js
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { Table, Button, Card, Badge, Alert, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";


const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    async function fetchFeedback() {
      const snapshot = await getDocs(collection(db, "guestFeedback"));
      const feedbackList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(feedbackList);
    }
    fetchFeedback();
  }, []);

  async function approveFeedback(feedback) {
    const feedbackRef = doc(db, "guestFeedback", feedback.id);
    await updateDoc(feedbackRef, { status: "approved" });

    await addDoc(collection(db, "approvedFeedbacks"), {
      rating: feedback.rating,
      comment: feedback.comment,
      category: feedback.category,
    });
  }

  async function approveFeedback(feedback) {
    const feedbackRef = doc(db, "guestFeedback", feedback.id);
    await updateDoc(feedbackRef, { status: "approved" });
  
    const approvedRef = await addDoc(collection(db, "approvedFeedbacks"), {
      rating: feedback.rating,
      comment: feedback.comment,
      category: feedback.category,
      id: feedback.id, // Store the original ID for removal later
    });
  
    alert("Feedback approved and added to the homepage!");
  }

  async function removeFeedback(feedbackId) {
    const feedbackQuery = doc(db, "approvedFeedbacks", feedbackId);
    await feedbackQuery.delete(); // Remove from the approved feedback list
    
    alert("Feedback removed from homepage!");
  }
  
  

  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h2 className="text-center fw-bold text-primary">📢 Admin Feedback Dashboard</h2>
  
        {/* Feedback Table */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-4">
          <Table striped bordered hover responsive className="text-center">
            <thead className="bg-primary text-white">
              <tr>
                <th>Category</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td className="fw-bold">{feedback.category}</td>
                    <td>
                      {[...Array(feedback.rating)].map((_, index) => (
                        <FontAwesomeIcon key={index} icon={faStar} className="text-warning mx-1" />
                      ))}
                    </td>
                    <td className="text-muted fw-bold">{feedback.comment}</td>
                    <td>
                      <Badge bg={feedback.status === "approved" ? "success" : "warning"} className="shadow-sm p-2">
                        {feedback.status}
                      </Badge>
                    </td>
                    <td className="d-flex gap-2 justify-content-center">
                      {feedback.status === "pending" && (
                        <Button variant="primary fw-bold shadow-sm" size="sm" onClick={() => approveFeedback(feedback)}>
                          ✅ Approve
                        </Button>
                      )}
                      {feedback.status === "approved" && (
                        <Button variant="danger fw-bold shadow-sm" size="sm" onClick={() => removeFeedback(feedback.id)}>
                          🗑 Remove
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <Alert variant="warning fw-bold text-center mt-3">⚠ No feedback available.</Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Card>
    </Container>
  );
  
};

export default AdminFeedback;
