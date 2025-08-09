const express = require('express');
const Assignment = require('../models/Assignment');
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all assignments for teacher
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.teacher.id })
      .populate('class', 'name subject')
      .sort({ createdAt: -1 });
    
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assignments for a specific class
router.get('/class/:classId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ 
      class: req.params.classId,
      teacher: req.teacher.id 
    }).populate('class', 'name subject')
      .sort({ createdAt: -1 });
    
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single assignment
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      teacher: req.teacher.id
    }).populate('class', 'name subject students')
      .populate('submissions.student', 'name email studentId profilePhoto');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new assignment
router.post('/', auth, upload.array('attachments', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      classId,
      dueDate,
      maxScore,
      instructions,
      allowFileUpload,
      allowTextSubmission
    } = req.body;

    // Verify class belongs to teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: req.teacher.id
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const attachments = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size
    })) : [];

    const assignment = new Assignment({
      title,
      description,
      class: classId,
      teacher: req.teacher.id,
      dueDate,
      maxScore,
      instructions,
      attachments,
      allowFileUpload: allowFileUpload === 'true',
      allowTextSubmission: allowTextSubmission === 'true'
    });

    await assignment.save();

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('class', 'name subject');

    res.status(201).json(populatedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update assignment
router.put('/:id', auth, upload.array('attachments', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      maxScore,
      instructions,
      allowFileUpload,
      allowTextSubmission
    } = req.body;

    const updateData = {
      title,
      description,
      dueDate,
      maxScore,
      instructions,
      allowFileUpload: allowFileUpload === 'true',
      allowTextSubmission: allowTextSubmission === 'true'
    };

    if (req.files && req.files.length > 0) {
      updateData.attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size
      }));
    }

    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, teacher: req.teacher.id },
      updateData,
      { new: true }
    ).populate('class', 'name subject');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete assignment
router.delete('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      teacher: req.teacher.id
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Grade submission
router.put('/:id/submissions/:submissionId/grade', auth, async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const { id: assignmentId, submissionId } = req.params;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacher: req.teacher.id
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = {
      score,
      maxScore: assignment.maxScore,
      feedback,
      gradedAt: new Date(),
      gradedBy: req.teacher.id
    };
    submission.status = 'graded';

    await assignment.save();

    const updatedAssignment = await Assignment.findById(assignmentId)
      .populate('submissions.student', 'name email studentId profilePhoto');

    res.json(updatedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download submission file
router.get('/:id/submissions/:submissionId/download/:fileIndex', auth, async (req, res) => {
  try {
    const { id: assignmentId, submissionId, fileIndex } = req.params;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacher: req.teacher.id
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const file = submission.files[fileIndex];
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(file.path, file.originalName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;