const express = require('express');
const Quiz = require('../models/Quiz');
const Class = require('../models/Class');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all quizzes for teacher
router.get('/', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacher: req.teacher.id })
      .populate('class', 'name subject')
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quizzes for a specific class
router.get('/class/:classId', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ 
      class: req.params.classId,
      teacher: req.teacher.id 
    }).populate('class', 'name subject')
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single quiz
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      teacher: req.teacher.id
    }).populate('class', 'name subject students')
      .populate('attempts.student', 'name email studentId profilePhoto');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new quiz
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      classId,
      questions,
      duration,
      startDate,
      endDate,
      passingMarks,
      allowMultipleAttempts
    } = req.body;

    // Verify class belongs to teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: req.teacher.id
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const quiz = new Quiz({
      title,
      description,
      class: classId,
      teacher: req.teacher.id,
      questions,
      duration,
      startDate,
      endDate,
      passingMarks,
      allowMultipleAttempts
    });

    await quiz.save();

    const populatedQuiz = await Quiz.findById(quiz._id)
      .populate('class', 'name subject');

    res.status(201).json(populatedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quiz
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      questions,
      duration,
      startDate,
      endDate,
      passingMarks,
      allowMultipleAttempts
    } = req.body;

    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, teacher: req.teacher.id },
      {
        title,
        description,
        questions,
        duration,
        startDate,
        endDate,
        passingMarks,
        allowMultipleAttempts
      },
      { new: true }
    ).populate('class', 'name subject');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete quiz
router.delete('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      teacher: req.teacher.id
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Grade subjective answers
router.put('/:id/attempts/:attemptId/grade', auth, async (req, res) => {
  try {
    const { answers, feedback } = req.body;
    const { id: quizId, attemptId } = req.params;

    const quiz = await Quiz.findOne({
      _id: quizId,
      teacher: req.teacher.id
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const attempt = quiz.attempts.id(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Update answers with manual grading
    answers.forEach(answer => {
      const attemptAnswer = attempt.answers.find(a => a.questionIndex === answer.questionIndex);
      if (attemptAnswer) {
        attemptAnswer.points = answer.points;
        attemptAnswer.isCorrect = answer.isCorrect;
      }
    });

    // Calculate total score
    attempt.totalScore = attempt.answers.reduce((sum, answer) => sum + (answer.points || 0), 0);
    attempt.maxScore = quiz.questions.reduce((sum, question) => sum + question.points, 0);
    attempt.status = 'graded';
    attempt.feedback = feedback;

    await quiz.save();

    const updatedQuiz = await Quiz.findById(quizId)
      .populate('attempts.student', 'name email studentId profilePhoto');

    res.json(updatedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz results/analytics
router.get('/:id/results', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      teacher: req.teacher.id
    }).populate('attempts.student', 'name email studentId profilePhoto')
      .populate('class', 'name subject students');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const totalStudents = quiz.class.students.length;
    const completedAttempts = quiz.attempts.filter(attempt => attempt.status === 'submitted' || attempt.status === 'graded');
    const passedAttempts = completedAttempts.filter(attempt => attempt.totalScore >= quiz.passingMarks);

    const averageScore = completedAttempts.length > 0 
      ? completedAttempts.reduce((sum, attempt) => sum + attempt.totalScore, 0) / completedAttempts.length
      : 0;

    const questionAnalytics = quiz.questions.map((question, index) => {
      const questionAttempts = completedAttempts.map(attempt => 
        attempt.answers.find(answer => answer.questionIndex === index)
      ).filter(Boolean);

      const correctAnswers = questionAttempts.filter(answer => answer.isCorrect).length;
      const totalAnswers = questionAttempts.length;

      return {
        questionIndex: index,
        question: question.question,
        correctAnswers,
        totalAnswers,
        successRate: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0
      };
    });

    res.json({
      quiz,
      analytics: {
        totalStudents,
        completedAttempts: completedAttempts.length,
        passedAttempts: passedAttempts.length,
        passRate: completedAttempts.length > 0 ? Math.round((passedAttempts.length / completedAttempts.length) * 100) : 0,
        averageScore: Math.round(averageScore),
        questionAnalytics
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;