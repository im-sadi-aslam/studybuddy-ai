const QuizAttempt = require('../models/QuizAttempt');
const { generateQuiz } = require('../utils/geminiAI');

// Generate Quiz from Note
const generateQuizFromNote = async (req, res) => {
  try {
    const { noteContent, difficulty = 'medium', numQuestions = 5 } = req.body;
    
    if (!noteContent) {
      return res.status(400).json({ success: false, message: 'No content provided' });
    }
    
    const quiz = await generateQuiz(noteContent, difficulty, numQuestions);
    res.json({ success: true, quiz });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save Quiz Attempt
const saveQuizAttempt = async (req, res) => {
  try {
    const { title, questions, score, totalQuestions, percentage, timeTaken, difficulty } = req.body;
    
    const quizAttempt = await QuizAttempt.create({
      user: req.user._id,
      title,
      questions,
      score,
      totalQuestions,
      percentage,
      timeTaken,
      difficulty
    });
    
    req.user.learningStats.totalQuizzes += 1;
    req.user.learningStats.averageScore = 
      (req.user.learningStats.averageScore * (req.user.learningStats.totalQuizzes - 1) + percentage) / 
      req.user.learningStats.totalQuizzes;
    await req.user.save();
    
    res.status(201).json({ success: true, quizAttempt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Quiz Attempts
const getUserQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateQuizFromNote, saveQuizAttempt, getUserQuizAttempts };