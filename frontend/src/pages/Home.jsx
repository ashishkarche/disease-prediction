import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaHistory, FaDownload } from 'react-icons/fa'; // Import icons from react-icons
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();

  // State for storing prediction history
  const [history, setHistory] = useState([]);

  // Function to check if the user is logged in
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login page if not logged in
    }
  };

  // Fetch prediction history
  const fetchHistory = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("https://disease-prediction-topaz.vercel.app/predict/prediction-history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(response.data.data); // Assuming the response has a "data" field containing the history
    } catch (error) {
      console.error("Error fetching prediction history", error);
    }
  };

  // Handle report download
  const handleDownloadReport = (reportId) => {
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

  // Navigate to the prediction page
  const handleHeartPredictionClick = () => {
    navigate("/predictions");
  };

  useEffect(() => {
    checkLoginStatus(); // Check login status on component mount
    fetchHistory(); // Fetch prediction history when the component loads
  }, []);

  return (
    <div className="container mt-5">
      {/* User Dashboard */}
      <div className="card shadow-lg p-4 dashboard-card" style={{ borderRadius: "15px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="dashboard-title">Welcome to Your Dashboard</h2>

          <div className="d-flex gap-3 flex-wrap justify-content-end"> {/* Added flex-wrap for better responsiveness */}
            <button
              className="btn btn-primary action-btn"
              onClick={handleHeartPredictionClick}
            >
              Check Heart Risk
            </button>
          </div>
        </div>

        {/* Prediction History Section */}
        <div className="mb-4">
          <h4 className="mb-3 prediction-history-title">
            <FaHistory /> Prediction History
          </h4>
          <ul className="prediction-list">
            {history.length > 0 ? (
              history.map((item, index) => (
                <li key={index} className="d-flex justify-content-between align-items-center">
                  <span>Prediction #{index + 1}: {item.prediction}</span>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleDownloadReport(item.id)} // Download report when clicked
                  >
                    <FaDownload /> Download
                  </button>
                </li>
              ))
            ) : (
              <li>No prediction history found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
