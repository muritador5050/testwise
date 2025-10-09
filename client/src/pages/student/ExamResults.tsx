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
      <Flex minH='100vh' bg='gray.50' align='center' justify='center' p={4}>
        <Card maxW='sm' w='full'>
          <CardBody textAlign='center'>
            <Text>No result data found. Please complete an exam first.</Text>
            <Button
              mt={4}
              colorScheme='blue'
              w='full'
              onClick={() => navigate('/student')}
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
    <Flex minH='100vh' align='center' justify='center' p={4}>
      <Box maxW='800px' w='full'>
        <Card>
          <CardBody p={{ base: 4, md: 8 }}>
            <VStack spacing={8} align='stretch'>
              {/* Header */}
              <VStack spacing={3}>
                <Badge
                  colorScheme={isPassed ? 'green' : 'red'}
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
                >
                  {test.title}
                </Text>
                <Text fontSize='md' color='gray.600' textAlign='center'>
                  Attempt #{attempt.attemptNumber}
                </Text>
              </VStack>

              <Divider />

              {/* Score Circle */}
              <Flex justify='center' py={4}>
                <CircularProgress
                  value={percentScore}
                  size={{ base: '150px', md: '200px' }}
                  thickness='12px'
                  color={isPassed ? 'green.400' : 'red.400'}
                >
                  <CircularProgressLabel>
                    <VStack spacing={0}>
                      <Text
                        fontSize={{ base: '2xl', md: '4xl' }}
                        fontWeight='bold'
                      >
                        {percentScore.toFixed(1)}%
                      </Text>
                      <Text
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight='bold'
                        color='gray.600'
                      >
                        {getGrade(percentScore)}
                      </Text>
                    </VStack>
                  </CircularProgressLabel>
                </CircularProgress>
              </Flex>

              <Divider />

              {/* Statistics Grid */}
              <Grid
                templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
                gap={4}
              >
                <GridItem>
                  <Card borderWidth='1px' borderColor='blue.200'>
                    <CardBody p={4}>
                      <HStack spacing={3}>
                        <Box
                          p={2}
                          bg='blue.500'
                          borderRadius='lg'
                          color='white'
                        >
                          <CheckCircleIcon boxSize={5} />
                        </Box>
                        <VStack align='start' spacing={0}>
                          <Text fontSize='sm' color='gray.600'>
                            Correct
                          </Text>
                          <Text fontSize='2xl' fontWeight='bold'>
                            {correctAnswers}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card borderWidth='1px' borderColor='red.200'>
                    <CardBody p={4}>
                      <HStack spacing={3}>
                        <Box p={2} bg='red.500' borderRadius='lg' color='white'>
                          <Text fontSize='xl'>✗</Text>
                        </Box>
                        <VStack align='start' spacing={0}>
                          <Text fontSize='sm' color='gray.600'>
                            Incorrect
                          </Text>
                          <Text fontSize='2xl' fontWeight='bold'>
                            {incorrectAnswers}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card borderWidth='1px' borderColor='purple.200'>
                    <CardBody p={4}>
                      <HStack spacing={3}>
                        <Box
                          p={2}
                          bg='purple.500'
                          borderRadius='lg'
                          color='white'
                        >
                          <StarIcon boxSize={5} />
                        </Box>
                        <VStack align='start' spacing={0}>
                          <Text fontSize='sm' color='gray.600'>
                            Total Questions
                          </Text>
                          <Text fontSize='2xl' fontWeight='bold'>
                            {totalQuestions}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card borderWidth='1px' borderColor='orange.200'>
                    <CardBody p={4}>
                      <HStack spacing={3}>
                        <Box
                          p={2}
                          bg='orange.500'
                          borderRadius='lg'
                          color='white'
                        >
                          <TimeIcon boxSize={5} />
                        </Box>
                        <VStack align='start' spacing={0}>
                          <Text fontSize='sm' color='gray.600'>
                            Time Spent
                          </Text>
                          <Text fontSize='lg' fontWeight='bold'>
                            {formatTime(timeSpent)}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>

              <Divider />

              {/* Additional Info */}
              <VStack spacing={2} align='stretch'>
                <HStack justify='space-between'>
                  <Text fontSize='sm' color='gray.600'>
                    Score:
                  </Text>
                  <Text fontSize='sm' fontWeight='semibold'>
                    {attempt.score} / {attempt.maxScore} points
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm' color='gray.600'>
                    Passing Score:
                  </Text>
                  <Text fontSize='sm' fontWeight='semibold'>
                    {passingScore}%
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm' color='gray.600'>
                    Submitted:
                  </Text>
                  <Text fontSize='sm' fontWeight='semibold'>
                    {new Date(completedAt).toLocaleString()}
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm' color='gray.600'>
                    Duration:
                  </Text>
                  <Text fontSize='sm' fontWeight='semibold'>
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
                  colorScheme='blue'
                  size='lg'
                  w='full'
                  onClick={() => navigate('/student')}
                >
                  Dashboard
                </Button>
                <Button
                  variant='outline'
                  colorScheme='gray'
                  size='lg'
                  w='full'
                  onClick={() => logout.mutate()}
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
