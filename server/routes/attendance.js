const express = require('express');
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const auth = require('../middleware/auth');

const router = express.Router();

// Get attendance for a class on a specific date
router.get('/class/:classId/date/:date', auth, async (req, res) => {
  try {
    const { classId, date } = req.params;
    
    // Verify class belongs to teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: req.teacher.id
    }).populate('students', 'name email studentId profilePhoto');

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const attendance = await Attendance.findOne({
      class: classId,
      date: new Date(date)
    }).populate('records.student', 'name email studentId profilePhoto');

    res.json({
      class: classData,
      attendance: attendance || {
        class: classId,
        teacher: req.teacher.id,
        date: new Date(date),
        records: classData.students.map(student => ({
          student: student._id,
          status: 'present',
          notes: ''
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark attendance
router.post('/class/:classId/date/:date', auth, async (req, res) => {
  try {
    const { classId, date } = req.params;
    const { records } = req.body;

    // Verify class belongs to teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: req.teacher.id
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        class: classId,
        date: new Date(date)
      },
      {
        class: classId,
        teacher: req.teacher.id,
        date: new Date(date),
        records
      },
      {
        upsert: true,
        new: true
      }
    ).populate('records.student', 'name email studentId profilePhoto');

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance history for a class
router.get('/class/:classId/history', auth, async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify class belongs to teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: req.teacher.id
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const query = { class: classId };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendanceHistory = await Attendance.find(query)
      .populate('records.student', 'name email studentId profilePhoto')
      .sort({ date: -1 });

    res.json(attendanceHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance statistics for a student
router.get('/student/:studentId/class/:classId/stats', auth, async (req, res) => {
  try {
    const { studentId, classId } = req.params;

    // Verify class belongs to teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: req.teacher.id
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const attendanceRecords = await Attendance.find({
      class: classId,
      'records.student': studentId
    });

    let totalDays = 0;
    let presentDays = 0;
    let lateDays = 0;
    let absentDays = 0;

    attendanceRecords.forEach(record => {
      const studentRecord = record.records.find(r => r.student.toString() === studentId);
      if (studentRecord) {
        totalDays++;
        switch (studentRecord.status) {
          case 'present':
            presentDays++;
            break;
          case 'late':
            lateDays++;
            break;
          case 'absent':
            absentDays++;
            break;
        }
      }
    });

    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    res.json({
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      attendancePercentage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export attendance as CSV
router.get('/class/:classId/export', auth, async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify class belongs to teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: req.teacher.id
    }).populate('students', 'name email studentId');

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const query = { class: classId };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('records.student', 'name email studentId')
      .sort({ date: 1 });

    // Create CSV content
    let csvContent = 'Date,Student Name,Student ID,Status,Notes\n';
    
    attendanceRecords.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      record.records.forEach(studentRecord => {
        csvContent += `${dateStr},${studentRecord.student.name},${studentRecord.student.studentId},${studentRecord.status},"${studentRecord.notes || ''}"\n`;
      });
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendance-${classData.name}-${Date.now()}.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;