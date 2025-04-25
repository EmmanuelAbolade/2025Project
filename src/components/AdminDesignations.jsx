// src/components/AdminDesignations.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const AdminDesignations = () => {
  const [designations, setDesignations] = useState([]);
  const [staffProfiles, setStaffProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Current assignment/Designation structure
  const [currentDesignation, setCurrentDesignation] = useState({
    id: "",
    requestId: "",
    guestName: "",
    guestRequest: "",
    assignedStaff: [],
    assignmentProgress: "Pending",
  });

  // Fetch designations and staff profiles on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Get designations from Firestore
      const designationSnapshot = await getDocs(collection(db, "designations"));
      const designationData = designationSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDesignations(designationData);

      // Get staff profiles from Firestore
      const staffSnapshot = await getDocs(collection(db, "staff"));
      const staffData = staffSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStaffProfiles(staffData);

      setLoading(false);
    };
    fetchData();
  }, []);

  // Open modal: If a designation is passed in, go into edit mode; otherwise, add new.
  const handleOpenModal = (designation = null) => {
    if (designation) {
      setEditMode(true);
      setCurrentDesignation(designation);
    } else {
      setEditMode(false);
      setCurrentDesignation({
        id: "",
        requestId: "",
        guestName: "",
        guestRequest: "",
        assignedStaff: [],
        assignmentProgress: "Pending",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Save or update designation in Firestore
  const handleSaveDesignation = async () => {
    try {
      if (editMode && currentDesignation.id) {
        const designationRef = doc(db, "designations", currentDesignation.id);
        await updateDoc(designationRef, {
          requestId: currentDesignation.requestId,
          guestName: currentDesignation.guestName,
          guestRequest: currentDesignation.guestRequest,
          assignedStaff: currentDesignation.assignedStaff,
          assignmentProgress: currentDesignation.assignmentProgress,
        });
        setDesignations(
          designations.map((des) =>
            des.id === currentDesignation.id ? currentDesignation : des
          )
        );
        alert("Designation updated successfully.");
      } else {
        const docRef = await addDoc(collection(db, "designations"), {
          requestId: currentDesignation.requestId,
          guestName: currentDesignation.guestName,
          guestRequest: currentDesignation.guestRequest,
          assignedStaff: currentDesignation.assignedStaff,
          assignmentProgress: currentDesignation.assignmentProgress,
        });
        setDesignations([...designations, { id: docRef.id, ...currentDesignation }]);
        alert("Designation added successfully.");
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving designation:", error);
    }
  };

  // Delete a designation
  const handleDeleteDesignation = async (id) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      try {
        await deleteDoc(doc(db, "designations", id));
        setDesignations(designations.filter((des) => des.id !== id));
        alert("Designation deleted successfully.");
      } catch (error) {
        console.error("Error deleting designation:", error);
      }
    }
  };

  // Handle selection/deselection of staff checkboxes
  const handleStaffCheckbox = (staffId, checked) => {
    let updatedAssignedStaff = [...currentDesignation.assignedStaff];
    if (checked) {
      updatedAssignedStaff.push(staffId);
    } else {
      updatedAssignedStaff = updatedAssignedStaff.filter((id) => id !== staffId);
    }
    setCurrentDesignation({ ...currentDesignation, assignedStaff: updatedAssignedStaff });
  };

  if (loading) return <p>Loading designations...</p>;

  return (
    <div className="container my-4">
      <h2 class= "text-start">Staff Assignment & Designation</h2>
      <Button variant="primary" onClick={() => handleOpenModal()}>
        Add Designation
      </Button>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Guest Name</th>
            <th>Request Details</th>
            <th>Assigned Staff</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {designations.map((des) => (
            <tr key={des.id}>
              <td>{des.requestId}</td>
              <td>{des.guestName}</td>
              <td>{des.guestRequest}</td>
              <td>
                {des.assignedStaff && des.assignedStaff.length > 0
                  ? des.assignedStaff
                      .map((staffId) => {
                        const staff = staffProfiles.find((s) => s.id === staffId);
                        return staff ? staff.name : staffId;
                      })
                      .join(", ")
                  : "Not assigned"}
              </td>
              <td>{des.assignmentProgress}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleOpenModal(des)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteDesignation(des.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for adding/updating designation */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Edit Designation" : "Add Designation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Request ID</Form.Label>
              <Form.Control
                type="text"
                value={currentDesignation.requestId}
                onChange={(e) =>
                  setCurrentDesignation({ ...currentDesignation, requestId: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Guest Name</Form.Label>
              <Form.Control
                type="text"
                value={currentDesignation.guestName}
                onChange={(e) =>
                  setCurrentDesignation({ ...currentDesignation, guestName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Guest Request Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentDesignation.guestRequest}
                onChange={(e) =>
                  setCurrentDesignation({ ...currentDesignation, guestRequest: e.target.value })
                }
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
                  checked={currentDesignation.assignedStaff.includes(staff.id)}
                  onChange={(e) => handleStaffCheckbox(staff.id, e.target.checked)}
                />
              ))}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assignment Progress</Form.Label>
              <Form.Control
                as="select"
                value={currentDesignation.assignmentProgress}
                onChange={(e) =>
                  setCurrentDesignation({
                    ...currentDesignation,
                    assignmentProgress: e.target.value,
                  })
                }
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveDesignation}>
            {editMode ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDesignations;
