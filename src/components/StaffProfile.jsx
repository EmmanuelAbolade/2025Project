// src/components/StaffProfile.jsx

import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { Card, Form, Button, Spinner, Image } from "react-bootstrap";
import CloudinaryUpload from "./CloudinaryUpload";

const StaffProfile = () => {
  // We initialize the profile with enhanced fields:
  // name, email, profilePic, and bio.
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePic: "",
    bio: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              name: data.name || "",
              email: data.email || "",
              profilePic: data.profilePic || "",
              bio: data.bio || "",
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    setSaving(true);
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          ...profile,
          updatedAt: serverTimestamp(),
        });
        setEditing(false);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Profile update failed!");
      }
    }
    setSaving(false);
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
        <h3>Staff Profile</h3>
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
              {/* Email remains read-only once set */}
              <Form.Control type="email" value={profile.email} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
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
                    width="120"
                    height="120"
                    alt="Profile"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
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
            {profile.profilePic ? (
              <Image
                src={profile.profilePic}
                roundedCircle
                width="120"
                height="120"
                alt="Profile"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "50%",
                }}
              />
            )}
            <p className="mt-3">
              <strong>Name:</strong> {profile.name || "Not provided"}
            </p>
            <p>
              <strong>Email:</strong> {profile.email || "Not provided"}
            </p>
            <p>
              <strong>Bio:</strong> {profile.bio || "No bio added yet."}
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

export default StaffProfile;