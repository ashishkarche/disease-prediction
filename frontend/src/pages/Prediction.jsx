import React, { useState } from "react";
import axios from "../api/axios"; // Ensure the axios instance is correctly configured
import { motion } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const Prediction = () => {
    const [formData, setFormData] = useState({
        age: "",
        sex: "",
        chestPain: "",
        cholesterol: "",
        bloodPressure: "",
        bloodSugar: "",
        electrocardiographic: "",
        maxHeartRate: "",
        exerciseAngina: "",
        oldPeak: "",
        stSlope: "",
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");
    const [reportUrl, setReportUrl] = useState(""); // Store the report URL

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setResult("");
        setError("");
        setReportUrl("");

        try {
            // Validate inputs
            for (const key in formData) {
                if (!formData[key]) {
                    throw new Error(`Please fill in the ${key}.`);
                }
            }

            // Prepare data for the API request
            const data = {
                age: Number(formData.age),
                sex: Number(formData.sex), // Assuming sex is represented as 1 for male, 0 for female
                chestPain: Number(formData.chestPain),
                cholesterol: Number(formData.cholesterol),
                bloodPressure: Number(formData.bloodPressure),
                bloodSugar: Boolean(formData.bloodSugar), // assuming 1 for 'yes' and 0 for 'no'
                electrocardiographic: Number(formData.electrocardiographic),
                maxHeartRate: Number(formData.maxHeartRate),
                exerciseAngina: Number(formData.exerciseAngina),
                oldPeak: Number(formData.oldPeak),
                stSlope: Number(formData.stSlope),
            };

            // Retrieve JWT token from localStorage
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token is missing. Please log in.");
            }

            // Send POST request with the token in headers
            const res = await axios.post("https://disease-prediction-topaz.vercel.app/predicts/predict", data, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the JWT token to the request
                },
            });

            // Handle successful prediction response
            if (res.data.success) {
                setResult(res.data.data.prediction); // Access prediction from the response
                setReportUrl(res.data.data.reportUrl); // Set the report URL for download
            } else {
                throw new Error(res.data.message || "Unexpected response format.");
            }
        } catch (err) {
            // Set error message for UI
            setError(err.response?.data?.message || err.message || "Error in prediction. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        const reportId = reportUrl.split("/").pop(); // Extract the ID from the reportUrl
        const token = localStorage.getItem("token");
    
        axios({
            url: `https://disease-prediction-topaz.vercel.app/predict/download-report/${reportId}`,
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob', // Important: This tells axios to handle the response as a file
        })
        .then((response) => {
            // Create a link element to trigger the download
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(new Blob([response.data]));
            link.href = url;
            link.setAttribute('download', `report_${reportId}.docx`); // Set the file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch((error) => {
            console.error('Error downloading the report:', error);
        });
    };    
    return (
        <motion.div
            className="d-flex justify-content-center align-items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div
                className="card shadow-lg p-4"
                style={{
                    maxWidth: "500px",
                    width: "100%",
                    borderRadius: "15px",
                    backgroundColor: "#fff",
                }}
            >
                <h2 className="text-center mb-4" style={{ color: "#0056b3" }}>
                    Heart Disease Prediction
                </h2>
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <form>
                        {/* Age Field */}
                        <div className="mb-3">
                            <label className="form-label">Age</label>
                            <input
                                type="number"
                                className="form-control"
                                name="age"
                                placeholder="Enter your age"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* Sex Field */}
                        <div className="mb-3">
                            <label className="form-label">Sex (1 for male, 0 for female)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="sex"
                                placeholder="Enter your sex"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* Chest Pain Type Field */}
                        <div className="mb-3">
                            <label className="form-label">Chest Pain Type (0-3)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="chestPain"
                                placeholder="Enter chest pain type"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* Cholesterol Level Field */}
                        <div className="mb-3">
                            <label className="form-label">Cholesterol Level</label>
                            <input
                                type="number"
                                className="form-control"
                                name="cholesterol"
                                placeholder="Enter cholesterol level"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* Blood Pressure Field */}
                        <div className="mb-3">
                            <label className="form-label">Blood Pressure</label>
                            <input
                                type="number"
                                className="form-control"
                                name="bloodPressure"
                                placeholder="Enter blood pressure"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* Blood Sugar Field */}
                        <div className="mb-3">
                            <label className="form-label">Blood Sugar (1 for Yes, 0 for No)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="bloodSugar"
                                placeholder="Enter blood sugar level"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* Electrocardiographic Field */}
                        <div className="mb-3">
                            <label className="form-label">Electrocardiographic (0-2)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="electrocardiographic"
                                placeholder="Enter electrocardiographic result"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* Max Heart Rate Field */}
                        <div className="mb-3">
                            <label className="form-label">Max Heart Rate</label>
                            <input
                                type="number"
                                className="form-control"
                                name="maxHeartRate"
                                placeholder="Enter max heart rate"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* Exercise Angina Field */}
                        <div className="mb-3">
                            <label className="form-label">Exercise Angina (1 for Yes, 0 for No)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="exerciseAngina"
                                placeholder="Enter exercise angina"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* ST Depression Field */}
                        <div className="mb-3">
                            <label className="form-label">ST Depression</label>
                            <input
                                type="number"
                                className="form-control"
                                name="oldPeak"
                                placeholder="Enter ST depression level"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* ST Slope Field */}
                        <div className="mb-3">
                            <label className="form-label">ST Slope (0-2)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="stSlope"
                                placeholder="Enter ST slope"
                                onChange={handleChange}
                                style={{ borderRadius: "10px" }}
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={handleSubmit}
                            style={{
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #007bff, #0056b3)",
                                border: "none",
                                fontSize: "16px",
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Predict
                        </motion.button>
                    </form>
                )}

                {error && (
                    <motion.div
                        className="alert alert-danger mt-3 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <strong>Error:</strong> {error}
                    </motion.div>
                )}

                {result && (
                    <motion.div
                        className="alert alert-info mt-3 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <strong>Prediction Result:</strong> {result}
                    </motion.div>
                )}

                {reportUrl && (
                    <motion.button
                        className="btn btn-success w-100 mt-3"
                        onClick={handleDownloadReport}
                        style={{
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #28a745, #218838)",
                            border: "none",
                            fontSize: "16px",
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Download Report
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default Prediction;
