import React, { useState } from 'react';
import axios from 'axios';  
import '../styling/forgotpassone.css'; 
import MessageBox from './MessageBox';
import loadingSpinner from '../assets/loading-spinner.gif'; // Add a spinner image or animation


const splineURL = import.meta.env.VITE_BABYROBO_URL;

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState(''); 
  const [messageBoxVisible, setMessageBoxVisible] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState('');  
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8080/api/reset/password-reset', { role, username });
      if (response.status === 200) {
        showMessage('✅ Check your email for the reset link !');
        setUsername('')
        setRole('');
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      console.error('Error sending password reset link', err);
      if (err.response && err.response.status === 404) {
        showMessage('❌ User not found !');
      } else if (err.response && err.response.status === 500) {
        showMessage('❌ Server error occurred. Please try again later !');
      } else {
        showMessage('❌ An unexpected error occurred !');
      }
    }
      setIsLoading(false);
  };
  

  const showMessage = (message) => {
    setMessageBoxContent(message);
    setMessageBoxVisible(true);
    setTimeout(() => {
      setMessageBoxVisible(false);  // Automatically hide the message after 5 seconds
    }, 5000);
  };
  
  

  return (
    <div className="outer-most">
      <div className="logo-info">
        <h1>
          Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span>
        </h1>
      </div>
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

      {messageBoxVisible && <MessageBox message={messageBoxContent} />}

      {isLoading && (
        <div className="loading-indicator-fp-one">
          <img src={loadingSpinner} alt="Loading..." />
          Loading...
        </div>
      )}

      <div className="forgot-password-container">
        <h2>Forgot Password?</h2>
        <p>Please enter your username, and we will send you a password reset link.</p>

          <div>
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

            <div className="role-select-forget-pass">
              <label>You Are A ?</label>
              <select
                required
                value={role}
                onChange={(e) => setRole(e.target.value)} // Set role value
              >
                <option value="">Choose role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>Submit</button>
            </form>

            {error && <p className="error-message">{error}</p>} {/* Display error message */}
          </div>
      </div>

      <div className="box2"></div>
    </div>
    </div>
  );
};

export default ForgotPassword;
