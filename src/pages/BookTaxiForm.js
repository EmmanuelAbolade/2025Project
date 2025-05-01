// 📂 src/pages/BookTaxiForm.js
import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import taxiImage from "../assets/img/taxi5.png"; // ✅ Add an image for visual appeal

const BookTaxiForm = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);
  const [fareEstimate, setFareEstimate] = useState(null); // ✅ Add fare estimate state


  const handleBooking = async (event) => {
    event.preventDefault();
  
    if (!auth.currentUser) {
      alert("You must be logged in to book a taxi.");
      return;
    }
  
    if (!pickupLocation || !dropoffLocation || !pickupTime) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      await addDoc(collection(db, "taxiBookings"), {
        guestId: auth.currentUser.uid,
        pickupLocation,
        dropoffLocation,
        pickupTime,
        specialInstructions,
        fareEstimate, // ✅ Estimated taxi fare
        status: "Pending", // ✅ Booking starts as 'Pending'
        timestamp: new Date(),
      });
  
      alert("Taxi booking request submitted successfully!");
    } catch (error) {
      console.error("Error booking taxi:", error);
      alert("Failed to submit booking request.");
    }
  };
  

  return (
    <Container className="mt-4">
      <h2 className="text-center">Book a Taxi 🚕</h2>

      {/*  Stylish Image */}
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <img src={taxiImage} alt="Taxi Booking" className="img-fluid rounded shadow-sm" />
        </Col>
      </Row>

      {/*  Booking Form */}
      <Form onSubmit={handleBooking}>
        {bookingStatus && (
          <Alert variant={bookingStatus.success ? "success" : "danger"}>
            {bookingStatus.success || bookingStatus.error}
          </Alert>
        )}

        <Form.Group>
          <Form.Label>Pickup Location *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter pickup location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Drop-off Location *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter drop-off location"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Pickup Time *</Form.Label>
          <Form.Control
            type="datetime-local"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Special Instructions</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="E.g., Need a child seat"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" className="mt-4" type="submit">
          Book Taxi
        </Button>
      </Form>

      {/*  Transport System Affiliate Link */}
      <div className="text-center mt-4">
        <p>
          Prefer a direct taxi booking? Try{" "}
          <a href="https://www.uber.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            Uber
          </a>{" "}
          or{" "}
          <a href="https://www.lyft.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            Lyft
          </a>.
        </p>
      </div>
    </Container>
  );
};

export default BookTaxiForm;
