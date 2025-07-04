import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styling/teacherhome.css'; 
import uploadIcon from '../assets/upload_icon.png';
import walkingRobo from '../assets/walking-robo.gif';
import loadingSpinner from '../assets/loading-spinner.gif'; // Add a spinner image or animation
import MessageBox from './MessageBox';

const SubmitQuestionPaper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadStatusCode, setUploadStatusCode] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [rollNumber, setRollNumber] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [assignmentNumber, setAssignmentNumber] = useState('');
  const [messageBoxVisible, setMessageBoxVisible] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState('');  


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const showMessage = (message) => {
    setMessageBoxContent(message);
    setMessageBoxVisible(true);
    setTimeout(() => {
      setMessageBoxVisible(false);  // Automatically hide the message after 5 seconds
    }, 5000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    const rollNumbers = droppedFiles.map((file) => file.name.substring(0, 8));
    setRollNumber(rollNumbers);
  };

  const handleNewAssignment = () =>{

  }

  const uploadFiles = async () => {
    if (files.length === 0) {
      showMessage('❌ No files to be uploaded!')
      return;
    }

    setIsLoading(true);
    setUploadStatus(null);

    const formData = new FormData();
    files.forEach((file) => {
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
        // sh('Files Uploaded Successfully!', true);
        console.log('Files uploaded:', result);
        setUploadStatusCode(1);
        // handleSubmitQuestion(result);
        navigate('/model-solution', { state: { assignmentNumber, username, uploadedData: result } });
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

  // const showUploadStatus = (message, isSuccess) => {
  //   setUploadStatus({ message, isSuccess });
  //   setTimeout(() => {
  //     setUploadStatus(null);
  //   }, 3000); // 3 seconds
  // };

  // const saveAssignment = async (result) =>{
  //   console.log("in save assignemnt number ", assignmentNumber);
  //   console.log("data: ",result);
  //   if (!assignmentNumber || !result) {
  //     showMessage('❌ Some error occured while saving the assignment question paper.');
  //     return;
  // }

  //   const requestBody = {
  //       assignmentNumber: assignmentNumber,
  //       text: result
  //   };

  //   try {
  //       const response = await fetch('http://localhost:8080/api/save-assignment', {
  //           method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify(requestBody)
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //           showMessage('✅ Assignment saved and uploaded successfully!');
  //           // console.log(data);
  //           setTimeout(() => {
  //             navigate('/model-solution', { state: { assignmentNumber, username, uploadedData: result } });
  //         }, 1500); 
  //       } else {
  //           throw new Error(data.message || 'Failed to save the assignment');
  //       }
  //   } catch (error) {
  //       // alert(`Error: ${error.message}`);
  //       showMessage('❌ Some error occured while saving the assignment question paper.');
  //   }
  // }

  // const handleSubmitQuestion = (result) => {
  //   if (!result) {
  //     showUploadStatus('No question paper submitted.', false);
  //     return;
  //   }
  
  //   // Pass the result directly to the next page
  //   navigate('/teacher-home', { state: { uploadedData: result } });
  // };

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

  const handleProceed = () =>{
    if(assignmentNumber===''){
      showMessage('❌ Must enter assignment number!');
    // console.log("hii1"); 
      return;
    }
    // console.log("hii2");
    setIsModalOpen(false);
  }

  // const handleModalCancel = () =>{
  //   if(assignmentNumber===''){
  //     showMessage('❌ Must enter assignment number!');
  //     return;
  //   }
  //   setAssignmentNumber('');
  //   setIsModalOpen(false);
  // }

  return (
    <div className={`main-teacher-home ${isLoading ? 'loading' : ''}`}>
      {/* Logout Button */}
      <div className="teacher-lo-btn-cont">
        <button
          className="teacher-lo-btn"
          onClick={handleLogout}
          disabled={isLoading}
        >
          Logout
        </button>
      </div>

      {/* Logo */}
      <div className="logo">
        Smart<span style={{ color: 'rgb(234,67,89)' }}>TA</span>
      </div>

      {/* Welcome Message and Robo Icon */}
      <div className="msg-robo-cont">
        <div className="welcome-msg">Submit Question Paper :</div>
        <div className="walking-robo">
          <img className="walkingroboicon" src={walkingRobo} alt="Walking Robo" />
        </div>
      </div>

      {/* Drag-and-Drop Area */}
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
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="submit-cont">
        <button
          style={{ display: uploadStatusCode === 0 ? 'block' : 'none' }}
          className="btn-submit"
          onClick={uploadFiles}
          type="button"
          disabled={isLoading}
        >
          Upload Question Paper
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading-indicator">
          <img src={loadingSpinner} alt="Loading..." />
          Loading...
        </div>
      )}

      {messageBoxVisible && <MessageBox message={messageBoxContent} />}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="model-content-cont">
            <h2>Enter Assignment Number</h2>
            <label>
              Assignment Number:
              </label>
              <form>
                <input
                className='modal-input'
                type="number"
                value={assignmentNumber}
                required
                onChange={(e) => setAssignmentNumber(e.target.value)}
              />
              </form>
            <button className="save-btn" onClick={handleProceed}>Save</button>
            {/* <button className="close-btn" onClick={handleModalCancel}>Cancel</button> */}
          </div>
          </div>
        </div>
      )}

      {/* Upload Status Message */}
      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.isSuccess ? 'success' : 'error'}`}>
          {uploadStatus.message}
        </div>
      )}
    </div>
  );
};

export default SubmitQuestionPaper;
