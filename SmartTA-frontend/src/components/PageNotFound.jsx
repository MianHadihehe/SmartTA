import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styling/pagenotfound.css'; 


const splineURL = import.meta.env.VITE_BABYROBO_URL;

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="pagenotfound-main-cont">
      <div className="box1">
        <iframe
          src={splineURL}
          id="babyrobo"
          width="100%"
          height="100%"
        ></iframe>
        <div className="page-not-found-temp"></div>
      </div>
      <div className="pagenotfound-container">
        <h1>ERROR 404 !</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="home-btn">Go Back Home</Link>
      </div>
      <div className="box2"></div>
    </div>
  );
};

export default PageNotFound;
