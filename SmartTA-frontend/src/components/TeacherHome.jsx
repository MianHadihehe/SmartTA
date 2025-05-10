import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import '../styling/teacherhome.css'; 
import uploadIcon from '../assets/upload_icon.png';
import walkingRobo from '../assets/walking-robo.gif';
import MessageBox from './MessageBox';
import loadingSpinner from '../assets/loading-spinner.gif'; // Add a spinner image or animation

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  // const { username } = location.state || {}; 
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadStatusCode, setUploadStatusCode] = useState(0);
  const [isLoading, setIsLoading] = useState(false); 
  const [uploadedData, setUploadedData] = useState(null);
  const [rollNumber, setRollNumber] = useState(null);
  const [messageBoxVisible, setMessageBoxVisible] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState('');  

  const questionPaper = location.state?.questionPaper;
  const assignmentNumber = location.state?.assignmentNumber;
  const username = location.state?.username;
  const modelSolution = location.state?.modelSolution;

  // Helper to show temporary messages
  const showMessage = (message) => {
    setMessageBoxContent(message);
    setMessageBoxVisible(true);
    setTimeout(() => {
      setMessageBoxVisible(false);  // Automatically hide the message after 5 seconds
    }, 5000);
  };

  // Unzip any .zip file and return an array of File objects (PDFs or originals)
  const processFiles = async (incomingFiles) => {
    const out = [];
    for (let file of incomingFiles) {
      if (file.name.toLowerCase().endsWith('.zip')) {
        try {
          const buffer = await file.arrayBuffer();
          const zip = await JSZip.loadAsync(buffer);
          const pdfEntries = Object.keys(zip.files)
            .filter(name => name.toLowerCase().endsWith('.pdf'));
          if (pdfEntries.length === 0) {
            showMessage('❌ No PDF found in zip.');
            continue;
          }
          // take first PDF entry and strip any folder path
          const entry = pdfEntries[0];
          const baseName = entry.substring(entry.lastIndexOf('/') + 1);
          const blob = await zip.file(entry).async('blob');
          const pdfFile = new File([blob], baseName, { type: 'application/pdf' });
          out.push(pdfFile);
        } catch (e) {
          console.error('Zip processing error:', e);
          showMessage('❌ Could not read zip file.');
        }
      } else {
        out.push(file);
      }
    }
    return out;
  };


  console.log(rollNumber);

  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const processed = await processFiles(droppedFiles);
    setFiles(processed);
    const rollNumbers = processed.map((file) => file.name.substring(0, 8));
    setRollNumber(rollNumbers);
  };

  const handleFileSelect = async (e) => {
    const raw = Array.from(e.target.files);
    const processed = await processFiles(raw);
    setFiles(processed);
    const rollNumbers = processed.map((file) => file.name.substring(0, 8));
    setRollNumber(rollNumbers);
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      showMessage('❌ No Files to Upload.');
      return;
    }

    setIsLoading(true);
    setUploadStatus(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file); 
    });

    try {
      const response = await fetch('http://localhost:8080/api/upload/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadedData(result); 
        showMessage('✅ Files Uploaded Successfully!');
        setUploadStatusCode(1);
      } else {
        showMessage('❌ File Upload Failed.');
        console.error('Failed response:', await response.text());
      }
    } catch (error) {
      showMessage('❌ Error Uploading Files.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!uploadedData) {
      showMessage('❌ No uploaded data to evaluate.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/evaluate/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: uploadedData, questions: questionPaper, solution: modelSolution }), 
      });

      if (response.ok) {
        const result = await response.json();
        navigate('/teacher-grades', { state: { result, rollNumber, assignmentNumber, username } }); 
      } else {
        console.error('Evaluation failed:', await response.text());
        showMessage('❌ Evaluation failed.');
      }
    } catch (error) {
      console.error('Error during evaluation:', error);
      showMessage('❌ Error during evaluation.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFileList = () => {
    if (files.length === 0) {
      return <p>No files selected yet. Drag and drop files here or use the file picker.</p>;
    }

    return (
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name.substring(0, 8)}</li>
        ))}
      </ul>
    );
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className={`main-teacher-home ${isLoading ? 'loading' : ''}`}> {/* Add a class for loading state */}
      <div className="teacher-lo-btn-cont">
        <button 
          className='teacher-lo-btn' 
          onClick={handleLogout} 
          disabled={isLoading} // Disable when loading
        >
          Logout
        </button>
      </div>
      <div className="logo"> 
        Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span>
      </div>
      <div className="msg-robo-cont">
        <div className="welcome-msg"> 
          <span style={{ display: uploadStatusCode === 0 ? 'block' : 'none' }}>Upload&nbsp;</span> <span style={{ display: uploadStatusCode === 1 ? 'block' : 'none' }}>Evaluate&nbsp;</span> Student Response :
        </div>
        <div className="walking-robo">
          <img className='walkingroboicon' src={walkingRobo} alt="" />
        </div>
      </div>
      
      {messageBoxVisible && <MessageBox message={messageBoxContent} />}

      <div
        className={`drag-drop-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="second-in-command">
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
              accept=".pdf,.zip"
              onChange={handleFileSelect}
              className="file-upload-input"
              disabled={isLoading} // Disable file selection when loading
            />
          </div>
        </div>
      </div>

      <div className="submit-cont">
        <button 
          style={{ display: uploadStatusCode === 0 ? 'block' : 'none' }}
          className='btn-submit' 
          onClick={uploadFiles} 
          type='button' 
          disabled={isLoading} // Disable when loading
        >
          Upload Files
        </button>
        <button 
          style={{ display: uploadStatusCode === 1 ? 'block' : 'none' }}
          className='btn-submit' 
          onClick={handleEvaluate} 
          type='submit' 
          disabled={isLoading} // Disable when loading
        >
          Evaluate
        </button>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <img src={loadingSpinner} alt="Loading..." />
          Loading...
        </div>
      )} 

      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.isSuccess ? 'success' : 'error'}`}>
          {uploadStatus.message}
        </div>
      )}
    </div>
  );
};

export default TeacherHome;
