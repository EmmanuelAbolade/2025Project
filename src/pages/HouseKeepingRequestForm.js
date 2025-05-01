//src\pages\HouseKeepingRequestForm.js
//import React, { useState } from "react"; change 15/04/2025 ti fix submisson button
// Import necessary React and Firebase dependencies
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Container } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
// Import helpers
import { validateFormData, extractFilledData, saveToFirestore, resetFormData } from "../helpers/housekeepingHelpers";
import housekeepingImage from "../assets/img/c7.png";

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


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentUser) {
      alert("You need to log in first to submit your request.");
      navigate("/login");
      return;
    }
  
    // Extract relevant data for `formattedDetails`
    const formattedDetails = extractFilledData(formData);
  
    if (Object.keys(formattedDetails).length === 0) {
      alert("Please select at least one option or fill out a text field.");
      return;
    }
  
    // Show a confirmation dialog for guests to review their request
    const confirmation = window.confirm(
      `Are you sure you want to submit the following request?\n\n${Object.entries(formattedDetails)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1")}: ${value === true ? "Yes" : value}`)
        .join("\n")}`
    );
  
    if (!confirmation) {
      return; // Cancel submission if the guest doesn't confirm
    }
  
    try {
      // Save request to Firestore with a permanent `formattedDetails` field
      await saveToFirestore(db, "housekeepingRequests", {
        formattedDetails, // Always include this field
        userId: currentUser.uid,
        timestamp: new Date(),
        status: "Pending",
      });
      alert("Request submitted successfully!");
      setFormData(resetFormData()); // Reset the form
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Something went wrong. Please try again.");
    }
  };

//To cancel form
const handleCancel = () => {
  const confirmation = window.confirm("Are you sure you want to cancel all selections?");
  if (confirmation) {
    setFormData(resetFormData());
  }
};



  return (
    <Container fluid className="mt-4" style={{ fontSize: "1.25rem" }}>
      <Link to="/services" className="btn btn-link text-decoration-none fw-bold">
      <i className="fa fa-backward fa-sm text-primary"> Back to Services</i>
      </Link> {/* Link to Services Page */}
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light mt-3">
        <Row className="justify-content-center mb-4">
        <Col md={6}>
          <img
            src={housekeepingImage}
            alt="Housekeeping"
           className="img-fluid rounded shadow-sm"
            
          />

        </Col>
      </Row>
      </Card>
      
      <h2 className="text-center fw-bold text-primary">🧹 Housekeeping Requests</h2>      
      <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-3">
        <div className="border rounded p-0 mt-3" justify-content-center>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
              <div>
                <div className="border border-thick rounded  p-3" justify-content-center >
                <Form.Check type="checkbox" name="linen" label="Make bed with fresh linen" 
                  checked={formData.linen} // Bind to state
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12 p-3" >
                <Form.Check type="checkbox" name="trash" label="Empty trash and replace liners" 
                  checked={formData.trash}
                  onChange={handleChange}
                  style={{ fontSize: "1.25rem" }} />
                </div>
                <div className="border border-thick rounded col-12  p-3" >
                <Form.Check type="checkbox" name="mop" label="Mop floor and vacuum floor" 
                  checked={formData.mop}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="sanitize" label="Clean and sanitize bathroom" 
                  checked={formData.sanitize}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="toiletries" label="Replenish toiletries" 
                  checked={formData.toiletries}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="towels" label="Replace towels" 
                  checked={formData.towels}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="coffee" label="Restock coffee, tea, and sugar" 
                  checked={formData.coffee}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="furniture" label="Arrange furniture and room" 
                  checked={formData.furniture}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="mirrors" label="Clean mirrors and windows" 
                  checked={formData.mirrors}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="pestControl" label="Pest control" 
                  checked={formData.pestControl}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="lightBulb" label="Replace Light Bulbs" aria-label="Replace Light Bulbs"  
                  checked={formData.lightBulb}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="unclogDrain" label="Unclog drain" aria-label="Unclog drain" 
                  checked={formData.unclogDrain}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="replaceItem" label="Replace broken and malfunction equipment item/accessory" aria-label="Replace broken or malfunction equipment item/accessory" 
                  checked={formData.replaceItem}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="securityKeyCard" label="Maintain security key card" aria-label="Maintain security key card" 
                  checked={formData.securityKeyCard}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Check type="checkbox" name="inRoomSafe" label="Get an in-room safe" aria-label="Get an in-room safe" 
                  checked={formData.inRoomSafe}
                  onChange={handleChange} 
                  style={{ fontSize: "1.25rem" }}/>
                </div>
                {/* other form fields as needed */}
                <div className="border border-thick rounded col-12  p-3">
                <Form.Group className="mt-3 mb-3">
                  <Form.Label style={{ fontSize: "1.25rem" }}>Lost Item if found</Form.Label>
                  <Form.Control
                    type="text"
                    name="lostItem"
                    placeholder="Describe the item"
                    aria-label="Lost Item Description"
                    value={formData.lostItem} // Bind to state
                    onChange={handleChange}
                    style={{ fontSize: "1.25rem" }}
                  />
                </Form.Group>
                </div>
                <div className="border border-thick rounded col-12 p-3">
                <Form.Group className=" mb-3">
                  <Form.Label style={{ fontSize: "1.25rem" }}>Extra Item</Form.Label>
                  <Form.Control
                    type="text"
                    name="extraItem"
                    placeholder="Describe the item"
                    aria-label="Extra Item Description"
                    value={formData.extraItem}
                    onChange={handleChange}
                    style={{ fontSize: "1.25rem" }}
                  />
                </Form.Group>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: "1.25rem" }}>Inspection of Suspicious Activity</Form.Label>
                  <Form.Control
                    type="text"
                    name="suspiciousActivity"
                    placeholder="Describe the activity and place"
                    aria-label="Suspicious Activity"
                    value={formData.suspiciousActivity}
                    onChange={handleChange}
                    style={{ fontSize: "1.25rem" }}
                  />
                </Form.Group>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: "1.25rem" }}>Collection of Found Item(s)</Form.Label>
                  <Form.Control
                    type="text"
                    name="foundItem"
                    placeholder="Describe the item"
                    aria-label="Found Item Description"
                    value={formData.foundItem}
                    onChange={handleChange}
                    style={{ fontSize: "1.25rem" }}
                  />
                </Form.Group>
                </div>
                <div className="border border-thick rounded col-12  p-3">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: "1.25rem" }}>Other Request</Form.Label>
                  <Form.Control
                    type="text"
                    name="otherRequest"
                    placeholder="Describe your request"
                    aria-label="Other Request"
                    value={formData.otherRequest} // Ensure input value is linked to state
                    onChange={handleChange}
                    style={{ pointerEvents: "auto", zIndex: 1, fontSize: "1.25rem" }} // Prevent overlapping interference
                  />
                </Form.Group>
                </div>
                </div >
                <div className="d-flex justify-content-between mb-1 mt-1 pe-5 ps-5 ">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "1.25rem" }}
                    
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"  }
                  </Button>
                  
                  <Button
                    variant="danger"
                    type="button"
                    onClick={handleCancel}
                    style={{ fontSize: "1.25rem" }}
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
      </Card>
    </Container>
  );
};

export default HousekeepingRequestForm;

