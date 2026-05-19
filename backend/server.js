const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');

// Import error middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Check if API key is loaded
console.log('=== Environment Variables Check ===');
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('===================================');

// Create Express app
const app = express();

// ✅ CORS setup - Updated with all frontend URLs
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://studybuddy-frontend-nine.vercel.app',
  'https://studybuddy-frontend-zeta.vercel.app',
  'https://studybuddy-ai.vercel.app',
  'https://studybuddy-ai-nine.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📌 Health check endpoint (important for Vercel)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);

// Error middleware - ALWAYS at the end
app.use(notFound);
app.use(errorHandler);

// ✅ Vercel serverless ke liye - export the app
module.exports = app;

// ✅ Local development ke liye - listen on port
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  // Connect to database only in local development
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Database connection failed:', err);
  });
}