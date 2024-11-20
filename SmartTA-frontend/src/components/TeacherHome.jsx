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
      setUploadStatus('No files to upload.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file); // Ensure the key matches the backend expectation
    });

    try {
      const response = await fetch('http://localhost:8080/api/upload/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus('Files uploaded successfully!');
        console.log('Files uploaded:', result);
      } else {
        setUploadStatus('File upload failed.');
        console.error('Failed response:', await response.text());
      }
    } catch (error) {
      setUploadStatus('Error uploading files.');
      console.error('Error:', error);
    }
  };

  const handleEvaluate = () => {
    navigate('/teacher-grades');
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
    </div>
  );
};

export default TeacherHome;
