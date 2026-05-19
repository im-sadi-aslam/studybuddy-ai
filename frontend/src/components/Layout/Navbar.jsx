import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const [currentTime] = useState(new Date());

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="greeting">
          <i className="fas fa-hand-peace"></i>
          <span>{getGreeting()}, {user?.name || 'Student'}!</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="stats-badge">
          <i className="fas fa-chart-simple"></i>
          <span>Avg Score: {Math.round(user?.learningStats?.averageScore || 0)}%</span>
        </div>
        
        <div className="user-info">
          <img 
            src={user?.profilePicture || 'https://via.placeholder.com/40'} 
            alt="Profile"
            className="user-avatar"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;