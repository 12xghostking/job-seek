import React, { useState } from 'react';
import './styles.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const seekerName = queryParams.get('name')
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);
  
      try {
        const userName = seekerName;
        await axios.post(`http://localhost:5000/api/upload-resume?userName=${userName}`, formData);
  
        alert('Resume uploaded successfully.');
        setFile(null);
      } catch (error) {
        console.error('Error uploading resume:', error);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div>
      <h2>Resume Upload</h2>
      <label htmlFor="fileInput" className="btn btn-primary">
        Click to Upload
      </label>
      <input
        type="file"
        id="fileInput"
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div className="drop-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
        {file ? (
          <div>
            <p>File Selected: {file.name}</p>
            <button onClick={handleRemoveFile} className="btn btn-danger">
              Remove
            </button>
            <button onClick={handleUpload} className="btn btn-success">
              Upload
            </button>
          </div>
        ) : (
          <p>Drag & Drop or click to select a resume file</p>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
