import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const ShopInHotelForm = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: 1,
    specialInstructions: "",
  });

  const navigate = useNavigate();

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
      await addDoc(collection(db, "hotelShoppingOrders"), {
        ...formData,
        timestamp: new Date(),
        assignedStaff: "Porter", // Assign staff dynamically if needed
      });

      navigate("/shop-orders-summary"); // Redirect after order submission
    } catch (err) {
      console.error("Error submitting order:", err);
    }
  };

  // Primark shopping link
  const shoppingLink = "https://www.primark.com/en-ie"; // Direct link to Primark shopping page

  return (
    <Container fluid className="mt-4">
      {/* Back to Services Link */}
      <Link to="/services" className="btn btn-link text-decoration-none fw-bold">
        <i className="fa fa-backward fa-lg text-primary"> 🔙 Back to Services</i>
      </Link>

      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light mt-3">
        <h2 className="text-center fw-bold text-primary">🛍 Shop in Hotel</h2>

        {/* Shopping Link to Primark */}
        <div className="text-center mt-3">
          <a
            href={shoppingLink}
            className="btn btn-success fw-bold shadow-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            🛒 Shop at Primark
          </a>
        </div>

        {/* Booking Form */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🛒 Item Name</Form.Label>
              <Form.Control
                type="text"
                name="itemName"
                placeholder="Enter the item name"
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📦 Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min={1}
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📝 Special Instructions</Form.Label>
              <Form.Control
                as="textarea"
                name="specialInstructions"
                placeholder="Any special preferences?"
                rows={3}
                onChange={handleChange}
                className="border border-2 border-primary shadow-sm"
              />
            </Form.Group>

            <Button variant="primary fw-bold shadow-sm w-100 mt-3" type="submit">
              ✅ Place Order
            </Button>
          </Form>
        </Card>
      </Card>
    </Container>
  );
};

export default ShopInHotelForm;
