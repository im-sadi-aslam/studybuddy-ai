import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import './UploadNotes.css';

const UploadNotes = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('PDF');
  const [content, setContent] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav']
    }
  });

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const uploadFile = async (fileItem) => {
    const formData = new FormData();
    formData.append('file', fileItem.file);
    formData.append('title', title || fileItem.name);
    formData.append('category', category);
    if (content) formData.append('content', content);

    try {
      setUploadProgress(prev => ({ ...prev, [fileItem.id]: 0 }));
      
      const response = await api.post('/notes/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [fileItem.id]: percentCompleted }));
        }
      });

      if (response.data.success) {
        toast.success(`${fileItem.name} uploaded successfully!`);
        setFiles(files.filter(f => f.id !== fileItem.id));
      }
    } catch (error) {
      toast.error(`Failed to upload ${fileItem.name}`);
      console.error(error);
    }
  };

  const handleUploadAll = async () => {
    setUploading(true);
    for (const file of files) {
      await uploadFile(file);
    }
    setUploading(false);
    setTitle('');
    setContent('');
    toast.success('All files uploaded successfully!');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-notes">
      <div className="upload-header">
        <h1>Upload Study Materials</h1>
        <p>Drag and drop your files or click to browse</p>
      </div>

      <div className="upload-form glass-card">
        <div className="form-group">
          <label>Title (Optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your note"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="PDF">PDF Document</option>
            <option value="DOC">Word Document</option>
            <option value="TEXT">Text Note</option>
            <option value="VOICE">Voice Note</option>
          </select>
        </div>

        <div className="form-group">
          <label>Content (Optional)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Or type your notes here..."
            rows="4"
          />
        </div>
      </div>

      <div {...getRootProps()} className={`dropzone glass-card ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <i className="fas fa-cloud-upload-alt"></i>
        <p>{isDragActive ? 'Drop your files here...' : 'Drag & drop files here or click to browse'}</p>
        <small>Supports: PDF, DOC, DOCX, TXT, MP3, WAV (Max 10MB)</small>
      </div>

      {files.length > 0 && (
        <div className="files-list">
          <h2>Files to Upload ({files.length})</h2>
          {files.map(file => (
            <div key={file.id} className="file-item glass-card">
              <div className="file-info">
                <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf' : file.type.includes('audio') ? 'fa-file-audio' : 'fa-file-alt'}`}></i>
                <div className="file-details">
                  <h4>{file.name}</h4>
                  <p>{formatBytes(file.size)}</p>
                </div>
              </div>
              {uploadProgress[file.id] ? (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress[file.id]}%` }}></div>
                  </div>
                  <span>{uploadProgress[file.id]}%</span>
                </div>
              ) : (
                <button onClick={() => removeFile(file.id)} className="remove-btn">
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          ))}
          <button 
            onClick={handleUploadAll} 
            className="upload-all-btn"
            disabled={uploading}
          >
            {uploading ? <Loader /> : `Upload ${files.length} File(s)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadNotes;