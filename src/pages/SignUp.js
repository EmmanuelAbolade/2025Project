//src\pages\SignUp.js
import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Container, Card} from "react-bootstrap";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import InputField from "../components/common/InputField";
import FormButton from "../components/common/FormButton";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import PasswordStrengthIndicator from "../components/common/PasswordStrengthIndicator";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!email.trim()) {
      alert("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(auth.currentUser);
      alert("A verification email has been sent to your email address.");

      // Save user role in Firestore
      console.log("Saving user to Firestore with UID:", user.uid);
      await setDoc(doc(db, "users", user.uid), {
        email,
        role: "guest", // Default role
      });
  
      console.log("User successfully added to Firestore!");
      alert("Sign-up successful!");
    } catch (error) {
      console.error("Sign-up error:", error.message); // Debugging line
      alert(error.message);
    }
  };
  
  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg border border-3 border-dark rounded p-5 bg-light" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center fw-bold text-primary mb-4">📝 Sign Up</h2>
  
        {/* Email Input */}
        <InputField
          label="📧 Email"
          type="email"
          value={email}
          aria-label="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 border border-2 border-primary shadow-sm"
        />
  
        {/* Password Input */}
        <InputField
          label="🔑 Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 border border-2 border-primary shadow-sm"
        />
  
        {/* Password Strength Indicator */}
        <PasswordStrengthIndicator password={password} className="mb-3" />
  
        {/* Sign-Up Button */}
        <FormButton text="🚀 Sign Up" onClick={handleSignUp} className="w-100 fw-bold shadow-sm mb-3" />
  
        {/* Login Link */}
        <p className="mt-3 text-center fw-bold">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none text-primary">
            🔄 Login here
          </Link>
        </p>
      </Card>
    </Container>
  );
  
};

export default SignUp;
