import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import UnauthorizedPage from './pages/UnathourizedPage';
import { ProtectedRoute } from './components/protected/ProtectedRoute';
import AdminLayout from './components/layouts/admin/AdminLayout';
import StudentLayout from './components/layouts/student/StudentLayout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/users/login' element={<LoginPage />} />
        <Route path='/users/signup' element={<SignupPage />} />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />

        {/* Student Routes */}
        <Route
          path='/student/*'
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentLayout />
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
