// src/pages/SignUp.js
import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import InputField from "../components/common/InputField";
import FormButton from "../components/common/FormButton";
import { Link } from "react-router-dom";
import PasswordStrengthIndicator from "../components/common/PasswordStrengthIndicator";
// Optionally import your custom CSS for authentication pages
// import "../css/auth.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!email.trim()) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Send verification email
      await sendEmailVerification(auth.currentUser);
      alert("A verification email has been sent to your email address.");
      // Save user role in Firestore (default role: guest)
      await setDoc(doc(db, "users", user.uid), {
        email,
        role: "guest",
      });
      alert("Sign-up successful!");
    } catch (err) {
      console.error("Sign-up error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div
      className="auth-page d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#f7f8fa" }}
    >
      <div
        className="card shadow-sm p-4 auth-card"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "8px", background: "#fff" }}
      >
        <h2 className="text-center text-primary mb-4" style={{ fontWeight: 600 }}>
          Sign Up
        </h2>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3"
          placeholder="Enter your email"
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3"
          placeholder="Enter your password"
        />
        <PasswordStrengthIndicator password={password} />
        <FormButton text="Sign Up" onClick={handleSignUp} className="w-100 mb-3 btn btn-primary" />
        {error && <p className="text-danger text-center">{error}</p>}
        <p className="mt-3 text-center" style={{ fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-decoration-none text-primary"
            style={{ fontWeight: 500 }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
