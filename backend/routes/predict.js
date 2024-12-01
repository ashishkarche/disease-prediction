//routes/predict.js

const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } = require("docx");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Prediction Route
router.post("/predict", authenticateToken, async (req, res) => {
    const { age, sex, chestPain, cholesterol, bloodPressure, bloodSugar, electrocardiographic, maxHeartRate, exerciseAngina, oldPeak, stSlope } = req.body;
    const userId = req.user.userId;  // Get userId from JWT token

    // Validate the inputs
    const validationErrors = [];
    if (!age || typeof age !== "number" || age <= 0) validationErrors.push("Invalid age provided.");
    if (typeof sex !== "number" || (sex !== 0 && sex !== 1)) validationErrors.push("Invalid sex provided.");
    if (typeof chestPain !== "number" || chestPain < 0) validationErrors.push("Invalid chest pain type provided.");
    if (typeof cholesterol !== "number" || cholesterol <= 0) validationErrors.push("Invalid cholesterol level provided.");
    if (typeof bloodPressure !== "number" || bloodPressure <= 0) validationErrors.push("Invalid blood pressure level provided.");
    if (typeof bloodSugar !== "boolean") validationErrors.push("Invalid blood sugar value provided.");
    if (typeof electrocardiographic !== "number" || electrocardiographic < 0) validationErrors.push("Invalid electrocardiographic type provided.");
    if (typeof maxHeartRate !== "number" || maxHeartRate <= 0) validationErrors.push("Invalid heart rate provided.");
    if (typeof exerciseAngina !== "number" || (exerciseAngina !== 0 && exerciseAngina !== 1)) validationErrors.push("Invalid exercise angina provided.");
    if (typeof stSlope !== "number" || stSlope < 0) validationErrors.push("Invalid ST slope provided.");
    if (typeof oldPeak !== "number" || oldPeak < 0) validationErrors.push("Invalid ST depression value provided.");

    if (validationErrors.length > 0) {
        return res.status(400).json({ success: false, message: validationErrors.join(" ") });
    }

    // Send the data to the FastAPI server for prediction
    try {
        const inputData = { age, sex, chestPain, cholesterol, bloodPressure, bloodSugar, electrocardiographic, maxHeartRate, exerciseAngina, oldPeak, stSlope };
        const response = await axios.post("https://127.0.0.1:8000/predict", inputData);
        const prediction = response.data.prediction;

        // Create the Word document for the report
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph("Health Prediction Report"),
                        new Table({
                            rows: [
                                new TableRow({ children: [new TableCell({ children: [new Paragraph("Age")] }), new TableCell({ children: [new Paragraph(String(age))] })] }),
                                new TableRow({ children: [new TableCell({ children: [new Paragraph("Prediction")] }), new TableCell({ children: [new Paragraph(prediction)] })] }),
                            ],
                        }),
                    ],
                },
            ],
        });

        // Convert the document to a buffer
        Packer.toBuffer(doc).then((buffer) => {
            // Insert the prediction data and the document as a binary into the database
            const query = "INSERT INTO prediction_history (user_id, prediction, report) VALUES (?, ?, ?)";
            db.query(query, [userId, prediction, buffer], (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Failed to save prediction history." });
                }

                res.status(200).json({
                    success: true,
                    message: "Prediction generated successfully.",
                    data: { prediction, reportUrl: `/predict/download-report/${result.insertId}` },
                });
            });
        }).catch((docError) => {
            return res.status(500).json({ success: false, message: "Failed to generate the report." });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Prediction failed due to an internal error." });
    }
});

// Route to download the report (binary data)
router.get("/download-report/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    // Fetch the report from the database
    const query = "SELECT * FROM prediction_history WHERE id = ? AND user_id = ?";
    db.query(query, [id, userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }

        // Send the report as a downloadable file
        const report = results[0];
        res.setHeader("Content-Disposition", `attachment; filename=report_${id}.docx`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.send(report.report); // Send the binary data to the client
    });
});


// Route to get user's prediction history
router.get("/prediction-history", authenticateToken, (req, res) => {
    const userId = req.user.userId;  // Get userId from JWT token

    // Fetch prediction history from the database
    const query = "SELECT * FROM prediction_history WHERE user_id = ?";
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "No prediction history found" });
        }

        res.status(200).json({
            success: true,
            data: results,  // Return the prediction history for the logged-in user
        });
    });
});

module.exports = router;
