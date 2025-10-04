import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import UnauthorizedPage from './pages/UnathourizedPage';
import { ProtectedRoute } from './components/protected/ProtectedRoute';
import StudentDashboard from './pages/student/StudentDashboard';
import InstructorLayout from './components/layouts/instructor/instructorLayout';
import AdminLayout from './components/layouts/admin/AdminLayout';
import ExamPage from './pages/student/ExamsPage';
import StudentExamPage from './pages/student/StudentExamPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/users/login' element={<LoginPage />} />
        <Route path='/users/signup' element={<SignupPage />} />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />

        {/* Instructor Routes */}
        <Route
          path='/instructor/*'
          element={
            <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
              <InstructorLayout />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path='/student/*'
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/student/exam'
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <ExamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/student/exampage'
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentExamPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path='/admin/*'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
