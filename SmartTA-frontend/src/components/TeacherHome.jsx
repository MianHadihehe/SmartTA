import React from 'react'
import '../styling/teacherhome.css'; 
import { useState } from 'react';
import uploadIcon from '../assets/upload_icon.png';
import walkingRobo from '../assets/walking-robo.gif';

const TeacherHome = () => {
    const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [showUploadButton, setShowUploadButton] = useState(true);

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
    
    const items = e.dataTransfer.items;
    const droppedFiles = [];
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].webkitGetAsEntry().isDirectory) {
        droppedFiles.push(items[i].getAsFile());
      }
    }

    setFiles(droppedFiles);
    setShowUploadButton(false);
  };

  console.log(files);

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

    setFiles(selectedFilesArray);
    setShowUploadButton(false); // Hide upload button on file select
  };

  const renderFileList = () => {
    if (files.length === 0) {
      return <p>No folder dropped yet. Drag a folder here.</p>;
    }
}
  return (
    <div className="main-teacher-home">
       
    <div className="logo"> 
        Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span>
        </div>
        <div className="msg-robo-cont">
        <div className="welcome-msg"> 
        Welcome, Prof. Hadi
        </div>

        <div className="walking-robo">
        <img className='walkingroboicon' src={walkingRobo} alt="" />
      </div>

        </div>
        

        <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    
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
        {isDragging ? 'Release to drop the folder' : 'Drag and drop a folder here'}
      </div>
      {renderFileList()}
      {showUploadButton && (
        <div className="file-upload-btn-cont">
          <input
            type="file"
            directory=""
            webkitdirectory="" 
            onChange={handleFileSelect}
            className="file-upload-input"
          />
        </div>
      )}
    </div>

    <div className="submit-cont">
        <button className='btn-submit' type='submit'>Evaluate</button>
    </div>

    </div>
  )
}

export default TeacherHome