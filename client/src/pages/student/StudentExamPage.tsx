import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Avatar,
  Progress,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Textarea,
  Heading,
  useToast,
  Alert,
  AlertIcon,
  SimpleGrid,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

// Mock data - replace with your actual data
const mockExam = {
  id: 1,
  title: 'Mathematics Final Examination',
  duration: 60, // in minutes
  totalQuestions: 20,
  instructions: 'Answer all questions. Each question carries equal marks.',
  questions: [
    {
      id: 1,
      text: 'What is the value of π (pi) approximately?',
      type: 'MULTIPLE_CHOICE',
      options: [
        { id: 1, text: '3.14' },
        { id: 2, text: '2.71' },
        { id: 3, text: '1.62' },
        { id: 4, text: '3.16' },
      ],
    },
    {
      id: 2,
      text: 'Which of the following are prime numbers?',
      type: 'MULTIPLE_ANSWER',
      options: [
        { id: 1, text: '2' },
        { id: 2, text: '4' },
        { id: 3, text: '7' },
        { id: 4, text: '9' },
      ],
    },
    {
      id: 3,
      text: 'Explain the Pythagorean theorem in your own words.',
      type: 'ESSAY',
    },
    // Add more questions as needed
  ],
};

const StudentExamPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(mockExam.duration * 60); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const student = {
    name: 'John Doe',
    avatar: 'https://bit.ly/dan-abramov',
    id: 'STU001',
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  const handleNext = () => {
    if (currentQuestion < mockExam.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleQuestionNavigation = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const handleAutoSubmit = async () => {
    setIsSubmitting(true);
    toast({
      title: 'Time Up!',
      description: 'Your exam has been automatically submitted.',
      status: 'warning',
      duration: 5000,
    });
    // Add your submission logic here
    await submitExam();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < mockExam.questions.length) {
      toast({
        title: 'Unanswered Questions',
        description: `You have ${
          mockExam.questions.length - answeredCount
        } unanswered questions. Are you sure you want to submit?`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }

    // Add your submission logic here
    await submitExam();
  };

  const submitExam = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: 'Exam Submitted!',
        description: 'Your answers have been submitted successfully.',
        status: 'success',
        duration: 5000,
      });

      // Redirect to results page or dashboard
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description:
          'There was an error submitting your exam. Please try again.',
        status: 'error',
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const progressPercentage = (timeLeft / (mockExam.duration * 60)) * 100;

  const getQuestionStatus = (questionIndex) => {
    const questionId = mockExam.questions[questionIndex].id;
    return answers[questionId] ? 'answered' : 'unanswered';
  };

  const answeredCount = Object.keys(answers).length;

  const renderQuestion = (question) => {
    const currentAnswer = answers[question.id];

    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <RadioGroup
            value={currentAnswer}
            onChange={(value) => handleAnswerChange(question.id, value)}
          >
            <VStack align='start' spacing={3}>
              {question.options.map((option) => (
                <Radio key={option.id} value={option.id.toString()} size='lg'>
                  <Text fontSize='lg'>{option.text}</Text>
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
        );

      case 'MULTIPLE_ANSWER':
        return (
          <CheckboxGroup
            value={currentAnswer || []}
            onChange={(value) => handleAnswerChange(question.id, value)}
          >
            <VStack align='start' spacing={3}>
              {question.options.map((option) => (
                <Checkbox
                  key={option.id}
                  value={option.id.toString()}
                  size='lg'
                >
                  <Text fontSize='lg'>{option.text}</Text>
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        );

      case 'ESSAY':
        return (
          <Textarea
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder='Type your answer here...'
            size='lg'
            minH='200px'
            resize='vertical'
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box minH='100vh' bg='gray.50' p={4}>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={6}
        maxW='1920px'
        mx='auto'
      >
        {/* Left Section - Student Info & Timer */}
        <Box w={{ base: '100%', lg: '300px' }} flexShrink={0}>
          <Card shadow='lg' h='fit-content'>
            <CardBody>
              <VStack spacing={4} align='stretch'>
                {/* Student Info */}
                <HStack spacing={3}>
                  <Avatar size='lg' name={student.name} src={student.avatar} />
                  <VStack align='start' spacing={1}>
                    <Text fontWeight='bold' fontSize='lg'>
                      {student.name}
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      {student.id}
                    </Text>
                  </VStack>
                </HStack>

                {/* Exam Details */}
                <VStack align='start' spacing={2}>
                  <Heading size='md'>{mockExam.title}</Heading>
                  <Text fontSize='sm' color='gray.600'>
                    Total Questions: {mockExam.totalQuestions}
                  </Text>
                  <Text fontSize='sm' color='gray.600'>
                    Duration: {mockExam.duration} minutes
                  </Text>
                  <Alert status='info' size='sm' borderRadius='md'>
                    <AlertIcon />
                    <Text fontSize='xs'>{mockExam.instructions}</Text>
                  </Alert>
                </VStack>

                {/* Timer */}
                <VStack spacing={3} align='center'>
                  <Box position='relative' w='120px' h='120px'>
                    <Progress
                      value={progressPercentage}
                      colorScheme={timeLeft < 300 ? 'red' : 'green'}
                      size='120px'
                      thickness='8px'
                      trackColor='gray.200'
                      borderRadius='full'
                      transform='rotate(-90deg)'
                    />
                    <Box
                      position='absolute'
                      top='50%'
                      left='50%'
                      transform='translate(-50%, -50%)'
                      textAlign='center'
                    >
                      <Text fontSize='lg' fontWeight='bold'>
                        {formatTime(timeLeft)}
                      </Text>
                      <Text fontSize='xs' color='gray.600'>
                        Remaining
                      </Text>
                    </Box>
                  </Box>

                  {timeLeft < 300 && (
                    <Alert status='warning' size='sm' borderRadius='md'>
                      <AlertIcon />
                      <Text fontSize='xs'>Less than 5 minutes remaining!</Text>
                    </Alert>
                  )}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Box>

        {/* Middle Section - Question & Navigation */}
        <Box flex={1}>
          <Card shadow='lg' h='fit-content'>
            <CardBody>
              <VStack spacing={6} align='stretch'>
                {/* Question Header */}
                <HStack justify='space-between' align='start'>
                  <Badge colorScheme='blue' fontSize='md' px={3} py={1}>
                    Question {currentQuestion + 1} of{' '}
                    {mockExam.questions.length}
                  </Badge>
                  <Badge
                    colorScheme={
                      getQuestionStatus(currentQuestion) === 'answered'
                        ? 'green'
                        : 'orange'
                    }
                    fontSize='md'
                    px={3}
                    py={1}
                  >
                    {getQuestionStatus(currentQuestion) === 'answered'
                      ? 'Answered'
                      : 'Unanswered'}
                  </Badge>
                </HStack>

                {/* Question Text */}
                <Text fontSize='xl' fontWeight='semibold' lineHeight='1.6'>
                  {mockExam.questions[currentQuestion].text}
                </Text>

                {/* Answer Options */}
                <Box minH='200px'>
                  {renderQuestion(mockExam.questions[currentQuestion])}
                </Box>

                {/* Navigation Buttons */}
                <HStack justify='space-between' pt={4}>
                  <Button
                    leftIcon={<ChevronLeftIcon />}
                    onClick={handlePrevious}
                    isDisabled={currentQuestion === 0}
                    variant='outline'
                    size='lg'
                  >
                    Previous
                  </Button>

                  <Button
                    rightIcon={<ChevronRightIcon />}
                    onClick={handleNext}
                    isDisabled={
                      currentQuestion === mockExam.questions.length - 1
                    }
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

        {/* Right Section - Question Navigator & Submit */}
        <Box w={{ base: '100%', lg: '280px' }} flexShrink={0}>
          <Card shadow='lg' h='fit-content'>
            <CardBody>
              <VStack spacing={4} align='stretch'>
                <Heading size='md' textAlign='center'>
                  Question Navigator
                </Heading>

                {/* Progress Summary */}
                <HStack
                  justify='space-between'
                  bg='blue.50'
                  p={3}
                  borderRadius='md'
                >
                  <VStack spacing={0}>
                    <Text fontSize='sm' color='gray.600'>
                      Answered
                    </Text>
                    <Text fontSize='lg' fontWeight='bold' color='green.600'>
                      {answeredCount}
                    </Text>
                  </VStack>
                  <VStack spacing={0}>
                    <Text fontSize='sm' color='gray.600'>
                      Remaining
                    </Text>
                    <Text fontSize='lg' fontWeight='bold' color='orange.600'>
                      {mockExam.questions.length - answeredCount}
                    </Text>
                  </VStack>
                </HStack>

                {/* Question Grid */}
                <SimpleGrid columns={5} spacing={2}>
                  {mockExam.questions.map((_, index) => (
                    <Button
                      key={index}
                      size='sm'
                      colorScheme={
                        currentQuestion === index
                          ? 'blue'
                          : getQuestionStatus(index) === 'answered'
                          ? 'green'
                          : 'gray'
                      }
                      variant={
                        currentQuestion === index
                          ? 'solid'
                          : getQuestionStatus(index) === 'answered'
                          ? 'solid'
                          : 'outline'
                      }
                      onClick={() => handleQuestionNavigation(index)}
                      minW='40px'
                      h='40px'
                    >
                      {index + 1}
                    </Button>
                  ))}
                </SimpleGrid>

                {/* Legend */}
                <VStack spacing={1} align='start' fontSize='sm'>
                  <HStack>
                    <Box w='3' h='3' bg='blue.500' borderRadius='sm' />
                    <Text color='gray.600'>Current</Text>
                  </HStack>
                  <HStack>
                    <Box w='3' h='3' bg='green.500' borderRadius='sm' />
                    <Text color='gray.600'>Answered</Text>
                  </HStack>
                  <HStack>
                    <Box
                      w='3'
                      h='3'
                      border='2px'
                      borderColor='gray.400'
                      borderRadius='sm'
                    />
                    <Text color='gray.600'>Unanswered</Text>
                  </HStack>
                </VStack>

                {/* Submit Button */}
                <Button
                  colorScheme='red'
                  size='lg'
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  loadingText='Submitting...'
                >
                  Submit Exam
                </Button>

                <Alert status='info' size='sm' borderRadius='md'>
                  <AlertIcon />
                  <Text fontSize='xs'>
                    Time remaining: {formatTime(timeLeft)}
                  </Text>
                </Alert>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
};

export default StudentExamPage;
