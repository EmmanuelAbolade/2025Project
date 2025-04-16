//import React, { useState } from "react"; change 15/04/2025 ti fix submisson button
// Import necessary React and Firebase dependencies
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";



const HousekeepingRequestForm = () => {
  // Refined formData structure
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
        lightBulb: false,
        unclogDrain: false,
        replaceItem: false,
        securityKeyCard: false,
        inRoomSafe: false,
        lostItem: "",
        extraItem: "",
        suspiciousActivity: "",
        foundItem: "",
        otherRequest: ""

  });

  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user); // Update user state
    });
    return unsubscribe;
  }, []);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    console.log(`Field: ${name}, Value: ${type === "checkbox" ? checked : value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Redirect if not logged in
    if (!currentUser) {
      alert("You need to log in first to submit your request.");
      navigate("/login"); // Redirect to login page
      return;
    }

    // Check for valid input, Ensure at least one input is provided
    if (!Object.values(formData).some((value) => value !== false && value !== "")) {
      alert("Please select at least one option or fill out a text field.");
      return;
    }

    // Confirmation alert, Show confirmation dialog
    const confirmation = window.confirm("Are you sure you want to submit your housekeeping request?");
    if (!confirmation) return;

    try {
      setIsSubmitting(true); // Disable the button
      
      // Format submission details, Transform formData into a readable format
      const formattedDetails = Object.entries(formData)
        .map(([key, value]) => {
          if (typeof value === "boolean") {
            return `${key.replace(/([A-Z])/g, " $1").replace(/^[a-z]/, (m) => m.toUpperCase())}: ${value ? "Yes" : "No"}`;
          } else if (value) {
            return `${key.replace(/([A-Z])/g, " $1").replace(/^[a-z]/, (m) => m.toUpperCase())}: ${value}`;
          }
          return null;
        })
        .filter((detail) => detail) // Remove empty entries
        .join("\n");
      
      // Save to Firestore (send to staff and admin dashboards)
      await addDoc(collection(db, "housekeepingRequests"), {
        ...formData,
        userId: currentUser.uid,
        timestamp: new Date(),
        formattedDetails
      });

      // Display formatted details to user
      alert(`Request submitted successfully!\nSelected Requests Include:\n${formattedDetails}`);
      
      //Reset form
      setFormData({
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
        lightBulb: false,
        unclogDrain: false,
        replaceItem: false,
        securityKeyCard: false,
        inRoomSafe: false,
        lostItem: "",
        extraItem: "",
        suspiciousActivity: "",
        foundItem: "",
        otherRequest: ""
      }); 
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Something went wrong while submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

//To cancel form
  const handleCancel = () => {
    const confirmation = window.confirm("Are you sure you want to cancel all selections?");
    if (confirmation) {
      setFormData({
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
        lightBulb: false,
        unclogDrain: false,
        replaceItem: false,
        securityKeyCard: false,
        inRoomSafe: false,
        lostItem: "",
        extraItem: "",
        suspiciousActivity: "",
        foundItem: "",
        otherRequest: ""

      });
    }
  };

  return (
    <Container className="container p-10  justify-content-center" style={{ maxWidth: "700px" }}>
      <Link to="/services" className="btn btn-link text-decoration-none">
      <i className="fa fa-backward fa-lg"> Back to Services</i>
      </Link> {/* Link to Services Page */}
      <h1 className="text-center">Housekeeping Requests</h1>      
      <div className="row justify-content-center">
        <div className="border rounded p-2 m-5">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
              <div>
                <div>
                <Form.Check type="checkbox" name="linen" label="Make bed with fresh linen" 
                  checked={formData.linen} // Bind to state
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="trash" label="Empty trash and replace liners" 
                  checked={formData.trash}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="mop" label="Mop floor and vacuum floor" 
                  checked={formData.mop}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="sanitize" label="Clean and sanitize bathroom" 
                  checked={formData.sanitize}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="toiletries" label="Replenish toiletries" 
                  checked={formData.toiletries}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="towels" label="Replace towels" 
                  checked={formData.towels}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="coffee" label="Restock coffee, tea, and sugar" 
                  checked={formData.coffee}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="furniture" label="Arrange furniture and room" 
                  checked={formData.furniture}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="mirrors" label="Clean mirrors and windows" 
                  checked={formData.mirrors}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="pestControl" label="Pest control" 
                  checked={formData.pestControl}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="lightBulb" label="Replace Light Bulbs" aria-label="Replace Light Bulbs"  
                  checked={formData.lightBulb}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="unclogDrain" label="Unclog drain" aria-label="Unclog drain" 
                  checked={formData.unclogDrain}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="replaceItem" label="Replace broken and malfunction equipment item/accessory" aria-label="Replace broken or malfunction equipment item/accessory" 
                  checked={formData.replaceItem}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="securityKeyCard" label="Maintain security key card" aria-label="Maintain security key card" 
                  checked={formData.securityKeyCard}
                  onChange={handleChange} />
                </div>
                <div>
                <Form.Check type="checkbox" name="inRoomSafe" label="Get an in-room safe" aria-label="Get an in-room safe" 
                  checked={formData.inRoomSafe}
                  onChange={handleChange} />
                </div>
                {/* other form fields as needed */}
                <div>
                <Form.Group className="mt-3 mb-3">
                  <Form.Label>Lost Item if found</Form.Label>
                  <Form.Control
                    type="text"
                    name="lostItem"
                    placeholder="Describe the item"
                    aria-label="Lost Item Description"
                    value={formData.lostItem} // Bind to state
                    onChange={handleChange}
                  />
                </Form.Group>
                </div>
                <div>
                <Form.Group className=" mb-3">
                  <Form.Label>Extra Item</Form.Label>
                  <Form.Control
                    type="text"
                    name="extraItem"
                    placeholder="Describe the item"
                    aria-label="Extra Item Description"
                    value={formData.extraItem}
                    onChange={handleChange}
                  />
                </Form.Group>
                </div>
                <div>
                <Form.Group className="mb-3">
                  <Form.Label>Inspection of Suspicious Activity</Form.Label>
                  <Form.Control
                    type="text"
                    name="suspiciousActivity"
                    placeholder="Describe the activity and place"
                    aria-label="Suspicious Activity"
                    value={formData.suspiciousActivity}
                    onChange={handleChange}
                  />
                </Form.Group>
                </div>
                <div>
                <Form.Group className="mb-3">
                  <Form.Label>Collection of Found Item(s)</Form.Label>
                  <Form.Control
                    type="text"
                    name="foundItem"
                    placeholder="Describe the item"
                    aria-label="Found Item Description"
                    value={formData.foundItem}
                    onChange={handleChange}
                  />
                </Form.Group>
                </div>
                <div>
                <Form.Group className="mb-3">
                  <Form.Label>Other Request</Form.Label>
                  <Form.Control
                    type="text"
                    name="otherRequest"
                    placeholder="Describe your request"
                    aria-label="Other Request"
                    value={formData.otherRequest} // Ensure input value is linked to state
                    onChange={handleChange}
                    style={{ pointerEvents: "auto", zIndex: 1 }} // Prevent overlapping interference
                  />
                </Form.Group>
                </div>
                </div>
                <div className="d-flex justify-content-between mb-5 mt-5">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ cursor: isSubmitting ? "not-allowed" : "pointer" }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                  
                  <Button
                    variant="danger"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button> {/* Cancel Button */}
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Link to="/services" className="btn btn-link text-decoration-none">
      <i className="fa fa-backward fa-lg "> Back to Services</i>
      </Link> {/* Link to Services Page */}
      </div>
    </Container>
  );
};

export default HousekeepingRequestForm;

