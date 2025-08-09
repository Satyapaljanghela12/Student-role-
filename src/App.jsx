import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherLayout from './components/Layout/TeacherLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Import other pages (to be created)
const Classes = () => <div className="p-6"><h1 className="text-2xl font-bold">Classes</h1><p>Classes management coming soon...</p></div>;
const Assignments = () => <div className="p-6"><h1 className="text-2xl font-bold">Assignments</h1><p>Assignment management coming soon...</p></div>;
const Quizzes = () => <div className="p-6"><h1 className="text-2xl font-bold">Quizzes</h1><p>Quiz management coming soon...</p></div>;
const Attendance = () => <div className="p-6"><h1 className="text-2xl font-bold">Attendance</h1><p>Attendance tracking coming soon...</p></div>;
const Resources = () => <div className="p-6"><h1 className="text-2xl font-bold">Resources</h1><p>Resource management coming soon...</p></div>;
const Communication = () => <div className="p-6"><h1 className="text-2xl font-bold">Communication</h1><p>Communication tools coming soon...</p></div>;
const Profile = () => <div className="p-6"><h1 className="text-2xl font-bold">Profile</h1><p>Profile management coming soon...</p></div>;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <TeacherLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="classes" element={<Classes />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="resources" element={<Resources />} />
              <Route path="communication" element={<Communication />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;