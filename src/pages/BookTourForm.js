import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Container } from "react-bootstrap";

const BookTourForm = () => {
  const [formData, setFormData] = useState({
    tourName: "",
    numberOfPeople: 1,
    preferredDate: "",
    specialRequests: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tourBookings"), formData);
      alert("Tour has been booked successfully!");
    } catch (err) {
      console.error("Error submitting booking:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Book Tour & Attractions</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Tour Name</Form.Label>
          <Form.Control
            type="text"
            name="tourName"
            placeholder="E.g., City Tour, Museum Visit"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Number of People</Form.Label>
          <Form.Control
            type="number"
            name="numberOfPeople"
            min={1}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Preferred Date</Form.Label>
          <Form.Control
            type="date"
            name="preferredDate"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Special Requests</Form.Label>
          <Form.Control
            as="textarea"
            name="specialRequests"
            rows={3}
            placeholder="Any specific requests?"
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Book Tour
        </Button>
      </Form>
    </Container>
  );
};

export default BookTourForm;
