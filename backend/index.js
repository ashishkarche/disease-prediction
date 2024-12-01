//index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const authRoutes = require("./routes/auth");
const predictRoutes = require("./routes/predict");
const userRoutes = require("./routes/user");
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON payloads

// Routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/predict", predictRoutes); // Prediction routes
app.use("/user",userRoutes );

// 404 route handler - Catch all other routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
