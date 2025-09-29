import React from 'react';
import {
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  VStack,
} from '@chakra-ui/react';

const Dashboard: React.FC = () => {
  return (
    <VStack spacing={6} align='stretch'>
      <Heading size='lg'>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Stat px={4} py={5} bg='white' shadow='md' borderRadius='lg'>
          <StatLabel>Total Exams</StatLabel>
          <StatNumber>45</StatNumber>
          <StatHelpText>+12% from last month</StatHelpText>
        </Stat>

        <Stat px={4} py={5} bg='white' shadow='md' borderRadius='lg'>
          <StatLabel>Total Questions</StatLabel>
          <StatNumber>1,234</StatNumber>
          <StatHelpText>+8% from last month</StatHelpText>
        </Stat>

        <Stat px={4} py={5} bg='white' shadow='md' borderRadius='lg'>
          <StatLabel>Active Users</StatLabel>
          <StatNumber>892</StatNumber>
          <StatHelpText>+15% from last month</StatHelpText>
        </Stat>

        <Stat px={4} py={5} bg='white' shadow='md' borderRadius='lg'>
          <StatLabel>Completed Tests</StatLabel>
          <StatNumber>2,567</StatNumber>
          <StatHelpText>+23% from last month</StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Add more dashboard content here */}
    </VStack>
  );
};

export default Dashboard;
