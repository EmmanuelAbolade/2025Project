import React, { useState, useEffect } from "react";
import { Table, Container, Card, Alert, Badge } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

const StaffRequestBank = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for housekeeping requests
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "housekeepingRequests"), (snapshot) => {
      const fetchedRequests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(fetchedRequests);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Handle assigning a request
  const handleAssign = async (id) => {
    try {
      const requestDoc = doc(db, "housekeepingRequests", id);
      await updateDoc(requestDoc, { status: "Assigned" });
      alert("Request has been assigned.");
    } catch (error) {
      console.error("Error assigning request:", error);
      alert("Failed to assign the request. Please try again.");
    }
  };

  // Handle updating a request
  const handleUpdate = async (id) => {
    const newDetails = prompt("Enter your updated request details:");
    if (newDetails) {
      try {
        const requestDoc = doc(db, "housekeepingRequests", id);
        await updateDoc(requestDoc, { formattedDetails: newDetails, status: "Updated" });
        alert("Request updated successfully!");
      } catch (error) {
        console.error("Error updating request:", error);
        alert("Failed to update the request. Please try again.");
      }
    }
  };

  // Handle canceling a request
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        const requestDoc = doc(db, "housekeepingRequests", id);
        await deleteDoc(requestDoc);
        alert("Request canceled successfully!");
      } catch (error) {
        console.error("Error canceling request:", error);
        alert("Failed to cancel the request. Please try again.");
      }
    }
  };

  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-0 border-dark rounded p-4 bg-light">
        <h2 className="fw-bold text-start text-primary">🧹 Guest Housekeeping Requests</h2>
  
        {/* Loading Indicator */}
        {loading ? (
          <Alert variant="warning text-center fw-bold mt-3">⏳ Loading requests...</Alert>
        ) : requests.length > 0 ? (
          <Card className="shadow-lg border border-3 border-secondary rounded mt-4 p-4">
            <Table striped bordered hover responsive className="text-center">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Date & Time</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{new Date(request.timestamp.toDate()).toLocaleString()}</td>
                    <td className="fw-bold text-muted">
                      {typeof request.formattedDetails === "object" ? (
                        Object.entries(request.formattedDetails).map(([key, value]) => (
                          <div key={key} className="border-bottom py-1">
                            {key.replace(/([A-Z])/g, " $1")}: {value.toString()}
                          </div>
                        ))
                      ) : (
                        request.formattedDetails || "No details available"
                      )}
                    </td>
                    <td>
                      <Badge bg={request.status === "Pending" ? "danger" : "success"} className="shadow-sm p-2 fw-bold">
                        {request.status || "Pending"}
                      </Badge>
                    </td>
                    <td>{request.assignedStaff || "Not Assigned"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        ) : (
          <Alert variant="info text-center fw-bold mt-3">✅ No housekeeping requests found. Looks like a clean day!</Alert>
        )}
      </Card>
    </Container>
  );
}; 

export default StaffRequestBank;
