//src\components\GuestRequestBank.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Card, Container} from "react-bootstrap";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, onSnapshot, doc, getDoc, where, query, updateDoc, deleteDoc, addDoc } from "firebase/firestore";

const GuestRequestBank = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentGuestId = auth.currentUser ? auth.currentUser.uid : null; // Current guest ID
  const [guestName, setGuestName] = useState(""); // Current guest name

  
  // Fetch the current guest's name (optional, if needed)
  useEffect(() => {
    if (currentGuestId) {
      const fetchGuestName = async () => {
        const userDoc = doc(db, "users", currentGuestId); // Assume "users" contains guest info
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setGuestName(userData.name || "Guest");
        }
      };
      fetchGuestName();
    }
  }, [currentGuestId]);
  
  // Real-time listener for housekeeping requests filtered by userId
  useEffect(() => {
    if (!currentGuestId) {
      console.warn("No current guest ID available.");
      return;
    }

    const q = query(
      collection(db, "housekeepingRequests"),
      where("userId", "==", currentGuestId) // Filter requests by logged-in guest's ID
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRequests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(fetchedRequests);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [currentGuestId]);

   // Function to send notifications to admin
   const sendNotificationToAdmin = async (message) => {
    try {
      await addDoc(collection(db, "adminNotifications"), {
        message,
        timestamp: new Date(),
        status: "Unread",
      });
    } catch (error) {
      console.error("Error sending notification to admin:", error);
    }
  };

  // Assign a housekeeping request & notify admin
  const handleAssign = async (id) => {
    try {
      await updateDoc(doc(db, "housekeepingRequests", id), { status: "Assigned" });
      await sendNotificationToAdmin(`Guest ${guestName} assigned a request.`);
      alert("Request has been assigned.");
    } catch (error) {
      console.error("Error assigning request:", error);
      alert("Failed to assign the request. Please try again.");
    }
  };

  // Update a request & notify admin
  const handleUpdate = async (id) => {
    const newDetails = prompt("Enter your updated request details:");
    if (newDetails) {
      try {
        await updateDoc(doc(db, "housekeepingRequests", id), { formattedDetails: newDetails, status: "Updated" });
        await sendNotificationToAdmin(`Guest ${guestName} updated a request.`);
        alert("Request updated successfully!");
      } catch (error) {
        console.error("Error updating request:", error);
        alert("Failed to update the request. Please try again.");
      }
    }
  };

  // Cancel a request & notify admin
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        await deleteDoc(doc(db, "housekeepingRequests", id));
        await sendNotificationToAdmin(`Guest ${guestName} canceled a request.`);
        alert("Request canceled successfully!");
      } catch (error) {
        console.error("Error canceling request:", error);
        alert("Failed to cancel the request. Please try again.");
      }
    }
  };

  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h2 className="fw-bold text-primary">📌 Your Requests</h2>
  
        {loading ? (
          <p className="text-center fw-bold text-warning">⏳ Loading requests...</p>
        ) : requests.length > 0 ? (
          <Table striped bordered hover responsive className="text-center">
            <thead className="bg-primary text-white">
              <tr>
                <th>Date & Time</th>
                <th>Details</th>
                <th>Status</th>
                <th>Assigned Staff</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{new Date(request.timestamp.toDate()).toLocaleString()}</td>
                  <td>
                    {typeof request.formattedDetails === "object" ? (
                      Object.entries(request.formattedDetails).map(([key, value]) => (
                        <div key={key}>
                          {key.replace(/([A-Z])/g, " $1")}: {value.toString()}
                        </div>
                      ))
                    ) : (
                      request.formattedDetails || "No details available"
                    )}
                  </td>
                  <td>
                    <span className={`fw-bold ${request.status === "Pending" ? "text-danger" : request.status === "Assigned" ? "text-success" : "text-secondary"}`}>
                      {request.status || "Pending"}
                    </span>
                  </td>
                  <td>{request.assignedStaff || "Not Assigned"}</td>
                  <td>
                    <Button variant="primary fw-bold shadow-sm mb-2 w-100" onClick={() => handleAssign(request.id)}>
                      🏷 Assign Staff
                    </Button>
                    <Button variant="warning fw-bold shadow-sm mb-2 w-100" onClick={() => handleUpdate(request.id)}>
                      ✏ Update
                    </Button>
                    <Button variant="danger fw-bold shadow-sm w-100" onClick={() => handleCancel(request.id)}>
                      ❌ Cancel Request
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="warning fw-bold text-center mt-3">⚠ No requests found. Submit your first request today!</Alert>
        )}
      </Card>
    </Container>
  );
  
};

export default GuestRequestBank;
