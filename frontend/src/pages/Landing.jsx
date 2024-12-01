import React, { useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import Login from "./Login"; // Import Login component
import Signup from "./Signup"; // Import Signup component
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './Landing.css';

const Landing = () => {
  const [isSignup, setIsSignup] = useState(false); // State to toggle Login/Signup

  return (
    <motion.div
      className="landing-container d-flex flex-column flex-md-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 3D Background */}
      <div className="canvas-container">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} />
          <Sphere args={[1, 64, 64]} position={[-2, 1, -5]} scale={2}>
            <meshStandardMaterial
              color="#007BFF"
              metalness={0.5}
              roughness={0.1}
            />
          </Sphere>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
        </Canvas>
      </div>

      {/* Left Section - Login or Signup */}
      <div className="form-section d-flex justify-content-center align-items-center">
        <div style={{ maxWidth: "400px", width: "100%" }}>
          {isSignup ? (
            <Signup switchToLogin={() => setIsSignup(false)} />
          ) : (
            <Login switchToSignup={() => setIsSignup(true)} />
          )}
        </div>
      </div>

      {/* Right Section - Landing Content */}
      <div className="landing-content d-flex flex-column justify-content-center align-items-center text-center">
        <motion.h1
          className="fw-bold"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
          style={{
            color: "#007BFF",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "0.1em",
          }}
        >
          Health Prediction System
        </motion.h1>
        <motion.p
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.5rem)",
            maxWidth: "800px",
            lineHeight: "1.8",
            color: "#333",
          }}
        >
          Transforming healthcare with AI-driven predictions. Accurate,
          reliable, and personalized insights for a healthier future.
        </motion.p>
        {/* Key Features Section */}
        <div
          className="features-section mt-4 mx-auto p-4"
          style={{
            maxWidth: "800px",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "15px",
            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            style={{
              textTransform: "uppercase",
              fontSize: "clamp(1.2rem, 1.5vw, 1.8rem)",
              color: "#007BFF",
              marginBottom: "1rem",
            }}
          >
            Key Features
          </motion.h2>
          <motion.ul
            className="list-unstyled"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            style={{
              fontSize: "clamp(0.9rem, 1.2vw, 1.2rem)",
              lineHeight: "1.8",
              color: "#333",
              textAlign: "left",
              padding: "0 1rem",
            }}
          >
            <li>
              ✅ <strong>Multiple ML Models:</strong> Compare predictions from
              various models including Random Forest, Logistic Regression, SVM,
              and Gradient Boosting.
            </li>
            <li>
              ✅ <strong>Ensemble Prediction:</strong> Combines predictions from
              all models for a more accurate and reliable health risk
              prediction.
            </li>
            <li>
              ✅ <strong>Automatic Preprocessing:</strong> Automatically handles
              missing data and scales features using an imputer and standard
              scaler.
            </li>
            <li>
              ✅ <strong>Real-Time Health Risk Prediction:</strong> Provides
              predictions of "High Risk" or "Low Risk" based on user input.
            </li>
            <li>
              ✅ <strong>AI-Powered Insights:</strong> Utilizes AI-driven
              algorithms to analyze user health data and provide personalized
              health predictions.
            </li>
          </motion.ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Landing;
