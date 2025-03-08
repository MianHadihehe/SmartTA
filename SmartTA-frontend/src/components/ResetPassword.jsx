import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Using useNavigate here
import "../styling/resetpassword.css"; // Use the same CSS as ForgotPassword

const splineURL = import.meta.env.VITE_BABYROBO_URL;

const ResetPassword = () => {
  const { token } = useParams(); // Extract the token from the URL params
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // You can add token validation here, if needed.
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Log the request data to confirm it's correct
      console.log({
        resetToken: token, // token from URL
        newPassword: newPassword, // new password entered by the user
      });

      // Send the reset token and new password to the backend
      await axios.post("http://localhost:8080/api/reset/reset-password", {
        resetToken: token,
        newPassword: newPassword,
      });

      setSuccess("Password updated successfully!");
      setError("");
      setTimeout(() => {
        navigate("/login"); // Redirect to login after success
      }, 2000);
    } catch (err) {
      console.error("Error sending password reset link", err);
      setError("Failed to update password. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <div className="reset-password-container">
        <h2>Reset Your Password</h2>

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="reset-password-outer">
            <div className="reset-password-form">
              <input
                type="password"
                id="newPassword"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="reset-password-form">
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          </div>

        
        </form>
      </div>

      <div className="box2"></div>
    </div>
  );
};

export default ResetPassword;
