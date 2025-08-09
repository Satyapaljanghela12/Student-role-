const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all resources for teacher
router.get('/', auth, async (req, res) => {
  try {
    const { subject, topic, type } = req.query;
    const query = { teacher: req.teacher.id };

    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (type) query.type = type;

    const resources = await Resource.find(query)
      .populate('class', 'name subject')
      .sort({ createdAt: -1 });
    
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single resource
router.get('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      teacher: req.teacher.id
    }).populate('class', 'name subject');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload new resource
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      subject,
      topic,
      classId,
      url,
      tags,
      isPublic
    } = req.body;

    const resourceData = {
      title,
      description,
      type,
      subject,
      topic,
      teacher: req.teacher.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublic: isPublic === 'true'
    };

    if (classId) {
      resourceData.class = classId;
    }

    if (type === 'link') {
      resourceData.url = url;
    } else if (req.file) {
      resourceData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    } else {
      return res.status(400).json({ message: 'File is required for this resource type' });
    }

    const resource = new Resource(resourceData);
    await resource.save();

    const populatedResource = await Resource.findById(resource._id)
      .populate('class', 'name subject');

    res.status(201).json(populatedResource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resource
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      topic,
      classId,
      url,
      tags,
      isPublic
    } = req.body;

    const updateData = {
      title,
      description,
      subject,
      topic,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublic: isPublic === 'true'
    };

    if (classId) {
      updateData.class = classId;
    }

    if (url) {
      updateData.url = url;
    }

    if (req.file) {
      updateData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }

    const resource = await Resource.findOneAndUpdate(
      { _id: req.params.id, teacher: req.teacher.id },
      updateData,
      { new: true }
    ).populate('class', 'name subject');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resource
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({
      _id: req.params.id,
      teacher: req.teacher.id
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download resource
router.get('/:id/download', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!resource.file || !resource.file.path) {
      return res.status(400).json({ message: 'No file available for download' });
    }

    // Increment download count
    resource.downloadCount += 1;
    await resource.save();

    res.download(resource.file.path, resource.file.originalName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get resource categories (subjects and topics)
router.get('/categories/list', auth, async (req, res) => {
  try {
    const subjects = await Resource.distinct('subject', { teacher: req.teacher.id });
    const topics = await Resource.distinct('topic', { teacher: req.teacher.id });
    
    res.json({ subjects, topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;