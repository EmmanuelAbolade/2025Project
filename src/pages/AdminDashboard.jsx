//src\pages\AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Tab, Tabs, Spinner, Button, Offcanvas, Container, Card, Alert, ListGroup } from "react-bootstrap";
import AdminUsers from "../components/AdminUsers";
import AdminAnnouncements from "../components/AdminAnnouncements";
import AdminMessages from "../components/AdminMessages";
import AdminFeedback from "../components/adminDashboard/AdminFeedback";
import AdminDesignations from "../components/AdminDesignations";
import AdminRecommendations from "../components/AdminRecommendations";
import AdminProfile from "../components/AdminProfile";
import DashboardGreeting from "../components/DashboardGreeting";
import DeleteOldConversationsButton from "../components/DeleteOldConversationsButton";
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, db } from "../firebase/firebaseConfig";
import { populateStaffProfiles } from "../helpers/populateStaffProfiles";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import UpdateNotifier from "../components/UpdateNotifier";


const AdminDashboard = () => {
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [staffProfiles, setStaffProfiles] = useState([]); // State for staff profiles
  const [showOffcanvas, setShowOffcanvas] = useState(false); // State for Offcanvas visibility
  const currentStaffId = auth.currentUser ? auth.currentUser.uid : null;
  const [requests, setRequests] = useState([]); // State for storing admin assignments
  const [error, setError] = useState(null); // Tracks error messages
  
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

  useEffect(() => {
    const fetchStaffProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "StaffProfiles"));
        const fetchedProfiles = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStaffProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Error fetching staff profiles:", error);
      }
    };

    fetchStaffProfiles();
  }, []);

  const handleToggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas); // Toggle visibility
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const refreshAssignments = async () => {
    setLoading(true); // Optional: Add a loading indicator
    const q = query(
      collection(db, "housekeepingRequests"), // Firestore collection
      where("assignedStaff", "==", currentStaffId) // Filter by assigned staff
    );
  
    try {
      const querySnapshot = await getDocs(q); // Fetch Firestore data
      const fetchedAssignments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(fetchedAssignments); // Update state with assignments
    } catch (error) {
      console.error("Error refreshing assignments:", error); // Log errors
    } finally {
      setLoading(false); // End loading indicator
    }
  };
  
  

  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-0 border-dark rounded p-4 bg-light">
        <h1 className="text-center fw-bold text-primary">⚙️ Admin Dashboard</h1>
  
        {/* Admin Greeting */}
        <DashboardGreeting
          title="📌 Manage users, announcements, guest feedback, recommendations, guest requests, and staff assignments."
          name={adminName}
          className="fw-bold text-secondary text-center"
        />
  
        {/* Notifications Section */}
        <Card className="shadow-lg border border-2 border-primary rounded p-3 mt-4">
          <h2 className="fw-bold text-primary">🔔 Notifications</h2>
          <UpdateNotifier />
        </Card>
  
        {/* Action Buttons */}
        <div className="d-flex flex-wrap justify-content-between mt-4">
          <Button variant="primary fw-bold shadow-sm w-100 mb-2" onClick={handleToggleOffcanvas}>
            🏷 View Staff Profiles
          </Button>
          <Button variant="primary fw-bold shadow-sm w-100 mb-2" onClick={refreshAssignments}>
            🔄 Refresh Assignments
          </Button>
        </div>
  
        {/* Tabs Section */}
        <Tabs defaultActiveKey="users" className="mt-4 mb-3 shadow-sm">
          <Tab eventKey="profile" title="👤 Profile">
            <AdminProfile />
          </Tab>
          <Tab eventKey="users" title="👥 Users" aria-label="Manage Users">
            <AdminUsers />
          </Tab>
          <Tab eventKey="announcements" title="📢 Announcements" aria-label="Manage Announcements">
            <AdminAnnouncements />
          </Tab>
          <Tab eventKey="messages" title="💬 Messaging" aria-label="Communicate with staff and guests">
            {auth.currentUser && (
              <AdminMessages currentUserId={auth.currentUser.uid} senderLabel={adminName} />
            )}
          </Tab>
          <Tab eventKey="feedback" title="📝 Feedback">
            <AdminFeedback />
          </Tab>
          <Tab eventKey="recommendations" title="🌍 Recommendations">
            <AdminRecommendations />
          </Tab>
          <Tab eventKey="designations" title="🏷 Designations">
            <AdminDesignations />
          </Tab>
        </Tabs>
  
        {/* Manage Old Conversations */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-3 bg-white mt-4">
          <h3 className="fw-bold text-dark">🗑 Manage Old Conversations</h3>
          <DeleteOldConversationsButton days={30} label="❌ Delete Conversations Older Than 30 Days" />
          <DeleteOldConversationsButton days={60} label="⚠ Delete Conversations Older Than 60 Days" />
          <DeleteOldConversationsButton days={90} label="🕰 Delete Conversations Older Than 90 Days" />
          <Button variant="danger fw-bold shadow-sm w-100 mt-2" onClick={populateStaffProfiles}>
            🔄 Populate Staff Profiles from Users
          </Button>
        </Card>
  
        {/* Offcanvas for Staff Profiles */}
        <Offcanvas show={showOffcanvas} onHide={handleToggleOffcanvas} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="fw-bold text-primary">🏢 Staff Profiles</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {loading ? (
              <Spinner animation="border" variant="primary" />
            ) : staffProfiles.length > 0 ? (
              <ListGroup variant="flush">
                {staffProfiles.map((staff) => (
                  <ListGroup.Item key={staff.id} className="shadow-sm p-2">
                    <strong className="fw-bold text-dark">{staff.name}</strong>
                    <br />
                    <small className="text-secondary">{staff.role}</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Alert variant="warning fw-bold text-center">⚠ No staff profiles available.</Alert>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </Card>
    </Container>
  );
  
};

export default AdminDashboard;
