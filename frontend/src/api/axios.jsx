// api/axios.jsx
import axios from "axios";

const instance = axios.create({
    baseURL: "http://disease-prediction-topaz.vercel.app", // Update this for production
});

export default instance;
