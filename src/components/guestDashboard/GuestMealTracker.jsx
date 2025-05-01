//src\components\guestDashboard\GuestMealTracker.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Container } from "react-bootstrap";
import { auth, db } from "../../firebase/firebaseConfig"; 
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";

const GuestMealTracker = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
   
  // Get the current guest's email instead of UID
  const currentGuestId= auth.currentUser ? auth.currentUser.uid : null;
  // Fetch meal orders only for the logged-in guest
  useEffect(() => {
    if (!currentGuestId) {
        console.warn("No current guest email available.");
        return;
      }
    const ordersRef = collection(db, "mealOrders"); 
    //const q = query(collection(db, "mealOrders"), where("guestId", "==", currentGuestId));
    const q = query(ordersRef, where("guestId", "==", currentGuestId)); // filtering for current guest's orders
    
    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        console.log("Fetched meal orders:", fetchedOrders); // Debugging log
        setOrders(fetchedOrders);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [currentGuestId]);

  // Allow guests to remove their old orders
  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return; // Cancel deletion if guest declines

    await deleteDoc(doc(db, "mealOrders", orderId));
    alert("Order deleted successfully!");
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
          {orders.map((order, index) => (
            <tr key={order.id || index}> {/* Ensure unique keys */}
              <td>{order.timestamp?.seconds ? 
                new Date(order.timestamp.seconds * 1000).toLocaleString() : "No Timestamp"}
              </td>
              <td>
                {order.items.map((item, itemIndex) => (
                  <div key={`${order.id}-${itemIndex}`}> {/* Ensure each item has a unique key */}
                    {item.name} - €{item.price}
              </div>
        ))}
      </td>
      <td>
        <Alert variant={
          order.status === "Pending" ? "warning" : 
          order.status === "Preparing" ? "primary" : 
          order.status === "Out for Delivery" ? "info" : "success"
        }>
          {order.status || "Unknown Status"}
        </Alert>
      </td>
      <td>€{order.totalCost || "N/A"}</td>
      <td>
          <Button variant="danger" size="sm" onClick={() => deleteOrder(order.id)}>
              Remove Order
          </Button>
      </td>
    </tr>
  ))}
</tbody>

        </Table>
      ) : <p>No orders found.</p>}
    </Container>
  );
};

export default GuestMealTracker;
