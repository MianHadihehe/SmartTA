import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styling/teacherhome.css'; 
import uploadIcon from '../assets/upload_icon.png';
import walkingRobo from '../assets/walking-robo.gif';
import MessageBox from './MessageBox';
import loadingSpinner from '../assets/loading-spinner.gif'; // Add a spinner image or animation


const ModelSolutionPage = () => {

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
  
    let questionPaper = location.state?.uploadedData;
    const assignmentNumber = location.state?.assignmentNumber;
    const username = location.state?.username;
    questionPaper = questionPaper.text;

    // console.log(questionPaper);
    
  
    console.log("question paper receied in teavhe rhome is: \n",questionPaper);
  
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const saveAssignment = async (result) =>{
        console.log("in save assignemnt number ", assignmentNumber);
        console.log("data: ",result);
        if (!assignmentNumber || !result) {
          showMessage('❌ Some error occured while saving the assignment question paper.');
          return;
      }
    
        const requestBody = {
            assignmentNumber: assignmentNumber,
            questionPaper: questionPaper,
            modelSolution: result
        };
    
        try {
            const response = await fetch('http://localhost:8080/api/save-assignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                showMessage('✅ Assignment saved and uploaded successfully!');
                // console.log(data);
                setTimeout(() => {
                    navigate('/teacher-home', { state: { assignmentNumber, username, questionPaper, modelSolution: result } });
              }, 1100); 
            } else {
                throw new Error(data.message || 'Failed to save the assignment');
            }
        } catch (error) {
            // alert(`Error: ${error.message}`);
            showMessage('❌ Some error occured while saving the assignment question paper.');
        }
      }
    
  
  
    const showMessage = (message) => {
      setMessageBoxContent(message);
      setMessageBoxVisible(true);
      setTimeout(() => {
        setMessageBoxVisible(false);  // Automatically hide the message after 5 seconds
      }, 5000);
    };
  
  
    const handleDragLeave = () => {
      setIsDragging(false);
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
    
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(droppedFiles);
      const rollNumbers = droppedFiles.map((file) => file.name.substring(0, 8));
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
          // rollNumberRender();
          showMessage('✅ Files Uploaded Successfully!');
          // console.log('Files uploaded:', result);
          setUploadStatusCode(1);
          saveAssignment(result);
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
  
    // console.log(questionPaper);
  
  
    // console.log(rollNumber);
    
  
    const handleFileSelect = (e) => {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      const rollNumbers = selectedFiles.map((file) => file.name.substring(0, 8));
      setRollNumber(rollNumbers);
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
          <span>Upload Model Solution :</span>
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
            onChange={handleFileSelect}
            className="file-upload-input"
            disabled={isLoading} // Disable file selection when loading
          />
        </div>
      </div>
      </div>

      <div className="submit-cont">
        <button 
          className='btn-submit' 
          onClick={uploadFiles} 
          type='button' 
          disabled={isLoading} // Disable when loading
        >
          Upload File
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

export default ModelSolutionPage;
