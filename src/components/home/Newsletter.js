import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const Newsletter = ({ buttonText = "Submit", placeholderText = "Enter your email" }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (validateEmail(email)) {
      setLoading(true);
      try {
        // Store email in Firestore
        await addDoc(collection(db, "newsletterSubscriptions"), { email });
        setSuccessMessage("Thank you for subscribing!");
        setEmail(""); // Clear the input field
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="container newsletter mt-5 wow fadeIn" data-wow-delay="0.1s">
      <div className="row justify-content-center">
        <div className="col-lg-10 border rounded p-1">
          <div className="border rounded text-center p-1">
            <div className="bg-white rounded text-center p-5">
              <h4 className="mb-4">
                Subscribe: 
                <span className="text-primary text-uppercase">
                  Newsletter
                </span>
              </h4>
              <div className="position-relative mx-auto" style={{ maxWidth: "400px" }}>
                <input
                  className="form-control w-100 py-3 ps-4 pe-5"
                  type="text"
                  placeholder={placeholderText}
                  aria-label="Enter your email to subscribe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary py-2 px-3 position-absolute top-0 end-0 mt-2 me-2"
                  aria-label="Submit email for newsletter subscription"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : buttonText}
                </button>
                {successMessage && <p className="mt-3 text-success">{successMessage}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;