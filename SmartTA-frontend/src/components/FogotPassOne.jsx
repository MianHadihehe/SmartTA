import React, { useState } from 'react';
import axios from 'axios';  // Import axios to make the HTTP requests
import '../styling/forgotpassone.css'; 

const splineURL = import.meta.env.VITE_BABYROBO_URL;

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make sure you are sending the request to the correct backend URL
      await axios.post('http://localhost:8080/api/reset/password-reset', { username });
      setSubmitted(true);
    } catch (err) {
      console.error('Error sending password reset link', err);
      setError('Failed to send reset link. Please try again.');
    }
  };
  
  

  return (
    <div className="fpo-main-cont">
      <div className="box1">
        <iframe
          src={splineURL}
          id='babyrobo'
          width="100%"
          height="100%"
        ></iframe>
        <div className="enter-username-temp"></div>
      </div>

      <div className="forgot-password-container">
        <h2>Forgot Password?</h2>
        <p>Please enter your username, and we will send you a password reset link.</p>

        {submitted ? (
          <p>Check your email for the reset link.</p> // Display after successful submission
        ) : (
          <>
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn">Submit</button>
            </form>

            {error && <p className="error-message">{error}</p>} {/* Display error message */}
          </>
        )}
      </div>

      <div className="box2"></div>
    </div>
  );
};

export default ForgotPassword;
