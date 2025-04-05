import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import UserProfile from "../components/UserProfile";
import Announcements from "../components/Announcements";
import Feedback from "../components/Feedback";
import Messages from "../components/Messages";
import 'bootstrap/dist/css/bootstrap.min.css';

const GuestDashboard = () => {
  return (
    <div className="container mt-5">
      <h1>Guest Dashboard</h1>
      <Tabs defaultActiveKey="profile" className="mb-3" onSelect={(key) => console.log(`Active tab: ${key}`)}>
        <Tab eventKey="profile" title="Profile" aria-label="View and edit your profile">
          <UserProfile />
        </Tab>
        <Tab eventKey="announcements" title="Announcements" aria-label="View announcements">
          <Announcements />
        </Tab>
        <Tab eventKey="feedback" title="Feedback" aria-label="Send a feed back">
          <Feedback />
        </Tab>
        <Tab eventKey="messages" title="Messages" aria-label="Read and send messages">
          <Messages />
        </Tab>
      </Tabs>
    </div>
  );
};

export default GuestDashboard;
