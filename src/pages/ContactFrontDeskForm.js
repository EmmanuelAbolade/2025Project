import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";


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
    <Container fluid className="mt-4">
      {/* Back to Services Link */}
      <Link to="/services" className="btn btn-link text-decoration-none fw-bold">
        <i className="fa fa-backward fa-lg text-primary"> 🔙 Back to Services</i>
      </Link>
  
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light mt-3">
        <h2 className="text-center fw-bold text-primary">☎ Contact Front Desk</h2>
  
        {/* Contact Form */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">👤 Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                aria-label="Name input field"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🏨 Room Number</Form.Label>
              <Form.Control
                type="text"
                name="roomNumber"
                placeholder="Enter your room number"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📝 Message</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                placeholder="Your request or concern"
                rows={3}
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Button variant="primary fw-bold shadow-sm w-100 mt-3" type="submit">
              ✅ Submit Message
            </Button>
          </Form>
        </Card>
      </Card>
    </Container>
  );
  
};

export default ContactFrontDeskForm;
