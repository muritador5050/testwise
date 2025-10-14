import React from 'react';
import { Box, Text, Flex, Icon } from '@chakra-ui/react';
import { type LucideIcon } from 'lucide-react';
import { colors, textStyles } from '../../../utils/colors';

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
  return (
    <Flex
      align='center'
      gap={3}
      p={4}
      bg={colors.cardBg}
      borderRadius='xl'
      borderLeft='4px solid'
      borderColor={color}
      boxShadow='md'
      _hover={{ boxShadow: 'xl', transform: 'translateY(-3px)' }}
      transition='all 0.25s ease-in-out'
    >
      <Box p={2.5} borderRadius='lg' bg={color}>
        <Icon as={icon} boxSize={6} color='white' />
      </Box>
      <Box>
        <Text fontSize='xs' {...textStyles.muted}>
          {label}
        </Text>
        <Text fontSize='md' fontWeight='semibold' {...textStyles.heading}>
          {value}
        </Text>
      </Box>
    </Flex>
  );
};
