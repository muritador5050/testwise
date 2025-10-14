import React from 'react';
import {
  Box,
  VStack,
  Text,
  Collapse,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import type { NavItem } from '../../../types/navigation';
import { colors } from '../../../utils/colors';

interface SidebarProps {
  isOpen: boolean;
  navItems: NavItem[];
  onNavigate?: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({
  isOpen,
  navItems,
  onNavigate,
}) => {
  const location = useLocation();

  const NavItemComponent: React.FC<{ item: NavItem; level?: number }> = ({
    item,
    level = 0,
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const { isOpen: isItemOpen, onToggle } = useDisclosure();
    const isActive = location.pathname === item.path;
    const pl = level * 4 + 4;

    const sharedProps = {
      display: 'flex' as const,
      alignItems: 'center' as const,
      w: 'full' as const,
      px: 4,
      py: 3,
      pl,
      bg: isActive ? colors.sectionBg : 'transparent',
      color: isActive ? colors.primary : colors.textSecondary,
      borderRight: isActive ? '3px solid' : 'none',
      borderRightColor: colors.primary,
      _hover: {
        bg: colors.sectionBg,
        color: colors.primary,
      },
      transition: 'all 0.2s',
      fontSize: 'sm' as const,
      fontWeight: (isActive ? 'semibold' : 'normal') as 'semibold' | 'normal',
    };

    return (
      <Box>
        {hasChildren ? (
          <Box
            as='button'
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onToggle();
            }}
            {...sharedProps}
          >
            <Text as='span' mr={3} fontSize='lg'>
              {item.icon}
            </Text>
            {isOpen && (
              <>
                <Text flex={1} textAlign='left'>
                  {item.name}
                </Text>
                <Icon
                  as={isItemOpen ? ChevronDownIcon : ChevronRightIcon}
                  w={4}
                  h={4}
                  color={colors.textMuted}
                />
              </>
            )}
          </Box>
        ) : (
          <Box
            as={Link}
            to={item.path}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onNavigate?.();
            }}
            {...sharedProps}
          >
            <Text as='span' mr={3} fontSize='lg'>
              {item.icon}
            </Text>
            {isOpen && (
              <Text flex={1} textAlign='left'>
                {item.name}
              </Text>
            )}
          </Box>
        )}

        {hasChildren && isOpen && (
          <Collapse in={isItemOpen} animateOpacity>
            <VStack spacing={0} align='stretch'>
              {item.children?.map((child) => (
                <NavItemComponent
                  key={child.path}
                  item={child}
                  level={level + 1}
                />
              ))}
            </VStack>
          </Collapse>
        )}
      </Box>
    );
  };

  // Collapsed sidebar (icon only)
  if (!isOpen) {
    return (
      <Box
        w={{ base: '14', md: '16' }}
        bg={colors.cardBg}
        borderRight='1px'
        borderColor={colors.border}
        h='full'
        overflowY='auto'
      >
        <VStack spacing={1} py={4}>
          {navItems.map((item) => (
            <Box
              key={item.path}
              as={Link}
              to={item.path}
              onClick={() => onNavigate?.()}
              p={{ base: 2, md: 3 }}
              borderRadius='md'
              bg={
                location.pathname === item.path
                  ? colors.sectionBg
                  : 'transparent'
              }
              color={
                location.pathname === item.path
                  ? colors.primary
                  : colors.textSecondary
              }
              _hover={{ bg: colors.sectionBg, color: colors.primary }}
              title={item.name}
            >
              <Text fontSize={{ base: 'md', md: 'lg' }}>{item.icon}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  // Expanded sidebar
  return (
    <Box
      w={{ base: '56', sm: '60', md: '64' }}
      bg={colors.cardBg}
      borderRight='1px'
      borderColor={colors.border}
      h='full'
      overflowY='auto'
      transition='width 0.2s'
    >
      <VStack spacing={0} align='stretch' py={4}>
        {navItems.map((item) => (
          <NavItemComponent key={item.path} item={item} />
        ))}
      </VStack>
    </Box>
  );
};

export default AdminSidebar;
