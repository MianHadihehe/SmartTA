import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styling/login.css'; 

const splineRoboURL = import.meta.env.VITE_ROBO_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // New state for role selection
  const [rollNumber, setRollNumber] = useState(''); // New state for role selection
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
      role
    };

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        
        const { username, role } = data;


        if (role === 'teacher') {
          navigate('/submit-question', { state: { username } });
        } else if (role === 'student') {
          navigate('/student-home', { state: { username } });
        } else {
          setError('Invalid role');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="login-main-cont">
      <div className="robo-cont">
        <iframe
          src={splineRoboURL}
          id='robot'
          style={{ width: "100%", height: "100%" }}
        ></iframe>

        <div className="temp"></div>
      </div>

      <div className="login-info">
        <h1>
          Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span>
        </h1>

        {error && <p className="error-message">{error}</p>} 

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}  
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

          {/* {role === 'student' && <input
            type="text"
            placeholder="RollNumber"
            required
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
          />
          } */}

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

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="options">
          <p>New? <Link className="login-link" to="/signup">Register Here</Link></p>
          <p><Link className="login-link" to="/forgot-password">Forgot Password?</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
