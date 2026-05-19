import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { path: '/upload', icon: 'fas fa-cloud-upload-alt', label: 'Upload Notes' },
    { path: '/summary', icon: 'fas fa-robot', label: 'AI Summary' },
    { path: '/quiz', icon: 'fas fa-question-circle', label: 'AI Quiz' },
    { path: '/history', icon: 'fas fa-history', label: 'History' },
    { path: '/profile', icon: 'fas fa-user', label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-graduation-cap"></i>
          <span>StudyBuddy AI</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;