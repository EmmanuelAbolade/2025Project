//src\components\GuestMealOrders.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Container } from "react-bootstrap";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

const GuestMealOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const currentGuestId = auth.currentUser ? auth.currentUser.uid : null; 

  useEffect(() => {
    if (!currentGuestId) return;

    const q = query(collection(db, "mealOrders"), where("guestId", "==", currentGuestId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentGuestId]);

  const handleCancelOrder = async (id) => {
    if (window.confirm("Cancel this order?")) {
      await deleteDoc(doc(db, "mealOrders", id));
      alert("Order canceled!");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Your Meal Orders</h2>
      
      {loading ? <p>Loading orders...</p> : orders.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Items Ordered</th>
              <th>Status</th>
              <th>Total Cost (€)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{new Date(order.timestamp?.toDate()).toLocaleString()}</td>
                <td>{order.items.map((item) => `${item.name} - €${item.price}`).join(", ")}</td>
                <td>
                  <Alert variant={
                    order.status === "Pending" ? "warning" : 
                    order.status === "Preparing" ? "primary" : 
                    order.status === "Out for Delivery" ? "info" : "success"
                  }>
                    {order.status}
                  </Alert>
                </td>
                <td>€{order.totalCost}</td>
                <td>
                  {order.status === "Pending" && (
                    <Button variant="danger" onClick={() => handleCancelOrder(order.id)}>
                      Cancel Order
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : <p>No orders found.</p>}
    </Container>
  );
};

export default GuestMealOrders;
