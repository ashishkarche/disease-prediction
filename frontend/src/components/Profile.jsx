import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Profile.css'; // Import the external CSS for styling

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');  // Redirect to landing if no token
      return;
    }

    // Fetch user data from the backend API
    fetch('http://localhost:5000/user/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Send token in Authorization header
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setUserInfo(data.user);  // Set user data
      } else {
        navigate('/');  // Redirect to landing page if fetching fails
      }
    })
    .catch((err) => {
      console.error('Error fetching user data:', err);
      navigate('/');  // Redirect on error
    })
    .finally(() => {
      setLoading(false);  // Set loading to false once the data is fetched
    });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;  // Show loading while fetching data
  }

  if (!userInfo) {
    return <div>No user info available</div>;  // If no user data found, show error
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <FaUserCircle size={100} color="#007bff" />
        <h2>{userInfo.username}</h2>
      </div>

      <div className="profile-details">
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Member Since:</strong> {new Date(userInfo.created_at).toLocaleDateString()}</p>
      </div>
      
      <div className="profile-actions">
        <button className="btn btn-outline-primary" onClick={() => navigate("/editprofile")}>Edit Profile</button>
      </div>
    </div>
  );
};

export default Profile;
