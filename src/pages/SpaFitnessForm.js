//src\pages\SpaFitnessForm.js
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Card, Container } from "react-bootstrap";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";


const SpaFitnessForm = () => {
  const [formData, setFormData] = useState({
    spaType: "",
    sessionTime: "",
    specialRequests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.spaType || !formData.sessionTime) {
      alert("Please fill out the spa type and session time.");
      return;
    }
    
    try {
      // Debugging: Check form data before submission
      console.log("Form data:", formData);
  
      await addDoc(collection(db, "spaFitnessBookings"), formData);
      alert("Spa & Fitness booking submitted successfully!");
    } catch (err) {
      console.error("Error submitting booking:", err); // Debugging
    }
  };
  
  return (
    <Container fluid className="mt-4">
      {/* Back to Services Link */}
      <Link to="/services" className="btn btn-link text-decoration-none fw-bold">
        <i className="fa fa-backward fa-lg text-primary"> 🔙 Back to Services</i>
      </Link>
  
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light mt-3">
        <h2 className="text-center fw-bold text-primary">💆‍♀️ Spa & Fitness Bookings</h2>
  
        {/* Booking Form */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🧘 Spa Type</Form.Label>
              <Form.Control
                type="text"
                name="spaType"
                placeholder="E.g., Massage, Yoga Session"
                aria-label="Enter spa type"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">⏰ Session Time</Form.Label>
              <Form.Control
                type="text"
                name="sessionTime"
                placeholder="E.g., Morning, Afternoon"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📝 Special Requests</Form.Label>
              <Form.Control
                as="textarea"
                name="specialRequests"
                placeholder="Any specific preferences or needs?"
                rows={3}
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Button variant="primary fw-bold shadow-sm w-100 mt-3" type="submit">
              ✅ Submit Booking
            </Button>
          </Form>
        </Card>
      </Card>
    </Container>
  );
  
};

export default SpaFitnessForm;
