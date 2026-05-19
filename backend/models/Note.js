const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fileName: String,
  fileUrl: String,
  fileType: String,
  fileSize: Number,
  category: {
    type: String,
    enum: ['PDF', 'DOC', 'TEXT', 'VOICE'],
    default: 'TEXT'
  },
  content: String,
  cloudinaryId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', noteSchema);