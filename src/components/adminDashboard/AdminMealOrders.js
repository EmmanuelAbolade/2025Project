import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const AdminMealOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const snapshot = await getDocs(collection(db, "mealOrders"));
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    await updateDoc(doc(db, "mealOrders", orderId), { status });
  };

  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h2 className="text-center fw-bold text-primary">🍽 Meal Orders</h2>
  
        {/* Meal Orders List */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-4">
          {orders.length > 0 ? (
            <ListGroup variant="flush">
              {orders.map((order) => (
                <ListGroup.Item key={order.id} className="shadow-sm p-3 border border-2 border-secondary rounded">
                  <p className="fw-bold text-dark">🍽 {order.items.map((item) => item.name).join(", ")}</p>
                  <p className="text-muted fw-bold">💰 <strong>Total Price:</strong> €{order.totalPrice}</p>
                  <p className="text-muted fw-bold">📝 <strong>Special Request:</strong> {order.specialRequest}</p>
                  <p className="text-muted fw-bold">
                    🏷 <strong>Status:</strong> 
                    <Badge bg={order.status === "pending" ? "warning" : order.status === "preparing" ? "primary" : "success"} className="shadow-sm p-2">
                      {order.status}
                    </Badge>
                  </p>
                  
                  {/* Status Update Buttons */}
                  <div className="d-flex gap-2 mt-2">
                    {order.status === "pending" && (
                      <Button variant="primary fw-bold shadow-sm" onClick={() => updateOrderStatus(order.id, "preparing")}>
                        🔄 Start Preparing
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button variant="info fw-bold shadow-sm" onClick={() => updateOrderStatus(order.id, "ready")}>
                        🚚 Ready for Delivery
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Button variant="success fw-bold shadow-sm" onClick={() => updateOrderStatus(order.id, "delivered")}>
                        ✅ Mark as Delivered
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="warning fw-bold text-center mt-3">⚠ No meal orders available.</Alert>
          )}
        </Card>
      </Card>
    </Container>
  );
  
};

export default AdminMealOrders;
