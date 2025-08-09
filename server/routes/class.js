const express = require('express');
const Class = require('../models/Class');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all classes for teacher
router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.teacher.id })
      .populate('students', 'name email studentId profilePhoto')
      .sort({ createdAt: -1 });
    
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single class
router.get('/:id', auth, async (req, res) => {
  try {
    const classData = await Class.findOne({ 
      _id: req.params.id, 
      teacher: req.teacher.id 
    }).populate('students', 'name email studentId profilePhoto phone parentContact');
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json(classData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new class
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      subject,
      description,
      schedule,
      semester,
      academicYear
    } = req.body;

    const newClass = new Class({
      name,
      subject,
      description,
      teacher: req.teacher.id,
      schedule,
      semester,
      academicYear
    });

    await newClass.save();
    
    // Update teacher's classes
    await Teacher.findByIdAndUpdate(
      req.teacher.id,
      { $push: { classes: newClass._id } }
    );

    const populatedClass = await Class.findById(newClass._id)
      .populate('students', 'name email studentId profilePhoto');

    res.status(201).json(populatedClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update class
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      name,
      subject,
      description,
      schedule,
      semester,
      academicYear
    } = req.body;

    const updatedClass = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.teacher.id },
      {
        name,
        subject,
        description,
        schedule,
        semester,
        academicYear
      },
      { new: true }
    ).populate('students', 'name email studentId profilePhoto');

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(updatedClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete class
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedClass = await Class.findOneAndDelete({
      _id: req.params.id,
      teacher: req.teacher.id
    });

    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Remove class from teacher's classes
    await Teacher.findByIdAndUpdate(
      req.teacher.id,
      { $pull: { classes: req.params.id } }
    );

    // Remove class from students
    await Student.updateMany(
      { classes: req.params.id },
      { $pull: { classes: req.params.id } }
    );

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available students (not in this class)
router.get('/:id/available-students', auth, async (req, res) => {
  try {
    const classData = await Class.findOne({
      _id: req.params.id,
      teacher: req.teacher.id
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const availableStudents = await Student.find({
      _id: { $nin: classData.students },
      isActive: true
    }).select('name email studentId profilePhoto');

    res.json(availableStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add students to class
router.post('/:id/students', auth, async (req, res) => {
  try {
    const { studentIds } = req.body;

    const classData = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.teacher.id },
      { $addToSet: { students: { $each: studentIds } } },
      { new: true }
    ).populate('students', 'name email studentId profilePhoto');

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Add class to students
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { $addToSet: { classes: req.params.id } }
    );

    res.json(classData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove student from class
router.delete('/:id/students/:studentId', auth, async (req, res) => {
  try {
    const classData = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.teacher.id },
      { $pull: { students: req.params.studentId } },
      { new: true }
    ).populate('students', 'name email studentId profilePhoto');

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Remove class from student
    await Student.findByIdAndUpdate(
      req.params.studentId,
      { $pull: { classes: req.params.id } }
    );

    res.json(classData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;