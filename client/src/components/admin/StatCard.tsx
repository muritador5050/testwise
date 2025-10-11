import React, { type ReactElement } from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Stack,
  Flex,
} from '@chakra-ui/react';

interface CardProps {
  title: string;
  count: number;
  iconBg: string;
  icon: ReactElement;
}

const StatCard: React.FC<CardProps> = ({ title, count, icon, iconBg }) => {
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Stat
      px={{ base: 3, md: 4 }}
      py={{ base: 2, md: 3 }}
      shadow='sm'
      _hover={{ shadow: 'md' }}
      transition='all 0.2s'
      borderRadius='lg'
      bg={'whiteAlpha.200'}
    >
      <Flex align='center' gap={{ base: 2, sm: 3, md: 4 }}>
        <Box
          color={iconColor}
          display='flex'
          justifyContent='center'
          alignItems='center'
          fontSize={{ base: 'xl', md: '2xl' }}
          width={{ base: '50px', sm: '60px', md: '40%' }}
          minW={{ base: '50px', sm: '60px', md: '40%' }}
          p={{ base: 3, sm: 4, md: 6 }}
          bg={iconBg}
          borderRadius='lg'
        >
          {icon}
        </Box>
        <Stack flex={1}>
          <StatLabel textTransform='uppercase'>{title}</StatLabel>
          <StatNumber fontSize={{ base: 'xl', md: '2xl' }}>
            {count && count.toLocaleString()}
          </StatNumber>
        </Stack>
      </Flex>
    </Stat>
  );
};

export default StatCard;
