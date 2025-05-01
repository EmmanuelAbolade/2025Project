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
    if (!user) return;
    //if (user) {
      setSaving(true);
      try {
        await updateDoc(doc(db, "users", user.uid), {
          name: profile.name,
          phoneNumber: profile.phoneNumber,
          roomNumber: profile.roomNumber,
          profilePic: profile.profilePic,
          updatedAt: serverTimestamp(),
        });
        setEditing(false);
        alert("Profile updated!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Update failed!");
      }
      setSaving(false);
    //}
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
 