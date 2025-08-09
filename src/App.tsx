import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { AddGrades } from './components/Teacher/AddGrades';
import { ParentDashboard } from './components/Parent/ParentDashboard';
import { AssignmentList } from './components/Assignments/AssignmentList';
import { GradesList } from './components/Grades/GradesList';
import { NotificationCenter } from './components/Notifications/NotificationCenter';
import { CoursesList } from './components/Courses/CoursesList';
import { 
  currentUser, 
  teacherUser, 
  parentUser, 
  courses, 
  assignments, 
  notifications, 
  grades, 
  subjects,
  subjectGrades,
  studentProgress
} from './data/mockData';
import type { Assignment, Course, Notification, SubjectGrade } from './types';

function App() {
  // Switch between different user types for demo
  const [currentUserType, setCurrentUserType] = useState<'student' | 'teacher' | 'parent'>('student');
  const user = currentUserType === 'student' ? currentUser : 
               currentUserType === 'teacher' ? teacherUser : parentUser;
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<Notification[]>(notifications);
  const [subjectGradesList, setSubjectGradesList] = useState<SubjectGrade[]>(subjectGrades);

  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleCloseSidebar = () => setSidebarOpen(false);

  const handleNotificationsClick = () => {
    setNotificationCenterOpen(!notificationCenterOpen);
  };

  const handleMarkAsRead = (id: string) => {
    setNotificationList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleAssignmentClick = (assignment: Assignment) => {
    console.log('Assignment clicked:', assignment);
    // Here you would typically navigate to assignment details
  };

  const handleCourseClick = (course: Course) => {
    console.log('Course clicked:', course);
    // Here you would typically navigate to course details
  };

  const handleAddGrade = (grade: Omit<SubjectGrade, 'id'>) => {
    const newGrade: SubjectGrade = {
      ...grade,
      id: `sg${Date.now()}`
    };
    setSubjectGradesList(prev => [...prev, newGrade]);
    alert('Grade added successfully!');
  };

  const unreadNotifications = notificationList.filter(n => !n.read).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (user.role === 'student') {
          return (
            <StudentDashboard
              user={user}
              courses={courses}
              assignments={assignments}
              grades={grades}
              subjectGrades={subjectGradesList}
              progress={studentProgress}
            />
          );
        } else if (user.role === 'teacher') {
          return (
            <TeacherDashboard
              user={user}
              courses={courses}
              assignments={assignments}
              grades={grades}
              subjectGrades={subjectGradesList}
            />
          );
        } else if (user.role === 'parent') {
          return (
            <ParentDashboard
              user={user}
              children={[currentUser]}
              courses={courses}
              grades={grades}
              subjectGrades={subjectGradesList}
              progress={studentProgress}
              assignments={assignments}
            />
          );
        }
        break;
      case 'add-grades':
        return (
          <AddGrades
            user={user}
            courses={courses}
            subjects={subjects}
            onAddGrade={handleAddGrade}
          />
        );
      case 'courses':
        return (
          <CoursesList
            courses={courses}
            onCourseClick={handleCourseClick}
          />
        );
      case 'assignments':
        return (
          <AssignmentList
            assignments={assignments}
            onAssignmentClick={handleAssignmentClick}
          />
        );
      case 'grades':
        return (
          <GradesList grades={grades} />
        );
      default:
        return (
          <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-600">This feature is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* User Type Switcher (Demo Only) */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-3">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentUserType('student')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              currentUserType === 'student' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setCurrentUserType('teacher')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              currentUserType === 'teacher' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => setCurrentUserType('parent')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              currentUserType === 'parent' 
                ? 'bg-amber-100 text-amber-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Parent
          </button>
        </div>
      </div>

      <Header
        user={user}
        onToggleSidebar={handleToggleSidebar}
        unreadNotifications={unreadNotifications}
        onNotificationsClick={handleNotificationsClick}
      />
      
      <div className="flex">
        <Sidebar
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />
        
        <main className="flex-1 min-h-[calc(100vh-80px)]">
          {renderContent()}
        </main>
      </div>

      <NotificationCenter
        notifications={notificationList}
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  );
}

export default App;