export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'parent';
  avatar: string;
  courses: string[];
  parentId?: string; // For students
  childrenIds?: string[]; // For parents
  subjects?: string[]; // For teachers
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher: string;
  teacherId: string;
  students: number;
  color: string;
  semester: string;
  credits: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  course: string;
  courseId: string;
  dueDate: string;
  points: number;
  status: 'draft' | 'published' | 'overdue';
  submissions: number;
  type: 'essay' | 'quiz' | 'project' | 'homework' | 'exam';
  attachments?: string[];
  instructions?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late' | 'pending';
  files: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'announcement' | 'reminder' | 'message';
  timestamp: string;
  read: boolean;
  urgent: boolean;
  recipientId: string;
  senderId?: string;
}

export interface Grade {
  id: string;
  assignment: string;
  assignmentId: string;
  student: string;
  studentId: string;
  course: string;
  courseId: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  date: string;
  feedback?: string;
  teacherId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  courseId: string;
  credits: number;
  semester: string;
}

export interface SubjectGrade {
  id: string;
  subjectId: string;
  studentId: string;
  teacherId: string;
  marks: number;
  maxMarks: number;
  grade: string;
  semester: string;
  examType: 'midterm' | 'final' | 'quiz' | 'assignment' | 'project';
  date: string;
  remarks?: string;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  overallGrade: number;
  attendance: number;
  completedAssignments: number;
  totalAssignments: number;
  lastUpdated: string;
}