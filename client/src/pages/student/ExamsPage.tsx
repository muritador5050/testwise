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
} from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface StudentInfo {
  name: string;
  avatar: string;
}

interface ExamDetails {
  title: string;
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
}

interface Answer {
  questionId: number;
  answer: string;
}

const ExamPage: React.FC = () => {
  const toast = useToast();

  // Sample data
  const studentInfo: StudentInfo = {
    name: 'John Doe',
    avatar: 'https://bit.ly/broken-link',
  };

  const examDetails: ExamDetails = {
    title: 'Mid-Term Examination',
    subject: 'Computer Science',
    duration: 60,
    totalQuestions: 20,
  };

  const questions: Question[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    question: `Question ${
      i + 1
    }: What is the correct answer for this sample question about programming concepts and best practices?`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
  }));

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    examDetails.duration * 60
  ); // in seconds

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

  const handleAnswerChange = (value: string): void => {
    const existingAnswerIndex = answers.findIndex(
      (ans) => ans.questionId === questions[currentQuestion].id
    );

    if (existingAnswerIndex !== -1) {
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = {
        questionId: questions[currentQuestion].id,
        answer: value,
      };
      setAnswers(newAnswers);
    } else {
      setAnswers([
        ...answers,
        { questionId: questions[currentQuestion].id, answer: value },
      ]);
    }
  };

  const getCurrentAnswer = (): string => {
    const answer = answers.find(
      (ans) => ans.questionId === questions[currentQuestion].id
    );
    return answer ? answer.answer : '';
  };

  const isQuestionAnswered = (questionId: number): boolean => {
    return answers.some((ans) => ans.questionId === questionId);
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
    toast({
      title: 'Exam Submitted',
      description: `You answered ${answers.length} out of ${examDetails.totalQuestions} questions.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

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
                {/* Student Info */}
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

                {/* Exam Details */}
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

                {/* Time Remaining */}
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
                <Flex justify='space-between' align='center'>
                  <Badge colorScheme='blue' fontSize='md' px={3} py={1}>
                    Question {currentQuestion + 1} of{' '}
                    {examDetails.totalQuestions}
                  </Badge>
                  <Progress
                    value={
                      ((currentQuestion + 1) / examDetails.totalQuestions) * 100
                    }
                    size='sm'
                    colorScheme='blue'
                    w='200px'
                    borderRadius='full'
                  />
                </Flex>

                <Box flex='1'>
                  <Text fontSize='xl' fontWeight='semibold' mb={6}>
                    {questions[currentQuestion].question}
                  </Text>

                  <RadioGroup
                    onChange={handleAnswerChange}
                    value={getCurrentAnswer()}
                  >
                    <Stack spacing={4}>
                      {questions[currentQuestion].options.map(
                        (option, index) => (
                          <Box
                            key={index}
                            p={4}
                            borderWidth='2px'
                            borderRadius='lg'
                            borderColor={
                              getCurrentAnswer() === option
                                ? 'blue.400'
                                : 'gray.200'
                            }
                            bg={
                              getCurrentAnswer() === option
                                ? 'blue.50'
                                : 'white'
                            }
                            cursor='pointer'
                            transition='all 0.2s'
                            _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
                          >
                            <Radio value={option} size='lg' colorScheme='blue'>
                              <Text ml={2} fontSize='md'>
                                {option}
                              </Text>
                            </Radio>
                          </Box>
                        )
                      )}
                    </Stack>
                  </RadioGroup>
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

                {/* Question Grid */}
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

                {/* Statistics */}
                <VStack spacing={2} align='stretch'>
                  <HStack justify='space-between'>
                    <Text fontSize='sm' color='gray.600'>
                      Answered:
                    </Text>
                    <Badge colorScheme='green' fontSize='md'>
                      {answers.length}
                    </Badge>
                  </HStack>
                  <HStack justify='space-between'>
                    <Text fontSize='sm' color='gray.600'>
                      Remaining:
                    </Text>
                    <Badge colorScheme='orange' fontSize='md'>
                      {examDetails.totalQuestions - answers.length}
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
