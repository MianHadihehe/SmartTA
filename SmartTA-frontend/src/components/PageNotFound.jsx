import React from 'react';
import '../styling/pagenotfound.css'; // Ensure you have a CSS file for this page

const splineURL = import.meta.env.VITE_BABYROBO_URL;

const PageNotFound = () => {
  return (
    <div className="pagenotfound-main-cont">
      <div className="box1">
        <iframe
          src={splineURL}
          id="babyrobo"
          width="100%"
          height="55%"
        ></iframe>
      </div>
      <div className="pagenotfound-container">
        <h1>ERROR 404 !</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="home-btn">Go Back Home</a>
      </div>
      <div className="box2"></div>
    </div>
  );
};

export default PageNotFound;
