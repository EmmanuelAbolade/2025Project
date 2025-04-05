import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true); // For loading spinner
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false); // For tracking upload progress

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUserProfile(userDoc.data());
        setName(userDoc.data()?.name || "");
        setProfilePicture(userDoc.data()?.profilePicture || null);
      }
      setLoading(false); // Hide spinner after fetching
    };
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name, updatedAt: serverTimestamp() });
      setUserProfile((prev) => ({ ...prev, name }));
      setEditing(false);
      alert("Profile updated!");
    }
  };

  const handleUploadProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}/${file.name}`);

    setUploading(true); // Show upload progress

    try {
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update the profile picture URL in Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { profilePicture: downloadURL });

      setProfilePicture(downloadURL); // Update the state
      setUploading(false); // Hide upload progress
      alert("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setUploading(false); // Hide upload progress on error
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
          <h3>User Profile</h3>
          <div>
            <img
              src={profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="mb-3 rounded-circle"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="profilePictureUpload" className="form-label">
              Upload Profile Picture
            </label>
            <input
              type="file"
              id="profilePictureUpload"
              className="form-control"
              onChange={handleUploadProfilePicture}
              accept="image/*"
              disabled={uploading}
            />
            <small className="text-muted">Max size: 2MB. Supported formats: JPG, PNG.</small>

            {uploading && (
              <div className="spinner-border text-primary mt-2" role="status">
                <span className="visually-hidden">Uploading...</span>
              </div>
            )}
          </div>
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
              <p><strong>Name:</strong> {userProfile?.name || "Not provided"}</p>
              <p><strong>Email:</strong> {userProfile?.email}</p>
              <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
