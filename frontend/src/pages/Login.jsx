import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axios";
import { ThreeDots } from "react-loader-spinner"; // Import 3D loader spinner
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Login = ({ switchToSignup }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // General error state
    const [passwordError, setPasswordError] = useState(""); // Password validation error
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    // Username validation (at least one uppercase and one lowercase)
    const validateUsername = (username) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z]).{3,}$/;
        return regex.test(username);
    };

    // Password validation
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(password);
    };

    const handleLogin = async () => {
        setError("");
        setPasswordError("");
        setLoading(true);

        // Validate form inputs
        if (!username || !password) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (!validateUsername(username)) {
            setError("Username must contain at least one uppercase and one lowercase letter.");
            setLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError(
                "Password must be at least 8 characters long, with an uppercase letter, a number, and a special character."
            );
            setLoading(false);
            return;
        }

        try {
            // Change 'email' to 'username' in the API call
            const res = await axios.post("/auth/login", { username, password });
            if (res.data.success) {
                // Save token to local storage and navigate to home
                localStorage.setItem("token", res.data.token);
                navigate("/home");
            } else {
                setError("Invalid username or password.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "An unexpected error occurred. Please try again later."
            );
        } finally {
            setLoading(false);
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
                    Log In
                </h2>

                {/* Error Display */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Loader and Form */}
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

                        <div className="form-group mb-4">
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

                        <button
                            className="btn btn-primary w-100"
                            onClick={handleLogin}
                            style={{
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #007bff, #0056b3)",
                                border: "none",
                                fontSize: "16px",
                            }}
                        >
                            Login
                        </button>
                    </>
                )}

                <p className="text-center mt-3">
                    <small className="text-muted">
                        Don’t have an account?{" "}
                        <span
                            onClick={switchToSignup}
                            className="text-primary"
                            style={{ cursor: "pointer" }}
                        >
                            Sign up
                        </span>
                    </small>
                </p>

                <div className="text-center mt-4">
                    <small className="text-muted">
                        <strong>Password Requirements:</strong> At least 8 characters long, with
                        at least one uppercase letter, one number, and one special character.
                    </small>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
