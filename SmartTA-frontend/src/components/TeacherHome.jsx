import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styling/teacherhome.css'; 
import uploadIcon from '../assets/upload_icon.png';
import walkingRobo from '../assets/walking-robo.gif';

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {}; 

  const [questionsFile, setQuestionsFile] = useState(null); // Questions file
  const [studentFile, setStudentFile] = useState(null); // Student file
  const [questionsText, setQuestionsText] = useState(''); // OCR text for questions
  const [studentText, setStudentText] = useState(''); // OCR text for student response
  const [uploadStatus, setUploadStatus] = useState(null); // Tracks upload success or error
  const [evaluationResult, setEvaluationResult] = useState(''); // Stores evaluation result
  const [loadingQuestionsOCR, setLoadingQuestionsOCR] = useState(false); // Spinner for Questions OCR
  const [loadingStudentOCR, setLoadingStudentOCR] = useState(false); // Spinner for Student OCR

  // Function to upload a file and extract OCR text
  const uploadFileForOCR = async (file, setTextCallback, setLoadingCallback, fileType) => {
    if (!file) {
      setUploadStatus("No file selected.");
      return;
    }

    setLoadingCallback(true); // Show spinner
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/upload/extract-text", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setTextCallback(result.text); // Save OCR text using the provided callback
        console.log(`Extracted text (${fileType}):`, result.text);
        setUploadStatus(`${fileType} OCR completed successfully.`);
      } else {
        setUploadStatus(`${fileType} OCR failed. Please try again.`);
        console.error("OCR failed:", await response.text());
      }
    } catch (error) {
      setUploadStatus("Error during OCR process.");
      console.error("OCR Error:", error);
    } finally {
      setLoadingCallback(false); // Hide spinner
    }
  };

  // Handle OCR for Questions File
  const handleQuestionsUpload = async () => {
    if (!questionsFile) {
      setUploadStatus("Please upload a questions file.");
      return;
    }
    setUploadStatus("Processing Questions File...");
    await uploadFileForOCR(questionsFile, setQuestionsText, setLoadingQuestionsOCR, "Questions File");
  };

  // Handle OCR for Student File
  const handleStudentUpload = async () => {
    if (!studentFile) {
      setUploadStatus("Please upload a student file.");
      return;
    }
    setUploadStatus("Processing Student File...");
    await uploadFileForOCR(studentFile, setStudentText, setLoadingStudentOCR, "Student File");
  };

  // Handle Evaluation
  const handleEvaluate = async () => {
    if (!questionsText || !studentText) {
      setEvaluationResult("Please ensure both files are uploaded and processed.");
      return;
    }

    const combinedText = `Questions:\n${questionsText}\n\nStudent Response:\n${studentText}`;
    console.log("Sending combined text for evaluation:", combinedText);

    try {
      const response = await fetch("http://localhost:8080/api/grade/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ocrText: combinedText }),
      });

      if (response.ok) {
        const result = await response.json();
        setEvaluationResult(result.gradedText); // Save GPT-4 result
        console.log("Evaluation Result:", result.gradedText);

        // Redirect to the grades page after evaluation
        navigate('/teacher-grades');
      } else {
        setEvaluationResult("Evaluation failed. Please try again.");
        console.error("Evaluation failed:", await response.text());
      }
    } catch (error) {
      setEvaluationResult("An error occurred during evaluation.");
      console.error("Evaluation Error:", error);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="main-teacher-home">
      <div className="teacher-lo-btn-cont">
        <button className="teacher-lo-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="logo">
        Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span>
      </div>
      <div className="msg-robo-cont">
        <div className="welcome-msg">
          Welcome, Prof. {username}
        </div>
        <div className="walking-robo">
          <img className="walkingroboicon" src={walkingRobo} alt="Walking Robo" />
        </div>
      </div>

      {/* Questions File Upload */}
      <div className="drag-drop-area">
        <h3>Upload Questions File</h3>
        <input type="file" onChange={(e) => setQuestionsFile(e.target.files[0])} />
        <button className="btn-submit" onClick={handleQuestionsUpload}>
          {loadingQuestionsOCR ? (
            <span className="spinner"></span> // Spinner for Questions OCR
          ) : (
            "OCR Questions"
          )}
        </button>
      </div>

      {/* Student File Upload */}
      <div className="drag-drop-area">
        <h3>Upload Student File</h3>
        <input type="file" onChange={(e) => setStudentFile(e.target.files[0])} />
        <button className="btn-submit" onClick={handleStudentUpload}>
          {loadingStudentOCR ? (
            <span className="spinner"></span> // Spinner for Student OCR
          ) : (
            "OCR Student Response"
          )}
        </button>
      </div>

      {/* Evaluate */}
      <div className="submit-cont">
        <button className="btn-submit" onClick={handleEvaluate}>Evaluate</button>
      </div>

      
    </div>
  );
};

export default TeacherHome;
