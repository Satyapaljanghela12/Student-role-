const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const Class = require('./models/Class');
const Assignment = require('./models/Assignment');
const Quiz = require('./models/Quiz');
const Resource = require('./models/Resource');
const { Announcement } = require('./models/Communication');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/education-app');
    
    // Clear existing data
    await Teacher.deleteMany({});
    await Student.deleteMany({});
    await Class.deleteMany({});
    await Assignment.deleteMany({});
    await Quiz.deleteMany({});
    await Resource.deleteMany({});
    await Announcement.deleteMany({});

    // Create sample teachers
    const teachers = await Teacher.create([
      {
        name: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@school.edu',
        password: await bcrypt.hash('password123', 10),
        subjectSpecialization: ['Mathematics', 'Physics'],
        bio: 'Experienced mathematics and physics teacher with 10+ years of experience.',
        profilePhoto: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Prof. Michael Chen',
        email: 'michael.chen@school.edu',
        password: await bcrypt.hash('password123', 10),
        subjectSpecialization: ['Computer Science', 'Programming'],
        bio: 'Computer Science professor specializing in web development and algorithms.',
        profilePhoto: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      }
    ]);

    // Create sample students
    const students = await Student.create([
      {
        name: 'Alex Johnson',
        email: 'alex.johnson@student.edu',
        studentId: 'STU001',
        profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        phone: '+1234567890',
        parentContact: {
          name: 'John Johnson',
          phone: '+1234567891',
          email: 'john.johnson@email.com'
        }
      },
      {
        name: 'Emma Davis',
        email: 'emma.davis@student.edu',
        studentId: 'STU002',
        profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        phone: '+1234567892',
        parentContact: {
          name: 'Mary Davis',
          phone: '+1234567893',
          email: 'mary.davis@email.com'
        }
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@student.edu',
        studentId: 'STU003',
        profilePhoto: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        phone: '+1234567894',
        parentContact: {
          name: 'Robert Wilson',
          phone: '+1234567895',
          email: 'robert.wilson@email.com'
        }
      }
    ]);

    // Create sample classes
    const classes = await Class.create([
      {
        name: 'Advanced Mathematics',
        subject: 'Mathematics',
        description: 'Advanced calculus and linear algebra',
        teacher: teachers[0]._id,
        students: [students[0]._id, students[1]._id],
        schedule: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '09:00',
          endTime: '10:30'
        },
        semester: 'Fall 2024',
        academicYear: '2024-2025'
      },
      {
        name: 'Web Development',
        subject: 'Computer Science',
        description: 'Full-stack web development with MERN stack',
        teacher: teachers[1]._id,
        students: [students[0]._id, students[2]._id],
        schedule: {
          days: ['Tuesday', 'Thursday'],
          startTime: '14:00',
          endTime: '16:00'
        },
        semester: 'Fall 2024',
        academicYear: '2024-2025'
      }
    ]);

    // Update teacher and student references
    await Teacher.findByIdAndUpdate(teachers[0]._id, { classes: [classes[0]._id] });
    await Teacher.findByIdAndUpdate(teachers[1]._id, { classes: [classes[1]._id] });

    await Student.findByIdAndUpdate(students[0]._id, { classes: [classes[0]._id, classes[1]._id] });
    await Student.findByIdAndUpdate(students[1]._id, { classes: [classes[0]._id] });
    await Student.findByIdAndUpdate(students[2]._id, { classes: [classes[1]._id] });

    // Create sample assignments
    await Assignment.create([
      {
        title: 'Calculus Problem Set 1',
        description: 'Solve problems 1-20 from Chapter 5',
        class: classes[0]._id,
        teacher: teachers[0]._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        maxScore: 100,
        instructions: 'Show all work and provide detailed explanations',
        submissions: [
          {
            student: students[0]._id,
            submittedAt: new Date(),
            textSubmission: 'Here are my solutions to the calculus problems...',
            grade: {
              score: 85,
              maxScore: 100,
              feedback: 'Good work! Minor errors in problem 15.',
              gradedAt: new Date(),
              gradedBy: teachers[0]._id
            },
            status: 'graded'
          }
        ]
      },
      {
        title: 'React Component Project',
        description: 'Build a todo list application using React hooks',
        class: classes[1]._id,
        teacher: teachers[1]._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        maxScore: 150,
        instructions: 'Use functional components and hooks. Include proper styling.',
        submissions: []
      }
    ]);

    // Create sample quiz
    await Quiz.create([
      {
        title: 'Mathematics Quiz 1',
        description: 'Basic calculus concepts',
        class: classes[0]._id,
        teacher: teachers[0]._id,
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the derivative of x²?',
            options: [
              { text: '2x', isCorrect: true },
              { text: 'x²', isCorrect: false },
              { text: '2', isCorrect: false },
              { text: 'x', isCorrect: false }
            ],
            points: 10
          },
          {
            type: 'short-answer',
            question: 'Explain the fundamental theorem of calculus.',
            correctAnswer: 'The fundamental theorem of calculus links differentiation and integration.',
            points: 20
          }
        ],
        duration: 60,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        passingMarks: 18,
        attempts: []
      }
    ]);

    // Create sample resources
    await Resource.create([
      {
        title: 'Calculus Reference Sheet',
        description: 'Quick reference for calculus formulas and rules',
        type: 'pdf',
        subject: 'Mathematics',
        topic: 'Calculus',
        teacher: teachers[0]._id,
        class: classes[0]._id,
        tags: ['calculus', 'reference', 'formulas'],
        isPublic: true
      },
      {
        title: 'React Documentation',
        description: 'Official React documentation link',
        type: 'link',
        url: 'https://reactjs.org/docs',
        subject: 'Computer Science',
        topic: 'React',
        teacher: teachers[1]._id,
        class: classes[1]._id,
        tags: ['react', 'documentation', 'javascript'],
        isPublic: true
      }
    ]);

    // Create sample announcements
    await Announcement.create([
      {
        title: 'Midterm Exam Schedule',
        content: 'The midterm exam will be held on October 15th at 2:00 PM in Room 101.',
        teacher: teachers[0]._id,
        class: classes[0]._id,
        priority: 'high'
      },
      {
        title: 'Project Submission Guidelines',
        content: 'Please submit your React projects through the assignment portal. Late submissions will be penalized.',
        teacher: teachers[1]._id,
        class: classes[1]._id,
        priority: 'medium'
      }
    ]);

    console.log('Sample data created successfully!');
    console.log('Teacher login credentials:');
    console.log('Email: sarah.wilson@school.edu, Password: password123');
    console.log('Email: michael.chen@school.edu, Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();