import React from 'react';
import '../styling/signup.css'; 

const splineRoboURL = import.meta.env.VITE_ROBO_URL;

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="main-cont">
        <iframe
        //   src={splineRoboURL}
          id="robot"
          width="100%"
          height="100%"
        ></iframe>
        <div className="info">
          <h2>Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span></h2>
          <form className="signup-form">
            <input type="text" placeholder="Username" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
          <div className="options">
            <a href="/login" className="login-link">Already have an account? Login here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
