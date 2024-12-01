// api/axios.jsx
import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5000", // Update this for production
});

export default instance;
