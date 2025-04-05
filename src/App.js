//App.js to hide nav bar and footer in login and sign up pages before problem started
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import GuestDashboard from "./pages/GuestDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import { auth } from "./firebase/firebaseConfig";
import { db } from "./firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function AppContent() {
  const location = useLocation(); // Get the current route
  const hideNavbarAndFooter = ["/signup", "/login"]; // Routes to hide navbar and footer

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setRole(userDoc.data()?.role || null);
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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

        {/* Authentication Pages */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards with Protected Routes */}
        <Route
          path="/guest-dashboard"
          element={
            <ProtectedRoute role={role} allowedRole="guest">
              <GuestDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute role={role} allowedRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role={role} allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      {!hideNavbarAndFooter.includes(location.pathname) && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router basename="/2025Project">
      <AppContent />
    </Router>
  );
}
