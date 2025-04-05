import React from "react";
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
