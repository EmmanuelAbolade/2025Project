//src\pages\StaffDashboard.jsx
import React, { useState, useEffect } from "react";
import { Tab, Tabs, Button, Table } from "react-bootstrap";
import StaffMessages from "../components/StaffMessages";
import StaffAnnouncements from "../components/StaffAnnouncements";
import StaffProfile from "../components/StaffProfile";
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import DashboardGreeting from "../components/DashboardGreeting";

const StaffDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("Available"); // Staff availability status
  const [loading, setLoading] = useState(true);
  const [staffName, setStaffName] = useState("Staff");
  // Use the authenticated user's ID rather than a hard-coded string.
  const currentStaffId = auth.currentUser ? auth.currentUser.uid : "currentStaff.uid"; 
  // Fetch the staff name from Firestore (assuming data exists in the "users" collection)
  useEffect(() => {
    const fetchStaffName = async () => {
      if (auth.currentUser) {
        try {
          const staffDoc = await getDoc(doc(db, "users", currentStaffId));
          if (staffDoc.exists()) {
            const data = staffDoc.data();
            setStaffName(data.name || "Staff");
          }
        } catch (error) {
          console.error("Error fetching staff name:", error);
        }
      }
    };
    fetchStaffName();
  }, [currentStaffId]);

  // Fetch assigned requests from Firestore
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, "housekeepingRequests"),
          where("assignedStaff", "==", currentStaffId)
        );
        const querySnapshot = await getDocs(q);
        const fetchedRequests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(fetchedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
      setLoading(false);
    };
    fetchRequests();
  }, [currentStaffId]);
  /*
  //commented 17/4/2025
  // const currentStaffId = "currentStaff.uid"; // Replace with the authenticated staff's ID

  // Fetch assigned requests from Firestore
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, "housekeepingRequests"), where("assignedStaff", "==", currentStaffId));
        const querySnapshot = await getDocs(q);
        const fetchedRequests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(fetchedRequests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    
    fetchRequests();
  }, [currentStaffId]);
*/
  const updateRequestStatus = async (id, newStatus) => {
    // Update the status of a specific request
    try {
      const requestDoc = doc(db, "housekeepingRequests", id);
      await updateDoc(requestDoc, { status: newStatus });
      alert(`Request status updated to ${newStatus}!`);
      setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const toggleStatus = () => {
    // Toggle staff availability status
    setStatus((prev) => (prev === "Available" ? "Unavailable" : "Available"));
    alert(`Your status is now: ${status === "Available" ? "Unavailable" : "Available"}`);
    // Optionally, save this status in Firestore:
    // await updateDoc(doc(db, "staff", currentStaffId), { status });
  };

  return (
    <div className="container mt-5">
      <h1>Staff Dashboard</h1>
      {/* Replace the static greeting with DashboardGreeting */}
      <DashboardGreeting
        title="Manage your profile, guest messages, announcements, and requests here."
        name={staffName}
      />

      {/* Staff Availability Toggle */}
      <div className="mb-3">
        <Button variant={status === "Available" ? "success" : "danger"} onClick={toggleStatus}>
          Mark as {status === "Available" ? "Unavailable" : "Available"}
        </Button>
      </div>

      <Tabs defaultActiveKey="profile" className="mb-3">
        <Tab eventKey="profile" title="Profile" aria-label="Manage Profile">
          <StaffProfile />
        </Tab>
        <Tab eventKey="messages" title="Messages" aria-label="View Messages">
          <StaffMessages />
        </Tab>
        <Tab eventKey="announcements" title="Announcements" aria-label="View Announcements">
          <StaffAnnouncements />
        </Tab>
        <Tab eventKey="requests" title="Request Bank" aria-label="Manage assigned requests">
          {/* Request Bank */}
          <div>
            <h2>Assigned Requests</h2>
            {loading ? (
              <p>Loading requests...</p>
            ) : requests.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(request => (
                    <tr key={request.id}>
                      <td>{new Date(request.timestamp.toDate()).toLocaleString()}</td>
                      <td>{request.formattedDetails}</td>
                      <td>{request.status || "Pending"}</td>
                      <td>
                        <Button
                          variant="info"
                          onClick={() => updateRequestStatus(request.id, "In Progress")}
                          className="me-2"
                        >
                          In Progress
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => updateRequestStatus(request.id, "Completed")}
                        >
                          Completed
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No requests assigned. Check back later!</p>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;

























/*import React from "react";
import { Tab, Tabs, Button, Table  } from "react-bootstrap";
import StaffMessages from "../components/StaffMessages";
import StaffAnnouncements from "../components/StaffAnnouncements";
import StaffProfile from "../components/StaffProfile";
import 'bootstrap/dist/css/bootstrap.min.css';

const StaffDashboard = () => {
  return (
    <div className="container mt-5">
      <h1>Staff Dashboard</h1>
      <p>Welcome, Staff! Manage your profile, guest messages, and announcements here.</p>
      <Tabs defaultActiveKey="profile" className="mb-3">
        <Tab eventKey="profile" title="Profile" aria-label="Manage Profile">
          <StaffProfile />
        </Tab>
        <Tab eventKey="messages" title="Messages" aria-label="View Messages">
          <StaffMessages />
        </Tab>
        <Tab eventKey="announcements" title="Announcements" aria-label="View Announcements">
          <StaffAnnouncements />
        </Tab>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;
*/