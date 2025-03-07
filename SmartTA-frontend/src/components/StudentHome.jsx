import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styling/studenthome.css'; 
import { useState, useEffect } from 'react';
import walkingRobo from '../assets/walking-robo.gif';

const StudentHome = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { username } = location.state || {}; 
  const { rollNumber } = location.state || {}; 

  // const [assignments, setAssignments] = useState([
  //   { title: 'Assignment 1', grade: 'A', feedback: 'Well done!' },
  //   { title: 'Assignment 2', grade: 'B+', feedback: 'Good work, but you can improve.' },
  //   { title: 'Assignment 3', grade: 'C', feedback: 'Needs more effort.' },
  // ]);

  const [assignments, setAssignments] = useState([]);

  const handleLogout = () => {
    navigate('/');
  };

  useEffect(()=>{
    fetchRecords();
  },[])

  console.log(rollNumber);

  const fetchRecords = async () =>{
    try {
      const response = await fetch(`http://localhost:8080/api/submit-grades/by-roll-number?rollNumber=${rollNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  console.log(assignments);
    

  return (
    <div className="main-student-home">
      <div className="student-lo-btn-cont">
        <button className='student-lo-btn' onClick={handleLogout}>Logout</button>
      </div>
      <div className="logo"> 
        Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span>
      </div>
      <div className="msg-robo-cont">
        <div className="welcome-msg"> 
          Welcome, Mr {username}
        </div>

        <div className="walking-robo">
          <img className='walkingroboicon' src={walkingRobo} alt="" />
        </div>
      </div>

      <div className="assignments-container">
        <h2>Your Assignments</h2>
        <ul>
          {assignments.map((assignment, index) => (
            <li key={assignment._id} className="assignment-item">
              <h3>Assignment # {assignment.assignmentNumber}</h3>
              <p><strong>Grade:</strong> {assignment.grade}</p>
              <p><strong>Feedback:</strong> {assignment.feedback}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentHome;
