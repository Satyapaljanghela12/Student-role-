import React from 'react';
import { Users, TrendingUp, Calendar, MessageCircle, Award, BookOpen, Clock, Target } from 'lucide-react';
import { User, Course, Grade, SubjectGrade, StudentProgress, Assignment } from '../../types';

interface ParentDashboardProps {
  user: User;
  children: User[];
  courses: Course[];
  grades: Grade[];
  subjectGrades: SubjectGrade[];
  progress: StudentProgress[];
  assignments: Assignment[];
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  user,
  children,
  courses,
  grades,
  subjectGrades,
  progress,
  assignments
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get data for the first child (in a real app, you'd allow parent to select which child)
  const selectedChild = children[0];
  const childProgress = progress.filter(p => p.studentId === selectedChild?.id);
  const childGrades = subjectGrades.filter(g => g.studentId === selectedChild?.id);
  const childCourses = courses.filter(c => selectedChild?.courses.includes(c.id));
  const upcomingAssignments = assignments.filter(a => new Date(a.dueDate) > new Date()).slice(0, 3);

  const overallAverage = childGrades.reduce((sum, grade) => sum + (grade.marks / grade.maxMarks * 100), 0) / childGrades.length;
  const attendanceAverage = childProgress.reduce((sum, p) => sum + p.attendance, 0) / childProgress.length;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-amber-50/30 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-100 shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Welcome, {user.name}
            </h1>
            <p className="text-gray-600 mt-1">Monitor your child's academic progress and stay connected.</p>
          </div>
        </div>
      </div>

      {/* Child Selector */}
      {selectedChild && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-4">
            <img
              src={selectedChild.avatar}
              alt={selectedChild.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedChild.name}</h2>
              <p className="text-gray-600">Student • {selectedChild.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Overall Average</p>
              <p className="text-3xl font-bold">{overallAverage.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Attendance</p>
              <p className="text-3xl font-bold">{attendanceAverage.toFixed(0)}%</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Enrolled Courses</p>
              <p className="text-3xl font-bold">{childCourses.length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Upcoming Tasks</p>
              <p className="text-3xl font-bold">{upcomingAssignments.length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Performance */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-gray-900">Subject Performance</h2>
          </div>
          
          <div className="space-y-4">
            {childGrades.map((grade) => {
              const course = courses.find(c => c.id === grade.subjectId);
              return (
                <div key={grade.id} className="p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{course?.name || 'Unknown Subject'}</h3>
                      <p className="text-sm text-gray-600">{grade.examType} • {formatDate(grade.date)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      grade.marks >= 90 ? 'bg-green-100 text-green-800' :
                      grade.marks >= 80 ? 'bg-blue-100 text-blue-800' :
                      grade.marks >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grade.grade}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-900">{grade.marks}/{grade.maxMarks}</span>
                    <span className="text-sm text-gray-600">{((grade.marks / grade.maxMarks) * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        grade.marks >= 90 ? 'bg-green-500' :
                        grade.marks >= 80 ? 'bg-blue-500' :
                        grade.marks >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(grade.marks / grade.maxMarks) * 100}%` }}
                    />
                  </div>
                  
                  {grade.remarks && (
                    <p className="text-sm text-gray-600 mt-2 italic">{grade.remarks}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
          </div>
          
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => {
              const daysUntil = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={assignment.id} className="p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{assignment.course}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      daysUntil <= 1 ? 'bg-red-100 text-red-800' :
                      daysUntil <= 3 ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {daysUntil <= 0 ? 'Due Today' : `${daysUntil} days left`}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Due: {formatDate(assignment.dueDate)}</span>
                    <span className="font-medium text-gray-900">{assignment.points} points</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-amber-600" />
          Course Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {childProgress.map((prog) => {
            const course = courses.find(c => c.id === prog.courseId);
            return (
              <div key={prog.courseId} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {course?.code}
                  </div>
                  <span className="text-sm text-gray-500">{course?.credits} credits</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-4">{course?.name}</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Overall Grade</span>
                      <span className="font-bold text-gray-900">{prog.overallGrade.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${prog.overallGrade}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Attendance</span>
                      <span className="font-bold text-gray-900">{prog.attendance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${prog.attendance}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Assignments</span>
                      <span className="font-bold text-gray-900">{prog.completedAssignments}/{prog.totalAssignments}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(prog.completedAssignments / prog.totalAssignments) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Message Teachers</h3>
            <p className="text-sm text-gray-600">Contact your child's teachers</p>
          </button>

          <button className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Schedule Meeting</h3>
            <p className="text-sm text-gray-600">Book parent-teacher conferences</p>
          </button>

          <button className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">View Reports</h3>
            <p className="text-sm text-gray-600">Download progress reports</p>
          </button>

          <button className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">School Events</h3>
            <p className="text-sm text-gray-600">View upcoming school activities</p>
          </button>
        </div>
      </div>
    </div>
  );
};