import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";



const HousekeepingRequestForm = () => {
  const [formData, setFormData] = useState({
    linen: false,
    trash: false,
    mop: false,
    sanitize: false,
    toiletries: false,
    towels: false,
    coffee: false,
    furniture: false,
    mirrors: false,
    pestControl: false,
    lostItem: "",
    extraItem: "",
    lightBulb: false,
    unclogDrain: false,
    replaceItem: false,
    suspiciousActivity: "",
    securityKeyCard: false,
    foundItem: "",
    inRoomSafe: false,
    otherRequest: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "housekeepingRequests"), formData);
      alert("Request submitted successfully!");
    } catch (err) {
      console.error("Error submitting request:", err);
    }
  };

  return (
    <Container className="container mt-4 justify-content-center" style={{ maxWidth: "600px" }}>
      <h2 className="border text-center">Housekeeping Requests</h2>
      <div className="row justify-content-center">
      <div className="border rounded p-1">
      <div className="border rounded text-left p-1">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Check
              type="checkbox"
              name="linen"
              label="Make bed with fresh linen"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="trash"
              label="Empty trash and replace liners"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="mop"
              label="Mop floor or vacuum floor"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="sanitize"
              label="Clean and sanitize bathroom"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="toiletries"
              label="Replenish toiletries"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="towels"
              label="Replace towels"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="coffee"
              label="Restock coffee, tea, sugar"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="furniture"
              label="Arrange furniture and room"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="mirrors"
              label="Clean mirrors and windows"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="pestControl"
              label="Pest control"
              onChange={handleChange}
            />
            <Form.Group className="mt-3">
              <Form.Label>Look out for lost item</Form.Label>
              <Form.Control
                type="text"
                name="lostItem"
                placeholder="Describe the item"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Extra item</Form.Label>
              <Form.Control
                type="text"
                name="extraItem"
                placeholder="Describe the item"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              name="lightBulb"
              label="Replace light bulb"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="unclogDrain"
              label="Unclog drain"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="replaceItem"
              label="Replace broken or malfunction equipment item/accessory"
              onChange={handleChange}
            />
            <Form.Group className="mt-3">
              <Form.Label>Inspect suspicious activity</Form.Label>
              <Form.Control
                type="text"
                name="suspiciousActivity"
                placeholder="Describe the activity"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              name="securityKeyCard"
              label="Maintain security key card"
              onChange={handleChange}
            />
            <Form.Group className="mt-3">
              <Form.Label>Collect a found item</Form.Label>
              <Form.Control
                type="text"
                name="foundItem"
                placeholder="Describe the item"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              name="inRoomSafe"
              label="Get an in-room safe"
              onChange={handleChange}
            />
            <Form.Group className="mt-3">
              <Form.Label>Out of the box request</Form.Label>
              <Form.Control
                type="text"
                name="otherRequest"
                placeholder="Describe your request"
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Submit Request
            </Button>
          </Col>
        </Row>
      </Form>
      </div>
      </div>
      </div>
    </Container>
  );
};

export default HousekeepingRequestForm;
