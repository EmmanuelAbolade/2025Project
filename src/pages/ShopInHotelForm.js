import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Container } from "react-bootstrap";

const ShopInHotelForm = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: 1,
    specialInstructions: "",
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
      await addDoc(collection(db, "hotelShoppingOrders"), formData);
      alert("Order placed successfully!");
    } catch (err) {
      console.error("Error submitting order:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Shop in Hotel</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            name="itemName"
            placeholder="Enter the item name"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            min={1}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Special Instructions</Form.Label>
          <Form.Control
            as="textarea"
            name="specialInstructions"
            onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Place Order
          </Button>
        </Form>
      </Container>
    );
  };
  
  export default ShopInHotelForm;
  