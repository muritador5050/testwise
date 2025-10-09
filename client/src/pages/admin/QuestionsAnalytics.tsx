import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Card,
  CardBody,
  Flex,
  Icon,
  Tooltip,
  VStack,
  HStack,
  Button,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { CheckCircleIcon, ViewIcon } from '@chakra-ui/icons';
import { useGetQuestionAnalytics } from '../../api/services/attemptService';
import { useGetAllTests } from '../../api/services/testServices';

const QuestionAnalytics: React.FC = () => {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const {
    data: testsData,
    isLoading: testsLoading,
    error: testsError,
  } = useGetAllTests();

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useGetQuestionAnalytics(selectedTestId as number);

  React.useEffect(() => {
    if (testsData?.tests && testsData.tests.length > 0 && !selectedTestId) {
      setSelectedTestId(testsData.tests[0].id);
    }
  }, [testsData, selectedTestId]);

  const loading = testsLoading || analyticsLoading;

  const sidebarBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getQuestionTypeBadge = (type: string) => {
    const colorSchemes: { [key: string]: string } = {
      MULTIPLE_CHOICE: 'blue',
      MULTIPLE_ANSWER: 'purple',
      TRUE_FALSE: 'green',
      SHORT_ANSWER: 'orange',
      ESSAY: 'red',
    };

    return (
      <Badge colorScheme={colorSchemes[type] || 'gray'} fontSize='xs'>
        {type.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const getAccuracyColor = (rate: number) => {
    if (rate >= 80) return 'green';
    if (rate >= 60) return 'yellow';
    if (rate >= 40) return 'orange';
    return 'red';
  };

  const calculateOverallStats = () => {
    if (!analytics || analytics.length === 0) return null;

    const totalAttempts = analytics.reduce(
      (sum, q) => sum + q.totalAttempts,
      0
    );
    const totalCorrect = analytics.reduce((sum, q) => sum + q.correctCount, 0);
    const overallAccuracy =
      totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
    const avgPointsEarned =
      analytics.reduce((sum, q) => sum + q.averagePointsEarned, 0) /
      analytics.length;
    const totalMaxPoints = analytics.reduce((sum, q) => sum + q.maxPoints, 0);

    return {
      totalAttempts,
      totalCorrect,
      overallAccuracy,
      avgPointsEarned,
      totalMaxPoints,
      totalQuestions: analytics.length,
    };
  };

  if (loading && !testsData) {
    return (
      <Container maxW='container.xl' py={8}>
        <Flex justify='center' align='center' minH='400px'>
          <Spinner size='xl' color='blue.500' thickness='4px' />
        </Flex>
      </Container>
    );
  }

  if (testsError) {
    return (
      <Container maxW='container.xl' py={8}>
        <Alert status='error' borderRadius='md'>
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            {testsError instanceof Error
              ? testsError.message
              : 'Failed to load tests'}
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  const overallStats = calculateOverallStats();
  const selectedTest = testsData?.tests?.find(
    (test) => test.id === selectedTestId
  );

  return (
    <Container maxW='container.xl' py={8} px={0}>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
        {/* Left Sidebar - Tests List */}
        <Box
          w={{ base: '100%', lg: '350px' }}
          bg={sidebarBg}
          borderRadius='lg'
          p={4}
          border='1px'
          borderColor={borderColor}
        >
          <Heading size='md' mb={4}>
            All Tests ({testsData?.tests?.length || 0})
          </Heading>

          <VStack spacing={2} align='stretch' divider={<Divider />}>
            {testsData?.tests?.map((test) => (
              <Box
                key={test.id}
                p={3}
                borderRadius='md'
                bg={selectedTestId === test.id ? selectedBg : 'transparent'}
                border='1px'
                borderColor={
                  selectedTestId === test.id ? 'blue.200' : 'transparent'
                }
                cursor='pointer'
                _hover={{
                  bg: selectedTestId === test.id ? selectedBg : 'gray.100',
                }}
                onClick={() => setSelectedTestId(test.id)}
              >
                <Flex justify='space-between' align='start'>
                  <Box flex={1}>
                    <Text fontWeight='medium' fontSize='sm' noOfLines={2}>
                      {test.title}
                    </Text>
                    <HStack spacing={2} mt={1}>
                      <Badge colorScheme='blue' fontSize='xs'>
                        {test.duration}m
                      </Badge>
                      <Badge colorScheme='green' fontSize='xs'>
                        {test._count?.questions} Qs
                      </Badge>
                      <Badge colorScheme='purple' fontSize='xs'>
                        {test._count?.attempts} attempts
                      </Badge>
                    </HStack>
                  </Box>
                  <Button
                    size='sm'
                    variant='ghost'
                    ml={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTestId(test.id);
                    }}
                  >
                    <ViewIcon />
                  </Button>
                </Flex>
              </Box>
            ))}
          </VStack>

          {(!testsData?.tests || testsData.tests.length === 0) && (
            <Alert status='info' borderRadius='md' mt={4}>
              <AlertIcon />
              No tests available.
            </Alert>
          )}
        </Box>

        {/* Right Content - Analytics */}
        <Box flex={1}>
          {analyticsError && (
            <Alert status='error' borderRadius='md' mb={4}>
              <AlertIcon />
              <AlertTitle>Analytics Error!</AlertTitle>
              <AlertDescription>
                {analyticsError instanceof Error
                  ? analyticsError.message
                  : 'Failed to load analytics'}
              </AlertDescription>
            </Alert>
          )}

          {selectedTest ? (
            <>
              <Heading mb={6} size='lg'>
                Question Analytics - {selectedTest.title}
              </Heading>

              {overallStats && (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 4 }}
                  spacing={4}
                  mb={8}
                >
                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>Total Questions</StatLabel>
                        <StatNumber>{overallStats.totalQuestions}</StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>Total Attempts</StatLabel>
                        <StatNumber>{overallStats.totalAttempts}</StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>Overall Accuracy</StatLabel>
                        <StatNumber
                          color={`${getAccuracyColor(
                            overallStats.overallAccuracy
                          )}.500`}
                        >
                          {overallStats.overallAccuracy.toFixed(1)}%
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>Avg Points / Total</StatLabel>
                        <StatNumber>
                          {overallStats.avgPointsEarned.toFixed(1)} /{' '}
                          {overallStats.totalMaxPoints}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              )}

              <Box
                overflowX='auto'
                bg='white'
                borderRadius='lg'
                shadow='sm'
                border='1px'
                borderColor='gray.200'
              >
                <Table variant='simple'>
                  <Thead bg='gray.50'>
                    <Tr>
                      <Th>Question</Th>
                      <Th>Type</Th>
                      <Th isNumeric>Attempts</Th>
                      <Th isNumeric>Correct</Th>
                      <Th>Accuracy</Th>
                      <Th isNumeric>Avg Points</Th>
                      <Th isNumeric>Max Points</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {analytics?.map((question) => (
                      <Tr key={question.questionId} _hover={{ bg: 'gray.50' }}>
                        <Td maxW='300px'>
                          <Tooltip label={question.text} placement='top'>
                            <Text noOfLines={2} fontSize='sm'>
                              {question.text}
                            </Text>
                          </Tooltip>
                        </Td>
                        <Td>{getQuestionTypeBadge(question.questionType)}</Td>
                        <Td isNumeric fontWeight='medium'>
                          {question.totalAttempts}
                        </Td>
                        <Td isNumeric>
                          <Flex align='center' justify='flex-end' gap={2}>
                            {question.correctCount > 0 && (
                              <Icon
                                as={CheckCircleIcon}
                                color='green.500'
                                boxSize={4}
                              />
                            )}
                            <Text>{question.correctCount}</Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Box>
                            <Flex align='center' justify='space-between' mb={1}>
                              <Text
                                fontSize='sm'
                                fontWeight='medium'
                                color={`${getAccuracyColor(
                                  question.accuracyRate
                                )}.600`}
                              >
                                {question.accuracyRate.toFixed(1)}%
                              </Text>
                            </Flex>
                            <Progress
                              value={question.accuracyRate}
                              colorScheme={getAccuracyColor(
                                question.accuracyRate
                              )}
                              size='sm'
                              borderRadius='full'
                            />
                          </Box>
                        </Td>
                        <Td isNumeric>
                          <Text fontWeight='medium'>
                            {question.averagePointsEarned.toFixed(2)}
                          </Text>
                        </Td>
                        <Td isNumeric>
                          <Badge colorScheme='gray'>{question.maxPoints}</Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              {(!analytics || analytics.length === 0) && !analyticsLoading && (
                <Alert status='info' mt={4} borderRadius='md'>
                  <AlertIcon />
                  No analytics data available for this test.
                </Alert>
              )}
            </>
          ) : (
            !testsLoading && (
              <Flex justify='center' align='center' minH='200px'>
                <Text color='gray.500'>Select a test to view analytics</Text>
              </Flex>
            )
          )}

          {analyticsLoading && (
            <Flex justify='center' align='center' minH='200px'>
              <Spinner size='xl' color='blue.500' thickness='4px' />
            </Flex>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default QuestionAnalytics;
