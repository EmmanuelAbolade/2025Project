import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Container } from "react-bootstrap";

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
    try {
      await addDoc(collection(db, "spaFitnessBookings"), formData);
      alert("Spa & Fitness booking submitted successfully!");
    } catch (err) {
      console.error("Error submitting booking:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Spa & Fitness Bookings</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Spa Type</Form.Label>
          <Form.Control
            type="text"
            name="spaType"
            placeholder="E.g., Massage, Yoga Session"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Session Time</Form.Label>
          <Form.Control
            type="text"
            name="sessionTime"
            placeholder="E.g., Morning, Afternoon"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Special Requests</Form.Label>
          <Form.Control
            as="textarea"
            name="specialRequests"
            placeholder="Any specific preferences or needs?"
            rows={3}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Submit Booking
        </Button>
      </Form>
    </Container>
  );
};

export default SpaFitnessForm;
