import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/signup.css'; 

const splineRoboURL = import.meta.env.VITE_ROBO_URL;

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="main-cont">
      <div className="robo-cont-signup">
        <iframe
        src={splineRoboURL}
        id='robot'
        style={{ width: "100%", height: "100%"}}
      ></iframe>

      <div className="temp-signup"></div>
        </div>
        <div className="info">
          <h2 className='signup-heading'>Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span></h2>
          <form className="signup-form">
            <input type="text" placeholder="Username" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
          <div className="options">
            <p>Already have an account? <Link to="/" className='signup-link'>Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
