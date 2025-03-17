import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Container } from "react-bootstrap";

const BookTaxiForm = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupTime: "",
    specialInstructions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "taxiBookings"), formData);
      alert("Taxi has been booked successfully!");
    } catch (err) {
      console.error("Error submitting booking:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Book a Taxi</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Pickup Location</Form.Label>
          <Form.Control
            type="text"
            name="pickupLocation"
            placeholder="Enter pickup location"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Dropoff Location</Form.Label>
          <Form.Control
            type="text"
            name="dropoffLocation"
            placeholder="Enter dropoff location"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Pickup Time</Form.Label>
          <Form.Control
            type="time"
            name="pickupTime"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Special Instructions</Form.Label>
          <Form.Control
            as="textarea"
            name="specialInstructions"
            rows={3}
            placeholder="Any specific requirements?"
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Book Taxi
        </Button>
      </Form>
    </Container>
  );
};

export default BookTaxiForm;
