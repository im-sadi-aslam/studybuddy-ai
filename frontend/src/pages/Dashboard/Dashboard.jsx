import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Loader from '../../components/Loader/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, notesRes] = await Promise.all([
        api.get('/user/statistics'),
        api.get('/notes/notes')
      ]);
      
      setStats(statsRes.data.stats);
      setRecentNotes(notesRes.data.notes.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Notes', value: stats?.totalNotes || 0, icon: 'fas fa-book', color: '#667eea' },
    { title: 'Quizzes Taken', value: stats?.totalQuizzes || 0, icon: 'fas fa-tasks', color: '#f093fb' },
    { title: 'Avg Score', value: `${Math.round(stats?.averageScore || 0)}%`, icon: 'fas fa-chart-line', color: '#4facfe' },
    { title: 'Summaries', value: stats?.totalSummaries || 0, icon: 'fas fa-robot', color: '#43e97b' }
  ];

  if (loading) return <Loader />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome Back, {user?.name}! 🎓</h1>
        <p>Here's your learning progress summary</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card glass-card card-hover">
            <div className="stat-icon" style={{ background: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button onClick={() => navigate('/upload')} className="action-btn">
            <i className="fas fa-cloud-upload-alt"></i>
            <span>Upload Notes</span>
          </button>
          <button onClick={() => navigate('/summary')} className="action-btn">
            <i className="fas fa-robot"></i>
            <span>Generate Summary</span>
          </button>
          <button onClick={() => navigate('/quiz')} className="action-btn">
            <i className="fas fa-question-circle"></i>
            <span>Take Quiz</span>
          </button>
          <button onClick={() => navigate('/history')} className="action-btn">
            <i className="fas fa-history"></i>
            <span>View History</span>
          </button>
        </div>
      </div>

      <div className="recent-section">
        <div className="recent-uploads">
          <h2>Recent Uploads</h2>
          {recentNotes.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>No notes uploaded yet</p>
              <button onClick={() => navigate('/upload')}>Upload Your First Note</button>
            </div>
          ) : (
            <div className="notes-list">
              {recentNotes.map((note) => (
                <div key={note._id} className="note-item glass-card">
                  <i className={`fas ${note.category === 'PDF' ? 'fa-file-pdf' : 'fa-file-alt'}`}></i>
                  <div className="note-info">
                    <h4>{note.title}</h4>
                    <p>{new Date(note.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="progress-tracker">
          <h2>Learning Progress</h2>
          <div className="progress-card glass-card">
            <div className="progress-item">
              <div className="progress-label">
                <span>Quiz Mastery</span>
                <span>{Math.round(stats?.averageScore || 0)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats?.averageScore || 0}%` }}></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>Notes Completion</span>
                <span>{Math.min(100, (stats?.totalNotes || 0) * 10)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, (stats?.totalNotes || 0) * 10)}%` }}></div>
              </div>
            </div>
            <div className="achievement-badges">
              <h3>Achievements</h3>
              <div className="badges">
                {stats?.totalNotes >= 5 && <div className="badge"><i className="fas fa-award"></i> Note Master</div>}
                {stats?.totalQuizzes >= 3 && <div className="badge"><i className="fas fa-trophy"></i> Quiz Champion</div>}
                {stats?.averageScore >= 80 && <div className="badge"><i className="fas fa-star"></i> Top Performer</div>}
                {stats?.totalNotes === 0 && <p className="no-badges">Complete tasks to earn badges!</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;