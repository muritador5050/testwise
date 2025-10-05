import React, { useState, useEffect } from 'react';
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

// Enhanced Types
type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'MULTIPLE_ANSWER'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'ESSAY';
// type AttemptStatus = 'IN_PROGRESS' | 'COMPLETED' | 'TIMED_OUT';

interface Option {
  id: number;
  text: string;
  isCorrect?: boolean;
  order: number;
}

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: Option[];
  points?: number;
}

interface StudentInfo {
  name: string;
  avatar: string;
}

interface ExamDetails {
  title: string;
  subject: string;
  duration: number;
  totalQuestions: number;
}

// Answer can be string (for single choice/text) or string[] (for multiple choice)
type AnswerValue = string | string[];

interface Answers {
  [questionId: number]: AnswerValue;
}

const ExamPage: React.FC = () => {
  const toast = useToast();

  const studentInfo: StudentInfo = {
    name: 'John Doe',
    avatar: 'https://bit.ly/broken-link',
  };

  const examDetails: ExamDetails = {
    title: 'Mid-Term Examination',
    subject: 'Computer Science',
    duration: 60,
    totalQuestions: 8,
  };

  // Sample questions with different types
  const questions: Question[] = [
    {
      id: 1,
      text: 'What is the correct definition of polymorphism in Object-Oriented Programming?',
      type: 'MULTIPLE_CHOICE',
      points: 5,
      options: [
        {
          id: 1,
          text: 'The ability of different objects to respond to the same message in different ways',
          order: 1,
        },
        {
          id: 2,
          text: 'The process of hiding implementation details',
          order: 2,
        },
        {
          id: 3,
          text: 'The ability to create multiple instances of a class',
          order: 3,
        },
        {
          id: 4,
          text: 'The process of inheriting properties from a parent class',
          order: 4,
        },
      ],
    },
    {
      id: 2,
      text: 'Select all valid JavaScript data types:',
      type: 'MULTIPLE_ANSWER',
      points: 10,
      options: [
        { id: 5, text: 'String', order: 1 },
        { id: 6, text: 'Number', order: 2 },
        { id: 7, text: 'Character', order: 3 },
        { id: 8, text: 'Boolean', order: 4 },
        { id: 9, text: 'Symbol', order: 5 },
        { id: 10, text: 'Integer', order: 6 },
      ],
    },
    {
      id: 3,
      text: 'Arrays in JavaScript are zero-indexed.',
      type: 'TRUE_FALSE',
      points: 3,
      options: [
        { id: 11, text: 'True', order: 1 },
        { id: 12, text: 'False', order: 2 },
      ],
    },
    {
      id: 4,
      text: 'What is the time complexity of binary search?',
      type: 'SHORT_ANSWER',
      points: 5,
    },
    {
      id: 5,
      text: 'Explain the concept of closure in JavaScript with an example.',
      type: 'ESSAY',
      points: 15,
    },
    {
      id: 6,
      text: 'Which HTTP method is used to update an existing resource?',
      type: 'MULTIPLE_CHOICE',
      points: 5,
      options: [
        { id: 13, text: 'GET', order: 1 },
        { id: 14, text: 'POST', order: 2 },
        { id: 15, text: 'PUT', order: 3 },
        { id: 16, text: 'DELETE', order: 4 },
      ],
    },
    {
      id: 7,
      text: 'Select all features that are part of ES6:',
      type: 'MULTIPLE_ANSWER',
      points: 10,
      options: [
        { id: 17, text: 'Arrow functions', order: 1 },
        { id: 18, text: 'Classes', order: 2 },
        { id: 19, text: 'Promises', order: 3 },
        { id: 20, text: 'Async/Await', order: 4 },
      ],
    },
    {
      id: 8,
      text: 'Discuss the differences between SQL and NoSQL databases, including use cases for each.',
      type: 'ESSAY',
      points: 20,
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(
    examDetails.duration * 60
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const handleAnswerChange = (questionId: number, value: AnswerValue): void => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const isQuestionAnswered = (questionId: number): boolean => {
    const answer = answers[questionId];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== undefined && answer !== '';
  };

  const handleNext = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionJump = (index: number): void => {
    setCurrentQuestion(index);
  };

  const handleSubmit = (): void => {
    const answeredCount = Object.keys(answers).filter((key) => {
      const answer = answers[parseInt(key)];
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== undefined && answer !== '';
    }).length;

    toast({
      title: 'Exam Submitted',
      description: `You answered ${answeredCount} out of ${examDetails.totalQuestions} questions.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  // Enhanced render function based on question type
  const renderQuestion = (question: Question) => {
    const currentAnswer = answers[question.id];

    switch (question.type) {
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

  // Get question type badge color
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

  const currentQ = questions[currentQuestion];
  const typeBadge = getQuestionTypeBadge(currentQ.type);

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
                    src={studentInfo.avatar}
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
                      Subject
                    </Text>
                    <Text fontWeight='medium'>{examDetails.subject}</Text>
                  </Box>
                  <Box>
                    <Text fontSize='sm' color='gray.500'>
                      Total Questions
                    </Text>
                    <Text fontWeight='medium'>
                      {examDetails.totalQuestions}
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
                      {examDetails.totalQuestions}
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
                      ((currentQuestion + 1) / examDetails.totalQuestions) * 100
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
              <VStack spacing={4} align='stretch'>
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

                <Grid templateColumns='repeat(5, 1fr)' gap={2}>
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
                      borderRadius='full'
                      _hover={{
                        bg:
                          currentQuestion === index
                            ? 'blue.600'
                            : isQuestionAnswered(q.id)
                            ? 'green.500'
                            : 'gray.100',
                      }}
                      h='50px'
                      fontSize='md'
                      fontWeight='semibold'
                    >
                      {q.id}
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
                      {
                        Object.keys(answers).filter((key) => {
                          const answer = answers[parseInt(key)];
                          if (Array.isArray(answer)) return answer.length > 0;
                          return answer !== undefined && answer !== '';
                        }).length
                      }
                    </Badge>
                  </HStack>
                  <HStack justify='space-between'>
                    <Text fontSize='sm' color='gray.600'>
                      Remaining:
                    </Text>
                    <Badge colorScheme='orange' fontSize='md'>
                      {examDetails.totalQuestions -
                        Object.keys(answers).filter((key) => {
                          const answer = answers[parseInt(key)];
                          if (Array.isArray(answer)) return answer.length > 0;
                          return answer !== undefined && answer !== '';
                        }).length}
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
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default ExamPage;
