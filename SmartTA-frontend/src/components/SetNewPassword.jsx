import React, { useState } from 'react';
import '../styling/setnewpassword.css'; // Ensure you have a CSS file for this page

const splineURL = import.meta.env.VITE_BABYROBO_URL;

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add logic to handle the new password submission
    console.log(`New password: ${newPassword}`);
    setSubmitted(true);
  };

  return (
    <div className="set-password-main-cont">
      <div className="box1">
        <iframe
          src={splineURL}
          id="babyrobo"
          width="100%"
          height="100%"
        ></iframe>
        <div className="set-new-pass-temp"></div>
      </div>
      <div className="set-password-container">
        {submitted ? (
          <h2>Password Reset Successfully!</h2>
        ) : (
          <>
            <h2>Set New Password</h2>
            <p>Please enter and confirm your new password.</p>
            <form onSubmit={handleSubmit} className="set-password-form">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </>
        )}
      </div>
      <div className="box2"></div>
    </div>
  );
};

export default SetNewPassword;
