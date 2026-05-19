const User = require('../models/User');
const Note = require('../models/Note');
const Summary = require('../models/Summary');
const QuizAttempt = require('../models/QuizAttempt');

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    req.user.name = name || req.user.name;
    req.user.email = email || req.user.email;
    await req.user.save();
    
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile Picture
const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // For local storage without cloudinary
    const fileUrl = req.file.path || req.file.filename;
    req.user.profilePicture = fileUrl;
    await req.user.save();
    
    res.json({ success: true, profilePicture: req.user.profilePicture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Statistics
const getUserStatistics = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments({ user: req.user._id });
    const totalSummaries = await Summary.countDocuments({ user: req.user._id });
    const totalQuizzes = await QuizAttempt.countDocuments({ user: req.user._id });
    
    res.json({
      success: true,
      stats: {
        totalNotes,
        totalSummaries,
        totalQuizzes,
        averageScore: req.user.learningStats.averageScore
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Activity History
const getUserHistory = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    const summaries = await Summary.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    const quizzes = await QuizAttempt.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    
    const history = [
      ...notes.map(n => ({ type: 'note', data: n, date: n.createdAt })),
      ...summaries.map(s => ({ type: 'summary', data: s, date: s.createdAt })),
      ...quizzes.map(q => ({ type: 'quiz', data: q, date: q.createdAt }))
    ].sort((a, b) => b.date - a.date);
    
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getUserProfile, 
  updateUserProfile, 
  updateProfilePicture, 
  getUserStatistics, 
  getUserHistory 
};