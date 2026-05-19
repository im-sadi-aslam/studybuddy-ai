import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import './AISummary.css';

const AISummary = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState('');
  const [customText, setCustomText] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notes/notes');
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!selectedNote && !customText.trim()) {
      toast.error('Please select a note or enter text to summarize');
      return;
    }

    setGenerating(true);
    try {
      const payload = selectedNote 
        ? { noteId: selectedNote }
        : { content: customText };
      
      const response = await api.post('/notes/generate-summary', payload);
      setSummary(response.data.summary);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadSummary = () => {
    if (!summary) return;
    
    const content = `
StudyBuddy AI Summary
=====================

Title: ${summary.title || 'Generated Summary'}

SHORT SUMMARY:
${summary.shortSummary}

DETAILED SUMMARY:
${summary.detailedSummary}

KEY POINTS:
${summary.keyPoints?.map((point, i) => `${i + 1}. ${point}`).join('\n')}

TOPICS COVERED:
${summary.topics?.join(', ')}

Generated on: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded!');
  };

  if (loading) return <Loader />;

  return (
    <div className="ai-summary">
      <div className="summary-header">
        <h1>AI Summary Generator</h1>
        <p>Transform your study materials into concise, easy-to-understand summaries</p>
      </div>

      <div className="summary-input glass-card">
        <h2>Select Source Material</h2>
        
        <div className="input-options">
          <div className="option">
            <label>
              <input
                type="radio"
                checked={!selectedNote && !customText}
                onChange={() => {
                  setSelectedNote('');
                  setCustomText('');
                }}
              />
              <span>Select from my notes</span>
            </label>
            
            {notes.length > 0 && (
              <select
                value={selectedNote}
                onChange={(e) => {
                  setSelectedNote(e.target.value);
                  setCustomText('');
                }}
                className="note-select"
                disabled={!selectedNote && !customText}
              >
                <option value="">Choose a note...</option>
                {notes.map(note => (
                  <option key={note._id} value={note._id}>{note.title}</option>
                ))}
              </select>
            )}
          </div>

          <div className="option">
            <label>
              <input
                type="radio"
                checked={customText !== ''}
                onChange={() => {
                  setSelectedNote('');
                  setCustomText(' ');
                }}
              />
              <span>Or paste your own text</span>
            </label>
            
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste your study material here..."
              rows="6"
              className="custom-textarea"
              disabled={!customText}
            />
          </div>
        </div>

        <button 
          onClick={generateSummary} 
          className="generate-btn"
          disabled={generating}
        >
          {generating ? <Loader /> : 'Generate AI Summary'}
        </button>
      </div>

      {summary && (
        <div className="summary-output glass-card animate-fadeInUp">
          <div className="summary-actions">
            <button onClick={() => copyToClipboard(summary.shortSummary)}>
              <i className="fas fa-copy"></i> Copy Short Summary
            </button>
            <button onClick={() => copyToClipboard(summary.detailedSummary)}>
              <i className="fas fa-copy"></i> Copy Detailed Summary
            </button>
            <button onClick={downloadSummary}>
              <i className="fas fa-download"></i> Download Summary
            </button>
          </div>

          <div className="summary-content">
            <div className="short-summary">
              <h3><i className="fas fa-compress"></i> Short Summary</h3>
              <p>{summary.shortSummary}</p>
            </div>

            <div className="detailed-summary">
              <h3><i className="fas fa-align-left"></i> Detailed Summary</h3>
              <p>{summary.detailedSummary}</p>
            </div>

            <div className="key-points">
              <h3><i className="fas fa-list-ul"></i> Key Points</h3>
              <ul>
                {summary.keyPoints?.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="topics">
              <h3><i className="fas fa-tags"></i> Topics Covered</h3>
              <div className="topics-list">
                {summary.topics?.map((topic, index) => (
                  <span key={index} className="topic-tag">{topic}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISummary;