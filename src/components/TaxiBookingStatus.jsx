// 📂 src/components/TaxiBookingStatus.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { Container, Card, Alert, Button, Row, Col } from "react-bootstrap";

const TaxiBookingStatus = ({ bookingId }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {
        const bookingRef = doc(db, "taxiBookings", bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (bookingSnap.exists()) {
          setBooking(bookingSnap.data());
        } else {
          setBooking(null);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        setBooking(null);
      }

      setLoading(false);
    };

    fetchBooking();
  }, [bookingId]);

  const handleDeleteBooking = async () => {
    if (!window.confirm("🚨 Are you sure you want to delete this booking?")) return;

    try {
      await deleteDoc(doc(db, "taxiBookings", bookingId));
      setBooking(null);
      alert("🚕 Booking deleted successfully.");
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  if (loading) return <p className="text-center fw-bold text-warning">⏳ Loading booking details...</p>;
  if (!booking) return <Alert variant="danger" className="text-center fw-bold">⚠ No booking details found. Try again later.</Alert>;

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-lg border border-4 border-dark rounded bg-light">
        <h2 className="text-center text-primary fw-bold mb-3">🚖 Your Taxi Booking</h2>

        <Row>
          {/* ✅ Booking Details Column */}
          <Col md={6} className="border-end pe-4">
            <h4 className="fw-bold text-dark">📌 Booking Information</h4>
            <p><strong>Pickup:</strong> {booking.pickupLocation} → <strong>Drop-off:</strong> {booking.dropoffLocation}</p>
            <p><strong>Pickup Time:</strong> {booking.pickupTime}</p>
            <p><strong>Special Instructions:</strong> {booking.specialInstructions || "None"}</p>
            <p><strong>Fare Estimate:</strong> {booking.fareEstimate ? `$${booking.fareEstimate}` : "Not provided"}</p>
          </Col>

          {/* ✅ Assigned Driver Column */}
          <Col md={6} className="ps-4">
            <h4 className="fw-bold text-success">🧑‍✈️ Assigned Driver</h4>
            {booking.status === "Assigned" ? (
              <>
                <p><strong>Driver Name:</strong> {booking.driverName}</p>
                <p><strong>Contact:</strong> {booking.driverContact}</p>
                <p><strong>Vehicle Number:</strong> {booking.vehicleNumber}</p>
              </>
            ) : (
              <Alert variant="warning" className="text-center fw-bold">⏳ Your taxi is awaiting driver assignment.</Alert>
            )}
          </Col>
        </Row>

        <div className="text-center mt-4">
          <Button variant="danger" className="fw-bold" onClick={handleDeleteBooking}>
            🗑 Delete Booking
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default TaxiBookingStatus;
