import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Badge, Form, Card, Alert, Container} from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc, onSnapshot } from "firebase/firestore";

// Helper function to filter out unnecessary or empty fields
const extractFilledData = (data) => {
  return Object.entries(data || {}) // Ensure data is not null or undefined
    .filter(([key, value]) => {
      if (typeof value === "boolean") return value; // Include true checkboxes
      if (typeof value === "string") return value.trim() !== ""; // Include non-empty text fields
      return false; // Exclude anything else
    })
    .reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {});
};

const AdminDesignations = () => {
  // State variables to manage requests, staff profiles, and UI states
  const [requests, setRequests] = useState([]); // All fetched requests
  const [staffProfiles, setStaffProfiles] = useState([]); // List of staff profiles
  const [loading, setLoading] = useState(true); // Loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedRequest, setSelectedRequest] = useState(null); // Currently selected request for assignment
  const [selectedStaff, setSelectedStaff] = useState(""); // Selected staff for assignment
  const [selectedFilter, setSelectedFilter] = useState(""); // Status filter
  const [sortOrder, setSortOrder] = useState(""); // Sorting order (ascending/descending)

  // Real-time fetching of housekeeping requests
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "housekeepingRequests"), (snapshot) => {
      const fetchedRequests = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Raw Request Data:", data); // Debug log for raw data

        const parsedDetails =
          typeof data.formattedDetails === "string" && data.formattedDetails.includes("{")
            ? JSON.parse(data.formattedDetails) // Parse JSON-formatted strings
            : data.formattedDetails || {}; // Use object or fallback to empty

        // Return formatted request object
        return {
          id: doc.id,
          ...data,
          formattedDetails: extractFilledData(parsedDetails), // Extract relevant fields
        };
      });

      console.log("Processed Requests:", fetchedRequests); // Debug log for processed data
      setRequests(fetchedRequests); // Update state with fetched requests
      setLoading(false); // Disable loading state
    });

    return unsubscribe; // Cleanup listener when component unmounts
  }, []);

  // Fetch staff profiles from Firestore
  useEffect(() => {
    const fetchStaffProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "StaffProfiles"));
        const fetchedProfiles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaffProfiles(fetchedProfiles); // Update state with fetched profiles
      } catch (error) {
        console.error("Error fetching staff profiles:", error);
      }
    };

    fetchStaffProfiles(); // Trigger fetching of staff profiles
  }, []);

  // Open modal for assigning staff
  const handleShowModal = (request) => {
    setSelectedRequest(request); // Set the selected request for assignment
    setShowModal(true); // Show modal
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedRequest(null); // Reset selected request
    setSelectedStaff(""); // Reset selected staff
    setShowModal(false); // Hide modal
  };

  // Assign staff to a request
  const handleAssignStaff = async () => {
    if (!selectedStaff) {
      alert("Please select a staff member."); // Alert if no staff is selected
      return;
    }

    try {
      const requestDoc = doc(db, "housekeepingRequests", selectedRequest.id); // Reference to the request doc
      await updateDoc(requestDoc, {
        assignedStaff: selectedStaff, // Assign selected staff
        status: "Assigned", // Update status to "Assigned"
      });

      // Update local state to reflect changes
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, assignedStaff: selectedStaff, status: "Assigned" }
            : req
        )
      );

      alert(`Successfully assigned ${selectedStaff} to the request!`); // Success message
      handleCloseModal(); // Close modal after assignment
    } catch (error) {
      console.error("Error assigning staff:", error);
      alert("Failed to assign staff. Please try again.");
    }
  };

  // Filter requests based on selected status
  const filteredRequests = requests.filter((req) =>
    selectedFilter ? req.status === selectedFilter : true
  );

  // Sort requests based on selected sorting order
  const sortedRequests = [...filteredRequests].sort((a, b) =>
    sortOrder === "Asc"
      ? new Date(a.timestamp.toDate()) - new Date(b.timestamp.toDate())
      : new Date(b.timestamp.toDate()) - new Date(a.timestamp.toDate())
  );

  // Use sorted and filtered requests for rendering
  const displayedRequests = sortedRequests;


  
  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h2 className="text-start fw-bold text-primary">🏢 Admin Designations</h2>
  
        {/* Filters for sorting and filtering requests */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 mt-4">
          <h4 className="fw-bold text-dark">🎯 Filter & Sort Requests</h4>
          <div className="d-flex flex-wrap justify-content-between gap-2">
            <Form.Select
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-2 border-primary shadow-sm"
              style={{ width: "200px", fontSize: "1rem" }}
            >
              <option value="">Filter by Status</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
            </Form.Select>
            <Form.Select
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-2 border-primary shadow-sm"
              style={{ width: "200px", fontSize: "1rem" }}
            >
              <option value="">Sort by Date</option>
              <option value="Asc">Ascending</option>
              <option value="Desc">Descending</option>
            </Form.Select>
          </div>
        </Card>
  
        {/* Loading Indicator */}
        {loading ? (
          <p className="text-center fw-bold text-warning">⏳ Loading requests...</p>
        ) : requests.length > 0 ? (
          <Card className="shadow-lg border border-3 border-dark rounded mt-4 p-4">
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
                {displayedRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{new Date(request.timestamp.toDate()).toLocaleString()}</td>
                    <td className="text-start fw-bold">
                      {request.formattedDetails && Object.keys(request.formattedDetails).length > 0 ? (
                        Object.entries(request.formattedDetails)
                          .map(([key, value]) =>
                            typeof value === "boolean" && value
                              ? key.replace(/([A-Z])/g, " $1")
                              : `${key.replace(/([A-Z])/g, " $1")}: ${value}`
                          )
                          .join(", ")
                      ) : (
                        <span className="text-muted">No Details Available</span>
                      )}
                    </td>
                    <td>
                      <Badge
                        bg={request.status === "Pending" ? "danger" : "success"}
                        className="shadow-sm p-2 fw-bold"
                      >
                        {request.status || "Pending"}
                      </Badge>
                    </td>
                    <td>{request.assignedStaff || "Not Assigned"}</td>
                    <td>
                      <Button
                        variant="primary fw-bold shadow-sm"
                        onClick={() => handleShowModal(request)}
                        disabled={request.status === "Assigned"}
                      >
                        🏷 Assign Staff
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        ) : (
          <Alert variant="danger text-center fw-bold">⚠ No requests available.</Alert>
        )}
  
        {/* Modal for assigning staff */}
        <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold text-primary">🧑‍💼 Assign Staff</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="staffSelection">
              <Form.Label className="fw-bold">👥 Select Staff Member</Form.Label>
              <Form.Control
                as="select"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="border border-2 border-primary shadow-sm"
              >
                <option value="">-- Select Staff --</option>
                {staffProfiles.map((staff) => (
                  <option key={staff.id} value={staff.name}>
                    {staff.name} - {staff.role}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary fw-bold shadow-sm" onClick={handleCloseModal}>
              ❌ Cancel
            </Button>
            <Button variant="success fw-bold shadow-sm" onClick={handleAssignStaff}>
              ✅ Assign
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </Container>
  );
  
  
};

export default AdminDesignations;
