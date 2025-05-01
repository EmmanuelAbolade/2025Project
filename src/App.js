// src/App.js
import React, { useEffect, useState } from "react";
import "./css/style.css";
import "./css/bootstrap.min.css";
import "./css/animate.css";
import "./css/animate.min.css";
import "./App.css";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

import {
  Home,
  Booking,
  Services,
  AboutUs,
  Contact,
  PageNotFound,
  Room,
  Team,
  Testimonial,
} from "./pages/index";

import HouseKeepingRequestForm from "./pages/HouseKeepingRequestForm";
import SpaFitnessForm from "./pages/SpaFitnessForm";
import MealOrderForm from "./pages/MealOrderForm";
import ContactFrontDeskForm from "./pages/ContactFrontDeskForm";
import BookAnotherStayForm from "./pages/BookAnotherStayForm";
import BookTaxiForm from "./pages/BookTaxiForm";
import BookTourForm from "./pages/BookTourForm";
import ShopInHotelForm from "./pages/ShopInHotelForm";
import RecommendationsPage from "./pages/RecommendationsPage";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import GuestDashboard from "./pages/GuestDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import { auth } from "./firebase/firebaseConfig";
import { db } from "./firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Import the onMessageListener to listen for foreground FCM messages
import { onMessageListener } from "./initializeFCM";
import "./helpers/populateStaffProfiles";
function AppContent() {
  const location = useLocation();
  const hideNavbarAndFooter = ["/signup", "/login"];

  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // NEW: Setup a foreground FCM message listener
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        console.log("Foreground message received:", payload);
        // OPTIONAL: You can update your UI or show an in-app notification here.
      })
      .catch((err) => console.error("Error receiving foreground FCM message:", err));
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          setRole(userDoc.data()?.role || null);
        } catch (error) {
          console.error("Error fetching role:", error);
          setRole(null);
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div
          className="spinner-border text-primary"
          role="status"
          aria-label="Loading user role..."
        ></div>
        <div className="loading-container" style={{ textAlign: "center", marginTop: "200px" }}>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#123456" }}>
            GUEST-EASE Loading... Please wait.
          </p>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#177370" }}>
            WELCOME ON BOARD. YOUR COMFORT IS OUR PRIORITY.
          </p>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#177370" }}>
            Enjoy a seamless stay using <strong>GUEST-EASE</strong>. Our Concierge Assistant is just a tap away
            for all your requests! Available 24/7 to enhance your stay every step of the way!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!hideNavbarAndFooter.includes(location.pathname) && <Header role={role} />}
      <Routes>
        {/* General Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/rooms" element={<Room />} />
        <Route path="/team" element={<Team />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />

        {/* Forms */}
        <Route path="/housekeeping" element={<HouseKeepingRequestForm />} />
        <Route path="/spa-fitness" element={<SpaFitnessForm />} />
        <Route path="/meal-order" element={<MealOrderForm />} />
        <Route path="/contact-front-desk" element={<ContactFrontDeskForm />} />
        <Route path="/book-another-stay" element={<BookAnotherStayForm />} />
        <Route path="/book-taxi" element={<BookTaxiForm />} />
        <Route path="/book-tour" element={<BookTourForm />} />
        <Route path="/shop-in-hotel" element={<ShopInHotelForm />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />

        {/* Authentication Pages */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Default Home Page */}
        <Route path="/" element={<Home />} />

        {/* Dashboards with Protected Routes */}
        <Route
          path="/guest-dashboard"
          element={
            <ProtectedRoute role={role} allowedRoles={["guest"]}>
              <GuestDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute role={role} allowedRoles={["staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role={role} allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for Undefined Routes */}
        <Route path="*" element={<Navigate to="/" />} />

        {/* Fallback - Default to 404 */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      {!hideNavbarAndFooter.includes(location.pathname) && <Footer />}
    </>
  );
}

export default function App() {
  return <AppContent />;
}
