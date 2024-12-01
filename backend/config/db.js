//config/db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');

dotenv.config(); // Load environment variables

// Create MySQL connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,               
        ca: fs.readFileSync(path.join(__dirname, 'isrgrootx1.pem')) // Path to the CA certificate
      },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test database connection
db.getConnection((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Connected to the TiDB database.");
    }
});

module.exports = db;
