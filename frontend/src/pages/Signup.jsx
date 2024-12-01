import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axios";
import { ThreeDots } from "react-loader-spinner"; // Import 3D loader spinner
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Signup = ({ switchToLogin }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    // Username validation (at least one uppercase and one lowercase)
    const validateUsername = (username) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z]).{3,}$/;
        return regex.test(username);
    };

    // Validate password format
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(password);
    };

    const handleSignup = async () => {
        setError("");
        setSuccess(false);
        setPasswordError(""); // Reset password error
        setLoading(true); // Set loading state

        // Validate form fields
        if (!username || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            setLoading(false); // Stop loading
            return;
        }

        if (!validateUsername(username)) {
            setError("Username must contain at least one uppercase and one lowercase letter.");
            setLoading(false); // Stop loading
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false); // Stop loading
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 8 characters long, with an uppercase letter, a number, and a special character.");
            setLoading(false); // Stop loading
            return;
        }

        try {
            const res = await axios.post("/auth/signup", { username, email, password });
            setSuccess(true);
            setTimeout(() => switchToLogin(), 3000); // Redirect to login after success
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <motion.div
            className="d-flex justify-content-center align-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ minHeight: "100vh" }}
        >
            <div
                className="card shadow-lg p-4"
                style={{
                    maxWidth: "400px",
                    width: "100%",
                    backgroundColor: "#fff",
                    borderRadius: "15px",
                    padding: "30px",
                    boxSizing: "border-box",
                }}
            >
                <h2 className="text-center mb-4" style={{ color: "#0056b3" }}>
                    Create Account
                </h2>

                {/* Error and Success Messages */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success" role="alert">
                        Signup successful! Redirecting to login...
                    </div>
                )}

                {/* Loader */}
                {loading ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "200px" }}
                    >
                        <ThreeDots color="#0056b3" height={80} width={80} />
                    </div>
                ) : (
                    <>
                        <div className="form-group mb-3">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ borderRadius: "10px" }}
                            />
                            {passwordError && (
                                <small className="text-danger">{passwordError}</small>
                            )}
                        </div>

                        <div className="form-group mb-4">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        <button
                            className="btn btn-primary w-100"
                            onClick={handleSignup}
                            style={{
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #007bff, #0056b3)",
                                border: "none",
                                fontSize: "16px",
                            }}
                        >
                            Sign Up
                        </button>
                    </>
                )}

                <p className="text-center mt-3">
                    <small className="text-muted">
                        Already have an account?{" "}
                        <span
                            onClick={switchToLogin}
                            className="text-primary"
                            style={{ cursor: "pointer" }}
                        >
                            Log in
                        </span>
                    </small>
                </p>

                <div className="text-center mt-4">
                    <small className="text-muted">
                        <strong>Password Requirements:</strong> At least 8 characters long, with at least one uppercase letter, one number, and one special character.
                    </small>
                </div>
            </div>
        </motion.div>
    );
};

export default Signup;
