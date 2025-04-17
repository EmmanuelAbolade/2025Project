// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import InputField from "../components/common/InputField";
import FormButton from "../components/common/FormButton";
import { Spinner} from "react-bootstrap";
// Optionally import your custom CSS for authentication pages
// import "../css/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading] = useState();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.data()?.role;
      if (!role) {
        throw new Error("No role assigned to this user in Firestore");
      }
      // Redirect based on role
      if (role === "guest") {
        navigate("/guest-dashboard");
      } else if (role === "staff") {
        navigate("/staff-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Display friendly error messages
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

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
          Login
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
        <FormButton text="Login" onClick={handleLogin} className="w-100 mb-3 btn btn-primary" />
        {error && <p className="text-danger text-center">{error}</p>}
        <p className="mt-3 text-center" style={{ fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-decoration-none text-primary"
            style={{ fontWeight: 500 }}
          >
            Sign up here
          </Link>
        </p>
        <p className="mt-1 text-center" style={{ fontSize: "0.9rem" }}>
          Forgot your password?{" "}
          <Link
            to="/password-reset"
            className="text-decoration-none text-primary"
            style={{ fontWeight: 500 }}
          >
            Reset it here
          </Link>
        </p>
        <div className="text-center mt-3">
          <Link to="/" className="explore-link text-decoration-none text-muted fw-bold fs-6">
            Explore Our App
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
