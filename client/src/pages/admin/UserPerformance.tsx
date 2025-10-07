// components/UserPerformance.tsx
import React from 'react';
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
} from '@chakra-ui/react';
import { Clock, TrendingUp, User, Award } from 'lucide-react';

interface UserPerformance {
  userId: number;
  userName: string;
  email: string;
  attemptNumber: number;
  score: number;
  percentScore: number;
  timeSpent: number;
  completedAt: string;
}

export interface UserPerformanceResponse {
  testId: string;
  performances: UserPerformance[];
}

interface UserPerformanceProps {
  testId: string;
  performances: UserPerformance[];
  isLoading?: boolean;
}

const UserPerformanceComponent: React.FC<UserPerformanceProps> = ({
  testId,
  performances,
  isLoading = false,
}) => {
  // Sort performances by attempt number
  const sortedPerformances = [...performances].sort(
    (a, b) => a.attemptNumber - b.attemptNumber
  );

  // Calculate statistics
  const totalAttempts = performances.length;
  const bestScore = Math.max(...performances.map((p) => p.percentScore));
  const averageScore =
    performances.reduce((sum, p) => sum + p.percentScore, 0) / totalAttempts;
  const totalTimeSpent = performances.reduce((sum, p) => sum + p.timeSpent, 0);

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

  if (isLoading) {
    return (
      <Box p={4}>
        <Text>Loading performance data...</Text>
      </Box>
    );
  }

  if (!performances || performances.length === 0) {
    return (
      <Box p={4}>
        <Text color='gray.500'>
          No performance data available for this test.
        </Text>
      </Box>
    );
  }

  const user = performances[0]; // All entries are for the same user

  return (
    <VStack spacing={6} align='stretch' p={4}>
      {/* Header with test info and stats */}
      <Card>
        <CardHeader>
          <HStack justify='space-between'>
            <VStack align='start' spacing={1}>
              <Heading size='md'>Test Performance</Heading>
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
          <HStack spacing={6} flexWrap='wrap'>
            <HStack>
              <Icon as={User} color='blue.500' />
              <VStack align='start' spacing={0}>
                <Text fontSize='sm' color='gray.600'>
                  Student
                </Text>
                <Text fontWeight='medium'>{user.userName}</Text>
              </VStack>
            </HStack>

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
                <Text fontWeight='medium'>{averageScore.toFixed(1)}%</Text>
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
          </HStack>
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
                  <Tr key={performance.attemptNumber}>
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
                              performance.percentScore
                            )}
                            size='sm'
                          >
                            {performance.percentScore >= 80
                              ? 'Excellent'
                              : performance.percentScore >= 60
                              ? 'Good'
                              : performance.percentScore >= 40
                              ? 'Average'
                              : 'Poor'}
                          </Badge>
                        </HStack>
                        <Progress
                          value={performance.percentScore}
                          size='sm'
                          colorScheme={getScoreColor(performance.percentScore)}
                          width='100px'
                        />
                      </VStack>
                    </Td>
                    <Td>
                      <Tooltip label={`${performance.timeSpent} seconds`}>
                        <Text>{formatTimeSpent(performance.timeSpent)}</Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Text fontSize='sm'>
                        {formatDate(performance.completedAt)}
                      </Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          performance.percentScore >= 50 ? 'green' : 'red'
                        }
                        variant='subtle'
                      >
                        {performance.percentScore >= 50 ? 'Passed' : 'Failed'}
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
                <Text fontWeight='medium'>Progress Over Attempts</Text>
                <Text fontSize='sm' color='gray.600'>
                  Best: {bestScore}% • Average: {averageScore.toFixed(1)}%
                </Text>
              </HStack>
              <HStack spacing={2}>
                {sortedPerformances.map((attempt) => (
                  <VStack key={attempt.attemptNumber} flex={1} spacing={1}>
                    <Text fontSize='xs' color='gray.600'>
                      #{attempt.attemptNumber}
                    </Text>
                    <Progress
                      value={attempt.percentScore}
                      height='20px'
                      width='100%'
                      colorScheme={getScoreColor(attempt.percentScore)}
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
  );
};

export default UserPerformanceComponent;
