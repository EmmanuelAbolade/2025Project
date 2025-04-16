
// src/components/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRoom, setEditRoom] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditName(user.name || "");
    setEditRoom(user.roomNumber || "");
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (selectedUser) {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, {
        name: editName,
        roomNumber: editRoom
      });
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, name: editName, roomNumber: editRoom } : u));
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
    <>
      <h2>User Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Room Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name || "N/A"}</td>
              <td>{user.email}</td>
              <td>{user.roomNumber || "N/A"}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(user)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for editing user profile */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Room Number</Form.Label>
              <Form.Control 
                type="text" 
                value={editRoom} 
                onChange={(e) => setEditRoom(e.target.value)} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminUsers;









/*
//comented 16/4/2025
import React, { useState, useEffect } from "react";
//import { Table, Button, Modal, Form } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");


  const roles = ["guest", "staff", "admin"]; // Define valid roles

  useEffect(() => {
    const usersRef = collection(db, "users");

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateRole = async (userId) => {
    if (!newRole ||!roles.includes(newRole)) {
      alert("Invalid role selected.");
      return;
    }
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });

      alert("Role updated successfully!");
      setEditingUserId(null);
      setNewRole("");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);

      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const checkRole = (user) => {
    if (user && user.roles && Array.isArray(user.roles) && user.roles.includes("admin")) {
      console.log("User is an admin");
    } else {
      console.error("User roles are undefined or user is not an admin");
    }
  };

  return (
    <div className="mt-5">
      <h3>Manage Users</h3>
      {users.length > 0 ? (
        <ul className="list-group">
          {users.map((user) => (
            <li key={user.id} className="list-group-item">
              <p>
                <strong>Name:</strong> {user.name || "No name provided"} <br />
                <strong>Email:</strong> {user.email} <br />
                <strong>Role:</strong> {user.role}
              </p>
              {editingUserId === user.id ? (
                <div>
                  <select
                    className="form-select mb-2"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="">Select new role</option>
                    <option value="guest">Guest</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleUpdateRole(user.id)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingUserId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="btn btn-sm btn-link text-primary"
                    onClick={() => setEditingUserId(user.id)}
                  >
                    Edit Role
                  </button>
                  <button
                    className="btn btn-sm btn-link text-danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete User
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default AdminUsers;
*/