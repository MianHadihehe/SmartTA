import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styling/signup.css'; 

const splineRoboURL = import.meta.env.VITE_ROBO_URL;

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(''); // New state for role selection
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  // Check if all fields are filled and passwords match
  useEffect(() => {
    // First check if passwords match
    if (password === confirmPassword && password !== '') {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  
    // Check if all fields are filled and passwords match
    if (
      password !== '' &&
      confirmPassword !== '' &&
      username !== '' &&
      email !== '' &&
      role !== '' &&
      password === confirmPassword
    ) {
      setIsButtonDisabled(false); // Enable the button
    } else {
      setIsButtonDisabled(true); // Disable the button if any condition fails
    }
  
    // Debug logs for understanding the state
    console.log("Passwords Match: ", passwordsMatch);
    console.log("Button Disabled: ", isButtonDisabled);
    console.log("Password: ", password);
    console.log("Confirm Password: ", confirmPassword);
  
  }, [password, confirmPassword, username, email, role]);
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      email,
      password,
      role, // Include the selected role in the submission
    };

    try {
      const response = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(response);
        setError("User Registered Successfully");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole(""); 
      } else {
        setError(data.message || 'Error during registration');
      }
    } catch (err) {
      setError('Server error');
    }

    
  };

  return (
    <div className="signup-page">
      <div className="main-cont">
        <div className="robo-cont-signup">
          <iframe
            // src={splineRoboURL}
            id='robot'
            style={{ width: "100%", height: "100%" }}
          ></iframe>
          <div className="temp-signup"></div>
        </div>

        <div className="info">
          <h2 className='signup-heading'>
            Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span>
          </h2>

          {error && <p className="error-message">{error}</p>}

          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Input with Toggle */}
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}  // Toggle between text and password
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>

            {/* Confirm Password Input with Toggle */}
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}  // Toggle between text and password
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </span>
            </div>

            {/* Role Selection */}
            <div className="role-select">
              <label>You Are A ?</label>
              <select
                required
                value={role}
                onChange={(e) => setRole(e.target.value)} // Set role value
              >
                <option value="">Choose role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            {!passwordsMatch && <p className="password-error">Passwords do not match!</p>}

            <button
              type="submit"
              className="signup-btn"
              disabled={isButtonDisabled}  // Button is disabled if any field is empty or passwords don't match
            >
              Sign Up
            </button>
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
