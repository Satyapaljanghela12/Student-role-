import { User, Course, Assignment, Submission, Notification, Grade, Subject, SubjectGrade, StudentProgress } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@student.edu',
  role: 'student',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  courses: ['1', '2', '3'],
  parentId: 'parent1'
};

export const teacherUser: User = {
  id: 'teacher1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@school.edu',
  role: 'teacher',
  avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  courses: ['1', '4'],
  subjects: ['CS101', 'CS201']
};

export const parentUser: User = {
  id: 'parent1',
  name: 'Michael Johnson',
  email: 'michael.johnson@email.com',
  role: 'parent',
  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  courses: [],
  childrenIds: ['1']
};

export const courses: Course[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'Fundamentals of programming and computational thinking',
    teacher: 'Dr. Sarah Wilson',
    teacherId: 'teacher1',
    students: 45,
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    semester: 'Fall 2024',
    credits: 3
  },
  {
    id: '2',
    name: 'Calculus I',
    code: 'MATH201',
    description: 'Differential and integral calculus',
    teacher: 'Prof. Michael Chen',
    teacherId: 'teacher2',
    students: 38,
    color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    semester: 'Fall 2024',
    credits: 4
  },
  {
    id: '3',
    name: 'English Literature',
    code: 'ENG150',
    description: 'Survey of British and American literature',
    teacher: 'Dr. Emily Rodriguez',
    teacherId: 'teacher3',
    students: 32,
    color: 'bg-gradient-to-r from-amber-500 to-amber-600',
    semester: 'Fall 2024',
    credits: 3
  }
];

export const subjects: Subject[] = [
  {
    id: 'sub1',
    name: 'Programming Fundamentals',
    code: 'CS101',
    teacherId: 'teacher1',
    courseId: '1',
    credits: 3,
    semester: 'Fall 2024'
  },
  {
    id: 'sub2',
    name: 'Calculus I',
    code: 'MATH201',
    teacherId: 'teacher2',
    courseId: '2',
    credits: 4,
    semester: 'Fall 2024'
  },
  {
    id: 'sub3',
    name: 'English Literature',
    code: 'ENG150',
    teacherId: 'teacher3',
    courseId: '3',
    credits: 3,
    semester: 'Fall 2024'
  }
];

export const subjectGrades: SubjectGrade[] = [
  {
    id: 'sg1',
    subjectId: 'sub1',
    studentId: '1',
    teacherId: 'teacher1',
    marks: 92,
    maxMarks: 100,
    grade: 'A-',
    semester: 'Fall 2024',
    examType: 'midterm',
    date: '2025-01-15T10:30:00Z',
    remarks: 'Excellent understanding of programming concepts'
  },
  {
    id: 'sg2',
    subjectId: 'sub2',
    studentId: '1',
    teacherId: 'teacher2',
    marks: 87,
    maxMarks: 100,
    grade: 'B+',
    semester: 'Fall 2024',
    examType: 'midterm',
    date: '2025-01-12T14:30:00Z',
    remarks: 'Good grasp of calculus fundamentals'
  },
  {
    id: 'sg3',
    subjectId: 'sub3',
    studentId: '1',
    teacherId: 'teacher3',
    marks: 95,
    maxMarks: 100,
    grade: 'A',
    semester: 'Fall 2024',
    examType: 'assignment',
    date: '2025-01-10T16:45:00Z',
    remarks: 'Outstanding literary analysis'
  }
];

export const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Python Programming Project',
    description: 'Create a console-based calculator application using Python',
    course: 'CS101',
    courseId: '1',
    dueDate: '2025-01-25T23:59:59Z',
    points: 100,
    status: 'published',
    submissions: 32,
    type: 'project',
    instructions: 'Build a fully functional calculator with error handling'
  },
  {
    id: '2',
    title: 'Derivatives Problem Set',
    description: 'Complete problems 1-20 from Chapter 3',
    course: 'MATH201',
    courseId: '2',
    dueDate: '2025-01-20T23:59:59Z',
    points: 50,
    status: 'published',
    submissions: 28,
    type: 'homework'
  },
  {
    id: '3',
    title: 'Shakespeare Essay',
    description: 'Analyze themes in Hamlet - 1000 words minimum',
    course: 'ENG150',
    courseId: '3',
    dueDate: '2025-01-30T23:59:59Z',
    points: 75,
    status: 'published',
    submissions: 15,
    type: 'essay'
  }
];

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Grade Posted',
    message: 'Your midterm exam grade for CS101 has been posted: 92/100 (A-)',
    type: 'grade',
    timestamp: '2025-01-15T10:30:00Z',
    read: false,
    urgent: false,
    recipientId: '1'
  },
  {
    id: '2',
    title: 'Assignment Due Soon',
    message: 'Python Programming Project is due in 2 days',
    type: 'reminder',
    timestamp: '2025-01-14T14:20:00Z',
    read: true,
    urgent: true,
    recipientId: '1'
  },
  {
    id: '3',
    title: 'Parent-Teacher Conference',
    message: 'Scheduled meeting with Dr. Wilson on January 20th at 3:00 PM',
    type: 'announcement',
    timestamp: '2025-01-13T09:00:00Z',
    read: false,
    urgent: false,
    recipientId: 'parent1'
  }
];

export const grades: Grade[] = [
  {
    id: '1',
    assignment: 'Python Programming Project',
    assignmentId: '1',
    student: 'Alex Johnson',
    studentId: '1',
    course: 'CS101',
    courseId: '1',
    score: 92,
    maxScore: 100,
    percentage: 92,
    letterGrade: 'A-',
    date: '2025-01-15T10:30:00Z',
    feedback: 'Excellent work on the calculator implementation!',
    teacherId: 'teacher1'
  },
  {
    id: '2',
    assignment: 'Quiz 1: Variables and Functions',
    assignmentId: '2',
    student: 'Alex Johnson',
    studentId: '1',
    course: 'CS101',
    courseId: '1',
    score: 45,
    maxScore: 50,
    percentage: 90,
    letterGrade: 'A-',
    date: '2025-01-10T16:45:00Z',
    teacherId: 'teacher1'
  }
];

export const studentProgress: StudentProgress[] = [
  {
    studentId: '1',
    courseId: '1',
    overallGrade: 91.5,
    attendance: 95,
    completedAssignments: 8,
    totalAssignments: 10,
    lastUpdated: '2025-01-15T10:30:00Z'
  },
  {
    studentId: '1',
    courseId: '2',
    overallGrade: 87.2,
    attendance: 92,
    completedAssignments: 6,
    totalAssignments: 8,
    lastUpdated: '2025-01-14T14:20:00Z'
  },
  {
    studentId: '1',
    courseId: '3',
    overallGrade: 94.8,
    attendance: 98,
    completedAssignments: 5,
    totalAssignments: 6,
    lastUpdated: '2025-01-13T09:00:00Z'
  }
];