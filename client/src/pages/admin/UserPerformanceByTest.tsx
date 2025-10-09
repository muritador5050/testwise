// components/UserPerformance.tsx
import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Icon,
  Tooltip,
  Flex,
  Button,
  Divider,
  Container,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Clock, TrendingUp, User, Award, Eye } from 'lucide-react';
import { useGetAllTests } from '../../api/services/testServices';
import { useGetTestPerformance } from '../../api/services/attemptService';
import type { TestPerformance } from '../../types/api';

interface UserInfo {
  userId: number;
  userName: string;
  email: string;
}

const UserPerformanceByTest: React.FC = () => {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const {
    data: testsData,
    isLoading: testsLoading,
    error: testsError,
  } = useGetAllTests();

  const {
    data: performanceData,
    isLoading: performanceLoading,
    error: performanceError,
  } = useGetTestPerformance(selectedTestId as number);

  // Auto-select first test if none selected and tests are loaded
  React.useEffect(() => {
    if (testsData?.tests && testsData.tests.length > 0 && !selectedTestId) {
      setSelectedTestId(testsData.tests[0].id);
    }
  }, [testsData, selectedTestId]);

  const sidebarBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const performances: TestPerformance[] = performanceData || [];
  const testId = selectedTestId?.toString() || '';

  // Sort performances by attempt number
  const sortedPerformances = [...performances].sort(
    (a, b) => a.attemptNumber - b.attemptNumber
  );

  // Calculate statistics
  const totalAttempts = performances.length;
  const bestScore =
    performances.length > 0
      ? Math.max(
          ...performances
            .map((p) => p.percentScore)
            .filter(
              (score): score is number => score !== null && score !== undefined
            )
        )
      : 0;
  const averageScore =
    performances.length > 0
      ? performances.reduce((sum, p) => sum + (p.percentScore ?? 0), 0) /
        performances.length
      : 0;
  const totalTimeSpent = performances.reduce(
    (sum, p) => sum + (p.timeSpent ?? 0),
    0
  );

  // Get unique users from performances
  const uniqueUsers = performances.reduce((users: UserInfo[], performance) => {
    if (!users.find((user) => user.userId === performance.userId)) {
      users.push({
        userId: performance.userId,
        userName: performance.userName,
        email: performance?.email,
      });
    }
    return users;
  }, []);

  // Format time spent from seconds to readable format
  const formatTimeSpent = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get color scheme based on percentage score
  const getScoreColor = (percent: number): string => {
    if (percent >= 80) return 'green';
    if (percent >= 60) return 'yellow';
    if (percent >= 40) return 'orange';
    return 'red';
  };

  // Get status badge text based on percentage score
  const getStatusText = (percent: number): string => {
    if (percent >= 80) return 'Excellent';
    if (percent >= 60) return 'Good';
    if (percent >= 40) return 'Average';
    return 'Poor';
  };

  const selectedTest = testsData?.tests?.find(
    (test) => test.id === selectedTestId
  );

  if (testsLoading && !testsData) {
    return (
      <Container maxW='container.xl' py={8}>
        <Flex justify='center' align='center' minH='400px'>
          <Spinner size='xl' color='blue.500' thickness='4px' />
        </Flex>
      </Container>
    );
  }

  if (testsError) {
    return (
      <Container maxW='container.xl' py={8}>
        <Alert status='error' borderRadius='md'>
          <AlertIcon />
          <Text>
            {testsError instanceof Error
              ? testsError.message
              : 'Failed to load tests'}
          </Text>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW='container.xl' py={8} px={0}>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
        {/* Left Sidebar - Tests List */}
        <Box
          w={{ base: '100%', lg: '350px' }}
          bg={sidebarBg}
          borderRadius='lg'
          p={4}
          border='1px'
          borderColor={borderColor}
        >
          <Heading size='md' mb={4}>
            All Tests ({testsData?.tests?.length || 0})
          </Heading>

          <VStack spacing={2} align='stretch' divider={<Divider />}>
            {testsData?.tests?.map((test) => (
              <Box
                key={test.id}
                p={3}
                borderRadius='md'
                bg={selectedTestId === test.id ? selectedBg : 'transparent'}
                border='1px'
                borderColor={
                  selectedTestId === test.id ? 'blue.200' : 'transparent'
                }
                cursor='pointer'
                _hover={{
                  bg: selectedTestId === test.id ? selectedBg : 'gray.100',
                }}
                onClick={() => setSelectedTestId(test.id)}
              >
                <Flex justify='space-between' align='start'>
                  <Box flex={1}>
                    <Text fontWeight='medium' fontSize='sm' noOfLines={2}>
                      {test.title}
                    </Text>
                    <HStack spacing={2} mt={1}>
                      <Badge colorScheme='blue' fontSize='xs'>
                        {test.duration}m
                      </Badge>
                      <Badge colorScheme='green' fontSize='xs'>
                        {test._count?.questions || 0} Qs
                      </Badge>
                      <Badge colorScheme='purple' fontSize='xs'>
                        {test._count?.attempts || 0} attempts
                      </Badge>
                    </HStack>
                  </Box>
                  <Button
                    size='sm'
                    variant='ghost'
                    ml={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTestId(test.id);
                    }}
                  >
                    <Icon as={Eye} />{' '}
                    {/* Fixed: Changed from ViewIcon to Eye */}
                  </Button>
                </Flex>
              </Box>
            ))}
          </VStack>

          {(!testsData?.tests || testsData.tests.length === 0) && (
            <Alert status='info' borderRadius='md' mt={4}>
              <AlertIcon />
              No tests available.
            </Alert>
          )}
        </Box>

        {/* Right Content - User Performance */}
        <Box flex={1}>
          {performanceError && (
            <Alert status='error' borderRadius='md' mb={4}>
              <AlertIcon />
              <Text>
                {performanceError instanceof Error
                  ? performanceError.message
                  : 'Failed to load performance data'}
              </Text>
            </Alert>
          )}

          {selectedTest ? (
            performanceLoading ? (
              <Flex justify='center' align='center' minH='400px'>
                <Spinner size='xl' color='blue.500' thickness='4px' />
              </Flex>
            ) : performances.length === 0 ? (
              <Card>
                <CardBody>
                  <Text color='gray.500' textAlign='center' py={8}>
                    No performance data available for this test.
                  </Text>
                </CardBody>
              </Card>
            ) : (
              <VStack spacing={6} align='stretch'>
                {/* Header with test info and stats */}
                <Card>
                  <CardHeader>
                    <HStack justify='space-between'>
                      <VStack align='start' spacing={1}>
                        <Heading size='md'>
                          Test Performance - {selectedTest.title}
                        </Heading>
                        <Text color='gray.600' fontSize='sm'>
                          Test ID: {testId}
                        </Text>
                      </VStack>
                      <Badge colorScheme='blue' fontSize='md' px={3} py={1}>
                        {totalAttempts} Attempt{totalAttempts !== 1 ? 's' : ''}
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack align='start' spacing={4}>
                      {/* User Information */}
                      <Box>
                        <Text fontWeight='medium' mb={2}>
                          Students:
                        </Text>
                        <HStack spacing={4} flexWrap='wrap'>
                          {uniqueUsers.map((user) => (
                            <HStack key={user.userId}>
                              <Icon as={User} color='blue.500' />
                              <VStack align='start' spacing={0}>
                                <Text fontSize='sm' fontWeight='medium'>
                                  {user.userName}
                                </Text>
                                <Text fontSize='xs' color='gray.600'>
                                  {user.email}
                                </Text>
                              </VStack>
                            </HStack>
                          ))}
                        </HStack>
                      </Box>

                      {/* Performance Stats */}
                      <HStack spacing={6} flexWrap='wrap'>
                        <HStack>
                          <Icon as={Award} color='green.500' />
                          <VStack align='start' spacing={0}>
                            <Text fontSize='sm' color='gray.600'>
                              Best Score
                            </Text>
                            <Text fontWeight='medium' color='green.600'>
                              {bestScore.toFixed(1)}%
                            </Text>
                          </VStack>
                        </HStack>

                        <HStack>
                          <Icon as={TrendingUp} color='purple.500' />
                          <VStack align='start' spacing={0}>
                            <Text fontSize='sm' color='gray.600'>
                              Average Score
                            </Text>
                            <Text fontWeight='medium'>
                              {averageScore.toFixed(1)}%
                            </Text>
                          </VStack>
                        </HStack>

                        <HStack>
                          <Icon as={Clock} color='orange.500' />
                          <VStack align='start' spacing={0}>
                            <Text fontSize='sm' color='gray.600'>
                              Total Time
                            </Text>
                            <Text fontWeight='medium'>
                              {formatTimeSpent(totalTimeSpent)}
                            </Text>
                          </VStack>
                        </HStack>

                        <HStack>
                          <Icon as={User} color='teal.500' />
                          <VStack align='start' spacing={0}>
                            <Text fontSize='sm' color='gray.600'>
                              Students
                            </Text>
                            <Text fontWeight='medium'>
                              {uniqueUsers.length}
                            </Text>
                          </VStack>
                        </HStack>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Performance Table */}
                <Card>
                  <CardHeader>
                    <Heading size='md'>Attempt History</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box overflowX='auto'>
                      <Table variant='simple'>
                        <Thead>
                          <Tr>
                            <Th>Student</Th>
                            <Th>Attempt #</Th>
                            <Th>Score</Th>
                            <Th>Percentage</Th>
                            <Th>Time Spent</Th>
                            <Th>Completed At</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {sortedPerformances.map((performance) => (
                            <Tr
                              key={`${performance.userId}-${performance.attemptNumber}`}
                            >
                              <Td>
                                <VStack align='start' spacing={0}>
                                  <Text fontWeight='medium'>
                                    {performance.userName}
                                  </Text>
                                  <Text fontSize='xs' color='gray.600'>
                                    {performance.email}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td fontWeight='medium'>
                                Attempt {performance.attemptNumber}
                              </Td>
                              <Td>
                                <Text>{performance.score} points</Text>
                              </Td>
                              <Td>
                                <VStack align='start' spacing={1}>
                                  <HStack>
                                    <Text fontWeight='medium'>
                                      {performance.percentScore}%
                                    </Text>
                                    <Badge
                                      colorScheme={getScoreColor(
                                        performance.percentScore ?? 0
                                      )}
                                      size='sm'
                                    >
                                      {getStatusText(
                                        performance.percentScore ?? 0
                                      )}
                                    </Badge>
                                  </HStack>
                                  <Progress
                                    value={performance.percentScore ?? 0}
                                    size='sm'
                                    colorScheme={getScoreColor(
                                      performance.percentScore ?? 0
                                    )}
                                    width='100px'
                                  />
                                </VStack>
                              </Td>
                              <Td>
                                <Tooltip
                                  label={`${performance.timeSpent} seconds`}
                                >
                                  <Text>
                                    {formatTimeSpent(
                                      performance.timeSpent ?? 0
                                    )}
                                  </Text>
                                </Tooltip>
                              </Td>
                              <Td>
                                <Text fontSize='sm'>
                                  {formatDate(performance.completedAt ?? '')}
                                </Text>
                              </Td>
                              <Td>
                                <Badge
                                  colorScheme={
                                    performance.percentScore ?? 0 >= 50
                                      ? 'green'
                                      : 'red'
                                  }
                                  variant='subtle'
                                >
                                  {performance.percentScore ?? 0 >= 50
                                    ? 'Passed'
                                    : 'Failed'}
                                </Badge>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </CardBody>
                </Card>

                {/* Performance Summary */}
                <Card>
                  <CardHeader>
                    <Heading size='md'>Performance Summary</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align='start' spacing={4}>
                      <Box width='100%'>
                        <HStack justify='space-between' mb={2}>
                          <Text fontWeight='medium'>
                            Progress Over Attempts
                          </Text>
                          <Text fontSize='sm' color='gray.600'>
                            Best: {bestScore}% • Average:{' '}
                            {averageScore.toFixed(1)}%
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          {sortedPerformances.map((attempt) => (
                            <VStack
                              key={attempt.attemptNumber}
                              flex={1}
                              spacing={1}
                            >
                              <Text fontSize='xs' color='gray.600'>
                                #{attempt.attemptNumber}
                              </Text>
                              <Progress
                                value={attempt.percentScore ?? 0}
                                height='20px'
                                width='100%'
                                colorScheme={getScoreColor(
                                  attempt.percentScore ?? 0
                                )}
                              />
                              <Text fontSize='xs' fontWeight='medium'>
                                {attempt.percentScore}%
                              </Text>
                            </VStack>
                          ))}
                        </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            )
          ) : (
            !testsLoading && (
              <Flex justify='center' align='center' minH='200px'>
                <Card>
                  <CardBody>
                    <Text color='gray.500'>
                      Select a test to view user performance
                    </Text>
                  </CardBody>
                </Card>
              </Flex>
            )
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default UserPerformanceByTest;
