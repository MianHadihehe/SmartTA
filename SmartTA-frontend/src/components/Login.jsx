import React from 'react';
import '../styling/login.css';

const splineRoboURL = import.meta.env.VITE_ROBO_URL;

const login = () => {
  return (
      <div className="login-main-cont">
      <iframe
        // src={splineRoboURL}
        id='robot'
        width="100%"
        height="100%"
      ></iframe>

      <div className="login-info">
          <h1>Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span></h1>
          <form className="login-form">
            <input type="text" placeholder="Username" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="login-btn">Login</button>
          </form>
          <div className="options">
            <a href="/register" className="register-link">New? Register Here</a>
            <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
          </div>
        </div>
      </div>
  );
}

export default login;
