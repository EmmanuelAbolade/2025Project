import React, { useState, useEffect } from "react";
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
