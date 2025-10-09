import React from 'react';
import {
  Box,
  VStack,
  Text,
  Collapse,
  Icon,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import type { NavItem } from '../../../types/navigation';

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
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
      bg: isActive ? 'blue.50' : 'transparent',
      color: isActive ? 'blue.600' : 'gray.600',
      borderRight: isActive ? '3px solid' : 'none',
      borderRightColor: 'blue.500',
      _hover: {
        bg: 'blue.50',
        color: 'blue.600',
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

  if (!isOpen) {
    return (
      <Box
        w='16'
        bg={bgColor}
        borderRight='1px'
        borderColor={borderColor}
        h='100vh'
        position='fixed'
        left='0'
        top='0'
        pt='16'
        overflowY='auto'
      >
        <VStack spacing={1} py={4}>
          {navItems.map((item) => (
            <Box
              key={item.path}
              as={Link}
              to={item.path}
              onClick={() => onNavigate?.()}
              p={3}
              borderRadius='md'
              bg={location.pathname === item.path ? 'blue.50' : 'transparent'}
              color={location.pathname === item.path ? 'blue.600' : 'gray.600'}
              _hover={{ bg: 'blue.50', color: 'blue.600' }}
              title={item.name}
            >
              <Text fontSize='lg'>{item.icon}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      w='64'
      bg={bgColor}
      borderRight='1px'
      borderColor={borderColor}
      h='100vh'
      position='fixed'
      left='0'
      top='0'
      pt='16'
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
