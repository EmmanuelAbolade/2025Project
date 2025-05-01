// 📂 src/components/MealOrdersTable.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, deleteDoc, onSnapshot, updateDoc, doc, where, query } from "firebase/firestore";
import { Table, Button, Alert, Container, Card, Form } from "react-bootstrap";

const MealOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(""); // 🔍 Filter selection

  // Get current guest's email
  const currentGuestEmail = auth.currentUser ? auth.currentUser.email : null;

  //  Fetch meal orders only for the logged-in guest in real time
  useEffect(() => {
    if (!currentGuestEmail) return;

    const ordersRef = collection(db, "mealOrders");
    const q = query(ordersRef, where("email", "==", currentGuestEmail));
    
    //  Real-time listener for orders update
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup when component unmounts
  }, [currentGuestEmail]);

  //  Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, "mealOrders", orderId);
    await updateDoc(orderRef, { status: newStatus });
    
    //  Update local orders state after Firestore update
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  //  Filter orders by status
  const filteredOrders = filterStatus ? orders.filter(order => order.status === filterStatus) : orders;

 // Bulk delete orders older than the selected period
 const deleteOldOrders = async (days) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days); // Calculate date threshold

  const oldOrders = orders.filter(order => order.timestamp.toDate() < cutoffDate);

  if (oldOrders.length === 0) {
    alert(`No orders older than ${days} days.`);
    return;
  }

  const confirmDelete = window.confirm(`Are you sure you want to delete ${oldOrders.length} meal orders older than ${days} days?`);
    if (!confirmDelete) return; // Cancel deletion if staff declines

  for (const order of oldOrders) {
    await deleteDoc(doc(db, "mealOrders", order.id));
  }

  alert(`Deleted ${oldOrders.length} meal orders older than ${days} days.`);
};

return (
  <Container fluid className="mt-5">
    <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
      <h3 className="fw-bold text-primary">🍽 Meal Orders Management</h3>

      {/* Order Status Filter */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">🔍 Filter by Status</Form.Label>
        <Form.Control 
          as="select" 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)} 
          className="border border-2 border-primary shadow-sm"
        >
          <option value="">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </Form.Control>
      </Form.Group>

      {/* Bulk Delete Old Orders */}
      <Card className="shadow-lg border border-3 border-danger rounded p-4 bg-light mb-4">
        <h4 className="fw-bold text-danger">🗑 Manage Old Orders</h4>
        <div className="d-flex flex-wrap justify-content-between">
          <Button variant="danger fw-bold shadow-sm" onClick={() => deleteOldOrders(7)} className="w-100 mb-2">
            ❌ Delete Orders Older Than 7 Days
          </Button>
          <Button variant="warning fw-bold shadow-sm" onClick={() => deleteOldOrders(30)} className="w-100 mb-2">
            ⚠ Delete Orders Older Than 30 Days
          </Button>
          <Button variant="secondary fw-bold shadow-sm" onClick={() => deleteOldOrders(60)} className="w-100">
            🕰 Delete Orders Older Than 60 Days
          </Button>
        </div>
      </Card>

      {loading ? (
        <p className="text-center fw-bold text-warning">⏳ Loading orders...</p>
      ) : (
        <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
          <Table striped bordered hover responsive className="text-center">
            <thead className="bg-primary text-white">
              <tr>
                <th>Guest Email</th>
                <th>Room Number</th>
                <th>Items</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.email}</td>
                  <td>{order.roomNumber}</td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index}>🍽 {item.name} - €{item.price}</div>
                    ))}
                  </td>
                  <td>
                    <Alert variant={
                      order.status === "Pending" ? "warning" :
                      order.status === "Preparing" ? "primary" :
                      order.status === "Out for Delivery" ? "info" :
                      "success"
                    }>
                      {order.status}
                    </Alert>
                  </td>
                  <td>
                    {/* Allow staff to update order status dynamically */}
                    {order.status === "Pending" && (
                      <Button variant="primary fw-bold shadow-sm w-100" onClick={() => updateOrderStatus(order.id, "Preparing")}>
                        🔄 Mark as Preparing
                      </Button>
                    )}
                    {order.status === "Preparing" && (
                      <Button variant="info fw-bold shadow-sm w-100" onClick={() => updateOrderStatus(order.id, "Out for Delivery")}>
                        🚚 Mark as Out for Delivery
                      </Button>
                    )}
                    {order.status === "Out for Delivery" && (
                      <Button variant="success fw-bold shadow-sm w-100" onClick={() => updateOrderStatus(order.id, "Delivered")}>
                        ✅ Mark as Delivered
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Card>
  </Container>
);

};

export default MealOrdersTable;
