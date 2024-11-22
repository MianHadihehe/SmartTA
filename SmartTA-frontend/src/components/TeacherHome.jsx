import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styling/teacherhome.css'; 
import uploadIcon from '../assets/upload_icon.png';
import walkingRobo from '../assets/walking-robo.gif';

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { username } = location.state || {}; 
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null); // Tracks upload success or error
  const [evaluationResult, setEvaluationResult] = useState(''); // Stores evaluation result
  const [extractedText, setExtractedText] = useState(''); // Stores OCR text

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setUploadStatus("No files to upload.");
      return;
    }
  
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file); // Ensure the key matches the backend expectation
    });
  
    try {
      const response = await fetch("http://localhost:8080/api/upload/extract-text", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        setUploadStatus("Files uploaded successfully!");
        setExtractedText(result.text); // Save the extracted text to the state
        console.log("Extracted text:", result.text);
      } else {
        setUploadStatus("File upload failed.");
        console.error("Failed response:", await response.text());
      }
    } catch (error) {
      setUploadStatus("Error uploading files.");
      console.error("Error:", error);
    }
  };

  const handleEvaluate = async () => {
    try {
      // Ensure the OCR text is available
      if (!extractedText || extractedText.trim() === "") {
        setEvaluationResult("No OCR text available for evaluation. Please upload and extract text first.");
        return;
      }
  
      console.log("Sending extracted OCR text for grading:", extractedText);
  
      // Make a POST request to the grading API
      const response = await fetch("http://localhost:8080/api/grade/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ocrText: extractedText }), // Use the actual extracted text
      });
  
      if (response.ok) {
        const result = await response.json();
        setEvaluationResult(result.gradedText); // Update the state with the graded result
        console.log("Grading result:", result.gradedText);
      } else {
        console.error("Grading failed:", await response.text());
        setEvaluationResult("Grading failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during grading:", error);
      setEvaluationResult("An error occurred while grading. Please try again.");
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const renderFileList = () => {
    if (files.length === 0) {
      return <p>No files selected yet. Drag and drop files here or use the file picker.</p>;
    }

    return (
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    );
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
        <div className="welcome-msg"> 
          Welcome, Prof. {username}
        </div>

        <div className="walking-robo">
          <img className='walkingroboicon' src={walkingRobo} alt="" />
        </div>
      </div>
      
      <div
        className={`drag-drop-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          <img src={uploadIcon} alt="Upload icon" />
        </div>
        <div className="drag-drop-message">
          {isDragging ? 'Release to drop files' : 'Drag and drop files here'}
        </div>
        {renderFileList()}
        <div className="file-upload-btn-cont">
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="file-upload-input"
          />
        </div>
      </div>

      <div className="submit-cont">
        <button className='btn-submit' onClick={uploadFiles} type='button'>Upload Files</button>
        <button className='btn-submit' onClick={handleEvaluate} type='submit'>Evaluate</button>
      </div>

      {uploadStatus && <div className="upload-status">{uploadStatus}</div>}

      {/* Display OCR Text */}
      {extractedText && (
        <div className="ocr-text">
          <h3>Extracted OCR Text:</h3>
          <pre>{extractedText}</pre> {/* Preformatted for better readability */}
        </div>
      )}

      {/* Display Evaluation Result */}
      {evaluationResult && (
        <div className="evaluation-result">
          <h3>Evaluation Result:</h3>
          <p>{evaluationResult}</p>
        </div>
      )}
    </div>
  );
};

export default TeacherHome;
