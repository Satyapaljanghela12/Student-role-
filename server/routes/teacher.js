const express = require('express');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get teacher profile
router.get('/profile', auth, async (req, res) => {
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

// Update teacher profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, subjectSpecialization, phone } = req.body;
    
    const teacher = await Teacher.findByIdAndUpdate(
      req.teacher.id,
      {
        name,
        bio,
        subjectSpecialization: Array.isArray(subjectSpecialization) ? subjectSpecialization : [subjectSpecialization],
        phone
      },
      { new: true }
    ).select('-password');

    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile photo
router.post('/profile/photo', auth, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.teacher.id,
      { profilePhoto: `/uploads/profiles/${req.file.filename}` },
      { new: true }
    ).select('-password');

    res.json({ profilePhoto: teacher.profilePhoto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const teacher = await Teacher.findById(req.teacher.id);
    
    // Check current password
    const isMatch = await teacher.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    teacher.password = newPassword;
    await teacher.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const teacherId = req.teacher.id;
    
    // Get teacher's classes
    const classes = await Class.find({ teacher: teacherId }).populate('students');
    const totalStudents = classes.reduce((sum, cls) => sum + cls.students.length, 0);
    
    // Get assignments
    const assignments = await Assignment.find({ teacher: teacherId });
    const totalAssignments = assignments.length;
    
    // Get attendance records for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const attendanceRecords = await Attendance.find({
      teacher: teacherId,
      date: { $gte: startOfMonth }
    });
    
    // Calculate average attendance
    let totalAttendanceRecords = 0;
    let presentCount = 0;
    
    attendanceRecords.forEach(record => {
      record.records.forEach(studentRecord => {
        totalAttendanceRecords++;
        if (studentRecord.status === 'present') {
          presentCount++;
        }
      });
    });
    
    const averageAttendance = totalAttendanceRecords > 0 ? 
      Math.round((presentCount / totalAttendanceRecords) * 100) : 0;
    
    // Calculate average grades
    let totalGrades = 0;
    let gradeSum = 0;
    
    assignments.forEach(assignment => {
      assignment.submissions.forEach(submission => {
        if (submission.grade && submission.grade.score !== undefined) {
          totalGrades++;
          gradeSum += (submission.grade.score / submission.grade.maxScore) * 100;
        }
      });
    });
    
    const averageGrade = totalGrades > 0 ? Math.round(gradeSum / totalGrades) : 0;

    res.json({
      totalClasses: classes.length,
      totalStudents,
      totalAssignments,
      averageAttendance,
      averageGrade,
      recentActivity: {
        newSubmissions: assignments.reduce((sum, assignment) => 
          sum + assignment.submissions.filter(sub => 
            new Date(sub.submittedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length, 0
        )
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;