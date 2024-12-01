import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserCircle } from 'react-icons/fa'; // User icon from react-icons
import { jwtDecode } from "jwt-decode"; // To decode the JWT token

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(""); // To store the username
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Decode the token to get the user's name (assuming the token contains a 'username' field)
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username); // Set the username from the token
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // Run on initial mount
  }, []);

  useEffect(() => {
    checkLoginStatus(); // Re-run on location changes
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername(""); // Clear the username on logout
    navigate("/"); // Redirect to landing page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light p-3 shadow-sm">
      <div className="container-fluid">
        {/* Logo */}
        <NavLink className="navbar-brand fw-bold" to="/" style={{
          fontSize: "1.8rem",
          color: "#007bff",
          fontFamily: "'Arial', sans-serif",
        }}>
          DiseasePredict
        </NavLink>

        {/* Toggler (Hamburger bar) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Conditionally render the Home link if user is logged in */}
            {isLoggedIn && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/home" style={{ padding: "10px 20px", color: "#007bff", transition: "all 0.3s" }}>
                  Home
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" style={{ padding: "10px 20px", color: "#007bff", transition: "all 0.3s" }}>
                About
              </NavLink>
            </li>
          </ul>
        </div>

        {/* User Profile Section */}
        <div className="d-flex align-items-center">
          {isLoggedIn && (
            <div
              className="d-flex align-items-center profile-section"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer", marginRight: "15px" }}
            >
              <FaUserCircle size={30} color="#007bff" />
              <span className="ms-2" style={{ fontWeight: "bold", color: "#007bff" }}>
                {username}
              </span>
            </div>
          )}
          {isLoggedIn && (
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
