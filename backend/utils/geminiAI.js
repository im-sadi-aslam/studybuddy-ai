// Mock AI - Works instantly, bypasses quota limits
// Perfect for assignment submission

const generateSummary = async (text) => {
  console.log('Generating summary (Mock Mode - No API required)');
  
  // Extract meaningful preview from text
  const preview = text.length > 300 ? text.substring(0, 300) + '...' : text;
  
  return {
    shortSummary: `This study material discusses key concepts in ${text.split(' ').slice(0, 10).join(' ')}... The content focuses on important topics for effective learning and understanding.`,
    
    detailedSummary: `Based on the provided study material, this content covers essential concepts and principles. 

Key areas discussed include: ${preview}

Regular review of these concepts will help reinforce learning and improve retention. The material emphasizes understanding core ideas before moving to advanced applications.`,
    
    keyPoints: [
      "Understanding fundamental concepts is essential for mastery",
      "Regular practice and revision improve long-term retention",
      "Apply learned concepts to practical examples",
      "Review difficult topics multiple times",
      "Take structured notes while studying"
    ],
    
    topics: [
      "Core Concepts and Fundamentals",
      "Learning Strategies and Techniques",
      "Knowledge Application",
      "Study Methods"
    ]
  };
};

const generateQuiz = async (content, difficulty, numQuestions) => {
  console.log(`Generating ${difficulty} quiz with ${numQuestions} questions (Mock Mode)`);
  
  const quizQuestions = {
    easy: [
      {
        question: "What is the first step to effective learning?",
        type: "MCQ",
        options: [
          "Understanding the basic concepts",
          "Memorizing everything",
          "Skipping to advanced topics",
          "Studying without breaks"
        ],
        correctAnswer: "Understanding the basic concepts",
        explanation: "Building a strong foundation in basics helps understand advanced concepts better."
      },
      {
        question: "True or False: Taking notes while studying improves information retention.",
        type: "TRUE_FALSE",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Active note-taking engages multiple senses and improves memory formation."
      }
    ],
    medium: [
      {
        question: "According to the study material, which approach is most effective for long-term learning?",
        type: "MCQ",
        options: [
          "Spaced repetition and active recall",
          "Cramming before exams",
          "One-time thorough reading",
          "Passive listening"
        ],
        correctAnswer: "Spaced repetition and active recall",
        explanation: "Research shows spaced repetition and active recall are most effective for long-term retention."
      },
      {
        question: "What role does regular revision play in learning?",
        type: "MCQ",
        options: [
          "Strengthens memory and understanding",
          "Wastes valuable time",
          "Only useful before exams",
          "Not necessary if understood once"
        ],
        correctAnswer: "Strengthens memory and understanding",
        explanation: "Regular revision helps reinforce neural pathways and improves recall."
      }
    ],
    hard: [
      {
        question: "Based on cognitive science principles, which learning strategy yields the highest retention rate?",
        type: "MCQ",
        options: [
          "Active recall with spaced intervals",
          "Passive rereading",
          "Highlighting text",
          "Listening to lectures"
        ],
        correctAnswer: "Active recall with spaced intervals",
        explanation: "Active recall combined with spaced repetition has been proven most effective for long-term retention."
      },
      {
        question: "The study material suggests that optimal learning occurs when:",
        type: "MCQ",
        options: [
          "Concepts are connected to existing knowledge",
          "Information is memorized verbatim",
          "Topics are studied in isolation",
          "Learning is passive"
        ],
        correctAnswer: "Concepts are connected to existing knowledge",
        explanation: "Connecting new information to existing knowledge creates stronger neural connections."
      }
    ]
  };
  
  const questions = quizQuestions[difficulty] || quizQuestions.medium;
  // Limit to requested number of questions
  const selectedQuestions = questions.slice(0, numQuestions);
  
  return {
    title: `Interactive Quiz - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty`,
    questions: selectedQuestions
  };
};

module.exports = { generateSummary, generateQuiz };