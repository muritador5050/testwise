import React from 'react';
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
  useColorModeValue,
} from '@chakra-ui/react';

// Types
interface ScoreDistribution {
  range: string;
  count: number;
}

interface ScoreDistributionChartProps {
  data: ScoreDistribution[];
  testId: string;
  totalStudents?: number;
}

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

const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({
  data,
  testId,
  totalStudents,
}) => {
  // Calculate total from data if not provided
  const calculatedTotal =
    totalStudents || data.reduce((sum, item) => sum + item.count, 0);

  // Find the range with highest count
  const highestCount = Math.max(...data.map((item) => item.count));

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={6}
      bg={bgColor}
      borderWidth='1px'
      borderColor={borderColor}
      borderRadius='lg'
      boxShadow='sm'
    >
      <VStack spacing={6} align='stretch'>
        {/* Header */}
        <Box>
          <Text fontSize='xl' fontWeight='bold' mb={2}>
            Score Distribution
          </Text>
          <Text color='gray.600' fontSize='sm'>
            Test ID: {testId}
          </Text>
          {calculatedTotal > 0 && (
            <Text color='gray.600' fontSize='sm'>
              Total Students: {calculatedTotal}
            </Text>
          )}
        </Box>

        {/* Distribution Bars */}
        <VStack spacing={4} align='stretch'>
          {data.map((item, index) => {
            const percentage = calculatePercentage(item.count, calculatedTotal);
            const color = getRangeColor(item.range);
            const isHighest = item.count === highestCount && item.count > 0;

            return (
              <Box key={index}>
                <HStack justify='space-between' mb={2}>
                  <Text fontSize='sm' fontWeight='medium'>
                    {item.range}
                  </Text>
                  <HStack spacing={2}>
                    <Text fontSize='sm' fontWeight='bold'>
                      {item.count}
                    </Text>
                    {calculatedTotal > 0 && (
                      <Text fontSize='sm' color='gray.500'>
                        ({percentage.toFixed(1)}%)
                      </Text>
                    )}
                  </HStack>
                </HStack>

                <Tooltip
                  label={`${item.count} students (${percentage.toFixed(1)}%)`}
                  hasArrow
                >
                  <Progress
                    value={calculatedTotal > 0 ? percentage : 0}
                    colorScheme={color.split('.')[0]}
                    size='lg'
                    borderRadius='md'
                    height='20px'
                    bg={'gray.100'}
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
        {calculatedTotal > 0 && (
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} mt={4}>
            <Stat>
              <StatLabel>Total Students</StatLabel>
              <StatNumber>{calculatedTotal}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Highest Range</StatLabel>
              <StatNumber fontSize='lg'>
                {data.find((item) => item.count === highestCount)?.range ||
                  'N/A'}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Most Frequent</StatLabel>
              <StatNumber>{highestCount}</StatNumber>
            </Stat>
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default ScoreDistributionChart;
