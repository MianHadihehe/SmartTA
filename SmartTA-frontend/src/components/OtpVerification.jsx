import React, { useState } from 'react';
import '../styling/otpverification.css'; // Ensure you have a CSS file for OTP styles

const splineURL = import.meta.env.VITE_BABYROBO_URL;

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to verify the OTP
    console.log(`Entered OTP: ${otp}`);
    setSubmitted(true);
  };

  return (
    <div className="otp-main-cont">
      <div className="box1">
        <iframe
          src={splineURL}
          id="babyrobo"
          width="100%"
          height="100%"
        ></iframe>
        <div className="enter-otp-temp"></div>
      </div>
      <div className="otp-container">
        {submitted ? (
          <h2>OTP Verified! Password reset can proceed.</h2>
        ) : (
          <>
            <h2>Enter OTP</h2>
            <p>Please enter the OTP sent to your email address.</p>
            <form onSubmit={handleSubmit} className="otp-form">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn">Submit OTP</button>
            </form>
          </>
        )}
      </div>
      <div className="box2"></div>
    </div>
  );
};

export default OtpVerification;
