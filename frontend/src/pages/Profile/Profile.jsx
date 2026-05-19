import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/user/profile', formData);
      updateUser(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }
    
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    setUploading(true);
    try {
      const response = await api.post('/user/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser({ ...user, profilePicture: response.data.profilePicture });
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const achievements = [
    { name: 'Quick Learner', icon: 'fas fa-rocket', earned: user?.learningStats?.totalNotes > 0 },
    { name: 'Quiz Master', icon: 'fas fa-trophy', earned: (user?.learningStats?.totalQuizzes || 0) >= 3 },
    { name: 'Top Performer', icon: 'fas fa-star', earned: (user?.learningStats?.averageScore || 0) >= 80 },
    { name: 'Dedicated Student', icon: 'fas fa-graduation-cap', earned: (user?.learningStats?.totalNotes || 0) >= 5 }
  ];

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account and view your progress</p>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar glass-card">
          <div className="profile-picture">
            <img 
              src={user?.profilePicture || 'https://via.placeholder.com/150'} 
              alt={user?.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            <label className="upload-photo">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                disabled={uploading}
              />
              <i className="fas fa-camera"></i>
              {uploading && <span className="upload-spinner"></span>}
            </label>
          </div>
          <h2>{user?.name || 'User'}</h2>
          <p>{user?.email || 'email@example.com'}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{user?.learningStats?.totalNotes || 0}</span>
              <span className="stat-label">Notes</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user?.learningStats?.totalQuizzes || 0}</span>
              <span className="stat-label">Quizzes</span>
            </div>
            <div className="stat">
              <span className="stat-value">{Math.round(user?.learningStats?.averageScore || 0)}%</span>
              <span className="stat-label">Avg Score</span>
            </div>
          </div>
        </div>

        <div className="profile-main">
          <div className="info-section glass-card">
            <div className="section-header">
              <h3>Personal Information</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  <i className="fas fa-edit"></i> Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="info-display">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{user?.name || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <p>{user?.email || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="achievements-section glass-card">
            <h3>Achievements</h3>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <div key={index} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
                  <i className={achievement.icon}></i>
                  <h4>{achievement.name}</h4>
                  <p>{achievement.earned ? 'Earned ✓' : 'Locked 🔒'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="account-settings glass-card">
            <h3>Account Settings</h3>
            <button className="setting-btn" onClick={() => toast.info('Feature coming soon!')}>
              <i className="fas fa-key"></i> Change Password
            </button>
            <button className="setting-btn" onClick={() => toast.info('Feature coming soon!')}>
              <i className="fas fa-bell"></i> Notification Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;