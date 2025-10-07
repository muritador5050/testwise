import React from 'react';
import { Box, Text, Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color,
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Flex align='center' gap={3} p={3} bg={bgColor} borderRadius='lg'>
      <Box p={2} borderRadius='lg' bg={color}>
        <Icon as={icon} boxSize={4} color='white' />
      </Box>
      <Box>
        <Text fontSize='xs' color='gray.500'>
          {label}
        </Text>
        <Text fontSize='sm' fontWeight='semibold'>
          {value}
        </Text>
      </Box>
    </Flex>
  );
};
