import React from 'react';
import { Card, CardBody, Box, Text, Icon, HStack } from '@chakra-ui/react';
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
    <Card
      bg={colors.cardBg}
      borderLeft='4px solid'
      borderColor={color}
      borderWidth='1px'
      boxShadow='md'
      borderRadius='xl'
      transition='all 0.25s ease-in-out'
      _hover={{
        boxShadow: 'xl',
        transform: 'translateY(-3px)',
      }}
    >
      <CardBody p={4} bg={'red'}>
        <HStack align='center' gap={3}>
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
        </HStack>
      </CardBody>
    </Card>
  );
};
