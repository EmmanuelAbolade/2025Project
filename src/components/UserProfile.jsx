//src\components\UserProfile.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
//import { db } from "../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { Card, Form, Button, Spinner, Image } from "react-bootstrap";
import CloudinaryUpload from "./CloudinaryUpload";


const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    roomNumber: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfile({
              name: data.name || "",
              email: data.email || "",
              phoneNumber: data.phoneNumber || "",
              roomNumber: data.roomNumber || "",
              profilePic: data.profilePic || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      setSaving(true);
      try {
        await updateDoc(doc(db, "users", user.uid), {
          name: profile.name,
          phoneNumber: profile.phoneNumber,
          roomNumber: profile.roomNumber,
          updatedAt: serverTimestamp(),
        });
        setEditing(false);
        alert("Profile updated!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Update failed!");
      }
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }


  return (
    <Card className="m-3 shadow-sm">
      <Card.Header>
        <h3>User Profile</h3>
      </Card.Header>
      <Card.Body>
        {editing ? (
          <Form onSubmit={handleSaveProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              {/* Email is read-only */}
              <Form.Control type="email" value={profile.email} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={profile.phoneNumber}
                onChange={(e) =>
                  setProfile({ ...profile, phoneNumber: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Room Number</Form.Label>
              <Form.Control
                type="text"
                value={profile.roomNumber}
                onChange={(e) =>
                  setProfile({ ...profile, roomNumber: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <div className="mb-2">
                {profile.profilePic ? (
                  <Image
                    src={profile.profilePic}
                    roundedCircle
                    width="150"
                    height="150"
                    alt="Profile"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "150px",
                      height: "150px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </div>
              <CloudinaryUpload
                onUploadComplete={(url) =>
                  setProfile({ ...profile, profilePic: url })
                }
              />
            </Form.Group>
            <div className="d-flex justify-content-between mb-5 mt-5">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEditing(false)}
              className="ms-2"
              disabled={saving}
            >
              Cancel
            </Button>
            </div>
          </Form>
        ) : (
          <div>
            <div className="text-center mb-3">
              {profile.profilePic ? (
                <Image
                  src={profile.profilePic}
                  roundedCircle
                  width="150"
                  height="150"
                  alt="Profile"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#e9ecef",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
            <p>
              <strong>Name:</strong> {profile.name || "Not provided"}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {profile.phoneNumber || "Not provided"}
            </p>
            <p>
              <strong>Room Number:</strong>{" "}
              {profile.roomNumber || "Not provided"}
            </p>
            <div className="d-flex justify-content-between mb-5 mt-5">
            <Button variant="primary" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserProfile;
 /* //commented 17/04/2025
  const [userProfile, setUserProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number
  const [roomNumber, setRoomNumber] = useState(""); // State for room number
  const [loading, setLoading] = useState(true); // For loading spinner
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false); // For tracking upload progress

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setUserProfile(userData);
        setName(userData?.name || "");
        setPhoneNumber(userData?.phoneNumber || ""); // Fetch phone number
        setRoomNumber(userData?.roomNumber || ""); // Fetch room number
        setProfilePicture(userData?.profilePicture || null);
      }
      setLoading(false); // Hide spinner after fetching
    };
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { 
        name, 
        phoneNumber, // Update phone number
        roomNumber, // Update room number
        updatedAt: serverTimestamp() 
      });
      setUserProfile((prev) => ({ ...prev, name, phoneNumber, roomNumber }));
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
                placeholder="Enter your name"
              />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-control mb-3"
                aria-label="Phone number input field"
                placeholder="Enter your phone number"
              />
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="form-control mb-3"
                aria-label="Room number input field"
                placeholder="Enter your room number"
              />
              <div className="d-flex justify-content-between mb-5 mt-5">
              <button className="btn btn-primary me-2" onClick={handleUpdateProfile}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {userProfile?.name || "Not provided"}</p>
              <p><strong>Email:</strong> {userProfile?.email}</p>
              <p><strong>Phone Number:</strong> {userProfile?.phoneNumber || "Not provided"}</p>
              <p><strong>Room Number:</strong> {userProfile?.roomNumber || "Not provided"}</p>
              <button className="btn btn-primary d-flex justify-content-between mb-5 mt-5" onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
*/













/*import React, { useState, useEffect } from "react";
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
*/