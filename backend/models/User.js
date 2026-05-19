const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  role: {
    type: String,
    default: 'student'
  },
  learningStats: {
    totalNotes: { type: Number, default: 0 },
    totalQuizzes: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    studyTime: { type: Number, default: 0 }
  },
  achievements: [{
    name: String,
    earnedAt: Date,
    icon: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method - IMPORTANT
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);