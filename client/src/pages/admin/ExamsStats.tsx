import React from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { useTestsStats } from '../../api/services/testServices';
import { TestStatisticsCard } from './components/TestStatisticCard';

const ExamsStats: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const { data, isLoading, error } = useTestsStats();

  if (isLoading) {
    return (
      <Box minH='100vh' bg={bgColor} py={8} px={4}>
        <Container maxW='7xl'>
          <Flex justify='center' align='center' h='400px'>
            <Spinner size='xl' color='blue.500' thickness='4px' />
          </Flex>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH='100vh' bg={bgColor} py={8} px={4}>
        <Container maxW='7xl'>
          <Flex justify='center' align='center' h='400px'>
            <Alert
              status='error'
              variant='subtle'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              borderRadius='lg'
              maxW='md'
            >
              <AlertIcon boxSize='40px' mr={0} />
              <AlertTitle mt={4} mb={1} fontSize='lg'>
                Error Loading Analytics
              </AlertTitle>
              <AlertDescription maxWidth='sm'>{error.message}</AlertDescription>
            </Alert>
          </Flex>
        </Container>
      </Box>
    );
  }

  const totalTests = data?.length || 0;
  const totalAttempts =
    data?.reduce((sum, test) => sum + test.totalAttempts, 0) || 0;
  const avgScore =
    data && totalTests > 0
      ? data.reduce((sum, test) => sum + test.averageScore, 0) / totalTests
      : 0;

  return (
    <Box minH='100vh' bg={bgColor} py={8} px={4}>
      <Container maxW='7xl'>
        <Box mb={8}>
          <Heading size='xl' mb={2}>
            Test Analytics
          </Heading>
          <Text color='gray.600'>Overview of all test performance metrics</Text>
        </Box>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={6}
          mb={8}
        >
          <Box
            bgGradient='linear(to-br, blue.500, blue.600)'
            borderRadius='xl'
            p={6}
            color='white'
          >
            <Flex justify='space-between' align='center' mb={4}>
              <Icon as={BarChart3} boxSize={8} />
            </Flex>
            <Text color='blue.100' fontSize='sm' mb={1}>
              Total Tests
            </Text>
            <Text fontSize='4xl' fontWeight='bold'>
              {totalTests}
            </Text>
          </Box>

          <Box
            bgGradient='linear(to-br, purple.500, purple.600)'
            borderRadius='xl'
            p={6}
            color='white'
          >
            <Flex justify='space-between' align='center' mb={4}>
              <Icon as={Users} boxSize={8} />
            </Flex>
            <Text color='purple.100' fontSize='sm' mb={1}>
              Total Attempts
            </Text>
            <Text fontSize='4xl' fontWeight='bold'>
              {totalAttempts}
            </Text>
          </Box>

          <Box
            bgGradient='linear(to-br, green.500, green.600)'
            borderRadius='xl'
            p={6}
            color='white'
          >
            <Flex justify='space-between' align='center' mb={4}>
              <Icon as={TrendingUp} boxSize={8} />
            </Flex>
            <Text color='green.100' fontSize='sm' mb={1}>
              Average Score
            </Text>
            <Text fontSize='4xl' fontWeight='bold'>
              {avgScore.toFixed(1)}%
            </Text>
          </Box>
        </Grid>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          {data?.map((test) => (
            <TestStatisticsCard key={test.testId} test={test} />
          ))}
        </Grid>

        {(!data || data.length === 0) && (
          <VStack py={12} spacing={4}>
            <Icon as={BarChart3} boxSize={16} color='gray.300' />
            <Heading size='md' color='gray.600'>
              No Test Data Available
            </Heading>
            <Text color='gray.500'>
              Start creating tests to see analytics here.
            </Text>
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default ExamsStats;
