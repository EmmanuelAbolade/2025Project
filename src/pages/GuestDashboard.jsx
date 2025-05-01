// src/pages/GuestDashboard.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { Tab, Tabs, Spinner, Card, Alert, Container } from "react-bootstrap";
import UserProfile from "../components/UserProfile";
import Announcements from "../components/Announcements";
import FeedbackForm from "../components/guestDashboard/FeedbackForm"; 
import GuestMessages from "../components/GuestMessages";
import GuestRequestBank from "../components/GuestRequestBank";
import DashboardGreeting from "../components/DashboardGreeting";
import GuestMealOrders from "../components/GuestMealOrders";
import UpdateNotifier from "../components/UpdateNotifier";
import TaxiBookingStatus from "../components/TaxiBookingStatus"; // ✅ Import Taxi Booking Status Component

const GuestDashboard = () => {
  const [guestName, setGuestName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [guestBookingId, setGuestBookingId] = useState(null); // ✅ Track guest's assigned taxi booking

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
    const fetchGuestTaxiBooking = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "taxiBookings"),
        where("guestId", "==", auth.currentUser.uid),
        where("status", "==", "Assigned")
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setGuestBookingId(snapshot.docs[0].id); // ✅ Get latest assigned taxi booking
      }
    };

    fetchGuestTaxiBooking();
  }, []);

  return (
    <Container fluid className="mt-5">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="fw-bold text-primary mt-2">Loading Guest Dashboard...</p>
        </div>
      ) : (
        <Card className="shadow-lg border border-0 border-dark rounded p-4 bg-light">
          <h1 className="text-center fw-bold text-primary">🏨 Guest Dashboard</h1>
  
          {/* Guest Greeting */}
          <DashboardGreeting
            title="📌 Here's your personalized dashboard. Manage your profile, view requests, messages, and announcements."
            name={guestName}
            className="fw-bold text-secondary text-center"
          />
  
          {/* Notifications Section */}
          <Card className="shadow-lg border border-2 border-primary rounded p-3 mt-4">
            <h2 className="fw-bold text-primary">🔔 Notifications</h2>
            <UpdateNotifier />
          </Card>
  
          {/* Navigation Tabs */}
          <Tabs defaultActiveKey="profile" className="mt-4 mb-3 shadow-sm">
            <Tab eventKey="profile" title="👤 Profile">
              <UserProfile />
            </Tab>
            <Tab eventKey="announcements" title="📢 Announcements">
              <Announcements />
            </Tab>
            <Tab eventKey="requestBank" title="🛠 Your Request Bank">
              <GuestRequestBank />
            </Tab>
            <Tab eventKey="messages" title="💬 Messaging">
              {auth.currentUser && (
                <GuestMessages currentUserId={auth.currentUser.uid} senderLabel="Guest" />
              )}
            </Tab>
            <Tab eventKey="feedback" title="📝 Feedback">
              <FeedbackForm />
            </Tab>
            <Tab eventKey="mealOrders" title="🍽 Meal Orders">
              <GuestMealOrders />
            </Tab>
            <Tab eventKey="taxiStatus" title="🚖 Taxi Booking Status">
              {guestBookingId ? (
                <TaxiBookingStatus bookingId={guestBookingId} />
              ) : (
                <Alert variant="warning fw-bold text-center mt-3">⚠ No assigned taxi yet.</Alert>
              )}
            </Tab>
          </Tabs>
        </Card>
      )}
    </Container>
  );
  
};

export default GuestDashboard;
