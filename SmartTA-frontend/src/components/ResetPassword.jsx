import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Using useNavigate here
import "../styling/resetpassword.css"; // Use the same CSS as ForgotPassword
import MessageBox from './MessageBox';
import loadingSpinner from '../assets/loading-spinner.gif'; // Add a spinner image or animation
const splineURL = import.meta.env.VITE_BABYROBO_URL;

const ResetPassword = () => {
  const { token } = useParams(); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messageBoxVisible, setMessageBoxVisible] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState(''); 
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
  }, [token]);

  const showMessage = (message) => {
    setMessageBoxContent(message);
    setMessageBoxVisible(true);
    setTimeout(() => {
      setMessageBoxVisible(false);  
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showMessage('❌ Passwords do not match!');
      return;
    }
    try {
      console.log({
        resetToken: token,
        newPassword: newPassword, 
      });
      setIsLoading(true);
      await axios.post("http://localhost:8080/api/reset/reset-password", {
        resetToken: token,
        newPassword: newPassword,
      });

      showMessage('✅ Password Updated Successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate("/"); 
      }, 2000);
    } catch (err) {
      console.error("Error sending password reset link", err);
      showMessage('❌ Failed to update password. Please try again!');
    } finally {
      setIsLoading(false);
    }
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
          id="babyrobo"
          width="100%"
          height="100%"
        ></iframe>
        <div className="enter-password-temp"></div>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <img src={loadingSpinner} alt="Loading..." />
          Loading...
        </div>
      )}

      <div className="reset-password-container">
        <h2>Reset Your Password</h2>

        {/* {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>} */}

        {messageBoxVisible && <MessageBox message={messageBoxContent} />}

        <form onSubmit={handleSubmit}>
          <div className="reset-password-outer">
            <div className="reset-password-form password-field">
              <input
                type={showPassword ? "text" : "password"}  
                id="newPassword"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                
              />
              <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
            </div>

            <div className="reset-password-form password-field">
              <input
                type={showConfirmPassword ? "text" : "password"} 
                id="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </span>
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              Reset Password
          </button>
          </div>

        
        </form>
      </div>

      <div className="box2"></div>
    </div>
    </div>
  );
};

export default ResetPassword;
