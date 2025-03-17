import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import HomePage from "./pages/HomePage";
import HouseKeepingRequestForm from "./pages/HouseKeepingRequestForm";
import SpaFitnessForm from "./pages/SpaFitnessForm";
import MealOrderForm from "./pages/MealOrderForm";
import ContactFrontDeskForm from "./pages/ContactFrontDeskForm";
import BookAnotherStayForm from "./pages/BookAnotherStayForm";
import BookTaxiForm from "./pages/BookTaxiForm";
import BookTourForm from "./pages/BookTourForm";
import ShopInHotelForm from "./pages/ShopInHotelForm";





import React from "react";
import "./css/style.css";
import "./css/bootstrap.min.css";
import "./css/animate.css";
import "./css/animate.min.css";
import "./App.css";
import Header from "./components/common/Header";
//import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
import Footer from "./components/common/Footer";

export default function App() {
  return (
    <>
      <div>
        <Router basename="/2025Project">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/rooms" element={<Room />} />
            <Route path="/team" element={<Team />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/housekeeping" element={<HouseKeepingRequestForm />} />
            <Route path="/spa-fitness" element={<SpaFitnessForm />} />
            <Route path="/meal-order" element={<MealOrderForm />} />
            <Route path="/contact-front-desk" element={<ContactFrontDeskForm />} />
            <Route path="/book-another-stay" element={<BookAnotherStayForm />} />
            <Route path="/book-taxi" element={<BookTaxiForm />} />
            <Route path="/book-tour" element={<BookTourForm />} />
            <Route path="/shop-in-hotel" element={<ShopInHotelForm />} />

            <Route path="/*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </Router>
      </div>
    </>
  );
}
