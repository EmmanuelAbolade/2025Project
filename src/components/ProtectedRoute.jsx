import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" />;
  }

  const checkRole = async () => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.data()?.role;
    return allowedRoles.includes(role);
  };

  return checkRole() ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
