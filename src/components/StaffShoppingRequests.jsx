import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { Table, Button, Card, Container, Alert } from "react-bootstrap";

const StaffShoppingRequests = ({ staffName }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShoppingRequests = async () => {
      const q = query(collection(db, "hotelShoppingOrders"), where("assignedStaff", "==", staffName));
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(orders);
      setLoading(false);
    };

    if (staffName) fetchShoppingRequests();
  }, [staffName]);

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "hotelShoppingOrders", id), { status: newStatus });
      alert(`Order status updated to ${newStatus}!`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order.");
    }
  };

  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h3 className="text-start fw-bold text-primary">🛍 Shopping Requests</h3>
        
        {loading ? (
          <Alert variant="warning fw-bold text-center mt-3">⏳ Loading shopping requests...</Alert>
        ) : requests.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead className="bg-primary text-white">
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Special Instructions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold">{order.itemName}</td>
                  <td>{order.quantity}</td>
                  <td className="text-muted fw-bold">{order.specialInstructions}</td>
                  <td className="fw-bold text-dark">{order.status || "Pending"}</td>
                  <td>
                    {order.status === "pending" && (
                      <Button variant="primary fw-bold shadow-sm" size="sm" onClick={() => updateOrderStatus(order.id, "processing")}>
                        🔄 Process
                      </Button>
                    )}
                    {order.status === "processing" && (
                      <Button variant="success fw-bold shadow-sm" size="sm" onClick={() => updateOrderStatus(order.id, "completed")}>
                        ✅ Complete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info fw-bold text-center mt-3">✅ No shopping requests available.</Alert>
        )}
      </Card>
    </Container>
  );
};

export default StaffShoppingRequests;
