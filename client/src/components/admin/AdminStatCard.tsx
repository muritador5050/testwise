import React, { type ReactElement } from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { colors, textStyles } from '../../utils/colors';

interface CardProps {
  title: string;
  count: number;
  iconBg: string;
  icon: ReactElement;
}

const AdminStatCard: React.FC<CardProps> = ({ title, count, icon, iconBg }) => {
  return (
    <Stat
      px={{ base: 3, md: 4 }}
      py={{ base: 2, md: 3 }}
      shadow='sm'
      _hover={{ shadow: 'md' }}
      transition='all 0.2s'
      borderRadius='lg'
      bg={colors.cardBg}
      borderWidth='1px'
      borderColor={colors.border}
    >
      <Flex align='center' gap={{ base: 2, sm: 3, md: 4 }}>
        <Box
          color='white'
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
        <Stack flex={1} spacing={1}>
          <StatLabel
            textTransform='uppercase'
            fontSize='xs'
            {...textStyles.muted}
          >
            {title}
          </StatLabel>
          <StatNumber
            fontSize={{ base: 'xl', md: '2xl' }}
            {...textStyles.heading}
          >
            {count && count.toLocaleString()}
          </StatNumber>
        </Stack>
      </Flex>
    </Stat>
  );
};

export default AdminStatCard;
