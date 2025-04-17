// src/components/StaffRequestBank.jsx
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const StaffRequestBank = ({ staffId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffRequests = async () => {
      // Query for guestRequests where the logged‐in staff’s ID is included in assignedStaff
      const q = query(
        collection(db, "guestRequests"),
        where("assignedStaff", "array-contains", staffId)
      );
      const querySnapshot = await getDocs(q);
      const fetchedRequests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(fetchedRequests);
      setLoading(false);
    };

    fetchStaffRequests();
  }, [staffId]);

  if (loading) return <p>Loading assigned requests...</p>;

  return (
    <div className="container my-4">
      <h2>Your Assigned Requests</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Room Number</th>
            <th>Service Type</th>
            <th>Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.guestName}</td>
              <td>{req.roomNumber || "N/A"}</td>
              <td>{req.serviceType}</td>
              <td>{req.details}</td>
              <td>{req.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StaffRequestBank;
