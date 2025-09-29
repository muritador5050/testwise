import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestionPage from './pages/QuestionsPage';
import ResultsPage from './pages/ResultsPage';
import SettingsPage from './pages/SettingsPage';
import Dashboard from './pages/AdminDashboard';
import ExamsPage from './pages/ExamsPage';
import AdminLayout from './components/layouts/AdminLayout';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/users/login' element={<LoginPage />} />
        <Route path='/users/signup' element={<SignupPage />} />

        {/* Admin Routes */}
        <Route
          path='/admin/*'
          element={
            <AdminLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path='exams' element={<ExamsPage />} />
                <Route path='exams/create' element={<div>Create Exam</div>} />
                <Route
                  path='exams/categories'
                  element={<div>Exam Categories</div>}
                />
                <Route path='questions' element={<QuestionPage />} />
                <Route
                  path='questions/create'
                  element={<div>Create Question</div>}
                />
                <Route
                  path='questions/import'
                  element={<div>Import Questions</div>}
                />
                <Route path='users' element={<UsersPage />} />
                <Route path='users/students' element={<div>Students</div>} />
                <Route
                  path='users/instructors'
                  element={<div>Instructors</div>}
                />
                <Route path='results' element={<ResultsPage />} />
                <Route
                  path='results/analytics'
                  element={<div>Analytics</div>}
                />
                <Route path='settings' element={<SettingsPage />} />
              </Routes>
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
