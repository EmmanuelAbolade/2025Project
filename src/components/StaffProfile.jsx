import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

const StaffProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const profileDoc = await getDoc(doc(db, "users", user.uid));
        setProfile(profileDoc.data());
        setName(profileDoc.data()?.name || "");
      }
      setLoading(false); // Hide loading spinner after data is fetched
    };
    fetchStaffProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    
    const user = auth.currentUser;
    if (user) {
      const profileRef = doc(db, "users", user.uid);
      await updateDoc(profileRef, { name, updatedAt: serverTimestamp()  });
      setProfile((prev) => ({ ...prev, name }));
      setEditing(false);
      alert("Profile updated successfully!");
    }

    
  };

  return (
    <div className="mt-4 p-4 border rounded shadow-sm bg-light">
      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <>
          <h3>Staff Profile</h3>
          {editing ? (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control mb-3"
                aria-label="Name input field"
              />
              <button className="btn btn-primary me-2" onClick={handleUpdateProfile}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {profile?.name || "Not provided"}</p>
              <p><strong>Email:</strong> {profile?.email || "Not provided"}</p>
              <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StaffProfile;
