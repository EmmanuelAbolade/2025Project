import React from "react";
import { Navigate } from "react-router-dom";

/*//commented 8/4/2025 at 1:50pm
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
*/

const ProtectedRoute = ({ children, role, allowedRoles = [] }) => {
  if (!role) {
    console.warn("Role is not defined. Redirecting to login.");
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    console.warn(`Role "${role}" is not authorized for this route.`);
    return <Navigate to="/" />;
  }

  return children; // Render the protected content if authorized
};

export default ProtectedRoute;



/* commented 9/4/205 at 7:00am
const ProtectedRoute = ({ children, role, allowedRoles }) => {
  // Default empty array for allowedRoles
  if (!Array.isArray(allowedRoles)) {
    console.error("Invalid allowedRoles:", allowedRoles);
    return <Navigate to="/" />;
  }

  // Handle undefined role gracefully
  if (!role) {
    console.warn("User role is undefined or null. Redirecting to login.");
    return <Navigate to="/login" />;
  }

  // Check if the role exists in allowedRoles
  const isAuthorized = allowedRoles.includes(role);
  if (!isAuthorized) {
    console.warn(`Role "${role}" is not authorized for this route.`);
    return <Navigate to="/" />;
  }

  return children; // Allow access if checks pass
};

export default ProtectedRoute;
*/



/*//added 8/4/25 at 10:05am commented 8/4/2025 at 1:50pm
const ProtectedRoute = ({ children, role, allowedRoles }) => {
  if (!role) {
    // User is not logged in
    return <Navigate to="/login" />;
  }
  if (!allowedRoles.includes(role)) {
    // User does not have the correct role
    return <Navigate to="/" />;
  }
  return children; // User is authorized
};

export default ProtectedRoute;*/

/*//old commented code
const ProtectedRoute = ({ children, role, allowedRoles }) => {
  const isAuthorized = () => {
    if (!allowedRoles || !Array.isArray(allowedRoles)) {
      console.error("Invalid allowedRoles:", allowedRoles);
      return false;
    }
    if (!role) {
      console.warn("Role is undefined. Access denied.");
      return false;
    }
    return allowedRoles.includes(role);
  };

  return isAuthorized() ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
*/


/* //commented 8/4/2025 at 10:05am
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
*/