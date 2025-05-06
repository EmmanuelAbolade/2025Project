//src\pages\BookAnotherStayForm.js
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";


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
    <Container fluid className="mt-4">
      {/* Back to Services Link */}
      <Link to="/services" className="btn btn-link text-decoration-none fw-bold">
        <i className="fa fa-backward fa-lg text-primary"> 🔙 Back to Services</i>
      </Link>
  
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light mt-3">
        <h2 className="text-center fw-bold text-primary">🏨 Book Another Stay</h2>
  
        {/* Booking Form */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📅 Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                onChange={handleChange}
                aria-label="Start Date"
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📅 End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🏠 Room Type</Form.Label>
              <Form.Control
                type="text"
                name="roomType"
                placeholder="E.g., Single, Double, Suite"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📝 Additional Requests</Form.Label>
              <Form.Control
                as="textarea"
                name="additionalRequests"
                rows={3}
                placeholder="Enter any special preferences"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>
  
            <Button type="submit" variant="primary fw-bold shadow-sm w-100 mt-3">
              ✅ Submit Booking
            </Button>
          </Form>
        </Card>
      </Card>
    </Container>
  );
  
};

export default BookAnotherStayForm;
