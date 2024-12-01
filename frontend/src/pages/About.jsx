import React from "react";
import "./About.css"; // Import the external CSS for styling

const About = () => {
  return (
    <section
      className="about-section py-5"
      style={{ backgroundColor: "#f9f9f9" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2 className="display-4 fw-bold text-primary mb-4">
              About Disease Prediction
            </h2>
            <p className="lead text-muted" style={{ fontSize: "1.2rem" }}>
              HealthPredict is an advanced AI-powered health prediction system
              designed to assess and predict potential health risks. By
              analyzing user-provided symptoms, medical history, and lifestyle
              factors, our system can offer insights into potential health
              conditions, particularly focusing on heart disease risks. This
              allows users to take preventive actions and seek timely medical
              advice.
            </p>
            <h4 className="mt-4">How It Works</h4>
            <ul className="list-unstyled mt-3">
              <li>
                <strong>Step 1:</strong> Provide your personal health
                information through a secure form, including age, sex,
                cholesterol levels, and other key health metrics.
              </li>
              <li>
                <strong>Step 2:</strong> The system processes your data using
                multiple machine learning models, such as Random Forest,
                Logistic Regression, SVM, and Gradient Boosting, which are
                trained to detect heart disease risks.
              </li>
              <li>
                <strong>Step 3:</strong> Receive a health risk prediction based
                on the analysis, categorized as "High Risk" or "Low Risk" for
                heart disease, along with personalized recommendations for
                further action.
              </li>
            </ul>
            <h4 className="mt-4">Why Choose HealthPredict?</h4>
            <ul className="list-unstyled mt-3">
              <li>
                ✅ <strong>Multiple AI Models:</strong> HealthPredict uses a
                combination of powerful AI models to improve prediction accuracy
                and reliability.
              </li>
              <li>
                ✅ <strong>Real-Time Predictions:</strong> Get instant
                predictions for your health risk based on real-time data
                analysis.
              </li>
              <li>
                ✅ <strong>Personalized Insights:</strong> Receive tailored
                health recommendations based on your risk assessment, empowering
                you to take control of your health.
              </li>
            </ul>
            <p className="mt-4" style={{ fontSize: "1.2rem", color: "#333" }}>
              <strong>Model Accuracy:</strong> The AI models used in
              DiseasePredict achieve an impressive accuracy of{" "}
              <strong>91.86%</strong>, ensuring reliable and precise predictions
              for better health decisions.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <img
              src={`${process.env.PUBLIC_URL}/images/disease-sys-about.jpg`}
              alt="Disease Prediction"
              className="img-fluid rounded shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
