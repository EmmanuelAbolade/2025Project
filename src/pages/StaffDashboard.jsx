import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import StaffMessages from "../components/StaffMessages";
import StaffAnnouncements from "../components/StaffAnnouncements";
import StaffProfile from "../components/StaffProfile";
import 'bootstrap/dist/css/bootstrap.min.css';

const StaffDashboard = () => {
  return (
    <div className="container mt-5">
      <h1>Staff Dashboard</h1>
      <p>Welcome, Staff! Manage your profile, guest messages, and announcements here.</p>
      <Tabs defaultActiveKey="profile" className="mb-3">
        <Tab eventKey="profile" title="Profile" aria-label="Manage Profile">
          <StaffProfile />
        </Tab>
        <Tab eventKey="messages" title="Messages" aria-label="View Messages">
          <StaffMessages />
        </Tab>
        <Tab eventKey="announcements" title="Announcements" aria-label="View Announcements">
          <StaffAnnouncements />
        </Tab>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;
