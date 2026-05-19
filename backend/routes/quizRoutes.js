const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Import controllers
const { 
  generateQuizFromNote, 
  saveQuizAttempt, 
  getUserQuizAttempts 
} = require('../controllers/quizController');

console.log('Quiz Controllers:', { generateQuizFromNote, saveQuizAttempt, getUserQuizAttempts });

router.use(protect);

router.post('/generate', generateQuizFromNote);
router.post('/save-attempt', saveQuizAttempt);
router.get('/attempts', getUserQuizAttempts);

module.exports = router;