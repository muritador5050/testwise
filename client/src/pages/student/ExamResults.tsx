import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Card,
  CardBody,
  VStack,
  HStack,
  CircularProgress,
  CircularProgressLabel,
  Badge,
  Divider,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { CheckCircleIcon, TimeIcon, StarIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogoutUser } from '../../api/services/authService';
import { formatTime } from './hooks/useExamHelper';
import { colors } from '../../utils/colors';

interface Test {
  title: string;
  duration: number;
}

interface Attempt {
  id: number;
  score: number;
  maxScore: number;
  percentScore: number;
  status: string;
  startedAt: string;
  completedAt: string;
  timeSpent: number;
  attemptNumber: number;
  test: Test;
}

interface Summary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
}

interface ResultData {
  attempt: Attempt;
  summary: Summary;
}

const ExamResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data: ResultData = location.state?.data;

  const logout = useLogoutUser();

  if (!data) {
    return (
      <Flex
        minH='100vh'
        bg={colors.pageBg}
        align='center'
        justify='center'
        p={4}
      >
        <Card
          maxW='sm'
          w='full'
          bg={colors.cardBg}
          borderColor={colors.border}
          borderWidth='1px'
        >
          <CardBody textAlign='center'>
            <Text color={colors.textPrimary}>
              No result data found. Please complete an exam first.
            </Text>
            <Button
              mt={4}
              bg={colors.primary}
              color='white'
              w='full'
              onClick={() => navigate('/student')}
              _hover={{ bg: colors.primaryHover }}
            >
              Go to Dashboard
            </Button>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  const { attempt, summary } = data;
  const { percentScore, timeSpent, completedAt, test } = attempt;
  const { totalQuestions, correctAnswers, incorrectAnswers } = summary;

  const isPassed = percentScore >= 60;
  const passingScore = 70;

  const getGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    if (score >= 50) return 'E';
    return 'F';
  };

  return (
    <Flex minH='100vh' bg={colors.pageBg} align='center' justify='center' p={4}>
      <Box maxW='800px' w='full'>
        <Card bg={colors.cardBg} borderColor={colors.border} borderWidth='1px'>
          <CardBody p={{ base: 4, md: 8 }}>
            <VStack spacing={8} align='stretch'>
              {/* Header */}
              <VStack spacing={3}>
                <Badge
                  bg={isPassed ? colors.success : colors.error}
                  color='white'
                  fontSize='lg'
                  px={4}
                  py={2}
                  borderRadius='full'
                  textAlign='center'
                >
                  {isPassed ? '✓ PASSED' : '✗ FAILED'}
                </Badge>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  fontWeight='bold'
                  textAlign='center'
                  color={colors.textPrimary}
                >
                  {test.title}
                </Text>
                <Text
                  fontSize='md'
                  color={colors.textSecondary}
                  textAlign='center'
                >
                  Attempt #{attempt.attemptNumber}
                </Text>
              </VStack>

              <Divider borderColor={colors.border} />

              {/* Score Circle */}
              <Flex justify='center' py={4}>
                <CircularProgress
                  value={percentScore}
                  size={{ base: '150px', md: '200px' }}
                  thickness='12px'
                  color={isPassed ? colors.success : colors.error}
                  trackColor={colors.border}
                >
                  <CircularProgressLabel>
                    <VStack spacing={0}>
                      <Text
                        fontSize={{ base: '2xl', md: '4xl' }}
                        fontWeight='bold'
                        color={colors.textPrimary}
                      >
                        {percentScore.toFixed(1)}%
                      </Text>
                      <Text
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight='bold'
                        color={colors.textSecondary}
                      >
                        {getGrade(percentScore)}
                      </Text>
                    </VStack>
                  </CircularProgressLabel>
                </CircularProgress>
              </Flex>

              <Divider borderColor={colors.border} />

              {/* Statistics Grid */}
              <Grid
                templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
                gap={4}
              >
                <GridItem>
                  <Card
                    bg={colors.cardBg}
                    borderWidth='2px'
                    borderColor={colors.primary}
                  >
                    <CardBody p={4}>
                      <HStack spacing={3}>
                        <Box
                          p={2}
                          bg={colors.primary}
                          borderRadius='lg'
                          color='white'
                        >
                          <CheckCircleIcon boxSize={5} />
                        </Box>
                        <VStack align='start' spacing={0}>
                          <Text fontSize='sm' color={colors.textSecondary}>
                            Correct
                          </Text>
                          <Text
                            fontSize='2xl'
                            fontWeight='bold'
                            color={colors.textPrimary}
                          >
                            {correctAnswers}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card
                    bg={colors.cardBg}
                    borderWidth='2px'
                    borderColor={colors.error}
                  >
                    <CardBody p={4}>
                      <HStack spacing={3}>
                        <Box
                          p={2}
                          bg={colors.error}
                          borderRadius='lg'
                          color='white'
                        >
                          <Text fontSize='xl'>✗</Text>
                        </Box>
                        <VStack align='start' spacing={0}>
                          <Text fontSize='sm' color={colors.textSecondary}>
                            Incorrect
                          </Text>
                          <Text
                            fontSize='2xl'
                            fontWeight='bold'
                            color={colors.textPrimary}
                          >
                            {incorrectAnswers}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card
                    bg={colors.cardBg}
                    borderWidth='2px'
                    borderColor='#a855f7'
                  >
                    <CardBody p={4}>
                      <HStack spacing={3}>
                        <Box p={2} bg='#a855f7' borderRadius='lg' color='white'>
                          <StarIcon boxSize={5} />
                        </Box>
                        <VStack align='start' spacing={0}>
                          <Text fontSize='sm' color={colors.textSecondary}>
                            Total Questions
                          </Text>
                          <Text
                            fontSize='2xl'
                            fontWeight='bold'
                            color={colors.textPrimary}
                          >
                            {totalQuestions}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card
                    bg={colors.cardBg}
                    borderWidth='2px'
                    borderColor={colors.warning}
                  >
                    <CardBody p={4}>
                      <HStack spacing={3}>
                        <Box
                          p={2}
                          bg={colors.warning}
                          borderRadius='lg'
                          color='white'
                        >
                          <TimeIcon boxSize={5} />
                        </Box>
                        <VStack align='start' spacing={0}>
                          <Text fontSize='sm' color={colors.textSecondary}>
                            Time Spent
                          </Text>
                          <Text
                            fontSize='lg'
                            fontWeight='bold'
                            color={colors.textPrimary}
                          >
                            {formatTime(timeSpent)}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>

              <Divider borderColor={colors.border} />

              {/* Additional Info */}
              <VStack spacing={2} align='stretch'>
                <HStack justify='space-between'>
                  <Text fontSize='sm' color={colors.textSecondary}>
                    Score:
                  </Text>
                  <Text
                    fontSize='sm'
                    fontWeight='semibold'
                    color={colors.textPrimary}
                  >
                    {attempt.score} / {attempt.maxScore} points
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm' color={colors.textSecondary}>
                    Passing Score:
                  </Text>
                  <Text
                    fontSize='sm'
                    fontWeight='semibold'
                    color={colors.textPrimary}
                  >
                    {passingScore}%
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm' color={colors.textSecondary}>
                    Submitted:
                  </Text>
                  <Text
                    fontSize='sm'
                    fontWeight='semibold'
                    color={colors.textPrimary}
                  >
                    {new Date(completedAt).toLocaleString()}
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm' color={colors.textSecondary}>
                    Duration:
                  </Text>
                  <Text
                    fontSize='sm'
                    fontWeight='semibold'
                    color={colors.textPrimary}
                  >
                    {test.duration} minutes
                  </Text>
                </HStack>
              </VStack>

              {/* Action Buttons */}
              <HStack
                spacing={4}
                pt={4}
                flexDir={{ base: 'column', sm: 'row' }}
              >
                <Button
                  bg={colors.primary}
                  color='white'
                  size='lg'
                  w='full'
                  onClick={() => navigate('/student')}
                  _hover={{ bg: colors.primaryHover }}
                >
                  Dashboard
                </Button>
                <Button
                  variant='outline'
                  borderColor={colors.border}
                  color={colors.textPrimary}
                  size='lg'
                  w='full'
                  onClick={() => logout.mutate()}
                  _hover={{ bg: colors.pageBg }}
                >
                  Logout
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </Flex>
  );
};

export default ExamResult;
