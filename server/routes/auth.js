const express = require('express');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const auth = require('../middleware/auth');

const router = express.Router();

// Register teacher
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, subjectSpecialization } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    // Create new teacher
    const teacher = new Teacher({
      name,
      email,
      password,
      subjectSpecialization: Array.isArray(subjectSpecialization) ? subjectSpecialization : [subjectSpecialization]
    });

    await teacher.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: teacher._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subjectSpecialization: teacher.subjectSpecialization
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login teacher
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if teacher exists
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: teacher._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subjectSpecialization: teacher.subjectSpecialization,
        profilePhoto: teacher.profilePhoto,
        bio: teacher.bio
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current teacher
router.get('/me', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id)
      .select('-password')
      .populate('classes');
    
    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;