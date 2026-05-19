const Note = require('../models/Note');
const Summary = require('../models/Summary');
const { generateSummary } = require('../utils/geminiAI');

// Upload Note
const uploadNote = async (req, res) => {
  try {
    console.log('Upload note request');
    const { title, content, category } = req.body;
    
    const note = await Note.create({
      user: req.user._id,
      title: title || 'Untitled',
      content: content || '',
      category: category || 'TEXT',
      fileName: req.file?.originalname,
      fileUrl: req.file?.path,
      fileType: req.file?.mimetype
    });
    
    req.user.learningStats.totalNotes += 1;
    await req.user.save();
    
    res.status(201).json({ success: true, note });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Notes
const getUserNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate AI Summary
const generateAISummary = async (req, res) => {
  try {
    const { noteId, content } = req.body;
    let textToSummarize = content;
    
    if (noteId) {
      const note = await Note.findOne({ _id: noteId, user: req.user._id });
      if (!note) {
        return res.status(404).json({ success: false, message: 'Note not found' });
      }
      textToSummarize = note.content || note.title;
    }
    
    const summary = await generateSummary(textToSummarize);
    
    const savedSummary = await Summary.create({
      user: req.user._id,
      note: noteId,
      title: `Summary ${new Date().toLocaleDateString()}`,
      ...summary
    });
    
    res.json({ success: true, summary: savedSummary });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Summaries
const getUserSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, summaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    await note.deleteOne();
    req.user.learningStats.totalNotes -= 1;
    await req.user.save();
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadNote, getUserNotes, generateAISummary, getUserSummaries, deleteNote };