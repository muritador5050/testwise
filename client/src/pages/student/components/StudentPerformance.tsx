import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Divider,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import {
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  Calendar,
} from 'lucide-react';
import { useGetUserPerformance } from '../../../api/services/attemptService';
import { Link } from 'react-router-dom';

// Helper functions
const formatTime = (seconds: number): string => {
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

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  if (score >= 40) return 'orange';
  return 'red';
};

const getPassStatus = (
  percentScore: number
): { icon: React.ReactNode; color: string } => {
  const isPass = percentScore >= 50;
  return {
    icon: isPass ? <CheckCircle size={16} /> : <XCircle size={16} />,
    color: isPass ? 'green.500' : 'red.500',
  };
};

// Main Component
export const StudentPerformance: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerColor = useColorModeValue('gray.800', 'white');

  const { data } = useGetUserPerformance();

  return (
    <VStack spacing={6} align='stretch' w='full'>
      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card bg={cardBg} border='1px' borderColor={borderColor}>
          <CardBody>
            <Stat>
              <HStack>
                <BarChart3 size={24} color='#3182CE' />
                <StatLabel>Total Attempts</StatLabel>
              </HStack>
              <StatNumber fontSize='2xl'>{data?.totalAttempts}</StatNumber>
              <StatHelpText>All time test attempts</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border='1px' borderColor={borderColor}>
          <CardBody>
            <Stat>
              <HStack>
                <TrendingUp size={24} color='#38A169' />
                <StatLabel>Average Score</StatLabel>
              </HStack>
              <StatNumber fontSize='2xl'>
                {data?.averageScore.toFixed(1)}%
              </StatNumber>
              <StatHelpText>Across all attempts</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border='1px' borderColor={borderColor}>
          <CardBody>
            <Stat>
              <HStack>
                <Target size={24} color='#DD6B20' />
                <StatLabel>Pass Rate</StatLabel>
              </HStack>
              <StatNumber fontSize='2xl'>{data?.passRate}%</StatNumber>
              <StatHelpText>Tests passed (≥50%)</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Attempts History */}
      <Card bg={cardBg} border='1px' borderColor={borderColor}>
        <CardHeader>
          <HStack justify='space-between'>
            <HStack>
              <Calendar size={20} />
              <Text fontSize='xl' fontWeight='bold' color={headerColor}>
                Recent Attempts
              </Text>
            </HStack>
            <Button
              as={Link}
              to='/student/results'
              size='sm'
              color={'white'}
              variant='ghost'
            >
              View All
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align='stretch' divider={<Divider />}>
            {data?.attempts.map((attempt, index) => {
              const passStatus = getPassStatus(attempt.percentScore ?? 0);
              return (
                <Box
                  key={index}
                  p={3}
                  borderRadius='md'
                  _hover={{ bg: 'gray.700' }}
                >
                  <VStack align='stretch' spacing={3}>
                    <HStack justify='space-between'>
                      <Text fontWeight='semibold' fontSize='lg'>
                        {attempt.testTitle}
                      </Text>
                      <Badge
                        colorScheme={getScoreColor(attempt?.percentScore ?? 0)}
                        fontSize='sm'
                      >
                        {(attempt?.percentScore ?? 0).toFixed(1)}%
                      </Badge>
                    </HStack>

                    <HStack
                      justify='space-between'
                      fontSize='sm'
                      color='gray.600'
                    >
                      <HStack>
                        <Target size={16} />
                        <Text>Score: {attempt.score}</Text>
                      </HStack>
                      <HStack>
                        <Clock size={16} />
                        <Text>Time: {formatTime(attempt.timeSpent ?? 0)}</Text>
                      </HStack>
                    </HStack>

                    <Box>
                      <HStack justify='space-between' mb={1}>
                        <Text fontSize='sm' fontWeight='medium'>
                          Performance
                        </Text>
                        <HStack spacing={1}>
                          {passStatus.icon}
                          <Text fontSize='sm' color={passStatus.color}>
                            {(attempt.percentScore ?? 0) >= 50
                              ? 'Passed'
                              : 'Failed'}
                          </Text>
                        </HStack>
                      </HStack>
                      <Progress
                        value={attempt.percentScore as number}
                        colorScheme={getScoreColor(
                          attempt.percentScore as number
                        )}
                        size='sm'
                        borderRadius='full'
                      />
                    </Box>

                    <HStack
                      justify='space-between'
                      fontSize='sm'
                      color='gray.500'
                    >
                      <Text>Completed:</Text>
                      <Text>{formatDate(attempt.completedAt ?? '')}</Text>
                    </HStack>
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
