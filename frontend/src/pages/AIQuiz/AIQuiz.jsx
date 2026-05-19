import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import './AIQuiz.css';

const AIQuiz = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState('');
  const [customText, setCustomText] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    let timer;
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notes/notes');
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    if (!selectedNote && !customText.trim()) {
      toast.error('Please select a note or enter text to generate quiz');
      return;
    }

    setGenerating(true);
    try {
      let content = customText;
      if (selectedNote) {
        const note = notes.find(n => n._id === selectedNote);
        content = note.content || note.title;
      }
      
      const response = await api.post('/quiz/generate', {
        noteContent: content,
        difficulty,
        numQuestions: 10
      });
      
      setQuiz(response.data.quiz);
      setQuizStarted(false);
      setQuizCompleted(false);
      setAnswers({});
      setCurrentQuestion(0);
      setScore(0);
      toast.success('Quiz generated successfully!');
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(quiz.questions.length * 30); // 30 seconds per question
  };

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz(newAnswers);
    }
  };

  const handleSubmitQuiz = (finalAnswers = answers) => {
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    
    const percentage = (correct / quiz.questions.length) * 100;
    setScore(percentage);
    setQuizCompleted(true);
    
    // Save quiz attempt
    saveQuizAttempt(correct, percentage);
    
    toast.success(`Quiz completed! Your score: ${percentage.toFixed(1)}%`);
  };

  const saveQuizAttempt = async (correct, percentage) => {
    try {
      await api.post('/quiz/save-attempt', {
        title: quiz.title,
        questions: quiz.questions.map((q, idx) => ({
          ...q,
          userAnswer: answers[idx],
          isCorrect: answers[idx] === q.correctAnswer
        })),
        score: correct,
        totalQuestions: quiz.questions.length,
        percentage,
        timeTaken: (quiz.questions.length * 30) - timeLeft,
        difficulty
      });
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  const retryQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setAnswers({});
    setCurrentQuestion(0);
    setScore(0);
    startQuiz();
  };

  if (loading) return <Loader />;

  return (
    <div className="ai-quiz">
      <div className="quiz-header">
        <h1>AI Quiz Generator</h1>
        <p>Test your knowledge with AI-generated quizzes from your study materials</p>
      </div>

      {!quiz ? (
        <div className="quiz-config glass-card">
          <h2>Configure Your Quiz</h2>
          
          <div className="config-options">
            <div className="config-group">
              <label>Select Source Material</label>
              <select 
                value={selectedNote} 
                onChange={(e) => {
                  setSelectedNote(e.target.value);
                  setCustomText('');
                }}
              >
                <option value="">Choose a note...</option>
                {notes.map(note => (
                  <option key={note._id} value={note._id}>{note.title}</option>
                ))}
              </select>
              
              <div className="or-divider">OR</div>
              
              <textarea
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setSelectedNote('');
                }}
                placeholder="Paste your study material here..."
                rows="5"
              />
            </div>

            <div className="config-group">
              <label>Difficulty Level</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <button onClick={generateQuiz} className="generate-quiz-btn" disabled={generating}>
            {generating ? <Loader /> : 'Generate Quiz'}
          </button>
        </div>
      ) : !quizStarted ? (
        <div className="quiz-preview glass-card animate-fadeInUp">
          <h2>{quiz.title}</h2>
          <div className="quiz-info">
            <div className="info-item">
              <i className="fas fa-question-circle"></i>
              <span>{quiz.questions.length} Questions</span>
            </div>
            <div className="info-item">
              <i className="fas fa-clock"></i>
              <span>{quiz.questions.length * 30} seconds</span>
            </div>
            <div className="info-item">
              <i className="fas fa-chart-line"></i>
              <span>Difficulty: {difficulty}</span>
            </div>
          </div>
          <button onClick={startQuiz} className="start-quiz-btn">Start Quiz</button>
        </div>
      ) : !quizCompleted ? (
        <div className="quiz-active glass-card animate-fadeInUp">
          <div className="quiz-progress">
            <div className="progress-info">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}></div>
            </div>
          </div>

          <div className="question-container">
            <h3>{quiz.questions[currentQuestion].question}</h3>
            <div className="options">
              {quiz.questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="option-btn"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="quiz-results glass-card animate-fadeInUp">
          <div className="score-circle">
            <div className="score-value">{Math.round(score)}%</div>
            <div className="score-label">Your Score</div>
          </div>
          
          <div className="results-stats">
            <div className="stat">
              <span className="stat-label">Correct Answers</span>
              <span className="stat-value">{Object.values(answers).filter((a, i) => a === quiz.questions[i].correctAnswer).length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Questions</span>
              <span className="stat-value">{quiz.questions.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Time Spent</span>
              <span className="stat-value">{Math.floor(((quiz.questions.length * 30) - timeLeft) / 60)} minutes</span>
            </div>
          </div>

          <div className="results-actions">
            <button onClick={retryQuiz} className="retry-btn">Retry Quiz</button>
            <button onClick={() => {
              setQuiz(null);
              setQuizStarted(false);
              setQuizCompleted(false);
            }} className="new-quiz-btn">Create New Quiz</button>
          </div>

          <div className="answers-review">
            <h3>Review Answers</h3>
            {quiz.questions.map((q, idx) => (
              <div key={idx} className="review-item">
                <div className="review-question">
                  <span className={`review-status ${answers[idx] === q.correctAnswer ? 'correct' : 'incorrect'}`}>
                    {answers[idx] === q.correctAnswer ? '✓' : '✗'}
                  </span>
                  <p>{q.question}</p>
                </div>
                <div className="review-answer">
                  <div>Your answer: {answers[idx]}</div>
                  <div className="correct-answer">Correct answer: {q.correctAnswer}</div>
                  <div className="explanation">{q.explanation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQuiz;