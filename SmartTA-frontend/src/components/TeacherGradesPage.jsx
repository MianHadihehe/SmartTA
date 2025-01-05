import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styling/teachergrades.css'; 
import uploadIcon from '../assets/upload_icon.png';
import walkingRobo from '../assets/walking-robo.gif';

const TeacherGradesPage = () => {

  const location = useLocation();

  const result = location.state?.result;
  const rollNumber = location.state?.rollNumber;
  console.log(result);
  const gradedFeedback = result.gradedText;
  const resultArray = gradedFeedback.split(";");
  const initial_grade= resultArray[0];
  const initial_feedback= resultArray[1];

  console.log("initial_grade: ",initial_grade);
  console.log("initial_feedback: ",initial_feedback);

  const grade = initial_grade.substring(7,initial_grade.length+1);
  const feedback = initial_feedback.substring(10,initial_feedback.length+1);
  // const rollID = resultArray.find(line => line.startsWith("Rollnumber:"))?.split(": ")[1];


  console.log("Grade:", grade);
  console.log("Feedback:", feedback);
  console.log("Roll Number:", rollNumber);

  const navigate = useNavigate(); 
  const { username } = location.state || {}; // Receive username from navigation state

  // Mock initial grades provided by AI
  const [grades, setGrades] = useState([
    { rollNumber: rollNumber, grade: grade, feedback: feedback },
    // { rollNumber: '21L-6285', grade: 'A', feedback: 'Excellent work!' },
    // { rollNumber: '21L-1890', grade: 'C+', feedback: 'Needs more effort.' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [manualGrade, setManualGrade] = useState('');

  // Open modal for editing grade
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setManualGrade(student.grade);
    setIsModalOpen(true);
  };

  // Save the manual grade
  const handleSaveGrade = () => {
    setGrades((prevGrades) =>
      prevGrades.map((g) =>
        g.rollNumber === selectedStudent.rollNumber ? { ...g, grade: manualGrade } : g
      )
    );
    setIsModalOpen(false);
  };

  const handleAcceptAll = () => {
    alert('All grades accepted!');
  };

  const handleRetry = () => {
    alert('Retrying AI-based grading...');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="main-teacher-home">
      <div className="teacher-lo-btn-cont">
        <button className='teacher-lo-btn' onClick={handleLogout}>Logout</button>
      </div>
      <div className="logo"> 
        Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span>
      </div>
      <div className="msg-robo-cont">
      </div>


      <h2 className='review'>Review Grades</h2>

      {/* Grades Table */}
      <div className="grades-container">
        <h2>AI-Generated Grades</h2>
        <table className="grades-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Grade</th>
              <th>Feedback</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((student) => (
              <tr key={student.rollNumber}>
                <td>{student.rollNumber}</td>
                <td>{student.grade}</td>
                <td>{student.feedback}</td>
                <td>
                  <button onClick={() => handleEdit(student)} className="edit-btn">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="buttons-container">
        <button className="accept-btn" onClick={handleAcceptAll}>Accept All</button>
        <button className="retry-btn" onClick={handleRetry}>Retry Evaluation</button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="model-content-cont">
            <h2>Edit Grade for {selectedStudent.rollNumber}</h2>
            <label>
              Manual Grade:
              <input
                type="text"
                value={manualGrade}
                onChange={(e) => setManualGrade(e.target.value)}
              />
            </label>
            <button className="save-btn" onClick={handleSaveGrade}>Save</button>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherGradesPage;
