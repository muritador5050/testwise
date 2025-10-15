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
import { colors } from '../../utils/colors';

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
  const {
    data: attemptData,
    isFetching,
    isError,
    isFetched,
  } = useGetAttemptById(Number(attemptId));

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
    Number(attemptId),
    onTimeUp,
    !!testData && attemptData?.status === 'IN_PROGRESS'
  );

  // Tab switch detection
  useTabSwitchDetection(onTimeUp, 13);

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
  if (isFetching) {
    return (
      <Flex minH='100vh' align='center' justify='center' bg={colors.pageBg}>
        <VStack spacing={4}>
          <CircularProgress
            isIndeterminate
            color={colors.primary}
            size='80px'
          />
          <Text fontSize='lg' color={colors.textPrimary}>
            Loading exam...
          </Text>
        </VStack>
      </Flex>
    );
  }

  if (isFetched && (!testData || isError)) {
    return (
      <Flex minH='100vh' align='center' justify='center' bg={colors.pageBg}>
        <Card bg={colors.cardBg} borderColor={colors.border} borderWidth='1px'>
          <CardBody>
            <VStack spacing={4} p={8}>
              <Text fontSize='xl' fontWeight='bold' color={colors.error}>
                Exam Not Found
              </Text>
              <Text color={colors.textSecondary}>
                The exam you're looking for doesn't exist or has no questions
                yet!
              </Text>
              <Button
                bg={colors.primary}
                color='white'
                _hover={{ bg: colors.primaryHover }}
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  const currentQ = questions[currentQuestion];
  const totalQuestions = testData?._count?.questions || questions.length;

  return (
    <Flex
      minH='100vh'
      bg={colors.pageBg}
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
        bg={colors.cardBg}
        borderBottom='1px'
        borderColor={colors.border}
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
            color={colors.textPrimary}
            _hover={{ bg: colors.pageBg }}
          />
          <HStack spacing={3}>
            <Badge
              bg={colors.primary}
              color='white'
              fontSize='sm'
              px={2}
              py={1}
            >
              {answeredCount}/{totalQuestions}
            </Badge>
            <HStack
              spacing={2}
              bg={timeRemaining < 300 ? '#fee2e2' : colors.sectionBg}
              px={3}
              py={2}
              borderRadius='md'
            >
              <Box
                w={2}
                h={2}
                bg={timeRemaining < 300 ? colors.error : colors.primary}
                borderRadius='full'
              />
              <Text
                fontWeight='bold'
                fontSize='lg'
                color={timeRemaining < 300 ? colors.error : colors.primary}
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
          examTitle={testData?.title || ''}
          examDescription={testData?.description || ''}
          totalQuestions={totalQuestions}
          timeRemaining={timeRemaining}
          timePercentage={getTimePercentage(
            timeRemaining,
            testData?.duration ?? 0
          )}
          isConnected={isConnected}
        />
      </Box>

      {/* Left Sidebar - Mobile Drawer */}
      <Drawer isOpen={isSidebarOpen} placement='left' onClose={onSidebarClose}>
        <DrawerOverlay />
        <DrawerContent bg={colors.cardBg}>
          <DrawerCloseButton color={colors.textPrimary} />
          <DrawerHeader
            color={colors.textPrimary}
            borderBottomWidth='1px'
            borderColor={colors.border}
          >
            Exam Information
          </DrawerHeader>
          <DrawerBody p={0}>
            <ExamSidebar
              studentName={userInfo?.name || 'Student'}
              studentAvatar={userInfo?.avatar || ''}
              examTitle={testData?.title || ''}
              examDescription={testData?.description || ''}
              totalQuestions={totalQuestions}
              timeRemaining={timeRemaining}
              timePercentage={getTimePercentage(
                timeRemaining,
                testData?.duration ?? 0
              )}
              isConnected={isConnected}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Middle Section - Current Question */}
      <Box flex='1' minW={0}>
        <Card
          h='full'
          bg={colors.cardBg}
          borderColor={colors.border}
          borderWidth='1px'
        >
          <CardBody p={{ base: 2, md: 6 }}>
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
                    bg={colors.primary}
                    color='white'
                    fontSize={{ base: 'sm', md: 'md' }}
                    px={{ base: 2, md: 3 }}
                    py={1}
                  >
                    Q {currentQuestion + 1}/{totalQuestions}
                  </Badge>

                  {currentQ?.points && (
                    <Badge
                      bg={colors.textMuted}
                      color='white'
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
                  sx={{
                    '& > div': {
                      bg: colors.primary,
                    },
                  }}
                  bg={colors.border}
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
                  color={colors.textPrimary}
                >
                  {currentQ?.text}
                </Text>

                <QuestionRenderer
                  question={currentQ}
                  currentAnswer={answers[currentQ?.id]}
                  onAnswerChange={(value) =>
                    handleAnswerChange(currentQ?.id, value)
                  }
                />
              </Box>

              {/* Navigation Buttons */}
              <HStack justify='space-between'>
                <Button
                  onClick={handlePrevious}
                  isDisabled={currentQuestion === 0}
                  bg={colors.primary}
                  color='white'
                  size={{ base: 'md', md: 'lg' }}
                  flex={{ base: 1, sm: 'initial' }}
                  _hover={{ opacity: 0.8 }}
                  _disabled={{
                    opacity: 0.4,
                    cursor: 'not-allowed',
                  }}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  isDisabled={currentQuestion === questions.length - 1}
                  bg={colors.primary}
                  color='white'
                  size={{ base: 'md', md: 'lg' }}
                  flex={{ base: 1, sm: 'initial' }}
                  _hover={{ bg: colors.primaryHover }}
                  _disabled={{
                    opacity: 0.4,
                    cursor: 'not-allowed',
                  }}
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
        bg={colors.cardBg}
        borderTop='1px'
        borderColor={colors.border}
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

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={colors.cardBg}>
            <AlertDialogHeader
              fontSize='lg'
              fontWeight='bold'
              color={colors.textPrimary}
            >
              Unanswered Questions
            </AlertDialogHeader>

            <AlertDialogBody color={colors.textSecondary}>
              You still have {questions.length - answeredCount} unanswered
              question(s). Are you sure you want to submit?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onAlertClose}
                variant='outline'
                borderColor={colors.border}
                color={colors.textPrimary}
                _hover={{ bg: colors.pageBg }}
              >
                Return to Test
              </Button>
              <Button
                bg={colors.success}
                color='white'
                ml={3}
                _hover={{ opacity: 0.9 }}
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
