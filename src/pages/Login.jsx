//src\pages\Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { Container, Card} from "react-bootstrap";
import { Link } from "react-router-dom";


import InputField from "../components/common/InputField";
import FormButton from "../components/common/FormButton";

//const db = getFirestore();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    //e.preventDefault();
    //console.log("Login button clicked"); // Debugging
    
    // Validate email and password
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      /// Debugging: Verify user
      //console.log("User logged in:", user);
  
      /// Fetch role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      //console.log("Fetched document:", userDoc.data()); // Debugging
  
      
      const role = userDoc.data()?.role;
    if (!role) {
      throw new Error("No role assigned to this user in Firestore");
    }


      //console.log("Role fetched:", role); // Debugging
  
      /// Redirect based on role
      if (role === "guest") {
        navigate("/guest-dashboard");
      } else if (role === "staff") {
        navigate("/staff-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      //console.error("Login error:", error); // Debugging
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  
  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg border border-3 border-dark rounded p-5 bg-light">
        <h2 className="text-center fw-bold text-primary mb-4">🔐 Login</h2>
  
        {/* Email Input */}
        <InputField
          label="📧 Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 border border-2 border-primary shadow-sm"
          aria-label="Enter your email"
        />
  
        {/* Password Input */}
        <InputField
          label="🔑 Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 border border-2 border-primary shadow-sm"
        />
  
        {/* Login Button */}
        <FormButton text="🚀 Login" onClick={handleLogin} className="w-100 fw-bold shadow-sm mb-3" />
  
        {/* Error Message */}
        {error && <p className="text-danger text-center fw-bold">{error}</p>}
  
        {/* Sign Up Link */}
        <p className="mt-3 text-center fw-bold">
          Don't have an account?{" "}
          <Link to="/signup" className="text-decoration-none text-primary">
            ✏ Sign up here
          </Link>
        </p>
  
        {/* Password Reset Link */}
        <p className="mt-3 text-center fw-bold">
          Forgot your password?{" "}
          <a href="/password-reset" className="text-decoration-none text-danger">
            🔄 Reset it here
          </a>
        </p>
  
        {/* Explore App Link */}
        <p className="mt-4 text-center fw-bold">
          <Link to="/" className="text-decoration-none text-success">
            🌍 Explore Our App
          </Link>
        </p>
      </Card>
    </Container>
  );
  
};

export default Login;
