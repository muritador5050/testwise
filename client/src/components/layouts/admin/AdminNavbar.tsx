import React from 'react';
import {
  Box,
  HStack,
  IconButton,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import type { User } from '../../types/api';

interface NavbarProps {
  onToggle: () => void;
  isSidebarOpen: boolean;
  user: User;
  onLogout: () => void;
}

const AdminNavbar: React.FC<NavbarProps> = ({
  onToggle,
  isSidebarOpen,
  user,
  onLogout,
}) => {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Generate breadcrumbs from path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter((path) => path);
    const breadcrumbs = [{ name: 'Dashboard', path: '/admin' }];

    paths.forEach((path, index) => {
      const fullPath = `/${paths.slice(0, index + 1).join('/')}`;
      const name =
        path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ name, path: fullPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Convert avatar to string URL if it's a File object
  const getAvatarSrc = (): string | undefined => {
    if (!user?.avatar) return undefined;
    if (typeof user?.avatar === 'string') return user?.avatar;
    // If it's a File object, create an object URL
    return URL.createObjectURL(user?.avatar);
  };

  return (
    <Box
      bg={bgColor}
      borderBottom='1px'
      borderColor={borderColor}
      position='fixed'
      top='0'
      left='0'
      right='0'
      zIndex='sticky'
      h='16'
      px={4}
    >
      <HStack justify='space-between' h='full'>
        {/* Left Section */}
        <HStack spacing={4}>
          <IconButton
            aria-label='Toggle sidebar'
            icon={<HamburgerIcon />}
            variant='ghost'
            onClick={onToggle}
          />

          {/* Breadcrumbs */}
          {isSidebarOpen && (
            <Breadcrumb separator={<ChevronRightIcon color='gray.500' />}>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={`index-${index}`}>
                  <BreadcrumbLink
                    as={Link}
                    to={crumb.path}
                    isCurrentPage={index === breadcrumbs.length - 1}
                    color={
                      index === breadcrumbs.length - 1 ? 'blue.600' : 'gray.600'
                    }
                    fontWeight={
                      index === breadcrumbs.length - 1 ? 'semibold' : 'normal'
                    }
                  >
                    {crumb.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          )}
        </HStack>

        {/* Right Section - User Menu */}
        <HStack spacing={4}>
          <Text fontSize='sm' color='gray.600'>
            Welcome, {user?.name}
          </Text>
          <Menu>
            <MenuButton>
              <Avatar
                size='sm'
                name={user?.name}
                src={getAvatarSrc()}
                cursor='pointer'
              />
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to='/admin/profile'>
                Profile
              </MenuItem>
              <MenuItem as={Link} to='/admin/settings'>
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={onLogout} color='red.600'>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </Box>
  );
};

export default AdminNavbar;
