import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styling/teacherhome.css'; 
import { useState } from 'react';
import uploadIcon from '../assets/upload_icon.png';
import walkingRobo from '../assets/walking-robo.gif';

const TeacherHome = () => {

  const location = useLocation();
  const navigate = useNavigate(); 

  const { username } = location.state || {}; 

  console.log('Username:', username); 

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

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
  
    const items = e.dataTransfer.items;
    const droppedFiles = [];
  
    const readDirectory = async (entry) => {
      return new Promise((resolve, reject) => {
        const dirReader = entry.createReader();
        const entries = [];
  
        const readEntries = () => {
          dirReader.readEntries(async (results) => {
            if (!results.length) {
              resolve(entries); 
            } else {
              for (const result of results) {
                if (result.isDirectory) {
                  entries.push(...await readDirectory(result)); 
                } else {
                  entries.push(result); 
                }
              }
              readEntries(); 
            }
          }, reject);
        };
  
        readEntries();
      });
    };
  
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) {
        if (entry.isDirectory) {
          const filesFromDir = await readDirectory(entry);
          droppedFiles.push(...filesFromDir); 
        } else if (entry.isFile) {
          droppedFiles.push(entry); 
        }
      }
    }
  
    const filePromises = droppedFiles.map((entry) => {
      return new Promise((resolve) => {
        entry.file((file) => resolve(file));
      });
    });
  
    const filesArray = await Promise.all(filePromises);
    setFiles(filesArray);
    setShowUploadButton(false);
  };
  

  console.log(files);

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

    setFiles(selectedFilesArray);
    setShowUploadButton(false); 
  };

  const renderFileList = () => {
    if (files.length === 0) {
      return <p>No folder dropped yet. Drag a folder here.</p>;
    }
  };

  const handleLogout= () =>{
    navigate('/');
  }

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
  );
};

export default TeacherHome;
