import { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardFooter,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Badge,
  Divider,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { useGetAllTests } from '../../api/services/testServices';
import { useGetQuestionsByTest } from '../../api/services/questionServices';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
  order: number;
  questionId: number;
}

interface Question {
  id: number;
  text: string;
  questionType: string;
  points: number;
  order: number;
  testId: number;
  options: Option[];
}

export default function QuestionBank() {
  const { data: testsData, isLoading: testsLoading } = useGetAllTests();
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const {
    data: questionsData,
    isLoading: questionsLoading,
    refetch: fetchQuestions,
  } = useGetQuestionsByTest(selectedTestId as number);

  const toast = useToast();

  const handleFetchQuestions = async (testId: number) => {
    setSelectedTestId(testId);
    try {
      await fetchQuestions();
      toast({
        title: 'Questions loaded',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Error loading questions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'blue';
      case 'MULTIPLE_ANSWER':
        return 'green';
      case 'TRUE_FALSE':
        return 'orange';
      case 'SHORT_ANSWER':
        return 'purple';
      case 'ESSAY':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (testsLoading) {
    return (
      <Center h='200px'>
        <Spinner size='xl' />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align='stretch'>
        <Heading size='lg'>Question Bank</Heading>

        {/* Tests List */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {testsData?.tests.map((test) => (
            <Card key={test.id} variant='outline'>
              <CardBody>
                <VStack align='start' spacing={3}>
                  <Heading size='md'>{test.title}</Heading>
                  <Text color='gray.600'>{test.description}</Text>

                  <Box>
                    <Badge
                      colorScheme={test.isPublished ? 'green' : 'red'}
                      mr={2}
                    >
                      {test.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge colorScheme='blue'>
                      {test._count?.questions ?? 0} Questions
                    </Badge>
                  </Box>

                  <Text fontSize='sm' color='gray.500'>
                    Duration: {test.duration} mins • Max Attempts:{' '}
                    {test.maxAttempts}
                  </Text>
                </VStack>
              </CardBody>

              <CardFooter>
                <Button
                  colorScheme='teal'
                  width='full'
                  onClick={() => handleFetchQuestions(test.id)}
                  isLoading={questionsLoading && selectedTestId === test.id}
                >
                  View Questions
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>

        {/* Questions Display */}
        {selectedTestId && questionsData && (
          <Box mt={8}>
            <Divider my={6} />
            <Heading size='md' mb={4}>
              Questions for{' '}
              {testsData?.tests.find((t) => t.id === selectedTestId)?.title}
            </Heading>

            <VStack spacing={6} align='stretch'>
              {questionsData.map((question: Question, index: number) => (
                <Card key={question.id} variant='elevated'>
                  <CardBody>
                    <VStack align='start' spacing={4}>
                      {/* Question Header */}
                      <Box width='full'>
                        <Text fontWeight='bold' fontSize='lg'>
                          {index + 1}. {question.text}
                        </Text>
                        <Box mt={2}>
                          <Badge
                            colorScheme={getQuestionTypeColor(
                              question.questionType
                            )}
                            mr={2}
                          >
                            {question.questionType.replace('_', ' ')}
                          </Badge>
                          <Badge colorScheme='purple'>
                            {question.points} point
                            {question.points !== 1 ? 's' : ''}
                          </Badge>
                        </Box>
                      </Box>

                      {/* Options */}
                      {question.options.length > 0 && (
                        <List spacing={2} width='full'>
                          {question.options.map((option) => (
                            <ListItem
                              key={option.id}
                              display='flex'
                              alignItems='center'
                            >
                              <ListIcon
                                as={
                                  option.isCorrect
                                    ? CheckCircleIcon
                                    : WarningIcon
                                }
                                color={
                                  option.isCorrect ? 'green.500' : 'gray.300'
                                }
                              />
                              <Text>
                                {option.order}. {option.text}
                                {option.isCorrect && (
                                  <Badge ml={2} colorScheme='green' size='sm'>
                                    Correct
                                  </Badge>
                                )}
                              </Text>
                            </ListItem>
                          ))}
                        </List>
                      )}

                      {/* For questions without options */}
                      {question.options.length === 0 && (
                        <Text fontStyle='italic' color='gray.500'>
                          {question.questionType === 'SHORT_ANSWER'
                            ? 'Short answer question - student will type their response'
                            : 'Essay question - student will write detailed response'}
                        </Text>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
