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
  Badge,
  Divider,
  Button,
} from '@chakra-ui/react';
import { Clock, Target, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetUserPerformance } from '../../api/services/attemptService';
import { colors, bgStyles, textStyles } from '../../utils/colors';

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
const StudentResults: React.FC = () => {
  const { data } = useGetUserPerformance();

  return (
    <VStack spacing={8} align='stretch' w='full' p={6} bg={colors.pageBg}>
      {/* Attempts History */}
      <Card {...bgStyles.card} shadow='md'>
        <CardHeader pb={4}>
          <HStack justify='space-between' align='center'>
            <HStack spacing={3}>
              <Calendar size={24} color={colors.primary} />
              <Text fontSize='2xl' fontWeight='bold' {...textStyles.heading}>
                All Your Results
              </Text>
            </HStack>
            <Button
              as={Link}
              to='/student'
              size='md'
              bg={colors.primary}
              color='white'
              _hover={{ bg: colors.primaryHover }}
              variant='outline'
              borderColor={colors.primary}
            >
              Back To Dashboard
            </Button>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack
            spacing={6}
            align='stretch'
            divider={<Divider borderColor={colors.border} />}
          >
            {data?.attempts.map((attempt, index) => {
              const passStatus = getPassStatus(attempt.percentScore ?? 0);
              return (
                <Box
                  key={index}
                  p={6}
                  borderRadius='lg'
                  border='1px'
                  borderColor={colors.border}
                  _hover={{ bg: colors.sectionBg, shadow: 'sm' }}
                  transition='all 0.2s'
                >
                  <VStack align='stretch' spacing={4}>
                    {/* Header with test title and score */}
                    <HStack justify='space-between' align='flex-start'>
                      <Text
                        fontWeight='semibold'
                        fontSize='lg'
                        flex={1}
                        {...textStyles.heading}
                      >
                        {attempt.testTitle}
                      </Text>
                      <Badge
                        colorScheme={getScoreColor(attempt?.percentScore ?? 0)}
                        fontSize='md'
                        px={3}
                        py={1}
                        borderRadius='full'
                      >
                        {(attempt?.percentScore ?? 0).toFixed(1)}%
                      </Badge>
                    </HStack>

                    {/* Score and time details */}
                    <HStack
                      justify='space-between'
                      fontSize='sm'
                      color={colors.textSecondary}
                    >
                      <HStack spacing={2}>
                        <Target size={16} />
                        <Text>Score: {attempt.score}</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Clock size={16} />
                        <Text>Time: {formatTime(attempt.timeSpent ?? 0)}</Text>
                      </HStack>
                    </HStack>

                    {/* Progress bar section */}
                    <Box>
                      <HStack justify='space-between' mb={2}>
                        <Text
                          fontSize='sm'
                          fontWeight='medium'
                          {...textStyles.body}
                        >
                          Performance
                        </Text>
                        <HStack spacing={2}>
                          {passStatus.icon}
                          <Text
                            fontSize='sm'
                            color={passStatus.color}
                            fontWeight='medium'
                          >
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
                        size='md'
                        borderRadius='full'
                        height='10px'
                      />
                    </Box>

                    {/* Completion date */}
                    <HStack
                      justify='space-between'
                      fontSize='sm'
                      color={colors.textMuted}
                      pt={2}
                    >
                      <Text fontWeight='medium'>Completed:</Text>
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

export default StudentResults;
