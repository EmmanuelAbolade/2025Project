//src\pages\GuestDashboard.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { Tab, Tabs } from "react-bootstrap";
import UserProfile from "../components/UserProfile";
import Announcements from "../components/Announcements";
import Feedback from "../components/Feedback";
import GuestMessages from "../components/GuestMessages";
import RequestBank from "../components/RequestBank";
import DashboardGreeting from "../components/DashboardGreeting";
import 'bootstrap/dist/css/bootstrap.min.css';



const GuestDashboard = () => {
  const [guestName, setGuestName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(fetchedUsers);
    };
    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <>
         <h1 class= "text-start">GUEST DASHBOARD</h1>
        {/*static headers with DashboardGreeting */}
        <DashboardGreeting
            title=" Here's your personalized dashboard. Manage your profile, view your requests, send messages and explore announcements."
            name={guestName}
            
          />

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
            
            <Tab eventKey="messages" title="Messaging" aria-label="Read and send messages">
              {/* Pass currentUserId and senderLabel */}
              {auth.currentUser && (
                <GuestMessages
                  currentUserId={auth.currentUser.uid} // Firebase Authentication UID
                  senderLabel={guestName}
                  //senderLabel="Guest" // Role label
                />
              )}
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





