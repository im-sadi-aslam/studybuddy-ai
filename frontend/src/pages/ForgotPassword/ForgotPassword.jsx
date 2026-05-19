import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card glass-card animate-fadeInUp">
        <div className="forgot-header">
          <div className="logo-icon">
            <i className="fas fa-key"></i>
          </div>
          <h2>Forgot Password?</h2>
          <p>No worries! Enter your email and we'll send you a reset link</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
              />
            </div>

            <button type="submit" className="reset-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <h3>Check Your Email</h3>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <p>Please check your inbox and follow the instructions</p>
          </div>
        )}

        <div className="forgot-footer">
          <Link to="/login">
            <i className="fas fa-arrow-left"></i> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;