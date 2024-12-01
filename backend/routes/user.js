//routes/user.js

const express = require('express');
const authenticateToken = require('../middleware/authMiddleware'); // The middleware that authenticates the JWT
const router = express.Router();
const db = require("../config/db");


// Route to fetch user info
router.get('/user', authenticateToken, (req, res) => {
    const userId = req.user.userId;  // userId is attached to req.user in the authenticateToken middleware

    // Query to get user data
    const query = 'SELECT id, email, created_at FROM users WHERE id = ?';
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Send user data as response
        const user = results[0];  // Assuming the user exists
        res.json({ success: true, user });
    });
});


// Route to update user profile
router.put('/update', authenticateToken, (req, res) => {
    const userId = req.user.userId;  // Extract userId from the decoded token
    const { username, email } = req.body;  // Get updated username and email from the request body
  
    // Validate the input
    if (!username || !email) {
      return res.status(400).json({ success: false, message: 'Username and email are required' });
    }
  
    // Query to update user data
    const query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
    
    db.query(query, [username, email, userId], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', error: err });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Successfully updated the user info
      res.json({ success: true, message: 'Profile updated successfully' });
    });
  });
  
  module.exports = router;
module.exports = router;
