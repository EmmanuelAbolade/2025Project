//src\components\common\Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { navList } from "../data/Data";
import SocialIcons from "./SocialIcons";
import { auth } from "../../firebase/firebaseConfig";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [navbarCollapse, setNavbarCollapse] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [role, setRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        setLoggedIn(true);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setRole(userDoc.data()?.role || null);
      } else {
        setLoggedIn(false);
        //added 9/4/2025 at 8:20am
        setRole(null);
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  const handleMouseEnter = (itemId) => {
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };


   // Dynamically add dashboard link based on role
   const navItems = [...navList];
   if (loggedIn) {
     if (role === "guest") {
       navItems.push({ path: "/guest-dashboard", text: "Guest Dashboard" });
     } else if (role === "staff") {
       navItems.push({ path: "/staff-dashboard", text: "Staff Dashboard" });
     } else if (role === "admin") {
       navItems.push({ path: "/admin-dashboard", text: "Admin Dashboard" });
     }
   }

   return (
    <>
      <div className="container-fluid bg-dark px-0 text-decoration-none">
        <div className="row gx-0">
          <div className="col-lg-3 bg-dark d-none d-lg-block">
            <Link
              to="/"
              className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center text-decoration-none"
            >
              <h1 className="m-0 text-primary text-uppercase">Guest Ease</h1>
            </Link>
          </div>
          <div className="col-lg-9">
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark p-3 p-lg-0">
              <Link to="/" className="navbar-brand d-block d-lg-none text-decoration-none">
                <h1 className="m-0 text-primary text-uppercase">Guest Ease</h1>
              </Link>
              <button
                type="button"
                className="navbar-toggler"
                onClick={() => setNavbarCollapse(!navbarCollapse)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className={
                  navbarCollapse
                    ? "navbar-collapse justify-content-around navbarCollapse"
                    : "collapse navbar-collapse justify-content-around"
                }
              >
                <div className="navbar-nav mr-auto py-0">
                  {/* Render navigation items */}
                  {navItems.map((item, index) => (
                    <div key={index}>
                      {item.subItems ? (
                        <div
                          className="nav-item dropdown"
                          onMouseEnter={() => handleMouseEnter(item.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Link className="nav-link dropdown-toggle text-decoration-none">
                            {item.text}
                          </Link>
                          <div
                            className={`dropdown-menu rounded-0 m-0 ${
                              activeDropdown === item.id ? "show" : ""
                            }`}
                          >
                            {item.subItems.map((sub) => (
                              <Link key={sub.path} to={sub.path} className="dropdown-item">
                                {sub.text}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link to={item.path} className="nav-item nav-link">
                          {item.text}
                        </Link>
                      )}
                    </div>
                  ))}
                  {/* Login Link */}
                  {!loggedIn && (
                    <Link to="/login" className="nav-item nav-link">
                      Login
                    </Link>
                  )}
                  {/* Logout Button */}
                  {loggedIn && (
                    <button
                      onClick={handleLogout}
                      className="btn btn-link nav-item nav-link"
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </button>
                  )}
                </div>
                <SocialIcons />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
  