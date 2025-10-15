import React, { useState, useCallback, lazy } from 'react';
import {
  Box,
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

const AdminDashboard = lazy(
  () => import('../../../pages/admin/AdminDashboard')
);
const UsersPage = lazy(() => import('../../../pages/admin/UsersPage'));
const Students = lazy(() => import('../../../pages/admin/Students'));
const ExamsStats = lazy(() => import('../../../pages/admin/ExamsStats'));
const ResultsStatistics = lazy(
  () => import('../../../pages/admin/ResultsStatistics')
);
const ExamCreation = lazy(() => import('../../../pages/admin/ExamCreation'));
const QuestionCreation = lazy(
  () => import('../../../pages/admin/QuestionCreation')
);
const QuestionBank = lazy(() => import('../../../pages/admin/QuestionBank'));
const QuestionAnalytics = lazy(
  () => import('../../../pages/admin/QuestionsAnalytics')
);
const ScoreDistributionChart = lazy(
  () => import('../../../pages/admin/ScoreDistribution')
);
const UserPerformanceByTest = lazy(
  () => import('../../../pages/admin/UserPerformanceByTest')
);

const LiveMonitoring = lazy(
  () => import('../../../pages/admin/LiveMonitoring')
);

//Navigation links
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
  {
    name: 'Live',
    path: '/admin/live-monitoring',
    icon: '📊',
  },
];

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const logoutMutation = useLogoutUser();
  const { data: user } = useCurrentUser();

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
    <Box minH='100vh'>
      <AdminNavbar
        onToggle={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
        user={user!}
        onLogout={handleLogout}
      />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box position='fixed' left='0' top='16' bottom='0' zIndex='sticky'>
          <AdminSidebar isOpen={isSidebarOpen} navItems={navItems} />
        </Box>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          isOpen={isSidebarOpen}
          placement='left'
          onClose={handleCloseSidebar}
        >
          <DrawerOverlay />
          <DrawerContent maxW={{ base: '56', sm: '60' }} pt='16'>
            <DrawerCloseButton top='4' />
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
          <Route path='live-monitoring' element={<LiveMonitoring />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminLayout;
