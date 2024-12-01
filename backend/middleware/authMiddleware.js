//middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");  // Assuming token is passed in the Authorization header

    if (!token) {
        return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { userId: decoded.userId, username: decoded.username };  // Attach user info to the request object
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = authenticateToken;
