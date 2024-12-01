//routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Ensure the secret is stored in environment variables

// Signup Route
router.post("/signup", async (req, res) => {
    const { email, password, username } = req.body;

    // Validate input
    if (!email || !password || !username) {
        return res.status(400).json({ success: false, message: "Email, password, and username are required" });
    }

    try {
        // Check if the username already exists
        const checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
        db.query(checkUsernameQuery, [username], async (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error" });
            }
            if (results.length > 0) {
                return res.status(400).json({ success: false, message: "Username already exists" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into the database
            const query = "INSERT INTO users (email, password, username) VALUES (?, ?, ?)";
            db.query(query, [email, hashedPassword, username], (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Database error" });
                }
                res.status(201).json({ success: true, message: "User registered successfully" });
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Login Route
router.post("/login", (req, res) => {
    const { username, password } = req.body;  // Changed email to username

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    // Check if user exists
    const query = "SELECT * FROM users WHERE username = ?";  // Changed email to username
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        const user = results[0];

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        // Generate JWT, now including the username
        const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ success: true, message: "Login successful", token });
    });
});

module.exports = router;
