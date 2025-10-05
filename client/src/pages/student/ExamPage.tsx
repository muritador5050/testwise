import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Progress,
  Card,
  CardBody,
  VStack,
  HStack,
  Grid,
  Badge,
  Divider,
  CircularProgress,
  CircularProgressLabel,
  useToast,
  Checkbox,
  CheckboxGroup,
  Textarea,
} from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import type { Test, Question, QuestionType } from '../../types/api';
import {
  useCompleteAttempt,
  useGetAttemptById,
  useSubmitAnswer,
} from '../../api/services/attemptService';
import { useWebSocket } from '../../hooks/useWebsocket';

type AnswerValue = string | string[];

interface Answers {
  [questionId: number]: AnswerValue;
}

const ExamPage: React.FC = () => {
  const toast = useToast();

  const { attemptId } = useParams();

  //Hooks
  const submitAnswer = useSubmitAnswer();
  const completeAttempt = useCompleteAttempt();
  const { data: attemptData, isLoading } = useGetAttemptById(Number(attemptId));

  // Websocket hook
  const { isConnected, on, off } = useWebSocket(Number(attemptId));

  //Test info
  const testData = attemptData?.test;
  const questions = React.useMemo(() => testData?.questions || [], [testData]);

  //User info
  const user_info = attemptData?.user;
  const studentInfo = {
    name: user_info?.name || 'Student',
    avatar: user_info?.avatar || '',
  };

  const examDetails: Test = {
    id: testData?.id || 0,
    title: testData?.title || '',
    description: testData?.description || null,
    duration: testData?.duration || 60,
    maxAttempts: testData?.maxAttempts || 1,
    isPublished: testData?.isPublished || false,
    availableFrom: testData?.availableFrom || null,
    availableUntil: testData?.availableUntil || null,
    createdAt: testData?.createdAt || '',
    updatedAt: testData?.updatedAt || '',
    _count: {
      questions: testData?._count?.questions ?? questions.length,
      attempts: testData?._count?.attempts || 0,
    },
  };

  //States
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected'>(
    'disconnected'
  );
  const timerRef = useRef<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(
    examDetails.duration * 60
  );

  //Duration
  useEffect(() => {
    if (testData?.duration) {
      setTimeRemaining(testData.duration * 60);
    }
  }, [testData]);

  // Listen for WebSocket events
  useEffect(() => {
    if (!isConnected) return;

    setWsStatus('connected');

    const handleAnswerSubmitted = (data: {
      questionId: number;
      isCorrect: boolean;
      pointsEarned: number;
    }) => {
      console.log('Answer submitted:', data);
      toast({
        title: 'Answer Saved',
        status: 'success',
        duration: 2000,
        position: 'bottom-right',
      });
    };

    const handleAttemptCompleted = (data: {
      score: number;
      percentScore: number;
      timeSpent: number;
    }) => {
      toast({
        title: 'Exam Completed',
        description: `Your score: ${data.percentScore.toFixed(1)}%`,
        status: 'success',
        duration: 5000,
        position: 'top',
      });
      // Navigate to results page
    };

    on('answer_submitted', handleAnswerSubmitted);
    on('attempt_completed', handleAttemptCompleted);

    return () => {
      off('answer_submitted', handleAnswerSubmitted);
      off('attempt_completed', handleAttemptCompleted);
    };
  }, [isConnected, on, off, toast]);

  //HandleSubmit
  const handleSubmit = useCallback((): void => {
    if (!testData || questions.length === 0) {
      console.error('Cannot submit: No test data available');
      return;
    }

    completeAttempt.mutate(Number(attemptId), {
      onSuccess: (data) => {
        toast({
          title: 'Exam Submitted Successfully',
          description: `Score: ${data.percentScore}%`,
          status: 'success',
          position: 'top-right',
          duration: 5000,
        });
        // Navigate to results page
      },
      onError: (error) => {
        toast({
          title: 'Submission Failed',
          description: error.message,
          status: 'error',
          position: 'top-right',
        });
      },
    });
  }, [testData, questions, attemptId, completeAttempt, toast]);

  //Timer
  useEffect(() => {
    if (!testData) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testData, handleSubmit]);

  //Time formatter
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimePercentage = (): number => {
    return (timeRemaining / (examDetails.duration * 60)) * 100;
  };

  const handleAnswerChange = useCallback(
    (questionId: number, value: AnswerValue): void => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));

      // Auto-save answer
      submitAnswer.mutate({
        attemptId: Number(attemptId),
        questionId,
        textAnswer: typeof value === 'string' ? value : undefined,
        optionId: typeof value === 'string' ? parseInt(value) : undefined,
      });
    },
    [attemptId, submitAnswer]
  );

  const isQuestionAnswered = (questionId: number): boolean => {
    const answer = answers[questionId];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== undefined && answer !== '';
  };

  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter((key) => {
      const answer = answers[parseInt(key)];
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== undefined && answer !== '';
    }).length;
  }, [answers]);

  const remainingCount = useMemo(() => {
    return questions.length - answeredCount;
  }, [questions.length, answeredCount]);

  const handleNext = useCallback((): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }, [currentQuestion, questions.length]);

  const handlePrevious = useCallback((): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion]);

  const handleQuestionJump = useCallback((index: number): void => {
    setCurrentQuestion(index);
  }, []);

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers[question.id];

    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        return (
          <RadioGroup
            value={currentAnswer as string}
            onChange={(value) => handleAnswerChange(question.id, value)}
          >
            <Stack spacing={4}>
              {question.options?.map((option) => (
                <Box
                  key={option.id}
                  p={4}
                  borderWidth='2px'
                  borderRadius='lg'
                  borderColor={
                    currentAnswer === option.id.toString()
                      ? 'blue.400'
                      : 'gray.200'
                  }
                  bg={
                    currentAnswer === option.id.toString() ? 'blue.50' : 'white'
                  }
                  cursor='pointer'
                  transition='all 0.2s'
                  _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
                >
                  <Radio
                    value={option.id.toString()}
                    size='lg'
                    colorScheme='blue'
                  >
                    <Text ml={2} fontSize='md'>
                      {option.text}
                    </Text>
                  </Radio>
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        );

      case 'MULTIPLE_ANSWER':
        return (
          <CheckboxGroup
            value={(currentAnswer as string[]) || []}
            onChange={(value) =>
              handleAnswerChange(question.id, value as string[])
            }
          >
            <Stack spacing={4}>
              {question.options?.map((option) => (
                <Box
                  key={option.id}
                  p={4}
                  borderWidth='2px'
                  borderRadius='lg'
                  borderColor={
                    (currentAnswer as string[])?.includes(option.id.toString())
                      ? 'blue.400'
                      : 'gray.200'
                  }
                  bg={
                    (currentAnswer as string[])?.includes(option.id.toString())
                      ? 'blue.50'
                      : 'white'
                  }
                  cursor='pointer'
                  transition='all 0.2s'
                  _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
                >
                  <Checkbox
                    value={option.id.toString()}
                    size='lg'
                    colorScheme='blue'
                  >
                    <Text ml={2} fontSize='md'>
                      {option.text}
                    </Text>
                  </Checkbox>
                </Box>
              ))}
            </Stack>
          </CheckboxGroup>
        );

      case 'TRUE_FALSE':
        return (
          <RadioGroup
            value={currentAnswer as string}
            onChange={(value) => handleAnswerChange(question.id, value)}
          >
            <Stack spacing={4}>
              {question.options?.map((option) => (
                <Box
                  key={option.id}
                  p={4}
                  borderWidth='2px'
                  borderRadius='lg'
                  borderColor={
                    currentAnswer === option.id.toString()
                      ? 'blue.400'
                      : 'gray.200'
                  }
                  bg={
                    currentAnswer === option.id.toString() ? 'blue.50' : 'white'
                  }
                  cursor='pointer'
                  transition='all 0.2s'
                  _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
                >
                  <Radio
                    value={option.id.toString()}
                    size='lg'
                    colorScheme='blue'
                  >
                    <Text ml={2} fontSize='md' fontWeight='semibold'>
                      {option.text}
                    </Text>
                  </Radio>
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        );

      case 'SHORT_ANSWER':
        return (
          <Textarea
            value={(currentAnswer as string) || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder='Type your short answer here...'
            size='lg'
            minH='120px'
            resize='vertical'
            borderWidth='2px'
            borderColor='gray.200'
            _focus={{
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
            }}
          />
        );

      case 'ESSAY':
        return (
          <Box>
            <Textarea
              value={(currentAnswer as string) || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder='Type your detailed answer here...'
              size='lg'
              minH='300px'
              resize='vertical'
              borderWidth='2px'
              borderColor='gray.200'
              _focus={{
                borderColor: 'blue.400',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
              }}
            />
            <Text mt={2} fontSize='sm' color='gray.500' textAlign='right'>
              {(currentAnswer as string)?.length || 0} characters
            </Text>
          </Box>
        );

      default:
        return null;
    }
  };

  const getQuestionTypeBadge = (type: QuestionType) => {
    const badges = {
      MULTIPLE_CHOICE: { color: 'blue', text: 'Multiple Choice' },
      MULTIPLE_ANSWER: { color: 'purple', text: 'Multiple Answer' },
      TRUE_FALSE: { color: 'green', text: 'True/False' },
      SHORT_ANSWER: { color: 'orange', text: 'Short Answer' },
      ESSAY: { color: 'red', text: 'Essay' },
    };
    return badges[type] || { color: 'gray', text: type };
  };

  // Prevent cheating - track if user leaves tab
  useEffect(() => {
    let tabSwitchCount = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount++;
        toast({
          title: 'Warning',
          description: `Tab switch detected (${tabSwitchCount})`,
          status: 'warning',
          position: 'top',
        });

        // Optional: Auto-submit after X switches
        if (tabSwitchCount >= 3) {
          handleSubmit();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [handleSubmit, toast]);

  // Restore answers from localStorage on mount (if connection drops)
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`exam-${attemptId}`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, [attemptId]);

  // Save answers to localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`exam-${attemptId}`, JSON.stringify(answers));
    }
  }, [answers, attemptId]);

  if (isLoading) {
    return (
      <Flex minH='100vh' align='center' justify='center' bg='gray.50'>
        <VStack spacing={4}>
          <CircularProgress isIndeterminate color='blue.400' size='80px' />
          <Text fontSize='lg' color='gray.600'>
            Loading exam...
          </Text>
        </VStack>
      </Flex>
    );
  }

  if (!testData) {
    return (
      <Flex minH='100vh' align='center' justify='center' bg='gray.50'>
        <Card>
          <CardBody>
            <VStack spacing={4} p={8}>
              <Text fontSize='xl' fontWeight='bold' color='red.500'>
                Exam Not Found
              </Text>
              <Text color='gray.600'>
                The exam you're looking for doesn't exist!.
              </Text>
              <Button colorScheme='blue' onClick={() => window.history.back()}>
                Go Back
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  if (questions.length === 0) {
    return (
      <Flex minH='100vh' align='center' justify='center' bg='gray.50'>
        <Card>
          <CardBody>
            <VStack spacing={4} p={8}>
              <Text fontSize='xl' fontWeight='bold' color='red.500'>
                No question yet for this exam please wait or contact admin for
                support.
              </Text>
              <Button colorScheme='blue' onClick={() => window.history.back()}>
                Go Back
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  const currentQ = questions[currentQuestion];
  const typeBadge = getQuestionTypeBadge(currentQ.questionType);

  return (
    <ChakraProvider>
      <Flex
        minH='100vh'
        bg='gray.50'
        p={{ base: 4, md: 6 }}
        direction={{ base: 'column', lg: 'row' }}
        gap={6}
      >
        {/* Left Section - Student Info & Exam Details */}
        <Box w={{ base: '100%', lg: '280px' }} flexShrink={0}>
          <Card>
            <CardBody>
              <VStack spacing={4} align='stretch'>
                <VStack spacing={3}>
                  <Avatar
                    size='xl'
                    name={studentInfo.name}
                    src={studentInfo.avatar || ''}
                    bg='blue.500'
                  />
                  <Text fontWeight='bold' fontSize='lg' textAlign='center'>
                    {studentInfo.name}
                  </Text>
                </VStack>

                <Divider />

                <VStack spacing={2} align='stretch'>
                  <Text fontWeight='semibold' color='gray.600' fontSize='sm'>
                    EXAM DETAILS
                  </Text>
                  <Box>
                    <Text fontSize='sm' color='gray.500'>
                      Title
                    </Text>
                    <Text fontWeight='medium'>{examDetails.title}</Text>
                  </Box>
                  <Box>
                    <Text fontSize='sm' color='gray.500'>
                      Description
                    </Text>
                    <Text fontWeight='medium'>{examDetails.description}</Text>
                  </Box>
                  <Box>
                    <Text fontSize='sm' color='gray.500'>
                      Total Questions
                    </Text>
                    <Text fontWeight='medium'>
                      {examDetails._count?.questions || questions.length}
                    </Text>
                  </Box>
                </VStack>

                <Divider />

                <VStack spacing={3}>
                  <Text fontWeight='semibold' color='gray.600' fontSize='sm'>
                    TIME REMAINING
                  </Text>
                  <CircularProgress
                    value={getTimePercentage()}
                    size='120px'
                    thickness='8px'
                    color={timeRemaining < 300 ? 'red.400' : 'blue.400'}
                  >
                    <CircularProgressLabel fontSize='lg' fontWeight='bold'>
                      {formatTime(timeRemaining)}
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Badge
                    colorScheme={wsStatus === 'connected' ? 'green' : 'red'}
                    fontSize='xs'
                  >
                    {wsStatus === 'connected' ? '● Live' : '● Offline'}
                  </Badge>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Box>

        {/* Middle Section - Questions */}
        <Box flex='1'>
          <Card h='full'>
            <CardBody>
              <VStack spacing={6} align='stretch' h='full'>
                <Flex
                  justify='space-between'
                  align='center'
                  wrap='wrap'
                  gap={3}
                >
                  <HStack spacing={2}>
                    <Badge colorScheme='blue' fontSize='md' px={3} py={1}>
                      Question {currentQuestion + 1} of{' '}
                      {examDetails._count?.questions || questions.length}
                    </Badge>
                    <Badge
                      colorScheme={typeBadge.color}
                      fontSize='sm'
                      px={2}
                      py={1}
                    >
                      {typeBadge.text}
                    </Badge>
                    {currentQ.points && (
                      <Badge colorScheme='gray' fontSize='sm' px={2} py={1}>
                        {currentQ.points} pts
                      </Badge>
                    )}
                  </HStack>
                  <Progress
                    value={
                      ((currentQuestion + 1) /
                        (examDetails._count?.questions || questions.length)) *
                      100
                    }
                    size='sm'
                    colorScheme='blue'
                    w={{ base: '100%', md: '200px' }}
                    borderRadius='full'
                  />
                </Flex>

                <Box flex='1'>
                  <Text fontSize='xl' fontWeight='semibold' mb={6}>
                    {currentQ.text}
                  </Text>

                  {renderQuestion(currentQ)}
                </Box>

                <HStack justify='space-between'>
                  <Button
                    onClick={handlePrevious}
                    isDisabled={currentQuestion === 0}
                    colorScheme='gray'
                    size='lg'
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    isDisabled={currentQuestion === questions.length - 1}
                    colorScheme='blue'
                    size='lg'
                  >
                    Next
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </Box>

        {/* Right Section - Question Navigator */}
        <Box w={{ base: '100%', lg: '300px' }} flexShrink={0}>
          <Card>
            <CardBody>
              <Stack spacing={4} align='stretch'>
                <Text fontWeight='bold' fontSize='lg'>
                  Question Navigator
                </Text>

                <HStack spacing={4}>
                  <HStack>
                    <Box w={4} h={4} bg='green.400' borderRadius='sm' />
                    <Text fontSize='sm'>Answered</Text>
                  </HStack>
                  <HStack>
                    <Box w={4} h={4} bg='gray.200' borderRadius='sm' />
                    <Text fontSize='sm'>Unanswered</Text>
                  </HStack>
                </HStack>

                <Divider />

                <Grid templateColumns='repeat(4, 1fr)' gap={2}>
                  {questions.map((q, index) => (
                    <Button
                      key={q.id}
                      onClick={() => handleQuestionJump(index)}
                      size='lg'
                      variant={currentQuestion === index ? 'solid' : 'outline'}
                      colorScheme={
                        currentQuestion === index
                          ? 'blue'
                          : isQuestionAnswered(q.id)
                          ? 'green'
                          : 'gray'
                      }
                      bg={
                        currentQuestion === index
                          ? 'blue.500'
                          : isQuestionAnswered(q.id)
                          ? 'green.400'
                          : 'white'
                      }
                      color={
                        currentQuestion === index || isQuestionAnswered(q.id)
                          ? 'white'
                          : 'gray.700'
                      }
                      borderColor={
                        isQuestionAnswered(q.id) && currentQuestion !== index
                          ? 'green.400'
                          : 'gray.300'
                      }
                      _hover={{
                        bg:
                          currentQuestion === index
                            ? 'blue.600'
                            : isQuestionAnswered(q.id)
                            ? 'green.500'
                            : 'gray.100',
                      }}
                      h='45px'
                      w='45px'
                      borderRadius='full'
                      fontSize='md'
                      fontWeight='semibold'
                    >
                      {index + 1}
                    </Button>
                  ))}
                </Grid>

                <Divider />

                <VStack spacing={2} align='stretch'>
                  <HStack justify='space-between'>
                    <Text fontSize='sm' color='gray.600'>
                      Answered:
                    </Text>
                    <Badge colorScheme='green' fontSize='md'>
                      {answeredCount}
                    </Badge>
                  </HStack>
                  <HStack justify='space-between'>
                    <Text fontSize='sm' color='gray.600'>
                      Remaining:
                    </Text>
                    <Badge colorScheme='orange' fontSize='md'>
                      {remainingCount}
                    </Badge>
                  </HStack>
                </VStack>

                <Button
                  colorScheme='green'
                  size='lg'
                  onClick={handleSubmit}
                  w='full'
                  mt={4}
                >
                  Submit Exam
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default ExamPage;
