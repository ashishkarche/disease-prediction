import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';


const EditProfile = () => {
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');  // Redirect to landing if no token
      return;
    }

    // Fetch user data from the backend API
    fetch('https://disease-prediction-topaz.vercel.app/user/user', {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,  // Update the respective field
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    // Validate the data (basic example)
    if (!userInfo.username || !userInfo.email) {
      setError('All fields are required.');
      return;
    }

    // Send updated data to the backend
    fetch('https://disease-prediction-topaz.vercel.app/user/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),  // Send updated user info
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigate('/profile');  // Redirect to profile page if update is successful
        } else {
          setError('Failed to update profile. Please try again later.');
        }
      })
      .catch((err) => {
        console.error('Error updating profile:', err);
        setError('Error updating profile.');
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={userInfo.username}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="btn btn-primary submit-btn">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
