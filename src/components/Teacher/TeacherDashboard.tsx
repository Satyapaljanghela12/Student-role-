import React from 'react';
import { Users, BookOpen, ClipboardCheck, TrendingUp, Calendar, Award, Plus } from 'lucide-react';
import { User, Course, Assignment, Grade, SubjectGrade } from '../../types';

interface TeacherDashboardProps {
  user: User;
  courses: Course[];
  assignments: Assignment[];
  grades: Grade[];
  subjectGrades: SubjectGrade[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  courses,
  assignments,
  grades,
  subjectGrades
}) => {
  const teacherCourses = courses.filter(course => course.teacherId === user.id);
  const teacherAssignments = assignments.filter(assignment => 
    teacherCourses.some(course => course.id === assignment.courseId)
  );
  const totalStudents = teacherCourses.reduce((sum, course) => sum + course.students, 0);
  const averageGrade = subjectGrades.reduce((sum, grade) => sum + (grade.marks / grade.maxMarks * 100), 0) / subjectGrades.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const recentGrades = subjectGrades.slice(0, 5);
  const pendingAssignments = teacherAssignments.filter(a => a.status === 'published').length;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-emerald-50/30 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-100 shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Welcome, {user.name}
            </h1>
            <p className="text-gray-600 mt-1">Manage your courses and track student progress.</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">My Courses</p>
              <p className="text-3xl font-bold">{teacherCourses.length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Students</p>
              <p className="text-3xl font-bold">{totalStudents}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Active Assignments</p>
              <p className="text-3xl font-bold">{pendingAssignments}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Class Average</p>
              <p className="text-3xl font-bold">{averageGrade.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Grades */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Recent Grades Added</h2>
            </div>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Grade
            </button>
          </div>
          
          <div className="space-y-4">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all duration-200">
                <div>
                  <h3 className="font-medium text-gray-900">Student Grade Entry</h3>
                  <p className="text-sm text-gray-600 mt-1">{grade.examType} • {formatDate(grade.date)}</p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{grade.marks}</span>
                    <span className="text-gray-500">/ {grade.maxMarks}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    grade.marks >= 90 ? 'bg-green-100 text-green-800' :
                    grade.marks >= 80 ? 'bg-blue-100 text-blue-800' :
                    grade.marks >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {grade.grade}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          </div>
          
          <div className="space-y-4">
            {teacherCourses.map((course) => (
              <div key={course.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{course.code} • {course.semester}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {course.students} students
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{course.credits} credits</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Manage Course →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Add New Grade</h3>
            <p className="text-sm text-gray-600">Enter grades for student assignments</p>
          </button>

          <button className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <ClipboardCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Assignment</h3>
            <p className="text-sm text-gray-600">Add new assignments for students</p>
          </button>

          <button className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">View Students</h3>
            <p className="text-sm text-gray-600">Manage student enrollment</p>
          </button>

          <button className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-sm text-gray-600">Track class performance</p>
          </button>
        </div>
      </div>
    </div>
  );
};