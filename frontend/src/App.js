import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Prediction from "./pages/Prediction";
import About from "./pages/About"; 
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import { motion } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
    return (
        <Router>
            <Navbar />
            <PageTransitions />
        </Router>
    );
};

const PageTransitions = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to Home if user is logged in and on the Landing page
        const token = localStorage.getItem("token");
        if (token && location.pathname === "/") {
            navigate("/home");
        }
    }, [location, navigate]);

    return (
        <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Routes location={location}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<ProtectedRoute component={Home} />} />
                <Route path="/predictions" element={<ProtectedRoute component={Prediction} />} />
                <Route path="/about" element={<About />} /> 
                <Route path="/profile" element={<Profile />} /> 
                <Route path="/editprofile" element={<EditProfile />} /> 
            </Routes>
        </motion.div>
    );
};

// Protected Route HOC
const ProtectedRoute = ({ component: Component }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/"); // Redirect to Landing if not logged in
        }
    }, [token, navigate]);

    return token ? <Component /> : null; // Render component only if logged in
};

export default App;
