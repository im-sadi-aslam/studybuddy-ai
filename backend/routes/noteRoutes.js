const express = require('express');
const { uploadNote, getUserNotes, generateAISummary, getUserSummaries, deleteNote } = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/upload', upload.single('file'), uploadNote);
router.get('/notes', getUserNotes);
router.delete('/note/:id', deleteNote);
router.post('/generate-summary', generateAISummary);
router.get('/summaries', getUserSummaries);

module.exports = router;