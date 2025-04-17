//src\pages\AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Tab, Tabs, Spinner } from "react-bootstrap";
import AdminUsers from "../components/AdminUsers";
import AdminAnnouncements from "../components/AdminAnnouncements";
import AdminMessages from "../components/AdminMessages"; // New Component
import GuestFeedback from "../components/GuestFeedback"; // New Component
import AdminDesignations from "../components/AdminDesignations"; // New Component for Staff Assignment
import AdminRecommendations from "../components/AdminRecommendations"; // New Component
import AdminGuestRequests from "../components/AdminGuestRequests"; // Newly created
import AdminProfile from "../components/AdminProfile"; // New: Admin Profile
import DashboardGreeting from "../components/DashboardGreeting";
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          if (adminDoc.exists()) {
            const data = adminDoc.data();
            setAdminName(data.name || "Admin");
          }
        } catch (error) {
          console.error("Error fetching admin name:", error);
        }
      }
      setLoading(false);
    };

    fetchAdminName();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }


  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
      <DashboardGreeting
        title="Manage users, announcements, guest feedback, recommendations, guest requests, and staff assignments."
        name={adminName}
      />
      <Tabs defaultActiveKey="users" className="mb-3" onSelect={(key) => console.log(`Active tab: ${key}`)}>
      <Tab eventKey="profile" title="Profile">
          <AdminProfile />
        </Tab>
        <Tab eventKey="users" title="Users" aria-label="Manage Users">
          <AdminUsers />
        </Tab>
        <Tab eventKey="announcements" title="Announcements" aria-label="Manage Announcements">
          <AdminAnnouncements />
        </Tab>
        <Tab eventKey="messages" title="Messages" aria-label="Communicate with staff and guests">
          <AdminMessages /> {/* New tab for messaging */}
        </Tab>
        <Tab eventKey="feedback" title="Feedback" aria-label="View and manage guest feedback">
          <GuestFeedback /> {/* New tab for feedback management */}
        </Tab>
        <Tab eventKey="recommendations" title="Recommendations" aria-label="Manage recommendations">
          <AdminRecommendations /> {/* New tab for recommendations */}
        </Tab>
        <Tab eventKey="guestRequests" title="Guest Requests">
          <AdminGuestRequests />
        </Tab>
        {/* New Tab for Designations */}
        <Tab eventKey="designations" title="Designations" aria-label="Manage staff designations/assignments">
          <AdminDesignations />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;














/*import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import AdminUsers from "../components/AdminUsers";
import AdminAnnouncements from "../components/AdminAnnouncements";
import 'bootstrap/dist/css/bootstrap.min.css';


const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Manage users and announcements here.</p>
      <Tabs defaultActiveKey="users" className="mb-3" onSelect={(key) => console.log(`Active tab: ${key}`)}>
        <Tab eventKey="users" title="Users" aria-label="Manage Users">
          <AdminUsers />
        </Tab>
        <Tab eventKey="announcements" title="Announcements" aria-label="Manage Announcements">
          <AdminAnnouncements />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
*/