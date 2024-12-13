# HealthPredict Backend

HealthPredict is an advanced AI-powered health prediction system that evaluates potential health risks based on user-provided symptoms, medical history, and lifestyle factors. The backend of the application is built with Node.js, Express, and MySQL, providing secure authentication, prediction services, and report generation.

## Features
- **User Authentication:** Secure signup and login with JWT-based authentication.
- **Health Prediction:** Prediction of heart disease risks using multiple machine learning models.
- **Prediction History:** Store and retrieve past prediction data.
- **Report Generation:** Generate downloadable reports in DOCX format containing health predictions.
- **Database Integration:** MySQL for secure data storage and retrieval, including user data and prediction results.

## Installation

Follow the steps below to set up the backend locally:

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- An `.env` file for environment variables

### Clone the repository
```bash
git clone https://github.com/ashishkarche/disease-predict.git
cd disease-predict
