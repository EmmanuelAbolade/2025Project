//import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Form, Button, Container } from "react-bootstrap";

const MealOrderForm = () => {
  const [formData, setFormData] = useState({
    mealType: "",
    quantity: 1,
    dietaryRestrictions: "",
  });


  const handleChange = (e) => { 
    const { name, value, type } = e.target; 
    setFormData({ ...formData, [name]: type === "number" ?
       parseInt(value) : value });
      }; 
       
       
        const handleSubmit = async (e) => {
         e.preventDefault(); 
         try { 
          await addDoc(collection(db, "mealOrders"), formData); 
          alert("Meal order submitted successfully!"); 
        } 
          catch (err) { 
            console.error("Error submitting order:", err); 
          } 
        };




/*
  const [success, setSuccess] = useState(false); // Define the success state

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === "number" ? parseInt(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "mealOrders"), {
      ...formData,
        timestamp: new Date(),
      });
      setSuccess(true); // Set success to true upon successful submission
    }
     catch (err) {
      console.error("Error submitting order:", err);
    }
  };
*/
  return (
    <Container className="mt-4">
      <h2 className="text-center">Meal Orders</h2>
      <div className="row justify-content-center">
      <div className="border rounded p-1">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Meal Type</Form.Label>
          <Form.Control
            type="text"
            name="mealType"
            placeholder="E.g., Breakfast Roll, House Special"
            aria-label="Meal Type"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            min={1}
            aria-label="Meal quantity"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Dietary Restrictions</Form.Label>
          <Form.Control
            type="text"
            name="dietaryRestrictions"
            placeholder="E.g., Gluten-Free, Vegan"
            aria-label="Dietary Restrictions"
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Submit Order
        </Button>
        
      </Form>
      </div>
      </div>
    </Container>
  );
};

export default MealOrderForm;
