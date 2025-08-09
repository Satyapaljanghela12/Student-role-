const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  files: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number
  }],
  textSubmission: {
    type: String,
    default: ''
  },
  grade: {
    score: {
      type: Number,
      min: 0
    },
    maxScore: {
      type: Number,
      required: true
    },
    feedback: {
      type: String,
      default: ''
    },
    gradedAt: Date,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    }
  },
  status: {
    type: String,
    enum: ['submitted', 'graded', 'late'],
    default: 'submitted'
  }
});

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
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
  dueDate: {
    type: Date,
    required: true
  },
  maxScore: {
    type: Number,
    required: true,
    min: 1
  },
  instructions: {
    type: String,
    default: ''
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number
  }],
  allowFileUpload: {
    type: Boolean,
    default: true
  },
  allowTextSubmission: {
    type: Boolean,
    default: true
  },
  submissions: [submissionSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);