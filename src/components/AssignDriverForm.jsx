// 📂 src/components/AssignDriverForm.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { query, collection, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { Form, Button, Alert } from "react-bootstrap";

const AssignDriverForm = ({ bookingId }) => {
  const [driverName, setDriverName] = useState("");
  const [driverContact, setDriverContact] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [previousDrivers, setPreviousDrivers] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchPreviousDrivers = async () => {
      try {
        const q = query(collection(db, "taxiBookings"), where("status", "==", "Assigned"));
        const snapshot = await getDocs(q);
        const driverList = snapshot.docs.map(doc => ({
          name: doc.data().driverName,
          contact: doc.data().driverContact,
          vehicle: doc.data().vehicleNumber
        }));
        setPreviousDrivers(driverList);
      } catch (error) {
        console.error("Error fetching previous drivers:", error);
      }
    };

    fetchPreviousDrivers();
  }, []);

  const handleAssignDriver = async (event) => {
    event.preventDefault();

    if (!driverName || !driverContact || !vehicleNumber) {
      alert("Please fill in all driver details.");
      return;
    }

    if (!window.confirm("Are you sure you want to assign this driver?")) return;

    try {
      await updateDoc(doc(db, "taxiBookings", bookingId), {
        driverName,
        driverContact,
        vehicleNumber,
        status: "Assigned",
      });

      setStatusMessage({ success: `Driver ${driverName} assigned successfully!` });
    } catch (error) {
      console.error("Error assigning driver:", error);
      setStatusMessage({ error: "Failed to assign driver. Please try again." });
    }
  };

  return (
    <div>
      <h3>Assign a Driver 🚖</h3>

      {statusMessage && (
        <Alert variant={statusMessage.success ? "success" : "danger"}>
          {statusMessage.success || statusMessage.error}
        </Alert>
      )}

      <Form onSubmit={handleAssignDriver}>
        <Form.Group>
          <Form.Label>Choose a Previous Driver</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => {
              const selected = previousDrivers.find(driver => driver.name === e.target.value);
              if (selected) {
                setDriverName(selected.name);
                setDriverContact(selected.contact);
                setVehicleNumber(selected.vehicle);
              } else {
                setDriverName("");
                setDriverContact("");
                setVehicleNumber("");
              }
            }}
          >
            <option value="">-- Select Previous Driver OR Enter Manually --</option>
            {previousDrivers.map((driver, index) => (
              <option key={index} value={driver.name}>{driver.name} - {driver.vehicle}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Driver Name *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter driver name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Driver Contact *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter contact number"
            value={driverContact}
            onChange={(e) => setDriverContact(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Vehicle Number *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter vehicle license number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" className="mt-4" type="submit">
          Assign Driver
        </Button>
      </Form>
    </div>
  );
};

export default AssignDriverForm;
