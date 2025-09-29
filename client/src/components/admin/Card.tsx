import React, { type ReactElement } from 'react';
import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react';

interface CardProps {
  title: string;
  count: number;
  iconBg: string;
  icon: ReactElement;
}

const Card: React.FC<CardProps> = ({ title, count, icon, iconBg }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const titleColor = useColorModeValue('gray.800', 'white');
  const countColor = useColorModeValue('blue.600', 'blue.300');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box
      p={6}
      bg={bg}
      border='1px'
      borderColor={borderColor}
      borderRadius='lg'
      shadow='sm'
      _hover={{ shadow: 'md' }}
      transition='all 0.2s'
    >
      <Flex align='center' justify='space-between'>
        <Box color={iconColor} fontSize='2xl' minW='40%' p={6} bg={iconBg}>
          {icon}
        </Box>
        <Box>
          <Text fontSize='lg' fontWeight='semibold' color={titleColor} mb={1}>
            {title}
          </Text>
          <Text fontSize='2xl' fontWeight='bold' color={countColor}>
            {count.toLocaleString()}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Card;
