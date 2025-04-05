import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

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
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      /// Debugging: Verify user
      console.log("User logged in:", user);
  
      /// Fetch role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      console.log("Fetched document:", userDoc.data()); // Debugging
  
      
      const role = userDoc.data()?.role;
    if (!role) {
      throw new Error("No role assigned to this user in Firestore");
    }


      console.log("Role fetched:", role); // Debugging
  
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
      console.error("Login error:", error); // Debugging
      setError("Invalid email or password.");
      
    }
  };
  
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6">
        <div className="card shadow p-4 rounded">
          <h2 className="text-center mb-4 text-primary">Login</h2>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3"
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3"
          />
          <FormButton text="Login" onClick={handleLogin} className="w-100 mb-3" />
          {error && <p className="text-danger text-center">{error}</p>}
          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <a href="/signup" className="text-decoration-none">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;



/*
  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;*/
