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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import type { User } from '../../../types/api';
import { colors, buttonStyles } from '../../../utils/colors';

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
      bg={colors.cardBg}
      borderBottom='1px'
      borderColor={colors.border}
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
            color={colors.textSecondary}
            _hover={{ bg: colors.sectionBg }}
          />

          {/* Breadcrumbs */}
          {isSidebarOpen && (
            <Breadcrumb
              separator={<ChevronRightIcon color={colors.textMuted} />}
            >
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={`index-${index}`}>
                  <BreadcrumbLink
                    as={Link}
                    to={crumb.path}
                    isCurrentPage={index === breadcrumbs.length - 1}
                    color={
                      index === breadcrumbs.length - 1
                        ? colors.primary
                        : colors.textSecondary
                    }
                    fontWeight={
                      index === breadcrumbs.length - 1 ? 'semibold' : 'normal'
                    }
                    _hover={{ color: colors.primary }}
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
          <Text fontSize='sm' color={colors.textSecondary}>
            Welcome, Admin {user?.name}
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
            <MenuList
              bg={colors.cardBg}
              borderColor={colors.border}
              boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            >
              <MenuDivider borderColor={colors.border} />
              <MenuItem bg={colors.cardBg} _hover={{ bg: colors.sectionBg }}>
                <Button
                  as={Link}
                  to='/student'
                  bg={buttonStyles.primary.bg}
                  color={buttonStyles.primary.color}
                  size='md'
                  rounded='md'
                  _hover={{ bg: buttonStyles.primary._hover.bg }}
                >
                  Preview Student Test Experience
                </Button>
              </MenuItem>
              <MenuItem
                onClick={onLogout}
                color={colors.error}
                bg={colors.cardBg}
                _hover={{ bg: colors.sectionBg }}
              >
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
