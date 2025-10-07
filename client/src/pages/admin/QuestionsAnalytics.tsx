import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

interface QuestionAnalytic {
  questionId: number;
  text: string;
  questionType: string;
  totalAttempts: number;
  correctCount: number;
  accuracyRate: number;
  averagePointsEarned: number;
  maxPoints: number;
}

interface QuestionAnalyticsProps {
  testId: string;
}

const QuestionAnalytics: React.FC<QuestionAnalyticsProps> = ({ testId }) => {
  const [analytics, setAnalytics] = useState<QuestionAnalytic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/attempts/test/${testId}/questions/analytics`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch question analytics');
        }

        const data = await response.json();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [testId]);

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
    if (analytics.length === 0) return null;

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

  if (loading) {
    return (
      <Container maxW='container.xl' py={8}>
        <Flex justify='center' align='center' minH='400px'>
          <Spinner size='xl' color='blue.500' thickness='4px' />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW='container.xl' py={8}>
        <Alert status='error' borderRadius='md'>
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Container>
    );
  }

  const overallStats = calculateOverallStats();

  return (
    <Container maxW='container.xl' py={8}>
      <Heading mb={6} size='lg'>
        Question Analytics - Test #{testId}
      </Heading>

      {overallStats && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
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
            {analytics.map((question) => (
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
                        color={`${getAccuracyColor(question.accuracyRate)}.600`}
                      >
                        {question.accuracyRate.toFixed(1)}%
                      </Text>
                    </Flex>
                    <Progress
                      value={question.accuracyRate}
                      colorScheme={getAccuracyColor(question.accuracyRate)}
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

      {analytics.length === 0 && (
        <Alert status='info' mt={4} borderRadius='md'>
          <AlertIcon />
          No analytics data available for this test.
        </Alert>
      )}
    </Container>
  );
};

export default QuestionAnalytics;
