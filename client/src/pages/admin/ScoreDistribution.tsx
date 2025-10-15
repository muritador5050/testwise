import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Tooltip,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Button,
  Badge,
  Divider,
  Container,
  Heading,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { useGetAllTests } from '../../api/services/testServices';
import { useGetScoreDistribution } from '../../api/services/attemptService';
import { colors, bgStyles, textStyles } from '../../utils/colors';

// Color scheme for different score ranges
const getRangeColor = (range: string): string => {
  const colorMap: { [key: string]: string } = {
    '0-20%': 'red.400',
    '21-40%': 'orange.400',
    '41-60%': 'yellow.400',
    '61-80%': 'blue.400',
    '81-100%': 'green.400',
  };
  return colorMap[range] || 'gray.400';
};

// Helper to calculate percentage
const calculatePercentage = (count: number, total: number): number => {
  if (total === 0) return 0;
  return (count / total) * 100;
};

const ScoreDistributionChart: React.FC = () => {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const {
    data: testsData,
    isLoading: testsLoading,
    error: testsError,
  } = useGetAllTests();

  const {
    data: scoreDistributionData,
    isLoading: distributionLoading,
    error: distributionError,
  } = useGetScoreDistribution(selectedTestId as number);

  React.useEffect(() => {
    if (testsData?.tests && testsData.tests.length > 0 && !selectedTestId) {
      setSelectedTestId(testsData.tests[0].id);
    }
  }, [testsData, selectedTestId]);

  const data = scoreDistributionData || [];
  const calculatedTotal = data.reduce((sum, item) => sum + item.count, 0);
  const highestCount =
    data.length > 0 ? Math.max(...data.map((item) => item.count)) : 0;

  const selectedTest = testsData?.tests?.find(
    (test) => test.id === selectedTestId
  );

  if (testsLoading && !testsData) {
    return (
      <Container maxW='container.xl' py={8}>
        <Flex justify='center' align='center' minH='400px'>
          <Spinner size='xl' color={colors.primary} thickness='4px' />
        </Flex>
      </Container>
    );
  }

  if (testsError) {
    return (
      <Container maxW='container.xl' py={8}>
        <Alert status='error' borderRadius='md'>
          <AlertIcon />
          <Text>
            {testsError instanceof Error
              ? testsError.message
              : 'Failed to load tests'}
          </Text>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW='container.xl' py={6} px={0}>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
        {/* Left Sidebar - Tests List */}
        <Box
          w={{ base: '100%', lg: '350px' }}
          bg={colors.sectionBg}
          borderRadius='lg'
          p={4}
          border='1px'
          borderColor={colors.border}
        >
          <Heading size='md' mb={4} {...textStyles.heading}>
            All Tests ({testsData?.tests?.length || 0})
          </Heading>

          <VStack spacing={2} align='stretch' divider={<Divider />}>
            {testsData?.tests?.map((test) => (
              <Box
                key={test.id}
                p={3}
                borderRadius='md'
                bg={selectedTestId === test.id ? colors.cardBg : 'transparent'}
                border='1px'
                borderColor={
                  selectedTestId === test.id ? colors.primary : 'transparent'
                }
                cursor='pointer'
                _hover={{
                  bg:
                    selectedTestId === test.id
                      ? colors.cardBg
                      : 'rgba(255, 255, 255, 0.5)',
                }}
                onClick={() => setSelectedTestId(test.id)}
              >
                <Flex justify='space-between' align='start'>
                  <Box flex={1}>
                    <Text
                      fontWeight='medium'
                      fontSize='sm'
                      noOfLines={2}
                      {...textStyles.heading}
                    >
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

        {/* Right Content - Score Distribution */}
        <Box flex={1}>
          {distributionError && (
            <Alert status='error' borderRadius='md' mb={4}>
              <AlertIcon />
              <Text>
                {distributionError instanceof Error
                  ? distributionError.message
                  : 'Failed to load score distribution data'}
              </Text>
            </Alert>
          )}

          {selectedTest ? (
            <Box p={6} {...bgStyles.card} borderRadius='lg' boxShadow='sm'>
              <VStack spacing={6} align='stretch'>
                {/* Header */}
                <Box>
                  <Text
                    fontSize='xl'
                    fontWeight='bold'
                    mb={2}
                    {...textStyles.heading}
                  >
                    Score Distribution - {selectedTest.title}
                  </Text>
                  <Text {...textStyles.body} fontSize='sm'>
                    Test ID: {selectedTestId}
                  </Text>
                  {calculatedTotal > 0 && (
                    <Text {...textStyles.body} fontSize='sm'>
                      Total Students: {calculatedTotal}
                    </Text>
                  )}
                </Box>

                {distributionLoading ? (
                  <Flex justify='center' align='center' minH='200px'>
                    <Spinner size='xl' color={colors.primary} thickness='4px' />
                  </Flex>
                ) : (
                  <>
                    {/* Distribution Bars */}
                    <VStack spacing={4} align='stretch'>
                      {data.map((item, index) => {
                        const percentage = calculatePercentage(
                          item.count,
                          calculatedTotal
                        );
                        const color = getRangeColor(item.range);
                        const isHighest =
                          item.count === highestCount && item.count > 0;

                        return (
                          <Box key={index}>
                            <HStack justify='space-between' mb={2}>
                              <Text
                                fontSize='sm'
                                fontWeight='medium'
                                {...textStyles.heading}
                              >
                                {item.range}
                              </Text>
                              <HStack spacing={2}>
                                <Text
                                  fontSize='sm'
                                  fontWeight='bold'
                                  {...textStyles.heading}
                                >
                                  {item.count}
                                </Text>
                                {calculatedTotal > 0 && (
                                  <Text fontSize='sm' {...textStyles.muted}>
                                    ({percentage.toFixed(1)}%)
                                  </Text>
                                )}
                              </HStack>
                            </HStack>

                            <Tooltip
                              label={`${
                                item.count
                              } students (${percentage.toFixed(1)}%)`}
                              hasArrow
                            >
                              <Progress
                                value={calculatedTotal > 0 ? percentage : 0}
                                colorScheme={color.split('.')[0]}
                                size='lg'
                                borderRadius='md'
                                height='20px'
                                bg={colors.pageBg}
                                position='relative'
                                {...(isHighest && {
                                  border: '2px solid',
                                  borderColor: color,
                                })}
                              />
                            </Tooltip>
                          </Box>
                        );
                      })}
                    </VStack>

                    {/* Summary Statistics */}
                    {calculatedTotal > 0 && data.length > 0 && (
                      <SimpleGrid
                        columns={{ base: 2, md: 3 }}
                        spacing={4}
                        mt={4}
                      >
                        <Stat>
                          <StatLabel {...textStyles.body}>
                            Total Students
                          </StatLabel>
                          <StatNumber {...textStyles.heading}>
                            {calculatedTotal}
                          </StatNumber>
                        </Stat>
                        <Stat>
                          <StatLabel {...textStyles.body}>
                            Highest Range
                          </StatLabel>
                          <StatNumber fontSize='lg' {...textStyles.heading}>
                            {data.find((item) => item.count === highestCount)
                              ?.range || 'N/A'}
                          </StatNumber>
                        </Stat>
                        <Stat>
                          <StatLabel {...textStyles.body}>
                            Most Frequent
                          </StatLabel>
                          <StatNumber {...textStyles.heading}>
                            {highestCount}
                          </StatNumber>
                        </Stat>
                      </SimpleGrid>
                    )}

                    {data.length === 0 && calculatedTotal === 0 && (
                      <Alert status='info' borderRadius='md'>
                        <AlertIcon />
                        <Text>
                          No score distribution data available for this test.
                        </Text>
                      </Alert>
                    )}
                  </>
                )}
              </VStack>
            </Box>
          ) : (
            !testsLoading && (
              <Flex justify='center' align='center' minH='200px'>
                <Box
                  p={6}
                  {...bgStyles.card}
                  borderRadius='lg'
                  boxShadow='sm'
                  textAlign='center'
                >
                  <Text {...textStyles.muted}>
                    Select a test to view score distribution
                  </Text>
                </Box>
              </Flex>
            )
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default ScoreDistributionChart;
