import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useAuth } from "../firebase/auth"; // Custom hook for authentication
import { useNavigate, Link } from "react-router-dom";


const BookTourForm = () => {
  const [formData, setFormData] = useState({
    tourName: "",
    numberOfPeople: 1,
    preferredDate: "",
    specialRequests: "",
  });

  const { user } = useAuth(); // Get the authenticated user

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tourName || !formData.numberOfPeople || !formData.preferredDate) {
      alert("Please fill out all required fields.");
      return;
    }



    if (!user) { // Check if the user is authenticated
      alert("You must be logged in to book a tour.");
      return;
    }


    try {
      await addDoc(collection(db, "tourBookings"), formData);
      alert("Tour has been booked successfully!");
    } catch (err) {
      console.error("Error submitting booking:", err);
    }
  };
  return (
    <Container fluid className="mt-4">
      {/* Back to Services Link */}
      <Link to="/services" className="btn btn-link text-decoration-none fw-bold">
        <i className="fa fa-backward fa-lg text-primary"> 🔙 Back to Services</i>
      </Link>
  
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light mt-3">
        <h2 className="text-center fw-bold text-primary">🌍 Book Tour & Attractions</h2>
  
        {/* Booking Form */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📌 Tour Name</Form.Label>
              <Form.Control
                type="text"
                name="tourName"
                placeholder="E.g., City Tour, Museum Visit"
                aria-label="Tour name input field"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">👥 Number of People</Form.Label>
              <Form.Control
                type="number"
                name="numberOfPeople"
                min={1}
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📅 Preferred Date</Form.Label>
              <Form.Control
                type="date"
                name="preferredDate"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📝 Special Requests</Form.Label>
              <Form.Control
                as="textarea"
                name="specialRequests"
                rows={3}
                placeholder="Any specific requests?"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Button variant="primary fw-bold shadow-sm w-100 mt-3" type="submit">
              ✅ Book Tour
            </Button>
          </Form>
        </Card>
      </Card>
    </Container>
  );
  
};

export default BookTourForm;
