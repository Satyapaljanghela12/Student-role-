import React, { useState } from 'react';
import { Plus, Save, X, Users, BookOpen, Award } from 'lucide-react';
import { User, Course, Subject, SubjectGrade } from '../../types';

interface AddGradesProps {
  user: User;
  courses: Course[];
  subjects: Subject[];
  onAddGrade: (grade: Omit<SubjectGrade, 'id'>) => void;
}

export const AddGrades: React.FC<AddGradesProps> = ({
  user,
  courses,
  subjects,
  onAddGrade
}) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [studentId, setStudentId] = useState('');
  const [marks, setMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [examType, setExamType] = useState<'midterm' | 'final' | 'quiz' | 'assignment' | 'project'>('assignment');
  const [remarks, setRemarks] = useState('');
  const [showForm, setShowForm] = useState(false);

  const teacherSubjects = subjects.filter(subject => subject.teacherId === user.id);
  const teacherCourses = courses.filter(course => course.teacherId === user.id);

  const calculateGrade = (marks: number, maxMarks: number): string => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject || !studentId || !marks || !maxMarks) {
      alert('Please fill in all required fields');
      return;
    }

    const marksNum = parseInt(marks);
    const maxMarksNum = parseInt(maxMarks);
    
    if (marksNum > maxMarksNum) {
      alert('Marks cannot exceed maximum marks');
      return;
    }

    const newGrade: Omit<SubjectGrade, 'id'> = {
      subjectId: selectedSubject,
      studentId,
      teacherId: user.id,
      marks: marksNum,
      maxMarks: maxMarksNum,
      grade: calculateGrade(marksNum, maxMarksNum),
      semester: 'Fall 2024',
      examType,
      date: new Date().toISOString(),
      remarks: remarks || undefined
    };

    onAddGrade(newGrade);
    
    // Reset form
    setSelectedSubject('');
    setStudentId('');
    setMarks('');
    setMaxMarks('100');
    setExamType('assignment');
    setRemarks('');
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-emerald-50/30 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Add Student Grades
        </h1>
        <p className="text-gray-600">Enter and manage student grades for your subjects.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-gray-600">My Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{teacherSubjects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{teacherCourses.reduce((sum, course) => sum + course.students, 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600">Grades Added</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Grade Button */}
      {!showForm && (
        <div className="mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Grade
          </button>
        </div>
      )}

      {/* Add Grade Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add Student Grade</h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a subject</option>
                  {teacherSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter student ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks Obtained *
                </label>
                <input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="Enter marks"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Marks *
                </label>
                <input
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  placeholder="Enter maximum marks"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type *
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                  <option value="midterm">Midterm Exam</option>
                  <option value="final">Final Exam</option>
                  <option value="project">Project</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Preview
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  {marks && maxMarks ? (
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold">
                        {calculateGrade(parseInt(marks), parseInt(maxMarks))}
                      </span>
                      <span className="text-gray-600">
                        ({((parseInt(marks) / parseInt(maxMarks)) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Enter marks to see grade</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any additional comments or feedback"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Save className="w-5 h-5" />
                Save Grade
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Subjects */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          My Subjects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherSubjects.map((subject) => {
            const course = courses.find(c => c.id === subject.courseId);
            return (
              <div key={subject.id} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                    {subject.code}
                  </div>
                  <span className="text-sm text-gray-500">{subject.credits} credits</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{subject.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{course?.name}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{subject.semester}</span>
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Add Grades →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};