import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Flex,
  Text,
  Button,
  Progress,
  Card,
  CardBody,
  VStack,
  HStack,
  Badge,
  CircularProgress,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCompleteAttempt,
  useGetAttemptById,
  useSubmitAnswer,
} from '../../api/services/attemptService';
import { useWebSocket } from '../../hooks/useWebsocket';
import { QuestionRenderer } from './components/QuestionRenderer';
import { ExamSidebar } from './components/ExamSidebar';
import { getQuestionTypeBadge, getTimePercentage } from './hooks/useExamHelper';
import { QuestionNavigator } from './components/QuestionNavigator';
import { useExamAnswers } from './hooks/useExamAnswer';
import { useExamTimer } from './hooks/useExamTimer';
import { useTabSwitchDetection } from './hooks/useTabSwicthDetection';

const ExamPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { attemptId } = useParams();

  // API Hooks
  const submitAnswer = useSubmitAnswer();
  const completeAttempt = useCompleteAttempt();
  const { data: attemptData, isLoading } = useGetAttemptById(Number(attemptId));

  // WebSocket hook
  const { isConnected, on, off } = useWebSocket(Number(attemptId));

  // Extract data
  const testData = attemptData?.test;
  const questions = useMemo(() => testData?.questions || [], [testData]);
  const userInfo = attemptData?.user;

  // Custom hooks
  const { answers, setAnswers, isQuestionAnswered, answeredCount } =
    useExamAnswers(Number(attemptId));
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  // Handle exam submission
  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!testData || questions.length === 0) {
      console.error('Cannot submit: No test data available');
      return;
    }

    try {
      const data = await completeAttempt.mutateAsync(Number(attemptId));
      navigate('/student/exam/results', { state: { data }, replace: true });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : String(error),
        status: 'error',
        position: 'top-right',
      });
    }
  }, [testData, questions, attemptId, completeAttempt, toast, navigate]);

  // Timer hook
  const timeRemaining = useExamTimer(
    testData?.duration || 60,
    handleSubmit,
    !!testData
  );

  // Tab switch detection
  useTabSwitchDetection(handleSubmit, 3);

  // WebSocket event listeners
  useEffect(() => {
    if (!isConnected) return;

    const handleAnswerSubmitted = (data: {
      questionId: number;
      isCorrect: boolean;
      pointsEarned: number;
    }) => {
      console.log('Answer submitted:', data);
    };

    const handleAttemptCompleted = (data: {
      score: number;
      percentScore: number;
      timeSpent: number;
    }) => {
      console.log('WebSocket completion:', data);
    };

    on('answer_submitted', handleAnswerSubmitted);
    on('attempt_completed', handleAttemptCompleted);

    return () => {
      off('answer_submitted', handleAnswerSubmitted);
      off('attempt_completed', handleAttemptCompleted);
    };
  }, [isConnected, on, off]);

  // Handle answer change
  const handleAnswerChange = useCallback(
    (questionId: number, value: string | string[]): void => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));

      const question = questions.find((q) => q.id === questionId);
      if (!question) return;

      const isTextQuestion = ['SHORT_ANSWER', 'ESSAY'].includes(
        question.questionType
      );

      submitAnswer.mutate({
        attemptId: Number(attemptId),
        questionId,
        textAnswer: isTextQuestion ? (value as string) : undefined,
        optionId: !isTextQuestion ? parseInt(value as string) : undefined,
      });
    },
    [attemptId, submitAnswer, questions, setAnswers]
  );

  // Navigation handlers
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

  // Loading state
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

  // Error state
  if (!testData || questions.length === 0) {
    return (
      <Flex minH='100vh' align='center' justify='center' bg='gray.50'>
        <Card>
          <CardBody>
            <VStack spacing={4} p={8}>
              <Text fontSize='xl' fontWeight='bold' color='red.500'>
                Exam Not Found
              </Text>
              <Text color='gray.600'>
                The exam you're looking for doesn't exist or has no questions
                yet!
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
  const totalQuestions = testData._count?.questions || questions.length;

  return (
    <Flex
      minH='100vh'
      bg='gray.50'
      p={{ base: 4, md: 6 }}
      direction={{ base: 'column', lg: 'row' }}
      gap={6}
    >
      {/* Left Sidebar - Student Info & Exam Details */}
      <ExamSidebar
        studentName={userInfo?.name || 'Student'}
        studentAvatar={userInfo?.avatar || ''}
        examTitle={testData.title}
        examDescription={testData.description}
        totalQuestions={totalQuestions}
        timeRemaining={timeRemaining}
        timePercentage={getTimePercentage(timeRemaining, testData.duration)}
        isConnected={isConnected}
      />

      {/* Middle Section - Current Question */}
      <Box flex='1'>
        <Card h='full'>
          <CardBody>
            <VStack spacing={6} align='stretch' h='full'>
              <Flex justify='space-between' align='center' wrap='wrap' gap={3}>
                <HStack spacing={2}>
                  <Badge colorScheme='blue' fontSize='md' px={3} py={1}>
                    Question {currentQuestion + 1} of {totalQuestions}
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
                  value={((currentQuestion + 1) / totalQuestions) * 100}
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

                <QuestionRenderer
                  question={currentQ}
                  currentAnswer={answers[currentQ.id]}
                  onAnswerChange={(value) =>
                    handleAnswerChange(currentQ.id, value)
                  }
                />
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
      <QuestionNavigator
        questions={questions}
        currentQuestion={currentQuestion}
        isQuestionAnswered={isQuestionAnswered}
        onQuestionJump={handleQuestionJump}
        onSubmit={handleSubmit}
        answeredCount={answeredCount}
        isSubmitting={completeAttempt.isPending}
      />
    </Flex>
  );
};

export default ExamPage;
