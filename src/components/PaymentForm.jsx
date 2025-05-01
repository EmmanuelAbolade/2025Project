import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Container, Alert } from "react-bootstrap";
import "../css/style.css"; // Import a CSS file for custom styling
import { FaCreditCard } from 'react-icons/fa'; // Importing Font Awesome icon

// ✅ Replace with your Stripe Public Key
const stripePromise = loadStripe("YOUR_STRIPE_PUBLISHABLE_KEY");

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setPaymentStatus({ error: error.message });
      return;
    }

    const response = await fetch("/process-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount, paymentMethodId: paymentMethod.id }),
    });

    const paymentResult = await response.json();
    if (paymentResult.success) {
      setPaymentStatus({ success: "Payment successful!" });
    } else {
      setPaymentStatus({ error: "Payment failed. Please try again." });
    }
  };

  return (
    <Container className="mt-4 payment-form-container">
      <h2 className="text-center payment-form-title">
      <FaCreditCard /> Payment Checkout</h2>
      {paymentStatus && (
        <Alert variant={paymentStatus.success ? "success" : "danger"}>
          {paymentStatus.success || paymentStatus.error}
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="form-group">
        <CardElement className="form-control mb-3" />
        <Button variant="success" className="mt-3" type="submit" disabled={!stripe}>
          Pay Now (€{totalAmount})
        </Button>
      </form>
    </Container>
  );
};

const PaymentForm = ({ totalAmount }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm totalAmount={totalAmount} />
  </Elements>
);

export default PaymentForm;
