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
  useDisclosure,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
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
import { getTimePercentage, formatTime } from './hooks/useExamHelper';
import { QuestionNavigator } from './components/QuestionNavigator';
import { useExamAnswers } from './hooks/useExamAnswer';
import { useExamTimer } from './hooks/useExamTimer';
import { useTabSwitchDetection } from './hooks/useTabSwicthDetection';
import { Menu } from 'lucide-react';

const ExamPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { attemptId } = useParams();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Drawer controls for mobile
  const {
    isOpen: isSidebarOpen,
    onOpen: onSidebarOpen,
    onClose: onSidebarClose,
  } = useDisclosure();

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
    if (answeredCount < questions.length) {
      onAlertOpen();
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
  }, [
    questions,
    attemptId,
    completeAttempt,
    toast,
    navigate,
    answeredCount,
    onAlertOpen,
  ]);

  const onTimeUp = useCallback(() => {
    completeAttempt
      .mutateAsync(Number(attemptId))
      .then((data) => {
        navigate('/student/exam/results', { state: { data }, replace: true });
      })
      .catch((error) => {
        toast({
          title: 'Submission Failed',
          description: error instanceof Error ? error.message : String(error),
          status: 'error',
          position: 'top-right',
        });
      });
  }, [attemptId, completeAttempt, navigate, toast]);

  // Timer hook
  const timeRemaining = useExamTimer(
    testData?.duration || 60,
    onTimeUp,
    !!testData
  );

  // Tab switch detection
  useTabSwitchDetection(onTimeUp, 3);

  // WebSocket event listeners
  useEffect(() => {
    if (!isConnected) return;

    const handleAnswerSubmitted = () => {};

    const handleAttemptCompleted = () => {};

    on('answer_submitted', handleAnswerSubmitted);
    on('attempt_completed', handleAttemptCompleted);

    return () => {
      off('answer_submitted', handleAnswerSubmitted);
      off('attempt_completed', handleAttemptCompleted);
    };
  }, [isConnected]);

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
  const totalQuestions = testData._count?.questions || questions.length;

  return (
    <Flex
      minH='100vh'
      p={{ base: 2, md: 4, lg: 6 }}
      direction={{ base: 'column', lg: 'row' }}
      gap={{ base: 3, md: 6 }}
      pb={{ base: '140px', lg: 6 }}
    >
      {/* Mobile: Fixed Header with Timer and Menu */}
      <Box
        display={{ base: 'block', lg: 'none' }}
        position='fixed'
        top={0}
        left={0}
        right={0}
        borderBottom='1px'
        borderColor='gray.200'
        zIndex={20}
        px={4}
        py={3}
        shadow='sm'
      >
        <HStack justify='space-between'>
          <IconButton
            aria-label='Exam Info'
            icon={<Menu />}
            variant='ghost'
            size='md'
            onClick={onSidebarOpen}
          />
          <HStack spacing={3}>
            <Badge colorScheme='blue' fontSize='sm' px={2} py={1}>
              {answeredCount}/{totalQuestions}
            </Badge>
            <HStack
              spacing={2}
              bg={timeRemaining < 300 ? 'red.50' : 'blue.50'}
              px={3}
              py={2}
              borderRadius='md'
            >
              <Box
                w={2}
                h={2}
                bg={timeRemaining < 300 ? 'red.400' : 'blue.400'}
                borderRadius='full'
              />
              <Text
                fontWeight='bold'
                fontSize='lg'
                color={timeRemaining < 300 ? 'red.600' : 'blue.600'}
              >
                {formatTime(timeRemaining)}
              </Text>
            </HStack>
          </HStack>
        </HStack>
      </Box>

      {/* Mobile: Add top padding to content */}
      <Box display={{ base: 'block', lg: 'none' }} h='60px' />

      {/* Left Sidebar - Desktop */}
      <Box display={{ base: 'none', lg: 'block' }} w='280px' flexShrink={0}>
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
      </Box>

      {/* Left Sidebar - Mobile Drawer */}
      <Drawer isOpen={isSidebarOpen} placement='left' onClose={onSidebarClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Exam Information</DrawerHeader>
          <DrawerBody p={0}>
            <ExamSidebar
              studentName={userInfo?.name || 'Student'}
              studentAvatar={userInfo?.avatar || ''}
              examTitle={testData.title}
              examDescription={testData.description}
              totalQuestions={totalQuestions}
              timeRemaining={timeRemaining}
              timePercentage={getTimePercentage(
                timeRemaining,
                testData.duration
              )}
              isConnected={isConnected}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Middle Section - Current Question */}
      <Box flex='1' minW={0}>
        <Card h='full'>
          <CardBody p={{ base: 3, md: 6 }}>
            <VStack spacing={{ base: 4, md: 6 }} align='stretch' h='full'>
              {/* Question Header */}
              <Flex
                justify='space-between'
                align='center'
                wrap='wrap'
                gap={2}
                direction={{ base: 'column', sm: 'row' }}
              >
                <HStack spacing={2} flexWrap='wrap'>
                  <Badge
                    colorScheme='blue'
                    fontSize={{ base: 'sm', md: 'md' }}
                    px={{ base: 2, md: 3 }}
                    py={1}
                  >
                    Q {currentQuestion + 1}/{totalQuestions}
                  </Badge>

                  {currentQ.points && (
                    <Badge
                      colorScheme='gray'
                      fontSize={{ base: 'xs', md: 'sm' }}
                      px={2}
                      py={1}
                    >
                      {currentQ.points} pts
                    </Badge>
                  )}
                </HStack>
                <Progress
                  value={((currentQuestion + 1) / totalQuestions) * 100}
                  size='sm'
                  colorScheme='blue'
                  w={{ base: '100%', sm: '200px' }}
                  borderRadius='full'
                />
              </Flex>

              {/* Question Content */}
              <Box flex='1' overflow='auto'>
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  fontWeight='semibold'
                  mb={{ base: 4, md: 6 }}
                >
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

              {/* Navigation Buttons */}
              <HStack justify='space-between' pt={2}>
                <Button
                  onClick={handlePrevious}
                  isDisabled={currentQuestion === 0}
                  colorScheme='gray'
                  size={{ base: 'md', md: 'lg' }}
                  flex={{ base: 1, sm: 'initial' }}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  isDisabled={currentQuestion === questions.length - 1}
                  colorScheme='blue'
                  size={{ base: 'md', md: 'lg' }}
                  flex={{ base: 1, sm: 'initial' }}
                >
                  Next
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Box>

      {/* Right Section - Desktop */}
      <Box display={{ base: 'none', lg: 'block' }} w='300px' flexShrink={0}>
        <QuestionNavigator
          questions={questions}
          currentQuestion={currentQuestion}
          isQuestionAnswered={isQuestionAnswered}
          onQuestionJump={handleQuestionJump}
          onSubmit={handleSubmit}
          answeredCount={answeredCount}
          isSubmitting={completeAttempt.isPending}
        />
      </Box>

      {/* Mobile: Fixed Bottom Question Navigator */}
      <Box
        display={{ base: 'block', lg: 'none' }}
        position='fixed'
        bottom={0}
        left={0}
        right={0}
        borderTop='1px'
        borderColor='gray.200'
        zIndex={20}
        shadow='lg'
      >
        <QuestionNavigator
          questions={questions}
          currentQuestion={currentQuestion}
          isQuestionAnswered={isQuestionAnswered}
          onQuestionJump={handleQuestionJump}
          onSubmit={handleSubmit}
          answeredCount={answeredCount}
          isSubmitting={completeAttempt.isPending}
        />
      </Box>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Unanswered Questions
            </AlertDialogHeader>

            <AlertDialogBody>
              You still have {questions.length - answeredCount} unanswered
              question(s). Are you sure you want to submit?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Return to Test
              </Button>
              <Button
                colorScheme='green'
                ml={3}
                onClick={async () => {
                  onAlertClose();
                  try {
                    const data = await completeAttempt.mutateAsync(
                      Number(attemptId)
                    );
                    navigate('/student/exam/results', {
                      state: { data },
                      replace: true,
                    });
                  } catch (error) {
                    toast({
                      title: 'Submission Failed',
                      description:
                        error instanceof Error ? error.message : String(error),
                      status: 'error',
                      position: 'top-right',
                    });
                  }
                }}
              >
                Proceed to Submit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default ExamPage;
