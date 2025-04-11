//import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react"; // Import both useState and useEffect




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

  const [currentUser, setCurrentUser] = useState(null);
  
  //added 8/4/2025 at 11:50am
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  
  // added 8/4/2025 at 10:05am Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user); // Update user state
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //added 9/4/2025 at 7:25am
    console.log("Form submitted!");

    if (!currentUser) {
      alert("Please log in to submit your request.");
      return;
    }
    
    // Check for valid input
    if (!Object.values(formData).some((value) => value !== false && value !== "")) {
      alert("Please select at least one option or fill out a text field.");
      return;
    }

    try {
      await addDoc(collection(db, "housekeepingRequests"), {
        ...formData,
        userId: currentUser.uid,
        timestamp: new Date(),
      });
      alert("Request submitted successfully!");
    } catch (err) {
      console.error("Error submitting request:", err);
    }
  };
  
  
  /*//commented 8/4/2025 at 10:05am
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);*/
  
  /*old commented code
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
  }, []);
  // Log current user for debugging purposes
  //console.log("Current User:", auth.currentUser);
*/
  


/*//cancelled 8/4/2025
const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };*/


//added 8/4/2025 at 10:05am
const handleChange = (e) => {
  const { name, type, checked, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};


  /*//commented 8/4/2025 at 10:05am
  const validateForm = () => {
    //console.log("Form Values:", Object.values(formData)); // Log for debugging
    if (
      !Object.values(formData).some((value) => value !== false && value !== "")
    ) {
      alert("Please select at least one option or fill out a text field.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!currentUser) {
      alert("You are not logged in. Please log in to submit a request.");
      return;
    }

    try {
      await addDoc(collection(db, "housekeepingRequests"), {
        ...formData,
        userId: currentUser.uid,
        timestamp: new Date(),
      });
      alert("Request submitted successfully!");
    } catch (err) {
      console.error("Error submitting request:", err);
    }
  };*/


/*//old coomented code
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted"); // Log for debugging
    if (!validateForm()) return;
    
     // Check if user is authenticated
     if (!auth.currentUser) {
      alert("You are not logged in. Please log in to submit a request.");
      return;
    }
    
    //try {
      //await addDoc(collection(db, "housekeepingRequests"), formData);
      //alert("Request submitted successfully!");
      try {
        await addDoc(collection(db, "housekeepingRequests"), {
          ...formData,
          userId: auth.currentUser.uid, // Include user ID in the request
          timestamp: new Date(), // Add a timestamp for the request
        });
        alert("Request submitted successfully!");


    
    } catch (err) {
      console.error("Error submitting request:", err);
    }
  };
*/
  return (
    <Container 
      className="container mt-4 justify-content-center" 
      style={{ maxWidth: "600px" }}
    >
      <h2 className="text-center">Housekeeping Requests</h2>
      <div className="row justify-content-center">
      <div className="border rounded p-1">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Check
              type="checkbox"
              name="linen"
              label="Make bed with fresh linen"
              aria-label="Make bed with fresh linen"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="trash"
              label="Empty trash and replace liners"
              aria-label="Empty trash and replace liners"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="mop"
              label="Mop floor or vacuum floor"
              aria-label="Mop floor or vacuum floor"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="sanitize"
              label="Clean and sanitize bathroom"
              aria-label="Clean and sanitize bathroom"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="toiletries"
              label="Replenish toiletries"
              aria-label="Replenish toiletries"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="towels"
              label="Replace towels"
              aria-label="Replace towels"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="coffee"
              label="Restock coffee, tea, sugar"
              aria-label="Restock coffee, tea, sugar"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="furniture"
              label="Arrange furniture and room"
              aria-label="Arrange furniture and room"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="mirrors"
              label="Clean mirrors and windows"
              aria-label="Clean mirrors and windows"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="pestControl"
              label="Pest control"
              aria-label="Pest control"
              onChange={handleChange}
            />
            <Form.Group className="mt-3">
              <Form.Label>Look out for lost item</Form.Label>
              <Form.Control
                type="text"
                name="lostItem"
                placeholder="Describe the item"
                aria-placeholder="Describe the item"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Extra item</Form.Label>
              <Form.Control
                type="text"
                name="extraItem"
                placeholder="Describe the item"
                aria-placeholder="Describe the item"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              name="lightBulb"
              label="Replace light bulb"
              aria-label="Replace light bulb"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="unclogDrain"
              label="Unclog drain"
              aria-label="Unclog drain"
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="replaceItem"
              label="Replace broken or malfunction equipment item/accessory"
              aria-label="Replace broken or malfunction equipment item/accessory"
              onChange={handleChange}
            />
            <Form.Group className="mt-3">
              <Form.Label>Inspect suspicious activity</Form.Label>
              <Form.Control
                type="text"
                name="suspiciousActivity"
                placeholder="Describe the activity"
                aria-placeholder="Describe the activity"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              name="securityKeyCard"
              label="Maintain security key card"
              aria-label="Maintain security key card"
              onChange={handleChange}
            />
            <Form.Group className="mt-3">
              <Form.Label>Collect a found item</Form.Label>
              <Form.Control
                type="text"
                name="foundItem"
                placeholder="Describe the item"
                aria-placeholder="Describe the item"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              name="inRoomSafe"
              label="Get an in-room safe"
              aria-label="Get an in-room safe"
              onChange={handleChange}
            />
            <Form.Group className="mt-3">
              <Form.Label>Out of the box request</Form.Label>
              <Form.Control
                type="text"
                name="otherRequest"
                placeholder="Describe your request"
                aria-placeholder="Describe your request"
                onChange={handleChange}
              />
            </Form.Group>
            <Button 
              variant={isSubmitting ? "secondary" : "primary"} // Change color during submission 
              
              type="submit" 
              className={isSubmitting ? "loading" : "" }
              disabled={isSubmitting} // Disable button during submission
              style={{ //added 9/4/2025 at 7:00am
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
              >
              Submit Request
            </Button>
          </Col>
        </Row>
      </Form>
      </div>
      </div>
    </Container>
  );
};

export default HousekeepingRequestForm;
