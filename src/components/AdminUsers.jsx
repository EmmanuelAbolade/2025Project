
// src/components/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Card, Container, Form} from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRoom, setEditRoom] = useState("");
  const [editRole, setEditRole] = useState("");


  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditName(user.name || "");
    setEditRoom(user.roomNumber || "");
    setEditRole(user.role || "guest"); // Default to "guest" if no role is provided
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (selectedUser) {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, {
        name: editName,
        roomNumber: editRoom,
        role: editRole // Update the role in Firestore
      });
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, name: editName, roomNumber: editRoom, role: editRole }
          : u
      ));
      setShowModal(false);
      alert("User profile updated successfully.");
    }
  };
  
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter(u => u.id !== userId));
      alert("User deleted.");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <Container fluid className="mt-4">
      <h2 className="text-start fw-bold text-primary">👤 User Management</h2>
  
      {/* User Management Table */}
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <Table striped bordered hover responsive className="text-center">
          <thead className="bg-primary text-white">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Room Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name || "N/A"}</td>
                <td>{user.email}</td>
                <td>{user.roomNumber || "N/A"}</td>
                <td>
                  <span className={`fw-bold ${user.role === "admin" ? "text-danger" : user.role === "staff" ? "text-success" : "text-secondary"}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <Button variant="info fw-bold shadow-sm me-2" onClick={() => handleEdit(user)}>
                    ✏ Edit
                  </Button>
                  <Button variant="danger fw-bold shadow-sm" onClick={() => handleDelete(user.id)}>
                    🗑 Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
  
      {/* Modal for editing user profile */}
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-primary">✏ Edit User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📌 Name</Form.Label>
              <Form.Control 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🏠 Room Number</Form.Label>
              <Form.Control 
                type="text" 
                value={editRoom} 
                onChange={(e) => setEditRoom(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🔑 Role</Form.Label>
              <Form.Select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="border border-2 border-primary">
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="guest">Guest</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary fw-bold" onClick={() => setShowModal(false)}>❌ Cancel</Button>
          <Button variant="primary fw-bold" onClick={handleUpdate}>✅ Update</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
  
};

export default AdminUsers;
