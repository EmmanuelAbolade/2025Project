//  src/pages/StaffDashboard.jsx
import React, { useState, useEffect } from "react";
import { Tab, Tabs, Button, Form, Container, Card } from "react-bootstrap";
import StaffMessages from "../components/StaffMessages";
import StaffAnnouncements from "../components/StaffAnnouncements";
import StaffProfile from "../components/StaffProfile";
import DashboardGreeting from "../components/DashboardGreeting";
import StaffRequestBank from "../components/StaffRequestBank";
import AssignedRequestsTable from "../components/AssignedRequestsTable";
import MealOrdersTable from "../components/MealOrdersTable"; //  Meal Orders Component
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot, doc, getDoc, getDocs, updateDoc, addDoc } from "firebase/firestore";
import UpdateNotifier from "../components/UpdateNotifier";
import AssignDriverForm from "../components/AssignDriverForm"; //  Driver Assignment Component
import StaffShoppingRequests from "../components/StaffShoppingRequests";


const StaffDashboard = () => {
  const [requests, setRequests] = useState([]); //  Assigned requests state
  const [loading, setLoading] = useState(true); //  Loading state
  const [status, setStatus] = useState("Available"); //  Staff availability
  const [staffName, setStaffName] = useState("Staff"); //  Staff name
  const [error, setError] = useState(null); //  Error state
  const [pendingBookings, setPendingBookings] = useState([]); //  Pending taxi bookings
  const [selectedBooking, setSelectedBooking] = useState(null);

  //  Get current staff ID from Firebase Auth
  const currentStaffId = auth.currentUser ? auth.currentUser.uid : null;

  //  Function to send admin notifications
  const sendNotificationToAdmin = async (message) => {
    try {
      await addDoc(collection(db, "adminNotifications"), {
        message,
        timestamp: new Date(),
        status: "Unread",
      });
    } catch (error) {
      console.error("Error sending notification to admin:", error);
    }
  };

  //  Fetch taxi bookings (Pending)
  useEffect(() => {
    const fetchTaxiBookings = async () => {
      const q = query(collection(db, "taxiBookings"), where("status", "==", "Pending"));
      const snapshot = await getDocs(q);
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingBookings(bookings);
    };

    fetchTaxiBookings();
  }, []);

  //  Fetch staff name from Firestore
  useEffect(() => {
    const fetchStaffName = async () => {
      if (!currentStaffId) return;

      try {
        const staffDoc = await getDoc(doc(db, "users", currentStaffId));
        if (staffDoc.exists()) {
          const data = staffDoc.data();
          setStaffName(data.name || "Staff");
        }
      } catch (error) {
        console.error("Error fetching staff name:", error);
        setError("Unable to fetch staff information.");
      }
    };

    fetchStaffName();
  }, [currentStaffId]);

  //  Fetch assigned housekeeping requests in real time
  useEffect(() => {
    if (!staffName) return;

    const q = query(
      collection(db, "housekeepingRequests"), 
      where("assignedStaff", "==", staffName)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(fetchedRequests);
      setLoading(false);
    }, (error) => console.error("Error in real-time Firestore listener:", error));

    return () => unsubscribe();
  }, [staffName]);

  //  Update request status
  const updateRequestStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "housekeepingRequests", id), { status: newStatus });
      alert(`Request status updated to ${newStatus}!`);
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("Failed to update the request.");
    }
  };

  //  Toggle staff availability & notify admin
  const toggleStatus = async () => {
    const newStatus = status === "Available" ? "Unavailable" : "Available";

    try {
      if (currentStaffId) {
        await updateDoc(doc(db, "users", currentStaffId), { status: newStatus });

        //  Notify admin
        await sendNotificationToAdmin(`Staff status updated: ${newStatus}`);
      }
      setStatus(newStatus);
      alert(`Your status is now: ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update your status.");
    }
  };

  if (!currentStaffId) return <p>Please log in to access the staff dashboard.</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-0 border-dark rounded p-4 bg-light">
        <h1 className="text-center fw-bold text-primary">🔧 Staff Dashboard</h1>
  
        {/* Staff Greeting */}
        <DashboardGreeting
          title="📌 Manage your profile, guest messages, announcements, requests, and meal orders here."
          name={staffName}
          className="fw-bold text-secondary text-center"
        />
  
        {/* Notifications Section */}
        <Card className="shadow-lg border border-2 border-primary rounded p-3 mt-4">
          <h2 className="fw-bold text-primary">🔔 Notifications</h2>
          <UpdateNotifier />
        </Card>
  
        {/* Availability Toggle */}
        <Card className="shadow-lg border border-3 border-success rounded p-3 mt-4">
          <h3 className="fw-bold text-success">⏳ Availability Status</h3>
          <Button variant={status === "Available" ? "success fw-bold shadow-sm w-100" : "danger fw-bold shadow-sm w-100"} onClick={toggleStatus}>
            ✅ Mark as {status === "Available" ? "Unavailable" : "Available"}
          </Button>
        </Card>
  
        {/* Navigation Tabs */}
        <Tabs defaultActiveKey="profile" className="mt-4 mb-3 shadow-sm">
          <Tab eventKey="profile" title="👤 Profile">
            <StaffProfile />
          </Tab>
          <Tab eventKey="messages" title="💬 Messaging">
            <StaffMessages currentUserId={currentStaffId} senderLabel="Staff" />
          </Tab>
          <Tab eventKey="announcements" title="📢 Announcements">
            <StaffAnnouncements />
          </Tab>
          <Tab eventKey="requestBank" title="🛠 Request Bank">
            <StaffRequestBank staffId={currentStaffId} />
          </Tab>
          <Tab eventKey="requests" title="✅ Assigned Requests">
            <AssignedRequestsTable requests={requests} updateRequestStatus={updateRequestStatus} loading={loading} />
          </Tab>
          <Tab eventKey="mealOrders" title="🍽 Meal Orders">
            <MealOrdersTable />
          </Tab>
          <Tab eventKey="shoppingRequests" title="🛍 Shopping Requests">
            <StaffShoppingRequests staffName={staffName} />
          </Tab>
          <Tab eventKey="taxiBookings" title="🚖 Taxi Bookings">
            <Card className="shadow-lg border border-3 border-warning rounded p-3 bg-light">
              <h3 className="fw-bold text-warning">🚖 Manage Taxi Bookings</h3>
  
              {/* Taxi Booking Dropdown */}
              <Form.Group>
                <Form.Label className="fw-bold">📍 Select a Booking</Form.Label>
                <Form.Control
                  as="select"
                  className="border border-2 border-primary shadow-sm"
                  onChange={(e) => {
                    const booking = pendingBookings.find(b => b.id === e.target.value);
                    setSelectedBooking(booking);
                  }}
                >
                  <option value="">-- Choose Booking --</option>
                  {pendingBookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.pickupLocation} → {booking.dropoffLocation} ({booking.pickupTime})
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
  
              {/* Booking Details */}
              {selectedBooking && (
                <Card className="mt-4 p-3 shadow-sm border border-2 border-secondary rounded">
                  <Card.Body>
                    <Card.Title className="fw-bold text-dark">📌 Booking ID: {selectedBooking.id}</Card.Title>
                    <Card.Text>📍 <strong>Pickup Location:</strong> {selectedBooking.pickupLocation}</Card.Text>
                    <Card.Text>📍 <strong>Drop-off Location:</strong> {selectedBooking.dropoffLocation}</Card.Text>
                    <Card.Text>⏰ <strong>Pickup Time:</strong> {selectedBooking.pickupTime}</Card.Text>
                    <Card.Text>📝 <strong>Special Instructions:</strong> {selectedBooking.specialInstructions || "None"}</Card.Text>
  
                    {/* Assign Driver Form */}
                    <AssignDriverForm bookingId={selectedBooking.id} />
                  </Card.Body>
                </Card>
              )}
            </Card>
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
  
};

export default StaffDashboard;
