// components/layout/AdminLayout.tsx
import React, { useState, useCallback } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import type { AdminLayoutProps } from '../../../types/navigation';
import {
  useCurrentUser,
  useLogoutUser,
} from '../../../api/services/authService';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

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
        name: 'Exam Categories',
        path: '/admin/exams/categories',
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
        name: 'Import Questions',
        path: '/admin/questions/import',
        icon: '📤',
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
      {
        name: 'Instructors',
        path: '/admin/users/instructors',
        icon: '👨‍🏫',
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
        name: 'Analytics',
        path: '/admin/results/analytics',
        icon: '📉',
      },
    ],
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: '⚙️',
  },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const logoutMutation = useLogoutUser();
  const { data: user } = useCurrentUser();

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const contentMarginLeft = isSidebarOpen ? '64' : '16';

  return (
    <Box minH='100vh' bg={bgColor}>
      {/* Navbar */}
      <AdminNavbar
        onToggle={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
        user={user!}
        onLogout={handleLogout}
      />

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} navItems={navItems} />

      {/* Main Content */}
      <Box
        ml={contentMarginLeft}
        mt='16'
        p={6}
        transition='margin-left 0.2s'
        minH='calc(100vh - 4rem)'
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
