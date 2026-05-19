import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [filter, searchTerm, history]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/user/history');
      setHistory(response.data.history);
      setFilteredHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const filterHistory = () => {
    let filtered = [...history];
    
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.type === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.data.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.data.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredHistory(filtered);
  };

  const deleteItem = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (type === 'note') {
          await api.delete(`/notes/note/${id}`);
        }
        // Add delete for other types as needed
        
        toast.success('Item deleted successfully');
        fetchHistory();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'note': return 'fas fa-file-alt';
      case 'summary': return 'fas fa-robot';
      case 'quiz': return 'fas fa-question-circle';
      default: return 'fas fa-file';
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'note': return '#667eea';
      case 'summary': return '#f093fb';
      case 'quiz': return '#4facfe';
      default: return '#43e97b';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="history">
      <div className="history-header">
        <h1>Activity History</h1>
        <p>View all your notes, summaries, and quiz attempts</p>
      </div>

      <div className="history-controls glass-card">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search your history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'note' ? 'active' : ''}`}
            onClick={() => setFilter('note')}
          >
            <i className="fas fa-file-alt"></i> Notes
          </button>
          <button
            className={`filter-btn ${filter === 'summary' ? 'active' : ''}`}
            onClick={() => setFilter('summary')}
          >
            <i className="fas fa-robot"></i> Summaries
          </button>
          <button
            className={`filter-btn ${filter === 'quiz' ? 'active' : ''}`}
            onClick={() => setFilter('quiz')}
          >
            <i className="fas fa-question-circle"></i> Quizzes
          </button>
        </div>
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="empty-state glass-card">
            <i className="fas fa-box-open"></i>
            <p>No history found</p>
            <button onClick={() => window.location.href = '/upload'}>Start Learning</button>
          </div>
        ) : (
          filteredHistory.map((item, index) => (
            <div key={index} className="history-item glass-card animate-fadeInUp">
              <div className="item-icon" style={{ background: getColor(item.type) }}>
                <i className={getIcon(item.type)}></i>
              </div>
              
              <div className="item-details">
                <h3>{item.data.title || item.data.fileName || item.data.name || 'Untitled'}</h3>
                <p className="item-date">
                  <i className="fas fa-calendar-alt"></i>
                  {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                </p>
                {item.type === 'quiz' && item.data.percentage && (
                  <p className="item-score">Score: {item.data.percentage.toFixed(1)}%</p>
                )}
                {item.type === 'note' && item.data.category && (
                  <p className="item-category">Type: {item.data.category}</p>
                )}
              </div>
              
              <button 
                onClick={() => deleteItem(item.type, item.data._id)}
                className="delete-btn"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;