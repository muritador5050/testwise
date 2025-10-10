import React, { useState, useCallback } from 'react';
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  useCurrentUser,
  useLogoutUser,
} from '../../../api/services/authService';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../../../pages/admin/AdminDashboard';
import UsersPage from '../../../pages/admin/UsersPage';
import Students from '../../../pages/admin/Students';
import ExamsStats from '../../../pages/admin/ExamsStats';
import ResultsStatistics from '../../../pages/admin/ResultsStatistics';
import ExamCreation from '../../../pages/admin/ExamCreation';
import QuestionCreation from '../../../pages/admin/QuestionCreation';
import QuestionBank from '../../../pages/admin/QuestionBank';
import QuestionAnalytics from '../../../pages/admin/QuestionsAnalytics';
import ScoreDistributionChart from '../../../pages/admin/ScoreDistribution';
import UserPerformanceByTest from '../../../pages/admin/UserPerformanceByTest';

// Navigation items configuration
const navItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: '📊',
  },
  {
    name: 'Exams',
    path: '/admin/exams',
    icon: '📝',
    children: [
      {
        name: 'All Exams',
        path: '/admin/exams',
        icon: '📋',
      },
      {
        name: 'Create Exam',
        path: '/admin/exams/create',
        icon: '➕',
      },
      {
        name: 'Exam Performance',
        path: '/admin/exams/performances',
        icon: '📑',
      },
    ],
  },
  {
    name: 'Questions',
    path: '/admin/questions',
    icon: '❓',
    children: [
      {
        name: 'Question Bank',
        path: '/admin/questions',
        icon: '🏦',
      },
      {
        name: 'Create Question',
        path: '/admin/questions/create',
        icon: '➕',
      },
      {
        name: 'Analytics',
        path: '/admin/questions/analytics',
        icon: '📉',
      },
    ],
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: '👥',
    children: [
      {
        name: 'All Users',
        path: '/admin/users',
        icon: '👨‍💼',
      },
      {
        name: 'Students',
        path: '/admin/users/students',
        icon: '🎓',
      },
    ],
  },
  {
    name: 'Results',
    path: '/admin/results',
    icon: '📊',
    children: [
      {
        name: 'All Results',
        path: '/admin/results',
        icon: '📈',
      },
      {
        name: 'Score-Distribution',
        path: '/admin/results/score-distribution',
        icon: '📉',
      },
    ],
  },
];

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const logoutMutation = useLogoutUser();
  const { data: user } = useCurrentUser();

  // Determine if we're on mobile view
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const contentMarginLeft = isMobile ? '0' : isSidebarOpen ? '64' : '16';

  return (
    <Box minH='100vh' bg={bgColor}>
      {/* Navbar */}
      <AdminNavbar
        onToggle={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
        user={user!}
        onLogout={handleLogout}
      />

      {/* Desktop Sidebar */}
      {!isMobile && <AdminSidebar isOpen={isSidebarOpen} navItems={navItems} />}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          isOpen={isSidebarOpen}
          placement='left'
          onClose={handleCloseSidebar}
          size='xs'
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <AdminSidebar
              isOpen={true}
              navItems={navItems}
              onNavigate={handleCloseSidebar}
            />
          </DrawerContent>
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        ml={contentMarginLeft}
        mt='16'
        p={{ base: 2, lg: 6 }}
        transition='margin-left 0.2s'
        minH='calc(100vh - 4rem)'
      >
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path='exams' element={<ExamsStats />} />
          <Route path='questions' element={<QuestionBank />} />
          <Route path='questions/create' element={<QuestionCreation />} />
          <Route path='questions/analytics' element={<QuestionAnalytics />} />
          <Route
            path='results/score-distribution'
            element={<ScoreDistributionChart />}
          />
          <Route path='exams/create' element={<ExamCreation />} />
          <Route path='users' element={<UsersPage />} />
          <Route path='users/students' element={<Students />} />
          <Route path='results' element={<ResultsStatistics />} />
          <Route
            path='exams/performances'
            element={<UserPerformanceByTest />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminLayout;
