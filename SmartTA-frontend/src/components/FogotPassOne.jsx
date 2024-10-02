import React, { useState } from 'react';
import '../styling/forgotpassone.css'; 

const splineURL = import.meta.env.VITE_BABYROBO_URL;


const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle the username submission for password reset
    console.log(`Password reset requested for: ${username}`);
    setSubmitted(true);
  };

  return (
        <div className="fpo-main-cont">
            <div className="box1">
            <iframe
        src={splineURL}
        id='babyrobo'
        width="100%"
        height="55%"
      ></iframe>
            </div>
        <div className="forgot-password-container">
          <>
            <h2>Forgot Password?</h2>
            <p>Please enter your username, and we will send you a password reset link.</p>
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
          </>
      </div>
      <div className="box2"></div>
        </div>
  );
};

export default ForgotPassword;
