//  src/pages/MealOrderForm.js
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Table, Alert, Row, Col, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import PaymentForm from "../components/PaymentForm"; //  Import Stripe Payment Component

//  Meal options available for selection
const mealOptions = [
  { name: "Kid's Meal", price: 10, image: `${process.env.PUBLIC_URL}/assets/img/kids-meal.png` },
  { name: "Small Meal", price: 20, image: `${process.env.PUBLIC_URL}/assets/img/small-meal.png` },
  { name: "Medium Meal", price: 35, image: `${process.env.PUBLIC_URL}/assets/img/medium-meal.png` },
  { name: "Large Meal", price: 55, image: `${process.env.PUBLIC_URL}/assets/img/large-meal.png` },
  { name: "Special Meal", price: 100, image: `${process.env.PUBLIC_URL}/assets/img/special-meal.png` },
];

//  Drink options available
const drinkOptions = [
  { name: "1L Non-Alcoholic Wine", price: 10 },
  { name: "1L Juice", price: 10 },
  { name: "15cl Spirit", price: 20 },
  { name: "25cl Fizzy Drink", price: 5 },
];

const MealOrderForm = () => {
  //  Initialize cart with local storage for persistence
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("guestCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedDrink, setSelectedDrink] = useState("");
  const [preferences, setPreferences] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false); //  Track payment status

  //  Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("guestCart", JSON.stringify(cart));
  }, [cart]);

  //  Add meal to cart
  const handleAddMealToCart = (meal) => {
    setCart([...cart, meal]);
  };

  //  Add drink to cart
  const handleAddDrinkToCart = () => {
    if (selectedDrink) {
      setCart([...cart, { name: selectedDrink, price: drinkOptions.find(d => d.name === selectedDrink).price }]);
      setSelectedDrink(""); 
    } else {
      alert("Please select a drink.");
    }
  };

  //  Remove item from cart before checkout
  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1); // Remove item at selected index
    setCart(updatedCart);
  };

  // 🛍 Handle checkout with confirmation prompt & Stripe payment
  const handleCheckout = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to place an order.");
      return;
    }

    //  Prevent checkout if the cart is empty
    if (cart.length === 0) {
      alert("Your cart is empty! Please add at least one item before checkout.");
      return;
    }

    //  Ensure payment is completed before checkout
    if (!paymentCompleted) {
      alert("Please complete payment before submitting your order.");
      return;
    }

    //  Ask guests if they wish to continue before placing the order
    const confirmCheckout = window.confirm("Are you sure you want to submit this order?");
    if (!confirmCheckout) return; //  Cancel checkout if they decline

    //  Fetch guest details
    const guestsRef = collection(db, "guests");
    const emailQuery = query(guestsRef, where("email", "==", auth.currentUser.email));
    const emailSnapshot = await getDocs(emailQuery);

    if (emailSnapshot.empty) {
      alert("Guest profile not found. Please update your details.");
      return;
    }

    const guestData = emailSnapshot.docs[0].data();

    //  Store meal order in Firestore
    await addDoc(collection(db, "mealOrders"), {
      guestId: auth.currentUser.uid,
      email: guestData.email,
      roomNumber: guestData.roomNumber,
      items: cart,
      totalCost: cart.reduce((acc, item) => acc + item.price, 0),
      status: "Pending",
      timestamp: new Date(),
      preferences
    });

    //  Clear cart after successful checkout
    setCart([]);
    localStorage.removeItem("guestCart");
    setPreferences("");
    setPaymentCompleted(false);
    alert("Meal order submitted successfully!");
  };

  return (
    <Container fluid className="mt-4">
      {/* Back to Services Link */}
      <Link to="/services" className="btn btn-link text-decoration-none fw-bold">
        <i className="fa fa-backward fa-lg text-primary"> 🔙 Back to Services</i>
      </Link>
  
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light mt-3">
        <h2 className="text-center fw-bold text-primary">🍽 Order Your Meal</h2>
  
        {/* Meal Selection */}
        <h3 className="fw-bold text-secondary">🥗 Meals</h3>
        <Row>
          {mealOptions.map((meal) => (
            <Col md={4} key={meal.name} className="mb-3">
              <Card className="text-center shadow-lg rounded border border-2 border-secondary">
                <Card.Img variant="top" src={meal.image} alt={meal.name} className="rounded-top"/>
                <Card.Body>
                  <Card.Title className="fw-bold">{meal.name} - €{meal.price}</Card.Title>
                  <Button variant="success fw-bold shadow-sm w-100" onClick={() => handleAddMealToCart(meal)}>
                    ➕ Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
  
        {/* Refreshments Selection */}
        <h3 className="fw-bold text-secondary mt-4">🍹 Refreshments</h3>
        <Form.Group>
          <Form.Label className="fw-bold">Choose a Drink</Form.Label>
          <Form.Control as="select" value={selectedDrink} onChange={(e) => setSelectedDrink(e.target.value)} className="border border-2 border-primary shadow-sm">
            <option value="">Select a drink</option>
            {drinkOptions.map((drink) => (
              <option key={drink.name} value={drink.name}>
                {drink.name} - €{drink.price}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="success fw-bold shadow-sm mt-3 w-100" onClick={handleAddDrinkToCart}>
          🍹 Add Drink to Cart
        </Button>
      </Card>
  
      {/* Display Cart */}
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light mt-4">
        <h3 className="fw-bold text-success">🛍 Your Cart</h3>
        {cart.length > 0 ? (
          <Table striped bordered hover responsive className="text-center">
            <thead className="bg-primary text-white">
              <tr>
                <th>Item</th>
                <th>Price (€)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>€{item.price}</td>
                  <td>
                    <Button variant="danger fw-bold shadow-sm" size="sm" onClick={() => handleRemoveFromCart(index)}>
                      🗑 Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="warning fw-bold text-center mt-3">⚠ No items in your cart yet.</Alert>
        )}
  
        {/* Checkout Button */}
        <Button variant="primary fw-bold shadow-sm mt-3 w-100 mb-3" onClick={handleCheckout}>
          ✅ Checkout & Submit Order
        </Button>
      </Card>
  
      {/* Payment Section */}
      <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-light mt-4">
        <h6 className="fw-bold text-dark">💳 Secure Payment (if you wish to pay now)</h6>
        <PaymentForm totalAmount={cart.reduce((acc, item) => acc + item.price, 0)} />
      </Card>
    </Container>
  );
  
};

export default MealOrderForm;
