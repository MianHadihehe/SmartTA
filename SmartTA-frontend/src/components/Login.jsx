import React from 'react';
import '../styling/login.css';
import { Link } from 'react-router-dom';

const splineRoboURL = import.meta.env.VITE_ROBO_URL;

const login = () => {
  return (
      <div className="login-main-cont">
        <div className="robo-cont">
        <iframe
        src={splineRoboURL}
        id='robot'
        style={{ width: "100%", height: "100%"}}
      ></iframe>

      <div className="temp"></div>
        </div>

      <div className="login-info">
          <h1>Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span></h1>
          <form className="login-form">
            <input type="text" placeholder="Username" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="login-btn">Login</button>
          </form>
          <div className="options">
            <p>New? <Link className="login-link" to="/signup">Register Here</Link></p>
            <p><Link className="login-link" to="/forgot-password">Forgot Password?</Link></p>
          </div>
        </div>
      </div>
  );
}

export default login;
