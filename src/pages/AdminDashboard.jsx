
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import AdminUsers from "../components/AdminUsers";
import AdminAnnouncements from "../components/AdminAnnouncements";
import AdminMessages from "../components/AdminMessages"; // New Component
import GuestFeedback from "../components/GuestFeedback"; // New Component
import AdminDesignations from "../components/AdminDesignations"; // New Component for Staff Assignment
import AdminRecommendations from "../components/AdminRecommendations"; // New Component
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Manage users, announcements, guest feedback, and recommendations here.</p>
      <Tabs defaultActiveKey="users" className="mb-3" onSelect={(key) => console.log(`Active tab: ${key}`)}>
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