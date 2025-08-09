const express = require('express');
const { Announcement, Message } = require('../models/Communication');
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all announcements for teacher
router.get('/announcements', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find({ teacher: req.teacher.id })
      .populate('class', 'name subject')
      .sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get announcements for a specific class
router.get('/announcements/class/:classId', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find({ 
      class: req.params.classId,
      teacher: req.teacher.id 
    }).populate('class', 'name subject')
      .sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new announcement
router.post('/announcements', auth, async (req, res) => {
  try {
    const { title, content, classId, priority } = req.body;

    // Verify class belongs to teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: req.teacher.id
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const announcement = new Announcement({
      title,
      content,
      teacher: req.teacher.id,
      class: classId,
      priority
    });

    await announcement.save();

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('class', 'name subject');

    res.status(201).json(populatedAnnouncement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update announcement
router.put('/announcements/:id', auth, async (req, res) => {
  try {
    const { title, content, priority } = req.body;

    const announcement = await Announcement.findOneAndUpdate(
      { _id: req.params.id, teacher: req.teacher.id },
      { title, content, priority },
      { new: true }
    ).populate('class', 'name subject');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete announcement
router.delete('/announcements/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndDelete({
      _id: req.params.id,
      teacher: req.teacher.id
    });

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for teacher
router.get('/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.teacher.id, senderModel: 'Teacher' },
        { recipient: req.teacher.id, recipientModel: 'Teacher' }
      ]
    }).populate('sender recipient', 'name email profilePhoto')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/messages', auth, upload.array('attachments', 3), async (req, res) => {
  try {
    const { recipientId, recipientModel, subject, content } = req.body;

    const attachments = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size
    })) : [];

    const message = new Message({
      sender: req.teacher.id,
      senderModel: 'Teacher',
      recipient: recipientId,
      recipientModel,
      subject,
      content,
      attachments
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender recipient', 'name email profilePhoto');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/messages/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      { 
        _id: req.params.id,
        recipient: req.teacher.id,
        recipientModel: 'Teacher'
      },
      { 
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    ).populate('sender recipient', 'name email profilePhoto');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversation between teacher and student
router.get('/messages/conversation/:recipientId', auth, async (req, res) => {
  try {
    const { recipientId } = req.params;

    const messages = await Message.find({
      $or: [
        { 
          sender: req.teacher.id, 
          senderModel: 'Teacher',
          recipient: recipientId 
        },
        { 
          sender: recipientId,
          recipient: req.teacher.id,
          recipientModel: 'Teacher'
        }
      ]
    }).populate('sender recipient', 'name email profilePhoto')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;