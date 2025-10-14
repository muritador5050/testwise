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
} from '@chakra-ui/react';
import { CheckCircleIcon, ViewIcon } from '@chakra-ui/icons';
import { useGetQuestionAnalytics } from '../../api/services/attemptService';
import { useGetAllTests } from '../../api/services/testServices';
import { colors, bgStyles, textStyles } from '../../utils/colors';

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

  const sidebarBg = colors.sectionBg;
  const selectedBg = colors.primaryLight;
  const borderColor = colors.border;

  const getQuestionTypeBadge = (type: string) => {
    return (
      <Badge
        bg={colors.primary}
        color='white'
        fontSize='xs'
        border='1px'
        borderColor={colors.border}
      >
        {type.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const getAccuracyColor = (rate: number) => {
    if (rate >= 80) return colors.success;
    if (rate >= 60) return colors.warning;
    if (rate >= 40) return colors.info;
    return colors.error;
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
      <Container maxW='container.xl' py={8} {...bgStyles.page}>
        <Flex justify='center' align='center' minH='400px'>
          <Spinner size='xl' color={colors.primary} thickness='4px' />
        </Flex>
      </Container>
    );
  }

  if (testsError) {
    return (
      <Container maxW='container.xl' py={8} {...bgStyles.page}>
        <Alert status='error' borderRadius='md' bg={colors.error} color='white'>
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
    <Container maxW='container.xl' py={8} px={0} {...bgStyles.page}>
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
          <Heading size='md' mb={4} {...textStyles.heading}>
            All Tests ({testsData?.tests?.length || 0})
          </Heading>

          <VStack
            spacing={2}
            align='stretch'
            divider={<Divider borderColor={borderColor} />}
          >
            {testsData?.tests?.map((test) => (
              <Box
                key={test.id}
                p={3}
                borderRadius='md'
                bg={selectedTestId === test.id ? selectedBg : colors.cardBg}
                border='1px'
                borderColor={
                  selectedTestId === test.id ? colors.primary : borderColor
                }
                cursor='pointer'
                _hover={{
                  bg: selectedTestId === test.id ? selectedBg : colors.pageBg,
                }}
                onClick={() => setSelectedTestId(test.id)}
              >
                <Flex justify='space-between' align='start'>
                  <Box flex={1}>
                    <Text
                      fontWeight='medium'
                      fontSize='sm'
                      noOfLines={2}
                      color={colors.textPrimary}
                    >
                      {test.title}
                    </Text>
                    <HStack spacing={2} mt={1}>
                      <Badge bg={colors.primary} color='white' fontSize='xs'>
                        {test.duration}m
                      </Badge>
                      <Badge bg={colors.success} color='white' fontSize='xs'>
                        {test._count?.questions} Qs
                      </Badge>
                      <Badge bg={colors.info} color='white' fontSize='xs'>
                        {test._count?.attempts} attempts
                      </Badge>
                    </HStack>
                  </Box>
                  <Button
                    size='sm'
                    variant='ghost'
                    ml={2}
                    bg={colors.primary}
                    color='white'
                    _hover={{ bg: colors.primaryHover }}
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
            <Alert
              status='info'
              borderRadius='md'
              mt={4}
              bg={colors.sectionBg}
              color={colors.textPrimary}
              border='1px'
              borderColor={borderColor}
            >
              <AlertIcon color={colors.info} />
              No tests available.
            </Alert>
          )}
        </Box>

        {/* Right Content - Analytics */}
        <Box flex={1}>
          {analyticsError && (
            <Alert
              status='error'
              borderRadius='md'
              mb={4}
              bg={colors.error}
              color='white'
            >
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
              <Heading mb={6} size='lg' {...textStyles.heading}>
                Question Analytics - {selectedTest.title}
              </Heading>

              {overallStats && (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 4 }}
                  spacing={4}
                  mb={8}
                >
                  <Card {...bgStyles.card}>
                    <CardBody>
                      <Stat>
                        <StatLabel {...textStyles.body}>
                          Total Questions
                        </StatLabel>
                        <StatNumber color={colors.textPrimary}>
                          {overallStats.totalQuestions}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card {...bgStyles.card}>
                    <CardBody>
                      <Stat>
                        <StatLabel {...textStyles.body}>
                          Total Attempts
                        </StatLabel>
                        <StatNumber color={colors.textPrimary}>
                          {overallStats.totalAttempts}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card {...bgStyles.card}>
                    <CardBody>
                      <Stat>
                        <StatLabel {...textStyles.body}>
                          Overall Accuracy
                        </StatLabel>
                        <StatNumber
                          color={getAccuracyColor(overallStats.overallAccuracy)}
                        >
                          {overallStats.overallAccuracy.toFixed(1)}%
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card {...bgStyles.card}>
                    <CardBody>
                      <Stat>
                        <StatLabel {...textStyles.body}>
                          Avg Points / Total
                        </StatLabel>
                        <StatNumber color={colors.textPrimary}>
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
                borderRadius='lg'
                shadow='sm'
                border='1px'
                {...bgStyles.card}
              >
                <Table variant='simple'>
                  <Thead bg={colors.sectionBg}>
                    <Tr>
                      <Th {...textStyles.heading}>Question</Th>
                      <Th {...textStyles.heading}>Type</Th>
                      <Th isNumeric {...textStyles.heading}>
                        Attempts
                      </Th>
                      <Th isNumeric {...textStyles.heading}>
                        Correct
                      </Th>
                      <Th {...textStyles.heading}>Accuracy</Th>
                      <Th isNumeric {...textStyles.heading}>
                        Avg Points
                      </Th>
                      <Th isNumeric {...textStyles.heading}>
                        Max Points
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {analytics?.map((question) => (
                      <Tr
                        key={question.questionId}
                        _hover={{ bg: colors.sectionBg }}
                      >
                        <Td maxW='300px'>
                          <Tooltip label={question.text} placement='top'>
                            <Text
                              noOfLines={2}
                              fontSize='sm'
                              {...textStyles.body}
                            >
                              {question.text}
                            </Text>
                          </Tooltip>
                        </Td>
                        <Td>{getQuestionTypeBadge(question.questionType)}</Td>
                        <Td isNumeric fontWeight='medium' {...textStyles.body}>
                          {question.totalAttempts}
                        </Td>
                        <Td isNumeric>
                          <Flex align='center' justify='flex-end' gap={2}>
                            {question.correctCount > 0 && (
                              <Icon
                                as={CheckCircleIcon}
                                color={colors.success}
                                boxSize={4}
                              />
                            )}
                            <Text {...textStyles.body}>
                              {question.correctCount}
                            </Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Box>
                            <Flex align='center' justify='space-between' mb={1}>
                              <Text
                                fontSize='sm'
                                fontWeight='medium'
                                color={getAccuracyColor(question.accuracyRate)}
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
                          <Text fontWeight='medium' {...textStyles.body}>
                            {question.averagePointsEarned.toFixed(2)}
                          </Text>
                        </Td>
                        <Td isNumeric>
                          <Badge bg={colors.textMuted} color='white'>
                            {question.maxPoints}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              {(!analytics || analytics.length === 0) && !analyticsLoading && (
                <Alert
                  status='info'
                  mt={4}
                  borderRadius='md'
                  bg={colors.sectionBg}
                  color={colors.textPrimary}
                  border='1px'
                  borderColor={borderColor}
                >
                  <AlertIcon color={colors.info} />
                  No analytics data available for this test.
                </Alert>
              )}
            </>
          ) : (
            !testsLoading && (
              <Flex justify='center' align='center' minH='200px'>
                <Text {...textStyles.muted}>
                  Select a test to view analytics
                </Text>
              </Flex>
            )
          )}

          {analyticsLoading && (
            <Flex justify='center' align='center' minH='200px'>
              <Spinner size='xl' color={colors.primary} thickness='4px' />
            </Flex>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default QuestionAnalytics;
