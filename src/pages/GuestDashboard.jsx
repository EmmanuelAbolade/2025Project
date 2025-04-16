
import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Tab, Tabs } from "react-bootstrap";
import UserProfile from "../components/UserProfile";
import Announcements from "../components/Announcements";
import Feedback from "../components/Feedback";
import Messages from "../components/Messages";
import RequestBank from "../components/RequestBank";
import 'bootstrap/dist/css/bootstrap.min.css';

const GuestDashboard = () => {
  const [guestName, setGuestName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuestDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setGuestName(userData?.name || "Guest");
        setRoomNumber(userData?.roomNumber || "N/A");
      }
      setLoading(false);
    };

    fetchGuestDetails();
  }, []);

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <>
          <h1>Welcome, {guestName}!</h1>
          <h5>Room Number: {roomNumber}</h5>
          <p>
            Here's your personalized dashboard. Manage your profile, view requests, and explore announcements.
          </p>
          <Tabs defaultActiveKey="profile" className="mb-3">
            <Tab eventKey="profile" title="Profile" aria-label="View and edit your profile">
              <UserProfile />
            </Tab>
            <Tab eventKey="announcements" title="Announcements" aria-label="View announcements">
              <Announcements />
            </Tab>
            <Tab eventKey="feedback" title="Feedback" aria-label="Send feedback">
              <Feedback />
            </Tab>
            <Tab eventKey="messages" title="Messages" aria-label="Read and send messages">
              <Messages />
            </Tab>
            <Tab eventKey="requestBank" title="Request Bank" aria-label="Manage your requests">
              <RequestBank />
            </Tab>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default GuestDashboard;






/*import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import UserProfile from "../components/UserProfile";
import Announcements from "../components/Announcements";
import Feedback from "../components/Feedback";
import Messages from "../components/Messages";
import RequestBank from "../components/RequestBank"; // New Component
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
        <Tab eventKey="requestBank" title="Request Bank" aria-label="Manage your requests">
          <RequestBank />
        </Tab>
      </Tabs>
    </div>
  );
};

export default GuestDashboard;
*/