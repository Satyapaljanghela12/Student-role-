import React from 'react';
import { Calendar, Clock, TrendingUp, BookOpen, CheckCircle2, Award, Target, Users } from 'lucide-react';
import { User, Course, Assignment, Grade, SubjectGrade, StudentProgress } from '../../types';

interface StudentDashboardProps {
  user: User;
  courses: Course[];
  assignments: Assignment[];
  grades: Grade[];
  subjectGrades: SubjectGrade[];
  progress: StudentProgress[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  courses,
  assignments,
  grades,
  subjectGrades,
  progress
}) => {
  const upcomingAssignments = assignments
    .filter(a => new Date(a.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const recentGrades = grades.slice(0, 3);
  const averageGrade = grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length;
  const overallProgress = progress.reduce((sum, p) => sum + p.overallGrade, 0) / progress.length;
  const totalAttendance = progress.reduce((sum, p) => sum + p.attendance, 0) / progress.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (assignment: Assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 2) return 'text-red-600 bg-red-50';
    if (daysDiff < 7) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100 shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 mt-1">Here's your academic progress and upcoming tasks.</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Enrolled Courses</p>
              <p className="text-3xl font-bold">{courses.length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Overall Progress</p>
              <p className="text-3xl font-bold">{overallProgress.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Attendance</p>
              <p className="text-3xl font-bold">{totalAttendance.toFixed(0)}%</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Pending Tasks</p>
              <p className="text-3xl font-bold">{upcomingAssignments.length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Grades Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          Subject Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectGrades.map((subjectGrade) => {
            const subject = courses.find(c => c.id === subjectGrade.subjectId);
            return (
              <div key={subjectGrade.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${subject?.color || 'bg-gray-100 text-gray-800'}`}>
                    {subject?.code || 'N/A'}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    subjectGrade.marks >= 90 ? 'bg-green-100 text-green-800' :
                    subjectGrade.marks >= 80 ? 'bg-blue-100 text-blue-800' :
                    subjectGrade.marks >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {subjectGrade.grade}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{subject?.name || 'Unknown Subject'}</h3>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-gray-900">{subjectGrade.marks}</span>
                  <span className="text-gray-500">/ {subjectGrade.maxMarks}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      subjectGrade.marks >= 90 ? 'bg-green-500' :
                      subjectGrade.marks >= 80 ? 'bg-blue-500' :
                      subjectGrade.marks >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(subjectGrade.marks / subjectGrade.maxMarks) * 100}%` }}
                  />
                </div>
                
                <div className="text-xs text-gray-500 mb-2">
                  {subjectGrade.examType.charAt(0).toUpperCase() + subjectGrade.examType.slice(1)} • {formatDate(subjectGrade.date)}
                </div>
                
                {subjectGrade.remarks && (
                  <p className="text-sm text-gray-600 italic">{subjectGrade.remarks}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
          </div>
          
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment)}`}>
                  {assignment.type.toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{assignment.course}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Due: {formatDate(assignment.dueDate)}</span>
                    <span>{assignment.points} points</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Recent Grades</h2>
          </div>
          
          <div className="space-y-4">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all duration-200">
                <div>
                  <h3 className="font-medium text-gray-900">{grade.assignment}</h3>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(grade.date)}</p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{grade.score}</span>
                    <span className="text-gray-500">/{grade.maxScore}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      grade.percentage >= 90 ? 'bg-green-100 text-green-800' :
                      grade.percentage >= 80 ? 'bg-blue-100 text-blue-800' :
                      grade.percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grade.letterGrade}
                    </span>
                    <span className="text-sm text-gray-500">{grade.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          My Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className={`h-32 ${course.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-gray-800">
                    {course.code}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <BookOpen className="w-8 h-8 text-white/80" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{course.teacher}</span>
                  <span>{course.students} students</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-gray-900 font-medium">
                      {progress.find(p => p.courseId === course.id)?.overallGrade.toFixed(0) || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress.find(p => p.courseId === course.id)?.overallGrade || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};