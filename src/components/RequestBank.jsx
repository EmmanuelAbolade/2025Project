import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const RequestBank = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = "currentUser.uid"; // Replace with the authenticated user's ID

  // Fetch guest requests from Firestore
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, "housekeepingRequests"), where("userId", "==", currentUserId));
        const querySnapshot = await getDocs(q);
        const fetchedRequests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(fetchedRequests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [currentUserId]);

  const handleUpdate = async (id) => {
    // Allow guests to update a specific request
    const newDetails = prompt("Enter your updated request details:");
    if (newDetails) {
      try {
        const requestDoc = doc(db, "housekeepingRequests", id);
        await updateDoc(requestDoc, { formattedDetails: newDetails, status: "Updated" });
        alert("Request updated successfully!");
        setRequests(requests.map(req => req.id === id ? { ...req, formattedDetails: newDetails, status: "Updated" } : req));
      } catch (error) {
        console.error("Error updating request:", error);
      }
    }
  };

  const handleCancel = async (id) => {
    // Allow guests to cancel a specific request
    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        const requestDoc = doc(db, "housekeepingRequests", id);
        await deleteDoc(requestDoc);
        alert("Request canceled successfully!");
        setRequests(requests.filter(req => req.id !== id));
      } catch (error) {
        console.error("Error canceling request:", error);
      }
    }
  };

  return (
    <div>
      <h2>Your Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Details</th>
              <th>Status</th>
              <th>Assigned Staff</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td>{new Date(request.timestamp.toDate()).toLocaleString()}</td>
                <td>{request.formattedDetails}</td>
                <td>{request.status || "Pending"}</td>
                <td>{request.assignedStaff || "Not Assigned"}</td>
                <td>
                  <Button variant="info" onClick={() => handleUpdate(request.id)} className="me-2">
                    Update
                  </Button>
                  <Button variant="danger" onClick={() => handleCancel(request.id)}>
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No requests found. Submit your first request today!</p>
      )}
    </div>
  );
};

export default RequestBank;
