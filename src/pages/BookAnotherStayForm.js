import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Container } from "react-bootstrap";

const BookAnotherStayForm = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    roomType: "",
    additionalRequests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "anotherStayBookings"), formData);
      alert("Another stay booking submitted successfully!");
    } catch (err) {
      console.error("Error submitting booking:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Book Another Stay</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Room Type</Form.Label>
          <Form.Control
            type="text"
            name="roomType"
            placeholder="E.g., Single, Double, Suite"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Additional Requests</Form.Label>
          <Form.Control
            as="textarea"
            name="additionalRequests"
            rows={3}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-3">Submit Booking</Button>
      </Form>
    </Container>
  );
};

export default BookAnotherStayForm;
