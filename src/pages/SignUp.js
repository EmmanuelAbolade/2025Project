import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

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
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4 text-primary">Sign Up</h2>
        <InputField
          label="Email"
          type="email"
          value={email}
          aria-label="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrengthIndicator password={password} />
        <FormButton text="Sign Up" onClick={handleSignUp} />
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link Lang="" to="/login" className="text-decoration-none">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
