const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// Import controllers
const { 
  getUserProfile, 
  updateUserProfile, 
  updateProfilePicture, 
  getUserStatistics, 
  getUserHistory 
} = require('../controllers/userController');

console.log('User Controllers:', { getUserProfile, updateUserProfile, updateProfilePicture, getUserStatistics, getUserHistory });

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/profile-picture', upload.single('profilePicture'), updateProfilePicture);
router.get('/statistics', getUserStatistics);
router.get('/history', getUserHistory);

module.exports = router;