const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple-choice', 'short-answer', 'essay'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: String, // For short-answer questions
  points: {
    type: Number,
    required: true,
    min: 1
  }
});

const quizAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: Date,
  answers: [{
    questionIndex: Number,
    answer: String,
    selectedOption: Number,
    isCorrect: Boolean,
    points: Number
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  maxScore: Number,
  status: {
    type: String,
    enum: ['in-progress', 'submitted', 'graded'],
    default: 'in-progress'
  },
  feedback: {
    type: String,
    default: ''
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  questions: [questionSchema],
  duration: {
    type: Number, // in minutes
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  passingMarks: {
    type: Number,
    required: true
  },
  attempts: [quizAttemptSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  allowMultipleAttempts: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);