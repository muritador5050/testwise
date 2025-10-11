import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Eager load public pages (small and needed immediately)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnathourizedPage';
import { PageLoader } from './utils/PageLoader';

// Lazy load heavy components
const SignupPage = lazy(() =>
  import('./pages/SignupPage').then((module) => ({
    default: module.SignupPage,
  }))
);
const ProtectedRoute = lazy(() =>
  import('./components/protected/ProtectedRoute').then((module) => ({
    default: module.ProtectedRoute,
  }))
);
const AdminLayout = lazy(
  () => import('./components/layouts/admin/AdminLayout')
);
const StudentLayout = lazy(
  () => import('./components/layouts/student/StudentLayout')
);



const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </Router>
  );
};

export default App;
