import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Container } from "react-bootstrap";

const ContactFrontDeskForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    roomNumber: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.roomNumber || !formData.message) {
      alert("Please fill out all fields before submitting.");
      return;
    }
    
    try {
      await addDoc(collection(db, "frontDeskMessages"), formData);
      alert("Message submitted successfully!");
    } catch (err) {
      console.error("Error submitting message:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Contact Front Desk</h2>
      <div className="row justify-content-center">
      <div className="border rounded p-1">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            aria-label="Name input field"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Room Number</Form.Label>
          <Form.Control
            type="text"
            name="roomNumber"
            placeholder="Enter your room number"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            name="message"
            placeholder="Your request or concern"
            rows={3}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Submit Message
        </Button>
      </Form>
      </div>
      </div>
    </Container>
  );
};

export default ContactFrontDeskForm;
