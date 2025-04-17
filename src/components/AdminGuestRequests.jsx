// src/components/AdminGuestRequests.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const AdminGuestRequests = () => {
  const [requests, setRequests] = useState([]);
  const [staffProfiles, setStaffProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Current guest request structure
  const [currentRequest, setCurrentRequest] = useState({
    id: "",
    guestName: "",
    serviceType: "",
    details: "",
    roomNumber: "",
    assignedStaff: [],
    status: "Pending", // possible values: "Pending", "Assigned", "Completed"
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch guest requests submitted by guests.
      const requestSnapshot = await getDocs(collection(db, "guestRequests"));
      const requestsData = requestSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestsData);

      // Fetch staff profiles to show in the assignment section.
      const staffSnapshot = await getDocs(collection(db, "staff"));
      const staffData = staffSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStaffProfiles(staffData);

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleOpenModal = (req = null) => {
    if (req) {
      setEditMode(true);
      setCurrentRequest(req);
    } else {
      setEditMode(false);
      setCurrentRequest({
        id: "",
        guestName: "",
        serviceType: "",
        details: "",
        roomNumber: "",
        assignedStaff: [],
        status: "Pending",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveRequest = async () => {
    try {
      if (editMode && currentRequest.id) {
        const requestRef = doc(db, "guestRequests", currentRequest.id);
        await updateDoc(requestRef, {
          guestName: currentRequest.guestName,
          serviceType: currentRequest.serviceType,
          details: currentRequest.details,
          roomNumber: currentRequest.roomNumber,
          assignedStaff: currentRequest.assignedStaff,
          status: currentRequest.status,
        });
        setRequests(requests.map(req => req.id === currentRequest.id ? currentRequest : req));
        alert("Request updated successfully.");
      } else {
        const docRef = await addDoc(collection(db, "guestRequests"), {
          guestName: currentRequest.guestName,
          serviceType: currentRequest.serviceType,
          details: currentRequest.details,
          roomNumber: currentRequest.roomNumber,
          assignedStaff: currentRequest.assignedStaff,
          status: currentRequest.status,
        });
        setRequests([...requests, { id: docRef.id, ...currentRequest }]);
        alert("Request added successfully.");
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving request:", error);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await deleteDoc(doc(db, "guestRequests", id));
        setRequests(requests.filter(req => req.id !== id));
        alert("Request deleted successfully.");
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const handleStaffCheckbox = (staffId, checked) => {
    let updatedAssignedStaff = [...currentRequest.assignedStaff];
    if (checked) {
      updatedAssignedStaff.push(staffId);
    } else {
      updatedAssignedStaff = updatedAssignedStaff.filter((id) => id !== staffId);
    }
    setCurrentRequest({...currentRequest, assignedStaff: updatedAssignedStaff});
  };

  if (loading) return <p>Loading guest requests...</p>;

  return (
    <div className="container my-4">
      <h2>Guest Service Requests</h2>
      <Button variant="primary" onClick={() => handleOpenModal()}>
        Add Request (Manual Entry)
      </Button>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Room Number</th>
            <th>Service Type</th>
            <th>Details</th>
            <th>Assigned Staff</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.guestName}</td>
              <td>{req.roomNumber || "N/A"}</td>
              <td>{req.serviceType}</td>
              <td>{req.details}</td>
              <td>
                {req.assignedStaff && req.assignedStaff.length > 0
                  ? req.assignedStaff
                      .map(staffId => {
                        const staff = staffProfiles.find(s => s.id === staffId);
                        return staff ? staff.name : staffId;
                      })
                      .join(", ")
                  : "Not assigned"}
              </td>
              <td>{req.status}</td>
              <td>
                <Button variant="info" onClick={() => handleOpenModal(req)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteRequest(req.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for adding/updating a guest request */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Request" : "Add Request"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Guest Name</Form.Label>
              <Form.Control
                type="text"
                value={currentRequest.guestName}
                onChange={(e) => setCurrentRequest({...currentRequest, guestName: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Room Number</Form.Label>
              <Form.Control
                type="text"
                value={currentRequest.roomNumber}
                onChange={(e) =>
                  setCurrentRequest({ ...currentRequest, roomNumber: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Housekeeping, Meal Order, etc."
                value={currentRequest.serviceType}
                onChange={(e) => setCurrentRequest({...currentRequest, serviceType: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Request Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentRequest.details}
                onChange={(e) => setCurrentRequest({...currentRequest, details: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assign Staff</Form.Label>
              {staffProfiles.map((staff) => (
                <Form.Check
                  key={staff.id}
                  type="checkbox"
                  id={`staff-${staff.id}`}
                  label={`${staff.name} (${staff.status})`}
                  checked={currentRequest.assignedStaff.includes(staff.id)}
                  onChange={(e) => handleStaffCheckbox(staff.id, e.target.checked)}
                />
              ))}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={currentRequest.status}
                onChange={(e) => setCurrentRequest({...currentRequest, status: e.target.value})}
              >
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveRequest}>
            {editMode ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminGuestRequests;
