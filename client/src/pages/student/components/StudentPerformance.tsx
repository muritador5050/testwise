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
import { colors, bgStyles, textStyles } from '../../../utils/colors';

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
    color: isPass ? colors.success : colors.error,
  };
};

// Main Component
export const StudentPerformance: React.FC = () => {
  const { data } = useGetUserPerformance();

  return (
    <VStack spacing={6} align='stretch' w='full'>
      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card {...bgStyles.card}>
          <CardBody>
            <Stat>
              <HStack>
                <BarChart3 size={24} color={colors.primary} />
                <StatLabel {...textStyles.body}>Total Attempts</StatLabel>
              </HStack>
              <StatNumber fontSize='2xl' {...textStyles.heading}>
                {data?.totalAttempts}
              </StatNumber>
              <StatHelpText {...textStyles.muted}>
                All time test attempts
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card {...bgStyles.card}>
          <CardBody>
            <Stat>
              <HStack>
                <TrendingUp size={24} color={colors.success} />
                <StatLabel {...textStyles.body}>Average Score</StatLabel>
              </HStack>
              <StatNumber fontSize='2xl' {...textStyles.heading}>
                {data?.averageScore.toFixed(1)}%
              </StatNumber>
              <StatHelpText {...textStyles.muted}>
                Across all attempts
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card {...bgStyles.card}>
          <CardBody>
            <Stat>
              <HStack>
                <Target size={24} color={colors.warning} />
                <StatLabel {...textStyles.body}>Pass Rate</StatLabel>
              </HStack>
              <StatNumber fontSize='2xl' {...textStyles.heading}>
                {data?.passRate.toFixed(1)}%
              </StatNumber>
              <StatHelpText {...textStyles.muted}>
                Tests passed (≥50%)
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Attempts History */}
      <Card {...bgStyles.card}>
        <CardHeader>
          <HStack justify='space-between'>
            <HStack>
              <Calendar size={20} color={colors.primary} />
              <Text fontSize='xl' fontWeight='bold' {...textStyles.heading}>
                Recent Attempts
              </Text>
            </HStack>

            {(data?.attempts.length ?? 0) > 2 && (
              <Button
                as={Link}
                to='/student/results'
                size='sm'
                bg={colors.primary}
                color='white'
                _hover={{ bg: colors.primaryHover }}
                variant='ghost'
              >
                View All
              </Button>
            )}
          </HStack>
        </CardHeader>
        <CardBody>
          {!data?.attempts || data.attempts.length === 0 ? (
            <VStack spacing={2} py={8}>
              <Text {...textStyles.muted}>No attempts yet</Text>
              <Text fontSize='sm' {...textStyles.muted}>
                Start taking tests to see your performance
              </Text>
            </VStack>
          ) : (
            <VStack
              spacing={4}
              align='stretch'
              divider={<Divider borderColor={colors.border} />}
            >
              {data?.attempts.slice(0, 3).map((attempt, index) => {
                const passStatus = getPassStatus(attempt.percentScore ?? 0);
                return (
                  <Box
                    key={index}
                    p={3}
                    borderRadius='md'
                    _hover={{ bg: colors.sectionBg }}
                    transition='background 0.2s'
                  >
                    <VStack align='stretch' spacing={3}>
                      <HStack justify='space-between'>
                        <Text
                          fontWeight='semibold'
                          fontSize='lg'
                          {...textStyles.heading}
                        >
                          {attempt.testTitle}
                        </Text>
                        <Badge
                          colorScheme={getScoreColor(
                            attempt?.percentScore ?? 0
                          )}
                          fontSize='sm'
                        >
                          {(attempt?.percentScore ?? 0).toFixed(1)}%
                        </Badge>
                      </HStack>

                      <HStack
                        justify='space-between'
                        fontSize='sm'
                        {...textStyles.body}
                      >
                        <HStack>
                          <Target size={16} />
                          <Text>Score: {attempt.score}</Text>
                        </HStack>
                        <HStack>
                          <Clock size={16} />
                          <Text>
                            Time: {formatTime(attempt.timeSpent ?? 0)}
                          </Text>
                        </HStack>
                      </HStack>

                      <Box>
                        <HStack justify='space-between' mb={1}>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            {...textStyles.body}
                          >
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
                        {...textStyles.muted}
                      >
                        <Text>Completed:</Text>
                        <Text>{formatDate(attempt.completedAt ?? '')}</Text>
                      </HStack>
                    </VStack>
                  </Box>
                );
              })}
            </VStack>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
};
